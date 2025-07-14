/**
 * Walking Out of Chaos - Main Application Controller
 * Handles navigation, state management, and application initialization
 */

class WOOCApp {
    constructor() {
        this.currentPage = 'home';
        this.isLoading = false;
        this.userData = this.loadUserData();
        
        this.init();
    }
    
    /**
     * Initialize the application
     */
    init() {
        this.showLoadingScreen();
        this.bindEvents();
        this.initializePages();
        this.setupServiceWorker();
        
        // Simulate loading time for better UX
        setTimeout(() => {
            this.hideLoadingScreen();
        }, 1500);
    }
    
    /**
     * Show loading screen
     */
    showLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        const app = document.getElementById('app');
        
        if (loadingScreen) {
            loadingScreen.style.display = 'flex';
        }
        if (app) {
            app.style.display = 'none';
        }
    }
    
    /**
     * Hide loading screen and show main app
     */
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        const app = document.getElementById('app');
        
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
        
        if (app) {
            app.style.display = 'block';
        }
    }
    
    /**
     * Bind all event listeners
     */
    bindEvents() {
        // Navigation events
        this.bindNavigationEvents();
        
        // Hero action buttons
        this.bindHeroActions();
        
        // Mobile menu toggle
        this.bindMobileMenu();
        
        // Assessment results actions
        this.bindAssessmentActions();
        
        // Global keyboard shortcuts
        this.bindKeyboardShortcuts();
        
        // Window events
        window.addEventListener('beforeunload', () => {
            this.saveUserData();
        });
    }
    
    /**
     * Bind navigation events
     */
    bindNavigationEvents() {
        const navButtons = document.querySelectorAll('.nav-btn');
        
        navButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetPage = e.target.id.replace('nav-', '') + '-page';
                this.navigateToPage(targetPage);
            });
        });
    }
    
    /**
     * Bind hero section action buttons
     */
    bindHeroActions() {
        const startAssessmentBtn = document.getElementById('start-assessment-btn');
        const exploreTransformationsBtn = document.getElementById('explore-transformations-btn');
        
        if (startAssessmentBtn) {
            startAssessmentBtn.addEventListener('click', () => {
                this.navigateToPage('assessment-page');
            });
        }
        
        if (exploreTransformationsBtn) {
            exploreTransformationsBtn.addEventListener('click', () => {
                this.navigateToPage('transformations-page');
            });
        }
    }
    
    /**
     * Bind mobile menu functionality
     */
    bindMobileMenu() {
        const mobileToggle = document.getElementById('mobile-menu-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (mobileToggle && navMenu) {
            mobileToggle.addEventListener('click', () => {
                navMenu.classList.toggle('mobile-open');
            });
            
            // Close menu when clicking on nav items
            navMenu.addEventListener('click', (e) => {
                if (e.target.classList.contains('nav-btn')) {
                    navMenu.classList.remove('mobile-open');
                }
            });
        }
    }
    
    /**
     * Bind assessment results actions
     */
    bindAssessmentActions() {
        const viewTransformationsBtn = document.getElementById('view-transformations-btn');
        const retakeAssessmentBtn = document.getElementById('retake-assessment-btn');
        
        if (viewTransformationsBtn) {
            viewTransformationsBtn.addEventListener('click', () => {
                this.navigateToPage('transformations-page');
            });
        }
        
        if (retakeAssessmentBtn) {
            retakeAssessmentBtn.addEventListener('click', () => {
                if (window.chaosAssessment) {
                    window.chaosAssessment.resetAssessment();
                }
            });
        }
    }
    
    /**
     * Bind keyboard shortcuts
     */
    bindKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Alt + number keys for navigation
            if (e.altKey) {
                switch(e.key) {
                    case '1':
                        e.preventDefault();
                        this.navigateToPage('home-page');
                        break;
                    case '2':
                        e.preventDefault();
                        this.navigateToPage('assessment-page');
                        break;
                    case '3':
                        e.preventDefault();
                        this.navigateToPage('transformations-page');
                        break;
                    case '4':
                        e.preventDefault();
                        this.navigateToPage('progress-page');
                        break;
                }
            }
            
            // Escape key to close modals/active transformations
            if (e.key === 'Escape') {
                const activeTransformation = document.getElementById('active-transformation');
                if (activeTransformation && activeTransformation.style.display !== 'none') {
                    if (window.transformations) {
                        window.transformations.closeTransformation();
                    }
                }
            }
        });
    }
    
    /**
     * Initialize all page components
     */
    initializePages() {
        // Initialize assessment system
        if (typeof ChaosAssessment !== 'undefined') {
            window.chaosAssessment = new ChaosAssessment();
        }
        
        // Initialize transformations system
        if (typeof TransformationFlows !== 'undefined') {
            window.transformations = new TransformationFlows();
        }
        
        // Initialize progress tracking
        if (typeof ProgressTracker !== 'undefined') {
            window.progressTracker = new ProgressTracker();
        }
    }
    
    /**
     * Navigate to a specific page
     * @param {string} pageId - The ID of the page to navigate to
     */
    navigateToPage(pageId) {
        if (this.isLoading) return;
        
        // Hide all pages
        const pages = document.querySelectorAll('.page');
        pages.forEach(page => {
            page.classList.remove('active');
        });
        
        // Show target page
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
        }
        
        // Update navigation state
        this.updateNavigationState(pageId);
        
        // Update current page
        this.currentPage = pageId;
        
        // Page-specific initialization
        this.initializePage(pageId);
        
        // Track navigation event
        this.trackEvent('navigation', {
            page: pageId,
            timestamp: new Date().toISOString()
        });
    }
    
    /**
     * Update navigation button states
     * @param {string} pageId - The current page ID
     */
    updateNavigationState(pageId) {
        const navButtons = document.querySelectorAll('.nav-btn');
        
        navButtons.forEach(btn => {
            btn.classList.remove('active');
            
            const btnPageId = btn.id.replace('nav-', '') + '-page';
            if (btnPageId === pageId) {
                btn.classList.add('active');
            }
        });
    }
    
    /**
     * Initialize page-specific functionality
     * @param {string} pageId - The page being initialized
     */
    initializePage(pageId) {
        switch(pageId) {
            case 'assessment-page':
                if (window.chaosAssessment) {
                    window.chaosAssessment.initializeAssessment();
                }
                break;
                
            case 'transformations-page':
                if (window.transformations) {
                    window.transformations.initializeTransformations();
                }
                break;
                
            case 'progress-page':
                if (window.progressTracker) {
                    window.progressTracker.refreshData();
                }
                break;
                
            case 'home-page':
                this.updateHomePageStats();
                break;
        }
    }
    
    /**
     * Update stats on home page
     */
    updateHomePageStats() {
        const stats = this.getBasicStats();
        
        // Could update home page with recent activity, quick stats, etc.
        console.log('Home page stats:', stats);
    }
    
    /**
     * Get basic user statistics
     * @returns {Object} Basic stats object
     */
    getBasicStats() {
        return {
            assessments: this.userData.assessments?.length || 0,
            transformations: this.userData.transformations?.length || 0,
            lastActive: this.userData.lastActive || new Date().toISOString(),
            chaosScore: this.userData.assessments?.length > 0 ? 
                this.userData.assessments[this.userData.assessments.length - 1].score : null
        };
    }
    
    /**
     * Setup service worker for PWA functionality
     */
    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('ServiceWorker registered successfully');
                })
                .catch(error => {
                    console.log('ServiceWorker registration failed:', error);
                });
        }
    }
    
    /**
     * Load user data from localStorage
     * @returns {Object} User data object
     */
    loadUserData() {
        try {
            const saved = localStorage.getItem('wooc_user_data');
            return saved ? JSON.parse(saved) : {
                assessments: [],
                transformations: [],
                progress: [],
                preferences: {},
                created: new Date().toISOString(),
                lastActive: new Date().toISOString()
            };
        } catch (error) {
            console.error('Error loading user data:', error);
            return {
                assessments: [],
                transformations: [],
                progress: [],
                preferences: {},
                created: new Date().toISOString(),
                lastActive: new Date().toISOString()
            };
        }
    }
    
    /**
     * Save user data to localStorage
     */
    saveUserData() {
        try {
            this.userData.lastActive = new Date().toISOString();
            localStorage.setItem('wooc_user_data', JSON.stringify(this.userData));
        } catch (error) {
            console.error('Error saving user data:', error);
            this.showToast('Warning: Unable to save your data locally', 'warning');
        }
    }
    
    /**
     * Add assessment result to user data
     * @param {Object} assessment - Assessment result object
     */
    addAssessment(assessment) {
        this.userData.assessments.push({
            ...assessment,
            id: this.generateId(),
            timestamp: new Date().toISOString()
        });
        this.saveUserData();
    }
    
    /**
     * Add transformation completion to user data
     * @param {Object} transformation - Transformation completion object
     */
    addTransformation(transformation) {
        this.userData.transformations.push({
            ...transformation,
            id: this.generateId(),
            timestamp: new Date().toISOString()
        });
        this.saveUserData();
    }
    
    /**
     * Track progress data point
     * @param {Object} progressData - Progress data object
     */
    trackProgress(progressData) {
        this.userData.progress.push({
            ...progressData,
            id: this.generateId(),
            timestamp: new Date().toISOString()
        });
        this.saveUserData();
    }
    
    /**
     * Track application events
     * @param {string} eventType - Type of event
     * @param {Object} eventData - Event data object
     */
    trackEvent(eventType, eventData) {
        console.log(`Event: ${eventType}`, eventData);
        
        // Here you could send to analytics service
        // Example: analytics.track(eventType, eventData);
    }
    
    /**
     * Generate unique ID
     * @returns {string} Unique identifier
     */
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    
    /**
     * Show toast notification
     * @param {string} message - Message to display
     * @param {string} type - Type of toast (success, error, warning, info)
     */
    showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        if (!container) return;
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <div class="toast-message">${message}</div>
            </div>
        `;
        
        container.appendChild(toast);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 5000);
        
        // Click to dismiss
        toast.addEventListener('click', () => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        });
    }
    
    /**
     * Get user preferences
     * @returns {Object} User preferences
     */
    getPreferences() {
        return this.userData.preferences || {};
    }
    
    /**
     * Update user preferences
     * @param {Object} newPreferences - New preferences to merge
     */
    updatePreferences(newPreferences) {
        this.userData.preferences = {
            ...this.userData.preferences,
            ...newPreferences
        };
        this.saveUserData();
    }
    
    /**
     * Export user data
     * @returns {string} JSON string of user data
     */
    exportData() {
        return JSON.stringify(this.userData, null, 2);
    }
    
    /**
     * Import user data
     * @param {string} jsonData - JSON string of user data
     */
    importData(jsonData) {
        try {
            const importedData = JSON.parse(jsonData);
            
            // Validate data structure
            if (this.validateUserData(importedData)) {
                this.userData = importedData;
                this.saveUserData();
                this.showToast('Data imported successfully!', 'success');
                return true;
            } else {
                this.showToast('Invalid data format', 'error');
                return false;
            }
        } catch (error) {
            console.error('Error importing data:', error);
            this.showToast('Error importing data', 'error');
            return false;
        }
    }
    
    /**
     * Validate user data structure
     * @param {Object} data - Data to validate
     * @returns {boolean} True if valid
     */
    validateUserData(data) {
        return data &&
               Array.isArray(data.assessments) &&
               Array.isArray(data.transformations) &&
               Array.isArray(data.progress) &&
               typeof data.preferences === 'object';
    }
    
    /**
     * Clear all user data
     */
    clearAllData() {
        if (confirm('Are you sure you want to clear all your data? This cannot be undone.')) {
            localStorage.removeItem('wooc_user_data');
            this.userData = {
                assessments: [],
                transformations: [],
                progress: [],
                preferences: {},
                created: new Date().toISOString(),
                lastActive: new Date().toISOString()
            };
            this.showToast('All data cleared successfully', 'success');
            
            // Refresh current page
            this.initializePage(this.currentPage);
        }
    }
    
    /**
     * Get application status
     * @returns {Object} Application status object
     */
    getStatus() {
        return {
            currentPage: this.currentPage,
            isLoading: this.isLoading,
            userDataSize: JSON.stringify(this.userData).length,
            lastActive: this.userData.lastActive,
            version: '1.0.0'
        };
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.woocApp = new WOOCApp();
    
    // Make app globally accessible for debugging
    if (typeof window !== 'undefined') {
        window.WOOC = {
            app: window.woocApp,
            version: '1.0.0',
            debug: () => console.log(window.woocApp.getStatus())
        };
    }
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && window.woocApp) {
        // App became visible, could refresh data
        window.woocApp.userData.lastActive = new Date().toISOString();
    } else if (document.visibilityState === 'hidden' && window.woocApp) {
        // App became hidden, save data
        window.woocApp.saveUserData();
    }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WOOCApp;
}