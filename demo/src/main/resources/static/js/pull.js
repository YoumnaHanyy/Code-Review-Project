// Pull Request data
const mockPRs = [
    { 
        id: 1, 
        title: "Fix login bug", 
        author: "Alice", 
        description: "Resolved issue with incorrect login validation.", 
        status: "approved",
        category: "Frontend",
        updated: "3 hours ago",
        filesChanged: 5,
        contributors: ["AL", "JD"]
    },
    { 
        id: 2, 
        title: "Improve UI design", 
        author: "Bob", 
        description: "Updated the UI components for better user experience.", 
        status: "rejected",
        category: "Frontend",
        updated: "1 day ago",
        filesChanged: 12,
        contributors: ["BS", "TK"]
    },
    { 
        id: 3, 
        title: "Optimize database queries", 
        author: "Charlie", 
        description: "Enhanced SQL queries for better performance.", 
        status: "pending",
        category: "Backend",
        updated: "5 hours ago",
        filesChanged: 3,
        contributors: ["CF"]
    },
    { 
        id: 4, 
        title: "Implement OAuth 2.0 authentication", 
        author: "David", 
        description: "Implemented comprehensive authentication system using OAuth 2.0 protocol with support for multiple providers.", 
        status: "approved",
        category: "Frontend",
        updated: "2 hours ago",
        filesChanged: 28,
        contributors: ["DM", "RB", "+2"]
    },
    { 
        id: 5, 
        title: "Add responsive design for dashboard", 
        author: "Emma", 
        description: "Made all dashboard components fully responsive and implemented a mobile-first approach for better UX.", 
        status: "changes",
        category: "Frontend",
        updated: "yesterday",
        filesChanged: 15,
        contributors: ["EJ", "KL"]
    }
];

// DOM elements
const prList = document.getElementById("prList");
const searchButton = document.getElementById("searchButton");
const searchInput = document.getElementById("search");

// Application state
let currentFilter = "all";
let openDetailsId = null;

// Event listeners
document.getElementById("filterAll").addEventListener("click", () => filterByStatus("all"));
document.getElementById("filterApproved").addEventListener("click", () => filterByStatus("approved"));
document.getElementById("filterPending").addEventListener("click", () => filterByStatus("pending"));
document.getElementById("filterChanges").addEventListener("click", () => filterByStatus("changes"));
document.getElementById("filterRejected").addEventListener("click", () => filterByStatus("rejected"));
searchButton.addEventListener("click", filterPRs);
searchInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
        filterPRs();
    }
});

/**
 * Filter pull requests by status
 * @param {string} status - The status to filter by
 */
function filterByStatus(status) {
    currentFilter = status;
    
    // Update active button styling
    document.querySelectorAll(".status-btn").forEach(btn => btn.classList.remove("active"));
    document.getElementById("filter" + status.charAt(0).toUpperCase() + status.slice(1)).classList.add("active");
    
    // Filter the PR list
    if (status === "all") {
        displayPRs(mockPRs);
    } else {
        const filteredPRs = mockPRs.filter(pr => pr.status === status);
        displayPRs(filteredPRs);
    }
    
    // Close any open details when changing filters
    openDetailsId = null;
}

/**
 * Show details for a specific PR
 * @param {Object} pr - The pull request object
 * @param {HTMLElement} element - The list item element
 */
function showDetails(pr, element) {
    // Close any open details first
    if (openDetailsId !== null && openDetailsId !== pr.id) {
        const oldDetailsElement = document.getElementById(`details-${openDetailsId}`);
        if (oldDetailsElement) {
            oldDetailsElement.style.display = "none";
        }
    }
    
    // Check if details section already exists for this PR
    let detailsElement = document.getElementById(`details-${pr.id}`);
    
    if (!detailsElement) {
        // Create a new details element
        detailsElement = document.createElement("div");
        detailsElement.className = "pr-details";
        detailsElement.id = `details-${pr.id}`;
        
        detailsElement.innerHTML = `
            <h3>Pull Request Details</h3>
            <p><strong>Title:</strong> <span id="prTitle-${pr.id}">${pr.title}</span></p>
            <p><strong>Author:</strong> <span id="prAuthor-${pr.id}">${pr.author}</span></p>
            <p><strong>Description:</strong> <span id="prDescription-${pr.id}">${pr.description}</span></p>
            <p><strong>Status:</strong> <span id="prStatus-${pr.id}" class="pr-status ${pr.status}">${pr.status}</span></p>
            <div class="pr-actions">
                <button class="action-btn approve-btn" id="approveButton-${pr.id}">Approve</button>
                <button class="action-btn request-changes-btn" id="requestChangesButton-${pr.id}">Request Changes</button>
                <button class="action-btn reject-btn" id="rejectButton-${pr.id}">Reject</button>
                <button class="pr-close-details" id="closeDetails-${pr.id}">Close Details</button>
            </div>
        `;
        
        // Insert the details right after the PR item
        element.after(detailsElement);
        
        // Set up event listeners for the new buttons
        document.getElementById(`approveButton-${pr.id}`).addEventListener("click", () => updatePRStatus(pr.id, "approved"));
        document.getElementById(`requestChangesButton-${pr.id}`).addEventListener("click", () => updatePRStatus(pr.id, "changes"));
        document.getElementById(`rejectButton-${pr.id}`).addEventListener("click", () => updatePRStatus(pr.id, "rejected"));
        document.getElementById(`closeDetails-${pr.id}`).addEventListener("click", () => closeDetails(pr.id));
    }
    
    // Update action buttons visibility based on current status
    updateActionButtonsVisibility(pr);
    
    // Toggle visibility
    if (openDetailsId === pr.id) {
        detailsElement.style.display = detailsElement.style.display === "none" ? "block" : "none";
        openDetailsId = detailsElement.style.display === "none" ? null : pr.id;
    } else {
        detailsElement.style.display = "block";
        openDetailsId = pr.id;
    }
}

