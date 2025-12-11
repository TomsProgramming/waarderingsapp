-- Clean duplicate skills from the database
-- This script removes duplicate skill entries, keeping only the first one for each name

-- First, let's see what duplicates exist
SELECT name, COUNT(*) as count, ARRAY_AGG(id) as ids
FROM skills
GROUP BY name
HAVING COUNT(*) > 1
ORDER BY name;

-- Delete duplicates, keeping only the first (lowest id) for each skill name
DELETE FROM skills
WHERE id NOT IN (
    SELECT MIN(id)
    FROM skills
    GROUP BY name
);

-- Verify the result - should show 5 skills
SELECT id, name, description, category
FROM skills
ORDER BY name;
