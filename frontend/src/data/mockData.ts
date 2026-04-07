import type { Company, Course, ImprovementSuggestion, UniquenessResult } from '@/types';

// ---------------------------------------------------------------------------
// 1. COMPANIES DATABASE (19 Domains x 8 Companies)
// ---------------------------------------------------------------------------
export const mockCompanies: Record<string, Company[]> = {
  // --- SOFTWARE & SYSTEMS ENGINEERING ---
  'Software Engineering': [
    { name: 'Google', logo: 'https://icon.horse/icon/google.com', website: 'https://careers.google.com', location: 'Bangalore, India', size: '100k+ employees', description: 'Leading technology company focusing on search, cloud computing, and AI innovations.', openRoles: 145, remoteFriendly: true, rating: 4.8 },
    { name: 'Microsoft', logo: 'https://icon.horse/icon/microsoft.com', website: 'https://careers.microsoft.com', location: 'Hyderabad, India', size: '200k+ employees', description: 'Global technology company known for cloud services, productivity software, and enterprise solutions.', openRoles: 138, remoteFriendly: true, rating: 4.7 },
    { name: 'Amazon', logo: 'https://icon.horse/icon/amazon.com', website: 'https://amazon.jobs', location: 'Bangalore, India', size: '1.5M+ employees', description: 'E-commerce and cloud computing giant with opportunities in multiple tech domains.', openRoles: 167, remoteFriendly: true, rating: 4.5 },
    { name: 'TCS', logo: 'https://icon.horse/icon/tcs.com', website: 'https://www.tcs.com/careers', location: 'Mumbai, India', size: '500k+ employees', description: 'Leading IT services provider in India and globally with vast opportunities.', openRoles: 250, remoteFriendly: true, rating: 4.2 },
    { name: 'Apple', logo: 'https://icon.horse/icon/apple.com', website: 'https://www.apple.com/careers', location: 'Hyderabad, India', size: '160k+ employees', description: 'Innovating in consumer electronics, software engineering, and online services.', openRoles: 82, remoteFriendly: false, rating: 4.6 },
    { name: 'IBM', logo: 'https://icon.horse/icon/ibm.com', website: 'https://www.ibm.com/employment', location: 'Bangalore, India', size: '280k+ employees', description: 'Pioneering enterprise software, cloud computing, and artificial intelligence solutions.', openRoles: 92, remoteFriendly: true, rating: 4.1 },
    { name: 'Oracle', logo: 'https://icon.horse/icon/oracle.com', website: 'https://www.oracle.com/corporate/careers', location: 'Pune, India', size: '140k+ employees', description: 'Enterprise software and cloud infrastructure provider.', openRoles: 75, remoteFriendly: true, rating: 4.0 },
    { name: 'Atlassian', logo: 'https://icon.horse/icon/atlassian.com', website: 'https://www.atlassian.com/company/careers', location: 'Remote', size: '10k+ employees', description: 'Makers of Jira, Confluence, and Bitbucket. Highly engineering-driven.', openRoles: 45, remoteFriendly: true, rating: 4.7 }
  ],
  'Frontend': [
    { name: 'Vercel', logo: 'https://icon.horse/icon/vercel.com', website: 'https://vercel.com/careers', location: 'Remote', size: '500+ employees', description: 'Creators of Next.js. The premier platform for frontend frameworks.', openRoles: 15, remoteFriendly: true, rating: 4.8 },
    { name: 'Netlify', logo: 'https://icon.horse/icon/netlify.com', website: 'https://www.netlify.com/careers', location: 'Remote', size: '500+ employees', description: 'Pioneers of the Jamstack architecture, building the future of web development.', openRoles: 12, remoteFriendly: true, rating: 4.6 },
    { name: 'Meta', logo: 'https://icon.horse/icon/meta.com', website: 'https://www.metacareers.com', location: 'Bangalore, India', size: '70k+ employees', description: 'Creators of React.js. Building immersive web experiences.', openRoles: 62, remoteFriendly: false, rating: 4.3 },
    { name: 'Airbnb', logo: 'https://icon.horse/icon/airbnb.com', website: 'https://careers.airbnb.com', location: 'Remote', size: '6k+ employees', description: 'Known for world-class frontend engineering, design systems, and web animations.', openRoles: 18, remoteFriendly: true, rating: 4.7 },
    { name: 'Spotify', logo: 'https://icon.horse/icon/spotify.com', website: 'https://www.spotifyjobs.com', location: 'Remote', size: '8k+ employees', description: 'Delivering world-class audio streaming web and application experiences.', openRoles: 24, remoteFriendly: true, rating: 4.5 },
    { name: 'Pinterest', logo: 'https://icon.horse/icon/pinterest.com', website: 'https://www.pinterestcareers.com', location: 'Remote', size: '3k+ employees', description: 'Visual discovery engine renowned for highly performant Masonry layouts and UI.', openRoles: 14, remoteFriendly: true, rating: 4.4 },
    { name: 'Figma', logo: 'https://icon.horse/icon/figma.com', website: 'https://www.figma.com/careers/', location: 'Remote', size: '1k+ employees', description: 'Pushing the absolute limits of WebGL, WebAssembly, and browser performance.', openRoles: 22, remoteFriendly: true, rating: 4.9 },
    { name: 'CodePen', logo: 'https://icon.horse/icon/codepen.io', website: 'https://codepen.io/about', location: 'Remote (100%)', size: '50+ employees', description: 'The best place to build, test, and discover front-end code.', openRoles: 3, remoteFriendly: true, rating: 4.8 }
  ],
  'Backend': [
    { name: 'Stripe', logo: 'https://icon.horse/icon/stripe.com', website: 'https://stripe.com/jobs', location: 'Remote', size: '7k+ employees', description: 'Financial infrastructure platform known for pristine API design.', openRoles: 45, remoteFriendly: true, rating: 4.7 },
    { name: 'Cloudflare', logo: 'https://icon.horse/icon/cloudflare.com', website: 'https://www.cloudflare.com/careers', location: 'Global', size: '3k+ employees', description: 'Web performance and security company handling massive scale backend infrastructure.', openRoles: 32, remoteFriendly: true, rating: 4.5 },
    { name: 'MongoDB', logo: 'https://icon.horse/icon/mongodb.com', website: 'https://www.mongodb.com/careers', location: 'Gurgaon, India', size: '4k+ employees', description: 'Leading modern, general purpose database platform built for high performance.', openRoles: 28, remoteFriendly: true, rating: 4.4 },
    { name: 'Snowflake', logo: 'https://icon.horse/icon/snowflake.com', website: 'https://careers.snowflake.com', location: 'Pune, India', size: '5k+ employees', description: 'Innovative cloud computing-based data cloud and warehousing company.', openRoles: 35, remoteFriendly: true, rating: 4.6 },
    { name: 'GitHub', logo: 'https://icon.horse/icon/github.com', website: 'https://github.com/about/careers', location: 'Remote', size: '3k+ employees', description: 'The world\'s leading AI-powered developer platform and code repository.', openRoles: 24, remoteFriendly: true, rating: 4.8 },
    { name: 'Uber', logo: 'https://icon.horse/icon/uber.com', website: 'https://www.uber.com/careers', location: 'Bangalore, India', size: '30k+ employees', description: 'Building highly scalable microservices to power global mobility and logistics.', openRoles: 55, remoteFriendly: true, rating: 4.3 },
    { name: 'Plaid', logo: 'https://icon.horse/icon/plaid.com', website: 'https://plaid.com/careers/', location: 'Remote', size: '1k+ employees', description: 'The data network powering the fintech tools that millions rely on.', openRoles: 15, remoteFriendly: true, rating: 4.5 },
    { name: 'Dropbox', logo: 'https://icon.horse/icon/dropbox.com', website: 'https://jobs.dropbox.com/', location: 'Remote', size: '3k+ employees', description: 'Pioneers in distributed systems, file synchronization, and cloud storage.', openRoles: 18, remoteFriendly: true, rating: 4.4 }
  ],
  'Full Stack': [
    { name: 'Slack', logo: 'https://icon.horse/icon/slack.com', website: 'https://slack.com/careers', location: 'Remote', size: '2k+ employees', description: 'Building the digital HQ. Heavy use of Electron, React, and robust backend services.', openRoles: 25, remoteFriendly: true, rating: 4.7 },
    { name: 'Discord', logo: 'https://icon.horse/icon/discord.com', website: 'https://discord.com/jobs', location: 'Remote', size: '1k+ employees', description: 'Voice, video and text chat app utilizing Rust, Elixir, and React for massive scale.', openRoles: 15, remoteFriendly: true, rating: 4.8 },
    { name: 'Shopify', logo: 'https://icon.horse/icon/shopify.com', website: 'https://www.shopify.com/careers', location: 'Remote (100%)', size: '10k+ employees', description: 'Powering millions of businesses worldwide using Ruby on Rails and React.', openRoles: 40, remoteFriendly: true, rating: 4.5 },
    { name: 'Canva', logo: 'https://icon.horse/icon/canva.com', website: 'https://www.canva.com/careers/', location: 'Remote', size: '3k+ employees', description: 'Online design and publishing tool utilizing complex WebGL and robust backends.', openRoles: 30, remoteFriendly: true, rating: 4.6 },
    { name: 'Notion', logo: 'https://icon.horse/icon/notion.so', website: 'https://www.notion.so/careers', location: 'Hyderabad, India', size: '500+ employees', description: 'The all-in-one workspace relying on incredible full-stack synchronization.', openRoles: 12, remoteFriendly: true, rating: 4.9 },
    { name: 'Asana', logo: 'https://icon.horse/icon/asana.com', website: 'https://asana.com/jobs', location: 'Remote', size: '1k+ employees', description: 'Work management platform known for its proprietary reactive framework.', openRoles: 18, remoteFriendly: true, rating: 4.6 },
    { name: 'Reddit', logo: 'https://icon.horse/icon/reddit.com', website: 'https://www.redditinc.com/careers', location: 'Remote', size: '2k+ employees', description: 'The front page of the internet, blending complex frontend architecture with massive backend scale.', openRoles: 22, remoteFriendly: true, rating: 4.4 },
    { name: 'Loom', logo: 'https://icon.horse/icon/loom.com', website: 'https://www.loom.com/careers', location: 'Remote', size: '200+ employees', description: 'Video messaging for work, pushing the limits of browser recording and video processing.', openRoles: 8, remoteFriendly: true, rating: 4.8 }
  ],
  'Mobile Development': [
    { name: 'Square', logo: 'https://icon.horse/icon/squareup.com', website: 'https://careers.squareup.com/', location: 'Remote', size: '8k+ employees', description: 'Building seamless financial tools and point-of-sale mobile applications.', openRoles: 25, remoteFriendly: true, rating: 4.6 },
    { name: 'Robinhood', logo: 'https://icon.horse/icon/robinhood.com', website: 'https://careers.robinhood.com/', location: 'Remote', size: '3k+ employees', description: 'Pioneering mobile-first investing and financial markets access.', openRoles: 18, remoteFriendly: true, rating: 4.3 },
    { name: 'TikTok', logo: 'https://icon.horse/icon/tiktok.com', website: 'https://careers.tiktok.com/', location: 'Global', size: '20k+ employees', description: 'The world\'s leading destination for short-form mobile video.', openRoles: 85, remoteFriendly: false, rating: 4.0 },
    { name: 'Snapchat', logo: 'https://icon.horse/icon/snap.com', website: 'https://careers.snap.com/', location: 'Remote', size: '5k+ employees', description: 'Camera and social media company innovating in mobile AR.', openRoles: 20, remoteFriendly: true, rating: 4.5 },
    { name: 'Tinder', logo: 'https://icon.horse/icon/tinder.com', website: 'https://www.tinder.com/jobs', location: 'Remote', size: '1k+ employees', description: 'The world’s most popular app for meeting new people. Heavy mobile focus.', openRoles: 12, remoteFriendly: true, rating: 4.4 },
    { name: 'Duolingo', logo: 'https://icon.horse/icon/duolingo.com', website: 'https://careers.duolingo.com/', location: 'Remote', size: '500+ employees', description: 'The world\'s most popular language learning app, known for incredible mobile UX.', openRoles: 10, remoteFriendly: true, rating: 4.8 },
    { name: 'Bumble', logo: 'https://icon.horse/icon/bumble.com', website: 'https://careers.bumble.com/', location: 'Remote', size: '1k+ employees', description: 'Women-first dating and networking app with a strong mobile engineering culture.', openRoles: 8, remoteFriendly: true, rating: 4.5 },
    { name: 'Lyft', logo: 'https://icon.horse/icon/lyft.com', website: 'https://www.lyft.com/careers', location: 'Remote', size: '4k+ employees', description: 'Ride-sharing platform relying on highly accurate, real-time mobile tracking.', openRoles: 15, remoteFriendly: true, rating: 4.3 }
  ],
  'DevOps': [
    { name: 'HashiCorp', logo: 'https://icon.horse/icon/hashicorp.com', website: 'https://www.hashicorp.com/jobs', location: 'Remote', size: '2k+ employees', description: 'Creators of Terraform and Vault. The foundation of modern infrastructure.', openRoles: 24, remoteFriendly: true, rating: 4.6 },
    { name: 'GitLab', logo: 'https://icon.horse/icon/gitlab.com', website: 'https://about.gitlab.com/jobs', location: 'Remote (100%)', size: '2k+ employees', description: 'The premier DevSecOps platform delivered as a single application.', openRoles: 38, remoteFriendly: true, rating: 4.7 },
    { name: 'Datadog', logo: 'https://icon.horse/icon/datadoghq.com', website: 'https://www.datadoghq.com/careers', location: 'Global', size: '4k+ employees', description: 'Monitoring and security platform for cloud applications and infrastructure.', openRoles: 41, remoteFriendly: true, rating: 4.5 },
    { name: 'Docker', logo: 'https://icon.horse/icon/docker.com', website: 'https://www.docker.com/careers', location: 'Remote', size: '500+ employees', description: 'The leading platform for building, sharing, and running containerized applications.', openRoles: 15, remoteFriendly: true, rating: 4.8 },
    { name: 'PagerDuty', logo: 'https://icon.horse/icon/pagerduty.com', website: 'https://careers.pagerduty.com', location: 'Remote', size: '1k+ employees', description: 'Digital operations management platform for modern infrastructure teams.', openRoles: 18, remoteFriendly: true, rating: 4.4 },
    { name: 'New Relic', logo: 'https://icon.horse/icon/newrelic.com', website: 'https://newrelic.com/about/careers', location: 'Remote', size: '2k+ employees', description: 'All-in-one observability platform for engineers and DevOps professionals.', openRoles: 20, remoteFriendly: true, rating: 4.2 },
    { name: 'CircleCI', logo: 'https://icon.horse/icon/circleci.com', website: 'https://circleci.com/careers/', location: 'Remote', size: '500+ employees', description: 'Continuous integration and delivery platform for rapid software release.', openRoles: 12, remoteFriendly: true, rating: 4.3 },
    { name: 'Chef', logo: 'https://icon.horse/icon/chef.io', website: 'https://www.chef.io/careers', location: 'Remote', size: '500+ employees', description: 'Automation platform that transforms infrastructure into code.', openRoles: 8, remoteFriendly: true, rating: 4.1 }
  ],
  'Cloud Engineering': [
    { name: 'DigitalOcean', logo: 'https://icon.horse/icon/digitalocean.com', website: 'https://www.digitalocean.com/careers', location: 'Remote', size: '1k+ employees', description: 'Cloud hosting provider built specifically for developers and startups.', openRoles: 22, remoteFriendly: true, rating: 4.3 },
    { name: 'Vultr', logo: 'https://icon.horse/icon/vultr.com', website: 'https://www.vultr.com/corporate/careers/', location: 'Remote', size: '200+ employees', description: 'High-performance cloud compute provider with a massive global footprint.', openRoles: 10, remoteFriendly: true, rating: 4.4 },
    { name: 'Heroku', logo: 'https://icon.horse/icon/heroku.com', website: 'https://www.heroku.com/careers', location: 'Remote', size: '500+ employees', description: 'The pioneer of Platform as a Service (PaaS) cloud deployment.', openRoles: 8, remoteFriendly: true, rating: 4.2 },
    { name: 'Linode', logo: 'https://icon.horse/icon/linode.com', website: 'https://www.linode.com/company/careers/', location: 'Remote', size: '200+ employees', description: 'Independent open cloud provider for developers (Now part of Akamai).', openRoles: 5, remoteFriendly: true, rating: 4.1 },
    { name: 'Fastly', logo: 'https://icon.horse/icon/fastly.com', website: 'https://www.fastly.com/about/careers', location: 'Remote', size: '1k+ employees', description: 'Edge cloud platform delivering faster, safer, and more scalable applications.', openRoles: 18, remoteFriendly: true, rating: 4.5 },
    { name: 'Supabase', logo: 'https://icon.horse/icon/supabase.com', website: 'https://supabase.com/careers', location: 'Remote (100%)', size: '100+ employees', description: 'The open source Firebase alternative. Providing instant cloud backends.', openRoles: 12, remoteFriendly: true, rating: 4.9 },
    { name: 'Render', logo: 'https://icon.horse/icon/render.com', website: 'https://render.com/jobs', location: 'Remote', size: '100+ employees', description: 'Unified cloud to build and run all your apps and websites.', openRoles: 6, remoteFriendly: true, rating: 4.8 },
    { name: 'Fly.io', logo: 'https://icon.horse/icon/fly.io', website: 'https://fly.io/jobs/', location: 'Remote', size: '100+ employees', description: 'Run your full stack apps (and databases) all over the world.', openRoles: 8, remoteFriendly: true, rating: 4.9 }
  ],
  'Linux Administrator': [
    { name: 'Red Hat', logo: 'https://icon.horse/icon/redhat.com', website: 'https://www.redhat.com/en/jobs', location: 'Pune, India', size: '19k+ employees', description: 'The world\'s leading provider of enterprise open source solutions.', openRoles: 35, remoteFriendly: true, rating: 4.5 },
    { name: 'Canonical', logo: 'https://icon.horse/icon/canonical.com', website: 'https://canonical.com/careers', location: 'Remote', size: '1k+ employees', description: 'The publisher of Ubuntu, the OS for most public cloud workloads.', openRoles: 26, remoteFriendly: true, rating: 4.6 },
    { name: 'SUSE', logo: 'https://icon.horse/icon/suse.com', website: 'https://www.suse.com/company/careers/', location: 'Global', size: '2k+ employees', description: 'Global leader in innovative, reliable and enterprise-grade open source solutions.', openRoles: 22, remoteFriendly: true, rating: 4.4 },
    { name: 'IBM', logo: 'https://icon.horse/icon/ibm.com', website: 'https://www.ibm.com/employment', location: 'Bangalore, India', size: '280k+ employees', description: 'Leading provider of enterprise IT infrastructure and Linux mainframes.', openRoles: 45, remoteFriendly: true, rating: 4.1 },
    { name: 'Oracle', logo: 'https://icon.horse/icon/oracle.com', website: 'https://www.oracle.com/corporate/careers', location: 'Hyderabad, India', size: '140k+ employees', description: 'Enterprise software and cloud infrastructure provider (Oracle Linux).', openRoles: 38, remoteFriendly: true, rating: 4.0 },
    { name: 'Rackspace', logo: 'https://icon.horse/icon/rackspace.com', website: 'https://jobs.rackspace.com', location: 'Remote', size: '6k+ employees', description: 'Managed cloud computing company administering massive Linux server fleets.', openRoles: 24, remoteFriendly: true, rating: 4.2 },
    { name: 'System76', logo: 'https://icon.horse/icon/system76.com', website: 'https://system76.com/careers', location: 'Remote', size: '100+ employees', description: 'Computer manufacturer specializing in Linux-based hardware and Pop!_OS.', openRoles: 5, remoteFriendly: true, rating: 4.8 },
    { name: 'Akamai', logo: 'https://icon.horse/icon/akamai.com', website: 'https://www.akamai.com/careers', location: 'Bangalore, India', size: '9k+ employees', description: 'Content delivery network running one of the world\'s largest distributed Linux platforms.', openRoles: 28, remoteFriendly: true, rating: 4.3 }
  ],
  'Data Science': [
    { name: 'Palantir', logo: 'https://icon.horse/icon/palantir.com', website: 'https://www.palantir.com/careers', location: 'Remote', size: '3k+ employees', description: 'Software empowering organizations to integrate data, decisions, and operations.', openRoles: 25, remoteFriendly: true, rating: 4.5 },
    { name: 'Databricks', logo: 'https://icon.horse/icon/databricks.com', website: 'https://databricks.com/company/careers', location: 'Bangalore, India', size: '4k+ employees', description: 'Unified data analytics platform created by the founders of Apache Spark.', openRoles: 32, remoteFriendly: true, rating: 4.6 },
    { name: 'Fractal Analytics', logo: 'https://icon.horse/icon/fractal.ai', website: 'https://fractal.ai/careers', location: 'Mumbai, India', size: '5k+ employees', description: 'AI and analytics company solving complex business problems.', openRoles: 16, remoteFriendly: true, rating: 4.4 },
    { name: 'Mu Sigma', logo: 'https://icon.horse/icon/mu-sigma.com', website: 'https://www.mu-sigma.com/careers', location: 'Bangalore, India', size: '3k+ employees', description: 'One of the world\'s largest pure-play Big Data Analytics and Decision Sciences companies.', openRoles: 40, remoteFriendly: false, rating: 3.9 },
    { name: 'Cloudera', logo: 'https://icon.horse/icon/cloudera.com', website: 'https://www.cloudera.com/about/careers.html', location: 'Remote', size: '2k+ employees', description: 'Enterprise data cloud company providing data management and analytics.', openRoles: 18, remoteFriendly: true, rating: 4.2 },
    { name: 'Alteryx', logo: 'https://icon.horse/icon/alteryx.com', website: 'https://www.alteryx.com/careers', location: 'Remote', size: '2k+ employees', description: 'Data analytics platform designed to democratize data access and processing.', openRoles: 15, remoteFriendly: true, rating: 4.1 },
    { name: 'Splunk', logo: 'https://icon.horse/icon/splunk.com', website: 'https://www.splunk.com/en_us/careers.html', location: 'Remote', size: '7k+ employees', description: 'Platform for searching, monitoring, and analyzing machine-generated big data.', openRoles: 28, remoteFriendly: true, rating: 4.4 },
    { name: 'Teradata', logo: 'https://icon.horse/icon/teradata.com', website: 'https://careers.teradata.com/', location: 'Hyderabad, India', size: '7k+ employees', description: 'Cloud data analytics platform providing connected multi-cloud data operations.', openRoles: 20, remoteFriendly: true, rating: 4.0 }
  ],
  'Machine Learning & AI': [
    { name: 'OpenAI', logo: 'https://icon.horse/icon/openai.com', website: 'https://openai.com/careers', location: 'Remote', size: '1k+ employees', description: 'AI research and deployment company behind models like ChatGPT and DALL-E.', openRoles: 45, remoteFriendly: true, rating: 4.8 },
    { name: 'DeepMind', logo: 'https://icon.horse/icon/deepmind.google', website: 'https://deepmind.google/about/careers/', location: 'Global', size: '1k+ employees', description: 'Google\'s elite AI research lab committed to solving general intelligence.', openRoles: 22, remoteFriendly: true, rating: 4.7 },
    { name: 'Anthropic', logo: 'https://icon.horse/icon/anthropic.com', website: 'https://www.anthropic.com/careers', location: 'Remote', size: '300+ employees', description: 'AI safety and research company building the Claude foundational model.', openRoles: 15, remoteFriendly: true, rating: 4.9 },
    { name: 'Hugging Face', logo: 'https://icon.horse/icon/huggingface.co', website: 'https://huggingface.co/careers', location: 'Remote', size: '200+ employees', description: 'The collaboration platform for the machine learning community.', openRoles: 10, remoteFriendly: true, rating: 4.9 },
    { name: 'Midjourney', logo: 'https://icon.horse/icon/midjourney.com', website: 'https://www.midjourney.com/', location: 'Remote', size: '50+ employees', description: 'Independent research lab exploring new mediums of thought via AI image generation.', openRoles: 4, remoteFriendly: true, rating: 4.6 },
    { name: 'Cohere', logo: 'https://icon.horse/icon/cohere.com', website: 'https://cohere.com/careers', location: 'Remote', size: '200+ employees', description: 'Providing access to advanced Large Language Models for enterprise developers.', openRoles: 12, remoteFriendly: true, rating: 4.7 },
    { name: 'Scale AI', logo: 'https://icon.horse/icon/scale.com', website: 'https://scale.com/careers', location: 'Remote', size: '1k+ employees', description: 'The data platform accelerating the development of AI applications.', openRoles: 28, remoteFriendly: true, rating: 4.5 },
    { name: 'Stability AI', logo: 'https://icon.horse/icon/stability.ai', website: 'https://stability.ai/careers', location: 'Remote', size: '100+ employees', description: 'Open-source generative AI company behind Stable Diffusion.', openRoles: 8, remoteFriendly: true, rating: 4.4 }
  ],
  'Cybersecurity': [
    { name: 'CrowdStrike', logo: 'https://icon.horse/icon/crowdstrike.com', website: 'https://www.crowdstrike.com/careers/', location: 'Remote', size: '7k+ employees', description: 'Pioneering cloud-delivered endpoint protection and threat intelligence.', openRoles: 40, remoteFriendly: true, rating: 4.5 },
    { name: 'Palo Alto Networks', logo: 'https://icon.horse/icon/paloaltonetworks.com', website: 'https://jobs.paloaltonetworks.com/', location: 'Bangalore, India', size: '12k+ employees', description: 'Global cybersecurity leader shaping the cloud-centric future with technology.', openRoles: 35, remoteFriendly: true, rating: 4.4 },
    { name: 'Fortinet', logo: 'https://icon.horse/icon/fortinet.com', website: 'https://www.fortinet.com/corporate/careers', location: 'Pune, India', size: '12k+ employees', description: 'Securing the largest enterprise, service provider, and government organizations.', openRoles: 28, remoteFriendly: true, rating: 4.3 },
    { name: 'Okta', logo: 'https://icon.horse/icon/okta.com', website: 'https://www.okta.com/company/careers/', location: 'Remote', size: '5k+ employees', description: 'The leading independent identity provider for enterprise security.', openRoles: 22, remoteFriendly: true, rating: 4.6 },
    { name: '1Password', logo: 'https://icon.horse/icon/1password.com', website: 'https://1password.com/jobs/', location: 'Remote (100%)', size: '1k+ employees', description: 'Password manager and secure digital vault trusted by millions.', openRoles: 15, remoteFriendly: true, rating: 4.7 },
    { name: 'Zscaler', logo: 'https://icon.horse/icon/zscaler.com', website: 'https://www.zscaler.com/careers', location: 'Remote', size: '5k+ employees', description: 'Cloud security platform enabling secure remote access and zero-trust.', openRoles: 30, remoteFriendly: true, rating: 4.5 },
    { name: 'SentinelOne', logo: 'https://icon.horse/icon/sentinelone.com', website: 'https://www.sentinelone.com/careers/', location: 'Remote', size: '2k+ employees', description: 'Autonomous AI endpoint security platform.', openRoles: 18, remoteFriendly: true, rating: 4.4 },
    { name: 'Cloudflare Security', logo: 'https://icon.horse/icon/cloudflare.com', website: 'https://www.cloudflare.com/careers', location: 'Remote', size: '3k+ employees', description: 'Stopping DDoS attacks and securing internet infrastructure globally.', openRoles: 25, remoteFriendly: true, rating: 4.5 }
  ],
  'QA & Automation': [
    { name: 'BrowserStack', logo: 'https://icon.horse/icon/browserstack.com', website: 'https://www.browserstack.com/careers', location: 'Mumbai, India', size: '1k+ employees', description: 'Web and mobile app testing platform trusted by developers globally.', openRoles: 25, remoteFriendly: true, rating: 4.6 },
    { name: 'Cypress', logo: 'https://icon.horse/icon/cypress.io', website: 'https://www.cypress.io/careers', location: 'Remote', size: '200+ employees', description: 'Fast, easy and reliable testing for anything that runs in a browser.', openRoles: 8, remoteFriendly: true, rating: 4.8 },
    { name: 'Postman', logo: 'https://icon.horse/icon/postman.com', website: 'https://www.postman.com/company/careers/', location: 'Bangalore, India', size: '1k+ employees', description: 'The leading API platform utilized heavily for automated API testing.', openRoles: 18, remoteFriendly: true, rating: 4.6 },
    { name: 'Sauce Labs', logo: 'https://icon.horse/icon/saucelabs.com', website: 'https://saucelabs.com/company/careers', location: 'Remote', size: '500+ employees', description: 'Continuous testing cloud providing automated testing for web and mobile.', openRoles: 12, remoteFriendly: true, rating: 4.2 },
    { name: 'Katalon', logo: 'https://icon.horse/icon/katalon.com', website: 'https://katalon.com/careers', location: 'Remote', size: '300+ employees', description: 'Comprehensive quality management platform for continuous testing.', openRoles: 10, remoteFriendly: true, rating: 4.3 },
    { name: 'Tricentis', logo: 'https://icon.horse/icon/tricentis.com', website: 'https://www.tricentis.com/careers/', location: 'Pune, India', size: '1k+ employees', description: 'Continuous testing platform specifically designed for Agile and DevOps.', openRoles: 20, remoteFriendly: true, rating: 4.4 },
    { name: 'Applitools', logo: 'https://icon.horse/icon/applitools.com', website: 'https://applitools.com/careers/', location: 'Remote', size: '200+ employees', description: 'AI-powered visual testing and monitoring for web and mobile apps.', openRoles: 6, remoteFriendly: true, rating: 4.5 },
    { name: 'SmartBear', logo: 'https://icon.horse/icon/smartbear.com', website: 'https://smartbear.com/company/careers/', location: 'Remote', size: '1k+ employees', description: 'Tools for application performance monitoring, software development, and testing.', openRoles: 15, remoteFriendly: true, rating: 4.2 }
  ],

  // --- TRADITIONAL & HARDWARE ENGINEERING DOMAINS ---
  'Hardware Engineering': [
    { name: 'Intel', logo: 'https://icon.horse/icon/intel.com', website: 'https://jobs.intel.com/', location: 'Bangalore, India', size: '130k+ employees', description: 'World leader in computing innovation, designing and building essential technologies.', openRoles: 85, remoteFriendly: false, rating: 4.2 },
    { name: 'AMD', logo: 'https://icon.horse/icon/amd.com', website: 'https://careers.amd.com/', location: 'Hyderabad, India', size: '25k+ employees', description: 'Developing high-performance computing and visualization products.', openRoles: 40, remoteFriendly: false, rating: 4.4 },
    { name: 'NVIDIA', logo: 'https://icon.horse/icon/nvidia.com', website: 'https://www.nvidia.com/en-us/about/careers/', location: 'Pune, India', size: '26k+ employees', description: 'Pioneers in GPU-accelerated computing and artificial intelligence hardware.', openRoles: 65, remoteFriendly: true, rating: 4.7 },
    { name: 'Qualcomm', logo: 'https://icon.horse/icon/qualcomm.com', website: 'https://careers.qualcomm.com/', location: 'Bangalore, India', size: '50k+ employees', description: 'Inventing breakthrough technologies that transform how the world connects.', openRoles: 50, remoteFriendly: false, rating: 4.1 },
    { name: 'ARM', logo: 'https://icon.horse/icon/arm.com', website: 'https://careers.arm.com/', location: 'Bangalore, India', size: '7k+ employees', description: 'Architecting the core technology that powers the digital world.', openRoles: 22, remoteFriendly: true, rating: 4.3 },
    { name: 'Broadcom', logo: 'https://icon.horse/icon/broadcom.com', website: 'https://broadcom.com/company/careers', location: 'Bangalore, India', size: '20k+ employees', description: 'Global technology leader designing semiconductor and infrastructure software.', openRoles: 30, remoteFriendly: false, rating: 3.9 },
    { name: 'Texas Instruments', logo: 'https://icon.horse/icon/ti.com', website: 'https://careers.ti.com/', location: 'Bangalore, India', size: '33k+ employees', description: 'Designing, manufacturing, and selling analog and embedded processing chips.', openRoles: 25, remoteFriendly: false, rating: 4.2 },
    { name: 'Western Digital', logo: 'https://icon.horse/icon/westerndigital.com', website: 'https://careers.westerndigital.com/', location: 'Bangalore, India', size: '65k+ employees', description: 'Driving the innovation needed to help customers capture and preserve data.', openRoles: 18, remoteFriendly: false, rating: 4.0 }
  ],
  'Electrical Engineering': [
    { name: 'Siemens', logo: 'https://icon.horse/icon/siemens.com', website: 'https://jobs.siemens.com/', location: 'Mumbai, India', size: '300k+ employees', description: 'Technology company focused on industry, infrastructure, transport, and healthcare.', openRoles: 110, remoteFriendly: false, rating: 4.3 },
    { name: 'General Electric', logo: 'https://icon.horse/icon/ge.com', website: 'https://jobs.gecareers.com/global/en', location: 'Bangalore, India', size: '170k+ employees', description: 'Pioneering technologies in aviation, healthcare, and energy.', openRoles: 90, remoteFriendly: false, rating: 4.1 },
    { name: 'Schneider Electric', logo: 'https://icon.horse/icon/se.com', website: 'https://www.se.com/in/en/about-us/careers/', location: 'Bangalore, India', size: '130k+ employees', description: 'Leading the digital transformation of energy management and automation.', openRoles: 65, remoteFriendly: true, rating: 4.2 },
    { name: 'ABB', logo: 'https://icon.horse/icon/abb.com', website: 'https://careers.abb/global/en', location: 'Bangalore, India', size: '105k+ employees', description: 'Technology leader in electrification and automation.', openRoles: 55, remoteFriendly: false, rating: 4.0 },
    { name: 'Honeywell', logo: 'https://icon.horse/icon/honeywell.com', website: 'https://careers.honeywell.com/us/en', location: 'Pune, India', size: '97k+ employees', description: 'Inventing technologies that address challenges in energy, security, and safety.', openRoles: 45, remoteFriendly: false, rating: 3.9 },
    { name: 'Eaton', logo: 'https://icon.horse/icon/eaton.com', website: 'https://jobs.eaton.com/', location: 'Pune, India', size: '85k+ employees', description: 'Intelligent power management company.', openRoles: 35, remoteFriendly: false, rating: 4.1 },
    { name: 'Philips', logo: 'https://icon.horse/icon/philips.com', website: 'https://www.careers.philips.com/global/en', location: 'Bangalore, India', size: '77k+ employees', description: 'Health technology company focused on improving people\'s health.', openRoles: 40, remoteFriendly: true, rating: 4.2 },
    { name: 'Rockwell Automation', logo: 'https://icon.horse/icon/rockwellautomation.com', website: 'https://careers.rockwellautomation.com/', location: 'Pune, India', size: '26k+ employees', description: 'Global leader in industrial automation and digital transformation.', openRoles: 25, remoteFriendly: false, rating: 4.3 }
  ],
  'Mechanical Engineering': [
    { name: 'Ford', logo: 'https://icon.horse/icon/ford.com', website: 'https://careers.ford.com/', location: 'Chennai, India', size: '180k+ employees', description: 'Global company designing, manufacturing, and servicing vehicles.', openRoles: 60, remoteFriendly: false, rating: 4.1 },
    { name: 'General Motors', logo: 'https://icon.horse/icon/gm.com', website: 'https://search-careers.gm.com/', location: 'Bangalore, India', size: '165k+ employees', description: 'Pushing the limits of transportation and technology.', openRoles: 55, remoteFriendly: false, rating: 4.2 },
    { name: 'Toyota', logo: 'https://icon.horse/icon/toyota.com', website: 'https://careers.toyota.com/us/en', location: 'Bangalore, India', size: '370k+ employees', description: 'Global automotive industry leader and pioneer in manufacturing efficiency.', openRoles: 45, remoteFriendly: false, rating: 4.0 },
    { name: 'Caterpillar', logo: 'https://icon.horse/icon/caterpillar.com', website: 'https://careers.caterpillar.com/en/', location: 'Chennai, India', size: '109k+ employees', description: 'World\'s leading manufacturer of construction and mining equipment.', openRoles: 35, remoteFriendly: false, rating: 4.1 },
    { name: 'John Deere', logo: 'https://icon.horse/icon/deere.com', website: 'https://careers.deere.com/', location: 'Pune, India', size: '82k+ employees', description: 'Manufacturing agricultural, construction, and forestry machinery.', openRoles: 30, remoteFriendly: false, rating: 4.3 },
    { name: 'Bosch', logo: 'https://icon.horse/icon/bosch.com', website: 'https://careers.smartrecruiters.com/BoschGroup', location: 'Bangalore, India', size: '420k+ employees', description: 'Leading global supplier of technology and services.', openRoles: 80, remoteFriendly: false, rating: 4.2 },
    { name: '3M', logo: 'https://icon.horse/icon/3m.com', website: 'https://www.3m.com/3M/en_US/careers-us/', location: 'Bangalore, India', size: '92k+ employees', description: 'Applying science in collaborative ways to improve lives daily.', openRoles: 25, remoteFriendly: false, rating: 4.0 },
    { name: 'Cummins', logo: 'https://icon.horse/icon/cummins.com', website: 'https://careers.cummins.com/', location: 'Pune, India', size: '73k+ employees', description: 'Designing and manufacturing power generation products.', openRoles: 20, remoteFriendly: false, rating: 4.1 }
  ],
  'Civil Engineering': [
    { name: 'L&T Construction', logo: 'https://icon.horse/icon/larsentoubro.com', website: 'https://www.larsentoubro.com/corporate/careers/', location: 'Chennai, India', size: '50k+ employees', description: 'India\'s largest construction organization and ranked among the world\'s top contractors.', openRoles: 150, remoteFriendly: false, rating: 4.1 },
    { name: 'Bechtel', logo: 'https://icon.horse/icon/bechtel.com', website: 'https://jobs.bechtel.com/', location: 'New Delhi, India', size: '55k+ employees', description: 'Global engineering, construction, and project management company.', openRoles: 40, remoteFriendly: false, rating: 4.2 },
    { name: 'Fluor', logo: 'https://icon.horse/icon/fluor.com', website: 'https://careers.fluor.com/', location: 'Gurgaon, India', size: '40k+ employees', description: 'Delivering engineering, procurement, and construction services globally.', openRoles: 35, remoteFriendly: false, rating: 4.0 },
    { name: 'Jacobs', logo: 'https://icon.horse/icon/jacobs.com', website: 'https://careers.jacobs.com/', location: 'Mumbai, India', size: '60k+ employees', description: 'Providing comprehensive engineering and construction services.', openRoles: 45, remoteFriendly: true, rating: 4.1 },
    { name: 'AECOM', logo: 'https://icon.horse/icon/aecom.com', website: 'https://aecom.jobs/', location: 'Bangalore, India', size: '50k+ employees', description: 'Premier infrastructure consulting firm partnering to solve complex challenges.', openRoles: 50, remoteFriendly: true, rating: 3.9 },
    { name: 'Skanska', logo: 'https://icon.horse/icon/skanska.com', website: 'https://group.skanska.com/careers/', location: 'Global', size: '28k+ employees', description: 'One of the world\'s leading project development and construction groups.', openRoles: 25, remoteFriendly: false, rating: 4.2 },
    { name: 'Tata Projects', logo: 'https://icon.horse/icon/tataprojects.com', website: 'https://www.tataprojects.com/careers', location: 'Hyderabad, India', size: '15k+ employees', description: 'One of the fastest growing and most admired infrastructure companies in India.', openRoles: 60, remoteFriendly: false, rating: 4.0 },
    { name: 'Turner Construction', logo: 'https://icon.horse/icon/turnerconstruction.com', website: 'https://www.turnerconstruction.com/careers', location: 'Global', size: '10k+ employees', description: 'North America-based, international construction services company.', openRoles: 20, remoteFriendly: false, rating: 4.4 }
  ],
  'Aerospace Engineering': [
    { name: 'Boeing', logo: 'https://icon.horse/icon/boeing.com', website: 'https://jobs.boeing.com/', location: 'Bangalore, India', size: '150k+ employees', description: 'World\'s largest aerospace company and leading manufacturer of commercial jetliners.', openRoles: 65, remoteFriendly: false, rating: 4.0 },
    { name: 'Lockheed Martin', logo: 'https://icon.horse/icon/lockheedmartin.com', website: 'https://www.lockheedmartinjobs.com/', location: 'New Delhi, India', size: '115k+ employees', description: 'Global security and aerospace company engaged in advanced technology systems.', openRoles: 50, remoteFriendly: false, rating: 4.2 },
    { name: 'SpaceX', logo: 'https://icon.horse/icon/spacex.com', website: 'https://www.spacex.com/careers/', location: 'Hawthorne, CA', size: '12k+ employees', description: 'Designing, manufacturing and launching advanced rockets and spacecraft.', openRoles: 80, remoteFriendly: false, rating: 4.3 },
    { name: 'Airbus', logo: 'https://icon.horse/icon/airbus.com', website: 'https://www.airbus.com/en/careers', location: 'Bangalore, India', size: '130k+ employees', description: 'International pioneer in the aerospace industry.', openRoles: 55, remoteFriendly: false, rating: 4.1 },
    { name: 'Northrop Grumman', logo: 'https://icon.horse/icon/northropgrumman.com', website: 'https://www.northropgrumman.com/careers/', location: 'Global', size: '95k+ employees', description: 'Pioneering company solving the toughest problems in space, aeronautics, and defense.', openRoles: 40, remoteFriendly: false, rating: 4.2 },
    { name: 'Blue Origin', logo: 'https://icon.horse/icon/blueorigin.com', website: 'https://www.blueorigin.com/careers/', location: 'Kent, WA', size: '10k+ employees', description: 'Aerospace manufacturer developing technologies to enable human space access.', openRoles: 35, remoteFriendly: false, rating: 4.0 },
    { name: 'Raytheon', logo: 'https://icon.horse/icon/rtx.com', website: 'https://careers.rtx.com/global/en', location: 'Bangalore, India', size: '180k+ employees', description: 'Advancing aviation, building smarter defense systems and creating space innovations.', openRoles: 45, remoteFriendly: false, rating: 4.1 },
    { name: 'ISRO', logo: 'https://icon.horse/icon/isro.gov.in', website: 'https://www.isro.gov.in/Careers.html', location: 'Bangalore, India', size: '17k+ employees', description: 'The national space agency of India, pioneering space exploration.', openRoles: 25, remoteFriendly: false, rating: 4.5 }
  ],
  'Biomedical Engineering': [
    { name: 'Medtronic', logo: 'https://icon.horse/icon/medtronic.com', website: 'https://jobs.medtronic.com/', location: 'Hyderabad, India', size: '95k+ employees', description: 'Global leader in medical technology, services, and solutions.', openRoles: 45, remoteFriendly: false, rating: 4.2 },
    { name: 'Johnson & Johnson', logo: 'https://icon.horse/icon/jnj.com', website: 'https://careers.jnj.com/', location: 'Mumbai, India', size: '130k+ employees', description: 'Researching and developing innovative medical devices and pharmaceuticals.', openRoles: 55, remoteFriendly: true, rating: 4.3 },
    { name: 'Boston Scientific', logo: 'https://icon.horse/icon/bostonscientific.com', website: 'https://careers.bostonscientific.com/', location: 'Pune, India', size: '41k+ employees', description: 'Transforming lives through innovative medical solutions.', openRoles: 30, remoteFriendly: false, rating: 4.4 },
    { name: 'Stryker', logo: 'https://icon.horse/icon/stryker.com', website: 'https://careers.stryker.com/', location: 'Gurgaon, India', size: '46k+ employees', description: 'One of the world\'s leading medical technology companies.', openRoles: 25, remoteFriendly: false, rating: 4.5 },
    { name: 'GE Healthcare', logo: 'https://icon.horse/icon/gehealthcare.com', website: 'https://careers.gehealthcare.com/', location: 'Bangalore, India', size: '50k+ employees', description: 'Leading provider of medical imaging, monitoring, and bio-manufacturing technologies.', openRoles: 35, remoteFriendly: false, rating: 4.1 },
    { name: 'Abbott', logo: 'https://icon.horse/icon/abbott.com', website: 'https://www.jobs.abbott/', location: 'Mumbai, India', size: '114k+ employees', description: 'Creating breakthrough products in diagnostics, medical devices, and nutrition.', openRoles: 40, remoteFriendly: false, rating: 4.2 },
    { name: 'Siemens Healthineers', logo: 'https://icon.horse/icon/siemens-healthineers.com', website: 'https://jobs.siemens-healthineers.com/', location: 'Bangalore, India', size: '66k+ employees', description: 'Pioneering breakthroughs in healthcare for everyone, everywhere.', openRoles: 28, remoteFriendly: false, rating: 4.3 },
    { name: 'Baxter', logo: 'https://icon.horse/icon/baxter.com', website: 'https://jobs.baxter.com/', location: 'Ahmedabad, India', size: '60k+ employees', description: 'Providing a broad portfolio of essential healthcare products.', openRoles: 20, remoteFriendly: false, rating: 4.0 }
  ],
  'Chemical Engineering': [
    { name: 'BASF', logo: 'https://icon.horse/icon/basf.com', website: 'https://www.basf.com/global/en/careers.html', location: 'Mumbai, India', size: '111k+ employees', description: 'The world\'s largest chemical producer, creating chemistry for a sustainable future.', openRoles: 40, remoteFriendly: false, rating: 4.2 },
    { name: 'Dow', logo: 'https://icon.horse/icon/dow.com', website: 'https://corporate.dow.com/en-us/careers.html', location: 'Mumbai, India', size: '37k+ employees', description: 'Materials science company innovating for a sustainable world.', openRoles: 25, remoteFriendly: false, rating: 4.1 },
    { name: 'DuPont', logo: 'https://icon.horse/icon/dupont.com', website: 'https://careers.dupont.com/us/en', location: 'Hyderabad, India', size: '24k+ employees', description: 'Empowering the world with essential innovations to thrive.', openRoles: 20, remoteFriendly: false, rating: 4.0 },
    { name: 'Reliance Industries', logo: 'https://icon.horse/icon/ril.com', website: 'https://www.ril.com/Careers.aspx', location: 'Jamnagar, India', size: '340k+ employees', description: 'Indian multinational conglomerate with huge operations in petrochemicals.', openRoles: 80, remoteFriendly: false, rating: 4.1 },
    { name: 'Sherwin-Williams', logo: 'https://icon.horse/icon/sherwin-williams.com', website: 'https://careers.sherwin-williams.com/', location: 'Global', size: '61k+ employees', description: 'Global leader in the manufacture, development, and sale of paints and coatings.', openRoles: 15, remoteFriendly: false, rating: 4.3 },
    { name: 'Eastman', logo: 'https://icon.horse/icon/eastman.com', website: 'https://jobs.eastman.com/', location: 'Global', size: '14k+ employees', description: 'Global specialty materials company that produces a broad range of products.', openRoles: 12, remoteFriendly: false, rating: 4.1 },
    { name: 'Huntsman', logo: 'https://icon.horse/icon/huntsman.com', website: 'https://www.huntsman.com/careers', location: 'Mumbai, India', size: '9k+ employees', description: 'Global manufacturer and marketer of differentiated and specialty chemicals.', openRoles: 10, remoteFriendly: false, rating: 3.9 },
    { name: 'LyondellBasell', logo: 'https://icon.horse/icon/lyondellbasell.com', website: 'https://www.lyondellbasell.com/en/careers/', location: 'Pune, India', size: '19k+ employees', description: 'One of the largest plastics, chemicals, and refining companies in the world.', openRoles: 18, remoteFriendly: false, rating: 4.2 }
  ]
};

