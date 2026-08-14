import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import BarChart from '../components/ui/BarChart';
import { useRobot } from '../context/RobotContext';
import { Mic, Eye, BookOpen, TrendingUp, AlertCircle, Star, Target, Zap } from 'lucide-react';

const ProgressBar = ({ value, colorClass, bgClass }) => (
    <div className={`h-3 w-full ${bgClass} rounded-full overflow-hidden`}>
        <div
            className={`h-full ${colorClass} rounded-full transition-all duration-1000 ease-out`}
            style={{ width: `${value}%` }}
        />
    </div>
);

const ReportsPage = () => {
    const navigate = useNavigate();
    const { speak, setMood } = useRobot();
    const [report, setReport] = useState(null);

    useEffect(() => {
        const saved = localStorage.getItem('assessmentReport');
        if (saved) {
            setReport(JSON.parse(saved));
            setMood('happy');
            speak('دي نتيجة التقييم بتاعتك. بص على التقدم اللي عملناه!', 'happy');
        } else {
            // Mock data for dev
            setReport({
                scores: { phonological: 65, visual: 58, comprehension: 72 },
                counts: { phonological: 100, visual: 100, comprehension: 100 },
                levels: { phonological: 'مبتدئ', visual: 'متوسط', comprehension: 'متقدم' }
            });
        }
    }, [speak, setMood]);

    if (!report) return null;

    // Calculate percentages
    const getScore = (type) => Math.round((report.scores[type] / report.counts[type]) * 100);

    const scores = {
        phonological: getScore('phonological'),
        visual: getScore('visual'),
        comprehension: getScore('comprehension')
    };

    return (
        <div className="flex flex-col h-full space-y-6 animate-fade-in p-4 overflow-y-auto pb-24">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-3xl shadow-lg relative overflow-hidden shrink-0">
                <div className="relative z-10 flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-bold mb-1">التقارير والتوصيات</h2>
                        <div className="flex items-center gap-2 text-blue-100">
                            <span>{localStorage.getItem('studentName') || 'ميار'}</span>
                            <span>•</span>
                            <span>{localStorage.getItem('studentGrade') ? `الصف ${localStorage.getItem('studentGrade')}` : 'الصف الثاني'}</span>
                        </div>
                    </div>
                    <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                        <TrendingUp size={24} className="text-white" />
                    </div>
                </div>
            </div>

            {/* Overall Score Card */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between overflow-hidden relative group">
                <div className="z-10">
                    <h3 className="text-gray-500 text-sm font-bold mb-1">النتيجة الإجمالية</h3>
                    <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-black text-[#6A5ACD]">
                            {Math.round((scores.phonological + scores.visual + scores.comprehension) / 3)}%
                        </span>
                        <span className="text-green-500 text-sm font-bold flex items-center gap-1">
                            <TrendingUp size={14} /> +12%
                        </span>
                    </div>
                    <p className="text-gray-400 text-xs mt-2 font-medium italic">برافو يا بطل! استمر في التقدم 🌟</p>
                </div>

                <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
                    <svg className="w-full h-full transform -rotate-90">
                        <circle
                            cx="48"
                            cy="48"
                            r="40"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            className="text-gray-100"
                        />
                        <circle
                            cx="48"
                            cy="48"
                            r="40"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            strokeDasharray={2 * Math.PI * 40}
                            strokeDashoffset={2 * Math.PI * 40 * (1 - (scores.phonological + scores.visual + scores.comprehension) / 300)}
                            strokeLinecap="round"
                            className="text-[#6A5ACD] transition-all duration-1000 ease-out"
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Star size={24} className="text-yellow-400 fill-yellow-400 animate-bounce" />
                    </div>
                </div>

                {/* Decorative background shape */}
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-[#6A5ACD]/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
            </div>

            {/* Bar Chart Visualization */}
            <BarChart
                data={[
                    {
                        label: 'الوعي الصوتي',
                        value: scores.phonological,
                        color: '#ec4899',
                        gradient: 'linear-gradient(to top, #f472b6, #ec4899)',
                        bgColor: '#fce7f3',
                        icon: <Mic size={20} className="text-pink-600" />
                    },
                    {
                        label: 'المعالجة البصرية',
                        value: scores.visual,
                        color: '#f97316',
                        gradient: 'linear-gradient(to top, #fb923c, #f97316)',
                        bgColor: '#ffedd5',
                        icon: <Eye size={20} className="text-orange-500" />
                    },
                    {
                        label: 'الفهم القرائي',
                        value: scores.comprehension,
                        color: '#9333ea',
                        gradient: 'linear-gradient(to top, #a855f7, #9333ea)',
                        bgColor: '#f3e8ff',
                        icon: <BookOpen size={20} className="text-purple-600" />
                    }
                ]}
            />

            <div className="flex items-center gap-2 mt-2">
                <h3 className="font-bold text-gray-700">نظرة عامة على التقدم</h3>
                <TrendingUp size={16} className="text-blue-500" />
            </div>

            <div className="space-y-4">
                {/* Phonological Card */}
                <Card className="p-5">
                    <div className="flex items-center justify-between mb-4">
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                            <Star size={12} fill="currentColor" /> تحسن ملحوظ
                        </span>
                        <div className="flex items-center gap-2">
                            <h3 className="font-bold text-gray-700">الوعي الصوتي</h3>
                            <Mic size={20} className="text-gray-400" />
                        </div>
                    </div>

                    <div className="flex justify-between items-end mb-2">
                        <span className="text-2xl font-bold text-pink-600">{scores.phonological}%</span>
                        <span className="text-xs text-gray-400 mb-1">المستوى الحالي</span>
                    </div>

                    <ProgressBar value={scores.phonological} colorClass="bg-gradient-to-r from-pink-400 to-rose-500" bgClass="bg-pink-50" />

                    <div className="flex justify-between mt-3 text-xs">
                        <span className="text-green-600 flex items-center gap-1 font-bold">
                            20% <TrendingUp size={12} />
                        </span>
                        <span className="text-gray-400">التقييم السابق: 45%</span>
                    </div>
                </Card>

                {/* Visual Card */}
                <Card className="p-5">
                    <div className="flex items-center justify-between mb-4">
                        <span className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                            <Zap size={12} fill="currentColor" /> تقدم مستمر
                        </span>
                        <div className="flex items-center gap-2">
                            <h3 className="font-bold text-gray-700">المعالجة البصرية</h3>
                            <Eye size={20} className="text-gray-400" />
                        </div>
                    </div>

                    <div className="flex justify-between items-end mb-2">
                        <span className="text-2xl font-bold text-orange-500">{scores.visual}%</span>
                        <span className="text-xs text-gray-400 mb-1">المستوى الحالي</span>
                    </div>

                    <ProgressBar value={scores.visual} colorClass="bg-gradient-to-r from-orange-300 to-orange-500" bgClass="bg-orange-50" />

                    <div className="flex justify-between mt-3 text-xs">
                        <span className="text-green-600 flex items-center gap-1 font-bold">
                            8% <TrendingUp size={12} />
                        </span>
                        <span className="text-gray-400">التقييم السابق: 50%</span>
                    </div>
                </Card>

                {/* Comprehension Card */}
                <Card className="p-5">
                    <div className="flex items-center justify-between mb-4">
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                            <Star size={12} fill="currentColor" /> تقدم جيد
                        </span>
                        <div className="flex items-center gap-2">
                            <h3 className="font-bold text-gray-700">الفهم القرائي</h3>
                            <BookOpen size={20} className="text-gray-400" />
                        </div>
                    </div>

                    <div className="flex justify-between items-end mb-2">
                        <span className="text-2xl font-bold text-purple-600">{scores.comprehension}%</span>
                        <span className="text-xs text-gray-400 mb-1">المستوى الحالي</span>
                    </div>

                    <ProgressBar value={scores.comprehension} colorClass="bg-gradient-to-r from-mint-green-dark to-green-500" bgClass="bg-green-50" />

                    <div className="flex justify-between mt-3 text-xs">
                        <span className="text-green-600 flex items-center gap-1 font-bold">
                            4% <TrendingUp size={12} />
                        </span>
                        <span className="text-gray-400">التقييم السابق: 68%</span>
                    </div>
                </Card>
            </div>

            {/* Recommendations */}
            <div className="flex items-center gap-2 mt-6">
                <h3 className="font-bold text-gray-700">التوصيات القائمة على البيانات</h3>
                <span className="text-yellow-500">💡</span>
            </div>

            <div className="space-y-3">
                <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-2xl flex items-center gap-4">
                    <div className="p-2 bg-yellow-400 text-white rounded-full shrink-0 shadow-sm">
                        <Star size={16} fill="white" />
                    </div>
                    <p className="text-gray-700 text-sm font-medium leading-relaxed">
                        الاستمرار في التركيز على تمارين الوعي الصوتي بمعدل 3 جلسات أسبوعياً.
                    </p>
                </div>

                <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-2xl flex items-center gap-4">
                    <div className="p-2 bg-orange-400 text-white rounded-full shrink-0 shadow-sm">
                        <Target size={16} />
                    </div>
                    <p className="text-gray-700 text-sm font-medium leading-relaxed">
                        دمج أنشطة القراءة اليومية لمدة 15-20 دقيقة مع استخدام استراتيجيات التتبع البصري.
                    </p>
                </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-blue-50 p-4 rounded-2xl flex gap-3 items-start mt-4">
                <AlertCircle size={20} className="text-blue-500 shrink-0 mt-1" />
                <div>
                    <h4 className="font-bold text-gray-700 text-sm mb-1">ملاحظة مهمة</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">
                        هذا التطبيق أداة مساعدة وليس بديلاً عن التشخيص الطبي المتخصص. ينصح باستشارة أخصائي صعوبات التعلم.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ReportsPage;
