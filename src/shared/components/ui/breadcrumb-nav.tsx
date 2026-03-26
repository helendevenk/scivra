"use client";

import Link from "next/link";

interface BreadcrumbNavProps {
  items: Array<{
    label: string;
    href?: string;
  }>;
}

export function BreadcrumbNav({ items }: BreadcrumbNavProps) {
  if (items.length === 0) return null;

  // On mobile, if more than 3 items, show first + "..." + last
  const showCollapsed = items.length > 3;

  return (
    <nav aria-label="Breadcrumb">
      {/* Full breadcrumb for md+ screens */}
      <ol
        className={`${showCollapsed ? "hidden md:flex" : "flex"} flex-wrap items-center gap-1.5 text-sm`}
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="inline-flex items-center gap-1.5">
              {index > 0 && (
                <span
                  className="text-muted-foreground/60 select-none"
                  aria-hidden="true"
                >
                  /
                </span>
              )}
              {isLast || !item.href ? (
                <span
                  className="text-foreground font-medium"
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>

      {/* Collapsed breadcrumb for mobile when > 3 items */}
      {showCollapsed && (
        <ol className="flex items-center gap-1.5 text-sm md:hidden">
          <li className="inline-flex items-center">
            {items[0].href ? (
              <Link
                href={items[0].href}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {items[0].label}
              </Link>
            ) : (
              <span className="text-muted-foreground">{items[0].label}</span>
            )}
          </li>
          <li className="inline-flex items-center gap-1.5">
            <span
              className="text-muted-foreground/60 select-none"
              aria-hidden="true"
            >
              /
            </span>
            <span className="text-muted-foreground" aria-hidden="true">
              ...
            </span>
          </li>
          <li className="inline-flex items-center gap-1.5">
            <span
              className="text-muted-foreground/60 select-none"
              aria-hidden="true"
            >
              /
            </span>
            <span className="text-foreground font-medium" aria-current="page">
              {items[items.length - 1].label}
            </span>
          </li>
        </ol>
      )}
    </nav>
  );
}
