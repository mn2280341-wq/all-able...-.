// ========================================
// All-Able - Content Middleware
// الوسيط الذكي لمعالجة وتكييف المحتوى
// ========================================

class ContentMiddleware {
    constructor() {
        this.cache = new Map();
    }

    /**
     * معالجة المحتوى بناءً على نوع الإعاقة
     * @param {Object} content - { text, type (video/text), url }
     * @returns {Promise<Object>} - المحتوى المعالج
     */
    async processContent(content) {
        const disabilityType = accessibilityManager.currentDisabilityType;
        console.log(`🔄 معالجة المحتوى لنوع الإعاقة: ${disabilityType}`);

        if (!disabilityType) return content;

        switch (disabilityType) {
            case 'hearing':
                return await this.processForHearing(content);
            case 'visual':
                return await this.processForVisual(content);
            case 'cognitive':
            case 'learning':
                return await this.processForCognitive(content);
            default:
                return content;
        }
    }

    /**
     * معالجة للإعاقة السمعية (تحويل الصوت لنص/إشارة)
     */
    async processForHearing(content) {
        // إذا كان فيديو، نحتاج لتحويل الصوت إلى نص أو إشارة
        if (content.type === 'video') {
            // محاكاة تحويل الفيديو (في الواقع يحتاج Backend)
            return {
                ...content,
                processed: true,
                captions: "جاري تحليل الصوت...", // سيتم استبداله بالنتيجة الحقيقية
                showSignLanguage: true
            };
        }
        return content;
    }

    /**
     * معالجة للإعاقة البصرية (قراءة النصوص وصف الصور)
     */
    async processForVisual(content) {
        // إضافة وصف صوتي تلقائي
        if (content.type === 'image' || content.type === 'video') {
            // هنا نطلب وصف الصورة من الـ Backend (Gemini API)
            // سنفترض النتيجة الآن
            const description = content.description || "صورة توضيحية";
            speak(`صورة: ${description}`);
        }

        // قراءة النص تلقائياً إذا كان قصيراً
        if (content.text && content.text.length < 100) {
            speak(content.text);
        }

        return {
            ...content,
            autoRead: true
        };
    }

    /**
     * معالجة للإعاقة الذهنية (تبسيط النصوص)
     */
    async processForCognitive(content) {
        if (content.text) {
            const simplified = await this.simplifyTextAPI(content.text);
            return {
                ...content,
                originalText: content.text,
                text: simplified,
                isSimplified: true
            };
        }
        return content;
    }

    /**
     * استدعاء API التبسيط (محاكاة أو حقيقي)
     */
    async simplifyTextAPI(text) {
        // يمكن هنا الاتصال بـ Python Backend
        // return await callBackend('/api/simplify', 'POST', { text });

        // حالياً نستخدم الدالة المحلية في utils.js
        return simplifyText(text);
    }
}

const contentMiddleware = new ContentMiddleware();
