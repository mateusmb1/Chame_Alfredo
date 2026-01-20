-- Migration: Add columns to orders table for Service Report
-- Date: 2026-01-20

ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS items JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS asset_info JSONB DEFAULT NULL;
