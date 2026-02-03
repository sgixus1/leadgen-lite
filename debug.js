// GEN Debug Bookmarklet - "If we can't find it, we build it"
// Loaded by bookmarklet to debug any website

(function() {
    // Create debug panel
    var debugPanel = document.createElement('div');
    debugPanel.id = 'gen-debug-panel';
    debugPanel.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        width: 400px;
        max-height: 80vh;
        background: white;
        border: 2px solid #007bff;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        z-index: 999999;
        font-family: Arial, sans-serif;
        font-size: 14px;
        overflow: hidden;
        resize: both;
        overflow: auto;
    `;
    
    // Panel header
    var header = document.createElement('div');
    header.style.cssText = `
        background: #007bff;
        color: white;
        padding: 15px;
        font-weight: bold;
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: move;
    `;
    header.innerHTML = `
        <span>🔍 GEN Debug - "If we can't find it, we build it"</span>
        <button id="gen-debug-close" style="background: transparent; border: none; color: white; font-size: 20px; cursor: pointer;">×</button>
    `;
    
    // Panel content
    var content = document.createElement('div');
    content.style.cssText = `
        padding: 15px;
        max-height: 60vh;
        overflow-y: auto;
    `;
    
    // Collect debug information
    function collectDebugInfo() {
        var info = [];
        
        // Browser info
        info.push('<h3 style="margin-top: 0;">🌐 Browser Information</h3>');
        info.push('<ul style="margin: 0; padding-left: 20px;">');
        info.push('<li><strong>User Agent:</strong> ' + navigator.userAgent + '</li>');
        info.push('<li><strong>Platform:</strong> ' + navigator.platform + '</li>');
        info.push('<li><strong>Language:</strong> ' + navigator.language + '</li>');
        info.push('<li><strong>Cookies:</strong> ' + (navigator.cookieEnabled ? 'Enabled' : 'Disabled') + '</li>');
        info.push('<li><strong>Online:</strong> ' + (navigator.onLine ? 'Yes' : 'No') + '</li>');
        info.push('</ul>');
        
        // Screen info
        info.push('<h3>📱 Screen Information</h3>');
        info.push('<ul style="margin: 0; padding-left: 20px;">');
        info.push('<li><strong>Screen:</strong> ' + screen.width + ' × ' + screen.height + ' (' + screen.colorDepth + '-bit)</li>');
        info.push('<li><strong>Viewport:</strong> ' + window.innerWidth + ' × ' + window.innerHeight + '</li>');
        info.push('<li><strong>Device Pixel Ratio:</strong> ' + window.devicePixelRatio + '</li>');
        info.push('<li><strong>Orientation:</strong> ' + (screen.orientation ? screen.orientation.type : 'Unknown') + '</li>');
        info.push('</ul>');
        
        // Storage info
        info.push('<h3>💾 Storage Information</h3>');
        info.push('<ul style="margin: 0; padding-left: 20px;">');
        info.push('<li><strong>localStorage:</strong> ' + (typeof localStorage !== 'undefined' ? 'Available' : 'Not available') + '</li>');
        info.push('<li><strong>sessionStorage:</strong> ' + (typeof sessionStorage !== 'undefined' ? 'Available' : 'Not available') + '</li>');
        info.push('<li><strong>IndexedDB:</strong> ' + (window.indexedDB ? 'Available' : 'Not available') + '</li>');
        info.push('</ul>');
        
        // Page info
        info.push('<h3>📄 Page Information</h3>');
        info.push('<ul style="margin: 0; padding-left: 20px;">');
        info.push('<li><strong>URL:</strong> ' + window.location.href + '</li>');
        info.push('<li><strong>Title:</strong> ' + document.title + '</li>');
        info.push('<li><strong>Protocol:</strong> ' + window.location.protocol + '</li>');
        info.push('<li><strong>Host:</strong> ' + window.location.host + '</li>');
        info.push('</ul>');
        
        // JavaScript info
        info.push('<h3>⚡ JavaScript Information</h3>');
        info.push('<ul style="margin: 0; padding-left: 20px;">');
        info.push('<li><strong>JavaScript:</strong> Enabled</li>');
        info.push('<li><strong>Console:</strong> ' + (typeof console !== 'undefined' ? 'Available' : 'Not available') + '</li>');
        info.push('<li><strong>Performance API:</strong> ' + (window.performance ? 'Available' : 'Not available') + '</li>');
        info.push('</ul>');
        
        // Test buttons
        info.push('<h3>🧪 Quick Tests</h3>');
        info.push('<div style="display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 15px;">');
        info.push('<button onclick="runStorageTest()" style="padding: 8px 16px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer;">Test Storage</button>');
        info.push('<button onclick="runConsoleTest()" style="padding: 8px 16px; background: #17a2b8; color: white; border: none; border-radius: 4px; cursor: pointer;">Test Console</button>');
        info.push('<button onclick="runPerformanceTest()" style="padding: 8px 16px; background: #6f42c1; color: white; border: none; border-radius: 4px; cursor: pointer;">Test Performance</button>');
        info.push('</div>');
        info.push('<div id="gen-test-results" style="padding: 10px; background: #f8f9fa; border-radius: 4px; margin-top: 10px;"></div>');
        
        // Console errors (if any captured)
        info.push('<h3>⚠️ Console Errors</h3>');
        info.push('<div id="gen-console-errors" style="padding: 10px; background: #fff3cd; border-radius: 4px; font-family: monospace; font-size: 12px;">');
        info.push('<p>Console errors would appear here. Try causing an error to test.</p>');
        info.push('</div>');
        
        return info.join('');
    }
    
    // Add content
    content.innerHTML = collectDebugInfo();
    
    // Assemble panel
    debugPanel.appendChild(header);
    debugPanel.appendChild(content);
    document.body.appendChild(debugPanel);
    
    // Make draggable
    var isDragging = false;
    var currentX;
    var currentY;
    var initialX;
    var initialY;
    
    header.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);
    
    function dragStart(e) {
        initialX = e.clientX - debugPanel.offsetLeft;
        initialY = e.clientY - debugPanel.offsetTop;
        isDragging = true;
    }
    
    function drag(e) {
        if (isDragging) {
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
            debugPanel.style.left = currentX + 'px';
            debugPanel.style.top = currentY + 'px';
            debugPanel.style.right = 'auto';
        }
    }
    
    function dragEnd() {
        isDragging = false;
    }
    
    // Close button
    document.getElementById('gen-debug-close').addEventListener('click', function() {
        document.body.removeChild(debugPanel);
    });
    
    // Test functions
    window.runStorageTest = function() {
        var results = document.getElementById('gen-test-results');
        try {
            localStorage.setItem('gen_debug_test', Date.now());
            var value = localStorage.getItem('gen_debug_test');
            localStorage.removeItem('gen_debug_test');
            results.innerHTML = '<p style="color: green;">✅ Storage test passed: ' + value + '</p>';
        } catch(e) {
            results.innerHTML = '<p style="color: red;">❌ Storage test failed: ' + e.message + '</p>';
        }
    };
    
    window.runConsoleTest = function() {
        var results = document.getElementById('gen-test-results');
        try {
            console.log('GEN Debug: Console test message');
            results.innerHTML = '<p style="color: green;">✅ Console test passed (check browser console)</p>';
        } catch(e) {
            results.innerHTML = '<p style="color: red;">❌ Console test failed: ' + e.message + '</p>';
        }
    };
    
    window.runPerformanceTest = function() {
        var results = document.getElementById('gen-test-results');
        if (window.performance) {
            var perf = performance.timing;
            var loadTime = perf.loadEventEnd - perf.navigationStart;
            results.innerHTML = '<p style="color: green;">✅ Performance API available</p>';
            results.innerHTML += '<p>Page load time: ' + loadTime + 'ms</p>';
        } else {
            results.innerHTML = '<p style="color: orange;">⚠️ Performance API not available</p>';
        }
    };
    
    // Capture console errors
    var originalError = console.error;
    console.error = function() {
        var errorsDiv = document.getElementById('gen-console-errors');
        if (errorsDiv) {
            errorsDiv.innerHTML = '<p style="color: red;">' + Array.from(arguments).join(' ') + '</p>';
        }
        originalError.apply(console, arguments);
    };
    
    console.log('🔧 GEN Debug loaded successfully!');
})();
