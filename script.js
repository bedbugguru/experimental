document.addEventListener('DOMContentLoaded', () => {
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    if (window.location.hash) {
        window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
    }
    window.addEventListener('pageshow', () => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    });

    const flyerViewer = document.querySelector('.flyer-viewer');
    const flyerViewerImage = flyerViewer?.querySelector('.flyer-viewer-image');
    const flyerViewerClose = flyerViewer?.querySelector('.flyer-viewer-close');
    if (flyerViewer && flyerViewerImage && flyerViewerClose) {
        document.addEventListener('click', event => {
            const link = event.target.closest('.flyer-card a');
            if (!link) {
                return;
            }

            event.preventDefault();
            flyerViewerImage.src = link.href;
            flyerViewerImage.alt = link.querySelector('img')?.alt ?? 'Full-size show flyer';
            flyerViewer.showModal();
            flyerViewerClose.focus();
        });

        flyerViewerClose.addEventListener('click', () => flyerViewer.close());
        flyerViewer.addEventListener('click', event => {
            if (event.target === flyerViewer) {
                flyerViewer.close();
            }
        });
    }

    const flyerArchive = document.getElementById('flyer-archive-grid');
    const archiveToggle = document.querySelector('.archive-toggle-btn');
    const archiveToggleWrap = archiveToggle?.parentElement;
    const archiveTitle = document.getElementById('flyer-archive-title');
    if (flyerArchive && archiveToggle && archiveToggleWrap && archiveTitle) {
        const flyerFiles = [
            '2022-08-06_Cg7oLhIPiHm_slide1.jpg',
            '2022-08-19_ChdYcfqrhCp_slide1.jpg',
            '2022-09-10_CiVc18mO6zI_slide1.jpg',
            '2022-10-13_CjqPWwLuPAN_slide1.jpg',
            '2022-10-22_CkCEPNUL8ne_slide1.jpg',
            '2022-11-01_CkbvfAju1m9_slide1.jpg',
            '2022-11-24_ClUv3AtuzxM_slide1.jpg',
            '2022-11-26_ClbkiJUrEHM_slide5.jpg',
            '2023-01-09_CnNLYb4v11A_slide1.jpg',
            '2023-01-18_CnkHbKHuSi7_slide1.jpg',
            '2023-03-01_CpQQQequdnd_slide1.jpg',
            '2023-04-07_Cqv9BDHOPev_slide1.jpg',
            '2023-06-20_Ctt8_bnrIw0_slide1.jpg',
            '2023-07-02_CuNdYqgO_aS_slide3.jpg',
            '2023-07-07_CuaeMjHxXnE_slide2.jpg',
            '2023-07-20_Cu7NijVr6qA_slide1.jpg',
            '2023-11-01_CzHOx_Bur4b_slide2.jpg',
            '2023-11-18_Czy_IhtNdqn_slide2.jpg',
            '2023-12-28_C1ZyWbbL1NI_slide3.jpg',
            '2025-03-18_DHWJsziSKE4_slide2.jpg',
            '2025-04-13_DIZUYm6Sp3y_slide2.jpg',
            '2025-04-18_DImuEZlTIea_slide2.jpg',
            '2025-04-24_DI1t4NvTTKf_slide2.jpg',
            '2025-06-13_DK2sYQAhkXf_slide2.jpg',
            '2025-06-13_DK2sYQAhkXf_slide3.jpg',
            '2025-09-03_DOJf2qLDu2Q_slide1.jpg',
            '2025-09-28_DPJ2P-wD-pI_slide1.jpg',
            '2026-01-08_DTQkd1hD0f6_slide1.jpg',
            '2026-01-09_DTTfv_Sk1ka_slide1.jpg',
            '2026-01-12_DTbF0_tD_WD_slide1.jpg',
            '2026-01-15_DTgwObHDxeD_slide1.jpg',
            '2026-01-26_DT_iyx0ktM8_slide2.jpg',
            '2026-02-04_DUWA8F2GDu6_slide1.jpg',
            '2026-02-05_DUZReh0knLV_slide1.jpg',
            '2026-02-09_DUjEdAnknof_slide1.jpg',
            '2026-02-11_DUoEb35lJ6M_slide1.jpg',
            '2026-02-26_DVM3YE_AcOj_slide1.jpg',
            '2026-03-16_DV9H8v6mH2G_slide2.jpg',
            '2026-03-16_DV9H8v6mH2G_slide3.jpg',
            '2026-04-02_DWpCfRmgbcI_slide2.jpg',
            '2026-04-05_DWw2WGqkroV_slide3.jpg',
            '2026-04-22_DXcHUkXFLgo_slide3.jpg',
            '2026-04-25_DXiUfaEDu3y_slide1.jpg',
            '2026-05-01_DXx8rWclK0E_slide2.jpg',
            '2026-05-14_DYVHWX5GE1U_slide2.jpg',
            '2026-08-03_DbkM6mdlJeG_slide1.jpg',
            '2026-09-09_DdFFSLsSqFB_slide1.jpg',
            '2026-10-07_DeMxSZzpwPP_slide1.jpg'
        ];

        flyerFiles.sort((a, b) => b.localeCompare(a)).forEach(filename => {
            const date = filename.slice(0, 10);
            const imagePath = `images/flyers/${filename}`;
            const card = document.createElement('figure');
            const link = document.createElement('a');
            const image = document.createElement('img');

            card.className = 'flyer-card';
            card.hidden = true;
            link.href = imagePath;
            link.setAttribute('aria-label', `Expand bed bug guru show flyer from ${date}`);
            image.src = imagePath;
            image.alt = `bed bug guru show flyer, ${date}`;
            image.loading = 'lazy';
            image.draggable = false;

            link.append(image);
            card.append(link);
            flyerArchive.append(card);
        });

        let expanded = false;
        function getPreviewCount() {
            const columnCount = getComputedStyle(flyerArchive).gridTemplateColumns
                .trim()
                .split(/\s+/)
                .filter(Boolean)
                .length;
            return Math.max(1, columnCount) * 2;
        }

        function updateVisibleFlyers() {
            const previewCount = getPreviewCount();
            [...flyerArchive.children].forEach((card, index) => {
                card.hidden = !expanded && index >= previewCount;
            });
            archiveToggleWrap.hidden = flyerFiles.length <= previewCount;
        }

        const archiveObserver = new ResizeObserver(updateVisibleFlyers);
        archiveObserver.observe(flyerArchive);
        updateVisibleFlyers();

        archiveToggle.addEventListener('click', () => {
            const previousScrollY = window.scrollY;
            const expandedGridRect = flyerArchive.getBoundingClientRect();
            const expandedGridTop = expandedGridRect.top + previousScrollY;
            expanded = !expanded;
            archiveToggle.setAttribute('aria-expanded', String(expanded));
            flyerArchive.classList.toggle('is-collapsed', !expanded);
            archiveToggle.textContent = expanded ? 'Show Less ↑' : 'Show More Archives ↓';
            updateVisibleFlyers();

            updateFloating();

            if (!expanded) {
                const collapsedGridHeight = flyerArchive.getBoundingClientRect().height;
                const collapsedGridBottom = expandedGridTop + collapsedGridHeight;
                if (previousScrollY > collapsedGridBottom) {
                    archiveTitle.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });

        function updateFloating() {
            const rect = flyerArchive.getBoundingClientRect();
            const floating = expanded && rect.top < window.innerHeight - 80;
            archiveToggleWrap.classList.toggle('is-floating', floating);
        }
        window.addEventListener('scroll', updateFloating, { passive: true });
        window.addEventListener('resize', updateFloating);
    }

    document.querySelectorAll('.press-photo-carousel').forEach(carousel => {
        const photos = [...carousel.querySelectorAll('.press-photo')];
        let activePhoto = photos.findIndex(photo => !photo.hidden);
        if (activePhoto < 0) {
            activePhoto = 0;
        }

        function showPhoto(index) {
            activePhoto = (index + photos.length) % photos.length;
            photos.forEach((photo, photoIndex) => {
                const isActive = photoIndex === activePhoto;
                photo.hidden = !isActive;
                photo.setAttribute('aria-hidden', String(!isActive));
            });
        }

        carousel.querySelector('.previous')?.addEventListener('click', () => showPhoto(activePhoto - 1));
        carousel.querySelector('.next')?.addEventListener('click', () => showPhoto(activePhoto + 1));
        showPhoto(activePhoto);
    });

    const videoFrame = document.getElementById('yt-background-player');
    const audioToggle = document.querySelector('.audio-toggle');
    const showsSection = document.getElementById('shows');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let songkickLoaded = false;
    let videoPlayer;
    let videoMuted = true;
    let videoPlaying = false;

    if (videoFrame && audioToggle) {
        function setVideoPlaying(isPlaying) {
            videoPlaying = isPlaying;
            if (isPlaying) {
                document.body.classList.add('motion-enabled');
            } else {
                document.body.classList.remove('motion-enabled');
            }
        }

        const youtubeApi = document.createElement('script');
        youtubeApi.src = 'https://www.youtube.com/iframe_api';
        youtubeApi.async = true;
        youtubeApi.onerror = () => {
            audioToggle.setAttribute('aria-label', 'Background video audio controls unavailable');
        };
        document.head.appendChild(youtubeApi);

        window.onYouTubeIframeAPIReady = () => {
            videoPlayer = new window.YT.Player(videoFrame, {
                events: {
                    onReady: () => {
                        videoPlayer.mute();
                        audioToggle.disabled = false;
                        if (prefersReducedMotion.matches) {
                            setVideoPlaying(false);
                            audioToggle.setAttribute('aria-label', 'Play background video with audio');
                        } else {
                            videoPlayer.playVideo();
                        }
                    },
                    onStateChange: event => {
                        if (
                            (event.data === window.YT.PlayerState.UNSTARTED || event.data === window.YT.PlayerState.CUED) &&
                            !prefersReducedMotion.matches
                        ) {
                            setTimeout(() => videoPlayer.playVideo(), 400);
                        }
                        if (event.data === window.YT.PlayerState.PLAYING) {
                            setVideoPlaying(true);
                        } else if (
                            event.data === window.YT.PlayerState.PAUSED ||
                            event.data === window.YT.PlayerState.ENDED
                        ) {
                            setVideoPlaying(false);
                        }
                    },
                    onError: () => {
                        audioToggle.disabled = true;
                        audioToggle.setAttribute('aria-label', 'Background video unavailable');
                    }
                }
            });
        };

        const startOnGesture = () => {
            if (videoPlayer && !videoPlaying && !prefersReducedMotion.matches) {
                if (videoMuted) {
                    videoPlayer.mute();
                }
                videoPlayer.playVideo();
            }
        };
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                startOnGesture();
            }
        });
        ['touchend', 'pointerup', 'click', 'keydown'].forEach(type =>
            window.addEventListener(type, startOnGesture, { passive: true }));

        audioToggle.addEventListener('click', () => {
            if (!videoPlayer) {
                return;
            }

            if (!videoPlaying) {
                videoPlayer.playVideo();
            }
            videoMuted = prefersReducedMotion.matches && !videoPlaying ? false : !videoMuted;
            if (videoMuted) {
                videoPlayer.mute();
            } else {
                videoPlayer.unMute();
            }

            audioToggle.setAttribute(
                'aria-label',
                videoMuted ? 'Turn background video audio on' : 'Turn background video audio off'
            );
            audioToggle.setAttribute('aria-pressed', String(!videoMuted));
        });
    }

    function loadSongkickWidget() {
        if (songkickLoaded) {
            return;
        }

        songkickLoaded = true;
        const script = document.createElement('script');
        script.src = 'https://widget-app.songkick.com/injector/10289853';
        script.async = true;
        document.body.appendChild(script);
    }

    if (showsSection && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                observer.disconnect();
                loadSongkickWidget();
            }
        });
        observer.observe(showsSection);
    } else if (showsSection) {
        loadSongkickWidget();
    }

    const directionNav = document.querySelector('.direction-nav');
    document.querySelector('.hero-logo-button')?.addEventListener('click', () => {
        document.documentElement.classList.toggle('is-inverted');
    });

    // Clicking anywhere on the background video container toggles sound
    const bgContainer = document.querySelector('.full-bg-video-container');
    bgContainer?.addEventListener('click', event => {
        if (event.target === bgContainer || event.target.classList.contains('bg-loop') || event.target.classList.contains('full-bg-overlay')) {
            audioToggle?.click();
        }
    });

    // Auto-turn on audio on first user gesture anywhere on page
    let autoAudioDone = false;
    const startAudioOnFirstGesture = () => {
        if (!autoAudioDone && audioToggle && !audioToggle.disabled) {
            autoAudioDone = true;
            if (audioToggle.getAttribute('aria-pressed') !== 'true') {
                audioToggle.click();
            }
        }
    };
    ['pointerdown', 'keydown', 'touchstart'].forEach(type =>
        window.addEventListener(type, startAudioOnFirstGesture, { passive: true, once: true }));

    function navigateToSection(target) {
        if (!target) {
            return;
        }
        const hash = `#${target.id}`;
        if (window.location.hash !== hash) {
            window.history.pushState(null, '', hash);
        }
        const targetTop = Math.max(0, target.getBoundingClientRect().top + window.scrollY);
        smoothScrollTo(targetTop);
    }

    let scrollFrame = 0;
    let isAutoScrolling = false;

    function smoothScrollTo(top) {
        cancelAnimationFrame(scrollFrame);
        const start = window.scrollY;
        const distance = top - start;
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduceMotion || Math.abs(distance) < 2) {
            window.scrollTo({ top, left: 0, behavior: 'instant' });
            return;
        }
        // Seamless quintic easing for ultra-buttery glide
        const duration = Math.min(1400, 500 + Math.abs(distance) * 0.28);
        const startTime = performance.now();
        const ease = t => (--t) * t * t * t * t + 1; // ease-out quint: glides to a silky stop
        isAutoScrolling = true;

        const cancel = () => {
            cancelAnimationFrame(scrollFrame);
            isAutoScrolling = false;
        };
        ['wheel', 'touchstart', 'keydown'].forEach(type =>
            window.addEventListener(type, cancel, { once: true, passive: true }));

        const step = now => {
            const elapsed = now - startTime;
            const t = Math.min(1, elapsed / duration);
            window.scrollTo({ top: start + distance * ease(t), left: 0, behavior: 'instant' });
            if (t < 1) {
                scrollFrame = requestAnimationFrame(step);
            } else {
                isAutoScrolling = false;
            }
        };
        scrollFrame = requestAnimationFrame(step);
    }

    // Seamless scroll inertia / momentum assist for mouse wheels
    (function initSeamlessScroll() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        // Check for touch device — native momentum is already great on touch
        const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        let targetY = window.scrollY;
        let currentY = window.scrollY;
        let animating = false;
        const friction = 0.88;
        const stepSize = 1;

        window.addEventListener('wheel', event => {
            // Only enhance discrete mouse wheels, skip precision trackpads with small deltaMode or ctrlKey (pinch)
            if (event.ctrlKey || isAutoScrolling) return;
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            if (maxScroll <= 0) return;

            // Keep target clamped
            targetY = Math.max(0, Math.min(maxScroll, (animating ? targetY : window.scrollY) + event.deltaY * 1.15));
            if (!animating) {
                animating = true;
                currentY = window.scrollY;
                requestAnimationFrame(render);
            }
        }, { passive: true });

        function render() {
            if (isAutoScrolling) {
                animating = false;
                return;
            }
            const diff = targetY - currentY;
            if (Math.abs(diff) < 0.5) {
                currentY = targetY;
                window.scrollTo(0, currentY);
                animating = false;
                return;
            }
            currentY += diff * (1 - friction);
            window.scrollTo(0, currentY);
            if (animating) {
                requestAnimationFrame(render);
            }
        }

        window.addEventListener('scroll', () => {
            if (!animating && !isAutoScrolling) {
                targetY = window.scrollY;
                currentY = window.scrollY;
            }
        }, { passive: true });
    })();

    directionNav?.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', event => {
            const target = document.getElementById(link.hash.slice(1));
            if (!target) {
                return;
            }

            event.preventDefault();
            navigateToSection(target);
        });
    });
});

