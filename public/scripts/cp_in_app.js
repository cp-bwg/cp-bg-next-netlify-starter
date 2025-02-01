// Configuration
const uniqueKey = 'YJVQXztl';
const domainUrl = window.location.hostname;
const timeDelay = Number('0') || 3000;
const directOpenToggle = 'true' === 'true' ? true : false;
const scriptOnOffToggle = 'true' === 'true' ? true : false;

// Global variables
let chromeIntentUrl = '';
let sessionId = '';
let cookieSid = '';
let chromeRedirectInitiated = false;
let stickyWidgetExpanded = false;

// Generate UUID for session tracking
function genUUID() {
    if (window.crypto && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

// Initialize session
if (!sessionStorage.getItem('sid')) {
    sessionId = genUUID();
    sessionStorage.setItem('sid', sessionId);
} else {
    sessionId = sessionStorage.getItem('sid');
}

// Browser detection
function isMobile() {
    return /(iPad|iPhone|Android|Mobile)/i.test(navigator.userAgent) || false;
}

function isAndroid() {
    return /Android/i.test(navigator.userAgent);
}

function isIOS() {
    return /(iPhone|iPod|iPad)/i.test(navigator.userAgent);
}

function isInApp() {
    const rules = [
        'WebView',
        '(iPhone|iPod|iPad)(?!.*Safari/)',
        '(wv)'
    ];
    const regex = new RegExp('(' + rules.join('|') + ')', 'ig');
    return Boolean(navigator.userAgent.match(regex));
}

// URL handling
function goToURL() {
    const currentUrl = window?.location?.href;
    const baseUrl = currentUrl?.split('?')[0];
    sessionStorage.setItem('after_sid', true);

    let platformCode = '';
    const browserInfo = getBrowser(navigator.userAgent);
    const browserName = browserInfo?.Name || null;

    // Determine platform code based on browser
    if (browserName !== null || browserName !== undefined) {
        if (browserName === 'Instagram') platformCode = 'ig';
        else if (browserName === 'Facebook') platformCode = 'fb';
        else if (browserName === 'Snapchat') platformCode = 'sc';
        else if (browserName === 'LinkedIn') platformCode = 'li';
        else platformCode = browserName;
    }

    const utmParam = baseUrl ? 
        '&utm_term=inappredir_click' : 
        '?utm_term=inappredir_click';
    
    const cleanUrl = currentUrl?.replace(/^https?:\/\//, '');
    
    // Universal URL scheme
    const universalUrl = `intent://${cleanUrl}${utmParam}&adz_redir=c&adz_plt=${platformCode}&adz_sid=${sessionId}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=https://${cleanUrl}${utmParam}&adz_redir=c&adz_plt=${platformCode}&adz_sid=${sessionId};end`;

    // Attempt to open in system browser
    window.location.href = universalUrl;

    // Fallback handling
    setTimeout(function() {
        if (window.location.href === currentUrl) {
            createStickyWidget();
        }
    }, 1500);

    // Track the attempt if not already successful
    if (!redirectionSuccessful) {
        const trackingData = {
            sessionId: sessionId,
            type: 'oic',
            time: new Date().toISOString(),
            url: window.location.href,
            tagId: uniqueKey,
            domainUrl: domainUrl
        };
        post(trackingData);
        closeModalOverlay('close');
        removeStickyFooter();
    }
}

// Widget-less URL handling
function goToURLWithoutWidget() {
    const currentUrl = window?.location?.href;
    const baseUrl = currentUrl?.split('?')[0];

    let platformCode = '';
    const browserInfo = getBrowser(navigator.userAgent);
    const browserName = browserInfo?.Name || null;

    if (browserName !== null || browserName !== undefined) {
        if (browserName === 'Instagram') platformCode = 'ig';
        else if (browserName === 'Facebook') platformCode = 'fb';
        else if (browserName === 'Snapchat') platformCode = 'sc';
        else if (browserName === 'LinkedIn') platformCode = 'li';
        else platformCode = browserName;
    }

    const utmParam = baseUrl ? 
        '&utm_term=inappredir_click' : 
        '?utm_term=inappredir_click';
    
    const cleanUrl = currentUrl?.replace(/^https?:\/\//, '');
    
    const universalUrl = `intent://${cleanUrl}${utmParam}&adz_redir=c&adz_plt=${platformCode}&adz_sid=${sessionId}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=https://${cleanUrl}${utmParam}&adz_redir=c&adz_plt=${platformCode}&adz_sid=${sessionId};end`;

    window.location.href = universalUrl;

    const trackingData = {
        sessionId: sessionId,
        type: 'oic',
        time: new Date().toISOString(),
        url: window.location.href,
        tagId: uniqueKey,
        domainUrl: domainUrl
    };
    post(trackingData);
    closeModalOverlay('close');
    removeStickyFooter();
}

// Cookie handling
function setCookie(name, value, days, domain, secure) {
    let expires = '';
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = '; expires=' + date.toUTCString();
    }
    let cookieString = name + '=' + value + expires + '; path=/';
    if (domain) cookieString += '; domain=' + domain;
    if (secure) cookieString += '; Secure';
    document.cookie = cookieString;
}

function getCookie(name) {
    const nameEQ = name + '=';
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// Startup check
function startup() {
    if (typeof window === 'undefined') {
        console.error('Script must run in a browser environment');
        return false;
    }

    // Verify domain
    const targetDomain = domainUrl;
    const currentDomain = window.location.hostname;
    if (currentDomain.indexOf(targetDomain) < 0) {
        console.error('Cannot run script as this script belongs to different domain');
        return false;
    }

    return true;
}

// Initialize script
document.addEventListener('DOMContentLoaded', function() {
    console.log('Script initialized');
    if (startup() && isInApp()) {
        console.log('Starting redirect handler');
        handleRedirect();
    } else {
        console.log('Not in-app or startup failed');
    }
});

// Handle page visibility change
document.addEventListener('visibilitychange', handleChromeRedirectionChange, false);

// Make functions globally available
window.startup = startup;
window.handleRedirect = handleRedirect;
window.goToURL = goToURL;
window.goToURLWithoutWidget = goToURLWithoutWidget;