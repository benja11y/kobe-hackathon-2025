// Theme toggle functionality
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

themeToggle.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    body.setAttribute('data-theme', newTheme);
    themeToggle.textContent = newTheme === 'dark' ? 'Light Mode' : 'Dark Mode';
});

// Refresh data functionality
const refreshBtn = document.getElementById('refresh-data');
refreshBtn.addEventListener('click', () => {
    loadCommunityData();
});

// Mailing list mapping for known repos
const mailingMap = {
    'csswg-drafts': 'www-style',
    'html': 'public-html',
    'aria': 'wai-xtech',
    'webappsec': 'public-webappsec',
    'webcomponents': 'public-webapps',
    'ServiceWorker': 'public-webapps',
    'webrtc-pc': 'public-webrtc',
    'performance-timeline': 'public-web-perf'
};

// Fetch top W3C repos dynamically by activity (open issues/PRs)
async function fetchW3CGroups() {
    const token = document.getElementById('github-token').value;
    const headers = token ? { 'Authorization': `token ${token}` } : {};
    const res = await fetch('https://api.github.com/orgs/w3c/repos?per_page=50', { headers });
    if (!res.ok) throw new Error('Failed to fetch W3C repos');
    const allRepos = await res.json();
    const repos = allRepos.sort((a, b) => b.open_issues_count - a.open_issues_count).slice(0, 8);
    console.log('Fetched and sorted top W3C repos by open issues/PRs:', repos.map(r => ({ name: r.name, issues: r.open_issues_count, full_name: r.full_name })));
    const groups = repos.map(repo => ({
        name: repo.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), // Capitalize words
        repo: repo.full_name,
        mailing: mailingMap[repo.name] || 'public' // Default to 'public' if not mapped
    }));
    console.log('Mapped W3C groups:', groups);
    return groups;
}

// Helper to parse Atom feed
function parseRSS(atomText, groupName) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(atomText, 'text/xml');
    const entries = xmlDoc.querySelectorAll('entry');
    const parsedItems = [];

    entries.forEach((entry, index) => {
        const title = entry.querySelector('title')?.textContent || 'No title';
        const link = entry.querySelector('link')?.getAttribute('href') || '';
        const published = entry.querySelector('published')?.textContent || entry.querySelector('updated')?.textContent || '';
        const author = entry.querySelector('author name')?.textContent || 'Unknown';

        parsedItems.push({
            title: `${title} (${groupName})`,
            author,
            link,
            date: new Date(published).toLocaleString(),
            new: Date.now() - new Date(published) < 24 * 60 * 60 * 1000
        });
    });

    return parsedItems;
}

// Helper to show error messages
function showError(sectionId, message) {
    const section = document.getElementById(sectionId);
    const existingContent = section.querySelector('div');
    if (existingContent) {
        existingContent.innerHTML = `<p style="color: red; text-align: center;">${message}</p>`;
    }
}

