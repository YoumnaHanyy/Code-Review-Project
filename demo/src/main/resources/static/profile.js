// Main JavaScript file for the PRTracker Profile page

document.addEventListener('DOMContentLoaded', function() {
    // Initialize components
    initializeEditProfileButton();
    initializeStatisticsAnimation();
    initializeActivityFiltering();
    initializeResponsiveLayout();
});

// Handle the edit profile button click
function initializeEditProfileButton() {
    const editButton = document.querySelector('.edit-button');
    if (editButton) {
        editButton.addEventListener('click', function() {
            // Create modal for editing profile
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>Edit Profile</h2>
                        <button class="close-button">&times;</button>
                    </div>
                    <div class="modal-body">
                        <form id="profileForm">
                            <div class="form-group">
                                <label for="fullName">Full Name</label>
                                <input type="text" id="fullName" value="John Doe">
                            </div>
                            <div class="form-group">
                                <label for="jobTitle">Job Title</label>
                                <input type="text" id="jobTitle" value="Senior Software Engineer">
                            </div>
                            <div class="form-group">
                                <label for="email">Email</label>
                                <input type="email" id="email" value="john.doe@company.com">
                            </div>
                            <div class="form-group">
                                <label for="avatarColor">Avatar Color</label>
                                <input type="color" id="avatarColor" value="#1E90FF">
                            </div>
                            <div class="button-group">
                                <button type="button" class="cancel-button">Cancel</button>
                                <button type="submit" class="save-button">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);

            // Add modal styles
            const style = document.createElement('style');
            style.textContent = `
                .modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.7);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                }
                .modal-content {
                    background-color: var(--card-bg);
                    border-radius: var(--border-radius);
                    width: 500px;
                    max-width: 90%;
                }
                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 15px 20px;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                }
                .modal-header h2 {
                    margin: 0;
                }
                .close-button {
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    color: var(--secondary-text);
                }
                .modal-body {
                    padding: 20px;
                }
                .form-group {
                    margin-bottom: 15px;
                }
                .form-group label {
                    display: block;
                    margin-bottom: 5px;
                    color: var(--secondary-text);
                }
                .form-group input {
                    width: 100%;
                    padding: 8px 12px;
                    border-radius: var(--border-radius);
                    background-color: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    color: var(--text-color);
                }
                .button-group {
                    display: flex;
                    justify-content: flex-end;
                    gap: 10px;
                    margin-top: 20px;
                }
                .cancel-button, .save-button {
                    padding: 8px 15px;
                    border-radius: var(--border-radius);
                    cursor: pointer;
                    border: none;
                }
                .cancel-button {
                    background-color: rgba(255, 255, 255, 0.1);
                    color: var(--text-color);
                }
                .save-button {
                    background-color: var(--primary-color);
                    color: white;
                }
            `;
            document.head.appendChild(style);

            // Handle form events
            const closeButton = modal.querySelector('.close-button');
            const cancelButton = modal.querySelector('.cancel-button');
            const form = modal.querySelector('#profileForm');

            closeButton.addEventListener('click', () => {
                document.body.removeChild(modal);
            });

            cancelButton.addEventListener('click', () => {
                document.body.removeChild(modal);
            });

            form.addEventListener('submit', (e) => {
                e.preventDefault();
                
                // Update profile information
                const profileName = document.querySelector('.profile-info h1');
                const profileTitle = document.querySelector('.profile-info p:first-of-type');
                const profileEmail = document.querySelector('.profile-info p:last-of-type');
                
                profileName.textContent = document.getElementById('fullName').value;
                profileTitle.textContent = document.getElementById('jobTitle').value;
                profileEmail.textContent = document.getElementById('email').value;
                
                // Update avatar color and initials
                const avatar = document.querySelector('.profile-avatar');
                avatar.style.backgroundColor = document.getElementById('avatarColor').value;
                
                // Update avatar initials based on new name
                const nameParts = document.getElementById('fullName').value.split(' ');
                if (nameParts.length >= 2) {
                    avatar.textContent = nameParts[0][0] + nameParts[1][0];
                } else if (nameParts.length === 1) {
                    avatar.textContent = nameParts[0][0];
                }
                
                // Close modal
                document.body.removeChild(modal);
                
                // Show success notification
                showNotification('Profile updated successfully!');
            });
        });
    }
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Add notification styles
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: var(--primary-color);
            color: white;
            padding: 12px 20px;
            border-radius: var(--border-radius);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 1000;
            animation: slideIn 0.3s ease-out, fadeOut 0.3s ease-in 2.7s forwards;
        }
        
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            document.body.removeChild(notification);
        }
    }, 3000);
}

