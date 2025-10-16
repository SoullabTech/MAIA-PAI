'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Eye, MessageSquare, Heart, Lightbulb, Share2,
  CheckCircle, Lock, Users, TrendingUp
} from 'lucide-react';
import AuthForm from '@/components/auth/AuthForm';
import { useAuth } from '@/lib/auth/AuthProvider';
import { useRouter } from 'next/navigation';

export default function FieldProtocolLanding() {
  const [showAuth, setShowAuth] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const handleGetStarted = () => {
    if (user) {
      router.push('/dashboard');
    } else {
      setShowAuth(true);
    }
  };

  if (showAuth) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="mb-8">
          <Button variant="ghost" onClick={() => setShowAuth(false)}>
            ← Back
          </Button>
        </div>
        <AuthForm onSuccess={() => router.push('/dashboard')} />
      </div>
    );
  }
  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      {/* Hero */}
      <div className="text-center mb-16">
        <Badge className="mb-4 bg-dune-spice-sand text-dune-deep-sand border-dune-sienna-rock" variant="outline">
          🏜️ Wisdom Emerges from Direct Experience
        </Badge>
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-dune-spice-orange to-dune-spice-deep bg-clip-text text-transparent">
          The Field Protocol
        </h1>
        <p className="text-xl text-muted-foreground mb-4 max-w-2xl mx-auto italic">
          "The desert teaches patience. Water teaches value. Stillness teaches truth."
        </p>
        <p className="text-lg mb-8 max-w-3xl mx-auto">
          No guru. No dogma. No one telling you what to think or feel.
          <br />
          Just <strong>you</strong>, your direct experience, and the wisdom that emerges when you truly witness.
        </p>
        <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
          The Field Protocol is a heuristic method—you discover your own path by walking it.
          <br />
          Like learning from the terrain itself, you discover wisdom from <em>your</em> unique journey.
        </p>
        <Button
          size="lg"
          onClick={handleGetStarted}
          className="bg-gradient-to-r from-dune-spice-orange to-dune-spice-deep hover:from-dune-spice-glow hover:to-dune-spice-orange text-white font-semibold tracking-wide"
        >
          BEGIN THE PRACTICE
        </Button>
      </div>

      {/* 5 Stages - Dune Style */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-4">Five Disciplines of the Awakened Mind</h2>
        <p className="text-center text-muted-foreground mb-8 italic">
          "The mystery of life isn't a problem to solve, but a reality to experience." — Paul Atreides
        </p>
        <div className="grid md:grid-cols-5 gap-4">
          {[
            {
              icon: Eye,
              title: 'The Witnessing',
              subtitle: 'Observation',
              desc: 'See without fabrication',
              quote: 'Clear perception',
              color: 'text-dune-ibad-blue',
              bg: 'bg-dune-ibad-blue/10'
            },
            {
              icon: MessageSquare,
              title: 'The Computation',
              subtitle: 'Interpretation',
              desc: 'Understand the pattern',
              quote: 'Deep analysis',
              color: 'text-dune-navigator-purple',
              bg: 'bg-dune-navigator-purple/10'
            },
            {
              icon: Heart,
              title: 'The Walking',
              subtitle: 'Integration',
              desc: 'Embody the teaching',
              quote: 'Living wisdom',
              color: 'text-dune-atreides-green',
              bg: 'bg-dune-atreides-green/10'
            },
            {
              icon: Lightbulb,
              title: 'The Prescience',
              subtitle: 'Reflection',
              desc: 'Know the consequences',
              quote: 'Future sight',
              color: 'text-dune-bene-gesserit-gold',
              bg: 'bg-dune-bene-gesserit-gold/10'
            },
            {
              icon: Share2,
              title: 'The Teaching',
              subtitle: 'Transmission',
              desc: 'Awaken others',
              quote: 'Shared wisdom',
              color: 'text-dune-spice-orange',
              bg: 'bg-dune-spice-orange/10'
            }
          ].map(({ icon: Icon, title, subtitle, desc, quote, color, bg }) => (
            <Card key={title} className={`text-center border-dune-sienna-rock/30 ${bg} hover:shadow-lg transition-shadow`}>
              <CardHeader>
                <Icon className={`w-12 h-12 mx-auto mb-2 ${color}`} />
                <CardTitle className="text-base font-bold">{title}</CardTitle>
                <p className="text-xs text-muted-foreground italic">({subtitle})</p>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-semibold mb-1">{desc}</p>
                <p className="text-xs text-muted-foreground italic">{quote}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Features - Water Rights */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-4">Your Wisdom, Your Choice</h2>
        <p className="text-center text-muted-foreground mb-12 italic">
          "Your consciousness is precious. What you discover is yours to protect and share."
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border-dune-fremen-azure/30 hover:border-dune-fremen-azure transition-colors">
            <CardHeader>
              <Lock className="w-8 h-8 mb-2 text-dune-fremen-azure" />
              <CardTitle>Personal Practice</CardTitle>
              <p className="text-xs text-muted-foreground italic">(Private by default)</p>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Your experiences are yours. Sacred and protected.
                Share only when you choose to offer the gift.
              </p>
            </CardContent>
          </Card>
          <Card className="border-dune-navigator-purple/30 hover:border-dune-navigator-purple transition-colors">
            <CardHeader>
              <TrendingUp className="w-8 h-8 mb-2 text-dune-navigator-purple" />
              <CardTitle>Pattern Recognition</CardTitle>
              <p className="text-xs text-muted-foreground italic">(Emergent clarity)</p>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Over time, you'll recognize patterns invisible to daily consciousness.
                Wisdom emerges from sustained attention.
              </p>
            </CardContent>
          </Card>
          <Card className="border-dune-atreides-green/30 hover:border-dune-atreides-green transition-colors">
            <CardHeader>
              <Users className="w-8 h-8 mb-2 text-dune-atreides-green" />
              <CardTitle>Community Wisdom</CardTitle>
              <p className="text-xs text-muted-foreground italic">(Collective learning)</p>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                When ready, share with the community. Collective knowledge strengthens all.
                Shared wisdom without gurus or hierarchy.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA */}
      <Card className="bg-gradient-to-r from-dune-spice-sand/20 to-dune-dune-amber/20 border-dune-spice-orange/30">
        <CardContent className="text-center py-12">
          <h2 className="text-3xl font-bold mb-4 text-dune-deep-sand">Awaken to Your Own Wisdom</h2>
          <p className="text-muted-foreground mb-4 max-w-2xl mx-auto italic">
            "The beginning of knowledge is the discovery of something we do not understand." — Frank Herbert
          </p>
          <p className="mb-8 max-w-2xl mx-auto">
            Your journey awaits. Your consciousness holds the answers.
            <br />
            No one can walk your path for you—but the protocol provides the structure.
          </p>
          <Button
            size="lg"
            onClick={handleGetStarted}
            className="bg-gradient-to-r from-dune-spice-orange to-dune-spice-deep hover:from-dune-spice-glow hover:to-dune-spice-orange text-white font-semibold tracking-wide shadow-lg"
          >
            BEGIN THE JOURNEY
          </Button>
          <p className="text-xs text-muted-foreground mt-4 italic">
            Free. No credit card. Your wisdom belongs to you.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}