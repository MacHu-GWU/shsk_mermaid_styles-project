#!/usr/bin/env node
/**
 * Validate every fenced ```mermaid block found in markdown files.
 *
 * This runs the real Mermaid parser (the same one GitHub uses), so a diagram
 * that passes here will render instead of turning into a red error box. No
 * browser is involved: Mermaid's parser is plain JavaScript, and jsdom supplies
 * the handful of DOM globals it expects. A few hundred blocks take about a
 * second.
 *
 * It checks SYNTAX only, and says nothing about style. The deliberately wrong
 * "bad example" diagrams in .claude/skills/mermaid-styles/ are valid Mermaid
 * that breaks the visual grammar on purpose, and they must keep passing.
 *
 * Dependencies come from mise, not from a local node_modules. `mermaid` and
 * `jsdom` are declared in mise.toml under [tools] using the npm backend, and
 * the mise task points NODE_PATH at their install prefixes. Run it through
 * `mise run check-mermaid` rather than calling node directly.
 *
 * Usage:
 *   node validate.mjs                 # walk the current directory
 *   node validate.mjs a.md docs/      # only these files and directories
 *
 * Exits 0 when every block parses, 1 when any block fails, 2 on bad usage.
 */

import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { pathToFileURL } from 'node:url'

const SKIP_DIRS = new Set([
  '.git',
  '.idea',
  '.pytest_cache',
  '.venv',
  '__pycache__',
  'build',
  'dist',
  'htmlcov',
  'node_modules',
])

const require = createRequire(import.meta.url)

/**
 * Resolve a dependency that mise installed outside this directory.
 *
 * NODE_PATH is honoured by CommonJS resolution but ignored by ESM `import`,
 * so we resolve the path with require.resolve and then import that absolute
 * path. This is what lets the script live in the repo with no package.json.
 */
async function loadDependency(name) {
  let resolved
  try {
    resolved = require.resolve(name)
  } catch {
    console.error(
      [
        `error: cannot find the '${name}' package.`,
        '',
        'This script expects mise to provide it. Try:',
        '',
        '    mise install',
        '    mise run check-mermaid',
        '',
        `If you are calling node directly, NODE_PATH must include the mise install prefix:`,
        `    NODE_PATH="$(mise where npm:${name})/lib/node_modules"`,
      ].join('\n'),
    )
    process.exit(2)
  }
  return import(pathToFileURL(resolved).href)
}

/** Recursively collect markdown files from a file or directory path. */
function collectMarkdown(target, out) {
  if (fs.statSync(target).isFile()) {
    if (/\.(md|markdown)$/i.test(target)) out.push(target)
    return out
  }
  for (const entry of fs.readdirSync(target, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue
      collectMarkdown(path.join(target, entry.name), out)
    } else if (entry.isFile() && /\.(md|markdown)$/i.test(entry.name)) {
      out.push(path.join(target, entry.name))
    }
  }
  return out
}

/**
 * Extract mermaid blocks from markdown source.
 *
 * Fence state is tracked properly so that a ```mermaid sample shown inside a
 * wider ````markdown fence counts as documentation rather than as a diagram to
 * parse. Returns [{ startLine, code }] with 1 based lines pointing at the
 * opening fence.
 */
function extractMermaidBlocks(source) {
  const blocks = []
  let open = null

  source.split('\n').forEach((line, index) => {
    const match = /^(\s*)(`{3,}|~{3,})\s*(\S*)/.exec(line)
    if (open === null) {
      if (match) {
        open = {
          marker: match[2][0],
          length: match[2].length,
          lang: match[3].toLowerCase(),
          startLine: index + 1,
          body: [],
        }
      }
      return
    }
    const isClose =
      match && match[2][0] === open.marker && match[2].length >= open.length && match[3] === ''
    if (isClose) {
      if (open.lang === 'mermaid') {
        blocks.push({ startLine: open.startLine, code: open.body.join('\n') })
      }
      open = null
    } else {
      open.body.push(line)
    }
  })

  return blocks
}

/** Install the minimal browser globals Mermaid's parser expects. */
async function loadMermaid() {
  const { JSDOM } = await loadDependency('jsdom')
  const dom = new JSDOM('<!DOCTYPE html><body></body>', { pretendToBeVisual: true })
  global.window = dom.window
  global.document = dom.window.document
  global.HTMLElement = dom.window.HTMLElement
  global.SVGElement = dom.window.SVGElement
  Object.defineProperty(global, 'navigator', {
    value: dom.window.navigator,
    configurable: true,
  })

  const { default: mermaid } = await loadDependency('mermaid')
  mermaid.initialize({ startOnLoad: false, securityLevel: 'loose' })
  return mermaid
}

async function main() {
  const args = process.argv.slice(2).filter((a) => a !== '')
  const targets = args.length > 0 ? args : ['.']

  const files = []
  for (const target of targets) {
    if (!fs.existsSync(target)) {
      console.error(`error: no such file or directory: ${target}`)
      process.exit(2)
    }
    collectMarkdown(target, files)
  }

  const mermaid = await loadMermaid()

  let totalBlocks = 0
  let failed = 0
  let filesWithBlocks = 0

  for (const file of files.sort()) {
    const rel = path.relative(process.cwd(), file) || file
    const blocks = extractMermaidBlocks(fs.readFileSync(file, 'utf8'))
    if (blocks.length === 0) continue

    filesWithBlocks++
    const failures = []
    for (const block of blocks) {
      totalBlocks++
      try {
        await mermaid.parse(block.code)
      } catch (error) {
        failed++
        failures.push({ block, message: String(error?.message ?? error).trim() })
      }
    }

    const plural = blocks.length === 1 ? '' : 's'
    if (failures.length === 0) {
      console.log(`ok    ${rel} (${blocks.length} block${plural})`)
      continue
    }

    console.log(`FAIL  ${rel} (${failures.length} of ${blocks.length} block${plural} failed)`)
    for (const { block, message } of failures) {
      const first = block.code.split('\n').find((l) => l.trim() !== '') ?? ''
      console.log(`      ${rel}:${block.startLine}  ${first.trim()}`)
      for (const line of message.split('\n')) {
        console.log(`          ${line}`)
      }
    }
  }

  const summary =
    `${totalBlocks} mermaid block${totalBlocks === 1 ? '' : 's'} in ` +
    `${filesWithBlocks} file${filesWithBlocks === 1 ? '' : 's'}, ${failed} failed`
  console.log(failed === 0 ? `\nAll good. ${summary}.` : `\n${summary}.`)
  process.exit(failed === 0 ? 0 : 1)
}

await main()
