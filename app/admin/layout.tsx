"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const navItems = [
  {
    title: "Overview",
    href: "/admin",
    icon: "📊",
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: "👥",
  },
  {
    title: "Products",
    href: "/admin/products",
    icon: "📦",
  },
  {
    title: "Analytics",
    href: "/admin/analytics",
    icon: "📈",
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: "⚙️",
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
        },
      },
    });
  };

  const closeSidebar = () => setIsSidebarOpen(false);

  if (isPending || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Mobile Header */}
      <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800 lg:hidden">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
            <span className="text-lg">🎵</span>
          </div>
          <div>
            <h1 className="font-bold text-white text-sm">Ritmus</h1>
            <p className="text-xs text-slate-400">Admin</p>
          </div>
        </div>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 active:bg-slate-700 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Toggle menu"
        >
          {isSidebarOpen ? (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </header>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar - Hidden on mobile, visible on lg+ */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900/95 backdrop-blur-xl border-r border-slate-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo - Hidden on mobile (shown in header) */}
        <div className="hidden lg:flex items-center gap-3 px-6 py-5 border-b border-slate-800">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
            <span className="text-xl">🎵</span>
          </div>
          <div>
            <h1 className="font-bold text-white">Ritmus</h1>
            <p className="text-xs text-slate-400">Admin Panel</p>
          </div>
        </div>

        {/* Mobile close button area */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-slate-800 lg:hidden">
          <span className="text-white font-medium">Menu</span>
          <button
            onClick={closeSidebar}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close menu"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-3 lg:p-4 space-y-1 mt-14 lg:mt-0">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeSidebar}
                className={`flex items-center gap-3 px-4 py-3.5 lg:py-3 rounded-xl transition-all duration-200 group min-h-[48px] ${
                  isActive
                    ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border border-purple-500/30"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50 active:bg-slate-700/50"
                }`}
              >
                <span className="text-xl lg:text-lg">{item.icon}</span>
                <span className="font-medium">{item.title}</span>
                {isActive && (
                  <div className="ml-auto w-2 h-2 lg:w-1.5 lg:h-1.5 rounded-full bg-purple-500"></div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Info */}
        <div className="absolute bottom-0 left-0 right-0 p-3 lg:p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
              {session.user.name?.charAt(0) || "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {session.user.name}
              </p>
              <p className="text-xs text-slate-400 truncate">
                @{session.user.username}
              </p>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800 active:bg-slate-700 min-h-[44px]"
              onClick={() => {
                router.push("/dashboard");
                closeSidebar();
              }}
            >
              Dashboard
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-slate-700 text-slate-300 hover:bg-slate-800 active:bg-slate-700 min-h-[44px]"
              onClick={handleSignOut}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="pt-16 lg:pt-0 lg:pl-64">{children}</main>
    </div>
  );
}
