document.addEventListener("DOMContentLoaded", () => {
    
    // 1. الوضع الليلي (Dark Mode)
    const themeToggleBtn = document.getElementById("themeToggle");
    const themeIcon = document.getElementById("themeIcon");

    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-mode");
        if (themeIcon) themeIcon.classList.replace("bi-moon-fill", "bi-sun-fill");
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener("click", () => {
            document.body.classList.toggle("dark-mode");
            const isDark = document.body.classList.contains("dark-mode");
            localStorage.setItem("theme", isDark ? "dark" : "light");
            
            if (isDark) {
                themeIcon.classList.replace("bi-moon-fill", "bi-sun-fill");
            } else {
                themeIcon.classList.replace("bi-sun-fill", "bi-moon-fill");
            }
        });
    }

    // 2. زر الصعود لأعلى (Scroll To Top)
    const scrollTopBtn = document.getElementById("scrollTopBtn");
    window.addEventListener("scroll", () => {
        if (scrollTopBtn) {
            scrollTopBtn.style.display = window.scrollY > 300 ? "flex" : "none";
        }
    });

    if (scrollTopBtn) {
        scrollTopBtn.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    // 3. فلترة الفعاليات
    const categoryFilter = document.getElementById("categoryFilter");
    const searchInput = document.getElementById("searchInput");
    const eventItems = document.querySelectorAll(".event-item");

    function filterEvents() {
        if (!categoryFilter || !searchInput) return;
        const selectedCategory = categoryFilter.value;
        const searchText = searchInput.value.toLowerCase().trim();

        eventItems.forEach(item => {
            const itemCategory = item.getAttribute("data-category");
            const itemTitle = item.querySelector(".event-title").textContent.toLowerCase();
            const matchesCategory = (selectedCategory === "all" || itemCategory === selectedCategory);
            const matchesSearch = itemTitle.includes(searchText);

            item.style.display = (matchesCategory && matchesSearch) ? "block" : "none";
        });
    }

    if (categoryFilter) categoryFilter.addEventListener("change", filterEvents);
    if (searchInput) searchInput.addEventListener("keyup", filterEvents);

    // 4. التحقق من نموذج الاتصال
    const contactForm = document.getElementById("contactForm");
    const successAlert = document.getElementById("successAlert");
    const errorAlert = document.getElementById("errorAlert");

    if (contactForm) {
        contactForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const name = document.getElementById("userName").value.trim();
            const email = document.getElementById("userEmail").value.trim();
            const message = document.getElementById("userMessage").value.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (name === "" || message === "" || !emailRegex.test(email)) {
                errorAlert.classList.remove("d-none");
                successAlert.classList.add("d-none");
            } else {
                successAlert.classList.remove("d-none");
                errorAlert.classList.add("d-none");
                contactForm.reset();
                setTimeout(() => successAlert.classList.add("d-none"), 5000);
            }
        });
    }
    // ==========================================
    // ==========================================
    // 5. نقل بيانات الكرت لصفحة التفاصيل (  LocalStorage)
    // ==========================================
    
    const detailButtons = document.querySelectorAll('a[href="event.html"]');
    detailButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.event-card');
            if(card) {
                const eventData = {
                    title: card.querySelector('.event-title').innerText,
                    category: card.querySelector('.badge').innerText,
                    desc: card.querySelector('.card-text').innerText,
                    img: card.querySelector('.card-img-top').src,
                    dateInfo: card.querySelector('.text-muted.small.mb-3').innerText
                };
                localStorage.setItem('selectedEvent', JSON.stringify(eventData));
            }
        });
    });

    if (window.location.pathname.includes("event.html")) {
        const savedData = localStorage.getItem('selectedEvent');
        if (savedData) {
            const eventData = JSON.parse(savedData);
            
            const titleEl = document.getElementById('detailTitle');
            const catEl = document.getElementById('detailCategory');
            const imgEl = document.getElementById('detailImage');
            const descEl = document.getElementById('detailDesc');
            const dateEl = document.getElementById('detailDate');

            if(titleEl) titleEl.innerText = eventData.title;
            if(catEl) catEl.innerText = eventData.category;
            if(imgEl) imgEl.src = eventData.img;
            
            if(descEl) {
                descEl.innerText = eventData.desc + "\n\nندوة تفاعلية تسلط الضوء على المفاهيم الأساسية وتطبيقاتها. نتشرف بحضوركم لمناقشة أهم المحاور وتقديم الفائدة العلمية والعملية للجميع ضمن هذه الفعالية المميزة.";
            }
            
            if(dateEl) {
                dateEl.innerHTML = eventData.dateInfo;
            }
        }
    }
});
// ==========================================
// كود تغيير محتوى صفحة الفعالية ديناميكياً
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    // 1. قراءة رقم الفعالية من الرابط (مثلاً ?id=3)
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('id');

    // 2. إذا كان في رقم بالرابط، بنغير المحتوى
    if (eventId) {
        // قاعدة بيانات مصغرة للفعاليات
        const eventsData = {
            '3': {
                title: 'ورشة بناء واجهات الويب',
                category: 'تقنية وبرمجة',
                img: 'assets/img/code.jpg',
                desc: 'ورشة عمل متقدمة لتعلم استخدام المكاتب الحديثة في بناء التطبيقات وتطوير واجهات المستخدم التفاعلية.'
            },
            '4': {
                title: 'هاكاثون البرمجة السنوي',
                category: 'تقنية وبرمجة',
                img: 'assets/img/hackathon.jpg',
                desc: 'تحدي برمجي متكامل لمدة 24 ساعة لبناء حلول تقنية مبتكرة بمشاركة نخبة من طلاب الهندسة المعلوماتية.'
            }
        };

        const selectedEvent = eventsData[eventId];

        // 3. تبديل النصوص والصور بالصفحة بناءً على الداتا
        if (selectedEvent) {
            const titleEl = document.getElementById('detailTitle');
            const catEl = document.getElementById('detailCategory');
            const imgEl = document.getElementById('detailImage');
            const descEl = document.getElementById('detailDesc');

            if(titleEl) titleEl.textContent = selectedEvent.title;
            if(catEl) catEl.textContent = selectedEvent.category;
            if(imgEl) imgEl.src = selectedEvent.img;
            if(descEl) descEl.textContent = selectedEvent.desc;
        }
    }
});
// ==========================================
// كود المشاركة وتوليد ملف التقويم (.ics)
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    
    // 1. زر المشاركة (Share API)
    const shareBtn = document.getElementById('shareBtn');
    if (shareBtn) {
        shareBtn.addEventListener('click', () => {
            // إذا المستخدم فاتح من موبايل وبيدعم المشاركة المباشرة
            if (navigator.share) {
                navigator.share({
                    title: document.title,
                    url: window.location.href
                }).catch(console.error);
            } else {
                // إذا فاتح من لابتوب: بننسخ الرابط للحافظة
                navigator.clipboard.writeText(window.location.href);
                alert('تم نسخ رابط الفعالية للحافظة بنجاح! 📋');
            }
        });
    }

    // 2. زر أضف للتقويم (توليد ملف .ics)
    const calendarBtn = document.getElementById('addToCalendarBtn');
    if (calendarBtn) {
        calendarBtn.addEventListener('click', () => {
            const titleEl = document.getElementById('detailTitle');
            const eventTitle = titleEl ? titleEl.innerText : 'فعالية الجامعة الافتراضية';
            
            // بناء محتوى ملف التقويم القياسي
            const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${eventTitle}
DTSTART:20261028T140000Z
DTEND:20261028T160000Z
LOCATION:الجامعة الافتراضية السورية
DESCRIPTION:تذكير بحضور الفعالية: ${eventTitle}
END:VEVENT
END:VCALENDAR`;

            // خدعة إنشاء الملف وتحميله برمجياً
            const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'event.ics'); // اسم الملف اللي رح ينزل
            document.body.appendChild(link);
            link.click(); // كبسة وهمية لتنزيل الملف
            document.body.removeChild(link);
        });
    }
});