// Executive Skills Assessment Form Handler
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('assessmentForm');
    const submitBtn = document.getElementById('submitBtn');
    const progressContainer = document.getElementById('progressContainer');
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    
    let totalQuestions = 33;
    let answeredQuestions = 0;

    // Show progress indicator when user starts answering
    function updateProgress() {
        const radioButtons = form.querySelectorAll('input[type="radio"]:checked');
        answeredQuestions = radioButtons.length;
        
        if (answeredQuestions > 0) {
            progressContainer.classList.remove('hidden');
            progressContainer.classList.add('progress-enter');
        }
        
        const percentage = (answeredQuestions / totalQuestions) * 100;
        progressBar.style.width = percentage + '%';
        progressText.textContent = `${answeredQuestions}/${totalQuestions}`;
        
        // Enable submit button only when all questions are answered
        if (answeredQuestions === totalQuestions) {
            submitBtn.disabled = false;
            submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            submitBtn.classList.add('pulse-ready');
        } else {
            submitBtn.disabled = true;
            submitBtn.classList.add('opacity-50', 'cursor-not-allowed');
            submitBtn.classList.remove('pulse-ready');
        }
    }

    // Add event listeners to all radio buttons
    form.addEventListener('change', function(e) {
        if (e.target.type === 'radio') {
            updateProgress();
            
            // Smooth scroll to next question
            const currentQuestion = e.target.closest('.border-b');
            const nextQuestion = currentQuestion?.nextElementSibling;
            if (nextQuestion) {
                setTimeout(() => {
                    nextQuestion.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'center' 
                    });
                }, 200);
            }
        }
    });

    // Handle form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Validate student information
        const studentName = document.getElementById('studentName').value.trim();
        if (!studentName) {
            alert('Please enter your name to continue.');
            document.getElementById('studentName').focus();
            return;
        }

        // Check if all questions are answered
        if (answeredQuestions < totalQuestions) {
            alert(`Please answer all ${totalQuestions} questions before submitting.`);
            return;
        }

        // Disable submit button and show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Submitting...';
        submitBtn.classList.add('loading');

        try {
            // Collect form data
            const formData = new FormData(form);
            
            const studentInfo = {
                name: formData.get('studentName'),
                email: formData.get('studentEmail') || '',
                gradeLevel: formData.get('gradeLevel') || '',
                school: formData.get('school') || 'BCS Saints'
            };

            const responses = {};
            for (let i = 1; i <= 33; i++) {
                const value = formData.get(`q${i}`);
                if (value) {
                    responses[i] = parseInt(value);
                }
            }

            // Submit to API
            const response = await axios.post('/api/submit-assessment', {
                studentInfo,
                responses
            }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 30000 // 30 second timeout
            });

            if (response.data.success) {
                // Show success message and results
                showResults(response.data.results);
            } else {
                throw new Error(response.data.error || 'Submission failed');
            }

        } catch (error) {
            console.error('Submission error:', error);
            
            let errorMessage = 'There was an error submitting your assessment. ';
            
            if (error.response) {
                // Server responded with error
                errorMessage += `Server error: ${error.response.data.error || 'Unknown error'}`;
            } else if (error.request) {
                // Network error
                errorMessage += 'Please check your internet connection and try again.';
            } else {
                // Other error
                errorMessage += error.message;
            }

            alert(errorMessage);
            
            // Re-enable submit button
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane mr-2"></i>Complete Assessment';
            submitBtn.classList.remove('loading');
        }
    });

    // Show results in modal or redirect
    function showResults(results) {
        // Create results modal
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
        modal.innerHTML = `
            <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div class="p-6">
                    <div class="text-center mb-6">
                        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-check text-green-600 text-2xl"></i>
                        </div>
                        <h2 class="text-2xl font-bold text-gray-800 mb-2">Assessment Complete!</h2>
                        <p class="text-gray-600">Thank you, ${results.studentInfo.name}. Your results have been calculated.</p>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <!-- Strengths -->
                        <div class="bg-green-50 rounded-lg p-4">
                            <h3 class="font-semibold text-green-800 mb-3 flex items-center">
                                <i class="fas fa-star mr-2"></i>
                                Your Strengths
                            </h3>
                            <div class="space-y-2">
                                ${results.analysis.strengths.map(strength => 
                                    `<div class="text-sm text-green-700 bg-green-100 px-3 py-1 rounded">${strength}</div>`
                                ).join('')}
                            </div>
                        </div>

                        <!-- Areas for Growth -->
                        <div class="bg-orange-50 rounded-lg p-4">
                            <h3 class="font-semibold text-orange-800 mb-3 flex items-center">
                                <i class="fas fa-target mr-2"></i>
                                Areas for Growth
                            </h3>
                            <div class="space-y-2">
                                ${results.analysis.weaknesses.map(weakness => 
                                    `<div class="text-sm text-orange-700 bg-orange-100 px-3 py-1 rounded">${weakness}</div>`
                                ).join('')}
                            </div>
                        </div>
                    </div>

                    <div class="bg-blue-50 rounded-lg p-4 mb-6">
                        <div class="flex items-center mb-2">
                            <i class="fas fa-envelope text-blue-600 mr-2"></i>
                            <span class="font-medium text-blue-800">Report Sent</span>
                        </div>
                        <p class="text-blue-700 text-sm">
                            A detailed report has been sent to <strong>mjackson@bcssaints.org</strong> 
                            for review and follow-up.
                        </p>
                    </div>

                    <div class="text-center">
                        <button id="closeModal" class="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors mr-3">
                            Close
                        </button>
                        <button id="takeAnother" class="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors">
                            Take Another Assessment
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        modal.classList.add('fade-in');

        // Modal event handlers
        document.getElementById('closeModal').addEventListener('click', () => {
            modal.remove();
        });

        document.getElementById('takeAnother').addEventListener('click', () => {
            window.location.reload();
        });

        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    // Initialize progress tracking
    updateProgress();

    // Add visual feedback for radio button selections
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', function() {
            // Remove selection from siblings
            const name = this.name;
            document.querySelectorAll(`input[name="${name}"]`).forEach(r => {
                r.closest('label').classList.remove('ring-2', 'ring-indigo-500', 'bg-indigo-100');
            });
            
            // Add selection to current
            this.closest('label').classList.add('ring-2', 'ring-indigo-500', 'bg-indigo-100');
        });
    });

    // Auto-save functionality (optional - saves to localStorage)
    function autoSave() {
        const formData = new FormData(form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        localStorage.setItem('executiveSkillsAssessment', JSON.stringify(data));
    }

    // Load saved data if available
    function loadSavedData() {
        const saved = localStorage.getItem('executiveSkillsAssessment');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                
                Object.entries(data).forEach(([key, value]) => {
                    const field = form.querySelector(`[name="${key}"]`);
                    if (field) {
                        if (field.type === 'radio') {
                            const radio = form.querySelector(`[name="${key}"][value="${value}"]`);
                            if (radio) {
                                radio.checked = true;
                                radio.dispatchEvent(new Event('change'));
                            }
                        } else {
                            field.value = value;
                        }
                    }
                });
                
                updateProgress();
            } catch (e) {
                console.log('Could not load saved data');
            }
        }
    }

    // Save data on changes (debounced)
    let saveTimeout;
    form.addEventListener('change', () => {
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(autoSave, 500);
    });

    // Clear saved data on successful submission
    window.addEventListener('beforeunload', () => {
        if (answeredQuestions === totalQuestions) {
            localStorage.removeItem('executiveSkillsAssessment');
        }
    });

    // Load any previously saved data
    loadSavedData();

    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        // Allow Enter to submit form only if all questions are answered
        if (e.key === 'Enter' && e.target.type === 'radio') {
            e.preventDefault();
            const currentQuestion = e.target.closest('.border-b');
            const nextQuestion = currentQuestion?.nextElementSibling;
            if (nextQuestion) {
                const nextRadio = nextQuestion.querySelector('input[type="radio"]');
                if (nextRadio) {
                    nextRadio.focus();
                }
            } else if (answeredQuestions === totalQuestions) {
                submitBtn.focus();
            }
        }
    });

    console.log('Executive Skills Assessment form initialized');
});