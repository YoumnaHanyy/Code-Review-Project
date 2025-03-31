
document.addEventListener('DOMContentLoaded', function() {
    // Post form interactions
    const postForm = document.querySelector('.post-form');
    const postInput = document.querySelector('.post-input');
    const postButton = document.querySelector('.post-btn');

    postInput.addEventListener('focus', function() {
        postForm.classList.add('active');
    });

    postInput.addEventListener('blur', function() {
        if (postInput.value.trim() === '') {
            postForm.classList.remove('active');
        }
    });

    postButton.addEventListener('click', function() {
        if (postInput.value.trim() !== '') {
            showNotification('Post shared successfully!', 'success');
            postInput.value = '';
            postForm.classList.remove('active');
        } else {
            showNotification('Please write something before posting.', 'error');
        }
    });

    // Code attachment button
    const codeAttachBtn = document.querySelector('.attach-btn:nth-child(1)');
    codeAttachBtn.addEventListener('click', function() {
        showNotification('Code editor opened', 'info');
        // Here you would typically open a code editor modal
    });

    // Image attachment button
    const imageAttachBtn = document.querySelector('.attach-btn:nth-child(2)');
    imageAttachBtn.addEventListener('click', function() {
        showNotification('Image uploader opened', 'info');
        // Here you would typically open an image upload modal
    });

    // Link attachment button
    const linkAttachBtn = document.querySelector('.attach-btn:nth-child(3)');
    linkAttachBtn.addEventListener('click', function() {
        const url = prompt('Enter a URL:');
        if (url) {
            showNotification('Link added to your post', 'success');
        }
    });

    // Gist attachment button
    const gistAttachBtn = document.querySelector('.attach-btn:nth-child(4)');
    gistAttachBtn.addEventListener('click', function() {
        showNotification('Gist embedding opened', 'info');
        // Here you would typically open a gist embedding modal
    });

    // Filter tabs functionality
    const filterTabs = document.querySelectorAll('.filter-tab');
    
    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            filterTabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            showNotification(`Showing ${this.textContent} posts`, 'info');
        });
    });

    // Post like, comment, and request buttons
    setupPostInteractions('1');
    setupPostInteractions('2');

    // Code block copy buttons
    const copyButtons = document.querySelectorAll('.code-action-btn:nth-child(1)');
    
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const codeBlock = this.closest('.code-block').querySelector('pre').textContent;
            navigator.clipboard.writeText(codeBlock)
                .then(() => {
                    showNotification('Code copied to clipboard!', 'success');
                })
                .catch(() => {
                    showNotification('Failed to copy code', 'error');
                });
        });
    });

    // Code block expand buttons
    const expandButtons = document.querySelectorAll('.code-action-btn:nth-child(2)');
    
    expandButtons.forEach(button => {
        button.addEventListener('click', function() {
            const codeBlock = this.closest('.code-block');
            codeBlock.classList.toggle('expanded');
            
            const icon = this.querySelector('i');
            if (codeBlock.classList.contains('expanded')) {
                icon.classList.remove('fa-expand');
                icon.classList.add('fa-compress');
                showNotification('Code expanded', 'info');
            } else {
                icon.classList.remove('fa-compress');
                icon.classList.add('fa-expand');
                showNotification('Code collapsed', 'info');
            }
        });
    });

    // Challenge buttons
    const challengeButtons = document.querySelectorAll('.challenge-btn');
    
    challengeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const challengeTitle = this.closest('.challenge-card').querySelector('.challenge-title').textContent;
            showNotification(`Starting ${challengeTitle}`, 'success');
        });
    });

    // Search functionality
    const searchInput = document.querySelector('.search-bar input');
    
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const searchTerm = this.value.trim();
            if (searchTerm !== '') {
                showNotification(`Searching for "${searchTerm}"`, 'info');
                // Here you would typically perform a search
                this.value = '';
            }
        }
    });

    // Comment submission
    const commentSubmitButtons = document.querySelectorAll('.comment-submit');
    
    commentSubmitButtons.forEach(button => {
        button.addEventListener('click', function() {
            const commentInput = this.closest('.comment-input-container').querySelector('.comment-input');
            const commentText = commentInput.value.trim();
            
            if (commentText !== '') {
                const commentsSection = this.closest('.comments-section');
                const postId = commentsSection.id.split('-')[1];
                
                // Create new comment element
                const newComment = document.createElement('div');
                newComment.className = 'comment';
                newComment.innerHTML = `
                    <img src="/api/placeholder/320/320" alt="Your profile">
                    <div class="comment-content">
                        <div class="comment-user">You</div>
                        <div class="comment-text">${commentText}</div>
                        <div class="comment-actions">
                            <div class="comment-action">Like</div>
                            <div class="comment-action">Reply</div>
                            <div class="comment-action">Just now</div>
                        </div>
                    </div>
                `;
                
                // Insert new comment before the next comment form
                commentsSection.appendChild(newComment);
                
                // Clear input
                commentInput.value = '';
                
                showNotification('Comment posted!', 'success');
            } else {
                showNotification('Please write a comment first', 'error');
            }
        });
    });

    // Setup functions
    function setupPostInteractions(postId) {
        const likeBtn = document.getElementById(`like-btn-${postId}`);
        const commentBtn = document.getElementById(`comment-btn-${postId}`);
        const requestBtn = document.getElementById(`request-btn-${postId}`);
        const commentsSection = document.getElementById(`comments-${postId}`);
        
        // Like button
        likeBtn.addEventListener('click', function() {
            const likeIcon = this.querySelector('i');
            
            if (likeIcon.classList.contains('far')) {
                likeIcon.classList.remove('far');
                likeIcon.classList.add('fas');
                this.classList.add('liked');
                showNotification('Post liked!', 'success');
            } else {
                likeIcon.classList.remove('fas');
                likeIcon.classList.add('far');
                this.classList.remove('liked');
                showNotification('Post unliked', 'info');
            }
        });
        
        // Comment button
        commentBtn.addEventListener('click', function() {
            if (commentsSection.style.display === 'none') {
                commentsSection.style.display = 'block';
                commentsSection.querySelector('.comment-input').focus();
            } else {
                commentsSection.style.display = 'none';
            }
        });
        
        // Request button
        requestBtn.addEventListener('click', function() {
            showModificationRequestModal(postId);
        });
    }

    // Notification system
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const icon = document.createElement('i');
        switch (type) {
            case 'success':
                icon.className = 'fas fa-check-circle';
                break;
            case 'error':
                icon.className = 'fas fa-exclamation-circle';
                break;
            case 'info':
                icon.className = 'fas fa-info-circle';
                break;
            default:
                icon.className = 'fas fa-bell';
        }
        
        notification.appendChild(icon);
        
        const textSpan = document.createElement('span');
        textSpan.textContent = message;
        notification.appendChild(textSpan);
        
        const closeBtn = document.createElement('button');
        closeBtn.className = 'notification-close';
        closeBtn.innerHTML = '&times;';
        closeBtn.addEventListener('click', function() {
            notification.classList.add('hiding');
            setTimeout(() => {
                notification.remove();
            }, 300);
        });
        notification.appendChild(closeBtn);
        
        // If notifications container doesn't exist, create it
        let notificationsContainer = document.getElementById('notifications-container');
        if (!notificationsContainer) {
            notificationsContainer = document.createElement('div');
            notificationsContainer.id = 'notifications-container';
            document.body.appendChild(notificationsContainer);
        }
        
        notificationsContainer.appendChild(notification);
        
        // Add the 'showing' class after a small delay to trigger the animation
        setTimeout(() => {
            notification.classList.add('showing');
        }, 10);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode === notificationsContainer) {
                notification.classList.add('hiding');
                setTimeout(() => {
                    if (notification.parentNode === notificationsContainer) {
                        notification.remove();
                    }
                }, 300);
            }
        }, 5000);
    }

    // Modification request modal
    function showModificationRequestModal(postId) {
        // Create modal overlay
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        
        // Create modal content
        const modal = document.createElement('div');
        modal.className = 'modal';
        
        modal.innerHTML = `
            <div class="modal-header">
                <h3>Request Code Modification</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <p>Describe the changes you'd like to suggest:</p>
                <textarea class="modal-textarea" placeholder="I suggest modifying..."></textarea>
                <div class="modal-options">
                    <label>
                        <input type="checkbox" checked> Include snippet from original code
                    </label>
                    <label>
                        <input type="checkbox"> Offer to implement the change
                    </label>
                </div>
            </div>
            <div class="modal-footer">
                <button class="modal-cancel">Cancel</button>
                <button class="modal-submit">Submit Request</button>
            </div>
        `;
        
        // Append modal to overlay, and overlay to body
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
        
        // Add closing functionality
        const closeBtn = modal.querySelector('.modal-close');
        const cancelBtn = modal.querySelector('.modal-cancel');
        const submitBtn = modal.querySelector('.modal-submit');
        const textarea = modal.querySelector('.modal-textarea');
        
        function closeModal() {
            overlay.classList.add('hiding');
            setTimeout(() => {
                overlay.remove();
            }, 300);
        }
        
        closeBtn.addEventListener('click', closeModal);
        cancelBtn.addEventListener('click', closeModal);
        
        // Add submit functionality
        submitBtn.addEventListener('click', function() {
            const requestText = textarea.value.trim();
            if (requestText !== '') {
                showNotification('Modification request submitted!', 'success');
                closeModal();
            } else {
                showNotification('Please describe your request first', 'error');
            }
        });
        
        // Focus textarea
        textarea.focus();
        
        // Add showing class to trigger animation
        setTimeout(() => {
            overlay.classList.add('showing');
        }, 10);
    }

    // Initialize sidebar menu functionality
    const menuItems = document.querySelectorAll('.menu-item');
    
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all menu items
            menuItems.forEach(i => i.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            const menuText = this.textContent.trim();
            showNotification(`Navigated to ${menuText}`, 'info');
        });
    });

    // Initialize navigation links
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all nav links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            const linkText = this.textContent.trim();
            showNotification(`Switched to ${linkText}`, 'info');
        });
    });

    // User action buttons (plus, messages)
    const plusBtn = document.querySelector('.user-actions .icon-btn:nth-child(1)');
    plusBtn.addEventListener('click', function() {
        showNotification('Create new content', 'info');
    });
    
    const messagesBtn = document.querySelector('.user-actions .icon-btn:nth-child(2)');
    messagesBtn.addEventListener('click', function() {
        showNotification('Messages opened', 'info');
    });
});
document.addEventListener('DOMContentLoaded', function() {
    // Theme toggle functionality - FIXED
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const themeIcon = themeToggle.querySelector('i');

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-theme');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }

    // Toggle theme when button is clicked
    themeToggle.addEventListener('click', function() {
        body.classList.toggle('dark-theme');
        
        if (body.classList.contains('dark-theme')) {
            localStorage.setItem('theme', 'dark');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            localStorage.setItem('theme', 'light');
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
        
        showNotification('Theme updated', 'info');
    });

    // Post form interactions
    const postForm = document.querySelector('.post-form');
    const postInput = document.querySelector('.post-input');
    const postButton = document.querySelector('.post-btn');

    postInput.addEventListener('focus', function() {
        postForm.classList.add('active');
    });

    postInput.addEventListener('blur', function() {
        if (postInput.value.trim() === '') {
            postForm.classList.remove('active');
        }
    });

    postButton.addEventListener('click', function() {
        if (postInput.value.trim() !== '') {
            showNotification('Post shared successfully!', 'success');
            postInput.value = '';
            postForm.classList.remove('active');
        } else {
            showNotification('Please write something before posting.', 'error');
        }
    });

    // Code attachment button
    const codeAttachBtn = document.querySelector('.attach-btn:nth-child(1)');
    codeAttachBtn.addEventListener('click', function() {
        showCodeEditorModal();
    });

    // Image attachment button
    const imageAttachBtn = document.querySelector('.attach-btn:nth-child(2)');
    imageAttachBtn.addEventListener('click', function() {
        showImageUploaderModal();
    });

    // Link attachment button
    const linkAttachBtn = document.querySelector('.attach-btn:nth-child(3)');
    linkAttachBtn.addEventListener('click', function() {
        showLinkModal();
    });

    // Gist attachment button
    const gistAttachBtn = document.querySelector('.attach-btn:nth-child(4)');
    gistAttachBtn.addEventListener('click', function() {
        showGistModal();
    });

    // Filter tabs functionality - ENHANCED
    const filterTabs = document.querySelectorAll('.filter-tab');
    const feed = document.querySelector('.feed');
    const postCards = document.querySelectorAll('.post-card');
    
    // Sample data for demonstration
    const postsData = {
        recent: Array.from(postCards),
        popular: [],
        following: [],
        urgent: []
    };
    
    // Create sample posts for Popular, Following, and Urgent
    function createSamplePosts() {
        // Create Popular Posts
        const popularPost1 = createSamplePost(
            'Lisa Johnson', 
            'DevOps Engineer', 
            '6h ago',
            'Docker',
            'Help with Docker compose networking issue?',
            'docker-compose',
            'I\'m trying to get multiple containers to communicate but running into networking issues. Here\'s my config:',
            65, 18, 5, 230
        );
        
        const popularPost2 = createSamplePost(
            'Jake Davidson', 
            'Security Expert', 
            '1d ago',
            'Security',
            'Best practices for API authentication?',
            'javascript',
            'I\'m building a REST API and need to implement proper authentication. Currently using JWT but have some concerns:',
            95, 30, 8, 450
        );
        
        postsData.popular.push(popularPost1, popularPost2);
        
        // Create Following Posts
        const followingPost1 = createSamplePost(
            'Julia Lee', 
            'Senior Developer', 
            '3h ago',
            'Testing',
            'Unit testing approach for React components',
            'react',
            'I\'ve been refining my testing strategy for React components. Here\'s what I\'ve found works well:',
            42, 7, 0, 120
        );
        
        const followingPost2 = createSamplePost(
            'Michael Wong', 
            'Full Stack Engineer', 
            '12h ago',
            'GraphQL',
            'Optimizing GraphQL queries for complex data',
            'graphql',
            'When working with deeply nested data structures in GraphQL, I\'ve developed these patterns:',
            36, 12, 2, 145
        );
        
        postsData.following.push(followingPost1, followingPost2);
        
        // Create Urgent Posts
        const urgentPost1 = createSamplePost(
            'Taylor Swift', 
            'Backend Developer', 
            '20m ago',
            'URGENT',
            'Production down! Redis connection issue',
            'redis',
            'Our production environment is down due to Redis connection failures. I\'ve tried:',
            8, 22, 14, 67,
            'urgent'
        );
        
        const urgentPost2 = createSamplePost(
            'Ryan Garcia', 
            'DevOps Engineer', 
            '40m ago',
            'URGENT',
            'Critical security vulnerability in our npm package',
            'javascript',
            'Just discovered a critical security vulnerability in the dependency we\'re using. Need urgent advice on:',
            12, 18, 10, 89,
            'urgent'
        );
        
        postsData.urgent.push(urgentPost1, urgentPost2);
    }
    
    // Create a sample post with the given data
    function createSamplePost(userName, userRole, time, tag, title, language, content, likes, comments, requests, views, urgency = '') {
        const post = document.createElement('div');
        post.className = `post-card ${urgency}`;
        
        post.innerHTML = `
            <div class="post-header">
                <div class="user-info">
                    <img src="/api/placeholder/320/320" alt="${userName}">
                    <div class="user-text">
                        <div class="user-name">${userName}</div>
                        <div class="post-meta">
                            <span>${userRole}</span>
                            <span class="dot">•</span>
                            <span>${time}</span>
                            <span class="post-tag">${tag}</span>
                        </div>
                    </div>
                </div>
                <button class="post-menu"><i class="fas fa-ellipsis-h"></i></button>
            </div>
            <div class="post-content">
                <p>${title}</p>
                <div class="code-block">
                    <div class="code-header">
                        <div class="language-tag">
                            <i class="fab fa-${language}"></i> ${language.charAt(0).toUpperCase() + language.slice(1)}
                        </div>
                        <div class="code-actions">
                            <button class="code-action-btn"><i class="fas fa-copy"></i></button>
                            <button class="code-action-btn"><i class="fas fa-expand"></i></button>
                        </div>
                    </div>
                    <pre><span class="line-numbers">1</span>${content}</pre>
                </div>
            </div>
            <div class="post-stats">
                <div>${likes} Likes • ${comments} Comments • ${requests} Requests</div>
                <div>Viewed ${views} times</div>
            </div>
            <div class="post-actions-menu">
                <button class="action-btn">
                    <i class="far fa-thumbs-up"></i> Like
                </button>
                <button class="action-btn">
                    <i class="far fa-comment"></i> Comment
                </button>
                <button class="action-btn">
                    <i class="far fa-edit"></i> Request modification
                </button>
            </div>
            <div class="comments-section" style="display: none;">
                <div class="comment-form">
                    <img src="/api/placeholder/320/320" alt="Your profile">
                    <div class="comment-input-container">
                        <input type="text" class="comment-input" placeholder="Write a comment...">
                        <button class="comment-submit"><i class="fas fa-paper-plane"></i></button>
                    </div>
                </div>
            </div>
        `;
        
        // Add event listeners to the new buttons
        setupPostInteractionsForElement(post);
        
        return post;
    }
    
    // Create sample posts at startup
    createSamplePosts();
    
    // Initialize filter tabs
    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            filterTabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Get the filter type
            const filterType = this.textContent.toLowerCase();
            
            // Clear the feed (except for the post form and filter tabs)
            const feedChildren = Array.from(feed.children);
            feedChildren.forEach(child => {
                if (!child.classList.contains('post-form') && !child.classList.contains('filter-tabs')) {
                    child.remove();
                }
            });
            
            // Add appropriate posts based on filter
            if (postsData[filterType]) {
                postsData[filterType].forEach(post => {
                    // Clone the post to avoid removing it from the original array
                    const postClone = post.cloneNode(true);
                    feed.appendChild(postClone);
                    
                    // Re-add event listeners to the cloned post
                    setupPostInteractionsForElement(postClone);
                });
            }
            
            showNotification(`Showing ${this.textContent} posts`, 'info');
        });
    });

    // Post like, comment, and request buttons for existing posts
    setupPostInteractions('1');
    setupPostInteractions('2');

    // Code block copy buttons
    const copyButtons = document.querySelectorAll('.code-action-btn:nth-child(1)');
    
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const codeBlock = this.closest('.code-block').querySelector('pre').textContent;
            navigator.clipboard.writeText(codeBlock)
                .then(() => {
                    showNotification('Code copied to clipboard!', 'success');
                })
                .catch(() => {
                    showNotification('Failed to copy code', 'error');
                });
        });
    });

    // Code block expand buttons
    const expandButtons = document.querySelectorAll('.code-action-btn:nth-child(2)');
    
    expandButtons.forEach(button => {
        button.addEventListener('click', function() {
            const codeBlock = this.closest('.code-block');
            codeBlock.classList.toggle('expanded');
            
            const icon = this.querySelector('i');
            if (codeBlock.classList.contains('expanded')) {
                icon.classList.remove('fa-expand');
                icon.classList.add('fa-compress');
                showNotification('Code expanded', 'info');
            } else {
                icon.classList.remove('fa-compress');
                icon.classList.add('fa-expand');
                showNotification('Code collapsed', 'info');
            }
        });
    });

    // Challenge buttons
    const challengeButtons = document.querySelectorAll('.challenge-btn');
    
    challengeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const challengeTitle = this.closest('.challenge-card').querySelector('.challenge-title').textContent;
            showNotification(`Starting ${challengeTitle}`, 'success');
        });
    });

    // Search functionality
    const searchInput = document.querySelector('.search-bar input');
    
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const searchTerm = this.value.trim();
            if (searchTerm !== '') {
                showNotification(`Searching for "${searchTerm}"`, 'info');
                // Here you would typically perform a search
                this.value = '';
            }
        }
    });

    // Comment submission
    const commentSubmitButtons = document.querySelectorAll('.comment-submit');
    
    commentSubmitButtons.forEach(button => {
        button.addEventListener('click', function() {
            submitComment(this);
        });
    });

    // Initialize sidebar menu functionality
    const menuItems = document.querySelectorAll('.menu-item');
    
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all menu items
            menuItems.forEach(i => i.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            const menuText = this.textContent.trim();
            showNotification(`Navigated to ${menuText}`, 'info');
        });
    });

    // Initialize navigation links
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all nav links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            const linkText = this.textContent.trim();
            showNotification(`Switched to ${linkText}`, 'info');
        });
    });

    // User action buttons (plus, messages) - ENHANCED
    const plusBtn = document.querySelector('.user-actions .icon-btn:nth-child(1)');
    plusBtn.addEventListener('click', function() {
        showCreateMenu(this);
    });
    
    // Messages functionality - ENHANCED
    const messagesBtn = document.querySelector('.user-actions .icon-btn:nth-child(2)');
    messagesBtn.addEventListener('click', function() {
        toggleMessagesPanel();
    });

    // Setup functions
    function setupPostInteractions(postId) {
        const likeBtn = document.getElementById(`like-btn-${postId}`);
        const commentBtn = document.getElementById(`comment-btn-${postId}`);
        const requestBtn = document.getElementById(`request-btn-${postId}`);
        const commentsSection = document.getElementById(`comments-${postId}`);
        
        if (!likeBtn || !commentBtn || !requestBtn || !commentsSection) return;
        
        // Like button
        likeBtn.addEventListener('click', function() {
            const likeIcon = this.querySelector('i');
            
            if (likeIcon.classList.contains('far')) {
                likeIcon.classList.remove('far');
                likeIcon.classList.add('fas');
                this.classList.add('liked');
                showNotification('Post liked!', 'success');
            } else {
                likeIcon.classList.remove('fas');
                likeIcon.classList.add('far');
                this.classList.remove('liked');
                showNotification('Post unliked', 'info');
            }
        });
        
        // Comment button
        commentBtn.addEventListener('click', function() {
            if (commentsSection.style.display === 'none') {
                commentsSection.style.display = 'block';
                commentsSection.querySelector('.comment-input').focus();
            } else {
                commentsSection.style.display = 'none';
            }
        });
        
        // Request button
        requestBtn.addEventListener('click', function() {
            showModificationRequestModal(postId);
        });
    }
    
    function setupPostInteractionsForElement(postElement) {
        // Like button
        const likeBtn = postElement.querySelector('.action-btn:nth-child(1)');
        if (likeBtn) {
            likeBtn.addEventListener('click', function() {
                const likeIcon = this.querySelector('i');
                
                if (likeIcon.classList.contains('far')) {
                    likeIcon.classList.remove('far');
                    likeIcon.classList.add('fas');
                    this.classList.add('liked');
                    showNotification('Post liked!', 'success');
                } else {
                    likeIcon.classList.remove('fas');
                    likeIcon.classList.add('far');
                    this.classList.remove('liked');
                    showNotification('Post unliked', 'info');
                }
            });
        }
        
        // Comment button
        const commentBtn = postElement.querySelector('.action-btn:nth-child(2)');
        const commentsSection = postElement.querySelector('.comments-section');
        
        if (commentBtn && commentsSection) {
            commentBtn.addEventListener('click', function() {
                if (commentsSection.style.display === 'none') {
                    commentsSection.style.display = 'block';
                    commentsSection.querySelector('.comment-input').focus();
                } else {
                    commentsSection.style.display = 'none';
                }
            });
        }
        
        // Request button
        const requestBtn = postElement.querySelector('.action-btn:nth-child(3)');
        if (requestBtn) {
            requestBtn.addEventListener('click', function() {
                showModificationRequestModal('dynamic');
            });
        }
        
        // Code action buttons
        const copyBtn = postElement.querySelector('.code-action-btn:nth-child(1)');
        if (copyBtn) {
            copyBtn.addEventListener('click', function() {
                const codeBlock = this.closest('.code-block').querySelector('pre').textContent;
                navigator.clipboard.writeText(codeBlock)
                    .then(() => {
                        showNotification('Code copied to clipboard!', 'success');
                    })
                    .catch(() => {
                        showNotification('Failed to copy code', 'error');
                    });
            });
        }
        
        const expandBtn = postElement.querySelector('.code-action-btn:nth-child(2)');
        if (expandBtn) {
            expandBtn.addEventListener('click', function() {
                const codeBlock = this.closest('.code-block');
                codeBlock.classList.toggle('expanded');
                
                const icon = this.querySelector('i');
                if (codeBlock.classList.contains('expanded')) {
                    icon.classList.remove('fa-expand');
                    icon.classList.add('fa-compress');
                    showNotification('Code expanded', 'info');
                } else {
                    icon.classList.remove('fa-compress');
                    icon.classList.add('fa-expand');
                    showNotification('Code collapsed', 'info');
                }
            });
        }
        
        // Comment submit button
        const commentSubmitBtn = postElement.querySelector('.comment-submit');
        if (commentSubmitBtn) {
            commentSubmitBtn.addEventListener('click', function() {
                submitComment(this);
            });
        }
    }
    
    function submitComment(buttonElement) {
        const commentInput = buttonElement.closest('.comment-input-container').querySelector('.comment-input');
        const commentText = commentInput.value.trim();
        
        if (commentText !== '') {
            const commentsSection = buttonElement.closest('.comments-section');
            
            // Create new comment element
            const newComment = document.createElement('div');
            newComment.className = 'comment';
            newComment.innerHTML = `
                <img src="/api/placeholder/320/320" alt="Your profile">
                <div class="comment-content">
                    <div class="comment-user">You</div>
                    <div class="comment-text">${commentText}</div>
                    <div class="comment-actions">
                        <div class="comment-action">Like</div>
                        <div class="comment-action">Reply</div>
                        <div class="comment-action">Just now</div>
                    </div>
                </div>
            `;
            
            // Insert new comment before the next comment form
            commentsSection.appendChild(newComment);
            
            // Clear input
            commentInput.value = '';
            
            showNotification('Comment posted!', 'success');
        } else {
            showNotification('Please write a comment first', 'error');
        }
    }

    // Enhanced Messages System - NEW
    function toggleMessagesPanel() {
        let messagesPanel = document.getElementById('messages-panel');
        
        if (messagesPanel) {
            // Panel exists, toggle it
            messagesPanel.classList.toggle('hidden');
            
            if (!messagesPanel.classList.contains('hidden')) {
                // Focus on the input field when panel is shown
                const inputField = messagesPanel.querySelector('.messages-input');
                if (inputField) inputField.focus();
                showNotification('Messages opened', 'info');
            } else {
                showNotification('Messages closed', 'info');
            }
        } else {
            // Create panel
            messagesPanel = document.createElement('div');
            messagesPanel.id = 'messages-panel';
            messagesPanel.className = 'messages-panel';
            
            messagesPanel.innerHTML = `
                <div class="messages-header">
                    <h3>Messages</h3>
                    <button class="messages-close"><i class="fas fa-times"></i></button>
                </div>
                <div class="messages-search">
                    <i class="fas fa-search"></i>
                    <input type="text" placeholder="Search messages">
                </div>
                <div class="messages-tabs">
                    <div class="messages-tab active">All</div>
                    <div class="messages-tab">Unread</div>
                    <div class="messages-tab">Requests</div>
                </div>
                <div class="messages-list">
                    <div class="message-item unread">
                        <img src="/api/placeholder/320/320" alt="Julia Lee">
                        <div class="message-content">
                            <div class="message-name">Julia Lee</div>
                            <div class="message-text">Thanks for your help with the React issue!</div>
                            <div class="message-time">2h ago</div>
                        </div>
                    </div>
                    <div class="message-item">
                        <img src="/api/placeholder/320/320" alt="Michael Wong">
                        <div class="message-content">
                            <div class="message-name">Michael Wong</div>
                            <div class="message-text">Have you looked at the PR I submitted?</div>
                            <div class="message-time">Yesterday</div>
                        </div>
                    </div>
                    <div class="message-item unread">
                        <img src="/api/placeholder/320/320" alt="Rachel Kim">
                        <div class="message-content">
                            <div class="message-name">Rachel Kim</div>
                            <div class="message-text">I found a solution to your Redux problem!</div>
                            <div class="message-time">3h ago</div>
                        </div>
                    </div>
                </div>
                <div class="messages-compose">
                    <input type="text" class="messages-input" placeholder="New message...">
                    <button class="messages-send"><i class="fas fa-paper-plane"></i></button>
                </div>
            `;
            
            document.body.appendChild(messagesPanel);
            
            // Add event listeners for messages panel
            const closeBtn = messagesPanel.querySelector('.messages-close');
            closeBtn.addEventListener('click', function() {
                messagesPanel.classList.add('hidden');
                showNotification('Messages closed', 'info');
            });
            
            const messageItems = messagesPanel.querySelectorAll('.message-item');
            messageItems.forEach(item => {
                item.addEventListener('click', function() {
                    const name = this.querySelector('.message-name').textContent;
                    openChatWithUser(name);
                });
            });
            
            const messageTabs = messagesPanel.querySelectorAll('.messages-tab');
            messageTabs.forEach(tab => {
                tab.addEventListener('click', function() {
                    messageTabs.forEach(t => t.classList.remove('active'));
                    this.classList.add('active');
                    filterMessages(this.textContent.toLowerCase());
                });
            });
            
            const sendBtn = messagesPanel.querySelector('.messages-send');
            const messageInput = messagesPanel.querySelector('.messages-input');
            
            sendBtn.addEventListener('click', function() {
                sendMessage(messageInput.value);
            });
            
            messageInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    sendMessage(this.value);
                }
            });
            
            // Focus on the input field
            messageInput.focus();
            
            showNotification('Messages opened', 'info');
        }
    }
    
    function filterMessages(filter) {
        const messagesPanel = document.getElementById('messages-panel');
        if (!messagesPanel) return;
        
        const messageItems = messagesPanel.querySelectorAll('.message-item');
        
        messageItems.forEach(item => {
            if (filter === 'all') {
                item.style.display = 'flex';
            } else if (filter === 'unread' && item.classList.contains('unread')) {
                item.style.display = 'flex';
            } else if (filter === 'requests' && item.classList.contains('request')) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
        
        showNotification(`Showing ${filter} messages`, 'info');
    }
    
    function openChatWithUser(name) {
        const messagesPanel = document.getElementById('messages-panel');
        if (!messagesPanel) return;
        
        // Update panel to show chat interface
        messagesPanel.innerHTML = `
            <div class="messages-header">
                <div class="chat-user-info">
                    <button class="back-to-messages"><i class="fas fa-arrow-left"></i></button>
                    <img src="/api/placeholder/320/320" alt="${name}">
                    <div>${name}</div>
                </div>
                <button class="messages-close"><i class="fas fa-times"></i></button>
            </div>
            <div class="chat-messages">
                <div class="chat-date">Today</div>
                <div class="chat-message received">
                    <div class="chat-bubble">Hey there! How's your code project going?</div>
                    <div class="chat-time">10:30 AM</div>
                </div>
                <div class="chat-message sent">
                    <div class="chat-bubble">Working on it! I'm having some issues with the React hooks though.</div>
                    <div class="chat-time">10:32 AM</div>
                </div>
                <div class="chat-message received">
                    <div class="chat-bubble">I saw your post. The problem is in your dependency array. Let me help you fix it.</div>
                    <div class="chat-time">10:35 AM</div>
                </div>
            </div>
            <div class="chat-composer">
                <button class="chat-attach"><i class="fas fa-paperclip"></i></button>
                <input type="text" class="chat-input" placeholder="Type a message...">
                <button class="chat-send"><i class="fas fa-paper-plane"></i></button>
            </div>
        `;
        
        // Add event listeners for chat interface
        const backBtn = messagesPanel.querySelector('.back-to-messages');
        backBtn.addEventListener('click', function() {
            toggleMessagesPanel();
        });
        
        const closeBtn = messagesPanel.querySelector('.messages-close');
        closeBtn.addEventListener('click', function() {
            messagesPanel.classList.add('hidden');
            showNotification('Chat closed', 'info');
        });
        
        const sendBtn = messagesPanel.querySelector('.chat-send');
        const chatInput = messagesPanel.querySelector('.chat-input');
        
        sendBtn.addEventListener('click', function() {
            sendChatMessage(chatInput.value);
        });
        
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendChatMessage(this.value);
            }
        });
        
        // Focus on the input field
        chatInput.focus();
        
        showNotification(`Chat with ${name} opened`, 'info');
    }
    
    function sendChatMessage(message) {
        if (!message.trim()) return;
        
        const chatMessages = document.querySelector('.chat-messages');
        const chatInput = document.querySelector('.chat-input');
        
        // Create new message element
        const newMessage = document.createElement('div');
        newMessage.className = 'chat-message sent';
        
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const timeStr = `${hours}:${minutes < 10 ? '0' + minutes : minutes} ${hours >= 12 ? 'PM' : 'AM'}`;
        
        newMessage.innerHTML = `
            <div class="chat-bubble">${message}</div>
            <div class="chat-time">${timeStr}</div>
        `;
        
        // Add to chat
        chatMessages.appendChild(newMessage);
        
        // Clear input
        chatInput.value = '';
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Simulate response after a delay
        setTimeout(() => {
            const responseMessage = document.createElement('div');
            responseMessage.className = 'chat-message received';
            
            responseMessage.innerHTML = `
                <div class="chat-bubble">Thanks for your message! I'll get back to you soon.</div>
                <div class="chat-time">${timeStr}</div>
            `;
            
            chatMessages.appendChild(responseMessage);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 1500);
    }
    
    function sendMessage(message) {
        if (!message.trim()) return;
        
        const messageInput = document.querySelector('.messages-input');
        
        // Clear input
        messageInput.value = '';
        
        showNotification('Message sent', 'success');
    }

    // Create Menu for Plus Button - NEW
    function showCreateMenu(buttonElement) {
        // Check if menu already exists
        let createMenu = document.getElementById('create-menu');
        
        if (createMenu) {
            // Toggle menu visibility
            createMenu.classList.toggle('hidden');
            return;
        }
        
        // Get button position
        const rect = buttonElement.getBoundingClientRect();
        
       
    } })

    document.addEventListener('DOMContentLoaded', function() {
        // Theme toggle functionality
        const themeToggle = document.getElementById('theme-toggle');
        const body = document.body;
        
        themeToggle.addEventListener('click', function() {
            body.classList.toggle('dark-mode');
            const icon = themeToggle.querySelector('i');
            
            if (body.classList.contains('dark-mode')) {
                icon.classList.replace('fa-moon', 'fa-sun');
            } else {
                icon.classList.replace('fa-sun', 'fa-moon');
            }
        });
    
        // Comments/messages section functionality
        setupCommentsSection();
        
        // Like button functionality
        setupLikeButtons();
        
        // Request modification button functionality
        setupRequestButtons();
    });
    
    function setupCommentsSection() {
        // Find all comment buttons and add click event listeners
        const commentButtons = document.querySelectorAll('[id^="comment-btn-"]');
        
        commentButtons.forEach(button => {
            const postId = button.id.split('-').pop();
            const commentsSection = document.getElementById(`comments-${postId}`);
            
            button.addEventListener('click', function() {
                // Toggle comments section visibility
                if (commentsSection.style.display === 'none') {
                    commentsSection.style.display = 'block';
                    this.classList.add('active');
                } else {
                    commentsSection.style.display = 'none';
                    this.classList.remove('active');
                }
            });
            
            // Setup comment submission for this post
            setupCommentSubmit(postId);
        });
    }
    
    function setupCommentSubmit(postId) {
        const commentsSection = document.getElementById(`comments-${postId}`);
        const commentForm = commentsSection.querySelector('.comment-form');
        const commentInput = commentForm.querySelector('.comment-input');
        const submitButton = commentForm.querySelector('.comment-submit');
        
        // Handle submit button click
        submitButton.addEventListener('click', function() {
            submitComment(postId, commentInput.value);
        });
        
        // Handle pressing Enter in the input field
        commentInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                submitComment(postId, commentInput.value);
            }
        });
    }
    
    function submitComment(postId, commentText) {
        if (!commentText.trim()) return; // Don't submit empty comments
        
        const commentsSection = document.getElementById(`comments-${postId}`);
        const commentInput = commentsSection.querySelector('.comment-input');
        
        // Create new comment element
        const newComment = document.createElement('div');
        newComment.className = 'comment';
        newComment.innerHTML = `
            <img src="/api/placeholder/320/320" alt="Your profile">
            <div class="comment-content">
                <div class="comment-user">You</div>
                <div class="comment-text">${escapeHTML(commentText)}</div>
                <div class="comment-actions">
                    <div class="comment-action">Like</div>
                    <div class="comment-action">Reply</div>
                    <div class="comment-action">Just now</div>
                </div>
            </div>
        `;
        
        // Insert new comment before the next comment form
        commentsSection.appendChild(newComment);
        
        // Clear the input field
        commentInput.value = '';
        
        // Update comment count in post stats
        updateCommentCount(postId, 1);
    }
    
    function updateCommentCount(postId, increment) {
        const postCard = document.getElementById(`comments-${postId}`).closest('.post-card');
        const statsDiv = postCard.querySelector('.post-stats div:first-child');
        
        // Parse the current stats text
        const statsText = statsDiv.textContent;
        const commentCountMatch = statsText.match(/(\d+) Comments/);
        
        if (commentCountMatch) {
            const currentCount = parseInt(commentCountMatch[1]);
            const newCount = currentCount + increment;
            
            // Replace the old count with the new count
            statsDiv.textContent = statsText.replace(
                `${currentCount} Comments`, 
                `${newCount} Comments`
            );
        }
    }
    
    function setupLikeButtons() {
        const likeButtons = document.querySelectorAll('[id^="like-btn-"]');
        
        likeButtons.forEach(button => {
            const postId = button.id.split('-').pop();
            
            button.addEventListener('click', function() {
                const icon = this.querySelector('i');
                
                if (icon.classList.contains('far')) {
                    // Like the post
                    icon.classList.replace('far', 'fas');
                    this.classList.add('active');
                    updateLikeCount(postId, 1);
                } else {
                    // Unlike the post
                    icon.classList.replace('fas', 'far');
                    this.classList.remove('active');
                    updateLikeCount(postId, -1);
                }
            });
        });
    }
    
    function updateLikeCount(postId, increment) {
        const commentsSection = document.getElementById(`comments-${postId}`);
        const postCard = commentsSection.closest('.post-card');
        const statsDiv = postCard.querySelector('.post-stats div:first-child');
        
        // Parse the current stats text
        const statsText = statsDiv.textContent;
        const likeCountMatch = statsText.match(/(\d+) Likes/);
        
        if (likeCountMatch) {
            const currentCount = parseInt(likeCountMatch[1]);
            const newCount = currentCount + increment;
            
            // Replace the old count with the new count
            statsDiv.textContent = statsText.replace(
                `${currentCount} Likes`, 
                `${newCount} Likes`
            );
        }
    }
    
    function setupRequestButtons() {
        const requestButtons = document.querySelectorAll('[id^="request-btn-"]');
        
        requestButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Simple modal or alert for demonstration
                alert("Feature coming soon: You'll be able to request specific code modifications here!");
            });
        });
    }
    
    // Helper function to escape HTML to prevent XSS
    function escapeHTML(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }