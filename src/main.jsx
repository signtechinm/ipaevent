import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import App from './App.jsx';

function SiteRoot() {
    const showPublicLoader = !window.location.pathname.startsWith('/admin');
    const [isLoading, setIsLoading] = useState(showPublicLoader);
    const [isLeaving, setIsLeaving] = useState(false);

    useEffect(() => {
        if (!showPublicLoader) {
            return undefined;
        }

        const minimumTimer = window.setTimeout(() => {
            setIsLeaving(true);
            window.setTimeout(() => setIsLoading(false), 500);
        }, 1000);

        return () => window.clearTimeout(minimumTimer);
    }, [showPublicLoader]);

    return (
        <>
            {isLoading && (
                <div className={`site-loader ${isLeaving ? 'site-loader-leaving' : ''}`} role="status" aria-label="Loading website">
                    <div className="site-loader-content">
                        <img
                            src="/images/nsc-event-loader.gif"
                            alt="14th IPA National Students Congress loading"
                            className="site-loader-image"
                        />
                        <p className="site-loader-text">Preparing the congress experience</p>
                    </div>
                </div>
            )}
            <App />
        </>
    );
}

createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <SiteRoot />
    </React.StrictMode>
);
