import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface LayoutProps {
    children: React.ReactNode;
    onNavigate: (page: string) => void;
    currentPage: string;
}

const Layout: React.FC<LayoutProps> = ({ children, onNavigate, currentPage }) => {
    return (
        <div className="flex min-h-screen">
            <Sidebar onNavigate={onNavigate} currentPage={currentPage} />
            <main className="flex-1 ml-72 bg-gradient-premium">
                <Header />
                <div className="min-h-[calc(100vh-80px)]">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
