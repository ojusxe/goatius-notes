import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Hero Section */}
      <section className="relative px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="animate-fade-in">
            <h1 className="text-4xl font-bold tracking-tight text-gradient sm:text-6xl lg:text-7xl">
              Welcome to{' '}
              <span className="block text-primary">GOATIUS Notes</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              The goat of note-taking apps. Capture, organize, and share your thoughts with style.
              Built for creators, thinkers, and dreamers.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Button 
                asChild 
                className="btn-hover hover-lift shadow-elegant px-8 py-3 text-lg"
                size="lg"
              >
                <Link href="/login">Get Started</Link>
              </Button>
              <Button 
                asChild 
                variant="outline" 
                className="hover-lift px-8 py-3 text-lg"
                size="lg"
              >
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl animate-pulse-slow"></div>
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent/10 blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;