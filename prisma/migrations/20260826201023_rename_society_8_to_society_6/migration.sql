-- Rename enum value SOCIETY_8 to SOCIETY_6 (preserves existing rows referencing it)
ALTER TYPE "SportModality" RENAME VALUE 'SOCIETY_8' TO 'SOCIETY_6';
