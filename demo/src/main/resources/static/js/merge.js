document.addEventListener('DOMContentLoaded', function() {
    // Dropdown functionality
    const mergeMethodBtn = document.getElementById('merge-method-btn');
    const mergeMethodDropdown = document.getElementById('merge-method-dropdown');
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    const selectedMethod = document.getElementById('selected-method');
    
    // Merge button and modal
    const mergeButton = document.getElementById('merge-button');
    const mergeModal = document.getElementById('merge-modal');
    const closeModal = document.getElementById('close-modal');
    const cancelMerge = document.getElementById('cancel-merge');
    const confirmMerge = document.getElementById('confirm-merge');
    
    // Success message
    const successMessage = document.getElementById('success-message');
    const closeSuccess = document.getElementById('close-success');
    
    // Expand file diff
    const expandButtons = document.querySelectorAll('.expand-diff');
    
    // Toggle dropdown
    mergeMethodBtn.addEventListener('click', function(e) {
        e.preventDefault();
        mergeMethodDropdown.classList.toggle('show');
    });
    
    // Close dropdown when clicking outside
    window.addEventListener('click', function(e) {
        if (!mergeMethodBtn.contains(e.target) && !mergeMethodDropdown.contains(e.target)) {
            mergeMethodDropdown.classList.remove('show');
        }
    });
    
    // Handle dropdown item selection
    dropdownItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const value = this.getAttribute('data-value');
            selectedMethod.textContent = value;
            mergeMethodDropdown.classList.remove('show');
        });
    });
    
    // Open merge modal
    mergeButton.addEventListener('click', function() {
        mergeModal.classList.add('show');
    });
    
    // Close merge modal
    closeModal.addEventListener('click', function() {
        mergeModal.classList.remove('show');
    });
    
    cancelMerge.addEventListener('click', function() {
        mergeModal.classList.remove('show');
    });
    
    // Handle merge confirmation
    confirmMerge.addEventListener('click', function() {
        // Show loading state
        confirmMerge.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Merging...';
        confirmMerge.disabled = true;
        
        // Simulate API call
        setTimeout(function() {
            mergeModal.classList.remove('show');
            successMessage.classList.add('show');
            
            // Update UI to show merged state
            mergeButton.innerHTML = '<i class="fa-solid fa-check"></i> Merged';
            mergeButton.disabled = true;
            mergeButton.classList.remove('btn-primary');
            mergeButton.classList.add('btn-outline');
            
            // Reset confirm button
            confirmMerge.innerHTML = '<i class="fa-solid fa-code-merge"></i> Confirm merge';
            confirmMerge.disabled = false;
            
            // Auto hide success message after 5 seconds
            setTimeout(function() {
                successMessage.classList.remove('show');
            }, 5000);
        }, 1500);
    });
    
    // Close success message
    closeSuccess.addEventListener('click', function() {
        successMessage.classList.remove('show');
    });
    
    // Expand file diff
    expandButtons.forEach(button => {
        button.addEventListener('click', function() {
            const diffView = this.closest('.diff-view');
            diffView.classList.remove('collapsed');
            diffView.style.maxHeight = 'none';
        });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === mergeModal) {
            mergeModal.classList.remove('show');
        }
    });
    
    // Escape key to close modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            mergeModal.classList.remove('show');
            successMessage.classList.remove('show');
        }
    });
});