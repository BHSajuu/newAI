"use client";

import { X, ZapIcon } from "lucide-react";
import React, { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

const Footer = () => {
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  return (
    <>
      <footer className="border-t border-border bg-background/80 backdrop-blur-sm pb-5">
        {/* Top border glow */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Logo and Copyright */}
            <div className="flex flex-col items-center md:items-start gap-6">
              <Link href="/" className="flex items-center gap-3">
                <div className="p-2 gradient-primary rounded-xl shadow-glow">
                  <ZapIcon className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold">
                  Fit<span className="text-primary">Flow</span> AI
                </span>
              </Link>
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} codeflex.ai - All rights reserved
              </p>
            </div>

            {/* Links */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-12 gap-y-2 text-sm">
              <Link
                href="/"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Home
              </Link>
              <Link
                href="/profile"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Profile
              </Link>

              <button
                onClick={() => setShowPrivacyModal(true)}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Privacy
              </button>

              <Link
                href="/generate-program"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Generate Program
              </Link>

              {/* ADDED: Progress Tracker link in footer */}
              <Link
                href="/progress-tracker"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Progress Tracker
              </Link>
              <Link
                href="/contact"
                onClick={() => toast.success("Redirecting to contact page...")}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Contact
              </Link>

              <button
                onClick={() => setShowTermsModal(true)}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Terms
              </button>
            </div>

            {/* Status */}
            <div className="flex items-center gap-2 px-3 py-2 border border-border rounded-md bg-background/50">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-xs font-mono">SYSTEM OPERATIONAL</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Privacy Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900/50 z-50">
          <div className="bg-background rounded-2xl p-6 w-full max-w-lg relative">
            <button
              onClick={() => setShowPrivacyModal(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-primary"
            >
              <X />
            </button>
            <h2 className="text-xl font-semibold mb-4">Privacy Policy</h2>
            <div className="prose max-w-none text-sm text-muted-foreground">
              <p>
                Your privacy is important to us. We collect minimal personal data
                and only use it to enhance your experience. We never share your
                data with third parties without your consent.
              </p>
              <p>
                For detailed information, please reach out to help section in footer.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Terms Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900/50 z-50">
          <div className="bg-background rounded-2xl p-6 w-full max-w-lg relative">
            <button
              onClick={() => setShowTermsModal(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-primary"
            >
              <X/>
            </button>
            <h2 className="text-xl font-semibold mb-4">Terms of Service</h2>
            <div className="prose max-w-none text-sm text-muted-foreground">
              <p>
                By using FitFlow AI, you agree to our terms and conditions.
                Unauthorized use is prohibited. We reserve the right to modify
                these terms at any time.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Footer;
