/* =============================================================================
   C.O.R.E. — DATA LAYER
   Pure data. No DOM, no logic. Edit this file to add origins, allies, or links.

   Every entry is hand-written and every `link` is a real, free, no-login-needed
   destination. Nothing here calls a paid API.
   ========================================================================== */

/* -----------------------------------------------------------------------------
   ORIGINS
   One entry per kind of work a San Franciscan might already be doing.

   from     : the plain-English job title the user would recognise themselves in
   codename : the thematic label shown on the HUD once matched
   powers   : the transferable skills, phrased as abilities the person ALREADY has
   keywords : lowercase substrings matched against what the user types/says.
              Multi-word keywords score higher (see scanner.js) because they are
              stronger evidence than a single common word.
   matches  : real AI-adjacent roles, each with an honest reason and a live link
--------------------------------------------------------------------------- */
const ORIGINS = [
  {
    id: 'retail',
    from: 'Retail Cashier / Sales Associate',
    codename: 'THE FLOOR',
    powers: ['Rapid error detection', 'Judgment under pressure', 'Human de-escalation'],
    keywords: ['cashier', 'register', 'checkout', 'retail', 'sales', 'shop', 'store', 'customers', 'stocking', 'returns'],
    matches: [
      {
        role: 'AI Data Quality Rater',
        pct: 82,
        why: "You already spot mistakes fast and judge quality under time pressure — that is literally the job description.",
        tags: ['Remote', 'Entry-level', 'Paid weekly'],
        link: 'https://outlier.ai'
      },
      {
        role: 'AI Customer Support Specialist',
        pct: 74,
        why: 'De-escalating a frustrated customer transfers directly to reviewing chatbot escalations that went wrong.',
        tags: ['Hybrid', 'SF teams hiring'],
        link: 'https://sfhsa.org/services/jobs-money/jobs-now'
      }
    ]
  },
  {
    id: 'driver',
    from: 'Rideshare / Delivery Driver',
    codename: 'THE ROUTE',
    powers: ['Spatial reasoning', 'Edge-case instinct', 'Timing under chaos'],
    keywords: ['driver', 'driving', 'delivery', 'rideshare', 'uber', 'lyft', 'doordash', 'routes', 'dispatch', 'courier'],
    matches: [
      {
        role: 'Logistics Data Annotator',
        pct: 79,
        why: 'You already think in routes, timing and what-could-go-wrong — annotation teams need exactly that instinct.',
        tags: ['Flexible hours', 'Remote'],
        link: 'https://www.remotasks.com'
      },
      {
        role: 'Field Verification Specialist',
        pct: 70,
        why: 'AI mapping tools are wrong constantly. They need humans who know the real city to ground-truth them.',
        tags: ['SF-local', 'Paid per task'],
        link: 'https://sfhsa.org/services/jobs-money/jobs-now'
      }
    ]
  },
  {
    id: 'restaurant',
    from: 'Restaurant Worker / Line Cook / Diner Manager',
    codename: 'THE PASS',
    powers: ['Failure-mode mastery', 'Throughput thinking', 'Calm in the weeds'],
    keywords: ['restaurant', 'diner', 'kitchen', 'cook', 'chef', 'food', 'inventory', 'waiter', 'waitress', 'server', 'busser', 'barista', 'cafe', 'angry customers'],
    matches: [
      {
        role: 'POS & AI-Ordering System Trainer',
        pct: 76,
        why: 'You know every single way an order can go wrong. That knowledge is the training data an AI kiosk does not have.',
        tags: ['Local', 'On-site'],
        link: 'https://www.sf.gov/techsf'
      },
      {
        role: 'AI Data Quality Rater',
        pct: 68,
        why: 'Fast, consistent judgment calls during a rush is a rateable, payable skill in annotation queues.',
        tags: ['Remote', 'Entry-level'],
        link: 'https://outlier.ai'
      }
    ]
  },
  {
    id: 'care',
    from: 'Care Worker / Home Health Aide',
    codename: 'THE WATCH',
    powers: ['Subtle-change detection', 'Trust under stress', 'Knowing when a script fails'],
    keywords: ['care', 'caregiver', 'caregiving', 'nurse', 'nursing', 'patient', 'patients', 'health', 'elderly', 'hospital', 'aide', 'cna', 'hospice'],
    matches: [
      {
        role: 'Health Data Annotation Specialist',
        pct: 80,
        why: "Noticing that someone is 'a little off today' before a chart does is exactly the pattern-labeling skill health-AI teams are short on.",
        tags: ['Remote', 'Trust-critical'],
        link: 'https://www.prolific.com'
      },
      {
        role: 'AI Wellbeing Check-in Coordinator',
        pct: 71,
        why: 'Knowing when a person needs a human and not a script is the missing piece in most care-AI pilots.',
        tags: ['Hybrid', 'SF pilots'],
        link: 'https://www.codetenderloin.org'
      }
    ]
  },
  {
    id: 'admin',
    from: 'Office Admin / Scheduler',
    codename: 'THE SWITCHBOARD',
    powers: ['Systems thinking', 'Bottleneck detection', 'Running humans + tools together'],
    keywords: ['admin', 'administrative', 'scheduling', 'schedule', 'office', 'calendar', 'organize', 'paperwork', 'assistant', 'receptionist', 'filing', 'data entry'],
    matches: [
      {
        role: 'AI Workflow Coordinator',
        pct: 83,
        why: 'You already run the humans-plus-tools system by hand. This job just automates the parts worth automating.',
        tags: ['Remote', 'High demand'],
        link: 'https://grow.google'
      },
      {
        role: 'Prompt & Process QA Tester',
        pct: 72,
        why: 'Catching the moment a process quietly breaks is your daily job. Now the process happens to be a model.',
        tags: ['Remote', 'No code required'],
        link: 'https://outlier.ai'
      }
    ]
  },
  {
    id: 'teacher',
    from: 'Teacher / Tutor',
    codename: 'THE EXPLAINER',
    powers: ['Confusion diagnosis', 'Scaffolding', 'Explaining hard things simply'],
    keywords: ['teacher', 'teaching', 'teach', 'classroom', 'student', 'students', 'tutor', 'tutoring', 'school', 'lesson', 'curriculum', 'professor', 'instructor'],
    matches: [
      {
        role: 'AI Tutoring Content Reviewer',
        pct: 85,
        why: 'You know what a confused student actually needs. Ed-tech AI teams are desperately short of that review skill.',
        tags: ['Remote', 'Flexible'],
        link: 'https://www.prolific.com'
      },
      {
        role: 'Curriculum Prompt Writer',
        pct: 77,
        why: 'Lesson planning is prompt design with extra steps and higher stakes. You have been doing the hard version.',
        tags: ['Remote', 'Portfolio-friendly'],
        link: 'https://grow.google'
      }
    ]
  },
  {
    id: 'artist',
    from: 'Artist / Graphic Designer',
    codename: 'THE EYE',
    powers: ['Trained visual judgment', 'Brief translation', 'Taste as a service'],
    keywords: ['artist', 'design', 'designer', 'graphic', 'art', 'illustration', 'illustrator', 'creative', 'drawing', 'photography', 'photographer', 'video', 'editing'],
    matches: [
      {
        role: 'AI Output Quality Reviewer (visual)',
        pct: 75,
        why: "Your trained eye for 'this looks wrong but I can say why' is exactly what generative-image QA teams pay for.",
        tags: ['Remote', 'Portfolio helps'],
        link: 'https://www.remotasks.com'
      },
      {
        role: 'Prompt-to-Design Specialist',
        pct: 73,
        why: 'You already translate vague client briefs into visuals. The only change is that the collaborator is a model.',
        tags: ['Freelance-friendly'],
        link: 'https://www.hackthehood.org'
      }
    ]
  },
  {
    id: 'business',
    from: 'Small Business Owner',
    codename: 'THE OPERATOR',
    powers: ['Constraint solving', 'No-IT-department resourcefulness', 'Peer credibility'],
    keywords: ['business', 'owner', 'entrepreneur', 'small business', 'my shop', 'my store', 'staff', 'payroll', 'landlord', 'franchise', 'salon', 'barber'],
    matches: [
      {
        role: 'AI Adoption Consultant (peer-to-peer)',
        pct: 78,
        why: "You already solved 'how do I use this with no time and no IT department.' Other owners will pay to skip that curve.",
        tags: ['Local', 'SF network'],
        link: 'https://www.codetenderloin.org'
      },
      {
        role: 'Local AI Tools Trainer',
        pct: 69,
        why: 'Teaching one other shop owner to use a free AI tool is a real, billable half-day gig right now.',
        tags: ['Community-based'],
        link: 'https://www.bavc.org'
      }
    ]
  },
  {
    id: 'civic',
    from: 'City / Government Employee',
    codename: 'THE INSIDER',
    powers: ['Rule-system fluency', 'Public-facing patience', 'Knowing where the real process lives'],
    keywords: ['city', 'government', 'public', 'civic', 'municipal', 'department', 'permit', 'permits', 'clerk', 'dmv', 'transit', 'muni', 'social worker', 'case worker'],
    matches: [
      {
        role: 'Civic AI Data Steward',
        pct: 74,
        why: 'Cities piloting AI tools need someone who knows where the real rules and the real exceptions live. That is you.',
        tags: ['Public sector', 'Stable'],
        link: 'https://www.sf.gov'
      },
      {
        role: 'Public-facing AI Literacy Trainer',
        pct: 70,
        why: 'You explain bureaucratic systems to overwhelmed people all day. Same skill, new subject matter.',
        tags: ['Local', 'Community-facing'],
        link: 'https://www.sf.gov/techsf'
      }
    ]
  }
];