// Animate statistics when they come into view
function initializeStatisticsAnimation() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    // Simple animation for numbers
    statNumbers.forEach(statElement => {
        const finalValue = parseFloat(statElement.textContent);
        let startValue = 0;
        const duration = 1500; // milliseconds
        const frameRate = 20; // ms per frame
        const totalFrames = duration / frameRate;
        let currentFrame = 0;
        
        statElement.textContent = '0';
        
        const increment = finalValue / totalFrames;
        
        // If percentage, animate differently
        const isPercentage = statElement.textContent.includes('%');
        
        const timer = setInterval(() => {
            currentFrame++;
            startValue += increment;
            
            if (currentFrame === totalFrames) {
                clearInterval(timer);
                statElement.textContent = isPercentage ? finalValue + '%' : finalValue;
            } else {
                statElement.textContent = isPercentage ? 
                    Math.round(startValue) + '%' : 
                    Number.isInteger(finalValue) ? 
                        Math.round(startValue) : 
                        startValue.toFixed(1);
            }
        }, frameRate);
    });
}

// Enable filtering of activity items
function initializeActivityFiltering() {
    // Create filter buttons
    const activitySection = document.querySelector('.profile-section:nth-of-type(2)');
    const sectionTitle = activitySection.querySelector('.section-title');
    
    const filterContainer = document.createElement('div');
    filterContainer.className = 'filter-container';
    filterContainer.innerHTML = `
        <button class="filter-button active" data-filter="all">All</button>
        <button class="filter-button" data-filter="created">Created</button>
        <button class="filter-button" data-filter="reviewed">Reviewed</button>
        <button class="filter-button" data-filter="commented">Comments</button>
    `;
    
    sectionTitle.appendChild(filterContainer);
    
    // Add filter styles
    const style = document.createElement('style');
    style.textContent = `
        .filter-container {
            display: flex;
            gap: 10px;
            margin-left: auto;
        }
        
        .filter-button {
            background-color: rgba(255, 255, 255, 0.05);
            border: none;
            padding: 5px 10px;
            border-radius: var(--border-radius);
            color: var(--secondary-text);
            cursor: pointer;
            font-size: 12px;
        }
        
        .filter-button.active {
            background-color: rgba(30, 144, 255, 0.2);
            color: var(--primary-color);
        }
        
        .section-title {
            justify-content: space-between;
        }
    `;
    document.head.appendChild(style);
    
    // Handle filter clicks
    const filterButtons = document.querySelectorAll('.filter-button');
    const activityItems = document.querySelectorAll('.activity-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const filter = button.getAttribute('data-filter');
            
            // Filter activity items
            activityItems.forEach(item => {
                if (filter === 'all') {
                    item.style.display = 'flex';
                } else {
                    const activityType = item.querySelector('.activity-details p').textContent.toLowerCase();
                    
                    if (filter === 'created' && activityType.includes('created')) {
                        item.style.display = 'flex';
                    } else if (filter === 'reviewed' && activityType.includes('approved')) {
                        item.style.display = 'flex';
                    } else if (filter === 'commented' && activityType.includes('commented')) {
                        item.style.display = 'flex';
                    } else {
                        item.style.display = 'none';
                    }
                }
            });
        });
    });
}

// Responsive layout adjustments
function initializeResponsiveLayout() {
    // Add media queries for responsive design
    const style = document.createElement('style');
    style.textContent = `
        @media (max-width: 1024px) {
            .profile-stats, .teams-grid {
                grid-template-columns: repeat(2, 1fr);
            }
        }
        
        @media (max-width: 768px) {
            .nav-links {
                display: none;
            }
            
            .navbar::after {
                content: '☰';
                font-size: 24px;
                margin-left: auto;
                cursor: pointer;
            }
            
            .profile-header {
                flex-direction: column;
                align-items: flex-start;
            }
            
            .profile-avatar {
                margin-bottom: 20px;
            }
            
            .section-title {
                flex-direction: column;
                align-items: flex-start;
            }
            
            .edit-button, .filter-container {
                margin-left: 0;
                margin-top: 10px;
            }
        }
        
        @media (max-width: 480px) {
            .profile-stats, .teams-grid {
                grid-template-columns: 1fr;
            }
            
            .activity-item {
                flex-direction: column;
                align-items: flex-start;
            }
            
            .activity-icon {
                margin-bottom: 10px;
            }
            
            .activity-time {
                margin-top: 5px;
                align-self: flex-end;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Toggle mobile menu
    const navbar = document.querySelector('.navbar');
    navbar.addEventListener('click', function(e) {
        if (e.target === this && window.innerWidth <= 768) {
            const navLinks = document.querySelector('.nav-links');
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
            
            if (navLinks.style.display === 'flex') {
                navLinks.style.position = 'absolute';
                navLinks.style.top = '60px';
                navLinks.style.left = '0';
                navLinks.style.flexDirection = 'column';
                navLinks.style.width = '100%';
                navLinks.style.backgroundColor = 'var(--dark-bg)';
                navLinks.style.padding = '15px';
                navLinks.style.zIndex = '100';
            }
        }
    });
}