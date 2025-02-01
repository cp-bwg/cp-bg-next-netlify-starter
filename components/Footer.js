import styles from './Footer.module.css'
import Script from 'next/script'

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <img src="/logo-netlify.svg" alt="Netlify Logo" className={styles.logo} />
            <Script
                id="cpiar"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
            const testDiv = document.createElement('div');
            testDiv.style.cssText = 'position: fixed; bottom: 0; left: 0; right: 0; background: black; color: white; padding: 10px; z-index: 9999;';
            testDiv.innerHTML = 'Running initial script test';
            document.body.appendChild(testDiv);
          `,
                }}
            />
            <Script
                id="cp_in_app"
                src="/scripts/cp_in_app.js"
                strategy="afterInteractive"
                onLoad={() => {
                    console.log('Script loaded')
                    const loadDiv = document.createElement('div');
                    loadDiv.style.cssText = 'position: fixed; bottom: 50px; left: 0; right: 0; background: green; color: white; padding: 10px; z-index: 9999;';
                    loadDiv.innerHTML = 'External script loaded';
                    document.body.appendChild(loadDiv);
                }}
            />
        </footer>
    )
}