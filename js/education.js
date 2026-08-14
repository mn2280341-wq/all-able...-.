// ========================================
// All-Able - Education System
// نظام التعليم والتأهيل
// ========================================

class EducationManager {
    constructor() {
        this.currentCategory = 'all';
        this.currentLesson = null;
        this.currentStep = 0;
        this.userProgress = {
            completedLessons: [],
            totalTime: 0,
            achievements: []
        };
        this.lessons = this.initializeLessons();
        this.init();
    }

    init() {
        this.loadProgress();
        this.setupEventListeners();
        this.renderLessons();
        this.updateStats();
    }

    /**
     * تهيئة الدروس بما فيها الأقسام التعليمية الثلاثة الجديدة:
     * 1. مناهضة التنمر (Anti-Bullying)
     * 2. السلامة الشخصية / مكافحة التحرش (Personal Safety)
     * 3. الأمان الرقمي (Cyber Safety)
     */
    initializeLessons() {
        return [
            {
                id: 1,
                title: 'أساسيات لغة الإشارة',
                description: 'تعلم الحروف والكلمات الأساسية بلغة الإشارة',
                category: 'sign',
                icon: '🤟',
                duration: 15,
                difficulty: 'مبتدئ',
                steps: [
                    { type: 'text', content: 'مرحباً بك في درس أساسيات لغة الإشارة!' },
                    { type: 'text', content: 'سنتعلم اليوم الحروف الأساسية والكلمات الشائعة' },
                    { type: 'image', content: 'حرف أ', emoji: '👆' },
                    { type: 'image', content: 'حرف ب', emoji: '✌️' },
                    { type: 'quiz', question: 'ما هي إشارة حرف أ؟', answer: 'الإصبع الواحد' }
                ]
            },
            {
                id: 2,
                title: 'استخدام الحاسوب',
                description: 'تعلم كيفية استخدام الحاسوب والإنترنت بسهولة',
                category: 'tech',
                icon: '💻',
                duration: 20,
                difficulty: 'مبتدئ',
                steps: [
                    { type: 'text', content: 'سنتعلم كيفية استخدام الحاسوب خطوة بخطوة' },
                    { type: 'text', content: 'أولاً: كيفية تشغيل الحاسوب' },
                    { type: 'text', content: 'ثانياً: استخدام الماوس ولوحة المفاتيح' },
                    { type: 'text', content: 'ثالثاً: فتح البرامج والملفات' }
                ]
            },
            {
                id: 3,
                title: 'مهارات التواصل',
                description: 'طور مهارات التواصل الاجتماعي الفعال',
                category: 'social',
                icon: '💬',
                duration: 25,
                difficulty: 'متوسط',
                steps: [
                    { type: 'text', content: 'التواصل الفعال مهارة مهمة جداً' },
                    { type: 'text', content: 'كيف تبدأ محادثة؟' },
                    { type: 'text', content: 'كيف تستمع بفعالية؟' },
                    { type: 'text', content: 'كيف تعبر عن نفسك بوضوح؟' }
                ]
            },
            {
                id: 4,
                title: 'المهارات الحياتية اليومية',
                description: 'تعلم مهارات الحياة اليومية الأساسية',
                category: 'life',
                icon: '🏠',
                duration: 30,
                difficulty: 'مبتدئ',
                steps: [
                    { type: 'text', content: 'المهارات الحياتية تساعدك على الاستقلالية' },
                    { type: 'text', content: 'النظافة الشخصية' },
                    { type: 'text', content: 'إعداد الطعام البسيط' },
                    { type: 'text', content: 'ترتيب الغرفة' },
                    { type: 'text', content: 'إدارة الوقت' }
                ]
            },
            {
                id: 5,
                title: 'الأمان على الإنترنت',
                description: 'تعلم كيف تحمي نفسك على الإنترنت',
                category: 'tech',
                icon: '🔒',
                duration: 15,
                difficulty: 'مبتدئ',
                steps: [
                    { type: 'text', content: 'الأمان على الإنترنت مهم جداً' },
                    { type: 'text', content: 'لا تشارك معلوماتك الشخصية' },
                    { type: 'text', content: 'استخدم كلمات مرور قوية' },
                    { type: 'text', content: 'احذر من الرسائل المشبوهة' }
                ]
            },
            {
                id: 6,
                title: 'التعامل مع المشاعر',
                description: 'تعلم كيف تفهم وتدير مشاعرك',
                category: 'life',
                icon: '❤️',
                duration: 20,
                difficulty: 'متوسط',
                steps: [
                    { type: 'text', content: 'المشاعر جزء طبيعي من حياتنا' },
                    { type: 'text', content: 'كيف تتعرف على مشاعرك؟' },
                    { type: 'text', content: 'كيف تعبر عن مشاعرك بطريقة صحية؟' },
                    { type: 'text', content: 'كيف تتعامل مع المشاعر الصعبة؟' }
                ]
            },
            {
                id: 7,
                title: 'مناهضة التنمر (Anti-Bullying)',
                description: 'تعلم كيفية التصرف عند مواجهة التنمر وحماية نفسك والآخرين',
                category: 'life',
                icon: '🤝',
                duration: 15,
                difficulty: 'مبتدئ',
                steps: [
                    {
                        type: 'adaptive',
                        title: 'مفهوم التنمر وكيف نتعامل معه',
                        content: 'التنمر هو سلوك غير لطيف يقوم به شخص لإيذاء شخص آخر بالكلمات أو الأفعال. تذكر دائماً أنك لست وحدك، وهناك طرق فعالة للتعامل معه وحماية نفسك.',
                        hearingSigns: ['التنمر', 'لا', 'آمن'],
                        hearingSignEmoji: '🤝❌🛡️',
                        visualText: 'مرحباً بك في درس مناهضة التنمر. الخطوة الأولى: التنمر هو سلوك غير لطيف يهدف لإيذاء الآخرين. تذكر دائماً أنك لست وحدك وهناك طرق لحماية نفسك. اضغط على شاشتك للانتقال.',
                        learningPoints: [
                            'التنمر سلوك سيء يؤذي الآخرين.',
                            'عليك دائماً أن تحافظ على هدوئك.',
                            'أنت بطل وتستحق أن تكون في أمان دائم.'
                        ],
                        learningSymbol: '🛡️',
                        learningSymbolType: 'safety'
                    },
                    {
                        type: 'flashcards',
                        title: 'كروت الدعم البصري: مواجهة التنمر',
                        cards: [
                            {
                                title: 'الابتعاد عن المتنمرين',
                                subtitle: 'Stay away from bullies',
                                emoji: '🛑🏃‍♂️',
                                desc: 'إذا شعرت أن شخصاً ما يتصرف بطريقة غير لطيفة، ابتعد عنه فوراً واذهب لمكان آمن.',
                                symbolType: 'danger'
                            },
                            {
                                title: 'أخبر شخصاً بالغاً تثق به',
                                subtitle: 'Tell a trusted adult',
                                emoji: '🗣️👨‍🏫',
                                desc: 'تحدث مع والديك أو معلمك في المدرسة واطلب المساعدة منهم فوراً.',
                                symbolType: 'safety'
                            }
                        ],
                        hearingSigns: ['الابتعاد', 'الحديث'],
                        hearingSignEmoji: '🏃‍♂️🗣️',
                        visualText: 'الخطوة الثانية: كروت الدعم المرئية لمواجهة التنمر. الكرت الأول: الابتعاد عن المتنمرين فوراً والذهاب لمكان آمن. الكرت الثاني: التحدث مع شخص بالغ تثق به مثل المعلم أو الوالدين.',
                        learningPoints: [
                            '1. ابتعد فوراً عن المتنمرين.',
                            '2. أخبر المعلم أو والديك بكل شيء.'
                        ]
                    }
                ]
            },
            {
                id: 8,
                title: 'السلامة الشخصية (Personal Safety)',
                description: 'تعرف على كيفية حماية جسدك ومساحتك الشخصية من أي مضايقات أو تحرش',
                category: 'life',
                icon: '🛡️',
                duration: 20,
                difficulty: 'متوسط',
                steps: [
                    {
                        type: 'adaptive',
                        title: 'حماية جسدك ومساحتك الشخصية',
                        content: 'جسدك ملكك وحدك. لا أحد يملك الحق في لمسك أو جعلك تشعر بعدم الارتياح. السلامة الشخصية تبدأ من معرفة حقوقك وقول لا بقوة عند الخطر.',
                        hearingSigns: ['لا', 'آمن', 'خطر'],
                        hearingSignEmoji: '🛑🟢🔴',
                        visualText: 'مرحباً بك في درس السلامة الشخصية ومكافحة التحرش. الخطوة الأولى: جسدك ملكك وحدك. لا يحق لأي شخص لمسك أو مضايقتك. تعلم حقوقك وكن شجاعاً. انقر على الشاشة للاستمرار.',
                        learningPoints: [
                            'جسدك ملكك أنت فقط ولا يحق لأحد مضايقتك.',
                            'تعلم أن تضع مسافة أمان بينك وبين الغرباء.',
                            'أنت تستحق الاحترام والسلامة دائماً.'
                        ],
                        learningSymbol: '🟢',
                        learningSymbolType: 'safety'
                    },
                    {
                        type: 'flashcards',
                        title: 'كروت الدعم البصري: حماية مساحتك الخاصة',
                        cards: [
                            {
                                title: 'قل لا بصوت عالٍ!',
                                subtitle: 'Say NO loudly',
                                emoji: '🗣️❌',
                                desc: 'إذا حاول أي شخص تجاوز حدودك أو لمسك بطريقة غير مريحة، اصرخ بقوة وقل "لا!"',
                                symbolType: 'danger'
                            },
                            {
                                title: 'الركض إلى مكان عام آمن',
                                subtitle: 'Run to a safe public place',
                                emoji: '🏃‍♂️🏢',
                                desc: 'أسرع بالذهاب إلى مكان فيه أشخاص كثر واطلب المساعدة من الشرطة أو المارة.',
                                symbolType: 'safety'
                            }
                        ],
                        hearingSigns: ['لا', 'الركض'],
                        hearingSignEmoji: '❌🏃‍♂️',
                        visualText: 'الخطوة الثانية: كروت السلامة الشخصية. الكرت الأول: صرخ بقوة وقل لا بصوت عالٍ إذا شعرت بالخطر. الكرت الثاني: اركض فوراً إلى مكان عام آمن ومزدحم بالناس.',
                        learningPoints: [
                            '1. صرخ بقوة وقل لا!',
                            '2. اركض فوراً لمكان عام وآمن.'
                        ]
                    }
                ]
            },
            {
                id: 9,
                title: 'الأمان الرقمي (Cyber Safety)',
                description: 'تعلم القواعد الذهبية لحماية حساباتك وخصوصيتك أثناء استخدام الإنترنت والأجهزة',
                category: 'tech',
                icon: '🔒',
                duration: 15,
                difficulty: 'مبتدئ',
                steps: [
                    {
                        type: 'adaptive',
                        title: 'حماية حساباتك ومعلوماتك الخاصة',
                        content: 'الإنترنت عالم رائع ومفيد جداً، ولكنه مليء بالثغرات والمخاطر. حماية هويتك الرقمية تبدأ من الحفاظ على سرية معلوماتك الشخصية وعدم مشاركتها.',
                        hearingSigns: ['آمن', 'خطر', 'الإنترنت'],
                        hearingSignEmoji: '🛡️⚠️💻',
                        visualText: 'مرحباً بك في درس الأمان الرقمي على الإنترنت. الخطوة الأولى: الإنترنت مفيد ورائع ولكن احذر من مشاركة معلوماتك الخاصة مع الغرباء. حافظ على سلامة بياناتك. اضغط للاستمرار.',
                        learningPoints: [
                            'الإنترنت ممتع ولكن يجب استخدامه بحذر.',
                            'لا تشارك اسمك أو عنوانك أو صورتك مع غرباء.',
                            'حافظ دائماً على سلامتك وسرية معلوماتك.'
                        ],
                        learningSymbol: '🛡️',
                        learningSymbolType: 'safety'
                    },
                    {
                        type: 'flashcards',
                        title: 'كروت الدعم البصري: القواعد الذهبية للأمان',
                        cards: [
                            {
                                title: 'حافظ على قوة كلمات المرور',
                                subtitle: 'Keep passwords strong',
                                emoji: '🔑💪',
                                desc: 'استخدم كلمات مرور صعبة تحتوي على حروف وأرقام ورموز، ولا تشاركها مع أي أحد أبداً.',
                                symbolType: 'safety'
                            },
                            {
                                title: 'لا تضغط على الروابط المجهولة',
                                subtitle: 'Do not click unknown links',
                                emoji: '🔗❌',
                                desc: 'تجنب فتح أي رابط يرسله لك شخص غريب، فقد يحتوي على فيروسات أو برمجيات خبيثة.',
                                symbolType: 'danger'
                            }
                        ],
                        hearingSigns: ['الأمان', 'لا'],
                        hearingSignEmoji: '🔒❌',
                        visualText: 'الخطوة الثانية: كروت الأمان الرقمي. الكرت الأول: استخدم كلمات مرور قوية جداً ولا تخبر بها أحداً. الكرت الثاني: لا تفتح أي روابط غريبة أو مجهولة المصدر لتتجنب الفيروسات.',
                        learningPoints: [
                            '1. ضع كلمة مرور قوية جداً لجهازك.',
                            '2. لا تفتح روابط غريبة أبداً.'
                        ]
                    }
                ]
            }
        ];
    }

