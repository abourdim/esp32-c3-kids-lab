// ============================================================
// Kids Lab — ESPHome Edition
// REST API (fetch) + Server-Sent Events (EventSource)
// Works on ANY browser including iOS Safari
// ============================================================

// ---- State ----
var baseUrl = '';
var eventSource = null;
var connected = false;
var sweepInterval = null;
var sweepDir = 1;
var sweepVal = 0;

// ============================================================
// CONNECTION
// ============================================================

function setIP(ip) {
    document.getElementById('ipInput').value = ip;
}

function doConnect() {
    var ip = document.getElementById('ipInput').value.trim();
    if (!ip) return;

    // Add protocol if missing
    if (ip.indexOf('http') !== 0) ip = 'http://' + ip;
    // Remove trailing slash
    if (ip.charAt(ip.length - 1) === '/') ip = ip.slice(0, -1);
    baseUrl = ip;

    var btn = document.getElementById('btnConnect');
    var btnText = btn.querySelector('.btn-text');
    var btnSpin = btn.querySelector('.btn-spinner');
    btn.disabled = true;
    btnText.style.display = 'none';
    btnSpin.style.display = 'inline-block';
    setConnectStatus('Connecting to ' + baseUrl + '...', '');

    // Test connection by fetching the root
    fetch(baseUrl, { mode: 'no-cors', signal: AbortSignal.timeout(5000) })
        .then(function() {
            // no-cors gives opaque response but proves device is reachable
            onConnected();
        })
        .catch(function(err) {
            // Try again with cors
            return fetch(baseUrl + '/sensor/uptime', { signal: AbortSignal.timeout(5000) })
                .then(function() { onConnected(); })
                .catch(function() {
                    setConnectStatus('❌ Cannot reach ' + baseUrl + '. Check IP and WiFi.', 'err');
                    btn.disabled = false;
                    btnText.style.display = 'inline';
                    btnSpin.style.display = 'none';
                });
        });
}

function onConnected() {
    connected = true;

    // Switch screens
    document.getElementById('connectScreen').classList.remove('active');
    document.getElementById('mainScreen').classList.add('active');

    // Update badge
    document.getElementById('connLabel').textContent = baseUrl.replace('http://', '');

    // Start SSE
    startSSE();

    // Initial sensor fetch
    fetchAllSensors();

    addLog('Connected to ' + baseUrl, 'info');

    // Reset connect button
    var btn = document.getElementById('btnConnect');
    btn.disabled = false;
    btn.querySelector('.btn-text').style.display = 'inline';
    btn.querySelector('.btn-spinner').style.display = 'none';
}

function doDisconnect() {
    connected = false;
    if (eventSource) { eventSource.close(); eventSource = null; }
    if (sweepInterval) { clearInterval(sweepInterval); sweepInterval = null; }

    document.getElementById('mainScreen').classList.remove('active');
    document.getElementById('connectScreen').classList.add('active');
    setConnectStatus('Disconnected', '');
    updateSSEStatus('off');
}

function setConnectStatus(text, cls) {
    var el = document.getElementById('connectStatus');
    el.textContent = text;
    el.className = 'connect-status' + (cls ? ' ' + cls : '');
}

// ============================================================
// SSE — Server-Sent Events (real-time sensor updates)
// ============================================================

function startSSE() {
    if (eventSource) eventSource.close();

    try {
        eventSource = new EventSource(baseUrl + '/events');

        eventSource.addEventListener('state', function(e) {
            try {
                var data = JSON.parse(e.data);
                handleSSEState(data);
            } catch(err) {
                // ignore parse errors
            }
        });

        eventSource.addEventListener('log', function(e) {
            try {
                var data = JSON.parse(e.data);
                if (document.getElementById('logSSE').checked) {
                    addLog('[LOG] ' + (data.message || e.data), 'sse');
                }
            } catch(err) {}
        });

        eventSource.onopen = function() {
            updateSSEStatus('live');
            addLog('SSE event stream connected', 'info');
        };

        eventSource.onerror = function() {
            updateSSEStatus('err');
            // EventSource auto-reconnects
        };

    } catch(err) {
        addLog('SSE not available: ' + err.message, 'err');
        updateSSEStatus('err');
    }
}

