// =======================
// FAQ Accordion
// =======================
document.querySelectorAll('.faq-item').forEach(item => {
    item.addEventListener('click', function () {
        const isActive = this.classList.contains('active');

        document.querySelectorAll('.faq-item').forEach(faq => {
            faq.classList.remove('active');
        });

        if (!isActive) {
            this.classList.add('active');
        }
    });
});

// =======================
// Contact Card Click Effects
// =======================
document.querySelectorAll('.contact-card').forEach(card => {
    card.addEventListener('click', function () {
        const cardTitle = this.querySelector('h3').textContent;
        console.log(`Contact method clicked: ${cardTitle}`);

        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
        }, 200);
    });
});

// =======================
// Form Submission (Backend Integrated)
// =======================
document.getElementById('contactForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = {
        firstName: document.getElementById('firstName').value.trim(),
        lastName: document.getElementById('lastName').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value.trim(),
    };

    try {
        const res = await fetch("https://final-pro-lgyf.onrender.com/api/contact", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        if (!res.ok) {
            console.error("Failed to send message");
            return;
        }

        console.log("Message sent successfully");

        // Show success modal
        document.getElementById('successModal').classList.add('show');

        // Reset form
        this.reset();

    } catch (error) {
        console.error("Server error:", error);
    }
});

// =======================
// Modal Controls
// =======================
function closeModal() {
    document.getElementById('successModal').classList.remove('show');
}

// Close modal when clicking outside
document.getElementById('successModal').addEventListener('click', function (e) {
    if (e.target === this) {
        closeModal();
    }
});
