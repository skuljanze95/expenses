"use client";

import React from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../ui/navigation-menu";

export function Navbar() {
  const path = usePathname();
  return (
    <NavigationMenu>
      <NavigationMenuList className="flex gap-8 sm:gap-8">
        <NavigationMenuItem>
          <Link
            className={cn(
              path !== "/" && "text-gray-500",
              "font-medium hover:text-primary",
              "flex items-center gap-1 text-sm",
            )}
            href="/"
          >
            Home
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>
            <div
              className={cn(
                !path.includes("transaction") &&
                  !path.includes("categories") &&
                  "text-gray-500",
                "hover:text-primary",
                "flex items-center gap-1 text-sm",
              )}
            >
              Transactions
            </div>
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 md:w-[300px]">
              <ListItem
                className={cn(
                  path !== "/transactions" ? "text-gray-500" : "bg-secondary",
                )}
                href="/transactions"
                title="Transactions"
              >
                Overview of all transactions
              </ListItem>
              <ListItem
                className={cn(
                  path !== "/recurring-transactions"
                    ? "text-gray-500"
                    : "bg-secondary",
                )}
                href="/recurring-transactions"
                title="Recurring transactions"
              >
                Overview of all recurring transactions
              </ListItem>
              <ListItem
                className={cn(
                  path !== "/categories" ? "text-gray-500" : "bg-secondary",
                )}
                href="/categories"
                title="Categories"
              >
                Overview of all transaction categories
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link
            className={cn(
              path !== "/budget" && "text-gray-500",
              "font-medium hover:text-primary",
              "flex items-center gap-1 text-sm",
            )}
            href="/budget"
          >
            Budget
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { href: string; title: string }
>(({ children, className, href, title, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className,
          )}
          href={href}
          ref={ref}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