function handleSSEState(data) {
    var id = data.id || '';
    var val = data.value;
    var state = data.state || '';

    // Log if enabled
    if (document.getElementById('logSSE') && document.getElementById('logSSE').checked) {
        addLog('SSE ' + id + ' = ' + (val !== undefined ? val : state), 'sse');
    }

    // ---- Temperature ----
    if (id === 'sensor-temperature') {
        var t = parseFloat(val);
        setText('valTemp', t.toFixed(1) + '°C');
        setFill('fillTemp', Math.max(0, Math.min(100, (t + 10) / 60 * 100)));
        flashCard('cardTemp');
    }
    // ---- Humidity ----
    else if (id === 'sensor-humidity') {
        var h = parseFloat(val);
        setText('valHum', h.toFixed(0) + '%');
        setFill('fillHum', h);
        flashCard('cardHum');
    }
    // ---- Light ----
    else if (id === 'sensor-light_level') {
        var l = parseFloat(val);
        setText('valLight', l.toFixed(2) + 'V');
        setFill('fillLight', l / 3.3 * 100);
        flashCard('cardLight');
    }
    // ---- Boot button ----
    else if (id === 'binary_sensor-boot_button') {
        var pressed = (state === 'ON' || val === true);
        setText('valBtn', pressed ? 'PRESSED' : 'Ready');
        var el = document.getElementById('valBtn');
        if (el) el.style.color = pressed ? 'var(--green)' : '';
        flashCard('cardBtn');
    }
    // ---- Push button ----
    else if (id === 'binary_sensor-push_button') {
        var pressed2 = (state === 'ON' || val === true);
        setText('valBtn2', pressed2 ? 'PRESSED' : 'Ready');
        var el2 = document.getElementById('valBtn2');
        if (el2) el2.style.color = pressed2 ? 'var(--green)' : '';
        flashCard('cardBtn2');
    }
    // ---- Uptime ----
    else if (id === 'sensor-uptime') {
        var secs = parseFloat(val);
        setText('valUptime', formatUptime(secs));
        flashCard('cardUptime');
    }
    // ---- Onboard LED ----
    else if (id === 'light-onboard_led') {
        var ledOn = (state === 'ON' || val === true);
        var ind = document.getElementById('indLed');
        if (ind) {
            ind.textContent = ledOn ? '● ON' : 'OFF';
            ind.className = 'led-indicator' + (ledOn ? ' on' : '');
        }
    }
}

function updateSSEStatus(status) {
    var dot = document.getElementById('sseDot');
    var label = document.getElementById('sseLabel');
    if (!dot || !label) return;

    dot.className = 'sse-dot' + (status === 'live' ? ' live' : status === 'err' ? ' err' : '');
    label.textContent = status === 'live' ? 'Event stream active'
                      : status === 'err' ? 'Event stream reconnecting...'
                      : 'Event stream not connected';
}

// ============================================================
// API — generic fetch helper
// ============================================================

function api(path, method, extraLog) {
    if (!connected) { addLog('Not connected!', 'err'); return Promise.reject('not connected'); }

    method = method || 'POST';
    var url = baseUrl + path;
    addLog(method + ' ' + path, 'tx');

    return fetch(url, { method: method })
        .then(function(resp) {
            if (resp.ok) {
                addLog('← ' + resp.status + ' OK' + (extraLog ? ' ' + extraLog : ''), 'rx');
            } else {
                addLog('← ' + resp.status + ' ' + resp.statusText, 'err');
            }
            return resp;
        })
        .catch(function(err) {
            addLog('← Error: ' + err.message, 'err');
        });
}

function fetchAllSensors() {
    // One-shot read of all sensor values (SSE will update them live after)
    api('/sensor/temperature', 'GET', '(initial)').catch(function(){});
    api('/sensor/humidity', 'GET', '(initial)').catch(function(){});
    api('/sensor/light_level', 'GET', '(initial)').catch(function(){});
    api('/sensor/uptime', 'GET', '(initial)').catch(function(){});
}

// ============================================================
// LED CONTROLS
// ============================================================

function neoColor(r, g, b) {
    var brightness = document.getElementById('neoBrightness').value;
    api('/light/neopixels/turn_on?r=' + r + '&g=' + g + '&b=' + b + '&brightness=' + brightness, 'POST');
}

function neoColorFromPicker() {
    var hex = document.getElementById('neoCustomColor').value;
    var r = parseInt(hex.substring(1, 3), 16);
    var g = parseInt(hex.substring(3, 5), 16);
    var b = parseInt(hex.substring(5, 7), 16);
    neoColor(r, g, b);
}

function neoEffect(name) {
    if (name === 'None') {
        api('/light/neopixels/turn_on?effect=None', 'POST');
    } else {
        api('/light/neopixels/turn_on?effect=' + encodeURIComponent(name), 'POST');
    }
}

// ============================================================
// MUSIC — RTTTL single notes via the API
// ============================================================

// ESPHome RTTTL service can be called via the REST API
// We create single-note RTTTL strings for piano keys
var noteMap = {
    'c5':  262, 'd5':  294, 'e5':  330, 'f5':  349,
    'g5':  392, 'a5':  440, 'b5':  494, 'c6':  523,
    'c#5': 277, 'd#5': 311, 'f#5': 370, 'g#5': 415, 'a#5': 466
};

