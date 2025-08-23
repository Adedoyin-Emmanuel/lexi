"use client";

import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect } from "react";
import {
  Settings as SettingsIcon,
  User,
  Briefcase,
  Save,
  Loader2,
  Check,
  Building2,
  Palette,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/use-auth";
import { Axios } from "@/app/config/axios";
import toast from "react-hot-toast";

interface SettingsData {
  displayName: string;
  role: "freelancer" | "creator";
  specialities: string[];
}

const nicheOptions = [
  "SEO",
  "Coaching",
  "Youtuber",
  "Animation",
  "E-commerce",
  "Podcasting",
  "Logo Design",
  "UI/UX Design",
  "Photography",
  "Copywriting",
  "Blog Writing",
  "Illustration",
  "Voice Acting",
  "Video Editing",
  "Graphic Design",
  "Brand Identity",
  "Market Research",
  "Content Writing",
  "Email Marketing",
  "Web Development",
  "Game Development",
  "Video Production",
  "Content Creation",
  "Digital Marketing",
  "Project Management",
  "Business Consulting",
  "AI & Machine Learning",
  "Fullstack Development",
  "Mobile App Development",
  "Blockchain Development",
  "Social Media Management",
];

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
        role: user.userType || "freelancer",
        specialities: user.specialities || [],
      });
    }
  }, [user]);

  const handleSpecialityToggle = (selectedSpeciality: string) => {
    const updatedSpecialities = data.specialities.includes(selectedSpeciality)
      ? data.specialities.filter((s) => s !== selectedSpeciality)
      : data.specialities.length < 5
      ? [...data.specialities, selectedSpeciality]
      : data.specialities;

    setData({ ...data, specialities: updatedSpecialities });
  };

  const handleRoleSelect = (selectedRole: "freelancer" | "creator") => {
    setData({ ...data, role: selectedRole });
  };

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

  const isFormValid = data.displayName.trim() && data.specialities.length > 0;

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
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center">
                <SettingsIcon
                  className="h-5 w-5 text-primary-foreground"
                  strokeWidth={1.5}
                />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Settings</h1>
                <p className="text-muted-foreground">
                  Manage your account preferences
                </p>
              </div>
            </div>
            <Separator />
          </motion.div>

          {/* Settings Tabs */}
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

            {/* Profile Tab */}
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

            {/* Role Tab */}
            <TabsContent value="role" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
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
                          : "border-border hover:border-primary/50 hover:bg-muted/50"
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
                          <h3 className="text-lg font-semibold mb-2">
                            Freelancer
                          </h3>
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
                          : "border-border hover:border-primary/50 hover:bg-muted/50"
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
                          <h3 className="text-lg font-semibold mb-2">
                            Creator
                          </h3>
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

            {/* Specialities Tab */}
            <TabsContent value="specialities" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Your Specialities
                  </CardTitle>
                  <CardDescription>
                    Select up to 5 areas that best describe your expertise
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ScrollArea className="h-[400px] w-full rounded-lg border border-border p-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-3">
                      {nicheOptions.map((option) => (
                        <Button
                          key={option}
                          variant={
                            data.specialities.includes(option)
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          className={`h-auto py-3 md:py-4 px-3 md:px-4 text-xs md:text-sm font-medium transition-all duration-200 min-w-0 flex-1 ${
                            data.specialities.includes(option)
                              ? "bg-primary text-primary-foreground shadow-lg scale-105 cursor-pointer"
                              : data.specialities.length >= 5 &&
                                !data.specialities.includes(option)
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:border-primary/50 hover:bg-muted/50 hover:text-black cursor-pointer"
                          }`}
                          onClick={() => handleSpecialityToggle(option)}
                          disabled={
                            data.specialities.length >= 5 &&
                            !data.specialities.includes(option)
                          }
                        >
                          <span className="truncate">{option}</span>
                        </Button>
                      ))}
                    </div>
                  </ScrollArea>

                  {data.specialities.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-3"
                    >
                      <p className="text-sm font-medium text-muted-foreground">
                        Selected ({data.specialities.length}/5):
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {data.specialities.map((selected) => (
                          <Badge
                            key={selected}
                            variant="secondary"
                            className="px-3 py-1 text-sm bg-primary/10 text-primary border-primary/20"
                          >
                            {selected}
                          </Badge>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Save Button - Fixed at bottom */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="pt-6 border-t"
          >
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                {!isFormValid && (
                  <span>Please complete all required fields to save</span>
                )}
              </div>
              <Button
                onClick={handleSave}
                disabled={!isFormValid || isSaving}
                className="min-w-[140px]"
              >
                <AnimatePresence mode="wait">
                  {isSaving ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center"
                    >
                      <Loader2 className="animate-spin mr-2 h-4 w-4" />
                      Saving...
                    </motion.div>
                  ) : showSuccess ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Saved!
                    </motion.div>
                  ) : (
                    <motion.div
                      key="default"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
