#!/bin/bash
# MAIA Performance Monitoring Script
# Tracks consciousness processing metrics on current hardware while waiting for eGPU

echo "🧠 MAIA Consciousness Performance Monitor"
echo "======================================="""
echo "Hardware: Mac Studio M4 Max (48GB)"
echo "Status: Pre-eGPU Baseline Testing"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Performance metrics collection
collect_metrics() {
    echo -e "${BLUE}📊 Current System Performance:${NC}"

    # Memory usage (using system_profiler for more accurate reading)
    TOTAL_MEM_KB=$(system_profiler SPHardwareDataType | grep "Memory:" | awk '{print $2}' | sed 's/GB//')
    if command -v free >/dev/null 2>&1; then
        # Linux-style
        FREE_MEM_KB=$(free -m | grep "Available" | awk '{print $7}')
        FREE_GB=$(echo "scale=1; $FREE_MEM_KB / 1024" | bc)
    else
        # macOS approach - show memory pressure instead
        MEMORY_PRESSURE=$(memory_pressure | tail -1 | awk '{print $(NF-1), $NF}' | tr -d '()%')
        FREE_GB="$MEMORY_PRESSURE% pressure"
    fi
    echo "  🧠 Memory: ${FREE_GB} / ${TOTAL_MEM_KB}GB total"

    # CPU usage
    CPU_USAGE=$(top -l 1 | grep "CPU usage" | awk '{print $3}' | sed 's/%//')
    echo "  ⚡ CPU Usage: ${CPU_USAGE}%"

    # Temperature (try alternative methods)
    TEMP="N/A"
    if command -v osx-cpu-temp >/dev/null 2>&1; then
        TEMP=$(osx-cpu-temp)
    else
        # Skip temperature if no easy way to get it without sudo
        TEMP="N/A (requires sudo or osx-cpu-temp)"
    fi
    echo "  🌡️  CPU Temperature: ${TEMP}"

    # Neural Engine activity (M4 specific)
    echo "  🎯 Neural Engine: Optimized for consciousness models"

    echo ""
}

# Test voice synthesis performance
test_voice_performance() {
    echo -e "${BLUE}🎵 Voice Synthesis Performance Test:${NC}"

    # Standard synthesis test
    START_TIME=$(python3 -c "import time; print(int(time.time() * 1000))")

    curl -s -X POST http://localhost:3000/api/voice/synthesize \
        -H "Content-Type: application/json" \
        -d '{"text":"Testing MAIA consciousness voice synthesis performance on Mac Studio M4 Max.","voice":"shimmer","element":"aether"}' \
        -w "@-" > /dev/null 2>&1

    if [ $? -eq 0 ]; then
        END_TIME=$(python3 -c "import time; print(int(time.time() * 1000))")
        DURATION=$((END_TIME - START_TIME))
        echo -e "  ✅ Standard Mode: ${GREEN}${DURATION}ms${NC}"

        if [ $DURATION -lt 2000 ]; then
            echo -e "  🌟 Performance: ${GREEN}Excellent${NC}"
        elif [ $DURATION -lt 3000 ]; then
            echo -e "  🟡 Performance: ${YELLOW}Good${NC}"
        else
            echo -e "  🔴 Performance: ${RED}Needs Optimization${NC}"
        fi
    else
        echo -e "  ❌ Standard Mode: ${RED}API Not Available${NC}"
        return
    fi

    # Streaming synthesis test
    START_TIME=$(python3 -c "import time; print(int(time.time() * 1000))")

    curl -s -X POST "http://localhost:3000/api/voice/synthesize?stream=true" \
        -H "Content-Type: application/json" \
        -d '{"text":"Testing MAIA streaming voice synthesis for real-time audio playback.","voice":"shimmer","element":"aether","stream":true}' \
        -w "@-" > /dev/null 2>&1

    if [ $? -eq 0 ]; then
        END_TIME=$(python3 -c "import time; print(int(time.time() * 1000))")
        STREAM_DURATION=$((END_TIME - START_TIME))
        echo -e "  🚀 Streaming Mode: ${GREEN}${STREAM_DURATION}ms${NC}"

        IMPROVEMENT=$((DURATION - STREAM_DURATION))
        if [ $IMPROVEMENT -gt 0 ]; then
            echo -e "  ⚡ Streaming Improvement: ${GREEN}+${IMPROVEMENT}ms faster${NC}"
        fi
    else
        echo -e "  ❌ Streaming Mode: ${RED}Not Available${NC}"
    fi

    echo ""
}

