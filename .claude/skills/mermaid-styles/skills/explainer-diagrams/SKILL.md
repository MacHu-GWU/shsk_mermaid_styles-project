---
name: explainer-diagrams
description: Draws Mermaid diagrams from a closed library of canonical patterns. Use when writing a blog post, tutorial, explainer, or design doc and a diagram would carry a structure better than prose, or when a Mermaid diagram is requested.
---

# Explainer Diagrams

A diagram here is not decoration and not free drawing. Each one is an instance of a named pattern, and the pattern fixes the shapes, the direction, the arrow forms, the colors, and the size before you write a line of Mermaid. That is what makes a dozen diagrams across a dozen articles read as one hand.

The library is closed. Pick from the catalog below or draw nothing.

---

## How To Use This Skill

**Name the structure first, not the diagram type.** Ask what shape the *thought* has: is it an order, a branch, a ring, a set of positions, a history? The answer selects the row. Reaching for "a flowchart" before answering that is how every diagram ends up as generic boxes and arrows.

**Match exactly one row in the catalog.** Then read that pattern file in full before drawing. Each file is self-contained and complete: it carries its own shapes with syntax, its own `classDef` lines with literal hex values, its own limits, and copyable examples. Follow it literally, including its bans. Where it disagrees with your instinct about what would look good, it wins.

**Read one file, not several.** The pattern files do not inherit from each other and are not meant to be combined. If a file's When Not To Use table routes you elsewhere, go there and read that file instead.

**Write the prose the pattern requires.** Every pattern demands at least a takeaway sentence under the diagram, and most require a scoping sentence above it. A diagram shipped bare is incomplete, not merely terse.

**Check that it parses** before it ships. A diagram with a syntax error does not degrade gracefully; GitHub replaces it with a red error box, which is worse than no diagram, and the failure is invisible in the markdown source.

---

## Catalog

| The content is | Pattern |
| :--- | :--- |
| Steps in order, one path through, no branching | `ref/patterns/step-flow.md` |
| Steps whose handovers have names, where something consumes what an earlier step made | `ref/patterns/io-pipeline.md` |
| A plan whose credibility rests on being derived backwards from a goal | `ref/patterns/working-backwards-chain.md` |
| Questions asked in a fixed order, each answer earning the next | `ref/patterns/decision-tree.md` |
| One question, peer cases, each going straight to its own response | `ref/patterns/triage-map.md` |
| Named conditions a thing moves between, with at least one way back | `ref/patterns/state-lifecycle.md` |
| Conditions that drive each other in a closed ring, compounding each turn | `ref/patterns/cycle.md` |
| Parties taking turns, with at least one reply flowing back | `ref/patterns/exchange.md` |
| One subject and the positions around it, with one thing flowing one way | `ref/patterns/niche-map.md` |
| One role, who it answers to, and who it works with | `ref/patterns/role-map.md` |
| Comparable items judged on two independent axes of degree | `ref/patterns/quadrant.md` |
| Events, each with a date you could cite | `ref/patterns/timeline.md` |
| Shares of one nameable whole | `ref/patterns/proportion-pie.md` |

Rows are ordered so the pairs that get confused sit next to each other. When two rows both look plausible, open either file and read its When Not To Use table, which is written to settle exactly that.

---

## When Nothing Matches

No row fitting is a real answer and often the right one.

Do not stretch the nearest pattern to cover it, and do not fall back on an unstyled flowchart. Both produce the generic boxes and arrows this library exists to replace, and one off-grammar diagram costs the reader the decoding ability that every conforming diagram was building.

Write the prose instead, and say plainly that the content has no pattern. Two boxes and an arrow between them is a sentence, so write the sentence.
