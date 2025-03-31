document.addEventListener('DOMContentLoaded', function() {
    // Initialize all systems
    setupReactionSystem();
    setupCommentsSection();
    setupRequestButtons();
    setupFilterTabs();
    setupCodeActions();
    setupThemeToggle();
    setupPostForm();
    setupSearch();
    setupNavigation();
    setupSidebarMenu();
    setupPostFiltering();
    setupInfiniteScroll();
    setupUserProfile();
    setupFollowButtons();
    setupPostMenu();

    // Challenge buttons
    document.querySelectorAll('.challenge-btn').forEach(button => {
        button.addEventListener('click', function() {
            const challengeTitle = this.closest('.challenge-card').querySelector('.challenge-title').textContent;
            showNotification(`Starting ${challengeTitle} challenge`, 'success');
        });
    });
});

// Notification System
let notificationTimeout;
function showNotification(message, type) {
    clearTimeout(notificationTimeout);
    
    const notificationsContainer = document.getElementById('notifications-container') || 
                                 createNotificationsContainer();
    
    while (notificationsContainer.firstChild) {
        notificationsContainer.removeChild(notificationsContainer.firstChild);
    }

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const icon = document.createElement('i');
    switch (type) {
        case 'success': icon.className = 'fas fa-check-circle'; break;
        case 'error': icon.className = 'fas fa-exclamation-circle'; break;
        case 'info': icon.className = 'fas fa-info-circle'; break;
        default: icon.className = 'fas fa-bell';
    }
    
    const textSpan = document.createElement('span');
    textSpan.textContent = message;
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'notification-close';
    closeBtn.innerHTML = '&times;';
    closeBtn.addEventListener('click', () => {
        notification.classList.add('hiding');
        setTimeout(() => notification.remove(), 300);
    });
    
    notification.append(icon, textSpan, closeBtn);
    notificationsContainer.appendChild(notification);
    
    setTimeout(() => notification.classList.add('showing'), 10);
    
    notificationTimeout = setTimeout(() => {
        notification.classList.add('hiding');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

function createNotificationsContainer() {
    const container = document.createElement('div');
    container.id = 'notifications-container';
    document.body.appendChild(container);
    return container;
}

// Reaction System - Facebook Style
function setupReactionSystem() {
    // Add the reaction styles if they don't exist
    addReactionStyles();
    
    document.querySelectorAll('[id^="like-btn-"]').forEach(button => {
        const postId = button.id.split('-').pop();
        
        // Clone the button to avoid event listener duplication
        const newButton = button.cloneNode(true);
        button.replaceWith(newButton);
        
        // Initialize button state
        newButton.innerHTML = '<i class="far fa-thumbs-up"></i> <span class="reaction-text">Like</span>';
        newButton.dataset.postId = postId;
        
        // Create reaction popup
        const reactionPopup = createReactionPopup();
        newButton.appendChild(reactionPopup);
        
        // State variables
        let isMouseOverButton = false;
        let isMouseOverPopup = false;
        let hideTimeout = null;
        let animationFrame = null;
        
        // Show/hide functions
        const showPopup = () => {
            cancelAnimationFrame(animationFrame);
            clearTimeout(hideTimeout);
            
            // Get button position
            const rect = newButton.getBoundingClientRect();
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Position the popup above the button
            reactionPopup.style.bottom = `${window.innerHeight - rect.top + scrollTop + 10}px`;
            reactionPopup.style.left = `${rect.left}px`;
            
            // Show with animation
            reactionPopup.style.display = 'flex';
            reactionPopup.style.opacity = '0';
            reactionPopup.style.transform = 'translateY(20px)';
            
            animationFrame = requestAnimationFrame(() => {
                reactionPopup.style.opacity = '1';
                reactionPopup.style.transform = 'translateY(0)';
            });
        };
        
        const hidePopup = () => {
            if (!isMouseOverButton && !isMouseOverPopup) {
                reactionPopup.style.opacity = '0';
                reactionPopup.style.transform = 'translateY(20px)';
                
                hideTimeout = setTimeout(() => {
                    reactionPopup.style.display = 'none';
                }, 200);
            }
        };
        
        // Button events
        newButton.addEventListener('mouseenter', () => {
            isMouseOverButton = true;
            showPopup();
        });
        
        newButton.addEventListener('mouseleave', () => {
            isMouseOverButton = false;
            hidePopup();
        });
        
        // Popup events
        reactionPopup.addEventListener('mouseenter', () => {
            isMouseOverPopup = true;
            clearTimeout(hideTimeout);
        });
        
        reactionPopup.addEventListener('mouseleave', () => {
            isMouseOverPopup = false;
            hidePopup();
        });
        
        // Reaction selection
        reactionPopup.querySelectorAll('.reaction-option').forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                const reactionType = option.dataset.type;
                handleReactionSelection(newButton, postId, reactionType);
                hidePopup();
            });
            
            // Preview reaction on hover
            option.addEventListener('mouseenter', () => {
                const reactionType = option.dataset.type;
                previewReaction(newButton, reactionType);
            });
            
            option.addEventListener('mouseleave', () => {
                const currentReaction = newButton.dataset.currentReaction;
                if (currentReaction) {
                    previewReaction(newButton, currentReaction);
                } else {
                    resetReactionPreview(newButton);
                }
            });
        });
        
        // Main button click
        newButton.addEventListener('click', (e) => {
            if (!e.target.closest('.reaction-option')) {
                const currentReaction = newButton.dataset.currentReaction;
                handleReactionSelection(newButton, postId, currentReaction ? null : 'like');
            }
        });
    });
}

