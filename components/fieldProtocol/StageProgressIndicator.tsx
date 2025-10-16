'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Circle, ChevronRight } from 'lucide-react';
import { ObservationStage } from '@/types/fieldProtocol';
import { cn } from '@/lib/utils';

interface StageProgressIndicatorProps {
  currentStage: ObservationStage;
  completedStages: ObservationStage[];
  onStageClick?: (stage: ObservationStage) => void;
  className?: string;
}

const STAGES: ObservationStage[] = [
  'Observation',
  'Interpretation',
  'Integration',
  'Reflection',
  'Transmission'
];

const STAGE_DESCRIPTIONS = {
  Observation: 'Document the phenomenon without interpretation',
  Interpretation: 'Explore symbolic and archetypal meanings',
  Integration: 'Connect insights with lived experience',
  Reflection: 'Validate patterns and synchronicities',
  Transmission: 'Share wisdom with the commons'
};

const STAGE_COLORS = {
  Observation: 'from-blue-500 to-cyan-500',
  Interpretation: 'from-purple-500 to-pink-500',
  Integration: 'from-green-500 to-emerald-500',
  Reflection: 'from-yellow-500 to-orange-500',
  Transmission: 'from-red-500 to-rose-500'
};

export const StageProgressIndicator: React.FC<StageProgressIndicatorProps> = ({
  currentStage,
  completedStages = [],
  onStageClick,
  className
}) => {
  const currentIndex = STAGES.indexOf(currentStage);
  const progress = ((currentIndex + 1) / STAGES.length) * 100;

  return (
    <div className={cn("w-full", className)}>
      {/* Progress Bar */}
      <div className="relative mb-8">
        <div className="absolute inset-0 h-2 bg-gray-200 dark:bg-gray-700 rounded-full" />
        <motion.div
          className="absolute h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />

        {/* Stage Dots */}
        <div className="relative flex justify-between">
          {STAGES.map((stage, index) => {
            const isCompleted = completedStages.includes(stage);
            const isCurrent = stage === currentStage;
            const isPast = index < currentIndex;

            return (
              <motion.div
                key={stage}
                className="relative"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <button
                  onClick={() => onStageClick?.(stage)}
                  disabled={!isPast && !isCurrent}
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200",
                    "transform -translate-y-4",
                    isCurrent && "scale-125 shadow-lg",
                    isPast || isCurrent
                      ? `bg-gradient-to-br ${STAGE_COLORS[stage]} text-white`
                      : "bg-gray-300 dark:bg-gray-600 text-gray-500",
                    (isPast || isCurrent) && onStageClick && "hover:scale-110 cursor-pointer",
                    !isPast && !isCurrent && "cursor-not-allowed opacity-50"
                  )}
                  title={STAGE_DESCRIPTIONS[stage]}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </button>

                {/* Stage Label */}
                <div className="absolute top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                  <p className={cn(
                    "text-xs font-medium transition-colors",
                    isCurrent && "text-purple-600 dark:text-purple-400",
                    isPast && "text-gray-600 dark:text-gray-400",
                    !isPast && !isCurrent && "text-gray-400 dark:text-gray-500"
                  )}>
                    {stage}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Current Stage Details */}
      <motion.div
        key={currentStage}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <span className={cn(
                "inline-block w-3 h-3 rounded-full",
                `bg-gradient-to-r ${STAGE_COLORS[currentStage]}`
              )} />
              {currentStage} Stage
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {STAGE_DESCRIPTIONS[currentStage]}
            </p>
          </div>

          {currentIndex < STAGES.length - 1 && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>Next:</span>
              <span className="font-medium">{STAGES[currentIndex + 1]}</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          )}
        </div>

        {/* Progress Stats */}
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-purple-600">{currentIndex + 1}</p>
            <p className="text-xs text-gray-500">Current Stage</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">{completedStages.length}</p>
            <p className="text-xs text-gray-500">Completed</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-600">{Math.round(progress)}%</p>
            <p className="text-xs text-gray-500">Progress</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default StageProgressIndicator;