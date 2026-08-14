// ========================================
// AllAble - AI & Emotion Analysis
// الذكاء الاصطناعي وتحليل المشاعر باستخدام Google Gemini
// ========================================

class AIEmotionAnalyzer {
    constructor() {
        this.apiKey = CONFIG.GEMINI_API_KEY;
        // استخدام مسار v1beta الأكثر استقراراً وموديل gemini-1.5-flash المتاح مجاناً
        this.apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
        this.emotionHistory = [];
        this.isAnalyzing = false;
    }

    /**
     * تحليل النص باستخدام Google Gemini
     */
    async analyzeText(text) {
        try {
            const response = await fetch(`${this.apiUrl}?key=${this.apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `قم بتحليل المشاعر في النص التالي وأعطني النتيجة بصيغة JSON تحتوي على:
              - emotion: المشاعر المكتشفة (سعادة، حزن، قلق، غضب، خوف، محايد)
              - intensity: شدة المشاعر (منخفض، متوسط، عالي)
              - keywords: الكلمات المفتاحية التي تدل على المشاعر
              - suggestion: اقتراح للمساعدة إذا كانت المشاعر سلبية
              
              النص: "${text}"`
                        }]
                    }]
                })
            });

            if (!response.ok) {
                console.warn('⚠️ Gemini API returned error:', response.status);
                return this.getFallbackAnalysis(text);
            }

            const data = await response.json();
            const result = this.parseGeminiResponse(data);

            // حفظ في السجل
            this.emotionHistory.push({
                text,
                result,
                timestamp: new Date().toISOString()
            });

            return result;
        } catch (error) {
            console.error('خطأ في تحليل المشاعر:', error);
            return this.getFallbackAnalysis(text);
        }
    }

    /**
     * تحليل بسيط احتياطي (في حالة فشل API)
     */
    getFallbackAnalysis(text) {
        const lowerText = text.toLowerCase();

        // كلمات تدل على مشاعر مختلفة
        const emotionKeywords = {
            سعادة: ['سعيد', 'فرح', 'مبسوط', 'رائع', 'جميل', 'ممتاز'],
            حزن: ['حزين', 'زعلان', 'متضايق', 'مكتئب', 'وحيد'],
            قلق: ['قلق', 'خائف', 'متوتر', 'مرتبك', 'خوف'],
            غضب: ['غاضب', 'زعلان', 'منزعج', 'مستاء'],
            خوف: ['خائف', 'مرعوب', 'خوف', 'رعب']
        };

        let detectedEmotion = 'محايد';
        let keywords = [];

        for (const [emotion, words] of Object.entries(emotionKeywords)) {
            for (const word of words) {
                if (lowerText.includes(word)) {
                    detectedEmotion = emotion;
                    keywords.push(word);
                }
            }
        }

        return {
            emotion: detectedEmotion,
            intensity: keywords.length > 2 ? 'عالي' : keywords.length > 0 ? 'متوسط' : 'منخفض',
            keywords,
            suggestion: this.getSuggestionForEmotion(detectedEmotion)
        };
    }

    /**
     * معالجة استجابة Gemini
     */
    parseGeminiResponse(data) {
        try {
            if (!data.candidates || data.candidates.length === 0) {
                throw new Error('No candidates');
            }

            const text = data.candidates[0].content.parts[0].text;

            // محاولة استخراج JSON من الاستجابة
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }

            // إذا لم يكن JSON، نحاول التحليل اليدوي
            return this.parseTextResponse(text);
        } catch (error) {
            console.error('خطأ في معالجة استجابة Gemini:', error);
            return {
                emotion: 'محايد',
                intensity: 'منخفض',
                keywords: [],
                suggestion: null
            };
        }
    }

    /**
     * تحليل استجابة نصية
     */
    parseTextResponse(text) {
        // تحليل بسيط للاستجابة النصية
        return {
            emotion: 'محايد',
            intensity: 'متوسط',
            keywords: [],
            suggestion: text
        };
    }

    /**
     * الحصول على اقتراح حسب المشاعر
     */
    getSuggestionForEmotion(emotion) {
        const suggestions = {
            حزن: 'يبدو أنك تشعر بالحزن. هل تريد التحدث مع شخص موثوق؟ يمكنني أيضاً عرض محتوى مريح لك.',
            قلق: 'أشعر بقلقك. دعني أساعدك ببعض تمارين التنفس أو التواصل مع شخص داعم.',
            خوف: 'أنت بأمان. هل تريد الاتصال بشخص موثوق أو استخدام زر الطوارئ؟',
            غضب: 'أفهم أنك منزعج. خذ نفساً عميقاً. هل تريد بعض الوقت للاسترخاء؟',
            سعادة: 'رائع! أنا سعيد لسعادتك 😊'
        };

        return suggestions[emotion] || null;
    }

    /**
     * تحليل مستمر للمشاعر
     */
    async startContinuousAnalysis(textSource, interval = 30000) {
        this.isAnalyzing = true;

        const analyze = async () => {
            if (!this.isAnalyzing) return;

            const text = typeof textSource === 'function' ? textSource() : textSource;
            if (text) {
                const result = await this.analyzeText(text);
                this.handleEmotionResult(result);
            }

            setTimeout(analyze, interval);
        };

        analyze();
    }

    /**
     * إيقاف التحليل المستمر
     */
    stopContinuousAnalysis() {
        this.isAnalyzing = false;
    }

    /**
     * معالجة نتيجة تحليل المشاعر
     */
    handleEmotionResult(result) {
        console.log('🧠 تحليل المشاعر:', result);

        // إذا كانت المشاعر سلبية وشديدة
        if (['حزن', 'قلق', 'خوف', 'غضب'].includes(result.emotion) && result.intensity === 'عالي') {
            this.showEmotionAlert(result);
        }
    }

    /**
     * عرض تنبيه للمشاعر السلبية
     */
    showEmotionAlert(result) {
        // عرض إشعار
        if (typeof showNotification === 'function') {
            showNotification(result.suggestion || 'نحن هنا لمساعدتك', 'warning', 5000);
        }

        // قراءة الاقتراح صوتياً للمستخدمين ذوي الإعاقة البصرية
        if (typeof accessibilityManager !== 'undefined' && accessibilityManager.currentDisabilityType === 'visual') {
            speak(result.suggestion);
        }

        // تنبيه مرئي للمستخدمين ذوي الإعاقة السمعية
        if (typeof accessibilityManager !== 'undefined' && accessibilityManager.currentDisabilityType === 'hearing') {
            accessibilityManager.showVisualAlert(result.suggestion);
        }
    }

    /**
     * الحصول على سجل المشاعر
     */
    getEmotionHistory(limit = 10) {
        return this.emotionHistory.slice(-limit);
    }

    /**
     * تحليل الاتجاه العام للمشاعر
     */
    getEmotionTrend() {
        if (this.emotionHistory.length === 0) {
            return { trend: 'محايد', message: 'لا توجد بيانات كافية' };
        }

        const recentEmotions = this.emotionHistory.slice(-10);
        const emotionCounts = {};

        recentEmotions.forEach(item => {
            emotionCounts[item.result.emotion] = (emotionCounts[item.result.emotion] || 0) + 1;
        });

        const dominantEmotion = Object.keys(emotionCounts).reduce((a, b) =>
            emotionCounts[a] > emotionCounts[b] ? a : b
        );

        return {
            trend: dominantEmotion,
            counts: emotionCounts,
            message: `الاتجاه العام: ${dominantEmotion}`
        };
    }

    /**
     * تبسيط النص باستخدام AI
     */
    async simplifyTextWithAI(text) {
        try {
            const response = await fetch(`${this.apiUrl}?key=${this.apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `قم بتبسيط النص التالي ليكون سهل الفهم للأطفال وذوي صعوبات التعلم. استخدم كلمات بسيطة وجمل قصيرة:
              
              "${text}"`
                        }]
                    }]
                })
            });

            if (!response.ok) return text; // Fallback

            const data = await response.json();
            if (data.candidates && data.candidates.length > 0) {
                return data.candidates[0].content.parts[0].text;
            }
            return text;

        } catch (error) {
            console.error('خطأ في تبسيط النص:', error);
            // return simplifyText(text); // استخدام التبسيط المحلي (غير معرف هنا، نرجع النص)
            return text;
        }
    }

    /**
     * شرح كلمة أو مصطلح
     */
    async explainTerm(term, disabilityType = null) {
        try {
            console.log('🚀 Sending request to Gemini API (flash)...');
            let prompt = `اشرح معنى "${term}" بطريقة`;

            switch (disabilityType) {
                case 'cognitive':
                case 'learning':
                    prompt += ' بسيطة جداً مناسبة للأطفال';
                    break;
                case 'visual':
                    prompt += ' وصفية تفصيلية';
                    break;
                default:
                    prompt += ' واضحة ومباشرة';
            }

            const response = await fetch(`${this.apiUrl}?key=${this.apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: prompt }]
                    }]
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.warn('❌ Gemini API Returned Error. Using Fallback.', errorData);
                return null; // نعيد null لتفعيل الـ fallback
            }

            const data = await response.json();

            if (data.candidates && data.candidates.length > 0) {
                return data.candidates[0].content.parts[0].text;
            } else {
                console.warn('⚠️ No candidates in Gemini response');
                return null;
            }

        } catch (error) {
            console.error('❌ Network/Code Error in explainTerm:', error);
            // نعيد null ليقوم الكود في search.js باستخدام المحاكاة كبديل
            return null;
        }
    }
}

// إنشاء نسخة عامة
const aiEmotionAnalyzer = new AIEmotionAnalyzer();

// تصدير
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AIEmotionAnalyzer, aiEmotionAnalyzer };
}
