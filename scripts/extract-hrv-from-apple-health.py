#!/usr/bin/env python3
"""
Extract HRV data from large Apple Health export

This script reads a large Apple Health export.xml file and extracts only
the HRV (Heart Rate Variability) data from the last 6 months, creating a
much smaller XML file that can be imported into MAIA.

Usage:
    python3 extract-hrv-from-apple-health.py /path/to/export.xml

Output:
    Creates export_hrv_filtered.xml in the same directory
"""

import sys
import xml.etree.ElementTree as ET
from datetime import datetime, timedelta
import os

def extract_hrv_data(input_file, months=6):
    """Extract HRV data from the last N months"""

    print(f"📖 Reading {input_file}...")
    print(f"⏳ This may take a minute for large files...")

    # Calculate cutoff date (N months ago)
    cutoff_date = datetime.now() - timedelta(days=months * 30)
    print(f"📅 Filtering data since: {cutoff_date.strftime('%Y-%m-%d')}")

    # Parse XML incrementally to handle large files
    context = ET.iterparse(input_file, events=('start', 'end'))
    _, root = next(context)  # Get root element

    # Create new XML structure
    new_root = ET.Element('HealthData', root.attrib)

    # Track statistics
    total_records = 0
    hrv_records = 0
    filtered_hrv = 0

    print("🔍 Processing records...")

    for event, elem in context:
        if event == 'end' and elem.tag == 'Record':
            total_records += 1

            # Progress indicator
            if total_records % 100000 == 0:
                print(f"   Processed {total_records:,} records... (found {filtered_hrv} HRV)")

            record_type = elem.get('type', '')

            # Check if it's HRV data
            if 'HeartRateVariability' in record_type:
                hrv_records += 1

                # Check date
                start_date_str = elem.get('startDate', '')
                if start_date_str:
                    try:
                        # Parse Apple Health date format: "2025-01-15 08:30:00 -0800"
                        start_date = datetime.strptime(start_date_str.split(' -')[0], '%Y-%m-%d %H:%M:%S')

                        # Only keep recent data
                        if start_date >= cutoff_date:
                            # Create a copy of the element with all attributes
                            new_elem = ET.Element('Record', elem.attrib)
                            # Copy any child elements (MetadataEntry, etc.)
                            for child in elem:
                                new_elem.append(child)
                            new_root.append(new_elem)
                            filtered_hrv += 1
                    except ValueError:
                        pass  # Skip malformed dates

            # Clear element to free memory (after copying if needed)
            elem.clear()
            root.clear()

    print(f"\n✅ Processing complete!")
    print(f"📊 Statistics:")
    print(f"   Total records: {total_records:,}")
    print(f"   HRV records (all time): {hrv_records:,}")
    print(f"   HRV records (last {months} months): {filtered_hrv:,}")

    if filtered_hrv == 0:
        print("\n⚠️  No HRV data found in the last 6 months.")
        print("   This usually means:")
        print("   - You don't have an Apple Watch")
        print("   - Your Apple Watch doesn't track HRV")
        print("   - HRV tracking is disabled")
        return None

    # Create output file
    output_file = os.path.join(
        os.path.dirname(input_file),
        'export_hrv_filtered.xml'
    )

    print(f"\n💾 Writing filtered data to: {output_file}")

    # Write XML with declaration
    tree = ET.ElementTree(new_root)
    ET.indent(tree, space='  ')  # Pretty print (Python 3.9+)
    tree.write(output_file, encoding='UTF-8', xml_declaration=True)

    # Get file size
    output_size = os.path.getsize(output_file)
    output_size_mb = output_size / (1024 * 1024)

    print(f"✅ Done! Created filtered file ({output_size_mb:.2f} MB)")
    print(f"\n📤 You can now upload {output_file} to MAIA")

    return output_file

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python3 extract-hrv-from-apple-health.py /path/to/export.xml")
        print("\nThis script extracts only HRV data from the last 6 months,")
        print("creating a much smaller file that can be imported into MAIA.")
        sys.exit(1)

    input_file = sys.argv[1]

    if not os.path.exists(input_file):
        print(f"❌ File not found: {input_file}")
        sys.exit(1)

    # Get input file size
    input_size = os.path.getsize(input_file)
    input_size_mb = input_size / (1024 * 1024)
    print(f"📁 Input file size: {input_size_mb:.2f} MB")

    try:
        extract_hrv_data(input_file, months=6)
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
