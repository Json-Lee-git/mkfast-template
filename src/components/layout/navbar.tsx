import { m } from '@/locale/paraglide/messages';
import { getNavbarLinks } from '@/config/navbar-config';
import { useScroll } from '@/hooks/use-scroll';
import { authClient } from '@/auth/client';
import { isLinkActive } from '@/lib/urls';
import { cn } from '@/lib/utils';
import { Routes } from '@/lib/routes';
import { buttonVariants } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
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
import { useEffect, useState } from 'react';
import { websiteConfig } from '@/config/website';

interface NavbarProps {
  scroll?: boolean;
}

export function Navbar({ scroll = true }: NavbarProps) {
  const pathname = useLocation().pathname;
  const scrolled = useScroll(50);
  const menuLinks = getNavbarLinks();
  const [mounted, setMounted] = useState(false);
  const [menuValue, setMenuValue] = useState<string | null>(null);
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const showBarBg = scroll && scrolled;

  useEffect(() => {
    setMounted(true);
    setMenuValue(null);
  }, [pathname]);

  return (
    <header
      className={cn(
        'sticky inset-x-0 top-0 z-40 py-3 transition-all duration-300',
        showBarBg && 'border-b'
      )}
    >
      {showBarBg && (
        <div
          className="absolute inset-0 z-0 bg-background/80 backdrop-blur-md"
          aria-hidden="true"
        />
      )}
      <div className="relative z-10">
        <Container className="px-4">
          <nav
            aria-label={m.common_main_navigation()}
            className="hidden lg:flex lg:items-center lg:justify-between lg:gap-4"
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

            <NavigationMenu
              value={menuValue}
              onValueChange={setMenuValue}
              className="flex-1 justify-center"
            >
              <NavigationMenuList aria-orientation={undefined}>
                {menuLinks?.map((item) =>
                  item.items ? (
                    <NavigationMenuItem key={item.title} value={item.title}>
                      <NavigationMenuTrigger
                        className={cn(
                          'bg-transparent text-sm',
                          item.items.some((group) =>
                            group.items?.some((sub) =>
                              isLinkActive(sub.href, pathname)
                            )
                          ) && 'font-semibold text-foreground'
                        )}
                      >
                        {item.title}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <div className="flex gap-0">
                          <div className="grid grid-cols-3 gap-6 p-6 min-w-[580px] max-w-[720px]">
                            {item.items.map((group) => (
                              <div key={group.title}>
                                <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                  {group.title}
                                </h4>
                                <ul className="space-y-1">
                                  {group.items?.map((sub) => (
                                    <li key={sub.title}>
                                      <NavigationMenuLink
                                        closeOnClick
                                        className={cn(
                                          'group flex select-none flex-col rounded-md px-3 py-2 leading-none no-underline outline-hidden transition-colors',
                                          'hover:bg-accent hover:text-accent-foreground',
                                          'focus:bg-accent focus:text-accent-foreground',
                                          isLinkActive(sub.href, pathname) &&
                                            'bg-accent text-accent-foreground'
                                        )}
                                        render={
                                          <Link
                                            to={sub.href ?? '#'}
                                            target={
                                              sub.external
                                                ? '_blank'
                                                : undefined
                                            }
                                            rel={
                                              sub.external
                                                ? 'noopener noreferrer'
                                                : undefined
                                            }
                                          />
                                        }
                                      >
                                        <span className="text-sm font-medium">
                                          {sub.title}
                                        </span>
                                        {sub.description ? (
                                          <span className="mt-0.5 text-xs text-muted-foreground leading-snug">
                                            {sub.description}
                                          </span>
                                        ) : null}
                                      </NavigationMenuLink>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                          {/* Promo card */}
                          <div className="hidden xl:flex w-[220px] shrink-0 flex-col justify-between border-l bg-muted/30 p-5">
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Sample Fix Pack
                              </p>
                              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                                See what a $19 repair plan looks like before you
                                commit. Copy-ready schema, LLMs.txt guidance,
                                and prioritized fixes.
                              </p>
                            </div>
                            <Link
                              to="/sample-aeo-report"
                              className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                            >
                              Preview the Fix Pack
                              <IconArrowRight size={14} />
                            </Link>
                          </div>
                        </div>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  ) : (
                    <NavigationMenuItem key={item.title}>
                      <NavigationMenuLink
                        render={<Link to={item.href ?? '#'} />}
                        className={cn(
                          navigationMenuTriggerStyle(),
                          'bg-transparent text-sm',
                          isLinkActive(item.href, pathname) &&
                            'font-semibold text-primary'
                        )}
                      >
                        {item.title}
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  )
                )}
              </NavigationMenuList>
            </NavigationMenu>

            <div className="flex items-center gap-4 shrink-0">
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
                          buttonVariants({
                            variant: 'outline',
                            size: 'sm',
                          }),
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
      </div>
    </header>
  );
}