// ---------------------------------------------------------------------------
// 2. DOMAIN METADATA
// ---------------------------------------------------------------------------
export const domainIcons: Record<string, string> = {
  'Software Engineering': '💻', 'Frontend': '🖥️', 'Backend': '⚙️', 'Full Stack': '🥞',
  'Mobile Development': '📱', 'DevOps': '🚀', 'Cloud Engineering': '☁️', 'Linux Administrator': '🐧',
  'Data Science': '📊', 'Machine Learning & AI': '🤖', 'Cybersecurity': '🛡️', 'QA & Automation': '✅',
  'Hardware Engineering': '🖨️', 'Electrical Engineering': '⚡', 'Mechanical Engineering': '🔧',
  'Civil Engineering': '🏗️', 'Aerospace Engineering': '✈️', 'Biomedical Engineering': '🔬',
  'Chemical Engineering': '🧪'
};

export const domainSkills: Record<string, string[]> = {
  'Software Engineering': ['JavaScript', 'React', 'Node.js', 'Python', 'AWS', 'Docker', 'TypeScript'],
  'Frontend': ['JavaScript', 'TypeScript', 'React.js', 'Next.js', 'Tailwind CSS', 'Redux', 'HTML/CSS'],
  'Backend': ['Python', 'Node.js', 'Java', 'Go', 'PostgreSQL', 'MongoDB', 'Redis', 'REST APIs'],
  'Full Stack': ['React.js', 'Node.js', 'Express', 'MongoDB', 'TypeScript', 'Next.js', 'PostgreSQL'],
  'Mobile Development': ['Swift', 'Kotlin', 'React Native', 'Flutter', 'iOS', 'Android', 'Dart'],
  'DevOps': ['Docker', 'Kubernetes', 'AWS', 'Terraform', 'CI/CD', 'Jenkins', 'Ansible'],
  'Cloud Engineering': ['AWS', 'Azure', 'GCP', 'Serverless', 'Lambda', 'EC2', 'CloudFormation'],
  'Linux Administrator': ['Linux', 'Bash', 'Networking', 'Security', 'Apache/Nginx', 'System Admin'],
  'Data Science': ['Python', 'SQL', 'Pandas', 'NumPy', 'Data Visualization', 'Tableau', 'Statistics'],
  'Machine Learning & AI': ['Python', 'TensorFlow', 'PyTorch', 'NLP', 'Computer Vision', 'LLMs'],
  'Cybersecurity': ['Penetration Testing', 'Network Security', 'Ethical Hacking', 'SIEM', 'Firewalls'],
  'QA & Automation': ['Selenium', 'Cypress', 'Appium', 'Postman', 'JIRA', 'TestNG', 'API Testing'],
  'Hardware Engineering': ['Verilog', 'VHDL', 'PCB Design', 'FPGA', 'Circuit Design', 'Microcontrollers'],
  'Electrical Engineering': ['MATLAB', 'Power Systems', 'Control Systems', 'PLC', 'Signal Processing'],
  'Mechanical Engineering': ['SolidWorks', 'ANSYS', 'Thermodynamics', 'Fluid Mechanics', 'AutoCAD'],
  'Civil Engineering': ['AutoCAD Civil 3D', 'Structural Analysis', 'Revit', 'Geotechnical', 'Surveying'],
  'Aerospace Engineering': ['Aerodynamics', 'CATIA', 'Propulsion', 'Flight Mechanics', 'Avionics'],
  'Biomedical Engineering': ['Medical Imaging', 'Biomechanics', 'FDA Regs', 'Biomaterials', 'Prosthetics'],
  'Chemical Engineering': ['Aspen HYSYS', 'Process Engineering', 'Thermodynamics', 'Mass Transfer']
};

