#!/bin/bash

# MAIA Component Verification System
# Ensures sacred components remain blessed and functional

set -e

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

echo -e "${BLUE}🌸 MAIA Component Verification System${NC}"
echo "============================================"
echo ""

# Load component registry
REGISTRY_FILE="shared-components/component-registry.json"

if [ ! -f "$REGISTRY_FILE" ]; then
    echo -e "${RED}❌ Component registry not found: $REGISTRY_FILE${NC}"
    exit 1
fi

# Function to check if component file exists
check_component_exists() {
    local component_name="$1"
    local component_path="$2"

    if [ -f "$component_path" ]; then
        echo -e "${GREEN}✅ $component_name exists${NC}"
        return 0
    else
        echo -e "${RED}❌ $component_name missing: $component_path${NC}"
        return 1
    fi
}

# Function to check component syntax
check_component_syntax() {
    local component_name="$1"
    local component_path="$2"

    # Use TypeScript compiler to check syntax
    if npx tsc --noEmit "$component_path" 2>/dev/null; then
        echo -e "${GREEN}✅ $component_name syntax valid${NC}"
        return 0
    else
        echo -e "${YELLOW}⚠️  $component_name has syntax warnings${NC}"
        return 1
    fi
}

# Function to check component imports
check_component_imports() {
    local component_name="$1"
    local component_path="$2"

    # Check if component can be imported without errors
    local temp_test_file="/tmp/test_${component_name}.tsx"

    cat > "$temp_test_file" << EOF
import React from 'react';
import { ${component_name} } from './${component_path}';

// Test component instantiation
const TestComponent = () => <${component_name} />;
EOF

    if npx tsc --noEmit "$temp_test_file" 2>/dev/null; then
        echo -e "${GREEN}✅ $component_name imports successfully${NC}"
        rm -f "$temp_test_file"
        return 0
    else
        echo -e "${YELLOW}⚠️  $component_name import issues detected${NC}"
        rm -f "$temp_test_file"
        return 1
    fi
}

# Function to check git status of component
check_component_git_status() {
    local component_name="$1"
    local component_path="$2"

    if git ls-files --error-unmatch "$component_path" > /dev/null 2>&1; then
        if git diff --quiet "$component_path"; then
            echo -e "${GREEN}✅ $component_name is committed and clean${NC}"
            return 0
        else
            echo -e "${YELLOW}⚠️  $component_name has uncommitted changes${NC}"
            return 1
        fi
    else
        echo -e "${RED}❌ $component_name not tracked in git${NC}"
        return 1
    fi
}

# Main verification loop
echo -e "${PURPLE}📋 Reading component registry...${NC}"
echo ""

# Extract component names and paths from JSON (simple parsing)
components=$(grep -o '"[^"]*": {' "$REGISTRY_FILE" | grep -v '"registry"' | grep -v '"metadata"' | sed 's/": {//g' | sed 's/"//g')

total_components=0
blessed_count=0
issues_found=0

while IFS= read -r component_name; do
    if [ -n "$component_name" ]; then
        total_components=$((total_components + 1))

        echo -e "${BLUE}🔍 Verifying: $component_name${NC}"

        # Extract component path from JSON (simplified)
        component_path=$(grep -A 10 "\"$component_name\":" "$REGISTRY_FILE" | grep '"path"' | sed 's/.*"path": "\([^"]*\)".*/\1/')
        component_status=$(grep -A 10 "\"$component_name\":" "$REGISTRY_FILE" | grep '"status"' | sed 's/.*"status": "\([^"]*\)".*/\1/')

        # Check if component exists
        if ! check_component_exists "$component_name" "$component_path"; then
            issues_found=$((issues_found + 1))
            continue
        fi

        # Check syntax
        if ! check_component_syntax "$component_name" "$component_path"; then
            issues_found=$((issues_found + 1))
        fi

        # Check git status
        if ! check_component_git_status "$component_name" "$component_path"; then
            issues_found=$((issues_found + 1))
        fi

        # Count blessed components
        if [ "$component_status" = "BLESSED" ]; then
            blessed_count=$((blessed_count + 1))
            echo -e "${PURPLE}✨ $component_name is BLESSED${NC}"
        fi

        echo ""
    fi
done <<< "$components"

# Summary report
echo -e "${BLUE}📊 Verification Summary${NC}"
echo "======================="
echo -e "Total Components: $total_components"
echo -e "Blessed Components: ${PURPLE}$blessed_count${NC}"
echo -e "Issues Found: ${RED}$issues_found${NC}"
echo ""

if [ $issues_found -eq 0 ]; then
    echo -e "${GREEN}🎉 All components are blessed and verified!${NC}"
    echo -e "${BLUE}Your sacred component library is intact and protected.${NC}"
else
    echo -e "${YELLOW}⚠️  $issues_found issues detected. Please review and resolve.${NC}"
fi

echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "- Run: ./scripts/sync-components.sh to sync across projects"
echo "- Run: git add . && git commit -m \"Sacred component preservation\""
echo "- Test components at: http://localhost:3001/test-welcome"
echo ""

exit $issues_found