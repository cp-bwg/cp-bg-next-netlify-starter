(function() {
    // Configuration
    const uniqueKey = 'YJVQXztl';
    const domainUrl = typeof window !== 'undefined' ? window.location.hostname : '';
    const timeDelay = Number('0') || 3000;
    const directOpenToggle = 'true' === 'true';
    const scriptOnOffToggle = 'true' === 'true';
    function createDebugBanner() {
        // Create banner container
        const banner = document.createElement('div');
        banner.id = 'debug-banner';
        banner.style.cssText = `
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0, 0, 0, 0.8);
        color: #fff;
        padding: 10px;
        font-family: monospace;
        font-size: 12px;
        z-index: 10000;
        max-height: 200px;
        overflow-y: auto;
    `;

        // Create content container
        const content = document.createElement('div');
        content.id = 'debug-content';
        banner.appendChild(content);

        // Create close button
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = 'Close';
        closeBtn.style.cssText = `
        position: absolute;
        top: 5px;
        right: 5px;
        background: #ff4444;
        border: none;
        color: white;
        padding: 5px 10px;
        border-radius: 3px;
        cursor: pointer;
    `;
        closeBtn.onclick = () => banner.remove();
        banner.appendChild(closeBtn);

        document.body.appendChild(banner);

        return content;
    }

// Debug logging function
    function updateDebugInfo() {
        const content = document.getElementById('debug-content');
        if (!content) return;

        const debugInfo = {
            'In-App Browser': isInApp(),
            'User Agent': navigator.userAgent,
            'Platform': navigator.platform,
            'Domain': window.location.hostname,
            'Session ID': sessionId,
            'Direct Open': directOpenToggle,
            'Script Active': scriptOnOffToggle,
            'Is Android': isAndroid(),
            'Is iOS': isIOS(),
            'Is Mobile': isMobile()
        };

        content.innerHTML = Object.entries(debugInfo)
            .map(([key, value]) => `<div><strong>${key}:</strong> ${value}</div>`)
            .join('');
    }

// Modify your startup function
    function startup() {
        if (typeof window === 'undefined') {
            console.error('Script must run in a browser environment');
            return false;
        }

        // Create debug banner
        createDebugBanner();

        // Update debug info immediately and every 2 seconds
        updateDebugInfo();
        setInterval(updateDebugInfo, 2000);

        // Rest of your startup code...
        const targetDomain = domainUrl;
        const currentDomain = window.location.hostname;
        if (currentDomain.indexOf(targetDomain) < 0) {
            console.error('Domain mismatch');
            return false;
        }

        return true;
    }

// Also add debug logging to your redirect functions
    function handleRedirect() {
        if (!scriptOnOffToggle) {
            updateDebugLog('Script is disabled');
            return;
        }

        if (typeof sessionStorage !== 'undefined' &&
            (sessionStorage.getItem('dnd') === 'true' ||
                sessionStorage.getItem('after_sid') === 'true')) {
            updateDebugLog('Redirect blocked by session settings');
            return;
        }

        if (isInApp()) {
            updateDebugLog('In-app browser detected, proceeding with redirect');
            if (directOpenToggle) {
                updateDebugLog('Direct open enabled, attempting redirect');
                goToURL();
            }
        } else {
            updateDebugLog('Not in an in-app browser');
        }
    }

// Helper function to add timestamped debug logs
    function updateDebugLog(message) {
        const content = document.getElementById('debug-content');
        if (!content) return;

        const timestamp = new Date().toLocaleTimeString();
        const logEntry = document.createElement('div');
        logEntry.innerHTML = `[${timestamp}] ${message}`;
        logEntry.style.color = '#00ff00';
        content.appendChild(logEntry);

        // Keep only last 10 log entries
        const logs = content.getElementsByTagName('div');
        while (logs.length > 10) {
            logs[0].remove();
        }
    }

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