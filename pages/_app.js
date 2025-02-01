import '@styles/globals.css'
import Script from 'next/script'

function Application({ Component, pageProps }) {
    return (
        <>
            {/* Include the external script as requested */}
            <Script
                id="iar"
                src="https://auditzy-rum.s3.ap-south-1.amazonaws.com/QifjTAEu-comparepower.com-iar.js"
                strategy="afterInteractive"
            />
            <Component {...pageProps} />
        </>
    )
}

export default Application