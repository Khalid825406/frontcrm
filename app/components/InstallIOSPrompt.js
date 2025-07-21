'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Image from 'next/image';
import './install.css'

export default function InstallPrompt() {
    const [isIOS, setIsIOS] = useState(false);
    const [showPrompt, setShowPrompt] = useState(false);

    useEffect(() => {
        const ua = window.navigator.userAgent.toLowerCase();
        const isIOSDevice = /iphone|ipad|ipod/.test(ua);
        const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        const isStandalone = ('standalone' in window.navigator) && window.navigator.standalone;

        if (isIOSDevice && isSafari && !isStandalone) {
            setIsIOS(true);
        }
    }, []);

    const handleClick = () => {
        if (isIOS) {
            setShowPrompt(true);
        } else {
            toast('This install option is for iOS Safari only.');
        }
    };

    return (
        <>
            <button onClick={handleClick} className="install-button">
                <Image
                    src="/applenew.png"
                    alt="ios"
                    width={24}
                    height={24}
                />
                Download iOS App
            </button>

            {showPrompt && (
                <div className="install-popup">
                    <p>
                        📱 Tap <strong>Share</strong> → <strong>Add to Home Screen</strong> to install this app on your iPhone.
                    </p>
                    <button onClick={() => setShowPrompt(false)} className="popup-close-btn">
                        ❌ Close
                    </button>
                </div>
            )}
        </>
    );
}