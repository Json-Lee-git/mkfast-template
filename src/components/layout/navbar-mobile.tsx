import { m } from '@/locale/paraglide/messages';
import { getNavbarLinks } from '@/config/navbar-config';
import { authClient } from '@/auth/client';
import { isLinkActive } from '@/lib/urls';
import { cn } from '@/lib/utils';
import { Routes } from '@/lib/routes';
import { buttonVariants } from '@/components/ui/button';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Link, useLocation } from '@tanstack/react-router';
import { IconChevronRight, IconMenu2, IconX } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Logo } from '@/components/shared/logo';
import { ModeSwitcherHorizontal } from '@/components/theme/mode-switcher-horizontal';
import { LocaleSwitcher } from '@/components/layout/locale-switcher';
import { UserButtonMobile } from '@/components/shared/user-button-mobile';
import { LoginWrapper } from '@/components/auth/login-wrapper';
import { websiteConfig } from '@/config/website';

const mobileLinkClass =
  'flex w-full items-center rounded-md p-2 text-base text-muted-foreground transition-colors duration-150 hover:text-foreground';
const mobileLinkActiveClass = 'font-semibold text-primary';
const mobileSubLinkClass =
  'flex w-full items-center gap-4 rounded-md p-2 text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground';

interface NavbarMobileProps extends React.HTMLAttributes<HTMLDivElement> {}

export function NavbarMobile({ className, ...props }: NavbarMobileProps) {
  const pathname = useLocation().pathname;
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const menuLinks = getNavbarLinks();

  useEffect(() => {
    setMounted(true);
    setOpen(false);
  }, [pathname]);

  if (!mounted) return null;

  return (
    <>
      <div
        className={cn('flex items-center justify-between', className)}
        {...props}
      >
        <Link to="/" className="flex items-center gap-2">
          <Logo />
          <span className="text-lg font-semibold tracking-tight">
            {websiteConfig.metadata?.name}
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {websiteConfig.auth?.enable &&
            (isPending ? (
              <Skeleton className="size-8 rounded-full" />
            ) : user ? (
              <UserButtonMobile user={user} />
            ) : null)}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-expanded={open}
            aria-label={m.common_toggle_menu()}
            onClick={() => setOpen((o) => !o)}
            className="size-8 rounded-md border"
          >
            {open ? (
              <IconX className="size-4" />
            ) : (
              <IconMenu2 className="size-4" />
            )}
          </Button>
        </div>
      </div>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={m.common_mobile_navigation()}
          className="fixed inset-0 top-14 z-50 flex flex-col overflow-y-auto bg-background animate-in fade-in-0 duration-200"
        >
          <div className="flex flex-1 flex-col items-start gap-4 p-4">
            {websiteConfig.auth?.enable && !user && (
              <div className="flex w-full flex-col gap-4">
                <LoginWrapper mode="redirect" asChild>
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    className="w-full"
                    onClick={() => setOpen(false)}
                  >
                    {m.auth_common_login()}
                  </Button>
                </LoginWrapper>
                <Link
                  to={Routes.Register}
                  onClick={() => setOpen(false)}
                  className={cn(buttonVariants({ size: 'lg' }), 'w-full')}
                >
                  {m.auth_common_signup()}
                </Link>
              </div>
            )}

            <ul className="w-full space-y-1">
              {menuLinks?.map((item) => {
                const hasActiveChild = item.items?.some((group) =>
                  group.items?.some((sub) => isLinkActive(sub.href, pathname))
                );
                const active = item.href
                  ? isLinkActive(item.href, pathname)
                  : hasActiveChild;

                return (
                  <li key={item.title} className="py-1">
                    {item.items ? (
                      <Collapsible>
                        <CollapsibleTrigger
                          render={
                            <Button
                              type="button"
                              variant="ghost"
                              className={cn(
                                'w-full justify-between text-left text-base',
                                'bg-transparent text-muted-foreground hover:text-foreground',
                                active && 'font-semibold text-primary'
                              )}
                            >
                              {item.title}
                              <IconChevronRight className="size-4 transition-transform duration-200 group-data-[state=open]:rotate-90" />
                            </Button>
                          }
                          nativeButton={false}
                        />
                        <CollapsibleContent className="pl-2">
                          {item.items.map((group) => (
                            <div key={group.title} className="mt-2 mb-3">
                              <p className="px-2 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
                                {group.title}
                              </p>
                              <ul className="space-y-0.5">
                                {group.items?.map((sub) => (
                                  <li key={sub.title}>
                                    <Link
                                      to={sub.href ?? '#'}
                                      target={
                                        sub.external ? '_blank' : undefined
                                      }
                                      rel={
                                        sub.external
                                          ? 'noopener noreferrer'
                                          : undefined
                                      }
                                      onClick={() => setOpen(false)}
                                      className={cn(
                                        mobileSubLinkClass,
                                        'pl-4',
                                        isLinkActive(sub.href, pathname) &&
                                          mobileLinkActiveClass
                                      )}
                                    >
                                      {sub.icon ? (
                                        <sub.icon className="size-4 shrink-0" />
                                      ) : null}
                                      <div className="flex flex-col">
                                        <span>{sub.title}</span>
                                        {sub.description && (
                                          <span className="text-xs text-muted-foreground/70">
                                            {sub.description}
                                          </span>
                                        )}
                                      </div>
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </CollapsibleContent>
                      </Collapsible>
                    ) : (
                      <Link
                        to={item.href ?? '#'}
                        target={item.external ? '_blank' : undefined}
                        rel={item.external ? 'noopener noreferrer' : undefined}
                        onClick={() => setOpen(false)}
                        className={cn(
                          mobileLinkClass,
                          active && mobileLinkActiveClass
                        )}
                      >
                        {item.title}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>

            <div className="mt-auto w-full border-t border-border/50 p-4 flex items-center justify-end gap-2">
              <LocaleSwitcher onLocaleChange={() => setOpen(false)} />
              <ModeSwitcherHorizontal />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
