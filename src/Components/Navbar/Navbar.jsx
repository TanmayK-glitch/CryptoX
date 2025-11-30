import React, { useContext } from "react";
import { coinContext } from "../../Context/CoinContext";
import { NavLink } from "react-router-dom";

function Navbar() {
    const context = useContext(coinContext);
    const { setCurrency } = context || {};

    if (!context) {
        return (
            <div className="flex items-center justify-center h-14 bg-white border-b border-neutral-200">
                <div className="text-neutral-400">Loading...</div>
            </div>
        );
    }

    const currencyhandler = (e) => {
        switch (e.target.value) {
            case "usd":
                setCurrency({ name: "usd", symbol: "$" });
                break;
            case "inr":
                setCurrency({ name: "inr", symbol: "₹" });
                break;
            case "eur":
                setCurrency({ name: "eur", symbol: "€" });
                break;
            default:
                setCurrency({ name: "usd", symbol: "$" });
                break;
        }
    };

    return (
        <nav className="sticky top-0 z-50 bg-white border-b border-neutral-200">
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
                        {/* Currency Selector */}
                        <select
                            onChange={currencyhandler}
                            className="bg-white text-neutral-700 text-sm font-medium px-3 py-1.5 rounded-md border border-neutral-200 hover:border-neutral-400 focus:border-black focus:outline-none transition-colors cursor-pointer"
                        >
                            <option value="usd">USD</option>
                            <option value="inr">INR</option>
                            <option value="eur">EUR</option>
                        </select>

                        {/* Sign In Button */}
                        <button className="hidden sm:flex items-center gap-1.5 px-4 py-1.5 bg-black hover:bg-neutral-800 text-white text-sm font-medium rounded-md transition-colors">
                            Sign In
                            <i className="ri-arrow-right-up-line text-xs"></i>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar