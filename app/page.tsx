import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Navigation */}
      <nav className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-bold">🎵 Ritmus</h1>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/auth/sign-in">
              <Button
                variant="ghost"
                className="min-h-[44px] px-3 sm:px-4 text-sm sm:text-base"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/auth/sign-in">
              <Button className="min-h-[44px] px-3 sm:px-4 text-sm sm:text-base">
                Start Free
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-6 sm:mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Updated with new features
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold tracking-tight mb-4 sm:mb-6">
            A New Era in
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500">
              Music Production
            </span>
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-8 sm:mb-12 max-w-2xl mx-auto px-4 sm:px-0">
            Transform your music production process with Ritmus. Create
            professional-quality music with our AI-powered tools.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0">
            <Link href="/auth/sign-in" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto min-h-[52px] sm:min-h-[56px] px-6 sm:px-8 text-base sm:text-lg active:scale-[0.98] transition-transform"
              >
                Start Free
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="ml-2 h-4 w-4 sm:h-5 sm:w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto min-h-[52px] sm:min-h-[56px] px-6 sm:px-8 text-base sm:text-lg active:scale-[0.98] transition-transform"
            >
              Watch Demo
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="ml-2 h-4 w-4 sm:h-5 sm:w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 sm:mt-24 lg:mt-32 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          <div className="text-center p-6 sm:p-8 rounded-2xl bg-card border">
            <div className="mx-auto mb-3 sm:mb-4 flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-purple-500/10">
              <span className="text-2xl sm:text-3xl">🎼</span>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2">
              AI Composition
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground">
              Instantly create professional-quality melodies and harmonies with
              AI.
            </p>
          </div>

          <div className="text-center p-6 sm:p-8 rounded-2xl bg-card border">
            <div className="mx-auto mb-3 sm:mb-4 flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-pink-500/10">
              <span className="text-2xl sm:text-3xl">🎧</span>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2">
              Professional Mixing
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground">
              Get studio-quality sound with automatic mixing and mastering
              tools.
            </p>
          </div>

          <div className="text-center p-6 sm:p-8 rounded-2xl bg-card border sm:col-span-2 lg:col-span-1">
            <div className="mx-auto mb-3 sm:mb-4 flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-orange-500/10">
              <span className="text-2xl sm:text-3xl">👥</span>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2">
              Team Collaboration
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground">
              Collaborate with your team in real-time and accelerate your
              projects.
            </p>
          </div>
        </div>

        {/* Social Proof */}
        <div className="mt-16 sm:mt-24 lg:mt-32 text-center">
          <p className="text-xs sm:text-sm text-muted-foreground mb-6 sm:mb-8">
            Trusted by 100,000+ musicians
          </p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-8 opacity-50">
            <div className="text-lg sm:text-2xl font-bold">Spotify</div>
            <div className="text-lg sm:text-2xl font-bold">Apple Music</div>
            <div className="text-lg sm:text-2xl font-bold">YouTube</div>
            <div className="text-lg sm:text-2xl font-bold">SoundCloud</div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 mt-12 sm:mt-20 border-t">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs sm:text-sm text-muted-foreground">
            © 2024 Ritmus. All rights reserved.
          </p>
          <div className="flex gap-4 sm:gap-6 text-xs sm:text-sm text-muted-foreground">
            <Link
              href="#"
              className="hover:text-foreground active:text-foreground/80 transition min-h-[44px] flex items-center"
            >
              Privacy
            </Link>
            <Link
              href="#"
              className="hover:text-foreground active:text-foreground/80 transition min-h-[44px] flex items-center"
            >
              Terms
            </Link>
            <Link
              href="#"
              className="hover:text-foreground active:text-foreground/80 transition min-h-[44px] flex items-center"
            >
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
