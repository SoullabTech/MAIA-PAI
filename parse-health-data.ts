/**
 * Quick Apple Health Parser - See Your Coherence NOW
 */

import * as fs from 'fs';
import { elementalCoherenceCalculator } from './lib/biometrics/ElementalCoherenceCalculator';

const filePath = '/Users/soullab/Downloads/apple_health_export 3/export.xml';

console.log('📊 Parsing Apple Health Data...\n');
console.log('─'.repeat(60));

const xml = fs.readFileSync(filePath, 'utf-8');

// Extract HRV readings (recent 100)
const hrvMatches = xml.match(/<Record type="HKQuantityTypeIdentifierHeartRateVariabilitySDNN"[^>]*value="([^"]+)"[^>]*startDate="([^"]+)"/g);
const hrvReadings = hrvMatches?.slice(0, 100).map(match => {
  const value = parseFloat(match.match(/value="([^"]+)"/)?.[1] || '0');
  const dateStr = match.match(/startDate="([^"]+)"/)?.[1] || '';
  return { value, startDate: new Date(dateStr) };
}) || [];

// Extract heart rate
const hrMatches = xml.match(/<Record type="HKQuantityTypeIdentifierHeartRate"[^>]*value="([^"]+)"/g);
const hr = hrMatches?.[0] ? parseFloat(hrMatches[0].match(/value="([^"]+)"/)?.[1] || '70') : 70;

// Extract resting heart rate
const rhrMatches = xml.match(/<Record type="HKQuantityTypeIdentifierRestingHeartRate"[^>]*value="([^"]+)"/g);
const rhr = rhrMatches?.[0] ? parseFloat(rhrMatches[0].match(/value="([^"]+)"/)?.[1] || '65') : 65;

// Extract respiratory rate
const respMatches = xml.match(/<Record type="HKQuantityTypeIdentifierRespiratoryRate"[^>]*value="([^"]+)"/g);
const resp = respMatches?.[0] ? parseFloat(respMatches[0].match(/value="([^"]+)"/)?.[1] || '15') : 15;

// Extract sleep (last night)
const sleepMatches = xml.match(/<Record type="HKCategoryTypeIdentifierSleepAnalysis"[^>]*startDate="([^"]+)" endDate="([^"]+)"/g);
let totalSleep = 0;
let deepSleep = 0;

if (sleepMatches && sleepMatches.length > 0) {
  sleepMatches.slice(0, 10).forEach(match => {
    const start = new Date(match.match(/startDate="([^"]+)"/)?.[1] || '');
    const end = new Date(match.match(/endDate="([^"]+)"/)?.[1] || '');
    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    totalSleep += hours;
    if (match.includes('Deep')) deepSleep += hours;
  });
}

// Calculate HRV stats
const hrvValues = hrvReadings.map(r => r.value);
const latestHRV = hrvValues[0] || 50;
const avgHRV = hrvValues.reduce((sum, v) => sum + v, 0) / hrvValues.length;
const hrvVariance = hrvValues.reduce((sum, v) => sum + Math.pow(v - avgHRV, 2), 0) / hrvValues.length;

// Determine trend
let trend: 'rising' | 'stable' | 'falling' = 'stable';
if (hrvValues.length >= 5) {
  const recent = hrvValues.slice(0, 5).reduce((sum, v) => sum + v, 0) / 5;
  const older = hrvValues.slice(5, 10).reduce((sum, v) => sum + v, 0) / 5;
  if (recent > older * 1.15) trend = 'rising';
  else if (recent < older * 0.85) trend = 'falling';
}

// Calculate readiness score
const hrvScore = Math.min(100, (latestHRV / 100) * 40);
const sleepScore = Math.min(30, (totalSleep / 8) * 30);
const rhrScore = Math.max(0, 20 - (rhr - 50) * 0.5);
const deepBonus = Math.min(10, (deepSleep / 2) * 10);
const readinessScore = Math.round(hrvScore + sleepScore + rhrScore + deepBonus);

// Create biometric snapshot
const snapshot = {
  hrv: latestHRV,
  heartRate: hr,
  restingHeartRate: rhr,
  respiratoryRate: resp,
  sleepHours: totalSleep,
  deepSleepHours: deepSleep,
  hrvTrend: trend,
  hrvVariance,
  readinessScore
};

// Calculate elemental coherence!
const elemental = elementalCoherenceCalculator.calculate(snapshot);

console.log('✅ DATA EXTRACTED:\n');
console.log('HRV Readings Found:', hrvReadings.length);
console.log('Latest HRV:', latestHRV.toFixed(1) + 'ms');
console.log('Average HRV:', avgHRV.toFixed(1) + 'ms');
console.log('Heart Rate:', hr.toFixed(0) + ' BPM');
console.log('Resting HR:', rhr.toFixed(0) + ' BPM');
console.log('Respiratory Rate:', resp.toFixed(1) + '/min');
console.log('Sleep:', totalSleep.toFixed(1) + 'h (Deep: ' + deepSleep.toFixed(1) + 'h)');
console.log('Trend:', trend);
console.log('Readiness Score:', readinessScore + '/100');

console.log('\n' + '─'.repeat(60));
console.log('✨ YOUR ELEMENTAL COHERENCE:\n');

console.log('💫 UNIFIED FIELD:      ' + Math.round(elemental.unified * 100) + '%');
console.log('');
console.log('💨 AIR (Clarity):      ' + Math.round(elemental.air * 100) + '%');
console.log('🔥 FIRE (Transform):   ' + Math.round(elemental.fire * 100) + '%');
console.log('🌊 WATER (Flow):       ' + Math.round(elemental.water * 100) + '%');
console.log('🌍 EARTH (Grounding):  ' + Math.round(elemental.earth * 100) + '%');
console.log('✨ AETHER (Unity):     ' + Math.round(elemental.aether * 100) + '%');

console.log('\n' + '─'.repeat(60));

// Find dominant and deficient
const elements = [
  { name: 'Air', value: elemental.air, emoji: '💨' },
  { name: 'Fire', value: elemental.fire, emoji: '🔥' },
  { name: 'Water', value: elemental.water, emoji: '🌊' },
  { name: 'Earth', value: elemental.earth, emoji: '🌍' },
  { name: 'Aether', value: elemental.aether, emoji: '✨' }
];

elements.sort((a, b) => b.value - a.value);

console.log('🎯 INSIGHTS:\n');
console.log('Dominant Element:  ' + elements[0].emoji + ' ' + elements[0].name + ' (' + Math.round(elements[0].value * 100) + '%)');
console.log('Deficient Element: ' + elements[4].emoji + ' ' + elements[4].name + ' (' + Math.round(elements[4].value * 100) + '%)');

console.log('\n' + '─'.repeat(60));
console.log('\n🎉 SUCCESS! Your consciousness is now quantified!\n');
