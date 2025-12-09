import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';

declare global {
  interface Window {
    gtag: any;
    fbq: any;
  }
}
declare var gtag: any;
declare var fbq: any;
import {
  Download,
  Quote,
  Star,
  Plus,
  Mail,
  ShieldCheck,
  Trophy
} from 'lucide-react';
import { Pricing } from '@/components/pricing';

// --- Utilities ---
const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');

// --- Data ---
const PAIN_POINTS = [
  {
    image: "https://i.imgur.com/CIwGgT0.jpeg",
    thought: "I thought the interview went well... why haven't they replied for 2 weeks?",
    stressLevel: 5,
    stressLabel: "CRITICAL"
  },
  {
    image: "https://i.imgur.com/0KWA3bV.jpeg",
    thought: "My hands are shaking. I hope they don't notice I'm sweating.",
    stressLevel: 4,
    stressLabel: "HIGH"
  },
  {
    image: "https://i.imgur.com/0rWxrTT.jpeg",
    thought: "I know the answer, why can't I speak? I'm rambling again.",
    stressLevel: 4,
    stressLabel: "MODERATE"
  },
  {
    image: "https://i.imgur.com/YQwah6P.jpeg",
    thought: "RM2,500? I have a degree. Should I just accept it?",
    stressLevel: 5,
    stressLabel: "SEVERE"
  },
  {
    image: "https://i.imgur.com/fna5wck.jpeg",
    thought: "I keep repeating the same mistakes because I have no system to review or improve.",
    stressLevel: 4,
    stressLabel: "STUCK"
  },
  {
    image: "https://i.imgur.com/2kp0moS.jpeg",
    thought: "I can’t show real proof of impact. My answers sound vague, not impressive.",
    stressLevel: 5,
    stressLabel: "FRUSTRATED"
  }
];

// --- Components ---

const AppleButton = ({ children, onClick, variant = 'primary', className = '', style = {} }: any) => {
  const baseStyle = "relative overflow-hidden group px-6 py-3 font-medium transition-all duration-300 flex items-center justify-center tracking-tight text-[15px] sm:text-[17px] rounded-full transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed";

  const variants: any = {
    primary: "bg-apple-blue text-white hover:bg-apple-blue-hover shadow-sm",
    secondary: "bg-[#F5F5F7] text-black hover:bg-[#E8E8ED]",
    outline: "bg-transparent text-apple-blue border border-apple-border hover:bg-apple-blue/5",
    ghost: "bg-transparent text-apple-blue hover:bg-apple-blue/10"
  };

  return (
    <button onClick={onClick} className={cn(baseStyle, variants[variant] || variants.primary, className)} style={style}>
      <span className="relative z-10 flex items-center justify-center gap-2 w-full">
        {children}
      </span>
    </button>
  );
};

const Section = ({ children, className = "", id = "" }: any) => (
  <section id={id} className={`px-5 py-16 md:py-28 max-w-[1024px] mx-auto relative ${className}`}>
    {children}
  </section>
);

const ShineBorder = ({
  borderWidth = 1,
  duration = 14,
  shineColor = "#000000",
  className,
  style,
  ...props
}: any) => {
  return (
    <div
      style={{
        "--border-width": `${borderWidth}px`,
        "--duration": `${duration}s`,
        backgroundImage: `radial-gradient(transparent,transparent, ${Array.isArray(shineColor) ? shineColor.join(",") : shineColor
          },transparent,transparent)`,
        backgroundSize: "300% 300%",
        mask: `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
        WebkitMask: `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
        WebkitMaskComposite: "xor",
        maskComposite: "exclude",
        padding: "var(--border-width)",
        ...style,
      } as any}
      className={cn(
        "motion-safe:animate-shine pointer-events-none absolute inset-0 size-full rounded-[inherit] will-change-[background-position] z-30",
        className
      )}
      {...props}
    />
  );
};

const Marquee = ({
  className,
  reverse = false,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 4,
  style = {},
  ...props
}: any) => {
  return (
    <div
      {...props}
      className={cn(
        "group flex overflow-hidden p-2",
        vertical ? "flex-col" : "flex-row",
        className
      )}
      style={{
        gap: 'var(--gap)',
        '--gap': '1rem',
        '--duration': '40s',
        ...style,
      } as any}
    >
      {Array(repeat)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className={cn(
              "flex shrink-0 justify-around gap-[var(--gap)]",
              !vertical ? "animate-marquee flex-row" : "animate-marquee-vertical flex-col",
              pauseOnHover ? "group-hover:[animation-play-state:paused]" : "",
              reverse ? "[animation-direction:reverse]" : ""
            )}
          >
            {children}
          </div>
        ))}
    </div>
  )
}