function playNote(note) {
    // ESPHome doesn't have a direct "play frequency" REST endpoint for RTTTL
    // but we can use template buttons or lambda. For now we'll use the
    // available RTTTL play via the native API workaround.
    // Simplest approach: create an RTTTL string for a single note.
    var rtttl = 'n:d=16,o=5,b=400:' + note.replace('#', '%23');

    // For ESPHome web_server v3, we can POST to a special endpoint
    // or use a different approach — call the output directly
    // The cleanest way is through template buttons for each note,
    // but for this demo we'll use the buzzer output PWM directly

    var freq = noteMap[note];
    if (!freq) return;

    // Use the LEDC output to play a tone
    // ESPHome doesn't expose raw PWM via REST, so we use a workaround:
    // Play a short RTTTL melody of just one note
    // This requires the RTTTL play action to be exposed as a button

    // For a quick demo, we'll just call the beep button
    // In production, you'd add template buttons for each note
    api('/button/play_beep/press', 'POST');

    // Visual feedback
    var keys = document.querySelectorAll('.piano-key');
    keys.forEach(function(k) {
        if (k.getAttribute('data-note') === note.replace(/\d/, '').toUpperCase() ||
            k.getAttribute('data-note') === note.toUpperCase()) {
            k.style.transition = 'none';
            k.style.filter = 'brightness(1.3)';
            setTimeout(function() {
                k.style.transition = 'filter 0.3s';
                k.style.filter = '';
            }, 150);
        }
    });
}

// ============================================================
// SERVO
// ============================================================

function setServo(val) {
    val = Math.max(-100, Math.min(100, parseInt(val)));
    document.getElementById('servoSlider').value = val;
    updateServoDisplay(val);
    api('/number/servo_angle/set?value=' + val, 'POST');
}

function onServoSlider(val) {
    val = parseInt(val);
    updateServoDisplay(val);
    // Debounce: only send after small delay
    clearTimeout(onServoSlider._timer);
    onServoSlider._timer = setTimeout(function() {
        api('/number/servo_angle/set?value=' + val, 'POST');
    }, 80);
}

function updateServoDisplay(val) {
    // Needle: -100 = -90deg, 0 = 0deg, 100 = 90deg
    var angle = val * 0.9; // map -100..100 to -90..90
    var needle = document.getElementById('servoNeedle');
    if (needle) needle.style.transform = 'rotate(' + angle + 'deg)';
    setText('servoVal', val + '°');
}

function toggleSweep() {
    var btn = document.getElementById('btnSweep');
    if (sweepInterval) {
        clearInterval(sweepInterval);
        sweepInterval = null;
        btn.textContent = '▶ Start Sweep';
        btn.classList.remove('green');
    } else {
        sweepVal = 0;
        sweepDir = 1;
        btn.textContent = '⏸ Stop Sweep';
        btn.classList.add('green');
        sweepInterval = setInterval(function() {
            sweepVal += sweepDir * 5;
            if (sweepVal >= 100) { sweepVal = 100; sweepDir = -1; }
            if (sweepVal <= -100) { sweepVal = -100; sweepDir = 1; }
            setServo(sweepVal);
        }, 100);
    }
}

// ============================================================
// LOG
// ============================================================

function addLog(text, cls) {
    var box = document.getElementById('logBox');
    if (!box) return;
    var div = document.createElement('div');
    div.className = 'log-line ' + (cls || 'info');
    var ts = new Date().toLocaleTimeString();
    div.textContent = '[' + ts + '] ' + text;
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
    // Cap at 300
    while (box.children.length > 300) box.removeChild(box.firstChild);
}

function clearLog() {
    var box = document.getElementById('logBox');
    if (box) box.innerHTML = '';
}

function sendCustomAPI() {
    var input = document.getElementById('apiInput');
    var method = document.getElementById('apiMethod').value;
    var path = input.value.trim();
    if (!path) return;
    if (path.charAt(0) !== '/') path = '/' + path;
    api(path, method);
    input.value = '';
}

// ============================================================
// MODULE NAVIGATION
// ============================================================

function showMod(name) {
    var mods = document.querySelectorAll('.module');
    var tabs = document.querySelectorAll('.tab');
    for (var i = 0; i < mods.length; i++) mods[i].classList.remove('active');
    for (var i = 0; i < tabs.length; i++) tabs[i].classList.remove('active');

    var mod = document.getElementById('mod-' + name);
    var tab = document.querySelector('.tab[data-mod="' + name + '"]');
    if (mod) mod.classList.add('active');
    if (tab) tab.classList.add('active');
}

// ============================================================
// HELPERS
// ============================================================

function setText(id, text) {
    var el = document.getElementById(id);
    if (el) el.textContent = text;
}

function setFill(id, pct) {
    var el = document.getElementById(id);
    if (el) el.style.width = Math.max(0, Math.min(100, pct)) + '%';
}

function flashCard(id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.classList.add('flash');
    setTimeout(function() { el.classList.remove('flash'); }, 500);
}

function formatUptime(secs) {
    secs = Math.floor(secs);
    if (secs < 60) return secs + 's';
    if (secs < 3600) return Math.floor(secs / 60) + 'm ' + (secs % 60) + 's';
    var h = Math.floor(secs / 3600);
    var m = Math.floor((secs % 3600) / 60);
    return h + 'h ' + m + 'm';
}

// ============================================================
// INIT — Auto-connect if served from ESP32
// ============================================================
(function() {
    var host = location.hostname;
    if (host && host !== '' && host !== 'localhost' && host !== '127.0.0.1') {
        // Likely served from ESP32 itself
        document.getElementById('ipInput').value = host;
        // Auto-connect after short delay
        setTimeout(function() {
            doConnect();
        }, 500);
    }
})();
