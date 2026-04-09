// ═══════════════════════════════════════════════════
// getprofile.link — Role Dashboard Config (22 Roles)
// Controls unique labels, stats, and quick actions per role
// ═══════════════════════════════════════════════════

export interface RolePageConfig {
  title: string;
  subtitle: string;
  addLabel: string;
  emptyText: string;
}

export interface RoleDashboardConfig {
  sidebar: {
    store: string;
    events: string;
    bookings: string;
    promo: string;
    assistant: string;
    analytics: string;
  };
  overview: {
    heroTitle: string;
    heroSubtitle: string;
    stats: { label: string; key: string; color: string }[];
    quickActions: { label: string; href: string; desc: string }[];
  };
  pages: {
    store: RolePageConfig;
    events: RolePageConfig;
    bookings: RolePageConfig;
    promo: RolePageConfig;
    assistant: { title: string; subtitle: string };
    analytics: { title: string; subtitle: string };
  };
}

const DEFAULT_CONFIG: RoleDashboardConfig = {
  sidebar: { store: "Mini Store", events: "Event Hub", bookings: "Bookings & Calls", promo: "Discount Engine", assistant: "AI Assistant", analytics: "Insights" },
  overview: {
    heroTitle: "Creator Command Center",
    heroSubtitle: "Your business at a glance. Manage your digital empire.",
    stats: [
      { label: "Total Revenue", key: "revenue", color: "emerald" },
      { label: "Hub Visitors", key: "visitors", color: "blue" },
      { label: "Conversion", key: "conversion", color: "purple" },
      { label: "Total Sales", key: "sales", color: "pink" },
    ],
    quickActions: [
      { label: "Add New Link", href: "/dashboard/links", desc: "Add a link to your bio" },
      { label: "Add Product", href: "/dashboard/store", desc: "List something for sale" },
      { label: "View Analytics", href: "/dashboard/analytics", desc: "Check your stats" },
    ],
  },
  pages: {
    store: { title: "Mini Store Hub", subtitle: "Manage your products and scale your digital empire.", addLabel: "Add New Product", emptyText: "No products in your store yet." },
    events: { title: "Events Hub", subtitle: "Launch events, workshops, and manage RSVPs.", addLabel: "Create New Event", emptyText: "No events in your schedule yet." },
    bookings: { title: "Bookings & Calls", subtitle: "Manage discovery calls, appointments, and meetings.", addLabel: "New Booking", emptyText: "No bookings yet." },
    promo: { title: "Discount Engine", subtitle: "Create promo codes your AI can offer automatically.", addLabel: "New Code", emptyText: "No promo codes yet." },
    assistant: { title: "AI Message Hub", subtitle: "Your personal portal for fan interactions and business insights." },
    analytics: { title: "Insights & Analytics", subtitle: "Track your profile performance and visitor activity." },
  },
};

