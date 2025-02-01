import '@styles/globals.css'
import Script from 'next/script'

function Application({ Component, pageProps }) {
    return (
        <>
            <Component {...pageProps} />
        </>
    )
}

export default Application
