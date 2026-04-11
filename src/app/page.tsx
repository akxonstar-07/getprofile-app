"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Globe, Users, BarChart3, ShoppingBag, MonitorSmartphone, Target, Fingerprint, Calendar
} from "lucide-react";
import Image from "next/image";

type Segment = "Creators" | "Business" | "Agencies";

/* ═══ DATA: REAL CREATORS FOR KOMI CAROUSEL ═══ */
const REAL_CREATORS = [
  { name: "ALLU ARJUN", category: "ACTOR", image: "/assets/celebs/allu_arjun.png" },
  { name: "SAMANTHA", category: "ACTOR", image: "/assets/celebs/samantha.png" },
  { name: "MAHESH BABU", category: "ACTOR", image: "/assets/celebs/mahesh_babu.png" },
  { name: "RASHMIKA", category: "ACTOR", image: "/assets/celebs/rashmika.png" },
];

/* ═══ KOMI FEATURE CARDS (Creators Tab) ═══ */
const KOMI_FEATURES = [
  { title: "WEBSITE", desc: "A customized storefront to centralize your content and drive income.", icon: MonitorSmartphone },
  { title: "PAYMENTS", desc: "Access advanced payment functionality to help conversion.", icon: ShoppingBag },
  { title: "DATA CAPTURE", desc: "Capture and securely store fan email and SMS details.", icon: Users },
  { title: "ANALYTICS", desc: "Track sales, views, clicks and fan geographies.", icon: BarChart3 },
];

