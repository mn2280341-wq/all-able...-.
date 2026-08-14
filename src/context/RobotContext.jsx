import { createContext, useContext, useState, useCallback } from 'react';

const RobotContext = createContext();

export const RobotProvider = ({ children }) => {
  const [state, setState] = useState({
    message: null,
    mood: 'neutral', // neutral, happy, thinking, pointing
    isVisible: true,
  });

  const speak = useCallback((message, mood = 'neutral') => {
    setState(prev => ({ ...prev, message, mood, isVisible: true }));
  }, []);

  const setMood = useCallback((mood) => {
    setState(prev => ({ ...prev, mood }));
  }, []);

  const hide = useCallback(() => {
    setState(prev => ({ ...prev, isVisible: false }));
  }, []);

  const show = useCallback(() => {
    setState(prev => ({ ...prev, isVisible: true }));
  }, []);

  return (
    <RobotContext.Provider value={{ ...state, speak, setMood, hide, show }}>
      {children}
    </RobotContext.Provider>
  );
};

export const useRobot = () => {
  const context = useContext(RobotContext);
  if (!context) {
    throw new Error('useRobot must be used within a RobotProvider');
  }
  return context;
};
