import { jest } from '@jest/globals'

const mockReadFileSync = jest.fn()
const mockParse = jest.fn()
const mockPromisesReadFile = jest.fn()

jest.unstable_mockModule('fs', () => ({
  readFileSync: mockReadFileSync,
  constants: {},
  promises: {
    readFile: mockPromisesReadFile,
    lstat: jest.fn(),
    readdir: jest.fn(),
    readlink: jest.fn(),
    realpath: jest.fn(),
  },
}))

jest.unstable_mockModule('yaml', () => ({
  parse: mockParse
}))

global.fetch = jest.fn() as jest.MockedFunction<typeof fetch>

const getService = await import('../src/getService.js')

beforeEach(() => {
  jest.clearAllMocks()
})

describe('getService', () => {
  describe('getDefaultPatterns', () => {
    it('should return default patterns', () => {
      mockReadFileSync.mockReturnValue('- feature/.*\n- bugfix/.*')
      mockParse.mockReturnValue(['feature/.*', 'bugfix/.*'])
      const patterns = getService.getDefaultPatterns(false)
      expect(patterns).toEqual(['feature/.*', 'bugfix/.*'])
    })

    it('should return default patterns as wildcard patterns', () => {
      mockReadFileSync.mockReturnValue('- feature/*\n- bugfix/*')
      mockParse.mockReturnValue(['feature/*', 'bugfix/*'])
      const patterns = getService.getDefaultPatterns(true)
      expect(patterns).toEqual(['^feature/.*$', '^bugfix/.*$'])
    })

    it('should throw an error if reading the file fails', () => {
      mockReadFileSync.mockImplementation(() => {
        throw new Error('File not found')
      })
      expect(() => getService.getDefaultPatterns(false)).toThrow()
    })

    it('should throw a non-Error object if reading the file fails', () => {
      mockReadFileSync.mockImplementation(() => {
        throw 'File not found'
      })
      expect(() => getService.getDefaultPatterns(false)).toThrow()
    })
  })

  describe('getPatternsFromPath', () => {
    it('should get patterns from a file path', async () => {
      mockReadFileSync.mockReturnValue('- feature/.*\n- bugfix/.*')
      mockParse.mockReturnValue(['feature/.*', 'bugfix/.*'])
      const patterns = await getService.getPatternsFromPath('some/path', false)
      expect(patterns).toEqual(['feature/.*', 'bugfix/.*'])
    })

    it('should get patterns from a file path with wildcard', async () => {
      mockReadFileSync.mockReturnValue('- feature/*\n- bugfix/*')
      mockParse.mockReturnValue(['feature/*', 'bugfix/*'])
      const patterns = await getService.getPatternsFromPath('some/path', true)
      expect(patterns).toEqual(['^feature/.*$', '^bugfix/.*$'])
    })

    it('should get patterns from a URL', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(' - feature/.*\n  - bugfix/.*')
      })
      mockParse.mockReturnValue(['feature/.*', 'bugfix/.*'])
      const patterns = await getService.getPatternsFromPath(
        'https://example.com/patterns.yml',
        false
      )
      expect(patterns).toEqual(['feature/.*', 'bugfix/.*'])
    })

    it('should get patterns from a URL with wildcard', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        text: () => Promise.resolve('patterns:\n  - feature/*\n  - bugfix/*')
      })
      mockParse.mockReturnValue(['feature/*', 'bugfix/*'])
      const patterns = await getService.getPatternsFromPath(
        'https://example.com/patterns.yml',
        true
      )
      expect(patterns).toEqual(['^feature/.*$', '^bugfix/.*$'])
    })

    it('should throw an error if fetching from a URL fails', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      })
      await expect(
        getService.getPatternsFromPath(
          'https://example.com/patterns.yml',
          false
        )
      ).rejects.toThrow()
    })

    it('should throw an error if reading the file fails', async () => {
      mockReadFileSync.mockImplementation(() => {
        throw new Error('File not found')
      })
      await expect(
        getService.getPatternsFromPath('some/path', false)
      ).rejects.toThrow()
    })

    it('should throw a non-Error object if reading the file fails', async () => {
      mockReadFileSync.mockImplementation(() => {
        throw 'File not found'
      })
      await expect(
        getService.getPatternsFromPath('some/path', false)
      ).rejects.toThrow()
    })
  })
})
