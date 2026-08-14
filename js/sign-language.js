// ========================================
// All-Able - Sign Language System
// نظام لغة الإشارة المطور
// ========================================

class SignLanguageManager {
    constructor() {
        this.currentText = '';
        this.currentWord = 0;
        this.words = [];
        this.isPlaying = false;
        this.speed = 1;
        this.size = 100;
        this.languageType = 'arabic';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadSettings();
        this.checkUrlForText();
    }

    /**
     * التحقق من وجود نصوص في الرابط
     */
    checkUrlForText() {
        const urlParams = new URLSearchParams(window.location.search);
        const text = urlParams.get('text');

        if (text) {
            console.log('Found text in URL:', text);
            if (document.readyState === 'complete') {
                this.setTextAndConvert(text);
            } else {
                window.addEventListener('load', () => {
                    this.setTextAndConvert(text);
                });
            }
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }

    /**
     * إعداد مستمعي الأحداث
     */
    setupEventListeners() {
        // زر التحويل
        const convertBtn = document.getElementById('convert-to-sign');
        if (convertBtn) {
            convertBtn.onclick = () => this.convertToSign();
        }

        // دعم مفتاح Enter
        const textInput = document.getElementById('sign-text-input');
        if (textInput) {
            textInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.convertToSign();
                }
            });
        }

        // زر الإدخال الصوتي
        const voiceBtn = document.getElementById('voice-input-btn');
        if (voiceBtn) {
            voiceBtn.onclick = () => this.startVoiceInput();
        }

        // زر المسح
        const clearBtn = document.getElementById('clear-text-btn');
        if (clearBtn) {
            clearBtn.onclick = () => this.clearText();
        }

        // إعدادات السرعة
        const speedSlider = document.getElementById('sign-speed');
        if (speedSlider) {
            speedSlider.addEventListener('input', (e) => {
                this.speed = parseFloat(e.target.value);
                const valDisplay = document.getElementById('speed-value');
                if (valDisplay) valDisplay.textContent = `${this.speed}x`;
            });
        }

        // إعدادات الحجم
        const sizeSlider = document.getElementById('sign-size');
        if (sizeSlider) {
            sizeSlider.addEventListener('input', (e) => {
                this.size = parseInt(e.target.value);
                const valDisplay = document.getElementById('size-value');
                if (valDisplay) valDisplay.textContent = `${this.size}%`;

                // تحديث الحجم فوراً إذا كان هناك عنصر معروض
                const avatar = document.querySelector('.sign-avatar');
                if (avatar) {
                    avatar.style.width = `${this.size * 2.8}px`;
                    avatar.style.height = `${this.size * 2.8}px`;
                }
            });
        }

        // نوع لغة الإشارة
        const languageSelect = document.getElementById('sign-language-type');
        if (languageSelect) {
            languageSelect.addEventListener('change', (e) => {
                this.languageType = e.target.value;
            });
        }

        // أزرار الجمل الشائعة
        const phraseButtons = document.querySelectorAll('.phrase-btn');
        phraseButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const phrase = e.currentTarget.getAttribute('data-phrase');
                this.setTextAndConvert(phrase);
            });
        });
    }

    loadSettings() {
        const settings = getFromStorage('allable_sign_settings', {});
        if (settings.speed) this.speed = settings.speed;
        if (settings.size) this.size = settings.size;
        if (settings.languageType) this.languageType = settings.languageType;
    }

    saveSettings() {
        saveToStorage('allable_sign_settings', {
            speed: this.speed,
            size: this.size,
            languageType: this.languageType
        });
    }

    /**
     * توحيد النص (إزالة الهمزات والتشكيل)
     */
    normalizeText(text) {
        if (!text) return '';
        return text.replace(/[أإآ]/g, 'ا')
            .replace('ة', 'ه')
            .replace(/[ًٌٍَُِّْ]/g, '') // إزالة التشكيل
            .replace(/[.,!؟]/g, '')
            .trim();
    }

    /**
     * الحصول على إيموجي/صورة معبرة للكلمة
     */
