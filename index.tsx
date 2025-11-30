import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Download,
  Quote,
  Star,
  Plus,
  Minus,
  Mail,
  ShieldCheck,
  Trophy
} from 'lucide-react';

// --- Utilities ---
const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

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

const NeoButton = ({ children, onClick, variant = 'primary', className = '', style = {} }: any) => {
  // Modern Corporate Style: Rounded-full, soft shadows, no thick borders
  const baseStyle = "px-8 py-3 font-display font-bold transition-all duration-300 flex items-center gap-2 tracking-wide text-sm md:text-base rounded-full transform active:scale-95";
  
  const variants = {
    primary: "bg-neo-orange text-white shadow-lg shadow-neo-orange/30 hover:shadow-xl hover:shadow-neo-orange/40 hover:-translate-y-0.5",
    secondary: "bg-white text-neo-black border border-gray-200 shadow-sm hover:border-neo-orange hover:text-neo-orange",
    outline: "bg-transparent text-neo-orange border border-neo-orange hover:bg-neo-orange/5"
  };

  return (
    <button onClick={onClick} className={`${baseStyle} ${variants[variant as keyof typeof variants]} ${className}`} style={style}>
      {children}
    </button>
  );
};

const Section = ({ children, className = "", id = "" }: any) => (
  <section id={id} className={`px-4 py-16 md:py-32 max-w-7xl mx-auto relative ${className}`}>
    {children}
  </section>
);

// Shine Border Component
interface ShineBorderProps extends React.HTMLAttributes<HTMLDivElement> {
  borderWidth?: number;
  duration?: number;
  shineColor?: string | string[];
  className?: string;
  style?: React.CSSProperties;
}

const ShineBorder = ({
  borderWidth = 1,
  duration = 14,
  shineColor = "#000000",
  className,
  style,
  ...props
}: ShineBorderProps) => {
  return (
    <div
      style={
        {
          "--border-width": `${borderWidth}px`,
          "--duration": `${duration}s`,
          backgroundImage: `radial-gradient(transparent,transparent, ${
            Array.isArray(shineColor) ? shineColor.join(",") : shineColor
          },transparent,transparent)`,
          backgroundSize: "300% 300%",
          mask: `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
          WebkitMask: `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          padding: "var(--border-width)",
          ...style,
        } as React.CSSProperties
      }
      className={cn(
        "motion-safe:animate-shine pointer-events-none absolute inset-0 size-full rounded-[inherit] will-change-[background-position] z-30",
        className
      )}
      {...props}
    />
  );
};

// Reusable Marquee Component
interface MarqueeProps extends React.ComponentPropsWithoutRef<"div"> {
    className?: string;
    reverse?: boolean;
    pauseOnHover?: boolean;
    vertical?: boolean;
    repeat?: number;
    children?: React.ReactNode;
    style?: React.CSSProperties;
}

const Marquee = ({
  className,
  reverse = false,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 4,
  style,
  ...props
}: MarqueeProps) => {
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
      } as React.CSSProperties}
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

const PromoBar = ({ onClick }: { onClick: () => void }) => (
  <div 
    onClick={onClick}
    className="fixed top-16 left-0 w-full h-8 bg-lime-400 z-40 flex items-center overflow-hidden cursor-pointer hover:bg-lime-400 transition-colors shadow-sm"
  >
    <Marquee className="py-0 [--duration:10s] [--gap:3rem]" repeat={20}>
      <div className="flex items-center gap-3 font-bold font-display text-xs md:text-sm text-black tracking-widest uppercase">
        <span className="animate-pulse text-sm">✦</span>
        <span>BUY NOW & SAVE RM33</span>
      </div>
    </Marquee>
  </div>
);

// Clean Ticker for Corporate Look
const TextTicker = ({ items }: any) => {
  return (
    <div className="w-full py-2 my-4 overflow-hidden bg-neo-black text-white select-none relative shadow-md">
        <Marquee repeat={4} className="py-0" style={{ '--duration': '30s', '--gap': '3rem' } as React.CSSProperties}>
            {items.map((item: string, i: number) => (
                <span key={i} className="flex items-center gap-8 font-display font-bold text-lg tracking-wider opacity-90">
                {item} <span className="w-2 h-2 bg-neo-yellow rounded-full flex-shrink-0 shadow-[0_0_8px_#FACC15]"></span>
                </span>
            ))}
        </Marquee>
    </div>
  );
};

