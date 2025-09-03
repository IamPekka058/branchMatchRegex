import * as fs from 'fs'
import * as path from 'path'
import * as yaml from 'yaml'
import convertToWildcardPattern from './converter.js'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import * as core from '@actions/core'

/**
 * Gets the default patterns from assets directory
 */
export function getDefaultPatterns(useWildcard: boolean): string[] {
  const patterns: string[] = []

  const __filename = fileURLToPath(import.meta.url)
  const __dirname = dirname(__filename)
  const filePath = path.join(__dirname, '../assets/default-patterns.yml')

  try {
    const fileContent = fs.readFileSync(filePath, 'utf8')
    const yamlContent = yaml.parse(fileContent)

    // If using wildcard patterns, convert them
    if (useWildcard) {
      for (const pattern of yamlContent) {
        patterns.push(convertToWildcardPattern(pattern))
      }
    } else {
      patterns.push(...yamlContent)
    }
  } catch (error) {
    core.setFailed(
      `Failed to get default patterns: ${error instanceof Error ? error.message : error}`
    )
    throw new Error()
  }

  return patterns
}

export async function getPatternsFromPath(
  path: string,
  useWildcard: boolean
): Promise<string[]> {
  const isUrl = (input: string): boolean => {
    const urlPattern = /^(https?:\/\/[^\s]+)/
    return urlPattern.test(input)
  }

  if (isUrl(path)) {
    return await getPatternsFromUrl(path, useWildcard)
  }

  return getPatternsFromFile(path, useWildcard)
}

async function getPatternsFromUrl(
  url: string,
  useWildcard: boolean
): Promise<string[]> {
  const response = await fetch(url)
  if (!response.ok) {
    core.setFailed(
      `Failed to fetch patterns from URL: ${response.status} ${response.statusText}`
    )
    throw new Error()
  }
  const body = await response.text()
  if (useWildcard) {
    const rawYaml = yaml.parse(body)
    const patterns: string[] = []
    for (const pattern of rawYaml.patterns) {
      patterns.push(convertToWildcardPattern(pattern))
    }
    return patterns
  }
  return yaml.parse(body)
}

function getPatternsFromFile(filePath: string, useWildcard: boolean): string[] {
  const patterns: string[] = []
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8')
    const yamlContent = yaml.parse(fileContent)

    // If using wildcard patterns, convert them
    if (useWildcard) {
      console.log('Using wildcard patterns')
      for (const pattern of yamlContent.patterns) {
        patterns.push(convertToWildcardPattern(pattern))
      }
    } else {
      patterns.push(...yamlContent.patterns)
    }
  } catch (error) {
    core.setFailed(
      `Failed to get patterns from file: ${error instanceof Error ? error.message : error}`
    )
    throw new Error()
  }
  return patterns
}
