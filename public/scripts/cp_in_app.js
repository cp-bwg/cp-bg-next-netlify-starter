(function() {
    // Configuration
    const uniqueKey = 'YJVQXztl';
    const domainUrl = typeof window !== 'undefined' ? window.location.hostname : '';
    const timeDelay = Number('0') || 3000;
    const directOpenToggle = 'true' === 'true';
    const scriptOnOffToggle = 'true' === 'true';

    // Global variables
    let sessionId = '';
    let chromeRedirectInitiated = false;
    let stickyWidgetExpanded = false;
    let redirectionSuccessful = false;

    // Browser detection utils
    function getBrowser(userAgent) {
        const browsers = {
            Instagram: /Instagram/i,
            Facebook: /FBAN|FBAV/i,
            Snapchat: /Snapchat/i,
            LinkedIn: /LinkedIn/i,
            Chrome: /Chrome/i,
            Safari: /Safari/i
        };

        for (const [name, regex] of Object.entries(browsers)) {
            if (regex.test(userAgent)) {
                return { Name: name };
            }
        }
        return { Name: 'Unknown' };
    }

    function isMobile() {
        return typeof navigator !== 'undefined' &&
            (/(iPad|iPhone|Android|Mobile)/i.test(navigator.userAgent) || false);
    }

    function isAndroid() {
        return typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent);
    }

    function isIOS() {
        return typeof navigator !== 'undefined' &&
            /(iPhone|iPod|iPad)/i.test(navigator.userAgent);
    }

    function isInApp() {
        if (typeof navigator === 'undefined') return false;

        const rules = [
            'WebView',
            '(iPhone|iPod|iPad)(?!.*Safari/)',
            '(wv)'
        ];
        const regex = new RegExp('(' + rules.join('|') + ')', 'ig');
        return Boolean(navigator.userAgent.match(regex));
    }

    // Session management
    function genUUID() {
        if (typeof window !== 'undefined' && window.crypto && typeof crypto.randomUUID === 'function') {
            return crypto.randomUUID();
        }
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }

    function initSession() {
        if (typeof sessionStorage === 'undefined') return;

        if (!sessionStorage.getItem('sid')) {
            sessionId = genUUID();
            sessionStorage.setItem('sid', sessionId);
        } else {
            sessionId = sessionStorage.getItem('sid');
        }
    }

    // Tracking and analytics
    function post(data) {
        try {
            fetch('/api/track', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
        } catch (error) {
            console.error('Tracking failed:', error);
        }
    }

    // URL handling
    function goToURL() {
        if (typeof window === 'undefined') return;

        const currentUrl = window.location.href;
        const baseUrl = currentUrl?.split('?')[0];

        if (typeof sessionStorage !== 'undefined') {
            sessionStorage.setItem('after_sid', 'true');
        }

        const platformCode = getPlatformCode();
        const utmParam = baseUrl ?
            '&utm_term=inappredir_click' :
            '?utm_term=inappredir_click';

        const cleanUrl = currentUrl?.replace(/^https?:\/\//, '');
        const universalUrl = `intent://${cleanUrl}${utmParam}&adz_redir=c&adz_plt=${platformCode}&adz_sid=${sessionId}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=https://${cleanUrl}${utmParam}&adz_redir=c&adz_plt=${platformCode}&adz_sid=${sessionId};end`;

        window.location.href = universalUrl;

        // Track the attempt
        const trackingData = {
            sessionId: sessionId,
            type: 'oic',
            time: new Date().toISOString(),
            url: window.location.href,
            tagId: uniqueKey,
            domainUrl: domainUrl
        };
        post(trackingData);
    }

    function goToURLWithoutWidget() {
        goToURL();
    }

    function getPlatformCode() {
        if (typeof navigator === 'undefined') return '';

        if (navigator.userAgent.includes('Instagram')) return 'ig';
        if (navigator.userAgent.includes('FBAN') || navigator.userAgent.includes('FBAV')) return 'fb';
        if (navigator.userAgent.includes('Snapchat')) return 'sc';
        if (navigator.userAgent.includes('LinkedIn')) return 'li';
        return 'other';
    }

    // Core functionality
    function handleRedirect() {
        if (!scriptOnOffToggle) return;

        if (typeof sessionStorage !== 'undefined' &&
            (sessionStorage.getItem('dnd') === 'true' ||
                sessionStorage.getItem('after_sid') === 'true')) {
            return;
        }

        if (isInApp()) {
            console.log('In-app browser detected');
            if (directOpenToggle) {
                console.log('Direct open enabled, attempting redirect');
                goToURL();
            }
        }
    }

    function handleChromeRedirectionChange() {
        if (document.hidden) {
            chromeRedirectInitiated = true;
        }
    }

    // Startup
    function startup() {
        if (typeof window === 'undefined') {
            console.error('Script must run in a browser environment');
            return false;
        }

        initSession();

        const targetDomain = domainUrl;
        const currentDomain = window.location.hostname;
        if (currentDomain.indexOf(targetDomain) < 0) {
            console.error('Domain mismatch');
            return false;
        }

        return true;
    }

    // Initialize when DOM is ready
    if (typeof document !== 'undefined') {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                console.log('DOM Content Loaded');
                startup() && handleRedirect();
            });
        } else {
            console.log('Document already ready');
            startup() && handleRedirect();
        }

        document.addEventListener('visibilitychange', handleChromeRedirectionChange, false);
    }

    // Make necessary functions globally available
    if (typeof window !== 'undefined') {
        window.handleRedirect = handleRedirect;
        window.goToURL = goToURL;
        window.goToURLWithoutWidget = goToURLWithoutWidget;
        window.isInApp = isInApp;
        window.startup = startup;
    }
})();