/* -----------------------------------------------------------------------------
   ALLIES
   People who already made the jump. One per origin, so every single scan result
   surfaces a human — nobody hits a dead end.

   originIds : which ORIGINS.id values this ally is matched to
   intro     : a pre-written first message, so the user never has to draft the
               scary opening line themselves at 11pm
--------------------------------------------------------------------------- */
const ALLIES = [
  {
    name: 'D. Okafor',
    codename: 'THE AUDITOR',
    from: 'Ex-cashier → AI Data Rater',
    color: '#00f0ff',
    originIds: ['retail'],
    quote: 'The application looked scarier than it was. I did the free tutorial on a Tuesday night and had my first paid task by Thursday.',
    intro: "Hi D. — I just ran my background through C.O.R.E. and got matched toward AI Data Rating too. Would you have 15 minutes to swap notes on how you got started?"
  },
  {
    name: 'R. Villanueva',
    codename: 'THE NAVIGATOR',
    from: 'Ex-delivery driver → Logistics Annotator',
    color: '#ff8a3d',
    originIds: ['driver'],
    quote: 'Six years of knowing which alleys are one-way turned out to be a qualification. I still cannot believe it counted.',
    intro: "Hi R. — I drive delivery and C.O.R.E. matched me toward logistics annotation work. Could I ask you a couple of questions about how you made the switch?"
  },
  {
    name: 'M. Reyes',
    codename: 'THE EXPEDITOR',
    from: 'Ex-line cook → POS/AI Trainer',
    color: '#e23636',
    originIds: ['restaurant'],
    quote: 'Nobody in the training cared that I had never used a computer for work. They cared that I knew exactly how an order goes wrong.',
    intro: "Hi M. — I work in a restaurant and just got matched to POS/AI Trainer roles on C.O.R.E. Would you be open to a few questions about the transition?"
  },
  {
    name: 'G. Mensah',
    codename: 'THE READER',
    from: 'Ex-home health aide → Health Data Annotator',
    color: '#38ff9c',
    originIds: ['care'],
    quote: 'I spent nine years noticing when someone was not themselves. It turns out there is a whole industry that needs that and cannot hire for it.',
    intro: "Hi G. — I do care work and C.O.R.E. matched me toward health data annotation. Would you have a few minutes to tell me how you found your first role?"
  },
  {
    name: 'J. Park',
    codename: 'THE CONDUCTOR',
    from: 'Ex-office admin → AI Workflow Coordinator',
    color: '#ffb627',
    originIds: ['admin'],
    quote: "I almost did not apply, because the title had 'AI' in it and I assumed that meant coding. It did not. It meant scheduling, but for tools.",
    intro: "Hi J. — C.O.R.E. matched my admin background to AI Workflow Coordinator roles. Mind if I ask how your first few weeks went?"
  },
  {
    name: 'A. Singh',
    codename: 'THE TRANSLATOR',
    from: 'Ex-teacher → Ed-AI Content Reviewer',
    color: '#ff3d8a',
    originIds: ['teacher'],
    quote: "The hardest part was not the skill. It was believing that 20 years of teaching counted as 'AI experience.' It does.",
    intro: "Hi A. — I teach, and C.O.R.E. matched me toward Ed-AI content review. I would love 15 minutes to hear how you made the switch."
  },
  {
    name: 'L. Duarte',
    codename: 'THE CRITIC',
    from: 'Ex-graphic designer → Generative QA Reviewer',
    color: '#a06bff',
    originIds: ['artist'],
    quote: 'I was terrified this field was coming for my job. It partly was. Being the person who judges the output is how I stayed in the room.',
    intro: "Hi L. — I am a designer and C.O.R.E. matched me toward generative-output QA. Could I ask how you positioned your portfolio for it?"
  },
  {
    name: 'T. Nakamura',
    codename: 'THE OPERATOR',
    from: 'Ex-salon owner → Peer AI Adoption Consultant',
    color: '#00f0ff',
    originIds: ['business'],
    quote: 'I figured this stuff out for my own shop because I had to. Now four other owners on the same block pay me to figure it out for theirs.',
    intro: "Hi T. — I run a small business and C.O.R.E. matched me toward peer-to-peer AI adoption work. How did you get your first client?"
  },
  {
    name: 'C. Boateng',
    codename: 'THE INSIDER',
    from: 'Ex-permit clerk → Civic AI Data Steward',
    color: '#38ff9c',
    originIds: ['civic'],
    quote: 'Every AI pilot the department ran failed the same way: nobody on the team knew the actual rules. That gap was my whole job description.',
    intro: "Hi C. — I work for the city and C.O.R.E. matched me toward civic AI data stewardship. Would you have time for a short conversation about the path?"
  }
];

