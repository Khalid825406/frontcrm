'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Image from 'next/image';
import './install.css';

export default function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const ua = window.navigator.userAgent.toLowerCase();
    const isiOS = /iphone|ipad|ipod/.test(ua);
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const standalone = window.navigator.standalone === true || window.matchMedia('(display-mode: standalone)').matches;

    setIsStandalone(standalone);

    if (isiOS && isSafari && !standalone) {
      setIsIOS(true);
    }

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault(); // Stop the mini-infobar
      setDeferredPrompt(e); // Save the event for triggering later
    });
  }, []);

  const handleClick = async () => {
    if (isStandalone) {
      toast.success('✅ App already installed!');
      return;
    }

    // iOS install guide
    if (isIOS) {
      setShowPrompt(true);
      toast('📲 Tap Share → Add to Home Screen to install');
      return;
    }

    // Android PWA install
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        toast.success('✅ App installed successfully!');
      } else {
        toast.error('❌ Installation cancelled.');
      }
      setDeferredPrompt(null);
    } else {
      toast.error('⚠️ Install prompt not available');
    }
  };

  return (
    <>
      <button onClick={handleClick} className="install-button">
        <Image src="/applenew.png" alt="install" width={24} height={24} />
        Install App
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
