"use client";

import { use } from "react";
import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  MessageSquare,
  Music,
  Music2,
  Share2,
  UserPlus,
  ArrowLeft,
  MoreVertical,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface ProfilePageProps {
  params: Promise<{ username: string }>;
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const { username } = use(params);
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const isOwnProfile = session?.user.username === username;

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-background via-background/95 to-muted/20">
      {/* Dynamic Header */}
      <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-background/60 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:h-16">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="rounded-full hover:bg-white/5 px-2 sm:px-4"
          >
            <ArrowLeft className="h-5 w-5 sm:mr-2" />
            <span className="hidden sm:inline">Back</span>
          </Button>

          <div className="flex flex-col items-center">
            <span className="text-sm font-bold sm:text-base">Profile</span>
            <span className="text-[10px] text-muted-foreground sm:text-xs">
              @{username}
            </span>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-white/5"
            >
              <Share2 className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-white/5 sm:hidden"
            >
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-5xl px-0 pb-20 sm:px-4 sm:py-8 lg:py-12">
        <div className="flex flex-col gap-6 sm:gap-8 lg:flex-row">
          {/* Profile Sidebar / Hero Section */}
          <aside className="w-full lg:w-[320px] lg:shrink-0">
            <div className="flex flex-col items-center w-full">
              {/* Mobile Hero Background */}
              <div className="relative h-32 w-full bg-gradient-to-r from-purple-600/20 to-pink-600/20 sm:hidden" />

              <div className="relative -mt-12 flex flex-col items-center px-4 lg:mt-0 sm:px-0">
                <div className="group relative">
                  <Avatar className="h-24 w-24 border-4 border-background shadow-2xl sm:h-32 sm:w-32 lg:h-40 lg:w-40 transition-transform duration-300 hover:scale-105">
                    <AvatarFallback className="bg-gradient-to-tr from-[#FF69B4] via-[#9400D3] to-[#00BFFF] text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
                      {username[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute bottom-1 right-1 h-5 w-5 rounded-full border-2 border-background bg-green-500 sm:bottom-2 sm:right-2 sm:h-6 sm:w-6 sm:border-4" />
                </div>

                <div className="mt-4 space-y-1 text-center">
                  <h1 className="text-xl font-bold tracking-tight sm:text-2xl lg:text-3xl">
                    {isOwnProfile ? session.user.name : username}
                  </h1>
                  <p className="text-sm font-medium text-muted-foreground sm:text-base">
                    @{username}
                  </p>
                </div>

                <div className="mt-3 flex flex-wrap justify-center gap-2">
                  <div className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider sm:px-3 sm:py-1 sm:text-xs">
                    Artist
                  </div>
                  <div className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider sm:px-3 sm:py-1 sm:text-xs">
                    Producer
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex w-full items-center justify-center gap-2 sm:gap-3">
                  {isOwnProfile ? (
                    <Button className="h-11 flex-1 rounded-full bg-white font-bold text-black hover:bg-white/90 sm:flex-none sm:px-10">
                      Edit Profile
                    </Button>
                  ) : (
                    <>
                      <Button className="h-11 flex-1 rounded-full bg-primary font-bold text-primary-foreground sm:flex-none sm:px-10">
                        <UserPlus className="mr-2 h-4 w-4" />
                        Follow
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-11 w-11 shrink-0 rounded-full border-white/10 bg-white/5"
                      >
                        <MessageSquare className="h-5 w-5" />
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* Stats Card - Mobile (Inside sidebar) */}
              <div className="mt-8 grid w-full grid-cols-3 gap-1 rounded-2xl border border-white/5 bg-white/5 p-4 sm:hidden">
                <div className="text-center">
                  <p className="text-sm font-bold">1.2k</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                    Followers
                  </p>
                </div>
                <div className="text-center border-x border-white/10">
                  <p className="text-sm font-bold">482</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                    Following
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold">24</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                    Works
                  </p>
                </div>
              </div>

              {/* Stats Card - Desktop */}
              <Card className="mt-8 hidden w-full border-white/5 bg-white/5 backdrop-blur-sm sm:block">
                <CardContent className="space-y-4 p-4 lg:p-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Followers</span>
                    <span className="font-bold">1,240</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Following</span>
                    <span className="font-bold">482</span>
                  </div>
                  <div className="border-t border-white/5 pt-4 flex items-center justify-between text-sm font-medium">
                    <span className="text-muted-foreground">
                      Projects Created
                    </span>
                    <span className="font-bold">24</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </aside>

          {/* Content Area */}
          <div className="flex-1 px-4 sm:px-0">
            {/* Tabs */}
            <div className="sticky top-14 z-40 -mx-4 flex items-center gap-6 border-b border-white/5 bg-background/80 px-4 pb-0 backdrop-blur-md sm:top-16 sm:mx-0 sm:px-0">
              {["Works", "Albums", "About"].map((tab, i) => (
                <button
                  key={tab}
                  className={cn(
                    "relative pb-3 text-sm font-bold transition-all sm:pb-4 sm:text-base",
                    i === 0
                      ? "text-primary after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-primary"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Grid of Content */}
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card
                  key={i}
                  className="group relative overflow-hidden border-white/5 bg-white/5 hover:bg-white/10 transition-all border-transparent hover:border-white/10"
                >
                  <div className="aspect-[16/10] w-full bg-muted/30 sm:aspect-video">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex h-full w-full items-center justify-center">
                      <Music2 className="h-10 w-10 text-muted-foreground/20 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="line-clamp-1 text-sm font-bold group-hover:text-primary transition-colors sm:text-base">
                      Amazing Project Title {i}
                    </h3>
                    <div className="mt-1 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground sm:text-xs">
                        <Music className="h-3 w-3" />
                        <span>Electronic / Bass</span>
                      </div>
                      <span className="text-[10px] text-muted-foreground sm:text-xs">
                        2d ago
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
