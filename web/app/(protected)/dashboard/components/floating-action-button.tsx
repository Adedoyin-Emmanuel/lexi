"use client";

import { Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

interface FloatingActionButtonProps {
  onClick?: () => void;
  className?: string;
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
        currentScrollY + windowHeight >= documentHeight - 100; // 100px from bottom

      // Hide button when scrolling down
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      }

      // Show button when scrolling up or at top, but not near bottom
      if (
        (currentScrollY < lastScrollY || currentScrollY <= 100) &&
        !isNearBottom
      ) {
        setIsVisible(true);
      }

      // Hide button when near bottom of page
      if (isNearBottom) {
        setIsVisible(false);
      }

      setLastScrollY(currentScrollY);

      // Clear existing timeout
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      // Show button after scrolling stops (2 seconds delay), but not if near bottom
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
          <Button
            size="lg"
            onClick={onClick}
            className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
