// ========================================
// AllAble - Companion Mode
// وضع المرافق للأهل والمساعدين
// ========================================

class CompanionManager {
    constructor() {
        this.companionData = null;
        this.userData = null;
        this.isConnected = false;
        this.activityLog = [];
        this.locationWatcher = null;

        this.init();
    }

    /**
     * تهيئة نظام المرافق
     */
    init() {
        console.log('🤝 Companion Manager: Initializing...');

        // تحميل بيانات المرافق المحفوظة
        this.loadCompanionData();

        // إعداد مستمعي الأحداث
        this.setupEventListeners();

        // التحقق من الاتصال الموجود
        if (this.companionData && this.companionData.isConnected) {
            this.showDashboard();
        }
    }

    /**
     * إعداد مستمعي الأحداث
     */
    setupEventListeners() {
        const loginForm = document.getElementById('companion-login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }
    }

    /**
     * معالجة تسجيل الدخول
     */
    async handleLogin() {
        const code = document.getElementById('companion-code').value;
        const name = document.getElementById('companion-name').value;
        const relation = document.getElementById('companion-relation').value;

        if (!code || !name || !relation) {
            showNotification('يرجى ملء جميع الحقول', 'error');
            return;
        }

        // التحقق من الرمز
        const isValid = await this.verifyCompanionCode(code);

        if (isValid) {
            this.companionData = {
                code: code,
                name: name,
                relation: relation,
                connectedAt: new Date().toISOString(),
                isConnected: true
            };

            this.saveCompanionData();
            this.showDashboard();
            showNotification('تم الاتصال بنجاح!', 'success');

            // بدء مراقبة الموقع
            this.startLocationTracking();

            // تسجيل النشاط
            this.logActivity('تسجيل دخول المرافق', `${name} (${relation})`);
        } else {
            showNotification('رمز غير صحيح. يرجى المحاولة مرة أخرى', 'error');
        }
    }

    /**
     * التحقق من رمز المرافق
     */
    async verifyCompanionCode(code) {
        // في النسخة الحقيقية، سيتم التحقق من السيرفر
        // هنا نستخدم التحقق المحلي
        const storedCodes = getFromStorage('companion_codes', []);
        return storedCodes.includes(code) || code === 'DEMO1234';
    }

    /**
     * عرض لوحة التحكم
     */
    showDashboard() {
        const loginSection = document.getElementById('companion-login');
        const dashboardSection = document.getElementById('companion-dashboard');

        if (loginSection) loginSection.classList.add('hidden');
        if (dashboardSection) dashboardSection.classList.remove('hidden');

        // تحديث البيانات
        this.updateDashboard();

        // بدء التحديث التلقائي
        this.startAutoUpdate();
    }

    /**
     * تحديث لوحة التحكم
     */
    updateDashboard() {
        // تحميل بيانات المستخدم
        this.userData = getFromStorage(CONFIG.STORAGE_KEYS.USER_PROFILE, {});

        // تحديث الاسم
        const companionNameDisplay = document.getElementById('companion-name-display');
        if (companionNameDisplay && this.companionData) {
            companionNameDisplay.textContent = this.companionData.name;
        }

        const userNameDisplay = document.getElementById('user-name-display');
        if (userNameDisplay) {
            userNameDisplay.textContent = this.userData.name || 'المستخدم';
        }

        // تحديث الموقع
        this.updateLocation();

        // تحديث سجل النشاطات
        this.updateActivityLog();

        // تحديث الإعدادات
        this.syncSettings();
    }

    /**
     * تحديث الموقع
     */
    updateLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;

                    const locationElement = document.getElementById('user-location');
                    if (locationElement) {
                        locationElement.innerHTML = `
                            <a href="https://www.google.com/maps?q=${lat},${lon}" target="_blank">
                                عرض على الخريطة
                            </a>
                        `;
                    }
                },
                (error) => {
                    console.error('Location error:', error);
                    const locationElement = document.getElementById('user-location');
                    if (locationElement) {
                        locationElement.textContent = 'غير متاح';
                    }
                }
            );
        }
    }

    /**
     * بدء مراقبة الموقع
     */
    startLocationTracking() {
        if (navigator.geolocation) {
            this.locationWatcher = navigator.geolocation.watchPosition(
                (position) => {
                    const locationData = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        timestamp: new Date().toISOString()
                    };
                    saveToStorage('user_location', locationData);
                }
            );
        }
    }

    /**
     * تحديث سجل النشاطات
     */
    updateActivityLog() {
        this.activityLog = getFromStorage('activity_log', []);

        const logContainer = document.getElementById('activity-log');
        if (!logContainer) return;

        if (this.activityLog.length === 0) {
            logContainer.innerHTML = '<p class="no-activities">لا توجد نشاطات</p>';
            return;
        }

        logContainer.innerHTML = this.activityLog
            .slice(-10) // آخر 10 نشاطات
            .reverse()
            .map(activity => `
                <div class="activity-item">
                    <div class="activity-icon">
                        <i class="fas fa-circle"></i>
                    </div>
                    <div class="activity-details">
                        <strong>${activity.action}</strong>
                        <small>${activity.details || ''}</small>
                        <span class="activity-time">${formatTimeAgo(activity.timestamp)}</span>
                    </div>
                </div>
            `).join('');
    }

    /**
     * تسجيل نشاط
     */
    logActivity(action, details = '') {
        const activity = {
            action: action,
            details: details,
            timestamp: new Date().toISOString()
        };

        this.activityLog.push(activity);
        saveToStorage('activity_log', this.activityLog);

        this.updateActivityLog();
    }

    /**
     * مزامنة الإعدادات
     */
    syncSettings() {
        const preferences = getFromStorage(CONFIG.STORAGE_KEYS.ACCESSIBILITY_PREFS, {});

        // حجم الخط
        const fontSizeSelect = document.getElementById('remote-font-size');
        if (fontSizeSelect && preferences.fontSize) {
            fontSizeSelect.value = preferences.fontSize;
        }

        // سرعة الصوت
        const voiceSpeedInput = document.getElementById('remote-voice-speed');
        if (voiceSpeedInput && preferences.voiceSpeed) {
            voiceSpeedInput.value = preferences.voiceSpeed;
            document.getElementById('voice-speed-value').textContent = preferences.voiceSpeed + 'x';
        }

        // الثيم
        const themeSelect = document.getElementById('remote-theme');
        if (themeSelect && this.userData.disabilityType) {
            themeSelect.value = this.userData.disabilityType;
        }
    }

    /**
     * بدء التحديث التلقائي
     */
    startAutoUpdate() {
        // تحديث كل 30 ثانية
        setInterval(() => {
            this.updateDashboard();
        }, 30000);

        // تحديث آخر نشاط كل 10 ثوان
        setInterval(() => {
            const lastActivityElement = document.getElementById('last-activity');
            if (lastActivityElement && this.activityLog.length > 0) {
                const lastActivity = this.activityLog[this.activityLog.length - 1];
                lastActivityElement.textContent = formatTimeAgo(lastActivity.timestamp);
            }
        }, 10000);
    }

    /**
     * تحميل بيانات المرافق
     */
    loadCompanionData() {
        this.companionData = getFromStorage('companion_data', null);
    }

    /**
     * حفظ بيانات المرافق
     */
    saveCompanionData() {
        saveToStorage('companion_data', this.companionData);
    }
}

