"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, ChevronLeft, ChevronRight, CheckCircle2, Loader2, X, User, Mail, MessageSquare } from "lucide-react";

interface PublicBookingWidgetProps {
  username: string;
  creatorName: string;
}

const TIME_SLOTS = [
  "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM",
  "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM",
];

export default function PublicBookingWidget({ username, creatorName }: PublicBookingWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<"date" | "time" | "details" | "success">("date");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState("");
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [bookedSlots, setBookedSlots] = useState<{date: string; time: string}[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    if (isOpen) {
      fetch(`/api/booking/public?username=${username}`)
        .then(r => r.json())
        .then(d => { if (d.bookedSlots) setBookedSlots(d.bookedSlots); })
        .catch(() => {});
    }
  }, [isOpen, username]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth, year, month };
  };

  const { firstDay, daysInMonth, year, month } = getDaysInMonth(currentMonth);
  const today = new Date();
  today.setHours(0,0,0,0);

  const isDateBooked = (dateStr: string, time: string) => {
    return bookedSlots.some(s => s.date === dateStr && s.time === time);
  };

  const availableTimesForDate = selectedDate
    ? TIME_SLOTS.filter(t => !isDateBooked(selectedDate, t))
    : [];

  const handleSubmit = async () => {
    if (!guestName || !guestEmail) return;
    setLoading(true);

    try {
      const res = await fetch("/api/booking/public", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username, guestName, guestEmail, date: selectedDate, time: selectedTime, notes,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setStep("success");
      }
    } catch (err) {
      // Silent fail
    } finally {
      setLoading(false);
    }
  };

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-2xl font-black text-sm hover:opacity-90 transition-all shadow-xl shadow-indigo-500/20"
      >
        <Calendar className="w-5 h-5" />
        Book a Session
      </button>

      {/* Booking Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-6 duration-500 max-h-[90vh] overflow-y-auto">
            
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div>
                <h3 className="font-black text-slate-900 text-lg">Book with {creatorName}</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {step === "date" && "Pick a date"}
                  {step === "time" && "Choose a time slot"}
                  {step === "details" && "Your details"}
                  {step === "success" && "Confirmed!"}
                </p>
              </div>
              <button onClick={() => { setIsOpen(false); setStep("date"); }} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors">
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            {step === "success" ? (
              <div className="p-10 text-center">
                <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                </div>
                <h3 className="text-2xl font-black text-slate-900">Booking Confirmed! 🎉</h3>
                <p className="text-slate-500 text-sm mt-2">
                  {selectedDate} at {selectedTime}
                </p>
                <p className="text-slate-400 text-xs mt-4">You'll receive a confirmation email at {guestEmail}</p>
                <button onClick={() => { setIsOpen(false); setStep("date"); }} className="mt-6 text-sm text-indigo-600 font-bold hover:underline">Close</button>
              </div>
            ) : (
              <div className="p-6">
                {/* Step 1: Date Picker */}
                {step === "date" && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <button onClick={() => setCurrentMonth(new Date(year, month - 1))} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200">
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <h4 className="font-black text-slate-900">{monthNames[month]} {year}</h4>
                      <button onClick={() => setCurrentMonth(new Date(year, month + 1))} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d => (
                        <div key={d} className="text-center text-[10px] font-bold text-slate-400 uppercase py-1">{d}</div>
                      ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                      {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
                      {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1;
                        const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                        const dateObj = new Date(year, month, day);
                        const isPast = dateObj < today;
                        const isSelected = selectedDate === dateStr;
                        const isToday = dateObj.getTime() === today.getTime();

                        return (
                          <button
                            key={day}
                            disabled={isPast}
                            onClick={() => { setSelectedDate(dateStr); setStep("time"); }}
                            className={`aspect-square rounded-xl text-sm font-bold transition-all ${
                              isPast ? "text-slate-200 cursor-not-allowed" :
                              isSelected ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30" :
                              isToday ? "bg-indigo-100 text-indigo-700" :
                              "text-slate-700 hover:bg-indigo-50"
                            }`}
                          >
                            {day}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Step 2: Time Slots */}
                {step === "time" && (
                  <div>
                    <button onClick={() => setStep("date")} className="flex items-center gap-1 text-sm text-indigo-600 font-bold mb-4 hover:underline">
                      <ChevronLeft className="w-4 h-4" /> Change date
                    </button>
                    <p className="text-sm text-slate-500 mb-4">Available slots for <strong className="text-slate-900">{selectedDate}</strong></p>
                    <div className="grid grid-cols-3 gap-2">
                      {availableTimesForDate.length === 0 ? (
                        <p className="col-span-full text-center text-slate-400 text-sm py-8">No available slots on this date</p>
                      ) : (
                        availableTimesForDate.map(t => (
                          <button
                            key={t}
                            onClick={() => { setSelectedTime(t); setStep("details"); }}
                            className={`py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-1 ${
                              selectedTime === t
                                ? "bg-indigo-600 text-white shadow-lg"
                                : "bg-slate-50 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200"
                            }`}
                          >
                            <Clock className="w-3 h-3" /> {t}
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* Step 3: Guest Details */}
                {step === "details" && (
                  <div className="space-y-4">
                    <button onClick={() => setStep("time")} className="flex items-center gap-1 text-sm text-indigo-600 font-bold mb-2 hover:underline">
                      <ChevronLeft className="w-4 h-4" /> Change time
                    </button>

                    <div className="bg-indigo-50 p-4 rounded-2xl flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-black text-indigo-900">{selectedDate}</p>
                        <p className="text-xs text-indigo-600/70">{selectedTime} · 30 min session</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        <User className="w-3 h-3 inline mr-1" /> Your Name *
                      </label>
                      <input value={guestName} onChange={e => setGuestName(e.target.value)} placeholder="Jane Smith"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-all" />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        <Mail className="w-3 h-3 inline mr-1" /> Email *
                      </label>
                      <input value={guestEmail} onChange={e => setGuestEmail(e.target.value)} type="email" placeholder="jane@email.com"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-all" />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        <MessageSquare className="w-3 h-3 inline mr-1" /> Notes (optional)
                      </label>
                      <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} placeholder="Tell me what you'd like to discuss..."
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-all resize-none" />
                    </div>

                    <button
                      onClick={handleSubmit}
                      disabled={loading || !guestName || !guestEmail}
                      className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-4 rounded-2xl font-black text-sm hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-lg shadow-indigo-500/20"
                    >
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>
                        <CheckCircle2 className="w-5 h-5" /> Confirm Booking
                      </>}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
