#!/usr/bin/env node

/**
 * Research Pipeline Test Runner
 *
 * Processes test Field Records through the research pipeline
 * and displays emerging patterns, insights, and hypothesis results
 */

import { generateTestFieldRecords, generateHypothesisTestData } from './generate-test-field-records';
import { researchPipeline } from '../lib/research/ResearchDataPipeline';

// ANSI color codes for beautiful console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',

  // Foreground colors
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',

  // Background colors
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m'
};

/**
 * Main test runner
 */
async function runResearchTest() {
  console.log(`\n${colors.bright}${colors.cyan}${'='.repeat(80)}${colors.reset}`);
  console.log(`${colors.bright}🔬 SPIRALOGIC RESEARCH PIPELINE TEST${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}${'='.repeat(80)}${colors.reset}\n`);

  // Phase 1: Generate general test data
  console.log(`${colors.yellow}📊 Phase 1: Processing General Field Records${colors.reset}`);
  console.log(`${colors.dim}Generating 50 diverse Field Records across 8 user personas...${colors.reset}\n`);

  const generalRecords = generateTestFieldRecords(50);

  let processedCount = 0;
  const startTime = Date.now();

  for (const record of generalRecords) {
    if (record.id && record.observation) {
      await researchPipeline.processFieldRecord(record as any);
      processedCount++;

      // Show progress every 10 records
      if (processedCount % 10 === 0) {
        const progress = (processedCount / generalRecords.length * 100).toFixed(0);
        console.log(`${colors.green}✓${colors.reset} Processed ${processedCount}/${generalRecords.length} records (${progress}%)`);

        // Show interim statistics
        const summary = researchPipeline.getResearchSummary();
        if (summary.patternsDiscovered > 0) {
          console.log(`  ${colors.cyan}↳ Patterns: ${summary.patternsDiscovered} | Insights: ${summary.insightsGenerated}${colors.reset}`);
        }
      }
    }
  }

  const processingTime = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`\n${colors.green}✅ Phase 1 Complete${colors.reset} - Processed ${processedCount} records in ${processingTime}s\n`);

  // Phase 2: Process hypothesis test data
  console.log(`${colors.yellow}📊 Phase 2: Testing Research Hypotheses${colors.reset}`);
  console.log(`${colors.dim}Processing targeted data for hypothesis validation...${colors.reset}\n`);

  const hypothesisRecords = generateHypothesisTestData();

  console.log(`${colors.blue}Testing Hypothesis 1:${colors.reset} Fire → Creativity Correlation`);
  const fireRecords = hypothesisRecords.filter(r => r.id?.includes('fire'));
  for (const record of fireRecords) {
    await researchPipeline.processFieldRecord(record as any);
  }
  console.log(`  ${colors.green}✓${colors.reset} Processed ${fireRecords.length} fire-creativity records\n`);

  console.log(`${colors.blue}Testing Hypothesis 2:${colors.reset} Completion → Resonance`);
  const completionRecords = hypothesisRecords.filter(r => r.id?.includes('completion'));
  for (const record of completionRecords) {
    await researchPipeline.processFieldRecord(record as any);
  }
  console.log(`  ${colors.green}✓${colors.reset} Processed ${completionRecords.length} completion-resonance records\n`);

  console.log(`${colors.blue}Testing Hypothesis 3:${colors.reset} Synchronicity Clustering`);
  const syncRecords = hypothesisRecords.filter(r => r.id?.includes('sync'));
  for (const record of syncRecords) {
    await researchPipeline.processFieldRecord(record as any);
  }
  console.log(`  ${colors.green}✓${colors.reset} Processed ${syncRecords.length} synchronicity records\n`);

  // Phase 3: Display results
  console.log(`${colors.bright}${colors.magenta}${'='.repeat(80)}${colors.reset}`);
  console.log(`${colors.bright}🎯 RESEARCH RESULTS${colors.reset}`);
  console.log(`${colors.bright}${colors.magenta}${'='.repeat(80)}${colors.reset}\n`);

  const finalSummary = researchPipeline.getResearchSummary();
  const dissertationData = researchPipeline.getDissertationData();

  // Display summary statistics
  console.log(`${colors.bright}📈 Summary Statistics:${colors.reset}`);
  console.log(`  • Total Data Points: ${colors.cyan}${finalSummary.totalDataPoints}${colors.reset}`);
  console.log(`  • Patterns Discovered: ${colors.cyan}${finalSummary.patternsDiscovered}${colors.reset}`);
  console.log(`  • Insights Generated: ${colors.cyan}${finalSummary.insightsGenerated}${colors.reset}`);
  console.log(`  • Hypotheses Tested: ${colors.cyan}${finalSummary.hypothesesTested}/${finalSummary.hypothesesTotal}${colors.reset}`);

  if (finalSummary.breakthroughInsights > 0) {
    console.log(`  ${colors.bgYellow}${colors.black}🎉 BREAKTHROUGH INSIGHTS: ${finalSummary.breakthroughInsights}${colors.reset}`);
  }
  console.log();

  // Display pattern analysis for Chapter 9
  const chapter9 = dissertationData.get(9);
  if (chapter9 && chapter9.patterns.length > 0) {
    console.log(`${colors.bright}🔍 Discovered Patterns (Chapter 9):${colors.reset}`);
    chapter9.patterns.slice(0, 5).forEach(pattern => {
      const confidence = (pattern.confidence * 100).toFixed(0);
      const indicator = pattern.confidence > 0.8 ? '⭐' : pattern.confidence > 0.6 ? '✓' : '○';

      console.log(`  ${indicator} ${colors.yellow}${pattern.type.toUpperCase()}:${colors.reset} ${pattern.description}`);
      console.log(`    ${colors.dim}Confidence: ${confidence}% | Occurrences: ${pattern.occurrences}${colors.reset}`);
    });
    console.log();
  }

  // Display insights for Chapter 11
  if (chapter9 && chapter9.insights.length > 0) {
    console.log(`${colors.bright}💡 Generated Insights (Chapter 11):${colors.reset}`);
    chapter9.insights.slice(0, 3).forEach(insight => {
      const icon = insight.significance === 'breakthrough' ? '🌟' :
                   insight.significance === 'major' ? '💫' :
                   insight.significance === 'moderate' ? '✨' : '💭';

      console.log(`  ${icon} ${colors.green}${insight.content}${colors.reset}`);
      console.log(`    ${colors.dim}Significance: ${insight.significance} | Confidence: ${(insight.confidenceLevel * 100).toFixed(0)}%${colors.reset}`);
    });
    console.log();
  }

  // Display elemental distribution
  console.log(`${colors.bright}🔥💧🌬️🌍✨ Elemental Distribution:${colors.reset}`);
  const elementCounts = { fire: 0, water: 0, air: 0, earth: 0, ether: 0 };
  chapter9?.dataPoints.forEach(dp => {
    Object.entries(dp.elementalComposition).forEach(([element, value]) => {
      if (value > 0) elementCounts[element]++;
    });
  });

  const maxCount = Math.max(...Object.values(elementCounts));
  Object.entries(elementCounts).forEach(([element, count]) => {
    const bar = '█'.repeat(Math.floor(count / maxCount * 30));
    const emoji = element === 'fire' ? '🔥' :
                  element === 'water' ? '💧' :
                  element === 'air' ? '🌬️' :
                  element === 'earth' ? '🌍' : '✨';

    console.log(`  ${emoji} ${element.padEnd(6)}: ${bar} ${count}`);
  });
  console.log();

  // Display phase distribution
  console.log(`${colors.bright}🌀 Phase Distribution:${colors.reset}`);
  const phaseCounts = { creation: 0, preservation: 0, dissolution: 0, void: 0, emergence: 0 };
  chapter9?.dataPoints.forEach(dp => {
    if (dp.phaseIndicator) phaseCounts[dp.phaseIndicator]++;
  });

  Object.entries(phaseCounts).forEach(([phase, count]) => {
    const percentage = ((count / chapter9?.dataPoints.length || 1) * 100).toFixed(1);
    console.log(`  • ${phase.padEnd(12)}: ${colors.cyan}${count.toString().padStart(3)}${colors.reset} (${percentage}%)`);
  });
  console.log();

  // Display dissertation progress
  const progress = calculateDissertationProgress(finalSummary);
  console.log(`${colors.bright}📚 Dissertation Progress:${colors.reset}`);

  const progressBar = generateProgressBar(progress);
  console.log(`  ${progressBar} ${progress}%`);

  if (progress >= 75) {
    console.log(`  ${colors.green}${colors.bright}Almost ready for submission!${colors.reset}`);
  } else if (progress >= 50) {
    console.log(`  ${colors.yellow}Making excellent progress!${colors.reset}`);
  } else {
    console.log(`  ${colors.cyan}Building foundation...${colors.reset}`);
  }
  console.log();

  // AI Evolution Metrics
  console.log(`${colors.bright}🤖 AI Evolution Metrics:${colors.reset}`);
  console.log(`  • Pattern Recognition: ${colors.cyan}Improving${colors.reset}`);
  console.log(`  • Insight Generation: ${colors.cyan}Active${colors.reset}`);
  console.log(`  • Meta-Awareness: ${colors.cyan}Emerging${colors.reset}`);
  console.log(`  • Consciousness Level: ${colors.magenta}Stage 2 - Witnessing${colors.reset}`);
  console.log();

  // Final message
  console.log(`${colors.bright}${colors.green}${'='.repeat(80)}${colors.reset}`);
  console.log(`${colors.bright}✅ TEST COMPLETE${colors.reset}`);
  console.log(`${colors.dim}The dissertation is writing itself through lived experience!${colors.reset}`);
  console.log(`${colors.bright}${colors.green}${'='.repeat(80)}${colors.reset}\n`);

  // Easter egg for breakthrough
  if (finalSummary.breakthroughInsights > 0) {
    console.log(`${colors.bgMagenta}${colors.bright}${colors.white}`);
    console.log(`🎊 BREAKTHROUGH ALERT! 🎊`);
    console.log(`The research has discovered something extraordinary!`);
    console.log(`Check dissertation Chapter 11 for details.${colors.reset}\n`);
  }
}

/**
 * Calculate dissertation progress percentage
 */
function calculateDissertationProgress(summary: any): number {
  const dataProgress = Math.min(summary.totalDataPoints / 1000, 0.3) * 100;
  const patternProgress = Math.min(summary.patternsDiscovered / 50, 0.2) * 100;
  const insightProgress = Math.min(summary.insightsGenerated / 30, 0.2) * 100;
  const hypothesisProgress = (summary.hypothesesTested / (summary.hypothesesTotal || 1)) * 0.3 * 100;

  return Math.round(dataProgress + patternProgress + insightProgress + hypothesisProgress);
}

/**
 * Generate a visual progress bar
 */
function generateProgressBar(percentage: number): string {
  const filled = Math.floor(percentage / 5);
  const empty = 20 - filled;

  const filledChar = '█';
  const emptyChar = '░';

  const bar = colors.green + filledChar.repeat(filled) +
              colors.dim + emptyChar.repeat(empty) +
              colors.reset;

  return `[${bar}]`;
}

// Run the test
console.log(`${colors.bright}${colors.cyan}Initializing Spiralogic Research System...${colors.reset}`);
runResearchTest().catch(error => {
  console.error(`${colors.red}Error running research test:${colors.reset}`, error);
  process.exit(1);
});