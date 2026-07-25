"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import {
  Search,
  Filter,
  Calendar,
  Clock,
  Video,
  Phone,
  MapPin,
  Star,
  Award,
  Info,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  CalendarCheck,
  AlertCircle,
  FileText,
  User,
  Heart,
  Stethoscope,
  ChevronRight,
  RefreshCw,
  X,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

// ----------------- MOCK DATA -----------------
const DOCTORS = [
  {
    id: 1,
    name: "Dr. Aarav Mehta",
    title: "Senior Ayurvedic Physician",
    degree: "BAMS, MD (Kaya Chikitsa - Internal Medicine)",
    experience: "15+ Years",
    speciality: "Digestive Disorders, Chronic Illness, Autoimmune Support",
    rating: 4.9,
    reviews: 124,
    fee: 800,
    availability: "Mon - Fri",
    slots: ["09:00 AM", "10:30 AM", "02:00 PM", "04:30 PM"],
    dominantDoshaSpecialty: "Vata",
    accentColor: "from-emerald-500 to-teal-600",
    bgLight: "bg-emerald-50/50",
    borderCol: "border-emerald-100",
    desc: "Dr. Aarav specializes in treating complex, chronic disorders by identifying root causes according to classical Ayurvedic principles. Expert in pulse diagnosis (Nadi Pariksha)."
  },
  {
    id: 2,
    name: "Dr. Anjali Sharma",
    title: "Panchakarma & Wellness Specialist",
    degree: "BAMS, MS (Panchakarma)",
    experience: "10+ Years",
    speciality: "Stress Management, Detoxification, Ayurvedic Skin Care",
    rating: 4.8,
    reviews: 98,
    fee: 700,
    availability: "Mon - Sat",
    slots: ["10:00 AM", "11:30 AM", "03:00 PM", "05:30 PM"],
    dominantDoshaSpecialty: "Pitta",
    accentColor: "from-amber-500 to-orange-600",
    bgLight: "bg-amber-50/50",
    borderCol: "border-amber-100",
    desc: "Dr. Anjali blends classical Panchakarma therapies with modern lifestyle adjustments. Highly recommended for rejuvenation treatments and balancing pitta-related issues."
  },
  {
    id: 3,
    name: "Dr. Vikram Ranade",
    title: "Ayurvedic Cardiologist & Rasayana Expert",
    degree: "BAMS, PhD (Ayurveda)",
    experience: "18+ Years",
    speciality: "Rejuvenation (Rasayana), Heart Health, Lifestyle Diseases",
    rating: 4.95,
    reviews: 156,
    fee: 1000,
    availability: "Tue, Thu, Sat",
    slots: ["08:30 AM", "11:00 AM", "04:00 PM", "06:00 PM"],
    dominantDoshaSpecialty: "Kapha",
    accentColor: "from-blue-500 to-indigo-600",
    bgLight: "bg-blue-50/50",
    borderCol: "border-blue-100",
    desc: "A globally renowned researcher and physician, Dr. Vikram focuses on longevity science and metabolic wellness through specialized diets, yoga, and herbs."
  },
  {
    id: 4,
    name: "Dr. Sunita Patel",
    title: "Ayurvedic Gynaecologist & Pediatrician",
    degree: "BAMS, MD (Prasuti Tantra & Stri Roga)",
    experience: "12+ Years",
    speciality: "Women's Health, Hormonal Balance, Child Care",
    rating: 4.75,
    reviews: 84,
    fee: 750,
    availability: "Mon - Fri",
    slots: ["09:30 AM", "12:00 PM", "03:30 PM", "05:00 PM"],
    dominantDoshaSpecialty: "Tridoshic",
    accentColor: "from-rose-500 to-pink-600",
    bgLight: "bg-rose-50/50",
    borderCol: "border-rose-100",
    desc: "Dr. Sunita is dedicated to supporting women through every stage of life. She specializes in maternal care, hormonal alignment, and holistic child development."
  }
];

