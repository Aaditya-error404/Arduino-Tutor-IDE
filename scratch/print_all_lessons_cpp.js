const fs = require('fs');

const labs = JSON.parse(fs.readFileSync('scratch/all_labs_extracted.json', 'utf8'));

console.log("================================================================================");
console.log("   ALL 22 LABS & 88 LESSONS C++ CODE INSPECTION");
console.log("================================================================================");

for (const lab of labs) {
  console.log(`\n================================================================================`);
  console.log(`[LAB ${lab.id.toUpperCase()}] ${lab.name} (Lessons: ${lab.lessons.length})`);
  console.log(`================================================================================`);
  for (const lesson of lab.lessons) {
    console.log(`--- Lesson ${lesson.id}: ${lesson.title} ---`);
    const lines = lesson.cpp.split('\n').filter(l => l.trim().length > 0);
    for (const line of lines) {
      console.log(`    ${line}`);
    }
  }
}
