import {
  SiJavascript, SiPython, SiTypescript, SiGo, SiRust, SiCplusplus,
  SiReact, SiVuedotjs, SiNextdotjs, SiDjango, SiSpringboot, SiLaravel,
  SiRedux, SiTailwindcss, SiExpress, SiPandas, SiTensorflow, SiGraphql,
} from "react-icons/si";


export const languageCourses = [
  {
    id: 'js',
    name: 'JavaScript',
    icon: SiJavascript,
    color: '#F7DF1E',

    level: 'Beginner',
    category: 'Programming Language',

    lessons: 48,
    students: '182k',

    price: 49,
    originalPrice: 89,
    discount: 45,

    duration: '12 weeks',
    hours: 28,

    rating: 4.9,
    reviews: 2840,

    projects: 6,
    assignments: 24,

    certificate: true,
    lifetimeAccess: true,

    format: 'Video + Projects',

    instructor: 'Alex Morgan',

    desc: 'Master JavaScript from the fundamentals to modern ES2024 development, including DOM manipulation, asynchronous programming, APIs, modules, and real-world projects.',

    shortDesc:
      'Learn modern JavaScript and build interactive web applications from scratch.',

    skills: [
      'JavaScript ES6+',
      'DOM Manipulation',
      'Async/Await',
      'Promises',
      'REST APIs',
      'Modules',
      'Object-Oriented Programming'
    ],

    requirements: [
      'Basic HTML and CSS knowledge',
      'A computer with internet access',
      'No prior JavaScript experience required'
    ],

    outcomes: [
      'Write modern JavaScript applications',
      'Work with APIs and asynchronous code',
      'Build interactive web applications',
      'Understand ES6+ features',
      'Create real-world JavaScript projects'
    ]
  },

  {
    id: 'py',
    name: 'Python',
    icon: SiPython,
    color: '#3776AB',

    level: 'Beginner',
    category: 'Programming Language',

    lessons: 52,
    students: '241k',

    price: 55,
    originalPrice: 99,
    discount: 44,

    duration: '14 weeks',
    hours: 32,

    rating: 4.9,
    reviews: 3610,

    projects: 8,
    assignments: 28,

    certificate: true,
    lifetimeAccess: true,

    format: 'Video + Projects',

    instructor: 'Daniel Carter',

    desc: 'Learn Python from the ground up with practical exercises covering syntax, functions, data structures, object-oriented programming, file handling, APIs, and automation.',

    shortDesc:
      'Build a strong Python foundation through practical coding and real-world projects.',

    skills: [
      'Python 3',
      'Data Structures',
      'Functions',
      'OOP',
      'File Handling',
      'APIs',
      'Automation',
      'Error Handling'
    ],

    requirements: [
      'No programming experience required',
      'Basic computer knowledge',
      'A computer with internet access'
    ],

    outcomes: [
      'Write clean Python programs',
      'Work with lists, dictionaries, sets, and tuples',
      'Build command-line applications',
      'Work with APIs and files',
      'Automate repetitive tasks',
      'Create practical Python projects'
    ]
  },

  {
    id: 'ts',
    name: 'TypeScript',
    icon: SiTypescript,
    color: '#3178C6',

    level: 'Intermediate',
    category: 'Programming Language',

    lessons: 36,
    students: '97k',

    price: 59,
    originalPrice: 109,
    discount: 46,

    duration: '10 weeks',
    hours: 24,

    rating: 4.8,
    reviews: 1740,

    projects: 5,
    assignments: 20,

    certificate: true,
    lifetimeAccess: true,

    format: 'Video + Projects',

    instructor: 'Emma Wilson',

    desc: 'Take your JavaScript skills to the next level with TypeScript. Learn static typing, interfaces, generics, utility types, advanced patterns, and production-ready application architecture.',

    shortDesc:
      'Build safer and more scalable JavaScript applications with TypeScript.',

    skills: [
      'TypeScript',
      'Types',
      'Interfaces',
      'Generics',
      'Enums',
      'Utility Types',
      'Type Narrowing',
      'Advanced Patterns'
    ],

    requirements: [
      'JavaScript fundamentals',
      'Basic ES6+ knowledge',
      'Experience building small JavaScript applications'
    ],

    outcomes: [
      "Understand TypeScript's type system",
      'Build strongly typed applications',
      'Use interfaces and generics',
      'Work with advanced utility types',
      'Convert JavaScript projects to TypeScript',
      'Write production-ready TypeScript code'
    ]
  },

  {
    id: 'go',
    name: 'Go',
    icon: SiGo,
    color: '#00ADD8',

    level: 'Intermediate',
    category: 'Programming Language',

    lessons: 30,
    students: '44k',

    price: 69,
    originalPrice: 119,
    discount: 42,

    duration: '9 weeks',
    hours: 22,

    rating: 4.8,
    reviews: 890,

    projects: 4,
    assignments: 16,

    certificate: true,
    lifetimeAccess: true,

    format: 'Video + Projects',

    instructor: 'Ryan Mitchell',

    desc: 'Learn Go for modern backend and cloud development. Explore goroutines, channels, interfaces, HTTP services, concurrency, testing, and production-oriented project structure.',

    shortDesc: 'Learn Go and build fast, concurrent backend services.',

    skills: [
      'Go Programming',
      'Goroutines',
      'Channels',
      'Concurrency',
      'Interfaces',
      'HTTP Servers',
      'REST APIs',
      'Testing'
    ],

    requirements: [
      'Basic programming knowledge',
      'Understanding of variables and functions',
      'Basic command-line experience'
    ],

    outcomes: [
      'Write idiomatic Go code',
      'Build concurrent applications',
      'Create REST APIs',
      'Work with goroutines and channels',
      'Build backend services',
      'Write and test production-quality Go code'
    ]
  },

  {
    id: 'rust',
    name: 'Rust',
    icon: SiRust,
    color: '#DEA584',

    level: 'Advanced',
    category: 'Programming Language',

    lessons: 41,
    students: '38k',

    price: 79,
    originalPrice: 139,
    discount: 43,

    duration: '12 weeks',
    hours: 30,

    rating: 4.9,
    reviews: 720,

    projects: 5,
    assignments: 22,

    certificate: true,
    lifetimeAccess: true,

    format: 'Video + Projects',

    instructor: 'Michael Brooks',

    desc: "Explore Rust's ownership and borrowing model while building reliable and high-performance software. Learn lifetimes, traits, concurrency, error handling, and systems programming concepts.",

    shortDesc:
      'Master Rust ownership, borrowing, concurrency, and systems programming.',

    skills: [
      'Rust',
      'Ownership',
      'Borrowing',
      'Lifetimes',
      'Traits',
      'Generics',
      'Concurrency',
      'Error Handling'
    ],

    requirements: [
      'Strong programming fundamentals',
      'Experience with at least one programming language',
      'Basic understanding of data structures'
    ],

    outcomes: [
      'Understand Rust ownership and borrowing',
      'Work with lifetimes and traits',
      'Build memory-safe applications',
      'Handle errors effectively',
      'Work with concurrent Rust programs',
      'Build systems-level projects'
    ]
  },

  {
    id: 'cpp',
    name: 'C++',
    icon: SiCplusplus,
    color: '#00599C',

    level: 'Advanced',
    category: 'Programming Language',

    lessons: 55,
    students: '76k',

    price: 65,
    originalPrice: 119,
    discount: 45,

    duration: '16 weeks',
    hours: 38,

    rating: 4.8,
    reviews: 1950,

    projects: 7,
    assignments: 32,

    certificate: true,
    lifetimeAccess: true,

    format: 'Video + Projects',

    instructor: 'James Anderson',

    desc: 'Build a deep understanding of modern C++ with memory management, pointers, classes, templates, STL, algorithms, object-oriented programming, and performance-focused development.',

    shortDesc:
      'Learn modern C++ fundamentals, STL, memory management, and advanced programming.',

    skills: [
      'C++17/20',
      'Pointers',
      'Memory Management',
      'OOP',
      'STL',
      'Templates',
      'Algorithms',
      'Data Structures'
    ],

    requirements: [
      'Basic programming knowledge',
      'Understanding of variables and functions',
      'Basic knowledge of algorithms is recommended'
    ],

    outcomes: [
      'Write modern C++ applications',
      'Understand pointers and memory management',
      'Use STL effectively',
      'Implement data structures and algorithms',
      'Build object-oriented applications',
      'Write performance-oriented C++ code'
    ]
  }
]

