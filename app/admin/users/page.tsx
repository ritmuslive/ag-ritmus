"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Placeholder data - will be replaced with real data
const users = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    username: "johndoe",
    role: "admin",
    status: "active",
    plan: "Pro",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Alice Smith",
    email: "alice@example.com",
    username: "alicesmith",
    role: "user",
    status: "active",
    plan: "Premium",
    createdAt: "2024-02-20",
  },
  {
    id: "3",
    name: "Bob Wilson",
    email: "bob@example.com",
    username: "bobwilson",
    role: "user",
    status: "active",
    plan: "Starter",
    createdAt: "2024-03-10",
  },
  {
    id: "4",
    name: "Emma Davis",
    email: "emma@example.com",
    username: "emmad",
    role: "user",
    status: "banned",
    plan: "Pro",
    createdAt: "2024-01-25",
  },
  {
    id: "5",
    name: "Michael Brown",
    email: "michael@example.com",
    username: "michaelb",
    role: "user",
    status: "active",
    plan: "Starter",
    createdAt: "2024-04-01",
  },
];

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      selectedFilter === "all" ||
      (selectedFilter === "active" && user.status === "active") ||
      (selectedFilter === "banned" && user.status === "banned") ||
      (selectedFilter === "admin" && user.role === "admin");

    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">
            Active
          </Badge>
        );
      case "banned":
        return (
          <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">
            Banned
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-xs">
            {status}
          </Badge>
        );
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return (
          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs">
            Admin
          </Badge>
        );
      default:
        return (
          <Badge className="bg-slate-500/20 text-slate-400 border-slate-500/30 text-xs">
            User
          </Badge>
        );
    }
  };

  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case "Premium":
        return (
          <Badge className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30 text-xs">
            Premium
          </Badge>
        );
      case "Pro":
        return (
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
            Pro
          </Badge>
        );
      default:
        return (
          <Badge className="bg-slate-500/20 text-slate-400 border-slate-500/30 text-xs">
            Starter
          </Badge>
        );
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 lg:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Users</h1>
          <p className="text-slate-400 mt-1 text-sm sm:text-base">
            Manage and monitor user accounts
          </p>
        </div>
        <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 w-full sm:w-auto min-h-[44px]">
          <span className="mr-2">➕</span>
          Add User
        </Button>
      </div>

      {/* Filters and Search */}
      <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm mb-4 lg:mb-6">
        <CardContent className="pt-4 sm:pt-6">
          <div className="flex flex-col gap-3 sm:gap-4">
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 min-h-[44px]"
            />
            <div className="flex flex-wrap gap-2">
              {["all", "active", "banned", "admin"].map((filter) => (
                <Button
                  key={filter}
                  variant={selectedFilter === filter ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFilter(filter)}
                  className={`min-h-[40px] px-4 ${
                    selectedFilter === filter
                      ? "bg-purple-500 hover:bg-purple-600"
                      : "border-slate-700 text-slate-300 hover:bg-slate-800 active:bg-slate-700"
                  }`}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users - Card view on mobile, Table on desktop */}
      <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-white text-lg sm:text-xl">
            All Users ({filteredUsers.length})
          </CardTitle>
          <CardDescription className="text-sm">
            A list of all registered users in your platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Mobile Card View */}
          <div className="space-y-3 lg:hidden">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="p-4 rounded-xl bg-slate-800/50 border border-slate-700"
              >
                <div className="flex items-start gap-3">
                  <div className="h-11 w-11 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
                    {user.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white">{user.name}</p>
                    <p className="text-sm text-slate-400 truncate">
                      {user.email}
                    </p>
                    <p className="text-xs text-slate-500">@{user.username}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {getRoleBadge(user.role)}
                  {getPlanBadge(user.plan)}
                  {getStatusBadge(user.status)}
                </div>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-700">
                  <span className="text-xs text-slate-500">
                    Joined {user.createdAt}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-slate-400 hover:text-white hover:bg-slate-700 min-h-[36px] px-3"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10 min-h-[36px] px-3"
                    >
                      Ban
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left py-3 px-4 text-slate-400 font-medium text-sm">
                    User
                  </th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium text-sm">
                    Username
                  </th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium text-sm">
                    Role
                  </th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium text-sm">
                    Plan
                  </th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium text-sm">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium text-sm">
                    Joined
                  </th>
                  <th className="text-right py-3 px-4 text-slate-400 font-medium text-sm">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-slate-800 hover:bg-slate-800/50"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-white">{user.name}</p>
                          <p className="text-sm text-slate-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      @{user.username}
                    </td>
                    <td className="py-3 px-4">{getRoleBadge(user.role)}</td>
                    <td className="py-3 px-4">{getPlanBadge(user.plan)}</td>
                    <td className="py-3 px-4">{getStatusBadge(user.status)}</td>
                    <td className="py-3 px-4 text-slate-400">
                      {user.createdAt}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-slate-400 hover:text-white hover:bg-slate-800"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                          Ban
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
