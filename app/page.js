import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FEATURES, TESTIMONIALS } from "./_components/landing-content";

export default function Home() {
  return (
    <div className="bg-background text-foreground">
      <section id="hero" className="py-12 sm:py-16 lg:py-20">
        <div className="section-shell">
          <p className="eyebrow">Smart Scheduling Platform</p>

          <h1 className="mt-4 text-2xl font-medium tracking-tight sm:text-3xl">
            Simplify your scheduling
          </h1>

          <p className="body-text mt-3 max-w-xl">
            A minimal scheduling tool designed for professionals. Create events,
            manage availability, and get booked — without the clutter.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <Button asChild>
              <Link href="/dashboard">
                Get Started Free
                <ArrowRight />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <a href="#features">See How It Works</a>
            </Button>
          </div>

          <p className="body-text mt-8 border-t border-border/50 pt-8 text-muted-foreground/70">
            Trusted by 100+ professionals
          </p>
        </div>
      </section>

              <section id="features" className="py-12 sm:py-14 lg:py-16">
          <div className="section-shell">
            <h2 className="heading-lg">Key Features</h2>
            <p className="body-text mt-2 max-w-xl">
              Everything you need to manage your schedule like a pro
            </p>

            <div className="mt-8 divide-y divide-border/50">
              {FEATURES.map(({ icon: Icon, title, description }) => (
                <div key={title} className="flex items-start gap-3 px-1 py-4 sm:gap-4 sm:px-2">
                  <span className="flex size-9 shrink-0 items-center justify-center text-foreground/70 sm:size-10">
                    <Icon className="size-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium text-foreground sm:text-base">
                      {title}
                    </span>
                    <span className="body-text block sm:text-base">{description}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      
              <section className="py-12 sm:py-14 lg:py-16">
          <div className="section-shell">
            <h2 className="heading-lg">What People Say</h2>
            <p className="body-text mt-2 max-w-xl">
              Hear from professionals who transformed their scheduling workflow
            </p>

            <div className="mt-8">
              {TESTIMONIALS.map(({ quote, name, role }) => (
                <figure
                  key={name}
                  className="border-b border-border/60 py-10 first:pt-0 last:border-b-0 sm:py-14"
                >
                  <blockquote className="body-text max-w-xl text-foreground">
                    &quot;{quote}&quot;
                  </blockquote>
                  <figcaption className="mt-4">
                    <span className="block text-sm font-medium text-foreground sm:text-base">
                      {name}
                    </span>
                    <span className="body-text">{role}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      
              <section className="px-2 py-16 sm:py-20 lg:py-24">
          <div className="section-shell">
            <div className="space-y-2">
              <p className="body-text sm:text-base">Get started</p>
              <h2 className="heading-lg">Ready to simplify scheduling?</h2>
            </div>
            <p className="body-text mt-4 max-w-xl sm:text-base">
              Join professionals who manage their time the smart way.
            </p>
            <Button asChild className="mt-6">
              <Link href="/dashboard">
                Start Free Today
                <ArrowRight />
              </Link>
            </Button>
          </div>
        </section>
          </div>
  );
}
