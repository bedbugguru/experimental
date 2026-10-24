(function () {
    const WORD = 'bedbugguru';
    const ASPECT = 0.55, JAW_ROW = 38, MAX_OPEN = 5;
    const MIN_MS = 2800, DISSOLVE_MS = 1400;
    const loader = document.getElementById('skull-loader');
    const pre = document.getElementById('skull');
    const bg = loader && loader.querySelector('.skull-bg');
    const ha = loader && loader.querySelector('.skull-ha');
    if (!loader || !pre) return;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const SYLS = [0.7, 0.55, 0.3, 1], SYL = 0.32, CYCLE = SYL * (SYLS.length + 2);
    const SAY = ['welcome', 'to', 'hell'];
    const ART = ["                        .######################.                        ","                    ################################                    ","               ##########################################               ","            ################################################            ","           ##################################################.          ","          ####################################################.         ","        ########################################################.       ","      .###########################################################      ","    .###############################################################    ","  ..#################################################################.  ","  ####################################################################  "," .####################################################################. "," ###################################################################### ",".######################################################################.","########################################################################","########################################################################","########################################################################","########################################################################","########################################################################",".######################################################################.","##################.......#######################......##################","##############.            .#####..   .#####.            ..#############",".##########..               .######..######.               ..##########."," .########.                  ##############                  .########. "," .########                   ##############                   ########. ","  #######                   .##############.                   .######  ","   ######                  ######......######.                 .#####   ","    ######           .##########.       ###########           ######    ","   ########.        ############.       ############         ########   ","  #############################          #############################  ","   ###########################            ###########################   ","   #################. .######.            .######. .#################   ","     ####.###################              ########################     ","           ..   #############              #############   ..           ","                .############.   ..   #   .#############                ","          ...     .############.###...##.############.     ....         ","         .###..     .##############################.     ..###.         ","         .#####      .#############################      #####.         ","          .####      .####  ################  #####      #####          ","           #####.     ...   .###  .###  ###.   ...      #####.          ","           .#####.                                     #####.           ","           ######   #######  ###.  .#   ###  #######   ######.          ","           #######. .####### .############. ######## .#######.          ","           .################################################..          ","          .##################################################.          ","           ##################################################.          ","              .##########################################.              ","               ##########################################               ","                ########################################                ","                 ######################################                 "];
    const W = ART[0].length, H = ART.length + MAX_OPEN;
    const thresholds = Array.from({ length: W * H }, Math.random);
    const start = performance.now();
    let dissolveAt = 0;

    function fit() {
        const fs = Math.min(innerWidth * 0.94 / (W * 0.6), innerHeight * 0.88 / H);
        pre.style.fontSize = fs.toFixed(2) + 'px';
    }
    addEventListener('resize', fit);
    fit();

    function draw(now) {
        const t = (now - start) / 1000;
        const cyc = (t % CYCLE) / SYL;
        const si = Math.floor(cyc);
        const beat = reduce || si >= SYLS.length ? 0 : SYLS[si] * Math.sin((cyc - si) * Math.PI) ** 0.8;
        const open = Math.round(beat * MAX_OPEN);
        const shake = 0;
        const tick = Math.floor(t * 8);
        const p = dissolveAt ? Math.min(1, (now - dissolveAt) / DISSOLVE_MS) : -1;
        const rows = [];
        for (let r = 0; r < H; r++) {
            let line = '';
            for (let c = 0; c < W; c++) {
                const sc = c - shake;
                let g = ' ';
                if (r < JAW_ROW && ART[r][sc] !== undefined) g = ART[r][sc];
                const jr = r - open;
                if (jr >= JAW_ROW && jr < ART.length && ART[jr][sc] !== undefined && ART[jr][sc] !== ' ') g = ART[jr][sc];
                if (g === ' ') { line += ' '; continue; }
                let ch = g === '.' ? '.' : WORD[(c + r * 3 + tick) % WORD.length];
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
        if (ha) { ha.textContent = (si >= SYLS.length ? SAY : SAY.slice(0, [1, 1, 2, 3][si])).join(' '); ha.style.opacity = p >= 0 ? 0 : '1'; }
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
