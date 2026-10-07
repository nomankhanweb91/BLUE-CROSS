/**
 * BLUE CROSS — Donation Modal & Payment Controller
 * Pure Vanilla JavaScript | Accessible | Light Theme UI
 */

const DONATION_CONFIG = {
  upiId: "REPLACE_WITH_REAL_UPI_ID",
  qrCode: "assets/donation-qr.png"
};

// Global state
let currentDonationAmount = 50;
let currentDonationPurpose = "Children's Education";

function initDonationSystem() {
  // Attach event listeners to all donation trigger buttons
  document.querySelectorAll('[data-donate-trigger]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const purpose = btn.getAttribute('data-purpose') || "General Education Support";
      const preAmount = btn.getAttribute('data-amount');
      openDonationModal(purpose, preAmount ? parseInt(preAmount, 10) : 50);
    });
  });

  // Modal close buttons
  const modalOverlay = document.getElementById('donationModalOverlay');
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closeDonationModal();
      }
    });

    const closeBtn = document.getElementById('closeDonationModalBtn');
    if (closeBtn) {
      closeBtn.addEventListener('click', closeDonationModal);
    }

    // Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
        closeDonationModal();
      }
    });

    // Preset amount buttons inside modal
    const amountBtns = modalOverlay.querySelectorAll('.amount-btn');
    const customInput = document.getElementById('customAmountInput');

    amountBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        amountBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const val = parseInt(btn.getAttribute('data-val'), 10);
        currentDonationAmount = val;
        if (customInput) customInput.value = val;
        updateUpiIntentLink();
      });
    });

    if (customInput) {
      customInput.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10) || 0;
        currentDonationAmount = val;
        amountBtns.forEach(b => {
          if (parseInt(b.getAttribute('data-val'), 10) === val) {
            b.classList.add('active');
          } else {
            b.classList.remove('active');
          }
        });
        updateUpiIntentLink();
      });
    }

    // Copy UPI Button
    const copyBtn = document.getElementById('copyUpiIdBtn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(DONATION_CONFIG.upiId).then(() => {
          showToast('UPI ID copied to clipboard!');
        }).catch(() => {
          // Fallback
          const tempInput = document.createElement('input');
          tempInput.value = DONATION_CONFIG.upiId;
          document.body.appendChild(tempInput);
          tempInput.select();
          document.execCommand('copy');
          document.body.removeChild(tempInput);
          showToast('UPI ID copied to clipboard!');
        });
      });
    }
  }
}

function openDonationModal(purpose = "Education Support", amount = 50) {
  const modalOverlay = document.getElementById('donationModalOverlay');
  if (!modalOverlay) return;

  currentDonationPurpose = purpose;
  currentDonationAmount = amount;

  const purposeEl = document.getElementById('modalDonationPurpose');
  if (purposeEl) {
    purposeEl.textContent = `Supporting: ${purpose}`;
  }

  const customInput = document.getElementById('customAmountInput');
  if (customInput) {
    customInput.value = amount;
  }

  const amountBtns = modalOverlay.querySelectorAll('.amount-btn');
  amountBtns.forEach(btn => {
    if (parseInt(btn.getAttribute('data-val'), 10) === amount) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  const upiDisplay = document.getElementById('displayUpiId');
  if (upiDisplay) {
    upiDisplay.textContent = DONATION_CONFIG.upiId;
  }

  const qrImg = document.getElementById('displayQrImage');
  if (qrImg) {
    qrImg.src = DONATION_CONFIG.qrCode;
  }

  updateUpiIntentLink();

  modalOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeDonationModal() {
  const modalOverlay = document.getElementById('donationModalOverlay');
  if (modalOverlay) {
    modalOverlay.classList.remove('active');
  }
  document.body.style.overflow = '';
}

function updateUpiIntentLink() {
  const upiLink = document.getElementById('upiAppIntentLink');
  if (upiLink && DONATION_CONFIG.upiId !== "REPLACE_WITH_REAL_UPI_ID") {
    const note = encodeURIComponent(`BLUE CROSS Donation - ${currentDonationPurpose}`);
    upiLink.href = `upi://pay?pa=${encodeURIComponent(DONATION_CONFIG.upiId)}&pn=BLUE%20CROSS&am=${currentDonationAmount}&cu=INR&tn=${note}`;
    upiLink.style.display = 'inline-flex';
  } else if (upiLink) {
    upiLink.style.display = 'none';
  }
}

// Global Toast function
function showToast(message) {
  let toast = document.getElementById('globalToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'globalToast';
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span>✓</span> <span>${message}</span>`;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

// Auto-run on DOM ready
document.addEventListener('DOMContentLoaded', initDonationSystem);
