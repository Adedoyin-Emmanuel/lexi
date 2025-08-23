"use client";

import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";
import { User, Building2, Palette, Loader2 } from "lucide-react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { Axios } from "@/app/config/axios";
import toast from "react-hot-toast";

import { SettingsHeader } from "./settings-header";
import { ProfileTab } from "./profile-tab";
import { RoleTab } from "./role-tab";
import { SpecialitiesTab } from "./specialities-tab";
import { SaveButton } from "./save-button";
import type { SettingsData } from "./types";

export function Settings() {
  const { user, isLoading: authLoading } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [data, setData] = useState<SettingsData>({
    displayName: "",
    role: "freelancer",
    specialities: [],
  });

  useEffect(() => {
    if (user) {
      setData({
        displayName: user.displayName || "",
        role: (user.userType as "freelancer" | "creator") || "freelancer",
        specialities: user.specialities || [],
      });
    }
  }, [user]);

  const handleSave = async () => {
    try {
      setIsSaving(true);

      const dataToSend = {
        specialities: data.specialities,
        userType: data.role,
        displayName: data.displayName,
      };

      await Axios.put("/user", dataToSend);
      toast.success("Settings updated successfully!");
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error: unknown) {
      const errorMessage = (
        error as { response?: { data?: { message?: string } } }
      )?.response?.data?.message;
      toast.error(errorMessage || "Failed to update settings");
    } finally {
      setIsSaving(false);
    }
  };

  const isFormValid =
    Boolean(data.displayName.trim()) && data.specialities.length > 0;

  if (authLoading) {
    return (
      <div className="min-h-screen w-full flex flex-col justify-center items-center space-y-4">
        <Loader2 className="animate-spin text-primary" />
        <p className="text-muted-foreground">Loading settings...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div className="w-full py-6 md:py-8">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <SettingsHeader />

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 max-w-md">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="role" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Role
              </TabsTrigger>
              <TabsTrigger
                value="specialities"
                className="flex items-center gap-2"
              >
                <Palette className="h-4 w-4" />
                Specialities
              </TabsTrigger>
            </TabsList>

            <ProfileTab data={data} setData={setData} />
            <RoleTab data={data} setData={setData} />
            <SpecialitiesTab data={data} setData={setData} />
          </Tabs>

          <SaveButton
            isFormValid={isFormValid}
            isSaving={isSaving}
            showSuccess={showSuccess}
            onSave={handleSave}
          />
        </div>
      </div>
    </motion.div>
  );
}