/**
 * Update action buttons visibility based on PR status
 * @param {Object} pr - The pull request object
 */
function updateActionButtonsVisibility(pr) {
    const approveButton = document.getElementById(`approveButton-${pr.id}`);
    const requestChangesButton = document.getElementById(`requestChangesButton-${pr.id}`);
    const rejectButton = document.getElementById(`rejectButton-${pr.id}`);
    
    if (pr.status === "approved") {
        approveButton.style.display = "none";
        requestChangesButton.style.display = "block";
        rejectButton.style.display = "block";
    } else if (pr.status === "rejected") {
        approveButton.style.display = "block";
        requestChangesButton.style.display = "block";
        rejectButton.style.display = "none";
    } else {
        approveButton.style.display = "block";
        requestChangesButton.style.display = "block";
        rejectButton.style.display = "block";
    }
}

/**
 * Close PR details panel
 * @param {number} prId - The PR ID
 */
function closeDetails(prId) {
    const detailsElement = document.getElementById(`details-${prId}`);
    if (detailsElement) {
        detailsElement.style.display = "none";
        openDetailsId = null;
    }
}

/**
 * Update PR status
 * @param {number} prId - The PR ID
 * @param {string} newStatus - The new status
 */
function updatePRStatus(prId, newStatus) {
    // Find the PR in our data and update its status
    const prIndex = mockPRs.findIndex(pr => pr.id === prId);
    if (prIndex !== -1) {
        mockPRs[prIndex].status = newStatus;
        
        // Update the details UI
        document.getElementById(`prStatus-${prId}`).innerText = newStatus;
        document.getElementById(`prStatus-${prId}`).className = `pr-status ${newStatus}`;
        
        // Update the PR list item status
        const statusElement = document.querySelector(`#pr-${prId} .pr-status`);
        if (statusElement) {
            statusElement.innerText = newStatus;
            statusElement.className = `pr-status ${newStatus}`;
        }
        
        // Update action buttons visibility
        updateActionButtonsVisibility(mockPRs[prIndex]);
        
        // Update status counts and re-render based on current filter
        updateStatusCounts();
        
        // If the current filter excludes the new status, close the details
        if (currentFilter !== "all" && currentFilter !== newStatus) {
            closeDetails(prId);
            filterByStatus(currentFilter);
        }
        
        // Show confirmation message
        alert(`Pull request status updated to ${newStatus}!`);
    }
}

/**
 * Filter PRs based on search input
 */
function filterPRs() {
    const searchValue = document.getElementById("search").value.toLowerCase();
    let filteredPRs = mockPRs;
    
    // Apply status filter first if not "all"
    if (currentFilter !== "all") {
        filteredPRs = mockPRs.filter(pr => pr.status === currentFilter);
    }
    
    // Then apply search filter
    filteredPRs = filteredPRs.filter(pr => 
        pr.title.toLowerCase().includes(searchValue) || 
        pr.author.toLowerCase().includes(searchValue)
    );
    
    displayPRs(filteredPRs);
}

/**
 * Render PR list to DOM
 * @param {Array} prArray - Array of PR objects to display
 */
function displayPRs(prArray) {
    prList.innerHTML = "";
    prArray.forEach(pr => {
        const li = document.createElement("li");
        li.className = "pr-item";
        li.id = `pr-${pr.id}`;
        
        // Create avatars HTML
        const avatarsHTML = pr.contributors.map(initials => 
            `<div class="avatar">${initials}</div>`
        ).join('');
        
        li.innerHTML = `
            <div class="pr-main">
                <span class="pr-title">${pr.title}</span>
                <span class="pr-status ${pr.status}">${pr.status}</span>
            </div>
            <div class="pr-meta">
                <span class="pr-meta-item">
                    <span class="pr-meta-icon">📂</span> ${pr.category}
                </span>
                <span class="pr-meta-item">
                    <span class="pr-meta-icon">🕒</span> Updated ${pr.updated}
                </span>
                <span class="pr-meta-item">
                    <span class="pr-meta-icon">📄</span> ${pr.filesChanged} files changed
                </span>
                <div class="author-avatars">
                    ${avatarsHTML}
                </div>
            </div>
        `;
        li.addEventListener("click", () => showDetails(pr, li));
        prList.appendChild(li);
        
        // If this PR had its details open before re-rendering, re-open them now
        if (openDetailsId === pr.id) {
            showDetails(pr, li);
        }
    });
}

/**
 * Update counts in the filter buttons
 */
function updateStatusCounts() {
    const counts = {
        all: mockPRs.length,
        approved: mockPRs.filter(pr => pr.status === "approved").length,
        pending: mockPRs.filter(pr => pr.status === "pending").length,
        changes: mockPRs.filter(pr => pr.status === "changes").length,
        rejected: mockPRs.filter(pr => pr.status === "rejected").length
    };
    
    document.querySelector("#filterAll .count").textContent = counts.all;
    document.querySelector("#filterApproved .count").textContent = counts.approved;
    document.querySelector("#filterPending .count").textContent = counts.pending;
    document.querySelector("#filterChanges .count").textContent = counts.changes;
    document.querySelector("#filterRejected .count").textContent = counts.rejected;
}
function setupNavigation() {
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            document.querySelectorAll('.nav-links a').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            showNotification(`Switched to ${link.textContent.trim()}`, 'info');
            // Let the link navigate naturally
        });
    });
}

// Initialize the UI
updateStatusCounts();
displayPRs(mockPRs);