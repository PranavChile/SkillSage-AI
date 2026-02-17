import type { Company, Course, ImprovementSuggestion, UniquenessResult } from '@/types';

// Companies by Domain
export const mockCompanies: Record<string, Company[]> = {
  'Software Engineering': [
    {
      name: 'Google',
      logo: 'https://logo.clearbit.com/google.com',
      website: 'https://careers.google.com',
      location: 'Bangalore, India',
      size: '100k+ employees',
      description: 'Leading technology company focusing on search, cloud computing, and AI innovations.',
      openRoles: 45,
      remoteFriendly: true,
      rating: 4.8
    },
    {
      name: 'Microsoft',
      logo: 'https://logo.clearbit.com/microsoft.com',
      website: 'https://careers.microsoft.com',
      location: 'Hyderabad, India',
      size: '200k+ employees',
      description: 'Global technology company known for cloud services, productivity software, and enterprise solutions.',
      openRoles: 38,
      remoteFriendly: true,
      rating: 4.7
    },
    {
      name: 'Amazon',
      logo: 'https://logo.clearbit.com/amazon.com',
      website: 'https://amazon.jobs',
      location: 'Bangalore, India',
      size: '1.5M+ employees',
      description: 'E-commerce and cloud computing giant with opportunities in multiple tech domains.',
      openRoles: 67,
      remoteFriendly: true,
      rating: 4.5
    },
    {
      name: 'Flipkart',
      logo: 'https://logo.clearbit.com/flipkart.com',
      website: 'https://www.flipkartcareers.com',
      location: 'Bangalore, India',
      size: '50k+ employees',
      description: 'Leading Indian e-commerce platform with strong technology and innovation focus.',
      openRoles: 23,
      remoteFriendly: true,
      rating: 4.3
    },
    {
      name: 'Zomato',
      logo: 'https://logo.clearbit.com/zomato.com',
      website: 'https://www.zomato.com/careers',
      location: 'Gurgaon, India',
      size: '5k+ employees',
      description: 'Food delivery and restaurant discovery platform with cutting-edge technology.',
      openRoles: 15,
      remoteFriendly: true,
      rating: 4.2
    },
    {
      name: 'Paytm',
      logo: 'https://logo.clearbit.com/paytm.com',
      website: 'https://careers.paytm.com',
      location: 'Noida, India',
      size: '10k+ employees',
      description: 'Digital payments and financial services company leveraging advanced technology.',
      openRoles: 28,
      remoteFriendly: false,
      rating: 4.0
    },
    {
      name: 'Infosys',
      logo: 'https://logo.clearbit.com/infosys.com',
      website: 'https://www.infosys.com/careers',
      location: 'Bangalore, India',
      size: '300k+ employees',
      description: 'Global IT services and consulting company with diverse technology projects.',
      openRoles: 32,
      remoteFriendly: true,
      rating: 4.1
    },
    {
      name: 'TCS',
      logo: 'https://logo.clearbit.com/tcs.com',
      website: 'https://www.tcs.com/careers',
      location: 'Mumbai, India',
      size: '500k+ employees',
      description: 'Leading IT services provider in India and globally with vast opportunities.',
      openRoles: 50,
      remoteFriendly: true,
      rating: 4.2
    }
  ],
  'Data Science': [
    {
      name: 'Netflix',
      logo: 'https://logo.clearbit.com/netflix.com',
      website: 'https://jobs.netflix.com',
      location: 'Mumbai, India',
      size: '11k+ employees',
      description: 'Streaming giant using advanced ML and data analytics for content recommendations.',
      openRoles: 12,
      remoteFriendly: true,
      rating: 4.6
    },
    {
      name: 'Uber',
      logo: 'https://logo.clearbit.com/uber.com',
      website: 'https://www.uber.com/careers',
      location: 'Bangalore, India',
      size: '26k+ employees',
      description: 'Mobility platform leveraging data science for route optimization and pricing.',
      openRoles: 18,
      remoteFriendly: true,
      rating: 4.4
    },
    {
      name: 'Swiggy',
      logo: 'https://logo.clearbit.com/swiggy.com',
      website: 'https://careers.swiggy.com',
      location: 'Bangalore, India',
      size: '3k+ employees',
      description: 'Food delivery platform using data science for demand forecasting and logistics.',
      openRoles: 8,
      remoteFriendly: true,
      rating: 4.3
    },
    {
      name: 'PhonePe',
      logo: 'https://logo.clearbit.com/phonepe.com',
      website: 'https://www.phonepe.com/careers',
      location: 'Bangalore, India',
      size: '3k+ employees',
      description: 'Digital payments platform utilizing ML for fraud detection and risk management.',
      openRoles: 14,
      remoteFriendly: true,
      rating: 4.5
    },
    {
      name: 'Ola',
      logo: 'https://logo.clearbit.com/olacabs.com',
      website: 'https://www.olacabs.com/careers',
      location: 'Bangalore, India',
      size: '5k+ employees',
      description: 'Mobility solutions company using data analytics for dynamic pricing and operations.',
      openRoles: 9,
      remoteFriendly: true,
      rating: 4.1
    },
    {
      name: 'BYJU\'S',
      logo: 'https://logo.clearbit.com/byjus.com',
      website: 'https://byjus.com/careers',
      location: 'Bangalore, India',
      size: '50k+ employees',
      description: 'EdTech platform using data science for personalized learning and student analytics.',
      openRoles: 11,
      remoteFriendly: false,
      rating: 3.9
    },
    {
      name: 'Fractal Analytics',
      logo: 'https://logo.clearbit.com/fractal.ai',
      website: 'https://fractal.ai/careers',
      location: 'Mumbai, India',
      size: '5k+ employees',
      description: 'AI and analytics company solving complex business problems with data science.',
      openRoles: 6,
      remoteFriendly: true,
      rating: 4.4
    }
  ],
  'Marketing': [
    {
      name: 'Unilever',
      logo: 'https://logo.clearbit.com/unilever.com',
      website: 'https://careers.unilever.com',
      location: 'Mumbai, India',
      size: '190k+ employees',
      description: 'Global consumer goods company with strong focus on digital marketing innovation.',
      openRoles: 16,
      remoteFriendly: true,
      rating: 4.5
    },
    {
      name: 'Procter & Gamble',
      logo: 'https://logo.clearbit.com/pg.com',
      website: 'https://www.pgcareers.com',
      location: 'Mumbai, India',
      size: '100k+ employees',
      description: 'Consumer goods giant known for innovative marketing strategies and brand management.',
      openRoles: 12,
      remoteFriendly: true,
      rating: 4.4
    },
    {
      name: 'Coca-Cola',
      logo: 'https://logo.clearbit.com/coca-cola.com',
      website: 'https://careers.coca-colacompany.com',
      location: 'Gurgaon, India',
      size: '86k+ employees',
      description: 'Global beverage company with opportunities in digital marketing and brand strategy.',
      openRoles: 8,
      remoteFriendly: true,
      rating: 4.3
    },
    {
      name: 'HUL',
      logo: 'https://logo.clearbit.com/hul.co.in',
      website: 'https://careers.hul.co.in',
      location: 'Mumbai, India',
      size: '190k+ employees',
      description: 'Leading FMCG company focusing on digital marketing and brand innovation.',
      openRoles: 10,
      remoteFriendly: true,
      rating: 4.4
    }
  ],
  'Finance': [
    {
      name: 'JPMorgan Chase',
      logo: 'https://logo.clearbit.com/jpmorganchase.com',
      website: 'https://careers.jpmorgan.com',
      location: 'Mumbai, India',
      size: '280k+ employees',
      description: 'Leading global financial services firm with diverse career opportunities.',
      openRoles: 22,
      remoteFriendly: true,
      rating: 4.6
    },
    {
      name: 'Goldman Sachs',
      logo: 'https://logo.clearbit.com/goldmansachs.com',
      website: 'https://www.goldmansachs.com/careers',
      location: 'Bangalore, India',
      size: '45k+ employees',
      description: 'Investment banking and financial services company known for innovation.',
      openRoles: 18,
      remoteFriendly: true,
      rating: 4.5
    },
    {
      name: 'HDFC Bank',
      logo: 'https://logo.clearbit.com/hdfcbank.com',
      website: 'https://www.hdfcbank.com/careers',
      location: 'Mumbai, India',
      size: '150k+ employees',
      description: 'Leading Indian private sector bank with extensive career opportunities.',
      openRoles: 45,
      remoteFriendly: false,
      rating: 4.3
    },
    {
      name: 'ICICI Bank',
      logo: 'https://logo.clearbit.com/icicibank.com',
      website: 'https://www.icicicareers.com',
      location: 'Mumbai, India',
      size: '100k+ employees',
      description: 'Major Indian private sector bank with technology-driven finance roles.',
      openRoles: 20,
      remoteFriendly: true,
      rating: 4.2
    },
    {
      name: 'Axis Bank',
      logo: 'https://logo.clearbit.com/axisbank.com',
      website: 'https://www.axisbank.com/careers',
      location: 'Mumbai, India',
      size: '80k+ employees',
      description: 'Banking and financial services with focus on digital transformation.',
      openRoles: 18,
      remoteFriendly: true,
      rating: 4.1
    }
  ],
  'Healthcare': [
    {
      name: 'Apollo Hospitals',
      logo: 'https://logo.clearbit.com/apollohospitals.com',
      website: 'https://www.apollohospitals.com/careers',
      location: 'Chennai, India',
      size: '10k+ employees',
      description: 'Leading hospital chain providing healthcare and medical research opportunities.',
      openRoles: 12,
      remoteFriendly: false,
      rating: 4.4
    },
    {
      name: 'Fortis Healthcare',
      logo: 'https://logo.clearbit.com/fortishealthcare.com',
      website: 'https://www.fortishealthcare.com/careers',
      location: 'Gurgaon, India',
      size: '8k+ employees',
      description: 'Healthcare provider with opportunities in management, technology, and research.',
      openRoles: 8,
      remoteFriendly: false,
      rating: 4.2
    }
  ],
  'Design': [
    {
      name: 'Frog Design',
      logo: 'https://logo.clearbit.com/frogdesign.com',
      website: 'https://www.frogdesign.com/careers',
      location: 'Bangalore, India',
      size: '2k+ employees',
      description: 'Global design and innovation consultancy focusing on product and UX design.',
      openRoles: 5,
      remoteFriendly: true,
      rating: 4.7
    },
    {
      name: 'IDEO',
      logo: 'https://logo.clearbit.com/ideo.com',
      website: 'https://www.ideo.com/careers',
      location: 'Mumbai, India',
      size: '1k+ employees',
      description: 'International design firm with emphasis on creative solutions and design thinking.',
      openRoles: 4,
      remoteFriendly: true,
      rating: 4.6
    }
  ],
  'Education': [
    {
      name: 'Byju\'s',
      logo: 'https://logo.clearbit.com/byjus.com',
      website: 'https://byjus.com/careers',
      location: 'Bangalore, India',
      size: '50k+ employees',
      description: 'EdTech platform providing personalized learning and analytics-driven education.',
      openRoles: 11,
      remoteFriendly: true,
      rating: 3.9
    },
    {
      name: 'Unacademy',
      logo: 'https://logo.clearbit.com/unacademy.com',
      website: 'https://unacademy.com/careers',
      location: 'Bangalore, India',
      size: '5k+ employees',
      description: 'Digital learning platform with roles in content, tech, and analytics.',
      openRoles: 7,
      remoteFriendly: true,
      rating: 4.2
    }
  ]
};

