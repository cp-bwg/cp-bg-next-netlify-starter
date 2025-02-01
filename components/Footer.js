import styles from './Footer.module.css'
import Script from 'next/script'

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <img src="/logo-netlify.svg" alt="Netlify Logo" className={styles.logo} />
            <Script
                id="cpiar"
                src="/scripts/cp_in_app.js"
                strategy="afterInteractive"
                onLoad={() => {
                    console.log('Script loaded successfully')
                    if (typeof window !== 'undefined' && window.handleRedirect) {
                        window.handleRedirect()
                    }
                }}
                onError={(e) => {
                    console.error('Script failed to load:', e)
                }}
            />
        </footer>
    )
}