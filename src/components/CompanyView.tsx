import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export default function CompanyView() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    companyName: "",
    jobTitle: "",
    inquiryType: "Enterprise Inquiry",
    message: ""
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [ticketRef, setTicketRef] = useState("");

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid work email";
    }
    if (!formData.companyName.trim()) newErrors.companyName = "Company name is required";
    if (!formData.jobTitle.trim()) newErrors.jobTitle = "Job title is required";
    if (!formData.message.trim()) newErrors.message = "Message cannot be empty";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate high-tech API transmission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTicketRef(`MNLT-${Math.floor(100000 + Math.random() * 900000)}`);
    }, 1200);
  };

  const handleReset = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      companyName: "",
      jobTitle: "",
      inquiryType: "Enterprise Inquiry",
      message: ""
    });
    setErrors({});
    setIsSuccess(false);
  };

  return (
    <div className="w-full flex flex-col" id="company-view">
      {/* Header Section */}
      <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-section-gap pb-12 w-full flex flex-col items-start">
        <span className="font-label-sm text-label-sm text-text-muted uppercase tracking-widest block mb-3">
          Company & Consultation
        </span>
        <h1 className="font-display-xl-mobile text-display-xl-mobile md:font-display-xl md:text-display-xl text-primary max-w-3xl leading-tight mb-8">
          Scale intelligence. <br />Zero friction.
        </h1>
        <p className="font-body-lg text-body-lg text-secondary max-w-2xl">
          Contact our developer integration teams to schedule a simulated trial of the Monolith predictive engine over your regional POS datasets.
        </p>
      </section>

      {/* Main Content Form Section */}
      <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mb-section-gap w-full grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
        
        {/* Left Side: Contact Form Container */}
        <div className="lg:col-span-8 bg-surface-paper border border-border-subtle p-8 md:p-12">
          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.form 
                key="contact-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit} 
                className="space-y-8"
                noValidate
                id="consultation-form"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-gutter gap-y-6">
                  {/* First Name */}
                  <div className="relative">
                    <input 
                      type="text"
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="input-field"
                      id="input-firstname"
                    />
                    {errors.firstName && (
                      <span className="font-label-sm text-[10px] text-red-600 absolute bottom-[-18px] left-0">{errors.firstName}</span>
                    )}
                  </div>

                  {/* Last Name */}
                  <div className="relative">
                    <input 
                      type="text"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="input-field"
                      id="input-lastname"
                    />
                    {errors.lastName && (
                      <span className="font-label-sm text-[10px] text-red-600 absolute bottom-[-18px] left-0">{errors.lastName}</span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-gutter gap-y-6">
                  {/* Work Email */}
                  <div className="relative">
                    <input 
                      type="email"
                      placeholder="Work Email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="input-field"
                      id="input-email"
                    />
                    {errors.email && (
                      <span className="font-label-sm text-[10px] text-red-600 absolute bottom-[-18px] left-0">{errors.email}</span>
                    )}
                  </div>

                  {/* Company Name */}
                  <div className="relative">
                    <input 
                      type="text"
                      placeholder="Company Name"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      className="input-field"
                      id="input-company"
                    />
                    {errors.companyName && (
                      <span className="font-label-sm text-[10px] text-red-600 absolute bottom-[-18px] left-0">{errors.companyName}</span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-gutter gap-y-6">
                  {/* Job Title */}
                  <div className="relative">
                    <input 
                      type="text"
                      placeholder="Job Title"
                      value={formData.jobTitle}
                      onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                      className="input-field"
                      id="input-jobtitle"
                    />
                    {errors.jobTitle && (
                      <span className="font-label-sm text-[10px] text-red-600 absolute bottom-[-18px] left-0">{errors.jobTitle}</span>
                    )}
                  </div>

                  {/* Inquiry Type */}
                  <div className="relative">
                    <select 
                      value={formData.inquiryType}
                      onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                      className="input-field select-custom bg-transparent outline-none appearance-none"
                      id="input-inquirytype"
                    >
                      <option value="Enterprise Inquiry">Enterprise Consultation</option>
                      <option value="Technical Sandbox Request">Technical Sandbox Request</option>
                      <option value="General Consultation">General Inquiry</option>
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div className="relative">
                  <textarea 
                    placeholder="Message"
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="input-field resize-none"
                    id="input-message"
                  />
                  {errors.message && (
                    <span className="font-label-sm text-[10px] text-red-600 absolute bottom-[-18px] left-0">{errors.message}</span>
                  )}
                </div>

                {/* Submit button */}
                <div className="pt-4">
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full sm:w-auto py-4 px-12 text-center cursor-pointer font-bold disabled:opacity-50"
                    id="submit-form-btn"
                  >
                    {isSubmitting ? "Transmitting..." : "Schedule Consultation"}
                  </button>
                </div>
              </motion.form>
            ) : (
              <motion.div 
                key="success-form"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-8 space-y-6"
                id="success-view"
              >
                <div className="flex justify-center">
                  <span className="material-symbols-outlined text-[64px] text-primary animate-bounce select-none">
                    check_circle
                  </span>
                </div>
                
                <h3 className="font-headline-lg text-2xl text-primary font-bold">Inquiry Synced Successfully</h3>
                
                <p className="font-body-md text-base text-secondary max-w-xl mx-auto">
                  Thank you, <strong className="text-primary">{formData.firstName}</strong>. Your {formData.inquiryType.toLowerCase()} request has been securely transmitted and routed directly to our Layer 01 integration node.
                </p>

                {/* Simulated Server/Ticket Details */}
                <div className="bg-surface-container-low border border-border-subtle p-6 max-w-md mx-auto text-left font-label-sm text-xs space-y-2">
                  <div className="flex justify-between border-b border-border-subtle pb-2 mb-2 text-primary font-bold">
                    <span>TRANSMISSION RECORD</span>
                    <span>SUCCESS</span>
                  </div>
                  <div className="flex justify-between text-secondary">
                    <span>Reference Ticket:</span>
                    <span className="font-bold text-primary select-all">{ticketRef}</span>
                  </div>
                  <div className="flex justify-between text-secondary">
                    <span>Routing Hub:</span>
                    <span>US-EAST-1 (NY CENTRAL)</span>
                  </div>
                  <div className="flex justify-between text-secondary">
                    <span>Guaranteed SLA:</span>
                    <span className="text-emerald-600 font-bold">120 Minutes Response</span>
                  </div>
                  <div className="flex justify-between text-secondary">
                    <span>Verification Email Sent To:</span>
                    <span className="font-medium text-primary">{formData.email}</span>
                  </div>
                </div>

                <div className="pt-6">
                  <button 
                    onClick={handleReset}
                    className="btn-secondary py-3 px-8 cursor-pointer"
                    id="submit-another-btn"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Side: Contact Details & Info */}
        <div className="lg:col-span-4 space-y-8 lg:pl-6 pt-8 lg:pt-0">
          <div>
            <span className="font-label-sm text-[10px] text-text-muted uppercase tracking-widest block mb-3">Office Location</span>
            <p className="font-body-md text-sm text-primary font-bold uppercase tracking-wider leading-relaxed whitespace-pre-line">
              MONOLITH ENTERPRISE AI{"\n"}
              100 BROADWAY,{"\n"}
              NEW YORK, NY 10005
            </p>
          </div>

          <div className="h-px bg-border-subtle" />

          <div>
            <span className="font-label-sm text-[10px] text-text-muted uppercase tracking-widest block mb-3">Direct Channels</span>
            <p className="font-body-md text-sm text-primary font-bold uppercase tracking-wider leading-relaxed whitespace-pre-line">
              SALES@MONOLITH.AI{"\n"}
              SUPPORT@MONOLITH.AI
            </p>
          </div>

          <div className="h-px bg-border-subtle" />

          <div>
            <span className="font-label-sm text-[10px] text-text-muted uppercase tracking-widest block mb-3">Inference Reliability</span>
            <p className="font-body-md text-sm text-secondary leading-relaxed">
              Our regional prediction nodes maintain cryptographic isolated pipelines, backed by continuous uptime replication streams.
            </p>
          </div>

          {/* Map mockup */}
          <div className="h-48 border border-border-subtle bg-surface-container-low flex items-center justify-center relative overflow-hidden" id="mockup-map">
            <div className="absolute inset-0 bg-grid-pattern opacity-15 grayscale" />
            <div className="text-center z-10 space-y-1 select-none">
              <span className="material-symbols-outlined text-primary text-2xl">location_on</span>
              <span className="font-label-sm text-[10px] text-text-muted uppercase block">40.7075° N, 74.0112° W</span>
            </div>
          </div>
        </div>

      </section>
    </div>
  );
}
