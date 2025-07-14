/**
 * Chaos Assessment System
 * Handles the 6-question chaos level assessment with scoring and interpretation
 */

class ChaosAssessment {
    constructor() {
        this.questions = [
            {
                id: 1,
                text: "How organized do you feel your thoughts are right now?",
                type: "likert",
                options: [
                    { text: "Very organized", value: 1 },
                    { text: "Somewhat organized", value: 2 },
                    { text: "Neutral", value: 3 },
                    { text: "Somewhat chaotic", value: 4 },
                    { text: "Very chaotic", value: 5 }
                ]
            },
            {
                id: 2,
                text: "How often do you feel overwhelmed by your daily tasks?",
                type: "likert",
                options: [
                    { text: "Never", value: 1 },
                    { text: "Rarely", value: 2 },
                    { text: "Sometimes", value: 3 },
                    { text: "Often", value: 4 },
                    { text: "Always", value: 5 }
                ]
            },
            {
                id: 3,
                text: "How clearly can you prioritize what's important in your life?",
                type: "likert",
                options: [
                    { text: "Very clearly", value: 1 },
                    { text: "Somewhat clearly", value: 2 },
                    { text: "Neutral", value: 3 },
                    { text: "With difficulty", value: 4 },
                    { text: "Cannot prioritize", value: 5 }
                ]
            },
            {
                id: 4,
                text: "How often do you feel mentally exhausted or drained?",
                type: "likert",
                options: [
                    { text: "Never", value: 1 },
                    { text: "Rarely", value: 2 },
                    { text: "Sometimes", value: 3 },
                    { text: "Often", value: 4 },
                    { text: "Always", value: 5 }
                ]
            },
            {
                id: 5,
                text: "How well can you focus on one task at a time?",
                type: "likert",
                options: [
                    { text: "Very well", value: 1 },
                    { text: "Well", value: 2 },
                    { text: "Moderately", value: 3 },
                    { text: "Poorly", value: 4 },
                    { text: "Cannot focus", value: 5 }
                ]
            },
            {
                id: 6,
                text: "How peaceful does your mind feel right now?",
                type: "likert",
                options: [
                    { text: "Very peaceful", value: 1 },
                    { text: "Mostly peaceful", value: 2 },
                    { text: "Neutral", value: 3 },
                    { text: "Somewhat restless", value: 4 },
                    { text: "Very restless", value: 5 }
                ]
            }
        ];
        
        this.currentQuestion = 0;
        this.answers = {};
        this.isComplete = false;
        
        this.init();
    }
    
    /**
     * Initialize the assessment system
     */
    init() {
        this.bindEvents();
    }
    
