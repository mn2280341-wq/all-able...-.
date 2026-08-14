// ========================================
// AllAble - Encryption & Security
// التشفير والأمان
// ========================================

/**
 * نظام التشفير للبيانات الحساسة
 */
class EncryptionManager {
    constructor() {
        this.algorithm = 'AES-GCM';
        this.keyLength = 256;
    }

    /**
     * توليد مفتاح تشفير
     */
    async generateKey() {
        try {
            const key = await window.crypto.subtle.generateKey(
                {
                    name: this.algorithm,
                    length: this.keyLength
                },
                true,
                ['encrypt', 'decrypt']
            );
            return key;
        } catch (error) {
            console.error('Error generating key:', error);
            return null;
        }
    }

    /**
     * تشفير البيانات
     */
    async encrypt(data, key) {
        try {
            const encoder = new TextEncoder();
            const encodedData = encoder.encode(JSON.stringify(data));

            const iv = window.crypto.getRandomValues(new Uint8Array(12));

            const encryptedData = await window.crypto.subtle.encrypt(
                {
                    name: this.algorithm,
                    iv: iv
                },
                key,
                encodedData
            );

            // دمج IV مع البيانات المشفرة
            const combined = new Uint8Array(iv.length + encryptedData.byteLength);
            combined.set(iv, 0);
            combined.set(new Uint8Array(encryptedData), iv.length);

            // تحويل إلى Base64
            return this.arrayBufferToBase64(combined);
        } catch (error) {
            console.error('Encryption error:', error);
            return null;
        }
    }

    /**
     * فك تشفير البيانات
     */
    async decrypt(encryptedData, key) {
        try {
            const combined = this.base64ToArrayBuffer(encryptedData);

            const iv = combined.slice(0, 12);
            const data = combined.slice(12);

            const decryptedData = await window.crypto.subtle.decrypt(
                {
                    name: this.algorithm,
                    iv: iv
                },
                key,
                data
            );

            const decoder = new TextDecoder();
            const decodedData = decoder.decode(decryptedData);

            return JSON.parse(decodedData);
        } catch (error) {
            console.error('Decryption error:', error);
            return null;
        }
    }

    /**
     * تحويل ArrayBuffer إلى Base64
     */
    arrayBufferToBase64(buffer) {
        const bytes = new Uint8Array(buffer);
        let binary = '';
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }

    /**
     * تحويل Base64 إلى ArrayBuffer
     */
    base64ToArrayBuffer(base64) {
        const binary = window.atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
        }
        return bytes;
    }

    /**
     * تخزين المفتاح بشكل آمن
     */
    async storeKey(key, keyName) {
        try {
            const exportedKey = await window.crypto.subtle.exportKey('jwk', key);
            const keyString = JSON.stringify(exportedKey);

            // في النسخة الحقيقية، يجب استخدام طريقة أكثر أماناً
            sessionStorage.setItem(keyName, keyString);

            return true;
        } catch (error) {
            console.error('Error storing key:', error);
            return false;
        }
    }

    /**
     * استرجاع المفتاح
     */
    async retrieveKey(keyName) {
        try {
            const keyString = sessionStorage.getItem(keyName);
            if (!keyString) return null;

            const keyData = JSON.parse(keyString);

            const key = await window.crypto.subtle.importKey(
                'jwk',
                keyData,
                {
                    name: this.algorithm,
                    length: this.keyLength
                },
                true,
                ['encrypt', 'decrypt']
            );

            return key;
        } catch (error) {
            console.error('Error retrieving key:', error);
            return null;
        }
    }
}

/**
 * نظام الأمان للأطفال
 */
class ChildSafetyManager {
    constructor() {
        this.isChildMode = false;
        this.parentPin = null;
        this.blockedContent = [];
        this.timeLimit = null;
        this.sessionStartTime = null;
    }

    /**
     * تفعيل وضع الأطفال
     */
    enableChildMode(pin) {
        this.isChildMode = true;
        this.parentPin = this.hashPin(pin);
        this.sessionStartTime = new Date();

        saveToStorage('child_mode', {
            enabled: true,
            pin: this.parentPin,
            startTime: this.sessionStartTime
        });

        // تطبيق القيود
        this.applyRestrictions();

        showNotification('تم تفعيل وضع الأطفال', 'success');
    }

    /**
     * إيقاف وضع الأطفال
     */
    disableChildMode(pin) {
        const hashedPin = this.hashPin(pin);

        if (hashedPin === this.parentPin) {
            this.isChildMode = false;
            this.parentPin = null;
            this.sessionStartTime = null;

            localStorage.removeItem('child_mode');

            // إزالة القيود
            this.removeRestrictions();

            showNotification('تم إيقاف وضع الأطفال', 'info');
            return true;
        } else {
            showNotification('رمز PIN غير صحيح', 'error');
            return false;
        }
    }

