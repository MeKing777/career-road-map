// src/data/careerDatabase.js
// Comprehensive career knowledge base providing standardized, highly relevant career data
// for key roles (Web Developer, Data Scientist, Cybersecurity Analyst, Cloud Engineer, Mobile App Developer, UI/UX Designer)
// along with alias normalization and an intelligent custom fallback generator.

/**
 * Normalizes user input and maps common aliases, typos, and specific job titles to standard career keys.
 */
export function normalizeCareerKey(input = '') {
  const query = input.toLowerCase().trim();

  if (!query) return 'web_developer';

  // Web Development aliases
  if (/web|front\s*end|front-end|frontend|back\s*end|back-end|backend|full\s*stack|fullstack|react|angular|vue|javascript|html|css|ui\s*developer|node/.test(query)) {
    return 'web_developer';
  }

  // Data Science & AI/ML aliases
  if (/data\s*science|data\s*scientist|machine\s*learning|ml\s*engineer|ai\s*engineer|ai\s*developer|artificial\s*intelligence|deep\s*learning|python\s*developer/.test(query)) {
    return 'data_scientist';
  }

  // Cybersecurity aliases
  if (/cyber|security|ethical\s*hack|pentest|pen\s*test|infosec|information\s*security|soc\s*analyst|network\s*security|forensics/.test(query)) {
    return 'cybersecurity_analyst';
  }

  // Cloud & DevOps aliases
  if (/cloud|devops|aws|azure|gcp|kubernetes|docker|site\s*reliability|sre|infrastructure|sysadmin|system\s*administrator/.test(query)) {
    return 'cloud_engineer';
  }

  // Mobile App aliases
  if (/mobile|ios|android|flutter|react\s*native|swift|kotlin|app\s*developer/.test(query)) {
    return 'mobile_developer';
  }

  // UI/UX Design aliases
  if (/ui\/ux|ux\/ui|ui\s*design|ux\s*design|user\s*experience|user\s*interface|product\s*design|figma/.test(query)) {
    return 'ui_ux_designer';
  }

  return 'custom';
}

