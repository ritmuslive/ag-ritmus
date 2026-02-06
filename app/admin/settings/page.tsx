"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    siteName: "Ritmus",
    siteDescription: "AI-powered music production platform",
    supportEmail: "support@ritmus.live",
    enableRegistration: true,
    requireEmailVerification: true,
    enableGoogleAuth: true,
    enableMagicLink: true,
    maintenanceMode: false,
    maxCreditsPerUser: 10000,
    freeCreditsOnSignup: 100,
  });

  const handleSave = () => {
    // Placeholder save function - will be implemented later
    console.log("Saving settings:", settings);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl">
      {/* Header */}
      <div className="mb-6 lg:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Settings</h1>
        <p className="text-slate-400 mt-1 text-sm sm:text-base">
          Configure your platform settings
        </p>
      </div>

      {/* General Settings */}
      <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm mb-4 lg:mb-6">
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-white text-lg sm:text-xl">
            General Settings
          </CardTitle>
          <CardDescription className="text-sm">
            Basic configuration for your platform
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          <div className="space-y-2">
            <Label htmlFor="siteName" className="text-slate-300 text-sm">
              Site Name
            </Label>
            <Input
              id="siteName"
              value={settings.siteName}
              onChange={(e) =>
                setSettings({ ...settings, siteName: e.target.value })
              }
              className="bg-slate-800/50 border-slate-700 text-white min-h-[44px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="siteDescription" className="text-slate-300 text-sm">
              Site Description
            </Label>
            <Input
              id="siteDescription"
              value={settings.siteDescription}
              onChange={(e) =>
                setSettings({ ...settings, siteDescription: e.target.value })
              }
              className="bg-slate-800/50 border-slate-700 text-white min-h-[44px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="supportEmail" className="text-slate-300 text-sm">
              Support Email
            </Label>
            <Input
              id="supportEmail"
              type="email"
              value={settings.supportEmail}
              onChange={(e) =>
                setSettings({ ...settings, supportEmail: e.target.value })
              }
              className="bg-slate-800/50 border-slate-700 text-white min-h-[44px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Authentication Settings */}
      <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm mb-4 lg:mb-6">
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-white text-lg sm:text-xl">
            Authentication
          </CardTitle>
          <CardDescription className="text-sm">
            Configure how users sign in to your platform
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          <div className="flex items-start sm:items-center justify-between gap-3 py-1">
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-sm sm:text-base">
                Enable Registration
              </p>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Allow new users to create accounts
              </p>
            </div>
            <Switch
              checked={settings.enableRegistration}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, enableRegistration: checked })
              }
              className="flex-shrink-0"
            />
          </div>

          <Separator className="bg-slate-800" />

          <div className="flex items-start sm:items-center justify-between gap-3 py-1">
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-sm sm:text-base">
                Require Email Verification
              </p>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Users must verify their email before accessing
              </p>
            </div>
            <Switch
              checked={settings.requireEmailVerification}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, requireEmailVerification: checked })
              }
              className="flex-shrink-0"
            />
          </div>

          <Separator className="bg-slate-800" />

          <div className="flex items-start sm:items-center justify-between gap-3 py-1">
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-sm sm:text-base">
                Google Authentication
              </p>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Allow users to sign in with Google
              </p>
            </div>
            <Switch
              checked={settings.enableGoogleAuth}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, enableGoogleAuth: checked })
              }
              className="flex-shrink-0"
            />
          </div>

          <Separator className="bg-slate-800" />

          <div className="flex items-start sm:items-center justify-between gap-3 py-1">
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-sm sm:text-base">
                Magic Link Authentication
              </p>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Allow users to sign in via email magic links
              </p>
            </div>
            <Switch
              checked={settings.enableMagicLink}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, enableMagicLink: checked })
              }
              className="flex-shrink-0"
            />
          </div>
        </CardContent>
      </Card>

      {/* Credits Settings */}
      <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm mb-4 lg:mb-6">
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-white text-lg sm:text-xl">
            Credits
          </CardTitle>
          <CardDescription className="text-sm">
            Configure credit limits and defaults
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          <div className="space-y-2">
            <Label htmlFor="maxCredits" className="text-slate-300 text-sm">
              Maximum Credits Per User
            </Label>
            <Input
              id="maxCredits"
              type="number"
              value={settings.maxCreditsPerUser}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  maxCreditsPerUser: parseInt(e.target.value) || 0,
                })
              }
              className="bg-slate-800/50 border-slate-700 text-white min-h-[44px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="freeCredits" className="text-slate-300 text-sm">
              Free Credits on Signup
            </Label>
            <Input
              id="freeCredits"
              type="number"
              value={settings.freeCreditsOnSignup}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  freeCreditsOnSignup: parseInt(e.target.value) || 0,
                })
              }
              className="bg-slate-800/50 border-slate-700 text-white min-h-[44px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="bg-slate-900/50 border-red-900/50 backdrop-blur-sm mb-4 lg:mb-6">
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-red-400 text-lg sm:text-xl">
            Danger Zone
          </CardTitle>
          <CardDescription className="text-sm">
            These settings can affect your entire platform
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          <div className="flex items-start sm:items-center justify-between gap-3 py-1">
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-sm sm:text-base">
                Maintenance Mode
              </p>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Temporarily disable access to the platform
              </p>
            </div>
            <Switch
              checked={settings.maintenanceMode}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, maintenanceMode: checked })
              }
              className="flex-shrink-0"
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button - Sticky on mobile */}
      <div className="sticky bottom-4 sm:static sm:bottom-auto flex justify-end">
        <Button
          onClick={handleSave}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 w-full sm:w-auto min-h-[48px] sm:min-h-[44px] shadow-lg sm:shadow-none"
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
}
