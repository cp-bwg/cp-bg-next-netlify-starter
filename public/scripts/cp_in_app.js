// Unified browser opening handler
function goToURL() {
    const currentUrl = window?.location?.href;
    const baseUrl = currentUrl?.split('?')[0];
    sessionStorage.setItem('after_sid', true);

    let platformCode = '';
    const browserInfo = getBrowser(userAgent);
    const browserName = browserInfo?.Name || null;

    if (browserName !== null || browserName !== undefined) {
        if (browserName === 'Instagram') {
            platformCode = 'ig';
        } else if (browserName === 'Facebook') {
            platformCode = 'fb';
        } else if (browserName === 'Snapchat') {
            platformCode = 'sc';
        } else if (browserName === 'LinkedIn') {
            platformCode = 'li';
        } else {
            platformCode = browserName;
        }
    }

    const utmParam = baseUrl ? 
        '&utm_term=inappredir_click' : 
        '?utm_term=inappredir_click';
    
    const cleanUrl = currentUrl?.replace(/^https?:\/\//, '');
    
    // Unified URL scheme for both iOS and Android
    const universalUrl = `intent://${cleanUrl}${utmParam}&adz_redir=c&adz_plt=${platformCode}&adz_sid=${sessionId}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=https://${cleanUrl}${utmParam}&adz_redir=c&adz_plt=${platformCode}&adz_sid=${sessionId};end`;
    
    window.location.href = universalUrl;

    // Fallback for devices that don't support the intent scheme
    setTimeout(function() {
        if (window.location.href === currentUrl) {
            createStickyWidget();
        }
    }, 1500);

    // Track the attempt
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

// Update the widget-less opening function to use the same method
function goToURLWithoutWidget() {
    const currentUrl = window?.location?.href;
    const baseUrl = currentUrl?.split('?')[0];

    let platformCode = '';
    const browserInfo = getBrowser(userAgent);
    const browserName = browserInfo?.Name || null;

    if (browserName !== null || browserName !== undefined) {
        if (browserName === 'Instagram') {
            platformCode = 'ig';
        } else if (browserName === 'Facebook') {
            platformCode = 'fb';
        } else if (browserName === 'Snapchat') {
            platformCode = 'sc';
        } else if (browserName === 'LinkedIn') {
            platformCode = 'li';
        } else {
            platformCode = browserName;
        }
    }

    const utmParam = baseUrl ? 
        '&utm_term=inappredir_click' : 
        '?utm_term=inappredir_click';
    
    const cleanUrl = currentUrl?.replace(/^https?:\/\//, '');
    
    // Use the same universal URL scheme
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