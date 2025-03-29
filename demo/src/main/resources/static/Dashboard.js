document.addEventListener('DOMContentLoaded', function() {
    // Theme toggling functionality
    initializeThemeToggle();
    
    // Tab switching functionality
    initializeTabSwitching();
    
    // Filter and search functionality
    initializeSearchAndFilter();
    
    // PR actions (hover effects, clicks)
    initializePRActions();
    
    // Initialize charts (placeholder)
    initializeCharts();
});

/**
 * Initialize theme toggle functionality
 */
function initializeThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Check for saved theme preference or use system preference
    const currentTheme = localStorage.getItem('theme') || 
                        (prefersDarkScheme.matches ? 'dark' : 'light');
    
    // Set initial theme
    if (currentTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    // Toggle theme on click
    themeToggle.addEventListener('click', function() {
        let theme;
        
        if (document.body.getAttribute('data-theme') === 'dark') {
            document.body.removeAttribute('data-theme');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            theme = 'light';
        } else {
            document.body.setAttribute('data-theme', 'dark');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            theme = 'dark';
        }
        
        // Save preference
        localStorage.setItem('theme', theme);
    });
}

/**
 * Initialize tab switching functionality
 */
function initializeTabSwitching() {
    const tabButtons = document.querySelectorAll('.tabs button');
    const prItems = document.querySelectorAll('.pr-item');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get the tab type from the button text
            const tabType = this.textContent.trim().split(' ')[0].toLowerCase();
            
            // Filter PR items based on the tab type
            prItems.forEach(item => {
                if (tabType === 'all') {
                    item.style.display = 'flex';
                } else if (item.classList.contains(tabType.toLowerCase())) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

/**
 * Initialize search and filter functionality
 */
function initializeSearchAndFilter() {
    const searchInput = document.querySelector('.search-wrapper input');
    const repositorySelect = document.querySelector('.filter-group select:nth-child(1)');
    const authorSelect = document.querySelector('.filter-group select:nth-child(2)');
    const filterButton = document.querySelector('.action-btn');
    
    // Search functionality
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const prItems = document.querySelectorAll('.pr-item');
        
        prItems.forEach(item => {
            const title = item.querySelector('h3').textContent.toLowerCase();
            const description = item.querySelector('.description').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || description.includes(searchTerm)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    });
    
    // Repository filter
    repositorySelect.addEventListener('change', function() {
        const selectedRepo = this.value;
        const prItems = document.querySelectorAll('.pr-item');
        
        if (selectedRepo === 'All Repositories') {
            prItems.forEach(item => item.style.display = 'flex');
            return;
        }
        
        prItems.forEach(item => {
            const repoElement = item.querySelector('.meta-item:nth-child(1)');
            const repo = repoElement.textContent.replace(/^\s*\S+\s+/, '').trim(); // Remove icon text
            
            if (repo === selectedRepo) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    });
    
    // More filters button
    filterButton.addEventListener('click', function() {
        // Example: Create a modal for advanced filters
        alert('Advanced filters would open in a modal here!');
    });
}

/**
 * Initialize PR action buttons
 */
function initializePRActions() {
    const prActions = document.querySelectorAll('.pr-actions .action');
    
    prActions.forEach(action => {
        action.addEventListener('click', function(e) {
            e.stopPropagation();
            
            const actionType = this.querySelector('i').classList[1];
            const prItem = this.closest('.pr-item');
            const prTitle = prItem.querySelector('h3').textContent;
            
            // Handle different action types
            switch(actionType) {
                case 'fa-code-merge':
                    showToast(`Merging PR: "${prTitle}"`);
                    // Here you would normally call an API to merge the PR
                    prItem.classList.remove('pending', 'changes');
                    prItem.classList.add('approved');
                    updatePRStatus(prItem, 'approved');
                    break;
                case 'fa-eye':
                    showToast(`Viewing details for: "${prTitle}"`);
                    // Redirect to PR details page
                    break;
                case 'fa-comment':
                    showToast(`Opening comment section for: "${prTitle}"`);
                    // Open comments section or modal
                    break;
                case 'fa-check':
                    showToast(`Approving PR: "${prTitle}"`);
                    prItem.classList.remove('pending', 'changes');
                    prItem.classList.add('approved');
                    updatePRStatus(prItem, 'approved');
                    break;
                case 'fa-times':
                    showToast(`Requesting changes for: "${prTitle}"`);
                    prItem.classList.remove('pending', 'approved');
                    prItem.classList.add('changes');
                    updatePRStatus(prItem, 'changes');
                    break;
                case 'fa-edit':
                    showToast(`Editing PR: "${prTitle}"`);
                    // Open edit form/page
                    break;
            }
        });
    });
    
    // Make PR items clickable to view details
    const prItems = document.querySelectorAll('.pr-item');
    prItems.forEach(item => {
        item.addEventListener('click', function() {
            const prTitle = this.querySelector('h3').textContent;
            showToast(`Opening details for: "${prTitle}"`);
            // Redirect to PR details page
        });
    });
}

/**
 * Update PR status badge
 */
function updatePRStatus(prItem, status) {
    const statusBadge = prItem.querySelector('.badge');
    statusBadge.className = 'badge ' + status;
    
    let icon, text;
    switch(status) {
        case 'approved':
            icon = 'fas fa-check-circle';
            text = 'Approved';
            break;
        case 'pending':
            icon = 'fas fa-clock';
            text = 'Pending';
            break;
        case 'changes':
            icon = 'fas fa-comment-dots';
            text = 'Changes Requested';
            break;
    }
    
    statusBadge.innerHTML = `<i class="${icon}"></i> ${text}`;
    
    // Update counts in tabs
    updateTabCounts();
}

/**
 * Update the count numbers in tab buttons
 */
function updateTabCounts() {
    const approvedItems = document.querySelectorAll('.pr-item.approved').length;
    const pendingItems = document.querySelectorAll('.pr-item.pending').length;
    const changesItems = document.querySelectorAll('.pr-item.changes').length;
    const totalItems = document.querySelectorAll('.pr-item').length;
    
    document.querySelector('.tabs button:nth-child(1) .count').textContent = totalItems;
    document.querySelector('.tabs button:nth-child(2) .count').textContent = approvedItems;
    document.querySelector('.tabs button:nth-child(3) .count').textContent = pendingItems;
    document.querySelector('.tabs button:nth-child(4) .count').textContent = changesItems;
}

/**
 * Initialize the charts in the dashboard
 * This is a placeholder for chart implementation
 */
function initializeCharts() {
    // Placeholder for chart functionality
    // In a real application, you would use a library like Chart.js
    
    const charts = document.querySelectorAll('.chart-placeholder');
    
    charts.forEach(chart => {
        // Add a simple animation to the placeholder
        chart.addEventListener('mouseenter', function() {
            const icon = this.querySelector('i');
            icon.style.transform = 'scale(1.2)';
            icon.style.opacity = '1';
        });
        
        chart.addEventListener('mouseleave', function() {
            const icon = this.querySelector('i');
            icon.style.transform = 'scale(1)';
            icon.style.opacity = '0.6';
        });
    });
}

/**
 * Show a toast message
 */
function showToast(message) {
    // Check if toast container exists
    let toastContainer = document.querySelector('.toast-container');
    
    if (!toastContainer) {
        // Create toast container if it doesn't exist
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
        
        // Add CSS for toast container
        const style = document.createElement('style');
        style.textContent = `
            .toast-container {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 1000;
            }
            .toast {
                background-color: var(--card-bg, #fff);
                color: var(--text-primary, #2a3547);
                border-left: 4px solid var(--primary-color, #4a6cfa);
                padding: 12px 20px;
                border-radius: 4px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                margin-top: 10px;
                transition: transform 0.3s, opacity 0.3s;
                transform: translateX(100%);
                opacity: 0;
            }
            .toast.show {
                transform: translateX(0);
                opacity: 1;
            }
            [data-theme="dark"] .toast {
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            }
        `;
        document.head.appendChild(style);
    }
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    
    // Add to container
    toastContainer.appendChild(toast);
    
    // Show with animation
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Remove after timeout
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

/**
 * Add a simple animation for the team and stats sections
 */
window.addEventListener('scroll', function() {
    // Animation for stat cards
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach((card, index) => {
        if (isElementInViewport(card)) {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100 * index);
        }
    });
    
    // Animation for team members
    const teamMembers = document.querySelectorAll('.team-member');
    teamMembers.forEach((member, index) => {
        if (isElementInViewport(member)) {
            setTimeout(() => {
                member.style.opacity = '1';
                member.style.transform = 'translateY(0)';
            }, 100 * index);
        }
    });
});

/**
 * Check if an element is in the viewport
 */
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Add initial styles for animation
document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.textContent = `
        .stat-card, .team-member {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.5s, transform 0.5s;
        }
    `;
    document.head.appendChild(style);
});

function applyTheme() {
    const theme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    themeToggle.innerHTML = theme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
  }

  themeToggle.addEventListener('click', () => {
    const current = localStorage.getItem('theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', next);
    applyTheme();
  });