    /**
     * Bind event listeners
     */
    bindEvents() {
        // Assessment navigation buttons
        const prevBtn = document.getElementById('prev-question');
        const nextBtn = document.getElementById('next-question');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.previousQuestion());
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextQuestion());
        }
    }
    
    /**
     * Initialize the assessment when user navigates to assessment page
     */
    initializeAssessment() {
        this.resetAssessment();
        this.renderCurrentQuestion();
    }
    
    /**
     * Reset assessment to initial state
     */
    resetAssessment() {
        this.currentQuestion = 0;
        this.answers = {};
        this.isComplete = false;
        
        // Hide results and show form
        const form = document.getElementById('assessment-form');
        const results = document.getElementById('assessment-results');
        
        if (form) form.style.display = 'block';
        if (results) results.style.display = 'none';
        
        this.renderCurrentQuestion();
    }
    
    /**
     * Render the current question
     */
    renderCurrentQuestion() {
        const form = document.getElementById('assessment-form');
        if (!form) return;
        
        const question = this.questions[this.currentQuestion];
        if (!question) return;
        
        // Update progress
        this.updateProgress();
        
        // Create question HTML
        const questionHTML = `
            <div class="question-card" data-question-id="${question.id}">
                <div class="question-text">${question.text}</div>
                <div class="options-container">
                    ${this.renderOptions(question)}
                </div>
                <div class="assessment-navigation">
                    <button id="prev-question" class="btn btn-secondary nav-button" 
                            ${this.currentQuestion === 0 ? 'disabled' : ''}>
                        Previous
                    </button>
                    <button id="next-question" class="btn btn-primary nav-button" 
                            ${!this.answers[question.id] ? 'disabled' : ''}>
                        ${this.currentQuestion === this.questions.length - 1 ? 'Complete Assessment' : 'Next'}
                    </button>
                </div>
            </div>
        `;
        
        form.innerHTML = questionHTML;
        
        // Re-bind navigation events for new buttons
        this.bindNavigationEvents();
        
        // Bind option selection events
        this.bindOptionEvents();
    }
    
    /**
     * Render options for a question
     * @param {Object} question - Question object
     * @returns {string} HTML string for options
     */
    renderOptions(question) {
        if (question.type === 'likert') {
            return question.options.map(option => `
                <div class="option-item ${this.answers[question.id] === option.value ? 'selected' : ''}" 
                     data-value="${option.value}">
                    <div class="option-radio"></div>
                    <div class="option-text">${option.text}</div>
                    <div class="option-value">${option.value}</div>
                </div>
            `).join('');
        }
        
        return '';
    }
    
    /**
     * Bind navigation events for dynamically created buttons
     */
    bindNavigationEvents() {
        const prevBtn = document.getElementById('prev-question');
        const nextBtn = document.getElementById('next-question');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.previousQuestion());
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextQuestion());
        }
    }
    
    /**
     * Bind option selection events
     */
    bindOptionEvents() {
        const options = document.querySelectorAll('.option-item');
        
        options.forEach(option => {
            option.addEventListener('click', () => {
                const value = parseInt(option.dataset.value);
                const questionId = this.questions[this.currentQuestion].id;
                
                // Update answer
                this.answers[questionId] = value;
                
                // Update UI
                options.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
                
                // Enable next button
                const nextBtn = document.getElementById('next-question');
                if (nextBtn) {
                    nextBtn.disabled = false;
                }
                
                // Auto-advance after short delay (optional)
                setTimeout(() => {
                    if (this.currentQuestion < this.questions.length - 1) {
                        this.nextQuestion();
                    }
                }, 800);
            });
        });
    }
    
    /**
     * Move to previous question
     */
    previousQuestion() {
        if (this.currentQuestion > 0) {
            this.currentQuestion--;
            this.renderCurrentQuestion();
        }
    }
    
    /**
     * Move to next question or complete assessment
     */
    nextQuestion() {
        const currentQuestionId = this.questions[this.currentQuestion].id;
        
        if (!this.answers[currentQuestionId]) {
            this.showToast('Please select an answer before continuing', 'warning');
            return;
        }
        
        if (this.currentQuestion < this.questions.length - 1) {
            this.currentQuestion++;
            this.renderCurrentQuestion();
        } else {
            this.completeAssessment();
        }
    }
    
    /**
     * Complete the assessment and show results
     */
    completeAssessment() {
        this.isComplete = true;
        
        // Calculate score
        const score = this.calculateScore();
        const interpretation = this.interpretScore(score);
        
        // Save assessment result
        const assessmentResult = {
            score: score,
            answers: { ...this.answers },
            interpretation: interpretation,
            completedAt: new Date().toISOString()
        };
        
        // Add to user data
        if (window.woocApp) {
            window.woocApp.addAssessment(assessmentResult);
        }
        
        // Show results
        this.showResults(score, interpretation);
        
        // Track completion event
        if (window.woocApp) {
            window.woocApp.trackEvent('assessment_completed', {
                score: score,
                level: interpretation.level
            });
        }
    }
    
    /**
     * Calculate the chaos score
     * @returns {number} Calculated score (6-30)
     */
    calculateScore() {
        const values = Object.values(this.answers);
        return values.reduce((sum, value) => sum + value, 0);
    }
    
    /**
     * Interpret the chaos score
     * @param {number} score - The calculated score
     * @returns {Object} Interpretation object
     */
    interpretScore(score) {
        let level, description, recommendations;
        
        if (score <= 12) {
            level = 'low';
            description = 'Your mental state appears to be quite organized and peaceful. You have good control over your thoughts and priorities, and you rarely feel overwhelmed. This is an excellent foundation for personal growth and achievement.';
            recommendations = [
                'Continue practicing the habits that keep you organized',
                'Consider helping others who might be struggling with chaos',
                'Explore advanced mindfulness techniques to deepen your practice',
                'Set new challenges to continue growing while maintaining balance'
            ];
        } else if (score <= 20) {
            level = 'moderate';
            description = 'You experience a moderate level of mental chaos. While you have some organization in your thoughts and can handle most situations, there are times when you feel overwhelmed or scattered. This is a normal state that many people experience.';
            recommendations = [
                'Practice daily mindfulness or meditation for 10-15 minutes',
                'Create a simple priority system for your daily tasks',
                'Take regular breaks during overwhelming periods',
                'Consider time-blocking techniques to improve focus',
                'Develop a consistent evening routine to clear your mind'
            ];
        } else {
            level = 'high';
            description = 'You are currently experiencing a high level of mental chaos. Your thoughts may feel scattered, priorities unclear, and daily tasks overwhelming. This is a challenging but temporary state that can be improved with the right strategies and support.';
            recommendations = [
                'Start with basic breathing exercises (5 minutes daily)',
                'Write down 3 most important tasks each morning',
                'Break large tasks into smaller, manageable steps',
                'Limit multitasking and focus on one thing at a time',
                'Consider speaking with a mental health professional',
                'Practice self-compassion and patience with your progress'
            ];
        }
        
        return {
            level,
            description,
            recommendations,
            score
        };
    }
    
    /**
     * Show assessment results
     * @param {number} score - The calculated score
     * @param {Object} interpretation - The interpretation object
     */
    showResults(score, interpretation) {
        const form = document.getElementById('assessment-form');
        const results = document.getElementById('assessment-results');
        
        if (!results) return;
        
        // Hide form and show results
        if (form) form.style.display = 'none';
        results.style.display = 'block';
        
        // Update score display
        const scoreValue = document.getElementById('chaos-score-value');
        if (scoreValue) {
            scoreValue.textContent = score;
        }
        
        // Update interpretation
        const interpretationContainer = document.getElementById('chaos-interpretation');
        if (interpretationContainer) {
            interpretationContainer.innerHTML = `
                <div class="interpretation-level ${interpretation.level}">
                    ${interpretation.level.toUpperCase()} CHAOS LEVEL
                </div>
                <div class="interpretation-description">
                    ${interpretation.description}
                </div>
                <div class="interpretation-recommendations">
                    <h4>Recommended Actions:</h4>
                    <ul class="recommendations-list">
                        ${interpretation.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                    </ul>
                </div>
            `;
        }
        
        // Animate score reveal
        this.animateScoreReveal(score);
        
        // Show success toast
        this.showToast('Assessment completed! Check your results below.', 'success');
    }
    
    /**
     * Animate the score reveal
     * @param {number} finalScore - The final score to animate to
     */
    animateScoreReveal(finalScore) {
        const scoreElement = document.getElementById('chaos-score-value');
        if (!scoreElement) return;
        
        let currentScore = 0;
        const increment = finalScore / 30; // Animate over ~30 frames
        
        const animate = () => {
            currentScore += increment;
            
            if (currentScore >= finalScore) {
                scoreElement.textContent = finalScore;
                return;
            }
            
            scoreElement.textContent = Math.floor(currentScore);
            requestAnimationFrame(animate);
        };
        
        animate();
    }
    
    /**
     * Update progress bar and counter
     */
    updateProgress() {
        const progressBar = document.getElementById('assessment-progress');
        const counter = document.getElementById('question-counter');
        
        if (progressBar) {
            const progress = ((this.currentQuestion + 1) / this.questions.length) * 100;
            progressBar.style.width = `${progress}%`;
        }
        
        if (counter) {
            counter.textContent = `Question ${this.currentQuestion + 1} of ${this.questions.length}`;
        }
    }
    
    /**
     * Show toast notification
     * @param {string} message - Message to show
     * @param {string} type - Type of toast
     */
    showToast(message, type = 'info') {
        if (window.woocApp) {
            window.woocApp.showToast(message, type);
        }
    }
    
    /**
     * Get assessment statistics
     * @returns {Object} Assessment statistics
     */
    getStatistics() {
        if (!window.woocApp) return null;
        
        const assessments = window.woocApp.userData.assessments || [];
        
        if (assessments.length === 0) {
            return {
                total: 0,
                averageScore: 0,
                trend: 'none',
                lastScore: null
            };
        }
        
        const scores = assessments.map(a => a.score);
        const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
        const lastScore = scores[scores.length - 1];
        const previousScore = scores.length > 1 ? scores[scores.length - 2] : lastScore;
        
        let trend = 'stable';
        if (lastScore < previousScore) trend = 'improving';
        if (lastScore > previousScore) trend = 'declining';
        
        return {
            total: assessments.length,
            averageScore: Math.round(averageScore * 10) / 10,
            trend,
            lastScore,
            scores
        };
    }
    
    /**
     * Export assessment data
     * @returns {Object} Assessment export data
     */
    exportAssessmentData() {
        if (!window.woocApp) return null;
        
        return {
            assessments: window.woocApp.userData.assessments || [],
            questions: this.questions,
            exportedAt: new Date().toISOString()
        };
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (typeof window !== 'undefined') {
        window.ChaosAssessment = ChaosAssessment;
    }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChaosAssessment;
}