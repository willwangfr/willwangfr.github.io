// Everything on the site lives in this one file. Edit here, refresh, done.
// Anything in this file is public once deployed, even if a section is hidden.
//
// item kinds: build | company | idea | research | event
// item fields: id, kind, title, oneLiner, details (string or list), year, status,
//   role, stack[], links[{label,url}], group, featured, why (ideas),
//   invite + inviteWho + inviteUrl (anything you want people to join),
//   date 'YYYY-MM-DD' / recurring / past / when / place / rsvp + rsvpLabel (events),
//   embed 'toys/x.html' (live preview inside the detail panel)
// prose fields accept [text](https://link) for inline links.
window.SITE = {
  updated: "oct 8, 2026",

  person: {
    first: "william",
    last: "wang",
    email: "wwang719@usc.edu",
    bio: "i'm an MD student at USC Keck. my research uses language models to study emotion + psychiatry, with the Adolphs lab at Caltech. i'm clinical AI lead at Coherence Health and CSO at Cosmora, and i build a lot of stuff on the side.",
    roles: [
      { text: "md student · usc keck", kind: "research" },
      { text: "clinical ai lead · coherence health", kind: "company" },
      { text: "ai + emotion research · caltech", kind: "research" },
      { text: "cso · cosmora", kind: "company" },
      { text: "builder", kind: "build" },
    ],
    officeHours: { url: "", label: "grab a coffee chat" },
    links: [
      { label: "github", url: "https://github.com/willwangfr" },
      { label: "google scholar", url: "https://scholar.google.com/citations?user=rmjtK3sAAAAJ" },
      { label: "devpost", url: "https://devpost.com/wwang28" },
    ],
  },

  copy: {
    now: { title: "now", blurb: "what i'm spending time on this fall." },
    build: { title: "build", blurb: "things i built because i wanted them. a few turned out useful to other people too." },
    companies: { title: "companies", blurb: "startups i'm part of." },
    ideas: { title: "startup ideas", nav: "ideas", blurb: "ideas i'm into but not actively building. if you're working on one, i'd love to talk or help." },
    research: { title: "research", blurb: "using language models to poke at how emotion + psychiatric stuff works. older bio and clinical AI work is further down." },
    events: { title: "events", blurb: "stuff i help run. come through." },
    join: { title: "join in", nav: "join", blurb: "every open invite on this page in one spot. the button just opens an email." },
    about: { title: "about", blurb: "the longer version." },
    contact: { title: "say hi", nav: "contact", blurb: "email's best." },
  },

  now: [
    "building the product at [Coherence Health](https://coherencehealth.io): an AI functional-medicine doctor, starting with autoimmune conditions like hashimoto's",
    "getting papers out on emotion + psychiatry in language models, with the [Adolphs lab](https://emotion.caltech.edu/) at Caltech",
    "helping pre-meds get into med school with [t20 consulting](https://t20consulting.com/)",
    "working on [Cosmora](https://www.cosmorahealth.com/): a model that reads retinal photos, plus a cheap handheld camera to take them",
    "mentoring a handful of student research projects on LLM psychometrics + AI evals",
    "still tinkering on moodspace and youtube music mapper",
    "working on [slop labs](https://omegapoint.space/) with [Cody Hergenroeder](https://codyh.xyz): personality in language models",
    "in the works: joining [replicater labs](https://replicater.xyz/)",
    "djing when i get the chance",
  ],

  groups: {
    build: [
      { id: "consumer", label: "apps + tools" },
      { id: "music", label: "music + dj stuff" },
      { id: "hackathons", label: "hackathon projects" },
      { id: "toys", label: "games + toys" },
      { id: "art", label: "generative art" },
    ],
    research: [
      { id: "current", label: "what i'm working on" },
      { id: "clinical", label: "clinical ai" },
      { id: "earlier", label: "earlier research" },
    ],
  },

  items: [
    // ---------- build ----------
    {
      id: "instagram-export-analyzer", kind: "build", group: "consumer", featured: true,
      title: "instagram export analyzer", year: "2026", status: "live",
      oneLiner: "drop in your own instagram data export and see who doesn't follow back, who left, and who just changed their username. runs in your browser and nothing gets uploaded.",
      details: [
        "it reads the official export instagram gives you, so there's no login.",
        "on my test account, 42% of the people who looked like unfollowers had actually just renamed. so it keeps \"left\" and \"renamed\" separate, and it'll say it can't tell when it can't.",
      ],
      stack: ["javascript", "python"],
      links: [{ label: "open the web app", url: "https://willwangfr.github.io/instagram-unfollow-checker/web/" }],
    },
    {
      id: "moodspace", kind: "build", group: "consumer", featured: true,
      title: "moodspace", year: "2026", status: "shipped",
      oneLiner: "search your journal, photos and videos by how you felt when you made them.",
      details: [
        "everything goes on a valence/arousal map (pleasant vs unpleasant, calm vs amped). then you can pull up memories near a feeling, look at mood clusters, or walk the path between two moments.",
        "the demo runs on a fake corpus, so you don't need an API key to try it.",
      ],
      stack: ["python", "streamlit", "plotly"],
      links: [
        { label: "github", url: "https://github.com/willwangfr/moodspace" },
        { label: "how it works", url: "https://github.com/willwangfr/moodspace/blob/main/docs/METHOD.md" },
      ],
    },
    {
      id: "youtube-music-mapper", kind: "build", group: "music", featured: true,
      title: "youtube music mapper", year: "2026", status: "in progress",
      oneLiner: "turns your music library into a map of how your artists connect. i use it to plan dj sets.",
      details: [
        "imports from youtube music, spotify, google takeout or a pasted list. the dj side finds bridge artists and paths between two tracks, so a set doesn't jump around randomly.",
        "the public repo ships a small sample library instead of mine.",
      ],
      stack: ["python", "flask", "d3.js"],
      links: [{ label: "github", url: "https://github.com/willwangfr/youtube-music-mapper" }],
      invite: "map your own library with it and tell me what's confusing. i'm working on share cards + onboarding next.",
      inviteWho: "djs + music nerds",
    },
    {
      id: "eduvoicer", kind: "build", group: "hackathons", featured: true,
      title: "eduvoicer", year: "2020", status: "prize",
      oneLiner: "reads textbooks aloud in a voice you pick, like a parent's, for students with dyslexia or low vision.",
      details: [
        "built with Rodrigo Castellon and Charlie Huang at TreeHacks 2020. it won the Voice Assistance Grand Prize and Voiceflow's Most User-Friendly Voice Assistance Hack.",
      ],
      role: "team member",
      stack: ["python", "flask", "tensorflow", "google cloud"],
      links: [
        { label: "devpost", url: "https://devpost.com/software/eduvoicer" },
        { label: "github", url: "https://github.com/rodrigo-castellon/EduVoicer" },
      ],
    },
    {
      id: "ai-dj", kind: "build", group: "music",
      title: "ai dj", year: "2026", status: "prototype",
      oneLiner: "give it a pile of songs and it orders them into a set and mixes the transitions.",
      details: [
        "it reads bpm, key and energy, plans the order around the camelot wheel, then separates stems and blends with EQ so transitions aren't just volume fades.",
        "not public yet.",
      ],
      stack: ["python", "fastapi", "demucs", "librosa"],
    },
    {
      id: "ai-dj-judge", kind: "build", group: "music",
      title: "ai dj judge", year: "2026", status: "prototype",
      oneLiner: "listens to a recorded dj set and grades each transition, with timestamps.",
      details: ["checks beat alignment, key clashes, energy flow and EQ smoothness. it's the companion to ai dj. not public yet."],
      stack: ["python", "librosa"],
    },
    {
      id: "dj-transition-taxonomy", kind: "build", group: "music",
      title: "dj transition taxonomy", year: "2026", status: "prototype",
      oneLiner: "finds the transitions inside long dj mixes and clusters them into types.",
      stack: ["python", "librosa", "scikit-learn", "umap"],
    },
    {
      id: "longevity-stack-checker", kind: "build", group: "hackathons",
      title: "longevity stack checker", year: "2025", status: "1st place",
      oneLiner: "type in your supplement routine and get back a safety score, plus likely interactions, overlaps and warnings.",
      details: ["won 1st place at the first Caltech Longevity Hackathon in 2025. i joined the club as vp after that and helped run the 2026 one. code isn't public yet."],
      stack: ["python", "streamlit", "llama 3"],
    },
    {
      id: "covidflow", kind: "build", group: "hackathons",
      title: "covidflow", year: "2020", status: "hackathon",
      oneLiner: "a voice-guided covid-19 risk check for older and visually impaired people, spoken in a voice you give it a sample of.",
      stack: ["python", "tensorflow", "javascript"],
      links: [{ label: "devpost", url: "https://devpost.com/software/covidflow" }],
    },
    {
      id: "metatune", kind: "build", group: "hackathons",
      title: "metatune", year: "2022", status: "hackathon", role: "team member",
      oneLiner: "a playlist builder where songs branch out like a mind map.",
      details: ["built with Cody Hergenroeder and Maya Cz. at TreeHacks 2022. the idea was Cody's, and i helped with ideation and planning. the same theme later turned into youtube music mapper and moodspace."],
      stack: ["python"],
      links: [{ label: "devpost", url: "https://devpost.com/software/probabalistic-playlists" }],
    },
    {
      id: "beacon-bloom", kind: "build", group: "toys",
      title: "beacon bloom", year: "2026", status: "playable",
      oneLiner: "a one-thumb phone game. sweep a lighthouse beam and steer boats away from the reef.",
      details: ["works offline as a web app, and there's an iOS wrapper. not public yet."],
      stack: ["javascript", "canvas"],
    },
    {
      id: "codex-pets", kind: "build", group: "toys",
      title: "codex pets", year: "2026", status: "done",
      oneLiner: "eight little pixel pets for the codex app, plus a script that turns any drawing or gif into one.",
      stack: ["python"],
    },
    {
      id: "toy-particle-life", kind: "build", group: "art",
      title: "particle life", year: "2026", status: "live",
      oneLiner: "colored particles attract and repel each other by random rules, and little lifeforms show up on their own.",
      details: ["built with Claude, following the particle life setup popularized by Tom Mohr and CodeParade. you can edit the force matrix or stir it with your mouse."],
      stack: ["javascript", "canvas"],
      links: [{ label: "open full screen", url: "toys/particle-life.html" }],
      embed: "toys/particle-life.html",
    },
    {
      id: "toy-boids", kind: "build", group: "art",
      title: "boids", year: "2026", status: "live",
      oneLiner: "a flock of birds that stays together from simple rules about spacing, heading and cohesion. drop in a predator and watch it scatter.",
      details: ["built with Claude, based on Craig Reynolds' boids model."],
      stack: ["javascript", "canvas"],
      links: [{ label: "open full screen", url: "toys/boids.html" }],
      embed: "toys/boids.html",
    },
    {
      id: "toy-agar-life", kind: "build", group: "art",
      title: "agar life", year: "2026", status: "live",
      oneLiner: "a tiny ecosystem where cells eat food, eat each other if they're smaller, and grow.",
      details: ["built with Claude. inspired by agar.io, tuned to run as a calm live wallpaper."],
      stack: ["javascript", "canvas"],
      links: [{ label: "open full screen", url: "toys/agar-life.html" }],
      embed: "toys/agar-life.html",
    },
    {
      id: "toy-flow-field", kind: "build", group: "art",
      title: "flow field", year: "2026", status: "live",
      oneLiner: "thousands of particles drift along an invisible current and leave silky trails. the field at the top of this page is a cousin of it.",
      details: ["built with Claude. i run it as my desktop wallpaper."],
      stack: ["javascript", "canvas"],
      links: [{ label: "open full screen", url: "toys/flow-field.html" }],
      embed: "toys/flow-field.html",
    },
    {
      id: "toy-lenia", kind: "build", group: "art",
      title: "lenia", year: "2026", status: "live",
      oneLiner: "a smooth version of the game of life where blob creatures glide around.",
      details: ["Lenia is Bert Chan's model. this browser version was built with Claude."],
      stack: ["javascript", "canvas"],
      links: [{ label: "open full screen", url: "toys/lenia.html" }],
      embed: "toys/lenia.html",
    },

    // ---------- companies ----------
    {
      id: "coherence-health", kind: "company", featured: true,
      title: "coherence health", role: "clinical ai lead", year: "2026–", status: "active",
      oneLiner: "an AI functional-medicine doctor, starting with autoimmune conditions like hashimoto's. i'm building the product: turning the hour-long NP intake into a five-minute async review, then automating follow-ups, meds and labs.",
      details: [
        "backed by a16z speedrun. first patients started late september 2026, and we're kicking off the raise now.",
      ],
      links: [
        { label: "coherencehealth.io", url: "https://coherencehealth.io" },
      ],
    },
    {
      id: "cosmora", kind: "company",
      title: "cosmora", role: "cso", year: "2026–", status: "research stage",
      oneLiner: "retinal AI. software that reads one photo of the back of the eye for disease risk, plus a low-cost handheld camera to take that photo.",
      details: [
        "what's live is a research demo: one model that labels a fundus photo as diabetic retinopathy, hypertension, lung cancer signature, or normal, with a heatmap of what it looked at. it has no clinical validation or regulatory clearance, and the demo says so.",
        "the handheld camera can image human retinas as a prototype and is still being worked on.",
      ],
      stack: ["pytorch", "opencv", "efficientnet"],
      links: [
        { label: "cosmorahealth.com", url: "https://www.cosmorahealth.com/" },
        { label: "research demo", url: "https://www.cosmorahealth.com/demo.html" },
        { label: "team", url: "https://www.cosmorahealth.com/team.html" },
      ],
      invite: "if you'd want to help field-test a cheap handheld fundus camera, or you know retinal imaging or optics, we'd like to talk.",
      inviteWho: "clinicians + optics people",
    },
    {
      id: "slop-labs", kind: "company",
      title: "slop labs", role: "team", year: "2026–", status: "early",
      oneLiner: "AI research on personality in language models. we're working on models where the experts in a mixture-of-experts are psychological archetypes, and we keep a catalog of the tells that make AI writing read as slop.",
      details: ["with [Cody Hergenroeder](https://codyh.xyz) and Piyush Jha. it sits right next to my research on emotion in language models and on AI-text detectors."],
      links: [
        { label: "sloplabs.tech", url: "https://sloplabs.tech" },
        { label: "manifesto", url: "https://sloplabs.tech/path.html" },
        { label: "the slop catalog", url: "https://sloplabs.tech/slop.html" },
      ],
    },
    {
      id: "t20-consulting", kind: "company",
      title: "t20 consulting", year: "2026–", status: "active",
      oneLiner: "admissions consulting for pre-meds and high schoolers headed toward medicine (plus pre-dental, pre-PA and pre-law), from picking a major through med school acceptance, with MCAT tutoring.",
      details: [
        "every student gets a small team of advisors, all from top-20 medical schools.",
        "i work on it with [Alexander Junxiang Chen](https://quincy.harvard.edu/people/alexander-junxiang-chen). referrals are always welcome, and so are med students, residents and doctors who'd like to advise.",
      ],
      links: [{ label: "t20consulting.com", url: "https://t20consulting.com/" }],
      invite: "know a pre-med or a high schooler who wants help getting into med school? send them my way, or have them reach out through t20consulting.com.",
      inviteWho: "pre-meds, high schoolers + anyone with a referral",
      inviteUrl: "mailto:wwang719@usc.edu?subject=t20%20consulting%20referral",
    },
    {
      id: "replicater-labs", kind: "company",
      title: "replicater labs", year: "2026", status: "in the works",
      oneLiner: "a research lab building physics-grounded AI models of biology, aimed at simulating how living systems actually work.",
      details: [
        "their research includes genome foundation models for microbes.",
        "i haven't officially joined yet. it's in the works.",
      ],
      links: [
        { label: "replicater.xyz", url: "https://replicater.xyz/" },
        { label: "research", url: "https://replicater.xyz/research/" },
      ],
    },
    {
      id: "nomix-health", kind: "company",
      title: "nomix health", role: "co-founder", year: "2025", status: "past",
      oneLiner: "a precision-health startup: whole-genome sequencing + lab work + AI, aimed at personal health and psych medication insights.",
      details: ["we worked on it in stealth from january to july 2025."],
    },

    // ---------- ideas ----------
    {
      id: "idea-simulated-patients", kind: "idea", status: "interested",
      title: "simulated patient populations",
      oneLiner: "if language models could simulate psychiatric patients that hold up psychometrically, you could pilot a new questionnaire or trial design without recruiting a new cohort every time. could be useful for training clinicians too.",
      why: "it's the applied version of my autism-questionnaire research. whether the simulation is valid is the whole question, and it isn't solved.",
      inviteWho: "psychometricians + clinician-educators",
    },
    {
      id: "idea-passive-mood-relapse", kind: "idea", status: "interested",
      title: "catch mood relapses without asking people to log",
      oneLiner: "mood apps lose data right when people get sick, because nobody logs when they're depressed or manic. use passive sleep, activity and phone signals instead, and get it to clinicians in a form they'd act on.",
      why: "published models can already flag some episodes from passive data. the part i care about is getting that into a clinic.",
      inviteWho: "mood-disorder psychiatrists + digital phenotyping researchers",
    },
    {
      id: "idea-psych-pgx", kind: "idea", status: "on ice",
      title: "less trial and error in psych meds",
      oneLiner: "people cycle through psychiatric meds for months. use genetics plus clinical features to predict who responds to what, and who gets the side effects.",
      why: "i did genomics in the Fire lab before med school, and psych prescribing still feels like guessing to me. it was also the core idea behind nomix health, my 2025 startup.",
      inviteWho: "pharmacogenomics researchers + clinicians with outcome data",
    },
    {
      id: "idea-crash-test-mental-health-bots", kind: "idea", status: "someday",
      title: "crash-test AI that talks to people in distress",
      oneLiner: "chatbots are already talking to people who are struggling. i want a way to run realistic simulated patients against a bot (missed escalation, going along with a delusion, boundary slips) and get back a safety report a hospital would actually trust.",
      why: "it grows out of crisis-counseling AI research i'm part of at Stanford, and i'm a co-author on HELM. if it ever became a company, i'd want to do it with the people i do that research with.",
      inviteWho: "an eval or infra engineer, plus clinicians with crisis-line or therapy experience",
    },
    {
      id: "idea-non-self-report-measure", kind: "idea", status: "long shot",
      title: "a psych measure that isn't self-report",
      oneLiner: "almost everything in psychiatry gets measured by asking people to describe their own mind. if we get good at reading emotional states inside models, some of those methods might carry over to people.",
      why: "this is the more speculative idea underneath my interpretability work. i don't have a product in mind for it, i just like the question.",
      inviteWho: "interpretability people + computational psychiatrists",
    },
    {
      id: "idea-music-memory-maps", kind: "idea", status: "prototyped",
      title: "music + memories as maps",
      oneLiner: "most music and photo apps show you a list or a timeline. i want to lay both out as a map you can move around in.",
      why: "i first ran into this on a TreeHacks 2022 team (metatune), then built youtube music mapper and moodspace myself. i still don't think i've found the version that feels right.",
      links: [
        { label: "moodspace", url: "https://github.com/willwangfr/moodspace" },
        { label: "youtube music mapper", url: "https://github.com/willwangfr/youtube-music-mapper" },
        { label: "metatune", url: "https://devpost.com/software/probabalistic-playlists" },
      ],
      inviteWho: "djs, music-information-retrieval people, designers",
    },
    {
      id: "idea-felixmind", kind: "idea", status: "idea",
      title: "spotting a weird cat syndrome from home video",
      oneLiner: "feline hyperesthesia shows up as tail-chasing, rippling skin and sudden bolting. use home video to catch episodes and track whether treatment is helping.",
    },

    // ---------- research ----------
    {
      id: "research-mechinterp-emotion", kind: "research", group: "current",
      title: "what emotion looks like inside small language models", year: "2026", status: "on hold",
      oneLiner: "recording activations from small open models to see whether emotion lives in specific units or gets spread around, and whether that holds once you control for emotion words.",
      details: ["with Matt Thomson and Ralph Adolphs at Caltech. it's on hold for now while i finish other papers."],
      stack: ["python", "pytorch", "qwen 2.5"],
      links: [
        { label: "thomson lab", url: "https://thomsonlab.caltech.edu/" },
        { label: "adolphs lab", url: "https://emotion.caltech.edu/" },
      ],
    },
    {
      id: "research-llm-psychometrics", kind: "research", group: "current",
      title: "can language models simulate autism on clinical questionnaires?", year: "2025–", status: "in progress",
      oneLiner: "giving models autism questionnaires (AQ-50, SRS-2) under different personas and checking whether the answers behave like a real instrument.",
      details: ["i presented a first-author poster on this with Ralph Adolphs at the APA 2026 Annual Meeting. no paper yet."],
      links: [{ label: "adolphs lab", url: "https://emotion.caltech.edu/" }],
    },
    {
      id: "research-metadetect", kind: "research", group: "current",
      title: "should you average AI-text detectors?", year: "2026", status: "under review",
      oneLiner: "i led a ten-person team testing whether combining AI-writing detectors beats using the best single one. mostly it doesn't, and it gets worse the more the detectors disagree.",
      details: ["first-author paper, under review at the JUDGe workshop at NeurIPS 2026. the code isn't public yet."],
    },
    {
      id: "research-physworld-students", kind: "research", group: "current",
      title: "small world models + physics, with a student team", year: "2026", status: "under review",
      oneLiner: "i supervised two student papers. one recovers a projectile's flight from a single camera using air drag, the other builds tiny world models that decode motion.",
      details: ["both are under review at the PhysWorldAI workshop at NeurIPS 2026, with me as senior author."],
    },
    {
      id: "research-embodied-valence", kind: "research", group: "current",
      title: "good vs bad, heavy vs light, inside the model", year: "2024–", status: "in progress",
      oneLiner: "checking whether human axes of emotion, including embodied metaphors like heavy and light, show up in a model's internal activations.",
    },
    {
      id: "research-valence-arousal", kind: "research", group: "current",
      title: "how emotional language is laid out in LLMs", year: "2026", status: "in progress",
      oneLiner: "does the emotion language models produce line up with the human pleasant/unpleasant and calm/excited map? started as a class project and grew.",
    },
    {
      id: "research-clinical-extraction", kind: "research", group: "clinical",
      title: "pulling usable data out of messy health records", year: "2022–2024", status: "published",
      oneLiner: "clinical NLP at Stanford: letting models skip the cases they're unsure about, so the data they do extract can be trusted.",
      details: ["this led to papers in JAMIA and JCO Clinical Cancer Informatics, listed below."],
    },
    {
      id: "research-wearipedia", kind: "research", group: "clinical",
      title: "wearipedia", year: "2022–2025", status: "live",
      oneLiner: "an open resource for using wearables in clinical trials. i'm a co-author on the project paper.",
      links: [
        { label: "wearipedia.com", url: "https://wearipedia.com" },
        { label: "github", url: "https://github.com/Stanford-Health/wearipedia" },
      ],
    },
    {
      id: "research-cough-ai", kind: "research", group: "clinical",
      title: "covid screening from cough sounds", year: "2021", status: "done",
      oneLiner: "worked on what it'd take to actually deploy cough-based covid screening, with Virufy. i was corresponding author on a short piece about it in the Journal of Voice.",
    },
    {
      id: "research-dna-termini", kind: "research", group: "earlier",
      title: "finding the ends of DNA in sequencing data", year: "2019–2024", status: "done",
      oneLiner: "built a way to find where linear DNA pieces end in sequencing data. applied to HIV, it supports the idea that the second strand starts copying at several sites.",
      details: ["Andrew Fire's lab at Stanford, as a Bio-X fellow. it became my honors thesis and a bioRxiv preprint."],
    },
    {
      id: "research-crfm", kind: "research", group: "earlier",
      title: "foundation models at stanford crfm", year: "2021–2023", status: "done",
      oneLiner: "research assistant on healthcare uses of foundation models. co-author on the foundation models report and HELM.",
      links: [{ label: "helm", url: "https://crfm.stanford.edu/helm/" }],
    },
    {
      id: "research-sidewinder-barcodes", kind: "research", group: "earlier",
      title: "faster DNA barcode design", year: "2025", status: "done",
      oneLiner: "rewrote the barcode generator for a parallel DNA assembly method so it runs about 10 to 100x faster and gives better barcodes.",
      details: ["Kaihang Wang's lab at Caltech, fall 2025."],
    },
    {
      id: "research-viral-metagenomics", kind: "research", group: "earlier",
      title: "sequencing viral DNA", year: "2025", status: "done",
      oneLiner: "compared metagenomic sequencing technologies for reading viral DNA, in Rustem Ismagilov's lab at Caltech.",
    },
    {
      id: "research-seqfish", kind: "research", group: "earlier",
      title: "worm neurons + seqFISH", year: "2024", status: "done",
      oneLiner: "a C. elegans aging screen, plus computer vision to annotate seqFISH images of neurons, in Paul Sternberg's lab at Caltech.",
    },
    {
      id: "research-nanomaterials", kind: "research", group: "earlier",
      title: "glowing nanomaterials for LEDs", year: "2017–2019", status: "done",
      oneLiner: "high school materials research on europium-doped nanomaterials. two papers came out of it, and a minor planet got named after me for the project.",
    },

    // ---------- events ----------
    {
      id: "event-nucleate-activator", kind: "event", recurring: "yearly",
      title: "nucleate la activator", when: "2025–26 cycle", place: "los angeles",
      oneLiner: "a program that helps LA scientists turn biotech ideas into companies. i ran mentor matching and paired outside experts with teams for the technical risk workshop.",
      details: ["each cycle goes from team formation in the fall through workshops on technical risk, market risk and operating in LA, then practice pitches and demo day in the spring."],
      links: [{ label: "nucleate la", url: "https://nucleate.org/chapters/los-angeles/" }],
      rsvp: "https://gateway.nucleate.org/main", rsvpLabel: "apply",
      invite: "LA postdocs and PhD, MD, MBA, JD or MS trainees with a biotech or medtech idea. applications for the 2026–27 cycle are open until oct 20, 2026.",
      inviteWho: "LA scientists with a startup idea",
      inviteUrl: "https://gateway.nucleate.org/main",
    },
    {
      id: "event-longevity-club", kind: "event", recurring: "ongoing",
      title: "caltech longevity club", place: "caltech",
      oneLiner: "talks, case discussions and trips about aging + healthspan science. i'm vp of the club.",
      role: "vice president",
      links: [{ label: "caltechlongevity.com", url: "https://caltechlongevity.com/" }],
      rsvp: "https://luma.com/caltechlongevityclub", rsvpLabel: "calendar",
    },
    {
      id: "event-nucleate-social-2026", kind: "event", date: "2026-10-14",
      title: "nucleate la five-year social", when: "wed, 6–9 pm", place: "los angeles · la tech week",
      oneLiner: "nucleate la's five-year celebration and networking night for LA biotech, during LA Tech Week.",
      rsvp: "https://partiful.com/e/UxdvVnEx4Kpjjd2kpHvY",
      invite: "founders, investors, researchers and students who are into LA biotech. rsvp on partiful.",
      inviteWho: "anyone into LA biotech",
      inviteUrl: "https://partiful.com/e/UxdvVnEx4Kpjjd2kpHvY",
    },
    {
      id: "event-longevity-hackathon-2026", kind: "event", date: "2026-05-23",
      title: "caltech longevity hackathon 2026", when: "may 23–24", place: "caltech",
      oneLiner: "the second caltech longevity hackathon. i won the first one in 2025, then helped organize this one as club vp.",
      role: "organizer",
      links: [{ label: "club events", url: "https://luma.com/caltechlongevityclub" }],
    },
    {
      id: "event-peds220", kind: "event", past: true, year: "2020–2021",
      title: "peds 220 covid-19 speaker series", place: "stanford",
      oneLiner: "i was a TA for Stanford's COVID-19 elective and lined up the speakers. we wrote up how the course was built afterward.",
    },
  ],

  droppedIdeas: [
    { title: "psych trial matching", why: "looked into it for a pitch competition. it was already crowded." },
    { title: "dog behavior wearables", why: "also crowded. that search is what pushed me toward the cat idea." },
  ],

  calls: [
    {
      kind: "research", who: "high school, undergrad + grad students who want a research project",
      what: "i mentor a few scoped student projects on LLM psychometrics + AI evaluation. python helps. email me what you want to learn and how much time you actually have.",
    },
    {
      kind: "idea", who: "people building one of my startup ideas", url: "#ideas",
      what: "i'm not building these myself right now. if you are, i'd love to talk, and i'm happy to help or intro you to people.",
    },
    {
      kind: "build", who: "hackathon teammates",
      what: "i do a lot of hackathons, usually AI + health. if you're going to one around LA, say hi.",
    },
    {
      kind: "company", who: "med students, residents + doctors who want paid advising work",
      what: "t20 consulting pays advisors from top-20 medical schools to help pre-meds with their path and applications. if that's you, or you know someone who'd be good at it, reach out.",
      url: "mailto:wwang719@usc.edu?subject=t20%20consulting%20advisor",
    },
  ],

  publications: [
    { year: "2026", title: "Effect of region-of-interest prompting on Gemini 2.5 Pro in MRI classification of anterior cruciate ligament injury", authors: "Chetla N, Patel S, Rodriguez L, Kaur H, Bouras A, Wang W, Gupta A, Rice S", venue: "Cureus", url: "https://doi.org/10.7759/cureus.102850" },
    { year: "2025", title: "The Wearipedia Project: a free and open-source resource for understanding and using wearables in decentralized clinical trials", authors: "Johansen AR, …, Wang W, …", venue: "medRxiv preprint", url: "https://doi.org/10.1101/2025.05.12.25327465" },
    { year: "2024", title: "Extraction of unstructured electronic health records to evaluate glioblastoma treatment patterns", authors: "Swaminathan A, …, Wang W, …", venue: "JCO Clinical Cancer Informatics", url: "https://doi.org/10.1200/CCI.23.00091" },
    { year: "2024", title: "Selective prediction for extracting unstructured clinical data", authors: "Swaminathan A, Lopez I, Wang W, et al.", venue: "Journal of the American Medical Informatics Association", url: "https://doi.org/10.1093/jamia/ocad182" },
    { year: "2023", title: "Xanthogranulomatous inflammation requiring small bowel anastomosis revision: a case report", authors: "Wang W, Korah M, Bessoff K, Shen J, Forrester JD", venue: "World Journal of Gastrointestinal Surgery", url: "https://doi.org/10.4240/wjgs.v15.i3.488" },
    { year: "2023", title: "Combined direct/indirect detection allows identification of DNA termini in diverse sequencing datasets and supports a multiple-initiation-site model for HIV plus-strand synthesis", authors: "Wang W, Artiles KL, Machida S, Benkirane M, Jain N, Fire AZ", venue: "bioRxiv preprint", url: "https://doi.org/10.1101/2023.06.12.544617" },
    { year: "2023", title: "Identification of DNA termini in sequencing data through combined analysis of end capture and local strand bias", authors: "Wang W, Fire AZ", venue: "Stanford honors thesis", url: "https://purl.stanford.edu/xf213fn4785" },
    { year: "2023", title: "Holistic evaluation of language models", authors: "Liang P, …, Wang W, …", venue: "Transactions on Machine Learning Research", url: "https://arxiv.org/abs/2211.09110" },
    { year: "2022", title: "Applying Kern's six steps to the development of a community-engaged, just-in-time, interdisciplinary COVID-19 curriculum", authors: "Scala JJ, Braun NJ, Shamardani K, Rashes ER, Wang W, Mediratta RP", venue: "Journal of Medical Education and Curricular Development", url: "https://doi.org/10.1177/23821205221096370" },
    { year: "2022", title: "Extraction and validation of patient housing and food insecurity status in a large electronic health records database using selective prediction and active learning", authors: "Swaminathan A, …, Wang W, …", venue: "medRxiv preprint", url: "https://doi.org/10.1101/2022.12.06.22283140" },
    { year: "2021", title: "On the opportunities and risks of foundation models", authors: "Bommasani R, …, Wang W, …", venue: "arXiv", url: "https://arxiv.org/abs/2108.07258" },
    { year: "2021", title: "Challenges and opportunities in deploying COVID-19 cough AI systems", authors: "Khanzada A, Hegde S, Sreeram S, Bower G, Wang W*, Mediratta RP, Meister KD, Rameau A", venue: "Journal of Voice", note: "* corresponding author", url: "https://doi.org/10.1016/j.jvoice.2021.08.009" },
    { year: "2018", title: "Red photoluminescent Eu3+-doped Y2O3 nanospheres for LED-phosphor applications: synthesis and characterization", authors: "Wang W, Zhu P", venue: "Optics Express", url: "https://doi.org/10.1364/OE.26.034820" },
    { year: "2018", title: "Optical properties of Eu3+-doped Y2O3 nanotubes and nanosheets synthesized by hydrothermal method", authors: "Zhu P, Wang W, Zhu H, Vargas P, Bont A", venue: "IEEE Photonics Journal", url: "https://doi.org/10.1109/JPHOT.2018.2797950" },
  ],

  // Submitted, under review or in revision. Listed plainly without links; don't push these harder than a line on the page.
  inReview: [
    { year: "2026", title: "Unweighted ensembles of AI-text detectors underperform their strongest member in proportion to disagreement", authors: "Wang W, Huang D, Li K, Sansoni B, Madullapalli S, Feng P, Saraf S, Rajeev A, Lee DS, Hergenroeder C", venue: "JUDGe workshop, NeurIPS 2026", note: "under review" },
    { year: "2026", title: "Monocular ballistic state estimation from air drag: identifiability and ground-scale experimental validation", authors: "Huang D, Madullapalli S, Pendyala I, Chen O, Wang W", venue: "PhysWorldAI workshop, NeurIPS 2026", note: "under review" },
    { year: "2026", title: "Context adaptation and kinematic decoders for small world models", authors: "Li K, Madullapalli S, Huang D, Wang O, Sansoni N, Wang W", venue: "PhysWorldAI workshop, NeurIPS 2026", note: "under review" },
    { year: "2026", title: "OpenClaw and the automation of medical artificial intelligence: autonomy, security, and regulation", authors: "Lee DS†, Wang W†, Kho S", venue: "JMIR AI", note: "† equal contribution · in revision" },
    { year: "2026", title: "Opportunities and risks in real-time AI for cardiac surgery", authors: "Lee DS, Wang W, Vitale N", venue: "Annals of Thoracic Surgery", note: "under review" },
    { year: "2026", title: "Happy productive worker: rethinking well-being and task performance", authors: "Lee DS, Siddiqui M, Oh A, Anderson PG, El Youssef YW, Chen AJ, Vyas A, Reddy A, Wang W", venue: "Frontiers in Psychology", note: "in revision" },
    { year: "2026", title: "Generalizability, discrimination, and interpretability of a machine learning-based Fontan failure risk calculator", authors: "Lee DS, …, Wang W", venue: "Journal of Thoracic and Cardiovascular Surgery", note: "letter · submitted" },
    { year: "2026", title: "Pre-medical undergraduate and preclinical medical student early educational experiences in adult and congenital cardiothoracic surgery", authors: "Lee DS, Wang W, Kho S, Anderson PG, Le VH", note: "submitted" },
  ],

  talks: [
    { year: "2026", title: "Evaluating AI performance on clinical questionnaires: can large language models simulate autism?", authors: "Wang W, Adolphs R", venue: "APA Annual Meeting, poster" },
    { year: "2025", title: "Exploring neuronal gene expression variability in C. elegans using seqFISH", authors: "Wang W, Markarian N, Aguirre D, Sternberg PW", venue: "AAP/ASCI/APSA Joint Meeting, poster" },
    { year: "2023", title: "Identification of DNA termini in sequencing data through combined analysis of end capture and local strand bias", venue: "Stanford Biology Honors Symposium, talk" },
    { year: "2023", title: "Identification of linear extrachromosomal DNA termini in HIV, mitochondria, and other next-generation sequencing datasets", authors: "Wang W, Jain N, Artiles K, Fire AZ", venue: "Bay Area RNA Club, poster" },
    { year: "2020", title: "Developing a strand bias assay to detect extrachromosomal DNA", venue: "Bio-X Research Symposium, talk" },
  ],

  about: {
    paragraphs: [
      "i'm an MD student at [USC Keck](https://keck.usc.edu/). before that i did a BS in biology and an MS in bioengineering at Stanford, and spent most of that time in Andrew Fire's lab figuring out how to find the ends of DNA molecules in sequencing data.",
      "now my research is mostly about emotion in language models: what's going on inside them, and whether they can stand in for people on psych questionnaires. that's with [Ralph Adolphs](https://emotion.caltech.edu/) at Caltech. i also like building tools for myself and then finding out if anyone else wants them.",
      "on the startup side i'm clinical AI lead at [Coherence Health](https://coherencehealth.io), building an AI functional-medicine doctor, and CSO at [Cosmora](https://www.cosmorahealth.com/) (before that i co-founded a precision-health startup in 2025), and i've spent a lot of the last two years around early biotech founders through [Nucleate LA](https://nucleate.org/chapters/los-angeles/). outside all that i dj and lift, and i'll show up to pretty much any hackathon.",
    ],
    education: [
      { title: "Keck School of Medicine of USC", sub: "MD student" },
      { title: "Stanford University", sub: "MS bioengineering · 2020–2023" },
      { title: "Stanford University", sub: "BS biology with honors, computational biology · 2019–2023" },
    ],
    community: [
      { title: "Nucleate LA", sub: "activator lead" },
      { title: "Caltech Longevity Club", sub: "vice president" },
      { title: "APAMSA national committee", sub: "health affairs, community outreach · 2024–2026" },
      { title: "Stanford Biomedical Engineering Society", sub: "co-president" },
      { title: "Students for Vaccine Awareness", sub: "co-founder" },
    ],
    honors: [
      { title: "1st place, Caltech Longevity Hackathon", sub: "2025, for longevity stack checker" },
      { title: "TreeHacks 2020 Voice Assistance Grand Prize", sub: "for eduvoicer" },
      { title: "Firestone Medal for Excellence in Undergraduate Research", sub: "stanford" },
      { title: "Stanford Bio-X Fellow" },
      { title: "Exceptional Master's Student Award", sub: "stanford dean's graduate student advisory council" },
      { title: "Regeneron Science Talent Search top 40 finalist", sub: "2019" },
      { title: "Davidson Fellow" },
      { title: "Google Science Fair regional finalist, the Americas", sub: "2019" },
      { title: "Minor planet 11418 Williamwang", sub: "named for my 2019 STS project" },
    ],
    interests: ["djing", "lifting", "cooking on a budget", "longevity science", "computational psychiatry", "machine minds", "biotech startups", "generative art"],
  },
};
