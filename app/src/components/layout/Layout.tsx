import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface LayoutProps {
    children: React.ReactNode;
    onNavigate: (page: string) => void;
    currentPage: string;
}

const Layout: React.FC<LayoutProps> = ({ children, onNavigate, currentPage }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    return (
        <div className="flex min-h-screen bg-[#020617]">
            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/80 z-40 lg:hidden backdrop-blur-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            <Sidebar
                onNavigate={(page) => {
                    onNavigate(page);
                    setIsMobileMenuOpen(false);
                }}
                currentPage={currentPage}
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
            />

            <main className="flex-1 lg:ml-72 bg-gradient-premium transition-all duration-300">
                <Header onToggleMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
                <div className="min-h-[calc(100vh-80px)] overflow-x-hidden">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
