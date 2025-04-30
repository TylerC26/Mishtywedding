document.addEventListener('DOMContentLoaded', () => {
    // Restore scroll position if it exists
    const savedScrollPosition = sessionStorage.getItem('scrollPosition');
    if (savedScrollPosition) {
        window.scrollTo(0, savedScrollPosition);
        sessionStorage.removeItem('scrollPosition');
    }

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
    const progressBar = document.getElementById('progressBar');
    const uploadStatus = document.getElementById('uploadStatus');
    const selectButton = document.querySelector('.photo-upload-form label');
    const previewContainer = document.createElement('div');
    previewContainer.className = 'preview-container';
    document.querySelector('.photo-upload-form').appendChild(previewContainer);
    
    // Hide containers by default
    previewContainer.style.display = 'none';
    if (progressBar) {
        progressBar.parentElement.style.display = 'none';
    }

    if (photoInput) {
        // Handle file selection
        photoInput.addEventListener('change', (e) => {
            const files = Array.from(e.target.files);
            
            if (files.length === 0) {
                previewContainer.style.display = 'none';
                return;
            }

            // Show preview container
            previewContainer.style.display = 'grid';
            
            // Clear previous previews
            previewContainer.innerHTML = '';
            
            // Show preview of selected photos
            files.forEach(file => {
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = function(evt) {
                        const previewItem = document.createElement('div');
                        previewItem.className = 'preview-item';
                        
                        const img = document.createElement('img');
                        img.src = evt.target.result;
                        
                        const removeBtn = document.createElement('button');
                        removeBtn.className = 'remove-preview';
                        removeBtn.innerHTML = '<i class="fas fa-times"></i>';
                        removeBtn.onclick = () => {
                            previewItem.remove();
                            if (previewContainer.children.length === 0) {
                                previewContainer.style.display = 'none';
                                selectButton.style.display = 'flex';
                            }
                        };
                        
                        previewItem.appendChild(img);
                        previewItem.appendChild(removeBtn);
                        previewContainer.appendChild(previewItem);
                    };
                    reader.readAsDataURL(file);
                }
            });

            // Change select button to upload button
            selectButton.innerHTML = '<i class="fas fa-upload"></i><span class="upload-text">Upload Photos</span>';
            // Remove all existing click handlers
            const newSelectButton = selectButton.cloneNode(true);
            selectButton.parentNode.replaceChild(newSelectButton, selectButton);
            // Add the upload handler to the new button
            newSelectButton.onclick = async (e) => {
                e.preventDefault();
                if (files.length === 0) {
                    return;
                }

                console.log('Starting upload process...');
                console.log('Number of files:', files.length);

                try {
                    // Show progress bar
                    if (progressBar) {
                        progressBar.parentElement.style.display = 'block';
                    }

                    // Get storage reference
                    const storage = firebase.storage();
                    console.log('Storage reference obtained');

                    // Track completed uploads
                    let completedUploads = 0;

                    // Upload each file
                    for (let i = 0; i < files.length; i++) {
                        const file = files[i];
                        console.log('Processing file:', file.name);
                        
                        const timestamp = new Date().getTime();
                        const fileName = `${timestamp}_${file.name}`;
                        console.log('Generated filename:', fileName);
                        
                        const storageRef = storage.ref(`wedding_photos/${fileName}`);
                        console.log('Storage reference created:', storageRef.fullPath);

                        // Upload the file
                        console.log('Starting file upload...');
                        const uploadTask = storageRef.put(file);

                        // Monitor upload progress
                        uploadTask.on('state_changed',
                            (snapshot) => {
                                // Progress monitoring
                                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                                console.log('Upload progress:', progress);
                                if (progressBar) {
                                    progressBar.style.width = progress + '%';
                                    // Hide progress bar when at 0%
                                    if (progress === 0) {
                                        progressBar.parentElement.style.display = 'none';
                                    } else {
                                        progressBar.parentElement.style.display = 'block';
                                    }
                                }
                                if (uploadStatus) {
                                    uploadStatus.textContent = `Uploading: ${Math.round(progress)}%`;
                                }
                            },
                            (error) => {
                                // Handle unsuccessful uploads
                                console.error('Upload failed:', error);
                                console.error('Error code:', error.code);
                                console.error('Error message:', error.message);
                                if (uploadStatus) {
                                    uploadStatus.textContent = 'Upload failed. Please try again.';
                                }
                                if (progressBar) {
                                    progressBar.parentElement.style.display = 'none';
                                }
                            },
                            async () => {
                                try {
                                    console.log('Upload completed, getting download URL...');
                                    // Get the download URL
                                    const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
                                    console.log('Download URL obtained:', downloadURL);
                                    
                                    completedUploads++;
                                    
                                    // Show success message only when all files are uploaded
                                    if (completedUploads === files.length) {
                                        if (uploadStatus) {
                                            uploadStatus.textContent = 'Upload successful!';
                                        }
                                        if (progressBar) {
                                            progressBar.style.width = '0%';
                                            progressBar.parentElement.style.display = 'none';
                                        }
                                        
                                        const successMessage = document.createElement('div');
                                        successMessage.className = 'upload-success';
                                        successMessage.innerHTML = '<i class="fas fa-check-circle"></i> Photos uploaded successfully!';
                                        document.querySelector('.photo-upload-form').appendChild(successMessage);
                                        
                                        // Store current scroll position
                                        sessionStorage.setItem('scrollPosition', window.scrollY);
                                        
                                        // Remove success message after 3 seconds and refresh
                                        setTimeout(() => {
                                            successMessage.remove();
                                            // Refresh the page
                                            window.location.reload();
                                        }, 3000);

                                        // Clear preview container and reset form
                                        previewContainer.innerHTML = '';
                                        previewContainer.style.display = 'none';
                                        photoInput.value = '';
                                        
                                        // Reset select button
                                        newSelectButton.innerHTML = '<i class="fas fa-cloud-upload-alt"></i><span class="upload-text">Select Photos</span>';
                                        newSelectButton.onclick = (e) => {
                                            e.preventDefault();
                                            photoInput.click();
                                        };
                                    }
                                } catch (error) {
                                    console.error('Error getting download URL:', error);
                                    console.error('Error code:', error.code);
                                    console.error('Error message:', error.message);
                                    if (uploadStatus) {
                                        uploadStatus.textContent = 'Error processing upload. Please try again.';
                                    }
                                }
                            }
                        );
                    }
                } catch (error) {
                    console.error('Error during upload:', error);
                    console.error('Error code:', error.code);
                    console.error('Error message:', error.message);
                    if (uploadStatus) {
                        uploadStatus.textContent = 'An error occurred. Please try again.';
                    }
                    if (progressBar) {
                        progressBar.parentElement.style.display = 'none';
                    }
                }
            };
        });

        // Handle click on the select button - only for initial state
        if (selectButton) {
            selectButton.onclick = (e) => {
                e.preventDefault();
                photoInput.click();
            };
        }
    }
}); 