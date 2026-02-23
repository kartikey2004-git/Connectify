"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const ErrorPage = () => {
  return (
    <main className="grid min-h-[calc(100vh-4rem)] place-items-center bg-background px-6 py-20 sm:py-24 lg:px-8">
      <div className="text-center">
        <p className="text-2xl font-semibold text-muted-foreground">404</p>
        <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Page not found
        </h1>
        <p className="mt-5 text-pretty text-base text-muted-foreground sm:text-lg">
          Sorry, we couldn’t find the page you’re looking for.
        </p>
        <div className="mt-8 flex items-center justify-center gap-x-4">
          <Button asChild>
            <Link href="/">Go back home</Link>
          </Button>
          <Link href="/dashboard" className="text-sm font-semibold text-foreground">
            Contact support <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </main>
  );
};

export default ErrorPage;