'use client';

/**
 * 🌀 MAIA Meeting Room - Multi-Agent Witnessing
 *
 * Two or more people can have their MAIAs listen together,
 * witnessing the conversation and backchanneling patterns in real-time.
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Holoflower } from '@/components/ui/Holoflower';
import { Users, Mic, MicOff, Activity, Eye, MessageCircle } from 'lucide-react';
import { useCollectiveListening } from '@/lib/voice/useCollectiveListening';

type MeetingPhase = 'setup' | 'active' | 'retrospective';

interface Participant {
  id: string;
  name: string;
  maiaListening: boolean;
  lastActivity: number;
}

export default function MeetingRoomPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<MeetingPhase>('setup');
  const [meetingId, setMeetingId] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [hasJoined, setHasJoined] = useState(false);

  // Get user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('beta_user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUserName(userData.username || userData.soullabName || 'Explorer');
    }
  }, []);

  // Setup collective listening (only when meeting is active)
  const {
    isListening,
    isConnected,
    activeUsers,
    lastInsight,
    startListening,
    stopListening,
    requestSnapshot
  } = useCollectiveListening({
    teamId: meetingId,
    userId: userName,
    mode: 'conversation',
    alwaysOn: true,
    onPersonalUtterance: (utterance) => {
      console.log('Personal utterance captured:', utterance.text.substring(0, 50));
    },
    onCollectiveInsight: (insight) => {
      console.log('Collective insight received:', insight);
    }
  });

  const handleCreateMeeting = () => {
    const newMeetingId = `meeting-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    setMeetingId(newMeetingId);
    setHasJoined(true);
  };

  const handleJoinMeeting = () => {
    if (meetingId.trim()) {
      setHasJoined(true);
    }
  };

  const handleStartListening = async () => {
    await startListening();
    setPhase('active');
  };

  const handleEndMeeting = () => {
    stopListening();
    setPhase('retrospective');
  };

  // Update participants based on activeUsers
  useEffect(() => {
    if (activeUsers > 0 && hasJoined) {
      // In production, this would come from WebSocket
      // For now, simulate participants
      const mockParticipants: Participant[] = [
        {
          id: userName,
          name: userName,
          maiaListening: isListening,
          lastActivity: Date.now()
        }
      ];

      if (activeUsers > 1) {
        mockParticipants.push({
          id: 'other-user',
          name: 'Other Participant',
          maiaListening: true,
          lastActivity: Date.now()
        });
      }

      setParticipants(mockParticipants);
    }
  }, [activeUsers, hasJoined, userName, isListening]);

  return (
    <div className="min-h-screen bg-[#1a1f3a] flex items-center justify-center px-4">
      <div className="relative z-10 w-full max-w-4xl">
        <AnimatePresence mode="wait">
          {/* Phase 1: Setup */}
          {phase === 'setup' && !hasJoined && (
            <motion.div
              key="setup"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center space-y-8"
            >
              <Holoflower size="lg" glowIntensity="medium" className="mx-auto mb-8" />

              <h1 className="text-4xl font-extralight text-amber-50 tracking-wide">
                MAIA Meeting Room
              </h1>

              <p className="text-lg text-amber-200/70 max-w-2xl mx-auto leading-relaxed">
                Invite your MAIAs to witness your conversation together.
                They'll listen in the background, sensing patterns and supporting the field.
              </p>

              <div className="max-w-md mx-auto space-y-4 mt-12">
                <button
                  onClick={handleCreateMeeting}
                  className="w-full py-4 bg-gradient-to-r from-amber-500/80 to-amber-600/80 text-white rounded-lg font-medium hover:from-amber-500 hover:to-amber-600 transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
                >
                  <Users className="w-5 h-5" />
                  Create New Meeting
                </button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-amber-500/20"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-[#1a1f3a] text-amber-200/50">or</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <input
                    type="text"
                    value={meetingId}
                    onChange={(e) => setMeetingId(e.target.value)}
                    placeholder="Enter meeting ID"
                    className="w-full px-4 py-3 bg-[#0A0D16] border border-amber-500/20 rounded-lg text-amber-50 placeholder-amber-200/30 focus:outline-none focus:border-amber-500/50 transition-colors"
                  />
                  <button
                    onClick={handleJoinMeeting}
                    disabled={!meetingId.trim()}
                    className="w-full py-3 bg-[#0A0D16] border border-amber-500/30 text-amber-50 rounded-lg font-medium hover:bg-amber-500/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Join Existing Meeting
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Phase 2: Lobby (joined but not started) */}
          {phase === 'setup' && hasJoined && (
            <motion.div
              key="lobby"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-8"
            >
              <div className="text-center">
                <Holoflower size="lg" glowIntensity="medium" className="mx-auto mb-6" />
                <h2 className="text-3xl font-extralight text-amber-50 mb-4">
                  Meeting Ready
                </h2>
                <p className="text-amber-200/60 mb-2">Share this ID with others:</p>
                <div className="inline-flex items-center gap-3 px-6 py-3 bg-[#0A0D16]/60 border border-amber-500/20 rounded-lg">
                  <code className="text-xl text-amber-400 font-mono">{meetingId}</code>
                </div>
              </div>

              <div className="max-w-2xl mx-auto bg-[#0A0D16]/40 border border-amber-500/10 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="w-5 h-5 text-amber-400" />
                  <h3 className="text-lg text-amber-50 font-light">Participants</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-amber-500/5 border border-amber-500/10 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                      <span className="text-amber-200">{userName} (you)</span>
                    </div>
                    <span className="text-xs text-amber-400/60">Ready</span>
                  </div>
                  <div className="p-4 text-center text-amber-200/40 text-sm">
                    Waiting for others to join...
                  </div>
                </div>
              </div>

              <div className="text-center space-y-4">
                <button
                  onClick={handleStartListening}
                  className="px-12 py-4 bg-gradient-to-r from-amber-500/80 to-amber-600/80 text-white rounded-full font-medium hover:from-amber-500 hover:to-amber-600 transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-3 mx-auto"
                >
                  <Mic className="w-5 h-5" />
                  Begin Meeting
                </button>
                <p className="text-xs text-amber-200/40">
                  Your MAIA will listen and witness the conversation
                </p>
              </div>
            </motion.div>
          )}

          {/* Phase 3: Active Meeting */}
          {phase === 'active' && (
            <motion.div
              key="active"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Holoflower size="md" glowIntensity="high" />
                  <div>
                    <h2 className="text-2xl font-extralight text-amber-50">
                      Meeting in Progress
                    </h2>
                    <p className="text-sm text-amber-200/50">
                      {activeUsers} MAIA{activeUsers !== 1 ? 's' : ''} listening
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {isConnected && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-xs text-green-400">Connected</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Participants Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {participants.map((participant) => (
                  <div
                    key={participant.id}
                    className="p-4 bg-[#0A0D16]/40 border border-amber-500/10 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          participant.maiaListening
                            ? 'bg-amber-400 animate-pulse'
                            : 'bg-amber-400/20'
                        }`} />
                        <span className="text-amber-50">{participant.name}</span>
                      </div>
                      {participant.maiaListening && (
                        <Eye className="w-4 h-4 text-amber-400/60" />
                      )}
                    </div>
                    <div className="text-xs text-amber-200/40">
                      {participant.maiaListening ? 'MAIA witnessing' : 'Inactive'}
                    </div>
                  </div>
                ))}
              </div>

              {/* Collective Field Status */}
              {lastInsight && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 bg-amber-500/5 border border-amber-500/20 rounded-lg"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Activity className="w-5 h-5 text-amber-400" />
                    <h3 className="text-lg text-amber-50 font-light">Collective Field</h3>
                  </div>
                  <p className="text-amber-200/70 leading-relaxed">
                    {/* Display collective patterns here */}
                    The MAIAs are sensing patterns in the field...
                  </p>
                </motion.div>
              )}

              {/* Listening Status */}
              <div className="p-6 bg-[#0A0D16]/60 border border-amber-500/10 rounded-lg text-center">
                <div className="flex items-center justify-center gap-3 mb-3">
                  {isListening ? (
                    <>
                      <Mic className="w-6 h-6 text-amber-400 animate-pulse" />
                      <span className="text-amber-50 text-lg">MAIAs are witnessing</span>
                    </>
                  ) : (
                    <>
                      <MicOff className="w-6 h-6 text-amber-400/40" />
                      <span className="text-amber-200/40">Not listening</span>
                    </>
                  )}
                </div>
                <p className="text-sm text-amber-200/50">
                  Have your conversation naturally. The MAIAs will sense what emerges.
                </p>
              </div>

              {/* Controls */}
              <div className="flex justify-center gap-4 pt-4">
                <button
                  onClick={handleEndMeeting}
                  className="px-8 py-3 bg-amber-500/10 border border-amber-500/30 text-amber-50 rounded-lg font-medium hover:bg-amber-500/20 transition-all"
                >
                  End Meeting
                </button>
              </div>
            </motion.div>
          )}

          {/* Phase 4: Retrospective */}
          {phase === 'retrospective' && (
            <motion.div
              key="retrospective"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8"
            >
              <div className="text-center">
                <Holoflower size="lg" glowIntensity="medium" className="mx-auto mb-6" />
                <h2 className="text-3xl font-extralight text-amber-50 mb-4">
                  Meeting Complete
                </h2>
                <p className="text-amber-200/60">
                  Here's what emerged in the field...
                </p>
              </div>

              <div className="max-w-2xl mx-auto bg-[#0A0D16]/40 border border-amber-500/10 rounded-lg p-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg text-amber-50 font-light mb-3 flex items-center gap-2">
                      <MessageCircle className="w-5 h-5 text-amber-400" />
                      Patterns Witnessed
                    </h3>
                    <p className="text-amber-200/70 leading-relaxed">
                      The collective field showed themes of exploration, curiosity, and emergence.
                      Both MAIAs sensed a deepening of the conversation around intention and presence.
                    </p>
                  </div>

                  <div className="pt-4 border-t border-amber-500/10">
                    <p className="text-sm text-amber-200/50 italic">
                      Full retrospective features coming soon: elemental balance,
                      archetypal patterns, and MAIA-to-MAIA insights.
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <button
                  onClick={() => router.push('/maya')}
                  className="px-8 py-3 bg-gradient-to-r from-amber-500/80 to-amber-600/80 text-white rounded-lg font-medium hover:from-amber-500 hover:to-amber-600 transition-all shadow-lg shadow-amber-500/20"
                >
                  Return to MAIA
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
