export default function convertToWildcardPattern(pattern: string): string {
  let cleanPattern = pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&')
  cleanPattern = cleanPattern.replace(/\*/g, '.*')
  return `^${cleanPattern}$`
}
