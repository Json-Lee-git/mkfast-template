export const Routes = {
  Root: '/',

  // Marketing routes
  Pricing: '/pricing',
  Blog: '/blog',
  Contact: '/contact',
  Ai: '/ai',

  // Auth routes
  Auth: '/auth',
  Login: '/auth/login',
  Register: '/auth/register',
  AuthError: '/auth/error',
  ForgotPassword: '/auth/forgot-password',
  ResetPassword: '/auth/reset-password',

  // Legal routes
  TermsOfService: '/terms',
  PrivacyPolicy: '/privacy',
  CookiePolicy: '/cookie',

  // Dashboard routes
  Dashboard: '/dashboard',

  // Settings routes
  Settings: '/settings',
  SettingsProfile: '/settings/profile',
  SettingsSecurity: '/settings/security',
  SettingsBilling: '/settings/billing',
  Payment: '/settings/payment',

  // Admin routes
  Admin: '/admin',
  AdminUsers: '/admin/users',
  AdminManualAuditOrders: '/admin/manual-audit-orders',
} as const;

/** Default login redirect route */
export const DEFAULT_LOGIN_REDIRECT = Routes.Dashboard;