// Free Courses
export const freeCourses: Course[] = [
  {
    id: '1',
    title: 'Python for Data Science',
    platform: 'Coursera',
    duration: '4 weeks',
    level: 'Beginner',
    link: 'https://coursera.org',
    rating: 4.7,
    students: '500K+',
    certificate: true
  },
  {
    id: '2',
    title: 'Web Development Bootcamp',
    platform: 'freeCodeCamp',
    duration: '8 weeks',
    level: 'Beginner',
    link: 'https://freecodecamp.org',
    rating: 4.8,
    students: '1M+',
    certificate: true
  },
  {
    id: '3',
    title: 'Machine Learning Fundamentals',
    platform: 'Kaggle',
    duration: '6 weeks',
    level: 'Intermediate',
    link: 'https://kaggle.com',
    rating: 4.6,
    students: '300K+',
    certificate: true
  },
  {
    id: '4',
    title: 'React.js Complete Guide',
    platform: 'Scrimba',
    duration: '5 weeks',
    level: 'Intermediate',
    link: 'https://scrimba.com',
    rating: 4.9,
    students: '200K+',
    certificate: true
  },
  {
    id: '5',
    title: 'Digital Marketing Basics',
    platform: 'Google Digital Garage',
    duration: '3 weeks',
    level: 'Beginner',
    link: 'https://learndigital.withgoogle.com',
    rating: 4.5,
    students: '1M+',
    certificate: true
  },
  {
    id: '6',
    title: 'SQL for Data Analysis',
    platform: 'Mode Analytics',
    duration: '4 weeks',
    level: 'Beginner',
    link: 'https://mode.com',
    rating: 4.7,
    students: '250K+',
    certificate: false
  },
  {
    id: '7',
    title: 'JavaScript Algorithms',
    platform: 'freeCodeCamp',
    duration: '6 weeks',
    level: 'Advanced',
    link: 'https://freecodecamp.org',
    rating: 4.8,
    students: '400K+',
    certificate: true
  },
  {
    id: '8',
    title: 'UI/UX Design Fundamentals',
    platform: 'Coursera',
    duration: '5 weeks',
    level: 'Beginner',
    link: 'https://coursera.org',
    rating: 4.6,
    students: '180K+',
    certificate: true
  }
];

