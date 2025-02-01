(function() {
    console.log('Debug script starting');

    // Create immediate visual feedback
    const debugBanner = document.createElement('div');
    debugBanner.id = 'debug-banner';
    debugBanner.style.cssText = `
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0, 0, 0, 0.9);
        color: #fff;
        padding: 10px;
        font-family: monospace;
        font-size: 14px;
        z-index: 10000;
    `;
    document.body.appendChild(debugBanner);

    // Core detection function
    function isInApp() {
        if (typeof navigator === 'undefined') return false;

        console.log('Checking user agent:', navigator.userAgent);

        const rules = [
            'WebView',
            'Instagram',
            'FBAN',
            'FBAV',
            'FB4A',
            'FBIOS',
            '(iPhone|iPod|iPad)(?!.*Safari/)',
            '(wv)',
            'Line',
            'Snapchat',
            'LinkedInApp'
        ];

        const regex = new RegExp('(' + rules.join('|') + ')', 'ig');
        const result = Boolean(navigator.userAgent.match(regex));

        console.log('In-app detection result:', result);
        updateDebugDisplay('In-app check:', result);
        return result;
    }

    // Simple URL redirect
    function redirectToBrowser() {
        const currentUrl = window.location.href;
        const universalUrl = `intent://${currentUrl.replace(/^https?:\/\//, '')}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${currentUrl};end`;

        updateDebugDisplay('Attempting redirect to:', universalUrl);
        window.location.href = universalUrl;
    }

    // Update debug display
    function updateDebugDisplay(label, value) {
        const content = document.createElement('div');
        content.innerHTML = `<strong>${label}</strong> ${value}`;
        debugBanner.appendChild(content);
    }

    // Main execution
    function init() {
        updateDebugDisplay('UserAgent:', navigator.userAgent);

        if (isInApp()) {
            updateDebugDisplay('Status:', 'In-app browser detected, will redirect');
            redirectToBrowser();
        } else {
            updateDebugDisplay('Status:', 'Not in-app browser, no action needed');
        }
    }

    // Start execution
    console.log('Initializing...');
    init();
})();