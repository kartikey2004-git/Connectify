"use client";
import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Clock, Link } from "lucide-react";
import Image from "next/image";

const features = [
  {
    icon: Calendar,
    title: "Create Events",
    description:
      "Set up and customize event types with flexible scheduling options.",
  },
  {
    icon: Clock,
    title: "Manage Availability",
    description: "Define your availability and optimize your schedule.",
  },
  {
    icon: Link,
    title: "Custom Links",
    description: "Share your personalized scheduling link instantly.",
  },
];

const testimonials = [
  {
    quote:
      "This tool completely simplified how I manage my appointments. Clean and effortless.",
    name: "Sarah Johnson",
    role: "Marketing Director",
  },
  {
    quote: "Best scheduling platform I’ve used. Minimal, fast, and reliable.",
    name: "Mike Chen",
    role: "Business Consultant",
  },
  {
    quote:
      "My clients love how easy it is to book with me. It’s a game changer.",
    name: "Emma Davis",
    role: "Freelance Designer",
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

const GradientButton = ({ href, children }) => (
  <a
    href={href}
    className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white font-semibold rounded-full hover:bg-neutral-900 transition"
  >
    {children}
    <ArrowRight className="w-5 h-5" />
  </a>
);

export default function Home() {
  return (
    <main className="bg-white text-black">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-6 py-20">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            className="space-y-6 text-center lg:text-left"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            <h1 className="text-5xl -mt-20 md:text-6xl  font-normal tracking-tight">
              Simplify Your <br /> Scheduling
            </h1>
            <p className="text-lg text-neutral-600 max-w-xl mx-auto lg:mx-0">
              A minimal scheduling tool designed for professionals. Create
              events, manage availability, and get booked — without the clutter.
            </p>
            <GradientButton href="/dashboard">Get Started</GradientButton>
          </motion.div>

          <motion.div
            className="flex items-center justify-center -mt-32"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={2}
          >
            <div className="relative w-full h-64 border border-neutral-200 rounded-xl overflow-hidden">
              <Image
                src="/banner.jpeg"
                alt="banner"
                fill
                className="object-cover rounded-xl"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            Key Features
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-10">
            {features.map((f, i) => (
              <motion.div
                key={i}
                className="p-8 border border-neutral-200 rounded-2xl text-center"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
              >
                <f.icon className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                <p className="text-neutral-600">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            What People Say
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-10">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                className="p-8 border border-neutral-200 rounded-2xl"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
              >
                <p className="italic mb-6 text-neutral-700">
                  &quot;{t.quote}&quot;
                </p>
                <div className="font-semibold">{t.name}</div>
                <div className="text-sm text-neutral-500">{t.role}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-black text-white text-center">
        <motion.div
          className="max-w-3xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <h2 className="text-4xl font-bold mb-6">
            Ready to Simplify Scheduling?
          </h2>
          <p className="text-neutral-300 mb-8">
            Join professionals who manage their time the smart way.
          </p>
          <GradientButton href="/dashboard">Start Free</GradientButton>
        </motion.div>
      </section>
    </main>
  );
}
