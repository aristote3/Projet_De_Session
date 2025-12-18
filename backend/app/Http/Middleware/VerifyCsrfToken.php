<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;

class VerifyCsrfToken extends Middleware
{
    /**
     * The URIs that should be excluded from CSRF verification.
     * API routes use Sanctum tokens, so they don't need CSRF protection
     *
     * @var array<int, string>
     */
    protected $except = [
        'api/*', // API routes use Sanctum authentication, not CSRF
    ];
}