const PromoBar = ({ onClick }: any) => (
  <div
    onClick={onClick}
    className="fixed top-14 md:top-16 left-0 w-full h-7 md:h-8 bg-lime-400 z-40 flex items-center overflow-hidden cursor-pointer active:bg-lime-300 md:hover:bg-lime-300 transition-colors shadow-sm"
  >
    <Marquee className="py-0 [--gap:6rem] md:[--gap:8rem]" repeat={2} style={{ '--duration': '6s' } as any}>
      <div className="flex items-center gap-2 md:gap-3 font-bold font-display text-[10px] md:text-sm text-black tracking-widest uppercase whitespace-nowrap">
        <span className="animate-pulse text-xs md:text-sm">✦</span>
        <span>BUY NOW & SAVE RM33</span>
      </div>
    </Marquee>
  </div>
);

// Evergreen Countdown Timer - resets at midnight daily
const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(23, 59, 59, 999);

      const diff = midnight.getTime() - now.getTime();

      if (diff > 0) {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft({ hours, minutes, seconds });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  const TimeBox = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div className="bg-apple-text text-white font-bold font-display text-xl md:text-3xl w-12 h-12 md:w-16 md:h-16 rounded-lg flex items-center justify-center shadow-lg">
        {String(value).padStart(2, '0')}
      </div>
      <span className="text-[10px] md:text-xs text-apple-gray mt-1 uppercase tracking-wide">{label}</span>
    </div>
  );

  return (
    <div className="flex flex-col items-center mb-8">
      <p className="text-sm md:text-base text-apple-gray mb-3 font-medium">
        <span className="inline-block animate-shake">⏰</span> Offer ends in:
      </p>
      <div className="flex items-center gap-2 md:gap-3">
        <TimeBox value={timeLeft.hours} label="Hours" />
        <span className="text-2xl md:text-3xl font-bold text-apple-text -mt-5">:</span>
        <TimeBox value={timeLeft.minutes} label="Mins" />
        <span className="text-2xl md:text-3xl font-bold text-apple-text -mt-5">:</span>
        <TimeBox value={timeLeft.seconds} label="Secs" />
      </div>
    </div>
  );
};

const TextTicker = ({ items }: any) => {
  return (
    <div className="w-full py-1.5 md:py-2 my-2 md:my-4 overflow-hidden bg-apple-text text-white select-none relative shadow-md">
      <Marquee repeat={4} className="py-0" style={{ '--duration': '30s', '--gap': '2rem' }}>
        {items.map((item: any, i: number) => (
          <span key={i} className="flex items-center gap-4 md:gap-8 font-display font-bold text-sm md:text-lg tracking-wider opacity-90 uppercase">
            {item} <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-apple-blue rounded-full flex-shrink-0 shadow-[0_0_8px_#3B82F6]"></span>
          </span>
        ))}
      </Marquee>
    </div>
  );
};

const PainCard = ({ image, thought, stressLevel, stressLabel, delay, className = "" }: any) => (
  <div
    className={`relative w-full aspect-[3/4] overflow-hidden rounded-[24px] shadow-sm md:hover:shadow-md transition-all duration-500 md:hover:-translate-y-1 ${className}`}
    style={delay ? { transitionDelay: `${delay}ms` } : {}}
  >
    <img
      src={image || "https://placehold.co/600x800/png?text=Add+Image"}
      alt="Interview Pain Point"
      width={600}
      height={800}
      decoding="async"
      className="absolute inset-0 w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
    <div className="absolute bottom-4 left-4 right-4 bg-white/80 backdrop-blur-xl border border-white/40 rounded-[18px] p-5 text-apple-text shadow-sm">
      <div className="flex items-center gap-2 mb-2 text-apple-gray">
        <Quote size={12} className="fill-current rotate-180" />
        <span className="text-[11px] font-semibold uppercase tracking-wider opacity-80">Internal Monologue</span>
      </div>
      <p className="font-medium text-[17px] leading-snug mb-3 text-apple-text tracking-tight">
        "{thought}"
      </p>
      <div className="w-full h-px bg-black/5 mb-3"></div>
      <div className="flex items-center justify-between text-[11px] font-medium tracking-wide">
        <span className="text-apple-gray uppercase">Stress Level</span>
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className={`w-1.5 h-1.5 rounded-full ${i < stressLevel ? 'bg-red-500' : 'bg-black/10'}`}></div>
            ))}
          </div>
          <span className="text-red-500 font-bold">{stressLabel}</span>
        </div>
      </div>
    </div>
  </div>
);

const AutoSlider = ({ items }: any) => {
  const [index, setIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [itemsPerView, setItemsPerView] = useState(1);
  const timeoutRef = useRef(null);
  const containerRef = useRef(null);
  const PAUSE_DURATION = 3500;
  const TRANSITION_DURATION = 700;

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setItemsPerView(3);
      } else if (window.innerWidth >= 768) {
        setItemsPerView(2);
      } else {
        setItemsPerView(1);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const extendedItems = [...items, ...items];

  useEffect(() => {
    const nextSlide = () => {
      setIndex((prev: any) => prev + 1);
    };
    timeoutRef.current = setTimeout(nextSlide, PAUSE_DURATION);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [index]);

  useEffect(() => {
    if (index === items.length) {
      const resetTimeout = setTimeout(() => {
        setIsTransitioning(false);
        setIndex(0);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setIsTransitioning(true);
          });
        });
      }, TRANSITION_DURATION);
      return () => clearTimeout(resetTimeout);
    }
  }, [index, items.length]);

  return (
    <div className="w-full overflow-hidden py-6 md:py-10" ref={containerRef}>
      <div
        className="flex"
        style={{
          transform: `translateX(-${index * (100 / extendedItems.length)}%)`,
          transition: isTransitioning ? `transform ${TRANSITION_DURATION}ms cubic-bezier(0.2, 0.8, 0.2, 1)` : 'none',
          width: `${(extendedItems.length / itemsPerView) * 100}%`
        }}
      >
        {extendedItems.map((item: any, i: number) => (
          <div
            key={i}
            className="px-3 md:px-4"
            style={{ width: `${100 / extendedItems.length}%` }}
          >
            <PainCard {...item} className="h-full" />
          </div>
        ))}
      </div>
    </div>
  );
};

