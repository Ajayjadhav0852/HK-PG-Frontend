import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Facilities", path: "/facilities" },
    { name: "Accommodation", path: "/accommodation" },
    { name: "Gallery", path: "/gallery" },
    { name: "Offers", path: "/offers" },
    { name: "Testimonials", path: "/testimonials" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <>
      {/* HEADER */}
      <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl bg-white/70 border-b border-white/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">

          {/* LOGO */}
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-2 cursor-pointer"
          >
            <img src="/logo.png" alt="logo" className="w-10 h-10 rounded-full" />
            <div>
              <p className="font-bold text-sm text-gray-800">HK PG</p>
              <p className="text-xs text-pink-500">Boys Accommodation</p>
            </div>
          </div>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className={`text-sm font-semibold transition ${
                  location.pathname === item.path
                    ? "text-pink-600"
                    : "text-gray-600 hover:text-pink-500"
                }`}
              >
                {item.name}
              </button>
            ))}
          </nav>

          {/* RIGHT SIDE */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => navigate("/login")}
              className="text-sm font-semibold text-gray-600 hover:text-pink-500"
            >
              Login
            </button>

            <button
              onClick={() => navigate("/signup")}
              className="px-4 py-2 rounded-xl text-white font-bold shadow-lg hover:scale-105 transition"
              style={{
                background: "linear-gradient(135deg,#d63384,#c026d3)",
              }}
            >
              Sign Up
            </button>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setOpen(true)}
            className="md:hidden text-gray-700"
          >
            ☰
          </button>
        </div>
      </header>

      {/* MOBILE SIDEBAR */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/40">
          <div className="w-64 bg-white h-full p-5 shadow-xl">

            {/* CLOSE */}
            <div className="flex justify-between items-center mb-6">
              <p className="font-bold text-lg">Menu</p>
              <button onClick={() => setOpen(false)}>✕</button>
            </div>

            {/* NAV ITEMS */}
            <div className="flex flex-col gap-4">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    navigate(item.path);
                    setOpen(false);
                  }}
                  className="text-left font-semibold text-gray-700 hover:text-pink-500"
                >
                  {item.name}
                </button>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-6 flex flex-col gap-3">
              <button
                onClick={() => navigate("/login")}
                className="border rounded-lg py-2"
              >
                Login
              </button>

              <button
                onClick={() => navigate("/signup")}
                className="py-2 rounded-lg text-white font-bold"
                style={{
                  background: "linear-gradient(135deg,#d63384,#c026d3)",
                }}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}