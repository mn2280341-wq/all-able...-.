// ========================================
// AllAble - Dashboard Logic
// منطق لوحة التحكم
// ========================================

class Dashboard {
    constructor() {
        this.currentPage = 'home';
        this.init();
    }

    init() {
        // التحقق من تسجيل الدخول
        const user = getFromStorage(CONFIG.STORAGE_KEYS.USER_PROFILE);
        if (!user) {
            window.location.href = 'index.html';
            return;
        }

        this.setupEventListeners();
        console.log('✅ لوحة التحكم جاهزة');
    }

    setupEventListeners() {
        // أزرار التنقل
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const page = e.currentTarget.getAttribute('data-page');
                this.navigateTo(page);
            });
        });

        // بطاقات الميزات
        const featureCards = document.querySelectorAll('.feature-card');
        featureCards.forEach(card => {
            card.addEventListener('click', (e) => {
                const feature = e.currentTarget.getAttribute('data-feature');
                this.openFeature(feature);
            });
        });

        // زر التحكم الصوتي
        const voiceBtn = document.getElementById('voice-btn');
        if (voiceBtn) {
            voiceBtn.addEventListener('click', () => this.toggleVoiceControl());
        }

        // زر الإعدادات
        const settingsBtn = document.getElementById('settings-btn');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => this.openSettings());
        }

        // زر الطوارئ
        const emergencyBtn = document.getElementById('emergency-btn');
        if (emergencyBtn) {
            emergencyBtn.addEventListener('click', () => {
                window.location.href = 'emergency.html';
            });
        }
    }

    navigateTo(page) {
        const externalPages = {
            social: 'social-media.html',
            aac: 'aac.html',
            sign: 'sign-language.html',
            camera: 'camera.html',
            learn: 'education.html'
        };

        if (externalPages[page]) {
            window.location.href = externalPages[page];
            return;
        }

        // إخفاء جميع الصفحات
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

        // إزالة active من جميع الأزرار
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));

        // عرض الصفحة المطلوبة
        const targetPage = document.getElementById(`${page}-page`);
        if (targetPage) {
            targetPage.classList.add('active');
        }

        // تفعيل الزر المناسب
        const targetBtn = document.querySelector(`[data-page="${page}"]`);
        if (targetBtn) {
            targetBtn.classList.add('active');
        }

        this.currentPage = page;
    }

    openFeature(feature) {
        const featurePages = {
            search: 'search.html',
            social: 'social-media.html',
            aac: 'aac.html',
            sign: 'sign-language.html',
            camera: 'camera.html',
            learn: 'education.html',
            relaxation: 'relaxation.html',
            companion: 'companion.html',
            settings: 'settings.html'
        };

        if (featurePages[feature]) {
            window.location.href = featurePages[feature];
        } else {
            showNotification('الصفحة غير متوفرة', 'warning');
        }
    }

    toggleVoiceControl() {
        const btn = document.getElementById('voice-btn');

        if (accessibilityManager.isVoiceControlActive) {
            accessibilityManager.stopVoiceControl();
            btn.classList.remove('active');
            showNotification('تم إيقاف التحكم الصوتي', 'info');
        } else {
            accessibilityManager.startVoiceControl();
            btn.classList.add('active');
            showNotification('تم تفعيل التحكم الصوتي', 'success');
        }
    }

    openSettings() {
        window.location.href = 'settings.html';
    }
}

// تهيئة لوحة التحكم
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new Dashboard();
});
