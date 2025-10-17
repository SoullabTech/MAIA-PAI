#!/bin/bash

# Soullab Inside White Paper - PDF Generation Script
# Requires: pandoc, wkhtmltopdf or prince

echo "🌀 Generating Soullab Inside White Paper PDF..."

# Check if pandoc is installed
if ! command -v pandoc &> /dev/null; then
    echo "❌ Error: pandoc is not installed"
    echo "Install with: brew install pandoc"
    exit 1
fi

# Input and output files
INPUT_FILE="Soullab_Inside_White_Paper_Loralee_Crowder.md"
OUTPUT_FILE="Soullab_Inside_White_Paper_Loralee_Crowder_v1.pdf"
CSS_FILE="white-paper-style.css"

# Generate PDF using pandoc with CSS styling
echo "📄 Converting markdown to PDF..."

pandoc "$INPUT_FILE" \
    -o "$OUTPUT_FILE" \
    --pdf-engine=wkhtmltopdf \
    --css="$CSS_FILE" \
    --metadata title="Soullab Inside: Technology That Listens" \
    --metadata author="Soullab Foundation" \
    --metadata keywords="soullab inside, regenerative technology, wisdom infrastructure" \
    --metadata date="October 2025" \
    --toc \
    --toc-depth=2 \
    --number-sections \
    --standalone \
    --variable papersize=letter \
    --variable geometry:margin=1in \
    --variable fontsize=11pt \
    --variable linkcolor=gold \
    --variable urlcolor=gold

if [ $? -eq 0 ]; then
    echo "✅ PDF generated successfully: $OUTPUT_FILE"
    echo ""
    echo "📊 File size: $(du -h "$OUTPUT_FILE" | cut -f1)"
    echo "📍 Location: $(pwd)/$OUTPUT_FILE"
    echo ""
    echo "🔍 Opening PDF for preview..."
    open "$OUTPUT_FILE"
else
    echo "❌ Error generating PDF"
    echo ""
    echo "💡 Alternative: Try using Prince XML or weasyprint"
    echo "   brew install prince"
    echo "   prince $INPUT_FILE -s $CSS_FILE -o $OUTPUT_FILE"
    exit 1
fi

echo ""
echo "🌀 White paper ready for Loralee's listening session"
echo "   The first fire is ready to light."
