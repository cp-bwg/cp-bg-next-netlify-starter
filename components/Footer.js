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

        function updateDebug(msg) {
            debugDiv.innerHTML += `<div>${msg}</div>`;
        }
        document.body.appendChild(debugDiv);

        // THIS IS THE KEY PART - Using their exact technique
        const currentDomain = window.location.hostname;
        const link = `https://${currentDomain}`;
        const safariLink = `x-web-search://${link}`;

        updateDebug(`Current domain: ${currentDomain}`);
        updateDebug(`Link: ${link}`);
        updateDebug(`Safari link: ${safariLink}`);

        // Sequence the redirects
        setTimeout(() => {
            // First try direct Safari
            window.location.href = `safari-https://${currentDomain}`;

            // Then try x-web-search
            setTimeout(() => {
                window.location.href = safariLink;

                // Finally try intent
                setTimeout(() => {
                    const intentUrl = `intent://${currentDomain}#Intent;scheme=https;package=com.android.chrome;end`;
                    window.location.href = intentUrl;
                }, 100);
            }, 100);
        }, 100);

    }, []);

    return (
        <footer className={styles.footer}>
            <img src="/logo-netlify.svg" alt="Netlify Logo" className={styles.logo} />
        </footer>
    )
}