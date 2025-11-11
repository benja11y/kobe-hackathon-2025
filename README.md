# W3C Community Activity Monitor

A real-time dashboard monitoring W3C community engagement, showcasing modern CSS features while ensuring WCAG 3 accessibility compliance.

## Features

- **Active Contributors Heatmap**: CSS Grid-based visualization of contributor activity
- **Working Group Activity Levels**: CSS Flexbox charts showing PRs and issues
- **Recent Discussions & Topics**: CSS transition-animated feed of community discussions
- **Contributor Diversity Metrics**: CSS animation-powered diversity charts
- **WCAG 3 Compliance**: Full accessibility support with semantic HTML, ARIA, and keyboard navigation

## CSS Magic Showcased

- **CSS Grid**: Heatmap layout with responsive grid areas
- **CSS Flexbox**: Activity level bars with flexible sizing
- **CSS Custom Properties**: Dynamic theming and data-driven styling
- **CSS Animations**: Smooth transitions, pulse effects, and reduced motion support
- **CSS Container Queries**: Responsive components that adapt to their container

## WCAG 3 Guidelines Addressed

- **Perceivable**: High contrast themes, reduced motion, clear visual hierarchy
- **Operable**: Keyboard navigation, focus management, logical tab order
- **Understandable**: Consistent labeling, predictable interactions
- **Robust**: Semantic HTML, ARIA landmarks, screen reader compatibility

## Data Sources

- **GitHub API**: Real contributor and repository data from W3C organizations
- **Static Fallback**: Sample data for demonstration when API limits are reached
- **W3C Resources**: Links to working group pages and specifications

## Technologies Used

- HTML5 with semantic elements and ARIA attributes
- CSS3 with modern features (Grid, Flexbox, Custom Properties, Animations, Container Queries)
- Vanilla JavaScript for data fetching and DOM manipulation
- Responsive design with CSS media queries

## Setup

1. Clone this repository
2. Open `index.html` in a modern web browser
3. (Optional) Enter a GitHub personal access token in the input field to avoid API rate limits
4. For GitHub Pages deployment, enable Pages in repository settings

## Browser Support

- Modern browsers supporting CSS Grid, Flexbox, and Custom Properties
- Graceful degradation for older browsers
- Progressive enhancement for advanced CSS features

## Accessibility Features

- ARIA labels, roles, and live regions
- Keyboard navigation and focus management
- High contrast and dark mode themes
- Reduced motion preferences support
- Semantic HTML structure throughout

## API Usage

The dashboard attempts to fetch real data from GitHub API. If rate limits are exceeded, it falls back to static sample data with appropriate disclaimers.

Built for W3C TPAC 2025 Hackathon Challenge 2.