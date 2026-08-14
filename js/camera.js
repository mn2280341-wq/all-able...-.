// ========================================
// All-Able - Smart Camera System
// نظام الكاميرا الذكية
// ========================================

class SmartCameraManager {
    constructor() {
        this.currentMode = 'text';
        this.stream = null;
        this.scanHistory = [];
        this.init();
    }

    async init() {
        this.setupEventListeners();
        this.loadHistory();
        await this.startCamera();
    }

    /**
     * إعداد مستمعي الأحداث
     */
    setupEventListeners() {
        // أزرار الأوضاع
        const modeButtons = document.querySelectorAll('.mode-btn');
        modeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const mode = e.currentTarget.getAttribute('data-mode');
                this.switchMode(mode);

                modeButtons.forEach(b => b.classList.remove('active'));
                e.currentTarget.classList.add('active');
            });
        });

        // زر الالتقاط
        const captureBtn = document.getElementById('capture-btn');
        if (captureBtn) {
            captureBtn.addEventListener('click', () => this.captureAndAnalyze());
        }

        // زر قراءة النتائج
        const readBtn = document.getElementById('read-results');
        if (readBtn) {
            readBtn.addEventListener('click', () => this.readResults());
        }

        // زر نسخ النتائج
        const copyBtn = document.getElementById('copy-results');
        if (copyBtn) {
            copyBtn.addEventListener('click', () => this.copyResults());
        }

        // زر مسح جديد
        const newScanBtn = document.getElementById('new-scan');
        if (newScanBtn) {
            newScanBtn.addEventListener('click', () => this.newScan());
        }
    }

    /**
     * بدء الكاميرا
     */
    async startCamera() {
        try {
            const video = document.getElementById('camera-video');
            if (!video) return;

            this.stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'environment',
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            });

            video.srcObject = this.stream;
            showNotification('تم تشغيل الكاميرا', 'success');
        } catch (error) {
            console.error('Camera error:', error);
            showNotification('فشل في تشغيل الكاميرا', 'error');
        }
    }

    /**
     * تبديل الوضع
     */
    switchMode(mode) {
        this.currentMode = mode;

        const modeNames = {
            text: 'قراءة نص',
            object: 'تعرف على أشياء',
            medicine: 'أدوية',
            sign: 'لافتات'
        };

        showNotification(`تم التبديل إلى وضع: ${modeNames[mode]}`, 'info');
    }

    /**
     * التقاط وتحليل
     */
    async captureAndAnalyze() {
        const video = document.getElementById('camera-video');
        const canvas = document.getElementById('camera-canvas');

        if (!video || !canvas) return;

        // التقاط الصورة
        const context = canvas.getContext('2d');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);

        showNotification('جاري التحليل...', 'info');

        // تحليل الصورة بناءً على الوضع
        let result;
        switch (this.currentMode) {
            case 'text':
                result = await this.analyzeText(canvas);
                break;
            case 'object':
                result = await this.analyzeObject(canvas);
                break;
            case 'medicine':
                result = await this.analyzeMedicine(canvas);
                break;
            case 'sign':
                result = await this.analyzeSign(canvas);
                break;
        }

        this.displayResults(result);
        this.addToHistory(result);
    }

    /**
     * تحليل النص (OCR)
     */
    async analyzeText(canvas) {
        // محاكاة OCR - في التطبيق الحقيقي، استخدم Google Vision API أو Tesseract.js
        await this.delay(1500);

        const demoTexts = [
            'مرحباً بك في All-Able',
            'هذا نص تجريبي من الكاميرا',
            'يمكنك قراءة أي نص من خلال الكاميرا',
            'التطبيق يدعم اللغة العربية والإنجليزية'
        ];

        return {
            type: 'text',
            content: demoTexts[Math.floor(Math.random() * demoTexts.length)],
            confidence: 0.95,
            timestamp: new Date().toISOString()
        };
    }

    /**
     * تحليل الأشياء
     */
    async analyzeObject(canvas) {
        await this.delay(1500);

        const demoObjects = [
            { name: 'كتاب', description: 'كتاب ورقي' },
            { name: 'كوب', description: 'كوب للشرب' },
            { name: 'قلم', description: 'قلم للكتابة' },
            { name: 'هاتف', description: 'هاتف محمول' },
            { name: 'مفاتيح', description: 'مفاتيح المنزل' }
        ];

        const obj = demoObjects[Math.floor(Math.random() * demoObjects.length)];

        return {
            type: 'object',
            content: `تم التعرف على: ${obj.name}\nالوصف: ${obj.description}`,
            confidence: 0.88,
            timestamp: new Date().toISOString()
        };
    }

    /**
     * تحليل الأدوية
     */
    async analyzeMedicine(canvas) {
        await this.delay(1500);

        const demoMedicines = [
            { name: 'باراسيتامول', usage: 'مسكن للألم وخافض للحرارة', dosage: 'حبة كل 6 ساعات' },
            { name: 'إيبوبروفين', usage: 'مضاد للالتهاب ومسكن', dosage: 'حبة كل 8 ساعات' },
            { name: 'أموكسيسيلين', usage: 'مضاد حيوي', dosage: 'حسب وصفة الطبيب' }
        ];

        const med = demoMedicines[Math.floor(Math.random() * demoMedicines.length)];

        return {
            type: 'medicine',
            content: `الدواء: ${med.name}\nالاستخدام: ${med.usage}\nالجرعة: ${med.dosage}\n\n⚠️ تحذير: استشر الطبيب قبل تناول أي دواء`,
            confidence: 0.92,
            timestamp: new Date().toISOString()
        };
    }

    /**
     * تحليل اللافتات
     */
    async analyzeSign(canvas) {
        await this.delay(1500);

        const demoSigns = [
            'مخرج طوارئ',
            'ممنوع التدخين',
            'مصعد',
            'حمام',
            'مدخل'
        ];

        return {
            type: 'sign',
            content: `اللافتة: ${demoSigns[Math.floor(Math.random() * demoSigns.length)]}`,
            confidence: 0.90,
            timestamp: new Date().toISOString()
        };
    }

    /**
     * عرض النتائج
     */
    displayResults(result) {
        const resultsSection = document.getElementById('results-section');
        const resultsContent = document.getElementById('results-content');

        if (!resultsSection || !resultsContent) return;

        resultsSection.style.display = 'block';
        resultsContent.textContent = result.content;

        // قراءة تلقائية للمستخدمين ذوي الإعاقة البصرية
        if (accessibilityManager.currentDisabilityType === 'visual') {
            speak(result.content);
        }

        showNotification('تم التحليل بنجاح', 'success');
    }

    /**
     * قراءة النتائج
     */
    readResults() {
        const resultsContent = document.getElementById('results-content');
        if (resultsContent) {
            speak(resultsContent.textContent);
        }
    }

    /**
     * نسخ النتائج
     */
    copyResults() {
        const resultsContent = document.getElementById('results-content');
        if (resultsContent) {
            copyToClipboard(resultsContent.textContent);
            showNotification('تم نسخ النتائج', 'success');
        }
    }

    /**
     * مسح جديد
     */
    newScan() {
        const resultsSection = document.getElementById('results-section');
        if (resultsSection) {
            resultsSection.style.display = 'none';
        }
    }

    /**
     * إضافة للسجل
     */
    addToHistory(result) {
        this.scanHistory.unshift({
            id: Date.now(),
            ...result
        });

        // الاحتفاظ بآخر 20 عنصر فقط
        if (this.scanHistory.length > 20) {
            this.scanHistory = this.scanHistory.slice(0, 20);
        }

        this.saveHistory();
        this.renderHistory();
    }

    /**
     * حفظ السجل
     */
    saveHistory() {
        saveToStorage('allable_scan_history', this.scanHistory);
    }

    /**
     * تحميل السجل
     */
    loadHistory() {
        this.scanHistory = getFromStorage('allable_scan_history', []);
        this.renderHistory();
    }

    /**
     * عرض السجل
     */
    renderHistory() {
        const historyList = document.getElementById('scan-history');
        if (!historyList) return;

        if (this.scanHistory.length === 0) {
            historyList.innerHTML = '<p class="no-history">لا يوجد سجل</p>';
            return;
        }

        const icons = {
            text: 'fa-file-alt',
            object: 'fa-cube',
            medicine: 'fa-pills',
            sign: 'fa-sign'
        };

        historyList.innerHTML = this.scanHistory.map(item => `
      <div class="history-item">
        <div class="history-icon">
          <i class="fas ${icons[item.type]}"></i>
        </div>
        <div class="history-content">
          <div class="history-text">${item.content.substring(0, 100)}${item.content.length > 100 ? '...' : ''}</div>
          <div class="history-time">${timeAgo(item.timestamp)}</div>
        </div>
        <button class="icon-btn" onclick="speak('${item.content.replace(/'/g, "\\'")}')">
          <i class="fas fa-volume-up"></i>
        </button>
      </div>
    `).join('');
    }

    /**
     * تأخير
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * إيقاف الكاميرا
     */
    stopCamera() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
        }
    }
}

// إنشاء نسخة عامة
const smartCameraManager = new SmartCameraManager();

// إيقاف الكاميرا عند مغادرة الصفحة
window.addEventListener('beforeunload', () => {
    smartCameraManager.stopCamera();
});

// تصدير
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SmartCameraManager, smartCameraManager };
}
