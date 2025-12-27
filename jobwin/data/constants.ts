export const CHECKOUT_URL = 'https://buy.stripe.com/bJefZbaPf1IYfeYf8LafS03';
export const DISCOUNT_CODE = 'JOBWIN10';
export const SCROLL_TRIGGER_PERCENT = 60;

export interface PainPoint {
  image: string;
  thought: string;
  stressLevel: number;
  stressLabel: string;
  priority?: boolean;
}

export const PAIN_POINTS: PainPoint[] = [
  {
    image: "https://i.imgur.com/CIwGgT0.jpeg",
    thought: "I thought the interview went well... why haven't they replied for 2 weeks?",
    stressLevel: 5,
    stressLabel: "CRITICAL",
    priority: true
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
    thought: "I can't show real proof of impact. My answers sound vague, not impressive.",
    stressLevel: 5,
    stressLabel: "FRUSTRATED"
  }
];
