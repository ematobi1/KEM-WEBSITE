/**
 * Tracking Page JavaScript
 * Handles tracking form submission and display
 */

document.addEventListener('DOMContentLoaded', function() {
    const trackingForm = document.querySelector('.futuristic-tracking-form');
    const trackingInput = document.querySelector('#tracking-input');
    const resultsContainer = document.querySelector('.tracking-results');
    const timelineDisplay = document.querySelector('#timeline-display');

    if (trackingForm) {
        trackingForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const trackingNumber = trackingInput.value.trim();

            if (!trackingNumber) {
                alert('Please enter a tracking number');
                return;
            }

            // Show loading state
            showLoadingState();

            // Simulate API call
            setTimeout(() => {
                showTrackingResults(trackingNumber);
            }, 1500);
        });
    }

    function showLoadingState() {
        resultsContainer.innerHTML = `
            <div class="results-placeholder">
                <div class="scanner-animation">
                    <div class="scan-line"></div>
                    <svg width="120" height="120" viewBox="0 0 120 120">
                        <circle cx="60" cy="60" r="50" class="scan-circle scan-circle-1"/>
                        <circle cx="60" cy="60" r="40" class="scan-circle scan-circle-2"/>
                        <circle cx="60" cy="60" r="30" class="scan-circle scan-circle-3"/>
                    </svg>
                </div>
                <p>Scanning global logistics network...</p>
            </div>
        `;
    }

    function showTrackingResults(trackingNumber) {
        // Sample tracking data
        const trackingData = {
            number: trackingNumber,
            status: 'In Transit',
            origin: 'Atlanta, GA',
            destination: 'Washington, DC',
            estimatedDelivery: 'Jan 16, 2025 3:00 PM',
            currentLocation: 'Richmond, VA'
        };

        resultsContainer.innerHTML = `
            <div style="text-align: left;">
                <h3 style="color: #fff; margin-bottom: 1.5rem; font-size: 1.5rem;">
                    Tracking: ${trackingData.number}
                </h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem;">
                    <div>
                        <p style="color: rgba(255,255,255,0.6); font-size: 0.875rem; margin-bottom: 0.5rem;">Status</p>
                        <p style="color: #ff9900; font-weight: 700; font-size: 1.125rem;">${trackingData.status}</p>
                    </div>
                    <div>
                        <p style="color: rgba(255,255,255,0.6); font-size: 0.875rem; margin-bottom: 0.5rem;">Current Location</p>
                        <p style="color: #fff; font-weight: 600;">${trackingData.currentLocation}</p>
                    </div>
                    <div>
                        <p style="color: rgba(255,255,255,0.6); font-size: 0.875rem; margin-bottom: 0.5rem;">Estimated Delivery</p>
                        <p style="color: #00a8e1; font-weight: 600;">${trackingData.estimatedDelivery}</p>
                    </div>
                </div>
                <div style="margin-top: 2rem; padding-top: 2rem; border-top: 1px solid rgba(255,255,255,0.1);">
                    <p style="color: rgba(255,255,255,0.8);">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle; margin-right: 0.5rem;">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        ${trackingData.origin} → ${trackingData.destination}
                    </p>
                </div>
            </div>
        `;

        // Show timeline
        if (timelineDisplay) {
            timelineDisplay.style.display = 'block';
            // Smooth scroll to timeline
            setTimeout(() => {
                timelineDisplay.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 300);
        }
    }
});
