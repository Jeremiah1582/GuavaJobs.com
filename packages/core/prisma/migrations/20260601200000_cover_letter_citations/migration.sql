-- F9: store grounding citations on AI-generated cover letters
ALTER TABLE "cover_letters" ADD COLUMN IF NOT EXISTS "citations_json" JSONB;
