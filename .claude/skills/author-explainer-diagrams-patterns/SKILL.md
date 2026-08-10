---
name: author-explainer-diagrams-patterns
description: Author or revise the diagram pattern files shipped by the mermaid-styles plugin, under explainer-diagrams/ref/patterns/. Use when adding a new pattern, revising an existing one, or changing the shared visual grammar those patterns are projected from.
argument-hint: "[pattern-name]"
allowed-tools: Bash(mise run check-mermaid*) Bash(mise tasks*)
---

Target pattern: $ARGUMENTS

If no target is given, list `.claude/skills/mermaid-styles/skills/explainer-diagrams/ref/patterns/` to see what exists, then ask which pattern to author or revise.

---

## 1. What This Skill Maintains

Two locations, and the split between them is the whole point.

| Location | Role |
| :--- | :--- |
| `.claude/skills/author-explainer-diagrams-patterns/ref/visual-grammar.md` | The shared alphabet. Author time only. Never ships, never loads at draw time |
| `.claude/skills/mermaid-styles/skills/explainer-diagrams/ref/patterns/*.md` | The shipped patterns. Each one fully self contained |

Think of it as compile time and run time. `visual-grammar.md` is the source of truth you consult while writing a pattern file. The pattern file is the compiled output. Once a hex value is written into `step-flow.md`, the consistency is baked in, and the agent that later reads `step-flow.md` to draw a diagram has no reason to know where that value came from.

This is why patterns do not inherit. At draw time an agent needs exactly one pattern file. Handing it the full grammar means handing it five shapes it must not use, four arrow forms it must not use, and two directions it must not use, right before telling it not to use them. The shared vocabulary is not a runtime dependency, it is an authoring discipline, and this skill is where that discipline lives.

---

## 2. The Self Containment Contract

This is the rule set that makes a pattern file shippable. Every one of these is checkable.

A pattern file never mentions the visual grammar. Not by filename, not as "the baseline", not as "the global rules", not as "inherited", not as "this overrides". A reader who has never heard of `visual-grammar.md` must be able to follow the file start to finish and produce a conforming diagram.

Every shape the pattern uses is written out in full, with its `@{ shape: ... }` syntax, in the pattern file. Shapes the pattern does not use go unmentioned, with one exception: when a ban is load bearing, state the ban as this pattern's own rule. `Step Flow has no diamonds` is correct. `The baseline diamond rule applies here too` is not, because it points at a document the reader does not have.

Every color the pattern uses is written out as a complete `classDef` line with literal hex values, all three of `fill`, `stroke`, and `color`. Never write "use the accent color". The agent is going to copy that line into a diagram, so the line has to be there.

State rules, do not argue them. `Green marks the start, red marks the end` is an instruction. `Green normally means goal, but here it is re-bound to the start because a procedure has no goal` is a design discussion, and it belongs in section 4 of `visual-grammar.md` where the author will read it. The consumer does not need to be persuaded, only to comply. This is where most of the length savings come from.

References to other pattern files are allowed and wanted. `Use Decision Tree instead (decision-tree.md)` sends the agent to a different self contained file rather than asking it to hold two files at once. That is routing, not inheritance, and the When Not To Use table should be generous with it.

Keep it short. The budget is roughly 1,400 words of prose, counted with the mermaid blocks excluded, which lands a finished file around 220 lines. `step-flow.md` sits at that size with two canonical examples and three bad ones, so treat it as the reference for how much room a pattern actually needs.

```bash
awk '/^```/{f=!f; next} !f' <file> | wc -w
```

This is a smell test rather than a gate. A pattern file that runs long is usually doing one of three things: arguing instead of instructing, describing two patterns that should be split, or spelling out what the shape and color tables already make obvious.

---

## 3. The Pattern File Skeleton

Every pattern file uses these sections in this order, numbered as H2 with `---` between them, so an agent that has read one pattern file can navigate any other one without looking.

```markdown
# <Pattern Name>

