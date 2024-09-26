import { SignOutButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { CircleUser } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { env } from "@/lib/env";

import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ThemeToggle } from "./theme-toggle";

export async function UserDropdown() {
  const user = await currentUser();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="h-7 w-7 overflow-hidden rounded-full p-0"
          size="icon"
          variant="ghost"
        >
          {user?.imageUrl ? (
            <Image
              alt="User avatar"
              className="h-7 w-7 rounded-full"
              height={28}
              src={user?.imageUrl ?? ""}
              width={28}
            />
          ) : (
            <CircleUser className="w-67 h-7" />
          )}
          <span className="sr-only">Toggle user menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={4}>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" asChild>
          <Link href={env.CLERK_USER_PROFILE_URL}>Manage account</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <ThemeToggle />
        </DropdownMenuItem>
        <DropdownMenuSeparator />

        <DropdownMenuItem>
          <SignOutButton />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
