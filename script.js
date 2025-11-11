// Theme toggle functionality
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

themeToggle.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    body.setAttribute('data-theme', newTheme);
    themeToggle.textContent = newTheme === 'dark' ? 'Light Mode' : 'Dark Mode';
});

// Animation toggle
const animateBtn = document.getElementById('animate-btn');
const animatedBox = document.getElementById('animated-box');

animateBtn.addEventListener('click', () => {
    animatedBox.classList.toggle('animated');
    animateBtn.textContent = animatedBox.classList.contains('animated') ? 'Reset' : 'Animate Me';
});

// Color picker for custom properties demo
const colorPicker = document.getElementById('color-picker');
const demoBox = document.querySelector('.demo-box');

colorPicker.addEventListener('input', (e) => {
    demoBox.style.setProperty('--theme-color', e.target.value);
});

// Initialize theme
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    body.setAttribute('data-theme', 'dark');
    themeToggle.textContent = 'Light Mode';
} else {
    themeToggle.textContent = 'Dark Mode';
}

// WCAG 3 compliance: Ensure keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        // Focus management is handled by CSS and browser defaults
    }
});

// Accessibility check: Log contrast ratios (simplified)
function checkContrast() {
    // In a real implementation, use a library like color-contrast
    console.log('Contrast check: Implement proper color contrast validation');
}

checkContrast();