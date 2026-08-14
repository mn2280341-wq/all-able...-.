// ========================================
// AllAble - Main Application
// التطبيق الرئيسي
// ========================================

class AllAbleApp {
    constructor() {
        this.currentPage = 'landing';
        this.user = null;
        this.isInitialized = false;

        this.init();
    }

    /**
     * تهيئة التطبيق
     */
    async init() {
        console.log('🚀 بدء تحميل AllAble...');

        // إخفاء شاشة التحميل بعد 2 ثانية
        setTimeout(() => {
            this.hideLoadingScreen();
        }, 2000);

        // تحميل بيانات المستخدم
        this.loadUserData();

        // إعداد مستمعي الأحداث
        this.setupEventListeners();

        // التحقق من الإعداد الأولي
        if (!this.user || !this.user.disabilityType) {
            // المستخدم جديد - عرض شاشة الإعداد
            console.log('👤 مستخدم جديد - عرض شاشة الإعداد');
        } else {
            // المستخدم موجود - الانتقال للوحة التحكم
            console.log('👤 مرحباً مجدداً:', this.user.name || 'مستخدم');
        }

        this.isInitialized = true;
        console.log('✅ AllAble جاهز للاستخدام');
    }

    /**
     * إخفاء شاشة التحميل
     */
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        const mainContent = document.getElementById('main-content');

        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }

        if (mainContent) {
            mainContent.classList.remove('hidden');
        }
    }

    /**
     * تحميل بيانات المستخدم
     */
    loadUserData() {
        this.user = getFromStorage(CONFIG.STORAGE_KEYS.USER_PROFILE, null);

        if (this.user) {
            // تطبيق إعدادات المستخدم
            if (this.user.disabilityType) {
                accessibilityManager.setDisabilityType(this.user.disabilityType);
            }
        }
    }

    /**
     * حفظ بيانات المستخدم
     */
    saveUserData() {
        saveToStorage(CONFIG.STORAGE_KEYS.USER_PROFILE, this.user);
    }

    /**
     * إعداد مستمعي الأحداث
     */
    setupEventListeners() {
        // زر البدء
        const startButton = document.getElementById('start-button');
        if (startButton) {
            startButton.addEventListener('click', () => this.showSetupSection());
        }

        // أزرار اختيار نوع الإعاقة
        const selectButtons = document.querySelectorAll('.select-btn');
        selectButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const type = e.target.getAttribute('data-type');
                this.selectDisabilityType(type);
            });
        });

        // زر التخطي
        const skipButton = document.getElementById('skip-setup');
        if (skipButton) {
            skipButton.addEventListener('click', () => this.skipSetup());
        }

        // زر التحكم الصوتي
        const voiceControlBtn = document.getElementById('voice-control-toggle');
        if (voiceControlBtn) {
            voiceControlBtn.addEventListener('click', () => this.toggleVoiceControl());
        }

        // زر الطوارئ
        const emergencyBtn = document.getElementById('emergency-btn');
        if (emergencyBtn) {
            emergencyBtn.addEventListener('click', () => this.handleEmergency());
        }

        // تأثيرات hover على البطاقات
        const disabilityCards = document.querySelectorAll('.disability-card');
        disabilityCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                if (accessibilityManager.currentDisabilityType === 'visual') {
                    const type = card.getAttribute('data-type');
                    speak(`${accessibilityManager.getDisabilityName(type)}`);
                }
            });
        });
    }

    /**
     * عرض قسم الإعداد
     */
    showSetupSection() {
        const heroSection = document.querySelector('.hero-section');
        const setupSection = document.getElementById('setup-section');

        if (heroSection && setupSection) {
            heroSection.style.display = 'none';
            setupSection.classList.remove('hidden');

            // قراءة التعليمات للمستخدمين ذوي الإعاقة البصرية
            if (accessibilityManager.currentDisabilityType === 'visual') {
                speak('اختر نوع الاحتياج الخاص بك. سنقوم بتخصيص التطبيق ليناسبك تمامًا');
            }
        }
    }

    /**
     * اختيار نوع الإعاقة
     */
    selectDisabilityType(type) {
        console.log('✅ تم اختيار:', type);

        // إنشاء أو تحديث بيانات المستخدم
        if (!this.user) {
            this.user = {};
        }

        this.user.disabilityType = type;
        this.user.setupCompleted = true;
        this.user.createdAt = this.user.createdAt || new Date().toISOString();
        this.user.lastLogin = new Date().toISOString();

        // حفظ البيانات
        this.saveUserData();

        // تطبيق الثيم
        accessibilityManager.setDisabilityType(type);

        // الانتقال للوحة التحكم
        setTimeout(() => {
            this.goToDashboard();
        }, 1500);
    }

    /**
     * تخطي الإعداد
     */
    skipSetup() {
        if (!this.user) {
            this.user = {};
        }

        this.user.setupCompleted = false;
        this.user.createdAt = new Date().toISOString();
        this.saveUserData();

        this.goToDashboard();
    }

    /**
     * الانتقال للوحة التحكم
     */
    goToDashboard() {
        window.location.href = 'dashboard.html';
    }

    /**
     * تبديل التحكم الصوتي
     */
    toggleVoiceControl() {
        const btn = document.getElementById('voice-control-toggle');

        if (accessibilityManager.isVoiceControlActive) {
            accessibilityManager.stopVoiceControl();
            btn.classList.remove('active');
            showNotification('تم إيقاف التحكم الصوتي', 'info');
        } else {
            accessibilityManager.startVoiceControl();
            btn.classList.add('active');
            showNotification('تم تفعيل التحكم الصوتي', 'success');
            speak('التحكم الصوتي نشط الآن');
        }
    }

    /**
     * معالجة الطوارئ
     */
    async handleEmergency() {
        console.log('🚨 طوارئ!');

        // الانتقال لصفحة الطوارئ
        window.location.href = 'emergency.html';
    }
}

// تهيئة التطبيق عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    window.allableApp = new AllAbleApp();
});

// تصدير
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AllAbleApp };
}
