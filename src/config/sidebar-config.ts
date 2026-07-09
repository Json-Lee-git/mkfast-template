import { m } from '@/locale/paraglide/messages';
import {
  IconChartBar,
  IconClipboardList,
  IconLayoutDashboard,
  IconLock,
  IconSettings2,
  IconShieldCheck,
  IconUserCircle,
  IconUsers,
} from '@tabler/icons-react';
import { Routes } from '@/lib/routes';
import type { MenuItemConfig } from '../types';
/**
 * Sidebar links
 */
export function getSidebarLinks(): MenuItemConfig[] {
  return [
    {
      title: m.dashboard_sidebar_dashboard(),
      icon: IconLayoutDashboard,
      href: Routes.Dashboard,
      external: false,
    },
    {
      title: m.admin_title(),
      icon: IconShieldCheck,
      authorizeOnly: ['admin'],
      items: [
        {
          title: m.admin_users_title(),
          icon: IconUsers,
          href: Routes.AdminUsers,
          external: false,
        },
        {
          title: 'Manual audits',
          icon: IconClipboardList,
          href: Routes.AdminManualAuditOrders,
          external: false,
        },
        {
          title: 'Monitor requests',
          icon: IconChartBar,
          href: Routes.AdminMonitorRequests,
          external: false,
        },
      ],
    },
    {
      title: m.dashboard_sidebar_settings(),
      icon: IconSettings2,
      items: [
        {
          title: m.dashboard_sidebar_profile(),
          icon: IconUserCircle,
          href: Routes.SettingsProfile,
          external: false,
        },
        {
          title: m.dashboard_sidebar_security(),
          icon: IconLock,
          href: Routes.SettingsSecurity,
          external: false,
        },
      ],
    },
  ];
}
