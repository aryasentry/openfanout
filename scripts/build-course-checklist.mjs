import { readFileSync, writeFileSync } from 'node:fs';
const data = JSON.parse(readFileSync(new URL('../src/content/course-source-index.json', import.meta.url), 'utf8'));
const lines = ['# Course source index — ' + data.capturedAt, '', 'Captured through Chrome from rendered course overviews. Checked boxes mean title and source URL captured, not full lesson content copied or video playback verified.', '', 'The original 651-record coverage verifier covers the August catalog only. This September index extends discovery beyond that snapshot.', ''];
for (const course of data.courses) {
  lines.push(`## ${course.title}`, '', `Source: ${course.url}`, '');
  for (const courseModule of course.modules) {
    lines.push(`### ${courseModule.title} — ${courseModule.topics.length} topics`, '');
    for (const topic of courseModule.topics) lines.push(`- [x] [${topic.title}](${topic.url})`);
    lines.push('');
  }
  if (course.systems) {
    lines.push('### Builds and case studies', '');
    for (const topic of course.systems) lines.push(`- [x] [${topic.title}](${topic.url})`);
    lines.push('');
  }
}
for (const roadmap of data.roadmaps) {
  lines.push(`## ${roadmap.title}`, '', `Source: ${roadmap.url}`, '', roadmap.status, '');
  for (const stage of roadmap.stages) lines.push(`- [x] Roadmap title captured: ${stage}`);
  for (const resource of roadmap.resources) lines.push(`- [x] [${resource.title}](${resource.url})`);
  lines.push('');
}
lines.push('## Remaining content work', '', '- [x] All 24 previously missing MLOps primary YouTube links attached; AI now has 107 primary video embeds.', '- [ ] 24 AI MLOps topics still need supplied written notes.', '- [ ] 267 additional math topics have local routes but no local lesson body.', '- [ ] System Design lesson bodies and videos have not been imported (excluded from current scope).', '- [ ] Upcoming tracks are roadmaps, not released local courses.', '', 'See CONTENT-STATUS.md for current per-topic local availability. Absence locally does not prove a source video or quiz exists.', '', 'A signed-in System Design Pro lesson opened normally during inspection. That confirms access to the sampled lesson, not access or playback for every topic. No access controls were bypassed.', '');
writeFileSync(new URL('../COURSE-CHECKLIST.md', import.meta.url), lines.join('\n'));
console.log('Wrote COURSE-CHECKLIST.md');
