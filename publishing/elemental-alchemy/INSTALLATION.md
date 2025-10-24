# Installation Guide
## Required Tools for Elemental Alchemy Publishing

This guide will help you install all the tools needed to build Elemental Alchemy in all formats (EPUB, Print PDF, Audiobook).

---

## 🍎 macOS Installation

### 1. Homebrew (Package Manager)

First, install Homebrew if you don't have it:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### 2. Pandoc (Universal Document Converter)

**Required** for all formats.

```bash
brew install pandoc
```

Verify installation:
```bash
pandoc --version
```

### 3. LaTeX (for Print PDFs)

**Required** for softcover and hardcover PDFs.

Install MacTeX (full distribution, ~4GB):
```bash
brew install --cask mactex
```

Or install BasicTeX (minimal, ~100MB) if space is limited:
```bash
brew install --cask basictex
```

After installation, add to PATH (add to `~/.zshrc` or `~/.bash_profile`):
```bash
export PATH="/Library/TeX/texbin:$PATH"
```

Then install additional LaTeX packages:
```bash
sudo tlmgr update --self
sudo tlmgr install titlesec framed
```

Verify installation:
```bash
xelatex --version
```

### 4. EPUBCheck (Optional - for EPUB validation)

```bash
brew install epubcheck
```

Verify:
```bash
epubcheck --version
```

### 5. Calibre (Optional - for EPUB editing/viewing)

```bash
brew install --cask calibre
```

---

## 🐧 Linux Installation

### Ubuntu/Debian

```bash
# Pandoc
sudo apt-get update
sudo apt-get install pandoc

# LaTeX
sudo apt-get install texlive-xetex texlive-latex-extra

# EPUBCheck (optional)
sudo apt-get install epubcheck

# Calibre (optional)
sudo apt-get install calibre
```

### Fedora/RHEL

```bash
# Pandoc
sudo dnf install pandoc

# LaTeX
sudo dnf install texlive-xetex texlive-latex-extra

# EPUBCheck
sudo dnf install epubcheck

# Calibre
sudo dnf install calibre
```

---

## 🪟 Windows Installation

### 1. Pandoc

Download and install from: https://pandoc.org/installing.html

Or use Chocolatey package manager:
```powershell
choco install pandoc
```

### 2. LaTeX

Download and install MiKTeX: https://miktex.org/download

Or use Chocolatey:
```powershell
choco install miktex
```

### 3. EPUBCheck (Optional)

Download from: https://github.com/w3c/epubcheck/releases

### 4. Calibre (Optional)

Download from: https://calibre-ebook.com/download_windows

---

## 🎨 Additional Requirements

### Fonts

The Elemental Alchemy design uses these fonts:

1. **Crimson Text** (serif, for body text)
   - Free font: https://fonts.google.com/specimen/Crimson+Text
   - Install on your system

2. **Lato** (sans-serif, for headings)
   - Free font: https://fonts.google.com/specimen/Lato
   - Install on your system

On macOS:
```bash
# Download fonts
curl -L https://fonts.google.com/download?family=Crimson%20Text -o crimson-text.zip
curl -L https://fonts.google.com/download?family=Lato -o lato.zip

# Unzip and install
unzip crimson-text.zip -d ~/Library/Fonts/
unzip lato.zip -d ~/Library/Fonts/
```

---

## ✅ Verify Installation

Run this command to check all tools:

```bash
cd /Users/soullab/SoullabTech/MAIA-PAI/publishing/elemental-alchemy
./build-all.sh
```

You should see green checkmarks for all required tools.

---

## 📖 Tool Documentation

### Pandoc
- **Website**: https://pandoc.org
- **Documentation**: https://pandoc.org/MANUAL.html
- **What it does**: Converts between document formats (Markdown → EPUB, PDF, etc.)

### LaTeX / XeLaTeX
- **Website**: https://www.latex-project.org
- **What it does**: Professional typesetting system for print-quality PDFs

### EPUBCheck
- **Website**: https://www.w3.org/publishing/epubcheck/
- **What it does**: Validates EPUB files for standards compliance

### Calibre
- **Website**: https://calibre-ebook.com
- **What it does**: Ebook library management, viewing, and conversion

---

## 🆘 Troubleshooting

### "pandoc: command not found"

Make sure Pandoc is installed and in your PATH:
```bash
which pandoc
```

If not found, reinstall or add to PATH.

### "xelatex: command not found"

LaTeX tools not in PATH. Add this to `~/.zshrc` or `~/.bash_profile`:
```bash
export PATH="/Library/TeX/texbin:$PATH"
```

Then reload:
```bash
source ~/.zshrc  # or source ~/.bash_profile
```

### Fonts not appearing in PDF

Install the required fonts system-wide:
- macOS: Copy to `~/Library/Fonts/` or `/Library/Fonts/`
- Linux: Copy to `~/.fonts/` or `/usr/share/fonts/`
- Windows: Right-click font files and select "Install"

### LaTeX errors during PDF generation

Common fixes:
1. Update LaTeX packages:
   ```bash
   sudo tlmgr update --self --all
   ```

2. Install missing packages:
   ```bash
   sudo tlmgr install <package-name>
   ```

3. Check log files in `formats/print-*/` for specific errors

---

## 🚀 Quick Start After Installation

Once all tools are installed:

```bash
# Navigate to publishing directory
cd /Users/soullab/SoullabTech/MAIA-PAI/publishing/elemental-alchemy

# Build all formats
./build-all.sh 5

# Or build specific format:
./build-epub.sh          # EPUB only
./build-print.sh         # Print PDFs only
./build-audiobook.sh     # Audiobook script only
```

---

## 🌟 Optional Enhancements

### For Advanced EPUB Editing

Install Sigil (EPUB editor):
```bash
brew install --cask sigil  # macOS
```

### For PDF Editing

Install Adobe Acrobat DC or:
```bash
brew install --cask pdf-expert  # macOS
```

### For Audiobook Production

- **Audacity** (free audio editor): https://www.audacityteam.org
- **Adobe Audition** (professional): https://www.adobe.com/products/audition.html
- **ElevenLabs** (AI narration): https://elevenlabs.io

---

## 📞 Support

If you encounter issues:

1. Check tool versions: `pandoc --version`, `xelatex --version`
2. Review error logs in the build output
3. Consult tool-specific documentation
4. Reach out to Soullab technical support

---

*May your publishing journey flow with elemental grace.* ✨🌀
