// ========================================
// AllAble - Relaxation & Calming Exercises
// تمارين الاسترخاء والتهدئة
// ========================================

class RelaxationManager {
    constructor() {
        this.exercises = [];
        this.currentExercise = null;
        this.isPlaying = false;
        this.audioContext = null;

        this.init();
    }

    /**
     * تهيئة نظام التمارين
     */
    init() {
        this.loadExercises();
    }

    /**
     * تحميل التمارين
     */
    loadExercises() {
        this.exercises = [
            {
                id: 'breathing-4-7-8',
                name: 'تمرين التنفس 4-7-8',
                description: 'تمرين بسيط للتنفس يساعد على الاسترخاء والنوم',
                duration: 300, // 5 دقائق
                type: 'breathing',
                steps: [
                    { action: 'inhale', duration: 4, text: 'استنشق من أنفك' },
                    { action: 'hold', duration: 7, text: 'احبس أنفاسك' },
                    { action: 'exhale', duration: 8, text: 'أخرج الهواء من فمك' }
                ]
            },
            {
                id: 'progressive-relaxation',
                name: 'الاسترخاء التدريجي',
                description: 'شد وإرخاء العضلات بالتدريج',
                duration: 600, // 10 دقائق
                type: 'muscle',
                steps: [
                    { muscle: 'feet', text: 'شد عضلات القدمين... ثم أرخها' },
                    { muscle: 'legs', text: 'شد عضلات الساقين... ثم أرخها' },
                    { muscle: 'stomach', text: 'شد عضلات البطن... ثم أرخها' },
                    { muscle: 'hands', text: 'شد عضلات اليدين... ثم أرخها' },
                    { muscle: 'shoulders', text: 'شد عضلات الكتفين... ثم أرخها' },
                    { muscle: 'face', text: 'شد عضلات الوجه... ثم أرخها' }
                ]
            },
            {
                id: 'mindfulness-5-senses',
                name: 'تمرين الحواس الخمس',
                description: 'التركيز على الحاضر باستخدام حواسك',
                duration: 300,
                type: 'mindfulness',
                steps: [
                    { sense: 'sight', text: 'انظر حولك... حدد 5 أشياء يمكنك رؤيتها' },
                    { sense: 'touch', text: 'لمس... حدد 4 أشياء يمكنك لمسها' },
                    { sense: 'hearing', text: 'استمع... حدد 3 أصوات يمكنك سماعها' },
                    { sense: 'smell', text: 'شم... حدد رائحتين يمكنك شمهما' },
                    { sense: 'taste', text: 'تذوق... حدد شيء واحد يمكنك تذوقه' }
                ]
            },
            {
                id: 'guided-imagery',
                name: 'التخيل الموجه',
                description: 'تخيل مكان هادئ ومريح',
                duration: 480,
                type: 'visualization',
                script: `
                    أغمض عينيك... تخيل نفسك في مكان هادئ وجميل...
                    ربما شاطئ هادئ... أو حديقة خضراء...
                    انظر حولك... ماذا ترى؟
                    استمع... ما الأصوات التي تسمعها؟
                    اشعر بالدفء... بالراحة... بالأمان...
                    خذ نفساً عميقاً... واسترخ...
                `
            },
            {
                id: 'body-scan',
                name: 'مسح الجسم',
                description: 'الانتباه لكل جزء من جسمك',
                duration: 600,
                type: 'body-scan',
                steps: [
                    { part: 'feet', text: 'ركز على قدميك... اشعر بهما' },
                    { part: 'legs', text: 'انتقل إلى ساقيك... لاحظ أي توتر' },
                    { part: 'hips', text: 'ركز على الوركين والحوض' },
                    { part: 'stomach', text: 'انتبه لبطنك... تنفس بعمق' },
                    { part: 'chest', text: 'اشعر بصدرك يرتفع وينخفض' },
                    { part: 'arms', text: 'لاحظ ذراعيك ويديك' },
                    { part: 'neck', text: 'ركز على رقبتك وكتفيك' },
                    { part: 'head', text: 'انتبه لرأسك ووجهك' }
                ]
            }
        ];
    }

    /**
     * بدء تمرين
     */
    async startExercise(exerciseId) {
        this.currentExercise = this.exercises.find(e => e.id === exerciseId);

        if (!this.currentExercise) {
            showNotification('التمرين غير موجود', 'error');
            return;
        }

        this.isPlaying = true;

        // إنشاء واجهة التمرين
        this.createExerciseUI();

        // بدء التمرين حسب النوع
        switch (this.currentExercise.type) {
            case 'breathing':
                await this.runBreathingExercise();
                break;
            case 'muscle':
                await this.runMuscleRelaxation();
                break;
            case 'mindfulness':
                await this.runMindfulnessExercise();
                break;
            case 'visualization':
                await this.runVisualization();
                break;
            case 'body-scan':
                await this.runBodyScan();
                break;
        }
    }

