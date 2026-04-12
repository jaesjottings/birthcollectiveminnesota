// Expand recurring events to multiple dates
function expandRecurringEvents(events) {
    const expanded = [];
    const today = new Date();
    const twoMonthsFromNow = new Date(today.getFullYear(), today.getMonth() + 2, today.getDate());
    
    events.forEach(event => {
        if (!event.recurrence) {
            expanded.push(event);
            return;
        }
        
        // Handle The Milk Club - 2nd and 4th Thursday of each month
        if (event.recurrence === 'milk-club') {
            let currentDate = new Date(2026, 3, 1); // Start from April 2026
            while (currentDate < twoMonthsFromNow) {
                const secondThursday = getNthWeekday(currentDate.getFullYear(), currentDate.getMonth(), 2, 4); // 2nd Thursday (4 = Thursday)
                const fourthThursday = getNthWeekday(currentDate.getFullYear(), currentDate.getMonth(), 4, 4); // 4th Thursday
                
                if (secondThursday >= today) {
                    expanded.push({
                        ...event,
                        date: formatDate(secondThursday),
                        dayOfWeek: 'Thursday'
                    });
                }
                if (fourthThursday >= today) {
                    expanded.push({
                        ...event,
                        date: formatDate(fourthThursday),
                        dayOfWeek: 'Thursday'
                    });
                }
                
                currentDate.setMonth(currentDate.getMonth() + 1);
            }
        }
        
        // Handle Birth & Beyond - Every other 1st Thursday (June, August, October, etc.)
        if (event.recurrence === 'birth-beyond') {
            const months = [5, 7, 9, 11]; // June, August, October, December (0-indexed)
            months.forEach(month => {
                const firstThursday = getNthWeekday(2026, month, 1, 4); // 1st Thursday
                if (firstThursday >= today) {
                    expanded.push({
                        ...event,
                        date: formatDate(firstThursday),
                        dayOfWeek: 'Thursday'
                    });
                }
            });
        }
        
        // Handle Infertility Support Group - 1st Monday of each month
        if (event.recurrence === 'infertility-support') {
            let currentDate = new Date(2026, 3, 1); // Start from April 2026
            while (currentDate < twoMonthsFromNow) {
                const firstMonday = getNthWeekday(currentDate.getFullYear(), currentDate.getMonth(), 1, 1); // 1 = Monday
                
                if (firstMonday >= today) {
                    expanded.push({
                        ...event,
                        date: formatDate(firstMonday),
                        dayOfWeek: 'Monday'
                    });
                }
                
                currentDate.setMonth(currentDate.getMonth() + 1);
            }
        }
    });
    
    return expanded;
}

// Helper function to get nth weekday of a month (0=Sunday, 1=Monday, etc.)
function getNthWeekday(year, month, occurrence, dayOfWeek) {
    const date = new Date(year, month, 1);
    let count = 0;
    
    while (count < occurrence) {
        if (date.getDay() === dayOfWeek) {
            count++;
            if (count === occurrence) break;
        }
        date.setDate(date.getDate() + 1);
    }
    
    return date;
}

// Helper function to format date as YYYY-MM-DD
function formatDate(date) {
    return date.toISOString().split('T')[0];
}

// Render Events
let eventFilter = 'all';

