<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
->withMiddleware(function (Middleware $middleware): void {
        $middleware->alias([
            'admin' => \App\Http\Middleware\AdminMiddleware::class,
            'guest.custom' => \App\Http\Middleware\GuestMiddleware::class,
            'session.timeout' => \App\Http\Middleware\SessionTimeout::class,
        ]);

        // Redirect ketika auth middleware gagal (user belum login)
        $middleware->redirectGuestsTo(function (Request $request) {
            return '/login?auth_required=1';
        });
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