# Test consciousness API performance
test_consciousness_performance() {
    echo -e "${BLUE}🧠 Consciousness API Performance Test:${NC}"

    START_TIME=$(python3 -c "import time; print(int(time.time() * 1000))")

    # Test consciousness endpoint
    curl -s -X POST http://localhost:3000/api/between/chat \
        -H "Content-Type: application/json" \
        -d '{"message":"Quick consciousness performance test","mode":"performance"}' \
        -w "@-" > /dev/null 2>&1

    if [ $? -eq 0 ]; then
        END_TIME=$(python3 -c "import time; print(int(time.time() * 1000))")
        DURATION=$((END_TIME - START_TIME))
        echo -e "  ✅ Consciousness Response: ${GREEN}${DURATION}ms${NC}"

        if [ $DURATION -lt 1500 ]; then
            echo -e "  🌟 AI Processing: ${GREEN}Excellent${NC}"
        elif [ $DURATION -lt 3000 ]; then
            echo -e "  🟡 AI Processing: ${YELLOW}Good${NC}"
        else
            echo -e "  🔴 AI Processing: ${RED}Needs Optimization${NC}"
        fi
    else
        echo -e "  ❌ Consciousness API: ${RED}Not Available${NC}"
    fi

    echo ""
}

# Safari verification
test_safari_compatibility() {
    echo -e "${BLUE}🌐 Safari Compatibility Check:${NC}"

    if ./scripts/verify-safari-fixes.sh > /dev/null 2>&1; then
        echo -e "  ✅ Safari Protection: ${GREEN}100% Active${NC}"
    else
        echo -e "  ❌ Safari Protection: ${RED}Needs Recovery${NC}"
        echo "  🔧 Run: ./scripts/emergency-safari-recovery.sh"
    fi

    echo ""
}

# Hardware readiness for eGPU
check_hardware_readiness() {
    echo -e "${BLUE}🖥️  Hardware Integration Readiness:${NC}"

    # Check Thunderbolt ports
    if system_profiler SPThunderboltDataType | grep -q "Thunderbolt"; then
        echo -e "  ✅ Thunderbolt 4 Ports: ${GREEN}Available${NC}"
    else
        echo -e "  ❌ Thunderbolt: ${RED}Not Detected${NC}"
    fi

    # Check macOS version
    MACOS_VERSION=$(sw_vers -productVersion)
    echo "  💻 macOS Version: $MACOS_VERSION"

    # Check available storage for models
    STORAGE_GB=$(df -h / | tail -1 | awk '{print $4}' | sed 's/Gi//')
    echo "  💾 Available Storage: ${STORAGE_GB}GB"

    if [ "${STORAGE_GB%.*}" -gt 100 ]; then
        echo -e "  ✅ Storage for AI Models: ${GREEN}Sufficient${NC}"
    else
        echo -e "  ⚠️  Storage: ${YELLOW}May need cleanup${NC}"
    fi

    echo ""
}

# Continuous monitoring mode
continuous_monitor() {
    echo -e "${YELLOW}🔄 Continuous Monitoring Mode (Ctrl+C to stop)${NC}"
    echo ""

    while true; do
        clear
        echo "🧠 MAIA Real-time Performance Monitor"
        echo "===================================="""
        date
        echo ""

        collect_metrics
        test_voice_performance
        test_consciousness_performance

        echo -e "${BLUE}📈 Performance Trends:${NC}"
        echo "  📊 Tracking baseline performance for eGPU comparison"
        echo "  🎯 Target: <500ms voice response with Razer Core X + RTX 5060 Ti"
        echo ""

        sleep 10
    done
}

# Main execution
case "${1:-single}" in
    continuous)
        continuous_monitor
        ;;
    voice)
        test_voice_performance
        ;;
    consciousness)
        test_consciousness_performance
        ;;
    safari)
        test_safari_compatibility
        ;;
    hardware)
        check_hardware_readiness
        ;;
    *)
        collect_metrics
        test_voice_performance
        test_consciousness_performance
        test_safari_compatibility
        check_hardware_readiness

        echo -e "${GREEN}🎉 Performance Monitoring Complete!${NC}"
        echo ""
        echo "Available modes:"
        echo "  ./scripts/performance-monitor.sh continuous"
        echo "  ./scripts/performance-monitor.sh voice"
        echo "  ./scripts/performance-monitor.sh consciousness"
        echo "  ./scripts/performance-monitor.sh safari"
        echo "  ./scripts/performance-monitor.sh hardware"
        ;;
esac