const FAQS = [
  {
    q: "How does online Ayurvedic consultation work?",
    a: "You select a certified Ayurvedic doctor (Vaidya), choose a convenient date and time, and submit your primary health complaints. The consultation takes place via secure video or audio call directly through our platform or integrated telehealth links. The doctor will evaluate your Prakriti (constitution), review symptoms, and generate a transparent, blockchain-verifiable digital prescription."
  },
  {
    q: "What is the difference between Vata, Pitta, and Kapha?",
    a: "These are the three biological energies (Doshas) that govern our physical and mental processes. Vata governs movement, Pitta governs metabolism and digestion, and Kapha governs structure and lubrication. Balanced doshas represent health, while imbalances lead to disease. Our practitioners help restore this equilibrium."
  },
  {
    q: "Are the doctors on AyurSaathi verified?",
    a: "Absolutely. Every practitioner on our platform undergoes rigorous credential validation. We verify BAMS/MD/PhD degrees, medical council registration status, and experience certificates before enabling them to consult. This transparency aligns with our commitment to traceable, trustworthy Ayurvedic solutions."
  },
  {
    q: "Can I get my prescription delivered through the marketplace?",
    a: "Yes! The organic herbs, formulations, and oils recommended by your practitioner can be sourced directly from our fair-trade Marketplace. Each herb batch carries complete geo-tagged traceability and lab certificates, ensuring you receive genuine, premium-grade remedies."
  }
];

// Dosha Quiz Questions
const QUIZ_QUESTIONS = [
  {
    id: 1,
    text: "How would you describe your physical body frame and structure?",
    options: [
      { text: "Light, slender, tall or short, with prominent joints", value: "Vata" },
      { text: "Medium, athletic, well-proportioned, moderate build", value: "Pitta" },
      { text: "Large, sturdy, broad shoulders, tends to gain weight easily", value: "Kapha" }
    ]
  },
  {
    id: 2,
    text: "Which statement best describes your response to weather conditions?",
    options: [
      { text: "I dislike cold and windy weather, love warm climates, skin gets dry", value: "Vata" },
      { text: "I dislike hot weather, sweat easily, prefer cool environments", value: "Pitta" },
      { text: "I am comfortable in most seasons but dislike damp, cold, and humid days", value: "Kapha" }
    ]
  },
  {
    id: 3,
    text: "Which option best reflects your sleep patterns and digestion?",
    options: [
      { text: "Light, irregular sleep; variable digestion, prone to bloating/gas", value: "Vata" },
      { text: "Sound, moderate sleep; strong appetite, gets irritable if meals are missed", value: "Pitta" },
      { text: "Deep, long sleep; slow, steady digestion, can skip meals easily", value: "Kapha" }
    ]
  }
];

