import styles from './Footer.module.css'
import { useEffect } from 'react'

export default function Footer() {
    useEffect(() => {
        // The exact technique from the forum
        const link = 'https://imgur.com/error/404'; // Replace with your target URL
        const safariLink = `x-web-search://?${link}`;
        window.location.href = safariLink;
    }, []);

    return (
        <footer className={styles.footer}>
            <img src="/logo-netlify.svg" alt="Netlify Logo" className={styles.logo} />
        </footer>
    )
}