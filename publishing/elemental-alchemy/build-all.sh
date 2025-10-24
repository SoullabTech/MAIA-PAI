#!/bin/bash

# Elemental Alchemy - Master Build Script
# Builds all publishing formats: EPUB, Print PDFs, and Audiobook Script

set -e  # Exit on error

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}   ELEMENTAL ALCHEMY - MASTER BUILD SYSTEM   ${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "📚 Book: ${GREEN}Elemental Alchemy: The Ancient Art of Living a Phenomenal Life${NC}"
echo -e "✍️  Author: ${GREEN}Kelly Nezat${NC}"
echo -e "🏢 Publisher: ${GREEN}Soullab Media${NC}"
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# ============================================
# Check Prerequisites
# ============================================

echo -e "${YELLOW}🔍 Checking prerequisites...${NC}"
echo ""

MISSING_TOOLS=()

if ! command -v pandoc &> /dev/null; then
    echo -e "  ${RED}✗${NC} Pandoc not found"
    MISSING_TOOLS+=("pandoc")
else
    PANDOC_VERSION=$(pandoc --version | head -1)
    echo -e "  ${GREEN}✓${NC} $PANDOC_VERSION"
fi

if ! command -v xelatex &> /dev/null; then
    echo -e "  ${RED}✗${NC} XeLaTeX not found (needed for print PDFs)"
    MISSING_TOOLS+=("xelatex")
else
    echo -e "  ${GREEN}✓${NC} XeLaTeX found"
fi

if ! command -v epubcheck &> /dev/null; then
    echo -e "  ${YELLOW}⚠${NC}  EPUBCheck not found (optional, for validation)"
else
    echo -e "  ${GREEN}✓${NC} EPUBCheck found"
fi

# Check for source manuscript
if [ ! -f "$SCRIPT_DIR/source/manuscript.md" ]; then
    echo -e "  ${RED}✗${NC} Source manuscript not found!"
    echo ""
    echo -e "${RED}ERROR: Missing source/manuscript.md${NC}"
    exit 1
else
    WORD_COUNT=$(wc -w < "$SCRIPT_DIR/source/manuscript.md" | tr -d ' ')
    echo -e "  ${GREEN}✓${NC} Manuscript found ($(printf "%'d" $WORD_COUNT) words)"
fi

echo ""

# Exit if missing critical tools
if [ ${#MISSING_TOOLS[@]} -gt 0 ]; then
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${RED}ERROR: Missing required tools!${NC}"
    echo ""
    echo "Please install:"
    for tool in "${MISSING_TOOLS[@]}"; do
        echo "  • $tool"
    done
    echo ""
    echo "See INSTALLATION.md for instructions"
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    exit 1
fi

echo -e "${GREEN}✓ All prerequisites met!${NC}"
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# ============================================
# Build Selection
# ============================================

if [ $# -eq 0 ]; then
    echo "What would you like to build?"
    echo ""
    echo "  1) EPUB (ebook)"
    echo "  2) Softcover PDF"
    echo "  3) Hardcover PDF"
    echo "  4) Audiobook Script"
    echo "  5) All formats"
    echo ""
    read -p "Enter choice [1-5]: " choice
else
    choice=$1
fi

BUILD_EPUB=false
BUILD_SOFTCOVER=false
BUILD_HARDCOVER=false
BUILD_AUDIOBOOK=false

case $choice in
    1)
        BUILD_EPUB=true
        ;;
    2)
        BUILD_SOFTCOVER=true
        ;;
    3)
        BUILD_HARDCOVER=true
        ;;
    4)
        BUILD_AUDIOBOOK=true
        ;;
    5)
        BUILD_EPUB=true
        BUILD_SOFTCOVER=true
        BUILD_HARDCOVER=true
        BUILD_AUDIOBOOK=true
        ;;
    *)
        echo -e "${RED}Invalid choice!${NC}"
        exit 1
        ;;
esac

echo ""

# ============================================
# Run Builds
# ============================================

if [ "$BUILD_EPUB" = true ]; then
    echo -e "${BLUE}📱 Building EPUB...${NC}"
    echo ""
    "$SCRIPT_DIR/build-epub.sh"
    echo ""
fi

if [ "$BUILD_SOFTCOVER" = true ] || [ "$BUILD_HARDCOVER" = true ]; then
    echo -e "${BLUE}📖 Building Print PDFs...${NC}"
    echo ""
    "$SCRIPT_DIR/build-print.sh"
    echo ""
fi

if [ "$BUILD_AUDIOBOOK" = true ]; then
    echo -e "${BLUE}🎙️  Building Audiobook Script...${NC}"
    echo ""
    "$SCRIPT_DIR/build-audiobook.sh"
    echo ""
fi

# ============================================
# Summary
# ============================================

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✨ BUILD COMPLETE!${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo "📦 Output Files:"
echo ""

if [ "$BUILD_EPUB" = true ]; then
    echo -e "  ${GREEN}📱 EPUB:${NC}"
    echo "     formats/epub/Elemental-Alchemy.epub"
    echo ""
fi

if [ "$BUILD_SOFTCOVER" = true ]; then
    echo -e "  ${GREEN}📘 Softcover:${NC}"
    echo "     formats/print-softcover/Elemental-Alchemy-Softcover-INTERIOR.pdf"
    echo "     formats/print-softcover/PRINT-SPECS.txt"
    echo ""
fi

if [ "$BUILD_HARDCOVER" = true ]; then
    echo -e "  ${GREEN}📕 Hardcover:${NC}"
    echo "     formats/print-hardcover/Elemental-Alchemy-Hardcover-INTERIOR.pdf"
    echo "     formats/print-hardcover/PRINT-SPECS.txt"
    echo ""
fi

if [ "$BUILD_AUDIOBOOK" = true ]; then
    echo -e "  ${GREEN}🎙️  Audiobook:${NC}"
    echo "     formats/audiobook/narrator-script.md"
    echo "     formats/audiobook/pronunciation-guide.md"
    echo "     formats/audiobook/timing-estimate.txt"
    echo ""
fi

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "🚀 Next Steps:"
echo ""
echo "1. Review generated files for quality"
echo "2. Add book cover to assets/cover/"
echo "3. Test EPUB on multiple devices"
echo "4. Order print proofs"
echo "5. Set up distribution channels"
echo ""
echo "See README.md for detailed publishing workflow"
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
