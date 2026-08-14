import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useRobot } from '../context/RobotContext';
import { Mic, Eye, BookOpen, Lock, Play } from 'lucide-react';

const TrainingPage = () => {
    const navigate = useNavigate();
    const { speak, setMood } = useRobot();
    const [weakestAxis, setWeakestAxis] = useState(null);

    useEffect(() => {
        const saved = localStorage.getItem('assessmentReport');
        if (saved) {
            const report = JSON.parse(saved);

            // Find weakest axis
            // Calculate scores
            const pScore = report.scores.phonological / report.counts.phonological;
            const vScore = report.scores.visual / report.counts.visual;
            const cScore = report.scores.comprehension / report.counts.comprehension;

            const scores = [
                { id: 'phonological', score: pScore, title: 'الوعي الصوتي' },
                { id: 'visual', score: vScore, title: 'المعالجة البصرية' },
                { id: 'comprehension', score: cScore, title: 'الفهم القرائي' }
            ];

            scores.sort((a, b) => a.score - b.score);
            const weakest = scores[0];
            setWeakestAxis(weakest);

            setMood('happy');
            speak(`بناءً على التقييم، هنبدأ بتمارين ${weakest.title} عشان نبقى أقوى!`, 'happy');
        } else {
            // Mock data if no report exists for dev
            setWeakestAxis({ id: 'phonological', title: 'الوعي الصوتي' });
        }
    }, [speak, setMood]);

    if (!weakestAxis) return null;

    return (
        <div className="flex flex-col h-full space-y-6 animate-fade-in p-4 pb-24">
            <div className="bg-gradient-to-r from-[#2ecc71] to-[#27ae60] text-white p-6 rounded-3xl shadow-lg relative overflow-hidden">
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl bg-white/20 p-2 rounded-full">🎯</span>
                        <h2 className="text-2xl font-bold">برنامج التدريب التكيفي</h2>
                    </div>

                    <p className="text-green-50 text-sm leading-relaxed">
                        يتكيف البرنامج التدريبي مع مستواك الحالي ويقدم تمارين مخصصة.
                    </p>
                </div>
                <div className="absolute -right-6 -bottom-10 w-32 h-32 bg-white opacity-10 rounded-full" />
                <div className="absolute -left-6 -top-10 w-24 h-24 bg-white opacity-10 rounded-full" />
            </div>

            <div className="flex items-center gap-2 mt-4">
                <h3 className="font-bold text-gray-700">المحاور التدريبية</h3>
                <div className="flex-1 h-[1px] bg-gray-200"></div>
                <span className="text-xs text-gray-400">كتب</span>
            </div>

            <div className="space-y-4">
                {/* Active Module */}
                <Card className="border-2 border-mint-green ring-4 ring-green-50 relative overflow-hidden">
                    <div className="absolute top-0 left-0 bg-gradient-to-l from-mint-green-dark to-green-500 text-white px-3 py-1 rounded-br-xl text-xs font-bold shadow-sm">
                        موصى به لك 🔥
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="flex items-start gap-4">
                            <div className={`p-4 rounded-2xl text-white shadow-md ${weakestAxis.id === 'phonological' ? 'bg-gradient-to-br from-pink-400 to-rose-600' :
                                    weakestAxis.id === 'visual' ? 'bg-gradient-to-br from-orange-300 to-orange-500' :
                                        'bg-gradient-to-br from-indigo-400 to-purple-600'
                                }`}>
                                {weakestAxis.id === 'phonological' ? <Mic size={28} /> :
                                    weakestAxis.id === 'visual' ? <Eye size={28} /> : <BookOpen size={28} />}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-lg mb-1 text-gray-800">{weakestAxis.title}</h3>
                                <p className="text-gray-500 text-sm">
                                    12 جلسة تدريبية لتطوير المهارات.
                                </p>
                            </div>
                        </div>

                        <Button onClick={() => alert('Start Session Prototype')} variant="pink" className="py-3 text-sm w-full">
                            بدء التدريب ✨
                        </Button>
                    </div>
                </Card>

                {/* Locked Modules */}
                {['phonological', 'visual', 'comprehension'].filter(id => id !== weakestAxis.id).map(id => (
                    <Card key={id} className="opacity-70 bg-gray-50 border-gray-100">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-gray-200 text-gray-400 rounded-xl">
                                <Lock size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-500">
                                    {id === 'phonological' ? 'تدريب الوعي الصوتي' : id === 'visual' ? 'تدريب المعالجة البصرية' : 'تدريب الفهم القرائي'}
                                </h3>
                                <p className="text-xs text-gray-400 mt-1">10 جلسات تدريبية</p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default TrainingPage;
