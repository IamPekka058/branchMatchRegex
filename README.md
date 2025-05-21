# branchMatchRegex

![GitHub release (latest by date)](https://img.shields.io/github/v/release/IamPekka058/branchMatchRegex)
![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/IamPekka058/branchMatchRegex/.github/workflows/build-and-commit.yml)
![GitHub](https://img.shields.io/github/license/IamPekka058/branchMatchRegex)

`branchMatchRegex` is  GitHub Action that checks if the current branch name matches a specified regex pattern. This is particularly useful for enforcing branch naming conventions in your repositories.

> **Disclaimer**:
> 
> **Currently, this action can only be used in the context of a Pull Request.** It always uses the `head` branch (the source branch of the PR) for matching against the provided regex pattern(s). Support for running in other contexts and specifying a custom branch via a dedicated input is planned for a future release.

> If you use `useDefaultPatterns: true`, see [DEFAULT_PATTERNS.md](./DEFAULT_PATTERNS.md) for a detailed explanation of the default branch patterns.

## Inputs

| Name               | Description                                                                 | Required | Default |
|--------------------|-----------------------------------------------------------------------------|----------|---------|
| `regex`            | The regex pattern to match the branch name against.                          | No       | ""      |
| `path`             | The path to a file containing the regex pattern(s).                          | No       | ""      |
| `useDefaultPatterns` | Use built-in default patterns if no regex or path is provided.               | No       | false    |

> **Note**: Either `regex`, `path`, or `useDefaultPatterns` must be provided. If both `regex` and `path` are provided, the `path` input takes precedence.

## Example Usage

Below is an example of how to use the `branchMatchRegex` action in a GitHub workflow:

### Example 1: Single Regex Pattern
```yaml
- name: Run branchMatchRegex action
  uses: IamPekka058/branchMatchRegex@v0
  with:
    regex: 'feature/*'
```

### Example 2: Inline list of Regex Patterns
```yaml
- name: Run branchMatchRegex action
  uses: IamPekka058/branchMatchRegex@v0
  with:
    regex: "['feature/*', 'bugfix/*','hotfix/*']"
```
### Example 3: List of Regex Patterns
```yaml
- name: Run branchMatchRegex action
  uses: IamPekka058/branchMatchRegex@v0
  with:
    regex: |
        - 'feature/*'
        - 'bugfix/*'
        - 'hotfix/*'
```

### Example 4: Regex Patterns from a File
```yaml
- name: Run branchMatchRegex action
  uses: IamPekka058/branchMatchRegex@v0
  with:
    path: './branch-regex-patterns.yml'
```

In the third example, the file `branch-regex-patterns.txt` should contain one regex pattern per line.

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

<div align="center">
  <sub>Made with ❤️ in Bavaria</sub>
</div>