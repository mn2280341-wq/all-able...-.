// AllAble Application Configuration
// ⚠️ IMPORTANT: في الإنتاج، يجب حفظ المفاتيح في متغيرات البيئة (Environment Variables)

const CONFIG = {
  // Google Gemini API للذكاء الاصطناعي وتحليل المشاعر
  GEMINI_API_KEY: 'AIzaSyCUZBlbtwanITPLlaGltUZjFd62viffWdg',
  GEMINI_API_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',

  // YouTube API
  YOUTUBE_API_KEY: 'AIzaSyClxsHf3tZd1rjsZVylQxTUfSgWlwtjk-8',
  YOUTUBE_API_URL: 'https://www.googleapis.com/youtube/v3',

  // MediaPipe للغة الإشارة (سيتم استخدامه في Python backend)
  MEDIAPIPE_ENABLED: true,
  USE_BACKEND: true,
  BACKEND_URL: 'http://localhost:5000',

  // إعدادات التطبيق
  APP_NAME: 'All-Able',
  APP_VERSION: '2.0.0',
  DEFAULT_LANGUAGE: 'ar',
  SUPPORTED_LANGUAGES: ['ar', 'en', 'fr'],

  // أنواع الإعاقات المدعومة
  DISABILITY_TYPES: {
    HEARING: 'hearing',      // سمعية
    VISUAL: 'visual',        // بصرية
    MOTOR: 'motor',          // حركية
    COGNITIVE: 'cognitive',  // ذهنية/توحد
    LEARNING: 'learning'     // صعوبات تعلم
  },

  // إعدادات التخزين المحلي
  STORAGE_KEYS: {
    USER_PROFILE: 'allable_user_profile',
    DISABILITY_TYPE: 'allable_disability_type',
    PREFERENCES: 'allable_preferences',
    EMERGENCY_CONTACTS: 'allable_emergency_contacts'
  },

  // إعدادات الطوارئ
  EMERGENCY: {
    DEFAULT_MESSAGE: 'أحتاج مساعدة عاجلة! هذه رسالة طوارئ من تطبيق AllAble.',
    LOCATION_TIMEOUT: 10000 // 10 ثواني
  }
};
window.CONFIG = CONFIG;

// تصدير الإعدادات
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}
