import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { assessmentData } from '../data/assessmentData';
import { useRobot } from '../context/RobotContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const AssessmentSession = () => {
    const navigate = useNavigate();
    const { speak, setMood } = useRobot();

    // Combine all questions into a single flow
    const allQuestions = useMemo(() => {
        const q = [];
        ['phonological', 'visual', 'comprehension'].forEach(axis => {
            assessmentData[axis].questions.forEach(item => {
                q.push({ ...item, axis });
            });
        });
        return q;
    }, []);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [results, setResults] = useState([]);
    const [startTime, setStartTime] = useState(Date.now());
    const [isPlayingAudio, setIsPlayingAudio] = useState(false);

    const currentQuestion = allQuestions[currentIndex];
    const isLast = currentIndex === allQuestions.length - 1;

    // Audio playback function
    const speakQuestion = () => {
        if (!currentQuestion) return;

        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        // If audio file exists, play it
        if (currentQuestion.audio) {
            setIsPlayingAudio(true);
            const audio = new Audio(currentQuestion.audio);
            audio.onended = () => setIsPlayingAudio(false);
            audio.onerror = () => {
                setIsPlayingAudio(false);
                console.error('Failed to load audio file:', currentQuestion.audio);
            };
            audio.play().catch(err => {
                console.error('Audio playback failed:', err);
                setIsPlayingAudio(false);
            });
        }
        // Otherwise use text-to-speech
        else if (currentQuestion.audioText) {
            const utterance = new SpeechSynthesisUtterance(currentQuestion.audioText);
            utterance.lang = 'ar-SA'; // Arabic language
            utterance.rate = 0.9; // Slightly slower for clarity
            utterance.pitch = 1.1; // Slightly higher pitch for children

            utterance.onstart = () => setIsPlayingAudio(true);
            utterance.onend = () => setIsPlayingAudio(false);
            utterance.onerror = () => setIsPlayingAudio(false);

            window.speechSynthesis.speak(utterance);
        }
    };

    useEffect(() => {
        if (currentQuestion) {
            setMood('neutral');

            // Auto-play audio for questions with audio files or audioText
            if (currentQuestion.audio || currentQuestion.audioText) {
                // Small delay to ensure smooth transition
                setTimeout(() => {
                    speakQuestion();
                }, 500);
            } else {
                // For other questions, just encourage
                speak('اقرأ السؤال كويس واختار الإجابة.', 'neutral');
            }

            setStartTime(Date.now());
        }

        // Cleanup: stop any ongoing speech when component unmounts or question changes
        return () => {
            window.speechSynthesis.cancel();
        };
    }, [currentIndex, currentQuestion, speak, setMood]);

    const handleAnswer = (optionId) => {
        const timeTaken = (Date.now() - startTime) / 1000;
        const isCorrect = optionId === currentQuestion.correct;

        // Save result
        const result = {
            questionId: currentQuestion.id,
            axis: currentQuestion.axis,
            isCorrect,
            timeTaken,
            attempts: 1 // Prototype assumes 1 attempt per screen
        };

        const newResults = [...results, result];
        setResults(newResults);

        if (isLast) {
            finishAssessment(newResults);
        } else {
            setCurrentIndex(prev => prev + 1);
        }
    };

    const finishAssessment = (finalResults) => {
        // Calculate scores per axis
        const scores = { phonological: 0, visual: 0, comprehension: 0 };
        const counts = { phonological: 0, visual: 0, comprehension: 0 };

        finalResults.forEach(r => {
            counts[r.axis]++;
            if (r.isCorrect) scores[r.axis]++;
        });

        const finalReport = {
            date: new Date().toISOString(),
            scores,
            counts,
            levels: {
                phonological: getLevel(scores.phonological, counts.phonological),
                visual: getLevel(scores.visual, counts.visual),
                comprehension: getLevel(scores.comprehension, counts.comprehension)
            }
        };

        localStorage.setItem('assessmentReport', JSON.stringify(finalReport));
        speak('ممتاز! خلصنا التقييم. تعال نشوف النتيجة.', 'happy');
        navigate('/reports');
    };

    const getLevel = (score, total) => {
        const percentage = score / total;
        if (percentage < 0.5) return 'ضعيف';
        if (percentage < 0.8) return 'متوسط';
        return 'متقدم';
    };

    if (!currentQuestion) return <div>Loading...</div>;

    const currentAxisTitle = assessmentData[currentQuestion.axis].title;

    return (
        <div className="flex flex-col h-full space-y-4 animate-fade-in p-2">
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <div
                    className="bg-[#87CEEB] h-full transition-all duration-500"
                    style={{ width: `${((currentIndex + 1) / allQuestions.length) * 100}%` }}
                />
            </div>

            <div className="text-center">
                <span className="text-xs font-bold text-gray-400">{currentAxisTitle}</span>
            </div>

            <Card className="flex-1 flex flex-col justify-center space-y-8">
                <div className="flex items-center justify-between gap-4">
                    <h2 className="text-2xl font-bold text-center text-[#6A5ACD] leading-relaxed flex-1">
                        {currentQuestion.text}
                    </h2>

                    {/* Speaker button for questions with audio */}
                    {(currentQuestion.audio || currentQuestion.audioText) && (
                        <button
                            onClick={speakQuestion}
                            disabled={isPlayingAudio}
                            className={`shrink-0 p-4 rounded-full transition-all ${isPlayingAudio
                                ? 'bg-[#87CEEB] text-white animate-pulse'
                                : 'bg-gray-100 text-gray-600 hover:bg-[#87CEEB] hover:text-white active:scale-95'
                                }`}
                            title="اسمع السؤال"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                                <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                            </svg>
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {currentQuestion.options.map(opt => (
                        <button
                            key={opt.id}
                            onClick={() => handleAnswer(opt.id)}
                            className="p-6 rounded-[20px] bg-gray-50 border-2 border-transparent hover:border-[#87CEEB] hover:bg-white hover:shadow-md transition-all text-xl font-bold text-gray-700 active:scale-95"
                        >
                            {opt.text}
                        </button>
                    ))}
                </div>
            </Card>
        </div>
    );
};

export default AssessmentSession;
