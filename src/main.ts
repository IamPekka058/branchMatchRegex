import * as core from '@actions/core'
import { getDefaultPatterns, getPatternsFromPath } from './getService.js'

/**
 * The main function for the action.
 *
 * @returns Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const allPatterns: string[] = []

    const patterns: string = core.getInput('patterns')
    const path: string = core.getInput('path')
    const failOnUnmatchedPattern: boolean =
      core.getInput('failOnUnmatchedPattern') === 'true'
    const useWildcardPatterns: boolean =
      core.getInput('useWildcardPatterns') === 'true'
    const useDefaultPatterns: boolean =
      core.getInput('useDefaultPatterns') === 'true'
    const branch: string = core.getInput('branch')

    core.debug(`Patterns: ${patterns}`)
    core.debug(`Path: ${path}`)
    core.debug(`Fail on unmatched pattern: ${failOnUnmatchedPattern}`)
    core.debug(`Use wildcard patterns: ${useWildcardPatterns}`)
    core.debug(`Use default patterns: ${useDefaultPatterns}`)
    core.debug(`Branch: ${branch}`)

    core.info(`Checking branch '${branch}' against provided patterns...`)

    if (patterns) {
      allPatterns.push(
        ...patterns
          .split('\n')
          .map((p) => p.trim())
          .filter((p) => p)
          // Support YAML-style lists: remove leading '- ' if present
          .map((p) => (p.startsWith('- ') ? p.slice(2).trim() : p))
      )
    }
    if (useDefaultPatterns) {
      allPatterns.push(...getDefaultPatterns(useWildcardPatterns))
    }
    if (path) {
      allPatterns.push(
        ...(await getPatternsFromPath(path, useWildcardPatterns))
      )
    }

    for (const pattern of allPatterns) {
      core.info(`Checking branch '${branch}' against pattern: ${pattern}`)
      const regex = new RegExp(pattern)
      if (regex.test(branch)) {
        core.info(`Branch '${branch}' matches pattern: ${pattern}`)
        return
      }
    }

    if (failOnUnmatchedPattern) {
      core.setFailed(`Branch '${branch}' does not match any patterns`)
    } else {
      core.warning(`Branch '${branch}' does not match any patterns`)
    }
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}
