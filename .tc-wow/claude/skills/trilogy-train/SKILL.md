---
name: trilogy-train
description: Analyze workflow effectiveness and identify optimizations. Use after completing workflows to improve processes. Triggers on: analyze workflow, train, optimize process, workflow review, retrospective.
---

# Trilogy Train Skill

Analyze conversation to improve workflow effectiveness and identify optimization opportunities.

## Pre-Flight Check (Context Preservation)

**CRITICAL**: Before running full analysis, verify this is worthwhile:

- **Conversation length**: At least 5+ user messages with meaningful back-and-forth?
- **Agent invocations**: Was at least 1 command or agent actually invoked?
- **Workflow attempted**: Did a task/workflow get executed (not just discussed)?

**If ANY of these are false**, respond with:
```
⚠️ Not enough meaningful history to analyze.

Current state: {X messages, Y agent invocations}
What's needed: 5+ messages with 1+ command/agent in active use

Suggestion: After completing a workflow, then run `/trilogy.train` to analyze.
```

**Only proceed to full analysis below if all three conditions are TRUE.**

## Analysis Tasks

1. **Review Conversation**: Understand workflow followed, efficient vs inefficient steps, friction points

2. **Analyze Agents Used**: For each agent/command:
   - Right choice for task?
   - Prompt/instructions aligned with needs?
   - Misalignments or wasted context?

3. **Evaluate Prompts & Instructions**:
   - Clear enough?
   - Followed effectively?
   - Ambiguities that caused confusion?

4. **Identify Skill Gaps**:
   - Tasks better served by new skill?
   - Patterns that could be automated?

5. **Generate Recommendations**:
   - Agent improvements
   - Prompt updates
   - New skills
   - Process improvements

## Output Format

### Workflow Summary
- Workflow followed
- Key steps and transitions
- Effectiveness rating (1-10)

### Agent Analysis
For each agent/command:
- Effectiveness rating
- What worked well
- What could be improved
- Alternative approaches

### Prompt & Instruction Effectiveness
- Clarity rating
- Specificity rating
- Gaps or ambiguities

### Skill Opportunities
- Missing capabilities
- Automation potential
- Priority (High/Medium/Low)

### Context Efficiency Analysis
- Estimated tokens consumed
- Agent choices evaluation
- Redundant reads?
- Tool efficiency?
- Parallel execution opportunities?
- Abstraction quality?

**Rating**: Efficient / Moderate / Wasteful

### Final Recommendations
- Top 3 improvements (ranked by impact)
- Implementation effort estimates
- Suggested implementation order

## When to Use

- ✅ After completing a workflow
- ✅ When you've tried multiple approaches
- ✅ After complex multi-step task
- ❌ Don't use right after expressing a concern
- ❌ Don't use with <5 meaningful messages
- ❌ Don't use if no agents/commands were invoked
