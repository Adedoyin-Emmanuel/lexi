"use client";

import { User, Briefcase, Building2 } from "lucide-react";

import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";

interface SettingsData {
  displayName: string;
  specialities: string[];
  role: "freelancer" | "creator";
}

interface RoleTabProps {
  data: SettingsData;
  setData: React.Dispatch<React.SetStateAction<SettingsData>>;
}

export function RoleTab({ data, setData }: RoleTabProps) {
  const handleRoleSelect = (selectedRole: "freelancer" | "creator") => {
    setData({ ...data, role: selectedRole });
  };

  return (
    <TabsContent value="role" className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" strokeWidth={1.5} />
            Professional Role
          </CardTitle>
          <CardDescription>
            Select the role that best describes your work
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              className={`relative p-6 rounded-xl border-2 transition-all duration-300 cursor-pointer group ${
                data.role === "freelancer"
                  ? "border-primary bg-primary/5 shadow-lg"
                  : "hover:border-primary/50 hover:bg-muted/50 border-gray-200"
              }`}
              onClick={() => handleRoleSelect("freelancer")}
            >
              <div className="space-y-4">
                <div
                  className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center transition-all ${
                    data.role === "freelancer"
                      ? "bg-primary text-primary-foreground"
                      : "bg-neutral-50 border border-neutral-200 text-muted-foreground group-hover:bg-primary/10"
                  }`}
                >
                  <Briefcase className="h-6 w-6" strokeWidth={1} />
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">Freelancer</h3>
                  <p className="text-muted-foreground text-sm">
                    I provide services to clients and work on projects
                  </p>
                </div>
              </div>
            </div>

            <div
              className={`relative p-6 rounded-xl border-2 transition-all duration-300 cursor-pointer group ${
                data.role === "creator"
                  ? "border-primary bg-primary/5 shadow-lg"
                  : "hover:border-primary/50 hover:bg-muted/50 border-gray-200"
              }`}
              onClick={() => handleRoleSelect("creator")}
            >
              <div className="space-y-4">
                <div
                  className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center transition-all ${
                    data.role === "creator"
                      ? "bg-primary text-primary-foreground"
                      : "bg-neutral-50 border border-neutral-200 text-muted-foreground group-hover:bg-primary/10"
                  }`}
                >
                  <User className="h-6 w-6" strokeWidth={1} />
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">Creator</h3>
                  <p className="text-muted-foreground text-sm">
                    I create content and build an audience
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
