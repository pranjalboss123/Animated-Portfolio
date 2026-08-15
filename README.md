# AI Portfolio Design Handoff

Use these files with the Stitch design link and the resume.

## Recommended order

1. `STITCH_PROMPT.md` — paste into Stitch to generate the visual design.
2. Give the resulting Stitch design link to the coding agent.
3. `AI_IMPLEMENTATION_PLAN.md` — implementation rules and architecture.
4. `DESIGN_SYSTEM.md` — visual consistency rules.
5. `INTERACTION_SPEC.md` — animation and interaction behavior.
6. `CONTENT_DATA_SCHEMA.md` — structure for resume/project data.

## Coding-agent instruction

Treat the Stitch design as the visual source of truth. Treat the Markdown files as implementation constraints. Inspect the existing repository before changing anything.

When the resume is supplied, update the content/data layer rather than rewriting UI components around the resume.
