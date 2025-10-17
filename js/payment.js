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
            'bank-transfer': 'Bank Transfer'
        };

        // Generate receipt
        generateReceipt(amount, method);

        alert(`Payment of $${amount} via ${methodNames[method]} has been successfully processed!\\n\\nYour receipt has been generated and will be downloaded automatically.`);

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

    function generateReceipt(amount, method) {
        const methodNames = {
            'credit-card': 'Credit/Debit Card',
            'bank-transfer': 'Bank Transfer'
        };

        const invoiceNumber = document.querySelector('#invoice-number').value || 'N/A';
        const email = document.querySelector('#billing-email').value;
        const phone = document.querySelector('#billing-phone').value;
        const date = new Date().toLocaleString();
        const transactionId = 'TXN' + Date.now();
        const processingFee = (parseFloat(amount) * 0.029).toFixed(2);
        const total = (parseFloat(amount) + parseFloat(processingFee)).toFixed(2);

        // Create receipt HTML
        const receiptHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Receipt - KEM Logistics</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; }
        .receipt-header { text-align: center; border-bottom: 3px solid #ff9900; padding-bottom: 20px; margin-bottom: 30px; }
        .receipt-header h1 { color: #ff9900; margin: 0; }
        .receipt-info { margin: 20px 0; }
        .receipt-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
        .receipt-row.total { font-size: 1.2em; font-weight: bold; border-top: 2px solid #333; margin-top: 20px; }
        .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; color: #666; }
    </style>
</head>
<body>
    <div class="receipt-header">
        <h1>KEM LOGISTICS</h1>
        <p>Payment Receipt</p>
    </div>

    <div class="receipt-info">
        <div class="receipt-row">
            <span>Transaction ID:</span>
            <strong>${transactionId}</strong>
        </div>
        <div class="receipt-row">
            <span>Date & Time:</span>
            <strong>${date}</strong>
        </div>
        <div class="receipt-row">
            <span>Invoice Number:</span>
            <strong>${invoiceNumber}</strong>
        </div>
        <div class="receipt-row">
            <span>Email:</span>
            <strong>${email}</strong>
        </div>
        <div class="receipt-row">
            <span>Phone:</span>
            <strong>${phone}</strong>
        </div>
        <div class="receipt-row">
            <span>Payment Method:</span>
            <strong>${methodNames[method]}</strong>
        </div>
        <div class="receipt-row">
            <span>Subtotal:</span>
            <strong>$${amount}</strong>
        </div>
        <div class="receipt-row">
            <span>Processing Fee (2.9%):</span>
            <strong>$${processingFee}</strong>
        </div>
        <div class="receipt-row total">
            <span>Total Paid:</span>
            <strong>$${total}</strong>
        </div>
    </div>

    <div class="footer">
        <p><strong>Thank you for your payment!</strong></p>
        <p>KEM Logistics And Solutions LLC</p>
        <p>972 Holly Meadow Dr, Buford, GA 30518</p>
        <p>Phone: 1-470-836-3519 | Email: kemlogistics23@gmail.com</p>
    </div>
</body>
</html>
        `;

        // Create a Blob with the HTML content
        const blob = new Blob([receiptHTML], { type: 'text/html' });
        const url = URL.createObjectURL(blob);

        // Create a download link and trigger it
        const downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.download = `KEM_Receipt_${transactionId}.html`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(url);
    }

    // Initialize summary with default values
    updateSummary();
});
