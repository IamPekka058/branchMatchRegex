# Default Branch Patterns

These default branch patterns are used for automated validation of branch names
in GitHub Actions workflows. They follow common branch naming conventions and
are compatible with tools like branchMatchRegex.

## Usage

- The patterns can be used directly in YAML configuration files or as input for
  GitHub Actions.
- They help standardize branch names and enable automated checks.
- The list can be extended or customized as needed.

## Standard Patterns (YAML list)

```yaml
patterns:
  - feature/*
  - fix/*
  - hotfix/*
  - docs/*
  - test/*
  - refactor/*
  - style/*
  - ci/*
  - perf/*
  - i18n/*
  - security/*
  - release/*
  - chore/*
  - dependabot/*
  - renovate/*
```

## Pattern Descriptions

| Prefix        | Gitmoji | Description                                      | Example                                |
| ------------- | ------- | ------------------------------------------------ | -------------------------------------- |
| `feature/`    | ✨      | New features or major functionality enhancements | `feature/user-authentication`          |
| `fix/`        | 🐛      | Bug fixes, error corrections                     | `fix/crash-on-startup`                 |
| `hotfix/`     | 🚑️      | Critical or urgent bug fixes                     | `hotfix/login-failure`                 |
| `docs/`       | 📝      | Documentation changes                            | `docs/api-usage-guide`                 |
| `test/`       | 🧪      | Adding or updating tests                         | `test/user-service-tests`              |
| `refactor/`   | ♻️      | Refactoring without changing functionality       | `refactor/database-layer`              |
| `style/`      | 🎨      | UI/UX improvements or code formatting            | `style/button-alignment`               |
| `ci/`         | ⚙️      | CI/CD or automation changes                      | `ci/update-pipeline`                   |
| `perf/`       | ⚡️      | Performance optimizations                        | `perf/cache-optimization`              |
| `i18n/`       | 🌍      | Internationalization, translations               | `i18n/add-french-language`             |
| `security/`   | 🔒️      | Security-related changes                         | `security/fix-token-leak`              |
| `release/`    | 📦      | Release preparation or management                | `release/v2.1.0`                       |
| `chore/`      | 🛠️      | Maintenance, dependencies, tooling               | `chore/update-eslint`                  |
| `dependabot/` | 🤖      | Automated dependency updates (Dependabot)        | `dependabot/npm_and_yarn/axios-0.21.1` |
| `renovate/`   | 🤖      | Automated dependency updates (Renovate Bot)      | `renovate/update-packages`             |
