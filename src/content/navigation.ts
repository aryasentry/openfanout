import type { NavigationGroup } from './schema';

export const aiNavigation: NavigationGroup[] = [
  {
    id: 'workspace',
    label: 'Workspace',
    items: [
      { label: 'Overview', href: '/ai/overview', icon: 'House' },
      { label: 'Resources', href: '/ai/resources', icon: 'Library' },
      { label: 'Community', href: '/ai/community', icon: 'Users' },
      { label: 'Study with me', href: '/study-with-me', icon: 'Video' },
      { label: 'Articles', href: '/ai/articles', icon: 'Newspaper' },
      { label: 'Blogs', href: '/ai/blogs', icon: 'FileText' },
      { label: 'Roadmap', href: '/ai/roadmap', icon: 'Map' },
      { label: 'Tools & practice', href: '/ai/tools', icon: 'Wrench' },
      { label: 'Claude Code', href: '/ai/claude-code', icon: 'Code' },
      { label: 'System design', href: '/ai/system-design', icon: 'Network' },
      { label: 'Hardware', href: '/ai/hardware', icon: 'Cpu' },
      { label: 'Challenges', href: '/ai/challenges', icon: 'Trophy' },
      { label: 'Glossary', href: '/ai/glossary', icon: 'BookOpen' },
      { label: 'Newsletters', href: '/ai/newsletters', icon: 'Mail' },
      { label: 'Learning tracks', href: '/ai/tracks', icon: 'Route' },
      { label: 'Official guides', href: '/ai/guides', icon: 'BadgeHelp' },
      { label: 'Research papers', href: '/ai/papers', icon: 'Files' },
      { label: 'Interview prep', href: '/ai/interviews', icon: 'BriefcaseBusiness' },
      { label: 'Jobs', href: '/ai/jobs', icon: 'BriefcaseBusiness' },
      { label: 'Misc', href: '/ai/misc', icon: 'Sparkles' },
      { label: 'Newbies', href: '/ai/newbies', icon: 'GraduationCap' },
      { label: 'Companies and startups', href: '/companies', icon: 'Building2' },
    ],
  },
  {
    id: 'domains',
    label: 'Domains',
    items: [
      { label: 'Deep learning', href: '/ai/deep-learning', icon: 'Brain' },
      { label: 'Machine learning', href: '/ai/machine-learning', icon: 'ChartNoAxesCombined' },
      { label: 'Reinforcement learning', href: '/ai/reinforcement-learning', icon: 'Repeat2' },
      { label: 'GPU & CUDA', href: '/ai/gpu', icon: 'Microchip' },
    ],
  },
];

export const mathNavigation: NavigationGroup[] = [
  {
    id: 'math-workspace',
    label: 'Workspace',
    items: [
      { label: 'Course overview', href: '/ml-math/overview', icon: 'House' },
      { label: 'Math Decoder', href: '/ml-math/decoder', icon: 'FunctionSquare' },
      { label: 'Resources', href: '/ml-math/resources', icon: 'Library' },
    ],
  },
];

export const dailyNavigation: NavigationGroup[] = [
  {
    id: 'daily-workspace',
    label: 'Workspace',
    items: [
      { label: 'Daily archive', href: '/daily', icon: 'Newspaper' },
      { label: 'AI curriculum', href: '/ai/overview', icon: 'Brain' },
      { label: 'Mathematics', href: '/ml-math/overview', icon: 'FunctionSquare' },
    ],
  },
];

export const labNavigation: NavigationGroup[] = [
  {
    id: 'labs-workspace',
    label: 'Workspace',
    items: [
      { label: 'Labs catalog', href: '/labs', icon: 'Wrench' },
      { label: 'AI curriculum', href: '/ai/overview', icon: 'Brain' },
      { label: 'Mathematics', href: '/ml-math/overview', icon: 'FunctionSquare' },
      { label: 'Daily papers', href: '/daily', icon: 'Newspaper' },
    ],
  },
];
