import styles from './Footer.module.css'
import { useEffect } from 'react'

export default function Footer() {
    useEffect(() => {
        // Debug display
        const debugDiv = document.createElement('div');
        debugDiv.style.cssText = `
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba(0, 0, 0, 0.9);
      color: #fff;
      padding: 10px;
      font-family: monospace;
      font-size: 14px;
      z-index: 10000;
    `;
        document.body.appendChild(debugDiv);

        function updateDebug(msg) {
            debugDiv.innerHTML += `<div>${msg}</div>`;
        }

        if (typeof window !== 'undefined') {
            const currentUrl = window.location.href;

            // Add the special parameters that help force external browser
            const urlWithParams = new URL(currentUrl);
            urlWithParams.searchParams.set('inapp', 'true');
            urlWithParams.searchParams.set('fbclid', 'IwAR' + Math.random().toString(36).substring(7));

            const cleanUrl = urlWithParams.toString().replace(/^https?:\/\//, '');

            // Construct intent URL with the additional parameters
            const intentUrl = `intent://${cleanUrl}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=https://${cleanUrl};end`;

            updateDebug(`Original URL: ${currentUrl}`);
            updateDebug(`Modified URL: ${urlWithParams.toString()}`);
            updateDebug(`Intent URL: ${intentUrl}`);

            // Force the redirect
            window.location.href = intentUrl;
        }
    }, []);

    return (
        <footer className={styles.footer}>
            <img src="/logo-netlify.svg" alt="Netlify Logo" className={styles.logo} />
        </footer>
    )
}