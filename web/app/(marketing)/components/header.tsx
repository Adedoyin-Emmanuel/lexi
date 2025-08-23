"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link className="flex items-center space-x-2" href="/">
            <div className="w-8 h-8 flex items-center justify-center">
              <Image src="/logo.svg" alt="Lexi Logo" width={32} height={32} />
            </div>
            <span className="text-xl font-bold text-foreground">Lexi</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="#features"
              className="text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              Features
            </Link>
            <Link
              target="_blank"
              href="https://github.com/Adedoyin-Emmanuel/lexi"
              className="text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              Github
            </Link>

            <Link href="/auth/login">
              <Button className="cursor-pointer">Get Started</Button>
            </Link>
          </nav>

          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" strokeWidth={1.5} />
            ) : (
              <Menu className="w-6 h-6" strokeWidth={1.5} />
            )}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/40">
            <nav className="flex flex-col space-y-4">
              <Link
                href="#features"
                className="text-muted-foreground hover:text-foreground transition-colors font-medium"
              >
                Features
              </Link>
              <Link
                target="_blank"
                href="https://github.com/Adedoyin-Emmanuel/lexi"
                className="text-muted-foreground hover:text-foreground transition-colors font-medium"
              >
                Github
              </Link>

              <div className="pt-4">
                <Link href="/auth/login">
                  <Button size="sm" className="w-full font-semibold">
                    Get Started
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
