import { SidebarLayoutPage } from '@/components/layout/sidebar-layout';
import { adminRouteMiddleware } from '@/middlewares/admin-middleware';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin')({
  ssr: false,
  head: () => ({
    meta: [{ name: 'robots', content: 'noindex, nofollow' }],
  }),
  component: SidebarLayoutPage,
  server: {
    middleware: [adminRouteMiddleware],
  },
});
