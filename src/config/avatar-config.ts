import { m } from '@/locale/paraglide/messages';
import { IconLayoutDashboard, IconSettings2 } from '@tabler/icons-react';
import { Routes } from '@/lib/routes';
import type { MenuItemConfig } from '../types';
/**
 * Avatar dropdown links
 */
export function getAvatarLinks(): MenuItemConfig[] {
  return [
    {
      title: m.dashboard_avatar_dashboard(),
      href: Routes.Dashboard,
      icon: IconLayoutDashboard,
    },
    {
      title: m.dashboard_avatar_settings(),
      href: Routes.SettingsProfile,
      icon: IconSettings2,
    },
  ];
}
