// ========================================
// All-Able - AAC (Augmentative and Alternative Communication)
// نظام التواصل البديل
// ========================================

class AACManager {
    constructor() {
        this.currentBoard = 'basic';
        this.currentSentence = [];
        this.savedSentences = [];
        this.boards = this.initializeBoards();
        this.init();
    }

    init() {
        this.loadSavedSentences();
        this.setupEventListeners();
        this.renderBoard();
    }

    /**
     * تهيئة لوحات الرموز
     */
    initializeBoards() {
        return {
            basic: [
                { icon: '👋', text: 'مرحبا', color: '#667eea' },
                { icon: '🙏', text: 'شكراً', color: '#43e97b' },
                { icon: '👍', text: 'نعم', color: '#4facfe' },
                { icon: '👎', text: 'لا', color: '#f093fb' },
                { icon: '❓', text: 'لماذا', color: '#fa709a' },
                { icon: '❔', text: 'كيف', color: '#fee140' },
                { icon: '⏰', text: 'متى', color: '#667eea' },
                { icon: '📍', text: 'أين', color: '#43e97b' },
                { icon: '🆘', text: 'مساعدة', color: '#ff6b6b' },
                { icon: '✅', text: 'حسناً', color: '#10b981' },
                { icon: '💬', text: 'أريد أن أقول', color: '#6366f1' },
                { icon: '🔊', text: 'اسمع', color: '#ec4899' }
            ],
            feelings: [
                { icon: '😊', text: 'سعيد', color: '#43e97b' },
                { icon: '😢', text: 'حزين', color: '#4facfe' },
                { icon: '😡', text: 'غاضب', color: '#ff6b6b' },
                { icon: '😰', text: 'خائف', color: '#f093fb' },
                { icon: '😴', text: 'متعب', color: '#667eea' },
                { icon: '🤒', text: 'مريض', color: '#fa709a' },
                { icon: '😕', text: 'محتار', color: '#fee140' },
                { icon: '🥰', text: 'أحب', color: '#ec4899' },
                { icon: '😤', text: 'منزعج', color: '#ff6b6b' },
                { icon: '😌', text: 'مرتاح', color: '#10b981' },
                { icon: '😔', text: 'مكتئب', color: '#4facfe' },
                { icon: '🤗', text: 'أريد عناق', color: '#f093fb' }
            ],
            needs: [
                { icon: '🚽', text: 'حمام', color: '#4facfe' },
                { icon: '🍽️', text: 'جائع', color: '#fa709a' },
                { icon: '💧', text: 'عطشان', color: '#43e97b' },
                { icon: '😴', text: 'نعسان', color: '#667eea' },
                { icon: '🤕', text: 'ألم', color: '#ff6b6b' },
                { icon: '🌡️', text: 'حرارة', color: '#f093fb' },
                { icon: '🛏️', text: 'راحة', color: '#10b981' },
                { icon: '🚿', text: 'استحمام', color: '#4facfe' },
                { icon: '👕', text: 'ملابس', color: '#fee140' },
                { icon: '🏥', text: 'طبيب', color: '#ff6b6b' },
                { icon: '💊', text: 'دواء', color: '#ec4899' },
                { icon: '🔇', text: 'هدوء', color: '#667eea' }
            ],
            food: [
                { icon: '🍞', text: 'خبز', color: '#fee140' },
                { icon: '🥛', text: 'حليب', color: '#f8f9fa' },
                { icon: '🍎', text: 'فاكهة', color: '#ff6b6b' },
                { icon: '🥗', text: 'خضار', color: '#43e97b' },
                { icon: '🍗', text: 'دجاج', color: '#fa709a' },
                { icon: '🍚', text: 'أرز', color: '#f8f9fa' },
                { icon: '🍕', text: 'بيتزا', color: '#ff6b6b' },
                { icon: '🍔', text: 'برجر', color: '#fa709a' },
                { icon: '🍰', text: 'حلوى', color: '#f093fb' },
                { icon: '🧃', text: 'عصير', color: '#43e97b' },
                { icon: '☕', text: 'شاي', color: '#667eea' },
                { icon: '🍫', text: 'شوكولاتة', color: '#4facfe' }
            ],
            activities: [
                { icon: '📺', text: 'تلفاز', color: '#667eea' },
                { icon: '🎮', text: 'ألعاب', color: '#f093fb' },
                { icon: '📱', text: 'هاتف', color: '#4facfe' },
                { icon: '📚', text: 'قراءة', color: '#43e97b' },
                { icon: '🎵', text: 'موسيقى', color: '#ec4899' },
                { icon: '🚶', text: 'مشي', color: '#10b981' },
                { icon: '🏃', text: 'رياضة', color: '#ff6b6b' },
                { icon: '🎨', text: 'رسم', color: '#fa709a' },
                { icon: '🧩', text: 'ألغاز', color: '#fee140' },
                { icon: '🛌', text: 'نوم', color: '#667eea' },
                { icon: '🚗', text: 'سيارة', color: '#4facfe' },
                { icon: '🏠', text: 'بيت', color: '#43e97b' }
            ]
        };
    }

