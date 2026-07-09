import React, { useContext, useState, useRef, useEffect } from "react";
import { coinContext } from "../../Context/CoinContext";
import { NavLink, useLocation } from "react-router-dom";

function Navbar() {
    const context = useContext(coinContext);
    const { setCurrency } = context || {};
    const location = useLocation();

    if (!context) {
        return (
            <div className="flex items-center justify-center h-14 bg-white border-b border-neutral-200">
                <div className="w-5 h-5 border-2 border-neutral-200 border-t-black rounded-full animate-spin"></div>
            </div>
        );
    }

    const currencies = [
        { value: "usd", label: "USD", symbol: "$" },
        { value: "inr", label: "INR", symbol: "₹" },
        { value: "eur", label: "EUR", symbol: "€" },
    ];

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selectedLabel, setSelectedLabel] = useState("USD");
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectCurrency = (cur) => {
        setCurrency({ name: cur.value, symbol: cur.symbol });
        setSelectedLabel(cur.label);
        setDropdownOpen(false);
    };

    const isHome = location.pathname === "/";

    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-200">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between h-14">
                    {/* Logo */}
                    <NavLink to="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-black rounded-md flex items-center justify-center">
                            <span className="text-white text-xs font-extrabold tracking-tighter">CX</span>
                        </div>
                        <span className="text-lg font-semibold text-black tracking-tight">
                            CryptoX
                        </span>
                    </NavLink>

                    {/* Right Section */}
                    <div className="flex items-center gap-3">
                        {/* Home Link — highlighted when active */}
                        <NavLink
                            to="/"
                            className={`hidden sm:inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                                isHome
                                    ? "bg-neutral-100 text-black"
                                    : "text-neutral-500 hover:text-black hover:bg-neutral-50"
                            }`}
                        >
                            <i className="ri-home-4-line text-sm"></i>
                            Home
                        </NavLink>

                        {/* Currency Selector — custom dropdown */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setDropdownOpen((prev) => !prev)}
                                className="flex items-center gap-1.5 bg-white text-neutral-700 text-sm font-medium px-3 py-1.5 rounded-lg border border-neutral-200 hover:border-neutral-400 transition-colors cursor-pointer"
                            >
                                {selectedLabel}
                                <i
                                    className="ri-arrow-down-s-line text-sm transition-transform duration-150"
                                    style={{ transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                                ></i>
                            </button>

                            <div
                                className="absolute right-0 mt-1.5 w-28 bg-white border border-neutral-200 rounded-lg shadow-lg overflow-hidden z-50"
                                style={{
                                    opacity: dropdownOpen ? 1 : 0,
                                    transform: dropdownOpen ? "scale(1)" : "scale(0.95)",
                                    transformOrigin: "top right",
                                    transition: "opacity 150ms ease-out, transform 150ms ease-out",
                                    pointerEvents: dropdownOpen ? "auto" : "none",
                                }}
                            >
                                {currencies.map((cur) => (
                                    <button
                                        key={cur.value}
                                        onClick={() => selectCurrency(cur)}
                                        className={`w-full text-left px-3 py-2 text-sm font-medium transition-colors cursor-pointer ${
                                            selectedLabel === cur.label
                                                ? "bg-neutral-100 text-black"
                                                : "text-neutral-600 hover:bg-neutral-50 hover:text-black"
                                        }`}
                                    >
                                        {cur.symbol} {cur.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar