import React, { useState } from 'react';
import Dashboard from './pages/Dashboard';
import KnowledgeHub from './pages/KnowledgeHub';
import CreativeStudio from './pages/CreativeStudio';
import Automation from './pages/Automation';
import Analytics from './pages/Analytics';
import MarketingAcademy from './pages/MarketingAcademy';
import PersonaSettings from './pages/PersonaSettings';

function App() {
    const [currentPage, setCurrentPage] = useState('dashboard');

    const renderPage = () => {
        switch (currentPage) {
            case 'dashboard':
                return <Dashboard onNavigate={setCurrentPage} />;
            case 'knowledge':
                return <KnowledgeHub onNavigate={setCurrentPage} />;
            case 'studio':
                return <CreativeStudio onNavigate={setCurrentPage} />;
            case 'automation':
                return <Automation onNavigate={setCurrentPage} />;
            case 'analytics':
                return <Analytics onNavigate={setCurrentPage} />;
            case 'academy':
                return <MarketingAcademy onNavigate={setCurrentPage} />;
            case 'persona':
                return <PersonaSettings onNavigate={setCurrentPage} />;
            default:
                return <Dashboard onNavigate={setCurrentPage} />;
        }
    };

    return (
        <div className="bg-momentum-deep min-h-screen text-white">
            {renderPage()}
        </div>
    );
}

export default App;