const TestimonialCard = ({ name, quote, result, className = "" }: any) => (
  <div
    className={cn(
      "bg-white p-5 md:p-8 shadow-sm md:hover:shadow-md border border-gray-100 rounded-2xl transition-all duration-300 relative flex flex-col w-[280px] md:w-[380px] shrink-0 mx-2 md:mx-4",
      className
    )}
  >
    <div className="absolute top-4 right-4 md:top-6 md:right-6 bg-apple-bg text-apple-text border border-gray-200 px-2 py-0.5 md:px-3 md:py-1 rounded-full font-bold font-display text-[9px] md:text-[10px] uppercase tracking-wide flex items-center gap-1">
      <Trophy className="w-2.5 h-2.5 md:w-3 md:h-3 text-apple-blue fill-current" />
      <span className="hidden xs:inline">{result}</span>
      <span className="xs:hidden">{result.split(' ')[0]}</span>
    </div>
    <div className="flex items-center gap-0.5 md:gap-1 mb-4 md:mb-6 text-apple-blue">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className="w-3.5 h-3.5 md:w-4 md:h-4 fill-current" />
      ))}
    </div>
    <p className="font-medium text-sm md:text-lg leading-relaxed mb-4 md:mb-6 text-apple-text/80 line-clamp-4 md:line-clamp-none">
      "{quote}"
    </p>
    <div className="mt-auto pt-4 md:pt-5 border-t border-gray-50">
      <p className="font-bold text-sm text-apple-text font-display">{name}</p>
    </div>
  </div>
);

