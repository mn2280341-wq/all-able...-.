import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useRobot } from '../context/RobotContext';
import { Mic, Eye, BookOpen } from 'lucide-react'; // Icons

const AssessmentItem = ({ title, desc, icon: Icon, color, onClick }) => (
    <button
        onClick={onClick}
        className="w-full bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-all text-right group"
    >
        <div className={`p-4 rounded-full ${color} text-white shrink-0`}>
            <Icon size={24} />
        </div>
        <div className="flex-1">
            <h3 className="font-bold text-lg text-gray-800 mb-1 group-hover:text-[#6A5ACD] transition-colors">{title}</h3>
            <p className="text-gray-500 text-sm">{desc}</p>
        </div>
    </button>
);

const AssessmentPage = () => {
    const navigate = useNavigate();
    const { speak, setMood } = useRobot();

    useEffect(() => {
        setMood('neutral');
        speak('دي محاور التقييم بتاعتنا. هنبدأ بيهم واحد واحد. اضغط على "بدء التقييم" تحت.', 'neutral');
    }, [speak, setMood]);

    return (
        <div className="flex flex-col h-full space-y-6 animate-fade-in p-4">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-purple-100 rounded-full">
                        <span className="text-xl">🎯</span>
                    </div>
                    <h2 className="text-2xl font-bold text-[#6A5ACD]">محاور التقييم</h2>
                </div>
            </div>

            <div className="space-y-4 flex-1 overflow-y-auto pb-24">
                <AssessmentItem
                    title="الوعي الصوتي"
                    desc="تقييم القدرة على التعرف على الأصوات والمقاطع الصوتية"
                    icon={Mic}
                    color="bg-gradient-to-br from-pink-400 to-rose-600"
                    onClick={() => { }}
                />
                <AssessmentItem
                    title="المعالجة البصرية"
                    desc="قياس القدرة على التمييز البصري والتتبع البصري"
                    icon={Eye}
                    color="bg-gradient-to-br from-orange-300 to-orange-500"
                    onClick={() => { }}
                />
                <AssessmentItem
                    title="الفهم القرائي"
                    desc="تقييم القدرة على فهم واستيعاب النصوص المقروءة"
                    icon={BookOpen}
                    color="bg-gradient-to-br from-indigo-400 to-purple-600"
                    onClick={() => { }}
                />
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent w-full max-w-[480px] mx-auto z-10">
                <Button
                    onClick={() => navigate('/assessment/session')}
                    variant="pink"
                    className="w-full"
                >
                    بدء التقييم ✨
                </Button>
            </div>
        </div>
    );
};

export default AssessmentPage;
