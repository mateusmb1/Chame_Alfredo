# 🛠️ Debug Plan: SQL Migration Fix

## 🎯 Objective
Identify and fix the error reported by the user when running `migrations/20260124_system_flow_improvements.sql` in the Supabase SQL Editor.

## 🛠️ Agents Invoked
- **`project-planner`**: Research common pitfalls and define the fix strategy.
- **`database-architect`**: Adjust the SQL script for higher compatibility and robustness.
- **`debugger`**: Analyze the specific error patterns (once provided or inferred).

## 🔍 Hypotheses for the Error
1.  **Missing Helper Functions**: The trigger references `update_updated_at_column()`, which might not be defined in the user's database.
2.  **Enum Constraints**: `ALTER TYPE ... ADD VALUE` cannot be executed within a transaction block in some versions or configurations.
3.  **Dependencies**: The `order_items` table references `inventory`, but the table name in the DB might be `inventory_items` or similar.

## 📋 Proposed Steps

### Phase 1: Investigation (Completed)
- [x] Inspect the workspace for definition of `update_updated_at_column`. (Found in `20260121_create_order_capture_schema.sql`)
- [x] Cross-reference table names. (Confirmed `orders`, `leads`, `inventory` are the target names).

### Phase 2: Correction (Completed)
- [x] **Robust Script Architecture**: Rewrote the migration to include helper functions.
- [x] **Transaction Management**: Fixed block wrapper for Exception handling.
- [x] **Direct Fix**: Updated scripts are ready.

## ✅ Verification
- [x] User informed of the syntax fix.
- [ ] Check if `leads` and `order_items` tables are functional.