function renderEvents() {
    const container = document.getElementById('upcoming-events');
    if (!container) return; // Safety check
    
    // Expand recurring events
    const allEvents = expandRecurringEvents(eventsData);
    
    // Filter to only show events within 2 months
    const today = new Date();
    const twoMonthsFromNow = new Date(today.getFullYear(), today.getMonth() + 2, today.getDate());
    const futureEvents = allEvents.filter(e => {
        const eventDate = new Date(e.date + 'T00:00:00Z');
        return eventDate >= today && eventDate <= twoMonthsFromNow;
    });
    
    // Separate pinned and regular events
    const pinnedEvents = futureEvents.filter(e => e.pinned);
    const regularEvents = futureEvents.filter(e => !e.pinned);
    
    // Filter regular events by category if needed
    let filtered = regularEvents;
    if (eventFilter !== 'all') {
        filtered = regularEvents.filter(e => e.category === eventFilter);
    }
    
    // Sort both by date
    const sortedPinned = pinnedEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
    const sortedRegular = filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Combine: pinned first, then regular
    const displayEvents = [...sortedPinned, ...sortedRegular];
    
    container.innerHTML = displayEvents.map((event, index) => {
        // Parse date in UTC to avoid timezone offset issues
        const [year, month, day] = event.date.split('-');
        const eventDate = new Date(Date.UTC(year, month - 1, day));
        const dateDay = eventDate.getUTCDate();
        const dateMonth = eventDate.toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' }).toUpperCase();
        
        const isPinned = index < sortedPinned.length;
        
        return `
            <div class="event-card ${isPinned ? 'pinned-event' : ''}">
                ${isPinned ? '<div class="pinned-badge">📌 Featured</div>' : ''}
                ${event.dayOfWeek ? `
                    <div class="event-date">
                        <div class="event-date-day">${dateDay}</div>
                        <div class="event-date-month">${dateMonth}</div>
                        <div class="event-date-dow">${event.dayOfWeek}</div>
                    </div>
                ` : ''}
                <div class="event-content">
                    ${event.type === 'birth-collective' ? '<div class="event-badge birth-collective">Birth Collective Alexandria</div>' : ''}
                    <h3 class="event-title">${event.title}</h3>
                    <div class="event-time">${event.time}</div>
                    <div class="event-location">
                        <span>${event.location}</span>
                    </div>
                    <p class="event-description">${event.description}</p>
                    
                    ${event.details && event.details.length > 0 ? `
                        <div class="event-organizer">
                            <strong>What to Expect:</strong>
                            <ul style="list-style: none; padding-left: 0;">
                                ${event.details.map(detail => `<li style="padding: 0.3rem 0;">✓ ${detail}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                    
                    ${event.additionalDates ? `
                        <div class="event-organizer">
                            <strong>Additional Dates:</strong>
                            ${event.additionalDates}
                        </div>
                    ` : ''}
                    
                    ${event.hostedBy ? `
                        <div class="event-organizer">
                            <strong>Hosted/taught by:</strong>
                            ${event.hostedBy}
                        </div>
                    ` : event.caughtBy ? `
                        <div class="event-organizer">
                            <strong>Co-taught by:</strong>
                            ${event.caughtBy}
                        </div>
                    ` : ''}
                    
                    ${event.organizer ? `
                        <div class="event-organizer">
                            <strong>Organized by:</strong>
                            ${event.organizer}
                        </div>
                    ` : ''}
                    
                    <div class="event-actions">
                        ${event.signupUrl ? `
                            <a href="${event.signupUrl}" target="_blank" class="event-action-btn primary">
                                Sign Up
                            </a>
                        ` : ''}
                        ${event.infoUrl ? `
                            <a href="${event.infoUrl}" target="_blank" class="event-action-btn">
                                More Info
                            </a>
                        ` : ''}
                        ${event.type === 'birth-collective' && event.facebook ? `
                            <a href="${event.facebook}" target="_blank" class="event-action-btn primary">
                                🎉 RSVP on Facebook
                            </a>
                        ` : event.type === 'support-group' && event.contact ? `
                            <a href="tel:${event.contact}" class="event-action-btn primary">
                                📞 RSVP via Text/Call
                            </a>
                        ` : event.contact && event.contact.includes('@') ? `
                            <a href="mailto:${event.contact}" class="event-action-btn primary">
                                💬 Get Info
                            </a>
                        ` : ''}
                    </div>
                    
                    ${event.notes ? `
                        <div class="event-organizer" style="margin-top: 1rem; padding: 1rem; background: var(--light-bg); border-radius: 6px;">
                            <strong>Note:</strong> ${event.notes}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');
}

function filterEvents(category) {
    eventFilter = category;
    renderEvents();
    
    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-filter="${category}"]`).classList.add('active');
}

// Birth Workers Data (placeholder with Jamie)

// Birth Workers Filter
let workerFilter = 'all';

function filterWorkers(category) {
    workerFilter = category;
    renderWorkers();
}

// Render Birth Workers
function renderWorkers() {
    const container = document.getElementById('birth-workers-directory');
    if (!container) return; // Safety check
    
    let displayWorkers = birthWorkers;
    if (workerFilter !== 'all') {
        displayWorkers = birthWorkers.filter(worker => worker.categories && worker.categories.includes(workerFilter));
    }
    
    container.innerHTML = displayWorkers.map(worker => `
        <div class="worker-card">
            <div class="worker-header">
                <h3>${worker.name}</h3>
                ${worker.team ? `
                    <div style="margin-top: 0.5rem;">
                        ${worker.team.map(member => `<p style="margin: 0.25rem 0; font-size: 0.9rem; color: var(--text-light);">${member.name}, ${member.credentials.join(', ')}</p>`).join('')}
                    </div>
                ` : `<p class="credentials">${worker.credentials.join(', ')}</p>`}
            </div>
            <div class="worker-services">
                ${worker.services.map(service => `<span class="service-badge">${service}</span>`).join('')}
            </div>
            ${worker.specialties ? `
                <div class="worker-specialties" style="margin-top: 1rem; padding: 1rem; background: var(--light-bg); border-radius: 6px; font-size: 0.9rem;">
                    <p style="font-weight: 600; margin-bottom: 0.5rem;">Specialties:</p>
                    <ul style="margin: 0; padding-left: 1.5rem;">
                        ${worker.specialties.map(spec => `<li>${spec}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
            ${worker.organization && worker.address ? `<p style="margin-top: 1rem; font-size: 0.9rem; color: var(--text-light);">📍 ${worker.organization}, ${worker.address}</p>` : worker.address ? `<p style="margin-top: 1rem; font-size: 0.9rem; color: var(--text-light);">📍 ${worker.address}</p>` : ''}
            ${worker.serviceArea ? `<p style="margin-top: 0.5rem; font-size: 0.9rem; color: var(--text-light);">🌍 Service Area: ${worker.serviceArea}</p>` : ''}
            ${worker.location ? `<p style="margin-top: 0.5rem; font-size: 0.9rem; color: var(--text-light);">📍 ${worker.location}</p>` : ''}
            ${worker.serviceNotes ? `<p style="margin-top: 0.5rem; font-size: 0.9rem; color: var(--text-light); font-style: italic;">💡 ${worker.serviceNotes}</p>` : ''}
            <div class="worker-contact">
                ${worker.phone ? `<p>📱 <a href="tel:${worker.phone}">${worker.phone}</a></p>` : ''}
                ${worker.email ? `<p>📧 <a href="mailto:${worker.email}">${worker.email}</a></p>` : ''}
                ${worker.website ? `<p>🌐 <a href="https://${worker.website}" target="_blank">${worker.website}</a></p>` : ''}
                ${worker.facebook ? `<p>📘 <a href="${worker.facebook.startsWith('http') ? worker.facebook : 'https://www.facebook.com/' + worker.facebook.replace(/\s+/g, '')}" target="_blank">${worker.facebook.includes('facebook.com') ? 'Facebook' : worker.facebook}</a></p>` : ''}
                ${worker.instagram ? `<p>📸 <a href="${worker.instagram.startsWith('http') ? worker.instagram : 'https://instagram.com/' + worker.instagram.replace('@', '')}" target="_blank">${worker.instagram.includes('instagram.com') ? 'Instagram' : worker.instagram}</a></p>` : ''}
                ${worker.youtube ? `<p>🎥 <a href="https://youtube.com/${worker.youtube.replace('@', '')}" target="_blank">${worker.youtube}</a></p>` : ''}
            </div>
            ${worker.bio ? `<p style="margin-top: 1rem; font-size: 0.95rem; color: var(--text-light); font-style: italic;">${worker.bio}</p>` : ''}
        </div>
    `).join('');
}

// Roadmap data
// Pregnancy Roadmap Data
const trimesterData = [
    {
        number: 'First Trimester',
        weeks: '(Weeks 1-13)',
        title: 'Foundations & Discovery',
        color: '#D4A574',
        colorLight: 'rgba(212, 165, 116, 0.1)',
        sections: [
            {
                heading: 'Healthcare Decisions',
                items: [
                    'Consider interviewing a couple of providers to find the best fit for you and approach to pregnancy/birth',
                    'Choose your healthcare provider (OB, midwife, or combination care)',
                    'Learn about screening tests (such as NIPT) and what they mean for your pregnancy and family',
                    'Keep an ongoing list of questions for your provider (notebook or phone notes). Pregnancy brain is real!',
                    'Begin building your birth team and support network'
                ]
            },
            {
                heading: 'Physical & Emotional Preparation',
                items: [
                    'Learn about prenatal nutrition and supplements. Most moms benefit from more individualized advice than simply to take a prenatal vitamin!',
                    'Prioritize rest and nutrition. You\'re now supporting two lives! Pairing carbs + protein for meals/snacks every 2-3 hours helps to stabilize blood sugar.',
                    'Begin or continue movement and gentle exercise',
                    'Big emotions and mood swings are common during pregnancy. Find 1-2 people you can talk to about what you\'re experiencing. Therapists are helpful, too, especially if you have a history of anxiety, depression, trauma or past experiences that could impact birth. Some therapists specialize in "perinatal mental health."'
                ]
            },
            {
                heading: 'Practical Preparation',
                items: [
                    'Research childbirth education classes',
                    'Begin reading books or resources about pregnancy and birth',
                    'Share pregnancy news with your circle at your own pace',
                    'Schedule your first prenatal appointments'
                ]
            }
        ],
        story: ''
    },
    {
        number: 'Second Trimester',
        weeks: '(Weeks 14-27)',
        title: 'Growth & Learning',
        color: '#C4806B',
        colorLight: 'rgba(196, 128, 107, 0.1)',
        sections: [
            {
                heading: 'Healthcare Decisions',
                items: [
                    'Discuss anatomy scan results and any screenings',
                    'Begin conversations about birth preferences and birth plans',
                    'Explore pain relief options and comfort measures',
                    'Decide on testing (glucose screening, Group B Strep, etc.)',
                    'Plan how you will feed your baby (breastfeeding, pumping, donor milk, formula). If you\'re planning to breastfeed, pump, or just aren\'t sure—book a prenatal lactation consult for sometime during your third trimester.'
                ]
            },
            {
                heading: 'Physical & Emotional Preparation',
                items: [
                    'Enjoy increased energy and decreased morning sickness',
                    'Feel fetal movement and begin bonding with your baby',
                    'Address body image changes and embrace your growing body',
                    'Deepen partner connection and discuss parenting values',
                    'Consider bodywork such as chiropractic care, craniosacral therapy, pelvic floor physical therapy, and massage for pregnancy comfort and birth preparation'
                ]
            },
            {
                heading: 'Practical Preparation',
                items: [
                    'Take childbirth education classes',
                    'Interview and hire doula, photographer, or other support',
                    'Start thinking about infant care basics',
                    'Begin exploring childcare options and timeline',
                    'Learn about breast pumps—ask your provider for a script or check out Milk Moms, Aeroflow, or Edgepark',
                    'Research newborn care decisions (newborn medications, circumcision, screening tests, vitamin D supplementation, pediatric provider)'
                ]
            }
        ],
        story: ''
    },
    {
        number: 'Third Trimester',
        weeks: '(Weeks 28-40)',
        title: 'Preparation & Anticipation',
        color: '#8B7355',
        colorLight: 'rgba(139, 115, 85, 0.1)',
        sections: [
            {
                heading: 'Healthcare Decisions',
                items: [
                    'Finalize your birth plan and discuss with your provider',
                    'Understand labor and delivery procedures at your birth site',
                    'Discuss Group B Strep results and any implications',
                    'Address baby positioning and any concerns about labor'
                ]
            },
            {
                heading: 'Physical & Emotional Preparation',
                items: [
                    'Learn comfort measures and relaxation techniques for labor',
                    'Practice movements and positions for labor comfort',
                    'Address fears and anxieties about birth',
                    'Get mentally and emotionally ready for labor and parenting. Have real conversations with your partner about your fears and questions. Plan ahead for postpartum—talk about who does what, how you\'ll handle sleep deprivation, baby care needs, and how your relationship might change.'
                ]
            },
            {
                heading: 'Practical Preparation',
                items: [
                    'Research your postpartum plan (rest, meals, visitors, support)',
                    'Prepare your home for baby (car seat, sleeping space, supplies)',
                    'Discuss newborn care decisions (newborn medications, circumcision, screening tests, vitamin D supplementation, pediatric provider)',
                    'Arrange postpartum support (partner time off, family help, doula)',
                    'Prepare for mental health changes and how to seek support'
                ]
            }
        ],
        story: ''
    },
    {
        number: 'Postpartum & Beyond',
        weeks: '',
        title: 'Recovery, Rest & Bonding',
        color: '#D4A574',
        colorLight: 'rgba(212, 165, 116, 0.1)',
        sections: [
            {
                heading: 'Physical Recovery',
                items: [
                    'Invest in REST and bonding with your baby. Think of the first 3 months postpartum as the "fourth trimester" as you adapt to postpartum life, and your baby adapts to life outside the womb.',
                    'Begin gentle movement when you feel ready',
                    'Attend postpartum check-up with your healthcare provider',
                    'Pay attention to signs of pelvic floor weakness, and ask your provider for a referral to pelvic floor PT if needed.'
                ]
            },
            {
                heading: 'Emotional & Mental Health',
                items: [
                    'Expect a wide range of emotions—this is normal',
                    'Watch for signs of postpartum depression or anxiety',
                    'Build in time for self-care and connection with partner',
                    'Lean on your support village—ask for and accept help',
                    'Connect with other new parents—join a moms group, book club, or lactation support group!'
                ]
            },
            {
                heading: 'Feeding Your Baby',
                items: [
                    'Connect with a lactation consultant if you\'re breastfeeding or exclusively pumping',
                    'Know that feeding challenges are common and support is available',
                    'Establish routines that work for your family',
                    'Remember: feeding time is bonding time'
                ]
            },
            {
                heading: 'Practical Life with Newborn',
                items: [
                    'Simplify everything—focus on feeding, diaper changes, rest',
                    'Accept help with meals, housework, and childcare',
                    'Build a routine that works for your family (no perfect schedule)',
                    'Find community—parent groups, online communities, local gatherings',
                    'Remember: this phase is temporary. You\'re doing great.'
                ]
            }
        ],
        story: ''
    }
];

// Roadmap Resources - used for bottom section
const roadmapResources = [
    { title: 'Ina May\'s Guide to Childbirth', type: 'Books', url: 'https://www.amazon.com/Ina-Mays-Guide-Childbirth-Gaskin/dp/0553381156/' },
    { title: 'Real Food for Pregnancy by Lily Nichols', type: 'Books', url: 'https://www.amazon.com/Real-Food-Pregnancy-audiobook/dp/B07HFK1CNJ/' },
    { title: 'Babies Are Not Pizzas by Rebecca Dekker', type: 'Books', url: 'https://www.amazon.com/Babies-Are-Not-Pizzas-Delivered/dp/B07Y8SL7LB/' },
    { title: 'Changing Birth on Earth by Gail Tully', type: 'Books', url: 'https://a.co/d/0epmuXrR' },
    { title: 'Birthing from Within', type: 'Books', url: 'https://a.co/d/0dMZHOmS' },
    { title: 'Hypnobirthing', type: 'Books', url: 'https://a.co/d/09WXU5bF' },
    { title: 'Evidence Based Birth', type: 'Websites', url: 'https://evidencebasedbirth.com' },
    { title: 'Lily Nichols', type: 'Websites', url: 'https://lilynichols.com' },
    { title: 'Spinning Babies', type: 'Websites', url: 'https://spinningbabies.com' },
    { title: 'Postpartum.net', type: 'Websites', url: 'https://postpartum.net/' }
];

// Render Roadmap
function renderRoadmap() {
    const timeline = document.getElementById('timeline');
    if (!timeline) return; // Safety check
    timeline.innerHTML = trimesterData.map((trimester, index) => {
        const colorClass = `color-trim${index % 3 === 0 ? 1 : index % 3 === 1 ? 2 : 3}`;
        
        const sectionsHTML = trimester.sections.map((section, sectionIndex) => `
            <div class="accordion-section">
                <div class="accordion-header" onclick="toggleAccordion(event)">
                    <span>${section.heading}</span>
                    <span class="accordion-toggle">▼</span>
                </div>
                <div class="accordion-content">
                    <ul class="roadmap-list">
                        ${section.items.map((item, itemIndex) => `
                            <li data-trimester="${index}" data-section="${sectionIndex}" data-item="${itemIndex}">${item}</li>
                        `).join('')}
                    </ul>
                </div>
            </div>
        `).join('');

        return `
            <div class="trimester">
                <div class="trimester-dot"></div>
                <div class="trimester-content ${colorClass}">
                    <div class="trimester-header ${colorClass}">
                        <div class="trimester-number">${trimester.number}</div>
                        <div class="trimester-title">${trimester.title}</div>
                        <p style="color: var(--text-light); font-style: italic; margin-top: 0.5rem;">${trimester.weeks}</p>
                    </div>
                    
                    <div class="accordion-container">
                        ${sectionsHTML}
                    </div>
                </div>
            </div>
        `;
    }).join('');

    // Add all resources at the bottom, organized by type (excluding Guide and Classes)
    const allResources = roadmapResources;
    
    // Remove duplicates and group by type
    const uniqueResources = {};
    allResources.forEach(resource => {
        const key = `${resource.title}-${resource.url}`;
        uniqueResources[key] = resource;
    });
    
    const resourcesByType = {};
    Object.values(uniqueResources).forEach(resource => {
        // Skip Guide and Classes types
        if (resource.type === 'Guide' || resource.type === 'Classes') return;
        
        if (!resourcesByType[resource.type]) {
            resourcesByType[resource.type] = [];
        }
        resourcesByType[resource.type].push(resource);
    });
    
    const resourceTypeOrder = ['Books', 'Websites', 'Tool', 'Community', 'Other resources'];
    
    const resourcesAtBottom = Object.keys(resourcesByType).length > 0 ? `
        <div style="margin-top: 3rem; padding-top: 2rem; border-top: 2px solid var(--border);">
            <h3 class="resources-title">Resources & Links</h3>
            ${resourceTypeOrder
                .filter(type => resourcesByType[type])
                .map((type, index) => `
                    <div style="margin-bottom: 1.5rem;">
                        <div class="resource-accordion-header" onclick="toggleResourceAccordion(event)" style="display: flex; align-items: center; justify-content: space-between; cursor: pointer; padding: 1rem; background: var(--light-bg); border: 2px solid var(--border); border-radius: 6px; font-weight: 600; color: var(--primary); user-select: none;">
                            <span>${type}</span>
                            <span class="accordion-toggle" style="font-size: 1.2rem; transition: transform 0.3s ease;">▼</span>
                        </div>
                        <div class="resource-accordion-content" style="display: block; padding: 1rem 0;">
                            <ul class="resource-list">
                                ${resourcesByType[type].map(resource => `
                                    <li class="resource-item">
                                        <div>
                                            <a href="${resource.url}" target="_blank">${resource.title}</a>
                                        </div>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                    </div>
                `)
                .join('')}
        </div>
    ` : '';
    
    timeline.innerHTML += resourcesAtBottom;
}

// Page navigation
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    const activeLink = document.querySelector(`.nav-link[onclick="showPage('${pageId}')"]`);
    if (activeLink) activeLink.classList.add('active');
    document.querySelector('.nav-links').classList.remove('mobile-active');
    window.scrollTo(0, 0);
}

// Mobile menu
function toggleMobileMenu() {
    document.querySelector('.nav-links').classList.toggle('mobile-active');
}

// Toggle accordion sections
function toggleAccordion(event) {
    const header = event.currentTarget;
    header.classList.toggle('active');
    const content = header.nextElementSibling;
    if (content.style.display === 'none' || !content.style.display) {
        content.style.display = 'block';
        header.querySelector('.accordion-toggle').style.transform = 'rotate(180deg)';
    } else {
        content.style.display = 'none';
        header.querySelector('.accordion-toggle').style.transform = 'rotate(0deg)';
    }
}

// Toggle resource accordion at bottom
function toggleResourceAccordion(event) {
    const header = event.currentTarget;
    header.classList.toggle('active');
    const content = header.nextElementSibling;
    if (content.style.display === 'none' || !content.style.display) {
        content.style.display = 'block';
        header.querySelector('.accordion-toggle').style.transform = 'rotate(180deg)';
    } else {
        content.style.display = 'none';
        header.querySelector('.accordion-toggle').style.transform = 'rotate(0deg)';
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    renderEvents();
    renderWorkers();
    renderRoadmap();
    
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            setTimeout(() => {
                contactForm.style.display = 'none';
                document.getElementById('success-message').classList.add('show');
                setTimeout(() => {
                    contactForm.reset();
                    contactForm.style.display = 'block';
                    document.getElementById('success-message').classList.remove('show');
                }, 4000);
            }, 1000);
        });
    }
    
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function() {
            document.querySelector('.nav-links').classList.remove('mobile-active');
        });
    });
});
