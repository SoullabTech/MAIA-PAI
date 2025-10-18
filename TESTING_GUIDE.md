# 🧪 Astrology System Testing Guide

## Quick Test Checklist

### 1. Test Birth Location Geocoding

**Navigate to:** Your astrology/birth chart page (wherever BirthDataForm is rendered)

**Test steps:**
1. Start typing "San Francisco" in the location field
2. ✅ Should see "Searching locations..." appear
3. ✅ Dropdown should appear with ~8 results
4. ✅ Each result shows: City, State, Country + Lat/Lng
5. Click on a result
6. ✅ Green checkmark appears: "✓ Selected: San Francisco..."
7. ✅ Timezone info appears: "Timezone: America/Los_Angeles (UTC-8)"

**Test multiple cities:**
- "New York" → Should show NYC results + `America/New_York (UTC-5)`
- "London" → Should show UK results + `Europe/London (UTC+0)`
- "Tokyo" → Should show Japan results + `Asia/Tokyo (UTC+9)`
- "Sydney" → Should show Australia results + `Australia/Sydney (UTC+11)`

**Edge cases:**
- Type just "S" → Nothing should appear (needs 2+ chars)
- Type "asdfasdf" → Should show "No results found" or empty dropdown

---

### 2. Test Birth Chart Calculation

**After selecting location + date + time:**
1. Click "Calculate My Birth Chart"
2. ✅ Button shows loading spinner
3. ✅ API call succeeds (check browser console)
4. ✅ Sacred House Wheel renders
5. ✅ Planets appear as constellation points

**Check the data:**
Open browser console and look for:
```
Calculating precise birth chart for: { date: '1990-05-15', time: '14:30', location: {...} }
```

Should return chart data with:
- All planets (Sun → Pluto + Chiron + Nodes)
- House positions (1-12)
- Aspects array

---

### 3. Test Sacred House Wheel Visuals

**What to look for:**

#### Center Point (Aether):
- ✅ White/golden glow at center
- ✅ Slow pulse (12-second cycle)
- ✅ Subtle breathing effect

#### House Segments:
- ✅ 12 colored segments (Fire/Water/Earth/Air colors)
- ✅ Each segment subtly breathing (different speeds)
- ✅ Fire segments breathe faster (~6s)
- ✅ Water slower (~8s)
- ✅ Earth slowest (~10s)
- ✅ Air medium (~7s)

#### Labels:
- ✅ Small house numbers inside ring (1-12)
- ✅ Phase labels visible: "Fire 1", "Water 2", etc.
- ✅ Labels are subtle (low opacity when not hovered)

#### Hover States:
**Hover over a house segment slowly** (like Fire 1):

1. ✅ Segment glows brighter
2. ✅ Overlay box appears below wheel
3. ✅ Text reveals in **layers** (slow, contemplative):
   - Title appears first
   - Mythic line fades in
   - Description follows
   - Invitation arrives last
4. ✅ Total reveal time: ~1.5 seconds (feels generous, not rushed)

**Read the text** — should be **mythic, not clinical**:
- ✅ "Vector of Fire — where the inner sun remembers itself through vision"
- ❌ NOT: "Right prefrontal cortex initiating vision projection"

---

### 4. Test Planet Hover

**If planets are rendered:**
1. Hover over a planet point
2. ✅ Planet glows
3. ✅ Overlay shows planet name + sign + house
4. ✅ Archetypal description appears

Example for Sun:
```
Sun in Taurus
House 2 · 24.3°

Your conscious identity, life force, and creative essence.
Where you shine and express your unique being.
```

---

### 5. Test Aspect Geometry (Optional)

**If aspects are enabled:**
1. Hover over the wheel
2. ✅ Sacred geometry lines appear between planets
3. ✅ Different colors for different aspects:
   - Conjunction: Amber
   - Sextile: Green
   - Square: Red (dashed)
   - Trine: Blue
   - Opposition: Purple (long dashed)

---

## Browser Console Checks

### Expected Logs:

**Geocoding:**
```
[Geocoding] Searching for: San Francisco
[Geocoding] Nominatim returned 8 results
[Timezone] Detecting timezone for coordinates: 37.7749, -122.4194
[Timezone] GeoNames result: { timezone: 'America/Los_Angeles', utcOffset: -8 }
```

