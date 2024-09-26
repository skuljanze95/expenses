import Link from "next/link";

import { Navbar } from "./navbar";
import { UserDropdown } from "./user-dropdown";

export function Header() {
  return (
    <header className="fixed top-0 z-50 flex h-14 w-full max-w-[800px] items-center justify-between gap-4 border-b bg-background p-3 sm:gap-5">
      <Link className="flex items-center gap-2" href="/">
        <svg
          className="h-7 w-7"
          fill="none"
          height="512"
          viewBox="0 0 512 512"
          width="512"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M512 256C512 397.385 397.385 512 256 512C114.615 512 0 397.385 0 256C0 114.615 114.615 0 256 0C397.385 0 512 114.615 512 256Z"
            fill="black"
          />
          <rect
            fill="white"
            height="47.9946"
            rx="23.9973"
            transform="rotate(-20.0745 162.321 182.811)"
            width="182.992"
            x="162.321"
            y="182.811"
          />
          <rect
            fill="white"
            height="47.9946"
            rx="23.9973"
            transform="rotate(-20.0745 162.651 347.011)"
            width="182.992"
            x="162.651"
            y="347.011"
          />
          <rect
            fill="white"
            height="49.6604"
            rx="24.8302"
            transform="rotate(-20.0745 162 264.448)"
            width="145.312"
            x="162"
            y="264.448"
          />
        </svg>
      </Link>

      <Navbar />

      <UserDropdown />
    </header>
  );
}
