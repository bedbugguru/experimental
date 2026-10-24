(function () {
    const WORD = 'bedbugguru';
    const W = 64, H = 40, CX = 32, CY = 18, ASPECT = 0.6;
    const MIN_MS = 2800, DISSOLVE_MS = 1400;
    const loader = document.getElementById('skull-loader');
    const pre = document.getElementById('skull');
    const bg = loader && loader.querySelector('.skull-bg');
    const ha = loader && loader.querySelector('.skull-ha');
    if (!loader || !pre) return;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ell = (x, y, cx, cy, rx, ry) => ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1;

    function cranium(c, r) {
        const x = (c - CX) * ASPECT, y = r - CY;
        let on = false;
        if (y <= 3) on = ell(x, y, 0, -4, 16, 12.5);
        else if (y <= 9) on = Math.abs(x) <= 12 - (y - 3) * 0.7;
        if (!on) return false;
        if (ell(Math.abs(x), y, 6.2, 0.5, 4.6, 4.2)) return false;
        if (y >= 4.5 && y <= 8 && Math.abs(x) <= (y - 4.5) * 0.7 + 0.2) return false;
        if (y >= 8 && c % 3 === 0) return false;
        return true;
    }
    function jaw(c, r) {
        const x = (c - CX) * ASPECT, y = r - CY;
        if (y < 10.5 || y > 15.5) return false;
        if (Math.abs(x) > 9.5 - (y - 10.5) * 0.6) return false;
        if (y <= 12.5 && c % 3 === 0) return false;
        return true;
    }

    const thresholds = Array.from({ length: W * H }, Math.random);
    const start = performance.now();
    let dissolveAt = 0;

    function fit() {
        const fs = Math.min(innerWidth * 0.92 / (W * ASPECT), innerHeight * 0.84 / H);
        pre.style.fontSize = fs.toFixed(2) + 'px';
    }
    addEventListener('resize', fit);
    fit();

    function draw(now) {
        const t = (now - start) / 1000;
        const beat = reduce ? 0 : Math.max(0, Math.sin(t * Math.PI * 2 * 2.6));
        const open = Math.round(beat * 4);
        const shake = Math.round(beat * 2) % 2 ? 1 : 0;
        const tick = Math.floor(t * 8);
        const p = dissolveAt ? Math.min(1, (now - dissolveAt) / DISSOLVE_MS) : -1;
        const rows = [];
        for (let r = 0; r < H; r++) {
            let line = '';
            for (let c = 0; c < W; c++) {
                if (!cranium(c - shake, r) && !jaw(c, r - open)) { line += ' '; continue; }
                let ch = WORD[(c + r * 3 + tick) % WORD.length];
                if (p >= 0) {
                    const th = thresholds[r * W + c] * 0.8;
                    if (p > th + 0.2) ch = ' ';
                    else if (p > th) ch = '.';
                }
                line += ch;
            }
            rows.push(line);
        }
        pre.textContent = rows.join('\n');
        if (ha) ha.style.opacity = p >= 0 ? 0 : String(0.4 + 0.6 * beat);
        if (p >= 0 && bg) bg.style.opacity = String(Math.max(0, 1 - p * 1.4));
        if (p >= 1) { loader.classList.add('is-done'); return; }
        setTimeout(() => requestAnimationFrame(draw), 0);
    }
    requestAnimationFrame(draw);

    const beginDissolve = () => {
        const wait = Math.max(0, MIN_MS - (performance.now() - start));
        setTimeout(() => { dissolveAt = performance.now(); }, wait);
    };
    if (window.__bbgReady) beginDissolve();
    else window.addEventListener('bbg-ready', beginDissolve, { once: true });
    setTimeout(() => { if (!dissolveAt) dissolveAt = performance.now(); }, 9000);
})();