/* -----------------------------------------------------------------------------
   MONDAY BRIEFING
   Deliberately generic and non-personalised: this tab must make sense to someone
   who never ran a scan, printed it out, and read it off a wall.
--------------------------------------------------------------------------- */
const BRIEFING = [
  {
    title: 'See if your skills already transfer.',
    body: 'Open the Origin Scan tab and say or type one sentence about your job. Thirty seconds. No sign-up, no resume.',
    links: []
  },
  {
    title: 'Take one free class this week, not someday.',
    body: 'Both of these are genuinely free, self-paced, and assume you know nothing.',
    links: [
      { label: 'Elements of AI', href: 'https://www.elementsofai.com' },
      { label: 'Google AI Essentials', href: 'https://www.coursera.org/google-learn/ai-essentials' }
    ]
  },
  {
    title: 'Talk to a real person, not a website.',
    body: 'Walk-in help in San Francisco. You do not need an appointment or a laptop.',
    links: [
      { label: 'TechSF', href: 'https://www.sf.gov/techsf' },
      { label: 'Code Tenderloin', href: 'https://www.codetenderloin.org' },
      { label: 'SF JobsNOW!', href: 'https://sfhsa.org/services/jobs-money/jobs-now' }
    ]
  }
];

/* -----------------------------------------------------------------------------
   TRACKS
   Four destinations the roadmap generator can aim at. Every origin maps to one,
   but the user can always override the guess in the Monday Briefing.
--------------------------------------------------------------------------- */
const TRACKS = [
  {
    id: 'data',
    name: 'Data & Annotation',
    blurb: 'Judging, labelling and correcting what models produce. The widest open door: no degree, no code, paid per task.',
    liPeople: 'AI data annotator',
    liJobs: 'AI data annotation'
  },
  {
    id: 'ops',
    name: 'AI Support & Operations',
    blurb: 'Running the humans-plus-tools system: escalations, workflows, quality gates. Your people skills are the qualification.',
    liPeople: 'AI operations specialist',
    liJobs: 'AI operations support'
  },
  {
    id: 'teach',
    name: 'AI Teaching & Content',
    blurb: 'Explaining, reviewing and writing the material other people learn from. Built on knowing what confusion looks like.',
    liPeople: 'AI curriculum content reviewer',
    liJobs: 'AI content reviewer'
  },
  {
    id: 'biz',
    name: 'AI for Small Business',
    blurb: 'Helping other owners adopt free tools without an IT department. Peer credibility is the whole product.',
    liPeople: 'AI consultant small business',
    liJobs: 'AI adoption consultant'
  }
];

