import React, { createContext, useContext, useEffect, useState, useMemo, ReactNode } from 'react';

interface RouterContextType {
  pathname: string;
  searchParams: URLSearchParams;
  push: (url: string) => void;
  replace: (url: string) => void;
  back: () => void;
}

const RouterContext = createContext<RouterContextType>({
  pathname: '/',
  searchParams: new URLSearchParams(),
  push: () => {},
  replace: () => {},
  back: () => {},
});

export function RouterProvider({ children }: { children: ReactNode }) {
  const [pathname, setPathname] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname || '/';
    }
    return '/';
  });

  const [search, setSearch] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.search || '';
    }
    return '';
  });

  useEffect(() => {
    const handlePopState = () => {
      setPathname(window.location.pathname || '/');
      setSearch(window.location.search || '');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const push = (url: string) => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', url);
      const parsed = new URL(url, window.location.origin);
      setPathname(parsed.pathname);
      setSearch(parsed.search);
      window.scrollTo(0, 0);
    }
  };

  const replace = (url: string) => {
    if (typeof window !== 'undefined') {
      window.history.replaceState({}, '', url);
      const parsed = new URL(url, window.location.origin);
      setPathname(parsed.pathname);
      setSearch(parsed.search);
    }
  };

  const back = () => {
    if (typeof window !== 'undefined') {
      window.history.back();
    }
  };

  const searchParams = useMemo(() => new URLSearchParams(search), [search]);

  return (
    <RouterContext.Provider value={{ pathname, searchParams, push, replace, back }}>
      {children}
    </RouterContext.Provider>
  );
}

export function useRouter() {
  const context = useContext(RouterContext);
  return {
    push: context.push,
    replace: context.replace,
    back: context.back,
  };
}

export function usePathname() {
  const context = useContext(RouterContext);
  return context.pathname;
}

export function useSearchParams() {
  const context = useContext(RouterContext);
  return context.searchParams;
}

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: ReactNode;
}

export function Link({ href, children, className, onClick, ...props }: LinkProps) {
  const { push } = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) {
      onClick(e);
    }
    if (!e.defaultPrevented && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && !href.startsWith('http')) {
      e.preventDefault();
      push(href);
    }
  };

  return (
    <a href={href} onClick={handleClick} className={className} {...props}>
      {children}
    </a>
  );
}
