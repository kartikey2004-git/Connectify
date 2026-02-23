"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Calendar,
  Clock,
  Link2,
  Video,
  LayoutDashboard,
  Globe,
  Sparkles,
  PlayCircle,
} from "lucide-react";

const features = [
  {
    icon: Calendar,
    title: "Create Custom Events",
    description:
      "Set up unlimited event types with custom durations, descriptions, and privacy settings for consultations, interviews, or team syncs.",
  },
  {
    icon: Clock,
    title: "Smart Availability Management",
    description:
      "Define your weekly schedule once and let the system automatically show only available time slots to prevent double bookings.",
  },
  {
    icon: Link2,
    title: "Personalized Booking Links",
    description:
      "Share unique username-based scheduling links that showcase all your public events with SEO-friendly pages.",
  },
  {
    icon: Video,
    title: "Google Meet Integration",
    description:
      "Every confirmed booking automatically generates a Google Meet link and syncs with your Google Calendar in real-time.",
  },
  {
    icon: LayoutDashboard,
    title: "Meeting Dashboard",
    description:
      "View all upcoming and past meetings in one place with the ability to cancel or reschedule with automatic notifications.",
  },
  {
    icon: Globe,
    title: "Public Event Pages",
    description:
      "Beautiful, responsive booking pages for each event with real-time availability display and automatic timezone handling.",
  },
];

const testimonials = [
  {
    quote:
      "ConnectX has completely eliminated the back-and-forth emails with clients. My consultation bookings are now on autopilot, saving me 10+ hours weekly!",
    name: "Priya Sharma",
    role: "Business Consultant, Bangalore",
  },
  {
    quote:
      "The Google Meet integration is brilliant! My students can book slots seamlessly, and everything syncs with my calendar automatically. A must-have for coaches.",
    name: "Arjun Mehta",
    role: "Career Coach, Mumbai",
  },
  {
    quote:
      "We use ConnectX for investor meetings and demo calls. The personalized links make us look professional, and the availability management prevents scheduling conflicts.",
    name: "Ananya Iyer",
    role: "Founder, EdTech Startup",
  },
  {
    quote:
      "As a freelancer managing multiple clients across timezones, ConnectX is a lifesaver. The meeting dashboard keeps me organized and clients love the booking experience.",
    name: "Rahul Desai",
    role: "Freelance Developer, Pune",
  },
  {
    quote:
      "Scheduling candidate interviews used to be chaotic. Now with ConnectX, candidates select their slots, and Google Meet links are generated instantly. Game changer!",
    name: "Kavya Reddy",
    role: "HR Manager, Tech Company",
  },
  {
    quote:
      "ConnectX handles my client consultations with complete professionalism. The ability to set different event durations for various services is exactly what I needed.",
    name: "Vikram Patel",
    role: "Legal Advisor, Ahmedabad",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.6, ease: "easeOut" },
  }),
};

const GradientButton = ({ href, children, variant = "primary" }) => {
  const handleClick = (e) => {
    if (href?.startsWith("#")) {
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className={`inline-flex items-center gap-2 rounded-lg px-6 py-3.5 text-sm font-semibold transition-all sm:px-8 sm:py-4 sm:text-base ${
        variant === "primary"
          ? "bg-primary text-primary-foreground shadow-lg hover:shadow-xl hover:scale-105"
          : "border-2 border-border bg-background text-foreground hover:bg-muted"
      }`}
    >
      {children}
    </a>
  );
};

export default function Home() {
  return (
    <main className="bg-background text-foreground">
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 -z-10 bg-linear-to-b from-muted/50 via-background to-background" />

        <div className="app-container flex min-h-[calc(100vh-4rem)] items-center justify-center py-20 sm:py-24 lg:py-28">
          <div className="w-full max-w-4xl">
            <motion.div
              className="flex flex-col items-center space-y-8 text-center"
              initial="hidden"
              animate="visible"
              variants={fadeUp}
            >
              {/* Badge */}
              <motion.div
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Sparkles className="h-4 w-4" />
                <span>Smart Scheduling Platform</span>
              </motion.div>

              {/* Headline */}
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                Simplify Your
                <br />
                <span className="bg-linear-to-r from-foreground via-foreground/80 to-foreground/60 bg-clip-text text-transparent">
                  Scheduling
                </span>
              </h1>

              {/* Description */}
              <p className="mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg lg:text-xl">
                A minimal scheduling tool designed for professionals. Create
                events, manage availability, and get booked — without the
                clutter.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col gap-4 sm:flex-row sm:gap-4">
                <GradientButton href="/dashboard">
                  Get Started Free
                  <ArrowRight className="h-5 w-5" />
                </GradientButton>
                <GradientButton href="#features" variant="secondary">
                  <PlayCircle className="h-5 w-5" />
                  See How It Works
                </GradientButton>
              </div>

              {/* Social Proof */}
              <motion.div
                className="pt-8 text-sm text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                Trusted by 100+ professionals
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="features" className="py-14 sm:py-16 lg:py-20">
        <div className="app-container">
          <motion.div
            className="mb-12 text-center sm:mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Key Features
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground sm:text-lg">
              Everything you need to manage your schedule like a pro
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3 lg:gap-8">
            {features.map((f, i) => (
              <motion.div
                key={i}
                className="rounded-2xl border border-border bg-card p-6 text-center shadow-sm sm:p-7"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
              >
                <f.icon className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                <p className="text-muted-foreground">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-muted/30 py-14 sm:py-16 lg:py-20">
        <div className="app-container">
          <motion.div
            className="mb-12 text-center sm:mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              What People Say
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground sm:text-lg">
              Hear from professionals who transformed their scheduling workflow
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3 lg:gap-8">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-7"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
              >
                <p className="mb-5 italic text-muted-foreground sm:mb-6">
                  &quot;{t.quote}&quot;
                </p>
                <div className="font-semibold">{t.name}</div>
                <div className="text-sm text-muted-foreground">{t.role}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center sm:py-24 lg:py-28">
        <motion.div
          className="app-container max-w-4xl"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <div className="rounded-3xl border border-border bg-linear-to-br from-muted/50 to-background p-10 sm:p-14 lg:p-16">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Ready to Simplify Scheduling?
            </h2>
            <p className="mb-8 text-base text-muted-foreground sm:mb-10 sm:text-lg lg:text-xl">
              Join thousands of professionals who manage their time the smart
              way.
            </p>
            <GradientButton href="/dashboard">
              Start Free Today
              <ArrowRight className="h-5 w-5" />
            </GradientButton>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