    /**
     * إعداد مستمعي الأحداث
     */
    setupEventListeners() {
        // أزرار الفئات
        const categoryButtons = document.querySelectorAll('.category-btn');
        categoryButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const category = e.currentTarget.getAttribute('data-category');
                this.filterByCategory(category);

                categoryButtons.forEach(b => b.classList.remove('active'));
                e.currentTarget.classList.add('active');
            });
        });
    }

    /**
     * فلترة حسب الفئة
     */
    filterByCategory(category) {
        this.currentCategory = category;
        this.renderLessons();
    }

    /**
     * عرض الدروس
     */
    renderLessons() {
        const lessonsGrid = document.getElementById('lessons-grid');
        if (!lessonsGrid) return;

        let filteredLessons = this.lessons;
        if (this.currentCategory !== 'all') {
            filteredLessons = this.lessons.filter(l => l.category === this.currentCategory);
        }

        lessonsGrid.innerHTML = filteredLessons.map(lesson => {
            const isCompleted = this.userProgress.completedLessons.includes(lesson.id);
            const speakText = `${lesson.title}. ${lesson.description}. فئة الدرس: ${this.getCategoryName(lesson.category)}. مدة الدرس: ${lesson.duration} دقيقة. الصعوبة: ${lesson.difficulty}.`;

            return `
        <div class="lesson-card" onclick="educationManager.openLesson(${lesson.id})" style="position: relative;">
          <div class="lesson-thumbnail" style="position: relative; display: flex; align-items: center; justify-content: center; height: 180px;">
            <div style="font-size: 4rem;">${lesson.icon}</div>
            ${isCompleted ? '<div style="position: absolute; top: 10px; right: 10px; background: #10b981; color: white; padding: 5px 10px; border-radius: 20px; font-size: 0.8rem; z-index: 5;"><i class="fas fa-check"></i> مكتمل</div>' : ''}
            
            <!-- زر قارئ الشاشة المطور لتسهيل الوصول للإعاقة البصرية -->
            <button class="tts-card-btn" onclick="event.stopPropagation(); speak('${speakText.replace(/'/g, "\\'")}')" style="position: absolute; bottom: 10px; left: 10px; right: 10px; background: rgba(249, 115, 22, 0.95); color: white; border: none; border-radius: 12px; padding: 8px 12px; font-size: 0.95rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; z-index: 10; box-shadow: 0 4px 10px rgba(249, 115, 22, 0.3); transition: all 0.2s;" onmouseover="this.style.background='#ea580c'; this.style.transform='scale(1.03)';" onmouseout="this.style.background='rgba(249, 115, 22, 0.95)'; this.style.transform='scale(1)';">
              <i class="fas fa-volume-up"></i>
              <span>🔊 استمع للشرح</span>
            </button>
          </div>
          <div class="lesson-content">
            <span class="lesson-category">${this.getCategoryName(lesson.category)}</span>
            <h4>${lesson.title}</h4>
            <p>${lesson.description}</p>
            <div class="lesson-meta">
              <span><i class="fas fa-clock"></i> ${lesson.duration} دقيقة</span>
              <span><i class="fas fa-signal"></i> ${lesson.difficulty}</span>
            </div>
          </div>
        </div>
      `;
        }).join('');
    }

    /**
     * الحصول على اسم الفئة
     */
    getCategoryName(category) {
        const names = {
            sign: 'لغة الإشارة',
            life: 'مهارات حياتية',
            tech: 'تقنية',
            social: 'تواصل اجتماعي'
        };
        return names[category] || category;
    }

    /**
     * فتح درس
     */
    openLesson(lessonId) {
        this.currentLesson = this.lessons.find(l => l.id === lessonId);
        if (!this.currentLesson) return;

        this.currentStep = 0;

        const modal = document.getElementById('lesson-modal');
        const title = document.getElementById('lesson-title');
        const description = document.getElementById('lesson-description');

        if (modal && title && description) {
            modal.style.display = 'flex';
            title.textContent = this.currentLesson.title;
            description.textContent = this.currentLesson.description;

            this.renderStep();
        }
    }

    /**
     * عرض الخطوة المطور ليدمج الإعاقات الأربعة ديناميكياً
     */
    renderStep() {
        if (!this.currentLesson) return;

        const step = this.currentLesson.steps[this.currentStep];
        const lessonBody = document.getElementById('lesson-body');
        const completeBtn = document.getElementById('complete-btn');
        const modalContent = document.querySelector('.modal-content');

        if (!lessonBody) return;

        // إعادة ضبط الأنماط الافتراضية
        lessonBody.style = '';
        if (modalContent) {
            modalContent.style = '';
        }

        // قراءة نوع الإعاقة الحالية
        const disabilityType = accessibilityManager ? accessibilityManager.currentDisabilityType : 'hearing';

        let content = '';
        let textToShow = step.content || step.visualText || '';
        let stepTitle = step.title || this.currentLesson.title;

        // التعديل حسب الإعاقة المختارة
        if (disabilityType === 'hearing') {
            // ==========================================
            // 👂 الإعاقة السمعية: الأفاتار + قاعدة ترجمة الكورسات
            // ==========================================

            // ── قاعدة بيانات ترجمة لغة الإشارة الكاملة لكل كورس وخطوة ──
            const signLanguageDB = {
                // كورس 7: مناهضة التنمر
                '7-0': {
                    signs: ['التنمر', 'لا', 'آمن', 'الإبلاغ'],
                    emoji: '🤝❌🛡️📢',
                    text: 'التنمر سلوك خاطئ ولا يعبر عن قيمتك الحقيقية. إذا واجهت كلمات جارحة أو سخرية في المدرسة، لا تعزل نفسك ولا تبكِ، بل قف بثقة، وتجاهل المتنمر، واذهب فوراً لإبلاغ المعلم أو والديك لحمايتك.'
                },
                '7-1': {
                    signs: ['التنمر', 'لا', 'آمن', 'الإبلاغ'],
                    emoji: '🤝❌🛡️📢',
                    text: 'التنمر سلوك خاطئ ولا يعبر عن قيمتك الحقيقية. إذا واجهت كلمات جارحة أو سخرية في المدرسة، لا تعزل نفسك ولا تبكِ، بل قف بثقة، وتجاهل المتنمر، واذهب فوراً لإبلاغ المعلم أو والديك لحمايتك.'
                },
                // كورس 8: السلامة الشخصية
                '8-0': {
                    signs: ['لا', 'آمن', 'الجسد', 'خطر'],
                    emoji: '🛑🟢🛡️🔴',
                    text: 'جسدك ملكك وحدك ولا يحق لأي شخص لمسك أو إزعاجك. إذا شعرت بعدم الارتياح من أي شخص، قل لا بصوت عالٍ وقوي وابتعد فوراً. السلامة الشخصية حق أساسي لكل إنسان.'
                },
                '8-1': {
                    signs: ['لا', 'آمن', 'الجسد', 'خطر'],
                    emoji: '🛑🟢🛡️🔴',
                    text: 'جسدك ملكك وحدك ولا يحق لأي شخص لمسك أو إزعاجك. إذا شعرت بعدم الارتياح من أي شخص، قل لا بصوت عالٍ وقوي وابتعد فوراً. السلامة الشخصية حق أساسي لكل إنسان.'
                },
                // كورس 9: الأمان الرقمي
                '9-0': {
                    signs: ['آمن', 'خطر', 'الإنترنت', 'السرية'],
                    emoji: '🛡️⚠️💻🔐',
                    text: 'العالم الرقمي ممتع ولكن الحذر فيه واجب لحمايتك. لا تقم بالضغط على روابط مجهولة تدعي الفوز بجوائز، ولا تشارك معلوماتك الشخصية أو كلمات المرور مع الغرباء، واستخدم خاصية الحظر فوراً عند التعرض للمضايقة.'
                },
                '9-1': {
                    signs: ['آمن', 'خطر', 'الإنترنت', 'السرية'],
                    emoji: '🛡️⚠️💻🔐',
                    text: 'العالم الرقمي ممتع ولكن الحذر فيه واجب لحمايتك. لا تقم بالضغط على روابط مجهولة تدعي الفوز بجوائز، ولا تشارك معلوماتك الشخصية أو كلمات المرور مع الغرباء، واستخدم خاصية الحظر فوراً عند التعرض للمضايقة.'
                }
            };

            // ── اختيار نص الترجمة الصحيح: DB أولاً → ثم content → ثم visualText ──
            const lessonId = this.currentLesson ? this.currentLesson.id : null;
            const dbKey = lessonId ? `${lessonId}-${this.currentStep}` : null;
            const dbEntry = dbKey && signLanguageDB[dbKey] ? signLanguageDB[dbKey] : null;

            const signEmoji = dbEntry ? dbEntry.emoji : (step.hearingSignEmoji || '🤟');
            const signsList = dbEntry ? dbEntry.signs : (step.hearingSigns || ['إشارة']);
            let rawText = dbEntry ? dbEntry.text : (step.content || step.visualText || textToShow);

            // ── تطبيق تلوين الكلمات المفتاحية ──
            function applyKeywordHighlights(txt) {
                return txt
                    .replace(/السلامة الشخصية/g, '<span style="color:#0ea5e9;font-weight:800;border-bottom:2px solid #0ea5e9;">السلامة الشخصية 🛡️</span>')
                    .replace(/العالم الرقمي/g, '<span style="color:#6366f1;font-weight:800;border-bottom:2px solid #6366f1;">العالم الرقمي 💻</span>')
                    .replace(/التنمر/g, '<span style="color:#ef4444;font-weight:800;border-bottom:2px solid #ef4444;">التنمر ❌</span>')
                    .replace(/\bلا\b/g, '<span style="color:#f97316;font-weight:800;border-bottom:2px solid #f97316;">لا 🛑</span>')
                    .replace(/آمن(?:ة)?/g, '<span style="color:#10b981;font-weight:800;border-bottom:2px solid #10b981;">آمن 🛡️</span>')
                    .replace(/خطر(?:اً|ة)?/g, '<span style="color:#ef4444;font-weight:800;border-bottom:2px solid #ef4444;">خطر ⚠️</span>')
                    .replace(/التحرش/g, '<span style="color:#b91c1c;font-weight:800;border-bottom:2px solid #b91c1c;">التحرش ⚠️</span>')
                    .replace(/السلامة/g, '<span style="color:#0ea5e9;font-weight:800;border-bottom:2px solid #0ea5e9;">السلامة 🔐</span>')
                    .replace(/كلمات المرور/g, '<span style="color:#8b5cf6;font-weight:800;border-bottom:2px solid #8b5cf6;">كلمات المرور 🔑</span>')
                    .replace(/كلمة المرور/g, '<span style="color:#8b5cf6;font-weight:800;border-bottom:2px solid #8b5cf6;">كلمة المرور 🔑</span>')
                    .replace(/الإنترنت/g, '<span style="color:#6366f1;font-weight:800;border-bottom:2px solid #6366f1;">الإنترنت 💻</span>')
                    .replace(/حظر/g, '<span style="color:#ef4444;font-weight:800;border-bottom:2px solid #ef4444;">حظر 🚫</span>')
                    .replace(/روابط مجهولة/g, '<span style="color:#f97316;font-weight:800;border-bottom:2px solid #f97316;">روابط مجهولة 🔗</span>');
            }

            const subtitleText = applyKeywordHighlights(rawText);
            const firstEmoji = [...signEmoji].filter(c => c.codePointAt(0) > 127)[0] || '🤟';

            let cardsHtml = '';
            if (step.type === 'flashcards' && step.cards) {
                cardsHtml = `
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:15px;width:100%;margin-top:15px;">
                        ${step.cards.map(c => `
                            <div style="background:#f8fafc;border:2px solid ${c.symbolType === 'safety' ? '#10b981' : '#ef4444'};border-radius:12px;padding:15px;text-align:center;transition:transform 0.2s;" onmouseover="this.style.transform='scale(1.03)'" onmouseout="this.style.transform='scale(1)'">
                                <div style="font-size:3.5rem;margin-bottom:10px;animation:pulse 2s infinite;">${c.emoji}</div>
                                <h4 style="color:#1e293b;margin:0 0 5px 0;font-size:1.2rem;">${c.title}</h4>
                                <span style="font-size:0.85rem;color:#64748b;display:block;margin-bottom:5px;">${c.subtitle}</span>
                                <p style="font-size:0.95rem;color:#475569;margin:0;">${c.desc}</p>
                            </div>
                        `).join('')}
                    </div>
                `;
            }

            content = `
                <div class="hearing-course-step" style="display:flex;flex-direction:column;align-items:center;gap:20px;text-align:center;">

                    <!-- أفاتار ثلاثي الأبعاد -->
                    <div class="avatar-3d-box" style="width:130px;height:130px;background:linear-gradient(135deg,#c084fc 0%,#6366f1 100%);border-radius:50%;display:flex;align-items:center;justify-content:center;position:relative;box-shadow:0 8px 20px rgba(99,102,241,0.2);border:4px solid #ffffff;">
                        <div class="avatar-robot" style="position:absolute;top:15px;display:flex;flex-direction:column;align-items:center;">
                            <div class="robot-head" style="width:65px;height:50px;background:#818cf8;border-radius:15px;border:2px solid #ffffff;display:flex;justify-content:center;align-items:center;animation:robotFloat 2.5s ease-in-out infinite alternate;">
                                <div class="robot-eyes" style="display:flex;gap:8px;">
                                    <div class="eye" style="width:8px;height:8px;background:#00E5FF;border-radius:50%;animation:eyeBlink 4s infinite;"></div>
                                    <div class="eye" style="width:8px;height:8px;background:#00E5FF;border-radius:50%;animation:eyeBlink 4s infinite 0.5s;"></div>
                                </div>
                                <div style="width:20px;height:3px;background:#4f46e5;border-radius:2px;margin-top:6px;"></div>
                            </div>
                        </div>
                        <div class="gesture-display" style="font-size:3.5rem;position:absolute;bottom:-10px;background:#ffffff;width:65px;height:65px;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 10px rgba(0,0,0,0.15);border:3px solid #6366f1;animation:gestureBounce 0.5s ease-out;">${firstEmoji}</div>
                    </div>

                    <!-- تسمية الإشارات -->
                    <div style="font-size:1.1rem;color:#4f46e5;font-weight:700;background:#eef2ff;padding:8px 20px;border-radius:var(--radius-full);border:2px solid #c7d2fe;">
                        🤟 الأفاتار يترجم: [ ${signsList.join(' ← ')} ]
                    </div>

                    <!-- صندوق الترجمة النصية -->
                    <div class="subtitle-box" id="sign-subtitle-box" style="background:#0f172a;border-radius:14px;padding:22px 24px;width:100%;border:2px solid #334155;box-shadow:0 4px 20px rgba(0,0,0,0.35);text-align:right;">
                        <h4 style="color:#94a3b8;margin:0 0 12px 0;display:flex;align-items:center;gap:8px;font-size:1rem;">
                            <i class="fas fa-closed-captioning" style="color:#6366f1;"></i>
                            الترجمة النصية بلغة الإشارة:
                        </h4>
                        <p id="sign-subtitle-text" style="color:#f8fafc;font-size:1.25rem;line-height:1.9;margin:0;">${subtitleText}</p>
                    </div>

                    ${cardsHtml}
                </div>
            `;

        } else if (disabilityType === 'visual') {
            // ==========================================
            // 👁️ الإعاقة البصرية: تباين عالي جداً ودعم صوتي كامل
            // ==========================================
            const readText = step.visualText || step.content || '';
            
            if (modalContent) {
                modalContent.style.background = '#000000';
                modalContent.style.color = '#ffffff';
                modalContent.style.border = '4px solid #facc15';
            }
            lessonBody.style.background = '#000000';
            lessonBody.style.color = '#ffffff';

            content = `
                <div class="visual-course-step" style="padding: 20px; text-align: center; background:#000000; color:#ffffff;">
                    <div style="font-size: 6rem; color:#facc15; margin-bottom: 20px; animation: pulse 2s infinite;"><i class="fas fa-volume-up"></i></div>
                    <h2 style="font-size: 2.5rem; color:#facc15; font-weight: 900; margin-bottom:20px; border-bottom:3px solid #facc15; padding-bottom:10px;">${stepTitle}</h2>
                    <p style="font-size: 2rem; line-height: 1.8; color:#ffffff; font-weight: 800; text-align:right;">${readText}</p>
                    
                    <div style="margin-top: 30px; display:flex; flex-direction:column; gap:15px;">
                        <button onclick="speak('${readText.replace(/'/g, "\\'")}')" style="background:#facc15; color:#000000; border:none; padding:20px; border-radius:15px; font-size:1.8rem; font-weight:900; cursor:pointer; width:100%; box-shadow:0 0 15px rgba(250,204,21,0.5);">
                            <i class="fas fa-play-circle"></i> إعادة قراءة الخطوة بصوت واضح
                        </button>
                        <div style="background:#1e293b; padding:15px; border-radius:10px; border:2px solid #facc15; font-size:1.3rem; color:#facc15; font-weight:bold;">
                            <i class="fas fa-headphones"></i> المساعد الصوتي يعمل تلقائياً عند الدخول
                        </div>
                    </div>
                </div>
            `;

            // قراءة تلقائية فورية
            speak(readText);

        } else if (disabilityType === 'cognitive' || disabilityType === 'learning') {
            // ==========================================
            // 🧩 صعوبات التعلم والتوحد: كروت بصرية ورموز واضحة جداً (PECS Style)
            // ==========================================
            const symbol = step.learningSymbol || '🛡️';
            const symbolType = step.learningSymbolType || 'safety';
            
            const badgeColor = symbolType === 'safety' ? '#10b981' : '#ef4444';
            const badgeBg = symbolType === 'safety' ? '#ecfdf5' : '#fef2f2';
            
            const points = step.learningPoints || [step.content || ''];
            
            let cardGridHtml = '';
            if (step.cards) {
                // عرض كروت مرئية كبيرة بدلاً من النصوص الطويلة
                cardGridHtml = `
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; width: 100%; margin-top: 15px;">
                        ${step.cards.map(c => `
                            <div style="background: ${c.symbolType === 'safety' ? '#ecfdf5' : '#fef2f2'}; border: 3px solid ${c.symbolType === 'safety' ? '#10b981' : '#ef4444'}; border-radius: 16px; padding: 20px; text-align: center; box-shadow:0 8px 16px rgba(0,0,0,0.05); transition:transform 0.2s;">
                                <div style="background:#ffffff; border-radius:12px; height:130px; display:flex; align-items:center; justify-content:center; font-size: 5.5rem; margin-bottom: 15px; border:2px dashed ${c.symbolType === 'safety' ? '#10b981' : '#ef4444'};">${c.emoji}</div>
                                <h4 style="font-size: 1.6rem; font-weight: 800; color: #1f2937; margin: 0 0 10px 0;">${c.title}</h4>
                                <span style="font-size: 0.95rem; background:#ffffff; color:#374151; padding:3px 10px; border-radius:10px; border:1px solid #d1d5db; font-weight:bold; display:inline-block; margin-bottom:10px;">${c.subtitle}</span>
                                <p style="font-size: 1.15rem; line-height:1.6; color: #4b5563; margin: 0; font-weight:700;">${c.desc}</p>
                            </div>
                        `).join('')}
                    </div>
                `;
            } else {
                cardGridHtml = `
                    <div style="background: ${badgeBg}; border: 3px solid ${badgeColor}; border-radius: 16px; padding: 25px; display:flex; align-items:center; gap:20px; margin-top:15px; text-align:right;">
                        <div style="font-size: 6rem; background:#ffffff; border-radius:15px; width:120px; height:120px; display:flex; align-items:center; justify-content:center; border:2px solid ${badgeColor}; flex-shrink:0;">${symbol}</div>
                        <div>
                            <span style="background:${badgeColor}; color:#ffffff; padding:4px 12px; border-radius:20px; font-weight:800; font-size:1rem; display:inline-block; margin-bottom:8px;">مفهوم الأمان</span>
                            <h3 style="font-size: 1.8rem; font-weight: 900; color:#1e293b; margin:0 0 10px 0;">${stepTitle}</h3>
                        </div>
                    </div>
                `;
            }

            content = `
                <div class="cognitive-course-step" style="display:flex; flex-direction:column; gap:20px;">
                    <div style="background:#fffbeb; border:2px solid #fbbf24; border-radius:12px; padding:15px; display:flex; align-items:center; gap:12px; color:#b45309; font-weight:bold; font-size:1.15rem; text-align:right;">
                        <i class="fas fa-puzzle-piece" style="font-size:1.8rem; color:#f59e0b;"></i>
                        <span>تم تحويل الدرس إلى لوحة تعليمية مرئية مبسطة وخالية من أي تشتت!</span>
                    </div>

                    <div style="text-align:right;">
                        <h4 style="color:#475569; font-size:1.3rem; margin-bottom:10px; font-weight:800;"><i class="fas fa-list-ul" style="color:#f59e0b;"></i> إرشادات الأمان خطوة بخطوة:</h4>
                        <ul style="list-style-type:none; padding:0; margin:0; display:flex; flex-direction:column; gap:10px;">
                            ${points.map(p => `
                                <li style="background:#ffffff; border:1px solid #e2e8f0; padding:15px; border-radius:10px; font-size:1.25rem; font-weight:700; color:#1e293b; box-shadow:0 2px 4px rgba(0,0,0,0.02); display:flex; align-items:center; gap:10px; border-right:5px solid #10b981;">
                                    <i class="fas fa-check-circle" style="color:#10b981; font-size:1.4rem;"></i>
                                    <span>${p}</span>
                                </li>
                            `).join('')}
                        </ul>
                    </div>

                    ${cardGridHtml}
                </div>
            `;

        } else if (disabilityType === 'motor') {
            // ==========================================
            // ♿ الإعاقة الحركية: أزرار لمس ضخمة جداً وخيارات تمرير سهلة
            // ==========================================
            const readText = step.content || step.visualText || '';
            
            content = `
                <div class="motor-course-step" style="text-align: right; padding: 10px;">
                    <div style="background:#dbeafe; border:2px solid #2563eb; border-radius:12px; padding:15px; display:flex; align-items:center; gap:12px; color:#1e40af; font-weight:bold; font-size:1.15rem; margin-bottom:20px;">
                        <i class="fas fa-wheelchair" style="font-size:1.8rem; color:#2563eb;"></i>
                        <span>وضع الإعاقة الحركية: واجهة مبسطة بأزرار لمس كبيرة سهلة الضغط.</span>
                    </div>

                    <div id="scroll-box" style="background:#f8fafc; border:2px solid #cbd5e1; border-radius:12px; padding:20px; max-height:220px; overflow-y:auto; font-size:1.6rem; line-height:2; color:#1e293b; font-weight:700; margin-bottom:20px;">
                        ${readText}
                    </div>

                    <div style="display:flex; gap:15px; flex-direction:column;">
                        <button onclick="document.getElementById('scroll-box').scrollBy({top: 40, behavior: 'smooth'})" style="background:#2563eb; color:#ffffff; border:none; padding:25px; border-radius:15px; font-size:1.6rem; font-weight:900; cursor:pointer; width:100%; display:flex; align-items:center; justify-content:center; gap:10px;">
                            <i class="fas fa-arrow-down"></i> تمرير النص لأسفل (Scroll Down)
                        </button>
                        <button onclick="speak('${readText.replace(/'/g, "\\'")}')" style="background:#10b981; color:#ffffff; border:none; padding:25px; border-radius:15px; font-size:1.6rem; font-weight:900; cursor:pointer; width:100%; display:flex; align-items:center; justify-content:center; gap:10px;">
                            <i class="fas fa-volume-up"></i> سماع محتوى الصفحة بالصوت
                        </button>
                    </div>
                </div>
            `;
        } else {
            // العرض الافتراضي القياسي
            switch (step.type) {
                case 'text':
                    content = `<div style="font-size: var(--font-size-xl); line-height: 2; padding: var(--spacing-2xl);">${step.content}</div>`;
                    break;
                case 'image':
                    content = `
          <div style="text-align: center; padding: var(--spacing-3xl);">
            <div style="font-size: 10rem; margin-bottom: var(--spacing-xl);">${step.emoji}</div>
            <h3>${step.content}</h3>
          </div>
        `;
                    break;
                case 'quiz':
                    content = `
          <div style="padding: var(--spacing-2xl);">
            <h3 style="margin-bottom: var(--spacing-xl);">${step.question}</h3>
            <input type="text" class="input-field" placeholder="اكتب إجابتك هنا..." style="width: 100%; padding: var(--spacing-lg); font-size: var(--font-size-lg);">
            <button class="btn btn-primary" style="margin-top: var(--spacing-lg);" onclick="showNotification('إجابة صحيحة!', 'success')">تحقق</button>
          </div>
        `;
                    break;
            }
        }

        lessonBody.innerHTML = content;

        // تعديل أزرار التنقل والتحكم لتصبح ضخمة في وضعي البصرية والحركية لسهولة الوصول
        const nextBtn = document.querySelector('.lesson-actions .btn-primary');
        const prevBtn = document.querySelector('.lesson-actions .btn-secondary');

        if (nextBtn && prevBtn) {
            if (disabilityType === 'visual' || disabilityType === 'motor') {
                nextBtn.style = 'padding: 25px 40px; font-size: 1.6rem; font-weight: 900; border-radius: 12px; background: #2563eb; color: white; border: none; flex: 1;';
                prevBtn.style = 'padding: 25px 40px; font-size: 1.6rem; font-weight: 900; border-radius: 12px; background: #64748b; color: white; border: none; flex: 1;';
                if (completeBtn) {
                    completeBtn.style = 'padding: 25px 40px; font-size: 1.6rem; font-weight: 900; border-radius: 12px; background: #10b981; color: white; border: none; flex: 1;';
                }
            } else {
                nextBtn.style = '';
                prevBtn.style = '';
                if (completeBtn) completeBtn.style = '';
            }
        }

        // إظهار زر الإنهاء في الخطوة الأخيرة
        if (completeBtn) {
            if (this.currentStep === this.currentLesson.steps.length - 1) {
                completeBtn.style.display = 'inline-flex';
            } else {
                completeBtn.style.display = 'none';
            }
        }
    }

    /**
     * الخطوة التالية
     */
    nextStep() {
        if (!this.currentLesson) return;

        if (this.currentStep < this.currentLesson.steps.length - 1) {
            this.currentStep++;
            this.renderStep();
        }
    }

    /**
     * الخطوة السابقة
     */
    previousStep() {
        if (this.currentStep > 0) {
            this.currentStep--;
            this.renderStep();
        }
    }

    /**
     * إنهاء الدرس وحفظ التقدم
     */
    completeLesson() {
        if (!this.currentLesson) return;

        if (!this.userProgress.completedLessons.includes(this.currentLesson.id)) {
            this.userProgress.completedLessons.push(this.currentLesson.id);
            this.userProgress.totalTime += this.currentLesson.duration;

            // إضافة إنجاز
            if (this.userProgress.completedLessons.length === 1) {
                this.userProgress.achievements.push('أول درس');
            }
            if (this.userProgress.completedLessons.length === 5) {
                this.userProgress.achievements.push('متعلم نشط');
            }

            this.saveProgress();
            this.updateStats();

            showNotification('🎉 تهانينا! أكملت الدرس بنجاح', 'success');
        }

        this.closeLesson();
        this.renderLessons();
    }

    /**
     * إغلاق الدرس
     */
    closeLesson() {
        const modal = document.getElementById('lesson-modal');
        if (modal) {
            modal.style.display = 'none';
        }
        this.currentLesson = null;
        this.currentStep = 0;
    }

    /**
     * تحديث الإحصائيات
     */
    updateStats() {
        const completedEl = document.getElementById('completed-lessons');
        const timeEl = document.getElementById('total-time');
        const achievementsEl = document.getElementById('achievements');

        if (completedEl) completedEl.textContent = this.userProgress.completedLessons.length;
        if (timeEl) timeEl.textContent = this.userProgress.totalTime;
        if (achievementsEl) achievementsEl.textContent = this.userProgress.achievements.length;
    }

    /**
     * حفظ التقدم
     */
    saveProgress() {
        saveToStorage('allable_education_progress', this.userProgress);
    }

    /**
     * تحميل التقدم
     */
    loadProgress() {
        this.userProgress = getFromStorage('allable_education_progress', {
            completedLessons: [],
            totalTime: 0,
            achievements: []
        });
    }
}

// إنشاء نسخة عامة
const educationManager = new EducationManager();

// تصدير
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { EducationManager, educationManager };
}
