import { m } from '@/locale/paraglide/messages';
import { getNavbarLinks } from '@/config/navbar-config';
import { useScroll } from '@/hooks/use-scroll';
import { authClient } from '@/auth/client';
import { isLinkActive } from '@/lib/urls';
import { cn } from '@/lib/utils';
import { Routes } from '@/lib/routes';
import { buttonVariants } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import Container from '@/components/layout/container';
import { Logo } from '@/components/shared/logo';
import { ModeSwitcher } from '@/components/theme/mode-switcher';
import { NavbarMobile } from '@/components/layout/navbar-mobile';
import { LocaleSwitcher } from '@/components/layout/locale-switcher';
import { UserButton } from '@/components/shared/user-button';
import { LoginWrapper } from '@/components/auth/login-wrapper';
import { IconArrowRight } from '@tabler/icons-react';
import { Link, useLocation } from '@tanstack/react-router';
import { useEffect, useState, useRef, useCallback } from 'react';
import { websiteConfig } from '@/config/website';

interface NavbarProps {
  scroll?: boolean;
}

export function Navbar({ scroll = true }: NavbarProps) {
  const pathname = useLocation().pathname;
  const scrolled = useScroll(50);
  const menuLinks = getNavbarLinks();
  const [mounted, setMounted] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const showBarBg = scroll && scrolled;
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navRef = useRef<HTMLElement>(null);

  // Close on route change
  useEffect(() => {
    setMounted(true);
    setOpenMenu(null);
  }, [pathname]);

  const handleTriggerEnter = useCallback((title: string) => {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current);
      closeTimeout.current = null;
    }
    setOpenMenu(title);
  }, []);

  const handleTriggerLeave = useCallback(() => {
    closeTimeout.current = setTimeout(() => {
      setOpenMenu(null);
    }, 150);
  }, []);

  const handlePanelEnter = useCallback(() => {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current);
      closeTimeout.current = null;
    }
  }, []);

  const handlePanelLeave = useCallback(() => {
    setOpenMenu(null);
  }, []);

  const activeMenu = menuLinks.find((item) => item.title === openMenu);

  return (
    <header
      ref={navRef}
      className={cn(
        'sticky inset-x-0 top-0 z-40 border-b border-border/60 bg-background/95 backdrop-blur-md transition-shadow duration-300',
        showBarBg && 'shadow-sm'
      )}
    >
      <Container className="px-4">
        <nav
          aria-label={m.common_main_navigation()}
          className="hidden lg:flex lg:h-14 lg:items-center lg:justify-between lg:gap-4"
        >
          <Link
            to="/"
            aria-label={m.common_home()}
            className="flex items-center gap-2 shrink-0"
          >
            <Logo />
            <span className="text-lg font-semibold tracking-tight">
              {websiteConfig.metadata?.name}
            </span>
          </Link>

          {/* Desktop nav items */}
          <ul className="flex items-center gap-0.5">
            {menuLinks.map((item) => {
              const hasDropdown = !!item.items;
              const isOpen = openMenu === item.title;
              return (
                <li key={item.title}>
                  {hasDropdown ? (
                    <button
                      type="button"
                      onMouseEnter={() => handleTriggerEnter(item.title)}
                      onMouseLeave={handleTriggerLeave}
                      onClick={() => setOpenMenu(isOpen ? null : item.title)}
                      className={cn(
                        'inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                        isOpen
                          ? 'text-foreground bg-muted/60'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
                      )}
                      aria-expanded={isOpen}
                    >
                      {item.title}
                      <svg
                        className={cn(
                          'size-3 transition-transform',
                          isOpen && 'rotate-180'
                        )}
                        viewBox="0 0 12 12"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <path d="M3 5l3 3 3-3" />
                      </svg>
                    </button>
                  ) : (
                    <Link
                      to={item.href ?? '#'}
                      className={cn(
                        'inline-flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors text-muted-foreground hover:text-foreground hover:bg-muted/40',
                        isLinkActive(item.href, pathname) &&
                          'text-primary font-semibold'
                      )}
                    >
                      {item.title}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-3 shrink-0">
            <LocaleSwitcher />
            <ModeSwitcher />
            {websiteConfig.auth?.enable &&
              (!mounted || isPending ? (
                <Skeleton className="size-8 rounded-full" />
              ) : user ? (
                <UserButton user={user} />
              ) : (
                <>
                  <LoginWrapper mode="modal" asChild>
                    <button
                      type="button"
                      className={cn(
                        buttonVariants({ variant: 'outline', size: 'sm' }),
                        'cursor-pointer'
                      )}
                    >
                      {m.auth_common_login()}
                    </button>
                  </LoginWrapper>
                  <Link
                    to={Routes.Register}
                    className={buttonVariants({ size: 'sm' })}
                  >
                    {m.auth_common_signup()}
                  </Link>
                </>
              ))}
          </div>
        </nav>

        <NavbarMobile className="lg:hidden" />
      </Container>

      {/* Mega menu backdrop */}
      {openMenu && (
        <div
          className="fixed inset-0 top-14 z-30 bg-black/20 backdrop-blur-sm"
          aria-hidden="true"
          onClick={() => setOpenMenu(null)}
        />
      )}

      {/* Mega menu panel */}
      {openMenu && activeMenu?.items && (
        <div
          className="absolute left-0 right-0 top-full z-30 border-b border-border/60 bg-background shadow-[0_24px_80px_rgba(15,23,42,0.14)]"
          onMouseEnter={handlePanelEnter}
          onMouseLeave={handlePanelLeave}
        >
          <Container className="px-4 py-6">
            <div className="flex gap-0">
              <div className="grid flex-1 grid-cols-3 gap-6">
                {activeMenu.items.map((group) => (
                  <div key={group.title}>
                    <h4 className="pb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80">
                      {group.title}
                    </h4>
                    <ul className="space-y-1">
                      {group.items?.map((sub) => (
                        <li key={sub.title}>
                          <Link
                            to={sub.href ?? '#'}
                            target={sub.external ? '_blank' : undefined}
                            rel={
                              sub.external ? 'noopener noreferrer' : undefined
                            }
                            onClick={() => setOpenMenu(null)}
                            className={cn(
                              'block rounded-lg px-3 py-2.5 transition-colors',
                              'hover:bg-muted/70',
                              isLinkActive(sub.href, pathname) &&
                                'bg-muted text-foreground font-medium'
                            )}
                          >
                            <span className="block text-sm font-medium text-foreground">
                              {sub.title}
                            </span>
                            {sub.description ? (
                              <span className="mt-1 block text-xs leading-snug text-muted-foreground">
                                {sub.description}
                              </span>
                            ) : null}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Promo card */}
              <div className="ml-6 hidden w-[240px] shrink-0 rounded-xl border border-border/60 bg-card p-5 xl:flex xl:flex-col xl:justify-between">
                <div>
                  <div className="rounded-lg border border-border/60 bg-muted/30 p-3 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="h-1.5 w-12 rounded-full bg-primary" />
                      <span className="font-display text-xs font-bold text-foreground">
                        64/100
                      </span>
                    </div>
                    <div className="mt-3 space-y-2">
                      <span className="block h-1.5 w-full rounded-full bg-muted-foreground/20" />
                      <span className="block h-1.5 w-4/5 rounded-full bg-muted-foreground/20" />
                      <span className="block h-1.5 w-2/3 rounded-full bg-muted-foreground/20" />
                    </div>
                  </div>
                  <p className="mt-4 font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                    Sample AI Visibility Report
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    See what a $19 repair plan looks like before you commit.
                    Copy-ready schema, LLMs.txt guidance, and prioritized fixes.
                  </p>
                </div>
                <Link
                  to="/sample-aeo-report"
                  onClick={() => setOpenMenu(null)}
                  className="mt-5 inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg bg-foreground px-4 py-2 text-sm font-semibold text-background transition hover:opacity-90"
                >
                  Preview Fix Pack
                  <IconArrowRight size={14} />
                </Link>
              </div>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
