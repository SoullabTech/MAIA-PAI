# How to Import Your Apple Health Data into MAIA

## The Problem

Your Apple Health export is **1 GB** - too large for browsers to process! This happens when you have years of health data.

## The Solution

Use our script to extract only the HRV data from the last 6 months, creating a small file (~1-10 MB) that can be easily imported.

---

## Step-by-Step Instructions

### 1. Export Your Apple Health Data

1. Open **Health** app on your iPhone
2. Tap your **profile picture** (top right)
3. Tap **Export All Health Data**
4. Wait for export to complete (may take several minutes)
5. **AirDrop** or **email** the export.zip file to your Mac
6. **Extract** the ZIP file to get `export.xml`

### 2. Filter the Data (On Your Mac)

Open Terminal and run:

```bash
cd ~/Downloads  # Or wherever you extracted export.xml

python3 /Users/soullab/MAIA-FRESH/scripts/extract-hrv-from-apple-health.py export.xml
```

This will create `export_hrv_filtered.xml` in the same folder.

**What it does:**
- Reads your full Apple Health export
- Extracts only HRV data from the last 6 months
- Creates a much smaller file (usually 1-10 MB)
- Shows progress and statistics

**Expected output:**
```
📖 Reading export.xml...
📅 Filtering data since: 2024-04-21
🔍 Processing records...
   Processed 100,000 records... (found 245 HRV)
   Processed 200,000 records... (found 512 HRV)
✅ Processing complete!
📊 Statistics:
   Total records: 456,789
   HRV records (all time): 2,345
   HRV records (last 6 months): 1,234
💾 Writing filtered data to: export_hrv_filtered.xml
✅ Done! Created filtered file (2.34 MB)
📤 You can now upload export_hrv_filtered.xml to MAIA
```

### 3. Upload to MAIA

1. Go to http://localhost:3000/settings/biometrics
2. Click "Click to upload export.xml"
3. Select the **export_hrv_filtered.xml** file (NOT the original export.xml)
4. Wait for processing (should take 1-10 seconds)
5. Done!

---

## Troubleshooting

### "No such file or directory"
Make sure you're in the right folder:
```bash
ls -lh export.xml  # Should show the file and its size
```

### "No HRV data found"
This means you don't have HRV data in your Apple Health. HRV requires:
- Apple Watch Series 1 or later
- HRV tracking enabled
- Regular wear (Apple Watch measures HRV during sleep and rest)

Check: Health app → Browse → Heart → Heart Rate Variability

### Script runs but creates empty file
Your export might not have HRV data. Try:
```bash
# Search for HRV in the original file
grep -c "HeartRateVariability" export.xml
```

If this returns 0, you don't have HRV data.

---

## Alternative: Manual Filtering

If you're comfortable with code, you can manually filter the XML:

1. Open export.xml in a text editor that can handle large files (VS Code, Sublime)
2. Search for `HeartRateVariability`
3. Copy just those `<Record>` tags
4. Create a new file with this structure:

```xml
<?xml version="1.0"?>
<HealthData>
  <!-- Paste your HRV records here -->
  <Record type="HKQuantityTypeIdentifierHeartRateVariabilitySDNN" .../>
  <Record type="HKQuantityTypeIdentifierHeartRateVariabilitySDNN" .../>
  ...
</HealthData>
```

---

## Why Do We Need This?

MAIA uses your HRV (Heart Rate Variability) to:
- Detect your coherence level
- Suggest appropriate presence states (Dialogue/Patient/Scribe)
- Adjust the interface based on your physiological state
- Calculate your readiness score

For this to work, we only need HRV data from the last few months - we don't need years of step counts, workouts, nutrition, etc.

---

## Privacy Note

🔒 **All your health data stays on your device.**

The filtered file is stored locally in your browser's IndexedDB. It's never sent to any server unless you explicitly opt into Field contribution.

---

## Need Help?

If you're still having issues, share:
1. The output from the Python script
2. The file size of `export_hrv_filtered.xml`
3. Any error messages from the browser console