function handleReactionSelection(button, postId, reactionType) {
    const currentReaction = button.dataset.currentReaction;
    
    // Remove previous reaction if exists
    if (currentReaction) {
        updateReactionCount(postId, currentReaction, -1);
    }
    
    // Apply new reaction if provided
    if (reactionType) {
        applyReaction(button, reactionType);
        updateReactionCount(postId, reactionType, 1);
        button.dataset.currentReaction = reactionType;
    } else {
        resetReaction(button);
        delete button.dataset.currentReaction;
    }
    
    // Show animation for the selected reaction
    if (reactionType) {
        showReactionAnimation(button, reactionType);
    }
}

function applyReaction(button, reactionType) {
    const iconMap = {
        like: 'fa-thumbs-up',
        love: 'fa-heart',
        haha: 'fa-laugh-squint',
        wow: 'fa-surprise',
        sad: 'fa-sad-tear',
        angry: 'fa-angry'
    };
    
    const textMap = {
        like: 'Like',
        love: 'Love',
        haha: 'Haha',
        wow: 'Wow',
        sad: 'Sad',
        angry: 'Angry'
    };
    
    const colorMap = {
        like: '#1877f2',
        love: '#f33e58',
        haha: '#f7b125',
        wow: '#f7b125',
        sad: '#f7b125',
        angry: '#e9710f'
    };
    
    button.innerHTML = `<i class="fas ${iconMap[reactionType]}"></i> <span class="reaction-text">${textMap[reactionType]}</span>`;
    button.style.color = colorMap[reactionType];
}

function resetReaction(button) {
    button.innerHTML = '<i class="far fa-thumbs-up"></i> <span class="reaction-text">Like</span>';
    button.style.color = '';
}

function previewReaction(button, reactionType) {
    const iconMap = {
        like: 'fa-thumbs-up',
        love: 'fa-heart',
        haha: 'fa-laugh-squint',
        wow: 'fa-surprise',
        sad: 'fa-sad-tear',
        angry: 'fa-angry'
    };
    
    button.innerHTML = `<i class="fas ${iconMap[reactionType]}"></i> <span class="reaction-text">${reactionType.charAt(0).toUpperCase() + reactionType.slice(1)}</span>`;
}

function resetReactionPreview(button) {
    const currentReaction = button.dataset.currentReaction;
    if (currentReaction) {
        applyReaction(button, currentReaction);
    } else {
        resetReaction(button);
    }
}

function createReactionPopup() {
    const popup = document.createElement('div');
    popup.className = 'reaction-popup';
    popup.style.display = 'none';
    popup.innerHTML = `
        <div class="reaction-option" data-type="like">
            <i class="fas fa-thumbs-up"></i>
            <span>Like</span>
        </div>
        <div class="reaction-option" data-type="love">
            <i class="fas fa-heart"></i>
            <span>Love</span>
        </div>
        <div class="reaction-option" data-type="haha">
            <i class="fas fa-laugh-squint"></i>
            <span>Haha</span>
        </div>
        <div class="reaction-option" data-type="wow">
            <i class="fas fa-surprise"></i>
            <span>Wow</span>
        </div>
        <div class="reaction-option" data-type="sad">
            <i class="fas fa-sad-tear"></i>
            <span>Sad</span>
        </div>
        <div class="reaction-option" data-type="angry">
            <i class="fas fa-angry"></i>
            <span>Angry</span>
        </div>
    `;
    return popup;
}

function updateReactionCount(postId, reactionType, increment) {
    const postCard = document.querySelector(`[id^="like-btn-${postId}"]`).closest('.post-card');
    if (!postCard) return;
    
    const statsDiv = postCard.querySelector('.post-stats div:first-child');
    if (!statsDiv) return;
    
    // Parse existing counts
    const statsText = statsDiv.textContent;
    const counts = {
        like: parseInt(statsText.match(/(\d+) Like/)?.[1] || statsText.match(/(\d+) Likes/)?.[1] || 0),
        love: parseInt(statsText.match(/(\d+) Love/)?.[1] || 0),
        haha: parseInt(statsText.match(/(\d+) Haha/)?.[1] || 0),
        wow: parseInt(statsText.match(/(\d+) Wow/)?.[1] || 0),
        sad: parseInt(statsText.match(/(\d+) Sad/)?.[1] || 0),
        angry: parseInt(statsText.match(/(\d+) Angry/)?.[1] || 0),
        comments: parseInt(statsText.match(/(\d+) Comments/)?.[1] || 0),
        shares: parseInt(statsText.match(/(\d+) Shares/)?.[1] || 0)
    };
    
    // Update the count
    counts[reactionType] = Math.max(0, counts[reactionType] + increment);
    
    // Get total reactions count
    const totalReactions = Object.values(counts).slice(0, 6).reduce((a, b) => a + b, 0);
    
    // Update the stats text
    if (totalReactions > 0) {
        const topReactions = [];
        if (counts.like > 0) topReactions.push({type: 'like', count: counts.like});
        if (counts.love > 0) topReactions.push({type: 'love', count: counts.love});
        if (counts.haha > 0) topReactions.push({type: 'haha', count: counts.haha});
        if (counts.wow > 0) topReactions.push({type: 'wow', count: counts.wow});
        if (counts.sad > 0) topReactions.push({type: 'sad', count: counts.sad});
        if (counts.angry > 0) topReactions.push({type: 'angry', count: counts.angry});
        
        // Sort by count descending
        topReactions.sort((a, b) => b.count - a.count);
        
        // Take top 3 reactions
        const displayReactions = topReactions.slice(0, 3);
        
        // Build the reactions text
        const reactionsText = displayReactions.length > 0 
            ? `${totalReactions} ${totalReactions === 1 ? 'reaction' : 'reactions'}`
            : '0 reactions';
            
        statsDiv.textContent = `${reactionsText} • ${counts.comments} Comments • ${counts.shares} Shares`;
        
        // Update reaction counters
        updateReactionCounters(postCard, counts);
    } else {
        statsDiv.textContent = `0 reactions • ${counts.comments} Comments • ${counts.shares} Shares`;
        updateReactionCounters(postCard, counts);
    }
}