export default function ConsultationPage() {
  const { user } = useAuth();
  
  // Page states
  const [searchTerm, setSearchTerm] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("All");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  
  // Booking system states
  const [bookings, setBookings] = useState([]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
  const [bookingForm, setBookingForm] = useState({
    date: "",
    time: "",
    type: "video", // video, voice, in-person
    name: "",
    age: "",
    contact: "",
    symptoms: "",
    notes: ""
  });

  // Prakriti (Dosha) Quiz states
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [quizResult, setQuizResult] = useState(null);

  // FAQ states
  const [openFaq, setOpenFaq] = useState(null);

  // Load bookings from localStorage (hydration safe)
  useEffect(() => {
    const stored = localStorage.getItem("ayursaathi_bookings");
    if (stored) {
      try {
        setBookings(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse bookings", e);
      }
    }
  }, []);

  // Pre-fill user details if logged in
  useEffect(() => {
    if (user) {
      setBookingForm(prev => ({
        ...prev,
        name: user.name || "",
        contact: user.phone || ""
      }));
    }
  }, [user]);

  // Filter doctors
  const filteredDoctors = DOCTORS.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          doc.speciality.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSpecialty = specialtyFilter === "All" || 
                             doc.dominantDoshaSpecialty === specialtyFilter;
    
    return matchesSearch && matchesSpecialty;
  });

  // Handle Quiz selection
  const handleQuizAnswer = (value) => {
    const updatedAnswers = [...quizAnswers, value];
    setQuizAnswers(updatedAnswers);

    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate dominant dosha
      const counts = updatedAnswers.reduce((acc, val) => {
        acc[val] = (acc[val] || 0) + 1;
        return acc;
      }, {});

      let dominant = "Vata";
      let maxCount = 0;
      Object.keys(counts).forEach(key => {
        if (counts[key] > maxCount) {
          maxCount = counts[key];
          dominant = key;
        }
      });

      setQuizResult(dominant);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setQuizAnswers([]);
    setQuizResult(null);
    setShowQuiz(false);
  };

  // Open booking modal
  const startBooking = (doctor) => {
    setSelectedDoctor(doctor);
    setBookingStep(1);
    setBookingForm({
      date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // tomorrow
      time: doctor.slots[0],
      type: "video",
      name: user?.name || "",
      age: "",
      contact: user?.phone || "",
      symptoms: "",
      notes: ""
    });
    setShowBookingModal(true);
  };

  // Submit Booking
  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (bookingStep === 1) {
      // Move to step 2 (symptoms form)
      if (!bookingForm.date || !bookingForm.time) {
        toast.error("Please select a date and time slot.");
        return;
      }
      setBookingStep(2);
    } else {
      // Finalize booking
      if (!bookingForm.name || !bookingForm.age || !bookingForm.contact || !bookingForm.symptoms) {
        toast.error("Please fill in all required patient details.");
        return;
      }

      const newBooking = {
        id: "BK-" + Math.floor(100000 + Math.random() * 900000),
        doctor: selectedDoctor,
        date: bookingForm.date,
        time: bookingForm.time,
        type: bookingForm.type,
        patientName: bookingForm.name,
        patientAge: bookingForm.age,
        patientContact: bookingForm.contact,
        symptoms: bookingForm.symptoms,
        notes: bookingForm.notes,
        status: "Confirmed",
        bookedAt: new Date().toISOString()
      };

      const updatedBookings = [newBooking, ...bookings];
      setBookings(updatedBookings);
      localStorage.setItem("ayursaathi_bookings", JSON.stringify(updatedBookings));

      setBookingStep(3); // Success step
      toast.success("Consultation appointment booked successfully!");
    }
  };

  // Cancel Booking
  const cancelBooking = (id) => {
    const confirm = window.confirm("Are you sure you want to cancel this appointment?");
    if (!confirm) return;

    const updated = bookings.map(b => 
      b.id === id ? { ...b, status: "Cancelled" } : b
    );
    setBookings(updated);
    localStorage.setItem("ayursaathi_bookings", JSON.stringify(updated));
    toast.info("Appointment cancelled successfully.");
  };

  return (
    <div className="bg-[#ECF39E]/10 min-h-screen flex flex-col font-sans text-brand-900 antialiased selection:bg-[#ECF39E] selection:text-[#31572C]">
      <Navbar />

      {/* Hero Banner Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#31572C] to-[#4F772D] text-white py-16 md:py-24">
        {/* Dynamic design background blobs */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent pointer-events-none" />
        <div className="absolute -top-12 -left-12 w-96 h-96 bg-[#ECF39E] rounded-full filter blur-3xl opacity-10" />
        <div className="absolute -bottom-16 -right-16 w-96 h-96 bg-[#90A955] rounded-full filter blur-3xl opacity-20" />

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-[#ECF39E] text-[#31572C] mb-6 shadow-sm uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Certified Ayurvedic Vaidyas
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight">
              Holistic Ayurvedic Consultations
            </h1>
            <p className="mt-6 text-lg md:text-xl text-[#ECF39E] max-w-2xl mx-auto font-medium">
              Consult with expert practitioners to diagnose your Prakriti (constitution) and obtain personalized, transparently traceable herbal treatment plans.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 py-12 flex-1 w-full grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left Column: Filters, Dosha Quiz, and My Bookings */}
        <div className="lg:col-span-1 space-y-8">
          
          {/* Quick Prakriti Dosha Quiz Card */}
          <div className="bg-gradient-to-br from-[#31572C] to-[#4F772D] rounded-2xl p-6 text-white shadow-md relative overflow-hidden border border-[#ECF39E]/20">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-6 -mt-6" />
            
            {!showQuiz && !quizResult && (
              <div>
                <h3 className="text-xl font-bold flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-[#ECF39E]" /> Discover Your Dosha
                </h3>
                <p className="text-sm text-[#ECF39E] leading-relaxed mb-4">
                  Not sure which therapist matches your constitution? Take our 1-minute Prakriti quiz to reveal your dominant Dosha (Vata, Pitta, Kapha) and get doctor recommendations.
                </p>
                <button
                  onClick={() => setShowQuiz(true)}
                  className="w-full bg-[#ECF39E] hover:bg-white text-[#31572C] font-bold py-2.5 px-4 rounded-xl transition-all duration-300 text-sm shadow-sm cursor-pointer hover:scale-[1.02]"
                >
                  Start Dosha Quiz
                </button>
              </div>
            )}

            {showQuiz && !quizResult && (
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs text-[#ECF39E]">
                  <span>Question {currentQuestion + 1} of {QUIZ_QUESTIONS.length}</span>
                  <button onClick={resetQuiz} className="hover:text-white"><X className="w-4 h-4" /></button>
                </div>
                <h4 className="font-bold text-base leading-snug">
                  {QUIZ_QUESTIONS[currentQuestion].text}
                </h4>
                <div className="space-y-2 mt-3">
                  {QUIZ_QUESTIONS[currentQuestion].options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleQuizAnswer(opt.value)}
                      className="w-full text-left bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl p-3 text-sm transition-all duration-200 cursor-pointer"
                    >
                      {opt.text}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {quizResult && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold bg-[#ECF39E]/20 px-2 py-0.5 rounded text-[#ECF39E]">Your Constitutional Prakriti</span>
                  <button onClick={resetQuiz} className="text-[#ECF39E] hover:text-white text-xs underline flex items-center gap-1">
                    <RefreshCw className="w-3 h-3" /> Retake
                  </button>
                </div>
                <div>
                  <h4 className="text-2xl font-extrabold text-[#ECF39E] tracking-wide">
                    Dominant: {quizResult} Dosha
                  </h4>
                  <p className="text-xs text-slate-100 mt-2 leading-relaxed">
                    {quizResult === "Vata" && "Vata reflects the elements of Space and Air. When balanced, it fuels creativity and vitality. Imbalances can trigger dry skin, anxiety, or bloating. We recommend Dr. Aarav Mehta."}
                    {quizResult === "Pitta" && "Pitta represents the Fire and Water elements, regulating metabolism and heat. Balanced Pitta brings sharp intellect. Imbalance causes inflammation or heartburn. We recommend Dr. Anjali Sharma."}
                    {quizResult === "Kapha" && "Kapha embodies Earth and Water, promoting stability, stamina, and structural integrity. Excess Kapha can bring lethargy or sluggish digestion. We recommend Dr. Vikram Ranade."}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSpecialtyFilter(quizResult);
                    toast.info(`Filtered practitioner list for ${quizResult} specialists.`);
                  }}
                  className="w-full bg-white hover:bg-[#ECF39E] text-[#31572C] font-bold py-2.5 px-4 rounded-xl transition-all duration-300 text-sm shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  Filter for {quizResult} Specialists <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Filters Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#4F772D]/10">
            <h3 className="text-lg font-bold flex items-center gap-2 mb-4 border-b pb-2 text-[#31572C]">
              <Filter className="w-5 h-5 text-[#90A955]" /> Filter Practitioners
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
                  Specialty Filter
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {["All", "Vata", "Pitta", "Kapha"].map((spec) => (
                    <button
                      key={spec}
                      onClick={() => setSpecialtyFilter(spec)}
                      className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                        specialtyFilter === spec
                          ? "bg-[#31572C] border-[#31572C] text-white"
                          : "bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700"
                      }`}
                    >
                      {spec === "All" ? "All Specialists" : `${spec} Specialists`}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
                  Consultation Format
                </label>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Video className="w-4 h-4 text-emerald-600" />
                    <span>Secure Video Tele-call</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Phone className="w-4 h-4 text-sky-600" />
                    <span>Audio Consultations</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <MapPin className="w-4 h-4 text-amber-600" />
                    <span>Clinic / In-Person Visits</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Bookings Panel */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#4F772D]/10 overflow-hidden">
            <h3 className="text-lg font-bold flex items-center gap-2 mb-4 border-b pb-2 text-[#31572C]">
              <CalendarCheck className="w-5 h-5 text-[#90A955]" /> My Consultations
            </h3>

            {bookings.length === 0 ? (
              <div className="text-center py-6 text-gray-400">
                <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm font-medium">No consultations booked yet.</p>
                <p className="text-xs mt-1">Book an appointment to start your wellness journey.</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1 hide-scrollbar">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className={`p-3.5 rounded-xl border text-sm transition-all ${
                      booking.status === "Cancelled"
                        ? "bg-gray-50 border-gray-200 opacity-65"
                        : "bg-emerald-50/20 border-emerald-100"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1.5">
                      <div>
                        <span className="font-bold text-gray-900">{booking.doctor.name}</span>
                        <span className="text-[10px] block font-semibold text-[#90A955] uppercase tracking-wide">
                          {booking.id}
                        </span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        booking.status === "Cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-emerald-100 text-emerald-800"
                      }`}>
                        {booking.status}
                      </span>
                    </div>

                    <div className="space-y-1 text-xs text-gray-600 mt-2">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        <span>{booking.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        <span>{booking.time}</span>
                      </div>
                      <div className="flex items-center gap-1.5 capitalize">
                        {booking.type === "video" && <Video className="w-3.5 h-3.5 text-emerald-600" />}
                        {booking.type === "voice" && <Phone className="w-3.5 h-3.5 text-sky-600" />}
                        {booking.type === "in-person" && <MapPin className="w-3.5 h-3.5 text-amber-600" />}
                        <span>{booking.type} Consultation</span>
                      </div>
                    </div>

                    {booking.status === "Confirmed" && (
                      <button
                        onClick={() => cancelBooking(booking.id)}
                        className="mt-3 w-full text-center text-xs text-red-600 hover:text-red-700 font-bold bg-red-50 hover:bg-red-100 py-1.5 rounded-lg transition-colors cursor-pointer"
                      >
                        Cancel Appointment
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          
        </div>

        {/* Right Column: Doctor Directory Search & Cards */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search Ayurvedic doctors, specialities (e.g. digestive, detox, stress)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-[#4F772D]/15 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#90A955]/50 transition-all font-medium placeholder-gray-400"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Directory Listings Grid */}
          {filteredDoctors.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-[#4F772D]/10">
              <AlertCircle className="w-12 h-12 text-[#90A955] mx-auto mb-3 opacity-60" />
              <h4 className="text-xl font-bold text-gray-800">No Practitioners Found</h4>
              <p className="text-gray-500 mt-2 max-w-sm mx-auto">
                No practitioner matches your filter or search query "{searchTerm}". Try clearing filters or altering search terms.
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSpecialtyFilter("All");
                }}
                className="mt-5 px-5 py-2 rounded-xl bg-[#31572C] text-white hover:bg-[#4F772D] transition-colors text-sm font-bold cursor-pointer"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredDoctors.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group hover:-translate-y-1"
                >
                  {/* Doctor header card */}
                  <div className={`h-2.5 bg-gradient-to-r ${doc.accentColor}`} />
                  
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div className="space-y-4">
                      {/* Name & Title */}
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="text-lg font-bold text-gray-900 group-hover:text-[#31572C] transition-colors">
                            {doc.name}
                          </h4>
                          <span className="flex-shrink-0 flex items-center gap-1 bg-[#ECF39E]/40 text-[#31572C] text-xs font-extrabold px-2.5 py-0.5 rounded-full">
                            <Star className="w-3.5 h-3.5 fill-[#4F772D] text-[#4F772D]" /> {doc.rating}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-[#90A955] mt-0.5">{doc.title}</p>
                        <p className="text-[11px] font-semibold text-gray-400 mt-0.5">{doc.degree}</p>
                      </div>

                      {/* Brief description */}
                      <p className="text-xs text-gray-600 leading-relaxed italic">
                        "{doc.desc}"
                      </p>

                      {/* Info Pills */}
                      <div className="grid grid-cols-2 gap-3 text-xs border-t border-b border-gray-50 py-3">
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <Award className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          <span>{doc.experience} Experience</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <Clock className="w-4 h-4 text-amber-600 flex-shrink-0" />
                          <span>{doc.availability} Availability</span>
                        </div>
                      </div>

                      {/* Specialty tags */}
                      <div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                          Core Specialties
                        </span>
                        <p className="text-xs font-semibold text-gray-700 leading-relaxed">
                          {doc.speciality}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between gap-4">
                      <div>
                        <span className="text-[10px] text-gray-400 font-semibold block uppercase">
                          Consult Fee
                        </span>
                        <span className="text-lg font-extrabold text-[#31572C]">
                          ₹{doc.fee} <span className="text-xs font-normal text-gray-400">/ session</span>
                        </span>
                      </div>

                      <button
                        onClick={() => startBooking(doc)}
                        className="bg-[#90A955] hover:bg-[#4F772D] text-white font-bold py-2 px-4 rounded-xl text-xs transition-all shadow-sm cursor-pointer flex items-center gap-1 hover:scale-105"
                      >
                        Book Appointment
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* How It Works Timeline */}
          <section className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm mt-8">
            <h3 className="text-xl font-bold text-[#31572C] text-center mb-8">
              Blockchain-Secured Consultation Journey
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
              <div className="absolute top-1/2 left-[15%] right-[15%] h-0.5 bg-gray-100 -translate-y-1/2 z-0 hidden md:block" />
              
              {[
                {
                  step: "1",
                  title: "Select & Detail",
                  desc: "Choose your Ayurvedic practitioner, provide diagnostic details and health concerns."
                },
                {
                  step: "2",
                  title: "Secure Consult",
                  desc: "Discuss root causes, habits, and symptoms during your tele-health session."
                },
                {
                  step: "3",
                  title: "Traceable Remedies",
                  desc: "Get a digital prescription linked to verified, lab-tested herbs from our marketplace."
                }
              ].map((item, idx) => (
                <div key={idx} className="relative z-10 text-center space-y-3 bg-white p-4 rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-[#ECF39E] text-[#31572C] font-extrabold text-sm flex items-center justify-center mx-auto shadow-inner">
                    {item.step}
                  </div>
                  <h4 className="font-bold text-sm text-gray-900">{item.title}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ Accordion Section */}
          <section className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm mt-8">
            <h3 className="text-xl font-bold text-[#31572C] mb-6">Frequently Asked Questions</h3>
            <div className="space-y-4">
              {FAQS.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={idx} className="border-b border-gray-100 pb-4">
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full flex justify-between items-center text-left py-2 font-bold text-sm text-gray-800 hover:text-[#31572C] transition-colors focus:outline-none cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-[#90A955]" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-[#90A955]" />
                      )}
                    </button>
                    
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <p className="text-xs text-gray-500 leading-relaxed pt-2">
                            {faq.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </section>

        </div>
      </main>

      {/* Booking Dialog Modal */}
      <AnimatePresence>
        {showBookingModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Modal backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black"
              onClick={() => setShowBookingModal(false)}
            />

            {/* Modal Container card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-xl w-full max-w-lg overflow-hidden relative z-10 border border-gray-100"
            >
              {/* Modal header */}
              <div className="bg-[#31572C] text-white p-6 relative">
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="absolute right-4 top-4 text-white/80 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-6 h-6" />
                </button>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-[#ECF39E]/20 flex items-center justify-center">
                    <Stethoscope className="w-5 h-5 text-[#ECF39E]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg leading-snug">Consultation Booking</h3>
                    <p className="text-xs text-[#ECF39E]">with {selectedDoctor?.name}</p>
                  </div>
                </div>

                {/* Progress Indicators */}
                <div className="flex items-center gap-2 mt-6">
                  {[1, 2, 3].map((step) => (
                    <div
                      key={step}
                      className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${
                        bookingStep >= step ? "bg-[#ECF39E]" : "bg-white/20"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Form Content */}
              <form onSubmit={handleBookingSubmit} className="p-6">
                
                {/* STEP 1: Date, Time & Format */}
                {bookingStep === 1 && (
                  <div className="space-y-5">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">
                        1. Select Consultation Format
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { val: "video", label: "Video Call", icon: Video, color: "text-emerald-600" },
                          { val: "voice", label: "Voice Call", icon: Phone, color: "text-sky-600" },
                          { val: "in-person", label: "In-Person", icon: MapPin, color: "text-amber-600" }
                        ].map((format) => {
                          const IconComp = format.icon;
                          return (
                            <button
                              key={format.val}
                              type="button"
                              onClick={() => setBookingForm({ ...bookingForm, type: format.val })}
                              className={`py-3 px-2 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-xs font-bold cursor-pointer ${
                                bookingForm.type === format.val
                                  ? "border-[#31572C] bg-[#31572C]/5 text-[#31572C]"
                                  : "border-gray-200 hover:bg-gray-50 text-gray-600"
                              }`}
                            >
                              <IconComp className={`w-4 h-4 ${format.color}`} />
                              <span>{format.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">
                        2. Choose Available Date
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        <input
                          type="date"
                          required
                          min={new Date(Date.now() + 86400000).toISOString().split('T')[0]} // tomorrow onwards
                          value={bookingForm.date}
                          onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                          className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#90A955]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">
                        3. Select Available Slot
                      </label>
                      <div className="grid grid-cols-2 gap-2.5">
                        {selectedDoctor?.slots.map((slot) => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setBookingForm({ ...bookingForm, time: slot })}
                            className={`py-2 px-3 rounded-xl border text-xs font-bold text-center transition-all cursor-pointer ${
                              bookingForm.time === slot
                                ? "border-[#31572C] bg-[#31572C]/5 text-[#31572C]"
                                : "border-gray-200 hover:bg-gray-50 text-gray-700"
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                      <div className="text-xs text-gray-400 font-medium">Step 1 of 2</div>
                      <button
                        type="submit"
                        className="bg-[#31572C] hover:bg-[#4F772D] text-white font-bold py-2.5 px-6 rounded-xl text-xs transition-colors cursor-pointer"
                      >
                        Continue Setup
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 2: Patient Info & Symptoms */}
                {bookingStep === 2 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-3">
                      <div className="col-span-2">
                        <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase">
                          Patient Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={bookingForm.name}
                          onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                          placeholder="Full Name"
                          className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-1 focus:ring-[#90A955]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase">
                          Age *
                        </label>
                        <input
                          type="number"
                          required
                          min="1"
                          max="120"
                          value={bookingForm.age}
                          onChange={(e) => setBookingForm({ ...bookingForm, age: e.target.value })}
                          placeholder="e.g. 28"
                          className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-1 focus:ring-[#90A955]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase">
                        Phone / Contact Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={bookingForm.contact}
                        onChange={(e) => setBookingForm({ ...bookingForm, contact: e.target.value })}
                        placeholder="Mobile number"
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-1 focus:ring-[#90A955]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase">
                        Primary Symptoms & Medical Concerns *
                      </label>
                      <textarea
                        required
                        rows="3"
                        value={bookingForm.symptoms}
                        onChange={(e) => setBookingForm({ ...bookingForm, symptoms: e.target.value })}
                        placeholder="Please describe symptoms, diet issues, pain, or digestive conditions..."
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-1 focus:ring-[#90A955] resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase">
                        Past Reports / Files (Optional)
                      </label>
                      <div className="border border-dashed border-gray-200 rounded-xl p-3 text-center bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 cursor-pointer text-gray-500">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span className="text-[10px] font-semibold">Attach medical reports, prescriptions</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-4">
                      <button
                        type="button"
                        onClick={() => setBookingStep(1)}
                        className="text-xs text-gray-500 hover:text-gray-700 font-bold py-2 px-4 rounded-xl cursor-pointer"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        className="bg-[#31572C] hover:bg-[#4F772D] text-white font-bold py-2.5 px-6 rounded-xl text-xs transition-colors cursor-pointer"
                      >
                        Confirm Booking (₹{selectedDoctor?.fee})
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3: Booking Success */}
                {bookingStep === 3 && (
                  <div className="text-center py-6 space-y-4">
                    <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    
                    <div>
                      <h4 className="font-extrabold text-lg text-gray-900">Appointment Booked!</h4>
                      <p className="text-xs text-gray-400 mt-1">
                        A blockchain consultation block has been allocated.
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-4 text-left max-w-xs mx-auto text-xs space-y-1.5 border border-gray-100">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Doctor:</span>
                        <span className="font-bold text-gray-800">{selectedDoctor?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Format:</span>
                        <span className="font-bold text-gray-800 capitalize">{bookingForm.type} Call</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Date:</span>
                        <span className="font-bold text-gray-800">{bookingForm.date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Time:</span>
                        <span className="font-bold text-gray-800">{bookingForm.time}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Patient:</span>
                        <span className="font-bold text-gray-800">{bookingForm.name} ({bookingForm.age})</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowBookingModal(false)}
                      className="w-full bg-[#31572C] hover:bg-[#4F772D] text-white font-bold py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
                    >
                      Close Window
                    </button>
                  </div>
                )}

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