/**
 * تحديث إعداد عن بُعد
 */
function updateRemoteSetting(setting, value) {
    const preferences = getFromStorage(CONFIG.STORAGE_KEYS.ACCESSIBILITY_PREFS, {});
    preferences[setting] = value;
    saveToStorage(CONFIG.STORAGE_KEYS.ACCESSIBILITY_PREFS, preferences);

    showNotification(`تم تحديث ${setting}`, 'success');

    // تحديث العرض
    if (setting === 'voiceSpeed') {
        document.getElementById('voice-speed-value').textContent = value + 'x';
    }

    // تسجيل النشاط
    if (window.companionManager) {
        window.companionManager.logActivity('تحديث الإعدادات', `${setting} = ${value}`);
    }
}

/**
 * قطع اتصال المرافق
 */
function disconnectCompanion() {
    if (confirm('هل أنت متأكد من قطع الاتصال؟')) {
        // حذف بيانات المرافق
        localStorage.removeItem('companion_data');

        // إيقاف مراقبة الموقع
        if (window.companionManager && window.companionManager.locationWatcher) {
            navigator.geolocation.clearWatch(window.companionManager.locationWatcher);
        }

        showNotification('تم قطع الاتصال', 'info');

        // إعادة التحميل
        setTimeout(() => {
            location.reload();
        }, 1000);
    }
}

/**
 * إنشاء رمز مرافق جديد
 */
function generateCompanionCode() {
    const code = 'AC' + Math.random().toString(36).substring(2, 10).toUpperCase();

    // حفظ الرمز
    const codes = getFromStorage('companion_codes', []);
    codes.push(code);
    saveToStorage('companion_codes', codes);

    // عرض الرمز
    alert(`رمز الربط الجديد:\n\n${code}\n\nشارك هذا الرمز مع المرافق`);
}

/**
 * تنسيق الوقت
 */
function formatTimeAgo(timestamp) {
    const now = new Date();
    const then = new Date(timestamp);
    const diff = Math.floor((now - then) / 1000); // بالثواني

    if (diff < 60) return 'الآن';
    if (diff < 3600) return `منذ ${Math.floor(diff / 60)} دقيقة`;
    if (diff < 86400) return `منذ ${Math.floor(diff / 3600)} ساعة`;
    return `منذ ${Math.floor(diff / 86400)} يوم`;
}

// تهيئة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    window.companionManager = new CompanionManager();
});