const ROLE_CONFIGS: Record<string, Partial<RoleDashboardConfig>> = {
  fitness_coach: {
    sidebar: { store: "Program Store", events: "Fitness Events", bookings: "Session Booker", promo: "Client Offers", assistant: "AI Fitness Advisor", analytics: "Client Insights" },
    overview: {
      heroTitle: "Fitness Command Center",
      heroSubtitle: "Track clients, sessions, and revenue at a glance.",
      stats: [
        { label: "Active Clients", key: "clients", color: "orange" },
        { label: "Sessions Booked", key: "bookings", color: "blue" },
        { label: "Revenue", key: "revenue", color: "emerald" },
        { label: "Programs Sold", key: "sales", color: "pink" },
      ],
      quickActions: [
        { label: "Add Workout Plan", href: "/dashboard/store", desc: "Create a new fitness program" },
        { label: "Book a Session", href: "/dashboard/bookings", desc: "Schedule client training" },
        { label: "Run Flash Sale", href: "/dashboard/promo", desc: "Offer a time-limited discount" },
      ],
    },
    pages: {
      store: { title: "Program Store", subtitle: "Sell workout plans, meal guides, and fitness programs.", addLabel: "Add Workout Plan", emptyText: "No fitness programs yet. Add your first workout plan!" },
      events: { title: "Fitness Events", subtitle: "Host bootcamps, workshops, and group training sessions.", addLabel: "Create Fitness Event", emptyText: "No fitness events scheduled." },
      bookings: { title: "Session Booker", subtitle: "Manage personal training sessions and client calls.", addLabel: "Add Time Slot", emptyText: "No sessions booked yet." },
      promo: { title: "Client Offers", subtitle: "Create discount codes for loyal clients and flash sales.", addLabel: "New Offer", emptyText: "No active offers." },
      assistant: { title: "AI Fitness Advisor", subtitle: "AI answers client questions about workouts, pricing, and availability." },
      analytics: { title: "Client Insights", subtitle: "Track client engagement and program performance." },
    },
  },

  barber: {
    sidebar: { store: "Service Menu", events: "Shop Events", bookings: "Walk-in Scheduler", promo: "Loyalty Rewards", assistant: "AI Receptionist", analytics: "Shop Analytics" },
    overview: {
      heroTitle: "Shop Command Center",
      heroSubtitle: "Manage your appointments, services, and client reviews.",
      stats: [
        { label: "Today's Bookings", key: "bookings", color: "teal" },
        { label: "Total Clients", key: "clients", color: "blue" },
        { label: "Revenue", key: "revenue", color: "emerald" },
        { label: "Reviews", key: "reviews", color: "amber" },
      ],
      quickActions: [
        { label: "Add Service", href: "/dashboard/store", desc: "Add a new service to your menu" },
        { label: "View Schedule", href: "/dashboard/bookings", desc: "Check today's appointments" },
        { label: "Loyalty Reward", href: "/dashboard/promo", desc: "Create a loyalty discount" },
      ],
    },
    pages: {
      store: { title: "Service Menu", subtitle: "Display your services, prices, and packages.", addLabel: "Add Service", emptyText: "No services listed yet. Add your first service!" },
      events: { title: "Shop Events", subtitle: "Host special events or seasonal promotions.", addLabel: "Create Event", emptyText: "No events planned." },
      bookings: { title: "Walk-in Scheduler", subtitle: "Manage appointments and walk-in availability.", addLabel: "Open Slot", emptyText: "No appointments scheduled." },
      promo: { title: "Loyalty Rewards", subtitle: "Reward returning customers with special discounts.", addLabel: "New Reward", emptyText: "No loyalty rewards active." },
      assistant: { title: "AI Receptionist", subtitle: "AI answers 'Are you open?', 'What are your prices?' automatically." },
      analytics: { title: "Shop Analytics", subtitle: "Track foot traffic, bookings, and service popularity." },
    },
  },

  lawyer: {
    sidebar: { store: "Resources", events: "Seminars", bookings: "Consultation Scheduler", promo: "Client Offers", assistant: "AI Client Qualifier", analytics: "Practice Analytics" },
    overview: {
      heroTitle: "Legal Practice Hub",
      heroSubtitle: "Manage consultations, client inquiries, and case visibility.",
      stats: [
        { label: "Consultations", key: "bookings", color: "slate" },
        { label: "Client Inquiries", key: "visitors", color: "blue" },
        { label: "Response Rate", key: "conversion", color: "emerald" },
        { label: "Active Cases", key: "cases", color: "amber" },
      ],
      quickActions: [
        { label: "Open Scheduler", href: "/dashboard/bookings", desc: "View upcoming consultations" },
        { label: "AI Qualifier", href: "/dashboard/assistant", desc: "See pre-qualified leads" },
        { label: "View Analytics", href: "/dashboard/analytics", desc: "Track inquiry sources" },
      ],
    },
    pages: {
      store: { title: "Legal Resources", subtitle: "Share downloadable guides and legal document templates.", addLabel: "Add Resource", emptyText: "No resources shared yet." },
      events: { title: "Legal Seminars", subtitle: "Host webinars and community legal workshops.", addLabel: "Create Seminar", emptyText: "No seminars scheduled." },
      bookings: { title: "Consultation Scheduler", subtitle: "Manage initial consultations and follow-up meetings.", addLabel: "Add Availability", emptyText: "No consultations scheduled." },
      promo: { title: "Client Offers", subtitle: "Offer first-consultation discounts to new clients.", addLabel: "New Offer", emptyText: "No active offers." },
      assistant: { title: "AI Client Qualifier", subtitle: "AI pre-qualifies inquiries: 'What area of law do you need help with?'" },
      analytics: { title: "Practice Analytics", subtitle: "Track referral sources, inquiry volume, and conversion." },
    },
  },

  job_seeker: {
    sidebar: { store: "Portfolio", events: "Career Events", bookings: "Interview Scheduler", promo: "Referral Codes", assistant: "AI Career Advocate", analytics: "Recruiter Tracker" },
    overview: {
      heroTitle: "Career Dashboard",
      heroSubtitle: "Track who's viewing your profile and landing interviews.",
      stats: [
        { label: "Profile Views", key: "visitors", color: "blue" },
        { label: "Recruiter Visits", key: "recruiterVisits", color: "indigo" },
        { label: "Applications", key: "applications", color: "purple" },
        { label: "Interviews", key: "interviews", color: "emerald" },
      ],
      quickActions: [
        { label: "Update Resume", href: "/dashboard", desc: "Edit your profile and skills" },
        { label: "Add Project", href: "/dashboard/links", desc: "Showcase a new project" },
        { label: "Who Viewed Me?", href: "/dashboard/analytics", desc: "See recruiter activity" },
      ],
    },
    pages: {
      store: { title: "Project Portfolio", subtitle: "Showcase your best work and side projects.", addLabel: "Add Project", emptyText: "No projects showcased yet." },
      events: { title: "Career Events", subtitle: "Track career fairs and networking events.", addLabel: "Add Event", emptyText: "No career events tracked." },
      bookings: { title: "Interview Scheduler", subtitle: "Let recruiters book interview slots directly.", addLabel: "Add Slot", emptyText: "No interviews scheduled." },
      promo: { title: "Referral Codes", subtitle: "Share referral codes with your network.", addLabel: "New Code", emptyText: "No referral codes." },
      assistant: { title: "AI Career Advocate", subtitle: "AI answers recruiter FAQs about your skills, experience, and availability." },
      analytics: { title: "Recruiter Tracker", subtitle: "See which companies viewed your profile and when." },
    },
  },

  content_creator: {
    sidebar: { store: "Creator Store", events: "Fan Events", bookings: "Collabs", promo: "Flash Sales", assistant: "AI Fan Manager", analytics: "Creator Insights" },
    overview: {
      heroTitle: "Creator HQ",
      heroSubtitle: "Monetize your audience, track sales, and engage fans.",
      stats: [
        { label: "Store Revenue", key: "revenue", color: "pink" },
        { label: "Fan Visits", key: "visitors", color: "purple" },
        { label: "Products Sold", key: "sales", color: "emerald" },
        { label: "Subscribers", key: "subscribers", color: "amber" },
      ],
      quickActions: [
        { label: "Add Merch", href: "/dashboard/store", desc: "List new merch or digital product" },
        { label: "Run Flash Sale", href: "/dashboard/promo", desc: "Create a limited-time offer" },
        { label: "Host Event", href: "/dashboard/events", desc: "Plan a fan meetup or workshop" },
      ],
    },
    pages: {
      store: { title: "Creator Store", subtitle: "Sell merch, digital downloads, and exclusive content.", addLabel: "Add Product", emptyText: "No products yet. Start selling to your fans!" },
      events: { title: "Fan Events", subtitle: "Host meetups, live sessions, and exclusive fan experiences.", addLabel: "Create Fan Event", emptyText: "No fan events planned." },
      bookings: { title: "Collaboration Hub", subtitle: "Manage brand deal meetings and collaboration calls.", addLabel: "Add Slot", emptyText: "No collabs scheduled." },
      promo: { title: "Flash Sale Engine", subtitle: "Create time-limited discounts to boost sales.", addLabel: "New Flash Sale", emptyText: "No flash sales active." },
      assistant: { title: "AI Fan Manager", subtitle: "AI engages fans, answers questions, and captures emails." },
      analytics: { title: "Creator Insights", subtitle: "Track fan engagement, link clicks, and revenue." },
    },
  },

  side_hustler: {
    sidebar: { store: "Product Catalog", events: "Pop-ups", bookings: "Order Calls", promo: "Deals & Codes", assistant: "AI Sales Helper", analytics: "Sales Insights" },
    overview: {
      heroTitle: "Shop Dashboard",
      heroSubtitle: "Manage orders, products, and customer engagement.",
      stats: [
        { label: "Orders Today", key: "orders", color: "pink" },
        { label: "Total Revenue", key: "revenue", color: "emerald" },
        { label: "Active Products", key: "products", color: "blue" },
        { label: "Repeat Customers", key: "repeats", color: "amber" },
      ],
      quickActions: [
        { label: "Add Product", href: "/dashboard/store", desc: "List a new product for sale" },
        { label: "Create Deal", href: "/dashboard/promo", desc: "Run a weekend special" },
        { label: "View Orders", href: "/dashboard/analytics", desc: "Check recent sales" },
      ],
    },
    pages: {
      store: { title: "Product Catalog", subtitle: "List your handmade products, baked goods, or crafts.", addLabel: "Add Product", emptyText: "No products listed. Start selling!" },
      events: { title: "Pop-up Events", subtitle: "Plan pop-up shops and seasonal sales events.", addLabel: "Create Pop-up", emptyText: "No pop-ups planned." },
      bookings: { title: "Order Calls", subtitle: "Take custom order requests and consultations.", addLabel: "Add Slot", emptyText: "No order calls scheduled." },
      promo: { title: "Deals & Codes", subtitle: "Create weekend specials and loyalty codes.", addLabel: "New Deal", emptyText: "No active deals." },
      assistant: { title: "AI Sales Helper", subtitle: "AI answers 'Is this available?' and suggests products to visitors." },
      analytics: { title: "Sales Insights", subtitle: "Track product views, orders, and customer behavior." },
    },
  },

  store_manager: {
    sidebar: { store: "Store Catalog", events: "Store Events", bookings: "Appointments", promo: "Today's Deals", assistant: "AI Store Assistant", analytics: "Store Analytics" },
    overview: {
      heroTitle: "Store Manager Hub",
      heroSubtitle: "Your digital storefront dashboard. Manage catalog and customers.",
      stats: [
        { label: "Daily Sales", key: "sales", color: "emerald" },
        { label: "Active Items", key: "products", color: "blue" },
        { label: "Reviews", key: "reviews", color: "amber" },
        { label: "QR Scans", key: "qrScans", color: "purple" },
      ],
      quickActions: [
        { label: "Add to Catalog", href: "/dashboard/store", desc: "Add a product or menu item" },
        { label: "Today's Deal", href: "/dashboard/promo", desc: "Create a daily special" },
        { label: "View Reviews", href: "/dashboard/analytics", desc: "Check customer feedback" },
      ],
    },
    pages: {
      store: { title: "Store Catalog", subtitle: "Manage your full product or menu display.", addLabel: "Add Item", emptyText: "Catalog is empty. Add your first product!" },
      events: { title: "Store Events", subtitle: "Plan seasonal sales, opening events, and promotions.", addLabel: "Create Event", emptyText: "No store events planned." },
      bookings: { title: "Appointments", subtitle: "Manage customer appointments and consultations.", addLabel: "Add Slot", emptyText: "No appointments." },
      promo: { title: "Today's Deals", subtitle: "Set daily specials and time-limited offers.", addLabel: "New Deal", emptyText: "No deals active today." },
      assistant: { title: "AI Store Assistant", subtitle: "AI answers 'Do you have this in stock?' and product queries." },
      analytics: { title: "Store Analytics", subtitle: "Track product views, QR scans, and sales." },
    },
  },

  artist: {
    sidebar: { store: "Merch Store", events: "Tour Dates", bookings: "Booking Inquiries", promo: "Fan Deals", assistant: "AI Booking Agent", analytics: "Fan Analytics" },
    overview: {
      heroTitle: "Artist Press Kit",
      heroSubtitle: "Manage your music, merch, and booking inquiries.",
      stats: [
        { label: "Fan Visits", key: "visitors", color: "purple" },
        { label: "Merch Sales", key: "sales", color: "pink" },
        { label: "Upcoming Shows", key: "events", color: "amber" },
        { label: "Streaming Links", key: "links", color: "emerald" },
      ],
      quickActions: [
        { label: "Add Merch", href: "/dashboard/store", desc: "List new merchandise" },
        { label: "Add Tour Date", href: "/dashboard/events", desc: "Schedule a performance" },
        { label: "View Fan Activity", href: "/dashboard/analytics", desc: "See who's listening" },
      ],
    },
    pages: {
      store: { title: "Merch Store", subtitle: "Sell merchandise, vinyl, and exclusive fan items.", addLabel: "Add Merch", emptyText: "No merch listed yet." },
      events: { title: "Tour Dates & Shows", subtitle: "Announce upcoming performances and sell tickets.", addLabel: "Add Show", emptyText: "No upcoming shows." },
      bookings: { title: "Booking Inquiries", subtitle: "Manage venue and event booking requests.", addLabel: "Add Availability", emptyText: "No booking inquiries yet." },
      promo: { title: "Fan Deals", subtitle: "Offer fan-exclusive discounts and early access.", addLabel: "New Deal", emptyText: "No active fan deals." },
      assistant: { title: "AI Booking Agent", subtitle: "AI handles venue inquiries and booking requests 24/7." },
      analytics: { title: "Fan Analytics", subtitle: "Track fan engagement, merch interest, and streaming clicks." },
    },
  },

  high_ticket_coach: {
    sidebar: { store: "Coaching Programs", events: "Masterclasses", bookings: "Discovery Calls", promo: "VIP Offers", assistant: "AI Lead Qualifier", analytics: "Pipeline Analytics" },
    overview: {
      heroTitle: "Coaching Command Center",
      heroSubtitle: "Qualify leads, book calls, and track your pipeline.",
      stats: [
        { label: "Qualified Leads", key: "leads", color: "amber" },
        { label: "Discovery Calls", key: "bookings", color: "blue" },
        { label: "Revenue", key: "revenue", color: "emerald" },
        { label: "Conversion Rate", key: "conversion", color: "purple" },
      ],
      quickActions: [
        { label: "View Leads", href: "/dashboard/assistant", desc: "See AI-qualified prospects" },
        { label: "Add Program", href: "/dashboard/store", desc: "Create a coaching package" },
        { label: "Schedule Masterclass", href: "/dashboard/events", desc: "Plan a webinar" },
      ],
    },
    pages: {
      store: { title: "Coaching Programs", subtitle: "Sell high-value coaching packages and courses.", addLabel: "Add Program", emptyText: "No programs listed." },
      events: { title: "Masterclasses", subtitle: "Host premium webinars and group coaching sessions.", addLabel: "Create Masterclass", emptyText: "No masterclasses scheduled." },
      bookings: { title: "Discovery Calls", subtitle: "Manage discovery calls with qualified prospects.", addLabel: "Add Slot", emptyText: "No calls scheduled." },
      promo: { title: "VIP Offers", subtitle: "Create exclusive offers for high-value prospects.", addLabel: "New VIP Offer", emptyText: "No VIP offers active." },
      assistant: { title: "AI Lead Qualifier", subtitle: "AI asks 'What's your budget?' to filter serious inquiries." },
      analytics: { title: "Pipeline Analytics", subtitle: "Track lead quality, call bookings, and close rates." },
    },
  },

  motivational_speaker: {
    sidebar: { store: "Books & Courses", events: "Speaking Calendar", bookings: "Event Bookings", promo: "Special Offers", assistant: "AI Teaching Guide", analytics: "Follower Insights" },
    overview: {
      heroTitle: "Speaker Dashboard",
      heroSubtitle: "Manage your teachings, events, and follower engagement.",
      stats: [
        { label: "Followers", key: "subscribers", color: "indigo" },
        { label: "Event Bookings", key: "bookings", color: "amber" },
        { label: "Course Sales", key: "sales", color: "emerald" },
        { label: "Video Views", key: "views", color: "blue" },
      ],
      quickActions: [
        { label: "Add Talk/Course", href: "/dashboard/store", desc: "Upload teachings or books" },
        { label: "Schedule Event", href: "/dashboard/events", desc: "Plan a speaking engagement" },
        { label: "View Followers", href: "/dashboard/analytics", desc: "See audience growth" },
      ],
    },
    pages: {
      store: { title: "Books & Courses", subtitle: "Sell your books, courses, and premium teachings.", addLabel: "Add Teaching", emptyText: "No teachings listed yet." },
      events: { title: "Speaking Calendar", subtitle: "Announce upcoming talks, retreats, and workshops.", addLabel: "Add Speaking Event", emptyText: "No events on your calendar." },
      bookings: { title: "Event Bookings", subtitle: "Manage speaking engagement requests.", addLabel: "Add Availability", emptyText: "No booking requests." },
      promo: { title: "Special Offers", subtitle: "Offer early-bird pricing on events and courses.", addLabel: "New Offer", emptyText: "No offers active." },
      assistant: { title: "AI Teaching Guide", subtitle: "AI shares your teachings and answers spiritual queries 24/7." },
      analytics: { title: "Follower Insights", subtitle: "Track follower growth, engagement, and content reach." },
    },
  },

  stock_analyst: {
    sidebar: { store: "Premium Research", events: "Market Events", bookings: "Consultations", promo: "Subscriber Deals", assistant: "AI Market Advisor", analytics: "Subscriber Analytics" },
    overview: {
      heroTitle: "Analyst Command Center",
      heroSubtitle: "Manage your research, subscribers, and market insights.",
      stats: [
        { label: "Subscribers", key: "subscribers", color: "emerald" },
        { label: "Free Posts", key: "posts", color: "blue" },
        { label: "Premium Members", key: "premium", color: "amber" },
        { label: "Accuracy Rate", key: "accuracy", color: "purple" },
      ],
      quickActions: [
        { label: "Post Analysis", href: "/dashboard/links", desc: "Share a new market take" },
        { label: "Add Premium Pick", href: "/dashboard/store", desc: "Create subscriber-only content" },
        { label: "View Subscribers", href: "/dashboard/analytics", desc: "Track your audience" },
      ],
    },
    pages: {
      store: { title: "Premium Research", subtitle: "Sell trading courses, eBooks, and premium market calls.", addLabel: "Add Research", emptyText: "No premium research listed." },
      events: { title: "Market Events", subtitle: "Host market analysis webinars and Q&A sessions.", addLabel: "Create Webinar", emptyText: "No market events scheduled." },
      bookings: { title: "Consultation Calls", subtitle: "Offer paid 1-on-1 market analysis sessions.", addLabel: "Add Slot", emptyText: "No consultations scheduled." },
      promo: { title: "Subscriber Deals", subtitle: "Offer trial access or discounts on premium research.", addLabel: "New Deal", emptyText: "No deals active." },
      assistant: { title: "AI Market Advisor", subtitle: "AI answers basic market questions while you focus on research." },
      analytics: { title: "Subscriber Analytics", subtitle: "Track subscriber growth and content engagement." },
    },
  },

  real_estate: {
    sidebar: { store: "Listings", events: "Open Houses", bookings: "Property Viewings", promo: "Offers", assistant: "AI Property Guide", analytics: "Lead Tracker" },
    overview: {
      heroTitle: "Real Estate Hub",
      heroSubtitle: "Manage listings, viewings, and lead capture.",
      stats: [
        { label: "Active Listings", key: "products", color: "rose" },
        { label: "Viewing Requests", key: "bookings", color: "blue" },
        { label: "Leads Captured", key: "leads", color: "emerald" },
        { label: "Open Houses", key: "events", color: "amber" },
      ],
      quickActions: [
        { label: "Add Listing", href: "/dashboard/store", desc: "Post a new property" },
        { label: "Schedule Open House", href: "/dashboard/events", desc: "Plan a property tour" },
        { label: "View Leads", href: "/dashboard/analytics", desc: "See interested buyers" },
      ],
    },
    pages: {
      store: { title: "Property Listings", subtitle: "Showcase properties with photos, details, and pricing.", addLabel: "Add Listing", emptyText: "No listings yet." },
      events: { title: "Open Houses", subtitle: "Schedule open house events and collect RSVPs.", addLabel: "Schedule Open House", emptyText: "No open houses planned." },
      bookings: { title: "Property Viewings", subtitle: "Manage viewing appointments with interested buyers.", addLabel: "Add Slot", emptyText: "No viewings scheduled." },
      promo: { title: "Special Offers", subtitle: "Create limited-time offers on featured properties.", addLabel: "New Offer", emptyText: "No offers active." },
      assistant: { title: "AI Property Guide", subtitle: "AI answers 'How many bedrooms?' and property questions at scale." },
      analytics: { title: "Lead Tracker", subtitle: "Track property views, inquiry sources, and lead quality." },
    },
  },

  online_tutor: {
    sidebar: { store: "Study Materials", events: "Class Schedule", bookings: "Lesson Scheduler", promo: "Student Offers", assistant: "AI Tutor Helper", analytics: "Student Analytics" },
    overview: {
      heroTitle: "Tutor Dashboard",
      heroSubtitle: "Manage lessons, students, and study materials.",
      stats: [
        { label: "Active Students", key: "clients", color: "amber" },
        { label: "Lessons This Week", key: "bookings", color: "blue" },
        { label: "Materials Sold", key: "sales", color: "emerald" },
        { label: "Student Reviews", key: "reviews", color: "purple" },
      ],
      quickActions: [
        { label: "Add Material", href: "/dashboard/store", desc: "Upload study notes or PDFs" },
        { label: "Schedule Lesson", href: "/dashboard/bookings", desc: "Add available time slots" },
        { label: "View Students", href: "/dashboard/analytics", desc: "Track student engagement" },
      ],
    },
    pages: {
      store: { title: "Study Materials", subtitle: "Sell study guides, PDFs, practice papers, and courses.", addLabel: "Add Material", emptyText: "No study materials listed." },
      events: { title: "Class Schedule", subtitle: "Announce group classes and special workshops.", addLabel: "Add Class", emptyText: "No classes scheduled." },
      bookings: { title: "Lesson Scheduler", subtitle: "Let students book 1-on-1 lessons directly.", addLabel: "Add Slot", emptyText: "No lessons scheduled." },
      promo: { title: "Student Offers", subtitle: "Offer trial lessons and package discounts.", addLabel: "New Offer", emptyText: "No offers active." },
      assistant: { title: "AI Tutor Helper", subtitle: "AI answers 'Do you teach Class 10 Maths?' and subject queries." },
      analytics: { title: "Student Analytics", subtitle: "Track student inquiries and lesson completion." },
    },
  },

  freelancer: {
    sidebar: { store: "Digital Products", events: "Workshops", bookings: "Client Calls", promo: "Package Deals", assistant: "AI Client Manager", analytics: "Client Analytics" },
    overview: {
      heroTitle: "Freelancer Hub",
      heroSubtitle: "Manage clients, projects, and your portfolio presence.",
      stats: [
        { label: "Portfolio Views", key: "visitors", color: "violet" },
        { label: "Client Inquiries", key: "leads", color: "blue" },
        { label: "Active Projects", key: "projects", color: "emerald" },
        { label: "Revenue", key: "revenue", color: "amber" },
      ],
      quickActions: [
        { label: "Add to Portfolio", href: "/dashboard/links", desc: "Showcase a recent project" },
        { label: "Sell Template", href: "/dashboard/store", desc: "List a preset or template" },
        { label: "View Inquiries", href: "/dashboard/analytics", desc: "See client interest" },
      ],
    },
    pages: {
      store: { title: "Digital Products", subtitle: "Sell presets, templates, and digital resources.", addLabel: "Add Product", emptyText: "No digital products listed." },
      events: { title: "Workshops", subtitle: "Host skill-sharing workshops and creative sessions.", addLabel: "Create Workshop", emptyText: "No workshops planned." },
      bookings: { title: "Client Calls", subtitle: "Manage project kickoff calls and consultations.", addLabel: "Add Slot", emptyText: "No calls scheduled." },
      promo: { title: "Package Deals", subtitle: "Offer bundle pricing and new client discounts.", addLabel: "New Deal", emptyText: "No deals active." },
      assistant: { title: "AI Client Manager", subtitle: "AI answers 'What's your turnaround time?' and pricing queries." },
      analytics: { title: "Client Analytics", subtitle: "Track portfolio views, inquiry sources, and conversion." },
    },
  },

  video_editor: {
    sidebar: { store: "Preset Store", events: "Editing Workshops", bookings: "Project Calls", promo: "Bundle Deals", assistant: "AI Project Manager", analytics: "Portfolio Insights" },
    overview: {
      heroTitle: "Editor Studio",
      heroSubtitle: "Showcase your reel, sell presets, and get hired.",
      stats: [
        { label: "Reel Views", key: "visitors", color: "red" },
        { label: "Preset Sales", key: "sales", color: "emerald" },
        { label: "Hire Inquiries", key: "leads", color: "blue" },
        { label: "Client Projects", key: "projects", color: "pink" },
      ],
      quickActions: [
        { label: "Upload Reel", href: "/dashboard/links", desc: "Add your latest edit" },
        { label: "Sell Preset/LUT", href: "/dashboard/store", desc: "List a preset pack" },
        { label: "View Inquiries", href: "/dashboard/analytics", desc: "See who wants to hire you" },
      ],
    },
    pages: {
      store: { title: "Preset & LUT Store", subtitle: "Sell editing presets, LUTs, templates, and sound packs.", addLabel: "Add Preset Pack", emptyText: "No presets listed yet." },
      events: { title: "Editing Workshops", subtitle: "Host editing masterclasses and tutorial sessions.", addLabel: "Create Workshop", emptyText: "No workshops planned." },
      bookings: { title: "Project Calls", subtitle: "Manage project kickoff calls and revision discussions.", addLabel: "Add Slot", emptyText: "No calls scheduled." },
      promo: { title: "Bundle Deals", subtitle: "Offer preset bundles and new client discounts.", addLabel: "New Bundle", emptyText: "No bundles active." },
      assistant: { title: "AI Project Manager", subtitle: "AI answers 'How much for a 60s reel?' and project queries." },
      analytics: { title: "Portfolio Insights", subtitle: "Track reel views, preset sales, and inquiry conversion." },
    },
  },

  event_organizer: {
    sidebar: { store: "Tickets & Merch", events: "Event Manager", bookings: "Vendor Calls", promo: "Early Bird Deals", assistant: "AI Event Concierge", analytics: "Event Analytics" },
    overview: {
      heroTitle: "Event Command Center",
      heroSubtitle: "Manage RSVPs, vendors, and event logistics.",
      stats: [
        { label: "Upcoming Events", key: "events", color: "yellow" },
        { label: "Total RSVPs", key: "rsvps", color: "blue" },
        { label: "Tickets Sold", key: "sales", color: "emerald" },
        { label: "Vendors", key: "vendors", color: "purple" },
      ],
      quickActions: [
        { label: "Create Event", href: "/dashboard/events", desc: "Plan your next event" },
        { label: "View RSVPs", href: "/dashboard/analytics", desc: "Check guest responses" },
        { label: "Early Bird Deal", href: "/dashboard/promo", desc: "Offer early-bird pricing" },
      ],
    },
    pages: {
      store: { title: "Tickets & Merchandise", subtitle: "Sell event tickets, VIP passes, and merchandise.", addLabel: "Add Ticket/Item", emptyText: "No tickets or merch listed." },
      events: { title: "Event Manager", subtitle: "Create and manage events with RSVPs, location, and schedules.", addLabel: "Create Event", emptyText: "No events created yet." },
      bookings: { title: "Vendor Calls", subtitle: "Schedule calls with vendors and sponsors.", addLabel: "Add Slot", emptyText: "No vendor calls scheduled." },
      promo: { title: "Early Bird Deals", subtitle: "Offer early-bird pricing and group discounts.", addLabel: "New Deal", emptyText: "No deals active." },
      assistant: { title: "AI Event Concierge", subtitle: "AI answers 'What's the dress code?' and event FAQs." },
      analytics: { title: "Event Analytics", subtitle: "Track RSVPs, ticket sales, and guest engagement." },
    },
  },

  ngo_member: {
    sidebar: { store: "Impact Store", events: "Fundraisers", bookings: "Volunteer Calls", promo: "Donor Rewards", assistant: "AI Cause Champion", analytics: "Impact Analytics" },
    overview: {
      heroTitle: "Impact Dashboard",
      heroSubtitle: "Track donations, volunteers, and your cause's reach.",
      stats: [
        { label: "Total Donations", key: "revenue", color: "red" },
        { label: "Volunteers", key: "volunteers", color: "emerald" },
        { label: "Events Hosted", key: "events", color: "amber" },
        { label: "Cause Visitors", key: "visitors", color: "blue" },
      ],
      quickActions: [
        { label: "Plan Fundraiser", href: "/dashboard/events", desc: "Create a fundraising event" },
        { label: "Share Impact", href: "/dashboard/links", desc: "Add impact photos/videos" },
        { label: "View Donations", href: "/dashboard/analytics", desc: "Track donor activity" },
      ],
    },
    pages: {
      store: { title: "Impact Store", subtitle: "Sell cause merchandise and accept donations.", addLabel: "Add Item", emptyText: "No impact items listed." },
      events: { title: "Fundraisers", subtitle: "Plan fundraising events and community drives.", addLabel: "Create Fundraiser", emptyText: "No fundraisers planned." },
      bookings: { title: "Volunteer Calls", subtitle: "Schedule calls with potential volunteers.", addLabel: "Add Slot", emptyText: "No volunteer calls scheduled." },
      promo: { title: "Donor Rewards", subtitle: "Offer thank-you codes and donor recognition.", addLabel: "New Reward", emptyText: "No rewards active." },
      assistant: { title: "AI Cause Champion", subtitle: "AI answers 'How is my money used?' and shares your mission." },
      analytics: { title: "Impact Analytics", subtitle: "Track donations, volunteer signups, and cause reach." },
    },
  },

  networker: {
    sidebar: { store: "Resources", events: "Networking Events", bookings: "Coffee Chats", promo: "Referral Codes", assistant: "AI Follow-up Agent", analytics: "Scan Analytics" },
    overview: {
      heroTitle: "Networking Hub",
      heroSubtitle: "Track who scanned your QR and follow up intelligently.",
      stats: [
        { label: "QR Scans", key: "qrScans", color: "indigo" },
        { label: "Card Saves", key: "saves", color: "blue" },
        { label: "Follow-ups", key: "followups", color: "emerald" },
        { label: "Connections", key: "connections", color: "purple" },
      ],
      quickActions: [
        { label: "Share QR Code", href: "/dashboard", desc: "Download your digital card QR" },
        { label: "Update Profile", href: "/dashboard/links", desc: "Keep your links current" },
        { label: "View Scans", href: "/dashboard/analytics", desc: "See who scanned your card" },
      ],
    },
    pages: {
      store: { title: "Shared Resources", subtitle: "Share documents, slides, and resources with connections.", addLabel: "Add Resource", emptyText: "No resources shared." },
      events: { title: "Networking Events", subtitle: "Track conferences and meetups you're attending.", addLabel: "Add Event", emptyText: "No events tracked." },
      bookings: { title: "Coffee Chats", subtitle: "Let new connections book follow-up calls.", addLabel: "Add Slot", emptyText: "No chats scheduled." },
      promo: { title: "Referral Codes", subtitle: "Share referral codes with your network.", addLabel: "New Code", emptyText: "No referral codes." },
      assistant: { title: "AI Follow-up Agent", subtitle: "AI sends follow-up messages after networking events." },
      analytics: { title: "Scan Analytics", subtitle: "Track who scanned your QR, when, and from where." },
    },
  },

  student: {
    sidebar: { store: "Project Showcase", events: "Campus Events", bookings: "Meetings", promo: "Referrals", assistant: "AI Portfolio Guide", analytics: "Profile Tracker" },
    overview: {
      heroTitle: "Student Dashboard",
      heroSubtitle: "Build your brand and stand out to recruiters.",
      stats: [
        { label: "Profile Views", key: "visitors", color: "cyan" },
        { label: "Projects", key: "projects", color: "blue" },
        { label: "QR Scans", key: "qrScans", color: "purple" },
        { label: "Link Clicks", key: "clicks", color: "emerald" },
      ],
      quickActions: [
        { label: "Add Project", href: "/dashboard/links", desc: "Showcase a class project" },
        { label: "Update Skills", href: "/dashboard", desc: "Edit your profile" },
        { label: "View Visitors", href: "/dashboard/analytics", desc: "See who viewed your page" },
      ],
    },
    pages: {
      store: { title: "Project Showcase", subtitle: "Display your best academic and personal projects.", addLabel: "Add Project", emptyText: "No projects showcased yet." },
      events: { title: "Campus Events", subtitle: "Track hackathons, career fairs, and club events.", addLabel: "Add Event", emptyText: "No events added." },
      bookings: { title: "Meeting Scheduler", subtitle: "Let mentors and recruiters book time with you.", addLabel: "Add Slot", emptyText: "No meetings scheduled." },
      promo: { title: "Referral Codes", subtitle: "Share with classmates and earn credits.", addLabel: "New Code", emptyText: "No referral codes." },
      assistant: { title: "AI Portfolio Guide", subtitle: "AI presents your skills and projects to visitors." },
      analytics: { title: "Profile Tracker", subtitle: "See which recruiters and companies viewed your profile." },
    },
  },

  collector: {
    sidebar: { store: "Collection Store", events: "Drop Events", bookings: "Inquiries", promo: "Collector Deals", assistant: "AI Collection Guide", analytics: "Collection Insights" },
    overview: {
      heroTitle: "Collection Vault",
      heroSubtitle: "Showcase and sell your prized collection.",
      stats: [
        { label: "Items Listed", key: "products", color: "amber" },
        { label: "Total Sales", key: "sales", color: "emerald" },
        { label: "Page Views", key: "visitors", color: "blue" },
        { label: "Inquiries", key: "leads", color: "purple" },
      ],
      quickActions: [
        { label: "List Item", href: "/dashboard/store", desc: "Add a collectible for sale" },
        { label: "Plan Drop", href: "/dashboard/promo", desc: "Schedule a limited release" },
        { label: "View Interest", href: "/dashboard/analytics", desc: "See buyer activity" },
      ],
    },
    pages: {
      store: { title: "Collection Store", subtitle: "List and sell rare collectibles, sneakers, and items.", addLabel: "Add Collectible", emptyText: "No collectibles listed." },
      events: { title: "Drop Events", subtitle: "Announce limited drops and release events.", addLabel: "Schedule Drop", emptyText: "No drops planned." },
      bookings: { title: "Buyer Inquiries", subtitle: "Manage calls with interested buyers.", addLabel: "Add Slot", emptyText: "No inquiries." },
      promo: { title: "Collector Deals", subtitle: "Offer bundle deals and flash discounts.", addLabel: "New Deal", emptyText: "No deals active." },
      assistant: { title: "AI Collection Guide", subtitle: "AI answers questions about availability and authenticity." },
      analytics: { title: "Collection Insights", subtitle: "Track item interest, views, and sales velocity." },
    },
  },

  marketing_manager: {
    sidebar: { store: "Case Studies", events: "Marketing Events", bookings: "Strategy Calls", promo: "Client Offers", assistant: "AI Brand Advisor", analytics: "Campaign Analytics" },
    overview: {
      heroTitle: "Marketing Hub",
      heroSubtitle: "Showcase campaigns, track leads, and land clients.",
      stats: [
        { label: "Portfolio Views", key: "visitors", color: "sky" },
        { label: "Case Studies", key: "projects", color: "blue" },
        { label: "Lead Inquiries", key: "leads", color: "emerald" },
        { label: "Clients Won", key: "clients", color: "amber" },
      ],
      quickActions: [
        { label: "Add Case Study", href: "/dashboard/links", desc: "Showcase a campaign result" },
        { label: "Open Calendar", href: "/dashboard/bookings", desc: "Check strategy call schedule" },
        { label: "View Leads", href: "/dashboard/analytics", desc: "See who's interested" },
      ],
    },
    pages: {
      store: { title: "Case Study Library", subtitle: "Showcase campaign results and ROI metrics.", addLabel: "Add Case Study", emptyText: "No case studies yet." },
      events: { title: "Marketing Events", subtitle: "Host webinars and marketing masterclasses.", addLabel: "Create Event", emptyText: "No events planned." },
      bookings: { title: "Strategy Calls", subtitle: "Let potential clients book strategy sessions.", addLabel: "Add Slot", emptyText: "No calls scheduled." },
      promo: { title: "Client Offers", subtitle: "Offer audit discounts and introductory pricing.", addLabel: "New Offer", emptyText: "No offers active." },
      assistant: { title: "AI Brand Advisor", subtitle: "AI answers brand inquiries and showcases campaign results." },
      analytics: { title: "Campaign Analytics", subtitle: "Track portfolio views, lead quality, and conversion." },
    },
  },

  sales_manager: {
    sidebar: { store: "Product Catalog", events: "Sales Events", bookings: "Demo Scheduler", promo: "Closing Deals", assistant: "AI Sales Agent", analytics: "Sales Pipeline" },
    overview: {
      heroTitle: "Sales Command Center",
      heroSubtitle: "Track leads, demos, and close deals faster.",
      stats: [
        { label: "Active Leads", key: "leads", color: "emerald" },
        { label: "Demos Booked", key: "bookings", color: "blue" },
        { label: "Revenue", key: "revenue", color: "amber" },
        { label: "Close Rate", key: "conversion", color: "purple" },
      ],
      quickActions: [
        { label: "Add Product", href: "/dashboard/store", desc: "Update your product catalog" },
        { label: "Schedule Demo", href: "/dashboard/bookings", desc: "Set up a product demo" },
        { label: "Create Offer", href: "/dashboard/promo", desc: "Close with a special deal" },
      ],
    },
    pages: {
      store: { title: "Product Catalog", subtitle: "Showcase your products and services with pricing.", addLabel: "Add Product", emptyText: "No products in catalog." },
      events: { title: "Sales Events", subtitle: "Host product launches and webinars.", addLabel: "Create Event", emptyText: "No events planned." },
      bookings: { title: "Demo Scheduler", subtitle: "Let prospects book product demo calls.", addLabel: "Add Slot", emptyText: "No demos scheduled." },
      promo: { title: "Closing Deals", subtitle: "Create limited-time offers to close hesitant prospects.", addLabel: "New Deal", emptyText: "No deals active." },
      assistant: { title: "AI Sales Agent", subtitle: "AI handles product FAQs and follows up with interested leads." },
      analytics: { title: "Sales Pipeline", subtitle: "Track demo bookings, lead quality, and close rates." },
    },
  },

  social_media_manager: {
    sidebar: { store: "Template Store", events: "Client Workshops", bookings: "Client Calls", promo: "Package Deals", assistant: "AI Client Helper", analytics: "Growth Analytics" },
    overview: {
      heroTitle: "Social Media HQ",
      heroSubtitle: "Showcase your managed accounts and land new clients.",
      stats: [
        { label: "Portfolio Views", key: "visitors", color: "pink" },
        { label: "Managed Accounts", key: "accounts", color: "blue" },
        { label: "Template Sales", key: "sales", color: "emerald" },
        { label: "Client Inquiries", key: "leads", color: "violet" },
      ],
      quickActions: [
        { label: "Add Case Study", href: "/dashboard/links", desc: "Show a growth result" },
        { label: "Sell Template", href: "/dashboard/store", desc: "List a social media template" },
        { label: "View Inquiries", href: "/dashboard/analytics", desc: "See client interest" },
      ],
    },
    pages: {
      store: { title: "Template Store", subtitle: "Sell social media templates, content calendars, and toolkits.", addLabel: "Add Template", emptyText: "No templates listed." },
      events: { title: "Client Workshops", subtitle: "Host social media strategy workshops.", addLabel: "Create Workshop", emptyText: "No workshops planned." },
      bookings: { title: "Client Calls", subtitle: "Let potential clients book discovery calls.", addLabel: "Add Slot", emptyText: "No calls scheduled." },
      promo: { title: "Package Deals", subtitle: "Offer bundle pricing on management packages.", addLabel: "New Deal", emptyText: "No deals active." },
      assistant: { title: "AI Client Helper", subtitle: "AI answers 'What's included in your package?' automatically." },
      analytics: { title: "Growth Analytics", subtitle: "Track portfolio engagement and client acquisition." },
    },
  },
};

/**
 * Get the complete dashboard config for a given role.
 * Falls back to DEFAULT_CONFIG for any missing fields.
 */
export function getRoleDashboardConfig(profileRole: string): RoleDashboardConfig {
  const roleOverride = ROLE_CONFIGS[profileRole];
  if (!roleOverride) return DEFAULT_CONFIG;

  return {
    sidebar: { ...DEFAULT_CONFIG.sidebar, ...roleOverride.sidebar },
    overview: { ...DEFAULT_CONFIG.overview, ...roleOverride.overview },
    pages: {
      store: { ...DEFAULT_CONFIG.pages.store, ...roleOverride.pages?.store },
      events: { ...DEFAULT_CONFIG.pages.events, ...roleOverride.pages?.events },
      bookings: { ...DEFAULT_CONFIG.pages.bookings, ...roleOverride.pages?.bookings },
      promo: { ...DEFAULT_CONFIG.pages.promo, ...roleOverride.pages?.promo },
      assistant: { ...DEFAULT_CONFIG.pages.assistant, ...roleOverride.pages?.assistant },
      analytics: { ...DEFAULT_CONFIG.pages.analytics, ...roleOverride.pages?.analytics },
    },
  };
}
