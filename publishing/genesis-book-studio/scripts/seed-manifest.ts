#!/usr/bin/env tsx

/**
 * Convert elemental-alchemy.manifest.yaml to JSON
 * Run at build time to make manifest available to API routes
 */

import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import * as yaml from 'js-yaml'

const contentDir = join(process.cwd(), 'content')
const yamlPath = join(contentDir, 'elemental-alchemy.manifest.yaml')
const jsonPath = join(contentDir, 'elemental-alchemy.manifest.json')

try {
  console.log('📖 Reading manifest YAML...')
  const yamlContent = readFileSync(yamlPath, 'utf-8')

  console.log('🔄 Converting to JSON...')
  const manifest = yaml.load(yamlContent)

  console.log('💾 Writing JSON manifest...')
  writeFileSync(jsonPath, JSON.stringify(manifest, null, 2))

  console.log('✓ Manifest converted successfully')
  console.log(`  Input:  ${yamlPath}`)
  console.log(`  Output: ${jsonPath}`)
} catch (err) {
  console.error('❌ Error converting manifest:', err)
  process.exit(1)
}
