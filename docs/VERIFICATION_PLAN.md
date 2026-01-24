# 🕵️ Verification Plan: Database Integrity

## ⚠️ Status Update
**Direct SQL verification failed due to permission restrictions.**
We cannot automatically verify the current state of the database.

## 🔄 Revised Strategy
Instead of verifying, we will provide a **Robust Idempotent Migration Script**.
This script will:
1.  Check for the existence of tables and columns.
2.  Add missing columns safe (using `IF NOT EXISTS`).
3.  Create missing table relationships.

## �️ Execution Steps
1.  **Schema Inference**: Use `AppContext.tsx` as the source of truth for required columns.
2.  **Script Generation**: Create `docs/migration_integrity_fix.sql`.
3.  **User Action**: User will be instructed to run this script in their Supabase SQL Editor.

## 🔍 Target Schema Requirements (Confirmed from Code)

### `orders` table updates
- `status`: Text/Enum (nova, agendada, em_andamento, concluida, cancelada)
- `scheduled_date`, `completed_date`, `check_in`, `check_out`: Timestamps
- `approval_status`, `approval_signature`: Text
- `approval_date`: Timestamp
- `service_photos`: Text[] (Array)

### `quotes` table updates
- `source_order_id`: UUID (Foreign Key)
- `invoice_id`: UUID (Foreign Key)

### `appointments` table updates
- `order_id`: UUID (Foreign Key)
