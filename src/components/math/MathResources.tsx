import { ArrowUpRight, BookOpen, ChartNoAxesCombined, Dices, Dumbbell } from 'lucide-react';
import styles from './MathUtilityPages.module.css';

const resourceGroups = [
  {
    title: 'Core foundations',
    description: 'Books and courses that connect linear algebra, calculus, probability, and optimization.',
    icon: BookOpen,
    resources: [
      ['Mathematics for Machine Learning', 'https://mml-book.github.io/', 'Open textbook with a direct machine-learning orientation.'],
      ['MIT OpenCourseWare: Linear Algebra', 'https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/', 'Gilbert Strang’s lectures, notes, assignments, and exams.'],
      ['MIT OpenCourseWare: Multivariable Calculus', 'https://ocw.mit.edu/courses/18-02sc-multivariable-calculus-fall-2010/', 'A complete path through derivatives, integrals, and vector calculus.'],
    ],
  },
  {
    title: 'Visual intuition',
    description: 'Interactive and animated explanations for geometric structure.',
    icon: ChartNoAxesCombined,
    resources: [
      ['Seeing Theory', 'https://seeing-theory.brown.edu/', 'Interactive visual introduction to probability and statistics.'],
      ['Immersive Math', 'http://immersivemath.com/ila/index.html', 'Interactive linear algebra with geometric demonstrations.'],
      ['Distill', 'https://distill.pub/', 'Archived visual essays on machine learning concepts and representations.'],
    ],
  },
  {
    title: 'Probability and inference',
    description: 'Open courses and texts for uncertainty, distributions, and estimation.',
    icon: Dices,
    resources: [
      ['OpenStax Introductory Statistics', 'https://openstax.org/details/books/introductory-statistics-2e', 'A complete open statistics textbook with exercises.'],
      ['Harvard Stat 110', 'https://stat110.hsites.harvard.edu/', 'Probability lectures, notes, practice, and a free companion book.'],
      ['Introduction to Probability', 'https://www.probabilitycourse.com/', 'A free web textbook covering random variables and joint distributions.'],
    ],
  },
  {
    title: 'Compute and practice',
    description: 'References for verifying mathematics numerically in real code.',
    icon: Dumbbell,
    resources: [
      ['NumPy linear algebra', 'https://numpy.org/doc/stable/reference/routines.linalg.html', 'Official matrix decomposition and solver reference.'],
      ['PyTorch automatic differentiation', 'https://docs.pytorch.org/tutorials/beginner/basics/autogradqs_tutorial.html', 'Official tutorial for gradients and computational graphs.'],
      ['Desmos graphing calculator', 'https://www.desmos.com/calculator', 'Plot functions, inequalities, regions, and parameterized examples.'],
    ],
  },
] as const;

export function MathResources() {
  return (
    <main id="main-content" className={styles.main}>
      <header className={styles.hero}>
        <p className={styles.eyebrow}>Open reference shelf</p>
        <h1>Mathematics resources</h1>
        <p>Public books, courses, visual explanations, and computational references organized around the mathematics curriculum.</p>
      </header>

      <div className={styles.resourceGrid}>
        {resourceGroups.map((group) => {
          const Icon = group.icon;
          return (
            <section className={styles.resourceGroup} data-testid="resource-group" key={group.title}>
              <header><span><Icon size={18} aria-hidden="true" /></span><div><h2>{group.title}</h2><p>{group.description}</p></div></header>
              <div>
                {group.resources.map(([title, url, description]) => (
                  <a data-testid="math-resource" href={url} target="_blank" rel="noreferrer noopener" key={url}>
                    <span><strong>{title}</strong><small>{description}</small></span>
                    <ArrowUpRight size={15} aria-hidden="true" />
                  </a>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
