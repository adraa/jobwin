import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Check, Star } from "lucide-react";
import React, { useRef } from "react";
import confetti from "canvas-confetti";

const sendDebugLog = (payload: any) => {
  // #region agent log
  try {
    fetch('http://127.0.0.1:7242/ingest/b61cb6a1-9617-4038-9f66-cb919d1c5b4e', {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: 'debug-session',
        timestamp: Date.now(),
        ...payload,
      })
    }).catch(() => { });
  } catch (err) {
    console.warn('debug log failed', err);
  }
  // #endregion
};

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
  price = 89,
  originalPrice = 119,
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

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
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
        colors: ["#FF6B35", "#FACC15", "#3B82F6", "#8B5CF6"],
        ticks: 200,
        gravity: 1.2,
        decay: 0.94,
        startVelocity: 30,
        shapes: ["circle"],
      });
    }

    sendDebugLog({
      runId: 'run2',
      hypothesisId: 'H3',
      location: 'components/pricing.tsx:handleClick',
      message: 'Pricing CTA clicked',
      data: {
        hasOnButtonClick: Boolean(onButtonClick),
        href,
        badgeText
      }
    });

    if (onButtonClick) {
      onButtonClick();
    }
  };

  const savings = originalPrice - price;
  const savingsPercent = Math.round((savings / originalPrice) * 100);

  return (
    <div className="max-w-3xl mx-auto px-4 relative z-10">
      {/* Glowing card wrapper */}
      <div className="relative">
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
          className="reveal relative bg-white rounded-[32px] p-8 md:p-16 shadow-neo-xl text-center border border-[#D2D2D7]/50"
        >
          {/* Best Value Badge */}
          <div className="absolute -top-3 -right-3 md:-top-4 md:-right-4 z-30">
            <div className="bg-[#0071E3] text-white px-3 py-1.5 md:px-4 md:py-2 rounded-full font-medium font-display text-[11px] md:text-xs uppercase tracking-wide shadow-lg border-4 border-white">
              {badgeText}
            </div>
          </div>

          {/* Lifetime Access Badge */}
          <div className="absolute -top-5 md:-top-6 left-1/2 -translate-x-1/2 z-20">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-white text-[#1D1D1F] rounded-full flex flex-col items-center justify-center font-bold font-display text-[9px] md:text-xs shadow-neo border border-[#D2D2D7]/50">
              <Star className="w-5 h-5 md:w-6 md:h-6 fill-[#FFCC00] text-[#FFCC00] mb-0.5 md:mb-1" />
              {lifetimeText.split(' ').map((word, i) => (
                <span key={i}>{word}{i === 0 && <br />}</span>
              ))}
            </div>
          </div>

          {/* Title Section */}
          <div className="mb-6 md:mb-10 mt-14 md:mt-16">
            <h2 className="text-3xl md:text-5xl font-bold font-display tracking-tight text-[#1D1D1F] mb-2 md:mb-3">
              {title}
            </h2>
            <p className="text-[#86868B] font-bold uppercase tracking-widest text-xs md:text-sm">
              {description}
            </p>
          </div>

          {/* Pricing Section */}
          <div className="mb-6 md:mb-8 flex flex-col items-center gap-1">
            <span className="text-lg md:text-2xl text-[#86868B] line-through font-display">
              {currency} {originalPrice}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl md:text-8xl font-bold font-display text-[#1D1D1F] tracking-tighter">
                {currency} {price}
              </span>
            </div>
            <span className="inline-flex items-center gap-1 bg-[#F2F2F7] text-[#34C759] px-3 py-1 rounded-full text-xs md:text-sm font-bold mt-2">
              💸 SAVE 30%
            </span>
          </div>

          {/* Countdown Timer */}
          {countdownComponent && (
            <div className="mb-6 md:mb-8">
              {countdownComponent}
            </div>
          )}

          {/* Features List */}
          <div className="flex flex-col gap-3 md:gap-5 mb-8 md:mb-12 text-left max-w-md mx-auto">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 md:gap-4 text-[#1D1D1F]"
              >
                <img
                  width={32}
                  height={32}
                  src="https://img.icons8.com/liquid-glass-color/32/checked.png"
                  alt="checked"
                  loading="lazy"
                  decoding="async"
                  className="w-6 h-6 md:w-8 md:h-8 shrink-0 grayscale-[0.5]"
                />
                <span className="font-medium text-sm md:text-lg tracking-tight">{feature}</span>
              </motion.div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="w-full flex flex-col gap-4 md:gap-6">
            <motion.a
              ref={buttonRef}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleClick}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className={cn(
                "relative rounded-full group overflow-hidden block",
                "bg-[#0071E3] hover:bg-[#0077ED]",
                "text-white font-medium text-base md:text-xl py-4 md:py-5 px-6 md:px-8",
                "shadow-sm hover:shadow-xl transition-all duration-300",
                "transform hover:scale-[1.02] active:scale-[0.98]"
              )}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {buttonText}
                <span className="text-xl md:text-2xl">→</span>
              </span>
            </motion.a>

            <p className="text-xs md:text-sm text-gray-500">
              🔒 Secure payment via Stripe • Instant download
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