/* Which track each origin points at by default. */
const ORIGIN_TRACK = {
  retail: 'data',
  driver: 'data',
  restaurant: 'ops',
  care: 'data',
  admin: 'ops',
  teacher: 'teach',
  artist: 'teach',
  business: 'biz',
  civic: 'ops'
};

/* -----------------------------------------------------------------------------
   ROADMAP
   A four-week plan assembled locally. Each week offers a track-specific task
   first, then shared ones; how many survive depends on the hours the user says
   they have. Tasks with a `phone` variant are rewritten for someone with no
   computer at home.

   This is a rules engine, not a model — but it is genuinely per-person: origin,
   track, hours and device all change the output.
--------------------------------------------------------------------------- */
const ROADMAP_WEEKS = [
  {
    title: 'Get the vocabulary',
    goal: 'Stop feeling behind. One week of plain-English grounding, nothing technical.',
    byTrack: {
      data: { mins: 45, text: 'Read one annotation guideline document end to end so you know what "quality" formally means.', link: 'https://www.remotasks.com', linkLabel: 'Remotasks guides' },
      ops:  { mins: 45, text: 'Write down the five ways a request most often goes wrong at your current job. That list is your interview answer.' },
      teach:{ mins: 45, text: 'Take one lesson you already teach and write the three questions a confused person always asks.' },
      biz:  { mins: 45, text: 'List the three most annoying admin tasks in your business. Those are your first automation demos.' }
    },
    shared: [
      { mins: 60, text: 'Finish chapter 1 of Elements of AI. It assumes zero background and it is genuinely free.', link: 'https://www.elementsofai.com', linkLabel: 'Elements of AI' },
      { mins: 60, text: 'Start Google AI Essentials. Audit it for free — you do not have to pay for the certificate.', link: 'https://www.coursera.org/google-learn/ai-essentials', linkLabel: 'Google AI Essentials' },
      { mins: 20, text: 'Join two LinkedIn groups in this field and just read for a week.', li: 'groups' }
    ]
  },
  {
    title: 'Get your hands on the tools',
    goal: 'Touch the actual software. Free tiers only — do not pay for anything this week.',
    byTrack: {
      data: { mins: 90, text: 'Do a practice annotation set. Time yourself. Speed plus consistency is the whole hiring bar.', link: 'https://www.prolific.com', linkLabel: 'Prolific' },
      ops:  { mins: 90, text: 'Take one real workflow from your job and write it out as numbered steps a machine could follow. That document is a work sample.' },
      teach:{ mins: 90, text: 'Ask a free chatbot to explain something you teach, then mark it like a student paper. Your corrections are the portfolio.' },
      biz:  { mins: 90, text: 'Automate one task in your own business with a free tool. Screenshot the before and after.' }
    },
    shared: [
      { mins: 45, text: 'Use a free assistant every day this week for one real task. Fluency comes from repetition, not reading.', link: 'https://claude.ai', linkLabel: 'Claude (free tier)' },
      { mins: 60, text: 'Walk into TechSF and say you are switching into AI-adjacent work. No appointment needed.', link: 'https://www.sf.gov/techsf', linkLabel: 'TechSF' },
      { mins: 30, text: 'Browse ten real job postings in this track and copy the words they repeat. Those words go in your profile.', li: 'jobs' }
    ]
  },
  {
    title: 'Make one thing that proves it',
    goal: 'One small artifact beats a paragraph of claims. Nobody is checking your credentials, they are checking your sample.',
    byTrack: {
      data: { mins: 120, text: 'Label 50 items, then write one page on the edge cases you found. That page is your work sample.',
              phone: 'Label 50 items on your phone, then record a 3-minute voice memo on the edge cases and send yourself the transcript.' },
      ops:  { mins: 120, text: 'Turn your workflow document into a one-page "here is where AI helps and where it must not" brief.',
              phone: 'Dictate the brief into your phone notes app and clean it up with a free assistant.' },
      teach:{ mins: 120, text: 'Write one lesson plan with the AI-generated version beside it and your edits marked in the margin.',
              phone: 'Record a 5-minute explainer video on your phone of you correcting an AI answer.' },
      biz:  { mins: 120, text: 'Write a one-page case study of the task you automated: hours before, hours after, cost zero.',
              phone: 'Film a 2-minute phone walkthrough of the automation running in your shop.' }
    },
    shared: [
      { mins: 45, text: 'Rewrite your LinkedIn headline to name the track, not your old job title. This is the single highest-leverage hour of the month.', li: 'profile' },
      { mins: 30, text: 'Message one person from The Assembly and ask what their first month looked like. The draft is already written for you.', tab: 'assembly' },
      { mins: 30, text: 'Ask Code Tenderloin about a free workshop or a computer you can use.', link: 'https://www.codetenderloin.org', linkLabel: 'Code Tenderloin' }
    ]
  },
  {
    title: 'Put it in front of people',
    goal: 'Applications and conversations, not more studying. You know enough now.',
    byTrack: {
      data: { mins: 60, text: 'Sign up on two annotation platforms and complete their qualification tasks.', link: 'https://outlier.ai', linkLabel: 'Outlier' },
      ops:  { mins: 60, text: 'Apply to five roles that mention "AI" plus "operations", "support" or "coordinator".', li: 'jobs' },
      teach:{ mins: 60, text: 'Pitch two ed-tech companies directly with your marked-up lesson attached. Skip the portal.', li: 'jobs' },
      biz:  { mins: 60, text: 'Offer one free half-day to a neighbouring business owner. Ask for a referral, not money, the first time.' }
    },
    shared: [
      { mins: 45, text: 'Post publicly about what you built in week 3. Not a job plea — just the thing you made.', li: 'post' },
      { mins: 45, text: 'Sign up for SF JobsNOW! — the city places people directly into paid roles with local employers.', link: 'https://sfhsa.org/services/jobs-money/jobs-now', linkLabel: 'SF JobsNOW!' },
      { mins: 30, text: 'Send your week-3 artifact to the person you messaged in week 3 and ask for one piece of feedback.', tab: 'assembly' }
    ]
  }
];