    /**
     * إنشاء واجهة التمرين
     */
    createExerciseUI() {
        const overlay = document.createElement('div');
        overlay.id = 'relaxation-overlay';
        overlay.className = 'relaxation-overlay';

        overlay.innerHTML = `
            <div class="relaxation-container">
                <button class="close-btn" onclick="relaxationManager.stopExercise()">
                    <i class="fas fa-times"></i>
                </button>
                
                <h2>${this.currentExercise.name}</h2>
                <p class="exercise-description">${this.currentExercise.description}</p>
                
                <div class="exercise-visual" id="exercise-visual">
                    <!-- سيتم ملؤها ديناميكياً -->
                </div>
                
                <div class="exercise-instruction" id="exercise-instruction">
                    <!-- التعليمات الحالية -->
                </div>
                
                <div class="exercise-progress">
                    <div class="progress-bar" id="exercise-progress-bar"></div>
                </div>
                
                <div class="exercise-controls">
                    <button class="control-btn" onclick="relaxationManager.pauseExercise()">
                        <i class="fas fa-pause"></i>
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        // تأثير الظهور
        setTimeout(() => overlay.classList.add('active'), 10);
    }

    /**
     * تشغيل تمرين التنفس
     */
    async runBreathingExercise() {
        const visual = document.getElementById('exercise-visual');
        const instruction = document.getElementById('exercise-instruction');

        // إنشاء دائرة التنفس
        visual.innerHTML = '<div class="breathing-circle"></div>';
        const circle = visual.querySelector('.breathing-circle');

        const cycles = Math.floor(this.currentExercise.duration / 19); // كل دورة 19 ثانية

        for (let i = 0; i < cycles && this.isPlaying; i++) {
            for (const step of this.currentExercise.steps) {
                if (!this.isPlaying) break;

                instruction.textContent = step.text;
                speak(step.text);

                // تحريك الدائرة
                if (step.action === 'inhale') {
                    circle.style.transform = 'scale(1.5)';
                } else if (step.action === 'exhale') {
                    circle.style.transform = 'scale(1)';
                }

                await this.wait(step.duration * 1000);
            }
        }

        this.completeExercise();
    }

    /**
     * تشغيل الاسترخاء التدريجي
     */
    async runMuscleRelaxation() {
        const instruction = document.getElementById('exercise-instruction');
        const visual = document.getElementById('exercise-visual');

        // إنشاء رسم الجسم
        visual.innerHTML = '<div class="body-diagram"></div>';

        for (const step of this.currentExercise.steps) {
            if (!this.isPlaying) break;

            instruction.textContent = step.text;
            speak(step.text);

            // تمييز العضلة الحالية
            visual.querySelector('.body-diagram').setAttribute('data-muscle', step.muscle);

            await this.wait(10000); // 10 ثوان لكل عضلة
        }

        this.completeExercise();
    }

    /**
     * تشغيل تمرين الحواس
     */
    async runMindfulnessExercise() {
        const instruction = document.getElementById('exercise-instruction');
        const visual = document.getElementById('exercise-visual');

        for (const step of this.currentExercise.steps) {
            if (!this.isPlaying) break;

            instruction.textContent = step.text;
            speak(step.text);

            // عرض أيقونة الحاسة
            visual.innerHTML = `<i class="fas fa-${this.getSenseIcon(step.sense)} sense-icon"></i>`;

            await this.wait(60000); // دقيقة لكل حاسة
        }

        this.completeExercise();
    }

    /**
     * تشغيل التخيل الموجه
     */
    async runVisualization() {
        const instruction = document.getElementById('exercise-instruction');
        const visual = document.getElementById('exercise-visual');

        // عرض صورة هادئة
        visual.innerHTML = '<div class="calm-scene"></div>';

        const script = this.currentExercise.script.trim().split('\n');

        for (const line of script) {
            if (!this.isPlaying) break;

            const text = line.trim();
            if (text) {
                instruction.textContent = text;
                speak(text);
                await this.wait(8000); // 8 ثوان لكل سطر
            }
        }

        this.completeExercise();
    }

    /**
     * تشغيل مسح الجسم
     */
    async runBodyScan() {
        const instruction = document.getElementById('exercise-instruction');
        const visual = document.getElementById('exercise-visual');

        visual.innerHTML = '<div class="body-scan-diagram"></div>';

        for (const step of this.currentExercise.steps) {
            if (!this.isPlaying) break;

            instruction.textContent = step.text;
            speak(step.text);

            // تمييز الجزء الحالي
            visual.querySelector('.body-scan-diagram').setAttribute('data-part', step.part);

            await this.wait(45000); // 45 ثانية لكل جزء
        }

        this.completeExercise();
    }

    /**
     * إيقاف التمرين مؤقتاً
     */
    pauseExercise() {
        this.isPlaying = false;
        showNotification('تم إيقاف التمرين مؤقتاً', 'info');
    }

    /**
     * إيقاف التمرين
     */
    stopExercise() {
        this.isPlaying = false;
        const overlay = document.getElementById('relaxation-overlay');
        if (overlay) {
            overlay.classList.remove('active');
            setTimeout(() => overlay.remove(), 300);
        }
    }

    /**
     * إكمال التمرين
     */
    completeExercise() {
        if (this.isPlaying) {
            speak('أحسنت! لقد أكملت التمرين');
            showNotification('تم إكمال التمرين بنجاح! 🎉', 'success');

            setTimeout(() => {
                this.stopExercise();
            }, 3000);
        }
    }

    /**
     * انتظار
     */
    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * الحصول على أيقونة الحاسة
     */
    getSenseIcon(sense) {
        const icons = {
            sight: 'eye',
            touch: 'hand-paper',
            hearing: 'ear',
            smell: 'wind',
            taste: 'utensils'
        };
        return icons[sense] || 'circle';
    }

    /**
     * الحصول على قائمة التمارين
     */
    getExercises() {
        return this.exercises;
    }
}

// إنشاء نسخة عامة
const relaxationManager = new RelaxationManager();

// التصدير
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { RelaxationManager, relaxationManager };
}