(function () {
    const v = document.querySelector('video.bg-loop');
    if (!v) return;
    v.muted = true;
    v.addEventListener('playing', () => v.classList.add('is-playing'));
    v.addEventListener('pause', () => v.classList.remove('is-playing'));
    ['loadedmetadata', 'canplay', 'suspend', 'stalled'].forEach(e => v.addEventListener(e, () => { if (v.paused) go(); }));
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    function go() { const p = v.play(); if (p && p.catch) p.catch(() => {}); }
    go();
    ['touchend', 'pointerup', 'click', 'scroll', 'touchmove'].forEach(e =>
        window.addEventListener(e, () => { if (v.paused) go(); }, { once: true, passive: true }));
    document.addEventListener('visibilitychange', () => { if (!document.hidden && v.paused) go(); });
})();

(function () {
    const root = document.documentElement;
    const reveal = () => { window.__bbgReady = true; window.dispatchEvent(new Event('bbg-ready')); };
    const imageReady = img => (img.complete ? Promise.resolve() :
        new Promise(res => { img.addEventListener('load', res, { once: true }); img.addEventListener('error', res, { once: true }); }));
    const images = [...document.querySelectorAll('main img, .site-footer img')]
        .filter(img => img.offsetParent !== null && (img.loading !== 'lazy' || img.getBoundingClientRect().top < innerHeight))
        .map(imageReady);
    const fonts = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    Promise.all([fonts, ...images]).then(() => setTimeout(reveal, 60), reveal);
})();

(function () {
    const footer = document.querySelector('.site-footer');
    if (!footer) return;
    const setFooterHeight = () => document.documentElement.style.setProperty('--footer-h', footer.offsetHeight + 'px');
    setFooterHeight();
    window.addEventListener('resize', setFooterHeight);
    window.addEventListener('load', setFooterHeight);
    if (window.ResizeObserver) new ResizeObserver(setFooterHeight).observe(footer);
})();