function updateReactionCounters(postCard, counts) {
    let countersDiv = postCard.querySelector('.reaction-counters');
    if (!countersDiv) {
        countersDiv = document.createElement('div');
        countersDiv.className = 'reaction-counters';
        postCard.querySelector('.post-stats').prepend(countersDiv);
    }
    
    const totalReactions = Object.values(counts).slice(0, 6).reduce((a, b) => a + b, 0);
    
    if (totalReactions > 0) {
        countersDiv.innerHTML = '';
        
        // Add reaction icons in order of count
        const reactions = [
            {type: 'like', count: counts.like},
            {type: 'love', count: counts.love},
            {type: 'haha', count: counts.haha},
            {type: 'wow', count: counts.wow},
            {type: 'sad', count: counts.sad},
            {type: 'angry', count: counts.angry}
        ].filter(r => r.count > 0)
         .sort((a, b) => b.count - a.count)
         .slice(0, 3); // Show max 3 reactions
        
        reactions.forEach(reaction => {
            const counter = document.createElement('div');
            counter.className = `reaction-counter ${reaction.type}`;
            counter.innerHTML = `<i class="fas ${getReactionIcon(reaction.type)}"></i>`;
            countersDiv.appendChild(counter);
        });
        
        countersDiv.style.display = 'flex';
    } else {
        countersDiv.style.display = 'none';
    }
}

function getReactionIcon(reactionType) {
    const iconMap = {
        like: 'fa-thumbs-up',
        love: 'fa-heart',
        haha: 'fa-laugh-squint',
        wow: 'fa-surprise',
        sad: 'fa-sad-tear',
        angry: 'fa-angry'
    };
    return iconMap[reactionType];
}

function showReactionAnimation(button, reactionType) {
    const animation = document.createElement('div');
    animation.className = `reaction-animation ${reactionType}`;
    animation.innerHTML = `<i class="fas ${getReactionIcon(reactionType)}"></i>`;
    
    const rect = button.getBoundingClientRect();
    animation.style.left = `${rect.left + rect.width/2 - 20}px`;
    animation.style.top = `${rect.top - 40}px`;
    
    document.body.appendChild(animation);
    
    setTimeout(() => {
        animation.style.transform = 'translateY(-30px) scale(1.5)';
        animation.style.opacity = '0';
    }, 10);
    
    setTimeout(() => {
        animation.remove();
    }, 1000);
}