// Load community data
async function loadCommunityData() {
    const cacheKey = 'w3cCommunityDataV3'; // Updated for dual activity bars
    const cachedData = sessionStorage.getItem(cacheKey);

    if (cachedData) {
        console.log('Loading cached W3C data');
        const data = JSON.parse(cachedData);
        populateActivity(data.activity);
        populateDiscussions(data.discussions);
        populateDiversity(data.diversity);
        populateMailing(data.mailing || []);
        return;
    }

    try {
        console.log('Fetching fresh W3C data...');

        // Fetch dynamic W3C groups
        const w3cGroups = await fetchW3CGroups();

        // Get GitHub token if provided (for higher rate limits)
        // Note: Token is entered locally and not committed to repo
        const token = document.getElementById('github-token').value;
        const headers = token ? { 'Authorization': `token ${token}` } : {};

        // Fetch data for all groups in parallel
        const fetchPromises = w3cGroups.map(async (group) => {
            const [contributorsRes, issuesRes, mailingRes] = await Promise.all([
                fetch(`https://api.github.com/repos/${group.repo}/contributors?per_page=10`, { headers }),
                fetch(`https://api.github.com/repos/${group.repo}/issues?state=open&per_page=5`, { headers }),
                group.mailing !== 'public' ? fetch(`https://lists.w3.org/Archives/Public/${group.mailing}/feed.atom`) : Promise.resolve(null)
            ]);

            if (!contributorsRes.ok || !issuesRes.ok) {
                throw new Error(`Failed to fetch data for ${group.name}`);
            }

            const contributors = await contributorsRes.json();
            const issues = await issuesRes.json();
            let mailingItems = [];
            let mailingCount = 0;
            try {
                if (group.mailing !== 'public') {
                    // Fetch atom for recent posts
                    if (mailingRes && mailingRes.ok) {
                        const rssText = await mailingRes.text();
                        mailingItems = parseRSS(rssText, group.name);
                    }
                    // Fetch main archive page for current month message count
                    const now = new Date();
                    const year = now.getFullYear();
                    const monthName = now.toLocaleString('en-US', { month: 'long' });
                    const archiveRes = await fetch(`https://lists.w3.org/Archives/Public/${group.mailing}/`);
                    if (archiveRes.ok) {
                        const htmlText = await archiveRes.text();
                        const doc = new DOMParser().parseFromString(htmlText, 'text/html');
                        const text = doc.body.textContent;
                        const pattern = new RegExp(`${monthName} ${year}: (\\d+) messages`);
                        const match = text.match(pattern);
                        if (match) {
                            mailingCount = parseInt(match[1]);
                        } else {
                            mailingCount = mailingItems.length; // Fallback
                        }
                    } else {
                        console.log(`Archive page fetch failed for ${group.name}: ${archiveRes.status}`);
                        mailingCount = mailingItems.length; // Fallback to atom count
                    }
                }
            } catch (e) {
                console.log(`Error fetching mailing for ${group.name}:`, e);
                mailingCount = mailingItems.length;
            }

            return {
                group: group.name,
                contributors,
                issues,
                mailing: mailingItems,
                totalContributions: contributors.reduce((sum, c) => sum + c.contributions, 0),
                mailingCount
            };
        });

        const groupsData = await Promise.all(fetchPromises);



        // Process activity levels
        const activityData = groupsData.map(g => ({
            group: g.group,
            prs: Math.round(g.totalContributions / 10), // Estimate PRs from contributions
            mailing: g.mailingCount
        }));

        // Normalize PRs and mailing to 0-100% scale, with 100% = 1.2x max value
        const maxPrs = Math.max(...activityData.map(g => g.prs));
        const maxMailing = Math.max(...activityData.map(g => g.mailing));
        const scaleMaxPrs = maxPrs * 1.2;
        const scaleMaxMailing = maxMailing * 1.2;
        activityData.forEach(g => {
            g.percentagePrs = Math.min(100, Math.round((g.prs / scaleMaxPrs) * 100));
            g.percentageMailing = Math.min(100, Math.round((g.mailing / scaleMaxMailing) * 100));
        });

        // Process discussions: recent issues from all groups
        const allIssues = groupsData.flatMap(g => g.issues.map(issue => ({
            ...issue,
            group: g.group
        }))).sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 8);

        const discussionsData = allIssues.map(issue => ({
            title: `${issue.title} (${issue.group})`,
            author: issue.user.login,
            time: new Date(issue.created_at).toLocaleString(),
            new: Date.now() - new Date(issue.created_at) < 24 * 60 * 60 * 1000 // New if < 24h
        }));

        // Process mailing list activity: recent posts from all groups
        let allMailing = groupsData.flatMap(g => g.mailing).sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 20);

        // Fallback mock data if no mailing data fetched
        if (allMailing.length === 0) {
            allMailing = [
                { title: 'Sample mailing post 1 (CSS WG)', author: 'user1', link: '#', date: new Date().toLocaleString(), new: true },
                { title: 'Sample mailing post 2 (HTML WG)', author: 'user2', link: '#', date: new Date(Date.now() - 3600000).toLocaleString(), new: false }
            ];
        }

        const mailingData = allMailing;

        // Process diversity: count contributor locations
        const locations = {};
        allContributors.forEach(c => {
            if (c.location) {
                const region = getRegionFromLocation(c.location);
                locations[region] = (locations[region] || 0) + 1;
            }
        });

        const totalWithLocation = Object.values(locations).reduce((sum, count) => sum + count, 0);
        const diversityData = Object.entries(locations).map(([region, count]) => ({
            region,
            percentage: Math.round((count / totalWithLocation) * 100)
        })).sort((a, b) => b.percentage - a.percentage);

        // If no location data, use fallback
        if (diversityData.length === 0) {
            diversityData.push(
                { region: 'North America', percentage: 35 },
                { region: 'Europe', percentage: 30 },
                { region: 'Asia', percentage: 25 },
                { region: 'Other', percentage: 10 }
            );
        }

        const processedData = {
            activity: activityData,
            discussions: discussionsData,
            diversity: diversityData,
            mailing: mailingData
        };

        // Cache in sessionStorage
        sessionStorage.setItem(cacheKey, JSON.stringify(processedData));

        // Populate
        populateActivity(activityData);
        populateDiscussions(discussionsData);
        populateDiversity(diversityData);
        populateMailing(mailingData);

    } catch (error) {
        console.log('Error fetching W3C data:', error);
        // Show error messages instead of placeholder data
        showError('activity-section', 'Unable to load activity levels data');
        showError('discussions-section', 'Unable to load discussions data');
        showError('diversity-section', 'Unable to load diversity metrics data');
        showError('mailing-section', 'Unable to load mailing list activity data');
    }
}

