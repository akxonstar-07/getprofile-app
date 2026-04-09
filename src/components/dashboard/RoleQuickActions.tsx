"use client";

// ═══════════════════════════════════════════════════
// Role-Specific Overview Widgets
// Each role gets a unique dashboard panel with their
// most relevant quick-action cards
// ═══════════════════════════════════════════════════

import Link from "next/link";
import {
  Scissors, Calendar, Star, MapPin, Dumbbell, Users, ShoppingBag,
  Briefcase, FileText, BarChart2, Home, Ticket, BookOpen, GraduationCap,
  Heart, QrCode, TrendingUp, Video, Mic, DollarSign, Globe, ArrowUpRight,
  Clock, Phone, Package, Download, Music, Camera, PenTool, Search, Zap,
  MessageCircle, ChevronRight
} from "lucide-react";

interface QuickActionCard {
  icon: any;
  label: string;
  description: string;
  href: string;
  color: string;
  bgColor: string;
}

function ActionCard({ card }: { card: QuickActionCard }) {
  return (
    <Link href={card.href}
      className="group flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-2xl hover:border-slate-300 hover:shadow-lg transition-all">
      <div className={`w-11 h-11 rounded-xl ${card.bgColor} flex items-center justify-center flex-shrink-0`}>
        <card.icon className={`w-5 h-5 ${card.color}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-slate-900 text-sm">{card.label}</p>
        <p className="text-xs text-slate-500 truncate">{card.description}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
    </Link>
  );
}

const ROLE_WIDGETS: Record<string, QuickActionCard[]> = {
  barber: [
    { icon: Scissors, label: "Add Service to Menu", description: "List a haircut, trim, or treatment", href: "/dashboard/store", color: "text-teal-600", bgColor: "bg-teal-50" },
    { icon: Calendar, label: "View Today's Appointments", description: "Check your schedule for today", href: "/dashboard/bookings", color: "text-blue-600", bgColor: "bg-blue-50" },
    { icon: MapPin, label: "Update Shop Location", description: "Keep your address and hours current", href: "/dashboard/links", color: "text-rose-600", bgColor: "bg-rose-50" },
    { icon: Star, label: "Share Loyalty Rewards", description: "Create a discount for returning clients", href: "/dashboard/promo", color: "text-amber-600", bgColor: "bg-amber-50" },
  ],
  fitness_coach: [
    { icon: Dumbbell, label: "Add Workout Program", description: "Create and sell a new fitness plan", href: "/dashboard/store", color: "text-orange-600", bgColor: "bg-orange-50" },
    { icon: Calendar, label: "Open Session Slots", description: "Add available training times", href: "/dashboard/bookings", color: "text-blue-600", bgColor: "bg-blue-50" },
    { icon: Users, label: "Host a Bootcamp", description: "Launch a group fitness event", href: "/dashboard/events", color: "text-emerald-600", bgColor: "bg-emerald-50" },
    { icon: TrendingUp, label: "Run a Flash Sale", description: "Offer a limited-time discount on programs", href: "/dashboard/promo", color: "text-purple-600", bgColor: "bg-purple-50" },
  ],
  lawyer: [
    { icon: Calendar, label: "Open Consultation Slots", description: "Let clients book initial meetings", href: "/dashboard/bookings", color: "text-slate-600", bgColor: "bg-slate-50" },
    { icon: FileText, label: "Share a Legal Resource", description: "Upload a guide or document template", href: "/dashboard/store", color: "text-blue-600", bgColor: "bg-blue-50" },
    { icon: Briefcase, label: "Update Practice Areas", description: "Edit what you specialize in", href: "/dashboard/links", color: "text-indigo-600", bgColor: "bg-indigo-50" },
    { icon: BarChart2, label: "View Client Analytics", description: "See inquiry trends and sources", href: "/dashboard/analytics", color: "text-emerald-600", bgColor: "bg-emerald-50" },
  ],
  job_seeker: [
    { icon: FileText, label: "Update Your Resume Link", description: "Pin your latest CV to your profile", href: "/dashboard/links", color: "text-blue-600", bgColor: "bg-blue-50" },
    { icon: Camera, label: "Add a Project", description: "Showcase a portfolio piece", href: "/dashboard/links", color: "text-purple-600", bgColor: "bg-purple-50" },
    { icon: Search, label: "Who Viewed My Profile?", description: "Track recruiter visits and interest", href: "/dashboard/analytics", color: "text-emerald-600", bgColor: "bg-emerald-50" },
    { icon: Calendar, label: "Open Interview Slots", description: "Let recruiters book directly", href: "/dashboard/bookings", color: "text-amber-600", bgColor: "bg-amber-50" },
  ],
  content_creator: [
    { icon: ShoppingBag, label: "Add Merch or Digital Product", description: "List something new for your fans", href: "/dashboard/store", color: "text-pink-600", bgColor: "bg-pink-50" },
    { icon: Zap, label: "Run a Flash Sale", description: "Create a time-limited fan offer", href: "/dashboard/promo", color: "text-amber-600", bgColor: "bg-amber-50" },
    { icon: Ticket, label: "Host a Fan Event", description: "Plan a meetup, live, or workshop", href: "/dashboard/events", color: "text-purple-600", bgColor: "bg-purple-50" },
    { icon: BarChart2, label: "Check Creator Insights", description: "Track fan engagement and revenue", href: "/dashboard/analytics", color: "text-emerald-600", bgColor: "bg-emerald-50" },
  ],
  real_estate: [
    { icon: Home, label: "Post a New Listing", description: "Add a property with photos and price", href: "/dashboard/store", color: "text-rose-600", bgColor: "bg-rose-50" },
    { icon: Calendar, label: "Schedule an Open House", description: "Create a viewing event with RSVP", href: "/dashboard/events", color: "text-blue-600", bgColor: "bg-blue-50" },
    { icon: Phone, label: "Open Viewing Slots", description: "Let buyers book property visits", href: "/dashboard/bookings", color: "text-teal-600", bgColor: "bg-teal-50" },
    { icon: BarChart2, label: "View Lead Activity", description: "Track who's interested and from where", href: "/dashboard/analytics", color: "text-emerald-600", bgColor: "bg-emerald-50" },
  ],
  online_tutor: [
    { icon: BookOpen, label: "Add Study Material", description: "Upload notes, PDFs, or past papers", href: "/dashboard/store", color: "text-amber-600", bgColor: "bg-amber-50" },
    { icon: Calendar, label: "Add Lesson Slots", description: "Set your available teaching times", href: "/dashboard/bookings", color: "text-blue-600", bgColor: "bg-blue-50" },
    { icon: GraduationCap, label: "Host a Group Class", description: "Schedule a batch or workshop session", href: "/dashboard/events", color: "text-purple-600", bgColor: "bg-purple-50" },
    { icon: Star, label: "Create Student Offer", description: "Offer a trial lesson discount", href: "/dashboard/promo", color: "text-emerald-600", bgColor: "bg-emerald-50" },
  ],
  event_organizer: [
    { icon: Ticket, label: "Create New Event", description: "Plan an event with RSVPs and capacity", href: "/dashboard/events", color: "text-yellow-600", bgColor: "bg-yellow-50" },
    { icon: ShoppingBag, label: "Sell Tickets or Merch", description: "Add ticketing to your event", href: "/dashboard/store", color: "text-pink-600", bgColor: "bg-pink-50" },
    { icon: Zap, label: "Early Bird Deal", description: "Create limited early-bird pricing", href: "/dashboard/promo", color: "text-purple-600", bgColor: "bg-purple-50" },
    { icon: BarChart2, label: "Track RSVPs", description: "See who's coming and guest count", href: "/dashboard/analytics", color: "text-emerald-600", bgColor: "bg-emerald-50" },
  ],
  freelancer: [
    { icon: PenTool, label: "Showcase a Project", description: "Add your latest work to portfolio", href: "/dashboard/links", color: "text-violet-600", bgColor: "bg-violet-50" },
    { icon: Package, label: "List a Digital Product", description: "Sell a template, preset, or resource", href: "/dashboard/store", color: "text-indigo-600", bgColor: "bg-indigo-50" },
    { icon: Phone, label: "Open Client Calls", description: "Set times for project discovery calls", href: "/dashboard/bookings", color: "text-blue-600", bgColor: "bg-blue-50" },
    { icon: BarChart2, label: "View Client Interest", description: "Track who viewed your portfolio", href: "/dashboard/analytics", color: "text-emerald-600", bgColor: "bg-emerald-50" },
  ],
  video_editor: [
    { icon: Video, label: "Add Reel to Portfolio", description: "Link your latest edit or showreel", href: "/dashboard/links", color: "text-red-600", bgColor: "bg-red-50" },
    { icon: ShoppingBag, label: "Sell a Preset Pack", description: "List LUTs, presets, or templates", href: "/dashboard/store", color: "text-indigo-600", bgColor: "bg-indigo-50" },
    { icon: Phone, label: "Take Project Calls", description: "Open slots for project kickoffs", href: "/dashboard/bookings", color: "text-blue-600", bgColor: "bg-blue-50" },
    { icon: BarChart2, label: "Track Portfolio Views", description: "See who's looking at your work", href: "/dashboard/analytics", color: "text-emerald-600", bgColor: "bg-emerald-50" },
  ],
  artist: [
    { icon: Music, label: "Add Music Links", description: "Link Spotify, Apple Music, YouTube", href: "/dashboard/links", color: "text-purple-600", bgColor: "bg-purple-50" },
    { icon: ShoppingBag, label: "Launch New Merch", description: "Add merch, vinyl, or fan items", href: "/dashboard/store", color: "text-pink-600", bgColor: "bg-pink-50" },
    { icon: Mic, label: "Add a Show Date", description: "Announce an upcoming performance", href: "/dashboard/events", color: "text-amber-600", bgColor: "bg-amber-50" },
    { icon: BarChart2, label: "Check Fan Activity", description: "See who's engaging with your music", href: "/dashboard/analytics", color: "text-emerald-600", bgColor: "bg-emerald-50" },
  ],
  high_ticket_coach: [
    { icon: DollarSign, label: "Add Coaching Program", description: "Create a high-value coaching package", href: "/dashboard/store", color: "text-amber-600", bgColor: "bg-amber-50" },
    { icon: Phone, label: "Open Discovery Calls", description: "Let qualified leads book a call", href: "/dashboard/bookings", color: "text-blue-600", bgColor: "bg-blue-50" },
    { icon: Ticket, label: "Host a Masterclass", description: "Launch a premium webinar or workshop", href: "/dashboard/events", color: "text-purple-600", bgColor: "bg-purple-50" },
    { icon: BarChart2, label: "View Pipeline", description: "Track leads, calls, and conversions", href: "/dashboard/analytics", color: "text-emerald-600", bgColor: "bg-emerald-50" },
  ],
  motivational_speaker: [
    { icon: Mic, label: "Announce Speaking Event", description: "Share an upcoming talk or retreat", href: "/dashboard/events", color: "text-indigo-600", bgColor: "bg-indigo-50" },
    { icon: Book, label: "Add Book or Course", description: "Sell your teachings or recordings", href: "/dashboard/store", color: "text-amber-600", bgColor: "bg-amber-50" },
    { icon: Phone, label: "Accept Event Bookings", description: "Let organizers book you to speak", href: "/dashboard/bookings", color: "text-blue-600", bgColor: "bg-blue-50" },
    { icon: BarChart2, label: "Track Follower Growth", description: "See audience engagement trends", href: "/dashboard/analytics", color: "text-emerald-600", bgColor: "bg-emerald-50" },
  ],
  stock_analyst: [
    { icon: TrendingUp, label: "Post Market Analysis", description: "Share a new trade idea or insight", href: "/dashboard/links", color: "text-emerald-600", bgColor: "bg-emerald-50" },
    { icon: ShoppingBag, label: "Add Premium Research", description: "Sell a course, eBook, or premium pick", href: "/dashboard/store", color: "text-blue-600", bgColor: "bg-blue-50" },
    { icon: Video, label: "Host Market Webinar", description: "Launch a live market analysis session", href: "/dashboard/events", color: "text-purple-600", bgColor: "bg-purple-50" },
    { icon: BarChart2, label: "Subscriber Analytics", description: "Track follower growth and engagement", href: "/dashboard/analytics", color: "text-emerald-600", bgColor: "bg-emerald-50" },
  ],
  marketing_manager: [
    { icon: FileText, label: "Add Case Study", description: "Showcase a campaign result with numbers", href: "/dashboard/links", color: "text-sky-600", bgColor: "bg-sky-50" },
    { icon: Phone, label: "Open Strategy Calls", description: "Let prospects book a strategy session", href: "/dashboard/bookings", color: "text-blue-600", bgColor: "bg-blue-50" },
    { icon: Video, label: "Host a Workshop", description: "Run a marketing masterclass", href: "/dashboard/events", color: "text-purple-600", bgColor: "bg-purple-50" },
    { icon: BarChart2, label: "Track Lead Interest", description: "See which companies viewed your page", href: "/dashboard/analytics", color: "text-emerald-600", bgColor: "bg-emerald-50" },
  ],
  sales_manager: [
    { icon: ShoppingBag, label: "Update Product Catalog", description: "Edit what you're selling and pricing", href: "/dashboard/store", color: "text-emerald-600", bgColor: "bg-emerald-50" },
    { icon: Phone, label: "Schedule Product Demo", description: "Open slots for sales demos", href: "/dashboard/bookings", color: "text-blue-600", bgColor: "bg-blue-50" },
    { icon: Zap, label: "Create Closing Deal", description: "Offer a limited-time deal to close leads", href: "/dashboard/promo", color: "text-amber-600", bgColor: "bg-amber-50" },
    { icon: BarChart2, label: "View Sales Pipeline", description: "Track demos, leads, and conversions", href: "/dashboard/analytics", color: "text-emerald-600", bgColor: "bg-emerald-50" },
  ],
  social_media_manager: [
    { icon: Camera, label: "Add Case Study / Result", description: "Show a growth win (e.g. 0→10K followers)", href: "/dashboard/links", color: "text-pink-600", bgColor: "bg-pink-50" },
    { icon: ShoppingBag, label: "Sell a Content Template", description: "List a social media kit or calendar", href: "/dashboard/store", color: "text-purple-600", bgColor: "bg-purple-50" },
    { icon: Phone, label: "Open Client Calls", description: "Let potential clients book a discovery call", href: "/dashboard/bookings", color: "text-blue-600", bgColor: "bg-blue-50" },
    { icon: BarChart2, label: "Track Inquiry Sources", description: "See which platforms bring clients", href: "/dashboard/analytics", color: "text-emerald-600", bgColor: "bg-emerald-50" },
  ],
  side_hustler: [
    { icon: ShoppingBag, label: "Add Product to Catalog", description: "List a new product for sale", href: "/dashboard/store", color: "text-pink-600", bgColor: "bg-pink-50" },
    { icon: Zap, label: "Create Weekend Deal", description: "Run a flash sale or special offer", href: "/dashboard/promo", color: "text-amber-600", bgColor: "bg-amber-50" },
    { icon: BarChart2, label: "Check Sales Stats", description: "Monitor orders and revenue", href: "/dashboard/analytics", color: "text-emerald-600", bgColor: "bg-emerald-50" },
    { icon: Globe, label: "Share Your Shop", description: "Post your profile link on social media", href: "/dashboard", color: "text-blue-600", bgColor: "bg-blue-50" },
  ],
  store_manager: [
    { icon: ShoppingBag, label: "Add Menu / Catalog Item", description: "List a product or service with price", href: "/dashboard/store", color: "text-indigo-600", bgColor: "bg-indigo-50" },
    { icon: Zap, label: "Set Today's Deal", description: "Create a daily special or offer", href: "/dashboard/promo", color: "text-amber-600", bgColor: "bg-amber-50" },
    { icon: QrCode, label: "Share QR Code", description: "Let customers scan to view your store", href: "/dashboard", color: "text-purple-600", bgColor: "bg-purple-50" },
    { icon: Star, label: "View Reviews", description: "See what customers are saying", href: "/dashboard/analytics", color: "text-emerald-600", bgColor: "bg-emerald-50" },
  ],
  collector: [
    { icon: Package, label: "List a Collectible", description: "Add an item to your collection store", href: "/dashboard/store", color: "text-amber-600", bgColor: "bg-amber-50" },
    { icon: Zap, label: "Schedule a Drop", description: "Plan a limited release event", href: "/dashboard/promo", color: "text-purple-600", bgColor: "bg-purple-50" },
    { icon: BarChart2, label: "Track Buyer Interest", description: "See who's viewing your listings", href: "/dashboard/analytics", color: "text-emerald-600", bgColor: "bg-emerald-50" },
    { icon: Globe, label: "Share Collection Link", description: "Send buyers to your collection page", href: "/dashboard", color: "text-blue-600", bgColor: "bg-blue-50" },
  ],
  ngo_member: [
    { icon: Heart, label: "Plan Fundraiser", description: "Create a donation or fundraising event", href: "/dashboard/events", color: "text-red-600", bgColor: "bg-red-50" },
    { icon: Video, label: "Share Impact Story", description: "Post photos or videos of your work", href: "/dashboard/links", color: "text-pink-600", bgColor: "bg-pink-50" },
    { icon: ShoppingBag, label: "Add to Impact Store", description: "Sell cause merchandise or accept donations", href: "/dashboard/store", color: "text-emerald-600", bgColor: "bg-emerald-50" },
    { icon: BarChart2, label: "Track Donation Activity", description: "See donor engagement and reach", href: "/dashboard/analytics", color: "text-red-600", bgColor: "bg-red-50" },
  ],
  networker: [
    { icon: QrCode, label: "Get Your QR Code", description: "Download your digital business card QR", href: "/dashboard", color: "text-indigo-600", bgColor: "bg-indigo-50" },
    { icon: Globe, label: "Update Contact Info", description: "Keep your social links current", href: "/dashboard/links", color: "text-blue-600", bgColor: "bg-blue-50" },
    { icon: BarChart2, label: "View Scan Analytics", description: "See who scanned your card and when", href: "/dashboard/analytics", color: "text-emerald-600", bgColor: "bg-emerald-50" },
    { icon: Phone, label: "Let People Book You", description: "Open slots for coffee chats", href: "/dashboard/bookings", color: "text-purple-600", bgColor: "bg-purple-50" },
  ],
  student: [
    { icon: FileText, label: "Pin Your Resume", description: "Add your CV or portfolio link", href: "/dashboard/links", color: "text-cyan-600", bgColor: "bg-cyan-50" },
    { icon: Camera, label: "Add a Project", description: "Showcase a class or personal project", href: "/dashboard/links", color: "text-blue-600", bgColor: "bg-blue-50" },
    { icon: QrCode, label: "Create Your ID Card", description: "Generate a digital student profile QR", href: "/dashboard", color: "text-purple-600", bgColor: "bg-purple-50" },
    { icon: BarChart2, label: "See Who Viewed You", description: "Track recruiter and professor visits", href: "/dashboard/analytics", color: "text-emerald-600", bgColor: "bg-emerald-50" },
  ],
};

// Default for unknown/personal_brand roles
const DEFAULT_WIDGETS: QuickActionCard[] = [
  { icon: Globe, label: "Edit Your Profile", description: "Add links, bio, and social handles", href: "/dashboard/links", color: "text-indigo-600", bgColor: "bg-indigo-50" },
  { icon: ShoppingBag, label: "Add a Product", description: "Start selling digital or physical items", href: "/dashboard/store", color: "text-emerald-600", bgColor: "bg-emerald-50" },
  { icon: Calendar, label: "Set Up Bookings", description: "Let people schedule time with you", href: "/dashboard/bookings", color: "text-blue-600", bgColor: "bg-blue-50" },
  { icon: BarChart2, label: "View Analytics", description: "Track who's visiting your profile", href: "/dashboard/analytics", color: "text-purple-600", bgColor: "bg-purple-50" },
];

// Book icon (missing from lucide import above)
function Book({ className }: { className?: string }) {
  return <BookOpen className={className} />;
}

export function RoleQuickActions({ role }: { role: string }) {
  const widgets = ROLE_WIDGETS[role] || DEFAULT_WIDGETS;

  return (
    <div className="bg-white border border-slate-200 rounded-[32px] p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-5">
        <Zap className="w-4 h-4 text-indigo-500 fill-indigo-500" />
        <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider">Quick Actions</h3>
      </div>
      <div className="space-y-3">
        {widgets.map((card, i) => (
          <ActionCard key={i} card={card} />
        ))}
      </div>
    </div>
  );
}
