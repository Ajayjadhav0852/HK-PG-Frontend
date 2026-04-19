import { useState } from "react";
import FooterSection from "../components/FooterSection";

/* ---------------- CDAC SPECIAL SECTION ---------------- */

function CdacSpecialSection() {
  const [activeTab, setActiveTab] = useState("benefits");

  const benefits = [
    { icon: "🎯", title: "Placement Focused", desc: "Environment designed for CDAC success" },
    { icon: "📚", title: "Study Material", desc: "Pre-CAT & PGDAC support" },
    { icon: "🤫", title: "Silent Environment", desc: "Distraction-free study space" },
    { icon: "⚡", title: "Save Time", desc: "Near CDAC centers" },
    { icon: "👥", title: "Group Stay", desc: "Stay with 3-4 friends" },
    { icon: "📅", title: "Flexible Stay", desc: "6 months, no lock-in" },
  ];

  const testimonials = [
    {
      name: "Rahul S.",
      text: "Perfect location. Got placed in Amdocs. Material really helped.",
    },
    {
      name: "Sanket Patil",
      text: "Group stay helped us study together. Best decision.",
    },
  ];

  return (
    <div className="bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 text-white py-12 px-4">
      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-8">
          <span className="bg-white/20 px-4 py-1 rounded-full text-sm font-bold">
            ⭐ CDAC STUDENT SPECIAL
          </span>

          <h1 className="text-3xl md:text-4xl font-extrabold mt-4 leading-tight">
            Built by a CDAC student,<br />
            for CDAC students
          </h1>

          <p className="text-white/80 mt-3 text-sm md:text-base">
            "Your 6 months matter – we support your placement journey"
          </p>
        </div>

        {/* TABS */}
        <div className="flex justify-center mb-6">
          <div className="bg-white/10 rounded-full p-1 flex">
            <button
              onClick={() => setActiveTab("benefits")}
              className={`px-5 py-2 rounded-full text-sm ${
                activeTab === "benefits"
                  ? "bg-white text-black"
                  : "text-white/70"
              }`}
            >
              Benefits
            </button>
            <button
              onClick={() => setActiveTab("stories")}
              className={`px-5 py-2 rounded-full text-sm ${
                activeTab === "stories"
                  ? "bg-white text-black"
                  : "text-white/70"
              }`}
            >
              Success Stories
            </button>
          </div>
        </div>

        {/* CONTENT */}
        {activeTab === "benefits" && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {benefits.map((b, i) => (
              <div key={i} className="bg-white/10 p-4 rounded-xl">
                <div className="text-xl">{b.icon}</div>
                <h3 className="font-bold text-sm mt-2">{b.title}</h3>
                <p className="text-xs text-white/70">{b.desc}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === "stories" && (
          <div className="space-y-4">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white/10 p-4 rounded-xl">
                <p className="text-sm italic">"{t.text}"</p>
                <p className="text-xs mt-2 font-semibold">{t.name}</p>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

/* ---------------- OFFER CARD ---------------- */

function OfferCard({ title, desc }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border hover:shadow-md transition">
      <h3 className="font-bold text-sm mb-1">{title}</h3>
      <p className="text-xs text-gray-600">{desc}</p>
    </div>
  );
}

/* ---------------- MAIN PAGE ---------------- */

export default function OffersPage() {
  return (
    <div className="flex flex-col min-h-screen">

      {/* HERO */}
      <CdacSpecialSection />

      {/* OFFERS */}
      <div className="px-4 py-10 bg-gray-50">
        <div className="max-w-5xl mx-auto">

          {/* CDAC OFFERS */}
          <h2 className="text-xl font-bold mb-4">🚀 CDAC Offers</h2>
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <OfferCard title="6 Month Stay Plan" desc="Flexible stay for CDAC batch" />
            <OfferCard title="Placement Material" desc="Support for interviews & prep" />
            <OfferCard title="Group Stay" desc="4-5 friends together" />
            <OfferCard title="Near CDAC" desc="Save travel time" />
          </div>

          {/* STUDENT OFFERS */}
          <h2 className="text-xl font-bold mb-4">🎓 Student Offers</h2>
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <OfferCard title="Pay 11 Months" desc="Stay 12 months" />
            <OfferCard title="Refer & Earn" desc="₹500 per friend" />
            <OfferCard title="Long Term Stay" desc="Best for college students" />
          </div>

          {/* FLEXIBLE */}
          <h2 className="text-xl font-bold mb-4">📅 Flexible Stay</h2>
          <div className="grid md:grid-cols-1 gap-4 mb-10">
            <OfferCard title="Short Stay" desc="1 day / 1 week / 15 days options" />
          </div>

          {/* CTA */}
          <div className="text-center bg-white p-6 rounded-xl shadow">
            <h3 className="font-bold text-lg mb-2">Ready to Book?</h3>
            <button
              onClick={() => (window.location.href = "/accommodation")}
              className="bg-pink-500 text-white px-6 py-2 rounded-lg font-bold"
            >
              View Rooms
            </button>
          </div>

        </div>
      </div>

      <FooterSection />
    </div>
  );
}