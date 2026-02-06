"use client";

import { authClient } from "@/lib/auth-client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const stats = [
  {
    title: "Total Users",
    value: "12,847",
    change: "+12.5%",
    changeType: "positive" as const,
    icon: "👥",
    description: "vs last month",
  },
  {
    title: "Active Subscriptions",
    value: "3,241",
    change: "+8.2%",
    changeType: "positive" as const,
    icon: "💳",
    description: "vs last month",
  },
  {
    title: "Products",
    value: "156",
    change: "+3",
    changeType: "positive" as const,
    icon: "📦",
    description: "new this week",
  },
  {
    title: "Revenue",
    value: "$48,352",
    change: "+23.1%",
    changeType: "positive" as const,
    icon: "💰",
    description: "vs last month",
  },
];

const recentActivity = [
  {
    id: 1,
    user: "John Doe",
    action: "upgraded to Pro plan",
    time: "2 min ago",
    avatar: "J",
  },
  {
    id: 2,
    user: "Alice Smith",
    action: "created a new project",
    time: "15 min ago",
    avatar: "A",
  },
  {
    id: 3,
    user: "Bob Wilson",
    action: "joined a team",
    time: "1 hour ago",
    avatar: "B",
  },
  {
    id: 4,
    user: "Emma Davis",
    action: "purchased credits",
    time: "2 hours ago",
    avatar: "E",
  },
  {
    id: 5,
    user: "Michael Brown",
    action: "signed up",
    time: "3 hours ago",
    avatar: "M",
  },
];

const quickActions = [
  { title: "Add User", icon: "➕", href: "/admin/users/new" },
  { title: "Create Product", icon: "📦", href: "/admin/products/new" },
  { title: "View Reports", icon: "📊", href: "/admin/analytics" },
  { title: "System Settings", icon: "⚙️", href: "/admin/settings" },
];

export default function AdminPage() {
  const { data: session } = authClient.useSession();

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 lg:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">
          Welcome back, {session?.user?.name?.split(" ")[0] || "Admin"}
        </h1>
        <p className="text-slate-400 mt-1 text-sm sm:text-base">
          Here&apos;s what&apos;s happening with your platform today.
        </p>
      </div>

      {/* Stats Grid - 1 col mobile, 2 col tablet, 4 col desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="bg-slate-900/50 border-slate-800 backdrop-blur-sm hover:border-slate-700 transition-all duration-300"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-slate-400">
                {stat.title}
              </CardTitle>
              <span className="text-xl sm:text-2xl">{stat.icon}</span>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-white">
                {stat.value}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`text-xs font-medium ${
                    stat.changeType === "positive"
                      ? "text-emerald-400"
                      : "text-red-400"
                  }`}
                >
                  {stat.change}
                </span>
                <span className="text-xs text-slate-500">
                  {stat.description}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid - Stack on mobile, side by side on lg+ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 bg-slate-900/50 border-slate-800 backdrop-blur-sm">
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="text-white text-lg sm:text-xl">
              Recent Activity
            </CardTitle>
            <CardDescription className="text-sm">
              Latest actions from your users
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center gap-3 sm:gap-4 p-2.5 sm:p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 active:bg-slate-700 transition-colors"
                >
                  <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold text-sm sm:text-base flex-shrink-0">
                    {activity.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white">
                      <span className="font-medium">{activity.user}</span>{" "}
                      <span className="text-slate-400 hidden sm:inline">
                        {activity.action}
                      </span>
                      <span className="text-slate-400 sm:hidden">
                        {activity.action.slice(0, 20)}...
                      </span>
                    </p>
                    <p className="text-xs text-slate-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="text-white text-lg sm:text-xl">
              Quick Actions
            </CardTitle>
            <CardDescription className="text-sm">
              Common administrative tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  className="flex flex-col items-center justify-center gap-2 p-3 sm:p-4 rounded-xl bg-slate-800/50 hover:bg-slate-800 active:bg-slate-700 border border-slate-700 hover:border-purple-500/50 transition-all duration-300 group min-h-[80px] sm:min-h-[96px]"
                >
                  <span className="text-xl sm:text-2xl group-hover:scale-110 transition-transform">
                    {action.icon}
                  </span>
                  <span className="text-xs sm:text-sm text-slate-300 font-medium text-center">
                    {action.title}
                  </span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Health */}
      <Card className="mt-4 lg:mt-6 bg-slate-900/50 border-slate-800 backdrop-blur-sm">
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-white text-lg sm:text-xl">
            System Health
          </CardTitle>
          <CardDescription className="text-sm">
            Current system status and metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse flex-shrink-0"></div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-medium text-white truncate">
                  API Status
                </p>
                <p className="text-xs text-slate-400">Operational</p>
              </div>
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse flex-shrink-0"></div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-medium text-white truncate">
                  Database
                </p>
                <p className="text-xs text-slate-400">Healthy</p>
              </div>
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse flex-shrink-0"></div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-medium text-white truncate">
                  Storage
                </p>
                <p className="text-xs text-slate-400">72% used</p>
              </div>
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="h-3 w-3 rounded-full bg-yellow-500 animate-pulse flex-shrink-0"></div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-medium text-white truncate">
                  Queue
                </p>
                <p className="text-xs text-slate-400">12 pending</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
