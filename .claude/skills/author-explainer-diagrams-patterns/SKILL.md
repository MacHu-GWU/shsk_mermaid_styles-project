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

A pattern file names a sibling only as a destination, never as a source of rules. `decision-tree.md` in the right hand column of the When Not To Use table is a forwarding address: the agent goes there instead, and holds one file at a time. That is routing, and the table should be generous with it.

What is banned is a pattern file describing how another pattern works. `A Role Map's solid arrows mean the box above owns the box below, and its dotted edges each carry their own label` is a copy of another file's rules living where nobody will maintain it, and it goes stale the moment that file changes. Every boundary can be drawn from the file's own side instead, because the thing that puts content in or out of a pattern is that pattern's own test. Write `if one word cannot fill the blank in X hands ___ to Y across every edge, this is not the pattern` and let the table say where to go.

The check is mechanical. Outside the When Not To Use table, a sibling's name should appear only in the shape `belongs in <file>.md` or `draw it as <file>.md`. If a sentence explains what the other pattern does with a shape, a color, an arrow, or a direction, cut it.

Keep it short. Count the prose with the mermaid blocks excluded:

```bash
awk '/^```/{f=!f; next} !f' <file> | wc -w
```

A pattern with two canonical examples, three bad ones, and no Reach section lands near 1,700 words and about 210 lines. `step-flow.md`, `triage-map.md`, and `proportion-pie.md` all sit there, so treat that as the floor for a finished file rather than a target to hit. A Reach section costs about 300 words, a required prose apparatus of bullets and sources costs a few hundred more, and a pattern carrying both runs to about 2,200.

Past that the file owes you a reason you can say out loud, and only three have one. `niche-map.md` and `role-map.md` are a matched pair whose whole point is a distinction between them, so each spends words drawing its own boundary sharply. `quadrant.md` carries a mandatory verdict table inside both examples, which is specimen rather than commentary. `working-backwards-chain.md` runs longest because its unit is two diagrams and every spine arrow owes the reader a bullet. Absent a reason of that kind, a file past 2,200 is over budget rather than thorough.

This is a smell test rather than a gate. A pattern file that runs long is usually doing one of four things: arguing instead of instructing, describing two patterns that should be split, spelling out what the shape and color tables already make obvious, or stating one rule in the rules section, again under an example, and a third time in the checklist. The checklist is meant to restate; the middle one is the redundancy to cut.

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
## 9. Canonical Example     copyable, correct, with its prose
## 10. Reach                only when section 4 below calls for it
## 11. Bad Examples         2 to 4, each with one line on what breaks
## 12. Prose Convention     what must be written above and below the diagram
## 13. Checklist            what to verify before shipping a diagram
```

Sections 4 through 8 are the rules and should be tight. Two to five lines each is normal. If one of them needs a long paragraph, the reason usually belongs in the visual grammar instead.

Sections 4, 5, and 7 are named for the flowchart vocabulary, and a pattern built on another Mermaid diagram type renames them for what it actually has: `Axis and Window` and `Ticks and Events` in Timeline, `Time and Lanes` and `Parties and Messages` in Exchange, `Axes` and `Verdicts and Points` in Quadrant. Keep the position and the number, change the noun. Section 7 is the one that goes missing, since these types offer no arrow choice, and a pattern-specific section takes the slot instead, as Quadrant's `Movement` does.

Section 12 is `Prose Convention` in every pattern, including the ones whose only requirement is the takeaway sentence, where it says so and states that nothing goes above the diagram. It carries one bolded paragraph per required piece, in the order the reader meets them: the sentence above, whatever bullets the pattern requires, then the takeaway last. The takeaway opens `The takeaway from this diagram is`, except where the pattern's unit is more than one diagram, which makes it `this pipeline` in IO Pipeline and `this pair` in Working Backwards Chain.

A pattern with two distinct forms (a short horizontal one and a long vertical one, for instance) gets two canonical examples. Otherwise one is enough. Number the sections straight through whatever you end up with, so a pattern with two examples and no Reach section runs 1 to 13 with nothing skipped.

### Canonical examples go inside a blockquote

