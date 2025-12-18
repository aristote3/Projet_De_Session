<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SupportTicket;
use App\Models\Faq;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SupportController extends Controller
{
    /**
     * Get all support tickets (admin only)
     */
    public function getTickets(Request $request)
    {
        $query = SupportTicket::with(['user', 'assignedUser']);

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by priority
        if ($request->has('priority')) {
            $query->where('priority', $request->priority);
        }

        // Filter by category
        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        $perPage = $request->get('per_page', 50);
        $tickets = $query->orderBy('created_at', 'desc')->paginate($perPage);

        return response()->json([
            'data' => $tickets->items(),
            'meta' => [
                'current_page' => $tickets->currentPage(),
                'per_page' => $tickets->perPage(),
                'total' => $tickets->total(),
                'last_page' => $tickets->lastPage(),
            ]
        ]);
    }

    /**
     * Create a support ticket
     */
    public function createTicket(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
            'category' => 'nullable|in:technical,billing,feature_request,other',
            'priority' => 'nullable|in:low,medium,high,urgent',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $ticket = SupportTicket::create([
            'user_id' => $request->user()->id,
            'subject' => $request->subject,
            'message' => $request->message,
            'category' => $request->category ?? 'other',
            'priority' => $request->priority ?? 'medium',
            'status' => 'open',
        ]);

        return response()->json([
            'data' => $ticket->load(['user']),
            'message' => 'Support ticket created successfully'
        ], 201);
    }

    /**
     * Update ticket status
     */
    public function updateTicketStatus(Request $request, SupportTicket $ticket)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:open,in_progress,resolved,closed',
            'resolution_notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $validator->validated();
        if ($data['status'] === 'resolved' || $data['status'] === 'closed') {
            $data['resolved_at'] = now();
        }

        $ticket->update($data);

        return response()->json([
            'data' => $ticket->load(['user', 'assignedUser']),
            'message' => 'Ticket status updated successfully'
        ]);
    }

    /**
     * Assign ticket
     */
    public function assignTicket(Request $request, SupportTicket $ticket)
    {
        $validator = Validator::make($request->all(), [
            'assigned_to' => 'required|exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $ticket->update([
            'assigned_to' => $request->assigned_to,
            'status' => 'in_progress',
        ]);

        return response()->json([
            'data' => $ticket->load(['user', 'assignedUser']),
            'message' => 'Ticket assigned successfully'
        ]);
    }

    /**
     * Bulk action on tickets
     */
    public function bulkAction(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'ticket_ids' => 'required|array',
            'ticket_ids.*' => 'exists:support_tickets,id',
            'action' => 'required|in:assign,close,delete',
            'assigned_to' => 'required_if:action,assign|exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $ticketIds = $request->ticket_ids;
        $action = $request->action;

        switch ($action) {
            case 'assign':
                SupportTicket::whereIn('id', $ticketIds)->update([
                    'assigned_to' => $request->assigned_to,
                    'status' => 'in_progress',
                ]);
                break;
            case 'close':
                SupportTicket::whereIn('id', $ticketIds)->update([
                    'status' => 'closed',
                    'resolved_at' => now(),
                ]);
                break;
            case 'delete':
                SupportTicket::whereIn('id', $ticketIds)->delete();
                break;
        }

        return response()->json([
            'message' => 'Bulk action completed successfully'
        ]);
    }

    /**
     * Get all FAQs
     */
    public function getFaqs(Request $request)
    {
        $query = Faq::where('is_active', true);

        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        $faqs = $query->orderBy('order')->orderBy('created_at')->get();

        return response()->json([
            'data' => $faqs
        ]);
    }

    /**
     * Create FAQ
     */
    public function createFaq(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'question' => 'required|string|max:255',
            'answer' => 'required|string',
            'category' => 'nullable|string|max:255',
            'order' => 'nullable|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $faq = Faq::create($validator->validated());

        return response()->json([
            'data' => $faq,
            'message' => 'FAQ created successfully'
        ], 201);
    }

    /**
     * Update FAQ
     */
    public function updateFaq(Request $request, Faq $faq)
    {
        $validator = Validator::make($request->all(), [
            'question' => 'sometimes|required|string|max:255',
            'answer' => 'sometimes|required|string',
            'category' => 'nullable|string|max:255',
            'order' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $faq->update($validator->validated());

        return response()->json([
            'data' => $faq,
            'message' => 'FAQ updated successfully'
        ]);
    }

    /**
     * Delete FAQ
     */
    public function deleteFaq(Faq $faq)
    {
        $faq->delete();

        return response()->json([
            'message' => 'FAQ deleted successfully'
        ]);
    }
}

