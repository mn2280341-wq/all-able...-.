import React from 'react';
import { Outlet } from 'react-router-dom';
import RobotGuide from './components/RobotGuide';

const Layout = () => {
    return (
        <div className="app-container">
            <main className="page-content">
                <Outlet />
            </main>
            <RobotGuide />
        </div>
    );
};

export default Layout;
