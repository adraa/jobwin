import React, { useState, useEffect } from 'react';
import { Mail, ShieldCheck, Star, X } from 'lucide-react';

interface ScrollOrderBumpPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onEmailSubmitted: (email: string) => void;
  discountCode: string;
}

export const ScrollOrderBumpPopup = ({
  isOpen,
  onClose,
  onEmailSubmitted,
  discountCode
}: ScrollOrderBumpPopupProps) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState('');

  // Reset form when popup opens (unless already in success state)
  useEffect(() => {
    if (isOpen && status !== 'sent') {
      setEmail('');
      setStatus('idle');
      setError('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Prevent body scroll when popup is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    const emailValue = email.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(emailValue)) {
      setError('Enter a valid email to receive your 10% code.');
      return;
    }

    setStatus('sending');
    try {
      const response = await fetch('/api/send-discount-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailValue, code: discountCode })
      });

      if (!response.ok) {
        // Try to parse error message from response
        let errorMessage = 'Failed to send code. Please try again.';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          // If JSON parsing fails, try text
          try {
            const errorText = await response.text();
            if (errorText) errorMessage = errorText;
          } catch {
            // Use default error message
          }
        }
        throw new Error(errorMessage);
      }

      // Parse successful response
      const result = await response.json().catch(() => ({ success: true }));
      
      if (result.success !== false) {
        // Store in localStorage that email was submitted
        localStorage.setItem('orderBumpEmailSubmitted', 'true');
        
        setStatus('sent');
        onEmailSubmitted(emailValue);

        // Track analytics
        if (typeof gtag !== 'undefined') {
          gtag('event', 'order_bump_email_submitted', {
            event_category: 'Order Bump',
            event_label: 'Scroll Popup'
          });
        }
        if (typeof fbq !== 'undefined') {
          fbq('trackCustom', 'OrderBumpEmailSubmitted', {
            source: 'scroll_popup'
          });
        }
      } else {
        throw new Error('Failed to send code. Please try again.');
      }
    } catch (err: any) {
      console.error('Failed to send discount code', err);
      const errorMessage = err?.message || 'Could not send the code. Please try again.';
      setError(errorMessage);
      setStatus('error');
    }
  };

  const handleClose = () => {
    // Store dismissal in sessionStorage
    sessionStorage.setItem('orderBumpDismissed', Date.now().toString());
    
    // Track analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'order_bump_dismissed', {
        event_category: 'Order Bump',
        event_label: 'Scroll Popup'
      });
    }
    if (typeof fbq !== 'undefined') {
      fbq('trackCustom', 'OrderBumpDismissed', {
        source: 'scroll_popup'
      });
    }
    
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  const isSending = status === 'sending';

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      {/* Backdrop with blur */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      
      {/* Modal */}
      <div
        className="relative bg-white rounded-2xl md:rounded-3xl border border-[#D2D2D7]/60 shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#F5F5F7] hover:bg-[#E5E5EA] flex items-center justify-center text-[#86868B] hover:text-[#1D1D1F] transition-colors z-10"
          aria-label="Close popup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="p-6 md:p-8">
          {status === 'sent' ? (
            // Success State
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 mb-4">
                <ShieldCheck className="w-8 h-8 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-display font-bold text-[#1D1D1F] mb-2">
                  Check Your Email!
                </h3>
                <p className="text-[#86868B] text-sm md:text-base mb-6">
                  We've sent your 10% discount code to your email.
                </p>
              </div>
              
              <div className="bg-[#F5F5F7] border border-[#E5E5EA] rounded-xl p-4 md:p-6">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wide text-[#86868B]">Your Discount Code</span>
                  <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 text-[11px] font-semibold px-2 py-0.5 rounded-full">
                    <ShieldCheck className="w-3 h-3" /> Active
                  </span>
                </div>
                <code className="text-2xl md:text-3xl font-display bg-white px-4 py-3 rounded-lg border border-[#E5E5EA] tracking-[0.08em] block text-center">
                  {discountCode}
                </code>
                <p className="text-xs text-[#86868B] mt-3">
                  Use this code at checkout to save 10%
                </p>
              </div>

              <button
                onClick={handleClose}
                className="w-full bg-[#0071E3] hover:bg-[#0077ED] text-white font-semibold text-base md:text-lg py-3 md:py-4 px-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-200"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            // Email Collection Form
            <div className="space-y-6">
              <div className="text-center space-y-3">
                <span className="inline-flex items-center gap-2 bg-[#F2F2F7] text-[#1D1D1F] px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide font-display">
                  🎁 Special Offer
                </span>
                <h3 className="text-2xl md:text-3xl font-display font-bold text-[#1D1D1F] tracking-tight">
                  Get 10% Off Your Purchase!
                </h3>
                <p className="text-[#86868B] text-sm md:text-base">
                  Enter your email to unlock your exclusive discount code. We'll send it instantly!
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 text-[12px] text-[#86868B] font-medium">
                <div className="flex items-center gap-1.5 bg-[#F5F5F7] px-2.5 py-1 rounded-full border border-[#E5E5EA]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#34C759]" />
                  No spam, ever
                </div>
                <div className="flex items-center gap-1.5 bg-[#F5F5F7] px-2.5 py-1 rounded-full border border-[#E5E5EA]">
                  <Star className="w-3.5 h-3.5 text-[#F59E0B]" />
                  Instant delivery
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-[12px] font-bold uppercase tracking-wide text-[#86868B]">
                    Your Email Address
                  </label>
                  <div className="bg-[#F5F5F7] border border-[#D2D2D7]/70 rounded-xl px-4 py-3 flex items-center gap-2 shadow-inner">
                    <Mail className="w-5 h-5 text-[#86868B]" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full bg-transparent outline-none text-base md:text-lg placeholder:text-[#86868B]"
                      disabled={isSending}
                    />
                  </div>
                </div>

                {error && (
                  <p className="text-red-500 text-sm font-medium bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSending}
                  className="w-full bg-[#0071E3] hover:bg-[#0077ED] text-white font-semibold text-base md:text-lg py-3 md:py-4 px-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSending ? 'Sending…' : 'Get My 10% Discount Code'}
                </button>

                <p className="text-xs text-center text-[#86868B]">
                  By submitting, you agree to receive the discount code via email.
                </p>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