function addReactionStyles() {
    if (document.getElementById('reaction-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'reaction-styles';
    style.textContent = `
        .action-btn {
            position: relative;
            display: flex;
            align-items: center;
            gap: 5px;
            transition: all 0.2s;
        }
        
        .action-btn:hover {
            background-color: rgba(0, 0, 0, 0.05);
        }
        
        .reaction-text {
            font-size: 0.9rem;
        }
        
        .reaction-popup {
            position: fixed;
            background: white;
            border-radius: 50px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            padding: 8px;
            z-index: 1000;
            display: flex;
            flex-direction: row;
            gap: 8px;
            border: 1px solid #ddd;
            transition: all 0.2s ease-out;
            pointer-events: auto;
        }
        
        .reaction-option {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 8px;
            cursor: pointer;
            transition: all 0.2s;
            border-radius: 50%;
            position: relative;
            width: 40px;
            height: 40px;
        }
        
        .reaction-option:hover {
            transform: scale(1.3) translateY(-10px);
        }
        
        .reaction-option i {
            font-size: 1.8rem;
            margin-bottom: 4px;
        }
        
        .reaction-option span {
            position: absolute;
            bottom: -25px;
            font-size: 0.7rem;
            white-space: nowrap;
            background: #333;
            color: white;
            padding: 3px 8px;
            border-radius: 10px;
            opacity: 0;
            transition: opacity 0.2s;
        }
        
        .reaction-option:hover span {
            opacity: 1;
        }
        
        .reaction-option[data-type="like"] i {
            color: #1877f2;
        }
        
        .reaction-option[data-type="love"] i {
            color: #f33e58;
        }
        
        .reaction-option[data-type="haha"] i {
            color: #f7b125;
        }
        
        .reaction-option[data-type="wow"] i {
            color: #f7b125;
        }
        
        .reaction-option[data-type="sad"] i {
            color: #f7b125;
        }
        
        .reaction-option[data-type="angry"] i {
            color: #e9710f;
        }
        
        .reaction-counters {
            display: flex;
            gap: 5px;
            margin-bottom: 5px;
        }
        
        .reaction-counter {
            width: 18px;
            height: 18px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.6rem;
        }
        
        .reaction-counter.like {
            background: #1877f2;
            color: white;
        }
        
        .reaction-counter.love {
            background: #f33e58;
            color: white;
        }
        
        .reaction-counter.haha,
        .reaction-counter.wow,
        .reaction-counter.sad {
            background: #f7b125;
            color: white;
        }
        
        .reaction-counter.angry {
            background: #e9710f;
            color: white;
        }
        
        .reaction-animation {
            position: fixed;
            font-size: 2rem;
            z-index: 1001;
            pointer-events: none;
            transition: all 0.8s cubic-bezier(0.36, 0, 0.66, -0.56);
            opacity: 1;
            transform: translateY(0) scale(1);
        }
        
        .reaction-animation.like {
            color: #1877f2;
        }
        
        .reaction-animation.love {
            color: #f33e58;
        }
        
        .reaction-animation.haha,
        .reaction-animation.wow,
        .reaction-animation.sad {
            color: #f7b125;
        }
        
        .reaction-animation.angry {
            color: #e9710f;
        }
    `;
    document.head.appendChild(style);
}

// Comment System
function setupCommentsSection() {
    document.querySelectorAll('[id^="comment-btn-"]').forEach(button => {
        const postId = button.id.split('-').pop();
        const commentsSection = document.getElementById(`comments-${postId}`);
        
        button.addEventListener('click', () => {
            const isHidden = commentsSection.style.display === 'none' || !commentsSection.style.display;
            commentsSection.style.display = isHidden ? 'block' : 'none';
            button.classList.toggle('active', isHidden);
            
            if (isHidden) {
                commentsSection.querySelector('.comment-input')?.focus();
            }
        });
        
        setupCommentSubmit(postId);
    });
}

function setupCommentSubmit(postId) {
    const commentsSection = document.getElementById(`comments-${postId}`);
    if (!commentsSection) return;
    
    const form = commentsSection.querySelector('.comment-form');
    const input = form.querySelector('.comment-input');
    const submitBtn = form.querySelector('.comment-submit');
    
    function submitComment() {
        const text = input.value.trim();
        if (!text) return;
        
        const newComment = document.createElement('div');
        newComment.className = 'comment';
        newComment.innerHTML = `
            <img src="/api/placeholder/320/320" alt="Your profile">
            <div class="comment-content">
                <div class="comment-user">You</div>
                <div class="comment-text">${escapeHTML(text)}</div>
                <div class="comment-actions">
                    <div class="comment-action">Like</div>
                    <div class="comment-action">Reply</div>
                    <div class="comment-action">Just now</div>
                </div>
            </div>
        `;
        
        commentsSection.insertBefore(newComment, form.nextSibling);
        input.value = '';
        updateCommentCount(postId, 1);
        showNotification('Comment posted!', 'success');
    }
    
    submitBtn.addEventListener('click', submitComment);
    input.addEventListener('keypress', (e) => e.key === 'Enter' && submitComment());
}

function updateCommentCount(postId, increment) {
    const postCard = document.querySelector(`#comments-${postId}`)?.closest('.post-card');
    if (!postCard) return;
    
    const statsDiv = postCard.querySelector('.post-stats div:first-child');
    const statsText = statsDiv.textContent;
    const commentMatch = statsText.match(/(\d+) Comments/);
    const currentCount = commentMatch ? parseInt(commentMatch[1]) : 0;
    const newCount = Math.max(0, currentCount + increment);
    
    statsDiv.textContent = commentMatch 
        ? statsText.replace(`${currentCount} Comments`, `${newCount} Comments`)
        : statsText.replace(`${currentCount} Likes`, `${currentCount} Likes • ${newCount} Comments`);
}

// Request Modification Modal
function setupRequestButtons() {
    document.querySelectorAll('[id^="request-btn-"]').forEach(button => {
        const postId = button.id.split('-').pop();
        button.addEventListener('click', () => showModificationRequestModal(postId));
    });
}

function showModificationRequestModal(postId) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-header">
            <h3>Request Code Modification</h3>
            <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
            <p class="modal-instruction">Describe the changes you'd like to suggest:</p>
            <textarea class="modal-textarea" placeholder="I suggest modifying..."></textarea>
            <div class="modal-options">
                <label class="modal-option">
                    <input type="checkbox" checked>
                    <span>Include snippet from original code</span>
                </label>
                <label class="modal-option">
                    <input type="checkbox">
                    <span>Offer to implement the change</span>
                </label>
            </div>
        </div>
        <div class="modal-footer">
            <button class="modal-cancel">Cancel</button>
            <button class="modal-submit">Submit Request</button>
        </div>
    `;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    const closeModal = () => {
        overlay.classList.add('hiding');
        setTimeout(() => overlay.remove(), 300);
    };
    
    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.querySelector('.modal-cancel').addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => e.target === overlay && closeModal());
    
    modal.querySelector('.modal-submit').addEventListener('click', () => {
        const text = modal.querySelector('.modal-textarea').value.trim();
        if (text) {
            updateRequestCount(postId);
            showNotification('Modification request submitted!', 'success');
            closeModal();
        } else {
            showNotification('Please describe your request first', 'error');
        }
    });
    
    modal.querySelector('.modal-textarea').focus();
    
    setTimeout(() => {
        overlay.classList.add('showing');
        modal.style.transform = 'scale(1)';
    }, 10);
    
    addModalStyles();
}

function updateRequestCount(postId) {
    const postCard = document.querySelector(`[id^="request-btn-${postId}"]`)?.closest('.post-card');
    if (!postCard) return;
    
    const statsDiv = postCard.querySelector('.post-stats div:first-child');
    const statsText = statsDiv.textContent;
    const requestMatch = statsText.match(/(\d+) Requests/);
    const currentCount = requestMatch ? parseInt(requestMatch[1]) : 0;
    const newCount = currentCount + 1;
    
    statsDiv.textContent = requestMatch
        ? statsText.replace(`${currentCount} Requests`, `${newCount} Requests`)
        : `${statsText} • ${newCount} Requests`;
}

function addModalStyles() {
    if (document.getElementById('modal-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'modal-styles';
    style.textContent = `
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2000;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .modal-overlay.showing {
            opacity: 1;
        }
        
        .modal-overlay.hiding {
            opacity: 0;
        }
        
        .modal {
            background-color: var(--card-bg);
            border-radius: 12px;
            width: 90%;
            max-width: 500px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            overflow: hidden;
            transform: scale(0.8);
            transition: transform 0.3s ease;
            border: 1px solid var(--border-color);
            color: var(--text-primary);
        }
        
        .modal-overlay.showing .modal {
            transform: scale(1);
        }
        
        .modal-header {
            padding: 16px 20px;
            border-bottom: 1px solid var(--border-color);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .modal-header h3 {
            margin: 0;
            font-size: 18px;
            color: var(--text-primary);
        }
        
        .modal-close {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: var(--text-secondary);
            padding: 0;
        }
        
        .modal-close:hover {
            color: var(--text-primary);
        }
        
        .modal-body {
            padding: 20px;
        }
        
        .modal-instruction {
            margin-bottom: 15px;
            color: var(--text-primary);
        }
        
        .modal-textarea {
            width: 100%;
            min-height: 120px;
            padding: 12px;
            border: 1px solid var(--border-color);
            border-radius: 8px;
            resize: vertical;
            font-family: inherit;
            margin-bottom: 15px;
            background-color: var(--accent-purple);
            color: var(--text-primary);
        }
        
        .modal-textarea::placeholder {
            color: var(--text-secondary);
        }
        
        .modal-options {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        
        .modal-option {
            display: flex;
            align-items: center;
            gap: 8px;
            color: var(--text-primary);
            cursor: pointer;
        }
        
        .modal-option input {
            cursor: pointer;
        }
        
        .modal-footer {
            padding: 16px 20px;
            border-top: 1px solid var(--border-color);
            display: flex;
            justify-content: flex-end;
            gap: 12px;
        }
        
        .modal-cancel, .modal-submit {
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 500;
            transition: background-color 0.2s;
        }
        
        .modal-cancel {
            background-color: transparent;
            border: 1px solid var(--border-color);
            color: var(--text-secondary);
        }
        
        .modal-cancel:hover {
            background-color: var(--accent-purple);
        }
        
        .modal-submit {
            background-color: var(--accent-color);
            border: none;
            color: var(--dark-purple);
        }
        
        .modal-submit:hover {
            background-color: #8a8eff;
        }
    `;
    document.head.appendChild(style);
}

// Code Block Actions
f// Code Block Actions - Fixed
function setupCodeActions() {
    // Copy buttons
    document.querySelectorAll('.code-action-btn:nth-child(1)').forEach(button => {
        button.addEventListener('click', function() {
            const codeBlock = this.closest('.code-block');
            const code = codeBlock.querySelector('pre').textContent;
            
            navigator.clipboard.writeText(code)
                .then(() => showNotification('Code copied to clipboard!', 'success'))
                .catch(() => showNotification('Failed to copy code', 'error'));
        });
    });

    // Expand buttons - Fixed with proper icon toggling
    document.querySelectorAll('.code-action-btn:nth-child(2)').forEach(button => {
        button.addEventListener('click', function() {
            const codeBlock = this.closest('.code-block');
            const isExpanded = codeBlock.classList.toggle('expanded');
            const icon = this.querySelector('i');
            
            if (isExpanded) {
                // Change to compress icon and add overlay
                icon.classList.replace('fa-expand', 'fa-compress');
                addCodeOverlay(codeBlock);
                
                // Scroll to show the expanded code
                setTimeout(() => {
                    codeBlock.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }, 100);
            } else {
                // Change back to expand icon and remove overlay
                icon.classList.replace('fa-compress', 'fa-expand');
                removeCodeOverlay();
            }
        });
    });
}

// Helper functions for code expansion
function addCodeOverlay(codeBlock) {
    // Remove any existing overlay first
    removeCodeOverlay();
    
    const overlay = document.createElement('div');
    overlay.className = 'code-overlay';
    overlay.innerHTML = '<button class="close-expanded-code"><i class="fas fa-times"></i></button>';
    
    overlay.addEventListener('click', (e) => {
        if (e.target.classList.contains('code-overlay') || e.target.closest('.close-expanded-code')) {
            const expandedBlock = document.querySelector('.code-block.expanded');
            if (expandedBlock) {
                expandedBlock.classList.remove('expanded');
                const icon = expandedBlock.querySelector('.fa-compress');
                if (icon) {
                    icon.classList.replace('fa-compress', 'fa-expand');
                }
                removeCodeOverlay();
            }
        }
    });
    
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';
}

function removeCodeOverlay() {
    const existingOverlay = document.querySelector('.code-overlay');
    if (existingOverlay) {
        existingOverlay.remove();
    }
    document.body.style.overflow = '';
}

// Post Filtering System
function setupFilterTabs() {
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            filterPosts(this.textContent.trim());
        });
    });
}

function filterPosts(filterType) {
    const allPosts = Array.from(document.querySelectorAll('.post-card'));
    const postContainer = document.querySelector('.feed');
    
    allPosts.forEach(post => post.style.display = 'none');
    
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'loading-indicator';
    loadingIndicator.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading posts...';
    postContainer.appendChild(loadingIndicator);
    
    setTimeout(() => {
        loadingIndicator.remove();
        
        let filteredPosts = [];
        switch(filterType.toLowerCase()) {
            case 'recent':
                filteredPosts = allPosts.sort((a, b) => {
                    const timeA = parseInt(a.querySelector('.post-meta span:last-child').textContent.replace('h ago', ''));
                    const timeB = parseInt(b.querySelector('.post-meta span:last-child').textContent.replace('h ago', ''));
                    return timeA - timeB;
                });
                break;
            case 'popular':
                filteredPosts = allPosts.sort((a, b) => {
                    const likesA = parseInt(a.querySelector('.post-stats div:first-child').textContent.match(/(\d+) Likes/)?.[1] || 0);
                    const likesB = parseInt(b.querySelector('.post-stats div:first-child').textContent.match(/(\d+) Likes/)?.[1] || 0);
                    return likesB - likesA;
                });
                break;
            case 'following':
                filteredPosts = allPosts.filter(post => {
                    const userName = post.querySelector('.user-name').textContent;
                    return ['Sarah Chen', 'Alex Rodriguez'].includes(userName);
                });
                break;
            case 'urgent':
                filteredPosts = allPosts.filter(post => {
                    const postText = post.querySelector('.post-content p').textContent.toLowerCase();
                    return postText.includes('urgent') || postText.includes('help') || 
                           postText.includes('stuck') || postText.includes('emergency');
                });
                break;
            default:
                filteredPosts = allPosts;
        }
        
        filteredPosts.forEach((post, index) => {
            setTimeout(() => {
                post.style.display = 'block';
                post.style.animation = 'fadeIn 0.3s ease';
            }, index * 50);
        });
        
        showNotification(`Showing ${filterType} posts`, 'info');
    }, 800);
}

// Infinite Scroll
function setupInfiniteScroll() {
    let isLoading = false;
    
    window.addEventListener('scroll', () => {
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
        const scrollPosition = scrollTop + clientHeight;
        
        if (scrollPosition >= scrollHeight - 100 && !isLoading) {
            isLoading = true;
            loadMorePosts();
        }
    });
}

function loadMorePosts() {
    const postContainer = document.querySelector('.feed');
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'loading-indicator';
    loadingIndicator.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading more posts...';
    postContainer.appendChild(loadingIndicator);
    
    setTimeout(() => {
        loadingIndicator.remove();
        
        const newPost = document.createElement('div');
        newPost.className = 'post-card';
        newPost.innerHTML = `
            <div class="post-header">
                <div class="user-info">
                    <img src="../static/images/man.png" alt="New User">
                    <div class="user-text">
                        <div class="user-name">New User</div>
                        <div class="post-meta">
                            <span>Full Stack Developer</span>
                            <span class="dot">•</span>
                            <span>Just now</span>
                            <span class="post-tag">JavaScript</span>
                        </div>
                    </div>
                </div>
                <button class="post-menu"><i class="fas fa-ellipsis-h"></i></button>
            </div>
            <div class="post-content">
                <p>This is a dynamically loaded post when you scroll to the bottom!</p>
                <div class="code-block">
                    <div class="code-header">
                        <div class="language-tag">
                            <i class="fab fa-js"></i> JavaScript
                        </div>
                        <div class="code-actions">
                            <button class="code-action-btn"><i class="fas fa-copy"></i></button>
                            <button class="code-action-btn"><i class="fas fa-expand"></i></button>
                        </div>
                    </div>
                    <pre><span class="line-numbers">1</span>console.log("Infinite scroll works!");</pre>
                </div>
            </div>
            <div class="post-stats">
                <div>0 Likes • 0 Comments • 0 Requests</div>
                <div>Viewed 0 times</div>
            </div>
            <div class="post-actions-menu">
                <button class="action-btn" id="like-btn-new">
                    <i class="far fa-thumbs-up"></i> Like
                </button>
                <button class="action-btn" id="comment-btn-new">
                    <i class="far fa-comment"></i> Comment
                </button>
                <button class="action-btn" id="request-btn-new">
                    <i class="far fa-edit"></i> Request modification
                </button>
            </div>
            <div class="comments-section" id="comments-new" style="display: none;">
                <div class="comment-form">
                    <img src="/api/placeholder/320/320" alt="Your profile">
                    <div class="comment-input-container">
                        <input type="text" class="comment-input" placeholder="Write a comment...">
                        <button class="comment-submit"><i class="fas fa-paper-plane"></i></button>
                    </div>
                </div>
            </div>
        `;
        
        postContainer.appendChild(newPost);
        
        setupReactionSystem();
        setupCommentsSection();
        setupRequestButtons();
        setupCodeActions();
        setupPostMenu();
        
        isLoading = false;
        showNotification('New posts loaded!', 'success');
    }, 1500);
}

// User Profile System
function setupUserProfile() {
    const profileImg = document.querySelector('.profile-img');
    if (!profileImg) return;
    
    profileImg.addEventListener('click', function() {
        showUserProfileModal();
    });
}

function showUserProfileModal() {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-header">
            <h3>Your Profile</h3>
            <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
            <div class="profile-header">
                <img src="../static/images/user.png" alt="Profile" class="profile-large">
                <div class="profile-info">
                    <h4>Your Name</h4>
                    <p>Software Developer</p>
                    <div class="profile-stats">
                        <div class="stat">
                            <span class="stat-number">42</span>
                            <span class="stat-label">Posts</span>
                        </div>
                        <div class="stat">
                            <span class="stat-number">128</span>
                            <span class="stat-label">Comments</span>
                        </div>
                        <div class="stat">
                            <span class="stat-number">24</span>
                            <span class="stat-label">Solutions</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="profile-actions">
                <button class="profile-action-btn"><i class="fas fa-user-edit"></i> Edit Profile</button>
                <button class="profile-action-btn"><i class="fas fa-cog"></i> Settings</button>
                <button class="profile-action-btn"><i class="fas fa-sign-out-alt"></i> Logout</button>
            </div>
        </div>
    `;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    const closeModal = () => {
        overlay.classList.add('hiding');
        setTimeout(() => overlay.remove(), 300);
    };
    
    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => e.target === overlay && closeModal());
    
    addProfileModalStyles();
    
    setTimeout(() => {
        overlay.classList.add('showing');
        modal.style.transform = 'scale(1)';
    }, 10);
}

function addProfileModalStyles() {
    if (document.getElementById('profile-modal-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'profile-modal-styles';
    style.textContent = `
        .profile-large {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            object-fit: cover;
            border: 3px solid var(--accent-color);
            margin-right: 20px;
        }
        
        .profile-header {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
        }
        
        .profile-info h4 {
            margin: 0 0 5px 0;
            font-size: 20px;
            color: var(--text-primary);
        }
        
        .profile-info p {
            margin: 0 0 15px 0;
            color: var(--text-secondary);
        }
        
        .profile-stats {
            display: flex;
            gap: 20px;
        }
        
        .stat {
            text-align: center;
        }
        
        .stat-number {
            display: block;
            font-weight: 600;
            font-size: 18px;
            color: var(--accent-color);
        }
        
        .stat-label {
            font-size: 12px;
            color: var(--text-secondary);
        }
        
        .profile-actions {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        
        .profile-action-btn {
            padding: 10px;
            border-radius: 6px;
            background-color: var(--accent-purple);
            border: none;
            color: var(--text-primary);
            cursor: pointer;
            text-align: left;
            transition: background-color 0.2s;
        }
        
        .profile-action-btn:hover {
            background-color: var(--accent-color);
            color: var(--dark-purple);
        }
        
        .profile-action-btn i {
            margin-right: 8px;
        }
    `;
    document.head.appendChild(style);
}

// Follow System
function setupFollowButtons() {
    document.querySelectorAll('.follow-btn').forEach(button => {
        button.addEventListener('click', function() {
            const isFollowing = this.textContent.trim() === 'Following';
            this.textContent = isFollowing ? 'Follow' : 'Following';
            this.style.backgroundColor = isFollowing ? 'var(--accent-color)' : 'var(--border-color)';
            
            const userName = this.closest('.contributor').querySelector('.contributor-name').textContent;
            showNotification(isFollowing ? `Unfollowed ${userName}` : `Following ${userName}`, 'info');
        });
    });
}

// Post Menu System
function setupPostMenu() {
    document.querySelectorAll('.post-menu').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // Remove any existing post menus
            document.querySelectorAll('.post-options-menu').forEach(menu => menu.remove());
            
            const postCard = this.closest('.post-card');
            const menu = document.createElement('div');
            menu.className = 'post-options-menu';
            menu.innerHTML = `
                <button class="post-option"><i class="fas fa-bookmark"></i> Save Post</button>
                <button class="post-option"><i class="fas fa-flag"></i> Report Post</button>
                <button class="post-option"><i class="fas fa-link"></i> Copy Link</button>
                <button class="post-option"><i class="fas fa-eye-slash"></i> Hide Post</button>
            `;
            
            postCard.appendChild(menu);
            
            // Position menu near the button
            const rect = this.getBoundingClientRect();
            menu.style.top = `${rect.bottom + window.scrollY}px`;
            menu.style.right = `${window.innerWidth - rect.right}px`;
            
            // Close menu when clicking outside
            const closeMenu = () => menu.remove();
            setTimeout(() => {
                document.addEventListener('click', closeMenu, { once: true });
            }, 100);
            
            // Add option click handlers
            menu.querySelectorAll('.post-option').forEach(option => {
                option.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const action = option.textContent.trim();
                    showNotification(`${action} action performed`, 'info');
                    closeMenu();
                });
            });
        });
    });
    
    addPostMenuStyles();
}

