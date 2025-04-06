// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    // Sidebar navigation
    const navItems = document.querySelectorAll('.nav-menu li a');
    const contentSections = ['dashboard', 'users', 'posts', 'comments', 'help-requests', 'reports', 'settings'];
    const busyModeToggle = document.getElementById('busyModeToggle');
    const statusIndicator = document.querySelector('.status-indicator');
    const statusText = statusIndicator.querySelector('span:first-child');
    const actionButtons = document.querySelectorAll('.action-btn');
    const actionModal = document.getElementById('actionModal');
    const closeModal = document.querySelector('.close-modal');
    const tabLinks = document.querySelectorAll('.tab');
    const paginationButtons = document.querySelectorAll('.pagination-btn');
    const sortableHeaders = document.querySelectorAll('th.sortable');
    const searchInput = document.querySelector('.search-container input');
    const dateFilters = document.querySelectorAll('.date-picker input');
    const profileDropdown = document.querySelector('.user-profile');

    // Initialize current active section
    let currentSection = 'posts'; // Default to posts as per your HTML

    // Navigation Handler
    function handleNavigation() {
        navItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Remove active class from all items
                navItems.forEach(nav => nav.parentElement.classList.remove('active', 'selected'));
                
                // Add active class to clicked item
                this.parentElement.classList.add('active', 'selected');
                
                // Get section ID from href attribute
                const sectionId = this.getAttribute('href').substring(1);
                currentSection = sectionId;
                
                // Update page content based on section
                updateContentBasedOnSection(sectionId);
                
                // Update content header
                updateContentHeader(sectionId);
            });
        });
    }

    // Update content header based on section
    function updateContentHeader(sectionId) {
        const contentHeader = document.querySelector('.content-header h1');
        
        switch(sectionId) {
            case 'dashboard':
                contentHeader.textContent = 'Dashboard Overview';
                break;
            case 'users':
                contentHeader.textContent = 'User Management';
                break;
            case 'posts':
                contentHeader.textContent = 'Posts History';
                break;
            case 'comments':
                contentHeader.textContent = 'Comments Management';
                break;
            case 'help-requests':
                contentHeader.textContent = 'Help Requests';
                break;
            case 'reports':
                contentHeader.textContent = 'Reported Content';
                break;
            case 'settings':
                contentHeader.textContent = 'System Settings';
                break;
            default:
                contentHeader.textContent = 'CodeCritic Admin';
        }
    }

    // Update page content based on selected section
    function updateContentBasedOnSection(sectionId) {
        console.log(`Navigated to ${sectionId} section`);
        // In a real application, this would fetch data for the selected section
        // For now, we'll just simulate content changes
        
        // Show/hide tab navigation based on section
        const tabNavigation = document.querySelector('.tab-navigation');
        if (sectionId === 'posts' || sectionId === 'comments' || sectionId === 'help-requests' || sectionId === 'reports') {
            tabNavigation.style.display = 'flex';
            // Update tab text based on section
            updateTabsForSection(sectionId);
        } else {
            tabNavigation.style.display = 'none';
        }
        
        // Update table content (in real app, would fetch from API)
        updateTableContent(sectionId);
    }

    // Update tabs based on section
    function updateTabsForSection(sectionId) {
        const tabs = document.querySelectorAll('.tab');
        
        // Reset active state
        tabs.forEach(tab => tab.classList.remove('active'));
        tabs[0].classList.add('active'); // Set first tab as active
        
        switch(sectionId) {
            case 'posts':
                tabs[0].textContent = 'All Posts';
                tabs[1].textContent = 'Pending';
                tabs[2].textContent = 'Approved';
                tabs[3].textContent = 'Rejected';
                break;
            case 'comments':
                tabs[0].textContent = 'All Comments';
                tabs[1].textContent = 'Flagged';
                tabs[2].textContent = 'Approved';
                tabs[3].textContent = 'Deleted';
                break;
            case 'help-requests':
                tabs[0].textContent = 'All Requests';
                tabs[1].textContent = 'Open';
                tabs[2].textContent = 'In Progress';
                tabs[3].textContent = 'Resolved';
                break;
            case 'reports':
                tabs[0].textContent = 'All Reports';
                tabs[1].textContent = 'New';
                tabs[2].textContent = 'Investigating';
                tabs[3].textContent = 'Closed';
                break;
        }
    }

    // Update table based on section
    function updateTableContent(sectionId) {
        const tableContainer = document.querySelector('.data-table-container');
        const tableHeaders = document.querySelector('.data-table thead tr');
        
        // If not relevant section, hide table
        if (!['posts', 'users', 'comments', 'help-requests', 'reports'].includes(sectionId)) {
            tableContainer.style.display = 'none';
            return;
        }
        
        tableContainer.style.display = 'block';
        
        // Update table headers based on section
        switch(sectionId) {
            case 'users':
                tableHeaders.innerHTML = `
                    <th class="sortable id-column">ID <i class="fa-solid fa-sort"></i></th>
                    <th>Username</th>
                    <th>Email</th>
                    <th class="sortable">Join Date <i class="fa-solid fa-sort"></i></th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Posts</th>
                    <th>Action</th>
                `;
                break;
            case 'posts':
                tableHeaders.innerHTML = `
                    <th class="sortable id-column">ID <i class="fa-solid fa-sort"></i></th>
                    <th>Author</th>
                    <th>Title</th>
                    <th class="sortable">Posted Time <i class="fa-solid fa-sort"></i></th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Views</th>
                    <th>Action</th>
                `;
                break;
            case 'comments':
                tableHeaders.innerHTML = `
                    <th class="sortable id-column">ID <i class="fa-solid fa-sort"></i></th>
                    <th>Author</th>
                    <th>Content</th>
                    <th class="sortable">Posted Time <i class="fa-solid fa-sort"></i></th>
                    <th>Post</th>
                    <th>Status</th>
                    <th>Likes</th>
                    <th>Action</th>
                `;
                break;
            case 'help-requests':
                tableHeaders.innerHTML = `
                    <th class="sortable id-column">ID <i class="fa-solid fa-sort"></i></th>
                    <th>Requester</th>
                    <th>Issue</th>
                    <th class="sortable">Submitted <i class="fa-solid fa-sort"></i></th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Assigned To</th>
                    <th>Action</th>
                `;
                break;
            case 'reports':
                tableHeaders.innerHTML = `
                    <th class="sortable id-column">ID <i class="fa-solid fa-sort"></i></th>
                    <th>Reporter</th>
                    <th>Content Type</th>
                    <th class="sortable">Reported Time <i class="fa-solid fa-sort"></i></th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>Severity</th>
                    <th>Action</th>
                `;
                break;
        }
        
        // Simulate loading data
        // In a real app, you would fetch data from the server here
        simulateTableData(sectionId);
        
        // Reattach event listeners for sortable headers and action buttons
        attachSortableListeners();
        attachActionButtonListeners();
    }

    // Simulate table data based on section
    function simulateTableData(sectionId) {
        const tableBody = document.querySelector('.data-table tbody');
        tableBody.innerHTML = ''; // Clear existing data
        
        // Sample data based on section
        let rowData = [];
        
        switch(sectionId) {
            case 'users':
                rowData = [
                    { id: '#1052', username: 'johnsmith', email: 'john@example.com', joinDate: '2 months ago', role: 'Member', status: 'Active', count: 27 },
                    { id: '#1051', username: 'alicechen', email: 'alice@example.com', joinDate: '3 months ago', role: 'Moderator', status: 'Active', count: 43 },
                    { id: '#1050', username: 'carlosdiaz', email: 'carlos@example.com', joinDate: '3 months ago', role: 'Member', status: 'Suspended', count: 12 },
                    { id: '#1049', username: 'sarahkim', email: 'sarah@example.com', joinDate: '4 months ago', role: 'Member', status: 'Active', count: 31 },
                    { id: '#1048', username: 'davidlee', email: 'david@example.com', joinDate: '5 months ago', role: 'Admin', status: 'Active', count: 94 },
                ];
                
                // Generate rows
                rowData.forEach(user => {
                    const statusClass = user.status === 'Active' ? 'approved' : 'rejected';
                    
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${user.id}</td>
                        <td class="user-cell">
                            <img src="https://via.placeholder.com/30" alt="User">
                            <span>${user.username}</span>
                        </td>
                        <td>${user.email}</td>
                        <td><i class="fa-regular fa-clock"></i> ${user.joinDate}</td>
                        <td>${user.role}</td>
                        <td class="status-cell"><span class="status ${statusClass}">${user.status}</span></td>
                        <td>${user.count}</td>
                        <td class="action-cell">
                            <button class="action-btn"><i class="fa-solid fa-ellipsis-vertical"></i></button>
                            <div class="action-dropdown">
                                <a href="#view">View</a>
                                <a href="#edit">Edit</a>
                                <a href="#delete">Delete</a>
                            </div>
                        </td>
                    `;
                    tableBody.appendChild(row);
                });
                break;
                
            case 'comments':
                rowData = [
                    { id: '#4102', author: 'John Smith', content: 'This solution worked perfectly! Thanks.', time: '15 min', post: 'React useState Hook Issue', status: 'Approved', count: 12 },
                    { id: '#4101', author: 'Alice Chen', content: 'I\'m having the same issue. Any update?', time: '1h 10 min', post: 'Python List Comprehension Help', status: 'Flagged', count: 3 },
                    { id: '#4100', author: 'Carlos Diaz', content: 'Could you explain that last part again?', time: '2h 5 min', post: 'Node.js Express Routing Issue', status: 'Approved', count: 5 },
                    { id: '#4099', author: 'Sarah Kim', content: 'I found a better solution here...', time: '3h 20 min', post: 'Java Spring Boot Authentication', status: 'Approved', count: 9 },
                    { id: '#4098', author: 'David Lee', content: 'This code contains vulnerable parts', time: '4h 30 min', post: 'SQL Query Performance Issue', status: 'Flagged', count: 2 },
                ];
                
                // Generate rows
                rowData.forEach(comment => {
                    let statusClass;
                    if (comment.status === 'Approved') statusClass = 'approved';
                    else if (comment.status === 'Flagged') statusClass = 'pending';
                    else statusClass = 'rejected';
                    
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${comment.id}</td>
                        <td class="user-cell">
                            <img src="https://via.placeholder.com/30" alt="User">
                            <span>${comment.author}</span>
                        </td>
                        <td>${comment.content}</td>
                        <td><i class="fa-regular fa-clock"></i> ${comment.time}</td>
                        <td>${comment.post}</td>
                        <td class="status-cell"><span class="status ${statusClass}">${comment.status}</span></td>
                        <td>${comment.count}</td>
                        <td class="action-cell">
                            <button class="action-btn"><i class="fa-solid fa-ellipsis-vertical"></i></button>
                            <div class="action-dropdown">
                                <a href="#view">View</a>
                                <a href="#approve">Approve</a>
                                <a href="#delete">Delete</a>
                            </div>
                        </td>
                    `;
                    tableBody.appendChild(row);
                });
                break;
                
            case 'help-requests':
                rowData = [
                    { id: '#5124', requester: 'John Smith', issue: 'Account verification issue', time: '23 min', priority: 'High', status: 'Open', assignee: 'Unassigned' },
                    { id: '#5123', requester: 'Alice Chen', issue: 'Cannot upload code snippets', time: '1h 45 min', priority: 'Medium', status: 'In Progress', assignee: 'Admin User' },
                    { id: '#5122', requester: 'Carlos Diaz', issue: 'Profile image not updating', time: '3h 12 min', priority: 'Low', status: 'In Progress', assignee: 'Tech Support' },
                    { id: '#5121', requester: 'Sarah Kim', issue: 'Post formatting issues', time: '5h 30 min', priority: 'Medium', status: 'Open', assignee: 'Unassigned' },
                    { id: '#5120', requester: 'David Lee', issue: 'Payment declined', time: '8h 10 min', priority: 'High', status: 'Resolved', assignee: 'Billing Team' },
                ];
                
                rowData.forEach(request => {
                    let statusClass;
                    if (request.status === 'Open') statusClass = 'pending';
                    else if (request.status === 'In Progress') statusClass = 'pending';
                    else statusClass = 'approved';
                    
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${request.id}</td>
                        <td class="user-cell">
                            <img src="https://via.placeholder.com/30" alt="User">
                            <span>${request.requester}</span>
                        </td>
                        <td>${request.issue}</td>
                        <td><i class="fa-regular fa-clock"></i> ${request.time}</td>
                        <td>${request.priority}</td>
                        <td class="status-cell"><span class="status ${statusClass}">${request.status}</span></td>
                        <td>${request.assignee}</td>
                        <td class="action-cell">
                            <button class="action-btn"><i class="fa-solid fa-ellipsis-vertical"></i></button>
                            <div class="action-dropdown">
                                <a href="#view">View</a>
                                <a href="#assign">Assign</a>
                                <a href="#resolve">Resolve</a>
                            </div>
                        </td>
                    `;
                    tableBody.appendChild(row);
                });
                break;
                
            case 'reports':
                rowData = [
                    { id: '#6075', reporter: 'John Smith', type: 'Post', time: '30 min', reason: 'Inappropriate content', status: 'New', severity: 'Medium' },
                    { id: '#6074', reporter: 'Alice Chen', type: 'Comment', time: '1h 50 min', reason: 'Harassment', status: 'Investigating', severity: 'High' },
                    { id: '#6073', reporter: 'Carlos Diaz', type: 'User', time: '3h 25 min', reason: 'Spam', status: 'New', severity: 'Low' },
                    { id: '#6072', reporter: 'Sarah Kim', type: 'Post', time: '6h 15 min', reason: 'Plagiarism', status: 'Investigating', severity: 'Medium' },
                    { id: '#6071', reporter: 'David Lee', type: 'Comment', time: '12h 40 min', reason: 'Misinformation', status: 'Closed', severity: 'Medium' },
                ];
                
                rowData.forEach(report => {
                    let statusClass;
                    if (report.status === 'New') statusClass = 'pending';
                    else if (report.status === 'Investigating') statusClass = 'pending';
                    else statusClass = 'approved';
                    
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${report.id}</td>
                        <td class="user-cell">
                            <img src="https://via.placeholder.com/30" alt="User">
                            <span>${report.reporter}</span>
                        </td>
                        <td>${report.type}</td>
                        <td><i class="fa-regular fa-clock"></i> ${report.time}</td>
                        <td>${report.reason}</td>
                        <td class="status-cell"><span class="status ${statusClass}">${report.status}</span></td>
                        <td>${report.severity}</td>
                        <td class="action-cell">
                            <button class="action-btn"><i class="fa-solid fa-ellipsis-vertical"></i></button>
                            <div class="action-dropdown">
                                <a href="#view">View</a>
                                <a href="#investigate">Investigate</a>
                                <a href="#close">Close</a>
                            </div>
                        </td>
                    `;
                    tableBody.appendChild(row);
                });
                break;
                
            default: // Posts (default)
                // Use existing data from HTML
                break;
        }
    }

    // Busy Mode Toggle Handler
    function handleBusyModeToggle() {
        busyModeToggle.addEventListener('change', function() {
            if (this.checked) {
                statusIndicator.classList.remove('online');
                statusIndicator.classList.add('offline');
                statusText.textContent = 'Closed For Moderation';
                document.querySelector('.status-dot').style.backgroundColor = '#f44336';
            } else {
                statusIndicator.classList.remove('offline');
                statusIndicator.classList.add('online');
                statusText.textContent = 'Open For Moderation';
                document.querySelector('.status-dot').style.backgroundColor = '#4caf50';
            }
        });
    }

    // Action Button & Modal Handler
    function handleActionButtons() {
        // Attach event listeners to action buttons
        attachActionButtonListeners();
        
        // Close modal when clicking X button
        closeModal.addEventListener('click', function() {
            actionModal.style.display = 'none';
        });
        
        // Close modal when clicking outside the modal
        window.addEventListener('click', function(event) {
            if (event.target === actionModal) {
                actionModal.style.display = 'none';
            }
        });
        
        // Add action button functionality in modal
        const modalActions = document.querySelectorAll('.action-button');
        modalActions.forEach(action => {
            action.addEventListener('click', function() {
                const actionText = this.textContent.trim();
                console.log(`${actionText} action triggered`);
                
                // Display a success message (in real app would send to server)
                alert(`Action "${actionText}" performed successfully`);
                actionModal.style.display = 'none';
            });
        });
    }
    
    // Attach event listeners to action buttons
    function attachActionButtonListeners() {
        const actionButtons = document.querySelectorAll('.action-btn');
        actionButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation(); // Prevent bubbling to document click handler
                
                // Get row data
                const row = this.closest('tr');
                const itemId = row.cells[0].textContent;
                const itemName = row.cells[2].textContent;
                
                // Update modal title
                const modalTitle = document.querySelector('.modal-header h2');
                modalTitle.textContent = `Actions for ${itemId}: ${itemName}`;
                
                // Show modal
                actionModal.style.display = 'block';
            });
        });
    }
    
    // Tab Navigation Handler
    function handleTabNavigation() {
        tabLinks.forEach(tab => {
            tab.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Remove active class from all tabs
                tabLinks.forEach(t => t.classList.remove('active'));
                
                // Add active class to clicked tab
                this.classList.add('active');
                
                // Get tab type from href
                const tabType = this.getAttribute('href').substring(1);
                
                // Filter table content based on tab (in real app, would fetch filtered data)
                filterTableByTab(tabType);
            });
        });
    }
    
    // Filter table based on selected tab
    function filterTableByTab(tabType) {
        const tableRows = document.querySelectorAll('.data-table tbody tr');
        
        if (tabType === 'all') {
            // Show all rows
            tableRows.forEach(row => {
                row.style.display = '';
            });
            return;
        }
        
        // Determine which column contains the status based on current section
        let statusColumnIndex;
        switch(currentSection) {
            case 'posts':
            case 'comments':
            case 'help-requests':
            case 'reports':
                statusColumnIndex = 5; // Status is in column 5 (0-indexed)
                break;
            case 'users':
                statusColumnIndex = 5;
                break;
            default:
                statusColumnIndex = 5;
        }
        
        // Convert tabType to expected status value (adjust as needed for your data)
        let statusValue;
        switch(tabType) {
            case 'pending':
                statusValue = 'Pending';
                break;
            case 'approved':
                statusValue = 'Approved';
                break;
            case 'rejected':
                statusValue = 'Rejected';
                break;
            case 'flagged':
                statusValue = 'Flagged';
                break;
            case 'open':
                statusValue = 'Open';
                break;
            case 'inprogress':
                statusValue = 'In Progress';
                break;
            case 'resolved':
                statusValue = 'Resolved';
                break;
            case 'new':
                statusValue = 'New';
                break;
            case 'investigating':
                statusValue = 'Investigating';
                break;
            case 'closed':
                statusValue = 'Closed';
                break;
        }
        
        // Filter rows based on status
        tableRows.forEach(row => {
            const status = row.cells[statusColumnIndex].textContent.trim();
            if (status.includes(statusValue)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }
    
    // Pagination Handler
    function handlePagination() {
        paginationButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                // Skip if button is already active or is prev/next
                if (this.classList.contains('active') || 
                    this.classList.contains('prev') || 
                    this.classList.contains('next')) {
                    return;
                }
                
                // Remove active class from all buttons
                paginationButtons.forEach(b => b.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Get page number
                const pageNum = this.textContent;
                
                // In a real app, you would fetch data for this page
                console.log(`Navigated to page ${pageNum}`);
                
                // Simulate loading new page data
                // This would typically come from an API
            });
        });
        
        // Handle prev/next buttons
        const prevBtn = document.querySelector('.pagination-btn.prev');
        const nextBtn = document.querySelector('.pagination-btn.next');
        
        prevBtn.addEventListener('click', function() {
            const activeBtn = document.querySelector('.pagination-btn.active');
            if (activeBtn && activeBtn.previousElementSibling && 
                !activeBtn.previousElementSibling.classList.contains('prev')) {
                activeBtn.previousElementSibling.click();
            }
        });
        
        nextBtn.addEventListener('click', function() {
            const activeBtn = document.querySelector('.pagination-btn.active');
            if (activeBtn && activeBtn.nextElementSibling && 
                !activeBtn.nextElementSibling.classList.contains('next') && 
                !activeBtn.nextElementSibling.classList.contains('pagination-ellipsis')) {
                activeBtn.nextElementSibling.click();
            }
        });
    }
    
    // Sortable Table Headers
    function handleSortableHeaders() {
        attachSortableListeners();
    }
    
    // Attach listeners to sortable headers
    function attachSortableListeners() {
        const sortableHeaders = document.querySelectorAll('th.sortable');
        sortableHeaders.forEach(header => {
            header.addEventListener('click', function() {
                const icon = this.querySelector('i');
                const isAscending = icon.classList.contains('fa-sort') || icon.classList.contains('fa-sort-down');
                
                // Reset all icons
                document.querySelectorAll('th.sortable i').forEach(i => {
                    i.className = 'fa-solid fa-sort';
                });
                
                // Set current icon
                if (isAscending) {
                    icon.className = 'fa-solid fa-sort-up';
                } else {
                    icon.className = 'fa-solid fa-sort-down';
                }
                
                // Sort table
                sortTable(this, isAscending);
            });
        });
    }
    
    // Sort table based on column
    function sortTable(header, isAscending) {
        const table = document.querySelector('.data-table');
        const tbody = table.querySelector('tbody');
        const rows = Array.from(tbody.querySelectorAll('tr'));
        
        // Determine column index
        const headerCells = Array.from(table.querySelectorAll('th'));
        const columnIndex = headerCells.indexOf(header);
        
        // Sort rows
        rows.sort((a, b) => {
            let aValue = a.cells[columnIndex].textContent.trim();
            let bValue = b.cells[columnIndex].textContent.trim();
            
            // Handle special case for time values
            if (aValue.includes('min') || aValue.includes('h')) {
                // Convert to minutes for comparison
                aValue = convertTimeToMinutes(aValue);
                bValue = convertTimeToMinutes(bValue);
                return isAscending ? aValue - bValue : bValue - aValue;
            }
            
            // Regular string comparison
            if (isAscending) {
                return aValue.localeCompare(bValue);
            } else {
                return bValue.localeCompare(aValue);
            }
        });
        
        // Re-append rows in sorted order
        rows.forEach(row => tbody.appendChild(row));
    }
    
    // Convert time string to minutes
    function convertTimeToMinutes(timeStr) {
        timeStr = timeStr.replace(/[^0-9h\s]/g, '').trim();
        
        if (timeStr.includes('h')) {
            const parts = timeStr.split('h');
            const hours = parseInt(parts[0].trim());
            const minutes = parts[1] ? parseInt(parts[1].trim()) : 0;
            return hours * 60 + minutes;
        } else {
            return parseInt(timeStr);
        }
    }
    
    // Search functionality
    function handleSearch() {
        searchInput.addEventListener('keyup', function() {
            const searchTerm = this.value.toLowerCase();
            const tableRows = document.querySelectorAll('.data-table tbody tr');
            
            tableRows.forEach(row => {
                let found = false;
                
                // Search in all cells except action cell
                for (let i = 0; i < row.cells.length - 1; i++) {
                    const cellText = row.cells[i].textContent.toLowerCase();
                    if (cellText.includes(searchTerm)) {
                        found = true;
                        break;
                    }
                }
                
                row.style.display = found ? '' : 'none';
            });
        });
    }
    
    // Date filter functionality
    function handleDateFilters() {
        dateFilters.forEach(filter => {
            filter.addEventListener('change', function() {
                const startDate = new Date(document.getElementById('start-date').value);
                const endDate = new Date(document.getElementById('end-date').value);
                
                console.log(`Date filter applied: ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}`);
                
                // In a real app, this would filter data based on date range
                // For now, just log the action
                alert(`Filter applied: ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}`);
                
                // This would typically trigger a new API request with date filter parameters
            });
        });
    }
    
    // Profile dropdown handler
    function handleProfileDropdown() {
        const dropdownItems = document.querySelectorAll('.dropdown-content a');
        
        dropdownItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                
                const action = this.getAttribute('href').substring(1);
                
                switch(action) {
                    case 'profile':
                        console.log('Navigating to profile page');
                        alert('Profile page would open here');
                        break;
                    case 'settings':
                        // Navigate to settings section
                        document.querySelector('.nav-menu li a[href="#settings"]').click();
                        break;
                    case 'logout':
                        console.log('Logging out');
                        if (confirm('Are you sure you want to log out?')) {
                            alert('You have been logged out');
                            // In a real app, this would redirect to login page
                        }
                        break;
                }
            });
        });
        
        // Toggle dropdown visibility
        profileDropdown.addEventListener('click', function(e) {
            e.stopPropagation();
            this.querySelector('.dropdown-content').classList.toggle('show');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function() {
            const dropdowns = document.getElementsByClassName('dropdown-content');
            for (let i = 0; i < dropdowns.length; i++) {
                if (dropdowns[i].classList.contains('show')) {
                    dropdowns[i].classList.remove('show');
                }
            }
        });
    }
    
   // Fixed notification system
