// ========================================
// AllAble - Service Worker
// للعمل بدون إنترنت
// ========================================

const CACHE_NAME = 'allable-v1.0.0';
const OFFLINE_URL = 'offline.html';

// الملفات الأساسية للتخزين المؤقت
const CORE_ASSETS = [
    '/',
    '/index.html',
    '/dashboard.html',
    '/emergency.html',
    '/sign-language.html',
    '/aac.html',
    '/camera.html',
    '/education.html',
    '/social-media.html',
    '/css/main.css',
    '/css/themes.css',
    '/css/components.css',
    '/js/app.js',
    '/js/utils.js',
    '/js/accessibility.js',
    '/js/content-middleware.js',
    '/config.js',
    OFFLINE_URL
];

// الكلمات الأساسية للعمل بدون نت
const ESSENTIAL_WORDS = {
    ar: {
        'طوارئ': 'حالة تحتاج مساعدة فورية',
        'مساعدة': 'طلب الدعم والمساندة',
        'ماء': 'سائل للشرب',
        'طعام': 'ما يؤكل للتغذية',
        'حمام': 'مكان قضاء الحاجة',
        'ألم': 'شعور بعدم الراحة',
        'دواء': 'علاج للمرض',
        'نعم': 'موافقة',
        'لا': 'رفض',
        'شكراً': 'تعبير عن الامتنان'
    }
};

// إشارات شائعة (بيانات مبسطة)
const COMMON_SIGNS = {
    'مرحبا': { description: 'رفع اليد والتلويح', video: null },
    'شكرا': { description: 'وضع اليد على الصدر', video: null },
    'نعم': { description: 'إيماءة بالرأس للأسفل', video: null },
    'لا': { description: 'هز الرأس يميناً ويساراً', video: null },
    'طوارئ': { description: 'رفع اليدين بسرعة', video: null }
};

// التثبيت
self.addEventListener('install', (event) => {
    console.log('🔧 Service Worker: Installing...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('📦 Service Worker: Caching core assets');
                return cache.addAll(CORE_ASSETS);
            })
            .then(() => {
                console.log('✅ Service Worker: Installation complete');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('❌ Service Worker: Installation failed', error);
            })
    );
});

// التفعيل
self.addEventListener('activate', (event) => {
    console.log('🚀 Service Worker: Activating...');
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== CACHE_NAME) {
                            console.log('🗑️ Service Worker: Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('✅ Service Worker: Activation complete');
                return self.clients.claim();
            })
    );
});

// اعتراض الطلبات
self.addEventListener('fetch', (event) => {
    // تجاهل الطلبات غير HTTP/HTTPS
    if (!event.request.url.startsWith('http')) {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                if (cachedResponse) {
                    // إرجاع النسخة المخزنة
                    return cachedResponse;
                }

                // محاولة جلب من الشبكة
                return fetch(event.request)
                    .then((response) => {
                        // تخزين الاستجابة الجديدة
                        if (response && response.status === 200) {
                            const responseClone = response.clone();
                            caches.open(CACHE_NAME)
                                .then((cache) => {
                                    cache.put(event.request, responseClone);
                                });
                        }
                        return response;
                    })
                    .catch(() => {
                        // في حالة عدم وجود اتصال
                        if (event.request.mode === 'navigate') {
                            return caches.match(OFFLINE_URL);
                        }
                    });
            })
    );
});

// رسائل من التطبيق الرئيسي
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    // البحث في الكلمات الأساسية بدون نت
    if (event.data && event.data.type === 'SEARCH_OFFLINE') {
        const query = event.data.query.toLowerCase();
        const result = ESSENTIAL_WORDS.ar[query] || null;
        
        event.ports[0].postMessage({
            type: 'SEARCH_RESULT',
            query: query,
            result: result,
            offline: true
        });
    }
    
    // البحث عن إشارة
    if (event.data && event.data.type === 'GET_SIGN') {
        const word = event.data.word;
        const sign = COMMON_SIGNS[word] || null;
        
        event.ports[0].postMessage({
            type: 'SIGN_RESULT',
            word: word,
            sign: sign,
            offline: true
        });
    }
});

// مزامنة في الخلفية
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-emergency') {
        event.waitUntil(syncEmergencyData());
    }
});

// مزامنة بيانات الطوارئ
async function syncEmergencyData() {
    try {
        const cache = await caches.open(CACHE_NAME);
        const emergencyData = await cache.match('/emergency-data');
        
        if (emergencyData) {
            const data = await emergencyData.json();
            // إرسال البيانات عند عودة الاتصال
            await fetch('/api/emergency', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json' }
            });
        }
    } catch (error) {
        console.error('❌ Sync failed:', error);
    }
}

console.log('✅ Service Worker loaded');