// Paid Courses
export const paidCourses: Course[] = [
  {
    id: 'p1',
    title: 'Full Stack Web Development',
    platform: 'Udemy',
    duration: '12 weeks',
    level: 'Intermediate',
    link: 'https://udemy.com',
    rating: 4.8,
    students: '150K+',
    price: '₹3,499',
    certificate: true
  },
  {
    id: 'p2',
    title: 'Data Science Specialization',
    platform: 'Coursera (Johns Hopkins)',
    duration: '10 weeks',
    level: 'Advanced',
    link: 'https://coursera.org',
    rating: 4.7,
    students: '100K+',
    price: '₹4,999',
    certificate: true
  },
  {
    id: 'p3',
    title: 'AWS Certified Solutions Architect',
    platform: 'A Cloud Guru',
    duration: '8 weeks',
    level: 'Advanced',
    link: 'https://acloudguru.com',
    rating: 4.9,
    students: '80K+',
    price: '₹5,999',
    certificate: true
  },
  {
    id: 'p4',
    title: 'Product Management Certification',
    platform: 'Product School',
    duration: '8 weeks',
    level: 'Intermediate',
    link: 'https://productschool.com',
    rating: 4.6,
    students: '25K+',
    price: '₹8,999',
    certificate: true
  },
  {
    id: 'p5',
    title: 'Google Project Management',
    platform: 'Coursera',
    duration: '6 months',
    level: 'Beginner',
    link: 'https://coursera.org',
    rating: 4.8,
    students: '200K+',
    price: '₹3,999',
    certificate: true
  },
  {
    id: 'p6',
    title: 'TensorFlow Developer Certificate',
    platform: 'DeepLearning.AI',
    duration: '10 weeks',
    level: 'Advanced',
    link: 'https://deeplearning.ai',
    rating: 4.9,
    students: '60K+',
    price: '₹6,499',
    certificate: true
  },
  {
    id: 'p7',
    title: 'MBA Essentials',
    platform: 'London Business School',
    duration: '12 weeks',
    level: 'Intermediate',
    link: 'https://london.edu',
    rating: 4.7,
    students: '15K+',
    price: '₹12,999',
    certificate: true
  },
  {
    id: 'p8',
    title: 'Cybersecurity Specialization',
    platform: 'Cybrary',
    duration: '16 weeks',
    level: 'Advanced',
    link: 'https://cybrary.it',
    rating: 4.8,
    students: '40K+',
    price: '₹7,999',
    certificate: true
  }
];

