// Utilitaire pour configurer un utilisateur admin pour le développement
// À utiliser uniquement en développement !

export const setupAdminUser = () => {
  const adminUser = {
    id: 1,
    name: 'Admin User',
    email: 'admin@youmanage.com',
    role: 'admin',
    token: 'dev-token-admin',
  }

  localStorage.setItem('auth', JSON.stringify({
    user: adminUser,
    isAuthenticated: true,
    token: adminUser.token,
  }))

  return adminUser
}

// Pour tester rapidement, exécute dans la console du navigateur :
// setupAdminUser()

