import { SidebarLayoutPage } from '@/components/layout/sidebar-layout';
import { authRouteMiddleware } from '@/middlewares/auth-middleware';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard')({
  ssr: false,
  head: () => ({
    meta: [{ name: 'robots', content: 'noindex, nofollow' }],
  }),
  component: SidebarLayoutPage,
  server: {
    middleware: [authRouteMiddleware],
  },
});
