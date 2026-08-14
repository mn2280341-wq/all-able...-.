// ========================================
// AllAble - Utility Functions
// وظائف مساعدة عامة
// ========================================

/**
 * تخزين البيانات في LocalStorage
 */
function saveToStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error('خطأ في حفظ البيانات:', error);
        return false;
    }
}

/**
 * جلب البيانات من LocalStorage
 */
function getFromStorage(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error('خطأ في جلب البيانات:', error);
        return defaultValue;
    }
}

/**
 * حذف البيانات من LocalStorage
 */
function removeFromStorage(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error('خطأ في حذف البيانات:', error);
        return false;
    }
}

/**
 * مسح كل البيانات من LocalStorage
 */
function clearStorage() {
    try {
        localStorage.clear();
        return true;
    } catch (error) {
        console.error('خطأ في مسح البيانات:', error);
        return false;
    }
}

/**
 * عرض إشعار للمستخدم
 */
function showNotification(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
    <div class="notification-content">
      <i class="fas fa-${getNotificationIcon(type)}"></i>
      <span>${message}</span>
    </div>
  `;

    notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 1rem 1.5rem;
    background: var(--bg-secondary);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-lg);
    z-index: 10000;
    animation: slideInRight 0.3s ease;
  `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, duration);
}

function getNotificationIcon(type) {
    const icons = {
        info: 'info-circle',
        success: 'check-circle',
        warning: 'exclamation-triangle',
        error: 'times-circle'
    };
    return icons[type] || 'info-circle';
}

/**
 * تنسيق التاريخ
 */
function formatDate(date, format = 'full') {
    const d = new Date(date);
    const options = {
        full: { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' },
        date: { year: 'numeric', month: 'long', day: 'numeric' },
        time: { hour: '2-digit', minute: '2-digit' }
    };

    return d.toLocaleDateString('ar-EG', options[format] || options.full);
}

/**
 * التحقق من صحة البريد الإلكتروني
 */
function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

/**
 * التحقق من صحة رقم الهاتف
 */
function isValidPhone(phone) {
    const regex = /^[\d\s\-\+\(\)]+$/;
    return regex.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

/**
 * تبسيط النص (للإعاقات الذهنية وصعوبات التعلم)
 */
function simplifyText(text) {
    // إزالة الكلمات المعقدة واستبدالها بكلمات أبسط
    const replacements = {
        'يستخدم': 'يعمل',
        'يتضمن': 'فيه',
        'بالإضافة إلى': 'و',
        'من أجل': 'ل',
        'بالنسبة لـ': 'ل'
    };

    let simplified = text;
    for (const [complex, simple] of Object.entries(replacements)) {
        simplified = simplified.replace(new RegExp(complex, 'g'), simple);
    }

    return simplified;
}

/**
 * تقسيم النص إلى جمل قصيرة
 */
function breakIntoSentences(text) {
    return text.split(/[.!?]+/).filter(s => s.trim().length > 0);
}

/**
 * تحويل النص إلى صوت (Text-to-Speech)
 */
function speak(text, options = {}) {
    if (!('speechSynthesis' in window)) {
        console.error('المتصفح لا يدعم تحويل النص إلى صوت');
        return;
    }

    // إيقاف أي قراءة جارية
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = options.lang || 'ar-SA';
    utterance.rate = options.rate || 1;
    utterance.pitch = options.pitch || 1;
    utterance.volume = options.volume || 1;

    if (options.onend) {
        utterance.onend = options.onend;
    }

    window.speechSynthesis.speak(utterance);
}

/**
 * إيقاف القراءة الصوتية
 */
function stopSpeaking() {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
    }
}

/**
 * التعرف على الصوت (Speech-to-Text)
 */
function startVoiceRecognition(callback, options = {}) {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        console.error('المتصفح لا يدعم التعرف على الصوت');
        return null;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = options.lang || 'ar-SA';
    recognition.continuous = options.continuous || false;
    recognition.interimResults = options.interimResults || false;

    recognition.onresult = (event) => {
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript;
        callback(transcript);
    };

    recognition.onerror = (event) => {
        console.error('خطأ في التعرف على الصوت:', event.error);
    };

    recognition.start();
    return recognition;
}

/**
 * الحصول على الموقع الجغرافي
 */
function getCurrentLocation(callback, errorCallback) {
    if (!navigator.geolocation) {
        console.error('المتصفح لا يدعم تحديد الموقع');
        if (errorCallback) errorCallback('المتصفح لا يدعم تحديد الموقع');
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (position) => {
            callback({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy
            });
        },
        (error) => {
            console.error('خطأ في تحديد الموقع:', error);
            if (errorCallback) errorCallback(error.message);
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
}

/**
 * إنشاء رابط خرائط جوجل
 */
function createGoogleMapsLink(latitude, longitude) {
    return `https://www.google.com/maps?q=${latitude},${longitude}`;
}

/**
 * نسخ النص إلى الحافظة
 */
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showNotification('تم النسخ بنجاح', 'success');
        return true;
    } catch (error) {
        console.error('خطأ في النسخ:', error);
        showNotification('فشل النسخ', 'error');
        return false;
    }
}

/**
 * تحميل ملف
 */
function downloadFile(content, filename, type = 'text/plain') {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

/**
 * تحويل الصورة إلى Base64
 */
function imageToBase64(file, callback) {
    const reader = new FileReader();
    reader.onload = (e) => callback(e.target.result);
    reader.readAsDataURL(file);
}

/**
 * اكتشاف نوع الجهاز
 */
function detectDevice() {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
        return 'tablet';
    }
    if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
        return 'mobile';
    }
    return 'desktop';
}

