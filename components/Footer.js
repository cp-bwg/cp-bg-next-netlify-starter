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
                    console.log('✅ Script loaded successfully')
                    // Add debug info
                    console.log('🔍 Window functions available:', {
                        handleRedirect: typeof window.handleRedirect === 'function',
                        goToURL: typeof window.goToURL === 'function',
                        isInApp: typeof window.isInApp === 'function'
                    })
                    // Check if we're in an in-app browser
                    if (typeof window.isInApp === 'function') {
                        console.log('📱 In-app browser check:', window.isInApp())
                    }
                    // Try to execute redirect if available
                    if (typeof window.handleRedirect === 'function') {
                        console.log('🚀 Attempting redirect...')
                        window.handleRedirect()
                    }
                }}
                onError={(e) => {
                    console.error('❌ Script failed to load:', e)
                }}
            />
        </footer>
    )
}