# branchMatchRegex

![GitHub release (latest by date)](https://img.shields.io/github/v/release/IamPekka058/branchMatchRegex)
![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/IamPekka058/branchMatchRegex/.github/workflows/build-and-commit.yml)
![GitHub](https://img.shields.io/github/license/IamPekka058/branchMatchRegex)

> **What's new in v2?**
>
> - All pattern sources (`patterns`, `useDefaultPatterns`, `path`) are now
>   combined (cumulative), not mutually exclusive.
> - Input names have changed: use `patterns` instead of `regex`, and
>   `useWildcardPatterns` instead of `useWildcard`.
> - You can now combine inline patterns, default patterns, and file/URL patterns
>   in any combination.
> - The project is now based on TypeScript instead of plain JavaScript for
>   improved type safety and maintainability.
> - Tests have been added (see the `__tests__` directory) to ensure reliability
>   and robustness.

`branchMatchRegex` is a GitHub Action that checks if the current branch name
matches one or more specified patterns (regex or wildcard). This is especially
useful for enforcing branch naming conventions in your repositories.

> If you use `useDefaultPatterns: true`, see
> [DEFAULT_PATTERNS.md](./DEFAULT_PATTERNS.md) for a detailed explanation of the
> default branch patterns.

## Inputs

| Name                     | Description                                                                                    | Required | Default                  |
| ------------------------ | ---------------------------------------------------------------------------------------------- | -------- | ------------------------ |
| `patterns`               | The (regex or wildcard) patterns to match against the branch. Multiple patterns, one per line. | No       | ""                       |
| `path`                   | Path or URL to a file containing patterns (one per line).                                      | No       | ""                       |
| `useDefaultPatterns`     | Additionally use default patterns. See [DEFAULT_PATTERNS.md](./DEFAULT_PATTERNS.md).           | No       | false                    |
| `failOnUnmatchedPattern` | Fail the action if the branch does not match any pattern.                                      | No       | true                     |
| `useWildcardPatterns`    | Treat patterns as wildcards (e.g. `feature/*`) instead of regex.                               | No       | false                    |
| `branch`                 | The branch to check.                                                                           | Yes      | `${{ github.head_ref }}` |

**Note:** All specified pattern sources (`patterns`, `useDefaultPatterns`,
`path`) are combined. The order is: `patterns`, then default patterns, then
file/URL. You can use any combination of sources at the same time.

**Tip:** The `patterns` input supports both plain lists and YAML-style lists.
For example, both of the following are valid:

```yaml
patterns: |
  feature/*
  fix/*
```

or

```yaml
patterns: |
  - feature/*
  - fix/*
```

## Example Usage

### Example 1: Single inline pattern

```yaml
- name: Run branchMatchRegex action
  uses: IamPekka058/branchMatchRegex@v2
  with:
    patterns: 'feature/.*'
```

### Example 2: Multiple inline patterns (one per line)

```yaml
- name: Run branchMatchRegex action
  uses: IamPekka058/branchMatchRegex@v2
  with:
    patterns: |
      feature/.*
      bugfix/.*
      hotfix/.*
```

### Example 3: Patterns from a file

```yaml
- name: Run branchMatchRegex action
  uses: IamPekka058/branchMatchRegex@v2
  with:
    path: 'branch-patterns.yml'
```

The file `branch-patterns.yml` could look like this:

```
- feature/.*
- bugfix/.*
- hotfix/.*
```

### Example 4: Use default patterns additionally

```yaml
- name: Run branchMatchRegex action
  uses: IamPekka058/branchMatchRegex@v2
  with:
    useDefaultPatterns: true
```

### Example 5: Combine multiple sources

```yaml
- name: Run branchMatchRegex action
  uses: IamPekka058/branchMatchRegex@v2
  with:
    patterns: |
      feature/.*
      bugfix/.*
    useDefaultPatterns: true
    path: 'branch-patterns.yml'
```

### Example 6: Use wildcard patterns

```yaml
- name: Run branchMatchRegex action
  uses: IamPekka058/branchMatchRegex@v2
  with:
    patterns: |
      feature/*
      bugfix/*
    useWildcardPatterns: true
```

### Example 7: Patterns from a URL

```yaml
- name: Run branchMatchRegex action
  uses: IamPekka058/branchMatchRegex@v2
  with:
    path: 'https://example.com/patterns.yml'
```

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE)
file for details.

<div align="center">
  <sub>Made with ❤️ in Bavaria</sub>
</div>
