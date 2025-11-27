<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class TestUsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Admins
        $admins = [
            [
                'name' => 'Admin Principal',
                'email' => 'admin@youmanage.com',
                'password' => Hash::make('admin123'),
                'role' => 'admin',
                'status' => 'active',
            ],
            [
                'name' => 'Aristote Bubala',
                'email' => 'aristotebubala4@gmail.com',
                'password' => Hash::make('admin123'),
                'role' => 'admin',
                'status' => 'active',
            ],
            [
                'name' => 'Super Admin',
                'email' => 'superadmin@youmanage.com',
                'password' => Hash::make('admin123'),
                'role' => 'admin',
                'status' => 'active',
            ],
        ];

        // Managers (Gérants)
        $managers = [
            [
                'name' => 'Jean Dupont',
                'email' => 'jean.dupont@acme.com',
                'password' => Hash::make('manager123'),
                'role' => 'manager',
                'status' => 'active',
            ],
            [
                'name' => 'Marie Martin',
                'email' => 'marie.martin@techstart.com',
                'password' => Hash::make('manager123'),
                'role' => 'manager',
                'status' => 'active',
            ],
            [
                'name' => 'Pierre Dubois',
                'email' => 'pierre.dubois@globalservices.com',
                'password' => Hash::make('manager123'),
                'role' => 'manager',
                'status' => 'active',
            ],
            [
                'name' => 'Sophie Bernard',
                'email' => 'sophie.bernard@startuphub.com',
                'password' => Hash::make('manager123'),
                'role' => 'manager',
                'status' => 'active',
            ],
        ];

        // Users (Utilisateurs normaux)
        $users = [
            [
                'name' => 'Alice Tremblay',
                'email' => 'alice.tremblay@example.com',
                'password' => Hash::make('user123'),
                'role' => 'user',
                'status' => 'active',
            ],
            [
                'name' => 'Bob Lavoie',
                'email' => 'bob.lavoie@example.com',
                'password' => Hash::make('user123'),
                'role' => 'user',
                'status' => 'active',
            ],
            [
                'name' => 'Claire Gagnon',
                'email' => 'claire.gagnon@example.com',
                'password' => Hash::make('user123'),
                'role' => 'user',
                'status' => 'active',
            ],
            [
                'name' => 'David Roy',
                'email' => 'david.roy@example.com',
                'password' => Hash::make('user123'),
                'role' => 'user',
                'status' => 'active',
            ],
            [
                'name' => 'Emma Leblanc',
                'email' => 'emma.leblanc@example.com',
                'password' => Hash::make('user123'),
                'role' => 'user',
                'status' => 'active',
            ],
            [
                'name' => 'François Côté',
                'email' => 'francois.cote@example.com',
                'password' => Hash::make('user123'),
                'role' => 'user',
                'status' => 'active',
            ],
            [
                'name' => 'Gabrielle Bouchard',
                'email' => 'gabrielle.bouchard@example.com',
                'password' => Hash::make('user123'),
                'role' => 'user',
                'status' => 'active',
            ],
            [
                'name' => 'Henri Pelletier',
                'email' => 'henri.pelletier@example.com',
                'password' => Hash::make('user123'),
                'role' => 'user',
                'status' => 'active',
            ],
        ];

        // Créer les admins
        foreach ($admins as $admin) {
            User::updateOrCreate(
                ['email' => $admin['email']],
                $admin
            );
            $this->command->info("Admin créé : {$admin['email']}");
        }

        // Créer les managers
        foreach ($managers as $manager) {
            User::updateOrCreate(
                ['email' => $manager['email']],
                $manager
            );
            $this->command->info("Manager créé : {$manager['email']}");
        }

        // Créer les utilisateurs
        foreach ($users as $user) {
            User::updateOrCreate(
                ['email' => $user['email']],
                $user
            );
            $this->command->info("Utilisateur créé : {$user['email']}");
        }

        $this->command->info("\n✅ Tous les utilisateurs de test ont été créés avec succès !");
        $this->command->info("\n📋 Comptes créés :");
        $this->command->info("   - Admins : " . count($admins));
        $this->command->info("   - Managers : " . count($managers));
        $this->command->info("   - Users : " . count($users));
        $this->command->info("\n🔑 Mots de passe par défaut :");
        $this->command->info("   - Admins : admin123");
        $this->command->info("   - Managers : manager123");
        $this->command->info("   - Users : user123");
    }
}

