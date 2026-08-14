// ========================================
// AllAble - Smart Search
// البحث الذكي مع الذكاء الاصطناعي
// ========================================

class SmartSearch {
    constructor() {
        this.searchHistory = [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadSearchHistory();
    }

    setupEventListeners() {
        const searchInput = document.getElementById('search-input');
        const searchBtn = document.getElementById('search-btn');
        const voiceSearchBtn = document.getElementById('voice-search-btn');

        if (searchBtn) {
            searchBtn.addEventListener('click', () => this.performSearch());
        }

        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch();
                }
            });
        }

        if (voiceSearchBtn) {
            voiceSearchBtn.addEventListener('click', () => this.startVoiceSearch());
        }
    }

    async performSearch() {
        const searchInput = document.getElementById('search-input');
        const query = searchInput.value.trim();

        if (!query) {
            showNotification('الرجاء إدخال كلمة للبحث', 'warning');
            return;
        }

        // عرض مؤشر التحميل
        this.showLoading();

        try {
            // الحصول على نوع الإعاقة
            const disabilityType = accessibilityManager ? accessibilityManager.currentDisabilityType : 'hearing';

            // البحث في القاموس المحلي أولاً
            let result = this.searchLocalDictionary(query, disabilityType);

            // محاولة البحث باستخدام الذكاء الاصطناعي الحقيقي (Google Gemini)
            if (!result && typeof aiEmotionAnalyzer !== 'undefined') {
                try {
                    showNotification('جاري سؤال الذكاء الاصطناعي...', 'info');
                    result = await aiEmotionAnalyzer.explainTerm(query, disabilityType);
                } catch (error) {
                    console.log('AI API failed, switching to simulation:', error);
                }
            }

            // إذا فشل الذكاء الاصطناعي، نستخدم المحاكي المحلي الذكي
            if (!result) {
                result = await this.simulateAIResponse(query);
            }

            // عرض النتائج
            this.displayResults(query, result);

            // حفظ في السجل
            this.addToHistory(query, result);

            // قراءة النتيجة للمستخدمين ذوي الإعاقة البصرية
            if (disabilityType === 'visual') {
                speak(result);
            }

        } catch (error) {
            console.error('خطأ في البحث:', error);
            const fallback = this.getFallbackExplanation(query);
            this.displayResults(query, fallback);
            this.hideLoading();
        }
    }

    searchLocalDictionary(query, disabilityType) {
        const dictionary = {
            // كلمات الطوارئ
            'طوارئ': 'حالة تحتاج مساعدة فورية. اضغط على زر الطوارئ الأحمر للحصول على المساعدة.',
            'مساعدة': 'طلب الدعم والمساندة من الآخرين. يمكنك استخدام زر الطوارئ.',
            'خطر': 'شيء قد يسبب الأذى. ابتعد عنه وأخبر شخصاً بالغاً.',

            // كلمات أساسية
            'ماء': 'سائل شفاف نشربه.',
            'طعام': 'أكل نأكله لنعيش.',
            'حمام': 'مكان للنظافة وقضاء الحاجة.',
            'ألم': 'وجع في الجسم.',
            'دواء': 'علاج للمرض.',
            'نوم': 'الراحة في الليل.',
            'بيت': 'المكان الذي نسكن فيه.',
            'منزل': 'المكان الذي نسكن فيه.',
            'سيارة': 'وسيلة نقل نمشي بها في الشارع.',
            'عربية': 'وسيلة نقل نمشي بها في الشارع.',

            // مشاعر
            'سعيد': 'فرحان ومبسوط.',
            'فرح': 'شعور بالسعادة والسرور.',
            'حزين': 'زعلان ومتضايق.',
            'خائف': 'مرعوب من شيء.',
            'غاضب': 'متعصب وزعلان جداً.',
            'حب': 'شعور جميل تجاه شخص أو شيء.',

            // تواصل
            'نعم': 'موافق.',
            'لا': 'غير موافق.',
            'شكرا': 'كلمة شكر وتقدير.',
            'مرحبا': 'أهلاً وسهلاً.',
            'اهلا': 'مرحباً بك.',
            'كيف': 'سؤال عن الحال أو الطريقة.',
            'متى': 'سؤال عن الوقت.',
            'اين': 'سؤال عن المكان.',
            'ال': 'أداة تعريف للكلمات.'
        };

        const lowerQuery = query.toLowerCase().trim();

        // البحث عن تطابق تام أو جزئي
        if (dictionary[lowerQuery]) return dictionary[lowerQuery];

        for (const key in dictionary) {
            if (lowerQuery.includes(key) || key.includes(lowerQuery)) {
                return dictionary[key];
            }
        }

        return null;
    }

    getFallbackExplanation(query) {
        return `تم البحث عن: "${query}"\n\nللأسف، لم نجد شرحاً مفصلاً لهذه الكلمة في قاموسنا حالياً.\n\nيمكنك:\n• تجربة كلمات أخرى مثل: طوارئ، مساعدة، ماء، طعام\n• استخدام الكاميرا الذكية لقراءة النصوص\n• طلب المساعدة من شخص قريب منك`;
    }

    displayResults(query, result) {
        const resultsContainer = document.getElementById('search-results');

        if (!resultsContainer) return;

        const disabilityType = accessibilityManager.currentDisabilityType;

        let html = `
      <div class="search-result-card">
        <div class="result-header">
          <h3>${query}</h3>
          <div class="result-actions">
            <button class="icon-btn" onclick="speak('${result.replace(/'/g, "\\'")}')">
              <i class="fas fa-volume-up"></i>
            </button>
            <button class="icon-btn" onclick="copyToClipboard('${result.replace(/'/g, "\\'")}')">
              <i class="fas fa-copy"></i>
            </button>
          </div>
        </div>
        <div class="result-content">
          <p>${result}</p>
        </div>
    `;

        // إضافة خيارات إضافية حسب نوع الإعاقة
        if (disabilityType === 'hearing') {
            html += `
        <div class="result-extra">
          <button class="btn btn-secondary" onclick="smartSearch.showSignLanguage('${query}')">
            <i class="fas fa-hands"></i>
            عرض بلغة الإشارة
          </button>
        </div>
      `;
        }

        if (disabilityType === 'cognitive' || disabilityType === 'learning') {
            html += `
        <div class="result-extra">
          <button class="btn btn-secondary" onclick="smartSearch.simplifyMore('${query}')">
            <i class="fas fa-lightbulb"></i>
            اشرح بشكل أبسط
          </button>
        </div>
      `;
        }

        html += `</div>`;

        resultsContainer.innerHTML = html;
        this.hideLoading();
    }

    showLoading() {
        const resultsContainer = document.getElementById('search-results');
        if (resultsContainer) {
            resultsContainer.innerHTML = `
        <div class="loading-container">
          <div class="spinner"></div>
          <p>جاري البحث...</p>
        </div>
      `;
        }
    }

    hideLoading() {
        // يتم إخفاء التحميل عند عرض النتائج
    }

    startVoiceSearch() {
        const voiceSearchBtn = document.getElementById('voice-search-btn');

        if (voiceSearchBtn) {
            voiceSearchBtn.classList.add('active');
        }

        showNotification('قل ما تريد البحث عنه...', 'info');

        startVoiceRecognition((transcript) => {
            const searchInput = document.getElementById('search-input');
            if (searchInput) {
                searchInput.value = transcript;
                this.performSearch();
            }

            if (voiceSearchBtn) {
                voiceSearchBtn.classList.remove('active');
            }
        });
    }

    async showSignLanguage(term) {
        showNotification('جاري تحويل النص إلى لغة الإشارة...', 'info');
        // التوجيه لصفحة لغة الإشارة مع النص
        const encodedText = encodeURIComponent(term);
        window.location.href = `sign-language.html?text=${encodedText}`;
    }

    async simplifyMore(term) {
        this.showLoading();

        try {
            const simplified = await aiEmotionAnalyzer.simplifyTextWithAI(term);
            this.displayResults(term, simplified);
        } catch (error) {
            console.error('خطأ في التبسيط:', error);
            showNotification('حدث خطأ في التبسيط', 'error');
            this.hideLoading();
        }
    }

    addToHistory(query, result) {
        this.searchHistory.unshift({
            query,
            result,
            timestamp: new Date().toISOString()
        });

        // الاحتفاظ بآخر 50 بحث فقط
        if (this.searchHistory.length > 50) {
            this.searchHistory = this.searchHistory.slice(0, 50);
        }

        this.saveSearchHistory();
    }

    saveSearchHistory() {
        saveToStorage('allable_search_history', this.searchHistory);
    }

    loadSearchHistory() {
        this.searchHistory = getFromStorage('allable_search_history', []);
    }

    async simulateAIResponse(query) {
        // محاكاة تأخير "التفكير"
        await new Promise(resolve => setTimeout(resolve, 1500));

        const lowerQuery = query.toLowerCase();

        // 1. تحليل النية (سؤال، مشاعر، معلومة)
        if (lowerQuery.includes('كيف') || lowerQuery.includes('طريقة')) {
            return `سؤال ممتاز! لتعلم كيفية "${query.replace('كيف', '').replace('طريقة', '').trim()}"، أنصحك بالبدء بخطوات بسيطة. يمكنك البحث عن فيديو تعليمي في قسم "التعليم" أو سؤال أحد المعلمين.`;
        }

        if (lowerQuery.includes('لماذا') || lowerQuery.includes('ليش') || lowerQuery.includes('ليه')) {
            return `هذا سؤال ذكي! السبب وراء "${query.replace('لماذا', '').replace('ليش', '').replace('ليه', '').trim()}" قد يكون معقداً، لكن باختصار: كل شيء له سبب ونتيجة. حاول التفكير في الفوائد أو الأضرار المحتملة.`;
        }

        if (lowerQuery.includes('متى')) {
            return `الوقت مهم جداً! "${query}" يعتمد على الجدول الزمني. حاول تنظيم وقتك دائماً.`;
        }

        if (lowerQuery.includes('اين') || lowerQuery.includes('فين')) {
            return `المكان يعتمد على السياق. هل تقصد مكاناً قريباً أم بعيداً؟ يمكنك استخدام الخرائط للمساعدة.`;
        }

        // 2. تحليل الكلمات المفتاحية الذكي
        const keywords = {
            'دراسة': 'الدراسة هي مفتاح النجاح.',
            'مذاكرة': 'نظم وقتك وخذ استراحات قصيرة.',
            'لعب': 'اللعب مفيد للصحة وممتع.',
            'رياضة': 'الرياضة تقوي الجسم والعقل.',
            'صديق': 'الصديق الوفي هو كنز.',
            'عائلة': 'العائلة هي أهم شيء في الحياة.',
            'مدرسة': 'المدرسة مكان لتعلم أشياء جديدة وتكوين صداقات.',
            'كرة': 'الكرة هي أداة للعب والرياضة.',
            'رسم': 'الرسم طريقة جميلة للتعبير عن النفس.',
            'موسيقى': 'الموسيقى غذاء الروح.'
        };

        for (const key in keywords) {
            if (lowerQuery.includes(key)) return `معلومة ذكية: ${keywords[key]} شكراً لبحثك عن هذا الموضوع المهم!`;
        }

        // 3. رد عام ذكي
        const responses = [
            `موضوع "${query}" مثير للاهتمام! للأسف ليس لدي معلومات كافية عنه الآن، لكن يمكنك سؤال والديك أو المعلم عنه.`,
            `بحث رائع! "${query}" كلمة مهمة. حاول البحث عنها في الكتب أو الإنترنت لمعرفة المزيد.`,
            `أحسنت! الفضول هو بداية المعرفة. "${query}" قد يكون لها معاني كثيرة حسب سياق الكلام.`
        ];

        return responses[Math.floor(Math.random() * responses.length)];
    }
}

// إنشاء نسخة عامة
const smartSearch = new SmartSearch();

// تصدير
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SmartSearch, smartSearch };
}
