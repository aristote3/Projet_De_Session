<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class CreateAdmin extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'admin:create 
                            {--name= : Nom de l\'admin}
                            {--email= : Email de l\'admin}
                            {--password= : Mot de passe}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Créer un nouvel administrateur';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('🔐 Création d\'un nouvel administrateur');
        $this->info('');

        // Récupérer les valeurs ou demander
        $name = $this->option('name') ?: $this->ask('Nom de l\'administrateur');
        $email = $this->option('email') ?: $this->ask('Email de l\'administrateur');
        $password = $this->option('password') ?: $this->secret('Mot de passe (min 6 caractères)');

        // Validation
        $validator = Validator::make([
            'name' => $name,
            'email' => $email,
            'password' => $password,
        ], [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            $this->error('❌ Erreurs de validation:');
            foreach ($validator->errors()->all() as $error) {
                $this->error('   - ' . $error);
            }
            return 1;
        }

        // Vérifier si l'utilisateur existe déjà
        if (User::where('email', $email)->exists()) {
            $this->error("❌ Un utilisateur avec l'email {$email} existe déjà!");
            if (!$this->confirm('Voulez-vous le mettre à jour en admin?', false)) {
                return 1;
            }
            
            $user = User::where('email', $email)->first();
            $user->update([
                'name' => $name,
                'password' => Hash::make($password),
                'role' => 'admin',
                'status' => 'active',
            ]);
            
            $this->info("✅ Utilisateur mis à jour en admin!");
        } else {
            // Créer l'admin
            $admin = User::create([
                'name' => $name,
                'email' => $email,
                'password' => Hash::make($password),
                'role' => 'admin',
                'status' => 'active',
            ]);

            $this->info("✅ Admin créé avec succès!");
        }

        $this->info('');
        $this->info('📋 Informations de l\'admin:');
        $this->info("   ID: " . User::where('email', $email)->first()->id);
        $this->info("   Nom: {$name}");
        $this->info("   Email: {$email}");
        $this->info("   Rôle: admin");
        $this->info("   Statut: active");
        $this->info('');

        return 0;
    }
}