const FAQItem = ({ question, answer }: any) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`bg-white mb-3 md:mb-4 rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-300 ${isOpen ? 'ring-2 ring-apple-blue/20 shadow-md' : ''}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 md:p-6 text-left font-bold text-apple-text text-sm md:text-lg active:bg-gray-50 md:hover:bg-gray-50 transition-colors min-h-[56px]"
      >
        <span className="mr-3 md:mr-4 font-display leading-tight">{question}</span>
        <div className={`w-8 h-8 md:w-8 md:h-8 rounded-full flex items-center justify-center bg-gray-100 text-gray-500 transition-all duration-300 shrink-0 ${isOpen ? 'bg-apple-blue text-white rotate-45' : ''}`}>
          <Plus className="w-4 h-4 md:w-5 md:h-5" />
        </div>
      </button>
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="px-4 md:px-6 pb-4 md:pb-6 pt-0 text-apple-gray leading-relaxed text-sm">
          {answer}
        </div>
      </div>
    </div>
  );
};

// Final CTA Component
const FinalCTA = ({ onCtaClick }: { onCtaClick?: () => void }) => {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(23, 59, 59, 999);
      const diff = midnight.getTime() - now.getTime();
      if (diff > 0) {
        setTimeLeft({
          hours: Math.floor(diff / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000),
        });
      }
    };
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  const benefits = [
    { icon: "📚", text: "50+ Page System" },
    { icon: "🔄", text: "Lifetime Updates" },
    { icon: "⭐", text: "STAR Method" },
    { icon: "💰", text: "Salary Scripts" },
  ];

  const stats = [
    { value: "100+", label: "Malaysians" },
    { value: "4.7", label: "Rating" },
    { value: "Instant", label: "Download" },
  ];

  return (
    <section className="relative bg-apple-text py-16 md:py-24 overflow-hidden">
      {/* Radial gradient overlay - same as solution section */}
      <div className="absolute top-0 right-0 w-full h-full opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-500 via-transparent to-transparent"></div>

      <div className="max-w-4xl mx-auto px-4 relative z-10">
        {/* FOMO Headline */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-5xl font-bold font-display text-white mb-3 md:mb-4 leading-tight">
            Join 100+ Malaysians Who<br className="hidden md:block" /> Stopped Failing Interviews
          </h2>
          <p className="text-white/80 text-sm md:text-lg max-w-xl mx-auto">
            Your next interview could be the one that changes everything.
          </p>
        </div>

        {/* Quick Benefits Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8 md:mb-10">
          {benefits.map((benefit, i) => (
            <div key={i} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-3 md:p-4 text-center">
              <span className="text-2xl md:text-3xl mb-1 block">{benefit.icon}</span>
              <span className="text-white font-medium text-xs md:text-sm">{benefit.text}</span>
            </div>
          ))}
        </div>

        {/* Social Proof Stats Bar */}
        <div className="flex justify-center items-center gap-4 md:gap-8 mb-8 md:mb-10">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-white font-bold font-display text-xl md:text-3xl">{stat.value}</div>
              <div className="text-white/60 text-xs md:text-sm uppercase tracking-wide">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Mini Testimonial - styled like TestimonialCard */}
        <div className="bg-white p-5 md:p-8 shadow-md border border-gray-100 rounded-2xl relative flex flex-col max-w-md mx-auto mb-8 md:mb-10">
          <div className="absolute top-4 right-4 md:top-6 md:right-6 bg-apple-bg text-apple-text border border-gray-200 px-2 py-0.5 md:px-3 md:py-1 rounded-full font-bold font-display text-[9px] md:text-[10px] uppercase tracking-wide flex items-center gap-1">
            <Trophy className="w-2.5 h-2.5 md:w-3 md:h-3 text-apple-blue fill-neo-yellow" />
            <span>Beat 50 Applicants</span>
          </div>
          <div className="flex items-center gap-0.5 md:gap-1 mb-4 md:mb-6 text-apple-blue">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 md:w-4 md:h-4 fill-current" />
            ))}
          </div>
          <p className="font-medium text-sm md:text-lg leading-relaxed mb-4 md:mb-6 text-apple-text/80">
            "I didn't know what I was doing wrong until I read the 'Psychology of Hiring Managers' section. Total game changer."
          </p>
          <div className="mt-auto pt-4 md:pt-5 border-t border-gray-50">
            <p className="font-bold text-sm text-apple-text font-display">Nurul Ain Samsudin</p>
          </div>
        </div>

        {/* Compact Pricing Card */}
        <div className="bg-white rounded-2xl md:rounded-3xl p-5 md:p-8 shadow-2xl text-center max-w-lg mx-auto mb-6 md:mb-8">
          {/* Price */}
          <div className="mb-4 md:mb-6">
            <span className="text-gray-400 line-through text-sm md:text-lg font-display">RM 112</span>
            <div className="text-4xl md:text-6xl font-bold font-display text-apple-text tracking-tight">
              RM 79
            </div>
            <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold mt-2">
              💸 SAVE 30%
            </span>
          </div>

          {/* Countdown */}
          <div className="mb-5 md:mb-6">
            <p className="text-xs md:text-sm text-apple-gray mb-2">
              <span className="inline-block animate-shake">⏰</span> Offer ends in:
            </p>
            <div className="flex justify-center items-center gap-2">
              <div className="bg-apple-text text-white font-bold font-display text-lg md:text-2xl w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center">
                {String(timeLeft.hours).padStart(2, '0')}
              </div>
              <span className="text-apple-text font-bold">:</span>
              <div className="bg-apple-text text-white font-bold font-display text-lg md:text-2xl w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center">
                {String(timeLeft.minutes).padStart(2, '0')}
              </div>
              <span className="text-apple-text font-bold">:</span>
              <div className="bg-apple-text text-white font-bold font-display text-lg md:text-2xl w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center">
                {String(timeLeft.seconds).padStart(2, '0')}
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <a
            href="https://buy.stripe.com/cNi4gtbTjafu7Mwf8LafS02"
            target="_blank"
            rel="noopener noreferrer"
            onClick={onCtaClick}
            className="block w-full bg-gradient-to-r from-apple-blue via-pink-500 to-purple-600 bg-[length:300%_300%] animate-gradient-flow text-white font-bold text-base md:text-xl py-4 md:py-5 px-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            Get Instant Access →
          </a>
        </div>

        {/* Trust Signals */}
        <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 text-white/70 text-xs md:text-sm">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 md:w-5 md:h-5" />
            <span>Secure Stripe Payment</span>
          </div>
          <div className="flex items-center gap-2">
            <Download className="w-4 h-4 md:w-5 md:h-5" />
            <span>Instant Download</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 md:w-5 md:h-5 fill-current text-apple-blue" />
            <span>100% Satisfaction</span>
          </div>
        </div>
      </div>
    </section>
  );
};

// Legal Modal Component
const LegalModal = ({ isOpen, onClose, title, children }: any) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      <div
        className="relative bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold font-display text-apple-text">{title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
          >
            ✕
          </button>
        </div>
        <div className="px-6 py-6 overflow-y-auto max-h-[calc(85vh-80px)] text-sm text-apple-gray leading-relaxed space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
};

const TermsContent = () => (
  <>
    <p className="text-xs text-gray-400">Last updated: November 30, 2025</p>

    <h3 className="font-bold text-apple-text text-base mt-4">1. Agreement to Terms</h3>
    <p>By purchasing and downloading the "Interview Success Blueprint" from pushupmode, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not purchase or use the product.</p>

    <h3 className="font-bold text-apple-text text-base mt-4">2. Digital Product</h3>
    <p>The Interview Success Blueprint is a digital product (PDF eBook) delivered electronically. Upon successful payment, you will receive immediate access to download the product via email.</p>

    <h3 className="font-bold text-apple-text text-base mt-4">3. No Refund Policy</h3>
    <p>Due to the digital nature of this product, <strong>all sales are final and non-refundable</strong>. Once the product has been delivered/downloaded, no refunds will be issued. Please ensure you understand this policy before making a purchase.</p>

    <h3 className="font-bold text-apple-text text-base mt-4">4. Intellectual Property</h3>
    <p>All content within the Interview Success Blueprint, including text, graphics, and design, is the intellectual property of pushupmode and is protected by copyright laws. Unauthorized reproduction, distribution, or resale of this product is strictly prohibited.</p>

    <h3 className="font-bold text-apple-text text-base mt-4">5. Personal Use License</h3>
    <p>Your purchase grants you a personal, non-transferable, non-exclusive license to use the Interview Success Blueprint for your own personal and professional development. You may not share, distribute, or resell the product.</p>

    <h3 className="font-bold text-apple-text text-base mt-4">6. Disclaimer</h3>
    <p>The information provided in this product is for educational purposes only. Results may vary based on individual effort and circumstances. We do not guarantee specific outcomes such as job offers or salary increases.</p>

    <h3 className="font-bold text-apple-text text-base mt-4">7. Contact</h3>
    <p>For questions regarding these terms, please contact us at <a href="mailto:hello@pushupmode.com" className="text-apple-blue hover:underline">hello@pushupmode.com</a>.</p>
  </>
);

const PrivacyContent = () => (
  <>
    <p className="text-xs text-gray-400">Last updated: November 30, 2025</p>

    <h3 className="font-bold text-apple-text text-base mt-4">1. Information We Collect</h3>
    <p>When you purchase the Interview Success Blueprint, we collect:</p>
    <ul className="list-disc list-inside ml-2 space-y-1">
      <li>Email address (for product delivery)</li>
      <li>Payment information (processed securely by Stripe)</li>
      <li>Name (if provided during checkout)</li>
    </ul>

    <h3 className="font-bold text-apple-text text-base mt-4">2. How We Use Your Information</h3>
    <p>We use your information to:</p>
    <ul className="list-disc list-inside ml-2 space-y-1">
      <li>Deliver your purchased product</li>
      <li>Send purchase confirmation and receipt</li>
      <li>Provide customer support</li>
      <li>Send product updates (if applicable)</li>
    </ul>

    <h3 className="font-bold text-apple-text text-base mt-4">3. Payment Processing</h3>
    <p>All payments are processed securely through Stripe. We do not store your credit card information on our servers. Stripe's privacy policy governs the handling of your payment data.</p>

    <h3 className="font-bold text-apple-text text-base mt-4">4. Data Sharing</h3>
    <p>We do not sell, trade, or share your personal information with third parties except as necessary to process your order (e.g., payment processor) or as required by law.</p>

    <h3 className="font-bold text-apple-text text-base mt-4">5. Data Security</h3>
    <p>We implement appropriate security measures to protect your personal information. However, no method of transmission over the internet is 100% secure.</p>

    <h3 className="font-bold text-apple-text text-base mt-4">6. Your Rights</h3>
    <p>You have the right to:</p>
    <ul className="list-disc list-inside ml-2 space-y-1">
      <li>Request access to your personal data</li>
      <li>Request correction of inaccurate data</li>
      <li>Request deletion of your data</li>
      <li>Opt-out of marketing communications</li>
    </ul>

    <h3 className="font-bold text-apple-text text-base mt-4">7. Contact</h3>
    <p>For privacy-related inquiries, please contact us at <a href="mailto:hello@pushupmode.com" className="text-apple-blue hover:underline">hello@pushupmode.com</a>.</p>
  </>
);

const FAQSection = () => {
  const faqs = [
    {
      question: "Is this a physical book?",
      answer: "No, this is a digital eBook (PDF). You will receive an instant download link via email immediately after purchase."
    },
    {
      question: "Is this suitable for fresh graduates?",
      answer: "Absolutely. We cover foundational skills, mindset shifts, and anxiety management techniques designed for first-time job seekers."
    },
    {
      question: "I have 5+ years experience. Is this for me?",
      answer: "Yes. Chapters like 'Personal Branding' and 'Strategic Salary Negotiation' are tailored for experienced professionals."
    },
    {
      question: "Can I read this on my phone?",
      answer: "Yes. The blueprint is formatted to be easily readable on all devices: smartphones, tablets, and desktops."
    },
    {
      question: "Do you offer refunds?",
      answer: (
        <span>
          Due to the digital nature of this product, <strong>all sales are final</strong>. Questions? Email <a href="mailto:hello@pushupmode.com" className="text-apple-blue active:underline md:hover:underline font-bold">hello@pushupmode.com</a>.
        </span>
      )
    }
  ];

  return (
    <Section className="py-10 md:py-24 max-w-4xl">
      <div className="text-center mb-8 md:mb-16 reveal">
        <span className="bg-blue-50 text-apple-blue px-2 md:px-3 py-1 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider mb-3 md:mb-4 inline-block font-display">Support</span>
        <h2 className="text-2xl md:text-4xl font-bold font-display text-apple-text mb-2 md:mb-4">
          Frequently Asked Questions
        </h2>
        <p className="text-apple-gray text-sm md:text-base">Everything you need to know about the blueprint.</p>
      </div>

      <div className="reveal flex flex-col">
        {faqs.map((faq, i) => (
          <FAQItem key={i} question={faq.question} answer={faq.answer} />
        ))}
      </div>
    </Section>
  );
};

const App = () => {
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollToPricing = () => {
    document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
  };

  const reviews = [
    {
      name: "Amirul Hakim bin Zulkifli",
      quote: "I failed 5 interviews in a row. This book showed me I was rambling. Used the STAR method and got an offer 2 weeks later.",
      result: "Secured RM4.5k Job"
    },
    {
      name: "Tan Wei Ling",
      quote: "I was terrified of salary negotiation. The script in Chapter 4 gave me the exact words. I asked for RM500 more and they said yes.",
      result: "+20% Salary Bump"
    },
    {
      name: "Muhammad Haziq bin Roslan",
      quote: "As a fresh grad with no experience, I had zero confidence. The preparation checklist helped me calm my nerves.",
      result: "Hired in 1 Month"
    },
    {
      name: "Priya a/p Subramaniam",
      quote: "The personal branding toolkit is insane. I learned how to frame my 'weaknesses' as growth opportunities.",
      result: "Landed MNC Role"
    },
    {
      name: "Lim Kah Seng",
      quote: "Worth every cent. The body language tips alone changed how I enter the room. I felt in control for the first time.",
      result: "Confident & Hired"
    },
    {
      name: "Nurul Izzati binti Ahmad",
      quote: "I didn't know what I was doing wrong until I read the 'Psychology of Hiring Managers' section. Total game changer.",
      result: "Beat 50 Applicants"
    },
    {
      name: "Farid Arif bin Mohamad",
      quote: "The mock interview questions saved me. I practiced every single one and nailed my final interview at Petronas.",
      result: "Dream Job Landed"
    },
    {
      name: "Siti Nur Amira binti Ismail",
      quote: "I used to freeze when asked 'Tell me about yourself'. Now I have a 60-second pitch that impresses every interviewer.",
      result: "Multiple Offers"
    }
  ];

  return (
    <div className="min-h-screen bg-apple-bg text-apple-text font-sans selection:bg-apple-blue selection:text-white">

      <nav className="fixed top-0 left-0 w-full h-[52px] md:h-[64px] z-50 bg-white/70 backdrop-blur-xl border-b border-white/20 transition-all duration-300">
        <div className="max-w-[980px] mx-auto px-4 h-full flex justify-between items-center">
          <div className="font-semibold text-[19px] tracking-tight flex items-center gap-2 text-apple-text">
            pushupmode <span className="text-lg">🇲🇾</span>
          </div>
          <AppleButton onClick={scrollToPricing} variant="primary" className="text-[12px] md:text-[13px] px-3 md:px-4 py-1.5 md:py-1.5 h-[28px] md:h-[32px] rounded-full">
            <span className="hidden sm:inline">Get Blueprint</span>
            <span className="sm:hidden">Get It</span>
          </AppleButton>
        </div>
      </nav>

      <PromoBar onClick={scrollToPricing} />

      {/* HERO SECTION */}
      <Section className="pt-[6rem] md:pt-28 pb-8 md:pb-32 flex flex-col items-center text-center relative z-10 mt-0">
        <div className="max-w-4xl mx-auto mb-4 md:mb-16 flex flex-col items-center">
          <div className="reveal inline-flex items-center gap-1 md:gap-2 px-2 md:px-4 py-1 md:py-1.5 mb-3 md:mb-8 bg-black border border-gray-800 rounded-full shadow-sm text-[8px] md:text-sm font-bold text-white uppercase tracking-wide font-display whitespace-nowrap">
            🏆 Go-To Blueprint for Malaysian Job Seekers (100+ Users) 🇲🇾
          </div>
          <h1 className="reveal text-[1.75rem] sm:text-3xl md:text-7xl font-bold font-display leading-tight tracking-tight mb-4 md:mb-6 text-apple-text">
            DOES THIS SOUND <br className="md:hidden" />
            LIKE&nbsp;<span className="text-apple-blue relative inline-block px-1 md:px-2">
              YOU?
              <svg className="absolute w-full h-2 md:h-3 -bottom-0.5 md:-bottom-1 left-0 text-apple-blue opacity-80" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
              </svg>
            </span>
          </h1>
        </div>

        <div className="w-full max-w-7xl -mx-4 md:mx-0">
          <AutoSlider items={PAIN_POINTS} />
        </div>

        <div className="mt-4 md:mt-12 flex-col items-center animate-reveal hidden md:flex" style={{ animationDelay: '1s' }}>
          <div className="flex flex-col items-center gap-1 animate-bounce">
            <span className="text-apple-gray text-xs uppercase tracking-widest font-medium">Scroll</span>
            <svg className="w-6 h-6 text-apple-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </Section>

      <TextTicker items={[
        "Why didn't they call back?",
        "Am I not good enough?",
        "I need a job now",
        "Tired of rejections"
      ]} />

      {/* SOLUTION SECTION */}
      <Section id="solution" className="py-8 md:py-24">
        <div className="reveal bg-apple-text text-white rounded-2xl md:rounded-3xl p-5 md:p-20 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-full opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-500 via-transparent to-transparent"></div>

          <div className="relative z-10 grid md:grid-cols-2 gap-6 md:gap-16 items-center">
            <div>
              <div className="inline-block px-3 md:px-4 py-1 rounded-full bg-white/10 border border-white/20 text-xs md:text-sm font-bold mb-4 md:mb-6 text-blue-300 font-display">THE SOLUTION</div>
              <h2 className="text-2xl md:text-6xl font-bold font-display mb-4 md:mb-6 leading-tight tracking-tight">
                Interview Success <span className="text-blue-400">Blueprint</span>
              </h2>
              <p className="text-base md:text-lg text-gray-300 mb-6 md:mb-10 leading-relaxed">
                This isn't generic advice. It's a 50+ page tactical war manual for your career, designed to turn you into the candidate they <i>must</i> hire.
              </p>

              <ul className="space-y-3 md:space-y-5 mb-6 md:mb-10">
                {[
                  "Psychology of Hiring Managers",
                  "STAR Method Deconstructed",
                  "Salary Negotiation Scripts",
                  "Body Language Mastery"
                ].map((item, i) => (
                  <li key={i} className="reveal flex items-center gap-3 md:gap-4 font-medium text-sm md:text-lg" style={{ transitionDelay: `${i * 100 + 200}ms` }}>
                    <img
                      src="https://img.icons8.com/3d-fluency/94/verified-account.png"
                      alt="verified"
                      width={94}
                      height={94}
                      loading="lazy"
                      decoding="async"
                      className="w-6 h-6 md:w-7 md:h-7 shrink-0"
                    />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="hidden md:inline-block relative rounded-xl group overflow-hidden">
                <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} duration={8} borderWidth={2} />
                <AppleButton onClick={scrollToPricing} style={{ color: '#000000', backgroundColor: '#ffffff' }} className="relative z-20 w-auto justify-center !bg-white !text-black hover:bg-gray-50 border-none !shadow-none hover:!shadow-none hover:shadow-none rounded-xl">
                  Get Instant Access
                </AppleButton>
              </div>
            </div>

            <div className="reveal flex flex-col justify-center items-center gap-4 md:gap-8" style={{ transitionDelay: '300ms' }}>
              <div className="relative w-48 md:w-80 aspect-[3/4] rounded-lg shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] md:shadow-[0_35px_60px_-15px_rgba(0,0,0,0.5)] group">
                <img
                  src="https://i.imgur.com/uvNoPCg.jpeg"
                  alt="Interview Success Blueprint Book Cover"
                  width={600}
                  height={800}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover rounded-lg border border-white/10"
                />
              </div>

              <div className="flex md:hidden relative rounded-xl group justify-center overflow-hidden w-full max-w-[200px]">
                <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} duration={8} borderWidth={2} />
                <AppleButton onClick={scrollToPricing} style={{ color: '#000000', backgroundColor: '#ffffff' }} className="relative z-20 w-full justify-center !bg-white !text-black active:bg-gray-100 border-none !shadow-none rounded-xl text-sm">
                  Buy Now
                </AppleButton>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section className="py-8 md:py-12">
        <div className="text-center mb-8 md:mb-16">
          <h2 className="reveal text-2xl md:text-4xl font-bold font-display mb-3 md:mb-4 text-apple-text">What's Inside The Blueprint?</h2>
          <p className="text-apple-gray text-sm md:text-base">Six comprehensive chapters covering every aspect of the interview process.</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
          {[
            { id: "01", title: "The Mindset", desc: "Transform anxiety into fuel and build unshakeable confidence." },
            { id: "02", title: "Winning Responses", desc: "Master the STAR method and build a 'Response Library'." },
            { id: "03", title: "Personal Branding", desc: "Define your 'Impact Style' and articulate your value." },
            { id: "04", title: "Non-Verbal Mastery", desc: "Master body language and vocal presence to project authority." },
            { id: "05", title: "Tough Tactics", desc: "Handle curveballs with the 'PAUSE' method and negotiation scripts." },
            { id: "06", title: "Long-Term Mastery", desc: "Turn every interview into a stepping stone for career growth." }
          ].map((item, i) => (
            <div key={i} className="reveal bg-white p-4 md:p-8 rounded-xl md:rounded-2xl border border-gray-100 shadow-sm md:hover:shadow-xl md:hover:border-blue-100 md:hover:bg-gray-50 md:hover:-translate-y-1 transition-all duration-300 group" style={{ transitionDelay: `${i * 50}ms` }}>
              <div className="font-mono text-xs md:text-sm font-bold text-apple-blue mb-2 md:mb-4 bg-blue-50 w-fit px-1.5 md:px-2 py-0.5 md:py-1 rounded-md">{item.id}</div>
              <h3 className="font-bold font-display text-sm md:text-xl mb-2 md:mb-3 text-apple-text md:group-hover:text-apple-blue transition-colors leading-tight">{item.title}</h3>
              <p className="text-apple-gray leading-relaxed text-xs md:text-sm line-clamp-3 md:line-clamp-none">{item.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      <div className="bg-white py-10 md:py-24 overflow-hidden border-y border-gray-100">
        <div className="text-center mb-8 md:mb-16 px-4">
          <h2 className="reveal text-2xl md:text-4xl font-bold font-display mb-2 md:mb-4 text-apple-text">Real Malaysians, Real Results</h2>
          <p className="reveal text-apple-gray max-w-2xl mx-auto text-sm md:text-lg" style={{ transitionDelay: '100ms' }}>
            See how the blueprint helped candidates secure their dream roles.
          </p>
        </div>

        <div className="reveal" style={{ transitionDelay: '200ms' }}>
          <Marquee repeat={3} className="[--duration:30s] md:[--duration:40s] py-2 md:py-4">
            {reviews.map((review, i) => (
              <TestimonialCard key={i} {...review} />
            ))}
          </Marquee>
        </div>

        <div className="reveal" style={{ transitionDelay: '300ms' }}>
          <Marquee reverse repeat={3} className="[--duration:40s] md:[--duration:50s] mt-2 md:mt-4 py-2 md:py-4">
            {reviews.map((review, i) => (
              <TestimonialCard key={i} {...review} />
            ))}
          </Marquee>
        </div>
      </div>

      <div id="pricing" className="relative bg-apple-text py-12 md:py-32 overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-500 via-transparent to-transparent"></div>

        <Pricing
          title="Steal The Job"
          description="One-time investment for career success"
          price={79}
          originalPrice={112}
          currency="RM"
          features={[
            "Lifetime access & free updates",
            "50+ page Step-by-step System",
            "Full STAR Method breakdown",
            "Confidence-building exercises",
            "Salary negotiation scripts",
            "Body language techniques",
            "Personal branding toolkit",
            "Tough interview formats"
          ]}
          buttonText="Download Blueprint Now"
          href="https://buy.stripe.com/cNi4gtbTjafu7Mwf8LafS02"
          badgeText="🔥 Best Value"
          lifetimeText="LIFETIME ACCESS"
          countdownComponent={<CountdownTimer />}
          onButtonClick={() => {
            // GA4 Event
            if (typeof gtag !== 'undefined') {
              gtag('event', 'begin_checkout', {
                currency: 'MYR',
                value: 79,
                items: [{ item_name: 'Interview Success Blueprint', price: 79 }]
              });
            }
            // Meta Pixel Event
            if (typeof fbq !== 'undefined') {
              fbq('track', 'InitiateCheckout', { currency: 'MYR', value: 79 });
            }
          }}
        />
      </div>

      {/* FAQ SECTION */}
      <FAQSection />

      {/* Final CTA Section */}
      <FinalCTA
        onCtaClick={() => {
          // GA4 Event
          if (typeof gtag !== 'undefined') {
            gtag('event', 'begin_checkout', {
              currency: 'MYR',
              value: 79,
              items: [{ item_name: 'Interview Success Blueprint', price: 79 }]
            });
          }
          // Meta Pixel Event
          if (typeof fbq !== 'undefined') {
            fbq('track', 'InitiateCheckout', { currency: 'MYR', value: 79 });
          }
        }}
      />

      {/* Still Have Questions */}
      <div className="bg-apple-bg py-10 md:py-16 px-4">
        <div className="max-w-xl mx-auto text-center bg-white p-5 md:p-8 rounded-xl md:rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-apple-gray mb-3 md:mb-4 text-sm md:text-base">Still have questions?</p>
          <a href="mailto:hello@pushupmode.com" className="inline-flex items-center gap-2 font-bold text-apple-text active:text-apple-blue md:hover:text-apple-blue transition-colors text-sm md:text-lg font-display">
            <Mail className="w-4 h-4 md:w-5 md:h-5" /> hello@pushupmode.com
          </a>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white py-10 md:py-16 px-4 border-t border-gray-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8">
          <div className="font-bold font-display text-lg md:text-xl flex items-center gap-2 text-apple-text">
            pushupmode <span className="text-xl md:text-2xl">🇲🇾</span>
          </div>
          <div className="flex items-center gap-4 text-xs md:text-sm text-apple-gray">
            <button onClick={() => setShowTerms(true)} className="hover:text-apple-blue active:text-apple-blue transition-colors">
              Terms & Conditions
            </button>
            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
            <button onClick={() => setShowPrivacy(true)} className="hover:text-apple-blue active:text-apple-blue transition-colors">
              Privacy Policy
            </button>
          </div>
          <div className="text-center md:text-right">
            <p className="text-xs md:text-sm text-apple-gray">© 2025 pushupmode. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Legal Modals */}
      <LegalModal isOpen={showTerms} onClose={() => setShowTerms(false)} title="Terms & Conditions">
        <TermsContent />
      </LegalModal>
      <LegalModal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} title="Privacy Policy">
        <PrivacyContent />
      </LegalModal>

    </div>
  );
};

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);