    /**
     * تشفير PIN
     */
    hashPin(pin) {
        // تشفير بسيط - في النسخة الحقيقية استخدم bcrypt أو مشابه
        let hash = 0;
        for (let i = 0; i < pin.length; i++) {
            const char = pin.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString();
    }

    /**
     * تطبيق القيود
     */
    applyRestrictions() {
        // إخفاء المحتوى غير المناسب
        document.body.classList.add('child-safe-mode');

        // منع الوصول لبعض الصفحات
        this.restrictPages();

        // تفعيل الفلترة
        this.enableContentFiltering();
    }

    /**
     * إزالة القيود
     */
    removeRestrictions() {
        document.body.classList.remove('child-safe-mode');
    }

    /**
     * تقييد الصفحات
     */
    restrictPages() {
        const restrictedPages = ['social-media.html'];
        const currentPage = window.location.pathname.split('/').pop();

        if (restrictedPages.includes(currentPage)) {
            showNotification('هذه الصفحة غير متاحة في وضع الأطفال', 'warning');
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 2000);
        }
    }

    /**
     * تفعيل فلترة المحتوى
     */
    enableContentFiltering() {
        // فلترة الكلمات غير المناسبة
        const inappropriateWords = ['كلمة1', 'كلمة2']; // قائمة الكلمات

        // مراقبة المدخلات
        document.addEventListener('input', (e) => {
            if (this.isChildMode && e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                const value = e.target.value.toLowerCase();

                for (const word of inappropriateWords) {
                    if (value.includes(word)) {
                        e.target.value = value.replace(new RegExp(word, 'gi'), '***');
                        showNotification('تم حذف محتوى غير مناسب', 'warning');
                    }
                }
            }
        });
    }

    /**
     * التحقق من حد الوقت
     */
    checkTimeLimit() {
        if (!this.isChildMode || !this.timeLimit) return;

        const now = new Date();
        const elapsed = (now - this.sessionStartTime) / 1000 / 60; // بالدقائق

        if (elapsed >= this.timeLimit) {
            showNotification('انتهى وقت الاستخدام', 'warning');
            // يمكن إضافة إجراءات إضافية هنا
        }
    }

    /**
     * تحميل إعدادات وضع الأطفال
     */
    loadChildMode() {
        const childModeData = getFromStorage('child_mode', null);

        if (childModeData && childModeData.enabled) {
            this.isChildMode = true;
            this.parentPin = childModeData.pin;
            this.sessionStartTime = new Date(childModeData.startTime);

            this.applyRestrictions();
        }
    }
}

/**
 * نظام الأذونات
 */
class PermissionManager {
    constructor() {
        this.permissions = {
            camera: false,
            microphone: false,
            location: false,
            notifications: false
        };
    }

    /**
     * طلب إذن
     */
    async requestPermission(type) {
        try {
            switch (type) {
                case 'camera':
                    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                    stream.getTracks().forEach(track => track.stop());
                    this.permissions.camera = true;
                    break;

                case 'microphone':
                    const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
                    audioStream.getTracks().forEach(track => track.stop());
                    this.permissions.microphone = true;
                    break;

                case 'location':
                    await new Promise((resolve, reject) => {
                        navigator.geolocation.getCurrentPosition(resolve, reject);
                    });
                    this.permissions.location = true;
                    break;

                case 'notifications':
                    const permission = await Notification.requestPermission();
                    this.permissions.notifications = (permission === 'granted');
                    break;
            }

            saveToStorage('permissions', this.permissions);
            return true;
        } catch (error) {
            console.error(`Permission ${type} denied:`, error);
            return false;
        }
    }

    /**
     * التحقق من الإذن
     */
    hasPermission(type) {
        return this.permissions[type] || false;
    }

    /**
     * تحميل الأذونات
     */
    loadPermissions() {
        this.permissions = getFromStorage('permissions', this.permissions);
    }
}

// إنشاء نسخ عامة
const encryptionManager = new EncryptionManager();
const childSafetyManager = new ChildSafetyManager();
const permissionManager = new PermissionManager();

// تحميل إعدادات الأمان عند بدء التشغيل
document.addEventListener('DOMContentLoaded', () => {
    childSafetyManager.loadChildMode();
    permissionManager.loadPermissions();
});

// التصدير
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        EncryptionManager,
        ChildSafetyManager,
        PermissionManager,
        encryptionManager,
        childSafetyManager,
        permissionManager
    };
}
