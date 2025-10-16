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
        <Badge className="mb-4 bg-primary/10 text-primary border-primary/20" variant="outline">
          Consciousness Documentation System
        </Badge>
        <h1 className="text-5xl font-bold mb-4">
          The Field Protocol
        </h1>
        <p className="text-xl text-muted-foreground mb-4 max-w-2xl mx-auto">
          A 5-stage method for documenting consciousness experiences
        </p>
        <p className="text-lg mb-8 max-w-3xl mx-auto">
          No guru. No dogma. No one telling you what to think or feel.
          <br />
          Just <strong>you</strong>, your direct experience, and the wisdom that emerges when you truly witness.
        </p>
        <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
          The Field Protocol is a <strong>heuristic method</strong>—you discover your own path by walking it.
          <br />
          Like learning from the terrain itself, you find wisdom through direct experience.
        </p>
        <Button
          size="lg"
          onClick={handleGetStarted}
          className="bg-primary hover:bg-primary/90 text-white font-semibold"
        >
          Get Started
        </Button>
      </div>

      {/* 5 Stages */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-4">The Five Stages</h2>
        <p className="text-center text-muted-foreground mb-8">
          A structured method for documenting and integrating consciousness experiences
        </p>
        <div className="grid md:grid-cols-5 gap-4">
          {[
            {
              icon: Eye,
              title: 'Observation',
              subtitle: 'Stage 1',
              desc: 'What happened?',
              quote: 'Just the facts',
              color: 'text-blue-600',
              bg: 'bg-blue-50'
            },
            {
              icon: MessageSquare,
              title: 'Interpretation',
              subtitle: 'Stage 2',
              desc: 'What does it mean?',
              quote: 'Pattern recognition',
              color: 'text-purple-600',
              bg: 'bg-purple-50'
            },
            {
              icon: Heart,
              title: 'Integration',
              subtitle: 'Stage 3',
              desc: 'How does it land?',
              quote: 'Embodied wisdom',
              color: 'text-green-600',
              bg: 'bg-green-50'
            },
            {
              icon: Lightbulb,
              title: 'Reflection',
              subtitle: 'Stage 4',
              desc: 'What emerges?',
              quote: 'Synthesis',
              color: 'text-amber-600',
              bg: 'bg-amber-50'
            },
            {
              icon: Share2,
              title: 'Transmission',
              subtitle: 'Stage 5',
              desc: 'What's worth sharing?',
              quote: 'Teaching',
              color: 'text-orange-600',
              bg: 'bg-orange-50'
            }
          ].map(({ icon: Icon, title, subtitle, desc, quote, color, bg }) => (
            <Card key={title} className={`text-center border-border ${bg} hover:shadow-lg transition-shadow`}>
              <CardHeader>
                <Icon className={`w-12 h-12 mx-auto mb-2 ${color}`} />
                <CardTitle className="text-base font-bold">{title}</CardTitle>
                <p className="text-xs text-muted-foreground">({subtitle})</p>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-semibold mb-1">{desc}</p>
                <p className="text-xs text-muted-foreground">{quote}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-4">How It Works</h2>
        <p className="text-center text-muted-foreground mb-12">
          Document your experiences, recognize patterns, share wisdom
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border-border hover:border-primary/50 transition-colors">
            <CardHeader>
              <Lock className="w-8 h-8 mb-2 text-blue-600" />
              <CardTitle>Private by Default</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Your experiences are yours. Everything is private unless you choose to share.
                You control your data.
              </p>
            </CardContent>
          </Card>
          <Card className="border-border hover:border-primary/50 transition-colors">
            <CardHeader>
              <TrendingUp className="w-8 h-8 mb-2 text-purple-600" />
              <CardTitle>Pattern Recognition</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Over time, patterns emerge. The Field Protocol helps you see what was invisible.
                Wisdom through sustained attention.
              </p>
            </CardContent>
          </Card>
          <Card className="border-border hover:border-primary/50 transition-colors">
            <CardHeader>
              <Users className="w-8 h-8 mb-2 text-green-600" />
              <CardTitle>Optional Sharing</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                When ready, share with the community. Learn from collective wisdom.
                No gurus, no hierarchy.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="text-center py-12">
          <h2 className="text-3xl font-bold mb-4">Start Your Practice</h2>
          <p className="text-muted-foreground mb-4 max-w-2xl mx-auto">
            Your consciousness holds the answers. The Field Protocol provides the structure.
          </p>
          <p className="mb-8 max-w-2xl mx-auto">
            No one can walk your path for you, but heuristic methods help you discover wisdom through direct experience.
          </p>
          <Button
            size="lg"
            onClick={handleGetStarted}
            className="bg-primary hover:bg-primary/90 text-white font-semibold"
          >
            Get Started
          </Button>
          <p className="text-xs text-muted-foreground mt-4">
            Free • No credit card • Your data stays yours
          </p>
        </CardContent>
      </Card>
    </div>
  );
}