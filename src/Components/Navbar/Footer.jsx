function Footer() {
    return (
        <footer className="bg-neutral-50 border-t border-neutral-200">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    {/* Logo & Tagline */}
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-black rounded flex items-center justify-center">
                            <span className="text-white text-[10px] font-extrabold tracking-tighter">CX</span>
                        </div>
                        <span className="text-neutral-500 text-sm">
                            Your gateway to the crypto world
                        </span>
                    </div>


                    {/* Social Icons */}
                    <div className="flex items-center gap-2">
                        <a href="https://x.com/Ktanmay19" target="_blank" rel="noopener noreferrer" className="group w-8 h-8 border border-neutral-200 hover:border-black hover:bg-black rounded-md flex items-center justify-center transition-all">
                            <i className="ri-twitter-x-line text-sm text-neutral-400 group-hover:text-white"></i>
                        </a>
                        <a href="https://github.com/TanmayK-glitch/CryptoX" target="_blank" rel="noopener noreferrer" className="group w-8 h-8 border border-neutral-200 hover:border-black hover:bg-black rounded-md flex items-center justify-center transition-all">
                            <i className="ri-github-line text-sm text-neutral-400 group-hover:text-white"></i>
                        </a>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-6 pt-6 border-t border-neutral-200 text-center">
                    <p className="text-neutral-400 text-sm">
                        © 2025 CryptoX. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;