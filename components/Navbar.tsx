"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ModeToggle } from "@/components/theme/mode-toggle";
import { cn } from "@/lib/utils";

const BASE_CLASSNAMES =
  "text-sm font-medium transition-colors px-3 py-2 rounded-md";
const INACTIVE_CLASSNAMES =
  "text-muted-foreground hover:text-foreground hover:bg-muted";
const ACTIVE_CLASSNAMES = "bg-primary text-primary-foreground";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="w-full bg-background border-b border-border shadow-sm z-20 sticky top-0">
      <div className="flex items-center justify-between h-16 pl-10 pr-2 mx-auto">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.svg"
              alt="Media Mapper Logo"
              width={28}
              height={28}
              className="dark:invert text-primary"
            />
            <span className="text-xl font-medium">Media Mapper</span>
          </Link>
        </div>
        <nav>
          <ul className="flex items-center gap-2">
            <li>
              <Link
                href="/"
                className={cn(
                  BASE_CLASSNAMES,
                  pathname === "/" ? ACTIVE_CLASSNAMES : INACTIVE_CLASSNAMES
                )}
              >
                Map View
              </Link>
            </li>
            <li>
              <Link
                href="/table"
                className={cn(
                  BASE_CLASSNAMES,
                  pathname === "/table"
                    ? ACTIVE_CLASSNAMES
                    : INACTIVE_CLASSNAMES
                )}
              >
                Table View
              </Link>
            </li>
            <li className="ml-4">
              <ModeToggle />
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