/* Tasks kept per week, by how many hours a week the user actually has. */
const HOURS_TO_TASKS = { '2': 2, '5': 3, '10': 4 };

/* =============================================================================
   TECH ORIGINS — the call is coming from inside the house

   The first nine origins are people whose work AI is arriving at from outside.
   These six are people already inside tech whose specific rung is being
   automated away: junior SWEs, manual QA, tier-1 IT, dashboard analysts,
   line-side robotics techs, and doc writers.

   Appended rather than inlined above so the two groups stay legible. Everything
   downstream — the scanner, the dropdown, the roster filter, the roadmap — reads
   these arrays at runtime, so nothing else needs to change.
   ========================================================================== */

ORIGINS.push(
  {
    id: 'swe',
    from: 'Software Engineer / Web Developer',
    codename: 'THE BUILDER',
    powers: ['Systems decomposition', 'Debugging from symptoms', 'Knowing when output is wrong'],
    keywords: ['software', 'engineer', 'developer', 'programmer', 'coding', 'code', 'javascript', 'python', 'frontend', 'backend', 'full stack', 'react', 'api', 'web developer'],
    matches: [
      {
        role: 'AI Evaluation Engineer',
        pct: 86,
        why: 'Writing tests for code is one step from writing evals for models — and evals are the bottleneck on every AI team right now.',
        tags: ['Remote', 'High demand', 'Best-paid pivot'],
        link: 'https://huggingface.co'
      },
      {
        role: 'AI Application Engineer',
        pct: 81,
        why: 'The scarce skill is no longer writing the function, it is designing the system around a model that is wrong 5% of the time. You already build for failure.',
        tags: ['Remote', 'SF-dense'],
        link: 'https://developers.google.com/machine-learning/crash-course'
      }
    ]
  },
  {
    id: 'qa',
    from: 'QA / Manual Software Tester',
    codename: 'THE BREAKER',
    powers: ['Adversarial thinking', 'Reproducible reporting', 'Finding the unhappy path'],
    keywords: ['qa', 'quality assurance', 'tester', 'testing', 'manual testing', 'test cases', 'bug', 'bugs', 'regression', 'sdet'],
    matches: [
      {
        role: 'AI Red Teamer',
        pct: 88,
        why: 'Your entire job has been finding the input that breaks the thing. That is now a named, well-paid role at every model company.',
        tags: ['Remote', 'Hot market'],
        link: 'https://www.prolific.com'
      },
      {
        role: 'Model Evaluation Specialist',
        pct: 79,
        why: 'Manual test scripts are being automated. Judging whether a model answer is actually good is not, and it needs exactly your rigour.',
        tags: ['Remote', 'Entry-friendly'],
        link: 'https://outlier.ai'
      }
    ]
  },
  {
    id: 'itsupport',
    from: 'IT Support / Helpdesk',
    codename: 'THE FIRST LINE',
    powers: ['Diagnosis from vague reports', 'Patience under pressure', 'Knowing what actually breaks'],
    keywords: ['it support', 'helpdesk', 'help desk', 'technician', 'tier 1', 'troubleshooting', 'sysadmin', 'desktop support', 'ticket', 'tickets'],
    matches: [
      {
        role: 'AI Deployment & Support Engineer',
        pct: 82,
        why: 'Tier-1 tickets are being deflected by bots. Somebody has to run, monitor and fix those bots — and know when to pull a human back in.',
        tags: ['Hybrid', 'SF teams hiring'],
        link: 'https://grow.google'
      },
      {
        role: 'Internal AI Tools Champion',
        pct: 74,
        why: 'You already teach an entire office to use software they resent. That is the whole job of AI adoption inside a company.',
        tags: ['On-site', 'Promotable'],
        link: 'https://www.sf.gov/techsf'
      }
    ]
  },
  {
    id: 'analyst',
    from: 'Data Analyst / BI Reporting',
    codename: 'THE DASHBOARD',
    powers: ['Question framing', 'Spotting bad numbers', 'Explaining findings to non-experts'],
    keywords: ['analyst', 'data analyst', 'business intelligence', 'sql', 'dashboard', 'dashboards', 'tableau', 'reporting', 'excel', 'spreadsheets', 'metrics'],
    matches: [
      {
        role: 'AI Evaluation Data Scientist',
        pct: 84,
        why: 'Writing the SQL is the part that got automated. Deciding which number would actually settle the argument did not.',
        tags: ['Remote', 'High demand'],
        link: 'https://www.kaggle.com/learn'
      },
      {
        role: 'AI Product Analyst',
        pct: 76,
        why: 'AI products fail on measurement, not on modelling. Teams need someone who can say what "working" means in numbers.',
        tags: ['Hybrid', 'SF-dense'],
        link: 'https://developers.google.com/machine-learning/crash-course'
      }
    ]
  },
  {
    id: 'robotics',
    from: 'Robotics / Manufacturing Technician',
    codename: 'THE HANDS',
    powers: ['Physical intuition', 'Failure diagnosis in the real world', 'Safety judgment'],
    keywords: ['robotics', 'robot', 'robots', 'manufacturing', 'machinist', 'automation', 'plc', 'mechatronics', 'assembly line', 'maintenance', 'cnc', 'warehouse'],
    matches: [
      {
        role: 'Robot Data Collection Specialist',
        pct: 83,
        why: 'Every robotics-foundation-model team is starving for real-world demonstration data, and it has to be collected by someone who knows the machine.',
        tags: ['On-site', 'Bay Area labs'],
        link: 'https://huggingface.co'
      },
      {
        role: 'Teleoperation & Safety Operator',
        pct: 77,
        why: 'Autonomous systems still need a human who can take the controls and knows what "about to go wrong" feels like.',
        tags: ['On-site', 'Shift work', 'Growing fast'],
        link: 'https://sfhsa.org/services/jobs-money/jobs-now'
      }
    ]
  },
  {
    id: 'techwriter',
    from: 'Technical Writer / Documentation',
    codename: 'THE MANUAL',
    powers: ['Precision under ambiguity', 'Audience modelling', 'Structuring the unstructured'],
    keywords: ['technical writer', 'technical writing', 'documentation', 'docs', 'copywriter', 'content writer', 'editor', 'style guide', 'knowledge base'],
    matches: [
      {
        role: 'AI Output Editor & Style Lead',
        pct: 80,
        why: 'First drafts are free now. Deciding what is accurate, on-brand and safe to publish is the job that survived — and it pays more.',
        tags: ['Remote', 'Flexible'],
        link: 'https://www.prolific.com'
      },
      {
        role: 'Prompt & Guideline Author',
        pct: 78,
        why: 'Annotation guidelines and system prompts are technical documentation for a reader that takes everything literally. That is your specialty.',
        tags: ['Remote', 'Portfolio-friendly'],
        link: 'https://outlier.ai'
      }
    ]
  }
);

