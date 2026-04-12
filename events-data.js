const eventsData = [
    {
        id: 1,
        title: 'The Birth Collective Alexandria - Quarterly Gathering',
        date: '2026-04-23',
        dayOfWeek: 'Thursday',
        time: '6:00 PM - 8:00 PM',
        location: '303 22nd Ave W #103, Alexandria, MN',
        description: 'Join us for our quarterly community gathering! Connect with expectant parents, new families, and birth professionals. Share birth stories, learn from one another, and build your village. Light refreshments provided.',
        organizer: 'The Birth Collective',
        type: 'birth-collective',
        category: 'community event',
        details: [
            'Free to attend',
            'Open to parents and birth workers',
            'Tea, coffee, and light refreshments'
        ],
        contact: null,
        facebook: 'https://www.facebook.com/events/1451454860102555?acontext=%7B%22event_action_history%22%3A[%7B%22surface%22%3A%22group%22%7D]%7D',
        pinned: true
    },
    {
        id: 2,
        title: 'Alexandria Area Community Baby Shower',
        date: '2026-04-22',
        dayOfWeek: 'Wednesday',
        time: '4:00 PM - 6:00 PM',
        location: 'Early Education Center, S McKay Avenue, Alexandria, MN',
        description: 'Celebrate new babies and growing families at this community baby shower! A wonderful opportunity to connect with other expecting and new parents, enjoy refreshments, and find resources for your birth and postpartum journey.',
        organizer: 'Alexandria Community Education & Early Education',
        type: 'community',
        category: 'community event',
        details: [
            'Free to attend',
            'All families welcome',
            'Games and activities',
            'Door prizes and giveaways'
        ],
        contact: null,
        pinned: false
    },
    {
        id: 3,
        title: 'Childbirth Education Class - Birth & Beyond',
        recurrence: 'birth-beyond',
        time: '6:00 PM - 8:00 PM',
        location: 'Studio She, 303 22nd Ave W #103, Alexandria, MN',
        description: 'A holistic childbirth education class to empower you to thrive through birth & beyond!',
        hostedBy: 'The Wellness PT and Empowered Midwifery',
        category: 'class',
        type: 'education',
        details: [
            'For TTC or expecting mothers AND their birth partners',
            'Learn evidence-based birth practices',
            'Prepare for birth and postpartum',
            'Practice hands-on labor support/comfort techniques',
            'Interactive and supportive environment'
        ],
        contact: null,
        signupUrl: 'https://www.thewellnessptdoc.com/birthworkshop',
        infoUrl: 'https://www.thewellnessptdoc.com/programs',
        pinned: false
    },
    {
        id: 4,
        title: 'Breastfeeding Classes - Horizon Public Health',
        date: '2026-04-29',
        dayOfWeek: 'Wednesday',
        time: '2:30 PM - 4:00 PM',
        location: '724 Elm Street Clinic, Alexandria, MN',
        description: 'Breastfeeding classes for mothers and birth partners. Recommended during third trimester.',
        organizer: 'Horizon Public Health',
        category: 'class',
        type: 'breastfeeding',
        details: [
            'Cost: $25 per couple',
            'For mothers and birth partners (third trimester recommended)',
            'Topics: Benefits of Breastfeeding, How Breastfeeding Works, How to Breastfeed, When to Feed Your Baby, Getting Enough Milk, Breast Care, and Breastfeeding Lifestyle',
            'Enter through Clinic entrance'
        ],
        additionalDates: 'Also offered July 29 and October 28',
        contact: null,
        signupUrl: 'https://horizonphmn.gov/payments/breastfeeding-class-registration/',
        pinned: false
    },
    {
        id: 5,
        title: 'Alomere Prenatal Class',
        date: '2026-05-13',
        dayOfWeek: 'Wednesday',
        time: '6:00 PM - 8:00 PM',
        location: 'Alomere Hospital, 111 17th Ave East, Alexandria, MN',
        description: 'An essential prenatal class designed to support you during this pivotal phase in your family\'s journey. Learn about labor and delivery, what to expect at the hospital, and get a tour of the state-of-the-art labor and delivery department.',
        organizer: 'Alomere Health & Alexandria Public Schools Community Education',
        category: 'class',
        type: 'prenatal',
        details: [
            'Two-week class: May 13 and 20',
            'Ask questions about labor and delivery',
            'What to expect at the hospital',
            'Tour of labor and delivery department',
            'No cost to attend',
            'Bring a guest (spouse, significant other, or friend/family)'
        ],
        contact: null,
        signupUrl: 'https://alexschools.arux.app/course/ecfe/10071/spring-2026/alomere-prenatal-class',
        pinned: false
    },
    {
        id: 6,
        title: 'Infertility Support Group',
        recurrence: 'infertility-support',
        time: '5:00 PM',
        location: 'The Loft at Depot Smokehouse and Tavern, 104 Broadway Street, Alexandria, MN',
        description: 'A monthly meeting for women to find community and comfort while navigating infertility.',
        type: 'support-group',
        details: [
            'Relaxed environment to meet others going through similar situations',
            'Informational presentations from individuals and local professionals',
            'No pressure to share your story',
            'Meets: Every first Monday of the month at 5:00 PM',
            'RSVP via phone/text to Saige Haecherl at 320-760-9914 (RSVP appreciated but not required - please still come if you forget!)'
        ],
        contact: null,
        facebook: 'https://www.facebook.com/groups/infertilitysupportgroupalexandriamn',
        featured: false
    },
    {
        id: 7,
        title: 'ECFE Coffee Connections',
        date: '2026-06-01',
        dayOfWeek: null,
        time: 'Find dates on website',
        location: 'Alexandria Public Schools',
        description: 'A parent conversation group for parents of preschoolers to connect, ask questions, and celebrate the joys and challenges of raising a young child.',
        type: 'support-group',
        details: [
            'For parents of 3-5 year olds',
            'Coffee and discussion',
            'Opportunity to ask questions and get support',
            'Sibling care available on a limited basis',
            'See website for current dates and registration'
        ],
        infoUrl: 'https://alexschools.arux.app/course/ecfe/10072/spring-2026/coffee-connection',
        featured: false
    },
    {
        id: 8,
        title: 'The Mama Co.',
        date: '2026-04-14',
        dayOfWeek: 'Tuesday',
        time: '7:00 PM - 9:00 PM',
        location: 'Vie Church, Alexandria, MN',
        description: 'A monthly event for all moms of kids 0-18 to connect with fellow moms and enjoy encouraging content.',
        type: 'community',
        details: [
            'For all moms of kids ages 0-18',
            'Monthly gathering with encouraging content',
            'Time to connect with fellow moms',
            'Community and support'
        ],
        featured: false
    },
    {
        id: 9,
        title: 'The Milk Club',
        recurrence: 'milk-club',
        time: '12:00 PM - 2:00 PM',
        location: 'Empowered Midwifery clinic, 621 Hawthorne St., Alexandria, MN',
        description: 'Meet other postpartum moms and babies! A supportive space for breastfeeding and pumping support, weight checks, and connection.',
        type: 'support-group',
        details: [
            'Meets: Every 2nd and 4th Thursday, 12:00 PM - 2:00 PM',
            'Open house style',
            'No cost',
            'For moms with babies under 12 months',
            'Breastfeeding and pumping support',
            'Weight checks and connection',
            'Led by Jamie Shelley, CNM, IBCLC'
        ],
        facebook: 'https://www.facebook.com/events/1300583421170674/1508241993738148?acontext=%7B%22event_action_history%22%3A[%7B%22surface%22%3A%22home%22%7D%2C%7B%22mechanism%22%3A%22search_results%22%2C%22surface%22%3A%22search%22%7D]%2C%22ref_notif_type%22%3Anull%7D',
        featured: false
    }
];
