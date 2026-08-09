# Project Guide for AI Assistants

This document guides AI assistants on how to navigate and work with this project.

## Project Overview

**What this project does:** This repo defines my own opinionated Mermaid visual style guide — a closed library of canonical diagram patterns with locked-in node shapes, flow directions, arrow semantics, and complexity limits, so that every diagram across my tutorials, explainers, and design docs reads as one recognizable system rather than a pile of generic boxes and arrows. The spec ships as the `mermaid-styles` Claude Code plugin under `.claude/skills/mermaid-styles/`; the Python package is only supporting tooling.

**Project type:** Claude Code plugin (spec lives in `.claude/skills/`) + Python package

## Core Configuration Files

### Tool & Dependency Management
- `mise.toml` - Task runner and tool version management (Python 3.12, uv, claude, node, mermaid)
- `pyproject.toml` - Python dependencies and package metadata
- `.venv/` - Virtual environment directory (created by uv)

Use `mise ls python --current` to see the exact Python version in use.

All dependencies, including the JavaScript ones, are declared in `mise.toml`. There is no `package.json` and no `node_modules` in this repo, and none should be added. `mermaid` and `jsdom` are installed through mise's npm backend, and `mise install` is all anyone needs to run.

### CI/CD & Testing
- `.github/workflows/main.yml` - GitHub Actions CI workflow
- `codecov.yml` + `.coveragerc` - Code coverage reporting (codecov.io)
- `.readthedocs.yml` - Documentation hosting (readthedocs.org)

### Documentation
- `docs/source/` - Sphinx documentation source files
- `docs/source/conf.py` - Sphinx configuration

## Development Workflow

### Task Management
List all available tasks:
```bash
mise tasks ls
```

Run a specific task:
```bash
mise run ${task_name}
```

**Key tasks:**
- `inst` - Install all dependencies using uv (fast package manager)
- `cov` - Run unit tests with coverage report
- `build-doc` - Build Sphinx documentation
- `check-mermaid` - Validate mermaid syntax in markdown files

For complete task reference, run `mise run list-tasks` to generate `.claude/mise-tasks.md`.

### Validating Mermaid Diagrams

**This is a hard rule. Any time you write or edit a ```mermaid block in any `.md` file, run this before you call the work done:**

```bash
mise run check-mermaid
```

It scans every markdown file in the repo, or you can narrow it to a path:

```bash
mise run check-mermaid .claude/skills/mermaid-styles
mise run check-mermaid docs/source/some-page.md
```

The whole repo takes about two seconds. Exit code is 0 when every block parses and 1 when any block fails, so it works unmodified in CI. Failures print as `path/to/file.md:42` followed by the parser error, which is directly clickable.

Never publish a diagram you have not run through this. A diagram with a syntax error does not degrade gracefully. GitHub replaces it with a red error box, which is worse than having no diagram at all, and the failure is invisible in the markdown source.

**What it does and does not check.** It runs the real Mermaid parser, the same one GitHub uses, so it catches typos, malformed edges, and invalid shape names such as `@{ shape: dbl-circle }` (the real name is `dbl-circ`). It says nothing about style. The deliberately wrong "bad example" diagrams in `.claude/skills/mermaid-styles/` are valid Mermaid that violates the visual grammar on purpose, and they are expected to pass. Conformance to the visual grammar is still a human judgment, guided by `ref/00-visual-grammar.md`.

**How it works**, in case it ever breaks. `.mise/mermaid/validate.mjs` extracts fenced mermaid blocks and feeds them to `mermaid.parse()`. No browser is involved, because Mermaid's parser is plain JavaScript and `jsdom` supplies the DOM globals it expects. Rendering to an image is the part that would need a real browser, and this task does not render.

The two npm packages are libraries rather than CLIs, so they cannot be run in the `uvx` or `npx` one-shot style. `npx` only puts a package's *command line entry point* on PATH, and the `mermaid` package ships no command. Instead they are declared in `mise.toml` under `[tools]`, and the task points `NODE_PATH` at their mise install prefixes. If the script reports that it cannot find a package, the fix is `mise install`.

### Testing Philosophy
This project uses **pytest** with a special pattern that allows running individual test files as standalone scripts.

**Example:** See `tests/test_api.py` - the `if __name__ == "__main__":` block demonstrates this pattern. It runs pytest as a subprocess with coverage tracking for the specific module, enabling quick isolated testing during development.

## Working with This Project

**Approach:**
1. Don't load entire files unnecessarily - read specific files only when needed
2. Use task commands (`mise run`) instead of direct tool invocation
3. Follow the testing pattern when creating new test files
4. Reference configuration files for specific settings rather than assuming defaults

**Tools in use:**
- **mise-en-place** - Development tool management
- **uv** - Fast Python package management
- **pytest** - Unit testing framework
- **sphinx** - Documentation generation
- **mermaid** - Diagram syntax validation via `mise run check-mermaid`
