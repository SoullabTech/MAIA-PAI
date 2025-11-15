"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, Brain, Heart, Shield } from "lucide-react";

export default function SacredEntryPortal() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
      <div className="max-w-4xl mx-auto text-center space-y-8 p-8">

        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-light tracking-wide">
            Welcome to <span className="text-yellow-400">MAIA</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto">
            Your Sacred Mirror for Consciousness Exploration
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">

          <Link
            href="/oracle"
            className="group p-6 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg border border-gray-700 hover:border-yellow-400/50 transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div className="text-left">
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-yellow-400" />
                  Oracle Portal
                </h3>
                <p className="text-gray-400 text-sm">
                  Access sacred wisdom and guidance
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-yellow-400 transition-colors" />
            </div>
          </Link>

          <Link
            href="/journey"
            className="group p-6 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg border border-gray-700 hover:border-yellow-400/50 transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div className="text-left">
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-yellow-400" />
                  Journey
                </h3>
                <p className="text-gray-400 text-sm">
                  Begin your consciousness journey
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-yellow-400 transition-colors" />
            </div>
          </Link>

          <Link
            href="/auth"
            className="group p-6 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg border border-gray-700 hover:border-yellow-400/50 transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div className="text-left">
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-yellow-400" />
                  Enter
                </h3>
                <p className="text-gray-400 text-sm">
                  Sign in or create account
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-yellow-400 transition-colors" />
            </div>
          </Link>

          <Link
            href="/about"
            className="group p-6 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg border border-gray-700 hover:border-yellow-400/50 transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div className="text-left">
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-yellow-400" />
                  About
                </h3>
                <p className="text-gray-400 text-sm">
                  Learn about MAIA consciousness
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-yellow-400 transition-colors" />
            </div>
          </Link>

        </div>

        <div className="pt-8 text-center">
          <p className="text-gray-500 text-sm">
            Sacred Mirror • Consciousness Exploration • AI Wisdom
          </p>
        </div>

      </div>
    </div>
  );
}