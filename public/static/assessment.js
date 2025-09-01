// Executive Skills Assessment Form Handler - Gamified Edition
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('assessmentForm');
    const submitBtn = document.getElementById('submitBtn');
    const progressContainer = document.getElementById('progressContainer');
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    
    let totalQuestions = 33;
    let answeredQuestions = 0;
    let currentStreak = 0;
    let achievements = [];
    
    // Gamification elements
    const milestones = [5, 10, 15, 20, 25, 30, 33];
    const encouragements = [
        "Great start! 🎯",
        "You're doing awesome! 🌟", 
        "Fantastic progress! 🚀",
        "More than halfway there! 💪",
        "Almost finished! 🏃‍♀️",
        "Final stretch! 🏁",
        "Assessment complete! 🎉"
    ];
    
    // Initialize gamification features
    initializeGamification();

    // Enhanced progress tracking with gamification
    function updateProgress() {
        const radioButtons = form.querySelectorAll('input[type="radio"]:checked');
        const previousCount = answeredQuestions;
        answeredQuestions = radioButtons.length;
        
        // Show progress container with animation
        if (answeredQuestions > 0 && previousCount === 0) {
            progressContainer.classList.remove('hidden');
            progressContainer.classList.add('progress-enter');
            window.soundManager?.play('whoosh');
        }
        
        // Animate progress bar
        const percentage = (answeredQuestions / totalQuestions) * 100;
        progressBar.style.width = percentage + '%';
        progressText.textContent = `${answeredQuestions}/${totalQuestions}`;
        
        // Check for milestones and achievements
        if (answeredQuestions > previousCount) {
            checkMilestones(answeredQuestions);
            window.soundManager?.play('progress');
            
            // Add sparkle effect to progress bar
            addSparkleEffect(progressBar);
        }
        
        // Update submit button state
        if (answeredQuestions === totalQuestions) {
            submitBtn.disabled = false;
            submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            submitBtn.classList.add('pulse-ready');
            
            // Completion celebration
            if (previousCount !== totalQuestions) {
                celebrateCompletion();
            }
        } else {
            submitBtn.disabled = true;
            submitBtn.classList.add('opacity-50', 'cursor-not-allowed');
            submitBtn.classList.remove('pulse-ready');
        }
        
        // Update progress ring animation
        updateProgressRing(percentage);
    }

    // Check for milestone achievements
    function checkMilestones(current) {
        milestones.forEach((milestone, index) => {
            if (current === milestone && !achievements.includes(milestone)) {
                achievements.push(milestone);
                showMilestoneAchievement(milestone, encouragements[index]);
                window.soundManager?.play('milestone');
            }
        });
    }

    // Show milestone achievement popup
    function showMilestoneAchievement(milestone, message) {
        const achievement = document.createElement('div');
        achievement.className = 'fixed top-20 right-4 z-50 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-4 rounded-lg shadow-xl transform translate-x-full transition-transform duration-500';
        achievement.innerHTML = `
            <div class="flex items-center">
                <div class="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-3">
                    <i class="fas fa-star text-yellow-200"></i>
                </div>
                <div>
                    <div class="font-bold">${message}</div>
                    <div class="text-sm opacity-90">${milestone} questions completed!</div>
                </div>
            </div>
        `;
        
        document.body.appendChild(achievement);
        
        // Animate in
        setTimeout(() => {
            achievement.classList.remove('translate-x-full');
            achievement.classList.add('translate-x-0');
        }, 100);
        
        // Animate out after 3 seconds
        setTimeout(() => {
            achievement.classList.add('translate-x-full');
            setTimeout(() => achievement.remove(), 500);
        }, 3000);
    }

    // Add sparkle effect to elements
    function addSparkleEffect(element) {
        const sparkle = document.createElement('div');
        sparkle.className = 'absolute inset-0 pointer-events-none';
        sparkle.innerHTML = '✨';
        sparkle.style.cssText = `
            position: absolute;
            top: -10px;
            right: 10px;
            font-size: 20px;
            animation: sparkleFloat 1s ease-out forwards;
            z-index: 10;
        `;
        
        element.parentElement.style.position = 'relative';
        element.parentElement.appendChild(sparkle);
        
        setTimeout(() => sparkle.remove(), 1000);
    }

    // Celebrate completion with confetti-like effect
    function celebrateCompletion() {
        window.soundManager?.play('success');
        
        // Create celebration overlay
        const celebration = document.createElement('div');
        celebration.className = 'fixed inset-0 pointer-events-none z-40';
        celebration.innerHTML = `
            <div class="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 opacity-10 animate-pulse"></div>
        `;
        
        // Add floating emojis
        const emojis = ['🎉', '🌟', '✨', '🏆', '💪', '🎯'];
        for (let i = 0; i < 12; i++) {
            setTimeout(() => {
                const emoji = document.createElement('div');
                emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
                emoji.className = 'absolute text-4xl pointer-events-none';
                emoji.style.cssText = `
                    left: ${Math.random() * 100}vw;
                    top: 100vh;
                    animation: floatUp 3s ease-out forwards;
                `;
                celebration.appendChild(emoji);
                
                setTimeout(() => emoji.remove(), 3000);
            }, i * 200);
        }
        
        document.body.appendChild(celebration);
        setTimeout(() => celebration.remove(), 4000);
        
        // Update submit button with celebration text
        submitBtn.innerHTML = '<i class="fas fa-trophy mr-2 animate-bounce"></i>Complete Your Assessment!';
    }

    // Update circular progress ring
    function updateProgressRing(percentage) {
        const progressRing = document.getElementById('progressRing');
        if (progressRing) {
            const circumference = 2 * Math.PI * 45; // radius = 45
            const strokeDasharray = circumference;
            const strokeDashoffset = circumference - (percentage / 100) * circumference;
            
            progressRing.style.strokeDasharray = strokeDasharray;
            progressRing.style.strokeDashoffset = strokeDashoffset;
        }
    }

    // Initialize gamification features
    function initializeGamification() {
        // Add custom CSS animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes sparkleFloat {
                0% { opacity: 1; transform: translateY(0) scale(1); }
                100% { opacity: 0; transform: translateY(-30px) scale(1.5); }
            }
            
            @keyframes floatUp {
                0% { opacity: 1; transform: translateY(0) rotate(0deg); }
                100% { opacity: 0; transform: translateY(-100vh) rotate(360deg); }
            }
            
            @keyframes shimmer {
                0% { background-position: -200px 0; }
                100% { background-position: calc(200px + 100%) 0; }
            }
            
            .shimmer {
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
                background-size: 200px 100%;
                animation: shimmer 2s infinite;
            }
            
            .bounce-in {
                animation: bounceIn 0.6s ease-out;
            }
            
            @keyframes bounceIn {
                0% { transform: scale(0.3); opacity: 0; }
                50% { transform: scale(1.05); }
                70% { transform: scale(0.9); }
                100% { transform: scale(1); opacity: 1; }
            }
            
            .glow {
                box-shadow: 0 0 20px rgba(79, 70, 229, 0.5);
                animation: glowPulse 2s ease-in-out infinite alternate;
            }
            
            @keyframes glowPulse {
                from { box-shadow: 0 0 20px rgba(79, 70, 229, 0.5); }
                to { box-shadow: 0 0 30px rgba(79, 70, 229, 0.8); }
            }
        `;
        document.head.appendChild(style);
        
        // Enhance progress container with circular progress
        setTimeout(enhanceProgressContainer, 100);
    }

    // Enhance progress container with better visuals
    function enhanceProgressContainer() {
        const container = progressContainer;
        if (!container) return;
        
        // Add circular progress ring
        const ringContainer = document.createElement('div');
        ringContainer.className = 'relative';
        ringContainer.innerHTML = `
            <svg class="w-16 h-16 transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" stroke="currentColor" 
                        stroke-width="8" fill="none" class="text-gray-200" />
                <circle id="progressRing" cx="50" cy="50" r="45" stroke="currentColor" 
                        stroke-width="8" fill="none" class="text-indigo-500"
                        stroke-linecap="round" 
                        style="stroke-dasharray: 283; stroke-dashoffset: 283; transition: stroke-dashoffset 0.5s ease;" />
            </svg>
            <div class="absolute inset-0 flex items-center justify-center">
                <span id="progressText" class="text-indigo-600 font-semibold text-sm">${answeredQuestions}/${totalQuestions}</span>
            </div>
        `;
        
        // Replace the old progress display
        const oldProgress = container.querySelector('.w-12');
        if (oldProgress) {
            oldProgress.replaceWith(ringContainer);
        }
    }

    // Enhanced event listeners with gamification
    form.addEventListener('change', function(e) {
        if (e.target.type === 'radio') {
            // Play click sound
            window.soundManager?.play('click');
            
            // Add visual feedback to selection
            const label = e.target.closest('label');
            label.classList.add('bounce-in');
            
            // Remove bounce class after animation
            setTimeout(() => label.classList.remove('bounce-in'), 600);
            
            // Update progress with delay for better UX
            setTimeout(() => updateProgress(), 100);
            
            // Smart scroll to next question
            const currentQuestion = e.target.closest('.border-b');
            const nextQuestion = currentQuestion?.nextElementSibling;
            
            if (nextQuestion) {
                // Add completion indicator to current question
                addQuestionCompletionIndicator(currentQuestion);
                
                // Smooth scroll to next question with delay
                setTimeout(() => {
                    nextQuestion.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'center' 
                    });
                    
                    // Highlight next question briefly
                    nextQuestion.classList.add('question-highlight');
                    setTimeout(() => nextQuestion.classList.remove('question-highlight'), 2000);
                }, 300);
            } else {
                // Last question completed - add completion indicator
                addQuestionCompletionIndicator(currentQuestion);
            }
            
            // Update current streak
            currentStreak++;
            if (currentStreak >= 5) {
                showStreakBonus(currentStreak);
                currentStreak = 0; // Reset streak
            }
        }
    });

    // Add completion indicator to questions
    function addQuestionCompletionIndicator(questionElement) {
        const questionNumber = questionElement.querySelector('.bg-indigo-100');
        if (questionNumber && !questionNumber.querySelector('.fa-check')) {
            const checkMark = document.createElement('i');
            checkMark.className = 'fas fa-check absolute inset-0 flex items-center justify-center text-green-600 text-xs';
            questionNumber.style.position = 'relative';
            questionNumber.appendChild(checkMark);
            
            // Animate the check mark
            checkMark.style.opacity = '0';
            checkMark.style.transform = 'scale(0.5)';
            setTimeout(() => {
                checkMark.style.transition = 'all 0.3s ease';
                checkMark.style.opacity = '1';
                checkMark.style.transform = 'scale(1)';
            }, 50);
            
            // Change question number background to green
            questionNumber.classList.remove('bg-indigo-100', 'text-indigo-600');
            questionNumber.classList.add('bg-green-100', 'text-green-600');
        }
    }

    // Show streak bonus notification
    function showStreakBonus(streak) {
        const bonus = document.createElement('div');
        bonus.className = 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-full shadow-xl';
        bonus.innerHTML = `
            <div class="text-center">
                <div class="text-2xl mb-2">🔥</div>
                <div class="font-bold text-lg">On Fire!</div>
                <div class="text-sm opacity-90">${streak} questions in a row!</div>
            </div>
        `;
        
        document.body.appendChild(bonus);
        bonus.classList.add('bounce-in');
        
        // Play special sound
        window.soundManager?.play('milestone');
        
        // Remove after animation
        setTimeout(() => {
            bonus.style.transition = 'all 0.5s ease';
            bonus.style.opacity = '0';
            bonus.style.transform = 'translate(-50%, -50%) scale(0.8)';
            setTimeout(() => bonus.remove(), 500);
        }, 2000);
    }

    // Handle form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Collect and validate form data
        const formData = new FormData(form);
        
        // Validate student information
        const studentName = formData.get('studentName')?.trim();
        console.log('DEBUG: Student name collected:', studentName);
        console.log('DEBUG: All form data:', Object.fromEntries(formData.entries()));
        
        if (!studentName) {
            alert('Please enter your name to continue.');
            document.getElementById('studentName').focus();
            return;
        }

        // Double-check that all questions are answered
        const responses = {};
        const missingQuestions = [];
        
        for (let i = 1; i <= 33; i++) {
            const value = document.querySelector(`input[name="q${i}"]:checked`)?.value;
            if (value) {
                responses[i] = parseInt(value);
            } else {
                missingQuestions.push(i);
            }
        }
        
        if (missingQuestions.length > 0) {
            alert(`Please answer all questions before submitting. You still need to answer question(s): ${missingQuestions.join(', ')}`);
            
            // Scroll to first missing question
            const firstMissing = document.querySelector(`input[name="q${missingQuestions[0]}"]`);
            if (firstMissing) {
                firstMissing.closest('.border-b').scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
                firstMissing.closest('.border-b').classList.add('question-highlight');
            }
            return;
        }

        // Enhanced loading state with better UX
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');
        
        // Create loading overlay
        const loadingOverlay = createLoadingOverlay();
        document.body.appendChild(loadingOverlay);
        
        // Animate submit button
        submitBtn.innerHTML = '<i class="fas fa-rocket mr-2 animate-pulse"></i>Launching Assessment...';
        
        // Play loading sound
        window.soundManager?.play('whoosh');

        try {
            // Prepare student info (formData already collected above)
            const studentInfo = {
                name: formData.get('studentName'),
                email: formData.get('studentEmail') || '',
                gradeLevel: formData.get('gradeLevel') || '',
                school: formData.get('school') || 'BCS Saints'
            };

            // Use the already-validated responses from above
            // (responses object was already created during validation)

            // Debug: Log what we're sending
            console.log('Submitting assessment:', { studentInfo, responses });
            console.log('Student name:', studentInfo.name);
            console.log('Number of responses:', Object.keys(responses).length);

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
                // Show success message and results - pass the full response data
                showResults(response.data);
            } else {
                throw new Error(response.data.error || 'Submission failed');
            }

        } catch (error) {
            console.error('Submission error:', error);
            
            let errorMessage = 'There was an error submitting your assessment. ';
            
            if (error.response) {
                // Server responded with error
                const serverError = error.response.data;
                if (serverError.missingQuestions) {
                    errorMessage += `Please complete question(s): ${serverError.missingQuestions.join(', ')}`;
                    
                    // Scroll to first missing question
                    const firstMissing = document.querySelector(`input[name="q${serverError.missingQuestions[0]}"]`);
                    if (firstMissing) {
                        firstMissing.closest('.border-b').scrollIntoView({ 
                            behavior: 'smooth', 
                            block: 'center' 
                        });
                        firstMissing.closest('.border-b').classList.add('question-highlight');
                    }
                } else {
                    errorMessage += `Server error: ${serverError.error || 'Unknown error'}`;
                }
            } else if (error.request) {
                // Network error
                errorMessage += 'Please check your internet connection and try again.';
            } else {
                // Other error
                errorMessage += error.message;
            }

            alert(errorMessage);
            
            // Re-enable submit button and remove loading overlay
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane mr-2"></i>Complete Assessment';
            submitBtn.classList.remove('loading');
            
            // Remove loading overlay
            const overlay = document.getElementById('loadingOverlay');
            if (overlay) overlay.remove();
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

    // Create engaging loading overlay
    function createLoadingOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'loadingOverlay';
        overlay.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        overlay.innerHTML = `
            <div class="bg-white rounded-lg p-8 text-center max-w-sm mx-4">
                <div class="mb-6">
                    <div class="relative w-24 h-24 mx-auto">
                        <div class="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
                        <div class="absolute inset-0 border-4 border-indigo-500 rounded-full animate-spin" 
                             style="border-top-color: transparent; border-right-color: transparent;"></div>
                        <div class="absolute inset-4 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full flex items-center justify-center">
                            <i class="fas fa-brain text-white text-2xl animate-pulse"></i>
                        </div>
                    </div>
                </div>
                <h3 class="text-xl font-bold text-gray-800 mb-2">Processing Your Results</h3>
                <p class="text-gray-600 mb-4">Analyzing your executive skills...</p>
                <div class="flex justify-center space-x-1">
                    <div class="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                    <div class="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style="animation-delay: 0.1s;"></div>
                    <div class="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style="animation-delay: 0.2s;"></div>
                </div>
                <div class="mt-4 text-sm text-gray-500">
                    <div class="shimmer bg-gray-100 h-2 rounded mb-2"></div>
                    <div class="shimmer bg-gray-100 h-2 rounded w-3/4 mx-auto"></div>
                </div>
            </div>
        `;
        return overlay;
    }

    // Enhanced results modal with animations
    function showResults(data) {
        // Extract data from the response structure
        const results = data.results;
        const assessmentId = data.assessmentId;
        
        console.log('ShowResults called with:', { results, assessmentId });
        
        // Remove loading overlay first
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.style.transition = 'opacity 0.3s ease';
            loadingOverlay.style.opacity = '0';
            setTimeout(() => loadingOverlay.remove(), 300);
        }

        // Play success sound
        setTimeout(() => window.soundManager?.play('success'), 500);

        // Create enhanced results modal
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
        modal.style.opacity = '0';
        modal.innerHTML = `
            <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform scale-95">
                <div class="p-6">
                    <div class="text-center mb-6">
                        <div class="relative w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                            <i class="fas fa-trophy text-white text-3xl"></i>
                            <div class="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-ping">
                                <i class="fas fa-star text-yellow-800 text-sm"></i>
                            </div>
                        </div>
                        <h2 class="text-3xl font-bold text-gray-800 mb-2">Fantastic Job! 🎉</h2>
                        <p class="text-gray-600 text-lg">Assessment completed, ${results.studentInfo.name}!</p>
                        <div class="mt-2 inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                            All 33 questions answered! 
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <!-- Enhanced Strengths -->
                        <div class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
                            <h3 class="font-bold text-green-800 mb-4 flex items-center text-lg">
                                <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                                    <i class="fas fa-star text-white text-sm"></i>
                                </div>
                                Your Superpowers! 💪
                            </h3>
                            <p class="text-green-700 text-sm mb-4">These are your executive skill strengths:</p>
                            <div class="space-y-3">
                                ${results.analysis.strengths.map((strength, index) => 
                                    `<div class="flex items-center bg-white bg-opacity-70 p-3 rounded-lg shadow-sm transform hover:scale-105 transition-transform">
                                        <div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3 text-white text-xs font-bold">
                                            ${index + 1}
                                        </div>
                                        <span class="font-medium text-green-800">${strength}</span>
                                    </div>`
                                ).join('')}
                            </div>
                        </div>

                        <!-- Enhanced Growth Areas -->
                        <div class="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg p-6 border border-orange-200">
                            <h3 class="font-bold text-orange-800 mb-4 flex items-center text-lg">
                                <div class="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mr-3">
                                    <i class="fas fa-target text-white text-sm"></i>
                                </div>
                                Growth Opportunities 🌱
                            </h3>
                            <p class="text-orange-700 text-sm mb-4">Areas to focus on for improvement:</p>
                            <div class="space-y-3">
                                ${results.analysis.weaknesses.map((weakness, index) => 
                                    `<div class="flex items-center bg-white bg-opacity-70 p-3 rounded-lg shadow-sm transform hover:scale-105 transition-transform">
                                        <div class="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center mr-3 text-white text-xs font-bold">
                                            ${index + 1}
                                        </div>
                                        <span class="font-medium text-orange-800">${weakness}</span>
                                    </div>`
                                ).join('')}
                            </div>
                        </div>
                    </div>

                    <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-6 border border-blue-200">
                        <div class="flex items-center mb-4">
                            <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                                <i class="fas fa-envelope text-white"></i>
                            </div>
                            <div>
                                <div class="font-bold text-blue-800 text-lg">
                                    ${data.emailSent ? 'Report Delivered! 📧' : 'Results Saved! 💾'}
                                </div>
                                <div class="text-blue-700">
                                    ${data.emailSent ? 'Your detailed results have been sent' : 'Your results are safely stored'}
                                </div>
                            </div>
                        </div>
                        <p class="text-blue-700 text-sm">
                            ${data.emailSent 
                                ? 'A comprehensive report has been emailed to <strong class="bg-blue-100 px-2 py-1 rounded">mjackson@bcssaints.org & forms@bcssaints.org</strong> for review.'
                                : data.emailConfigured 
                                    ? 'Email service encountered an issue, but your results are saved and can be accessed via the summary page.'
                                    : 'Email service is not yet configured. Your results are saved and accessible via the summary page below.'
                            }
                        </p>
                    </div>

                    <div class="text-center space-y-4">
                        <div class="space-x-4">
                            <button id="viewSummary" class="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg">
                                <i class="fas fa-trophy mr-2"></i>
                                View My Summary
                            </button>
                            <button id="closeModal" class="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg">
                                <i class="fas fa-check mr-2"></i>
                                Got It!
                            </button>
                        </div>
                        <div>
                            <button id="takeAnother" class="text-gray-500 hover:text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors">
                                <i class="fas fa-redo mr-2"></i>
                                Take Another Assessment
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        
        // Animate modal in
        setTimeout(() => {
            modal.style.transition = 'opacity 0.3s ease';
            modal.style.opacity = '1';
            const modalContent = modal.querySelector('.transform');
            modalContent.style.transition = 'transform 0.3s ease';
            modalContent.style.transform = 'scale(1)';
        }, 100);

        // Modal event handlers with sound effects
        document.getElementById('viewSummary').addEventListener('click', () => {
            window.soundManager?.play('click');
            console.log('View Summary clicked, assessmentId:', assessmentId);
            if (assessmentId) {
                window.location.href = `/summary/${assessmentId}`;
            } else {
                alert('Summary not available - assessment ID missing: ' + assessmentId);
            }
        });

        document.getElementById('closeModal').addEventListener('click', () => {
            window.soundManager?.play('click');
            modal.style.opacity = '0';
            setTimeout(() => modal.remove(), 300);
        });

        document.getElementById('takeAnother').addEventListener('click', () => {
            window.soundManager?.play('click');
            modal.style.opacity = '0';
            setTimeout(() => {
                modal.remove();
                window.location.reload();
            }, 300);
        });

        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                window.soundManager?.play('click');
                modal.style.opacity = '0';
                setTimeout(() => modal.remove(), 300);
            }
        });
    }

    console.log('🎮 Executive Skills Assessment - Gamified Edition Initialized!');
});