import Link from 'next/link';
import capture from '@/content/course-source-index.json';
import { localTopicBySource } from '@/content/local-course-topics';
import styles from './CourseSourceIndex.module.css';


export function CourseSourceIndex({ courseId }: { courseId?: string }) {
  const courses = capture.courses.filter(course => !courseId || course.id === courseId);
  return <main id="main-content" className={styles.main}>
    <p className={styles.eyebrow}>COURSE DIRECTORY · {capture.capturedAt}</p>
    <h1>{courseId ? courses[0]?.title : 'All courses and modules'}</h1>
    <p className={styles.intro}>{courseId === 'system' ? 'System Design source directory.' : 'Browse your openFanout courses. Every AI and mathematics topic opens here. Topics awaiting lesson material are marked below.'}</p>
    <nav className={styles.tabs} aria-label="Courses">
      {capture.courses.map(course => <a key={course.id} href={courseId ? `/courses#${course.id}` : `#${course.id}`}>{course.title}</a>)}
      <a href="/courses#roadmaps">Upcoming tracks</a>
    </nav>
    {courses.map(course => <section id={course.id} className={styles.course} key={course.id}>
      <header><h2>{course.title}</h2><span>{course.modules.length} modules · {course.modules.reduce((n, module) => n + module.topics.length, 0)} topics</span></header>
      {course.modules.map((module, index) => <details className={styles.module} key={module.id}>
        <summary><span className={styles.number}>{String(index + 1).padStart(2, '0')}</span><strong>{module.title}</strong><span className={styles.count}>{module.topics.length} topics</span></summary>
        <ol>{module.topics.map((topic, i) => {
          const local = localTopicBySource.get(topic.url);
          return <li key={`${topic.url}-${i}`}><span>{topic.title}</span><div>{local ? <>{!local.available ? <small>Content pending</small> : null}<Link href={local.route}>Open lesson</Link></> : <a href={topic.url} target="_blank" rel="noopener noreferrer">Fanout ↗</a>}</div></li>;
        })}</ol>
      </details>)}
      {'systems' in course && course.systems ? <details className={styles.module}><summary><strong>System builds and case studies</strong><span className={styles.count}>{course.systems.length} entries</span></summary><ol>{course.systems.map(topic => <li key={topic.url}><span>{topic.title}</span><a href={topic.url} target="_blank" rel="noopener noreferrer">Fanout ↗</a></li>)}</ol></details> : null}
    </section>)}
    {!courseId ? <section id="roadmaps" className={styles.course}><h2>Upcoming tracks</h2>{capture.roadmaps.map(roadmap => <details className={styles.module} key={roadmap.id}><summary><strong>{roadmap.title}</strong><span className={styles.count}>{roadmap.stages.length} stages</span></summary><p>Planned curriculum · lesson material pending</p><ol>{roadmap.stages.map(stage => <li key={stage}>{stage}</li>)}</ol><ul>{roadmap.resources.map(resource => <li key={resource.url}><span>{resource.title}</span><small>Content pending</small></li>)}</ul></details>)}</section> : null}
  </main>;
}
