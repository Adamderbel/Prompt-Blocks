# PromptBlocks Agent Hooks

This directory contains Kiro agent hooks that automate validation and consistency checks during development.

## Hooks

### 1. Validate Block Registry
**File:** `validate-blocks.json`  
**Trigger:** When `skeleton/block_registry.js` is saved  
**Purpose:** Validates block configuration

**What it checks:**
- All blocks have required fields (id, name, description, prompt, sampleInput)
- Each block ID has corresponding sample data in `skeleton/sample_data.js`
- No duplicate block IDs exist
- All block IDs follow camelCase naming convention

**Why it's useful:** Catches configuration errors immediately, before they cause runtime issues in the apps.

---

### 2. Check Skeleton Consistency
**File:** `check-skeleton-consistency.json`  
**Trigger:** When any file in `skeleton/*.js` is saved  
**Purpose:** Ensures skeleton changes don't break the apps

**What it checks:**
- Both apps still reference skeleton correctly
- No skeleton logic has been duplicated in app files
- HTML files load skeleton scripts in correct order
- Function signatures haven't changed in breaking ways

**Why it's useful:** Maintains the Skeleton Crew pattern by preventing code duplication and ensuring both apps stay in sync with the skeleton engine.

---

## How These Hooks Improved Development

1. **Caught errors early:** The validation hook caught missing sample data entries before runtime
2. **Maintained consistency:** The consistency hook ensured both apps stayed synchronized with skeleton changes
3. **Saved debugging time:** Issues were caught at save-time, not during testing
4. **Enforced patterns:** Hooks acted as guardrails to maintain the Skeleton Crew architecture

## Usage

These hooks run automatically when the specified files are saved in Kiro. No manual action required.
