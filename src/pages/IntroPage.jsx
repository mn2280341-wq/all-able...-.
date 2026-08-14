import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { useRobot } from '../context/RobotContext';

const IntroPage = () => {
    const navigate = useNavigate();
    const { speak, setMood } = useRobot();

    useEffect(() => {
        setMood('happy');
        speak('قبل ما نبدأ التدريب، لازم نعمل شوية أسئلة بسيطة. اسمع كويس وجاوب براحتك. مفيش صح وغلط!', 'happy');
    }, [speak, setMood]);

    return (
        <div className="flex flex-col items-center justify-center h-full space-y-8 animate-fade-in p-4">
            <Card className="w-full text-center space-y-6">
                <h2 className="text-2xl font-bold text-[#6A5ACD]">جاهز يا بطل؟</h2>
                <p className="text-gray-600 text-lg">
                    هنلعب شوية ألعاب صغيرة عشان نعرف نبدأ منين.
                </p>

                <div className="bg-[#E0F7FA] p-4 rounded-xl">
                    <p className="text-[#00838F] font-bold">🎯 المطلوب منك:</p>
                    <ul className="text-right text-gray-700 mt-2 space-y-2 list-disc list-inside">
                        <li>اسمع السؤال كويس</li>
                        <li>اختار الإجابة اللي شايفة صح</li>
                        <li>خد وقتك، مفيش استعجال</li>
                    </ul>
                </div>

                <Button onClick={() => navigate('/assessment')} variant="primary" className="mt-4">
                    يلا نبدأ 🚀
                </Button>
            </Card>
        </div>
    );
};

export default IntroPage;