## 1. What It Is            one paragraph, what the shape of the diagram says
## 2. When To Use           the test that identifies this content
## 3. When Not To Use       table routing to sibling patterns
## 4. Direction             LR, TD, or RL, and the rule for choosing
## 5. Shapes                only the shapes this pattern uses, with syntax
## 6. Color                 full classDef lines, and the highlight budget
## 7. Arrows                which arrow forms are legal here
## 8. Length                the floor, and where to split
## 9. Canonical Example     copyable, correct, with its caption sentence
## 10. Reach                only when section 4 below calls for it
## 11. Bad Examples         2 to 4, each with one line on what breaks
## 12. Caption Convention   the sentence that goes under the diagram
## 13. Checklist            what to verify before shipping a diagram
```

Sections 4 through 8 are the rules and should be tight. Two to five lines each is normal. If one of them needs a long paragraph, the reason usually belongs in the visual grammar instead.

A pattern with two distinct forms (a short horizontal one and a long vertical one, for instance) gets two canonical examples. Otherwise one is enough. Number the sections straight through whatever you end up with, so a pattern with two examples and no Reach section runs 1 to 13 with nothing skipped.

### Canonical examples go inside a blockquote

Each canonical example is wrapped whole in one `>` blockquote, from its opening sentence through the mermaid block to its closing takeaway.

The reason is that a canonical example is not just a diagram. It carries the prose the pattern requires around a diagram, and that prose is ordinary paragraphs and bullets, indistinguishable at a glance from the pattern file's own voice. Without the quote a reader cannot tell which sentences are the specimen and which are the file explaining the specimen. The quote marks answer that question in the margin, with no words spent.

The line to cut on is whether the reader could copy it. Everything inside the quote is the deliverable. The file's own commentary about the example stays outside it, below the quote, which also stops that commentary from creeping back above the diagram where the pattern's own prose rules forbid it.

Bad examples are never quoted. They are the opposite of copyable, and the prose under each one is the file's critique rather than part of a specimen.

Blank lines inside the quote need their own `>`, or the blockquote breaks in two.

`check-mermaid` strips quote markers before matching a fence, so a quoted diagram is still parsed. This is worth knowing because the failure mode it prevents is silent: before that, a fence inside a blockquote matched nothing and a broken diagram was reported as `0 blocks, all good`.

---

## 4. Authoring A New Pattern

Read `ref/visual-grammar.md` first, in full. You are about to project from it, and you cannot project from something you have skimmed.

Decide what the pattern narrows. Pick the shapes it uses from the eight, the arrow forms from the four, the direction from the three, the colors from the four. A pattern that uses all of everything is not a pattern, it is the grammar with a title.

Separate the structure from the case you found it in. Every pattern here was noticed in one real piece of writing, and the name tends to keep that origin. The pattern is the structural test in section 2; everything else about where you first saw it is an accident.

Test the name against both kinds of accident, because it can smuggle in either. **A domain**: Org Chart sounds like it is about companies, Timeline like it is about a press release archive, and neither is. **A topology**: a name that describes what the diagram looked like the first time freezes it into that silhouette.

Niche Map has already paid for this lesson. It shipped its first draft as Value Chain, and the name did both kinds of damage at once. `Value` narrowed it to commerce. `Chain` narrowed it to a line, which silently excluded every subject with three neighbors on one side, and that half cost a rewrite rather than an edit, because the shapes section, the length limits, and both canonical examples had all been written to a line. The domain trap is the obvious one. The topology trap is the expensive one.

A name that survives both is built from what the diagram claims rather than from what it happened to look like. If you cannot find one, the structural test is probably not settled yet, and naming it is not the step you are actually on.

Write the When To Use test with no domain nouns in it. `Every item has a date you could cite` travels; `the content is a company's recent moves` does not. Then draw the canonical examples at two different scales, an individual and an organization, or a single system and a whole market, and put the one furthest from the pattern's name first, since whichever comes first is what readers pattern match against.

Stay inside the territory this library serves. That is the tech industry, professional and organizational life, business, startups, and personal growth. Everything shipped from here is a tutorial, an explainer, or a design doc, and every diagram in it will be about a company, a team, a role, a product, a system, a market, or a person building something. A pattern is not made more general by an example about a harvest or a court filing. It is made unreachable, because nobody reading this library is drawing a harvest, and an example nobody can use is an example nobody finishes reading.

Breadth comes from the unit of analysis instead. Inside that one territory sit a person, a team, a company, a product, a whole market layer, a dataset, a protocol, a document, a piece of content, an audience, and each of those makes a structurally different diagram. Spreading across those is what stops a pattern from looking like it only fits the one case you had in hand. Spreading across industries only proves a point nobody was arguing about.

