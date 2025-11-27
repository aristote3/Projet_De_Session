<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Models\BroadcastRecipient;
use App\Models\User;
use App\Services\SmsService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;

class MessageController extends Controller
{
    protected $smsService;

    public function __construct(SmsService $smsService)
    {
        $this->smsService = $smsService;
    }

    /**
     * Get all messages for the current user
     */
    public function index(Request $request)
    {
        $user = $request->user();
        
        // Get direct messages
        $directMessages = Message::where('recipient_id', $user->id)
            ->where('type', 'direct')
            ->with('sender:id,name,email')
            ->orderBy('created_at', 'desc')
            ->get();

        // Get broadcast messages where user is a recipient
        $broadcastMessages = Message::where('type', 'broadcast')
            ->whereHas('broadcastRecipients', function ($q) use ($user) {
                $q->where('user_id', $user->id);
            })
            ->with(['sender:id,name,email', 'broadcastRecipients' => function ($q) use ($user) {
                $q->where('user_id', $user->id);
            }])
            ->orderBy('created_at', 'desc')
            ->get();

        // Merge and sort
        $messages = $directMessages->merge($broadcastMessages)
            ->sortByDesc('created_at')
            ->values();

        return response()->json([
            'data' => $messages,
            'unread_count' => $messages->where('is_read', false)->count()
        ]);
    }

    /**
     * Get sent messages (for managers)
     */
    public function sent(Request $request)
    {
        $user = $request->user();
        
        $messages = Message::where('sender_id', $user->id)
            ->with('recipient:id,name,email')
            ->withCount('broadcastRecipients')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json($messages);
    }

    /**
     * Send a direct message
     */
    public function send(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'recipient_id' => 'required|exists:users,id',
            'subject' => 'nullable|string|max:255',
            'content' => 'required|string|max:5000',
            'channel' => 'nullable|in:app,email,sms,all',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $sender = $request->user();
        $recipient = User::find($request->recipient_id);
        $channel = $request->channel ?? 'app';

        $message = Message::create([
            'sender_id' => $sender->id,
            'recipient_id' => $recipient->id,
            'subject' => $request->subject,
            'content' => $request->content,
            'type' => 'direct',
            'channel' => $channel,
        ]);

        // Send via additional channels
        $deliveryResults = ['app' => true];

        if (in_array($channel, ['email', 'all'])) {
            try {
                Mail::send('emails.manager-broadcast', [
                    'user' => $recipient,
                    'manager' => $sender,
                    'message' => $request->content,
                    'subject' => $request->subject,
                ], function ($mail) use ($recipient, $request) {
                    $mail->to($recipient->email)
                        ->subject($request->subject ?? 'Nouveau message');
                });
                $deliveryResults['email'] = true;
            } catch (\Exception $e) {
                $deliveryResults['email'] = false;
            }
        }

        if (in_array($channel, ['sms', 'all']) && $recipient->phone) {
            $smsContent = $request->subject 
                ? "{$request->subject}\n\n{$request->content}"
                : $request->content;
            $deliveryResults['sms'] = $this->smsService->send($recipient->phone, $smsContent);
        }

        $message->update(['metadata' => $deliveryResults]);

        return response()->json([
            'data' => $message->load('recipient:id,name,email'),
            'delivery' => $deliveryResults,
            'message' => 'Message envoyé avec succès'
        ], 201);
    }

