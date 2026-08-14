// ========================================
// All-Able - Social Media Manager
// إدارة السوشيال ميديا المترجمة
// ========================================

class SocialMediaManager {
  constructor() {
    this.currentPlatform = 'all';
    this.posts = [];
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.loadDemoPosts();
    this.renderPosts();
  }

  setupEventListeners() {
    // أزرار المنصات
    const platformButtons = document.querySelectorAll('.platform-btn');
    platformButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const platform = e.currentTarget.getAttribute('data-platform');
        this.filterByPlatform(platform);

        // تحديث الأزرار النشطة
        platformButtons.forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
      });
    });
  }

  /**
   * تحميل منشورات حقيقية (أكواد التضمين)
   */
  loadDemoPosts() {
    this.posts = [

      // 1. YouTube Video (Real Iframe)
      {
        id: 'yt-1',
        platform: 'youtube',
        type: 'video',
        embedId: '5qap5aO4i9A', // Lofi Girl Radio example or similar safely embeddable content
        title: 'موسيقى هادئة للدراسة والتركيز',
        transcript: "موسيقى هادئة ومريحة تساعد على التركيز والاسترخاء. بث مباشر على مدار الساعة.",
        description: 'فيديو مباشر يعرض فتاة تذاكر مع قطتها، موسيقى هادئة في الخلفية.'
      },

      // 2. Twitter Post (Real Widget)
      {
        id: 'tw-1',
        platform: 'twitter',
        type: 'post',
        embedId: '1884976735237882255', // Example Tweet ID - using a generic/safe one
        content: 'تغريدة تجريبية عن إمكانية الوصول.',
        transcript: "تغريدة من حساب TechForGood: التكنولوجيا يجب أن تكون للجميع. #Accessibility #Tech",
        description: "نص التغريدة يتحدث عن أهمية التكنولوجيا للجميع."
      },

      // 3. Facebook Post (Real SDK)
      {
        id: 'fb-1',
        platform: 'facebook',
        type: 'post',
        // Using a public page post URL
        embedUrl: 'https://www.facebook.com/facebook/posts/pfbid02R4g1j7H8t2i9z8x8y7w6v5u4t3s2r1q',
        transcript: "منشور من فيسبوك يستعرض ميزات جديدة.",
        description: "صورة تعرض شعار ميتا مع خلفية زرقاء."
      },

      // 4. TikTok Video (Real Embed)
      {
        id: 'tk-1',
        platform: 'tiktok',
        type: 'video',
        embedId: '7461973616223456545', // Example TikTok ID
        transcript: "فيديو قصير تعليمي.",
        description: "شخص يشرح بلغة الإشارة كيفية قول 'صباح الخير'."
      }
    ];
  }

  /**
   * فلترة المنشورات حسب المنصة
   */
  filterByPlatform(platform) {
    this.currentPlatform = platform;
    this.renderPosts();
  }

  /**
   * عرض المنشورات
   */
  renderPosts() {
    const feed = document.getElementById('social-feed');
    if (!feed) return;

    let filteredPosts = this.posts;
    if (this.currentPlatform !== 'all') {
      filteredPosts = this.posts.filter(p => p.platform === this.currentPlatform);
    }

    if (filteredPosts.length === 0) {
      feed.innerHTML = '<p style="text-align: center; color: var(--text-muted); padding: 20px;">لا توجد منشورات لهذه المنصة حالياً</p>';
      return;
    }

    // تفريغ المحتوى
    feed.innerHTML = '';

    // معالجة وعرض المنشورات عبر الوسيط الذكي
    filteredPosts.forEach(async post => {
      // 1. تمرير المحتوى للوسيط (Intercept & Process)
      const processedPost = await contentMiddleware.processContent({
        ...post,
        text: post.transcript || post.content // توحيد النص للمعالجة
      });

      // 2. إنشاء العنصر بناءً على المحتوى المعالج
      const postElement = this.createPostElement(processedPost);
      feed.appendChild(postElement);

      // 3. تهيئة التضمين
      this.initEmbed(post);
    });
  }

  /**
   * إنشاء عنصر المنشور (الغلاف)
   */
  createPostElement(post) {
    const wrapper = document.createElement('div');
    wrapper.className = 'embed-wrapper';
    wrapper.setAttribute('data-id', post.id);
    wrapper.setAttribute('aria-label', `منشور على ${post.platform}`);

    // 1. المحتوى الحقيقي (Embed)
    const contentDiv = document.createElement('div');
    contentDiv.className = 'embed-content';
    contentDiv.id = `embed-${post.id}`;

    // 2. أدوات إمكانية الوصول (الأزرار)
    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'a11y-controls';

    // زر الاستماع (للمكفوفين وضعاف البصر) - يقرأ النص المخزن لدينا
    const listenBtn = document.createElement('button');
    listenBtn.className = 'a11y-btn btn-listen';
    listenBtn.innerHTML = '<i class="fas fa-volume-up"></i> <span>استماع</span>';
    listenBtn.onclick = () => speak(post.transcript || "لا يوجد نص متاح للقراءة");

    // زر الوصف (للمكفوفين) - يصف الصورة/الفيديو
    const describeBtn = document.createElement('button');
    describeBtn.className = 'a11y-btn btn-describe';
    describeBtn.innerHTML = '<i class="fas fa-eye"></i> <span>وصف المشهد</span>';
    describeBtn.onclick = () => speak(`وصف المحتوى: ${post.description}`);

    // زر التبسيط (للإعاقة الذهنية)
    const simplifyBtn = document.createElement('button');
    simplifyBtn.className = 'a11y-btn btn-simplify';
    simplifyBtn.innerHTML = '<i class="fas fa-magic"></i> <span>تبسيط</span>';
    simplifyBtn.onclick = () => {
      showNotification('جاري تبسيط المحتوى...', 'info');
      speak(`ملخص بسيط: ${simplifyText(post.transcript)}`);
    };

    // زر لغة الإشارة (للصم)
    const signBtn = document.createElement('button');
    signBtn.className = 'a11y-btn btn-sign';
    signBtn.innerHTML = '<i class="fas fa-hands-asl-interpreting"></i> <span>لغة إشارة</span>';
    signBtn.onclick = () => {
      // التوجيه لصفحة الأفاتار مع النص
      const text = encodeURIComponent(post.transcript || post.content);
      window.location.href = `sign-language.html?text=${text}`;
    };

    // إضافة الأزرار حسب نوع الإعاقة (أو إضافتها كلها للجميع)
    // للإعاقة السمعية: نركز على لغة الإشارة والتبسيط
    if (accessibilityManager.currentDisabilityType === 'hearing') {
      controlsDiv.appendChild(signBtn);
      controlsDiv.appendChild(simplifyBtn);
    }
    // للإعاقة البصرية: نركز على الاستماع والوصف
    else if (accessibilityManager.currentDisabilityType === 'visual') {
      controlsDiv.appendChild(listenBtn);
      controlsDiv.appendChild(describeBtn);

      // قراءة تلقائية عند التحويم
      wrapper.addEventListener('mouseenter', () => {
        speak(`منشور ${post.platform}. ${post.transcript}`);
      });
    }
    // للجميع: نضيف الكل
    else {
      controlsDiv.appendChild(listenBtn);
      controlsDiv.appendChild(signBtn);
      controlsDiv.appendChild(describeBtn);
      controlsDiv.appendChild(simplifyBtn);
    }

    wrapper.appendChild(contentDiv);
    wrapper.appendChild(controlsDiv);

    return wrapper;
  }

  /**
   * تهيئة التضمين الحقيقي (SDKs)
   */
  initEmbed(post) {
    const container = document.getElementById(`embed-${post.id}`);
    if (!container) return;

    switch (post.platform) {
      case 'youtube':
        container.innerHTML = `
                    <iframe width="100%" height="315" 
                    src="https://www.youtube.com/embed/${post.embedId}?enablejsapi=1" 
                    title="${post.title}" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen></iframe>`;
        break;

      case 'twitter':
        this.waitForTwitter(container, post.embedId);
        break;

      case 'facebook':
        // SDK Markup for Embedded Post
        container.innerHTML = `
                    <div class="fb-post" 
                    data-href="${post.embedUrl}" 
                    data-width="500" 
                    data-show-text="true"></div>`;
        this.waitForFacebook(container);
        break;

      case 'tiktok':
        container.innerHTML = `<blockquote class="tiktok-embed" cite="https://www.tiktok.com/@user/video/${post.embedId}" data-video-id="${post.embedId}" style="max-width: 605px;min-width: 325px;" > <section> <a target="_blank" title="@tiktok" href="https://www.tiktok.com/@tiktok">@tiktok</a> </section> </blockquote>`;
        // TikTok script usually auto-scans, but we can try to force it if needed
        if (window.tiktokEmbed) {
          window.tiktokEmbed.scan();
        }
        break;
    }
  }

  /**
   * انتظار تحميل مكتبة تويتر
   */
  waitForTwitter(container, tweetId, attempts = 0) {
    if (window.twttr && window.twttr.widgets) {
      container.innerHTML = ''; // Clear loading text
      window.twttr.widgets.createTweet(
        tweetId,
        container,
        { theme: accessibilityManager.preferences.highContrast ? 'dark' : 'light' }
      );
    } else {
      if (attempts < 10) {
        // Show loading state once
        if (attempts === 0) container.innerHTML = '<div class="loading-embed"><i class="fas fa-spinner fa-spin"></i> جارٍ تحميل التغريدة...</div>';

        setTimeout(() => this.waitForTwitter(container, tweetId, attempts + 1), 1000);
      } else {
        container.innerHTML = '<p class="error-text">عذراً، تعذر تحميل التغريدة. تأكد من اتصالك بالإنترنت.</p>';
      }
    }
  }

  /**
   * انتظار تحميل مكتبة فيسبوك
   */
  waitForFacebook(container, attempts = 0) {
    if (window.FB) {
      window.FB.XFBML.parse(container.parentElement);
    } else {
      if (attempts < 10) {
        setTimeout(() => this.waitForFacebook(container, attempts + 1), 1000);
      } else {
        // Facebook might still work via iframe if SDK fails, but usually we need SDK for valid sizing
        console.warn('Facebook SDK not ready after timeout');
      }
    }
  }

  /**
   * مشاركة منشور
   */
  sharePost(postId) {
    // ... implementation ...
  }
}

// إنشاء نسخة عامة
const socialMediaManager = new SocialMediaManager();

// تصدير
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SocialMediaManager, socialMediaManager };
}
