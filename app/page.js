import TestimonialCarousel from "@/components/testimonial";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Calendar, Clock, LinkIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const features = [
  {
    icon: Calendar,
    title: "Create Events",
    description: "Easily set up and customize your event types",
  },
  {
    icon: Clock,
    title: "Manage Availability",
    description: "Define your availability to streamline scheduling",
  },
  {
    icon: LinkIcon,
    title: "Custom Links",
    description: "Share your personalized scheduling link",
  },
];

const howItWorks = [
  { step: "Sign Up", description: "Create your free Schedulrr account" },
  {
    step: "Set Availability",
    description: "Define when you're available for meetings",
  },
  {
    step: "Share Your Link",
    description: "Send your scheduling link to clients or colleagues",
  },
  {
    step: "Get Booked",
    description: "Receive confirmations for new appointments automatically",
  },
];

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-16">
      {/* Hero Section */}

      <div className="flex flex-col lg:flex-row items-center justify-between gap-12 mb-16 px-4 sm:px-8">
        <div className="lg:w-1/2 text-center lg:text-left">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold pb-4 sm:pb-6 ">
            Streamline Your Scheduling
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-10">
            Connectify transforms the way you manage time. Effortlessly schedule
            events, define your availability, and allow others to book time with
            you—smoothly and without any trouble.
          </p>

          <Link href={"/dashboard"}>
            <Button size={"lg"} className="text-base sm:text-lg">
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>

        <div className="lg:w-1/2 flex justify-center">
          <div className="relative w-64 sm:w-80 md:w-96 aspect-square">
            <Image
              src={"/banner.jpeg"}
              alt="Scheduling illustration"
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
        </div>
      </div>

      {/* Key Features Section */}

      <div className="mb-24">
        <h2 className="text-3xl font-bold text-center mb-12">
          Key Features
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            return (
              <Card key={index}>
                <CardHeader>
                  <feature.icon className="w-12 h-12 mb-4 mx-auto" />
                  <CardTitle className="text-center">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-gray-600">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Testimonials Section */}

      <div className="mb-24">
        <h2 className="text-3xl font-bold text-center mb-12">
          What Our Users say
        </h2>
        <TestimonialCarousel />
      </div>

      {/* How It Works Section */}

      <div className="mb-24">
        <h2 className="text-3xl font-bold text-center mb-12">
          How it Works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {howItWorks.map((step, index) => (
            <div key={index} className="text-center">
              <div className="bg-gray-200 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="font-bold text-xl">
                  {index + 1}
                </span>
              </div>
              <h3 className="font-semibold text-lg mb-2">{step.step}</h3>
              <h3 className="text-gray-600">{step.description}</h3>
            </div>
          ))}
        </div>
      </div>

      {/* CTA (call to action) Section */}

      <div className="border border-gray-200 rounded-2xl p-6 sm:p-8 lg:p-12 text-center shadow-md max-w-3xl mx-auto bg-white">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6 ">
          Ready to Simplify Your Scheduling with
        </h2>

        <Link href="/" className="inline-flex justify-center mb-6">
          <Image
            src="/banner1.png"
            width={180}
            height={70}
            alt="Schedulrr Logo"
            className="h-30 w-auto"
          />
        </Link>

        <p className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-8">
          Join thousands of professionals who trust Connectify for efficient
          time management.
        </p>

        <Link href="/dashboard">
          <Button
            size="lg"
            className="text-lg sm:text-xl px-6 py-3 rounded-full"
          >
            Start for free <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </div>
    </main>
  );
}
