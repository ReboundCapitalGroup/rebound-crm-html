-- ===== REBOUND CRM - CONTACTS TABLE SETUP =====
-- Run this in your Supabase SQL Editor

-- 1. Drop old complex tables if they exist
DROP TABLE IF EXISTS relatives CASCADE;
DROP TABLE IF EXISTS phone_numbers CASCADE;
DROP TABLE IF EXISTS emails CASCADE;
DROP TABLE IF EXISTS addresses CASCADE;

-- 2. Create simple contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id SERIAL PRIMARY KEY,
  lead_id TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  date_of_birth DATE,
  phone TEXT,
  secondary_phone TEXT,
  email TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  social_media TEXT,
  additional_info TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create index for fast lookups
CREATE INDEX IF NOT EXISTS idx_contacts_lead_id ON contacts(lead_id);

-- 4. Done! Simple and clean.
