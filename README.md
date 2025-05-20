# branchMatchRegex

`branchMatchRegex` is a GitHub Action that checks if the current branch name matches a specified regex pattern. This is particularly useful for enforcing branch naming conventions in your repositories.

## Inputs

### `regex`
- **Description**: The regex pattern to match the branch name against.
- **Required**: No
- **Default**: `null`

### `path`
- **Description**: The path to a file containing the regex pattern(s).
- **Required**: No
- **Default**: `null`

> **Note**: Either `regex` or `path` must be provided, but not both. If both are provided, the `path` input takes precedence.

## Example Usage

Below is an example of how to use the `branchMatchRegex` action in a GitHub workflow:

```yaml
ame: Test branchMatchRegex Action
on:
  pull_request:
    types: [opened, synchronize]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v2

      - name: Run branchMatchRegex action
        uses: IamPekka058/branchMatchRegex@v0.1.1
        with:
          regex: 'feature/*'
```

In this example, the action checks if the branch name matches the pattern `feature/*`.

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

<div align="center">
  <sub>Made with ❤️ in Bavaria</sub>
</div>