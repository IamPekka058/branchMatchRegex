# branchMatchRegex

![GitHub release (latest by date)](https://img.shields.io/github/v/release/IamPekka058/branchMatchRegex)
![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/IamPekka058/branchMatchRegex/.github/workflows/build-and-commit.yml)
![GitHub](https://img.shields.io/github/license/IamPekka058/branchMatchRegex)

`branchMatchRegex` is a GitHub Action that checks if the current branch name matches a specified regex pattern. This is particularly useful for enforcing branch naming conventions in your repositories.

> If you use `useDefaultPatterns: true`, see [DEFAULT_PATTERNS.md](./DEFAULT_PATTERNS.md) for a detailed explanation of the default branch patterns.

## Inputs

| Name                   | Description                                                                 | Required | Default                |
|------------------------|-----------------------------------------------------------------------------|----------|------------------------|
| `regex`                | The regex pattern to match the branch name against.                         | No       | ""                    |
| `inputPath`            | The path or URL to the file containing the regex patterns.                  | No       | ""                    |
| `useDefaultPatterns`   | Use default patterns for branch matching.                                   | No       | false                  |
| `failOnUnmatchedRegex` | Fail the action if the branch does not match the regex pattern.             | No       | true                   |
| `branchName`           | The branch name to check against the regex pattern.                         | No       | ${{ github.head_ref }} |
| `useWildcard`          | If true, treat patterns as simple wildcards (e.g. feature/*) instead of full regex. | No | false |

> **Note**: Either `regex`, `inputPath`, or `useDefaultPatterns` must be provided. If both `regex` and `inputPath` are provided, the `inputPath` input takes precedence. You can't use `useDefaultPatterns` and `inputPath` at the same time.

## Example Usage

Below is an example of how to use the `branchMatchRegex` action in a GitHub workflow:

### Example 1: Single Regex Pattern
```yaml
- name: Run branchMatchRegex action
  uses: IamPekka058/branchMatchRegex@v1
  with:
    regex: 'feature/*'
```

### Example 2: Inline list of Regex Patterns
```yaml
- name: Run branchMatchRegex action
  uses: IamPekka058/branchMatchRegex@v1
  with:
    regex: "['feature/*', 'bugfix/*','hotfix/*']"
```
### Example 3: List of Regex Patterns
```yaml
- name: Run branchMatchRegex action
  uses: IamPekka058/branchMatchRegex@v1
  with:
    regex: |
        - 'feature/*'
        - 'bugfix/*'
        - 'hotfix/*'
```

### Example 4: Regex Patterns from a File
```yaml
- name: Run branchMatchRegex action
  uses: IamPekka058/branchMatchRegex@v1
  with:
    inputPath: 'branch-regex-patterns.yml'
```

The `branch-regex-patterns.yml` file could look like this:
```yaml
- 'feature/*'
- 'bugfix/*'
- 'hotfix/*'
```

### Example 5: Use Default Patterns
```yaml
- name: Run branchMatchRegex action
  uses: IamPekka058/branchMatchRegex@v1
  with:
    useDefaultPatterns: true
```

### Example 6: Regex Patterns from a URL
```yaml
- name: Run branchMatchRegex action
  uses: IamPekka058/branchMatchRegex@v1
  with:
    inputPath: 'https://example.com/patterns.yml'
```

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

<div align="center">
  <sub>Made with ❤️ in Bavaria</sub>
</div>