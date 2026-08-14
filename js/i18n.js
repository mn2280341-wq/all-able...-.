// ========================================
// AllAble - Internationalization (i18n)
// نظام دعم اللغات المتعددة
// ========================================

class I18nManager {
    constructor() {
        this.currentLanguage = 'ar';
        this.translations = {};
        this.supportedLanguages = ['ar', 'en', 'fr'];

        this.init();
    }

    /**
     * تهيئة نظام اللغات
     */
    async init() {
        // تحميل اللغة المحفوظة
        this.currentLanguage = getFromStorage('app_language', 'ar');

        // تحميل الترجمات
        await this.loadTranslations(this.currentLanguage);

        // تطبيق اللغة
        this.applyLanguage();
    }

    /**
     * تحميل الترجمات
     */
    async loadTranslations(lang) {
        // الترجمات المضمنة
        this.translations = this.getEmbeddedTranslations(lang);
    }

    /**
     * الحصول على الترجمات المضمنة
     */
    getEmbeddedTranslations(lang) {
        const translations = {
            ar: {
                // الصفحة الرئيسية
                'app.title': 'All-Able',
                'app.tagline': 'تطبيق واحد… يتغير تلقائيًا ليفهمك ويخدمك مهما كانت احتياجاتك',
                'app.start': 'ابدأ الآن',
                'app.voice_control': 'التحكم الصوتي',

                // أنواع الإعاقات
                'disability.hearing': 'إعاقة سمعية',
                'disability.visual': 'إعاقة بصرية',
                'disability.motor': 'إعاقة حركية',
                'disability.cognitive': 'توحد / إعاقة ذهنية',
                'disability.learning': 'صعوبات تعلم',

                // الميزات
                'feature.sign_language': 'لغة الإشارة',
                'feature.aac': 'التواصل البديل',
                'feature.emergency': 'الطوارئ',
                'feature.camera': 'الكاميرا الذكية',
                'feature.education': 'التعليم',
                'feature.social_media': 'وسائل التواصل',

                // الأزرار
                'button.select': 'اختر',
                'button.skip': 'تخطي',
                'button.save': 'حفظ',
                'button.cancel': 'إلغاء',
                'button.back': 'رجوع',
                'button.next': 'التالي',

                // الرسائل
                'message.success': 'تم بنجاح',
                'message.error': 'حدث خطأ',
                'message.loading': 'جاري التحميل...',
                'message.no_internet': 'لا يوجد اتصال بالإنترنت',

                // الطوارئ
                'emergency.title': 'طوارئ',
                'emergency.send_location': 'إرسال الموقع',
                'emergency.call_help': 'طلب المساعدة',

                // الإعدادات
                'settings.language': 'اللغة',
                'settings.theme': 'الثيم',
                'settings.font_size': 'حجم الخط',
                'settings.voice_speed': 'سرعة الصوت'
            },

            en: {
                // Home Page
                'app.title': 'All-Able',
                'app.tagline': 'One app… automatically adapts to understand and serve you, whatever your needs',
                'app.start': 'Start Now',
                'app.voice_control': 'Voice Control',

                // Disability Types
                'disability.hearing': 'Hearing Impairment',
                'disability.visual': 'Visual Impairment',
                'disability.motor': 'Motor Impairment',
                'disability.cognitive': 'Autism / Cognitive Impairment',
                'disability.learning': 'Learning Difficulties',

                // Features
                'feature.sign_language': 'Sign Language',
                'feature.aac': 'Alternative Communication',
                'feature.emergency': 'Emergency',
                'feature.camera': 'Smart Camera',
                'feature.education': 'Education',
                'feature.social_media': 'Social Media',

                // Buttons
                'button.select': 'Select',
                'button.skip': 'Skip',
                'button.save': 'Save',
                'button.cancel': 'Cancel',
                'button.back': 'Back',
                'button.next': 'Next',

                // Messages
                'message.success': 'Success',
                'message.error': 'Error occurred',
                'message.loading': 'Loading...',
                'message.no_internet': 'No internet connection',

                // Emergency
                'emergency.title': 'Emergency',
                'emergency.send_location': 'Send Location',
                'emergency.call_help': 'Call for Help',

                // Settings
                'settings.language': 'Language',
                'settings.theme': 'Theme',
                'settings.font_size': 'Font Size',
                'settings.voice_speed': 'Voice Speed'
            },

            fr: {
                // Page d'accueil
                'app.title': 'All-Able',
                'app.tagline': 'Une application… s\'adapte automatiquement pour vous comprendre et vous servir, quels que soient vos besoins',
                'app.start': 'Commencer',
                'app.voice_control': 'Contrôle Vocal',

                // Types de handicap
                'disability.hearing': 'Déficience Auditive',
                'disability.visual': 'Déficience Visuelle',
                'disability.motor': 'Déficience Motrice',
                'disability.cognitive': 'Autisme / Déficience Cognitive',
                'disability.learning': 'Difficultés d\'Apprentissage',

                // Fonctionnalités
                'feature.sign_language': 'Langue des Signes',
                'feature.aac': 'Communication Alternative',
                'feature.emergency': 'Urgence',
                'feature.camera': 'Caméra Intelligente',
                'feature.education': 'Éducation',
                'feature.social_media': 'Réseaux Sociaux',

                // Boutons
                'button.select': 'Sélectionner',
                'button.skip': 'Passer',
                'button.save': 'Enregistrer',
                'button.cancel': 'Annuler',
                'button.back': 'Retour',
                'button.next': 'Suivant',

                // Messages
                'message.success': 'Succès',
                'message.error': 'Erreur',
                'message.loading': 'Chargement...',
                'message.no_internet': 'Pas de connexion Internet',

                // Urgence
                'emergency.title': 'Urgence',
                'emergency.send_location': 'Envoyer la Position',
                'emergency.call_help': 'Appeler à l\'Aide',

                // Paramètres
                'settings.language': 'Langue',
                'settings.theme': 'Thème',
                'settings.font_size': 'Taille de Police',
                'settings.voice_speed': 'Vitesse de la Voix'
            }
        };

        return translations[lang] || translations['ar'];
    }

