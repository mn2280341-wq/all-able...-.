// ========================================
// AllAble - Emergency System
// نظام الطوارئ الذكي
// ========================================

class EmergencySystem {
    constructor() {
        this.emergencyContacts = [];
        this.currentLocation = null;
        this.isEmergencyActive = false;
        this.init();
    }

    init() {
        this.loadEmergencyContacts();
    }

    /**
     * تحميل جهات الاتصال للطوارئ
     */
    loadEmergencyContacts() {
        this.emergencyContacts = getFromStorage(CONFIG.STORAGE_KEYS.EMERGENCY_CONTACTS, []);
    }

    /**
     * حفظ جهات الاتصال
     */
    saveEmergencyContacts() {
        saveToStorage(CONFIG.STORAGE_KEYS.EMERGENCY_CONTACTS, this.emergencyContacts);
    }

    /**
     * إضافة جهة اتصال طوارئ
     */
    addEmergencyContact(contact) {
        this.emergencyContacts.push({
            id: Date.now(),
            name: contact.name,
            phone: contact.phone,
            relation: contact.relation,
            createdAt: new Date().toISOString()
        });

        this.saveEmergencyContacts();
        showNotification('تم إضافة جهة الاتصال بنجاح', 'success');
    }

    /**
     * حذف جهة اتصال
     */
    removeEmergencyContact(id) {
        this.emergencyContacts = this.emergencyContacts.filter(c => c.id !== id);
        this.saveEmergencyContacts();
        showNotification('تم حذف جهة الاتصال', 'info');
    }

    /**
     * تفعيل الطوارئ
     */
    async activateEmergency() {
        if (this.isEmergencyActive) {
            console.log('⚠️ الطوارئ نشطة بالفعل');
            return;
        }

        this.isEmergencyActive = true;
        console.log('🚨 تفعيل نظام الطوارئ');

        // الحصول على الموقع
        await this.getCurrentLocation();

        // إرسال رسائل الطوارئ
        this.sendEmergencyMessages();

        // تنبيه صوتي
        speak('تم تفعيل نظام الطوارئ. جاري إرسال موقعك لجهات الاتصال');

        // تنبيه مرئي
        if (accessibilityManager.currentDisabilityType === 'hearing') {
            accessibilityManager.showVisualAlert('🚨 تم تفعيل نظام الطوارئ');
        }

        showNotification('تم تفعيل نظام الطوارئ', 'warning', 5000);
    }

    /**
     * الحصول على الموقع الحالي
     */
    async getCurrentLocation() {
        return new Promise((resolve, reject) => {
            getCurrentLocation(
                (location) => {
                    this.currentLocation = location;
                    console.log('📍 الموقع:', location);
                    resolve(location);
                },
                (error) => {
                    console.error('خطأ في تحديد الموقع:', error);
                    this.currentLocation = null;
                    reject(error);
                }
            );
        });
    }

    /**
     * إرسال رسائل الطوارئ
     */
    sendEmergencyMessages() {
        if (this.emergencyContacts.length === 0) {
            showNotification('لا توجد جهات اتصال للطوارئ', 'warning');
            return;
        }

        const user = getFromStorage(CONFIG.STORAGE_KEYS.USER_PROFILE);
        const disabilityType = accessibilityManager.getDisabilityName(user?.disabilityType || 'غير محدد');

        let message = CONFIG.EMERGENCY.DEFAULT_MESSAGE;
        message += `\n\nنوع الإعاقة: ${disabilityType}`;

        if (this.currentLocation) {
            const mapsLink = createGoogleMapsLink(
                this.currentLocation.latitude,
                this.currentLocation.longitude
            );
            message += `\n\nالموقع: ${mapsLink}`;
        }

        message += `\n\nالوقت: ${formatDate(new Date(), 'full')}`;

        // في التطبيق الحقيقي، سيتم إرسال رسائل SMS أو إشعارات
        console.log('📧 رسالة الطوارئ:', message);

        // محاكاة إرسال الرسائل
        this.emergencyContacts.forEach(contact => {
            console.log(`📱 إرسال لـ ${contact.name} (${contact.phone})`);
            // هنا سيتم دمج API لإرسال SMS
        });

        showNotification(`تم إرسال رسائل الطوارئ لـ ${this.emergencyContacts.length} جهة اتصال`, 'success');
    }

    /**
     * إلغاء الطوارئ
     */
    deactivateEmergency() {
        this.isEmergencyActive = false;
        showNotification('تم إلغاء حالة الطوارئ', 'info');
        console.log('✅ تم إلغاء الطوارئ');
    }

    /**
     * الحصول على معلومات الطوارئ الكاملة
     */
    getEmergencyInfo() {
        const user = getFromStorage(CONFIG.STORAGE_KEYS.USER_PROFILE);

        return {
            user: {
                name: user?.name || 'غير محدد',
                disabilityType: accessibilityManager.getDisabilityName(user?.disabilityType)
            },
            location: this.currentLocation,
            contacts: this.emergencyContacts,
            timestamp: new Date().toISOString()
        };
    }
}

// إنشاء نسخة عامة
const emergencySystem = new EmergencySystem();

// تصدير
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { EmergencySystem, emergencySystem };
}