// Resume Improvements
export const mockImprovements: ImprovementSuggestion[] = [
  {
    category: 'skills',
    priority: 'high',
    title: 'Add Technical Skills Section',
    description: 'Your resume lacks a dedicated technical skills section that recruiters look for.',
    suggestion: 'Create a "Technical Skills" section highlighting programming languages, frameworks, and tools you\'ve used. Include proficiency levels for each skill.',
    impact: 'Can increase interview callbacks by 40% for technical roles'
  },
  {
    category: 'keywords',
    priority: 'high',
    title: 'Include Industry Keywords',
    description: 'Missing relevant industry-specific keywords that ATS systems look for.',
    suggestion: 'Incorporate keywords like "Agile methodology", "CI/CD", "cloud computing", "microservices" naturally throughout your experience descriptions.',
    impact: 'Improves ATS screening success rate by 60%'
  },
  {
    category: 'experience',
    priority: 'medium',
    title: 'Quantify Your Achievements',
    description: 'Several achievements lack specific metrics or numbers to demonstrate impact.',
    suggestion: 'Add quantifiable results: "Improved system performance by 35%" instead of "Improved system performance". Use numbers, percentages, and dollar amounts.',
    impact: 'Makes accomplishments 3x more compelling to recruiters'
  },
  {
    category: 'format',
    priority: 'medium',
    title: 'Optimize Resume Length',
    description: 'Resume length could be better optimized for your experience level.',
    suggestion: 'Keep resume to 1-2 pages max. Focus on most relevant experiences from the last 10 years. Remove outdated or irrelevant information.',
    impact: 'Increases recruiter attention span and readability'
  },
  {
    category: 'experience',
    priority: 'medium',
    title: 'Add Action Verbs',
    description: 'Job descriptions start with weak verbs that don\'t convey impact.',
    suggestion: 'Start bullet points with strong action verbs: "Developed", "Led", "Implemented", "Optimized", "Architected" instead of "Was responsible for".',
    impact: 'Creates stronger first impression with hiring managers'
  },
  {
    category: 'format',
    priority: 'low',
    title: 'Improve Visual Formatting',
    description: 'Resume formatting could be more professional and ATS-friendly.',
    suggestion: 'Use consistent fonts, proper spacing, and clear section headers. Avoid graphics, tables, and complex formatting that ATS can\'t parse.',
    impact: 'Ensures 100% compatibility with ATS systems'
  },
  {
    category: 'skills',
    priority: 'low',
    title: 'Add Soft Skills',
    description: 'Missing demonstration of soft skills that employers value.',
    suggestion: 'Include soft skills like "Leadership", "Communication", "Problem-solving" with specific examples of how you\'ve demonstrated them.',
    impact: 'Shows well-rounded candidate profile'
  },
  {
    category: 'keywords',
    priority: 'low',
    title: 'Update Job Titles',
    description: 'Job titles may not align with industry standard terminology.',
    suggestion: 'Use industry-standard job titles that recruiters search for. Add clarification in parentheses if needed.',
    impact: 'Improves discoverability in recruiter searches'
  }
];

