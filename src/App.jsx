import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RobotProvider } from './context/RobotContext';
import Layout from './Layout';
import StartPage from './pages/StartPage';
import IntroPage from './pages/IntroPage';
import AssessmentPage from './pages/AssessmentPage';
import AssessmentSession from './pages/AssessmentSession';
import ReportsPage from './pages/ReportsPage';
import TrainingPage from './pages/TrainingPage';

function App() {
  return (
    <RobotProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<StartPage />} />
            <Route path="intro" element={<IntroPage />} />
            <Route path="assessment" element={<AssessmentPage />} />
            <Route path="assessment/session" element={<AssessmentSession />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="training" element={<TrainingPage />} />
            {/* Catch all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </RobotProvider>
  );
}

export default App;
