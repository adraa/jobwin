import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Check, Star } from "lucide-react";
import React, { useRef } from "react";
import confetti from "canvas-confetti";

interface PricingProps {
  title?: string;
  description?: string;
  price: number;
  originalPrice: number;
  currency?: string;
  features: string[];
  buttonText?: string;
  href: string;
  badgeText?: string;
  lifetimeText?: string;
  onButtonClick?: () => void;
  countdownComponent?: React.ReactNode;
}

export function Pricing({
  title = "Steal The Job",
  description = "One-time investment for career success",
  price = 79,
  originalPrice = 112,
  currency = "RM",
  features = [],
  buttonText = "Get Instant Access",
  href,
  badgeText = "🔥 Best Value",
  lifetimeText = "LIFETIME ACCESS",
  onButtonClick,
  countdownComponent,
}: PricingProps) {
  const buttonRef = useRef<HTMLAnchorElement>(null);

  const handleClick = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;

      confetti({
        particleCount: 50,
        spread: 60,
        origin: {
          x: x / window.innerWidth,
          y: y / window.innerHeight,
        },
        colors: ["#0066CC", "#5AC8FA", "#FF2D55", "#5856D6"],
        ticks: 200,
        gravity: 1.2,
        decay: 0.94,
        startVelocity: 30,
        shapes: ["circle"],
      });
    }

    if (onButtonClick) {
      onButtonClick();
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 relative z-10">
      <div className="relative">
        {/* Soft blue glow for Apple style */}
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-100 via-blue-50 to-blue-100 rounded-[32px] blur-2xl opacity-50"></div>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.8,
            type: "spring",
            stiffness: 100,
            damping: 30,
          }}
          className="reveal relative bg-white rounded-[24px] md:rounded-[32px] p-8 md:p-16 shadow-xl text-center border border-gray-100"
        >
          {/* Best Value Badge */}
          <div className="absolute top-0 right-0 p-6 z-30">
            <div className="bg-apple-blue text-white px-3 py-1 rounded-full font-semibold text-[11px] uppercase tracking-wide shadow-sm">
              {badgeText}
            </div>
          </div>

          {/* Title Section */}
          <div className="mb-8 md:mb-10 pt-4">
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-apple-text mb-2">
              {title}
            </h2>
            <p className="text-apple-blue font-medium uppercase tracking-widest text-xs md:text-sm">
              {description}
            </p>
          </div>

          {/* Pricing Section */}
          <div className="mb-8 flex flex-col items-center gap-2">
            <div className="flex items-baseline gap-3">
              <span className="text-2xl text-gray-400 line-through font-medium">
                {currency}{originalPrice}
              </span>
              <span className="text-6xl md:text-7xl font-bold tracking-tighter text-apple-text">
                {currency}{price}
              </span>
            </div>
            <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded-full text-xs font-bold mt-1">
              Save 30% today
            </span>
          </div>

          {/* Countdown Timer */}
          {countdownComponent && (
            <div className="mb-8">
              {countdownComponent}
            </div>
          )}

          {/* Features List */}
          <div className="flex flex-col gap-4 mb-10 text-left max-w-sm mx-auto">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 text-apple-text/80"
              >
                <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 text-apple-blue" strokeWidth={3} />
                </div>
                <span className="font-medium text-[15px] md:text-[17px]">{feature}</span>
              </motion.div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="w-full flex flex-col gap-6">
            <motion.a
              ref={buttonRef}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleClick}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "relative rounded-full overflow-hidden block",
                "bg-apple-blue text-white",
                "font-medium text-lg md:text-xl py-4 md:py-5 px-8",
                "shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300"
              )}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {buttonText}
              </span>
            </motion.a>

            <p className="text-xs text-gray-400 font-medium">
              Secure payment via Stripe • Instant download
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

