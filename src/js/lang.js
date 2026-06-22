document.addEventListener('DOMContentLoaded', () => {
    const langToggle = document.getElementById('langToggle');
    const htmlRoot = document.documentElement;
    
    // Check saved language
    const savedLang = localStorage.getItem('lang') || 'en';
    
    applyLanguage(savedLang);

    if (langToggle) {
        langToggle.addEventListener('click', () => {
            const currentLang = htmlRoot.getAttribute('lang');
            const newLang = currentLang === 'en' ? 'ar' : 'en';
            localStorage.setItem('lang', newLang);
            window.location.reload();
        });
    }
    
    async function applyLanguage(lang) {
        htmlRoot.setAttribute('lang', lang);
        htmlRoot.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
        localStorage.setItem('lang', lang);
        
        if (langToggle) {
            langToggle.textContent = lang === 'en' ? 'AR' : 'EN';
        }

        // --- NEW LOGIC: Fetch JSON files ---
        const page = document.body.getAttribute('data-page') || 'index';
        try {
            const [commonRes, pageRes] = await Promise.all([
                fetch(`lang/${lang}/common.json`),
                fetch(`lang/${lang}/${page}.json`)
            ]);

            let commonData = {};
            let pageData = {};

            if (commonRes.ok) commonData = await commonRes.json();
            if (pageRes.ok) pageData = await pageRes.json();

            const translations = { ...commonData, ...pageData };

            document.querySelectorAll('[data-i18n]').forEach(el => {
                const key = el.getAttribute('data-i18n');

                // Process dot notation keys like "nav.home"
                const keys = key.split('.');
                let value = translations;
                for (const k of keys) {
                    value = value ? value[k] : undefined;
                }

                if (value && typeof value === 'string') {
                    el.innerHTML = value; // innerHTML allows translating spans/strong within text
                }
            });

            // Re-apply translations after a delay to ensure all elements are loaded
            setTimeout(() => {
                document.querySelectorAll('[data-i18n]').forEach(el => {
                    const key = el.getAttribute('data-i18n');
                    const keys = key.split('.');
                    let value = translations;
                    for (const k of keys) {
                        value = value ? value[k] : undefined;
                    }
                    if (value && typeof value === 'string') {
                        el.innerHTML = value;
                    }
                });
            }, 500);
        } catch (error) {
            console.error('Error loading language files:', error);
        }
        // --- END NEW LOGIC ---
        
        // --- LEGACY LOGIC ---
        // Find all elements with data-ar and data-en
        const translatableElements = document.querySelectorAll('[data-ar][data-en]');
        
        translatableElements.forEach(el => {
            el.textContent = el.getAttribute(`data-${lang}`);
        });

        // specific for typewrite element
        const typeWriteElements = document.querySelectorAll('.typewrite');
        typeWriteElements.forEach(el => {
            const currentType = el.getAttribute(`data-curr-type-${lang}`);
            if (currentType) {
                el.setAttribute('data-type', currentType);
            }
        });
        // --- END LEGACY LOGIC ---

        // Dispatch a custom event globally that language was changed
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang: lang } }));
    }

    // Expose to global window
    window.applyLanguage = applyLanguage;
});
