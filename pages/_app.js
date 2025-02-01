import '@styles/globals.css'
import Script from 'next/script'

function Application({ Component, pageProps }) {
    return (
        <>
            <Component {...pageProps} />

            {/* Add the script in the footer */}
            <Script
                id="iar"
                src="https://auditzy-rum.s3.ap-south-1.amazonaws.com/QifjTAEu-comparepower.com-iar.js"
                strategy="lazyOnload"
            />
        </>
    )
}

export default Application