// ---------------------------------------------------------------------------
// 3. DYNAMIC COURSE GENERATOR
// ---------------------------------------------------------------------------
export const freeCoursesByDomain: Record<string, Course[]> = {};
export const paidCoursesByDomain: Record<string, Course[]> = {};

const platforms = {
  free: ['Coursera', 'freeCodeCamp', 'Kaggle', 'edX', 'MIT OpenCourseWare', 'Google Digital Garage', 'Stanford Online', 'Udacity'],
  paid: ['Udemy', 'Coursera Plus', 'A Cloud Guru', 'Pluralsight', 'LinkedIn Learning', 'MasterClass', 'DataCamp', 'Udacity Nanodegree']
};

Object.keys(domainIcons).forEach((domain, index) => {
  // Generate 8 Free Courses
  freeCoursesByDomain[domain] = platforms.free.map((platform, i) => ({
    id: `f-${index}-${i}`,
    title: i === 0 ? `Introduction to ${domain}` : 
           i === 1 ? `${domain} Fundamentals` : 
           i === 2 ? `Core Concepts of ${domain}` :
           i === 3 ? `Problem Solving in ${domain}` :
           i === 4 ? `Modern ${domain} Workflows` :
           i === 5 ? `Advanced ${domain} Theory` :
           i === 6 ? `${domain} for Beginners` :
           `${domain}: The Ultimate Crash Course`,
    platform: platform,
    duration: `${Math.floor(Math.random() * 6) + 2} weeks`,
    level: i < 3 ? 'Beginner' : i < 6 ? 'Intermediate' : 'Advanced',
    link: `https://www.google.com/search?q=${encodeURIComponent(platform + ' ' + domain + ' free course')}`,
    rating: Number((Math.random() * (4.9 - 4.2) + 4.2).toFixed(1)),
    students: `${Math.floor(Math.random() * 900) + 100}K+`,
    certificate: i % 2 === 0 // Half offer certificates
  })) as Course[];

  // Generate 8 Paid Courses
  paidCoursesByDomain[domain] = platforms.paid.map((platform, i) => ({
    id: `p-${index}-${i}`,
    title: i === 0 ? `The Complete ${domain} Bootcamp` : 
           i === 1 ? `${domain} Professional Certification` : 
           i === 2 ? `Mastering ${domain}` :
           i === 3 ? `${domain}: Zero to Hero` :
           i === 4 ? `Executive ${domain} Specialization` :
           i === 5 ? `Advanced ${domain} Architecture` :
           i === 6 ? `Certified ${domain} Expert` :
           `${domain} Career Accelerator`,
    platform: platform,
    duration: `${Math.floor(Math.random() * 12) + 4} weeks`,
    level: i < 2 ? 'All Levels' : i < 5 ? 'Intermediate' : 'Advanced',
    link: `https://www.google.com/search?q=${encodeURIComponent(platform + ' ' + domain + ' certification')}`,
    rating: Number((Math.random() * (4.9 - 4.5) + 4.5).toFixed(1)),
    students: `${Math.floor(Math.random() * 150) + 10}K+`,
    price: `₹${(Math.floor(Math.random() * 10) + 2) * 999}`,
    certificate: true // All paid offer certificates
  })) as Course[];
});

