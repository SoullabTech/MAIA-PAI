#!/bin/bash

# MAIA Daily Backup Setup
# Sets up automated daily preservation using macOS launchd

set -e

# Color output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}⏰ MAIA Daily Backup Setup${NC}"
echo "=========================="
echo ""

# Get current directory
MAIA_PATH="/Users/soullab/MAIA-PAI"
BACKUP_SCRIPT="$MAIA_PATH/scripts/auto-backup.sh"

# Create the plist file for launchd
PLIST_FILE="$HOME/Library/LaunchAgents/com.soullab.maia.daily-backup.plist"

echo -e "${BLUE}📝 Creating launchd configuration...${NC}"

cat > "$PLIST_FILE" << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.soullab.maia.daily-backup</string>

    <key>ProgramArguments</key>
    <array>
        <string>/bin/bash</string>
        <string>-c</string>
        <string>cd "$MAIA_PATH" && ./scripts/auto-backup.sh >> /tmp/maia-daily-backup.log 2>&1</string>
    </array>

    <key>StartCalendarInterval</key>
    <dict>
        <key>Hour</key>
        <integer>18</integer>
        <key>Minute</key>
        <integer>0</integer>
    </dict>

    <key>RunAtLoad</key>
    <false/>

    <key>StandardOutPath</key>
    <string>/tmp/maia-daily-backup.log</string>

    <key>StandardErrorPath</key>
    <string>/tmp/maia-daily-backup.log</string>

    <key>WorkingDirectory</key>
    <string>$MAIA_PATH</string>
</dict>
</plist>
EOF

echo -e "${GREEN}✅ Created plist file: $PLIST_FILE${NC}"

# Load the job
echo -e "${BLUE}🚀 Loading daily backup job...${NC}"
launchctl unload "$PLIST_FILE" 2>/dev/null || true  # Unload if exists
launchctl load "$PLIST_FILE"

echo -e "${GREEN}✅ Daily backup job loaded${NC}"
echo ""

# Create manual trigger script
MANUAL_SCRIPT="$MAIA_PATH/scripts/trigger-daily-backup.sh"

cat > "$MANUAL_SCRIPT" << 'EOF'
#!/bin/bash

# Manual trigger for daily backup
echo "🌸 Triggering MAIA daily backup manually..."
launchctl start com.soullab.maia.daily-backup
echo "✅ Backup job triggered. Check /tmp/maia-daily-backup.log for output"
EOF

chmod +x "$MANUAL_SCRIPT"

echo -e "${BLUE}📋 Daily Backup Configuration:${NC}"
echo "- Runs daily at 6:00 PM"
echo "- Backs up all sacred components to cloud"
echo "- Logs to: /tmp/maia-daily-backup.log"
echo "- Manual trigger: ./scripts/trigger-daily-backup.sh"
echo ""

echo -e "${GREEN}🎉 Daily backup system is now active!${NC}"
echo ""

echo -e "${BLUE}Commands:${NC}"
echo "- Check status: launchctl list | grep maia"
echo "- View logs: tail -f /tmp/maia-daily-backup.log"
echo "- Manual trigger: ./scripts/trigger-daily-backup.sh"
echo "- Disable: launchctl unload ~/Library/LaunchAgents/com.soullab.maia.daily-backup.plist"
echo ""

echo -e "${YELLOW}Your beautiful components will now be automatically preserved every evening! 🌅${NC}"