Each canonical example is wrapped whole in one `>` blockquote, from its opening sentence through the mermaid block to its closing takeaway.

The reason is that a canonical example is not just a diagram. It carries the prose the pattern requires around a diagram, and that prose is ordinary paragraphs and bullets, indistinguishable at a glance from the pattern file's own voice. Without the quote a reader cannot tell which sentences are the specimen and which are the file explaining the specimen. The quote marks answer that question in the margin, with no words spent.

The line to cut on is whether the reader could copy it. Everything inside the quote is the deliverable. The file's own commentary about the example stays outside it, below the quote, which also stops that commentary from creeping back above the diagram where the pattern's own prose rules forbid it.

Below, never above. An unquoted lead-in between the section heading and the quote is the common slip, and it is the same mistake twice: it puts the file's voice where the specimen's scoping sentence belongs, and it puts a claim about the diagram in front of a reader who has not seen the diagram. `Three questions, four exits, and a trunk two answers long` reads fine underneath and reads as padding on top.

Bad examples are never quoted. They are the opposite of copyable, and the prose under each one is the file's critique rather than part of a specimen.

Blank lines inside the quote need their own `>`, or the blockquote breaks in two.

`check-mermaid` strips quote markers before matching a fence, so a quoted diagram is still parsed. This is worth knowing because the failure mode it prevents is silent: before that, a fence inside a blockquote matched nothing and a broken diagram was reported as `0 blocks, all good`.

---

## 4. Authoring A New Pattern

Read `ref/visual-grammar.md` first, in full. You are about to project from it, and you cannot project from something you have skimmed.

Decide what the pattern narrows. Pick the shapes it uses from the eight, the arrow forms from the four, the direction from the three, the colors from the four. A pattern that uses all of everything is not a pattern, it is the grammar with a title.

Separate the structure from the case you found it in. A name can smuggle in a **domain**, as Org Chart does with companies, or a **topology**, freezing the pattern into whatever silhouette it happened to have the first time. Test for both, and build the name from what the diagram claims rather than from what it looked like.

Niche Map paid for this. It shipped as Value Chain, where `Value` narrowed it to commerce and `Chain` narrowed it to a line, silently excluding any subject with three neighbors on one side. The domain trap is the obvious one. The topology trap is the expensive one, because the shapes, the limits, and both examples had all been written to a line, so it cost a rewrite rather than an edit.

Write the When To Use test with no domain nouns in it. `Every item has a date you could cite` travels; `the content is a company's recent moves` does not.

Stay inside the territory this library serves: the tech industry, professional and organizational life, business, startups, personal growth. An example about a harvest does not make a pattern more general, it makes it unreachable, since nobody here is drawing a harvest. Breadth comes from the unit of analysis instead — a person, a team, a company, a product, a market layer, a dataset, a protocol, a piece of content — and each of those makes a structurally different diagram. Draw the canonical examples at two of those scales, and put the one furthest from the pattern's name first, since whichever comes first is what readers pattern match against.

Add a Reach section only if generalizing from those examples is the hard part. Three things make it hard, and a pattern needs one of them: a name that points at a field, so outsiders stop at the title (Niche Map, IO Pipeline, Role Map); a diagram type that looks like it belongs to software, so the shape reads as narrower than it is (Exchange, State Lifecycle, Quadrant); or a unit of more than one diagram, so the whole example budget goes to a single subject and the second scale never gets drawn (Working Backwards Chain).

Absent all three, skip it. Step Flow's readers already know their own procedures are procedures, and ten bullets restating that teach them your sections are padding. Timeline, Cycle, Decision Tree, Triage Map, and Proportion Pie ship without one for the same reason.

Reach is ten bullets, no diagrams, after the examples and before the bad ones. Each names a case, says what the boxes are there, and fills the blank the test asks about, in one line, and the last one points back at the test as the only thing deciding membership. Ten is deliberate: three reads as a list of whatever you worked on that week, and ten cannot be filled without changing scale. It widens subject matter and nothing else, so a pattern frozen into one silhouette needs a rename or a second example with a different shape, not a longer list.

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
