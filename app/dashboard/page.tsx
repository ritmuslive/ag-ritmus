"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Plus,
  CircleHelp,
  MessageSquare,
  Bell,
  ChevronDown,
  UserCircle,
  LifeBuoy,
  LogOut,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Building2,
  PlusCircle,
  Check,
  Upload,
  Globe,
  Briefcase,
  Bug,
  Sparkles,
  HelpCircle,
  Send,
  Clock,
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [showProfileSwitcher, setShowProfileSwitcher] = useState(false);
  const [showCreateOrg, setShowCreateOrg] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  // Mock data for organizations
  const organizations = [
    { id: "1", name: "Personal Account", type: "Personal", active: true },
    { id: "2", name: "Ritmus Creative", type: "Business", active: false },
    { id: "3", name: "Sonic Studio", type: "Professional", active: false },
  ];

  // Mock data for messages
  const recentMessages = [
    {
      id: "1",
      user: "Alex Rivera",
      text: "The new track sounds amazing!",
      time: "2m ago",
      read: false,
    },
    {
      id: "2",
      user: "Sarah Chen",
      text: "Sent you the project files.",
      time: "1h ago",
      read: true,
    },
    {
      id: "3",
      user: "System",
      text: "Welcome to Ritmus Pro!",
      time: "5h ago",
      read: true,
    },
  ];

  // Mock data for notifications
  const recentNotifications = [
    {
      id: "1",
      title: "Project Exported",
      text: "Your project 'Midnight' is ready.",
      time: "10m ago",
      icon: <Check className="w-3 h-3 text-green-400" />,
      read: false,
    },
    {
      id: "2",
      title: "New Feature",
      text: "Try the new AI separation tool.",
      time: "1d ago",
      icon: <Sparkles className="w-3 h-3 text-yellow-400" />,
      read: true,
    },
    {
      id: "3",
      title: "Security Alert",
      text: "New login from Tokyo, Japan.",
      time: "2d ago",
      icon: <Bug className="w-3 h-3 text-red-400" />,
      read: true,
    },
  ];

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
        },
      },
    });
  };

  // Show loading spinner while session is loading
  if (isPending || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const isAdmin = session?.user?.role === "admin";

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-4 sm:py-6">
          <h1 className="text-xl sm:text-2xl font-bold">🎵 Ritmus</h1>
          <div className="flex items-center gap-4">
            {/* Create Button */}
            <Button className="rounded-full px-5 h-10 bg-white text-black hover:bg-white/90 shadow-sm transition-all active:scale-95 flex items-center gap-2 group border-none">
              <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
              <span className="font-semibold text-sm">Create</span>
            </Button>

            {/* Action Icons */}
            <div className="hidden md:flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full w-10 h-10 text-muted-foreground hover:bg-white/10 hover:text-foreground transition-colors"
              >
                <CircleHelp className="w-[22px] h-[22px]" />
              </Button>

              {/* Messages Popover */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full w-10 h-10 text-muted-foreground hover:bg-white/10 hover:text-foreground transition-colors"
                  >
                    <MessageSquare className="w-[22px] h-[22px]" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  align="end"
                  className="w-80 p-0 border-white/10 bg-background/95 backdrop-blur-2xl overflow-hidden mt-2"
                >
                  <div className="p-4 border-b border-white/5 bg-white/5">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-sm">Messages</h3>
                      <button className="text-[10px] uppercase tracking-wider font-bold text-primary hover:underline">
                        Mark all read
                      </button>
                    </div>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto">
                    {recentMessages.map((msg) => (
                      <button
                        key={msg.id}
                        className="w-full p-4 flex gap-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 text-left group"
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500/20 to-purple-500/20 flex items-center justify-center font-bold text-xs text-primary group-hover:scale-110 transition-transform">
                          {msg.user
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="font-semibold text-sm truncate">
                              {msg.user}
                            </span>
                            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                              <Clock className="w-2.5 h-2.5" />
                              {msg.time}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground truncate">
                            {msg.text}
                          </p>
                        </div>
                        {!msg.read && (
                          <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="p-2 border-t border-white/5 text-center">
                    <button className="text-xs font-semibold py-1 hover:text-primary transition-colors">
                      View all messages
                    </button>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Notifications Popover */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full w-10 h-10 relative text-muted-foreground hover:bg-white/10 hover:text-foreground transition-colors"
                  >
                    <Bell className="w-[22px] h-[22px]" />
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-background" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  align="end"
                  className="w-80 p-0 border-white/10 bg-background/95 backdrop-blur-2xl overflow-hidden mt-2"
                >
                  <div className="p-4 border-b border-white/5 bg-white/5">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-sm">Notifications</h3>
                      <button className="text-[10px] uppercase tracking-wider font-bold text-primary hover:underline">
                        Mark all read
                      </button>
                    </div>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto">
                    {recentNotifications.map((notif) => (
                      <button
                        key={notif.id}
                        className="w-full p-4 flex gap-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 text-left group"
                      >
                        <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:border-primary/50 transition-colors">
                          {notif.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm leading-tight mb-0.5 group-hover:text-primary transition-colors">
                            {notif.title}
                          </p>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {notif.text}
                          </p>
                          <span className="text-[10px] text-muted-foreground mt-1 block">
                            {notif.time}
                          </span>
                        </div>
                        {!notif.read && (
                          <div className="w-2 h-2 rounded-full bg-primary mt-1 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="p-2 border-t border-white/5 text-center">
                    <button className="text-xs font-semibold py-1 hover:text-primary transition-colors">
                      View all notifications
                    </button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Profile Avatar Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-3 p-1 pr-3 rounded-full hover:bg-white/5 transition-all cursor-pointer outline-none group border border-transparent hover:border-white/10">
                  <div className="relative">
                    <Avatar className="w-8 h-8 border border-white/20">
                      <AvatarFallback className="bg-gradient-to-tr from-[#FF69B4] via-[#9400D3] to-[#00BFFF] text-white text-[10px] font-bold">
                        {session?.user.name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-background rounded-full border border-white/10 flex items-center justify-center">
                      <ChevronDown className="w-2.5 h-2.5 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="hidden lg:flex flex-col items-start -space-y-0.5">
                    <span className="text-sm font-semibold truncate max-w-[120px]">
                      {session?.user.name}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      @{session?.user.username}
                    </span>
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 mt-2 backdrop-blur-xl bg-background/95 border-white/10"
              >
                <DropdownMenuLabel className="p-0">
                  <Link
                    href={`/u/${session?.user.username}`}
                    className="flex flex-col space-y-1 p-2 hover:bg-white/5 transition-colors cursor-pointer rounded-sm"
                  >
                    <p className="text-sm font-medium leading-none">
                      {session?.user.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      @{session?.user.username}
                    </p>
                  </Link>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/5" />
                <DropdownMenuItem
                  className="cursor-pointer"
                  onSelect={() => setShowProfileSwitcher(true)}
                >
                  <UserCircle className="mr-2 h-4 w-4" />
                  <span>Switch Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onSelect={() => setShowFeedback(true)}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  <span>Feedback</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <LifeBuoy className="mr-2 h-4 w-4" />
                  <span>Help Center</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/5" />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="text-destructive focus:text-destructive cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Admin Link */}
        {isAdmin && (
          <div className="mb-4 sm:mb-6">
            <Link href="/admin">
              <Button
                variant="outline"
                className="w-full sm:w-auto min-h-[44px] border-purple-500/30 text-purple-400 hover:bg-purple-500/10 active:bg-purple-500/20"
              >
                <span className="mr-2">🛡️</span>
                Admin Panel
              </Button>
            </Link>
          </div>
        )}

        {/* Welcome Card */}
        <Card className="mb-6 sm:mb-8">
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="text-xl sm:text-2xl">
              Welcome, {session?.user.name?.split(" ")[0]}! 👋
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Welcome to the Ritmus dashboard. Here you can manage all your
              activities.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Stats Grid - 1 col on mobile, 3 on tablet+ */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="text-xs sm:text-sm">
                Basic Credits
              </CardDescription>
              <CardTitle className="text-2xl sm:text-3xl">
                {session?.user.basicCredit || 0}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Available credits</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="text-xs sm:text-sm">
                Pro Credits
              </CardDescription>
              <CardTitle className="text-2xl sm:text-3xl">
                {session?.user.proCredit || 0}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Available credits</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="text-xs sm:text-sm">
                Premium Credits
              </CardDescription>
              <CardTitle className="text-2xl sm:text-3xl">
                {session?.user.premiumCredit || 0}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Available credits</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="text-lg sm:text-xl">Quick Actions</CardTitle>
            <CardDescription className="text-sm">
              Quickly access common tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <Button
                variant="outline"
                className="h-20 sm:h-24 flex-col gap-2 active:scale-[0.98] transition-transform"
              >
                <span className="text-xl sm:text-2xl">🎵</span>
                <span className="text-xs sm:text-sm">New Project</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 sm:h-24 flex-col gap-2 active:scale-[0.98] transition-transform"
              >
                <span className="text-xl sm:text-2xl">📁</span>
                <span className="text-xs sm:text-sm">My Projects</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 sm:h-24 flex-col gap-2 active:scale-[0.98] transition-transform"
              >
                <span className="text-xl sm:text-2xl">👥</span>
                <span className="text-xs sm:text-sm">Teams</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 sm:h-24 flex-col gap-2 active:scale-[0.98] transition-transform"
              >
                <span className="text-xl sm:text-2xl">⚙️</span>
                <span className="text-xs sm:text-sm">Settings</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Profile Switcher Dialog */}
        <Dialog
          open={showProfileSwitcher}
          onOpenChange={setShowProfileSwitcher}
        >
          <DialogContent className="sm:max-w-[440px] p-0 overflow-hidden border-white/10 bg-background/95 backdrop-blur-2xl">
            <DialogHeader className="p-6 pb-2">
              <DialogTitle className="text-xl font-bold">
                Switch Profile
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Select an organization or personal account to continue.
              </DialogDescription>
            </DialogHeader>

            <div className="p-2">
              <div className="space-y-1">
                {organizations.map((org) => (
                  <button
                    key={org.id}
                    className={cn(
                      "w-full flex items-center justify-between p-3 rounded-xl transition-all group",
                      org.active
                        ? "bg-white/10 border border-white/20"
                        : "hover:bg-white/5 border border-transparent hover:border-white/10",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
                          org.active
                            ? "bg-primary text-primary-foreground"
                            : "bg-white/5 text-muted-foreground group-hover:text-foreground",
                        )}
                      >
                        {org.type === "Personal" ? (
                          <UserCircle className="w-5 h-5" />
                        ) : (
                          <Building2 className="w-5 h-5" />
                        )}
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-semibold">{org.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {org.type}
                        </p>
                      </div>
                    </div>
                    {org.active && (
                      <div className="w-6 h-6 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 text-primary" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <div className="mt-4 p-2 border-t border-white/5">
                <button
                  onClick={() => {
                    setShowProfileSwitcher(false);
                    setShowCreateOrg(true);
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl transition-all hover:bg-white/5 group border border-dashed border-white/10 hover:border-white/20"
                >
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-muted-foreground group-hover:text-foreground transition-colors">
                    <PlusCircle className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold">Create Organization</p>
                    <p className="text-xs text-muted-foreground">
                      Set up a new workspace for your team
                    </p>
                  </div>
                </button>
              </div>
            </div>

            <div className="bg-white/5 p-4 text-center mt-2">
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">
                Ritmus Cloud Platform • v0.1.0
              </p>
            </div>
          </DialogContent>
        </Dialog>

        {/* Create Organization Dialog */}
        <Dialog open={showCreateOrg} onOpenChange={setShowCreateOrg}>
          <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden border-white/10 bg-background/95 backdrop-blur-2xl">
            <DialogHeader className="p-6 pb-2">
              <DialogTitle className="text-xl font-bold">
                New Organization
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Set up a workspace for your team and projects.
              </DialogDescription>
            </DialogHeader>

            <div className="p-6 space-y-6">
              {/* Profile Image Upload UI */}
              <div className="flex flex-col items-center justify-center gap-4 py-2">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-2xl bg-white/5 border-2 border-dashed border-white/10 flex items-center justify-center overflow-hidden transition-all group-hover:border-primary/50 group-hover:bg-white/10 cursor-pointer">
                    <div className="text-center">
                      <Upload className="w-6 h-6 text-muted-foreground mx-auto mb-1 group-hover:text-primary transition-colors" />
                      <span className="text-[10px] text-muted-foreground group-hover:text-foreground font-medium">
                        Upload
                      </span>
                    </div>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-lg border-2 border-background">
                    <PlusCircle className="w-3.5 h-3.5 text-primary-foreground" />
                  </div>
                </div>
                <p className="text-[10px] text-center text-muted-foreground uppercase tracking-wider font-semibold">
                  Recommended: 400x400 JPG or PNG
                </p>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="org-name"
                    className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                  >
                    Organization Name
                  </Label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="org-name"
                      placeholder="e.g. Ritmus Studio"
                      className="pl-10 h-10 border-white/10 bg-white/5 focus:bg-white/10 transition-all rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="org-slug"
                    className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                  >
                    Organization Slug
                  </Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="org-slug"
                      placeholder="ritmus-studio"
                      className="pl-10 h-10 border-white/10 bg-white/5 focus:bg-white/10 transition-all rounded-xl"
                    />
                    <div className="absolute right-3 top-2.5 text-[10px] font-bold text-muted-foreground bg-white/5 px-1.5 py-0.5 rounded border border-white/5 uppercase">
                      ritmus.app/...
                    </div>
                  </div>
                  <p className="text-[10px] text-muted-foreground italic">
                    This will be your workspace&apos;s unique URL.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white/5 flex items-center justify-end gap-3 mt-2">
              <Button
                variant="ghost"
                onClick={() => setShowCreateOrg(false)}
                className="rounded-full px-6 hover:bg-white/5"
              >
                Cancel
              </Button>
              <Button
                className="rounded-full px-8 bg-white text-black hover:bg-white/90 font-bold shadow-lg shadow-white/5"
                onClick={() => setShowCreateOrg(false)}
              >
                Create Workspace
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Feedback Sheet */}
        <Sheet open={showFeedback} onOpenChange={setShowFeedback}>
          <SheetContent className="sm:max-w-[400px] border-white/10 bg-background/95 backdrop-blur-2xl p-0 flex flex-col">
            <SheetHeader className="p-6 border-b border-white/5">
              <SheetTitle className="text-xl font-bold flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                Send Feedback
              </SheetTitle>
              <SheetDescription className="text-muted-foreground">
                Help us improve Ritmus. We read every single piece of feedback.
              </SheetDescription>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Feedback Type */}
              <div className="space-y-3">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  What&apos;s on your mind?
                </Label>
                <Select defaultValue="general">
                  <SelectTrigger className="w-full h-11 border-white/10 bg-white/5 rounded-xl focus:bg-white/10 transition-all">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="border-white/10 bg-background/95 backdrop-blur-xl">
                    <SelectItem value="general" className="cursor-pointer">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-blue-400" />
                        <span>General Feedback</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="bug" className="cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Bug className="w-4 h-4 text-red-400" />
                        <span>Report a Bug</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="feature" className="cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-yellow-400" />
                        <span>Feature Request</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="help" className="cursor-pointer">
                      <div className="flex items-center gap-2">
                        <HelpCircle className="w-4 h-4 text-green-400" />
                        <span>Need Help</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Message */}
              <div className="space-y-3">
                <Label
                  htmlFor="feedback-message"
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  Your Message
                </Label>
                <Textarea
                  id="feedback-message"
                  placeholder="Tell us what you think..."
                  className="min-h-[160px] border-white/10 bg-white/5 focus:bg-white/10 transition-all rounded-xl resize-none p-4"
                />
                <p className="text-[10px] text-muted-foreground">
                  Please be as descriptive as possible. Screenshots are also
                  helpful if you find a bug.
                </p>
              </div>

              {/* Experience Rating (Simplified) */}
              <div className="space-y-3">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Overall Experience
                </Label>
                <div className="flex items-center justify-between p-1 bg-white/5 rounded-2xl border border-white/10">
                  {["😞", "😐", "😊", "😍", "✨"].map((emoji, i) => (
                    <button
                      key={i}
                      className="flex-1 h-10 flex items-center justify-center text-xl hover:bg-white/10 rounded-xl transition-all active:scale-95"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <SheetFooter className="p-6 border-t border-white/5 bg-white/5">
              <Button
                className="w-full rounded-full h-11 bg-white text-black hover:bg-white/90 font-bold shadow-lg shadow-white/5 flex items-center justify-center gap-2 group"
                onClick={() => setShowFeedback(false)}
              >
                <span>Send Feedback</span>
                <Send className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