**Chart Calculation:**
```
Calculating precise birth chart for: {...}
✓ Consciousness Lattice active
Birth chart calculation complete
```

### Expected Network Calls:

1. `GET /api/astrology/geocode?q=San+Francisco`
   - Status: 200
   - Response: `{ success: true, data: [...], provider: 'nominatim' }`

2. `POST /api/astrology/birth-chart`
   - Status: 200
   - Response: `{ success: true, data: { sun: {...}, moon: {...}, ... } }`

---

## Common Issues & Fixes

### Issue: Location search returns nothing
**Cause:** Nominatim API might be rate-limited or blocked
**Fix:** Check console for errors. The API should auto-fallback to maps.co
**Test:** Try a different city name

### Issue: Timezone shows as "UTC" instead of actual timezone
**Cause:** GeoNames/TimeZoneDB APIs might be down
**Fix:** The system falls back to longitude-based estimation (less accurate but works)
**Note:** This is expected behavior when geocoding services are unavailable

### Issue: Wheel doesn't render
**Cause:** Chart data might be malformed
**Fix:** Check browser console for errors in ephemerisCalculator.ts
**Debug:** Log the chart data before passing to SacredHouseWheel

### Issue: Hover animation feels too fast/slow
**Fix:** Adjust timing in SacredHouseWheel.tsx:
```typescript
transition={{ duration: 0.7 }} // Increase for slower, decrease for faster
```

### Issue: House labels overlap
**Fix:** Adjust radius in label positioning:
```typescript
x={200 + 120 * Math.cos(...)} // Increase 120 to move outward
```

---

## Performance Notes

- Geocoding API calls are debounced (only fires after you stop typing)
- Timezone detection only happens for the first result (to save API calls)
- Wheel animations use Framer Motion (GPU-accelerated, smooth)
- Birth chart calculation happens server-side (no client-side lag)

---

## Example Test Data

Use these to test chart calculation:

### Test Person 1: Steve Jobs
- Date: `1955-02-24`
- Time: `19:15`
- Location: San Francisco, CA
- Expected: Sun in Pisces, multiple planets in early signs

### Test Person 2: Maya Angelou
- Date: `1928-04-04`
- Time: `14:10`
- Location: St. Louis, MO
- Expected: Sun in Aries, strong Fire placements

### Test Person 3: Carl Jung
- Date: `1875-07-26`
- Time: `19:20`
- Location: Kesswil, Switzerland
- Expected: Sun in Leo, psychological depth

---

## Visual Checklist

**The wheel should feel:**
- [ ] **Slow** — generous timing, not rushed
- [ ] **Breathing** — subtle alive quality
- [ ] **Sacred** — reverent, contemplative
- [ ] **Mythic** — evocative language, not clinical
- [ ] **Centered** — Aether pulse draws eye to stillness

**The text should feel:**
- [ ] **Engraved** — not painted on, arrives with weight
- [ ] **Layered** — reveals in stages, invites patience
- [ ] **Poetic** — imagery over explanation
- [ ] **Invitational** — suggests rather than commands

---

## Success Criteria

✅ **You'll know it's working when:**
1. You type a city name and locations appear instantly
2. Selecting a location auto-detects the correct timezone
3. The wheel renders with a breathing, alive quality
4. Hovering feels contemplative — text arrives slowly, deliberately
5. The language evokes felt experience, not brain anatomy
6. You find yourself slowing down to read it

✅ **Lynch test passed when:**
- You naturally pause before hovering
- The reveal timing makes you notice the beauty
- You read the mythic lines twice because they land differently

---

## Next Steps After Testing

If everything works:
1. ✅ Integration complete!
2. Consider adding to MAIA's interpretation engine
3. Consider adding user journey flows (Fire → Water → Earth → Air → Aether)
4. Consider adding birth chart storage to user profile

If something breaks:
1. Check browser console for errors
2. Check network tab for failed API calls
3. Reference files in ASTROLOGY_INTEGRATION_COMPLETE.md
4. Check this guide's "Common Issues & Fixes" section

---

🜂 Happy testing! Watch it breathe. 🌀✨
