"use client";

import { motion } from "framer-motion";
import { Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
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

interface SpecialitiesTabProps {
  data: SettingsData;
  setData: React.Dispatch<React.SetStateAction<SettingsData>>;
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

export function SpecialitiesTab({ data, setData }: SpecialitiesTabProps) {
  const handleSpecialityToggle = (selectedSpeciality: string) => {
    const updatedSpecialities = data.specialities.includes(selectedSpeciality)
      ? data.specialities.filter((s) => s !== selectedSpeciality)
      : data.specialities.length < 5
      ? [...data.specialities, selectedSpeciality]
      : data.specialities;

    setData({ ...data, specialities: updatedSpecialities });
  };

  return (
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
                    data.specialities.includes(option) ? "default" : "outline"
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
  );
}
