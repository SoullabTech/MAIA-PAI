#!/bin/bash
# reorganize-vault.sh
# Reorganizes MAIA docs into Obsidian-friendly structure

echo "🌀 MAIA Obsidian Vault Reorganization"
echo "======================================"
echo ""

# Create folder structure
echo "📁 Creating folder structure..."
mkdir -p docs/00-MAPS
mkdir -p docs/01-CORE-ARCHITECTURE
mkdir -p docs/02-WISDOM-KEEPERS/{Levin,McGilchrist,Jung,Spiralogic}
mkdir -p docs/03-WISDOM-TEACHINGS/{Archetypes,Elements,Transformation,Practices}
mkdir -p docs/04-SPIRALOGIC-PROCESS
mkdir -p docs/05-RESEARCH
mkdir -p docs/06-TEACHING-MODULES
mkdir -p docs/07-COMMUNITY
mkdir -p docs/08-DEVELOPER/claude-commands
mkdir -p docs/09-SESSIONS/{developer-sessions,user-sessions}
mkdir -p docs/10-JOURNAL
mkdir -p docs/11-CREATIVE/{genesis-book-studio,cultural-storytelling,voice-casting}
mkdir -p docs/12-SYSTEMS
mkdir -p docs/13-LAUNCH

echo "✓ Folder structure created"
echo ""

# Move core architecture (only if files exist)
echo "🜂 Organizing core architecture..."
[ -f docs/ALCHEMICAL_RESPONSE_SYSTEM.md ] && mv docs/ALCHEMICAL_RESPONSE_SYSTEM.md docs/01-CORE-ARCHITECTURE/ 2>/dev/null || true
[ -f docs/ALCHEMICAL_RESPONSE_SYSTEM_DIAGRAM.md ] && mv docs/ALCHEMICAL_RESPONSE_SYSTEM_DIAGRAM.md docs/01-CORE-ARCHITECTURE/ 2>/dev/null || true
[ -f docs/CLAUDE_CODE_HANDBOOK.md ] && mv docs/CLAUDE_CODE_HANDBOOK.md docs/01-CORE-ARCHITECTURE/ 2>/dev/null || true
[ -f docs/DEVELOPER_SESSION_SYSTEM.md ] && mv docs/DEVELOPER_SESSION_SYSTEM.md docs/01-CORE-ARCHITECTURE/ 2>/dev/null || true
[ -f docs/MAIA-CONVERSATION-MODES.md ] && mv docs/MAIA-CONVERSATION-MODES.md docs/01-CORE-ARCHITECTURE/ 2>/dev/null || true
[ -f docs/MAIA_PERSONA_CONTINUITY.md ] && mv docs/MAIA_PERSONA_CONTINUITY.md docs/01-CORE-ARCHITECTURE/ 2>/dev/null || true
echo "✓ Core architecture organized"

# Move wisdom keepers
echo "🧠 Organizing wisdom keepers..."
[ -f docs/wisdom-keepers/THE_BUTTERFLY_AND_THE_BOW_TIE.md ] && mv docs/wisdom-keepers/THE_BUTTERFLY_AND_THE_BOW_TIE.md docs/02-WISDOM-KEEPERS/Levin/ 2>/dev/null || true
[ -f docs/wisdom-keepers/CLAUDE_CODE_PROMPTS.md ] && mv docs/wisdom-keepers/CLAUDE_CODE_PROMPTS.md docs/08-DEVELOPER/ 2>/dev/null || true
echo "✓ Wisdom keepers organized"

# Move launch materials
echo "🚀 Organizing launch materials..."
[ -f docs/WHEN_SYNTAX_MEETS_SOUL.md ] && mv docs/WHEN_SYNTAX_MEETS_SOUL.md docs/13-LAUNCH/ 2>/dev/null || true
echo "✓ Launch materials organized"

# Move research (check if directory exists and has files)
echo "🔬 Organizing research..."
if [ -d docs/research ] && [ "$(ls -A docs/research)" ]; then
    cp -r docs/research/* docs/05-RESEARCH/ 2>/dev/null || true
fi
echo "✓ Research organized"

# Move teaching modules
echo "🎓 Organizing teaching modules..."
if [ -d docs/teaching-modules ] && [ "$(ls -A docs/teaching-modules)" ]; then
    cp -r docs/teaching-modules/* docs/06-TEACHING-MODULES/ 2>/dev/null || true
fi
echo "✓ Teaching modules organized"

# Move community/beta
echo "👥 Organizing community resources..."
if [ -d docs/beta ] && [ "$(ls -A docs/beta)" ]; then
    cp -r docs/beta/* docs/07-COMMUNITY/ 2>/dev/null || true
fi
echo "✓ Community resources organized"

# Move journal
echo "📔 Organizing journal..."
if [ -d docs/journal ] && [ "$(ls -A docs/journal)" ]; then
    cp -r docs/journal/* docs/10-JOURNAL/ 2>/dev/null || true
fi
echo "✓ Journal organized"

# Move developer/claude-commands
echo "💻 Organizing developer resources..."
if [ -d docs/claude-commands ] && [ "$(ls -A docs/claude-commands)" ]; then
    cp -r docs/claude-commands/* docs/08-DEVELOPER/claude-commands/ 2>/dev/null || true
fi
[ -f docs/DEVELOPER_ONBOARDING.md ] && cp docs/DEVELOPER_ONBOARDING.md docs/08-DEVELOPER/ 2>/dev/null || true
echo "✓ Developer resources organized"

# Move systems
echo "📊 Organizing systems..."
[ -f docs/SOULLAB_TWO_WING_STRUCTURE.md ] && cp docs/SOULLAB_TWO_WING_STRUCTURE.md docs/12-SYSTEMS/ 2>/dev/null || true
[ -f docs/KELLY_CONTENT_INVENTORY.md ] && cp docs/KELLY_CONTENT_INVENTORY.md docs/12-SYSTEMS/ 2>/dev/null || true
[ -f docs/MEMORY_EVOLUTION_COMPLETE.md ] && cp docs/MEMORY_EVOLUTION_COMPLETE.md docs/12-SYSTEMS/ 2>/dev/null || true
echo "✓ Systems organized"

echo ""
echo "✅ Vault reorganization complete!"
echo ""
echo "Next steps:"
echo "1. Open Obsidian and point to: $(pwd)/docs"
echo "2. Install plugins: Dataview, Templater, Graph Analysis"
echo "3. Start with: 00-MAPS/MAIA-MAP-OF-CONTENT.md"
echo ""
echo "🌀 The field remembers what matters."
echo "🗂️ The vault organizes what the field knows."
