<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Organization;
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

        // Managers (Gérants) avec leurs organisations
        $managers = [
            [
                'name' => 'Jean Dupont',
                'email' => 'jean.dupont@acme.com',
                'password' => Hash::make('manager123'),
                'role' => 'manager',
                'status' => 'active',
                'organization' => [
                    'company_name' => 'ACME Corporation',
                    'phone' => '+1-555-0101',
                    'industry' => 'Technology',
                    'company_size' => 'Medium',
                    'description' => 'Leading technology solutions provider',
                ],
            ],
            [
                'name' => 'Marie Martin',
                'email' => 'marie.martin@techstart.com',
                'password' => Hash::make('manager123'),
                'role' => 'manager',
                'status' => 'active',
                'organization' => [
                    'company_name' => 'TechStart Solutions',
                    'phone' => '+1-555-0102',
                    'industry' => 'Consulting',
                    'company_size' => 'Small',
                    'description' => 'Innovative consulting services',
                ],
            ],
            [
                'name' => 'Pierre Dubois',
                'email' => 'pierre.dubois@globalservices.com',
                'password' => Hash::make('manager123'),
                'role' => 'manager',
                'status' => 'active',
                'organization' => [
                    'company_name' => 'Global Services Inc.',
                    'phone' => '+1-555-0103',
                    'industry' => 'Services',
                    'company_size' => 'Large',
                    'description' => 'Global business services provider',
                ],
            ],
            [
                'name' => 'Sophie Bernard',
                'email' => 'sophie.bernard@startuphub.com',
                'password' => Hash::make('manager123'),
                'role' => 'manager',
                'status' => 'active',
                'organization' => [
                    'company_name' => 'StartupHub Ventures',
                    'phone' => '+1-555-0104',
                    'industry' => 'Startup',
                    'company_size' => 'Startup',
                    'description' => 'Venture capital and startup accelerator',
                ],
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

        // Créer les managers avec leurs organisations
        foreach ($managers as $managerData) {
            // Extraire les données de l'organisation
            $organizationData = $managerData['organization'] ?? null;
            unset($managerData['organization']);
            
            // Créer ou mettre à jour le manager
            $manager = User::updateOrCreate(
                ['email' => $managerData['email']],
                $managerData
            );
            
            // Créer ou mettre à jour l'organisation pour ce manager
            if ($organizationData) {
                Organization::updateOrCreate(
                    ['user_id' => $manager->id],
                    array_merge($organizationData, ['user_id' => $manager->id])
                );
                $this->command->info("Manager créé avec organisation : {$managerData['email']} - {$organizationData['company_name']}");
            } else {
                $this->command->info("Manager créé : {$managerData['email']}");
            }
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

