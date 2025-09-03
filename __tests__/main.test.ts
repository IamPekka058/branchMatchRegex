import { jest } from '@jest/globals'

const mockGetInput = jest.fn()
const mockSetFailed = jest.fn()
const mockInfo = jest.fn()
const mockDebug = jest.fn()
const mockWarning = jest.fn()

jest.unstable_mockModule('@actions/core', () => ({
  getInput: mockGetInput,
  setFailed: mockSetFailed,
  info: mockInfo,
  debug: mockDebug,
  warning: mockWarning
}))

const mockGetDefaultPatterns = jest.fn<() => string[]>()
const mockGetPatternsFromPath = jest.fn<(path: string) => Promise<string[]>>()

jest.unstable_mockModule('../src/getService', () => ({
  getDefaultPatterns: mockGetDefaultPatterns,
  getPatternsFromPath: mockGetPatternsFromPath
}))

const core = await import('@actions/core')
const main = await import('../src/main.js')

const setupMocks = (inputs: Record<string, string>) => {
  mockGetInput.mockImplementation((name: any) => inputs[name] || '')
}

beforeEach(() => {
  jest.clearAllMocks()
})

describe('main.run', () => {
  it('should match branch with single inline pattern', async () => {
    setupMocks({
      patterns: 'feature/.*',
      branch: 'feature/test'
    })
    await main.run()
    expect(core.info).toHaveBeenCalledWith(
      expect.stringContaining(
        "Branch 'feature/test' matches pattern: feature/.*"
      )
    )
    expect(core.setFailed).not.toHaveBeenCalled()
  })

  it('should fail if branch does not match any pattern and failOnUnmatchedPattern is true', async () => {
    setupMocks({
      patterns: 'release/.*',
      failOnUnmatchedPattern: 'true',
      branch: 'feature/test'
    })
    await main.run()
    expect(core.setFailed).toHaveBeenCalledWith(
      expect.stringContaining(
        "Branch 'feature/test' does not match any patterns"
      )
    )
  })

  it('should not fail if branch does not match and failOnUnmatchedPattern is false', async () => {
    setupMocks({
      patterns: 'release/.*',
      failOnUnmatchedPattern: 'false',
      branch: 'feature/test'
    })
    await main.run()
    expect(core.setFailed).not.toHaveBeenCalled()
  })

  it('should match branch with default patterns', async () => {
    setupMocks({
      useDefaultPatterns: 'true',
      branch: 'main'
    })
    mockGetDefaultPatterns.mockReturnValue(['main', 'develop'])
    await main.run()
    expect(core.info).toHaveBeenCalledWith(
      expect.stringContaining("Branch 'main' matches pattern: main")
    )
    expect(core.setFailed).not.toHaveBeenCalled()
  })

  it('should match branch with patterns from file', async () => {
    setupMocks({
      path: 'somefile',
      branch: 'bugfix/123'
    })
    mockGetPatternsFromPath.mockResolvedValue(['bugfix/.*', 'hotfix/.*'])
    await main.run()
    expect(core.info).toHaveBeenCalledWith(
      expect.stringContaining("Branch 'bugfix/123' matches pattern: bugfix/.*")
    )
    expect(core.setFailed).not.toHaveBeenCalled()
  })

  it('should handle YAML-style pattern lists', async () => {
    setupMocks({
      patterns: '- feature/.*\n- bugfix/.*',
      branch: 'bugfix/123'
    })
    await main.run()
    expect(core.info).toHaveBeenCalledWith(
      expect.stringContaining("Branch 'bugfix/123' matches pattern: bugfix/.*")
    )
    expect(core.setFailed).not.toHaveBeenCalled()
  })

  it('should handle empty patterns gracefully', async () => {
    setupMocks({})
    await main.run()
    expect(core.setFailed).not.toHaveBeenCalled()
  })

  it('should log error if getPatternsFromPath throws', async () => {
    setupMocks({
      path: 'badfile',
      branch: 'feature/test'
    })
    mockGetPatternsFromPath.mockRejectedValue(new Error('File not found'))
    await main.run()
    expect(core.setFailed).toHaveBeenCalledWith(
      expect.stringContaining('File not found')
    )
  })

  it('should support useWildcardPatterns', async () => {
    setupMocks({
      patterns: 'feature/*',
      useWildcardPatterns: 'true',
      branch: 'feature/123'
    })
    await main.run()
    expect(core.info).toHaveBeenCalledWith(
      expect.stringContaining("Branch 'feature/123' matches pattern: feature/*")
    )
    expect(core.setFailed).not.toHaveBeenCalled()
  })

  it('should handle invalid regex pattern', async () => {
    setupMocks({
      patterns: '[invalid-regex',
      branch: 'feature/123'
    })
    await main.run()
    expect(core.setFailed).toHaveBeenCalledWith(
      expect.stringContaining('Invalid regular expression')
    )
  })
})
