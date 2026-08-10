.. _release_history:

Release and Version History
==============================================================================


x.y.z (Backlog)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
**Features and Improvements**

**Minor Improvements**

**Bugfixes**

**Miscellaneous**


0.1.1 (2026-08-09)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
**Features and Improvements**

- First release of the ``mermaid-styles`` Claude Code plugin.
- Add the ``explainer-diagrams`` skill. It turns a piece of explanatory writing
  into a Mermaid diagram drawn from a closed library of canonical patterns.
  The skill body is deliberately thin: it names the shape of the content,
  points at exactly one pattern file, and states that drawing nothing is a
  valid answer when no pattern fits.
- Ship 13 self-contained pattern files under
  ``skills/explainer-diagrams/ref/patterns/``. Each one fixes its own node
  shapes, direction, arrow forms, ``classDef`` colors with literal hex values,
  complexity limits, and required prose, and carries copyable canonical
  examples alongside annotated bad ones:

  - ``step-flow.md`` — steps in order, one path through, no branching.
  - ``io-pipeline.md`` — steps whose handovers have names, drawn one block per step.
  - ``working-backwards-chain.md`` — a plan derived backwards from a goal, drawn as a mirrored pair.
  - ``decision-tree.md`` — questions asked in a fixed order, each answer earning the next.
  - ``triage-map.md`` — one question, peer cases, each going straight to its own response.
  - ``state-lifecycle.md`` — named conditions a thing moves between, with at least one way back.
  - ``cycle.md`` — conditions that drive each other in a closed ring, compounding each turn.
  - ``exchange.md`` — parties taking turns, with at least one reply flowing back.
  - ``niche-map.md`` — one subject and the positions around it, with one thing flowing one way.
  - ``role-map.md`` — one role, who it answers to, and who it works with.
  - ``quadrant.md`` — comparable items judged on two independent axes of degree.
  - ``timeline.md`` — events, each with a date you could cite.
  - ``proportion-pie.md`` — shares of one nameable whole.

**Miscellaneous**

- Add ``mise run check-mermaid``, which extracts every fenced ``mermaid`` block
  from the repository's markdown and parses it with the real Mermaid parser, so
  a diagram that would render as a red error box on GitHub fails before it
  ships.
- Add the ``author-explainer-diagrams-patterns`` skill and its
  ``visual-grammar.md``, the author-time vocabulary the shipped patterns are
  projected from. Neither is part of the plugin.