function addPostMenuStyles() {
    if (document.getElementById('post-menu-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'post-menu-styles';
    style.textContent = `
        .post-options-menu {
            position: absolute;
            background-color: var(--card-bg);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            padding: 8px 0;
            z-index: 100;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            animation: fadeIn 0.2s ease;
        }
        
        .post-option {
            display: flex;
            align-items: center;
            padding: 8px 16px;
            width: 100%;
            background: none;
            border: none
                        text-align: left;
            cursor: pointer;
            transition: background-color 0.2s;
        }
        
        .post-option:hover {
            background-color: var(--accent-purple);
        }
        
        .post-option i {
            margin-right: 8px;
            width: 20px;
            text-align: center;
        }
    `;
    document.head.appendChild(style);
}

// Theme Toggle
function setupThemeToggle() {
    const toggle = document.getElementById('themeToggle');
    if (!toggle) return;
    
    toggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        const icon = toggle.querySelector('i');
        icon.classList.toggle('fa-moon');
        icon.classList.toggle('fa-sun');
        
        // Save theme preference to localStorage
        const isDark = document.body.classList.contains('dark-theme');
        localStorage.setItem('codecritic-theme', isDark ? 'dark' : 'light');
        showNotification(`Switched to ${isDark ? 'dark' : 'light'} theme`, 'info');
    });
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('codecritic-theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        const icon = toggle.querySelector('i');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }
}

// Post Form
function setupPostForm() {
    const postForm = document.querySelector('.post-form');
    const postInput = document.querySelector('.post-input');
    const postButton = document.querySelector('.post-btn');

    postInput.addEventListener('focus', () => postForm.classList.add('active'));
    postInput.addEventListener('blur', () => {
        if (!postInput.value.trim()) postForm.classList.remove('active');
    });

    postButton.addEventListener('click', () => {
        if (postInput.value.trim()) {
            createNewPost(postInput.value.trim());
            postInput.value = '';
            postForm.classList.remove('active');
        } else {
            showNotification('Please write something before posting', 'error');
        }
    });
}

function createNewPost(content) {
    const postContainer = document.querySelector('.feed');
    const newPost = document.createElement('div');
    newPost.className = 'post-card';
    newPost.innerHTML = `
        <div class="post-header">
            <div class="user-info">
                <img src="../static/images/user.png" alt="Your profile">
                <div class="user-text">
                    <div class="user-name">You</div>
                    <div class="post-meta">
                        <span>Developer</span>
                        <span class="dot">•</span>
                        <span>Just now</span>
                        <span class="post-tag">General</span>
                    </div>
                </div>
            </div>
            <button class="post-menu"><i class="fas fa-ellipsis-h"></i></button>
        </div>
        <div class="post-content">
            <p>${escapeHTML(content)}</p>
        </div>
        <div class="post-stats">
            <div>0 Likes • 0 Comments • 0 Requests</div>
            <div>Viewed 0 times</div>
        </div>
        <div class="post-actions-menu">
            <button class="action-btn" id="like-btn-new">
                <i class="far fa-thumbs-up"></i> Like
            </button>
            <button class="action-btn" id="comment-btn-new">
                <i class="far fa-comment"></i> Comment
            </button>
            <button class="action-btn" id="request-btn-new">
                <i class="far fa-edit"></i> Request modification
            </button>
        </div>
        <div class="comments-section" id="comments-new" style="display: none;">
            <div class="comment-form">
                <img src="/api/placeholder/320/320" alt="Your profile">
                <div class="comment-input-container">
                    <input type="text" class="comment-input" placeholder="Write a comment...">
                    <button class="comment-submit"><i class="fas fa-paper-plane"></i></button>
                </div>
            </div>
        </div>
    `;
    
    postContainer.insertBefore(newPost, postContainer.firstChild.nextSibling);
    
    setupReactionSystem();
    setupCommentsSection();
    setupRequestButtons();
    setupCodeActions();
    setupPostMenu();
    
    showNotification('Post shared successfully!', 'success');
}

// Search Functionality
function setupSearch() {
    const searchInput = document.querySelector('.search-bar input');
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const term = searchInput.value.trim();
            if (term) {
                showNotification(`Searching for "${term}"`, 'info');
                searchInput.value = '';
            }
        }
    });
}

// Navigation
function setupNavigation() {
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.nav-links a').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            showNotification(`Switched to ${link.textContent.trim()}`, 'info');
        });
    });
}

// Sidebar Menu
function setupSidebarMenu() {
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            showNotification(`Navigated to ${item.textContent.trim()}`, 'info');
        });
    });
}

// Helper Functions
function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// Initialize post filtering on page load
function setupPostFiltering() {
    const activeTab = document.querySelector('.filter-tab.active');
    if (activeTab) {
        filterPosts(activeTab.textContent.trim());
    }
}