export const frameworkCourses = [
  {
    id: 'react',
    name: 'React',
    icon: SiReact,
    color: '#61DAFB',

    level: 'Intermediate',
    category: 'Frontend Development',

    lessons: 44,
    students: '203k',

    price: 49,
    originalPrice: 79,
    discount: 38,

    duration: '10 weeks',
    hours: 28,

    rating: 4.9,
    reviews: 2840,

    projects: 6,
    assignments: 28,

    certificate: true,
    lifetimeAccess: true,

    format: 'Video + Projects',

    instructor: 'Alex Morgan',

    desc: 'Master React from the fundamentals to advanced concepts by building modern and scalable user interfaces. Learn components, hooks, state management, API integration, routing, performance optimization, and real-world application architecture.',

    shortDesc:
      'Master React components, hooks, state management, and modern frontend development.',

    skills: [
      'React.js',
      'JSX',
      'Components',
      'React Hooks',
      'Context API',
      'State Management',
      'React Router',
      'API Integration'
    ],

    requirements: [
      'Basic JavaScript knowledge',
      'Understanding of HTML and CSS',
      'Basic ES6+ knowledge is recommended'
    ],

    outcomes: [
      'Build modern React applications',
      'Create reusable components',
      'Use React Hooks effectively',
      'Manage application state',
      'Integrate REST APIs',
      'Build production-ready frontend projects'
    ]
  },

  {
    id: 'next',
    name: 'Next.js',
    icon: SiNextdotjs,
    color: '#FFFFFF',

    level: 'Intermediate',
    category: 'Full-Stack Development',

    lessons: 33,
    students: '88k',

    price: 59,
    originalPrice: 99,
    discount: 40,

    duration: '8 weeks',
    hours: 24,

    rating: 4.8,
    reviews: 1765,

    projects: 5,
    assignments: 22,

    certificate: true,
    lifetimeAccess: true,

    format: 'Video + Projects',

    instructor: 'Daniel Carter',

    desc: 'Learn modern Next.js development by building production-ready applications with the App Router, Server Components, server-side rendering, API routes, authentication, database integration, and deployment.',

    shortDesc:
      'Build production-ready full-stack applications with modern Next.js.',

    skills: [
      'Next.js',
      'App Router',
      'Server Components',
      'Server Actions',
      'SSR',
      'SSG',
      'API Routes',
      'Authentication'
    ],

    requirements: [
      'Intermediate JavaScript knowledge',
      'Good understanding of React.js',
      'Basic knowledge of REST APIs'
    ],

    outcomes: [
      'Build full-stack applications with Next.js',
      'Understand Server and Client Components',
      'Implement SSR and static rendering',
      'Create backend API routes',
      'Add authentication to applications',
      'Deploy Next.js applications to production'
    ]
  },

  {
    id: 'vue',
    name: 'Vue.js',
    icon: SiVuedotjs,
    color: '#42B883',

    level: 'Beginner',
    category: 'Frontend Development',

    lessons: 29,
    students: '61k',

    price: 39,
    originalPrice: 69,
    discount: 43,

    duration: '7 weeks',
    hours: 19,

    rating: 4.7,
    reviews: 1248,

    projects: 4,
    assignments: 18,

    certificate: true,
    lifetimeAccess: true,

    format: 'Video + Projects',

    instructor: 'Sophie Wilson',

    desc: 'Learn Vue.js from the fundamentals through practical application development. Understand components, reactivity, directives, Composition API, routing, state management, and reusable UI patterns.',

    shortDesc:
      'Learn Vue.js fundamentals, Composition API, and modern frontend development.',

    skills: [
      'Vue.js',
      'Components',
      'Reactivity',
      'Composition API',
      'Vue Router',
      'State Management',
      'Directives',
      'API Integration'
    ],

    requirements: [
      'Basic HTML and CSS knowledge',
      'Basic JavaScript knowledge',
      'Understanding of frontend development'
    ],

    outcomes: [
      'Build applications with Vue.js',
      'Create reusable Vue components',
      'Understand Vue reactivity',
      'Use the Composition API',
      'Build multi-page applications with Vue Router',
      'Integrate APIs into Vue applications'
    ]
  },

  {
    id: 'django',
    name: 'Django',
    icon: SiDjango,
    color: '#0C4B33',

    level: 'Intermediate',
    category: 'Backend Development',

    lessons: 34,
    students: '52k',

    price: 54,
    originalPrice: 89,
    discount: 39,

    duration: '9 weeks',
    hours: 26,

    rating: 4.8,
    reviews: 986,

    projects: 5,
    assignments: 24,

    certificate: true,
    lifetimeAccess: true,

    format: 'Video + Projects',

    instructor: 'Michael Brown',

    desc: 'Build secure and scalable web applications with Django and Python. Learn Django models, ORM, authentication, forms, REST APIs, database integration, security, testing, and deployment.',

    shortDesc:
      'Build scalable Python web applications with Django and REST APIs.',

    skills: [
      'Python',
      'Django',
      'Django ORM',
      'Models',
      'Authentication',
      'REST API',
      'Database Integration',
      'Django REST Framework'
    ],

    requirements: [
      'Basic Python knowledge',
      'Understanding of functions and classes',
      'Basic HTML knowledge'
    ],

    outcomes: [
      'Build complete Django web applications',
      'Work with Django models and ORM',
      'Implement authentication systems',
      'Create REST APIs',
      'Connect applications with databases',
      'Deploy Django applications'
    ]
  },

  {
    id: 'spring',
    name: 'Spring Boot',
    icon: SiSpringboot,
    color: '#6DB33F',

    level: 'Advanced',
    category: 'Backend Development',

    lessons: 39,
    students: '47k',

    price: 69,
    originalPrice: 119,
    discount: 42,

    duration: '12 weeks',
    hours: 32,

    rating: 4.9,
    reviews: 812,

    projects: 6,
    assignments: 30,

    certificate: true,
    lifetimeAccess: true,

    format: 'Video + Projects',

    instructor: 'Robert Anderson',

    desc: 'Develop enterprise-grade Java applications with Spring Boot. Learn dependency injection, REST APIs, Spring Data JPA, database integration, Spring Security, JWT authentication, testing, and microservices architecture.',

    shortDesc:
      'Build enterprise Java applications and secure REST APIs with Spring Boot.',

    skills: [
      'Java',
      'Spring Boot',
      'REST APIs',
      'Spring MVC',
      'Spring Data JPA',
      'Spring Security',
      'JWT',
      'Microservices'
    ],

    requirements: [
      'Intermediate Java knowledge',
      'Understanding of OOP concepts',
      'Basic database and SQL knowledge'
    ],

    outcomes: [
      'Build enterprise-grade Spring Boot applications',
      'Create RESTful APIs',
      'Work with Spring Data and databases',
      'Implement JWT authentication',
      'Secure backend applications',
      'Understand microservices architecture'
    ]
  },

  {
    id: 'laravel',
    name: 'Laravel',
    icon: SiLaravel,
    color: '#FF2D20',

    level: 'Intermediate',
    category: 'Backend Development',

    lessons: 31,
    students: '39k',

    price: 44,
    originalPrice: 74,
    discount: 41,

    duration: '8 weeks',
    hours: 22,

    rating: 4.7,
    reviews: 735,

    projects: 5,
    assignments: 21,

    certificate: true,
    lifetimeAccess: true,

    format: 'Video + Projects',

    instructor: 'James Taylor',

    desc: 'Learn modern Laravel development by building APIs and full-stack applications. Work with MVC architecture, Eloquent ORM, authentication, authorization, database migrations, validation, testing, and deployment.',

    shortDesc: 'Build modern PHP applications and REST APIs with Laravel.',

    skills: [
      'PHP',
      'Laravel',
      'MVC Architecture',
      'Eloquent ORM',
      'REST API',
      'Authentication',
      'Database Migration',
      'API Security'
    ],

    requirements: [
      'Basic PHP knowledge',
      'Understanding of HTML and CSS',
      'Basic SQL knowledge is recommended'
    ],

    outcomes: [
      'Build full-stack Laravel applications',
      'Create RESTful APIs',
      'Work with Eloquent ORM',
      'Implement authentication and authorization',
      'Design and manage databases',
      'Deploy Laravel applications to production'
    ]
  }
]