    /**
     * الحصول على ترجمة
     */
    t(key, defaultValue = '') {
        return this.translations[key] || defaultValue || key;
    }

    /**
     * تغيير اللغة
     */
    async changeLanguage(lang) {
        if (!this.supportedLanguages.includes(lang)) {
            console.error('Unsupported language:', lang);
            return false;
        }

        this.currentLanguage = lang;
        await this.loadTranslations(lang);
        this.applyLanguage();

        saveToStorage('app_language', lang);

        return true;
    }

    /**
     * تطبيق اللغة على الصفحة
     */
    applyLanguage() {
        // تغيير اتجاه الصفحة
        const isRTL = this.currentLanguage === 'ar';
        document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
        document.documentElement.setAttribute('lang', this.currentLanguage);

        // ترجمة العناصر
        this.translateElements();
    }

    /**
     * ترجمة العناصر في الصفحة
     */
    translateElements() {
        // ترجمة العناصر ذات السمة data-i18n
        const elements = document.querySelectorAll('[data-i18n]');

        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.t(key);

            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translation;
            } else {
                element.textContent = translation;
            }
        });
    }

    /**
     * الحصول على اللغات المدعومة
     */
    getSupportedLanguages() {
        return [
            { code: 'ar', name: 'العربية', nativeName: 'العربية' },
            { code: 'en', name: 'English', nativeName: 'English' },
            { code: 'fr', name: 'French', nativeName: 'Français' }
        ];
    }
}

// إنشاء نسخة عامة
const i18n = new I18nManager();

// دالة مختصرة للترجمة
function t(key, defaultValue = '') {
    return i18n.t(key, defaultValue);
}

// التصدير
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { I18nManager, i18n, t };
}
