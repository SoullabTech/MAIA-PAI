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
        <Badge className="mb-4" variant="outline">Beta - Now Accepting Early Users</Badge>
        <h1 className="text-5xl font-bold mb-4">The Field Protocol</h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          A structured framework for documenting and understanding your consciousness experiences
        </p>
        <Button size="lg" onClick={handleGetStarted}>Start Your First Record</Button>
      </div>

      {/* 5 Stages */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">The 5-Stage Process</h2>
        <div className="grid md:grid-cols-5 gap-4">
          {[
            { icon: Eye, title: '1. Observation', desc: 'Capture what happened', color: 'text-blue-500' },
            { icon: MessageSquare, title: '2. Interpretation', desc: 'Make meaning', color: 'text-purple-500' },
            { icon: Heart, title: '3. Integration', desc: 'Embody it', color: 'text-red-500' },
            { icon: Lightbulb, title: '4. Reflection', desc: 'Extract wisdom', color: 'text-yellow-500' },
            { icon: Share2, title: '5. Transmission', desc: 'Share insights', color: 'text-green-500' }
          ].map(({ icon: Icon, title, desc, color }) => (
            <Card key={title} className="text-center">
              <CardHeader>
                <Icon className={`w-12 h-12 mx-auto mb-2 ${color}`} />
                <CardTitle className="text-lg">{title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">What You Get</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <Lock className="w-8 h-8 mb-2" />
              <CardTitle>Your Data, Your Control</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Private by default. Share only what you choose.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <TrendingUp className="w-8 h-8 mb-2" />
              <CardTitle>Pattern Recognition</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                See patterns invisible to daily observation.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Users className="w-8 h-8 mb-2" />
              <CardTitle>Community Wisdom</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Share and discover collective patterns.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
        <CardContent className="text-center py-12">
          <h2 className="text-3xl font-bold mb-4">Ready to Begin?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join early users exploring consciousness through structured documentation
          </p>
          <Button size="lg" onClick={handleGetStarted}>Create Free Account</Button>
        </CardContent>
      </Card>
    </div>
  );
}