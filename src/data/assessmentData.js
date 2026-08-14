export const assessmentData = {
    phonological: {
        title: "الوعي الصوتي",
        questions: [
            {
                id: 'p1',
                text: "اسمع الكلمتين دول: (بحر - نهر). هل بيبدأوا بنفس الصوت؟",
                audioText: "اسمع الكلمتين دول: بحر، نهر. هل بيبدأوا بنفس الصوت؟",
                audio: "/src/assets/audio/phonological_q1.mp3",
                options: [{ id: 'yes', text: 'نعم', icon: '✅' }, { id: 'no', text: 'لا', icon: '❌' }],
                correct: 'no' // Ba vs Na
            },
            {
                id: 'p2',
                text: "كلمة (مقص).. اختار الحرف اللي بتبدأ بيه.",
                audioText: "كلمة مقص. اختار الحرف اللي بتبدأ بيه.",
                audio: "/src/assets/audio/phonological_q2.mp3",
                options: [{ id: 'm', text: 'مـ' }, { id: 's', text: 'سـ' }, { id: 'k', text: 'كـ' }],
                correct: 'm'
            },
            {
                id: 'p3',
                text: "لو دمجنا (فـ ... يـ ... ل) هتبقى كلمة إيه؟",
                audioText: "لو دمجنا فـ، يـ، ل، هتبقى كلمة إيه؟",
                audio: "/src/assets/audio/phonological_q3.mp3",
                options: [{ id: 'fiel', text: 'فيل' }, { id: 'fol', text: 'فول' }],
                correct: 'fiel'
            }
        ]
    },
    visual: {
        title: "المعالجة البصرية",
        questions: [
            {
                id: 'v1',
                text: "اختار الحرف اللي زي ده: (ع)",
                options: [{ id: 'g', text: 'غ' }, { id: 'a', text: 'ع' }, { id: 'h', text: 'ح' }],
                correct: 'a'
            },
            {
                id: 'v2',
                text: "فين الكلمة المختلفة؟",
                options: [{ id: '1', text: 'باب' }, { id: '2', text: 'باب' }, { id: '3', text: 'ناب' }],
                correct: '3'
            }
        ]
    },
    comprehension: {
        title: "الفهم القرائي",
        questions: [
            {
                id: 'c1',
                text: "القطة نايمة فوق الكرسي. فين القطة؟",
                options: [{ id: 'under', text: 'تحت الكرسي' }, { id: 'above', text: 'فوق الكرسي' }],
                correct: 'above'
            },
            {
                id: 'c2',
                text: "بنكتب الواجب بـ...",
                options: [{ id: 'pen', text: 'القلم' }, { id: 'spoon', text: 'الملعقة' }],
                correct: 'pen'
            }
        ]
    }
};