ALLIES.push(
  {
    name: 'S. Whitfield',
    codename: 'THE REBUILDER',
    from: 'Ex-frontend dev → AI Evaluation Engineer',
    color: '#00f0ff',
    originIds: ['swe'],
    quote: 'My whole team got cut because the boilerplate I wrote is free now. The eval work I moved into is the part nobody has figured out how to automate.',
    intro: "Hi S. — I'm a developer and C.O.R.E. matched me toward AI evaluation engineering. Could I ask how you made that pivot without a research background?"
  },
  {
    name: 'P. Adeyemi',
    codename: 'THE BREAKER',
    from: 'Ex-manual QA → AI Red Teamer',
    color: '#e23636',
    originIds: ['qa'],
    quote: 'Twelve years of being told manual testing was a dead end. Turns out being professionally suspicious is the most transferable thing I own.',
    intro: "Hi P. — I come from manual QA and C.O.R.E. matched me toward red teaming. Would you have 15 minutes to talk about how you got your first role?"
  },
  {
    name: 'K. Nowak',
    codename: 'THE UPTIME',
    from: 'Ex-helpdesk → AI Deployment Engineer',
    color: '#38ff9c',
    originIds: ['itsupport'],
    quote: 'The chatbot replaced my ticket queue. Then somebody had to babysit the chatbot, and I was the only one who knew what users actually ask.',
    intro: "Hi K. — I work in IT support and C.O.R.E. matched me toward AI deployment work. How did you position the helpdesk experience?"
  },
  {
    name: 'H. Vasquez',
    codename: 'THE MEASURE',
    from: 'Ex-BI analyst → AI Evaluation Data Scientist',
    color: '#ffb627',
    originIds: ['analyst'],
    quote: 'I stopped competing on writing queries the moment a model could write them faster. I compete on knowing which question is worth asking.',
    intro: "Hi H. — I'm a data analyst and C.O.R.E. matched me toward AI evaluation. Would you be open to a short conversation about the transition?"
  },
  {
    name: 'B. Osei',
    codename: 'THE HANDS',
    from: 'Ex-line technician → Robot Data Specialist',
    color: '#ff8a3d',
    originIds: ['robotics'],
    quote: 'They had PhDs who could train the model and nobody who could tell them why the gripper kept failing on Tuesdays. That was me.',
    intro: "Hi B. — I work in robotics maintenance and C.O.R.E. matched me toward robot data collection. Could I ask how you found that role?"
  },
  {
    name: 'N. Farah',
    codename: 'THE MANUAL',
    from: 'Ex-technical writer → AI Output Editor',
    color: '#ff3d8a',
    originIds: ['techwriter'],
    quote: 'I was terrified generated text would end me. I now get paid more to decide which generated text is allowed to ship.',
    intro: "Hi N. — I'm a technical writer and C.O.R.E. matched me toward AI output editing. How did you show the judgment side of the work in an application?"
  }
);