export const CAREER_KNOWLEDGE_BASE = {
  web_developer: {
    careerOverview: {
      name: "Web Developer (Full Stack / Frontend / Backend)",
      desc: "Architects, builds, and maintains modern, responsive web applications and scalable backend APIs that deliver exceptional user experiences.",
      whatProfessionalDoes: "Translates design wireframes into clean frontend code, develops RESTful and GraphQL APIs, manages database schemas, ensures web accessibility and performance, and deploys scalable cloud web apps.",
      whereUsed: "Tech companies, SaaS startups, e-commerce platforms, digital agencies, finance, healthcare, and enterprise corporations.",
      expectedLevels: {
        beginner: "$55,000 - $75,000 / year (Junior Developer / Frontend Trainee)",
        intermediate: "$80,000 - $115,000 / year (Mid-level Full-Stack Software Engineer)",
        advanced: "$120,000 - $175,000+ / year (Senior Web Architect / Tech Lead)"
      }
    },
    requiredSkills: {
      beginner: ["HTML5 & Semantic Markup", "CSS3 / Flexbox & Grid", "Modern JavaScript (ES6+)", "Git & GitHub Version Control", "Responsive Web Design"],
      intermediate: ["React.js / Next.js Framework", "Node.js & Express API Development", "REST API Design", "Relational & NoSQL Databases (PostgreSQL, MongoDB)", "State Management & Tailwind CSS"],
      advanced: ["TypeScript & Static Typing", "Serverless Architecture & Microservices", "CI/CD & Containerization (Docker)", "Web Security (OWASP Top 10, Auth0, JWT)", "Performance Tuning & Web Vitals"],
      softSkills: ["Agile Collaboration & Scrum", "Technical Communication", "Code Review Etiquette", "Problem Solving & Analytical Thinking", "Time Management"]
    },
    courses: [
      {
        title: "Complete Web Development Bootcamp",
        whyRequired: "Provides foundational mastery of HTML, CSS, JavaScript, and full-stack development patterns.",
        difficulty: "Beginner",
        price: "Free / $19.99",
        type: "free",
        prerequisites: "Basic computer literacy",
        learnOutcome: "Ability to construct responsive websites and basic JavaScript web applications.",
        relatedSkills: ["HTML5", "CSS3", "JavaScript"],
        url: "https://www.freecodecamp.org"
      },
      {
        title: "Modern React with Redux & Next.js",
        whyRequired: "React powers over 60% of modern frontend engineering jobs; essential for building interactive UIs.",
        difficulty: "Intermediate",
        price: "$49.99",
        type: "paid",
        prerequisites: "Solid JavaScript (ES6+) knowledge mastered in Stage 1",
        learnOutcome: "Master component-driven architecture, state management, hooks, and server-side rendering.",
        relatedSkills: ["React.js", "Next.js", "State Management"],
        url: "https://www.udemy.com"
      },
      {
        title: "Node.js & Express RESTful API Engineering",
        whyRequired: "Enables developers to construct backend web services, manage databases, and handle authentication.",
        difficulty: "Intermediate",
        price: "Free",
        type: "free",
        prerequisites: "JavaScript fundamentals from Stage 1",
        learnOutcome: "Build secure REST APIs, manage database connections, and write server-side business logic.",
        relatedSkills: ["Node.js", "Express.js", "MongoDB", "SQL"],
        url: "https://developer.mozilla.org"
      },
      {
        title: "Full Stack Open (University of Helsinki)",
        whyRequired: "Industry-standard full-stack deep dive covering modern Web API standards, TypeScript, and testing.",
        difficulty: "Advanced",
        price: "Free",
        type: "free",
        prerequisites: "React & Node API skills mastered in Stage 2",
        learnOutcome: "Full-stack proficiency including React, Redux, Node.js, GraphQL, and TypeScript.",
        relatedSkills: ["TypeScript", "GraphQL", "Testing (Jest, Cypress)"],
        url: "https://fullstackopen.com"
      }
    ],
    technologies: [
      "HTML5", "CSS3", "JavaScript (ES6+)", "TypeScript", "React.js", "Next.js", "Node.js", "Express", "Tailwind CSS", "PostgreSQL", "MongoDB", "Git", "Docker", "Vite", "REST / GraphQL APIs"
    ],
    learningRoadmap: [
      {
        stage: "Beginner",
        topics: ["HTML5 Semantics & Accessibility", "CSS Layouts (Flexbox & CSS Grid)", "JavaScript Core Logic (Variables, DOM Manipulation, Async/Fetch)", "Git Basics & GitHub Workflow"],
        courses: ["Complete Web Development Bootcamp", "JavaScript Fundamentals"],
        skills: ["HTML5", "CSS3", "JavaScript", "Git"],
        tasks: ["Create a responsive personal portfolio webpage", "Build a JavaScript form validation system"],
        projects: ["Interactive Weather Dashboard using Public APIs", "Responsive Mobile-First Landing Page"]
      },
      {
        stage: "Intermediate",
        topics: ["React Component Architecture & Hooks (building on JS basics)", "Node.js Server Setup & Express Middleware", "RESTful API Integration & CRUD Operations", "Database Design with PostgreSQL & Prisma"],
        courses: ["Modern React with Redux & Next.js", "Node.js & Express RESTful API Engineering"],
        skills: ["React.js", "Node.js", "Express", "PostgreSQL"],
        tasks: ["Create a REST API with Express and PostgreSQL", "Build a Full-Stack Task Tracker CRUD Application"],
        projects: ["E-Commerce Web App with Shopping Cart & Payment Gateway", "Collaborative Kanban Board App"]
      },
      {
        stage: "Advanced",
        topics: ["Full Stack Serverless with Next.js & App Router (building on React & Node)", "Authentication & Authorization (JWT, OAuth2, Auth0)", "TypeScript Static Type Safety across Client & Server", "Unit & E2E Testing (Jest, Playwright)"],
        courses: ["Full Stack Open (University of Helsinki)"],
        skills: ["TypeScript", "Next.js", "Testing", "Web Security"],
        tasks: ["Implement JWT Auth with Refresh Tokens & Role-Based Access", "Optimize Web Vitals & Lazy Loading for Performance"],
        projects: ["Real-time Social Dashboard with WebSockets", "SaaS Subscription Platform with Stripe Integration"]
      },
      {
        stage: "Job Ready",
        topics: ["CI/CD Automated Deployment Pipelines (GitHub Actions)", "Web Application Security Audit (OWASP Standards)", "Resume Optimization & Technical System Design Interviews", "Open Source Contribution & Real-World Internship"],
        courses: ["Web Architecture & System Design"],
        skills: ["CI/CD", "System Design", "Technical Communication"],
        tasks: ["Deploy a full-stack production web application to Vercel/Render with SSL and Custom Domain"],
        projects: ["Portfolio-level Full-Stack SaaS Application with Live Demo"]
      }
    ],
    tasks: [
      {
        id: "web-task-1",
        title: "Create a Responsive Webpage",
        description: "Build a multi-section landing page using HTML5 semantic elements, CSS Flexbox/Grid, and media queries for mobile, tablet, and desktop views.",
        difficulty: "Beginner",
        requiredSkills: ["HTML5", "CSS3", "Flexbox"],
        estimatedTime: "4 Hours",
        prerequisites: "Basic HTML & CSS knowledge",
        expectedOutcome: "A pixel-perfect, fully mobile-responsive website layout validated without horizontal scroll errors.",
        stage: "Beginner"
      },
      {
        id: "web-task-2",
        title: "Build a JavaScript Form Validation System",
        description: "Develop a client-side form validation script using raw JavaScript DOM events that validates email formats and password strength.",
        difficulty: "Beginner",
        requiredSkills: ["JavaScript", "DOM Manipulation", "Regex"],
        estimatedTime: "3 Hours",
        prerequisites: "JavaScript syntax & DOM events",
        expectedOutcome: "An interactive HTML form that blocks submission and visually highlights input errors in real time.",
        stage: "Beginner"
      },
      {
        id: "web-task-3",
        title: "Create a REST API with Express and DB",
        description: "Building on JavaScript fundamentals, design and implement a backend Express API supporting CRUD operations on a database.",
        difficulty: "Intermediate",
        requiredSkills: ["Node.js", "Express", "REST APIs", "SQL/MongoDB"],
        estimatedTime: "6 Hours",
        prerequisites: "Node.js & async JavaScript mastered in Stage 1",
        expectedOutcome: "A working API server tested with Postman/Bruno returning structured JSON responses.",
        stage: "Intermediate"
      },
      {
        id: "web-task-4",
        title: "Build a Full-Stack CRUD Application",
        description: "Connect a React frontend interface to your Express backend API from Task 3 to create, view, edit, and delete records.",
        difficulty: "Intermediate",
        requiredSkills: ["React.js", "Node.js", "State Management", "Fetch/Axios"],
        estimatedTime: "10 Hours",
        prerequisites: "React hooks & REST API development",
        expectedOutcome: "A complete full-stack web application with persistent storage and optimistic UI updates.",
        stage: "Intermediate"
      },
      {
        id: "web-task-5",
        title: "Implement Auth & Role-Based Access Control",
        description: "Integrate JWT-based user authentication, password hashing with bcrypt, and secure middleware routes into your full-stack app.",
        difficulty: "Advanced",
        requiredSkills: ["Web Security", "JWT", "Bcrypt", "Express Middleware"],
        estimatedTime: "8 Hours",
        prerequisites: "REST API & Backend architecture from Stage 2",
        expectedOutcome: "Protected routes in frontend and backend that securely control access based on valid JSON Web Tokens.",
        stage: "Advanced"
      }
    ],
    projects: [
      {
        level: "Beginner",
        title: "Interactive Personal Portfolio Website",
        description: "A sleek, responsive single-page portfolio featuring smooth scrolling, project popups, and dark/light theme switching.",
        technologies: ["HTML5", "CSS3", "JavaScript"],
        keyFeatures: ["Mobile-first layout", "Dynamic theme toggle", "Contact form validation"]
      },
      {
        level: "Intermediate",
        title: "Full-Stack Task & Project Management Board",
        description: "A drag-and-drop Kanban application inspired by Trello, supporting user boards, task assignments, and priority tags.",
        technologies: ["React.js", "Node.js", "Express", "MongoDB", "Tailwind CSS"],
        keyFeatures: ["Drag-and-drop cards", "REST API integration", "Filter by priority and tags"]
      },
      {
        level: "Advanced",
        title: "E-Commerce Platform with Stripe Checkout",
        description: "A modern online store frontend and serverless backend with product catalog filtering, cart management, and online payment processing.",
        technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Stripe API", "PostgreSQL"],
        keyFeatures: ["Server-side rendering (SSR)", "Stripe checkout session API", "Order tracking dashboard"]
      },
      {
        level: "Portfolio-level",
        title: "Enterprise Web SaaS Application with Analytics Dashboard",
        description: "A complete production SaaS product with authentication, subscription tiers, analytics charts, multi-tenant workspaces, and CI/CD deployment.",
        technologies: ["Next.js (App Router)", "TypeScript", "Prisma", "PostgreSQL", "Tailwind", "Docker", "Vercel"],
        keyFeatures: ["Multi-tenant auth", "Stripe webhooks", "Interactive charts", "Automated deployment pipeline"]
      }
    ],
    realWorldExperience: [
      {
        title: "Open Source React & Node Repository Contribution",
        type: "Open Source",
        stage: "Intermediate",
        description: "Submit 2+ merged Pull Requests fixing bugs or adding features to open-source React/Node projects tagged 'good first issue'.",
        resumeOutcome: "Contributed bug fixes and feature enhancements to public production repositories; collaborated via Git PR reviews.",
        platforms: ["GitHub Good First Issues", "Devpost", "First Timers Only"],
        verificationTip: "Provide link to merged GitHub Pull Request or commit diff."
      },
      {
        title: "Freelance Micro-Gig: Local Business Web App Build",
        type: "Freelance Micro-Gig",
        stage: "Intermediate",
        description: "Build a responsive booking or landing page web application for a local business or non-profit using Next.js & Tailwind.",
        resumeOutcome: "Engineered and deployed a client web app handling form submissions, custom domain DNS, and responsive layout.",
        platforms: ["Upwork", "Catchafire (Non-profit)", "Fiverr", "Local Networking"],
        verificationTip: "Provide live website URL or client repository link."
      },
      {
        title: "Web Hackathon Prototype Build",
        type: "Hackathon",
        stage: "Advanced",
        description: "Participate in a 48-hour online hackathon, building a full-stack SaaS MVP with live demo and presentation deck.",
        resumeOutcome: "Collaborated in a time-sensitive hackathon to build and ship a full-stack Web MVP under pressure.",
        platforms: ["Devpost", "Hackerearth", "Major League Hacking (MLH)"],
        verificationTip: "Provide Devpost project submission page link or hackathon demo video."
      },
      {
        title: "Junior Web Developer Virtual Engineering Internship",
        type: "Internship",
        stage: "Job Ready",
        description: "Complete a virtual software engineering internship simulating daily workplace tickets, code reviews, and API integrations.",
        resumeOutcome: "Completed Virtual Web Engineering Internship; solved production-like tickets and implemented backend API routes.",
        platforms: ["Forage (Virtual Internships)", "AngelList / Wellfound", "Internshala", "LinkedIn Jobs"],
        verificationTip: "Provide internship certificate link or repository proof of completed tickets."
      }
    ],
    recommendations: {
      certifications: [
        "Meta Front-End Developer Professional Certificate (Coursera)",
        "AWS Certified Developer - Associate",
        "freeCodeCamp Full Stack Developer Certification"
      ],
      portfolioIdeas: [
        "Interactive SaaS Product Landing Page with Live Demo",
        "Real-time Chat / Collaboration Application",
        "Open-Source React/Node npm Package Contribution"
      ],
      githubIdeas: [
        "Maintain clean README files with screenshots and live preview links",
        "Use conventional commits (`feat:`, `fix:`, `docs:`)",
        "Include a Dockerfile and docker-compose.yml for easy local testing"
      ],
      interviewPrep: [
        "JavaScript Closure, Event Loop, Scope & Promises",
        "React Component Lifecycle, Virtual DOM & Custom Hooks",
        "System Design for Web Apps (Caching, CDN, DB Indexing)",
        "REST vs GraphQL API design trade-offs"
      ],
      resumeSkills: ["React.js", "Next.js", "Node.js", "TypeScript", "PostgreSQL", "REST APIs", "Git", "Tailwind CSS"],
      importantTech: ["TypeScript", "Next.js 14+", "Prisma / Drizzle ORM", "Docker"],
      nextCareerStep: "Junior/Mid-level Full Stack Developer → Senior Software Engineer → Technical Lead / Solutions Architect"
    }
  },

  data_scientist: {
    careerOverview: {
      name: "Data Scientist / AI & ML Specialist",
      desc: "Extracts actionable business insights, creates predictive machine learning models, builds data pipelines, and solves complex analytical problems using statistics and computer science.",
      whatProfessionalDoes: "Cleans and transforms structured/unstructured datasets, performs exploratory data analysis (EDA), trains and evaluates machine learning algorithms, builds predictive models, and communicates findings with data visualizations.",
      whereUsed: "Finance, e-commerce, tech enterprises, healthcare analytics, artificial intelligence research, marketing, and logistics.",
      expectedLevels: {
        beginner: "$65,000 - $85,000 / year (Junior Data Analyst / ML Trainee)",
        intermediate: "$95,000 - $130,000 / year (Data Scientist / ML Engineer)",
        advanced: "$140,000 - $200,000+ / year (Senior AI Scientist / Lead ML Architect)"
      }
    },
    requiredSkills: {
      beginner: ["Python Programming", "Pandas & NumPy", "SQL Data Extraction", "Descriptive Statistics", "Data Visualization (Matplotlib, Seaborn)"],
      intermediate: ["Supervised & Unsupervised Machine Learning", "Scikit-Learn", "Feature Engineering & Data Cleaning", "Probability Theory & Hypothesis Testing", "Jupyter Notebooks"],
      advanced: ["Deep Learning (PyTorch, TensorFlow)", "Natural Language Processing (NLP) / LLMs", "MLOps & Model Deployment (FastAPI, Docker, MLflow)", "Big Data Querying (BigQuery, Spark)", "A/B Testing & Statistical Modeling"],
      softSkills: ["Business Acumen & Storytelling", "Cross-Functional Collaboration", "Critical Thinking", "Research & Documentation", "Data Ethics"]
    },
    courses: [
      {
        title: "Python for Data Science and Machine Learning Bootcamp",
        whyRequired: "Essential foundation covering Python, NumPy, Pandas, Matplotlib, and Scikit-Learn.",
        difficulty: "Beginner",
        price: "$49.99",
        type: "paid",
        prerequisites: "Basic algebra and computer skills",
        learnOutcome: "Clean complex datasets, perform exploratory analysis, and build core ML models.",
        relatedSkills: ["Python", "Pandas", "Scikit-Learn"],
        url: "https://www.udemy.com"
      },
      {
        title: "Google Data Analytics Professional Certificate",
        whyRequired: "Industry-aligned introduction to SQL, data cleaning, analysis, and visualization.",
        difficulty: "Beginner",
        price: "Free Trial / $39/mo",
        type: "paid",
        prerequisites: "None",
        learnOutcome: "Master SQL queries, data transformations, and Tableau dashboards.",
        relatedSkills: ["SQL", "Data Cleaning", "Tableau"],
        url: "https://www.coursera.org"
      },
      {
        title: "Machine Learning Specialization by Andrew Ng (DeepLearning.AI)",
        whyRequired: "The premier theoretical and practical course for machine learning algorithms.",
        difficulty: "Intermediate",
        price: "Free to Audit",
        type: "free",
        prerequisites: "Python & Pandas skills mastered in Stage 1",
        learnOutcome: "Deep understanding of Regression, Classification, Clustering, and Neural Networks.",
        relatedSkills: ["Machine Learning", "Mathematics", "Python"],
        url: "https://www.coursera.org"
      },
      {
        title: "Applied Deep Learning with PyTorch",
        whyRequired: "Teaches modern neural network architectures for computer vision and NLP applications.",
        difficulty: "Advanced",
        price: "Free",
        type: "free",
        prerequisites: "Machine Learning fundamentals mastered in Stage 2",
        learnOutcome: "Construct PyTorch models, train CNNs/Transformers, and optimize hyperparameters.",
        relatedSkills: ["PyTorch", "Deep Learning", "Transformers"],
        url: "https://pytorch.org/tutorials"
      }
    ],
    technologies: [
      "Python", "R", "SQL", "Pandas", "NumPy", "Scikit-Learn", "PyTorch", "TensorFlow", "Jupyter", "Matplotlib", "Seaborn", "PostgreSQL / BigQuery", "Docker", "FastAPI", "Tableau / PowerBI"
    ],
    learningRoadmap: [
      {
        stage: "Beginner",
        topics: ["Python Syntax & Data Structures", "SQL Basics (SELECT, WHERE, JOIN, GROUP BY)", "Data Manipulation with Pandas & NumPy", "Exploratory Data Analysis (EDA) & Matplotlib"],
        courses: ["Python for Data Science Bootcamp", "Google Data Analytics"],
        skills: ["Python", "SQL", "Pandas", "EDA"],
        tasks: ["Clean a raw CSV dataset with missing values and outliers", "Perform exploratory data analysis and plot distribution charts"],
        projects: ["Exploratory Data Analysis on Real-World Housing Dataset", "Customer Churn SQL Analysis Report"]
      },
      {
        stage: "Intermediate",
        topics: ["Feature Selection & Scaling (using Pandas skills from Stage 1)", "Supervised Learning (Linear/Logistic Regression, Random Forests)", "Model Evaluation Metrics (Precision, Recall, F1, ROC-AUC)", "Unsupervised Learning (K-Means Clustering, PCA)"],
        courses: ["Machine Learning Specialization by Andrew Ng"],
        skills: ["Scikit-Learn", "Machine Learning", "Feature Engineering"],
        tasks: ["Build a machine learning regression model to predict sales", "Evaluate classification model performance using Confusion Matrix & ROC Curve"],
        projects: ["Predictive Maintenance Machine Learning Pipeline", "Customer Segmentation Model using K-Means"]
      },
      {
        stage: "Advanced",
        topics: ["Deep Learning & Neural Networks with PyTorch (building on ML concepts)", "Natural Language Processing & Transformer Models", "MLOps: Packaging ML Models into REST APIs using FastAPI & Docker", "Hyperparameter Tuning & Cross-Validation"],
        courses: ["Applied Deep Learning with PyTorch"],
        skills: ["PyTorch", "Deep Learning", "FastAPI", "MLOps"],
        tasks: ["Fine-tune a pretrained sentiment analysis model", "Deploy an ML inference service inside a Docker container"],
        projects: ["End-to-End Image Classification API with PyTorch & FastAPI", "LLM-Powered Document Question Answering System"]
      },
      {
        stage: "Job Ready",
        topics: ["Big Data Processing (PySpark, BigQuery)", "A/B Testing & Causal Inference", "Data Science Storytelling & Stakeholder Presentations", "Kaggle Competitions & Portfolio Polish"],
        courses: ["Big Data Analysis with PySpark"],
        skills: ["PySpark", "A/B Testing", "System Architecture"],
        tasks: ["Design and write an A/B testing statistical analysis script"],
        projects: ["Production-ready ML Pipeline with Automated Data Ingestion & Monitoring"]
      }
    ],
    tasks: [
      {
        id: "ds-task-1",
        title: "Clean a Dataset & Handle Missing Values",
        description: "Load a messy real-world CSV dataset into Pandas, impute missing values, handle categorical encoding, and eliminate duplicate records.",
        difficulty: "Beginner",
        requiredSkills: ["Python", "Pandas"],
        estimatedTime: "3 Hours",
        prerequisites: "Python data structures & Pandas basics",
        expectedOutcome: "A clean, fully structured Pandas DataFrame ready for statistical analysis without missing or erroneous values.",
        stage: "Beginner"
      },
      {
        id: "ds-task-2",
        title: "Perform Exploratory Data Analysis (EDA)",
        description: "Conduct thorough EDA on a business dataset using Pandas, Seaborn, and Matplotlib. Calculate correlation matrix and identify outlier trends.",
        difficulty: "Beginner",
        requiredSkills: ["Pandas", "Matplotlib", "Seaborn", "Statistics"],
        estimatedTime: "4 Hours",
        prerequisites: "Basic statistics & plotting libraries",
        expectedOutcome: "A Jupyter notebook report complete with histograms, scatter plots, correlation heatmaps, and key analytical takeaways.",
        stage: "Beginner"
      },
      {
        id: "ds-task-3",
        title: "Create Data Visualizations & Summary Dashboard",
        description: "Using SQL skills from Stage 1, write queries to aggregate sales data, then render an executive chart overview using Seaborn or Plotly.",
        difficulty: "Intermediate",
        requiredSkills: ["SQL", "Plotly", "Python"],
        estimatedTime: "4 Hours",
        prerequisites: "SQL JOINs & aggregation functions mastered in Stage 1",
        expectedOutcome: "Interactive charts clearly showing key metrics, trends, and business performance metrics.",
        stage: "Intermediate"
      },
      {
        id: "ds-task-4",
        title: "Build a Machine Learning Regression Model",
        description: "Apply Scikit-Learn on your clean dataset from Stage 1 to train a Random Forest Regressor predicting continuous targets (e.g. house prices).",
        difficulty: "Intermediate",
        requiredSkills: ["Scikit-Learn", "Machine Learning", "Python"],
        estimatedTime: "5 Hours",
        prerequisites: "Supervised learning concepts & Scikit-Learn syntax",
        expectedOutcome: "A trained ML model evaluated using RMSE and R-squared metrics demonstrating strong predictive accuracy.",
        stage: "Intermediate"
      },
      {
        id: "ds-task-5",
        title: "Evaluate & Deploy a Classifier Model via API",
        description: "Train a binary classifier for customer churn, export model weights using Joblib, and wrap in a FastAPI endpoint.",
        difficulty: "Advanced",
        requiredSkills: ["PyTorch / Scikit-Learn", "FastAPI", "Model Evaluation"],
        estimatedTime: "8 Hours",
        prerequisites: "Machine learning metrics & REST API development",
        expectedOutcome: "A live REST API endpoint that accepts JSON features and returns model prediction probabilities in real time.",
        stage: "Advanced"
      }
    ],
    projects: [
      {
        level: "Beginner",
        title: "Exploratory Data Analysis on Global Climate / Economic Data",
        description: "Statistical analysis and visualization notebook analyzing multi-year trends, anomaly detection, and regional distributions.",
        technologies: ["Python", "Pandas", "Seaborn", "Jupyter Notebook"],
        keyFeatures: ["Outlier detection", "Correlation heatmap", "Statistical hypothesis summary"]
      },
      {
        level: "Intermediate",
        title: "Customer Churn Prediction Engine",
        description: "End-to-end Machine Learning project identifying customers at risk of cancellation using Random Forest and XGBoost algorithms.",
        technologies: ["Python", "Scikit-Learn", "XGBoost", "Pandas", "Matplotlib"],
        keyFeatures: ["Feature importance ranking", "ROC-AUC curve analysis", "Actionable business recommendation report"]
      },
      {
        level: "Advanced",
        title: "Deep Learning Medical Image Classifier",
        description: "Convolutional Neural Network (CNN) built in PyTorch to classify X-ray scans with data augmentation and model transfer learning.",
        technologies: ["PyTorch", "Torchvision", "Python", "Docker"],
        keyFeatures: ["Transfer learning (ResNet)", "Data augmentation pipeline", "Grad-CAM interpretability visualization"]
      },
      {
        level: "Portfolio-level",
        title: "Real-Time ML Fraud Detection & MLOps Pipeline",
        description: "Production ML system with automated data ingestion, model retraining pipeline, Dockerized FastAPI inference server, and Prometheus performance monitoring.",
        technologies: ["Python", "PyTorch", "FastAPI", "Docker", "MLflow", "PostgreSQL"],
        keyFeatures: ["Low-latency REST inference", "Model versioning with MLflow", "Automated drift monitoring"]
      }
    ],
    realWorldExperience: [
      {
        title: "Kaggle Open Data & Competition Notebook Analysis",
        type: "Open Source",
        stage: "Intermediate",
        description: "Publish a clean, fully documented EDA and Baseline ML Model notebook on Kaggle for a public competition dataset.",
        resumeOutcome: "Published top-ranking open Kaggle notebook; performed feature engineering and model evaluation on public data.",
        platforms: ["Kaggle Competitions", "GitHub", "DrivenData"],
        verificationTip: "Provide link to public Kaggle notebook submission."
      },
      {
        title: "Non-Profit Data Analytics Volunteer Project",
        type: "Volunteer Work",
        stage: "Intermediate",
        description: "Analyze operational or fundraising datasets for a non-profit organization using SQL and Python dashboards.",
        resumeOutcome: "Delivered data analysis and automated executive dashboards for non-profit operations.",
        platforms: ["Catchafire", "DataKind", "VolunteerMatch"],
        verificationTip: "Provide dashboard link or non-profit project summary report."
      },
      {
        title: "AI & Data Science Hackathon Build",
        type: "Hackathon",
        stage: "Advanced",
        description: "Compete in an AI/ML hackathon, building a predictive API or LLM-assisted analytics tool within 48 hours.",
        resumeOutcome: "Engineered and presented a predictive AI model solution in a competitive hackathon.",
        platforms: ["Devpost", "Kaggle Community", "Hackerearth"],
        verificationTip: "Provide hackathon submission link or project demo."
      },
      {
        title: "Data Science & Analytics Virtual Internship",
        type: "Internship",
        stage: "Job Ready",
        description: "Complete a virtual data science industry simulation evaluating customer behavior, building ML models, and presenting to executives.",
        resumeOutcome: "Completed Virtual Data Science Internship; conducted exploratory data analysis and built predictive machine learning models.",
        platforms: ["Forage (Virtual Internships)", "AngelList", "Internshala", "LinkedIn Jobs"],
        verificationTip: "Provide virtual internship certificate or completed analysis report repository."
      }
    ],
    recommendations: {
      certifications: [
        "IBM Data Science Professional Certificate (Coursera)",
        "AWS Certified Data Analytics - Specialty",
        "TensorFlow Developer Certificate"
      ],
      portfolioIdeas: [
        "Kaggle Competition Notebook with top 10% score breakdown",
        "Interactive Streamlit Data Analytics Web Application",
        "Data Science blog post detailing an end-to-end ML project with code"
      ],
      githubIdeas: [
        "Organize repository into data/, notebooks/, src/, and models/ folders",
        "Provide clear reproduction commands in README.md",
        "Include Jupyter notebooks clean of execution errors"
      ],
      interviewPrep: [
        "Supervised vs Unsupervised ML algorithm mechanics",
        "Bias-Variance Tradeoff, Regularization (L1/L2)",
        "SQL Window Functions (ROW_NUMBER, RANK, LEAD/LAG)",
        "Metrics choice: Accuracy vs Precision vs Recall vs F1 Score"
      ],
      resumeSkills: ["Python", "SQL", "Pandas", "Scikit-Learn", "PyTorch", "Machine Learning", "FastAPI", "EDA"],
      importantTech: ["PyTorch", "FastAPI", "BigQuery / Snowflake", "Docker"],
      nextCareerStep: "Junior Data Analyst → Data Scientist → Senior Machine Learning Engineer → Principal AI Scientist"
    }
  },

  cybersecurity_analyst: {
    careerOverview: {
      name: "Cybersecurity Analyst / Information Security Specialist",
      desc: "Protects organizations from cyber threats, monitors network traffic, investigates security breaches, performs vulnerability scans, and enforces security protocols.",
      whatProfessionalDoes: "Analyzes system and firewall logs in SIEM platforms, conducts penetration testing, configures firewalls and Intrusion Detection Systems (IDS), mitigates security incidents, and performs threat hunting.",
      whereUsed: "Government agencies, financial institutions, defense contractors, healthcare organizations, cloud enterprise, and MSSPs (Managed Security Service Providers).",
      expectedLevels: {
        beginner: "$60,000 - $80,000 / year (SOC Analyst Tier 1 / Security Specialist)",
        intermediate: "$85,000 - $120,000 / year (Cybersecurity Analyst / Threat Hunter)",
        advanced: "$125,000 - $180,000+ / year (Senior Security Architect / CISO)"
      }
    },
    requiredSkills: {
      beginner: ["Networking Fundamentals (TCP/IP, OSI Model, DNS, HTTP/S)", "Linux CLI & System Administration", "Security Concepts (CIA Triad, Cryptography, Hashing)", "Wireshark Packet Analysis"],
      intermediate: ["SIEM Platform Operation (Splunk, Elastic SIEM)", "Vulnerability Scanning (Nmap, Nessus)", "Incident Response & Incident Handling Procedure", "Firewalls, VPNs & IDS/IPS Configuration", "Bash & Python Security Scripting"],
      advanced: ["Ethical Hacking & Penetration Testing (Metasploit, Burp Suite)", "Digital Forensics & Malware Analysis", "Cloud Security (AWS IAM, GuardDuty, Azure Sentinel)", "Zero Trust Architecture & Security Compliance (NIST, ISO 27001)"],
      softSkills: ["Analytical Investigation", "Crisis Management", "Attention to Detail", "Ethical Mindset", "Clear Technical Report Writing"]
    },
    courses: [
      {
        title: "CompTIA Security+ Certification Training",
        whyRequired: "The global benchmark baseline credential for starting a career in cybersecurity.",
        difficulty: "Beginner",
        price: "$49.99",
        type: "paid",
        prerequisites: "Basic IT networking awareness",
        learnOutcome: "Master security principles, threats, attacks, vulnerability management, and architecture.",
        relatedSkills: ["Security Fundamentals", "Networking", "Cryptography"],
        url: "https://www.udemy.com"
      },
      {
        title: "Google Cybersecurity Professional Certificate",
        whyRequired: "Hands-on entry-level program covering Python, Linux, SQL, and Security Operations.",
        difficulty: "Beginner",
        price: "Free Trial / $49/mo",
        type: "paid",
        prerequisites: "None",
        learnOutcome: "Gain practical skills in SIEM tools, packet sniffing, and incident documentation.",
        relatedSkills: ["Linux", "Python", "SIEM", "Wireshark"],
        url: "https://www.coursera.org"
      },
      {
        title: "TryHackMe Pre-Security & Complete Beginner Path",
        whyRequired: "Interactive lab-based learning platform for practical cybersecurity experience.",
        difficulty: "Beginner to Intermediate",
        price: "Free / $12/mo",
        type: "free",
        prerequisites: "Linux & networking basics mastered in Stage 1",
        learnOutcome: "Hands-on experience with offensive/defensive cybersecurity tools in virtual labs.",
        relatedSkills: ["Linux CLI", "Nmap", "Wireshark", "Web Exploitation"],
        url: "https://tryhackme.com"
      },
      {
        title: "Practical Network Penetration Testing (PNPT) & Burp Suite Deep Dive",
        whyRequired: "Advanced offensive security skills necessary for identifying system flaws ethically.",
        difficulty: "Advanced",
        price: "Free / $29.99",
        type: "free",
        prerequisites: "Networking, Linux, & SIEM fundamentals mastered in Stage 2",
        learnOutcome: "Conduct ethical penetration tests, exploit web vulnerabilities, and produce remediation reports.",
        relatedSkills: ["Metasploit", "Burp Suite", "Web Security", "Penetration Testing"],
        url: "https://portswigger.net/web-security"
      }
    ],
    technologies: [
      "Linux (Kali, Ubuntu)", "Wireshark", "Nmap", "Splunk", "Elastic SIEM", "Metasploit", "Burp Suite", "Snort / Suricata", "Nessus", "Python Scripting", "Bash", "AWS GuardDuty"
    ],
    learningRoadmap: [
      {
        stage: "Beginner",
        topics: ["OSI & TCP/IP Network Layers", "Linux Command Line Mastery & Permissions", "Basic Cryptography & SSL/TLS Concepts", "Wireshark Network Traffic Capture"],
        courses: ["CompTIA Security+ Certification Training", "Google Cybersecurity Certificate"],
        skills: ["Networking", "Linux", "Security Basics", "Wireshark"],
        tasks: ["Configure a Linux environment for security testing", "Perform network packet analysis using Wireshark"],
        projects: ["Home Lab Network Security Monitoring Setup", "Linux Security Audit Script"]
      },
      {
        stage: "Intermediate",
        topics: ["Log Analysis with Splunk / Elastic SIEM (building on Linux & Wireshark skills)", "Port & Service Vulnerability Scanning with Nmap & Nessus", "Incident Handling & Malware Quarantine Techniques", "Python Automation for Security Tasks"],
        courses: ["TryHackMe Complete Beginner Path"],
        skills: ["Splunk", "Nmap", "Log Analysis", "Python Scripting"],
        tasks: ["Analyze server logs to identify brute-force login attempts", "Identify vulnerabilities in a controlled lab environment"],
        projects: ["SIEM Log Analysis & Incident Response Lab", "Automated Port Scanner & Vulnerability Checker in Python"]
      },
      {
        stage: "Advanced",
        topics: ["Ethical Hacking & Web App Security (OWASP Top 10)", "Penetration Testing Frameworks (Metasploit, Burp Suite)", "Digital Forensics & Disk Memory Investigation", "Cloud Security Architecture & AWS IAM Hardening"],
        courses: ["Practical Network Penetration Testing (PNPT)"],
        skills: ["Penetration Testing", "Burp Suite", "Cloud Security"],
        tasks: ["Complete security-lab exercises on TryHackMe/HackTheBox", "Execute a web vulnerability assessment using Burp Suite"],
        projects: ["Vulnerability Assessment & Penetration Test Report", "Cloud Infrastructure Security Audit & Hardening Project"]
      },
      {
        stage: "Job Ready",
        topics: ["Security Compliance Frameworks (NIST CSF, ISO 27001, SOC 2)", "Threat Intelligence & Threat Hunting", "Executive Incident Report Writing", "Live SOC Simulation & Cybersecurity Internship"],
        courses: ["NIST Security Framework Masterclass"],
        skills: ["NIST Framework", "Incident Response", "Technical Writing"],
        tasks: ["Write a professional Incident Response & Vulnerability Remediation Report"],
        projects: ["Full Security Operations Center (SOC) Home Lab with SIEM & Live Attack Simulation"]
      }
    ],
    tasks: [
      {
        id: "sec-task-1",
        title: "Configure a Secure Linux Environment",
        description: "Set up an Ubuntu/Kali Linux virtual machine, configure SSH hardening, disable root login, setup UFW firewall rules, and configure fail2ban.",
        difficulty: "Beginner",
        requiredSkills: ["Linux", "Bash", "System Hardening"],
        estimatedTime: "3 Hours",
        prerequisites: "Linux CLI basics",
        expectedOutcome: "A hardened Linux server instance immune to standard brute-force SSH attacks.",
        stage: "Beginner"
      },
      {
        id: "sec-task-2",
        title: "Perform Network Packet Analysis",
        description: "Capture network traffic using Wireshark during HTTP/DNS transactions, analyze TCP handshakes, filter by protocol, and inspect unencrypted credentials.",
        difficulty: "Beginner",
        requiredSkills: ["Wireshark", "Networking", "TCP/IP"],
        estimatedTime: "4 Hours",
        prerequisites: "Understanding OSI model & TCP/IP",
        expectedOutcome: "A detailed analysis report highlighting exposed plaintext data and protocol anomalies.",
        stage: "Beginner"
      },
      {
        id: "sec-task-3",
        title: "Analyze Server Logs with SIEM",
        description: "Using Linux skills from Stage 1, ingest web server and auth logs into Splunk or Elastic SIEM. Write query rules to detect suspicious login patterns.",
        difficulty: "Intermediate",
        requiredSkills: ["Splunk / Elastic SIEM", "Log Analysis", "Regex"],
        estimatedTime: "5 Hours",
        prerequisites: "SIEM platform setup & log syntax mastered in Stage 1",
        expectedOutcome: "A SIEM dashboard displaying real-time alert triggers for brute-force attacks and IP reputation matches.",
        stage: "Intermediate"
      },
      {
        id: "sec-task-4",
        title: "Identify Vulnerabilities in a Controlled Lab",
        description: "Scan a target VM (e.g. Metasploitable) using Nmap and Nessus. Document open ports, outdated services, CVE identifiers, and severity scores.",
        difficulty: "Intermediate",
        requiredSkills: ["Nmap", "Nessus", "Vulnerability Management"],
        estimatedTime: "6 Hours",
        prerequisites: "Port scanning & CVE knowledge",
        expectedOutcome: "A structured vulnerability report categorizing findings by CVSS risk ratings.",
        stage: "Intermediate"
      },
      {
        id: "sec-task-5",
        title: "Complete Security-Lab Exercises & Pentest Report",
        description: "Exploit an OWASP Top 10 vulnerability in a sandbox environment, execute privilege escalation, and write remediation steps.",
        difficulty: "Advanced",
        requiredSkills: ["Burp Suite", "Ethical Hacking", "Remediation Documentation"],
        estimatedTime: "8 Hours",
        prerequisites: "Web application architecture & HTTP protocol from Stage 2",
        expectedOutcome: "A comprehensive executive-ready penetration testing report with technical proof-of-concept and fix recommendations.",
        stage: "Advanced"
      }
    ],
    projects: [
      {
        level: "Beginner",
        title: "Automated Linux Log Auditor & System Hardening Script",
        description: "A Bash script that audits Linux permissions, checks world-writable files, reviews user accounts, and outputs security posture alerts.",
        technologies: ["Linux", "Bash", "Shell Scripting"],
        keyFeatures: ["Automated user audit", "Firewall status validation", "Security report log generation"]
      },
      {
        level: "Intermediate",
        title: "Splunk SIEM Threat Monitoring & Incident Response Lab",
        description: "A virtual SOC environment ingesting syslog, Windows Event Logs, and Snort IDS alerts with custom threat detection dashboards.",
        technologies: ["Splunk / Elastic", "Windows Server", "Ubuntu", "Snort IDS"],
        keyFeatures: ["Custom SIEM correlation rules", "Live brute-force detection", "Executive dashboard visualization"]
      },
      {
        level: "Advanced",
        title: "Python-Based Vulnerability Scanner & Reconnaissance Tool",
        description: "A multi-threaded CLI application that scans target IP ranges for open ports, identifies banners, and queries CVE databases for vulnerabilities.",
        technologies: ["Python", "Socket Programming", "Requests", "Nmap Library"],
        keyFeatures: ["Multi-threaded port scanning", "Banner grabbing", "JSON CVE export"]
      },
      {
        level: "Portfolio-level",
        title: "Full SOC Home Lab with Active Directory & Live Attack Simulation",
        description: "An enterprise-grade virtual lab featuring Active Directory, Splunk SIEM, PFsenese firewall, and an isolated Kali attack box for incident management practice.",
        technologies: ["Splunk", "Active Directory", "PFSense", "Kali Linux", "Wireshark", "Atomic Red Team"],
        keyFeatures: ["AD Domain Controller setup", "Atomic Red Team attack simulation", "End-to-end incident triage workflow"]
      }
    ],
    realWorldExperience: [
      {
        title: "TryHackMe / HackTheBox Machine Writeup Publication",
        type: "Open Source",
        stage: "Intermediate",
        description: "Publish 2 detailed technical walk-through writeups of retired TryHackMe or HackTheBox machine exploits on GitHub or blog.",
        resumeOutcome: "Published technical penetration testing writeups documenting reconnaissance, privilege escalation, and vulnerability exploitation.",
        platforms: ["TryHackMe", "HackTheBox", "GitHub", "Medium"],
        verificationTip: "Provide link to published writeup repository or blog post."
      },
      {
        title: "Open-Source Security Automation Tool Contribution",
        type: "Open Source",
        stage: "Intermediate",
        description: "Contribute Python scripts or YARA/Sigma detection rules to open-source security repositories.",
        resumeOutcome: "Contributed threat detection rules and security automation scripts to open-source security projects.",
        platforms: ["GitHub Security Topics", "Sigma Rules", "YARA Rules"],
        verificationTip: "Provide commit link or merged Pull Request URL."
      },
      {
        title: "Cybersecurity Capture The Flag (CTF) Competition",
        type: "Hackathon",
        stage: "Advanced",
        description: "Participate in a 24-hour CTF competition (e.g. PicoCTF, National Cyber League), solving web security, cryptography, and forensics challenges.",
        resumeOutcome: "Competed in national CTF security competition solving digital forensics, web exploitation, and reverse engineering challenges.",
        platforms: ["PicoCTF", "CTFtime", "National Cyber League (NCL)"],
        verificationTip: "Provide CTF score board profile link or certificate."
      },
      {
        title: "Cybersecurity Operations (SOC) Virtual Internship",
        type: "Internship",
        stage: "Job Ready",
        description: "Complete a virtual SOC analyst internship analyzing malware PCAP files, writing incident reports, and investigating phishing alerts.",
        resumeOutcome: "Completed Virtual SOC Analyst Internship; investigated security alerts, performed log triage, and authored incident response reports.",
        platforms: ["Forage (Virtual Internships)", "AngelList", "Internshala", "LinkedIn Jobs"],
        verificationTip: "Provide virtual internship certificate or submitted incident report repository."
      }
    ],
    recommendations: {
      certifications: [
        "CompTIA Security+ (SY0-701)",
        "Certified Ethical Hacker (CEH) / eJPT",
        "GIAC Security Essentials (GSEC) / Certified Information Systems Security Professional (CISSP)"
      ],
      portfolioIdeas: [
        "Detailed TryHackMe / HackTheBox Machine Writeups on GitHub/Blog",
        "SIEM Dashboard Configuration Screenshots and Documentation",
        "Python Cyber Automation Scripts Repository"
      ],
      githubIdeas: [
        "Never upload sensitive API keys, pcap passwords, or private lab credentials",
        "Include architectural network topology diagrams in project documentation",
        "Detail step-by-step reproduction instructions for security tools"
      ],
      interviewPrep: [
        "Explain TCP 3-way handshake & OSI 7-layer model in detail",
        "Difference between IDS vs IPS, Symmetric vs Asymmetric Encryption",
        "Walkthrough of OWASP Top 10 (SQLi, XSS, CSRF, Broken Auth)",
        "How to respond to a ransomware infection incident step-by-step"
      ],
      resumeSkills: ["Linux", "Wireshark", "Splunk", "Nmap", "CompTIA Security+", "Python Scripting", "Incident Response", "Firewalls"],
      importantTech: ["Splunk / Elastic SIEM", "Wireshark", "Nmap", "AWS Cloud Security"],
      nextCareerStep: "Junior SOC Analyst Tier 1 → Cybersecurity Analyst Tier 2 → Incident Response Specialist / Security Architect"
    }
  },

  cloud_engineer: {
    careerOverview: {
      name: "Cloud Engineer / DevOps & Infrastructure Specialist",
      desc: "Designs, deploys, automates, and manages cloud infrastructure (AWS, Azure, GCP) to ensure reliability, scalability, and security for modern software applications.",
      whatProfessionalDoes: "Manages cloud computing resources, builds Infrastructure as Code (Terraform), sets up CI/CD pipelines (GitHub Actions, Jenkins), orchestrates containers (Docker, Kubernetes), and monitors system health.",
      whereUsed: "Cloud service providers, software enterprises, fintech, SaaS platforms, and enterprise IT divisions.",
      expectedLevels: {
        beginner: "$65,000 - $85,000 / year (Junior Cloud Administrator / Systems Associate)",
        intermediate: "$95,000 - $130,000 / year (Cloud Engineer / DevOps Specialist)",
        advanced: "$135,000 - $190,000+ / year (Senior Cloud Architect / SRE Lead)"
      }
    },
    requiredSkills: {
      beginner: ["Linux System Administration & Shell Scripting", "Cloud Core Concepts (Compute, Storage, Networking, IAM)", "Basic AWS / Azure / GCP Services", "Git & Version Control"],
      intermediate: ["Infrastructure as Code (Terraform)", "Docker Containerization", "CI/CD Pipeline Engineering (GitHub Actions)", "Cloud Networking (VPC, Subnets, Security Groups, Route 53)", "Python & Bash Automation"],
      advanced: ["Kubernetes Container Orchestration", "Site Reliability Engineering (SRE) & Monitoring (Prometheus, Grafana)", "Serverless Architecture (AWS Lambda, API Gateway)", "Multi-Cloud Strategy & Cloud Cost Optimization"],
      softSkills: ["Operational Resilience", "Troubleshooting under pressure", "Cross-team Collaboration", "Process Automation Orientation"]
    },
    courses: [
      {
        title: "AWS Certified Solutions Architect - Associate Course",
        whyRequired: "The gold standard cloud architecture foundation course covering AWS compute, storage, networking, and security.",
        difficulty: "Beginner to Intermediate",
        price: "$49.99",
        type: "paid",
        prerequisites: "Basic networking & OS knowledge",
        learnOutcome: "Design resilient, highly available, and cost-effective cloud architectures on AWS.",
        relatedSkills: ["AWS", "Cloud Architecture", "VPC", "EC2", "S3"],
        url: "https://www.udemy.com"
      },
      {
        title: "Terraform for Beginners: Infrastructure as Code",
        whyRequired: "Terraform is the industry standard tool for provisioning multi-cloud resources declaratively.",
        difficulty: "Intermediate",
        price: "Free",
        type: "free",
        prerequisites: "Cloud & AWS basics mastered in Stage 1",
        learnOutcome: "Write declarative HCL code to automate cloud resource creation, state management, and updates.",
        relatedSkills: ["Terraform", "Infrastructure as Code", "AWS"],
        url: "https://developer.hashicorp.com/terraform/tutorials"
      },
      {
        title: "Docker & Kubernetes: The Practical Guide",
        whyRequired: "Containerization and orchestration power modern cloud-native applications.",
        difficulty: "Intermediate",
        price: "$49.99",
        type: "paid",
        prerequisites: "Linux CLI basics from Stage 1",
        learnOutcome: "Build Docker images, manage containers, and deploy microservices to Kubernetes clusters.",
        relatedSkills: ["Docker", "Kubernetes", "Microservices"],
        url: "https://www.udemy.com"
      },
      {
        title: "DevOps Engineering on AWS & GitHub Actions",
        whyRequired: "Teaches automated building, testing, and deployment of cloud infrastructure pipelines.",
        difficulty: "Advanced",
        price: "Free",
        type: "free",
        prerequisites: "Terraform & Docker skills mastered in Stage 2",
        learnOutcome: "Construct automated CI/CD workflows, manage container registries, and trigger zero-downtime cloud deployments.",
        relatedSkills: ["CI/CD", "GitHub Actions", "DevOps"],
        url: "https://docs.github.com/en/actions"
      }
    ],
    technologies: [
      "AWS (EC2, S3, VPC, Lambda, IAM)", "Azure", "GCP", "Linux (Ubuntu)", "Terraform", "Docker", "Kubernetes", "GitHub Actions", "Ansible", "Prometheus", "Grafana", "Python", "Bash"
    ],
    learningRoadmap: [
      {
        stage: "Beginner",
        topics: ["Linux Shell Scripting & User Management", "Cloud Core Infrastructure (Compute, S3 Storage, IAM Rules)", "Basic Cloud Networking (VPC, Subnets, Routing)", "Git Version Control Workflow"],
        courses: ["AWS Certified Solutions Architect Associate"],
        skills: ["Linux", "AWS", "IAM", "Cloud Basics"],
        tasks: ["Configure a Linux cloud server instance", "Deploy a static web application on AWS S3 with CloudFront CDN"],
        projects: ["Static Website Hosting on AWS S3 with Custom Domain & SSL", "Automated EC2 Backup Script in Bash"]
      },
      {
        stage: "Intermediate",
        topics: ["Docker Image Creation & Container Networking (building on Linux)", "Infrastructure as Code with Terraform HCL (building on AWS compute/VPC)", "CI/CD Workflows using GitHub Actions", "Cloud Database Provisioning & Auto-Scaling Groups"],
        courses: ["Terraform for Beginners", "Docker & Kubernetes Practical Guide"],
        skills: ["Terraform", "Docker", "CI/CD", "Auto-scaling"],
        tasks: ["Provision cloud infrastructure using Terraform", "Build and push a containerized web application with Docker"],
        projects: ["Multi-Tier Web Application Infrastructure Provisioned with Terraform", "Automated CI/CD Pipeline to AWS ECS"]
      },
      {
        stage: "Advanced",
        topics: ["Kubernetes Cluster Deployment (EKS/GKE) (building on Docker & Terraform)", "Serverless Microservices with AWS Lambda & API Gateway", "Monitoring & Alerting Setup (Prometheus & Grafana)", "Infrastructure Hardening & Cloud Cost Optimization"],
        courses: ["DevOps Engineering on AWS"],
        skills: ["Kubernetes", "Serverless", "Prometheus", "Grafana"],
        tasks: ["Deploy microservices onto a Kubernetes cluster with Helm charts", "Set up Prometheus & Grafana system metrics monitoring"],
        projects: ["Production Kubernetes Microservices Cluster with Helm & Grafana", "Serverless Event-Driven Data Processing Pipeline"]
      },
      {
        stage: "Job Ready",
        topics: ["Zero-Downtime Deployment Strategies (Blue-Green, Canary)", "Disaster Recovery & Multi-Region Failover Architecture", "Cloud Security Auditing (AWS Security Hub)", "Cloud / DevOps Virtual Internship"],
        courses: ["AWS Solutions Architect Certification Prep"],
        skills: ["SRE", "Architecture", "Disaster Recovery"],
        tasks: ["Design and execute a zero-downtime deployment pipeline with automated rollback"],
        projects: ["Enterprise Multi-Region Cloud Infrastructure with Automated Failover & Full Observability"]
      }
    ],
    tasks: [
      {
        id: "cloud-task-1",
        title: "Configure a Linux Environment & Web Server",
        description: "Launch an EC2 virtual machine instance, configure security group inbound firewall rules, install Nginx web server, and write a status monitoring script.",
        difficulty: "Beginner",
        requiredSkills: ["Linux", "AWS EC2", "Nginx", "Bash"],
        estimatedTime: "3 Hours",
        prerequisites: "Basic Linux CLI knowledge",
        expectedOutcome: "A running Linux cloud server rendering a custom web page accessible via public IPv4 address.",
        stage: "Beginner"
      },
      {
        id: "cloud-task-2",
        title: "Deploy a Cloud Static Site with SSL",
        description: "Upload static web assets to an AWS S3 bucket, configure CloudFront CDN distribution, route DNS via Route 53, and issue an ACM SSL certificate.",
        difficulty: "Beginner",
        requiredSkills: ["AWS S3", "CloudFront", "Route 53", "SSL"],
        estimatedTime: "4 Hours",
        prerequisites: "DNS & HTTPS basics",
        expectedOutcome: "A globally distributed HTTPS website hosted on S3 with low latency and SSL encryption.",
        stage: "Beginner"
      },
      {
        id: "cloud-task-3",
        title: "Provision Infrastructure with Terraform",
        description: "Using AWS concepts from Stage 1, write declarative Terraform HCL files to create a Custom VPC, subnets, Internet Gateway, and EC2 instance.",
        difficulty: "Intermediate",
        requiredSkills: ["Terraform", "Infrastructure as Code", "AWS VPC"],
        estimatedTime: "5 Hours",
        prerequisites: "AWS networking concepts & Terraform syntax from Stage 1",
        expectedOutcome: "A reproducible cloud infrastructure stack created and destroyed cleanly using terraform CLI.",
        stage: "Intermediate"
      },
      {
        id: "cloud-task-4",
        title: "Build Docker Image & CI/CD Pipeline",
        description: "Containerize a web app using Dockerfile, configure GitHub Actions workflow to build, test, and push the image to Amazon ECR on git push.",
        difficulty: "Intermediate",
        requiredSkills: ["Docker", "GitHub Actions", "CI/CD"],
        estimatedTime: "6 Hours",
        prerequisites: "Docker commands & Git workflow",
        expectedOutcome: "An automated GitHub Actions workflow passing build tests and publishing tagged container images.",
        stage: "Intermediate"
      },
      {
        id: "cloud-task-5",
        title: "Deploy Microservices to Kubernetes Cluster",
        description: "Building on Docker containerization from Stage 2, create Kubernetes deployment manifests and ingress rules to deploy multi-container apps to EKS.",
        difficulty: "Advanced",
        requiredSkills: ["Kubernetes", "Helm", "Microservices"],
        estimatedTime: "8 Hours",
        prerequisites: "Docker containerization & Kubernetes concepts from Stage 2",
        expectedOutcome: "A resilient Kubernetes deployment with auto-healing pods, load balancing, and ingress routing.",
        stage: "Advanced"
      }
    ],
    projects: [
      {
        level: "Beginner",
        title: "Automated Cloud Static Website Hosting with CDN",
        description: "Deploy a high-availability static site using AWS S3, CloudFront CDN, Route53 DNS, and automated deployment via AWS CLI.",
        technologies: ["AWS S3", "CloudFront", "ACM", "AWS CLI"],
        keyFeatures: ["Global CDN distribution", "Automatic HTTPS redirection", "Low-cost hosting architecture"]
      },
      {
        level: "Intermediate",
        title: "Infrastructure as Code Stack with Terraform & AWS VPC",
        description: "Complete modular Terraform project creating a highly available 2-tier VPC architecture with EC2 Auto Scaling and Application Load Balancer.",
        technologies: ["Terraform", "AWS (VPC, EC2, ALB, Auto-scaling)", "Git"],
        keyFeatures: ["Modular HCL code", "Auto-scaling web tier", "State file locking with S3 & DynamoDB"]
      },
      {
        level: "Advanced",
        title: "Automated CI/CD GitOps Pipeline to Amazon ECS",
        description: "End-to-end DevOps pipeline triggering automated Docker builds, vulnerability scans, and zero-downtime rolling updates to Amazon ECS clusters.",
        technologies: ["GitHub Actions", "Docker", "AWS ECS", "Amazon ECR", "Terraform"],
        keyFeatures: ["Automated vulnerability scanning", "Zero-downtime rolling updates", "Slack deployment notifications"]
      },
      {
        level: "Portfolio-level",
        title: "Production Kubernetes Microservices Platform with Observability Stack",
        description: "An enterprise-grade Kubernetes cluster (EKS) running microservices, Helm package management, Prometheus & Grafana metrics, and ArgoCD GitOps deployment.",
        technologies: ["Kubernetes", "AWS EKS", "Helm", "ArgoCD", "Prometheus", "Grafana", "Terraform"],
        keyFeatures: ["GitOps deployment with ArgoCD", "Prometheus metrics dashboard", "Cluster auto-scaler integration"]
      }
    ],
    realWorldExperience: [
      {
        title: "Terraform Registry Open-Source Module Contribution",
        type: "Open Source",
        stage: "Intermediate",
        description: "Publish or contribute a reusable Terraform module (e.g. custom VPC or IAM role module) to the Terraform Registry or GitHub.",
        resumeOutcome: "Published open-source modular Terraform HCL module with automated testing and documentation.",
        platforms: ["Terraform Registry", "GitHub Open Source", "HashiCorp Community"],
        verificationTip: "Provide link to published Terraform registry module or GitHub repository."
      },
      {
        title: "Non-Profit Cloud Hosting & SSL Migration",
        type: "Volunteer Work",
        stage: "Intermediate",
        description: "Help a non-profit organization migrate their website to cloud storage with CDN caching and free SSL automation.",
        resumeOutcome: "Architected and migrated non-profit infrastructure to AWS S3/CloudFront, reducing hosting costs by 80%.",
        platforms: ["Catchafire", "VolunteerMatch", "Local Non-Profits"],
        verificationTip: "Provide live domain URL or architecture report."
      },
      {
        title: "Cloud & DevOps Hackathon Deployment Challenge",
        type: "Hackathon",
        stage: "Advanced",
        description: "Compete in an AWS/Cloud hackathon, building an automated serverless infrastructure pipeline or AI cloud deployment.",
        resumeOutcome: "Designed and automated serverless cloud architecture in a competitive 48-hour hackathon.",
        platforms: ["Devpost", "AWS Hackathons", "Hackerearth"],
        verificationTip: "Provide Devpost project submission page link."
      },
      {
        title: "Cloud Engineering / DevOps Virtual Internship",
        type: "Internship",
        stage: "Job Ready",
        description: "Complete a virtual cloud engineering simulation designing resilient cloud architecture, container pipelines, and disaster recovery.",
        resumeOutcome: "Completed Virtual Cloud Engineering Internship; authored Terraform modules, built CI/CD pipelines, and configured cloud monitoring.",
        platforms: ["Forage (Virtual Internships)", "AngelList", "Internshala", "LinkedIn Jobs"],
        verificationTip: "Provide virtual internship certificate or completed infrastructure repository."
      }
    ],
    recommendations: {
      certifications: [
        "AWS Certified Solutions Architect - Associate (SAA-C03)",
        "HashiCorp Certified: Terraform Associate",
        "Certified Kubernetes Administrator (CKA)"
      ],
      portfolioIdeas: [
        "GitHub Repository containing modular, reusable Terraform modules with documentation",
        "Live Kubernetes cluster dashboard writeup with Prometheus metric graphs",
        "Automated CI/CD workflow template repository for Python/Node apps"
      ],
      githubIdeas: [
        "Never commit AWS access keys or secrets; use environment variables and .gitignore",
        "Use `terraform fmt` and `tflint` for clean infrastructure code formatting",
        "Provide architecture diagrams (Lucidchart/Draw.io) in every README"
      ],
      interviewPrep: [
        "Difference between Containers vs Virtual Machines",
        "Terraform state file management and remote backends",
        "Kubernetes Pod, Deployment, Service, and Ingress primitives",
        "Designing highly available AWS multi-AZ VPC architectures"
      ],
      resumeSkills: ["AWS", "Terraform", "Docker", "Kubernetes", "Linux", "CI/CD", "GitHub Actions", "Python"],
      importantTech: ["Terraform", "Kubernetes", "AWS / Azure", "Prometheus"],
      nextCareerStep: "Junior Cloud Associate → Cloud Engineer → DevOps / SRE Specialist → Principal Cloud Architect"
    }
  },

  mobile_developer: {
    careerOverview: {
      name: "Mobile App Developer (iOS / Android / Flutter / React Native)",
      desc: "Creates high-performance, responsive native and cross-platform mobile applications for smartphones and tablets running iOS and Android.",
      whatProfessionalDoes: "Designs intuitive mobile user interfaces, integrates mobile REST APIs, handles offline local storage, manages app state, and publishes applications to the Apple App Store and Google Play Store.",
      whereUsed: "Mobile-first tech startups, enterprise organizations, gaming studios, financial banking apps, and e-commerce companies.",
      expectedLevels: {
        beginner: "$55,000 - $75,000 / year (Junior Mobile Developer / Android Associate)",
        intermediate: "$85,000 - $115,000 / year (Mid-level Flutter/iOS Engineer)",
        advanced: "$125,000 - $175,000+ / year (Senior Mobile Architect / Mobile Tech Lead)"
      }
    },
    requiredSkills: {
      beginner: ["Dart & Flutter OR React Native / Swift / Kotlin", "Mobile UI Layouts & Component Design", "Git & Mobile Project Setup", "REST API Consumption in Mobile"],
      intermediate: ["Mobile State Management (Bloc, Provider, Redux)", "Local Database Storage (SQLite, Hive, Room)", "Mobile App Authentication (OAuth, Firebase Auth)", "Push Notifications & Camera/GPS Hardware Integration"],
      advanced: ["Native Bridges & C/C++ FFI / Platform Channels", "Mobile App Performance & Memory Optimization", "App Store & Google Play Store CI/CD Publishing (Fastlane)", "Unit, Widget & E2E Mobile Testing"],
      softSkills: ["Mobile UX Sensitivity", "Problem Solving", "Platform Guideline Knowledge (Apple HIG / Material Design)"]
    },
    courses: [
      {
        title: "Flutter & Dart - The Complete Guide",
        whyRequired: "Learn cross-platform mobile development for iOS and Android from a single codebase.",
        difficulty: "Beginner to Intermediate",
        price: "$49.99",
        type: "paid",
        prerequisites: "Basic programming concepts",
        learnOutcome: "Build beautiful, fast native iOS and Android apps using Flutter and Dart.",
        relatedSkills: ["Flutter", "Dart", "Cross-Platform UI"],
        url: "https://www.udemy.com"
      },
      {
        title: "iOS & Swift - Complete App Development Bootcamp",
        whyRequired: "Master native iOS engineering with Swift, SwiftUI, and Xcode.",
        difficulty: "Beginner",
        price: "$49.99",
        type: "paid",
        prerequisites: "Mac OS access recommended",
        learnOutcome: "Construct native iOS applications with modern SwiftUI component layout.",
        relatedSkills: ["Swift", "SwiftUI", "iOS", "Xcode"],
        url: "https://developer.apple.com"
      },
      {
        title: "Android Basics with Kotlin (Google Developers)",
        whyRequired: "Google's official curriculum for building modern native Android apps with Kotlin.",
        difficulty: "Beginner",
        price: "Free",
        type: "free",
        prerequisites: "None",
        learnOutcome: "Master Jetpack Compose, Kotlin syntax, Coroutines, and Android Studio.",
        relatedSkills: ["Kotlin", "Android", "Jetpack Compose"],
        url: "https://developer.android.com/courses"
      }
    ],
    technologies: [
      "Flutter", "Dart", "React Native", "Swift", "SwiftUI", "Kotlin", "Jetpack Compose", "Firebase", "SQLite", "REST APIs", "Fastlane", "Xcode", "Android Studio"
    ],
    learningRoadmap: [
      {
        stage: "Beginner",
        topics: ["Mobile UI Design Principles (Material 3 & iOS HIG)", "Dart / Swift / Kotlin Syntax Fundamentals", "Stateful vs Stateless Widgets / Views", "Async Networking & JSON Parsing"],
        courses: ["Flutter & Dart Complete Guide", "Android Basics with Kotlin"],
        skills: ["Flutter/Swift/Kotlin", "Mobile UI", "REST APIs"],
        tasks: ["Build a responsive mobile screen layout", "Create a Weather App consuming live API endpoints"],
        projects: ["Personal Recipe & Cooking Mobile App", "Currency Converter App"]
      },
      {
        stage: "Intermediate",
        topics: ["Advanced State Management Patterns (building on UI basics)", "Offline Local Database Storage (SQLite / Hive)", "Firebase Auth & Firestore Integration", "Mobile Push Notifications & Location Services"],
        courses: ["Flutter Advanced State Management"],
        skills: ["State Management", "Firebase", "Local Storage"],
        tasks: ["Implement user authentication and local storage in a mobile app", "Build an offline-first task tracker mobile app"],
        projects: ["Fitness Tracker Mobile App with GPS & Charts", "E-Commerce Shopping App"]
      },
      {
        stage: "Advanced",
        topics: ["Native Platform Channels & Hardware Access (building on state management)", "App Performance, Memory Profiling & Smooth 60fps Animations", "Automated Mobile Testing (Unit, Widget, Driver)", "Continuous Integration & Deployment (Fastlane)"],
        courses: ["Mobile App Testing & Performance Optimization"],
        skills: ["Fastlane", "Mobile Testing", "Performance Profiling"],
        tasks: ["Configure automated app builds with Fastlane", "Optimize mobile app render performance & memory consumption"],
        projects: ["Real-time Messaging & Social Media Mobile Application", "Music Player App with Native Hardware Audio Playback"]
      },
      {
        stage: "Job Ready",
        topics: ["App Store & Play Store Guidelines & Submission", "App Analytics & Crash Reporting (Crashlytics)", "Technical System Architecture for Scale", "Published App Release & Mobile Internship"],
        courses: ["Publishing Mobile Apps Masterclass"],
        skills: ["App Publishing", "Crashlytics", "Store Optimization"],
        tasks: ["Prepare and package an app bundle for App Store / Play Store release"],
        projects: ["Production-Ready Published Mobile App with Active Users"]
      }
    ],
    tasks: [
      {
        id: "mob-task-1",
        title: "Build a Responsive Mobile Screen Layout",
        description: "Design a modern mobile user profile and dashboard screen using Flutter Widgets or SwiftUI views adhering to Material Design / Apple HIG rules.",
        difficulty: "Beginner",
        requiredSkills: ["Flutter / Swift / Kotlin", "Mobile UI"],
        estimatedTime: "3 Hours",
        prerequisites: "Mobile SDK installation",
        expectedOutcome: "A fluid mobile UI screen adapting cleanly across varied screen sizes and screen orientations.",
        stage: "Beginner"
      },
      {
        id: "mob-task-2",
        title: "Integrate REST API & Parse JSON in App",
        description: "Fetch live data from a public REST API, parse the JSON payload into type-safe data models, and render a dynamic list with loading indicators.",
        difficulty: "Beginner",
        requiredSkills: ["Dart / Swift", "HTTP / REST API", "JSON Parsing"],
        estimatedTime: "4 Hours",
        prerequisites: "Async programming & HTTP concepts",
        expectedOutcome: "A working mobile screen displaying live API data with graceful error and loading states.",
        stage: "Beginner"
      },
      {
        id: "mob-task-3",
        title: "Implement Mobile Auth & Local Storage",
        description: "Using REST skills from Stage 1, connect Firebase Auth or custom JWT authentication to your mobile app and store user session tokens securely in encrypted local storage.",
        difficulty: "Intermediate",
        requiredSkills: ["Firebase", "Secure Storage", "State Management"],
        estimatedTime: "5 Hours",
        prerequisites: "Mobile state management & Auth concepts from Stage 1",
        expectedOutcome: "A mobile application with sign-up, login, persistent session management, and logout capabilities.",
        stage: "Intermediate"
      },
      {
        id: "mob-task-4",
        title: "Build an Offline-First Task Tracker App",
        description: "Develop a task management mobile app using SQLite or Hive database so users can create and edit tasks offline, auto-syncing when internet restores.",
        difficulty: "Intermediate",
        requiredSkills: ["SQLite / Hive", "Offline Storage", "State Management"],
        estimatedTime: "6 Hours",
        prerequisites: "Local database queries & app state management from Stage 1",
        expectedOutcome: "An app operating seamlessly without network connectivity, caching all user modifications locally.",
        stage: "Intermediate"
      },
      {
        id: "mob-task-5",
        title: "Automate Mobile App Deployment via Fastlane",
        description: "Set up Fastlane scripts to automatically sign code, manage provision profiles, build release APK/IPA binaries, and push to beta testing channels.",
        difficulty: "Advanced",
        requiredSkills: ["Fastlane", "CI/CD", "Code Signing"],
        estimatedTime: "8 Hours",
        prerequisites: "App store developer accounts & CLI tools from Stage 2",
        expectedOutcome: "A one-command automated deployment script delivering release builds to TestFlight or Google Play Internal Testing.",
        stage: "Advanced"
      }
    ],
    projects: [
      {
        level: "Beginner",
        title: "Daily Weather Forecast & Geo-Location App",
        description: "Mobile app using device GPS to display real-time weather forecasts, hourly breakdowns, and multi-city search.",
        technologies: ["Flutter", "Dart", "OpenWeather API"],
        keyFeatures: ["GPS location integration", "Dynamic weather icons", "Saved favorite locations"]
      },
      {
        level: "Intermediate",
        title: "Personal Finance & Expense Tracker App",
        description: "Feature-rich mobile financial tracker with spending analytics pie charts, custom budgets, and offline SQLite data persistence.",
        technologies: ["Flutter / React Native", "SQLite / Hive", "Charts Library"],
        keyFeatures: ["Visual spending analytics", "Category management", "Offline storage"]
      },
      {
        level: "Advanced",
        title: "Real-Time Mobile Chat & Video Call Application",
        description: "Cross-platform mobile messaging app with Firebase realtime database, push notifications, and Agora video calling API.",
        technologies: ["Flutter", "Firebase", "WebRTC / Agora API", "Push Notifications"],
        keyFeatures: ["One-on-one instant messaging", "Push notifications", "Live video call connection"]
      },
      {
        level: "Portfolio-level",
        title: "Published On-Demand Service / Delivery App",
        description: "Production mobile application featuring live map location tracking, payment processing, user reviews, and app store deployment.",
        technologies: ["Flutter / Swift", "Firebase", "Stripe API", "Google Maps API", "Fastlane"],
        keyFeatures: ["Live driver tracking on map", "Stripe mobile payment", "Active Play Store / App Store release"]
      }
    ],
    realWorldExperience: [
      {
        title: "Published Open-Source Flutter Package Contribution",
        type: "Open Source",
        stage: "Intermediate",
        description: "Publish or contribute to an open-source pub.dev Flutter package or CocoaPod Swift library.",
        resumeOutcome: "Published open-source mobile package on pub.dev / CocoaPods; authored unit tests and usage documentation.",
        platforms: ["pub.dev", "GitHub", "CocoaPods"],
        verificationTip: "Provide pub.dev package URL or GitHub repository."
      },
      {
        title: "Local Community Business Mobile App Build",
        type: "Freelance Micro-Gig",
        stage: "Intermediate",
        description: "Build a cross-platform Flutter/React Native mobile catalog app for a local store or non-profit community group.",
        resumeOutcome: "Designed and published a client mobile application handling push notifications and local offline caching.",
        platforms: ["Upwork", "Catchafire", "Fiverr"],
        verificationTip: "Provide app demo video or GitHub repository."
      },
      {
        title: "Mobile App Hackathon Build",
        type: "Hackathon",
        stage: "Advanced",
        description: "Participate in a mobile app hackathon, building an AI-assisted or location-aware mobile application MVP within 48 hours.",
        resumeOutcome: "Engineered and presented a cross-platform mobile application MVP in a competitive 48-hour hackathon.",
        platforms: ["Devpost", "Flutter Hackathons", "Major League Hacking"],
        verificationTip: "Provide Devpost project submission page link."
      },
      {
        title: "Mobile App Development Virtual Engineering Internship",
        type: "Internship",
        stage: "Job Ready",
        description: "Complete a virtual mobile engineering simulation implementing app features, state management, and Play Store packaging.",
        resumeOutcome: "Completed Virtual Mobile App Developer Internship; engineered responsive screens and configured automated CI/CD builds.",
        platforms: ["Forage (Virtual Internships)", "AngelList", "Internshala", "LinkedIn Jobs"],
        verificationTip: "Provide virtual internship certificate or app bundle repository."
      }
    ],
    recommendations: {
      certifications: [
        "Google Associate Android Developer Certification",
        "Meta iOS Developer Professional Certificate",
        "Flutter Certified Application Developer"
      ],
      portfolioIdeas: [
        "Live App Store or Google Play Store download links",
        "Short 30-second screen recording GIFs in GitHub READMEs",
        "Clean architecture folder structure (Data, Domain, Presentation layers)"
      ],
      githubIdeas: [
        "Include screenshots of both iOS and Android renders",
        "Detail state management choices (Bloc vs Riverpod vs Redux) in documentation",
        "Add unit and widget test coverage badges"
      ],
      interviewPrep: [
        "State management lifecycle in Flutter / SwiftUI / Android",
        "Mobile memory management & avoiding memory leaks",
        "Platform channels & native code interop",
        "Offline-first sync architecture strategies"
      ],
      resumeSkills: ["Flutter", "Dart", "Swift", "Kotlin", "React Native", "Firebase", "REST APIs", "Mobile UI"],
      importantTech: ["Flutter / SwiftUI", "Firebase", "Fastlane", "SQLite"],
      nextCareerStep: "Junior Mobile Developer → Mid-Level Mobile Engineer → Senior Mobile Architect → Lead App Engineer"
    }
  },

  ui_ux_designer: {
    careerOverview: {
      name: "UI/UX Designer / Product Designer",
      desc: "Researches user needs, designs intuitive user experiences (UX), creates pixel-perfect user interfaces (UI), and builds interactive prototypes for web and mobile products.",
      whatProfessionalDoes: "Conducts user research and interviews, builds wireframes and user journey maps, creates design systems and component libraries in Figma, builds interactive prototypes, and conducts usability testing.",
      whereUsed: "Tech companies, design agencies, SaaS platforms, mobile app startups, e-commerce brands, and enterprise software teams.",
      expectedLevels: {
        beginner: "$50,000 - $70,000 / year (Junior Product Designer / UI Trainee)",
        intermediate: "$75,000 - $110,000 / year (UI/UX Designer / UX Researcher)",
        advanced: "$115,000 - $160,000+ / year (Senior Product Designer / Design Lead)"
      }
    },
    requiredSkills: {
      beginner: ["Figma & Design Tools", "Typography & Color Theory", "Layout & Grid Systems", "Wireframing & Sketching", "User Centered Design Basics"],
      intermediate: ["Figma Design Systems & Auto Layout", "Interactive Prototyping & Micro-interactions", "User Research & Persona Creation", "Usability Testing & Feedback Synthesis", "Web Accessibility (WCAG standards)"],
      advanced: ["Design Systems Architecture at Scale", "UX Writing & Microcopy", "Information Architecture & Card Sorting", "Developer Handoff & Specs (Design Token Workflow)", "Product Analytics & A/B Test Design"],
      softSkills: ["Empathy", "Storytelling & Presentation", "Receptiveness to Feedback", "Cross-Functional Collaboration with Developers"]
    },
    courses: [
      {
        title: "Google UX Design Professional Certificate",
        whyRequired: "Comprehensive introduction covering the entire UX research, wireframing, and prototyping process.",
        difficulty: "Beginner",
        price: "Free Trial / $49/mo",
        type: "paid",
        prerequisites: "None",
        learnOutcome: "Complete 3 portfolio projects: a mobile app, a responsive website, and a cross-platform experience.",
        relatedSkills: ["UX Research", "Figma", "Wireframing", "Prototyping"],
        url: "https://www.coursera.org"
      },
      {
        title: "Figma UI/UX Design Essentials",
        whyRequired: "Figma is the industry-standard software tool used by 90%+ of product design teams.",
        difficulty: "Beginner to Intermediate",
        price: "$49.99",
        type: "paid",
        prerequisites: "Basic computer skills",
        learnOutcome: "Master auto-layout, variants, design tokens, responsive components, and interactive prototypes in Figma.",
        relatedSkills: ["Figma", "UI Design", "Design Systems"],
        url: "https://www.udemy.com"
      },
      {
        title: "Interaction Design Foundation: User Research & Usability",
        whyRequired: "Provides deep evidence-based UX research methods and usability testing frameworks.",
        difficulty: "Intermediate",
        price: "$16/month",
        type: "paid",
        prerequisites: "Figma & UI design basics mastered in Stage 1",
        learnOutcome: "Conduct user interviews, design usability tests, and synthesize actionable design insights.",
        relatedSkills: ["User Research", "Usability Testing", "Information Architecture"],
        url: "https://www.interaction-design.org"
      }
    ],
    technologies: [
      "Figma", "Adobe XD", "Miro", "Framer", "Protopie", "UsabilityHub", "Maze", "Design Systems", "HTML/CSS Basics"
    ],
    learningRoadmap: [
      {
        stage: "Beginner",
        topics: ["Visual Design Fundamentals (Hierarchy, Contrast, Alignment)", "Figma UI Essentials (Frames, Vectors, Constraints)", "Wireframing & Low-Fidelity Layouts", "User Persona & User Journey Mapping"],
        courses: ["Google UX Design Certificate", "Figma Design Essentials"],
        skills: ["Figma", "UI Basics", "Wireframing"],
        tasks: ["Create low-fidelity wireframes for a web application", "Design a high-fidelity mobile app screen in Figma"],
        projects: ["Redesign of a Local Business Website", "Recipe Mobile App UI Wireframe Kit"]
      },
      {
        stage: "Intermediate",
        topics: ["Figma Auto Layout & Reusable Component Libraries (building on Stage 1 Figma skills)", "High-Fidelity Interactive Prototyping", "Conducting Usability Testing Sessions", "Web Accessibility (WCAG 2.1 Color Contrast & Tap Targets)"],
        courses: ["IDF User Research & Usability"],
        skills: ["Design Systems", "Prototyping", "Usability Testing"],
        tasks: ["Conduct a usability test session and write a feedback report", "Build a component library with variants in Figma"],
        projects: ["Full SaaS Dashboard Design System & High-Fidelity Prototype", "E-Commerce Checkout UX Case Study"]
      },
      {
        stage: "Advanced",
        topics: ["Design System Governance & Design Tokens (building on Stage 2 Component Libraries)", "Advanced Motion Design & Micro-Interactions", "Information Architecture & Card Sorting Methods", "Developer Handoff Documentation & Specs"],
        courses: ["Advanced Figma Design Systems"],
        skills: ["Design Architecture", "Motion Design", "Developer Handoff"],
        tasks: ["Create developer handoff documentation with design tokens and redline specs"],
        projects: ["Comprehensive Enterprise Product UX Case Study (Problem to Solution)"]
      },
      {
        stage: "Job Ready",
        topics: ["UX Case Study Portfolio Presentation Writing", "Design Critique & Interview Defense Practice", "Collaborating with Engineering & Product Managers", "Published Figma Portfolio & UX Internship"],
        courses: ["Portfolio Building & Design Interview Prep"],
        skills: ["Case Study Writing", "Presentation", "Product Strategy"],
        tasks: ["Publish an in-depth UX Case Study on Behance / Notion / Personal Website"],
        projects: ["Portfolio-level Product Design Case Study with Live Figma Prototype"]
      }
    ],
    tasks: [
      {
        id: "ux-task-1",
        title: "Create Low-Fidelity Wireframes",
        description: "Sketches and digital low-fidelity wireframes for a 4-screen user flow (Home, Search, Details, Checkout) in Figma prioritizing information hierarchy.",
        difficulty: "Beginner",
        requiredSkills: ["Figma", "Wireframing", "Layout"],
        estimatedTime: "3 Hours",
        prerequisites: "Figma tools basics",
        expectedOutcome: "Clear grayscale wireframes establishing page layout and navigation structure without visual distractions.",
        stage: "Beginner"
      },
      {
        id: "ux-task-2",
        title: "Design High-Fidelity Mobile UI Screens",
        description: "Apply typography, color palettes, spacing grids, and iconography to convert wireframes from Task 1 into polished, high-fidelity Figma screens.",
        difficulty: "Beginner",
        requiredSkills: ["Figma", "Color Theory", "Typography", "Visual Design"],
        estimatedTime: "4 Hours",
        prerequisites: "UI design principles & Figma UI tools from Stage 1",
        expectedOutcome: "Pixel-perfect mobile UI screens compliant with Apple HIG / Google Material 3 design guidelines.",
        stage: "Beginner"
      },
      {
        id: "ux-task-3",
        title: "Build a Figma Component Library with Variants",
        description: "Using Figma skills from Stage 1, create reusable master components (buttons, input fields, modals, cards) utilizing Auto Layout and Component Variants.",
        difficulty: "Intermediate",
        requiredSkills: ["Figma", "Auto Layout", "Component Variants", "Design Systems"],
        estimatedTime: "5 Hours",
        prerequisites: "Figma Auto Layout mastery from Stage 1",
        expectedOutcome: "A modular design system library allowing quick drag-and-drop UI composition with instant variant switching.",
        stage: "Intermediate"
      },
      {
        id: "ux-task-4",
        title: "Conduct a Usability Testing Session",
        description: "Write a usability testing script, test your interactive Figma prototype with 3-5 users, record usability obstacles, and synthesize a feedback report.",
        difficulty: "Intermediate",
        requiredSkills: ["Usability Testing", "UX Research", "Feedback Synthesis"],
        estimatedTime: "6 Hours",
        prerequisites: "Interactive prototyping skills from Stage 2",
        expectedOutcome: "A structured UX research report outlining user friction points and data-backed design iteration fixes.",
        stage: "Intermediate"
      },
      {
        id: "ux-task-5",
        title: "Create Developer Handoff Documentation",
        description: "Prepare Figma files for engineering handoff including spacing specs, color variables, asset exports, typography styles, and interactive state specs.",
        difficulty: "Advanced",
        requiredSkills: ["Developer Handoff", "Design Tokens", "Redlining"],
        estimatedTime: "4 Hours",
        prerequisites: "Design systems & basic HTML/CSS knowledge from Stage 2",
        expectedOutcome: "Clean, inspection-ready Figma specs enabling software engineers to build exact implementations.",
        stage: "Advanced"
      }
    ],
    projects: [
      {
        level: "Beginner",
        title: "Mobile App Redesign Case Study",
        description: "Identify UX pain points in an existing mobile application, create updated user flows, and design a refreshed high-fidelity UI layout.",
        technologies: ["Figma", "Miro", "UX Research"],
        keyFeatures: ["Before vs After comparison", "User journey map", "High-fidelity Figma mockups"]
      },
      {
        level: "Intermediate",
        title: "SaaS Analytics Dashboard Design System & Prototype",
        description: "Design a complex web dashboard featuring data visualization widgets, dark mode themes, modular component libraries, and interactive flows.",
        technologies: ["Figma", "Auto Layout", "Design Systems"],
        keyFeatures: ["Light/Dark mode components", "Interactive chart states", "Modular UI kit"]
      },
      {
        level: "Advanced",
        title: "End-to-End Mobile App Case Study (Research to Prototype)",
        description: "A complete product design case study starting from initial user interviews and persona creation through wireframing, testing, and final prototype.",
        technologies: ["Figma", "UsabilityHub", "Miro", "Framer"],
        keyFeatures: ["User research synthesis", "Usability test results", "Clickable micro-interactions prototype"]
      },
      {
        level: "Portfolio-level",
        title: "Published Web Case Study Portfolio with Embedded Interactive Prototypes",
        description: "An executive-ready online portfolio website presenting 3 detailed product design case studies with embedded live Figma prototypes.",
        technologies: ["Figma", "Framer / Webflow", "UX Writing", "Portfolio Strategy"],
        keyFeatures: ["Problem-solution story arc", "Embedded interactive prototypes", "Metrics & business impact reflection"]
      }
    ],
    realWorldExperience: [
      {
        title: "Published Figma Community UI Kit & Icon Set",
        type: "Open Source",
        stage: "Intermediate",
        description: "Publish a free open-source UI component library or icon set on Figma Community for other designers to duplicate and use.",
        resumeOutcome: "Published open-source Figma Community design system duplicated by 100+ community designers.",
        platforms: ["Figma Community", "Dribbble", "Behance"],
        verificationTip: "Provide link to published Figma Community file."
      },
      {
        title: "Non-Profit Web / App UX Redesign Audit",
        type: "Volunteer Work",
        stage: "Intermediate",
        description: "Conduct a heuristic UX evaluation and redesign audit for a non-profit organization's website or mobile app.",
        resumeOutcome: "Conducted heuristic UX audit for non-profit website, redesigning donation and signup conversion flows.",
        platforms: ["Catchafire", "VolunteerMatch", "Local Non-Profits"],
        verificationTip: "Provide link to UX Audit report or Figma redesign file."
      },
      {
        title: "Design Sprint & Hackathon Prototype Challenge",
        type: "Hackathon",
        stage: "Advanced",
        description: "Participate in a 48-hour design sprint or product hackathon, delivering rapid wireframes, user testing, and interactive prototypes.",
        resumeOutcome: "Collaborated with developers in a 48-hour hackathon to design user flows and high-fidelity interactive prototypes.",
        platforms: ["Devpost", "Framer Contests", "Figma Design Sprints"],
        verificationTip: "Provide hackathon project submission link or demo prototype."
      },
      {
        title: "Product Design / UX Virtual Internship",
        type: "Internship",
        stage: "Job Ready",
        description: "Complete a virtual product design internship solving user research challenges, component library specs, and executive presentations.",
        resumeOutcome: "Completed Virtual Product Design Internship; created wireframes, component libraries, and interactive prototypes.",
        platforms: ["Forage (Virtual Internships)", "AngelList", "Internshala", "LinkedIn Jobs"],
        verificationTip: "Provide virtual internship certificate or submitted Figma case study."
      }
    ],
    recommendations: {
      certifications: [
        "Google UX Design Professional Certificate",
        "Nielsen Norman Group (NN/g) UX Certification",
        "Interaction Design Foundation (IxDF) Certified Designer"
      ],
      portfolioIdeas: [
        "In-depth written Case Studies on Notion, Behance, or custom Framer website",
        "Figma Community published UI kit or icon set",
        "Short interactive prototype videos on LinkedIn / Twitter"
      ],
      githubIdeas: [
        "Store design token JSONs and SVG asset exports in public GitHub repos",
        "Contribute UI designs to open-source software projects",
        "Document CSS/Tailwind design system mappings"
      ],
      interviewPrep: [
        "Walkthrough of your design process (Discover, Define, Design, Deliver)",
        "How you handle developer pushback or design feedback",
        "Accessibility considerations (WCAG contrast, screen reader order)",
        "Measuring UX success with metrics (SUS score, task completion rate)"
      ],
      resumeSkills: ["Figma", "UI Design", "UX Research", "Wireframing", "Prototyping", "Design Systems", "Usability Testing", "Auto Layout"],
      importantTech: ["Figma", "Framer", "Miro", "Design Tokens"],
      nextCareerStep: "Junior UI/UX Designer → Mid-Level Product Designer → Senior UI/UX Specialist → Head of Design / Product Design Lead"
    }
  }
};

