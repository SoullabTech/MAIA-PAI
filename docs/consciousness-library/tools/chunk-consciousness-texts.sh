#!/bin/bash

# CONSCIOUSNESS TEXT CHUNKER
# Splits large consciousness texts into manageable sections for processing

CHUNK_DIR="/Users/soullab/MAIA-PAI/docs/consciousness-library/sources"
DOWNLOADS_DIR="/Users/soullab/Downloads"

# Function to chunk a text file
chunk_text_file() {
    local file_path="$1"
    local chunk_size="${2:-2000}"  # Default 2000 lines per chunk

    if [[ ! -f "$file_path" ]]; then
        echo "File not found: $file_path"
        return 1
    fi

    local filename=$(basename "$file_path")
    local base_name="${filename%.*}"
    local output_dir="$CHUNK_DIR/chunks/$base_name"

    mkdir -p "$output_dir"

    # Split the file into chunks
    split -l "$chunk_size" "$file_path" "$output_dir/chunk_"

    # Rename chunks with numbers and .txt extension
    local i=1
    for chunk in "$output_dir"/chunk_*; do
        if [[ -f "$chunk" ]]; then
            mv "$chunk" "$output_dir/part_$(printf "%03d" $i).txt"
            echo "Created: $output_dir/part_$(printf "%03d" $i).txt"
            ((i++))
        fi
    done

    echo "Chunked $filename into $((i-1)) parts in $output_dir"
}

# Function to extract key concepts from a chunk
extract_concepts() {
    local chunk_file="$1"
    local concepts_file="${chunk_file%.*}_concepts.md"

    echo "# Key Concepts from $(basename "$chunk_file")" > "$concepts_file"
    echo "" >> "$concepts_file"

    # Extract lines that might contain key concepts
    grep -i -E "(consciousness|sacred|soul|archetype|numinous|shamanic|individuation|transcend)" "$chunk_file" | head -20 >> "$concepts_file"

    echo "Extracted concepts to: $concepts_file"
}

# Main execution
if [[ $# -eq 0 ]]; then
    echo "Usage: $0 <text_file> [chunk_size]"
    echo "Example: $0 /path/to/lilly-text.txt 1500"
    exit 1
fi

chunk_text_file "$1" "$2"