/* A fifth destination for people already inside tech. */
TRACKS.push({
  id: 'build',
  name: 'AI Engineering & Evaluation',
  blurb: 'Building and stress-testing the systems themselves. The rung above the one that got automated — closest jump if you already work in tech.',
  liPeople: 'AI evaluation engineer',
  liJobs: 'AI engineer evaluation'
});

Object.assign(ORIGIN_TRACK, {
  swe: 'build',
  qa: 'build',
  itsupport: 'ops',
  analyst: 'build',
  robotics: 'build',
  techwriter: 'teach'
});

/* Week-by-week task for the new track, slotted into the existing four weeks. */
[
  { mins: 60, text: 'Read one public model card and one eval report end to end. Learn what the field counts as evidence.', link: 'https://huggingface.co', linkLabel: 'Hugging Face model cards' },
  { mins: 120, text: 'Write 20 test cases that break a free chatbot, and record exactly how each one fails. That file is your work sample.', link: 'https://developers.google.com/machine-learning/crash-course', linkLabel: 'ML Crash Course' },
  { mins: 150, text: 'Turn those 20 cases into a small public eval repo with a README explaining what you measured and why.',
    phone: 'Turn those 20 cases into a written eval report and publish it as a LinkedIn article from your phone.' },
  { mins: 60, text: 'Apply to five roles with "eval", "red team" or "AI engineer" in the title, linking the repo in line one.', li: 'jobs' }
].forEach((task, i) => { ROADMAP_WEEKS[i].byTrack.build = task; });
