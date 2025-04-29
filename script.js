document.addEventListener('DOMContentLoaded', () => {
    // Navigation sticky behavior
    const nav = document.querySelector('.main-nav');
    const hero = document.querySelector('.hero');
    const heroHeight = hero.offsetHeight;

    function handleScroll() {
        if (window.scrollY > heroHeight) {
            nav.classList.add('sticky');
            document.body.style.paddingTop = nav.offsetHeight + 'px';
        } else {
            nav.classList.remove('sticky');
            document.body.style.paddingTop = '0';
        }
    }

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial position

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // FAQ Accordion
    const accordionItems = document.querySelectorAll('.accordion-item');
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all accordion items
            accordionItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // Form submission handling
    const rsvpForm = document.getElementById('rsvp-form');
    if (rsvpForm) {
        rsvpForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(rsvpForm);
            const data = Object.fromEntries(formData.entries());
            
            // Here you would typically send the data to a server
            // For now, we'll just show a success message
            alert('Thank you for your RSVP! We look forward to seeing you at our wedding.');
            rsvpForm.reset();
        });
    }

    // Add animation to sections when they come into view
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('fade-out');
        observer.observe(section);
    });

    // Photo Upload Preview
    const photoInput = document.getElementById('photo-input');
    const photoGallery = document.getElementById('photo-gallery');
    if (photoInput && photoGallery) {
        photoInput.addEventListener('change', (e) => {
            photoGallery.innerHTML = '';
            const files = Array.from(e.target.files);
            files.forEach(file => {
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = function(evt) {
                        const img = document.createElement('img');
                        img.src = evt.target.result;
                        photoGallery.appendChild(img);
                    };
                    reader.readAsDataURL(file);
                }
            });
        });
    }

    document.getElementById('photo-input').addEventListener('change', function(e) {
        const uploadForm = document.querySelector('.photo-upload-form');
        const selectButton = document.querySelector('.photo-upload-form label');
        
        if (this.files && this.files.length > 0) {
            // Hide the select button
            selectButton.style.display = 'none';
            
            // Create upload button if it doesn't exist
            if (!document.querySelector('.upload-btn')) {
                const uploadBtn = document.createElement('button');
                uploadBtn.className = 'upload-btn';
                uploadBtn.innerHTML = '<i class="fas fa-upload"></i> Upload Selected Photos';
                uploadForm.appendChild(uploadBtn);

                // Add click handler to the upload button
                uploadBtn.addEventListener('click', function() {
                    // Here you would typically handle the actual upload
                    // For now, we'll just simulate the upload
                    const successMessage = document.createElement('div');
                    successMessage.className = 'upload-success';
                    successMessage.innerHTML = '<i class="fas fa-check-circle"></i> Photos uploaded successfully!';
                    uploadForm.appendChild(successMessage);

                    // Reset the form and restore initial state after a short delay
                    setTimeout(() => {
                        document.getElementById('photo-input').value = '';
                        selectButton.style.display = 'flex';
                        uploadBtn.remove();
                        successMessage.remove();
                        // Reload the page
                        window.location.reload();
                    }, 10000);
                });
            }
        }
    });
}); 