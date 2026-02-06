"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function WelcomePage() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const router = useRouter();
  const { data: session } = authClient.useSession();

  // Pre-fill name if available from session
  useEffect(() => {
    if (session?.user?.name) {
      setName(session.user.name);
    }
  }, [session]);

  const validateUsername = (value: string) => {
    if (value.length < 3) {
      setUsernameError("Username must be at least 3 characters");
      return false;
    }
    if (value.length > 32) {
      setUsernameError("Username can be at most 32 characters");
      return false;
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(value)) {
      setUsernameError(
        "Username can only contain letters, numbers, underscores, and hyphens",
      );
      return false;
    }
    if (value.toLowerCase() === "admin") {
      setUsernameError("This username is unavailable");
      return false;
    }
    setUsernameError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateUsername(username)) {
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Update user name and username
      const updateResponse = await authClient.updateUser({
        name,
        username,
        displayUsername: username,
      });

      if (updateResponse.error) {
        if (updateResponse.error.message?.includes("username")) {
          setUsernameError("This username is already taken");
        } else {
          setError(updateResponse.error.message || "An error occurred");
        }
        return;
      }

      router.push("/dashboard");
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted p-4 sm:p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center px-4 sm:px-6">
          <div className="mx-auto mb-4 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-primary/10">
            <span className="text-2xl sm:text-3xl">👋</span>
          </div>
          <CardTitle className="text-xl sm:text-2xl">Welcome!</CardTitle>
          <CardDescription className="mt-2 text-sm sm:text-base">
            Complete your profile to get started
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm">
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Your Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isLoading}
                className="min-h-[48px] sm:min-h-[52px] text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm">
                Username
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-base">
                  @
                </span>
                <Input
                  id="username"
                  type="text"
                  placeholder="username"
                  value={username}
                  onChange={(e) => {
                    const value = e.target.value.toLowerCase();
                    setUsername(value);
                    if (value) validateUsername(value);
                  }}
                  required
                  disabled={isLoading}
                  className="min-h-[48px] sm:min-h-[52px] pl-8 text-base"
                />
              </div>
              {usernameError && (
                <p className="text-destructive text-xs sm:text-sm">
                  {usernameError}
                </p>
              )}
              <p className="text-muted-foreground text-xs">
                3-32 characters. Only letters, numbers, underscores, and
                hyphens.
              </p>
            </div>

            <Button
              type="submit"
              className="w-full min-h-[48px] sm:min-h-[52px] text-base mt-6 active:scale-[0.98] transition-transform"
              disabled={isLoading || !name || !username || !!usernameError}
            >
              {isLoading ? (
                <>
                  <svg
                    className="mr-2 h-4 w-4 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Saving...
                </>
              ) : (
                "Continue"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
