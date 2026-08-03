import React, { useState } from "react";

interface FooterProps {
  setPage: (page: string) => void;
}

export default function Footer({ setPage }: FooterProps) {
  const [modalType, setModalType] = useState<"privacy" | "terms" | "security" | null>(null);

  const openModal = (type: "privacy" | "terms" | "security") => {
    setModalType(type);
  };

  const closeModal = () => {
    setModalType(null);
  };

  return (
    <>
      <footer className="w-full bg-surface border-t border-border-subtle" id="footer">
        <div className="flex flex-col md:flex-row justify-between items-center py-12 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto gap-8 md:gap-0">
          {/* Brand Logo */}
          <div 
            onClick={() => {
              setPage("home");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="font-headline-lg text-headline-lg tracking-tighter text-primary cursor-pointer hover:opacity-80 transition-opacity"
            id="footer-logo"
          >
            CARTIS
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-8 order-2 md:order-none">
            <button 
              onClick={() => openModal("privacy")}
              className="font-label-sm text-label-sm text-text-muted hover:underline cursor-pointer focus:outline-none"
              id="footer-privacy-btn"
            >
              Privacy Policy
            </button>
            <button 
              onClick={() => openModal("terms")}
              className="font-label-sm text-label-sm text-text-muted hover:underline cursor-pointer focus:outline-none"
              id="footer-terms-btn"
            >
              Terms of Service
            </button>
            <button 
              onClick={() => openModal("security")}
              className="font-label-sm text-label-sm text-text-muted hover:underline cursor-pointer focus:outline-none"
              id="footer-security-btn"
            >
              Security
            </button>
            <button 
              onClick={() => {
                setPage("company");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="font-label-sm text-label-sm text-text-muted hover:underline cursor-pointer focus:outline-none"
              id="footer-contact-btn"
            >
              Contact
            </button>
          </div>

          {/* Copyright */}
          <div className="font-label-sm text-label-sm text-text-muted text-center md:text-right" id="footer-copyright">
            © 2024 Cartis Enterprise AI. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Elegant Popups for Policies */}
      {modalType && (
        <div className="fixed inset-0 bg-primary/30 backdrop-blur-md flex items-center justify-center z-[100] p-4" onClick={closeModal} id="policy-modal">
          <div 
            className="bg-surface-paper border border-border-subtle p-8 max-w-lg w-full relative animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={closeModal}
              className="absolute top-4 right-4 text-primary hover:opacity-60 cursor-pointer"
              id="close-policy-btn"
            >
              <span className="material-symbols-outlined select-none">close</span>
            </button>

            {modalType === "privacy" && (
              <>
                <h3 className="font-headline-lg text-2xl text-primary mb-4">Privacy Policy</h3>
                <div className="font-body-md text-sm text-secondary space-y-4 max-h-[300px] overflow-y-auto pr-2">
                  <p><strong>Last Updated:</strong> August 2026</p>
                  <p>At Cartis Enterprise, we are committed to safeguarding the data integrity of your retail network. This privacy policy describes our standard protocols for ingestion and analysis of high-velocity transactional environments.</p>
                  <p><strong>1. Data Ingestion & Privacy</strong></p>
                  <p>All transactional and sensory data ingested via our POS Streams, Inventory APIs, and CRM synapses are aggregated and anonymized. No personally identifiable information (PII) is processed without active consent.</p>
                  <p><strong>2. Machine Learning Operations</strong></p>
                  <p>Our foundation models are pre-trained on anonymized transactional structures. Models utilize mathematical weights that do not reconstruct individual customer data footprints.</p>
                </div>
              </>
            )}

            {modalType === "terms" && (
              <>
                <h3 className="font-headline-lg text-2xl text-primary mb-4">Terms of Service</h3>
                <div className="font-body-md text-sm text-secondary space-y-4 max-h-[300px] overflow-y-auto pr-2">
                  <p><strong>Last Updated:</strong> August 2026</p>
                  <p>Welcome to Cartis Enterprise AI. By engaging with our services, retail API platforms, or interactive sandboxes, you agree to comply with the standard enterprise boundaries detailed herein.</p>
                  <p><strong>1. API Boundaries & Rate Limits</strong></p>
                  <p>Developer environments and sandbox instances are governed by rate-limiting algorithms to ensure zero-latency distribution. Any attempt to reverse-engineer trained model layers is strictly prohibited.</p>
                  <p><strong>2. Uptime and Service Level Agreements</strong></p>
                  <p>Our production nodes guarantee a 99.9% uptime for core intelligence infrastructure, backed by redundant cloud-run configurations.</p>
                </div>
              </>
            )}

            {modalType === "security" && (
              <>
                <h3 className="font-headline-lg text-2xl text-primary mb-4">Security Standards</h3>
                <div className="font-body-md text-sm text-secondary space-y-4 max-h-[300px] overflow-y-auto pr-2">
                  <p><strong>Last Updated:</strong> August 2026</p>
                  <p>Security is designed directly into the core layers of our architecture. Cartis operates with invisible elegance and total compliance across international standards.</p>
                  <p><strong>1. Multi-tenant Isolation</strong></p>
                  <p>Tenant structures are cryptographically isolated at rest and in transit. Specialized firewalls and secure token authorization protect POS pipelines.</p>
                  <p><strong>2. Continuous Vulnerability Management</strong></p>
                  <p>We perform daily automated audits of security rules, database instances, and Docker containers to prevent vulnerabilities.</p>
                </div>
              </>
            )}

            <button 
              onClick={closeModal}
              className="btn-primary w-full mt-6 cursor-pointer"
              id="acknowledge-policy-btn"
            >
              Acknowledge & Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
