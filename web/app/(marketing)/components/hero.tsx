"use client";

import { gsap } from "gsap";
import Link from "next/link";
import { Play, Shield, ArrowRight } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

import DemoDialog from "./demo-dialog";
import { Button } from "@/components/ui/button";

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set([titleRef.current, subtitleRef.current, buttonsRef.current], {
        opacity: 0,
        y: 30,
      });

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

        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/3 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />

        <div className="absolute top-1/3 right-1/3 w-48 h-48 bg-primary/3 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/3 w-56 h-56 bg-secondary/3 rounded-full blur-3xl" />
        <div className="absolute top-2/3 left-1/6 w-40 h-40 bg-accent/4 rounded-full blur-3xl" />
        <div className="absolute bottom-1/6 right-1/6 w-36 h-36 bg-primary/4 rounded-full blur-3xl" />

        <div className="absolute top-0 left-0 w-72 h-72 bg-primary/15 rounded-full blur-3xl" />
        <div className="absolute top-1/6 left-1/8 w-64 h-64 bg-secondary/3 rounded-full blur-3xl" />
        <div className="absolute top-1/4 left-0 w-48 h-48 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute top-0 left-1/4 w-56 h-56 bg-primary/3 rounded-full blur-3xl" />

        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-secondary/5 to-transparent" />
        <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-accent/5 to-transparent" />
        <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-primary/5 to-transparent" />

        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/2 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-tl from-transparent via-secondary/2 to-transparent" />

        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-gradient-radial from-primary/8 via-transparent to-transparent blur-3xl" />
        <div className="absolute bottom-0 right-1/2 transform translate-x-1/2 w-96 h-96 bg-gradient-radial from-secondary/8 via-transparent to-transparent blur-3xl" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <div className="px-6 py-2 md:py-3 rounded-full border border-primary/20 backdrop-blur-sm floating-icon">
                  <div className="flex items-center gap-2">
                    <Shield
                      className="hidden md:block w-4 h-4 text-primary"
                      strokeWidth={1.5}
                    />
                    <span className="hidden md:block text-sm font-medium text-primary">
                      AI-powered contract assistant for freelancers & creators
                    </span>

                    <span className="block md:hidden text-sm font-medium text-primary">
                      AI contract assistant for freelancers & creators
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
              <span className="block text-primary">In Plain English</span>
            </h1>

            <p
              ref={subtitleRef}
              className="text-lg sm:text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              Lexi detects contract types, highlights critical clauses with
              confidence scores, and explains what you need to know about
              deadlines and obligations.
            </p>

            <div
              ref={buttonsRef}
              className="flex flex-col sm:flex-row gap-6 justify-center mb-16"
            >
              <Link href="/auth/login">
                <Button
                  size="lg"
                  className="group h-14 text-[17px] px-8 bg-primary hover:bg-primary/90 transform hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 cursor-pointer"
                >
                  Get started for free
                  <ArrowRight
                    className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
                    strokeWidth={1.5}
                  />
                </Button>
              </Link>

              <Button
                variant="outline"
                size="lg"
                onClick={() => setIsDemoOpen(true)}
                className="h-14 px-8 text-sm font-medium border border-primary transform hover:bg-white hover:text-black hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-primary/25  cursor-pointer"
              >
                <Play className="mr-3 w-5 h-5" strokeWidth={1.5} />
                Watch demo video
              </Button>
            </div>
          </div>
        </div>
      </section>

      <DemoDialog isOpen={isDemoOpen} onOpenChange={setIsDemoOpen} />
    </>
  );
};

export default Hero;
