import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Check, Star, Tag, X } from "lucide-react";
import React, { useRef, useState } from "react";
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
  const [discountCode, setDiscountCode] = useState("");
  const [isDiscountApplied, setIsDiscountApplied] = useState(false);
  
  const DISCOUNT_CODE = "JOBWIN10";
  const DISCOUNT_PERCENT = 10;
  
  const handleDiscountCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const code = e.target.value.toUpperCase().trim();
    setDiscountCode(code);
    
    if (code === DISCOUNT_CODE) {
      setIsDiscountApplied(true);
    } else if (code === "") {
      setIsDiscountApplied(false);
    } else {
      setIsDiscountApplied(false);
    }
  };
  
  const handleApplyDiscount = () => {
    if (discountCode.toUpperCase().trim() === DISCOUNT_CODE) {
      setIsDiscountApplied(true);
    }
  };
  
  const handleRemoveDiscount = () => {
    setDiscountCode("");
    setIsDiscountApplied(false);
  };
  
  // Calculate discounted price
  const discountedPrice = isDiscountApplied 
    ? Math.round(price * (1 - DISCOUNT_PERCENT / 100) * 100) / 100
    : price;
  
  // Build checkout URL with promo code if discount is applied
  const checkoutUrl = isDiscountApplied 
    ? `${href}?promo_code=${DISCOUNT_CODE}`
    : href;
  
  const displayPrice = discountedPrice;
  const savings = originalPrice - displayPrice;
  const savingsPercent = Math.round((savings / originalPrice) * 100);

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
                {currency} {displayPrice.toFixed(2)}
              </span>
            </div>
            <span className="inline-flex items-center gap-1 bg-[#F2F2F7] text-[#34C759] px-3 py-1 rounded-full text-xs md:text-sm font-bold mt-2">
              💸 SAVE {savingsPercent}%
            </span>
            {isDiscountApplied && (
              <span className="inline-flex items-center gap-1 bg-[#34C759] text-white px-3 py-1 rounded-full text-xs md:text-sm font-bold mt-1 animate-pulse">
                ✓ 10% Discount Applied!
              </span>
            )}
          </div>
          
          {/* Discount Code Section */}
          <div className="mb-6 md:mb-8 max-w-md mx-auto">
            {!isDiscountApplied ? (
              <div className="flex flex-col gap-2">
                <label htmlFor="discount-code" className="text-sm font-medium text-[#86868B] text-center">
                  Have a discount code?
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86868B]" />
                    <input
                      id="discount-code"
                      type="text"
                      value={discountCode}
                      onChange={handleDiscountCodeChange}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleApplyDiscount();
                        }
                      }}
                      placeholder="Enter code (e.g., JOBWIN10)"
                      className="w-full pl-10 pr-4 py-3 border border-[#D2D2D7] rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#0071E3] focus:border-transparent"
                    />
                  </div>
                  <button
                    onClick={handleApplyDiscount}
                    disabled={!discountCode.trim()}
                    className={cn(
                      "px-6 py-3 bg-[#0071E3] text-white rounded-full font-medium text-sm",
                      "hover:bg-[#0077ED] transition-colors",
                      "disabled:opacity-50 disabled:cursor-not-allowed",
                      "focus:outline-none focus:ring-2 focus:ring-[#0071E3] focus:ring-offset-2"
                    )}
                  >
                    Apply
                  </button>
                </div>
                {discountCode && discountCode.toUpperCase().trim() !== DISCOUNT_CODE && discountCode.trim() !== "" && (
                  <p className="text-xs text-red-500 text-center mt-1">
                    Invalid code. Please try again.
                  </p>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-3">
                <span className="text-sm font-medium text-green-700">
                  ✓ Discount code <strong>{DISCOUNT_CODE}</strong> applied
                </span>
                <button
                  onClick={handleRemoveDiscount}
                  className="text-green-700 hover:text-green-900 transition-colors"
                  aria-label="Remove discount"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
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
              href={checkoutUrl}
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
