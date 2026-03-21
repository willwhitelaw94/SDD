---
title: "Linear Lisa — Research Notes"
---

# Research: Linear UI Patterns for Risk Radar

## Pattern 1: Single-Column Card Lists with Inline Expansion

Linear's issue list is a single-column stream of cards. Each card shows just enough metadata (status dot, assignee avatar, priority icon, label chips) to triage without opening. Clicking a card doesn't navigate — it expands inline or slides open a detail panel. This keeps the user anchored in their list context.

**Application to Risk Radar:** Each risk category becomes a card in a single-column list. Status badges (Care Plan, Generated), consequence level, and last-updated date sit on the card surface. The check-in questions accordion expands inline — the user never leaves the list. This eliminates the back-and-forth of table-row-to-detail-page navigation that clinical users currently endure.

## Pattern 2: Keyboard-First Command Palette (Cmd+K)

Linear's command palette is the primary navigation surface. Users press Cmd+K and type to jump between projects, issues, views, or trigger actions. Every action in Linear has a keyboard shortcut hint displayed inline. This reduces mouse dependency and speeds up power-user workflows.

**Application to Risk Radar:** A Cmd+K palette lets care partners search across 28 risk categories by name, jump to a specific domain, or trigger "Assess" mode. Keyboard hints (arrow keys to navigate cards, Enter to expand, A to assess) appear as subtle badges. Clinical users entering data during calls benefit from not needing to switch between keyboard and mouse.

## Pattern 3: Focused Wizard Modals (One Question Per Screen)

Linear's issue creation is a focused modal — a centered dialog with generous padding, a clear title, and a single primary action. Multi-step flows use a minimal step indicator (dots or numbered labels) without overwhelming the user with the full form. The modal dims the background to create visual focus.

**Application to Risk Radar:** The consequence assessment wizard shows one clinical question per screen with 5 radio options (Negligible to Extreme). A subtle progress indicator ("1 of 16") tracks position. The user's attention is fully on the clinical judgment at hand — no sidebar, no header navigation, just the question. Skip and Save & Next provide the only two paths forward.

## Pattern 4: Data Visualisation as Hero Element

Linear's project views feature charts (burn-down, velocity, cycle time) as the primary content — not buried in a sidebar or collapsed section. The chart occupies the top half of the viewport, with supporting data (issues list, filters) below. Toggle buttons switch between chart types without page navigation.

**Application to Risk Radar:** The radar (spider) chart is the hero element on the Risk Radar tab. It shows all 5 clinical domains at a glance, with the data polygon revealing the risk profile shape. A toggle switches to bar chart view. Below the chart, domain cards expand to show individual risk areas. The chart-first layout gives care partners an immediate visual summary before drilling into details.

## Pattern 5: Monochrome Palette with Semantic Colour Accents

Linear uses an almost entirely grayscale interface. Colour appears only where it carries meaning: purple for in-progress, green for completed, yellow for high priority. This prevents visual noise and makes the coloured elements genuinely stand out. Interactive elements (buttons, links) use a single accent colour.

**Application to Risk Radar:** The interface is grayscale with teal (#007F7E) as the sole accent for interactive elements. Traffic-light colours (green, amber, red) appear only on risk severity indicators — consequence badges, domain dots, and the residual risk label. Because colour is scarce, a red dot on a risk card immediately draws the eye. The monochrome base also improves accessibility for users with colour vision deficiency, since the semantic colours are supplemented by text labels.
