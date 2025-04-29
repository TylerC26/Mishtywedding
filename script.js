document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Photo Gallery
    const galleryContainer = document.querySelector('.gallery-container');
    if (galleryContainer) {
        // Add your gallery images here
        const galleryImages = [
            'path/to/image1.jpg',
            'path/to/image2.jpg',
            'path/to/image3.jpg'
        ];

        let currentIndex = 0;

        function updateGallery() {
            galleryContainer.style.backgroundImage = `url(${galleryImages[currentIndex]})`;
            galleryContainer.style.backgroundSize = 'cover';
            galleryContainer.style.backgroundPosition = 'center';
        }

        document.querySelector('.gallery-nav.prev').addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
            updateGallery();
        });

        document.querySelector('.gallery-nav.next').addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % galleryImages.length;
            updateGallery();
        });

        // Initialize gallery
        updateGallery();
    }

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
}); 