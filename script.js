(function () {
    'use strict';

    const nav = document.getElementById('navbar');
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    function updateNavScroll() {
        if (window.scrollY > 60) nav.classList.add('scrolled');
        else nav.classList.remove('scrolled');
    }

    navToggle?.addEventListener('click', function () {
        navLinks.classList.toggle('open');
    });

    document.querySelectorAll('.nav-links a').forEach(function (a) {
        a.addEventListener('click', function () {
            navLinks.classList.remove('open');
        });
    });

    window.addEventListener('scroll', updateNavScroll);
    updateNavScroll();

    document.querySelectorAll('.flip-card').forEach(function (card) {
        card.addEventListener('click', function (e) {
            if (window.matchMedia('(hover: none)').matches) {
                e.preventDefault();
                this.classList.toggle('flipped');
            }
        });
    });

    var yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    var symbols = ['◆', '●', '▲', '■', '★', '♦', '♥', '♣'];
    var memoryBoard = document.getElementById('memoryBoard');
    var memoryStatus = document.getElementById('memoryStatus');
    var memoryReset = document.getElementById('memoryReset');

    function buildMemoryGame() {
        var pairs = 8;
        var arr = [];
        for (var i = 0; i < pairs; i++) {
            arr.push(symbols[i], symbols[i]);
        }
        for (var i = arr.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var t = arr[i];
            arr[i] = arr[j];
            arr[j] = t;
        }

        memoryBoard.innerHTML = '';
        arr.forEach(function (sym, index) {
            var tile = document.createElement('div');
            tile.className = 'memory-tile';
            tile.dataset.index = index;
            tile.dataset.symbol = sym;
            tile.setAttribute('aria-label', 'Card');
            tile.textContent = '?';
            memoryBoard.appendChild(tile);
        });
    }

    var flipped = [];
    var locked = false;

    function checkMatch() {
        if (flipped.length !== 2) return;
        locked = true;
        var a = flipped[0];
        var b = flipped[1];
        if (a.dataset.symbol === b.dataset.symbol) {
            a.classList.add('matched');
            b.classList.add('matched');
            flipped = [];
            locked = false;
            var matched = document.querySelectorAll('.memory-tile.matched').length;
            if (matched === 16) {
                memoryStatus.textContent = 'You won!';
            }
            return;
        }
        setTimeout(function () {
            a.classList.remove('revealed');
            b.classList.remove('revealed');
            a.textContent = '?';
            b.textContent = '?';
            flipped = [];
            locked = false;
        }, 600);
    }

    memoryBoard?.addEventListener('click', function (e) {
        var tile = e.target.closest('.memory-tile');
        if (!tile || tile.classList.contains('matched') || tile.classList.contains('revealed') || locked) return;
        if (flipped.length === 2) return;
        tile.classList.add('revealed');
        tile.textContent = tile.dataset.symbol;
        flipped.push(tile);
        if (flipped.length === 2) checkMatch();
    });

    memoryReset?.addEventListener('click', function () {
        flipped = [];
        locked = false;
        memoryStatus.textContent = 'Match all pairs!';
        buildMemoryGame();
    });

    buildMemoryGame();

    var reactionArea = document.getElementById('reactionArea');
    var reactionWait = document.getElementById('reactionWait');
    var reactionGo = document.getElementById('reactionGo');
    var reactionResult = document.getElementById('reactionResult');
    var reactionReset = document.getElementById('reactionReset');

    var reactionState = 'idle';
    var reactionTimer = null;
    var reactionStart = null;

    function reactionSchedule() {
        reactionState = 'waiting';
        reactionArea.classList.add('waiting');
        reactionArea.classList.remove('go');
        reactionWait.textContent = 'Wait for it...';
        reactionGo.style.display = 'none';
        reactionWait.style.display = 'block';
        reactionResult.textContent = '';

        var delay = 1500 + Math.random() * 2500;
        reactionTimer = setTimeout(function () {
            reactionState = 'go';
            reactionStart = performance.now();
            reactionArea.classList.remove('waiting');
            reactionArea.classList.add('go');
            reactionWait.style.display = 'none';
            reactionGo.style.display = 'block';
            reactionTimer = null;
        }, delay);
    }

    reactionArea?.addEventListener('click', function () {
        if (reactionState === 'idle') {
            reactionSchedule();
            return;
        }
        if (reactionState === 'waiting') {
            if (reactionTimer) clearTimeout(reactionTimer);
            reactionTimer = null;
            reactionState = 'idle';
            reactionArea.classList.remove('waiting', 'go');
            reactionWait.textContent = 'Too early! Click to start again.';
            reactionWait.style.display = 'block';
            reactionGo.style.display = 'none';
            reactionResult.textContent = '';
            return;
        }
        if (reactionState === 'go') {
            var ms = Math.round(performance.now() - reactionStart);
            reactionResult.textContent = ms + ' ms';
            reactionState = 'idle';
            reactionArea.classList.remove('go');
            reactionWait.textContent = 'Click to start';
            reactionWait.style.display = 'block';
            reactionGo.style.display = 'none';
        }
    });

    reactionReset?.addEventListener('click', function () {
        if (reactionTimer) clearTimeout(reactionTimer);
        reactionTimer = null;
        reactionState = 'idle';
        reactionArea.classList.remove('waiting', 'go');
        reactionWait.textContent = 'Click to start';
        reactionWait.style.display = 'block';
        reactionGo.style.display = 'none';
        reactionResult.textContent = '';
    });
})();
