import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { useRobot } from '../context/RobotContext';
import { useEffect } from 'react';

const StartPage = () => {
    const [name, setName] = useState('');
    const [grade, setGrade] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { speak, setMood } = useRobot();

    useEffect(() => {
        console.log('StartPage mounted');
        // Initial robot greeting
        setMood('happy');
        speak('أهلاً بك! اكتب اسمك واختار صفك عشان نبدأ رحلتنا.', 'happy');
    }, [speak, setMood]);

    const handleStart = () => {
        console.log('handleStart called');
        console.log('Name:', name);
        console.log('Grade:', grade);

        if (name && grade) {
            console.log('Validation passed, navigating to /intro');
            setError('');
            localStorage.setItem('studentName', name);
            localStorage.setItem('studentGrade', grade);
            console.log('Calling navigate...');
            navigate('/intro');
            console.log('Navigate called');
        } else {
            console.log('Validation failed');
            const errorMsg = 'من فضلك اكتب اسمك واختار صفك أول.';
            setError(errorMsg);
            speak(errorMsg, 'neutral');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-full space-y-8 animate-fade-in">
            <div className="text-center mb-4">
                <h1 className="text-3xl text-[#6A5ACD] mb-2">Smart Reading Coach</h1>
                <h2 className="text-xl text-gray-500">مدرب القراءة الذكي</h2>
            </div>

            <Card className="w-full space-y-6">
                <div>
                    <label className="block text-right mb-2 text-gray-700 font-bold">الاسم الكامل</label>
                    <input
                        type="text"
                        className="w-full p-4 rounded-xl border-2 border-gray-100 bg-gray-50 text-right focus:border-[#87CEEB] focus:bg-white outline-none transition-colors"
                        placeholder="اكتب اسمك هنا..."
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div>
                    <label className="block text-right mb-2 text-gray-700 font-bold">المستوى الدراسي</label>
                    <select
                        className="w-full p-4 rounded-xl border-2 border-gray-100 bg-gray-50 text-right focus:border-[#87CEEB] focus:bg-white outline-none transition-colors appearance-none"
                        value={grade}
                        onChange={(e) => setGrade(e.target.value)}
                    >
                        <option value="" disabled>اختر الصف...</option>
                        <option value="2">الصف الثاني</option>
                        <option value="3">الصف الثالث</option>
                        <option value="4">الصف الرابع</option>
                        <option value="5">الصف الخامس</option>
                        <option value="6">الصف السادس</option>
                    </select>
                </div>

                {error && (
                    <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-center">
                        <p className="text-red-600 font-bold">{error}</p>
                    </div>
                )}

                <Button onClick={handleStart} variant="primary" className="mt-4">
                    متابعة ✨
                </Button>

                <Button onClick={() => navigate('/reports')} variant="outline" className="mt-2 text-gray-500 border-gray-200">
                    عرض التقارير 📊
                </Button>
            </Card>
        </div>
    );
};

export default StartPage;