function handleNotifications() {
    const notificationBell = document.querySelector('.notifications');
    
    // Check if dropdown already exists to prevent duplicates
    if (notificationBell.querySelector('.notification-dropdown')) {
        return;
    }
    
    // Create notification dropdown
    const notificationDropdown = document.createElement('div');
    notificationDropdown.className = 'notification-dropdown';
    
    // Sample notifications
    const notifications = [
        { type: 'report', message: 'New report submitted', time: '5 minutes ago' },
        { type: 'comment', message: 'New flagged comment', time: '20 minutes ago' },
        { type: 'help', message: 'Urgent help request', time: '1 hour ago' }
    ];
    
    // Create notification items
    notifications.forEach(notification => {
        const notificationItem = document.createElement('div');
        notificationItem.className = 'notification-item';
        
        let icon;
        switch(notification.type) {
            case 'report':
                icon = 'fa-flag';
                break;
            case 'comment':
                icon = 'fa-comment';
                break;
            case 'help':
                icon = 'fa-hand-holding-hand';
                break;
            default:
                icon = 'fa-bell';
        }
        
        notificationItem.innerHTML = `
            <div class="notification-icon">
                <i class="fa-solid ${icon}"></i>
            </div>
            <div class="notification-content">
                <p>${notification.message}</p>
                <span class="notification-time">${notification.time}</span>
            </div>
            <div class="notification-actions">
                <button class="mark-read"><i class="fa-solid fa-check"></i></button>
            </div>
        `;
        
        notificationDropdown.appendChild(notificationItem);
    });
    
    // Add "View All" button
    const viewAllButton = document.createElement('div');
    viewAllButton.className = 'view-all-notifications';
    viewAllButton.textContent = 'View All Notifications';
    notificationDropdown.appendChild(viewAllButton);
    
    // Append dropdown to notifications container
    notificationBell.appendChild(notificationDropdown);
    
    // Toggle notification dropdown
    notificationBell.addEventListener('click', function(e) {
        e.stopPropagation();
        notificationDropdown.classList.toggle('show');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!notificationBell.contains(e.target)) {
            notificationDropdown.classList.remove('show');
        }
    });
    
    // Mark notifications as read
    document.querySelectorAll('.mark-read').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const notificationItem = this.closest('.notification-item');
            notificationItem.classList.add('read');
            
            // Decrease notification count
            const badge = document.querySelector('.notification-badge');
            const currentCount = parseInt(badge.textContent);
            if (currentCount > 0) {
                badge.textContent = currentCount - 1;
                
                // Hide badge if count reaches 0
                if (currentCount - 1 === 0) {
                    badge.style.display = 'none';
                }
            }
        });
    });
    
    // Handle "View All" button
    viewAllButton.addEventListener('click', function(e) {
        e.stopPropagation();
        
        // Mark all as read
        document.querySelectorAll('.notification-item').forEach(item => {
            item.classList.add('read');
        });
        
        // Reset badge
        const badge = document.querySelector('.notification-badge');
        badge.textContent = '0';
        badge.style.display = 'none';
        
        // Close dropdown
        notificationDropdown.classList.remove('show');
        
        // In a real app, redirect to notifications page
        alert('Redirecting to notifications page');
    });
}
    // Dashboard specific functionality
    function handleDashboard() {
        // This would add charts, stats, and other dashboard elements
        // For now, we'll just create a placeholder that would be shown when dashboard is selected
        
        const dashboardContent = `
            <div class="dashboard-stats">
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fa-solid fa-user"></i>
                    </div>
                    <div class="stat-content">
                        <h3>Total Users</h3>
                        <p class="stat-value">1,245</p>
                        <p class="stat-change positive">+5.2% <i class="fa-solid fa-arrow-up"></i></p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fa-solid fa-file-code"></i>
                    </div>
                    <div class="stat-content">
                        <h3>Total Posts</h3>
                        <p class="stat-value">3,782</p>
                        <p class="stat-change positive">+12.3% <i class="fa-solid fa-arrow-up"></i></p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fa-solid fa-comments"></i>
                    </div>
                    <div class="stat-content">
                        <h3>Comments</h3>
                        <p class="stat-value">8,492</p>
                        <p class="stat-change positive">+7.8% <i class="fa-solid fa-arrow-up"></i></p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fa-solid fa-flag"></i>
                    </div>
                    <div class="stat-content">
                        <h3>Reports</h3>
                        <p class="stat-value">147</p>
                        <p class="stat-change negative">+23.5% <i class="fa-solid fa-arrow-up"></i></p>
                    </div>
                </div>
            </div>
            <div class="dashboard-charts">
                <div class="chart-container">
                    <h3>User Activity</h3>
                    <div class="chart-placeholder">
                        <p>Chart would render here</p>
                    </div>
                </div>
                <div class="chart-container">
                    <h3>Content Distribution</h3>
                    <div class="chart-placeholder">
                        <p>Chart would render here</p>
                    </div>
                </div>
            </div>
            <div class="dashboard-tables">
                <div class="recent-activity">
                    <h3>Recent Activity</h3>
                    <table class="activity-table">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Action</th>
                                <th>Content</th>
                                <th>Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>John Smith</td>
                                <td>Created post</td>
                                <td>React useState Hook Issue</td>
                                <td>13 min ago</td>
                            </tr>
                            <tr>
                                <td>Alice Chen</td>
                                <td>Commented</td>
                                <td>Python List Comprehension Help</td>
                                <td>49 min ago</td>
                            </tr>
                            <tr>
                                <td>Carlos Diaz</td>
                                <td>Reported</td>
                                <td>CSS Grid Layout Problem</td>
                                <td>1h 7min ago</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        
        // Create function to show dashboard
        window.showDashboard = function() {
            const tableContainer = document.querySelector('.data-table-container');
            const tabNavigation = document.querySelector('.tab-navigation');
            const pagination = document.querySelector('.pagination');
            
            // Hide table elements
            tableContainer.style.display = 'none';
            tabNavigation.style.display = 'none';
            pagination.style.display = 'none';
            
            // Create dashboard container if it doesn't exist
            let dashboardContainer = document.querySelector('.dashboard-container');
            if (!dashboardContainer) {
                dashboardContainer = document.createElement('div');
                dashboardContainer.className = 'dashboard-container';
                dashboardContainer.innerHTML = dashboardContent;
                
                // Insert after content header
                const contentHeader = document.querySelector('.content-header');
                contentHeader.insertAdjacentElement('afterend', dashboardContainer);
            } else {
                dashboardContainer.style.display = 'block';
            }
        };
        
        // Create function to hide dashboard
        window.hideDashboard = function() {
            const dashboardContainer = document.querySelector('.dashboard-container');
            if (dashboardContainer) {
                dashboardContainer.style.display = 'none';
            }
            
            // Show table elements if applicable
            if (['users', 'posts', 'comments', 'help-requests', 'reports'].includes(currentSection)) {
                document.querySelector('.data-table-container').style.display = 'block';
                
                if (['posts', 'comments', 'help-requests', 'reports'].includes(currentSection)) {
                    document.querySelector('.tab-navigation').style.display = 'flex';
                }
                
                document.querySelector('.pagination').style.display = 'flex';
            }
        };
    }
    
    // Settings page functionality
    function handleSettings() {
        // Create settings content
        const settingsContent = `
            <div class="settings-container">
                <div class="settings-sidebar">
                    <ul class="settings-menu">
                        <li class="active" data-tab="general-settings">General Settings</li>
                        <li data-tab="account-settings">Account Settings</li>
                        <li data-tab="notification-settings">Notification Settings</li>
                        <li data-tab="security-settings">Security Settings</li>
                        <li data-tab="api-settings">API Settings</li>
                    </ul>
                </div>
                <div class="settings-content">
                    <div class="settings-tab active" id="general-settings">
                        <h2>General Settings</h2>
                        <form class="settings-form">
                            <div class="form-group">
                                <label>Site Name</label>
                                <input type="text" value="CodeCritic" class="form-control">
                            </div>
                            <div class="form-group">
                                <label>Site Description</label>
                                <textarea class="form-control">A platform for developers to share and critique code</textarea>
                            </div>
                            <div class="form-group">
                                <label>Default Language</label>
                                <select class="form-control">
                                    <option>English</option>
                                    <option>Spanish</option>
                                    <option>French</option>
                                    <option>German</option>
                                    <option>Chinese</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Timezone</label>
                                <select class="form-control">
                                    <option>UTC (GMT+0)</option>
                                    <option>Eastern Time (GMT-5)</option>
                                    <option>Pacific Time (GMT-8)</option>
                                    <option>Central European Time (GMT+1)</option>
                                    <option>Japan Standard Time (GMT+9)</option>
                                </select>
                            </div>
                            <button type="button" class="settings-save-btn">Save Changes</button>
                        </form>
                    </div>
                    <div class="settings-tab" id="account-settings">
                        <h2>Account Settings</h2>
                        <form class="settings-form">
                            <div class="form-group">
                                <label>Username</label>
                                <input type="text" value="AdminUser" class="form-control">
                            </div>
                            <div class="form-group">
                                <label>Email</label>
                                <input type="email" value="admin@codecritic.com" class="form-control">
                            </div>
                            <div class="form-group">
                                <label>Profile Picture</label>
                                <input type="file" class="form-control">
                            </div>
                            <div class="form-group">
                                <label>Change Password</label>
                                <input type="password" placeholder="Current Password" class="form-control">
                                <input type="password" placeholder="New Password" class="form-control mt-2">
                                <input type="password" placeholder="Confirm New Password" class="form-control mt-2">
                            </div>
                            <button type="button" class="settings-save-btn">Update Account</button>
                        </form>
                    </div>
                    <div class="settings-tab" id="notification-settings">
                        <h2>Notification Settings</h2>
                        <form class="settings-form">
                            <div class="form-group checkbox-group">
                                <label>Email Notifications</label>
                                <div class="checkbox-item">
                                    <input type="checkbox" id="email-new-post" checked>
                                    <label for="email-new-post">New posts</label>
                                </div>
                                <div class="checkbox-item">
                                    <input type="checkbox" id="email-reports" checked>
                                    <label for="email-reports">New reports</label>
                                </div>
                                <div class="checkbox-item">
                                    <input type="checkbox" id="email-help-requests" checked>
                                    <label for="email-help-requests">New help requests</label>
                                </div>
                            </div>
                            <div class="form-group checkbox-group">
                                <label>In-App Notifications</label>
                                <div class="checkbox-item">
                                    <input type="checkbox" id="app-new-user" checked>
                                    <label for="app-new-user">New user registrations</label>
                                </div>
                                <div class="checkbox-item">
                                    <input type="checkbox" id="app-comments" checked>
                                    <label for="app-comments">New comments</label>
                                </div>
                                <div class="checkbox-item">
                                    <input type="checkbox" id="app-system" checked>
                                    <label for="app-system">System alerts</label>
                                </div>
                            </div>
                            <div class="form-group">
                                <label>Notification Frequency</label>
                                <select class="form-control">
                                    <option>Immediate</option>
                                    <option>Hourly Digest</option>
                                    <option>Daily Digest</option>
                                    <option>Weekly Digest</option>
                                </select>
                            </div>
                            <button type="button" class="settings-save-btn">Save Notification Settings</button>
                        </form>
                    </div>
                    <div class="settings-tab" id="security-settings">
                        <h2>Security Settings</h2>
                        <form class="settings-form">
                            <div class="form-group checkbox-group">
                                <label>Two-Factor Authentication</label>
                                <div class="checkbox-item">
                                    <input type="checkbox" id="enable-2fa">
                                    <label for="enable-2fa">Enable 2FA</label>
                                </div>
                            </div>
                            <div class="form-group">
                                <label>Session Timeout</label>
                                <select class="form-control">
                                    <option>15 minutes</option>
                                    <option>30 minutes</option>
                                    <option selected>1 hour</option>
                                    <option>4 hours</option>
                                    <option>8 hours</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>API Access</label>
                                <div class="checkbox-item">
                                    <input type="checkbox" id="enable-api" checked>
                                    <label for="enable-api">Enable API Access</label>
                                </div>
                            </div>
                            <div class="form-group">
                                <label>Login History</label>
                                <button type="button" class="view-history-btn">View Login History</button>
                            </div>
                            <button type="button" class="settings-save-btn">Save Security Settings</button>
                        </form>
                    </div>
                    <div class="settings-tab" id="api-settings">
                        <h2>API Settings</h2>
                        <form class="settings-form">
                            <div class="form-group">
                                <label>API Key</label>
                                <div class="api-key-container">
                                    <input type="text" value="sk_live_51LTQGfKHD2rD9cXq58Uq5gX9zZ" class="form-control" readonly>
                                    <button type="button" class="copy-key-btn"><i class="fa-solid fa-copy"></i></button>
                                </div>
                                <button type="button" class="generate-key-btn">Generate New Key</button>
                            </div>
                            <div class="form-group">
                                <label>API Rate Limit</label>
                                <select class="form-control">
                                    <option>100 requests/min</option>
                                    <option selected>500 requests/min</option>
                                    <option>1000 requests/min</option>
                                    <option>5000 requests/min</option>
                                </select>
                            </div>
                            <div class="form-group checkbox-group">
                                <label>API Endpoints</label>
                                <div class="checkbox-item">
                                    <input type="checkbox" id="api-users" checked>
                                    <label for="api-users">Users</label>
                                </div>
                                <div class="checkbox-item">
                                    <input type="checkbox" id="api-posts" checked>
                                    <label for="api-posts">Posts</label>
                                </div>
                                <div class="checkbox-item">
                                    <input type="checkbox" id="api-comments" checked>
                                    <label for="api-comments">Comments</label>
                                </div>
                                <div class="checkbox-item">
                                    <input type="checkbox" id="api-analytics" checked>
                                    <label for="api-analytics">Analytics</label>
                                </div>
                            </div>
                            <div class="form-group">
                                <label>Webhook URL</label>
                                <input type="url" value="https://example.com/webhook" class="form-control">
                            </div>
                            <button type="button" class="settings-save-btn">Save API Settings</button>
                        </form>
                    </div>
                </div>
            </div>
        `;
        
        // Create function to show settings
        window.showSettings = function() {
            const tableContainer = document.querySelector('.data-table-container');
            const tabNavigation = document.querySelector('.tab-navigation');
            const pagination = document.querySelector('.pagination');
            const dashboardContainer = document.querySelector('.dashboard-container');
            
            // Hide other elements
            if (tableContainer) tableContainer.style.display = 'none';
            if (tabNavigation) tabNavigation.style.display = 'none';
            if (pagination) pagination.style.display = 'none';
            if (dashboardContainer) dashboardContainer.style.display = 'none';
            
            // Create settings container if it doesn't exist
            let settingsContainer = document.querySelector('.settings-container');
            if (!settingsContainer) {
                settingsContainer = document.createElement('div');
                settingsContainer.className = 'settings-container';
                settingsContainer.innerHTML = settingsContent;
                
                // Insert after content header
                const contentHeader = document.querySelector('.content-header');
                contentHeader.insertAdjacentElement('afterend', settingsContainer);
                
                // Add event listeners for settings tabs
                const settingsTabs = document.querySelectorAll('.settings-menu li');
                settingsTabs.forEach(tab => {
                    tab.addEventListener('click', function() {
                        // Remove active class from all tabs
                        settingsTabs.forEach(t => t.classList.remove('active'));
                        
                        // Add active class to clicked tab
                        this.classList.add('active');
                        
                        // Get tab ID
                        const tabId = this.getAttribute('data-tab');
                        
                        // Hide all tab content
                        document.querySelectorAll('.settings-tab').forEach(content => {
                            content.classList.remove('active');
                        });
                        
                        // Show selected tab content
                        document.getElementById(tabId).classList.add('active');
                    });
                });
                
                // Add event listeners for settings buttons
                document.querySelectorAll('.settings-save-btn').forEach(btn => {
                    btn.addEventListener('click', function() {
                        alert('Settings saved successfully!');
                    });
                });
                
                // Copy API key button
                const copyKeyBtn = document.querySelector('.copy-key-btn');
                if (copyKeyBtn) {
                    copyKeyBtn.addEventListener('click', function() {
                        const apiKeyInput = document.querySelector('.api-key-container input');
                        apiKeyInput.select();
                        document.execCommand('copy');
                        alert('API Key copied to clipboard!');
                    });
                }
                
                // Generate new API key button
                const generateKeyBtn = document.querySelector('.generate-key-btn');
                if (generateKeyBtn) {
                    generateKeyBtn.addEventListener('click', function() {
                        if (confirm('Are you sure you want to generate a new API key? This will invalidate your current key.')) {
                            const apiKeyInput = document.querySelector('.api-key-container input');
                            // Generate a random API key (in a real app, this would be from the server)
                            const newKey = 'sk_live_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
                            apiKeyInput.value = newKey;
                            alert('New API key generated successfully!');
                        }
                    });
                }
                
                // View login history button
                const viewHistoryBtn = document.querySelector('.view-history-btn');
                if (viewHistoryBtn) {
                    viewHistoryBtn.addEventListener('click', function() {
                        alert('Login history would be displayed in a modal or new page');
                    });
                }
            } else {
                settingsContainer.style.display = 'flex';
            }
        };
        
        // Create function to hide settings
        window.hideSettings = function() {
            const settingsContainer = document.querySelector('.settings-container');
            if (settingsContainer) {
                settingsContainer.style.display = 'none';
            }
        };
    }
    
    // Initialize all functionality
    function init() {
        handleNavigation();
        handleBusyModeToggle();
        handleActionButtons();
        handleTabNavigation();
        handlePagination();
        handleSortableHeaders();
        handleSearch();
        handleDateFilters();
        handleProfileDropdown();
        handleNotifications();
        handleDashboard();
        handleSettings();
        
        // Custom section handlers
        document.querySelectorAll('.nav-menu li a').forEach(link => {
            link.addEventListener('click', function() {
                const section = this.getAttribute('href').substring(1);
                
                // Hide all containers first
                window.hideDashboard();
                window.hideSettings();
                
                // Show appropriate section
                if (section === 'dashboard') {
                    window.showDashboard();
                } else if (section === 'settings') {
                    window.showSettings();
                }
            });
        });
    }
    
    // Initialize the application
    init();
});