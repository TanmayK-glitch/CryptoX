import "./App.css";
import Navbar from "./Components/Navbar/Navbar";
import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home/Home";
import Coin from "./Pages/Coin/Coin";
import Footer from "./Components/Navbar/Footer";

// Set to false to restore the normal app
const MAINTENANCE_MODE = true;

function App() {
  if (MAINTENANCE_MODE) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="text-center max-w-lg">
          {/* Animated icon */}
          <div className="w-20 h-20 mx-auto mb-8 bg-black rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-white text-2xl font-extrabold tracking-tighter">CX</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-black tracking-tight mb-4">
            We'll be back soon
          </h1>

          <p className="text-neutral-500 text-base leading-relaxed mb-8">
            Fixing some bugs, project will be live soon.<br />
          </p>

          {/* Animated dots */}
          <div className="flex items-center justify-center gap-2 mb-10">
            <div className="w-2.5 h-2.5 bg-black rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
            <div className="w-2.5 h-2.5 bg-black rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
            <div className="w-2.5 h-2.5 bg-black rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
          </div>

          <p className="text-neutral-400 text-xs">
            &copy; {new Date().getFullYear()} CryptoX. All rights reserved.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/coin/:coinId" element={<Coin />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