    /**
     * إعداد مستمعي الأحداث
     */
    setupEventListeners() {
        // أزرار اللوحات
        const boardButtons = document.querySelectorAll('.board-btn');
        boardButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const board = e.currentTarget.getAttribute('data-board');
                this.switchBoard(board);

                boardButtons.forEach(b => b.classList.remove('active'));
                e.currentTarget.classList.add('active');
            });
        });

        // زر النطق
        const speakBtn = document.getElementById('speak-sentence');
        if (speakBtn) {
            speakBtn.addEventListener('click', () => this.speakSentence());
        }

        // زر المسح
        const clearBtn = document.getElementById('clear-sentence');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearSentence());
        }

        // زر الحفظ
        const saveBtn = document.getElementById('save-sentence');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveSentence());
        }
    }

    /**
     * تبديل اللوحة
     */
    switchBoard(board) {
        this.currentBoard = board;
        this.renderBoard();
    }

    /**
     * عرض اللوحة
     */
    renderBoard() {
        const boardElement = document.getElementById('symbols-board');
        if (!boardElement) return;

        const symbols = this.boards[this.currentBoard];

        boardElement.innerHTML = symbols.map(symbol => `
      <div class="symbol-card" onclick="aacManager.addSymbol('${symbol.text}')" style="border-color: ${symbol.color}">
        <div class="symbol-icon">${symbol.icon}</div>
        <div class="symbol-text">${symbol.text}</div>
      </div>
    `).join('');
    }

    /**
     * إضافة رمز للجملة
     */
    addSymbol(text) {
        this.currentSentence.push(text);
        this.updateSentenceDisplay();

        // قراءة الكلمة للمستخدمين ذوي الإعاقة البصرية
        if (accessibilityManager.currentDisabilityType === 'visual') {
            speak(text);
        }
    }

    /**
     * تحديث عرض الجملة
     */
    updateSentenceDisplay() {
        const sentenceText = document.getElementById('sentence-text');
        if (!sentenceText) return;

        if (this.currentSentence.length === 0) {
            sentenceText.textContent = 'اضغط على الرموز لتكوين جملة...';
            sentenceText.style.color = 'var(--text-muted)';
        } else {
            sentenceText.textContent = this.currentSentence.join(' ');
            sentenceText.style.color = 'var(--text-primary)';
        }
    }

    /**
     * نطق الجملة
     */
    speakSentence() {
        if (this.currentSentence.length === 0) {
            showNotification('الجملة فارغة', 'warning');
            return;
        }

        const sentence = this.currentSentence.join(' ');
        speak(sentence);
        showNotification('جاري نطق الجملة...', 'info');
    }

    /**
     * مسح الجملة
     */
    clearSentence() {
        this.currentSentence = [];
        this.updateSentenceDisplay();
        showNotification('تم مسح الجملة', 'info');
    }

    /**
     * حفظ الجملة
     */
    saveSentence() {
        if (this.currentSentence.length === 0) {
            showNotification('الجملة فارغة', 'warning');
            return;
        }

        const sentence = this.currentSentence.join(' ');
        this.savedSentences.unshift({
            id: Date.now(),
            text: sentence,
            timestamp: new Date().toISOString()
        });

        this.saveSavedSentences();
        this.renderSavedSentences();
        showNotification('تم حفظ الجملة', 'success');
    }

    /**
     * حفظ الجمل المحفوظة
     */
    saveSavedSentences() {
        saveToStorage('allable_saved_sentences', this.savedSentences);
    }

    /**
     * تحميل الجمل المحفوظة
     */
    loadSavedSentences() {
        this.savedSentences = getFromStorage('allable_saved_sentences', []);
        this.renderSavedSentences();
    }

    /**
     * عرض الجمل المحفوظة
     */
    renderSavedSentences() {
        const savedList = document.getElementById('saved-list');
        if (!savedList) return;

        if (this.savedSentences.length === 0) {
            savedList.innerHTML = '<p class="no-saved">لا توجد جمل محفوظة</p>';
            return;
        }

        savedList.innerHTML = this.savedSentences.map(item => `
      <div class="saved-item">
        <div class="saved-item-text">${item.text}</div>
        <div class="saved-item-actions">
          <button class="icon-btn" onclick="speak('${item.text.replace(/'/g, "\\'")}')">
            <i class="fas fa-volume-up"></i>
          </button>
          <button class="icon-btn" onclick="aacManager.useSavedSentence(${item.id})">
            <i class="fas fa-redo"></i>
          </button>
          <button class="icon-btn" onclick="aacManager.deleteSavedSentence(${item.id})">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    `).join('');
    }

    /**
     * استخدام جملة محفوظة
     */
    useSavedSentence(id) {
        const sentence = this.savedSentences.find(s => s.id === id);
        if (sentence) {
            this.currentSentence = sentence.text.split(' ');
            this.updateSentenceDisplay();
            showNotification('تم تحميل الجملة', 'success');
        }
    }

    /**
     * حذف جملة محفوظة
     */
    deleteSavedSentence(id) {
        this.savedSentences = this.savedSentences.filter(s => s.id !== id);
        this.saveSavedSentences();
        this.renderSavedSentences();
        showNotification('تم حذف الجملة', 'info');
    }
}

// إنشاء نسخة عامة
const aacManager = new AACManager();

// تصدير
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AACManager, aacManager };
}