// Uniqueness Check Result
export const mockUniquenessResult: UniquenessResult = {
  overallScore: 23,
  matches: [
    {
      text: "Experienced software developer with strong analytical and problem-solving skills",
      similarity: 78,
      source: "Common resume templates database",
      category: 'medium'
    },
    {
      text: "Responsible for developing and maintaining web applications using modern frameworks",
      similarity: 65,
      source: "Generic job descriptions",
      category: 'medium'
    },
    {
      text: "Team player with excellent communication skills and ability to work under pressure",
      similarity: 82,
      source: "Resume clichés database",
      category: 'low'
    }
  ],
  totalChecked: 45,
  cleanSentences: 42,
  flaggedSentences: 3,
  recommendations: [
    'Replace generic phrases with specific examples from your experience',
    'Use active voice and strong action verbs',
    'Quantify achievements with metrics and numbers',
    'Avoid overused buzzwords and clichés'
  ]
};

// Domain Icons
export const domainIcons: Record<string, string> = {
  'Software Engineering': '💻',
  'Data Science': '📊',
  'Marketing': '📈',
  'Finance': '💰',
  'Healthcare': '🏥',
  'Education': '🎓',
  'Design': '🎨',
  'Sales': '💼',
  'Operations': '⚙️',
  'HR': '👥',
  'Legal': '⚖️',
  'Product Management': '📦',
  'Customer Support': '🎧',
  'Research': '🔬',
  'Consulting': '📝'
};