    /**
     * Send a broadcast message to all users (for managers)
     */
    public function broadcast(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'subject' => 'nullable|string|max:255',
            'content' => 'required|string|max:5000',
            'channel' => 'nullable|in:app,email,sms,all',
            'user_ids' => 'nullable|array', // Optional: specific users
            'user_ids.*' => 'exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $sender = $request->user();
        $channel = $request->channel ?? 'app';

        // Get target users (all users if no specific IDs provided)
        if ($request->user_ids) {
            $users = User::whereIn('id', $request->user_ids)->get();
        } else {
            // For managers, get users in their organization
            // For admins, get all users
            if ($sender->role === 'admin') {
                $users = User::where('id', '!=', $sender->id)->get();
            } else {
                // Get users (for now, all active users - can be refined based on organization logic)
                $users = User::where('role', 'user')
                    ->where('status', 'active')
                    ->where('id', '!=', $sender->id)
                    ->get();
            }
        }

        if ($users->isEmpty()) {
            return response()->json([
                'message' => 'Aucun destinataire trouvé'
            ], 400);
        }

        // Create the broadcast message
        $message = Message::create([
            'sender_id' => $sender->id,
            'recipient_id' => null,
            'subject' => $request->subject,
            'content' => $request->content,
            'type' => 'broadcast',
            'channel' => $channel,
        ]);

        $deliveryResults = [
            'total' => $users->count(),
            'app' => 0,
            'email' => ['sent' => 0, 'failed' => 0],
            'sms' => ['sent' => 0, 'failed' => 0, 'no_phone' => 0],
        ];

        // Create broadcast recipients
        foreach ($users as $user) {
            BroadcastRecipient::create([
                'message_id' => $message->id,
                'user_id' => $user->id,
                'delivery_status' => 'sent',
            ]);
            $deliveryResults['app']++;

            // Send email if requested
            if (in_array($channel, ['email', 'all'])) {
                try {
                    Mail::send('emails.manager-broadcast', [
                        'user' => $user,
                        'manager' => $sender,
                        'message' => $request->content,
                        'subject' => $request->subject,
                    ], function ($mail) use ($user, $request, $sender) {
                        $mail->to($user->email)
                            ->subject($request->subject ?? "Message de {$sender->name}");
                    });
                    $deliveryResults['email']['sent']++;
                } catch (\Exception $e) {
                    $deliveryResults['email']['failed']++;
                }
            }

            // Send SMS if requested
            if (in_array($channel, ['sms', 'all'])) {
                if (!$user->phone) {
                    $deliveryResults['sms']['no_phone']++;
                } else {
                    $smsContent = "📢 {$sender->name}: " . substr($request->content, 0, 140);
                    $sent = $this->smsService->send($user->phone, $smsContent);
                    if ($sent) {
                        $deliveryResults['sms']['sent']++;
                    } else {
                        $deliveryResults['sms']['failed']++;
                    }
                }
            }
        }

        $message->update(['metadata' => $deliveryResults]);

        return response()->json([
            'data' => $message,
            'delivery' => $deliveryResults,
            'message' => "Message diffusé à {$users->count()} utilisateur(s)"
        ], 201);
    }

    /**
     * Mark message as read
     */
    public function markAsRead(Request $request, Message $message)
    {
        $user = $request->user();

        if ($message->type === 'direct' && $message->recipient_id === $user->id) {
            $message->markAsRead();
        } elseif ($message->type === 'broadcast') {
            $recipient = BroadcastRecipient::where('message_id', $message->id)
                ->where('user_id', $user->id)
                ->first();
            if ($recipient) {
                $recipient->markAsRead();
            }
        }

        return response()->json([
            'message' => 'Message marqué comme lu'
        ]);
    }

    /**
     * Get unread count
     */
    public function unreadCount(Request $request)
    {
        $user = $request->user();

        $directUnread = Message::where('recipient_id', $user->id)
            ->where('is_read', false)
            ->count();

        $broadcastUnread = BroadcastRecipient::where('user_id', $user->id)
            ->where('is_read', false)
            ->count();

        return response()->json([
            'count' => $directUnread + $broadcastUnread
        ]);
    }

    /**
     * Delete a message
     */
    public function destroy(Request $request, Message $message)
    {
        $user = $request->user();

        // Only sender can delete
        if ($message->sender_id !== $user->id) {
            return response()->json([
                'message' => 'Non autorisé'
            ], 403);
        }

        $message->delete();

        return response()->json([
            'message' => 'Message supprimé'
        ]);
    }
}