Then decide whether the pattern needs a Reach section. Reach is ten bullets, no diagrams, sitting after the canonical examples and before the bad ones, each naming a case, saying what the boxes are there, and filling the blank the test asks about, in one line. Close by pointing back at the test as the only thing that decides membership. Ten is deliberate: three reads as a list of whatever you were working on that week, and ten cannot be filled without changing the scale you are looking at.

The question that decides it is whether a reader who has the right content will recognize it from the examples alone. Most patterns need no help. Step Flow's examples are procedures and every reader already knows their own procedures are procedures; Timeline's are dated events and nobody has to be told that their own dates qualify. Generalizing from one example to your own case is ordinary reading, and a Reach section there is ten bullets spent restating the obvious, which teaches the reader that this file's sections are padding.

Write one only when generalizing is the hard part, which happens for two reasons. **The name points at a field**, so a reader outside that field stops at the title. **The examples cannot cover the ground**, usually because the pattern's unit is more than one diagram and the whole example budget goes to a single subject. Niche Map has the first problem. Working Backwards Chain has the second: its unit is a pair over identical nodes, so both examples are locked to one subject no matter how much room the file has.

Reach is a remedy for domain narrowness specifically, because a list of fields is all it is. It cannot fix a name or a canonical example that has frozen the pattern into one silhouette — ten fields will not turn a line into a star. That is what a rename, or a second canonical example with a different shape, is for. Niche Map carries both remedies and they are doing different jobs: section 11 widens the subject matter, section 10 widens the topology.

Decide what it deviates on, and be honest about it. A deviation is any place the pattern uses a piece of the vocabulary to mean something the grammar assigns elsewhere, or loosens a limit the grammar sets. Deviations are allowed when the pattern has a real reason. They are not allowed silently, because the next pattern you write needs to know that red is already spoken for in a Step Flow.

Say every deviation out loud in the chat before writing it into the file. Name the grammar rule, name what the pattern wants instead, and say what it costs. `The grammar binds red to risk. This pattern wants red for the end terminal, which works only because a Step Flow never contains a risk node.` Then let the user decide. This is information, not a request for approval, so do not stall on it, but do not bury it in the file either. A deviation the user never saw is how a closed vocabulary quietly stops being closed.

Write the file to the skeleton, obeying section 2 throughout.

Record the deviation in `ref/visual-grammar.md` section 10, one row per deviation, with the reason. That table is the only place the whole picture exists once the pattern files stop referencing anything.

Validate before calling it done:

```bash
mise run check-mermaid .claude/skills/mermaid-styles
```

Every fenced mermaid block in the file must parse, including the bad examples. A bad example demonstrates a style violation, never a syntax error. If a bad example fails to parse, it is teaching the wrong lesson and the reader will blame the parser instead of the style.

---

## 5. Changing The Visual Grammar

This is the expensive direction, and it is expensive on purpose.

Nothing propagates. Pattern files hold literal copies, so editing a hex value or a shape name in `visual-grammar.md` changes nothing that ships until you go and edit every pattern file that used it. Treat a grammar edit as a two step operation, and never do the first step alone.

```bash
rg -n '#FFF3CD' .claude/skills/mermaid-styles/skills/explainer-diagrams/ref/patterns/
```

Grep for the literal value being changed, update every hit, then re-run `check-mermaid`. Then re-read the deviation register, because a grammar change can turn an existing deviation into agreement, or into a new conflict.

The upside of paying this cost is that it forces the question of whether the change is worth making across ten files. Most cosmetic changes fail that test, which is the correct outcome for a library whose value is that it does not drift.

---

## 6. What Not To Put In A Pattern File

Design rationale, alternatives considered, and the history of a decision. These are worth writing down, but they belong in `ref/visual-grammar.md`, where the next author will read them.

Anything about the plugin, the skill loading model, or how the files relate to each other. The pattern file is read by an agent mid task that has already decided what to draw.

Hedges. `Usually`, `generally`, and `where appropriate` invite exactly the freelancing the closed library exists to prevent. Where a judgment call is genuinely required, say so explicitly and give the reader the test to apply, as in `if you are unsure, go vertical`.