export const libraryCourses = [
  {
    id: 'redux',
    name: 'Redux Toolkit',
    icon: SiRedux,
    color: '#764ABC',

    level: 'Intermediate',
    category: 'State Management',

    lessons: 18,
    students: '58k',

    price: 34,
    originalPrice: 59,
    discount: 42,

    duration: '6 weeks',
    hours: 12,

    rating: 4.8,
    reviews: 1240,

    projects: 3,
    assignments: 12,

    certificate: true,
    lifetimeAccess: true,

    format: 'Video + Projects',

    instructor: 'Daniel Carter',

    desc: 'Learn Redux Toolkit from the fundamentals to real-world state management. Build scalable React applications using slices, reducers, actions, async thunks, middleware, and API integration.',

    shortDesc:
      'Master modern Redux Toolkit and scalable state management for React applications.',

    skills: [
      'Redux Toolkit',
      'Slices',
      'Reducers',
      'Actions',
      'Async Thunks',
      'Middleware',
      'State Management',
      'API Integration'
    ],

    requirements: [
      'Basic JavaScript knowledge',
      'Basic React.js knowledge',
      'Understanding of components and props'
    ],

    outcomes: [
      'Build applications with Redux Toolkit',
      'Create scalable global state architecture',
      'Manage asynchronous API requests',
      'Handle loading and error states',
      'Use Redux effectively with React',
      'Build real-world state management solutions'
    ]
  },

  {
    id: 'tailwind',
    name: 'Tailwind CSS',
    icon: SiTailwindcss,
    color: '#38BDF8',

    level: 'Beginner',
    category: 'Frontend Development',

    lessons: 22,
    students: '112k',

    price: 29,
    originalPrice: 49,
    discount: 41,

    duration: '5 weeks',
    hours: 14,

    rating: 4.9,
    reviews: 2185,

    projects: 5,
    assignments: 18,

    certificate: true,
    lifetimeAccess: true,

    format: 'Video + Projects',

    instructor: 'Emily Johnson',

    desc: 'Learn Tailwind CSS by creating responsive and modern web interfaces. Understand utility classes, responsive design, layouts, custom themes, reusable components, animations, and production-ready styling techniques.',

    shortDesc:
      'Build modern responsive interfaces quickly with Tailwind CSS utilities.',

    skills: [
      'Tailwind CSS',
      'Responsive Design',
      'Flexbox',
      'CSS Grid',
      'Dark Mode',
      'Custom Themes',
      'UI Components',
      'Animations'
    ],

    requirements: [
      'Basic HTML knowledge',
      'Basic CSS knowledge',
      'Basic understanding of responsive design'
    ],

    outcomes: [
      'Build responsive websites with Tailwind CSS',
      'Create reusable UI components',
      'Design modern layouts with Flexbox and Grid',
      'Implement dark mode and custom themes',
      'Create mobile-friendly interfaces',
      'Build complete frontend projects'
    ]
  },

  {
    id: 'express',
    name: 'Express.js',
    icon: SiExpress,
    color: '#FFFFFF',

    level: 'Beginner',
    category: 'Backend Development',

    lessons: 20,
    students: '74k',

    price: 32,
    originalPrice: 55,
    discount: 42,

    duration: '6 weeks',
    hours: 15,

    rating: 4.7,
    reviews: 1098,

    projects: 4,
    assignments: 15,

    certificate: true,
    lifetimeAccess: true,

    format: 'Video + Projects',

    instructor: 'Ryan Mitchell',

    desc: 'Build powerful Node.js backend applications with Express.js. Learn routing, middleware, REST APIs, authentication, validation, error handling, database integration, and production-ready backend architecture.',

    shortDesc: 'Build REST APIs and scalable Node.js backends with Express.js.',

    skills: [
      'Express.js',
      'Node.js',
      'REST API',
      'Routing',
      'Middleware',
      'JWT Authentication',
      'Error Handling',
      'API Security'
    ],

    requirements: [
      'Basic JavaScript knowledge',
      'Basic Node.js knowledge',
      'Understanding of HTTP requests is helpful'
    ],

    outcomes: [
      'Build RESTful APIs with Express.js',
      'Create reusable middleware',
      'Implement authentication with JWT',
      'Connect APIs with databases',
      'Handle errors and validation',
      'Build production-ready Node.js backends'
    ]
  },

  {
    id: 'pandas',
    name: 'Pandas',
    icon: SiPandas,
    color: '#150458',

    level: 'Intermediate',
    category: 'Data Science',

    lessons: 27,
    students: '69k',

    price: 42,
    originalPrice: 69,
    discount: 39,

    duration: '7 weeks',
    hours: 18,

    rating: 4.8,
    reviews: 875,

    projects: 4,
    assignments: 20,

    certificate: true,
    lifetimeAccess: true,

    format: 'Video + Projects',

    instructor: 'Sophia Williams',

    desc: 'Learn Python Pandas for practical data analysis. Work with DataFrames and Series, clean messy datasets, transform data, perform statistical analysis, and prepare datasets for visualization and machine learning.',

    shortDesc:
      'Analyze, clean, and transform real-world datasets using Python Pandas.',

    skills: [
      'Python Pandas',
      'DataFrames',
      'Series',
      'Data Cleaning',
      'Data Transformation',
      'Data Analysis',
      'CSV & JSON Data',
      'Data Filtering'
    ],

    requirements: [
      'Basic Python knowledge',
      'Understanding of variables and functions',
      'Basic mathematics is recommended'
    ],

    outcomes: [
      'Work confidently with DataFrames',
      'Clean and transform datasets',
      'Analyze real-world data',
      'Import and export CSV and JSON files',
      'Perform filtering and aggregation',
      'Prepare data for visualization and ML'
    ]
  },

  {
    id: 'tf',
    name: 'TensorFlow',
    icon: SiTensorflow,
    color: '#FF6F00',

    level: 'Advanced',
    category: 'Machine Learning',

    lessons: 35,
    students: '31k',

    price: 64,
    originalPrice: 109,
    discount: 41,

    duration: '10 weeks',
    hours: 26,

    rating: 4.7,
    reviews: 642,

    projects: 5,
    assignments: 24,

    certificate: true,
    lifetimeAccess: true,

    format: 'Video + Projects',

    instructor: 'Dr. Ethan Wilson',

    desc: 'Learn practical machine learning and deep learning with TensorFlow. Build neural networks, train models, evaluate performance, work with datasets, and understand the fundamentals of deploying machine learning models.',

    shortDesc:
      'Build and train practical machine learning models with TensorFlow.',

    skills: [
      'TensorFlow',
      'Neural Networks',
      'Deep Learning',
      'Model Training',
      'Model Evaluation',
      'Data Preprocessing',
      'CNN',
      'Model Deployment'
    ],

    requirements: [
      'Intermediate Python knowledge',
      'Basic understanding of machine learning',
      'Basic mathematics and statistics'
    ],

    outcomes: [
      'Build neural network models',
      'Train and evaluate ML models',
      'Work with TensorFlow datasets',
      'Build image classification models',
      'Understand deep learning workflows',
      'Prepare models for deployment'
    ]
  },

  {
    id: 'graphql',
    name: 'GraphQL',
    icon: SiGraphql,
    color: '#E10098',

    level: 'Intermediate',
    category: 'API Development',

    lessons: 19,
    students: '26k',

    price: 36,
    originalPrice: 62,
    discount: 42,

    duration: '5 weeks',
    hours: 11,

    rating: 4.8,
    reviews: 518,

    projects: 3,
    assignments: 13,

    certificate: true,
    lifetimeAccess: true,

    format: 'Video + Projects',

    instructor: 'Oliver Smith',

    desc: 'Learn how to design and build flexible GraphQL APIs. Understand schemas, queries, mutations, resolvers, variables, authentication, error handling, and how to integrate GraphQL APIs with modern frontend applications.',

    shortDesc:
      'Design flexible typed APIs using GraphQL schemas, queries, and resolvers.',

    skills: [
      'GraphQL',
      'Schemas',
      'Queries',
      'Mutations',
      'Resolvers',
      'GraphQL APIs',
      'Authentication',
      'API Integration'
    ],

    requirements: [
      'Basic JavaScript knowledge',
      'Understanding of REST APIs',
      'Basic backend development knowledge'
    ],

    outcomes: [
      'Design GraphQL schemas',
      'Write queries and mutations',
      'Build GraphQL resolvers',
      'Connect GraphQL with databases',
      'Implement API authentication',
      'Integrate GraphQL with frontend applications'
    ]
  }
]

