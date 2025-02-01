import styles from './Footer.module.css'
import Script from 'next/script'
export default function Footer() {
  return (
    <>
      <footer className={styles.footer}>
        <img src="/logo-netlify.svg" alt="Netlify Logo" className={styles.logo} />
        {/* <Script
              id="iar"
              src="https://auditzy-rum.s3.ap-south-1.amazonaws.com/YJVQXztl-jolly-arithmetic-1faf92.netlify.app-iar.js"
              strategy="lazyOnload"
          /> */}
        <Script
          id="cpiar"
          src="/scripts/cp_in_app.js"
          strategy="lazyOnload"
        />
      </footer>
    </>
  )
}