const PainCard = ({ image, thought, stressLevel, stressLabel, delay, className = "" }: any) => (
  <div 
    className={`relative w-full aspect-[3/4] bg-white shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 overflow-hidden rounded-2xl border border-gray-100 ${className}`}
    style={delay ? { transitionDelay: `${delay}ms` } : {}}
  >
    {/* Image Background */}
    <img 
      src={image || "https://placehold.co/600x800/png?text=Add+Image"} 
      alt="Interview Pain Point" 
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105" 
    />
    
    {/* Professional Gradient Overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/40 to-transparent opacity-95"></div>

    {/* Glassmorphism Box */}
    <div className="absolute bottom-4 left-4 right-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-5 text-white shadow-lg">
        <div className="flex items-center gap-2 mb-3 text-red-300">
            <Quote size={14} className="fill-current rotate-180" />
            <span className="text-[10px] font-bold font-display uppercase tracking-wider opacity-80">Internal Monologue</span>
        </div>
        
        <p className="font-medium text-lg leading-snug mb-4 font-sans text-white">
          "{thought}"
        </p>
        
        <div className="w-full h-px bg-white/10 mb-3"></div>
        
        <div className="flex items-center justify-between text-[11px] font-medium tracking-wide">
            <span className="text-gray-300 font-display">STRESS INDICATOR</span>
            <div className="flex items-center gap-1.5">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i < stressLevel ? 'bg-red-400 shadow-[0_0_5px_rgba(248,113,113,0.8)]' : 'bg-white/10'}`}></div>
                ))}
                <span className="ml-2 text-red-300 font-bold font-display">{stressLabel}</span>
            </div>
        </div>
    </div>
  </div>
);

const AutoSlider = ({ items }: { items: any[] }) => {
  const [index, setIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [itemsPerView, setItemsPerView] = useState(1);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Configuration
  const PAUSE_DURATION = 3500; // Time to read (ms)
  const TRANSITION_DURATION = 700; // Animation time (ms)

  // Handle responsiveness
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
    
    handleResize(); // Init
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Extended list for looping
  const extendedItems = [...items, ...items];

  // Auto-play Logic
  useEffect(() => {
    const nextSlide = () => {
      setIndex((prev) => prev + 1);
    };

    timeoutRef.current = setTimeout(nextSlide, PAUSE_DURATION);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [index]);

  // Infinite Loop Snap-back Logic
  useEffect(() => {
    // When we've scrolled past the real items to the clones
    if (index === items.length) {
      const resetTimeout = setTimeout(() => {
        // 1. Disable transition
        setIsTransitioning(false);
        // 2. Snap back to index 0 (which looks identical)
        setIndex(0);
        
        // 3. Re-enable transition for next move
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                setIsTransitioning(true);
            });
        });
      }, TRANSITION_DURATION); // Wait for the slide animation to finish before snapping

      return () => clearTimeout(resetTimeout);
    }
  }, [index, items.length]);

  return (
    <div className="w-full overflow-hidden py-6 md:py-10" ref={containerRef}>
      <div 
        className="flex"
        style={{
          // Correctly calculate translation based on the full extended list width
          transform: `translateX(-${index * (100 / extendedItems.length)}%)`,
          transition: isTransitioning ? `transform ${TRANSITION_DURATION}ms cubic-bezier(0.2, 0.8, 0.2, 1)` : 'none',
          width: `${(extendedItems.length / itemsPerView) * 100}%` // Container needs to be wide enough
        }}
      >
        {extendedItems.map((item, i) => (
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
      "bg-white p-8 shadow-sm hover:shadow-md border border-gray-100 rounded-2xl transition-all duration-300 relative flex flex-col w-[320px] md:w-[420px] shrink-0 mx-4",
      className
    )}
  >
    {/* Result Badge - Pill Shape */}
    <div className="absolute top-6 right-6 bg-neo-bg text-neo-black border border-gray-200 px-3 py-1 rounded-full font-bold font-display text-[10px] uppercase tracking-wide flex items-center gap-1">
        <Trophy className="w-3 h-3 text-neo-yellow fill-neo-yellow" />
        {result}
    </div>
    
    {/* Stars */}
    <div className="flex items-center gap-1 mb-6 text-neo-yellow">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className="w-4 h-4 fill-current" />
      ))}
    </div>
    
    <p className="font-medium text-base md:text-lg leading-relaxed mb-6 text-neo-black/80">
      "{quote}"
    </p>

    <div className="mt-auto pt-5 border-t border-gray-50">
        <p className="font-bold text-sm text-neo-black font-display">{name}</p>
    </div>
  </div>
);

const FAQItem: React.FC<{ question: string, answer: React.ReactNode }> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`bg-white mb-4 rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-300 ${isOpen ? 'ring-2 ring-neo-orange/20 shadow-md' : ''}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left font-bold text-neo-black text-base md:text-lg hover:bg-gray-50 transition-colors"
      >
        <span className="mr-4 font-display">{question}</span>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 text-gray-500 transition-all duration-300 ${isOpen ? 'bg-neo-orange text-white rotate-45' : ''}`}>
             <Plus className="w-5 h-5" />
        </div>
      </button>
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="px-6 pb-6 pt-0 text-neo-muted leading-relaxed text-sm md:text-base">
          {answer}
        </div>
      </div>
    </div>
  );
};

const FAQSection = () => {
  const faqs = [
    {
      question: "Is this a physical book?",
      answer: "No, this is a digital eBook (PDF). You will receive an instant download link via email immediately after purchase, allowing you to start preparing right away."
    },
    {
      question: "Is this suitable for fresh graduates?",
      answer: "Absolutely. We cover foundational skills, mindset shifts, and anxiety management techniques specifically designed to help first-time job seekers navigate the Malaysian market."
    },
    {
       question: "I have 5+ years experience. Is this for me?",
       answer: "Yes. Chapters like 'Personal Branding', 'Advanced Response Optimization', and 'Strategic Salary Negotiation' are tailored for experienced professionals looking to level up or pivot careers."
    },
    {
      question: "Can I read this on my phone?",
      answer: "Yes. The blueprint is formatted to be easily readable on all devices: smartphones, tablets, and desktops."
    },
    {
      question: "Do you offer refunds?",
      answer: (
        <span>
          Due to the digital nature of this product, <strong>all sales are final</strong> and we do not offer money-back guarantees. If you have specific questions or concerns before buying, please email us at <a href="mailto:hello@pushupmode.com" className="text-neo-orange hover:underline font-bold">hello@pushupmode.com</a>.
        </span>
      )
    }
  ];

  return (
    <Section className="py-16 md:py-24 max-w-4xl">
      <div className="text-center mb-16 reveal">
          <span className="bg-blue-50 text-neo-orange px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 inline-block font-display">Support</span>
          <h2 className="text-3xl md:text-4xl font-bold font-display text-neo-black mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-neo-muted">Everything you need to know about the blueprint.</p>
      </div>

      <div className="reveal flex flex-col">
        {faqs.map((faq, i) => (
          <FAQItem key={i} question={faq.question} answer={faq.answer} />
        ))}
      </div>
      
      <div className="mt-16 text-center reveal bg-white p-8 rounded-2xl border border-gray-100 shadow-sm inline-block w-full">
        <p className="text-neo-muted mb-4">Still have questions?</p>
        <a href="mailto:hello@pushupmode.com" className="inline-flex items-center gap-2 font-bold text-neo-black hover:text-neo-orange transition-colors text-lg font-display">
            <Mail className="w-5 h-5" /> hello@pushupmode.com
        </a>
      </div>
    </Section>
  );
};

// --- Main App ---

const App = () => {
  // Scroll Reveal Hook
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

  const scrollToSolution = () => {
    document.getElementById('solution')?.scrollIntoView({ behavior: 'smooth' });
  };

  const reviews = [
    {
        name: "Amirul Hakim",
        quote: "I failed 5 interviews in a row. This book showed me I was rambling. Used the STAR method and got an offer 2 weeks later.",
        result: "Secured RM4.5k Job"
    },
    {
        name: "Sarah Tan Wei Ling",
        quote: "I was terrified of salary negotiation. The script in Chapter 4 gave me the exact words. I asked for RM500 more and they said yes.",
        result: "+20% Salary Bump"
    },
    {
        name: "Muhammad Haziq",
        quote: "As a fresh grad with no experience, I had zero confidence. The preparation checklist helped me calm my nerves.",
        result: "Hired in 1 Month"
    },
    {
        name: "Priya Menon",
        quote: "The personal branding toolkit is insane. I learned how to frame my 'weaknesses' as growth opportunities.",
        result: "Landed MNC Role"
    },
    {
        name: "Jason Lim Kah Seng",
        quote: "Worth every cent. The body language tips alone changed how I enter the room. I felt in control for the first time.",
        result: "Confident & Hired"
    },
    {
        name: "Nurul Ain Samsudin",
        quote: "I didn't know what I was doing wrong until I read the 'Psychology of Hiring Managers' section. Total game changer.",
        result: "Beat 50 Applicants"
    }
  ];

  return (
    <div className="min-h-screen bg-neo-bg text-neo-black font-sans selection:bg-neo-orange selection:text-white">
      
      {/* Header / Nav */}
      <nav className="fixed top-0 left-0 w-full h-16 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 py-3 h-full flex justify-between items-center">
          <div className="font-bold font-display text-xl tracking-tight flex items-center gap-2 text-neo-black">
            pushupmode <span className="text-xl">🇲🇾</span>
          </div>
          <NeoButton onClick={scrollToPricing} variant="primary" className="text-xs px-5 py-2 shadow-md">
            Get the Blueprint
          </NeoButton>
        </div>
      </nav>

      {/* PROMO BAR */}
      <PromoBar onClick={scrollToPricing} />

      {/* HERO SECTION (PAIN) - VERTICAL LAYOUT */}
      {/* pt-28 aligns perfectly with 96px header stack on mobile with 16px breathing room (112px total) */}
      <Section className="pt-28 pb-12 md:pb-32 flex flex-col items-center text-center relative z-10 mt-0">
        
        {/* TOP: Headline & Badge */}
        <div className="max-w-4xl mx-auto mb-8 md:mb-16 flex flex-col items-center">
          <div className="reveal inline-flex items-center gap-2 px-4 py-1.5 mb-8 bg-white border border-gray-200 rounded-full shadow-sm text-xs md:text-sm font-bold text-neo-muted uppercase tracking-wide font-display">
             <ShieldCheck className="w-4 h-4 text-neo-green" />
             Go-To Blueprint for Malaysian Job Seekers (100+ Users) 🇲🇾
          </div>
          <h1 className="reveal text-3xl md:text-7xl font-bold font-display leading-tight tracking-tight mb-6 text-neo-black">
            DOES THIS SOUND <br className="md:hidden" />
            LIKE&nbsp;<span className="text-neo-orange relative inline-block px-2">
                YOU?
                {/* Stylized underline */}
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-neo-yellow opacity-80" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                </svg>
            </span>
          </h1>
        </div>

        {/* MIDDLE: Auto-Sliding Pain Points */}
        <div className="w-full max-w-7xl">
          <AutoSlider items={PAIN_POINTS} />
        </div>

        {/* MOUSE SCROLL INDICATOR */}
        {/* Reduced top margin for tighter flow on mobile */}
        <div className="mt-6 md:mt-12 flex flex-col items-center animate-reveal opacity-60" style={{ animationDelay: '1s' }}>
            <div className="w-6 h-10 border-2 border-neo-muted rounded-full flex justify-center pt-2">
                <div className="w-1.5 h-1.5 bg-neo-muted rounded-full animate-scroll"></div>
            </div>
        </div>

      </Section>

      {/* MARQUEE (EMOTION) */}
      <TextTicker items={[
        "Why didn't they call back?", 
        "Am I not good enough?", 
        "I need a job now", 
        "Tired of rejections"
      ]} />

      {/* SOLUTION SECTION */}
      <Section id="solution" className="py-12 md:py-24">
        <div className="reveal bg-neo-black text-white rounded-3xl p-6 md:p-20 shadow-2xl relative overflow-hidden">
          {/* Soft Glow BG */}
          <div className="absolute top-0 right-0 w-full h-full opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-500 via-transparent to-transparent"></div>

          <div className="relative z-10 grid md:grid-cols-2 gap-8 md:gap-16 items-center">
            <div>
              <div className="inline-block px-4 py-1 rounded-full bg-white/10 border border-white/20 text-sm font-bold mb-6 text-blue-300 font-display">THE SOLUTION</div>
              <h2 className="text-3xl md:text-6xl font-bold font-display mb-6 leading-tight tracking-tight">
                Interview Success <span className="text-blue-400">Blueprint</span>
              </h2>
              <p className="text-lg text-gray-300 mb-10 leading-relaxed">
                This isn't generic advice. It's a 50+ page tactical war manual for your career, designed to turn you into the candidate they <i>must</i> hire.
              </p>
              
              <ul className="space-y-5 mb-10">
                {[
                  "Psychology of Hiring Managers",
                  "STAR Method Deconstructed",
                  "Salary Negotiation Scripts",
                  "Body Language Mastery"
                ].map((item, i) => (
                  <li key={i} className="reveal flex items-center gap-4 font-medium text-lg" style={{ transitionDelay: `${i * 100 + 200}ms` }}>
                    <img
                        src="https://img.icons8.com/3d-fluency/94/verified-account.png"
                        alt="verified"
                        className="w-7 h-7 shrink-0"
                    />
                    {item}
                  </li>
                ))}
              </ul>

              {/* Desktop Button with Rainbow Shine Border - FORCED BLACK TEXT */}
              <div className="hidden md:inline-block relative rounded-xl group overflow-hidden">
                <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} duration={8} borderWidth={2} />
                <NeoButton onClick={scrollToPricing} style={{ color: '#000000', backgroundColor: '#ffffff' }} className="relative z-20 w-auto justify-center !bg-white !text-black hover:bg-gray-50 border-none !shadow-none hover:!shadow-none hover:shadow-none rounded-xl">
                  Get Instant Access
                </NeoButton>
              </div>
            </div>
            
            {/* Book Image - Clean floating style */}
            <div className="reveal flex flex-col justify-center items-center gap-8" style={{ transitionDelay: '300ms' }}>
              <div className="relative w-64 md:w-80 aspect-[3/4] rounded-lg shadow-[0_35px_60px_-15px_rgba(0,0,0,0.5)] group">
                <img 
                  src="https://i.imgur.com/uvNoPCg.jpeg" 
                  alt="Interview Success Blueprint Book Cover" 
                  className="w-full h-full object-cover rounded-lg border border-white/10"
                />
                {/* Soft shine effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-lg"></div>
              </div>

              {/* Mobile Button placed BELOW book and matches book width - FORCED BLACK TEXT */}
              <div className="flex md:hidden relative rounded-xl group justify-center overflow-hidden w-64 mt-3">
                <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} duration={8} borderWidth={2} />
                <NeoButton onClick={scrollToPricing} style={{ color: '#000000', backgroundColor: '#ffffff' }} className="relative z-20 w-full justify-center !bg-white !text-black hover:bg-gray-50 border-none !shadow-none hover:!shadow-none hover:shadow-none rounded-xl">
                  Buy Now
                </NeoButton>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* WHAT'S INSIDE (The Arsenal) - CLEAN GRID */}
      <Section className="py-10 md:py-12">
         <div className="text-center mb-16">
            <h2 className="reveal text-3xl md:text-4xl font-bold font-display mb-4 text-neo-black">What's Inside The Blueprint?</h2>
            <p className="text-neo-muted">Six comprehensive chapters covering every aspect of the interview process.</p>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[
                { id: "01", title: "The Mindset", desc: "Unlock the psychology of interview success. Transform anxiety into fuel and build unshakeable confidence." },
                { id: "02", title: "Winning Responses", desc: "Stop rambling. Master the STAR method and build a 'Response Library' for every possible question." },
                { id: "03", title: "Personal Branding", desc: "Define your 'Impact Style'. Differentiate yourself from generic candidates and articulate your value." },
                { id: "04", title: "Non-Verbal Mastery", desc: "93% of communication is non-verbal. Master body language and vocal presence to project authority." },
                { id: "05", title: "Tough Tactics", desc: "Navigate panel interviews, handle curveballs with the 'PAUSE' method, and salary negotiation scripts." },
                { id: "06", title: "Long-Term Mastery", desc: "Build an 'Interview Excellence Framework'. Turn every interview into a stepping stone for career growth." }
            ].map((item, i) => (
                <div key={i} className="reveal bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-100 hover:bg-[#FFF9C4] hover:-translate-y-1 transition-all duration-300 group" style={{ transitionDelay: `${i * 100}ms` }}>
                    <div className="font-mono text-sm font-bold text-blue-500 mb-4 bg-blue-50 w-fit px-2 py-1 rounded-md">{item.id}</div>
                    <h3 className="font-bold font-display text-xl mb-3 text-neo-black group-hover:text-neo-orange transition-colors">{item.title}</h3>
                    <p className="text-neo-muted leading-relaxed text-sm">{item.desc}</p>
                </div>
            ))}
         </div>
      </Section>

      {/* TESTIMONIALS SECTION (MARQUEE) */}
      <div className="bg-white py-16 md:py-24 overflow-hidden border-y border-gray-100">
        <div className="text-center mb-16 px-4">
            <h2 className="reveal text-4xl font-bold font-display mb-4 text-neo-black">Real Malaysians, Real Results</h2>
            <p className="reveal text-neo-muted max-w-2xl mx-auto text-lg" style={{ transitionDelay: '100ms' }}>
                See how the blueprint helped candidates secure their dream roles.
            </p>
        </div>
        
        {/* First Row */}
        <div className="reveal" style={{ transitionDelay: '200ms' }}>
            <Marquee repeat={3} className="[--duration:40s] py-4">
            {reviews.map((review, i) => (
                <TestimonialCard key={i} {...review} />
            ))}
            </Marquee>
        </div>
        
        {/* Second Row */}
        <div className="reveal" style={{ transitionDelay: '300ms' }}>
            <Marquee reverse repeat={3} className="[--duration:50s] mt-4 py-4">
            {reviews.map((review, i) => (
                <TestimonialCard key={i} {...review} />
            ))}
            </Marquee>
        </div>
      </div>

      {/* PRICING SECTION (ACTION) - CLEAN & TRUSTWORTHY */}
      <div id="pricing" className="relative bg-neo-orange py-16 md:py-32 overflow-hidden">
         {/* Background Circles for soft depth */}
         <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
             <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
             <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl"></div>
         </div>

         <div className="max-w-3xl mx-auto px-4 relative z-10">
            <div className="reveal bg-white rounded-3xl p-6 md:p-16 shadow-neo-xl text-center relative">
              
              {/* Gold Seal Badge with Pulse Animation - CENTERED */}
              {/* Wrapped to fix centering conflict with animation transform */}
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-20">
                <div className="animate-pulse-soft w-24 h-24 bg-neo-yellow text-neo-black rounded-full flex flex-col items-center justify-center font-bold font-display text-[10px] md:text-xs shadow-lg border-4 border-white">
                  <Star className="w-6 h-6 fill-current mb-1" />
                  LIFETIME<br/>ACCESS
                </div>
              </div>

              {/* Headline - INCREASED MARGIN to avoid overlap */}
              <div className="mb-10 mt-20 md:mt-16">
                <h2 className="text-4xl md:text-5xl font-bold font-display tracking-tight text-neo-black mb-3">Steal The Job</h2>
                <p className="text-neo-orange font-bold uppercase tracking-widest text-sm">One-time investment for career success</p>
              </div>

              {/* Price */}
              <div className="mb-12 flex justify-center items-baseline gap-2">
                <span className="text-6xl md:text-8xl font-bold font-display text-neo-black tracking-tighter">RM 79</span>
              </div>

              {/* Benefits - Clean Vertical List */}
              <div className="flex flex-col gap-5 mb-12 text-left max-w-md mx-auto">
                  {[
                    "Lifetime access & free updates",
                    "50+ page Step-by-step System",
                    "Full STAR Method breakdown",
                    "Confidence-building exercises",
                    "Salary negotiation scripts",
                    "Body language techniques",
                    "Personal branding toolkit",
                    "Tough interview formats"
                  ].map((benefit, i) => (
                      <div key={i} className="reveal flex items-center gap-4 text-neo-black" style={{ transitionDelay: `${i * 50}ms` }}>
                          <img width="32" height="32" src="https://img.icons8.com/liquid-glass-color/32/checked.png" alt="checked" className="w-8 h-8 shrink-0"/>
                          <span className="font-medium text-lg">{benefit}</span>
                      </div>
                  ))}
              </div>

              {/* CTA */}
              <div className="w-full flex flex-col gap-6 reveal" style={{ transitionDelay: '400ms' }}>
                {/* Rainbow Shine Border CTA */}
                <div className="relative rounded-xl group overflow-hidden">
                    <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} duration={8} borderWidth={2} />
                    <NeoButton variant="primary" className="relative z-20 w-full justify-center py-5 text-xl rounded-xl bg-neutral-900 text-white hover:bg-black border-none !shadow-none hover:!shadow-none hover:shadow-none">
                    Download Blueprint Now
                    </NeoButton>
                </div>
                <div className="flex justify-center items-center gap-3 text-sm text-gray-500 font-medium">
                  <span className="flex items-center gap-1.5"><Download className="w-4 h-4"/> Instant PDF</span>
                  <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                  <span className="flex items-center gap-1.5">
                    {/* Stripe Logo - Sized to match text height */}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 34" className="h-3 md:h-4 fill-gray-500">
                      <title>Powered by Stripe</title>
                      <path d="M17.07,11.24h-4.3V22h1.92V17.84h2.38c2.4,0,3.9-1.16,3.9-3.3S19.47,11.24,17.07,11.24Zm-.1,5H14.69v-3.3H17c1.38,0,2.11.59,2.11,1.65S18.35,16.19,17,16.19Z"/>
                      <path d="M25.1,14a3.77,3.77,0,0,0-3.8,4.09,3.81,3.81,0,1,0,7.59,0A3.76,3.76,0,0,0,25.1,14Zm0,6.67c-1.22,0-2-1-2-2.58s.76-2.58,2-2.58,2,1,2,2.58S26.31,20.66,25.1,20.66Z"/>
                      <polygon points="36.78 19.35 35.37 14.13 33.89 14.13 32.49 19.35 31.07 14.13 29.22 14.13 31.59 22.01 33.15 22.01 34.59 16.85 36.03 22.01 37.59 22.01 39.96 14.13 38.18 14.13 36.78 19.35"/>
                      <path d="M44,14a3.83,3.83,0,0,0-3.75,4.09,3.79,3.79,0,0,0,3.83,4.09A3.47,3.47,0,0,0,47.49,20L46,19.38a1.78,1.78,0,0,1-1.83,1.26A2.12,2.12,0,0,1,42,18.47h5.52v-.6C47.54,15.71,46.32,14,44,14Zm-1.93,3.13A1.92,1.92,0,0,1,44,15.5a1.56,1.56,0,0,1,1.69,1.62Z"/>
                      <path d="M50.69,15.3V14.13h-1.8V22h1.8V17.87a1.89,1.89,0,0,1,2-2,4.68,4.68,0,0,1,.66,0v-1.8c-.14,0-.3,0-.51,0A2.29,2.29,0,0,0,50.69,15.3Z"/>
                      <path d="M57.48,14a3.83,3.83,0,0,0-3.75,4.09,3.79,3.79,0,0,0,3.83,4.09A3.47,3.47,0,0,0,60.93,20l-1.54-.59a1.78,1.78,0,0,1-1.83,1.26,2.12,2.12,0,0,1-2.1-2.17H61v-.6C61,15.71,59.76,14,57.48,14Zm-1.93,3.13a1.92,1.92,0,0,1,1.92-1.62,1.56,1.56,0,0,1,1.69,1.62Z"/>
                      <path d="M67.56,15a2.85,2.85,0,0,0-2.26-1c-2.21,0-3.47,1.85-3.47,4.09s1.26,4.09,3.47,4.09a2.82,2.82,0,0,0,2.26-1V22h1.8V11.24h-1.8Zm0,3.35a2,2,0,0,1-2,2.28c-1.31,0-2-1-2-2.52s.7-2.52,2-2.52c1.11,0,2,.81,2,2.29Z"/>
                      <path d="M79.31,14A2.88,2.88,0,0,0,77,15V11.24h-1.8V22H77v-.83a2.86,2.86,0,0,0,2.27,1c2.2,0,3.46-1.86,3.46-4.09S81.51,14,79.31,14ZM79,20.6a2,2,0,0,1-2-2.28v-.47c0-1.48.84-2.29,2-2.29,1.3,0,2,1,2,2.52S80.25,20.6,79,20.6Z"/>
                      <path d="M86.93,19.66,85,14.13H83.1L86,21.72l-.3.74a1,1,0,0,1-1.14.79,4.12,4.12,0,0,1-.6,0v1.51a4.62,4.62,0,0,0,.73.05,2.67,2.67,0,0,0,2.78-2l3.24-8.62H88.82Z"/>
                      <path d="M125,12.43a3,3,0,0,0-2.13.87l-.14-.69h-2.39V25.53l2.72-.59V21.81a3,3,0,0,0,1.93.7c1.94,0,3.72-1.59,3.72-5.11C128.71,14.18,126.91,12.43,125,12.43Zm-.65,7.63a1.61,1.61,0,0,1-1.28-.52l0-4.11a1.64,1.64,0,0,1,1.3-.55c1,0,1.68,1.13,1.68,2.58S125.36,20.06,124.35,20.06Z"/>
                      <path d="M133.73,12.43c-2.62,0-4.21,2.26-4.21,5.11,0,3.37,1.88,5.08,4.56,5.08a6.12,6.12,0,0,0,3-.73V19.64a5.79,5.79,0,0,1-2.7.62c-1.08,0-2-.39-2.14-1.7h5.38c0-.15,0-.74,0-1C137.71,14.69,136.35,12.43,133.73,12.43Zm-1.47,4.07c0-1.26.77-1.79,1.45-1.79s1.4.53,1.4,1.79Z"/>
                      <path d="M113,13.36l-.17-.82h-2.32v9.71h2.68V15.67a1.87,1.87,0,0,1,2.05-.58V12.54A1.8,1.8,0,0,0,113,13.36Z"/>
                      <path d="M99.46,15.46c0-.44.36-.61.93-.61a5.9,5.9,0,0,1,2.7.72V12.94a7,7,0,0,0-2.7-.51c-2.21,0-3.68,1.18-3.68,3.16,0,3.1,4.14,2.6,4.14,3.93,0,.52-.44.69-1,.69a6.78,6.78,0,0,1-3-.9V22a7.38,7.38,0,0,0,3,.64c2.26,0,3.82-1.15,3.82-3.16C103.62,16.12,99.46,16.72,99.46,15.46Z"/>
                      <path d="M107.28,10.24l-2.65.58v8.93a2.77,2.77,0,0,0,2.82,2.87,4.16,4.16,0,0,0,1.91-.37V20c-.35.15-2.06.66-2.06-1V15h2.06V12.66h-2.06Z"/>
                      <polygon points="116.25 11.7 118.98 11.13 118.98 8.97 116.25 9.54 116.25 11.7"/>
                      <rect x="116.25" y="12.61" width="2.73" height="9.64"/>
                    </svg>
                  </span>
                </div>
              </div>
            </div>
         </div>
      </div>

      {/* FAQ SECTION */}
      <FAQSection />

      {/* Footer */}
      <footer className="bg-white py-16 px-4 border-t border-gray-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="font-bold font-display text-xl flex items-center gap-2 text-neo-black">
            pushupmode <span className="text-2xl">🇲🇾</span>
          </div>
          <div className="text-center md:text-right">
              <p className="text-sm text-neo-muted mb-2">© 2024 pushupmode. All rights reserved.</p>
              <p className="text-xs text-gray-400">Designed for Malaysian Job Seekers.</p>
          </div>
        </div>
      </footer>

    </div>
  );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);