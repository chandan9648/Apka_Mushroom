"use client";

import React from "react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      {/* ── Contact Us ── */}
      <section className="bg-zinc-50 scroll-mt-20">
        <div className="container-x py-16">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-10">
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-widest text-amber-600 mb-1">Get in touch</p>
              <h2 className="text-3xl font-bold text-zinc-900 mb-4">Contact Us</h2>
              <p className="text-sm text-zinc-600 mb-8 max-w-md">
                Have questions about our products, need help with your favorites, or just want to say hello? We&apos;d love to hear from you. Reach out to us using any of the contact details below.
              </p>
              
              <div className="grid gap-6">
                <div className="flex items-start gap-4">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-amber-100 text-amber-600">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-900">Phone</h3>
                    <p className="mt-1 text-sm text-zinc-600">+91 98765 43210</p>
                    <p className="text-xs text-zinc-400">Mon-Fri from 9am to 6pm IST</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-amber-100 text-amber-600">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-900">Email</h3>
                    <p className="mt-1 text-sm text-zinc-600">support@rborganicmushroom.com</p>
                    <p className="text-xs text-zinc-400">We typically reply within 24 hours</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-amber-100 text-amber-600">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-900">Farm Location</h3>
                    <p className="mt-1 text-sm text-zinc-600">123 Nature Trail, Mushroom Valley<br />Green District, 400001</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex-1 bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm">
              <h3 className="text-lg font-semibold text-zinc-900 mb-4">Send us a message</h3>
              <form className="grid gap-4" onSubmit={(e) => { e.preventDefault(); alert("Thanks for your message!"); }}>
                <div>
                  <label htmlFor="name" className="block text-xs font-medium text-zinc-700 mb-1">Full Name</label>
                  <input type="text" id="name" className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none" placeholder="Jane Doe" required />
                </div>
                <div>
                  <label htmlFor="email" className="block text-xs font-medium text-zinc-700 mb-1">Email Address</label>
                  <input type="email" id="email" className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none" placeholder="jane@example.com" required />
                </div>
                <div>
                  <label htmlFor="message" className="block text-xs font-medium text-zinc-700 mb-1">Message</label>
                  <textarea id="message" rows={4} className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none resize-none" placeholder="How can we help you?" required></textarea>
                </div>
                <button type="submit" className="mt-2 w-full rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 transition-colors">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
