# W3C TPAC 2025 Hackathon - Challenge 2 Planning

## Challenge Overview
**Track:** Dashboard - Build a small dashboard or visualization
**Time:** 90 minutes
**Team:** Solo or pair
**Goal:** Create something that gathers or presents information in a useful way related to W3C, the Web, or anything we care about

## Rules & Constraints
- ✅ 90 minutes to build/sketch
- ✅ Work solo or in pair  
- ✅ All work created during hackathon (reusing own snippets is fine)
- ✅ AI tools allowed (must explain process)
- ✅ Must create GitHub repository
- ✅ Include code + materials
- ✅ Post in GH Issue thread with title, hackers, description, repo URL, screenshot

## Potential Dashboard Ideas (W3C/Web Standards Focus)

### Option 3: W3C Community Activity Monitor
- **Concept:** Real-time dashboard of W3C community engagement, showcasing modern CSS features while ensuring WCAG 3 accessibility guidelines
- **Data:** GitHub activity, mailing lists, meeting participation
- **Features:**
  - Active contributors heatmap (CSS Grid animations)
  - Working group activity levels (CSS Flexbox charts)
  - Recent discussions/topics (CSS Custom Properties theming)
  - Contributor diversity metrics (CSS Animations for data visualization)
- **Tech:** HTML, CSS, JS, GitHub API, modern CSS Grid/Flexbox/Animations
- **Feasibility:** Medium - API rate limits may be challenging

### Inspiration from w3c/cg-monitor
- **Multi-source data collection**: W3C API, GitHub API, mailing lists, RSS feeds, wikis for comprehensive activity tracking
- **Data storage**: One JSON file per group, processed into report.json for dashboard
- **Activity visualization**: Generates charts, focuses on activity levels and transitions
- **Automation**: Node.js scripts for data collection and processing
- **Dashboard**: Static HTML/JS displaying processed data with interactive elements

Adapted for our project: Fetch W3C WG data via GitHub API, store in sessionStorage, process for CSS-powered visualizations, ensure WCAG 3 compliance.

### Why This Option?
1. **Directly relevant to W3C** - monitors community engagement in real-time
2. **Modern CSS showcase** - uses cutting-edge CSS for data visualization
3. **Accessibility focus** - WCAG 3 compliance ensures inclusive design
4. **Visual appeal** - CSS magic creates engaging, interactive dashboards
5. **Practical utility** - provides valuable insights for W3C community

### Technical Implementation Plan

#### Phase 1: Core Structure (30 minutes)
- [ ] HTML layout with semantic elements for accessibility
- [ ] Set up GitHub API data fetching (contributors, issues, PRs)
- [ ] Basic CSS Grid/Flexbox layout for dashboard
- [ ] Static data fallback for development

#### Phase 2: Data Visualization with CSS Magic (30 minutes)
- [ ] Implement heatmap with CSS Grid animations
- [ ] Create activity charts using CSS Flexbox and Custom Properties
- [ ] Add discussion feed with CSS transitions
- [ ] Diversity metrics with CSS color schemes and animations

#### Phase 3: WCAG 3 Compliance & Polish (30 minutes)
- [ ] Ensure ARIA labels, keyboard navigation, semantic HTML
- [ ] Add reduced motion support and high contrast options
- [ ] Responsive design with modern CSS
- [ ] Error handling and loading states

### Data Sources
- **GitHub API:** https://api.github.com/repos/w3c/ (contributors, issues, PRs)
- **W3C Mailing Lists:** Public archives for discussion data
- **Meeting Participation:** Static data or API if available
- **Static Fallback:** JSON files with sample community data

### Technical Stack
- **Frontend:** Vanilla HTML5, CSS3, ES6+
- **Data Fetching:** Fetch API with async/await, GitHub API
- **CSS Features:** Grid, Flexbox, Custom Properties, Animations, Container Queries
- **JavaScript:** Data processing, DOM manipulation, accessibility helpers
- **Accessibility:** WCAG 3 compliance, ARIA, semantic HTML, keyboard navigation

### Success Criteria
1. **Functional:** Displays real W3C community data from GitHub
2. **Accessible:** Meets WCAG 3 guidelines for inclusive design
3. **Polished:** Professional appearance with smooth CSS animations
4. **Complete:** Core community metrics working within time limit
5. **Documented:** Clear README with data sources and accessibility notes

### Backup Plan
If API access fails:
- Use static JSON data files with sample W3C community data
- Focus on CSS visualization techniques and accessibility features
- Include disclaimer about data being demo/mock data

### Stretch Goals (if time permits)
- [ ] Real-time updates with WebSocket or polling
- [ ] Interactive filters and sorting with CSS transitions
- [ ] Export dashboard data (CSV/PDF)
- [ ] Advanced CSS features (Houdini for custom visualizations)
- [ ] Automated WCAG 3 compliance checker integration

## Development Strategy
1. **Start with CSS examples** - set up basic demos first
2. **Build incrementally** - get basic version working, then enhance
3. **Test continuously** - check functionality at each step
4. **Prioritize core features** - ensure main value proposition works
5. **Document as you go** - README and comments for final submission

## Final Deliverables
- GitHub repository with source code
- Live demo (GitHub Pages or similar)
- README with project description and setup instructions
- Screenshot for submission
- 90-second demo prepared for lightning talks