export const pricingPlans = [
  {
    id: "starter",
    name: "Starter",
    price: 0,
    period: "forever",
    tagline: "Dip your toes in",
    features: ["3 beginner courses", "Community forum access", "Progress tracking", "Certificate on completion"],
    cta: "Start free",
    highlighted: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: 19,
    period: "month",
    tagline: "For serious learners",
    features: ["All languages & frameworks", "Project-based capstones", "1:1 code review credits", "Downloadable source code", "Priority support"],
    cta: "Go Pro",
    highlighted: true,
  },
  {
    id: "team",
    name: "Team",
    price: 49,
    period: "month",
    tagline: "For squads shipping together",
    features: ["Everything in Pro", "Up to 10 seats", "Team progress dashboard", "Custom learning paths", "Dedicated onboarding"],
    cta: "Contact sales",
    highlighted: false,
  },
];

export const services = [
  { title: "Guided Courses", desc: "Structured, project-based curricula across languages, frameworks, and libraries — built by working engineers." },
  { title: "Live Code Review", desc: "Submit your projects and get line-by-line feedback from mentors who've shipped production code." },
  { title: "Career Tracks", desc: "Curated learning paths for Frontend, Backend, Data, and DevOps roles, mapped to real job requirements." },
  { title: "Team Training", desc: "Onboard your engineering team with shared progress dashboards and custom curricula for your stack." },
];
