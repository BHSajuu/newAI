"use client";

import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { DumbbellIcon, HomeIcon, Menu, UserIcon, X, ZapIcon, ActivityIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

const Navbar = () => {
  const { isSignedIn } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (mobileMenuOpen) {
        const menu = document.getElementById("mobile-menu");
        if (menu && !menu.contains(e.target as Node)) {
          closeMobileMenu();
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileMenuOpen]);

  const renderAuthButtons = () => {
    if (isSignedIn) {
      return (
        <>
          <div className="flex flex-col gap-4 md:hidden ">
            <Link href="/" className="flex items-center gap-2 text-sm hover:text-primary transition-colors p-2 rounded-lg hover:bg-primary/10" onClick={closeMobileMenu}>
              <HomeIcon size={18} />
              <span>Home</span>
            </Link>
            <Link href="/generate-program" className="flex items-center gap-2 text-sm hover:text-primary transition-colors p-2 rounded-lg hover:bg-primary/10" onClick={closeMobileMenu}>
              <DumbbellIcon size={18} />
              <span>Generate Program</span>
            </Link>
            {/* ADDED: Progress Tracker link for mobile */}
            <Link href="/progress-tracker" className="flex items-center gap-2 text-sm hover:text-primary transition-colors p-2 rounded-lg hover:bg-primary/10" onClick={closeMobileMenu}>
              <ActivityIcon size={18} />
              <span>Progress Tracker</span>
            </Link>
            <Link href="/profile" className="flex items-center gap-2 text-sm hover:text-primary transition-colors p-2 rounded-lg hover:bg-primary/10" onClick={closeMobileMenu}>
              <UserIcon size={18} />
              <span>Profile</span>
            </Link>

            <div className="flex justify-center mt-4 pt-4 border-t border-border">
              <UserButton />
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <nav className="flex items-center gap-6">
              <Link href="/" className="flex items-center gap-2 text-sm hover:text-primary transition-colors px-3 py-2 rounded-lg hover:bg-primary/10">
                <HomeIcon size={16} />
                <span>Home</span>
              </Link>
              <Link href="/generate-program" className="flex items-center gap-2 text-sm hover:text-primary transition-colors px-3 py-2 rounded-lg hover:bg-primary/10">
                <DumbbellIcon size={16} />
                <span>Generate</span>
              </Link>
              {/* ADDED: Progress Tracker link for desktop */}
              <Link href="/progress-tracker" className="flex items-center gap-2 text-sm hover:text-primary transition-colors px-3 py-2 rounded-lg hover:bg-primary/10">
                <ActivityIcon size={16} />
                <span>Progress</span>
              </Link>
              <Link href="/profile" className="flex items-center gap-2 text-sm hover:text-primary transition-colors px-3 py-2 rounded-lg hover:bg-primary/10">
                <UserIcon size={16} />
                <span>Profile</span>
              </Link>
            </nav>

            <div className="w-px h-6 bg-border" />

            <UserButton />
          </div>
        </>
      );
    } else {
      return (
        <>
          <div className="flex flex-col gap-3 w-full md:hidden ">
            <SignInButton>
              <Button variant="outline" className="w-full border-primary/30 hover:bg-primary/10" onClick={closeMobileMenu}>
                Sign In
              </Button>
            </SignInButton>
            <SignUpButton>
              <Button className="w-full gradient-primary text-white" onClick={closeMobileMenu}>
                Get Started
              </Button>
            </SignUpButton>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-3">
            <SignInButton>
              <Button variant="outline" className="border-primary/30 hover:bg-primary/10">
                Sign In
              </Button>
            </SignInButton>
            <SignUpButton>
              <Button className="gradient-primary text-white shadow-glow">
                Get Started
              </Button>
            </SignUpButton>
          </div>
        </>
      );
    }
  };

  return (
    <header className={`md:px-10 border-b border-slate-700 fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass shadow-soft' : 'bg-transparent'
      }`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="p-2 gradient-primary rounded-xl shadow-glow group-hover:scale-110 transition-transform duration-300">
              <ZapIcon className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">
              Fit<span className="text-primary">Flow</span> AI
            </span>
          </Link>

          {/* Mobile Menu Button */}
          {!mobileMenuOpen && (
            <button
              className="md:hidden p-2 rounded-lg hover:bg-primary/10 transition-colors"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              <Menu size={24} />
            </button>
          )}
          {/* Mobile Menu Overlay */}
          {mobileMenuOpen && (
            <div className="fixed inset-0 bg-gray-950/50  md:hidden">
              <button
                  className="absolute md:hidden top-4 right-3 p-2 rounded-lg hover:bg-primary/10 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <X size={30} style={{ color: 'white' }} />
                </button>
              <div className="absolute top-20 right-4 left-4">
                
                <div className="glass rounded-2xl p-6 shadow-soft">
                  {renderAuthButtons()}
                </div>
              </div>
            </div>
          )}

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            {renderAuthButtons()}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;