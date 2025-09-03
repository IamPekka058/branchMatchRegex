import { jest } from '@jest/globals'
import convertToWildcardPattern from '../src/converter.js'

describe('convertToWildcardPattern', () => {
    it('should convert a simple wildcard pattern to a regex', () => {
        expect(convertToWildcardPattern('feature/*')).toBe('^feature/.*$');
    });

    it('should convert a pattern with multiple wildcards', () => {
        expect(convertToWildcardPattern('feature/*/test')).toBe('^feature/.*/test$');
    });

    it('should escape special regex characters', () => {
        expect(convertToWildcardPattern('feature/(test)')).toBe(String.raw`^feature/\(test\)$`);
    });

    it('should handle an empty pattern', () => {
        expect(convertToWildcardPattern('')).toBe('^$');
    });
});