const CAREER_PLATFORM_URLS = {
  Coursera: 'https://www.coursera.org',
  Udemy: 'https://www.udemy.com',
  edX: 'https://www.edx.org',
  'LinkedIn Learning': 'https://www.linkedin.com/learning',
  freeCodeCamp: 'https://www.freecodecamp.org',
  Kaggle: 'https://www.kaggle.com',
  'Google Skillshop': 'https://skillshop.withgoogle.com',
  'HubSpot Academy': 'https://academy.hubspot.com',
  'Microsoft Learn': 'https://learn.microsoft.com',
  'Salesforce Trailhead': 'https://trailhead.salesforce.com',
  Forage: 'https://www.theforage.com',
  GitHub: 'https://github.com',
  Figma: 'https://www.figma.com/resources/learn-design/',
  Aimlabs: 'https://aimlabs.com/',
  'IESF Academy': 'https://academy.iesf.org/'
};

function titleCase(input = '') {
  return input
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

function platformUrl(name) {
  return CAREER_PLATFORM_URLS[name] || `https://www.google.com/search?q=${encodeURIComponent(`${name} learning`)}`;
}

function buildBaseProfile(goalTitle) {
  return {
    industry: 'modern professional teams and startups',
    whereUsed: 'innovative startups, agencies, enterprise departments, and small businesses',
    overviewFocus: `building reliable workflows, practical deliverables, and a strong portfolio as a ${goalTitle}`,
    marketOutlook: 'Steady demand for people who can learn quickly, deliver consistently, and explain their work well.',
    salaryBand: '$50,000 - $70,000 / year (Junior Associate)',
    coreTools: [`${goalTitle} tools`, 'Git', 'Documentation', 'Automation', 'Cloud or collaboration apps'],
    beginnerSkills: [`${goalTitle} fundamentals`, 'Tool setup', 'Workflow basics', 'Documentation habits', 'Baseline quality checks'],
    intermediateSkills: [`Applied ${goalTitle} workflows (building on Stage 1)`, 'Project delivery', 'Collaboration', 'Testing or review habits', 'Feedback loops'],
    advancedSkills: [`Advanced ${goalTitle} strategy (building on Stage 2)`, 'Optimization', 'Leadership', 'Interview storytelling', 'Scale and reliability'],
    softSkills: ['Communication', 'Critical thinking', 'Adaptability', 'Time management'],
    courseNames: [`${goalTitle} Foundations`, `Applied ${goalTitle} Masterclass`, `Advanced ${goalTitle} Systems`],
    coursePlatforms: ['Coursera', 'Udemy', 'edX'],
    beginnerTopics: [`${goalTitle} core concepts`, 'Workspace setup and tooling', 'Starter workflow practice', 'Capturing proof of work'],
    intermediateTopics: [`Apply ${goalTitle} skills in a project`, 'Improve quality and consistency', 'Work with constraints and feedback', 'Document outcomes and decisions'],
    advancedTopics: [`Scale ${goalTitle} work for reliability and impact`, 'Handle edge cases and trade-offs', 'Refine portfolio-ready deliverables', 'Practice interviews and critiques'],
    jobReadyTopics: ['Resume and portfolio polish', 'Verified evidence and recommendations', 'Networking and applications', 'Interview practice and follow-up'],
    taskTitles: [
      `Configure a ${goalTitle} workspace`,
      `Build a starter ${goalTitle} deliverable`,
      `Execute an applied ${goalTitle} project`,
      `Audit and refine ${goalTitle} deliverables`
    ],
    taskDescriptions: [
      `Set up the essential tools and workflow used in ${goalTitle} work.`,
      `Turn the basics into a small, shareable deliverable.`,
      `Apply what you learned to a more realistic problem with feedback or testing.`,
      `Review, improve, and document your work so it is interview-ready.`
    ],
    taskOutcomes: [
      `A clean, configured ${goalTitle} workspace with notes and checkpoints.`,
      `A starter project that proves the fundamentals are working.`,
      `A practical deliverable with clear results and next steps.`,
      `A polished final asset that can be explained in interviews.`
    ],
    projectTitles: [
      `Starter ${goalTitle} Portfolio Piece`,
      `Applied ${goalTitle} Case Study`,
      `Advanced ${goalTitle} Capstone`,
      `Published ${goalTitle} Portfolio Showcase`
    ],
    projectDescriptions: [
      `A focused starter project demonstrating core ${goalTitle} fundamentals.`,
      `An applied case study showing how ${goalTitle} skills solve a real problem.`,
      `A more advanced capstone built with scale, quality, or stakeholder needs in mind.`,
      `A public portfolio piece that combines the best work into a job-ready showcase.`
    ],
    experienceEntries: [
      {
        title: `${goalTitle} Community Contribution`,
        type: 'Volunteer Work',
        stage: 'Intermediate',
        description: `Contribute a useful fix, template, resource, or improvement to a public project or community effort related to ${goalTitle}.`,
        resumeOutcome: `Contributed public work that shows real-world ${goalTitle} collaboration and delivery.`,
        platforms: ['Community forums', 'Local nonprofits', 'VolunteerMatch'],
        verificationTip: 'Provide a public artifact, contribution link, or written proof of completion.'
      },
      {
        title: `${goalTitle} Freelance Micro-Gig`,
        type: 'Freelance Micro-Gig',
        stage: 'Intermediate',
        description: `Take a small client-style task or nonprofit request and deliver a useful ${goalTitle} outcome on a short timeline.`,
        resumeOutcome: `Delivered a client-style project that proves ${goalTitle} skills in a real setting.`,
        platforms: ['Upwork', 'Fiverr', 'Catchafire', 'Local networking'],
        verificationTip: 'Provide a live link, client approval, or repository proof.'
      },
      {
        title: `${goalTitle} Challenge or Hackathon Build`,
        type: 'Hackathon',
        stage: 'Advanced',
        description: `Ship a time-boxed ${goalTitle} prototype, presentation, or solution in a challenge, contest, or hackathon.`,
        resumeOutcome: `Built and presented a time-sensitive ${goalTitle} solution under real constraints.`,
        platforms: ['Devpost', 'Event communities', 'Challenge platforms'],
        verificationTip: 'Provide the submission page, demo video, or judging feedback.'
      },
      {
        title: `${goalTitle} Virtual Internship`,
        type: 'Internship',
        stage: 'Job Ready',
        description: `Complete a structured internship-style project that mirrors the daily work expected from a ${goalTitle}.`,
        resumeOutcome: `Completed an internship-style experience with portfolio evidence and documented results.`,
        platforms: ['Forage', 'LinkedIn Jobs', 'Internshala', 'University boards'],
        verificationTip: 'Provide a completion certificate, published portfolio, or project repository.'
      }
    ],
    certifications: [`${goalTitle} professional certificate`, 'Portfolio-based proof of practice'],
    portfolioIdeas: [
      `Publish a case study showing how you solve ${goalTitle} problems`,
      `Share a before/after project and lessons learned`
    ],
    githubIdeas: [
      `Use GitHub or a portfolio site to document ${goalTitle} work`,
      'Write concise README files with screenshots and outcomes'
    ],
    interviewPrep: [
      `Explain your ${goalTitle} workflow from start to finish`,
      'Discuss how you decide priorities and measure success',
      'Walk through one project and its trade-offs'
    ],
    resumeSkills: [`${goalTitle} fundamentals`, 'Project delivery', 'Documentation', 'Communication'],
    importantTech: [`${goalTitle} tools`, 'Git', 'Documentation'],
    nextCareerStep: `Junior ${goalTitle} → Mid-level ${goalTitle} → Senior ${goalTitle}`
  };
}

function createProfile(goalTitle, overrides = {}) {
  return {
    ...buildBaseProfile(goalTitle),
    ...overrides
  };
}

function getCareerFamilyProfile(goalTitle) {
  const query = goalTitle.toLowerCase();

  if (/game designer/.test(query)) {
    return createProfile(goalTitle, {
      industry: 'game studios, indie teams, mobile game publishers, and interactive media companies',
      whereUsed: 'AAA and indie studios, mobile games, VR/AR experiences, simulation, and serious games',
      overviewFocus: `designing rules, levels, progression, and player experiences for a ${goalTitle}`,
      professionalDoes: 'Designs game mechanics, writes clear design documentation, prototypes player experiences, tunes difficulty and progression, works with artists and programmers, and improves ideas through playtesting.',
      coreTools: ['Game engine editor', 'Miro or FigJam', 'Spreadsheets', 'Figma', 'Issue tracker', 'Playtest recording'],
      beginnerSkills: ['Game loops and player goals', 'Mechanic prototyping', 'Level flow', 'Clear game design documentation', 'Playtest observation'],
      intermediateSkills: ['Systems design', 'Progression and economy', 'Level pacing', 'Balancing with data', 'Cross-discipline collaboration'],
      advancedSkills: ['Feature strategy', 'Live balancing', 'Player retention analysis', 'Production trade-offs', 'Design leadership'],
      courseNames: ['Game Design Fundamentals', 'Level Design and Systems Design', 'Game Balancing and Production'],
      coursePlatforms: ['Coursera', 'Figma', 'edX'],
      taskTitles: ['Write a core game loop and mechanic brief', 'Prototype a playable level flow', 'Balance progression with playtest data', 'Deliver a portfolio-ready game design case study'],
      taskDescriptions: ['Define the player goal, rules, inputs, feedback, failure states, and success criteria for one original mechanic.', 'Create a paper, blockout, or engine prototype of a short level and test whether players understand the intended path.', 'Run a small playtest, record friction points, and tune difficulty, rewards, or pacing using documented evidence.', 'Present a complete design case study covering problem, decisions, prototype, playtest findings, and iteration.'],
      taskOutcomes: ['A concise game design document and prototype that another teammate can implement.', 'A playable level blockout with a clear player journey and playtest notes.', 'A balancing report with before-and-after values and player evidence.', 'A polished game design portfolio piece with prototype footage and design rationale.'],
      projectTitles: ['Core Mechanic Prototype', 'Level Flow Blockout', 'Progression and Economy Tuning Case Study', 'Game Design Portfolio Case Study']
    });
  }

  if (/esports coach/.test(query)) {
    return createProfile(goalTitle, {
      industry: 'professional esports teams, collegiate programs, tournament organizations, and gaming academies',
      whereUsed: 'team coaching, player development, tournament preparation, scouting, and performance programs',
      overviewFocus: `developing players and team systems through VOD analysis, practice design, strategy, and feedback as an ${goalTitle}`,
      professionalDoes: 'Reviews team and opponent VODs, plans practices, develops player roles, communicates adjustments, protects team culture, and prepares squads for tournament conditions.',
      coreTools: ['Replay/VOD tools', 'Discord', 'Performance spreadsheets', 'Tactical whiteboard', 'Match database', 'Scheduling tools'],
      beginnerSkills: ['Game rules and roles', 'VOD timestamping', 'Constructive feedback', 'Practice planning', 'Team communication'],
      intermediateSkills: ['Opponent scouting', 'Draft or map strategy', 'Scrim review', 'Player development plans', 'Performance metrics'],
      advancedSkills: ['Tournament preparation', 'Team culture', 'Strategic adaptation', 'Conflict management', 'Program leadership'],
      courseNames: ['Esports Coaching Foundations', 'VOD Review and Team Strategy', 'Performance Psychology for Esports Teams'],
      coursePlatforms: ['IESF Academy', 'Aimlabs', 'Coursera'],
      taskTitles: ['Build a player assessment and practice plan', 'Review a team VOD and deliver feedback', 'Scout an opponent and prepare a match plan', 'Create a tournament coaching portfolio'],
      taskDescriptions: ['Assess a player role, strengths, recurring errors, and goals, then create a measurable weekly practice plan.', 'Review a full team VOD with timestamps and give specific, respectful feedback tied to team objectives.', 'Study an opponent, identify patterns, and create map, draft, or round plans with contingency options.', 'Compile coaching philosophy, VOD reviews, practice plans, match results, and references into a portfolio.'],
      taskOutcomes: ['A documented improvement plan with measurable practice targets.', 'A timestamped VOD review that players can act on immediately.', 'An evidence-based opponent scouting and preparation document.', 'A reviewable coaching portfolio demonstrating analysis, communication, and results.'],
      projectTitles: ['Player Development Plan', 'Team VOD Review Library', 'Opponent Scouting Playbook', 'Esports Coaching Portfolio']
    });
  }

  if (/ux researcher/.test(query)) {
    return createProfile(goalTitle, {
      industry: 'product teams, UX consultancies, research agencies, and technology companies',
      whereUsed: 'digital products, services, healthcare, finance, education, ecommerce, and consumer research',
      overviewFocus: `studying user behavior and turning evidence into product decisions as a ${goalTitle}`,
      professionalDoes: 'Plans research, recruits participants, conducts interviews and usability studies, synthesizes evidence, communicates insights, and partners with product and design teams.',
      coreTools: ['Figma', 'Miro', 'Dovetail or research repository', 'Survey tools', 'Video conferencing', 'Spreadsheets'],
      beginnerSkills: ['Research questions', 'Interview moderation', 'Note-taking', 'Usability testing', 'Research ethics'],
      intermediateSkills: ['Study planning', 'Thematic analysis', 'Survey design', 'Journey mapping', 'Insight storytelling'],
      advancedSkills: ['Mixed-method research', 'Research operations', 'Product strategy', 'Experiment evaluation', 'Executive communication'],
      courseNames: ['UX Research Fundamentals', 'User Interviews and Usability Testing', 'Mixed-Methods Product Research'],
      coursePlatforms: ['Coursera', 'Figma', 'edX'],
      taskTitles: ['Write a UX research plan and discussion guide', 'Run and analyze three user interviews', 'Conduct a usability test and prioritize findings', 'Publish a UX research case study'],
      taskDescriptions: ['Define a product problem, research questions, participant criteria, method, consent approach, and analysis plan.', 'Conduct three structured interviews, anonymize notes, code themes, and separate evidence from assumptions.', 'Test a prototype with representative users, measure task success and friction, and prioritize findings by impact and confidence.', 'Create a case study showing research question, method, evidence, insights, product recommendation, and limitations.'],
      taskOutcomes: ['A defensible research plan and interview guide.', 'A coded research repository with themes supported by participant evidence.', 'A usability report with prioritized recommendations and clear metrics.', 'A portfolio case study that demonstrates ethical, rigorous research.'],
      projectTitles: ['Interview Research Study', 'Usability Testing Report', 'Customer Journey Research Case Study', 'UX Research Portfolio']
    });
  }

  if (/(3d artist|animator)/.test(query)) {
    const animation = /animator/.test(query);
    return createProfile(goalTitle, {
      industry: 'game studios, animation houses, VFX teams, advertising, film, and interactive media',
      whereUsed: 'games, film, television, advertising, product visualization, VR/AR, and freelance production',
      overviewFocus: animation ? `communicating motion, timing, and story through animation as an ${goalTitle}` : `creating production-ready 3D assets, materials, lighting, and renders as a ${goalTitle}`,
      professionalDoes: animation ? 'Creates character, object, or motion sequences, studies timing and posing, iterates from feedback, and delivers clean animation files for production.' : 'Models, unwraps, textures, lights, and renders optimized 3D assets while following references, technical budgets, naming standards, and production feedback.',
      coreTools: animation ? ['Blender or Maya', 'Animation timeline', 'Rigging tools', 'After Effects', 'Reference video', 'Render tools'] : ['Blender or Maya', 'Substance 3D', 'ZBrush', 'Photoshop', 'Render engine', 'Asset tracker'],
      beginnerSkills: animation ? ['Timing and spacing', 'Posing', 'Keyframes', 'Reference analysis', 'File organization'] : ['Modeling fundamentals', 'Topology', 'UVs', 'Materials', 'Lighting basics'],
      intermediateSkills: animation ? ['Body mechanics', 'Facial or object acting', 'Graph editor', 'Rig controls', 'Shot continuity'] : ['Sculpting', 'Texturing', 'Lighting', 'Optimization', 'Engine import settings'],
      advancedSkills: animation ? ['Polished performance', 'Animation systems', 'Director feedback', 'Production consistency', 'Portfolio presentation'] : ['Real-time optimization', 'Shader look development', 'Asset pipelines', 'Technical art collaboration', 'Production quality control'],
      courseNames: animation ? ['Animation Principles in Blender', 'Character Animation and Acting', 'Production Animation Workflow'] : ['Blender 3D Asset Creation', 'Texturing and Materials for Production', 'Real-Time 3D Art and Optimization'],
      coursePlatforms: ['Blender', 'Coursera', 'edX'],
      taskTitles: animation ? ['Animate a short readable motion study', 'Create a character or object acting shot', 'Polish a production-ready animation sequence', 'Publish an animation reel with breakdowns'] : ['Model and texture a production-ready asset', 'Create a lit scene with material references', 'Optimize a 3D asset for a real-time engine', 'Publish a 3D art portfolio with breakdowns'],
      taskDescriptions: animation ? ['Create a short animation focused on timing, spacing, arcs, and clear intent using reference footage.', 'Animate a character or object performing an action with readable poses, contact, anticipation, and follow-through.', 'Iterate from critique, clean curves and transitions, and deliver a consistent shot with organized files.', 'Build a reel showing final shots plus brief breakdowns of blocking, polish, tools, and revisions.'] : ['Model, UV, texture, and present one asset with clean topology, naming, scale, and reference matching.', 'Build a small scene with intentional lighting and materials, then compare the render against references.', 'Import the asset into a real-time engine, measure performance, and reduce triangles, texture memory, or shader cost.', 'Publish final renders, wireframes, texture sheets, lighting views, and a concise production breakdown.'],
      taskOutcomes: animation ? ['A readable motion study with an exported video and timing notes.', 'A polished acting or motion shot with blocking and final passes.', 'A clean production sequence with organized source files and revision notes.', 'A professional reel with breakdown evidence and contact information.'] : ['A production-ready asset with renders, wireframe, UV, and texture evidence.', 'A reference-driven scene with lighting and material decisions documented.', 'An optimized asset with before-and-after performance measurements.', 'A portfolio page showing final work and technical breakdowns.'],
      projectTitles: animation ? ['Motion Principles Study', 'Character Acting Shot', 'Polished Animation Sequence', 'Animation Reel'] : ['Game-Ready 3D Asset', 'Reference Lighting Scene', 'Optimized Real-Time Asset Pack', '3D Art Portfolio']
    });
  }

  if (/hr specialist/.test(query)) {
    return createProfile(goalTitle, {
      industry: 'people operations, recruiting, human resources, and employee experience teams',
      whereUsed: 'startups, corporations, nonprofits, hospitals, education, staffing, and public-sector organizations',
      overviewFocus: `supporting fair hiring, employee operations, documentation, and workplace programs as an ${goalTitle}`,
      professionalDoes: 'Coordinates recruiting and onboarding, maintains accurate employee records, supports policies and benefits processes, protects confidentiality, and helps employees and managers navigate people operations.',
      coreTools: ['Applicant tracking system', 'HRIS', 'Google Workspace', 'Spreadsheets', 'Survey tools', 'Documentation system'],
      beginnerSkills: ['Recruiting workflow', 'Interview coordination', 'Employee documentation', 'Confidentiality', 'Professional communication'],
      intermediateSkills: ['Sourcing and screening', 'Onboarding design', 'People data reporting', 'Policy communication', 'Employee support'],
      advancedSkills: ['Workforce planning', 'People analytics', 'Process improvement', 'Compliance awareness', 'Stakeholder partnership'],
      courseNames: ['Human Resources Foundations', 'Recruiting and People Operations', 'People Analytics and Workplace Practice'],
      coursePlatforms: ['Coursera', 'LinkedIn Learning', 'edX'],
      taskTitles: ['Map a compliant recruiting workflow', 'Create an inclusive interview kit', 'Build an onboarding experience and checklist', 'Analyze people operations data responsibly'],
      taskDescriptions: ['Document each recruiting step from approved role to offer, including owners, candidate communication, records, and privacy boundaries.', 'Create structured interview questions and a scoring rubric that focuses on job evidence and reduces inconsistent evaluation.', 'Design a first-30-days onboarding journey with manager tasks, employee resources, check-ins, and feedback points.', 'Analyze an anonymized sample dataset, identify a process issue, and present a careful recommendation without exposing private information.'],
      taskOutcomes: ['A clear recruiting process map with responsible data handling.', 'A structured interview kit with consistent evaluation criteria.', 'A complete onboarding checklist and employee experience plan.', 'A privacy-safe people analytics report with transparent assumptions.'],
      projectTitles: ['Recruiting Process Map', 'Structured Interview Toolkit', 'New-Hire Onboarding Program', 'People Operations Case Study']
    });
  }

  if (/digital marketer/.test(query)) {
    return createProfile(goalTitle, {
      industry: 'marketing, growth, content, agency, ecommerce, and revenue teams',
      whereUsed: 'startups, agencies, creator businesses, ecommerce, SaaS, nonprofits, and consumer brands',
      overviewFocus: `planning campaigns, creating useful content, measuring performance, and improving conversion as a ${goalTitle}`,
      professionalDoes: 'Researches audiences, plans campaigns, creates and tests content, manages channels, measures traffic and conversion, and turns performance data into the next marketing decision.',
      coreTools: ['Google Analytics', 'Search Console', 'SEO tools', 'Email platform', 'Ad platform', 'Content calendar'],
      beginnerSkills: ['Audience research', 'Copywriting', 'Content planning', 'SEO basics', 'Analytics basics'],
      intermediateSkills: ['Campaign execution', 'Conversion tracking', 'A/B testing', 'Email journeys', 'Funnel analysis'],
      advancedSkills: ['Growth strategy', 'Budget optimization', 'Attribution limits', 'Retention', 'Marketing leadership'],
      courseNames: ['Google Digital Marketing and E-commerce', 'HubSpot Content Marketing', 'Google Analytics Measurement'],
      coursePlatforms: ['Coursera', 'HubSpot Academy', 'Google Skillshop'],
      taskTitles: ['Research an audience and write a campaign brief', 'Create an SEO content cluster and landing page', 'Run a measured email or social campaign experiment', 'Publish a growth case study with real metrics'],
      taskDescriptions: ['Define an audience, problem, offer, channel, message, success metric, and ethical data assumptions for a campaign.', 'Research search intent, map a content cluster, and create a useful landing page with a clear conversion path.', 'Launch a small campaign or controlled simulation, track events, compare variants, and explain what the data can and cannot prove.', 'Present campaign goals, creative, channel choices, results, limitations, and the next improvement using truthful metrics.'],
      taskOutcomes: ['A focused campaign brief that connects audience needs to measurable outcomes.', 'A search-informed content asset and conversion-ready page.', 'An experiment report with clean tracking and defensible conclusions.', 'A portfolio case study showing decisions, results, and learning.'],
      projectTitles: ['Audience and Campaign Brief', 'SEO Content Cluster', 'Conversion Experiment', 'Digital Marketing Growth Case Study']
    });
  }

  if (/(esports player|esport player|professional gamer|competitive gamer|pro gamer)/.test(query)) {
    return createProfile(goalTitle, {
      industry: 'esports teams, tournament circuits, gaming organizations, and creator-led competitive communities',
      whereUsed: 'professional teams, collegiate esports programs, tournament organizers, gaming houses, streaming platforms, and sponsorship programs',
      overviewFocus: `developing competitive game performance through deliberate practice, match analysis, team communication, and sustainable athlete habits as an ${goalTitle}`,
      professionalDoes: `Practices game mechanics and decision-making, reviews match VODs, communicates with teammates, prepares for tournaments, tracks performance trends, and protects sleep, posture, focus, and recovery while competing.`,
      marketOutlook: 'Competitive opportunities are selective; a strong player profile combines measurable improvement, team reliability, tournament history, and healthy training habits.',
      salaryBand: '$0 - $100,000+ / year (prize money, team salary, streaming, and sponsorships vary widely)',
      salaryLevels: {
        beginner: 'Amateur: tournament prizes, small team stipends, or community competition',
        intermediate: 'Semi-pro: team stipend, tournament earnings, coaching/content income',
        advanced: 'Professional: team salary, sponsorships, tournament winnings, and media income'
      },
      coreTools: ['Chosen game', 'Replay/VOD review', 'Aimlabs or mechanics trainer', 'OBS Studio', 'Discord', 'Performance spreadsheet'],
      beginnerSkills: ['Game rules and role fundamentals', 'Reliable mechanics practice', 'Map or level knowledge', 'Communication callouts', 'Warm-up and recovery routine'],
      intermediateSkills: ['VOD review and error tagging', 'Positioning and decision-making', 'Team strategy and scrims', 'Patch/meta adaptation', 'Performance tracking'],
      advancedSkills: ['Tournament preparation', 'Opponent scouting', 'Composure under pressure', 'Team leadership', 'Personal brand and sponsor readiness'],
      softSkills: ['Composure', 'Coachability', 'Clear communication', 'Discipline', 'Respectful sportsmanship'],
      courseNames: ['Aimlabs Academy: Aim and Mechanics Training', 'IESF Academy: Esports Player Development', 'Esports Performance, Team Psychology, and Tournament Readiness'],
      coursePlatforms: ['Aimlabs', 'IESF Academy', 'IESF Academy'],
      courseOutcomes: [
        'Build a repeatable mechanics routine, understand aim fundamentals, and track accuracy or reaction-time improvement.',
        'Learn player development principles covering practice structure, team communication, mindset, and responsible competition.',
        'Prepare a sustainable performance plan covering tournament focus, recovery, pressure management, and team readiness.'
      ],
      beginnerTopics: ['Choose a game, role, and measurable rank goal', 'Build a 30-minute warm-up', 'Learn maps, settings, and core mechanics', 'Record baseline match statistics'],
      intermediateTopics: ['Review your own VODs using mistake categories', 'Practice team communication and scrim routines', 'Track decision quality, not only wins', 'Adapt to patches and opponent patterns'],
      advancedTopics: ['Scout opponents and prepare tournament plans', 'Build a pressure and recovery routine', 'Create a player resume with verified results', 'Prepare highlight, VOD, and team references'],
      jobReadyTopics: ['Tournament history and player profile', 'Team tryout preparation', 'Sponsorship and content boundaries', 'Sustainable athlete schedule and applications'],
      taskTitles: ['Create a measurable warm-up and baseline match report', 'Review three match VODs and tag decision errors', 'Complete a structured scrim block with team comms review', 'Prepare a tournament-ready player profile and tryout package'],
      taskDescriptions: ['Select your game and role, record settings and baseline statistics, then follow a repeatable mechanics and focus warm-up for one week.', 'Review three of your own matches, mark positioning, mechanics, communication, and decision errors, then choose two fixes to practice.', 'Play or simulate a scrim block, save the VOD, gather teammate feedback, and write a short report on communication and strategy adjustments.', 'Build a player profile containing rank history, tournament results, role, VOD clips, availability, team values, and a recovery plan.'],
      taskOutcomes: ['A repeatable warm-up plan and baseline report with measurable metrics such as accuracy, K/D, damage, objective rate, or equivalent game statistics.', 'A VOD review document with timestamped evidence, recurring error patterns, and a focused practice plan.', 'A scrim review showing clear communication, coachability, team contribution, and specific next improvements.', 'A truthful, reviewable esports resume and tryout package with match history, clips, references, and availability.'],
      projectTitles: ['Personal Performance Baseline Dashboard', 'VOD Review and Improvement Journal', 'Team Scrim Strategy Playbook', 'Tournament Player Portfolio'],
      projectDescriptions: ['Track mechanics, decision-making, sleep, and match statistics over four weeks.', 'Create timestamped reviews of your matches and measure whether targeted mistakes decrease.', 'Document team roles, communication rules, map plans, and post-scrim adjustments.', 'Present tournament history, clips, VOD links, role strengths, and a sustainable training plan.'],
      certifications: ['IESF Academy course completion', 'Tournament or league participation record'],
      portfolioIdeas: ['Show a verified player profile with match history and VOD analysis', 'Publish improvement charts and explain the practice changes behind them'],
      githubIdeas: ['Track performance data and VOD notes in a private or public repository', 'Use issues for recurring mistakes and close them with match evidence'],
      interviewPrep: ['Explain how you turn a VOD mistake into a practice drill', 'Describe how you communicate after a lost round or match', 'Discuss your training schedule, recovery habits, and team expectations'],
      resumeSkills: ['VOD Review', 'Team Communication', 'Tournament Preparation', 'Performance Tracking', 'Game Knowledge', 'Sportsmanship'],
      importantTech: ['Chosen game', 'Replay/VOD tools', 'Aimlabs', 'OBS Studio', 'Discord', 'Performance tracking'],
      nextCareerStep: `Amateur ${goalTitle} → Semi-Pro ${goalTitle} → Professional ${goalTitle} / Team Captain`
    });
  }

  if (/(game developer|game programmer|gameplay programmer|unity developer|unreal developer|godot developer)/.test(query)) {
    return createProfile(goalTitle, {
      industry: 'game studios, indie teams, mobile game companies, and interactive entertainment teams',
      whereUsed: 'AAA studios, indie studios, mobile game publishers, VR/AR teams, simulation companies, and game technology startups',
      overviewFocus: `building playable experiences with game engines, gameplay code, tools, and performance budgets as a ${goalTitle}`,
      professionalDoes: `Builds and debugs gameplay features, integrates art and audio assets, profiles frame time and memory, collaborates with designers during playtests, and ships stable builds for PC, console, mobile, or VR platforms.`,
      marketOutlook: 'Strong opportunities for developers who can ship polished playable prototypes and explain their technical decisions.',
      salaryBand: '$55,000 - $145,000 / year (Junior to Senior)',
      salaryLevels: {
        beginner: '$45,000 - $70,000 / year (Junior Gameplay Developer)',
        intermediate: '$70,000 - $105,000 / year (Gameplay or Tools Developer)',
        advanced: '$105,000 - $160,000+ / year (Senior Gameplay or Engine Developer)'
      },
      coreTools: ['Unity or Unreal Engine', 'C# or C++', 'Blender', 'Git', 'Visual Studio', 'Profiler tools'],
      beginnerSkills: ['Game loop and input handling', 'C# or C++ fundamentals', '2D/3D scene setup', 'Git version control', 'Debugging and playtesting'],
      intermediateSkills: ['Gameplay systems', 'Physics and collision', 'Animation state machines', 'UI and save systems', 'Team code reviews'],
      advancedSkills: ['Performance profiling', 'Memory and draw-call optimization', 'AI behavior systems', 'Networked gameplay basics', 'Build and release pipelines'],
      softSkills: ['Player empathy', 'Iteration from playtest feedback', 'Technical communication', 'Scope management', 'Team collaboration'],
      courseNames: ['Game Development with Unity or Unreal', 'Gameplay Programming and Systems', 'Game Optimization and Production'],
      coursePlatforms: ['Unity Learn', 'Epic Online Learning', 'Coursera'],
      beginnerTopics: ['Scenes, prefabs, assets, and the game loop', 'Input, movement, and camera control', 'Version control for game projects', 'Small playable prototype and README'],
      intermediateTopics: ['Reusable gameplay components', 'Physics, animation, UI, and save data', 'Playtest feedback and bug triage', 'Collaborative branch and review workflow'],
      advancedTopics: ['Profiler-driven optimization', 'AI, networking, and scalable systems', 'Build automation and platform packaging', 'Technical breakdown for a portfolio review'],
      jobReadyTopics: ['Polished vertical slice', 'Gameplay programming case study', 'Demo video and playable build', 'Studio-style code review and interview practice'],
      taskTitles: ['Build a playable movement and camera prototype', 'Create a reusable combat or interaction system', 'Ship a vertical slice with UI, save data, and playtest fixes', 'Profile and optimize a game build for a target platform'],
      taskDescriptions: ['Create a small playable scene with input, movement, camera follow, collisions, and a clear win condition.', 'Build a reusable gameplay system such as health, inventory, dialogue, or combat with configurable components.', 'Package a 5-minute vertical slice, collect playtest notes, fix the top issues, and document the design and code decisions.', 'Use the engine profiler to find CPU, GPU, memory, or loading bottlenecks and prove the improvement with before-and-after measurements.'],
      taskOutcomes: ['A playable prototype with responsive controls, clean project structure, and a short gameplay video.', 'A tested, reusable gameplay system demonstrated in a working scene with clear setup instructions.', 'A polished vertical slice with a playable build, feedback log, bug fixes, and portfolio-ready documentation.', 'A performance report showing measured improvements and the technical trade-offs behind each optimization.'],
      projectTitles: ['Playable Mechanics Prototype', 'Reusable Gameplay Systems Demo', 'Vertical Slice Showcase', 'Optimized Portfolio Game'],
      projectDescriptions: ['A small game loop demonstrating controls, camera, collisions, and feedback.', 'A modular system such as combat, inventory, dialogue, or quest tracking with a test scene.', 'A polished vertical slice with a clear player goal, art direction, audio, UI, and playtest iteration.', 'A production-minded game build with profiling evidence, optimized assets, and a technical breakdown.'],
      certifications: ['Unity Certified Associate or Unreal learning credential', 'Game jam participation certificate'],
      portfolioIdeas: ['Show a playable build, 60-second demo video, and controls guide', 'Include profiler screenshots, playtest findings, and a technical postmortem'],
      githubIdeas: ['Document architecture decisions and asset licensing in the README', 'Use issue tracking for bugs, playtest feedback, and optimization work'],
      interviewPrep: ['Explain one gameplay system from input to player feedback', 'Walk through a profiling problem and the measured fix', 'Discuss scope decisions, playtest feedback, and trade-offs'],
      resumeSkills: ['Unity / Unreal', 'C# / C++', 'Gameplay Systems', 'Optimization', 'Playtesting', 'Git'],
      importantTech: ['Unity or Unreal Engine', 'C# or C++', 'Blender', 'Profiler tools', 'Git'],
      nextCareerStep: `Junior ${goalTitle} → Gameplay / Tools Developer → Senior ${goalTitle}`
    });
  }

  if (/(software engineer|software developer|backend|frontend|full stack|fullstack|systems engineer|qa engineer|qa automation|test engineer|devops|site reliability|sre|application engineer|automation engineer|mobile engineer|embedded|platform engineer)/.test(query)) {
    return createProfile(goalTitle, {
      industry: 'software and platform engineering teams',
      whereUsed: 'SaaS companies, product teams, agencies, startups, and enterprise engineering groups',
      overviewFocus: `designing, building, testing, and shipping reliable digital products as a ${goalTitle}`,
      marketOutlook: 'High demand across software, platform, and infrastructure teams.',
      salaryBand: '$65,000 - $130,000 / year (Junior to Mid-level)',
      coreTools: ['Git', 'VS Code', 'CLI', 'Testing tools', 'APIs', 'Cloud basics'],
      beginnerSkills: [`${goalTitle} fundamentals`, 'Environment setup', 'Version control', 'Debugging basics', 'Documentation'],
      intermediateSkills: [`Applied ${goalTitle} workflows (building on Stage 1)`, 'API integration', 'Testing and code quality', 'Collaboration', 'Issue tracking'],
      advancedSkills: [`Advanced ${goalTitle} architecture (building on Stage 2)`, 'System design', 'Performance and security', 'Release management', 'Scalability'],
      courseNames: [`${goalTitle} Foundations`, `Applied ${goalTitle} Engineering`, `Advanced ${goalTitle} Delivery`],
      coursePlatforms: ['Coursera', 'freeCodeCamp', 'edX'],
      beginnerTopics: [`Core ${goalTitle} concepts`, 'Tooling and environment setup', 'Small feature implementation', 'Proof of work and README habits'],
      intermediateTopics: [`Build a real ${goalTitle} project`, 'Add tests, debugging, and review loops', 'Work with APIs or data flows', 'Collaborate on a larger deliverable'],
      advancedTopics: [`Scale ${goalTitle} work for performance and reliability`, 'Handle edge cases and deployment', 'Document architecture and trade-offs', 'Prepare for interviews and code reviews'],
      taskTitles: [`Configure a ${goalTitle} engineering workspace`, `Build a starter ${goalTitle} feature`, `Implement an applied ${goalTitle} workflow`, `Optimize and audit ${goalTitle} deliverables`],
      projectTitles: [`${goalTitle} Starter App`, `${goalTitle} Workflow Project`, `${goalTitle} Capstone System`, `Published ${goalTitle} Portfolio`],
      certifications: [`${goalTitle} professional certificate`, 'Git/GitHub workflow certificate'],
      portfolioIdeas: [
        `Ship a demo-driven ${goalTitle} project with tests`,
        'Show architecture diagrams, screenshots, and metrics'
      ],
      githubIdeas: [
        `Use issues, branches, and pull requests to document ${goalTitle} progress`,
        'Include setup, test, and deployment instructions'
      ],
      interviewPrep: [
        `Explain one ${goalTitle} feature from idea to release`,
        'Discuss debugging and quality strategies',
        'Talk through scaling or performance trade-offs'
      ],
      resumeSkills: [`${goalTitle} fundamentals`, 'Testing', 'APIs', 'Git', 'Deployment'],
      importantTech: ['Git', 'APIs', 'Testing', 'Deployment'],
      nextCareerStep: `Junior ${goalTitle} → ${goalTitle} → Senior ${goalTitle}`
    });
  }

  if (/(data|analyst|science|machine learning|ai|analytics|bi|insight|data engineer)/.test(query)) {
    return createProfile(goalTitle, {
      industry: 'analytics and AI teams',
      whereUsed: 'business intelligence, finance, healthcare, retail, and research organizations',
      overviewFocus: 'turning data into decisions, forecasts, and automation',
      marketOutlook: 'Strong demand for people who can turn messy data into clear action.',
      salaryBand: '$60,000 - $140,000 / year (Junior to Mid-level)',
      coreTools: ['SQL', 'Python', 'Pandas', 'Tableau / Power BI', 'Notebooks', 'Git'],
      beginnerSkills: ['SQL queries', 'Data cleaning', 'Exploratory analysis', 'Dashboard basics', 'Spreadsheet fluency'],
      intermediateSkills: ['Statistics', 'Feature engineering', 'Model evaluation', 'Experiment analysis', 'Data storytelling'],
      advancedSkills: ['MLOps basics', 'Automation', 'Pipeline design', 'Model monitoring', 'Decision support'],
      softSkills: ['Business storytelling', 'Critical thinking', 'Documentation', 'Collaboration'],
      courseNames: [`${goalTitle} Foundations`, `Applied ${goalTitle} Analytics`, `Advanced ${goalTitle} Deployment`],
      coursePlatforms: ['Kaggle', 'Coursera', 'edX'],
      beginnerTopics: [`${goalTitle} core concepts`, 'Data cleaning and quality checks', 'Exploratory analysis and charts', 'Proof of insight with a notebook'],
      intermediateTopics: [`Apply ${goalTitle} skills to a real dataset`, 'Build models or dashboards', 'Validate outcomes with metrics', 'Document decisions and assumptions'],
      advancedTopics: [`Scale ${goalTitle} work with pipelines or automation`, 'Evaluate edge cases and bias', 'Turn analysis into actionable recommendations', 'Prepare a portfolio that explains impact'],
      taskTitles: [`Set up a ${goalTitle} analysis workspace`, `Build a starter ${goalTitle} insight report`, `Execute an applied ${goalTitle} model or dashboard`, `Audit and refine ${goalTitle} deliverables`],
      projectTitles: [`${goalTitle} Insight Dashboard`, `${goalTitle} Forecasting Case Study`, `${goalTitle} Capstone Analysis`, `Published ${goalTitle} Portfolio`],
      certifications: ['Google Data Analytics Professional Certificate', 'IBM Data Science Professional Certificate'],
      portfolioIdeas: [
        `Publish a notebook or dashboard that explains one ${goalTitle} problem`,
        'Show how your analysis changed a decision or recommendation'
      ],
      githubIdeas: [
        'Store notebooks, cleaned datasets, and reproducible scripts',
        'Add clear README notes on metrics, assumptions, and limitations'
      ],
      interviewPrep: [
        `Explain the data flow in your ${goalTitle} project`,
        'Discuss model or dashboard trade-offs',
        'Talk about data quality and business impact'
      ],
      resumeSkills: ['SQL', 'Python', 'Pandas', 'Tableau / Power BI', 'Statistics', 'Machine Learning'],
      importantTech: ['SQL', 'Python', 'Pandas', 'Tableau / Power BI', 'scikit-learn'],
      nextCareerStep: `Junior ${goalTitle} → Data Scientist / Analytics Lead → Senior Analytics / ML Lead`
    });
  }

  if (/(product manager|product owner|project manager|program manager|business analyst|product ops)/.test(query)) {
    return createProfile(goalTitle, {
      industry: 'product, strategy, and delivery teams',
      whereUsed: 'SaaS, e-commerce, startups, enterprise transformation, and cross-functional teams',
      overviewFocus: 'framing problems, aligning stakeholders, and shipping measurable outcomes',
      marketOutlook: 'Strong demand for people who can coordinate teams and deliver outcomes.',
      salaryBand: '$70,000 - $140,000 / year (Junior to Mid-level)',
      coreTools: ['Jira', 'Notion', 'Miro', 'Figma', 'Google Sheets', 'Analytics dashboards'],
      beginnerSkills: ['User interviews', 'Problem framing', 'Roadmap basics', 'Stakeholder updates', 'Metrics literacy'],
      intermediateSkills: ['PRDs', 'Experiment design', 'Prioritization frameworks', 'Cross-functional coordination', 'Release planning'],
      advancedSkills: ['Launch leadership', 'Portfolio strategy', 'OKRs', 'Experimentation at scale', 'Executive communication'],
      softSkills: ['Facilitation', 'Decision making', 'Negotiation', 'Storytelling'],
      courseNames: [`${goalTitle} Foundations`, `Applied ${goalTitle} Execution`, `Advanced ${goalTitle} Strategy`],
      coursePlatforms: ['Coursera', 'LinkedIn Learning', 'edX'],
      beginnerTopics: [`${goalTitle} core concepts`, 'Stakeholder mapping and user problems', 'Roadmap thinking and prioritization', 'Capturing proof of work'],
      intermediateTopics: [`Apply ${goalTitle} skills in a project`, 'Improve backlog and launch execution', 'Work with feedback and metrics', 'Document trade-offs and decisions'],
      advancedTopics: [`Scale ${goalTitle} work for reliability and impact`, 'Handle competing priorities and constraints', 'Refine portfolio-ready deliverables', 'Practice interview storytelling and critique'],
      taskTitles: [`Write a ${goalTitle} problem brief`, `Build a starter ${goalTitle} launch plan`, `Execute an applied ${goalTitle} roadmap`, `Audit and refine ${goalTitle} deliverables`],
      projectTitles: [`${goalTitle} Discovery Case Study`, `${goalTitle} Launch Plan`, `${goalTitle} Strategy Capstone`, `Published ${goalTitle} Portfolio`],
      certifications: ['Pragmatic Institute Product Management', 'Scrum / Agile certification'],
      portfolioIdeas: [
        `Show a roadmap and a case study for one ${goalTitle} decision`,
        'Include interview notes, prioritization, and outcome metrics'
      ],
      githubIdeas: [
        'Store PRDs, planning docs, and change logs in a public portfolio',
        'Use simple diagrams and screenshots to show your thinking'
      ],
      interviewPrep: [
        `Explain how you prioritize as a ${goalTitle}`,
        'Discuss stakeholder conflicts and trade-offs',
        'Walk through a launch or experiment from start to finish'
      ],
      resumeSkills: ['Roadmapping', 'Stakeholder Management', 'Metrics', 'Documentation', 'Prioritization'],
      importantTech: ['Jira', 'Notion', 'Miro', 'Figma', 'Analytics'],
      nextCareerStep: `Associate ${goalTitle} → ${goalTitle} → Senior ${goalTitle}`
    });
  }

  if (/(marketing|growth|seo|content|brand|social media|copywriter|performance marketing|sales|account executive|customer success|crm)/.test(query)) {
    return createProfile(goalTitle, {
      industry: 'marketing, growth, and revenue teams',
      whereUsed: 'agencies, startups, ecommerce, creator businesses, and SaaS companies',
      overviewFocus: 'building campaigns, measuring results, and improving reach or conversion',
      marketOutlook: 'Good demand for people who can combine creativity with measurement.',
      salaryBand: '$45,000 - $120,000 / year (Junior to Mid-level)',
      coreTools: ['Google Analytics', 'SEO tools', 'HubSpot', 'Meta Ads', 'Canva', 'Spreadsheets'],
      beginnerSkills: ['Channel basics', 'Content planning', 'Audience research', 'Reporting fundamentals', 'Copywriting basics'],
      intermediateSkills: ['Campaign setup', 'Conversion tracking', 'Experimentation', 'Client or stakeholder communication', 'Funnel thinking'],
      advancedSkills: ['Growth strategy', 'Budget optimization', 'Retention and lifecycle analysis', 'Scaling systems', 'Executive reporting'],
      softSkills: ['Creativity', 'Communication', 'Persuasion', 'Adaptability'],
      courseNames: [`${goalTitle} Foundations`, `Applied ${goalTitle} Campaigns`, `Advanced ${goalTitle} Growth`],
      coursePlatforms: ['HubSpot Academy', 'Google Skillshop', 'Coursera'],
      beginnerTopics: [`${goalTitle} core concepts`, 'Audience and channel basics', 'Create a content or outreach plan', 'Track results and learn from data'],
      intermediateTopics: [`Apply ${goalTitle} skills in a campaign`, 'Test messaging or targeting', 'Measure conversion and retention', 'Document what worked and why'],
      advancedTopics: [`Scale ${goalTitle} work across channels`, 'Optimize budgets and automation', 'Build a repeatable growth system', 'Prepare case studies for interviews'],
      taskTitles: [`Create a ${goalTitle} campaign brief`, `Build a starter ${goalTitle} funnel`, `Execute an applied ${goalTitle} growth sprint`, `Audit and refine ${goalTitle} deliverables`],
      projectTitles: [`${goalTitle} Content Campaign`, `${goalTitle} Growth Case Study`, `${goalTitle} Capstone Launch`, `Published ${goalTitle} Portfolio`],
      certifications: ['HubSpot Content Marketing Certification', 'Google Ads or Google Analytics certification'],
      portfolioIdeas: [
        `Show a campaign with clear goals, creative, and results for ${goalTitle}`,
        'Include before/after metrics and what you would improve next'
      ],
      githubIdeas: [
        'Use a public portfolio or repository to store campaign assets and notes',
        'Keep concise summaries of tests, metrics, and decisions'
      ],
      interviewPrep: [
        `Explain a ${goalTitle} campaign from idea to results`,
        'Discuss how you used data to improve performance',
        'Walk through one example of learning from an experiment'
      ],
      resumeSkills: ['Campaign Strategy', 'Analytics', 'Copywriting', 'A/B Testing', 'Reporting'],
      importantTech: ['Google Analytics', 'SEO tools', 'HubSpot', 'Meta Ads', 'Canva'],
      nextCareerStep: `Coordinator ${goalTitle} → ${goalTitle} Specialist → Senior ${goalTitle}`
    });
  }

  if (/(finance|accounting|auditor|banking|investment|fp&a|bookkeeping|trading|operations|supply chain|logistics|procurement|operations manager|business operations)/.test(query)) {
    return createProfile(goalTitle, {
      industry: 'finance, operations, and business systems teams',
      whereUsed: 'banks, fintech, retail, manufacturing, logistics, and enterprise operations',
      overviewFocus: 'building accurate reporting, efficient systems, and dependable business execution',
      marketOutlook: 'Consistent demand for people who can improve accuracy, reporting, and process quality.',
      salaryBand: '$50,000 - $125,000 / year (Junior to Mid-level)',
      coreTools: ['Excel / Sheets', 'Accounting or ERP tools', 'Power BI / Tableau', 'SQL basics', 'Documentation', 'Git'],
      beginnerSkills: ['Spreadsheet fluency', 'Data entry and cleanup', 'Process basics', 'Report reading', 'Documentation habits'],
      intermediateSkills: ['Forecasting', 'Variance analysis', 'Workflow improvement', 'Stakeholder updates', 'Quality checks'],
      advancedSkills: ['Risk and controls', 'Automation', 'Scenario planning', 'Optimization', 'Executive reporting'],
      softSkills: ['Attention to detail', 'Reliability', 'Communication', 'Problem solving'],
      courseNames: [`${goalTitle} Foundations`, `Applied ${goalTitle} Reporting`, `Advanced ${goalTitle} Operations`],
      coursePlatforms: ['LinkedIn Learning', 'Coursera', 'Microsoft Learn'],
      beginnerTopics: [`${goalTitle} core concepts`, 'Spreadsheets and reporting basics', 'Understanding workflows and controls', 'Capturing proof of work'],
      intermediateTopics: [`Apply ${goalTitle} skills in a report or process`, 'Improve accuracy and speed', 'Work with real constraints and feedback', 'Document decisions and assumptions'],
      advancedTopics: [`Scale ${goalTitle} work with automation and controls`, 'Handle exceptions and risk', 'Refine portfolio-ready deliverables', 'Practice interview case questions'],
      taskTitles: [`Set up a ${goalTitle} reporting workspace`, `Build a starter ${goalTitle} report`, `Execute an applied ${goalTitle} process improvement`, `Audit and refine ${goalTitle} deliverables`],
      projectTitles: [`${goalTitle} Reporting Dashboard`, `${goalTitle} Process Case Study`, `${goalTitle} Capstone Review`, `Published ${goalTitle} Portfolio`],
      certifications: ['Excel / Power BI certificate', 'Financial modeling or process improvement certification'],
      portfolioIdeas: [
        `Show a dashboard, model, or process fix for one ${goalTitle} problem`,
        'Document how accuracy or efficiency improved'
      ],
      githubIdeas: [
        'Store spreadsheets, templates, and documentation in a clean portfolio structure',
        'Use versioned files and notes explaining each change'
      ],
      interviewPrep: [
        `Explain your ${goalTitle} reporting process`,
        'Discuss how you catch errors and manage risk',
        'Walk through one improvement and its measurable impact'
      ],
      resumeSkills: ['Excel / Sheets', 'Reporting', 'Forecasting', 'Automation', 'Process Improvement'],
      importantTech: ['Excel / Sheets', 'Power BI / Tableau', 'SQL basics', 'ERP / accounting tools'],
      nextCareerStep: `Junior ${goalTitle} → ${goalTitle} Analyst / Specialist → Senior ${goalTitle}`
    });
  }

  if (/(healthcare|medical|nurse|clinic|clinical|pharmacy|public health|health informatics|therapist|education|teacher|teaching|instructional designer|trainer|learning and development|l&d)/.test(query)) {
    return createProfile(goalTitle, {
      industry: 'healthcare, education, and people-development teams',
      whereUsed: 'hospitals, clinics, schools, universities, nonprofits, and training organizations',
      overviewFocus: 'supporting people through structured care, learning, or service delivery',
      marketOutlook: 'Stable demand for professionals who can communicate clearly and follow structured processes.',
      salaryBand: '$40,000 - $110,000 / year (Junior to Mid-level)',
      coreTools: ['Documentation systems', 'Scheduling tools', 'Presentation tools', 'LMS / EHR basics', 'Spreadsheets', 'Collaboration tools'],
      beginnerSkills: ['Domain terminology', 'Documentation', 'Workflow basics', 'Communication', 'Safety or privacy awareness'],
      intermediateSkills: ['Case management', 'Assessment or planning', 'Coordination', 'Feedback loops', 'Service quality'],
      advancedSkills: ['Program improvement', 'Compliance awareness', 'Escalation handling', 'Leadership', 'Outcome tracking'],
      softSkills: ['Empathy', 'Active listening', 'Organization', 'Patience'],
      courseNames: [`${goalTitle} Foundations`, `Applied ${goalTitle} Practice`, `Advanced ${goalTitle} Leadership`],
      coursePlatforms: ['Coursera', 'LinkedIn Learning', 'edX'],
      beginnerTopics: [`${goalTitle} core concepts`, 'Documentation and communication habits', 'Tools and workflows', 'Capturing proof of work'],
      intermediateTopics: [`Apply ${goalTitle} skills in a case or lesson`, 'Improve service quality or learner outcomes', 'Work with feedback and boundaries', 'Document decisions and reflections'],
      advancedTopics: [`Scale ${goalTitle} work with quality systems`, 'Handle exceptions and compliance', 'Refine portfolio-ready deliverables', 'Prepare interview stories and references'],
      taskTitles: [`Set up a ${goalTitle} documentation workflow`, `Build a starter ${goalTitle} plan or lesson`, `Execute an applied ${goalTitle} service project`, `Audit and refine ${goalTitle} deliverables`],
      projectTitles: [`${goalTitle} Care or Learning Case Study`, `${goalTitle} Service Improvement Project`, `${goalTitle} Capstone Program`, `Published ${goalTitle} Portfolio`],
      certifications: ['Relevant professional license or certification', 'Continuing education certificate'],
      portfolioIdeas: [
        `Show a care plan, lesson plan, or service improvement for ${goalTitle}`,
        'Explain the problem, process, and outcome in plain language'
      ],
      githubIdeas: [
        'Keep portfolio files organized and easy to review',
        'Use de-identified examples and clear documentation'
      ],
      interviewPrep: [
        `Explain your ${goalTitle} workflow`,
        'Discuss empathy, quality, and safety or learning outcomes',
        'Walk through a case, lesson, or service example'
      ],
      resumeSkills: ['Documentation', 'Coordination', 'Communication', 'Process Improvement', 'Quality Management'],
      importantTech: ['Documentation systems', 'Scheduling tools', 'LMS / EHR basics', 'Spreadsheets'],
      nextCareerStep: `Junior ${goalTitle} → ${goalTitle} Specialist → Senior ${goalTitle}`
    });
  }

  if (/(creative|graphic|visual designer|motion|brand designer|illustrator|copywriter|content creator|video editor|photographer|writer|editor|journalist)/.test(query)) {
    return createProfile(goalTitle, {
      industry: 'creative, brand, and content teams',
      whereUsed: 'agencies, media teams, creator businesses, startups, and internal brand teams',
      overviewFocus: 'turning ideas into clear, polished visual or written work',
      marketOutlook: 'Good demand for people who can combine taste, clarity, and consistency.',
      salaryBand: '$40,000 - $100,000 / year (Junior to Mid-level)',
      coreTools: ['Figma', 'Adobe Creative Cloud', 'Canva', 'Miro', 'Portfolio tools', 'Cloud storage'],
      beginnerSkills: ['Visual hierarchy', 'Brand voice', 'Layout basics', 'File organization', 'Feedback habits'],
      intermediateSkills: ['Campaign or story development', 'Style consistency', 'Asset iteration', 'Cross-team collaboration', 'Proofing'],
      advancedSkills: ['Creative direction', 'Systems thinking', 'Presentation', 'Speed and quality', 'Portfolio refinement'],
      softSkills: ['Creativity', 'Communication', 'Adaptability', 'Taste'],
      courseNames: [`${goalTitle} Foundations`, `Applied ${goalTitle} Production`, `Advanced ${goalTitle} Portfolio`],
      coursePlatforms: ['Figma', 'Coursera', 'LinkedIn Learning'],
      beginnerTopics: [`${goalTitle} core concepts`, 'Tool setup and file hygiene', 'Starter visual or writing exercises', 'Capturing proof of work'],
      intermediateTopics: [`Apply ${goalTitle} skills in a real brief`, 'Improve consistency and quality', 'Work with feedback and deadlines', 'Document iterations and results'],
      advancedTopics: [`Scale ${goalTitle} work across a system`, 'Handle brand or style constraints', 'Refine portfolio-ready deliverables', 'Prepare for critique and interview reviews'],
      taskTitles: [`Set up a ${goalTitle} production workspace`, `Build a starter ${goalTitle} asset`, `Execute an applied ${goalTitle} brief`, `Audit and refine ${goalTitle} deliverables`],
      projectTitles: [`${goalTitle} Brand or Content Concept`, `${goalTitle} Campaign or Case Study`, `${goalTitle} Capstone Portfolio`, `Published ${goalTitle} Showcase`],
      certifications: ['Adobe / Figma credential', 'Creative portfolio certificate or workshop'],
      portfolioIdeas: [
        `Show a before/after or concept-to-final example for ${goalTitle}`,
        'Explain your choices, revisions, and final outcome'
      ],
      githubIdeas: [
        'Store assets, drafts, and case-study notes in a clean portfolio structure',
        'Use README files to explain the concept and process'
      ],
      interviewPrep: [
        `Explain your ${goalTitle} process from brief to final`,
        'Discuss feedback, revisions, and brand consistency',
        'Walk through one project and why the final outcome works'
      ],
      resumeSkills: ['Creative Direction', 'Branding', 'Layout', 'Editing', 'Portfolio Presentation'],
      importantTech: ['Figma', 'Adobe Creative Cloud', 'Canva', 'Portfolio Tools'],
      nextCareerStep: `Junior ${goalTitle} → ${goalTitle} Specialist → Senior ${goalTitle}`
    });
  }

  return buildBaseProfile(goalTitle);
}

/**
 * Builds a dynamic career roadmap for custom or unrecognized roles.
 * Ensures no user input ever results in empty, generic, or broken roadmaps.
 */
export function buildCustomCareerRoadmap(careerGoal, _level = 'Beginner', _timeline = '1 Year') {
  const goalTitle = titleCase(careerGoal);
  const profile = getCareerFamilyProfile(goalTitle);

  const timelineHoursMap = {
    '6 Months': 520,
    '1 Year': 840,
    '2 Years': 1200,
    '3+ Years': 1600
  };
  const levelMultiplierMap = {
    Beginner: 1.15,
    Intermediate: 1.0,
    Advanced: 0.9
  };

  const totalHoursRequired = Math.round((timelineHoursMap[_timeline] || 900) * (levelMultiplierMap[_level] || 1));

  const courseNames = profile.courseNames || [`${goalTitle} Foundations`, `Applied ${goalTitle} Masterclass`, `Advanced ${goalTitle} Systems`];
  const coursePlatforms = profile.coursePlatforms || ['Coursera', 'Udemy', 'edX'];

  return {
    totalHoursRequired,
    estimatedSalary: profile.salaryBand,
    marketOutlook: profile.marketOutlook,
    careerOverview: {
      name: goalTitle,
      desc: `Specialized role focused on ${profile.overviewFocus}.`,
      whatProfessionalDoes: profile.professionalDoes || `Applies specialized skills, executes industry-specific workflows, solves targeted domain problems, and collaborates with cross-functional teams to deliver value as a ${goalTitle}.`,
      whereUsed: profile.whereUsed,
      expectedLevels: {
        beginner: profile.salaryLevels?.beginner || profile.salaryBand,
        intermediate: profile.salaryLevels?.intermediate || profile.salaryBand,
        advanced: profile.salaryLevels?.advanced || profile.salaryBand
      }
    },
    requiredSkills: {
      beginner: profile.beginnerSkills,
      intermediate: profile.intermediateSkills,
      advanced: profile.advancedSkills,
      softSkills: profile.softSkills
    },
    courses: [
      {
        title: courseNames[0],
        whyRequired: `Introduces the core tools and habits you need to start ${profile.overviewFocus}.`,
        difficulty: "Beginner",
        price: "Free",
        type: "free",
        prerequisites: "Basic computer literacy",
        learnOutcome: profile.courseOutcomes?.[0] || `Build a starter ${goalTitle} deliverable and explain your workflow clearly.`,
        relatedSkills: profile.beginnerSkills.slice(0, 3),
        url: platformUrl(coursePlatforms[0])
      },
      {
        title: courseNames[1],
        whyRequired: `Teaches applied methods, stronger tools, and project delivery for ${goalTitle} work.`,
        difficulty: "Intermediate",
        price: "$49.99",
        type: "paid",
        prerequisites: `${goalTitle} fundamentals mastered in Stage 1`,
        learnOutcome: profile.courseOutcomes?.[1] || `Create a practical ${goalTitle} project with feedback, structure, and measurable results.`,
        relatedSkills: profile.intermediateSkills.slice(0, 3),
        url: platformUrl(coursePlatforms[1])
      },
      {
        title: courseNames[2],
        whyRequired: `Prepares you for larger, more advanced ${goalTitle} responsibilities in a realistic setting.`,
        difficulty: "Advanced",
        price: "Free",
        type: "free",
        prerequisites: "Intermediate experience from Stage 2",
        learnOutcome: profile.courseOutcomes?.[2] || `Design, optimize, and present an interview-ready ${goalTitle} capstone.`,
        relatedSkills: profile.advancedSkills.slice(0, 3),
        url: platformUrl(coursePlatforms[2])
      }
    ],
    technologies: profile.coreTools,
    learningRoadmap: [
      {
        stage: "Beginner",
        topics: profile.beginnerTopics,
        courses: [courseNames[0]],
        skills: profile.beginnerSkills.slice(0, 4),
        tasks: [profile.taskTitles[0], profile.taskTitles[1]],
        projects: [profile.projectTitles[0]]
      },
      {
        stage: "Intermediate",
        topics: profile.intermediateTopics,
        courses: [courseNames[1]],
        skills: profile.intermediateSkills.slice(0, 4),
        tasks: [profile.taskTitles[2]],
        projects: [profile.projectTitles[1]]
      },
      {
        stage: "Advanced",
        topics: profile.advancedTopics,
        courses: [courseNames[2]],
        skills: profile.advancedSkills.slice(0, 4),
        tasks: [profile.taskTitles[3]],
        projects: [profile.projectTitles[2]]
      },
      {
        stage: "Job Ready",
        topics: profile.jobReadyTopics,
        courses: ["Career Readiness & Interview Mastery"],
        skills: ["Technical Communication", "Portfolio Presentation", "Interview Storytelling"],
        tasks: [`Publish and present ${goalTitle} achievements`],
        projects: [profile.projectTitles[3]]
      }
    ],
    tasks: [
      {
        id: "custom-task-1",
        title: profile.taskTitles[0],
        description: profile.taskDescriptions[0],
        difficulty: "Beginner",
        requiredSkills: profile.beginnerSkills.slice(0, 3),
        estimatedTime: "3 Hours",
        prerequisites: "Computer literacy",
        expectedOutcome: profile.taskOutcomes[0],
        stage: "Beginner"
      },
      {
        id: "custom-task-2",
        title: profile.taskTitles[1],
        description: profile.taskDescriptions[1],
        difficulty: "Beginner",
        requiredSkills: profile.beginnerSkills.slice(0, 3),
        estimatedTime: "4 Hours",
        prerequisites: "Environment setup from Task 1",
        expectedOutcome: profile.taskOutcomes[1],
        stage: "Beginner"
      },
      {
        id: "custom-task-3",
        title: profile.taskTitles[2],
        description: profile.taskDescriptions[2],
        difficulty: "Intermediate",
        requiredSkills: profile.intermediateSkills.slice(0, 3),
        estimatedTime: "6 Hours",
        prerequisites: "Core fundamentals mastered in Stage 1",
        expectedOutcome: profile.taskOutcomes[2],
        stage: "Intermediate"
      },
      {
        id: "custom-task-4",
        title: profile.taskTitles[3],
        description: profile.taskDescriptions[3],
        difficulty: "Advanced",
        requiredSkills: profile.advancedSkills.slice(0, 3),
        estimatedTime: "8 Hours",
        prerequisites: "Intermediate project experience from Stage 2",
        expectedOutcome: profile.taskOutcomes[3],
        stage: "Advanced"
      }
    ],
    projects: [
      {
        level: "Beginner",
        title: profile.projectTitles[0],
        description: profile.projectDescriptions[0],
        technologies: [profile.coreTools[0], "Git"],
        keyFeatures: ["Clean structure", "Documentation", "Core functionality"]
      },
      {
        level: "Intermediate",
        title: profile.projectTitles[1],
        description: profile.projectDescriptions[1],
        technologies: [profile.coreTools[0], profile.coreTools[1] || 'Git'],
        keyFeatures: ["Modular design", "Error handling", "User interface / API"]
      },
      {
        level: "Advanced",
        title: profile.projectTitles[2],
        description: profile.projectDescriptions[2],
        technologies: [profile.coreTools[0], profile.coreTools[1] || 'Git', "Cloud / Enterprise Stack"],
        keyFeatures: ["High performance", "Security compliance", "Full documentation"]
      },
      {
        level: "Portfolio-level",
        title: profile.projectTitles[3],
        description: profile.projectDescriptions[3],
        technologies: ["Portfolio Stack", "Git", "Deployment Tools"],
        keyFeatures: ["Live deployment", "Case study documentation", "Clean code repository"]
      }
    ],
    realWorldExperience: profile.experienceEntries,
    recommendations: {
      certifications: profile.certifications,
      portfolioIdeas: profile.portfolioIdeas,
      githubIdeas: profile.githubIdeas,
      interviewPrep: profile.interviewPrep,
      resumeSkills: profile.resumeSkills,
      importantTech: profile.importantTech,
      nextCareerStep: profile.nextCareerStep
    }
  };
}

function ensureCareerTaskStages(roadmap, careerGoal) {
  const requiredStages = ['Beginner', 'Intermediate', 'Advanced', 'Job Ready'];
  const tasks = Array.isArray(roadmap.tasks) ? [...roadmap.tasks] : [];
  const existingStages = new Set(tasks.map(task => task.stage));
  const displayGoal = titleCase(careerGoal || roadmap.careerOverview?.name || 'your career');

  requiredStages.forEach(stage => {
    if (existingStages.has(stage)) return;

    tasks.push({
      id: `career-${stage.toLowerCase().replace(/\s+/g, '-')}-task`,
      title: stage === 'Job Ready'
        ? `Publish a job-ready ${displayGoal} portfolio and case study`
        : `Complete the ${stage.toLowerCase()} ${displayGoal} practical milestone`,
      description: `Create and document a ${displayGoal} deliverable that demonstrates the skills expected at the ${stage} stage.`,
      difficulty: stage,
      requiredSkills: roadmap.requiredSkills?.[stage.toLowerCase()]?.slice(0, 3) || [],
      estimatedTime: stage === 'Job Ready' ? '8 Hours' : '4 Hours',
      prerequisites: stage === 'Beginner' ? 'Basic computer literacy' : `Verified ${requiredStages[requiredStages.indexOf(stage) - 1]} skills`,
      expectedOutcome: `A reviewable ${displayGoal} deliverable with a public link, screenshots, or written evidence and a clear explanation of your decisions.`,
      stage
    });
  });

  return { ...roadmap, tasks };
}

/**
 * Returns a complete, fully dynamic career roadmap for any requested career goal.
 */
export function getCareerRoadmap(careerGoal = '', level = 'Beginner', timeline = '1 Year') {
  const key = normalizeCareerKey(careerGoal);

  if (CAREER_KNOWLEDGE_BASE[key]) {
    // Return a clone of the curated career knowledge base
    return ensureCareerTaskStages(JSON.parse(JSON.stringify(CAREER_KNOWLEDGE_BASE[key])), careerGoal);
  }

  // Fallback to intelligent custom builder
  return ensureCareerTaskStages(buildCustomCareerRoadmap(careerGoal, level, timeline), careerGoal);
}
