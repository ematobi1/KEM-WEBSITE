/**
 * Payment Page JavaScript
 * Handles payment form and calculations
 */

document.addEventListener('DOMContentLoaded', function() {
    const paymentForm = document.querySelector('#payment-form');
    const amountInput = document.querySelector('#amount');
    const paymentMethodInputs = document.querySelectorAll('input[name="payment-method"]');
    const cardDetailsSection = document.querySelector('#card-details');

    // Update summary amounts
    if (amountInput) {
        amountInput.addEventListener('input', updateSummary);
    }

    // Payment method selection
    paymentMethodInputs.forEach(input => {
        input.addEventListener('change', function() {
            // Update active state
            document.querySelectorAll('.payment-method-card').forEach(card => {
                card.classList.remove('active');
            });
            this.closest('.payment-method-card').classList.add('active');

            // Show/hide card details
            if (this.value === 'credit-card' && cardDetailsSection) {
                cardDetailsSection.style.display = 'block';
            } else if (cardDetailsSection) {
                cardDetailsSection.style.display = 'none';
            }
        });
    });

    // Card number formatting
    const cardNumberInput = document.querySelector('#card-number');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\s/g, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            e.target.value = formattedValue;
        });
    }

    // Expiry date formatting
    const expiryInput = document.querySelector('#expiry');
    if (expiryInput) {
        expiryInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.slice(0, 2) + '/' + value.slice(2, 4);
            }
            e.target.value = value;
        });
    }

    // Form submission
    if (paymentForm) {
        paymentForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const selectedMethod = document.querySelector('input[name="payment-method"]:checked');
            const amount = amountInput.value;

            if (!selectedMethod) {
                alert('Please select a payment method');
                return;
            }

            if (!amount || amount <= 0) {
                alert('Please enter a valid amount');
                return;
            }

            // Show processing state
            showProcessingState();

            // Simulate payment processing
            setTimeout(() => {
                showSuccessMessage(amount, selectedMethod.value);
            }, 2000);
        });
    }

    function updateSummary() {
        const amount = parseFloat(amountInput.value) || 0;
        const processingFee = amount * 0.029; // 2.9% processing fee
        const total = amount + processingFee;

        document.querySelector('#subtotal').textContent = `$${amount.toFixed(2)}`;
        document.querySelector('#processing-fee').textContent = `$${processingFee.toFixed(2)}`;
        document.querySelector('#total-amount').textContent = `$${total.toFixed(2)}`;
    }

    function showProcessingState() {
        const submitButton = paymentForm.querySelector('button[type="submit"]');
        submitButton.innerHTML = `
            <span class="btn-text">Processing Payment...</span>
            <span class="btn-glow"></span>
        `;
        submitButton.disabled = true;
    }

    function showSuccessMessage(amount, method) {
        const methodNames = {
            'credit-card': 'Credit/Debit Card',
            'bank-transfer': 'Bank Transfer',
            'crypto': 'Cryptocurrency'
        };

        alert(`Payment of $${amount} via ${methodNames[method]} has been successfully processed!\\n\\nThank you for your payment. You will receive a confirmation email shortly.`);

        // Reset form
        paymentForm.reset();
        updateSummary();

        const submitButton = paymentForm.querySelector('button[type="submit"]');
        submitButton.innerHTML = `
            <span class="btn-text">Process Secure Payment</span>
            <span class="btn-glow"></span>
            <svg class="btn-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
        `;
        submitButton.disabled = false;
    }

    // Initialize summary with default values
    updateSummary();
});
