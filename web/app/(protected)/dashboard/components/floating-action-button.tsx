"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";

interface FloatingActionButtonProps {
  className?: string;
  onClick?: () => void;
}

export const FloatingActionButton = ({
  onClick,
  className = "",
}: FloatingActionButtonProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const isNearBottom =
        currentScrollY + windowHeight >= documentHeight - 100;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      }

      if (
        (currentScrollY < lastScrollY || currentScrollY <= 100) &&
        !isNearBottom
      ) {
        setIsVisible(true);
      }

      if (isNearBottom) {
        setIsVisible(false);
      }

      setLastScrollY(currentScrollY);

      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(() => {
        if (!isNearBottom) {
          setIsVisible(true);
        }
      }, 2000);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [lastScrollY]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{
            duration: 0.3,
            ease: "easeInOut",
            type: "spring",
            stiffness: 300,
            damping: 25,
          }}
          className={`fixed bottom-6 right-6 z-50 ${className}`}
        >
          <Link href="/analyze">
            <Button
              size="lg"
              onClick={onClick}
              className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
            >
              <Plus className="h-6 w-6" />
            </Button>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