// Domain Skills
export const domainSkills: Record<string, string[]> = {
  'Software Engineering': ['JavaScript', 'React', 'Node.js', 'Python', 'AWS', 'Docker', 'TypeScript', 'MongoDB'],
  'Data Science': ['Python', 'Machine Learning', 'SQL', 'TensorFlow', 'Pandas', 'NumPy', 'Data Visualization', 'Statistics'],
  'Marketing': ['Digital Marketing', 'SEO', 'Google Analytics', 'Content Strategy', 'Social Media', 'Email Marketing', 'PPC', 'Brand Management'],
  'Finance': ['Financial Analysis', 'Excel', 'Bloomberg', 'Risk Management', 'Investment Banking', 'Accounting', 'CFA', 'Financial Modeling'],
  'Healthcare': ['Patient Care', 'Medical Terminology', 'HIPAA', 'Clinical Research', 'Healthcare Management', 'EMR Systems'],
  'Education': ['Curriculum Development', 'Teaching', 'E-Learning', 'Instructional Design', 'Assessment', 'Classroom Management'],
  'Design': ['UI/UX Design', 'Figma', 'Adobe Creative Suite', 'Prototyping', 'User Research', 'Design Systems', 'Wireframing'],
  'Sales': ['B2B Sales', 'CRM', 'Lead Generation', 'Negotiation', 'Salesforce', 'Cold Calling', 'Account Management'],
  'Operations': ['Supply Chain', 'Process Improvement', 'Lean Six Sigma', 'Project Management', 'Logistics', 'Quality Assurance'],
  'HR': ['Recruiting', 'Employee Relations', 'HRIS', 'Performance Management', 'Onboarding', 'Talent Acquisition'],
  'Legal': ['Contract Law', 'Legal Research', 'Compliance', 'Litigation', 'Corporate Law', 'Intellectual Property'],
  'Product Management': ['Product Strategy', 'Agile', 'User Stories', 'Roadmapping', 'Market Research', 'A/B Testing'],
  'Customer Support': ['Customer Service', 'Ticketing Systems', 'Technical Support', 'Conflict Resolution', 'CRM'],
  'Research': ['Data Analysis', 'Scientific Writing', 'Statistical Analysis', 'Literature Review', 'Experimental Design'],
  'Consulting': ['Strategy', 'Problem Solving', 'Client Management', 'Presentation Skills', 'Business Analysis']
};
