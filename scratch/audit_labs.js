const fs = require('fs');

// Read sparkbyte-v2/src/data/lessons.ts
const content = fs.readFileSync('sparkbyte-v2/src/data/lessons.ts', 'utf8');

// Extract ALL_LABS by evaluating or parsing
// We can strip typescript types and export
const jsContent = content
  .replace("import { Lab } from '../types/curriculum';", "")
  .replace("export const ALL_LABS: Lab[] =", "const ALL_LABS =")
  .replace(/export const LAB_MAP[\s\S]*$/, "");

const fn = new Function(jsContent + "; return ALL_LABS;");
const allLabs = fn();

console.log(`Successfully loaded ${allLabs.length} labs.`);

const labSummaries = allLabs.map(lab => {
  return {
    id: lab.id,
    name: lab.name,
    lessonsCount: lab.lessons.length,
    lessons: lab.lessons.map(l => ({
      id: l.id,
      title: l.title,
      cpp: l.defaultCode.cpp
    }))
  };
});

fs.writeFileSync('scratch/all_labs_extracted.json', JSON.stringify(labSummaries, null, 2), 'utf8');
console.log("Saved scratch/all_labs_extracted.json");