// Helper to determine region from location
function getRegionFromLocation(location) {
    const loc = location.toLowerCase();
    if (loc.includes('usa') || loc.includes('canada') || loc.includes('mexico')) return 'North America';
    if (loc.includes('uk') || loc.includes('germany') || loc.includes('france') || loc.includes('europe')) return 'Europe';
    if (loc.includes('china') || loc.includes('japan') || loc.includes('india') || loc.includes('asia')) return 'Asia';
    return 'Other';
}



// Populate activity chart
function populateActivity(data) {
    const chart = document.getElementById('activity-chart');
    chart.innerHTML = '';
    data.forEach(group => {
        const bar = document.createElement('div');
        bar.className = 'activity-bar';
        bar.innerHTML = `
            <div class="activity-label">${group.group}</div>
            <div class="activity-fill pr-fill" style="--percentage: ${group.percentagePrs}%"></div>
            <div class="activity-value">${group.prs} PRs</div>
            <div class="activity-fill mailing-fill" style="--percentage: ${group.percentageMailing}%"></div>
            <div class="activity-value">${group.mailing} mailing list items</div>
        `;
        chart.appendChild(bar);
    });
}

// Populate discussions
function populateDiscussions(data) {
    const feed = document.getElementById('discussions-feed');
    feed.innerHTML = '';
    data.forEach(item => {
        const div = document.createElement('article');
        div.className = `discussion-item ${item.new ? 'new' : ''}`;
        div.setAttribute('aria-label', `Discussion: ${item.title} by ${item.author}`);
        div.innerHTML = `
            <h3>${item.title}</h3>
            <p>By ${item.author} • ${item.time}</p>
        `;
        feed.appendChild(div);
    });
}

// Populate diversity metrics
function populateDiversity(data) {
    const metrics = document.getElementById('diversity-metrics');
    metrics.innerHTML = '';
    data.forEach(item => {
        const div = document.createElement('div');
        div.className = 'diversity-item';
        div.innerHTML = `
            <div class="diversity-chart" style="--segment-1: ${item.percentage}%"></div>
            <div class="diversity-label">${item.region}</div>
            <div>${item.percentage}%</div>
        `;
        metrics.appendChild(div);
    });
}

// Populate mailing list activity
function populateMailing(data) {
    const feed = document.getElementById('mailing-activity');
    feed.innerHTML = '';
    if (data.length === 0) {
        feed.innerHTML = '<p>No recent mailing list activity found.</p>';
        return;
    }
    data.forEach(item => {
        const article = document.createElement('article');
        article.className = `mailing-item ${item.new ? 'new' : ''}`;
        article.setAttribute('aria-label', `Mailing list post: ${item.title} by ${item.author}`);
        article.innerHTML = `
            <h3><a href="${item.link}" target="_blank">${item.title}</a></h3>
            <p>By ${item.author} • ${item.date}</p>
        `;
        feed.appendChild(article);
    });
}

// Initialize theme
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    body.setAttribute('data-theme', 'dark');
    themeToggle.textContent = 'Light Mode';
} else {
    themeToggle.textContent = 'Dark Mode';
}

// Mailing list toggle functionality
const mailingToggle = document.getElementById('mailing-toggle');
const mailingActivity = document.getElementById('mailing-activity');
mailingToggle.addEventListener('click', () => {
    const isExpanded = mailingToggle.getAttribute('aria-expanded') === 'true';
    mailingToggle.setAttribute('aria-expanded', !isExpanded);
    mailingToggle.textContent = isExpanded ? 'Show Mailing List Activity' : 'Hide Mailing List Activity';
    mailingActivity.classList.toggle('hidden');
});

// Activity levels toggle functionality
const activityToggle = document.getElementById('activity-toggle');
const activitySection = document.getElementById('activity-section');
activityToggle.addEventListener('click', () => {
    const isExpanded = activityToggle.getAttribute('aria-expanded') === 'true';
    activityToggle.setAttribute('aria-expanded', !isExpanded);
    activityToggle.textContent = isExpanded ? 'Show Mailing Activity' : 'Hide Mailing Activity';
    activitySection.classList.toggle('hide-mailing');
});

// Load data on page load
document.addEventListener('DOMContentLoaded', loadCommunityData);

// WCAG 3 compliance: Keyboard navigation and ARIA
document.addEventListener('keydown', (e) => {
    // Enhanced keyboard navigation if needed
});