// Retrieve sign emoji for a word
    getSignForWord(word) {
        const cleanWord = this.normalizeText(word);

        // Expanded dictionary
        const map = {
            'مرحبا': '👋', 'سلام': '👋', 'اهلا': '👋', 'هاي': '👋',
            'حب': '❤️', 'احب': '❤️', 'قلب': '❤️', 'عشق': '😍',
            'سعيد': '😄', 'فرح': '😄', 'مبسوط': '😄',
            'حزين': '😢', 'بكي': '😭', 'زعلان': '😔',
            'غاضب': '😡', 'عصب': '😡',
            'خائف': '😱', 'خوف': '😱',
            'نعم': '👍', 'موافق': '👍', 'اكيد': '👌', 'اوكي': '👌',
            'لا': '👎', 'كلا': '👎', 'رفض': '🙅',
            'شكرا': '🙏', 'اشكرك': '🙏', 'يسلمو': '🙏',
            'يا': '👋',
            'انا': '🙋‍♂️',
            'انت': '👉',
            'هو': '👈',
            'هي': '👈',
            'نحن': '👥',
            'هم': '👥',
            'بيت': '🏠', 'منزل': '🏠',
            'سيارة': '🚗', 'عربية': '🚗',
            'اكل': '🍽️', 'طعام': '🍽️', 'جوع': '🤤',
            'شرب': '🥤', 'ماء': '💧', 'عطش': '🥵',
            'نوم': '😴', 'نعس': '🥱',
            'مساعدة': '🆘', 'ساعدني': '🤲',
            'طوارئ': '🚨', 'خطر': '⚠️',
            'كيف': '❓', 'شلون': '❓',
            'متى': '⏰', 'زمن': '⏳',
            'اين': '📍', 'فين': '📍',
            'لماذا': '🤔', 'ليش': '🤔',
            'بخير': '👍', 'تمام': '👍', 'كويس': '👍',
            'اسم': '📛',
            'الله': '☝️',
            'صديق': '🤝',
            'لعب': '⚽',
            'دراسة': '📚', 'مدرسة': '🏫'
        };

        // Find matching emoji
        for (const key in map) {
            if (cleanWord.includes(key) || key.includes(cleanWord)) return map[key];
        }
        return '🤟'; // default
    }

    // Highlight keywords for subtitle text
    applyKeywordHighlights(txt) {
        return txt
            .replace(/التنمر/g, '<span style="color:#ef4444;font-weight:800;border-bottom:2px solid #ef4444;">التنمر ❌</span>')
            .replace(/\bلا\b/g, '<span style="color:#f97316;font-weight:800;border-bottom:2px solid #f97316;">لا 🛑</span>')
            .replace(/آمن(?:ة)?/g, '<span style="color:#10b981;font-weight:800;border-bottom:2px solid #10b981;">آمن 🛡️</span>')
            .replace(/خطر(?:اً|ة)?/g, '<span style="color:#ef4444;font-weight:800;border-bottom:2px solid #ef4444;">خطر ⚠️</span>');
    }

    async convertToSign() {
        const textInput = document.getElementById('sign-text-input');
        if (!textInput) return;

        const text = textInput.value.trim();
        if (!text) {
            showNotification('الرجاء إدخال نص', 'warning');
            return;
        }

        this.currentText = text;
        this.words = text.split(/\s+/);
        this.currentWord = 0;

        showNotification('جاري الترجمة...', 'info');
        this.displaySignLanguage();
    }

    displaySignLanguage() {
        const displaySection = document.getElementById('sign-display');
        if (!displaySection) return;

        if (this.words.length === 0) {
            displaySection.innerHTML = `
                <div class="sign-placeholder">
                  <i class="fas fa-hands" style="font-size: 5rem; color: var(--text-muted);"></i>
                  <p>سيتم عرض لغة الإشارة هنا</p>
                </div>`;
            return;
        }

        this.isPlaying = true;
        // Prepare subtitle translation with highlights
        const subtitleBoxHTML = `
            <div class="subtitle-box" id="sign-subtitle-box" style="background:#1e293b;border-radius:12px;padding:20px;margin-top:20px;box-shadow:0 4px 12px rgba(0,0,0,0.3);">
                <h4 style="color:#94a3b8;margin:0 0 10px 0; font-size:1rem;">الترجمة النصية بلغة الإشارة:</h4>
                <p id="sign-subtitle-text" style="color:#f8fafc;font-size:1.25rem;line-height:1.9;margin:0;">
                    ${this.applyKeywordHighlights(this.currentText)}
                </p>
            </div>`;
        this.playNextWord();
        // Append subtitle after avatar will be added in playNextWord via innerHTML replacement

    }

    async playNextWord() {
        if (!this.isPlaying || this.currentWord >= this.words.length) {
            this.isPlaying = false;
            // showNotification('انتهى العرض', 'success');

            // إعادة زر التشغيل أو حالة الانتظار
            const displaySection = document.getElementById('sign-display');
            if (displaySection) {
                displaySection.innerHTML += `<div style="margin-top:20px; color:var(--primary-color); font-weight:bold;">انتهت الجملة ✅</div>`;
            }
            return;
        }

        const word = this.words[this.currentWord];
        const signEmoji = this.getSignForWord(word);
        const displaySection = document.getElementById('sign-display');

        if (displaySection) {
            displaySection.innerHTML = `
                <div class="sign-animation">
                  <div class="sign-avatar" style="width: ${this.size * 2.8}px; height: ${this.size * 2.8}px;">
                    <div class="sign-avatar-content">${signEmoji}</div>
                  </div>
                  <div class="sign-word">${word}</div>
                  <div class="sign-progress">
                    <span>${this.currentWord + 1} / ${this.words.length}</span>
                  </div>
                </div>
                <div class="subtitle-box" style="background:#1e293b;border-radius:12px;padding:15px;margin-top:15px;">
                  <h4 style="color:#94a3b8;margin:0 0 5px 0;">الترجمة النصية بلغة الإشارة:</h4>
                  <p style="color:#f8fafc;font-size:1.2rem;line-height:1.8;margin:0;">${this.applyKeywordHighlights(this.currentText)}</p>
                </div>
            `;
        }

        // قراءة صوتية للمكفوفين
        if (typeof accessibilityManager !== 'undefined' &&
            (accessibilityManager.currentDisabilityType === 'visual' || accessibilityManager.currentDisabilityType === 'learning')) {
            speak(word);
        }

        this.currentWord++;
        const delay = (1000 / this.speed);
        setTimeout(() => this.playNextWord(), delay);
    }

    startVoiceInput() {
        const textInput = document.getElementById('sign-text-input');
        if (!textInput) return;

        showNotification('تحدث الآن...', 'info');

        if (typeof startVoiceRecognition === 'function') {
            startVoiceRecognition((transcript) => {
                textInput.value = transcript;
                showNotification('تم التعرف: ' + transcript, 'success');
                setTimeout(() => this.convertToSign(), 1000); // تحويل تلقائي بعد ثانية
            });
        } else {
            showNotification('التعرف الصوتي غير مدعوم في هذا المتصفح', 'error');
        }
    }

    clearText() {
        const textInput = document.getElementById('sign-text-input');
        if (textInput) textInput.value = '';

        this.isPlaying = false;
        this.currentWord = 0;
        this.words = [];

        const displaySection = document.getElementById('sign-display');
        if (displaySection) {
            displaySection.innerHTML = `
                <div class="sign-placeholder">
                  <i class="fas fa-hands" style="font-size: 5rem; color: var(--text-muted);"></i>
                  <p>سيتم عرض لغة الإشارة هنا</p>
                </div>`;
        }
        showNotification('تم المسح', 'info');
    }

    setTextAndConvert(text) {
        const textInput = document.getElementById('sign-text-input');
        if (textInput) {
            textInput.value = text;
        }
        this.convertToSign();
    }

    stopPlaying() {
        this.isPlaying = false;
    }
}

// إنشاء نسخة عامة والربط بالنافذة
window.signLanguageManager = new SignLanguageManager();

// تصدير
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SignLanguageManager, signLanguageManager: window.signLanguageManager };
}
