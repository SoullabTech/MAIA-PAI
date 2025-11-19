#!/usr/bin/env python3

import os
import sys
import re

def count_tokens(text):
    """Rough token estimation"""
    words = text.split()
    return len(words) * 1.3  # Rough token estimation

def smart_chunk_file(file_path, max_tokens=2000):
    """Chunk file by token count rather than line count"""

    if not os.path.exists(file_path):
        print(f"File not found: {file_path}")
        return

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Create output directory
    filename = os.path.basename(file_path)
    base_name = os.path.splitext(filename)[0]
    output_dir = f"/Users/soullab/MAIA-PAI/docs/consciousness-library/sources/chunks/{base_name}"
    os.makedirs(output_dir, exist_ok=True)

    # Split by paragraphs first
    paragraphs = content.split('\n\n')

    chunks = []
    current_chunk = ""
    current_tokens = 0

    for paragraph in paragraphs:
        para_tokens = count_tokens(paragraph)

        if current_tokens + para_tokens > max_tokens and current_chunk:
            # Save current chunk and start new one
            chunks.append(current_chunk.strip())
            current_chunk = paragraph + '\n\n'
            current_tokens = para_tokens
        else:
            current_chunk += paragraph + '\n\n'
            current_tokens += para_tokens

    # Add final chunk
    if current_chunk.strip():
        chunks.append(current_chunk.strip())

    # Write chunks to files
    for i, chunk in enumerate(chunks, 1):
        output_file = f"{output_dir}/part_{i:03d}.txt"
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(chunk)
        print(f"Created: {output_file} (~{count_tokens(chunk):.0f} tokens)")

    print(f"Split {filename} into {len(chunks)} chunks")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 smart-chunk.py <file_path> [max_tokens]")
        sys.exit(1)

    file_path = sys.argv[1]
    max_tokens = int(sys.argv[2]) if len(sys.argv) > 2 else 2000

    smart_chunk_file(file_path, max_tokens)