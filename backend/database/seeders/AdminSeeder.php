<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Admin principal par défaut
        $admin = User::firstOrCreate(
            ['email' => 'admin@youmanage.com'],
            [
                'name' => 'Administrateur Principal',
                'password' => Hash::make('admin123'),
                'role' => 'admin',
                'status' => 'active',
            ]
        );

        if ($admin->wasRecentlyCreated) {
            $this->command->info("✅ Admin principal créé: admin@youmanage.com / admin123");
        } else {
            $this->command->info("ℹ️  Admin principal existe déjà: admin@youmanage.com");
        }

        // Admins supplémentaires
        $admins = [
            [
                'name' => 'Admin Test',
                'email' => 'admin@example.com',
                'password' => Hash::make('password123'),
                'role' => 'admin',
                'status' => 'active',
            ],
            [
                'name' => 'Super Admin',
                'email' => 'superadmin@example.com',
                'password' => Hash::make('password123'),
                'role' => 'admin',
                'status' => 'active',
            ],
        ];

        foreach ($admins as $adminData) {
            $admin = User::firstOrCreate(
                ['email' => $adminData['email']],
                $adminData
            );

            if ($admin->wasRecentlyCreated) {
                $this->command->info("✅ Admin créé: {$adminData['email']} / password123");
            } else {
                $this->command->info("ℹ️  Admin existe déjà: {$adminData['email']}");
            }
        }

        $this->command->info('');
        $this->command->info('🎉 Admins créés avec succès!');
        $this->command->info('');
        $this->command->info('Identifiants par défaut:');
        $this->command->info('  - admin@youmanage.com / admin123');
        $this->command->info('  - admin@example.com / password123');
        $this->command->info('  - superadmin@example.com / password123');
    }
}

