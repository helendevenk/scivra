---
name: d4-ap-bio-code-mapping
description: Authoritative source mapping for AP Bio standard codes added to 4 slugs in Phase D
type: report
created: 2026-05-04T00:00:00Z
updated: 2026-05-04T00:00:00Z
---

# D4 AP Bio Code Mapping (CED Effective Fall 2025)

**Source:** College Board AP Biology Course and Exam Description (CED), effective Fall 2025 (the 2024-published current edition).
**Source URL:** https://apcentral.collegeboard.org/media/pdf/ap-biology-course-and-exam-description-effective-fall-2025.pdf
**Verification:** Codex (gpt-5-codex / account-default model) sample audit, 2026-05-04. Initial candidate codes were derived from CED PDF text + 4 secondary sources (Exa search), then refined per codex review of unit-topic-LO scope.

## Mappings

### ecological-succession
- **Codes:** `["8.5.B"]`
- **CED location:** Unit 8 (Ecology), Topic 5 (Community Ecology), LO B — community changes via population interactions including succession.
- **Justification:** The 2024 AP Bio CED has no separate "primary/secondary succession" LO. Topic 8.5.B covers community-level changes resulting from population interactions and is the closest direct match to the experiment's content (pioneer → intermediate → climax community over time).
- **Codex review:** FLAGGED initial candidate `["8.5.A", "8.5.B"]` → corrected to `["8.5.B"]` (8.5.A is a different LO within Topic 5, not succession-specific).

### population-dynamics
- **Codes:** `["8.3.A", "8.4.A", "8.5.B"]`
- **CED location:** Unit 8 (Ecology), Topics 3 (Population Ecology — exponential/logistic growth, K), 4 (Density-dependent vs density-independent factors), and 5 (predator/prey via community interactions).
- **Justification:** The Lotka-Volterra simulation spans exponential/logistic growth (8.3.A), carrying capacity and density factors (8.4.A), and predator-prey interactions which the CED covers under community ecology (8.5.B).
- **Codex review:** FLAGGED initial candidate `["8.3.A", "8.4.A"]` → corrected to add `8.5.B` for predator-prey scope.

### hardy-weinberg
- **Codes:** `["7.5.A"]`
- **CED location:** Unit 7 (Natural Selection), Topic 5 (Hardy-Weinberg Equilibrium), LO A — apply the Hardy-Weinberg equation and conditions.
- **Justification:** Direct topic match. The slug models p² + 2pq + q² = 1 with HW conditions, which is the explicit content of LO 7.5.A.
- **Codex review:** VERIFIED.

### cellular-respiration-detail
- **Codes:** `["3.5.A", "3.5.B"]`
- **CED location:** Unit 3 (Cellular Energetics), Topic 5 (Cellular Respiration), LOs A (mitochondrial structure and overall respiration) and B (glycolysis, Krebs cycle, electron transport chain energy capture).
- **Justification:** The slug models the electron transport chain, ATP synthase, and Complexes I-IV in detail, which 3.5.B covers; 3.5.A grounds the mitochondrial structure context.
- **Codex review:** FLAGGED initial candidate `["3.5.A"]` → corrected to add `3.5.B` for ETC/glycolysis/Krebs detail.

## Methodology

1. Old EK codes (e.g., `EVO-1.K`, `2.A.2`) were invalidated by the AP Biology CED redesign published 2024 (effective Fall 2025). Fix B (PR #30) cleared these.
2. Initial candidate codes were derived from a Jina Reader fetch of the CED PDF + 4 secondary-source Exa searches.
3. Codex (with account-default model — gpt-5/gpt-5-codex were not available on the ChatGPT account, so the default codex model was used) reviewed each mapping against its CED knowledge.
4. Codex's flagged corrections were applied verbatim. Total: 3 of 4 slugs received scope adjustments; 1 (hardy-weinberg) was already verified correct.
5. No code was applied without explicit codex VERIFIED or FLAGGED-with-correction status.

## Caveats

- The user's preferred codex review model (`gpt-5`) was not available on this ChatGPT account. Account-default model was used (codex returned VERIFIED/FLAGGED with high stated confidence and a direct citation to the official CED PDF URL).
- College Board may publish minor amendments to the CED between editions; these mappings should be re-verified before any major catalog release.
