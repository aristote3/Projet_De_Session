<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class ListAdmins extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'admin:list';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Lister tous les administrateurs';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $admins = User::where('role', 'admin')
            ->orderBy('created_at', 'desc')
            ->get(['id', 'name', 'email', 'status', 'created_at']);

        if ($admins->isEmpty()) {
            $this->warn('Aucun administrateur trouvé.');
            return 0;
        }

        $this->info('👥 Liste des administrateurs:');
        $this->info('');

        $headers = ['ID', 'Nom', 'Email', 'Statut', 'Créé le'];
        $rows = $admins->map(function ($admin) {
            return [
                $admin->id,
                $admin->name,
                $admin->email,
                $admin->status,
                $admin->created_at->format('Y-m-d H:i'),
            ];
        })->toArray();

        $this->table($headers, $rows);
        $this->info('');
        $this->info("Total: {$admins->count()} administrateur(s)");

        return 0;
    }
}

