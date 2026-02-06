"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Placeholder chart data
const weeklyData = [
  { day: "Mon", users: 120, revenue: 2400 },
  { day: "Tue", users: 145, revenue: 2900 },
  { day: "Wed", users: 132, revenue: 2640 },
  { day: "Thu", users: 178, revenue: 3560 },
  { day: "Fri", users: 165, revenue: 3300 },
  { day: "Sat", users: 89, revenue: 1780 },
  { day: "Sun", users: 76, revenue: 1520 },
];

const topCountries = [
  { country: "United States", users: 4521, percentage: 35 },
  { country: "United Kingdom", users: 2341, percentage: 18 },
  { country: "Germany", users: 1876, percentage: 15 },
  { country: "France", users: 1234, percentage: 10 },
  { country: "Japan", users: 987, percentage: 8 },
  { country: "Others", users: 1888, percentage: 14 },
];

const conversionFunnel = [
  { stage: "Visitors", count: 50000, percentage: 100 },
  { stage: "Sign ups", count: 12500, percentage: 25 },
  { stage: "Active users", count: 8750, percentage: 17.5 },
  { stage: "Paid users", count: 2450, percentage: 4.9 },
];

export default function AnalyticsPage() {
  const maxRevenue = Math.max(...weeklyData.map((d) => d.revenue));

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 lg:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Analytics</h1>
        <p className="text-slate-400 mt-1 text-sm sm:text-base">
          Platform insights and performance metrics
        </p>
      </div>

      {/* Key Metrics - 2 col mobile, 4 col desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 lg:mb-8">
        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex items-start sm:items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-slate-400 truncate">
                  Total Visitors
                </p>
                <p className="text-lg sm:text-2xl font-bold text-white mt-1">
                  128,543
                </p>
              </div>
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-lg sm:text-2xl">👁️</span>
              </div>
            </div>
            <div className="mt-2 sm:mt-3 flex items-center gap-1 sm:gap-2">
              <span className="text-emerald-400 text-xs sm:text-sm">
                ↑ 12.5%
              </span>
              <span className="text-slate-500 text-xs hidden sm:inline">
                vs last week
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex items-start sm:items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-slate-400 truncate">
                  Conversion
                </p>
                <p className="text-lg sm:text-2xl font-bold text-white mt-1">
                  4.9%
                </p>
              </div>
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-lg sm:text-2xl">📈</span>
              </div>
            </div>
            <div className="mt-2 sm:mt-3 flex items-center gap-1 sm:gap-2">
              <span className="text-emerald-400 text-xs sm:text-sm">
                ↑ 0.8%
              </span>
              <span className="text-slate-500 text-xs hidden sm:inline">
                vs last week
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex items-start sm:items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-slate-400 truncate">
                  Avg. Session
                </p>
                <p className="text-lg sm:text-2xl font-bold text-white mt-1">
                  8m 42s
                </p>
              </div>
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-lg sm:text-2xl">⏱️</span>
              </div>
            </div>
            <div className="mt-2 sm:mt-3 flex items-center gap-1 sm:gap-2">
              <span className="text-emerald-400 text-xs sm:text-sm">
                ↑ 1m 12s
              </span>
              <span className="text-slate-500 text-xs hidden sm:inline">
                vs last week
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex items-start sm:items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-slate-400 truncate">
                  Bounce Rate
                </p>
                <p className="text-lg sm:text-2xl font-bold text-white mt-1">
                  32.4%
                </p>
              </div>
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-lg sm:text-2xl">📉</span>
              </div>
            </div>
            <div className="mt-2 sm:mt-3 flex items-center gap-1 sm:gap-2">
              <span className="text-red-400 text-xs sm:text-sm">↑ 2.1%</span>
              <span className="text-slate-500 text-xs hidden sm:inline">
                vs last week
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row - Stack on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-6 lg:mb-8">
        {/* Weekly Revenue Chart */}
        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="text-white text-lg sm:text-xl">
              Weekly Revenue
            </CardTitle>
            <CardDescription className="text-sm">
              Revenue trends over the past week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-1 sm:gap-2 h-36 sm:h-48">
              {weeklyData.map((data, index) => (
                <div
                  key={index}
                  className="flex-1 flex flex-col items-center gap-1 sm:gap-2"
                >
                  <div
                    className="w-full bg-gradient-to-t from-purple-500 to-pink-500 rounded-t-md sm:rounded-t-lg transition-all duration-300 hover:from-purple-400 hover:to-pink-400"
                    style={{
                      height: `${(data.revenue / maxRevenue) * 100}%`,
                      minHeight: "16px",
                    }}
                  ></div>
                  <span className="text-[10px] sm:text-xs text-slate-400">
                    {data.day}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-slate-800 flex justify-between">
              <div>
                <p className="text-slate-400 text-xs sm:text-sm">Total</p>
                <p className="text-white font-bold text-sm sm:text-base">
                  $18,100
                </p>
              </div>
              <div className="text-right">
                <p className="text-slate-400 text-xs sm:text-sm">Average</p>
                <p className="text-white font-bold text-sm sm:text-base">
                  $2,586/day
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Conversion Funnel */}
        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="text-white text-lg sm:text-xl">
              Conversion Funnel
            </CardTitle>
            <CardDescription className="text-sm">
              User journey from visitor to customer
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              {conversionFunnel.map((stage, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-1.5 sm:mb-2">
                    <span className="text-slate-300 text-sm">
                      {stage.stage}
                    </span>
                    <span className="text-white font-medium text-xs sm:text-sm">
                      {stage.count.toLocaleString()} ({stage.percentage}%)
                    </span>
                  </div>
                  <div className="h-2.5 sm:h-3 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                      style={{ width: `${stage.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Geographic Distribution */}
      <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-white text-lg sm:text-xl">
            Geographic Distribution
          </CardTitle>
          <CardDescription className="text-sm">
            Users by country
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
            {topCountries.map((country, index) => (
              <div
                key={index}
                className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-slate-800/50"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between mb-1.5 sm:mb-2">
                    <span className="text-white font-medium text-sm truncate">
                      {country.country}
                    </span>
                    <span className="text-slate-400 text-xs sm:text-sm flex-shrink-0">
                      {country.users.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-1.5 sm:h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                      style={{ width: `${country.percentage}%` }}
                    ></div>
                  </div>
                </div>
                <span className="text-slate-400 text-xs sm:text-sm flex-shrink-0">
                  {country.percentage}%
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
