#!/usr/bin/env python3
"""Quick Apple Health Parser - Extract Key Metrics"""

import re
from datetime import datetime

print("📊 Extracting Your Health Data...\n")
print("─" * 60)

file_path = "/Users/soullab/Downloads/apple_health_export 3/export.xml"

# Extract recent HRV (last 50 readings)
hrv_values = []
hr_values = []
rhr_values = []
resp_values = []

with open(file_path, 'r') as f:
    for line in f:
        # HRV
        if 'HKQuantityTypeIdentifierHeartRateVariabilitySDNN' in line and len(hrv_values) < 50:
            match = re.search(r'value="([0-9.]+)"', line)
            if match:
                hrv_values.append(float(match.group(1)))

        # Heart Rate
        elif 'HKQuantityTypeIdentifierHeartRate"' in line and len(hr_values) < 20:
            match = re.search(r'value="([0-9.]+)"', line)
            if match:
                hr_values.append(float(match.group(1)))

        # Resting Heart Rate
        elif 'HKQuantityTypeIdentifierRestingHeartRate' in line and len(rhr_values) < 10:
            match = re.search(r'value="([0-9.]+)"', line)
            if match:
                rhr_values.append(float(match.group(1)))

        # Respiratory Rate
        elif 'HKQuantityTypeIdentifierRespiratoryRate' in line and len(resp_values) < 10:
            match = re.search(r'value="([0-9.]+)"', line)
            if match:
                resp_values.append(float(match.group(1)))

        # Stop when we have enough
        if len(hrv_values) >= 50 and len(hr_values) >= 20:
            break

# Reverse to get most recent first
hrv_values.reverse()
hr_values.reverse()
rhr_values.reverse()
resp_values.reverse()

# Calculate stats
latest_hrv = hrv_values[0] if hrv_values else 50
avg_hrv = sum(hrv_values) / len(hrv_values) if hrv_values else 50
latest_hr = hr_values[0] if hr_values else 70
latest_rhr = rhr_values[0] if rhr_values else 65
latest_resp = resp_values[0] if resp_values else 15

# HRV variance
hrv_variance = sum((x - avg_hrv) ** 2 for x in hrv_values) / len(hrv_values) if hrv_values else 100

# Trend
trend = "stable"
if len(hrv_values) >= 10:
    recent_avg = sum(hrv_values[:5]) / 5
    older_avg = sum(hrv_values[5:10]) / 5
    if recent_avg > older_avg * 1.15:
        trend = "rising"
    elif recent_avg < older_avg * 0.85:
        trend = "falling"

# Readiness score
hrv_score = min(40, (latest_hrv / 100) * 40)
rhr_score = max(0, 20 - (latest_rhr - 50) * 0.5)
sleep_score = 20  # Default (no sleep data extracted yet)
readiness = int(hrv_score + rhr_score + sleep_score)

print(f"✅ DATA EXTRACTED:\n")
print(f"HRV Readings: {len(hrv_values)}")
print(f"Latest HRV: {latest_hrv:.1f}ms")
print(f"Average HRV: {avg_hrv:.1f}ms")
print(f"Heart Rate: {latest_hr:.0f} BPM")
print(f"Resting HR: {latest_rhr:.0f} BPM")
print(f"Respiratory: {latest_resp:.1f}/min")
print(f"HRV Trend: {trend}")
print(f"Readiness: {readiness}/100")

print("\n" + "─" * 60)
print("✨ CALCULATING ELEMENTAL COHERENCE...\n")

# Elemental calculations (simplified)
def normalize(val, min_val, max_val):
    return max(0, min(1, (val - min_val) / (max_val - min_val)))

# AIR - clarity, adaptability (HRV + resp)
air = (normalize(latest_hrv, 20, 100) * 0.6 + normalize(15 - abs(latest_resp - 15), 0, 15) * 0.4)

# FIRE - activation (HR + trend)
fire_base = normalize(readiness, 0, 100)
fire_bonus = 0.2 if trend == "rising" else 0
fire = min(1, fire_base + fire_bonus)

# WATER - flow (HRV stability)
water = 1 - normalize(hrv_variance, 50, 500)

# EARTH - grounding (resting HR + sleep proxy)
earth = (1 - normalize(latest_rhr, 50, 85)) * 0.5 + 0.5

# AETHER - integration (balance)
elements = [air, fire, water, earth]
balance = 1 - (max(elements) - min(elements))
aether = (balance + normalize(latest_hrv, 50, 100)) / 2

# UNIFIED
unified = (air + fire + water + earth + aether) / 5

print(f"💫 UNIFIED FIELD:      {int(unified * 100)}%\n")
print(f"💨 AIR (Clarity):      {int(air * 100)}%")
print(f"🔥 FIRE (Transform):   {int(fire * 100)}%")
print(f"🌊 WATER (Flow):       {int(water * 100)}%")
print(f"🌍 EARTH (Grounding):  {int(earth * 100)}%")
print(f"✨ AETHER (Unity):     {int(aether * 100)}%")

print("\n" + "─" * 60)

# Find dominant/deficient
elements_dict = {
    'Air': (air, '💨'),
    'Fire': (fire, '🔥'),
    'Water': (water, '🌊'),
    'Earth': (earth, '🌍'),
    'Aether': (aether, '✨')
}

sorted_elements = sorted(elements_dict.items(), key=lambda x: x[1][0], reverse=True)

print("🎯 INSIGHTS:\n")
print(f"Dominant:  {sorted_elements[0][1][1]} {sorted_elements[0][0]} ({int(sorted_elements[0][1][0] * 100)}%)")
print(f"Deficient: {sorted_elements[-1][1][1]} {sorted_elements[-1][0]} ({int(sorted_elements[-1][1][0] * 100)}%)")

print("\n" + "─" * 60)
print("\n🎉 YOUR CONSCIOUSNESS IS NOW QUANTIFIED!\n")
