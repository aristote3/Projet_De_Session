<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BillingPlan;
use App\Models\Subscription;
use App\Models\Invoice;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class BillingController extends Controller
{
    /**
     * Get all billing plans
     */
    public function getPlans(Request $request)
    {
        $plans = BillingPlan::orderBy('price')->get();

        return response()->json([
            'data' => $plans
        ]);
    }

    /**
     * Create a billing plan
     */
    public function createPlan(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'billing_cycle' => 'required|in:monthly,yearly',
            'features' => 'nullable|array',
            'status' => 'nullable|in:active,inactive',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $plan = BillingPlan::create($validator->validated());

        return response()->json([
            'data' => $plan,
            'message' => 'Plan created successfully'
        ], 201);
    }

    /**
     * Update a billing plan
     */
    public function updatePlan(Request $request, BillingPlan $plan)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'price' => 'sometimes|required|numeric|min:0',
            'billing_cycle' => 'sometimes|required|in:monthly,yearly',
            'features' => 'nullable|array',
            'status' => 'nullable|in:active,inactive',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $plan->update($validator->validated());

        return response()->json([
            'data' => $plan,
            'message' => 'Plan updated successfully'
        ]);
    }

    /**
     * Delete a billing plan
     */
    public function deletePlan(BillingPlan $plan)
    {
        $plan->delete();

        return response()->json([
            'message' => 'Plan deleted successfully'
        ]);
    }

    /**
     * Get all subscriptions
     */
    public function getSubscriptions(Request $request)
    {
        $subscriptions = Subscription::with('user')
            ->get()
            ->map(function ($sub) {
                $user = $sub->user;
                return [
                    'id' => $sub->id,
                    'clientId' => $user->id,
                    'clientName' => $user->name . ' Organization',
                    'planId' => 1, // TODO: Link to billing_plans
                    'planName' => ucfirst($sub->plan_type),
                    'price' => $this->getPlanPrice($sub->plan_type),
                    'billingCycle' => 'monthly',
                    'status' => $sub->status,
                    'startDate' => $sub->start_date->format('Y-m-d'),
                    'nextBilling' => $sub->end_date->format('Y-m-d'),
                    'paymentMethod' => 'card',
                    'autoRenew' => $sub->auto_renew,
                ];
            });

        return response()->json([
            'data' => $subscriptions
        ]);
    }

    /**
     * Get all invoices
     */
    public function getInvoices(Request $request)
    {
        $invoices = Invoice::with(['user', 'subscription'])
            ->get()
            ->map(function ($invoice) {
                $user = $invoice->user;
                return [
                    'id' => $invoice->id,
                    'clientId' => $user->id,
                    'clientName' => $user->name . ' Organization',
                    'subscriptionId' => $invoice->subscription_id,
                    'amount' => (float)$invoice->amount,
                    'status' => $invoice->status,
                    'issueDate' => $invoice->issue_date->format('Y-m-d'),
                    'dueDate' => $invoice->due_date->format('Y-m-d'),
                    'paidDate' => $invoice->paid_date ? $invoice->paid_date->format('Y-m-d') : null,
                ];
            });

        return response()->json([
            'data' => $invoices
        ]);
    }

    /**
     * Create an invoice
     */
    public function createInvoice(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'subscription_id' => 'nullable|exists:subscriptions,id',
            'amount' => 'required|numeric|min:0',
            'issue_date' => 'required|date',
            'due_date' => 'required|date|after_or_equal:issue_date',
            'items' => 'nullable|array',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $invoice = Invoice::create($validator->validated());

        return response()->json([
            'data' => $invoice->load(['user', 'subscription']),
            'message' => 'Invoice created successfully'
        ], 201);
    }

    /**
     * Refund an invoice
     */
    public function refundInvoice(Request $request, Invoice $invoice)
    {
        if ($invoice->status !== 'paid') {
            return response()->json([
                'message' => 'Only paid invoices can be refunded'
            ], 400);
        }

        $invoice->update([
            'status' => 'cancelled',
            'notes' => ($invoice->notes ?? '') . "\nRefunded on " . now()->format('Y-m-d H:i:s'),
        ]);

        return response()->json([
            'data' => $invoice,
            'message' => 'Invoice refunded successfully'
        ]);
    }

    /**
     * Apply discount to subscription
     */
    public function applyDiscount(Request $request, Subscription $subscription)
    {
        $validator = Validator::make($request->all(), [
            'discount_type' => 'required|in:percentage,fixed',
            'discount_value' => 'required|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        // TODO: Store discount in subscription or create a discounts table
        return response()->json([
            'message' => 'Discount applied successfully (not persisted yet)'
        ]);
    }

    /**
     * Helper to get plan price
     */
    private function getPlanPrice($planType)
    {
        $prices = [
            'basic' => 99,
            'premium' => 299,
            'enterprise' => 999,
        ];
        return $prices[$planType] ?? 0;
    }
}