export default function RedesignedLandingPage({ 
  initialSegment = "Creators" 
}: { 
  initialSegment?: Segment 
}) {
  const [activeSegment, setActiveSegment] = useState<Segment>(initialSegment);
  const [isScrolled, setIsScrolled] = useState(false);
  const [komiBentoTab, setKomiBentoTab] = useState<"SELL ANYTHING" | "1-1 COACHING" | "DIGITAL PRODUCTS">("SELL ANYTHING");

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Theme Logic
  const isKomi = activeSegment === "Creators";
  const bgClass = isKomi ? "bg-[#1A0B2E]" : "bg-[#000000]";
  const textColor = "text-white";
  const btnColor = isKomi ? "bg-[#D2FF00] text-black" : "bg-white text-black";

  return (
    <div className={`min-h-screen ${bgClass} ${textColor} selection:bg-white selection:text-black font-sans overflow-x-hidden transition-colors duration-700`}>
      
      {/* ═══════════════════════════════════════════
          FLOATING PILL NAVIGATION
      ═══════════════════════════════════════════ */}
      <nav className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl rounded-[2.5rem] transition-all duration-500 ${isScrolled ? "bg-black/80 backdrop-blur-xl border border-white/10 shadow-2xl" : "bg-transparent border border-transparent"}`}>
        <div className="px-6 h-16 flex items-center justify-between">
          
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className={`w-8 h-8 rounded-full ${isKomi ? "bg-[#D2FF00]" : "bg-white"} flex items-center justify-center transition-colors`}>
              <Globe className="w-5 h-5 text-black" />
            </div>
            <span className="text-xl font-black tracking-tighter">getprofile</span>
          </Link>

          {/* Segment Toggles */}
          <div className="hidden md:flex p-1 bg-white/5 rounded-full border border-white/10">
            {(["Creators", "Business", "Agencies"] as Segment[]).map((seg) => (
              <button 
                key={seg}
                onClick={() => setActiveSegment(seg)}
                className={`relative px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 ${activeSegment === seg ? "text-black" : "text-white/60 hover:text-white"}`}
              >
                {activeSegment === seg && (
                  <div className={`absolute inset-0 rounded-full -z-10 shadow-lg ${isKomi ? "bg-[#D2FF00]" : "bg-white"}`}></div>
                )}
                {seg}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 flex-shrink-0">
            <Link href="/login" className="text-sm font-bold text-white hover:opacity-70 transition-opacity hidden sm:block uppercase tracking-wider">Log in</Link>
            <Link href="/signup" className={`text-sm font-black uppercase tracking-wider px-6 py-2.5 rounded-full hover:scale-105 transition-transform ${btnColor}`}>
              Sign Up Free
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-32">
        {/* ═══════════════════════════════════════════
            ■ THE KOMI CLONE (CREATORS) ■ 
        ═══════════════════════════════════════════ */}
        {isKomi && (
          <div className="animate-in fade-in duration-500">
            
            {/* HERO */}
            <section className="px-6 pb-24 pt-20 flex flex-col items-center justify-center text-center max-w-5xl mx-auto">
              <h1 className="font-komi text-[6rem] md:text-[9rem] tracking-tight uppercase leading-[0.85] mb-8 text-white drop-shadow-2xl">
                THE ONLY PLATFORM <br/> YOU NEED TO START <br/> EARNING.
              </h1>
              <p className="text-2xl text-white/70 mb-12 font-medium tracking-wide">Save time. Make money. Own your audience.</p>
              <Link href="/signup" className="px-12 py-5 rounded-full font-black text-black bg-[#D2FF00] hover:bg-white text-xl uppercase tracking-widest transition-colors shadow-[0_0_40px_rgba(210,255,0,0.4)]">
                SIGN UP FOR FREE
              </Link>
            </section>

            {/* KOMI STAGGERED MARQUEE (EXACT VISUALS) */}
            <section className="py-24 overflow-hidden bg-gradient-to-b from-[#1A0B2E] to-[#110620]">
              <div className="text-center mb-20 px-6">
                <h2 className="font-komi text-5xl md:text-7xl uppercase tracking-tight text-white mb-4">THE WORLD&apos;S TOP CREATORS CHOOSE GETPROFILE</h2>
              </div>
              
              <div className="relative flex gap-8 px-10 animate-marquee pause-on-hover w-max pt-10 pb-20">
                {[...REAL_CREATORS, ...REAL_CREATORS, ...REAL_CREATORS, ...REAL_CREATORS].map((celeb, idx) => (
                  <div 
                    key={idx} 
                    className={`relative w-[340px] aspect-[4/5] rounded-[2rem] overflow-hidden flex-shrink-0 group transform transition-transform duration-500 hover:scale-[1.03] cursor-pointer shadow-2xl ${idx % 2 !== 0 ? 'translate-y-16' : ''}`}
                  >
                    <Image src={celeb.image} alt={celeb.name} fill className="object-cover transition-transform duration-1000 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#110620] via-transparent to-transparent opacity-90"></div>
                    <div className="absolute bottom-8 left-8">
                      <p className="text-xl font-komi text-[#D2FF00] uppercase tracking-widest mb-1 shadow-black drop-shadow-lg">{celeb.category}</p>
                      <h3 className="text-4xl font-komi text-white uppercase leading-none tracking-tight drop-shadow-lg">{celeb.name}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ONE PLATFORM ALL FEATURES (GIANT PURPLE CARDS) */}
            <section className="py-32 px-6 bg-[#0E041A]">
              <div className="max-w-[1400px] mx-auto">
                <div className="text-center mb-20">
                  <h2 className="font-komi text-6xl md:text-8xl text-[#D2FF00] uppercase tracking-tight leading-[0.9] mb-4">ONE PLATFORM.<br/>ALL THE FEATURES.</h2>
                  <p className="text-xl text-white/50 uppercase tracking-widest font-black">Build, Promote, and Sell Without Limits.</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {KOMI_FEATURES.map((feature, i) => (
                    <div key={i} className="group relative h-[650px] rounded-[2.5rem] p-10 overflow-hidden bg-gradient-to-b from-[#2B1556] to-[#140727] border border-white/5 shadow-[inset_0_2px_20px_rgba(255,255,255,0.05)] hover:border-white/20 transition-all duration-500 hover:-translate-y-2 flex flex-col">
                      <div className="mb-8 relative z-20">
                        <h3 className="font-komi text-4xl uppercase tracking-tight text-white">{feature.title}</h3>
                      </div>
                      
                      {/* Glassmorphic Phone Mockup inside exactly like Komi */}
                      <div className="flex-1 w-full relative z-10 perspective-1000">
                        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[110%] aspect-[9/16] bg-black/40 rounded-3xl backdrop-blur-xl border border-white/10 shadow-2xl p-4 flex flex-col gap-4 transform transition-transform duration-700 group-hover:scale-105 group-hover:-translate-y-4">
                           {/* Dynamic Mockup specific to the card */}
                           {i === 0 && ( /* Website Mockup */
                             <>
                               <div className="w-full h-40 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl"></div>
                               <div className="flex gap-2">
                                 <div className="w-12 h-12 rounded-full bg-white/20"></div>
                                 <div className="flex-1 space-y-2 py-2">
                                   <div className="w-3/4 h-3 bg-white/20 rounded"></div>
                                   <div className="w-1/2 h-3 bg-white/20 rounded"></div>
                                 </div>
                               </div>
                               <div className="mt-4 space-y-3">
                                  <div className="w-full h-12 bg-white/5 border border-white/10 rounded-lg flex items-center justify-between px-3">
                                     <span className="w-1/3 h-2 bg-white/20 rounded"></span>
                                     <span className="w-6 h-6 rounded-full bg-[#D2FF00]/20"></span>
                                  </div>
                               </div>
                             </>
                           )}
                           {i === 1 && ( /* Payments Mockup */
                             <div className="h-full flex flex-col">
                               <div className="w-full bg-[#D2FF00] p-3 rounded-lg text-black font-black text-center text-sm uppercase">Quick Checkout</div>
                               <div className="mt-6 flex-1 bg-white/5 rounded-xl border border-white/10 p-4 flex flex-col justify-end">
                                 <div className="flex justify-between items-center mb-4 border-t border-white/10 pt-4">
                                   <span className="font-bold text-white/50">Total</span>
                                   <span className="font-komi text-3xl">$124.00</span>
                                 </div>
                               </div>
                             </div>
                           )}
                           {i === 2 && ( /* Data Capture */
                             <div className="space-y-4 mt-10">
                               <div className="w-full p-4 rounded-xl bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-white/10">
                                 <Users className="w-8 h-8 text-blue-400 mb-2" />
                                 <div className="font-bold">14,209 Contacts</div>
                               </div>
                               <div className="w-full h-10 bg-white/10 rounded-lg"></div>
                               <div className="w-full h-10 bg-white/10 rounded-lg"></div>
                             </div>
                           )}
                           {i === 3 && ( /* Analytics */
                             <div className="h-full flex flex-col justify-end gap-2 pb-4">
                               {/* Bar Chart Mockup */}
                               <div className="flex items-end h-32 gap-2 border-b border-white/20 pb-2">
                                  <div className="flex-1 bg-[#D2FF00] rounded-t-sm" style={{ height: '40%' }}></div>
                                  <div className="flex-1 bg-[#D2FF00] rounded-t-sm" style={{ height: '70%' }}></div>
                                  <div className="flex-1 bg-[#D2FF00] rounded-t-sm" style={{ height: '30%' }}></div>
                                  <div className="flex-1 bg-[#D2FF00] rounded-t-sm" style={{ height: '100%' }}></div>
                               </div>
                               <div className="font-bold text-xs text-white/50 mt-2">LAST 30 DAYS</div>
                             </div>
                           )}
                        </div>
                      </div>

                      <p className="text-lg text-white/60 font-medium relative z-20 mt-8 group-hover:text-white transition-colors">{feature.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* MAXIMIZE YOUR EARNINGS BENTO GRID */}
            <section className="py-32 px-6 bg-[#160824] pb-40">
              <div className="max-w-[1200px] mx-auto">
                <div className="text-center mb-16">
                  <h2 className="font-komi text-6xl md:text-8xl uppercase tracking-tight mb-6 text-white drop-shadow-lg">MAXIMIZE YOUR EARNINGS</h2>
                  
                  <div className="flex justify-center gap-4 flex-wrap">
                    {(["SELL ANYTHING", "1-1 COACHING", "DIGITAL PRODUCTS"] as const).map(tab => (
                      <button 
                        key={tab} 
                        onClick={() => setKomiBentoTab(tab)}
                        className={`px-8 py-3 rounded-full font-black uppercase tracking-widest text-sm transition-all border ${komiBentoTab === tab ? "border-[#D2FF00] text-[#D2FF00]" : "border-white/20 text-white hover:border-white/50"}`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-6 h-[600px]">
                  {/* Stats Mini Card */}
                  <div className="bg-gradient-to-b from-[#2B1556] to-[#140727] rounded-[2.5rem] p-10 border border-white/5 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl">
                    <h4 className="font-komi text-3xl mb-8 text-center uppercase">CREATOR SCORE</h4>
                    <div className="w-56 h-56 rounded-full border-[20px] border-[#D2FF00]/10 flex items-center justify-center relative">
                      <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                        <circle cx="112" cy="112" r="92" stroke="#D2FF00" strokeWidth="20" fill="none" strokeDasharray="578" strokeDashoffset="100" />
                      </svg>
                      <div className="text-center">
                        <span className="block font-komi text-6xl">810</span>
                        <span className="text-xs text-white/50 uppercase font-black tracking-widest mt-1 block">OUT OF 999</span>
                      </div>
                    </div>
                  </div>

                  {/* Massive Action Card */}
                  <div className="lg:col-span-2 bg-[#1A0B2E] rounded-[2.5rem] border border-white/10 flex flex-col justify-between overflow-hidden relative group shadow-2xl">
                    {/* Background Graphic */}
                    <div className="absolute inset-0 opacity-20 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Allu_Arjun_at_Pushpa_trailer_launch.jpg/800px-Allu_Arjun_at_Pushpa_trailer_launch.jpg')] bg-cover bg-center blend-overlay grayscale"></div>
                    
                    <div className="p-10 relative z-20">
                      <h3 className="font-komi text-5xl tracking-tight text-white uppercase">{komiBentoTab}</h3>
                    </div>
                    
                    {/* The Giant Slide-up Mockup */}
                    <div className="absolute -right-10 -bottom-10 w-[90%] h-[85%] bg-white rounded-tl-[3rem] shadow-2xl p-8 text-black transform translate-y-12 translate-x-12 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-700 ease-out z-20">
                       <div className="flex justify-between items-center mb-8 border-b pb-6">
                         <h4 className="font-komi text-4xl uppercase">Order Summary</h4>
                         <span className="bg-black text-[#D2FF00] px-4 py-2 rounded-lg font-black uppercase text-sm">SECURE</span>
                       </div>
                       
                       <div className="space-y-4 max-w-md">
                          <div className="flex gap-4 items-center p-4 bg-gray-50 rounded-2xl border border-gray-200">
                             <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl"></div>
                             <div>
                               <p className="font-black text-lg">VIP Consult Session</p>
                               <p className="text-sm font-bold text-gray-500">Digital Service</p>
                             </div>
                             <p className="font-komi text-2xl ml-auto">$250</p>
                          </div>
                          
                          <div className="pt-6">
                            <input type="email" placeholder="Email Address" className="w-full text-lg font-bold p-4 rounded-xl border-2 border-gray-200 mb-4 outline-none focus:border-black" />
                            <button className="w-full font-komi text-2xl bg-[#D2FF00] hover:bg-black hover:text-[#D2FF00] text-black py-5 rounded-xl uppercase transition-colors">Complete Payment</button>
                          </div>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ═══════════════════════════════════════════
            ■ THE LINK.ME CLONE (BUSINESS/AGENCIES) ■ 
        ═══════════════════════════════════════════ */}
        {!isKomi && (
          <div className="animate-in fade-in duration-500">
            {/* HERO LINK.ME STYLE */}
            <section className="px-6 py-32 flex flex-col items-center text-center max-w-5xl mx-auto">
               <h1 className="text-7xl md:text-[8rem] font-bold tracking-tighter mb-8 leading-[0.9] text-white">
                 {activeSegment === "Business" ? "Enterprise tools." : "Agency mastery."}
                 <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-500 to-gray-700">Reimagined.</span>
               </h1>
               <p className="text-2xl text-gray-400 font-medium mb-12 max-w-3xl leading-relaxed">
                 {activeSegment === "Business" ? "Bring all your enterprise tools into one powerful, branded ecosystem. Convert traffic into leads instantly." : "Manage multi-talent rosters, track aggregated analytics, and export white-labeled reports from one command center."}
               </p>
               <div className="flex flex-col sm:flex-row gap-4">
                 <Link href="/signup" className="px-10 py-5 rounded-full font-bold text-black bg-white hover:bg-gray-200 text-lg transition-colors">
                   Get Started For Free
                 </Link>
                 <Link href="/contact" className="px-10 py-5 rounded-full font-bold text-white bg-white/10 hover:bg-white/20 border border-white/10 text-lg transition-colors">
                   Talk to Sales
                 </Link>
               </div>
            </section>

            {/* APPLE STYLE SPLIT SCREEN DEMO */}
            <section className="px-6 py-24 pb-40 border-t border-white/5">
               <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
                  
                  {/* Left: Huge typography features */}
                  <div className="space-y-16">
                     <div className="border-l-[6px] border-white pl-8">
                        <MonitorSmartphone className="w-12 h-12 mb-8 text-white" />
                        <h3 className="text-5xl font-bold tracking-tighter mb-4">A link in bio that feels like a native app.</h3>
                        <p className="text-2xl text-gray-500 font-medium leading-relaxed">Design an experience that keeps users engaged without them ever leaving Instagram or TikTok.</p>
                     </div>
                     <div className="border-l-[6px] border-gray-800 pl-8 opacity-60 hover:opacity-100 transition-opacity">
                        <Fingerprint className="w-12 h-12 mb-8 text-gray-400" />
                        <h3 className="text-5xl font-bold tracking-tighter mb-4 text-gray-300">Identity-driven analytics.</h3>
                        <p className="text-2xl text-gray-600 font-medium leading-relaxed">Capture hyper-accurate data using integrated Meta and Google Tracking pixels.</p>
                     </div>
                  </div>

                  {/* Right: Glassmorphic Phone & UI Float */}
                  <div className="relative h-[800px] flex items-center justify-center bg-gradient-to-br from-[#111] to-[#050505] rounded-[4rem] border border-white/5 overflow-hidden group">
                     {/* Ambient Glow */}
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-[120px]"></div>
                     
                     {/* Phone Frame */}
                     <div className="w-[340px] h-[720px] bg-black rounded-[3.5rem] border-[12px] border-gray-900 shadow-[0_0_80px_rgba(255,255,255,0.05)] relative transform perspective-1000 rotateY-[-12deg] rotateX-[4deg] group-hover:rotateY-[0deg] transition-all duration-1000 ease-out">
                        {/* Status bar */}
                        <div className="absolute top-0 w-full h-8 flex justify-center items-center z-20">
                          <div className="w-1/3 h-6 bg-gray-900 rounded-b-2xl"></div>
                        </div>
                        {/* Screen Content */}
                        <div className="absolute inset-0 p-6 pt-20 flex flex-col items-center bg-[#0a0a0a] rounded-[2.5rem] overflow-hidden">
                          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-gray-700 to-gray-500 mb-6 p-1">
                            <div className="w-full h-full bg-black rounded-full flex items-center justify-center">
                              <Target className="w-10 h-10 text-white"/>
                            </div>
                          </div>
                          <h4 className="text-3xl font-bold text-white mb-2">{activeSegment === "Business" ? "Acme Corp" : "Agency Hub"}</h4>
                          <p className="text-gray-500 font-medium mb-10">getprofile.link/brand</p>
                          
                          <div className="w-full space-y-4">
                            {[1, 2, 3].map((item) => (
                              <div key={item} className="w-full h-16 bg-white/5 hover:bg-white/10 transition-colors rounded-2xl border border-white/10 flex items-center px-4">
                                 <div className="w-10 h-10 bg-white/10 rounded-full mr-4"></div>
                                 <div className="h-4 w-32 bg-white/20 rounded"></div>
                              </div>
                            ))}
                          </div>
                        </div>
                     </div>
                  </div>

               </div>
            </section>
          </div>
        )}
      </main>

      {/* ═══════════════════════════════════════════
          SHARED FOOTER
      ═══════════════════════════════════════════ */}
      <footer className="border-t border-white/10 py-20 px-6">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center opacity-40 hover:opacity-100 transition-opacity text-sm font-bold tracking-widest uppercase">
           <div className="flex items-center gap-3 mb-4 md:mb-0">
              <Globe className="w-6 h-6" />
              <span className="text-xl tracking-tighter">getprofile</span>
           </div>
           <p>&copy; 2026 GETPROFILE INC. BUILT FOR THE FUTURE.</p>
        </div>
      </footer>
    </div>
  );
}
