"use client";

import {
  Play,
  Clock,
  Shield,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { gsap } from "gsap";
import React, { useEffect, useRef, useState } from "react";

import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(
        [
          titleRef.current,
          subtitleRef.current,
          buttonsRef.current,
          featuresRef.current,
        ],
        {
          opacity: 0,
          y: 30,
        }
      );

      gsap
        .timeline()
        .to(titleRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
        })
        .to(
          subtitleRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.4"
        )
        .to(
          buttonsRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.4"
        )
        .to(
          featuresRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.4"
        );

      gsap.to(".floating-icon", {
        y: -10,
        duration: 2,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1,
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden"
      >
        <div className="absolute inset-0 bg-background">
          <div className="absolute inset-0 opacity-[0.015]">
            <svg
              className="w-full h-full"
              xmlns="http://www.w3.org/2000/svg"
              width="100"
              height="100"
              viewBox="0 0 100 100"
            >
              <defs>
                <pattern
                  id="grid"
                  width="20"
                  height="20"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 20 0 L 0 0 0 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.5"
                  />
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#grid)" />
            </svg>
          </div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-muted/10" />

        <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl" />
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-secondary/10 rounded-full blur-xl" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <div className="px-6 py-3 rounded-full border border-primary/20 backdrop-blur-sm floating-icon">
                  <div className="flex items-center gap-2">
                    <Shield
                      className="w-5 h-5 text-primary"
                      strokeWidth={1.5}
                    />
                    <span className="text-sm font-medium text-primary">
                      Your final stop for contract clarity
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <h1
              ref={titleRef}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6"
            >
              Understand Your Contracts
              <span className="block text-primary">In Seconds, Not Hours</span>
            </h1>

            <p
              ref={subtitleRef}
              className="text-lg sm:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed"
            >
              Lexi is an AI-powered contract analyzer that identifies risks,
              highlights important clauses, and answers your questions about any
              legal document before you sign.
            </p>

            <div
              ref={buttonsRef}
              className="flex flex-col sm:flex-row gap-6 justify-center mb-16"
            >
              <Button
                size="lg"
                className="group h-14 text-[17px] px-8 bg-primary hover:bg-primary/90 transform hover:scale-105 transition-all duration-300  hover:shadow-sm"
              >
                Get started for free
                <ArrowRight
                  className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
                  strokeWidth={1.5}
                />
              </Button>
              <div className="relative group">
                <div className="absolute inset-0 animate-snake-border rounded-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={() => setIsDemoOpen(true)}
                  className="relative h-14 px-8 text-sm font-medium hover:bg-muted/50 transform hover:scale-105 transition-all duration-300 bg-background border border-transparent hover:border-primary/20"
                >
                  <Play className="mr-3 w-5 h-5" />
                  Watch Demo
                </Button>
              </div>
            </div>

            <div
              ref={featuresRef}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto"
            >
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-300 hover:shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Instant Analysis</h3>
                  <p className="text-sm text-muted-foreground">
                    Get comprehensive contract insights in seconds, not hours
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-300 hover:shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="w-6 h-6 text-secondary" />
                  </div>
                  <h3 className="font-semibold mb-2">Risk Detection</h3>
                  <p className="text-sm text-muted-foreground">
                    Identify potential risks and hidden terms automatically
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-300 hover:shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="font-semibold mb-2">Clear Summaries</h3>
                  <p className="text-sm text-muted-foreground">
                    Understand complex legal language in plain English
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Dialog open={isDemoOpen} onOpenChange={setIsDemoOpen}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Watch Lexi Demo</span>
            </DialogTitle>
          </DialogHeader>
          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Play className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Demo video will be embedded here
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Replace this with your YouTube embed code
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Hero;