// Fallbacks for older components
export const freeCourses: Course[] = freeCoursesByDomain['Software Engineering'];
export const paidCourses: Course[] = paidCoursesByDomain['Software Engineering'];


// ---------------------------------------------------------------------------
// 4. RESUME AI METRICS
// ---------------------------------------------------------------------------
export const mockUniquenessResult: UniquenessResult = {
  overallScore: 23,
  matches: [
    { text: "Experienced developer with strong analytical and problem-solving skills", similarity: 78, source: "Common resume templates database", category: 'medium' },
    { text: "Responsible for developing and maintaining applications using modern frameworks", similarity: 65, source: "Generic job descriptions", category: 'medium' },
    { text: "Team player with excellent communication skills and ability to work under pressure", similarity: 82, source: "Resume clichés database", category: 'low' }
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

export const mockImprovements: ImprovementSuggestion[] = [
  { category: 'skills', priority: 'high', title: 'Add Technical Skills Section', description: 'Your resume lacks a dedicated technical skills section that recruiters look for.', suggestion: 'Create a "Technical Skills" section highlighting languages, frameworks, or tools you\'ve used.', impact: 'Can increase interview callbacks by 40%' },
  { category: 'keywords', priority: 'high', title: 'Include Industry Keywords', description: 'Missing relevant industry-specific keywords that ATS systems look for.', suggestion: 'Incorporate keywords like "Agile methodology" or domain-specific terms naturally.', impact: 'Improves ATS screening success rate by 60%' },
  { category: 'experience', priority: 'medium', title: 'Quantify Your Achievements', description: 'Several achievements lack specific metrics.', suggestion: 'Add quantifiable results: "Improved system performance by 35%".', impact: 'Makes accomplishments 3x more compelling to recruiters' },
  { category: 'format', priority: 'medium', title: 'Optimize Resume Length', description: 'Resume length could be better optimized.', suggestion: 'Keep resume to 1-2 pages max. Focus on most relevant experiences from the last 10 years.', impact: 'Increases recruiter attention span' },
  { category: 'experience', priority: 'medium', title: 'Add Action Verbs', description: 'Job descriptions start with weak verbs.', suggestion: 'Start bullet points with strong action verbs: "Developed", "Led", "Implemented".', impact: 'Creates stronger first impression' },
  { category: 'format', priority: 'low', title: 'Improve Visual Formatting', description: 'Resume formatting could be more professional.', suggestion: 'Use consistent fonts and proper spacing. Avoid graphics that ATS can\'t parse.', impact: 'Ensures ATS compatibility' },
  { category: 'skills', priority: 'low', title: 'Add Soft Skills', description: 'Missing demonstration of soft skills.', suggestion: 'Include soft skills like "Leadership" and "Communication" with specific examples.', impact: 'Shows well-rounded profile' }
];