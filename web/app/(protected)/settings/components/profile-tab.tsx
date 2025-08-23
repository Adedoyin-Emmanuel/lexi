"use client";

import { User } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";

interface SettingsData {
  displayName: string;
  role: "freelancer" | "creator";
  specialities: string[];
}

interface ProfileTabProps {
  data: SettingsData;
  setData: React.Dispatch<React.SetStateAction<SettingsData>>;
}

export function ProfileTab({ data, setData }: ProfileTabProps) {
  return (
    <TabsContent value="profile" className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Information
          </CardTitle>
          <CardDescription>
            Update your display name and basic profile details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Display Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User
                  className="h-4 w-4 text-muted-foreground"
                  strokeWidth={1.5}
                />
              </div>
              <Input
                type="text"
                placeholder="Enter your display name"
                value={data.displayName}
                onChange={(e) =>
                  setData({ ...data, displayName: e.target.value })
                }
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
