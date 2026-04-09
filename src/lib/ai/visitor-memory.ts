// ═══════════════════════════════════════════════════
// getprofile.link — Visitor Memory System (Stage 3)
// Recognizes returning visitors and their interests
// ═══════════════════════════════════════════════════

export interface VisitorProfile {
  id: string;
  visitCount: number;
  firstVisit: string;
  lastVisit: string;
  pagesViewed: string[];
  productsViewed: string[];
  timeSpent: number; // total seconds
  isReturning: boolean;
}

/**
 * Generate a greeting for a returning visitor.
 */
export function getReturnVisitorGreeting(visitor: VisitorProfile): string | null {
  if (!visitor.isReturning) return null;

  if (visitor.visitCount >= 5) {
    return `Welcome back! You've been here ${visitor.visitCount} times. What can I help you with today?`;
  }

  if (visitor.productsViewed.length > 0) {
    const lastProduct = visitor.productsViewed[visitor.productsViewed.length - 1];
    return `Welcome back! Last time you were looking at "${lastProduct}". Would you like more info?`;
  }

  if (visitor.visitCount >= 3) {
    return `Good to see you again! You seem really interested. Let me know how I can help.`;
  }

  return `Welcome back! Let me know if you have any questions.`;
}

/**
 * Determine if we should offer a discount to this visitor.
 * AI Auto-Discount logic (Stage 4 integration).
 */
export function shouldOfferDiscount(visitor: VisitorProfile): {
  offer: boolean;
  reason: string;
  suggestedPercent: number;
} {
  // First-time visitor — no discount
  if (visitor.visitCount <= 1) {
    return { offer: false, reason: "first_visit", suggestedPercent: 0 };
  }

  // Visited 3+ times but hasn't purchased — offer discount
  if (visitor.visitCount >= 3 && visitor.productsViewed.length > 0) {
    return {
      offer: true,
      reason: "returning_interested",
      suggestedPercent: 15,
    };
  }

  // Visited 5+ times — loyal visitor discount
  if (visitor.visitCount >= 5) {
    return {
      offer: true,
      reason: "loyal_visitor",
      suggestedPercent: 10,
    };
  }

  return { offer: false, reason: "not_qualified", suggestedPercent: 0 };
}

/**
 * Build a visitor profile from cookie/session data.
 * In the real implementation, this reads from a browser cookie.
 */
export function buildVisitorFromCookie(cookieData: string | null): VisitorProfile {
  if (!cookieData) {
    return {
      id: generateVisitorId(),
      visitCount: 1,
      firstVisit: new Date().toISOString(),
      lastVisit: new Date().toISOString(),
      pagesViewed: [],
      productsViewed: [],
      timeSpent: 0,
      isReturning: false,
    };
  }

  try {
    const data = JSON.parse(cookieData);
    return {
      ...data,
      visitCount: (data.visitCount || 0) + 1,
      lastVisit: new Date().toISOString(),
      isReturning: true,
    };
  } catch {
    return {
      id: generateVisitorId(),
      visitCount: 1,
      firstVisit: new Date().toISOString(),
      lastVisit: new Date().toISOString(),
      pagesViewed: [],
      productsViewed: [],
      timeSpent: 0,
      isReturning: false,
    };
  }
}

/**
 * Serialize visitor profile for cookie storage.
 */
export function serializeVisitor(visitor: VisitorProfile): string {
  return JSON.stringify({
    id: visitor.id,
    visitCount: visitor.visitCount,
    firstVisit: visitor.firstVisit,
    lastVisit: visitor.lastVisit,
    pagesViewed: visitor.pagesViewed.slice(-10), // Keep last 10
    productsViewed: visitor.productsViewed.slice(-5), // Keep last 5
    timeSpent: visitor.timeSpent,
  });
}

function generateVisitorId(): string {
  return `v_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}