/**
 * اكتشاف نظام التشغيل
 */
function detectOS() {
    const ua = navigator.userAgent;
    if (/windows/i.test(ua)) return 'Windows';
    if (/mac/i.test(ua)) return 'MacOS';
    if (/linux/i.test(ua)) return 'Linux';
    if (/android/i.test(ua)) return 'Android';
    if (/ios|iphone|ipad|ipod/i.test(ua)) return 'iOS';
    return 'Unknown';
}

/**
 * تأخير (Delay)
 */
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Debounce function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function
 */
function throttle(func, limit) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * تحويل الوقت النسبي (منذ 5 دقائق، منذ ساعة، إلخ)
 */
function timeAgo(date) {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);

    const intervals = {
        سنة: 31536000,
        شهر: 2592000,
        أسبوع: 604800,
        يوم: 86400,
        ساعة: 3600,
        دقيقة: 60,
        ثانية: 1
    };

    for (const [name, value] of Object.entries(intervals)) {
        const interval = Math.floor(seconds / value);
        if (interval >= 1) {
            return `منذ ${interval} ${name}${interval > 1 ? '' : ''}`;
        }
    }

    return 'الآن';
}

/**
 * استدعاء واجهة برمجة التطبيقات الخلفية (Backend API)
 */
async function callBackend(endpoint, method = 'GET', data = null) {
    if (typeof CONFIG === 'undefined' || !CONFIG.USE_BACKEND) return null;

    const url = `${CONFIG.BACKEND_URL}${endpoint}`;
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json'
        }
    };

    if (data) {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(url, options);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Backend connection failed:', error);
        return null;
    }
}

// تصدير الوظائف
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        saveToStorage,
        getFromStorage,
        removeFromStorage,
        clearStorage,
        showNotification,
        formatDate,
        isValidEmail,
        isValidPhone,
        simplifyText,
        breakIntoSentences,
        speak,
        stopSpeaking,
        startVoiceRecognition,
        getCurrentLocation,
        createGoogleMapsLink,
        copyToClipboard,
        downloadFile,
        imageToBase64,
        detectDevice,
        detectOS,
        delay,
        debounce,
        throttle,
        timeAgo,
        callBackend
    };
}
