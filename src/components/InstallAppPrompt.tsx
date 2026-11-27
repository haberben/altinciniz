'use client';

import { useEffect, useState } from 'react';
import { Download, Share, PlusSquare, X, Smartphone, MoreVertical, CheckCircle2 } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

const DISMISS_KEY = 'altinciniz_install_dismissed_at';
const DISMISS_DAYS = 7;

export function InstallAppButton({ variant = 'header' }: { variant?: 'header' | 'footer' }) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      Boolean((window.navigator as { standalone?: boolean }).standalone);
    if (standalone) setHidden(true);
  }, []);

  if (hidden) return null;

  const openPrompt = () => {
    window.dispatchEvent(new Event('altinciniz:trigger-install'));
  };

  if (variant === 'footer') {
    return (
      <button
        type="button"
        onClick={openPrompt}
        style={{
          background: 'transparent',
          border: 'none',
          padding: 0,
          color: 'var(--gold-dark)',
          fontWeight: 700,
          fontSize: 13,
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          textAlign: 'left',
        }}
      >
        <Smartphone size={14} aria-hidden="true" />
        Telefon Ana Ekranına Ekle
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={openPrompt}
      style={{
        background: 'rgba(255,255,255,0.08)',
        border: '1px solid rgba(255,255,255,0.22)',
        color: '#ffffff',
        padding: '6px 11px',
        borderRadius: 8,
        fontSize: 12,
        fontWeight: 700,
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        whiteSpace: 'nowrap',
      }}
      title="Altıncınız'ı telefonunuzun veya bilgisayarınızın ana ekranına kısayol olarak ekleyin"
    >
      <Download size={14} aria-hidden="true" />
      <span>Ana Ekrana Ekle</span>
    </button>
  );
}

