// Accessibility utility functions

export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite') {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;

    document.body.appendChild(announcement);

    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

export function trapFocus(element: HTMLElement) {
    const focusableElements = element.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e: KeyboardEvent) => {
        if (e.key !== 'Tab') return;

        if (e.shiftKey) {
            if (document.activeElement === firstFocusable) {
                lastFocusable.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === lastFocusable) {
                firstFocusable.focus();
                e.preventDefault();
            }
        }
    };

    element.addEventListener('keydown', handleTabKey);

    return () => {
        element.removeEventListener('keydown', handleTabKey);
    };
}

export function getAriaLabel(key: string, value?: string | number): string {
    const labels: Record<string, string> = {
        'close': 'Kapat',
        'menu': 'Menü',
        'search': 'Ara',
        'profile': 'Profil',
        'logout': 'Çıkış yap',
        'login': 'Giriş yap',
        'register': 'Kayıt ol',
        'dashboard': 'Ana sayfa',
        'notifications': 'Bildirimler',
        'settings': 'Ayarlar',
        'loading': 'Yükleniyor',
        'error': 'Hata',
        'success': 'Başarılı',
    };

    return value ? `${labels[key] || key}: ${value}` : labels[key] || key;
}