export default function InstallAppPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [installedToast, setInstalledToast] = useState(false);
  const [platform, setPlatform] = useState<'ios' | 'android' | 'desktop'>('android');

  useEffect(() => {
    // Register lightweight pass-through SW for Android Chrome installability
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }

    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      Boolean((window.navigator as { standalone?: boolean }).standalone);
    if (standalone) return;

    const ua = navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(ua);
    const isAndroid = /android/.test(ua);
    setPlatform(isIOS ? 'ios' : isAndroid ? 'android' : 'desktop');

    const dismissedAt = Number(localStorage.getItem(DISMISS_KEY) || '0');
    const recentlyDismissed = dismissedAt > 0 && Date.now() - dismissedAt < DISMISS_DAYS * 86400 * 1000;

    if (!recentlyDismissed && (isIOS || isAndroid)) {
      const timer = setTimeout(() => setShowBanner(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      const dismissedAt = Number(localStorage.getItem(DISMISS_KEY) || '0');
      const recentlyDismissed = dismissedAt > 0 && Date.now() - dismissedAt < DISMISS_DAYS * 86400 * 1000;
      if (!recentlyDismissed) {
        setShowBanner(true);
      }
    };

    const handleInstalled = () => {
      setDeferredPrompt(null);
      setShowBanner(false);
      setShowGuideModal(false);
      setInstalledToast(true);
      setTimeout(() => setInstalledToast(false), 4000);
    };

    const handleTrigger = async () => {
      if (deferredPrompt) {
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === 'accepted') {
          setShowBanner(false);
        }
        setDeferredPrompt(null);
      } else {
        setShowGuideModal(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleInstalled);
    window.addEventListener('altinciniz:trigger-install', handleTrigger);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleInstalled);
      window.removeEventListener('altinciniz:trigger-install', handleTrigger);
    };
  }, [deferredPrompt]);

  const dismissBanner = () => {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
    setShowBanner(false);
  };

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setShowBanner(false);
      }
      setDeferredPrompt(null);
    } else {
      setShowGuideModal(true);
    }
  };

  return (
    <>
      {/* Mobil Alt Yüzen Kurulum Çubuğu (0 CLS - sadece mobilde ve henüz eklenmemişse) */}
      {showBanner && !showGuideModal && (
        <aside
          className="install-floating-banner"
          aria-label="Ana ekrana ekleme önerisi"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0, flex: 1 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: 'linear-gradient(135deg, #D4AF37 0%, #FCE782 100%)',
                color: '#0f1e38',
                fontWeight: 900,
                fontSize: 20,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              A
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#ffffff', lineHeight: 1.2 }}>
                Altıncınız&apos;ı Ana Ekrana Ekle
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)', lineHeight: 1.3, marginTop: 2 }}>
                Tarayıcı açmadan tek dokunuşla canlı fiyatlara girin
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            <button
              type="button"
              onClick={handleInstallClick}
              style={{
                background: 'linear-gradient(135deg, #D4AF37 0%, #FCE782 100%)',
                color: '#0f1e38',
                border: 'none',
                borderRadius: 8,
                padding: '8px 12px',
                fontSize: 12,
                fontWeight: 800,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              Ekle
            </button>
            <button
              type="button"
              onClick={dismissBanner}
              aria-label="Kapat"
              style={{
                background: 'rgba(255,255,255,0.1)',
                color: '#ffffff',
                border: 'none',
                borderRadius: 8,
                width: 32,
                height: 32,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <X size={16} />
            </button>
          </div>
        </aside>
      )}

      {/* Başarı bildirimi */}
      {installedToast && (
        <div className="install-floating-banner" role="status" style={{ background: '#14532d', borderColor: '#22c55e' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#ffffff', fontSize: 13, fontWeight: 700 }}>
            <CheckCircle2 size={18} color="#4ade80" />
            <span>Altıncınız ana ekranınıza eklendi!</span>
          </div>
        </div>
      )}

      {/* iOS / Manuel Tarayıcı Yönlendirme Penceresi */}
      {showGuideModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="install-guide-title"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 30, 56, 0.65)',
            zIndex: 80,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
          }}
          onClick={() => setShowGuideModal(false)}
        >
          <div
            className="card"
            style={{ width: '100%', maxWidth: 420, padding: 22, position: 'relative' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowGuideModal(false)}
              aria-label="Pencereyi kapat"
              style={{
                position: 'absolute',
                top: 14,
                right: 14,
                width: 32,
                height: 32,
                borderRadius: 8,
                border: '1px solid var(--border)',
                background: 'var(--bg-table-h)',
                color: 'var(--text-primary)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <X size={16} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: '#1b2f52',
                  border: '2px solid #D4AF37',
                  color: '#FCE782',
                  fontWeight: 900,
                  fontSize: 20,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                A
              </div>
              <div>
                <h2 id="install-guide-title" style={{ fontSize: 16, fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
                  Ana Ekrana Nasıl Eklenir?
                </h2>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '2px 0 0' }}>
                  Uygulama indirmeden telefonunuza kısayol ekleyin
                </p>
              </div>
            </div>

            {platform === 'ios' ? (
              <ol style={{ margin: 0, paddingLeft: 18, display: 'grid', gap: 12, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                <li>
                  Safari alt çubuğundaki <strong style={{ color: 'var(--text-primary)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>Paylaş <Share size={14} /></strong> simgesine dokunun.
                </li>
                <li>
                  Açılan menüyü aşağı kaydırıp <strong style={{ color: 'var(--text-primary)', display: 'inline-flex', alignItems: 'center', gap: 4 }}><PlusSquare size={14} /> Ana Ekrana Ekle</strong> seçeneğine tıklayın.
                </li>
                <li>
                  Sağ üst köşedeki <strong style={{ color: 'var(--text-primary)' }}>&ldquo;Ekle&rdquo;</strong> butonuna basarak işlemi tamamlayın.
                </li>
              </ol>
            ) : platform === 'android' ? (
              <ol style={{ margin: 0, paddingLeft: 18, display: 'grid', gap: 12, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                <li>
                  Tarayıcının sağ üst köşesindeki <strong style={{ color: 'var(--text-primary)', display: 'inline-flex', alignItems: 'center', gap: 3 }}><MoreVertical size={14} /> Menü</strong> simgesine dokunun.
                </li>
                <li>
                  <strong style={{ color: 'var(--text-primary)' }}>&ldquo;Ana ekrana ekle&rdquo;</strong> veya <strong style={{ color: 'var(--text-primary)' }}>&ldquo;Uygulamayı yükle&rdquo;</strong> seçeneğini seçin.
                </li>
                <li>
                  Onayladığınızda <strong>Altıncınız</strong> ikonu doğrudan telefon ekranınıza yerleşir.
                </li>
              </ol>
            ) : (
              <ol style={{ margin: 0, paddingLeft: 18, display: 'grid', gap: 12, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                <li>
                  Chrome veya Edge tarayıcı adres çubuğunun sağındaki <strong style={{ color: 'var(--text-primary)' }}>Yükle (Masaüstüne Ekle)</strong> simgesine tıklayın.
                </li>
                <li>
                  Alternatif olarak tarayıcı menüsünden <strong style={{ color: 'var(--text-primary)' }}>Kaydet ve Paylaş → Altıncınız&apos;ı Yükle</strong> yolunu seçebilirsiniz.
                </li>
              </ol>
            )}

            <button
              type="button"
              onClick={() => setShowGuideModal(false)}
              style={{
                marginTop: 18,
                width: '100%',
                background: 'var(--bg-header)',
                color: '#ffffff',
                border: 'none',
                borderRadius: 8,
                padding: '10px 14px',
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Anladım
            </button>
          </div>
        </div>
      )}
    </>
  );
}
