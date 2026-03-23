const CONFIG = {
    scriptURL: 'https://script.google.com/macros/s/AKfycbyLcfqhHxWlVnwl_xjW1UbdcBVB2gZy7HrxxOGBWuOTZwRyiPig4m_L1WOLmwPZxOg/exec',
    weddingDate: new Date("April 5, 2026 08:00:00").getTime(),
    eventTitle: "Pernikahan Zumrotus & Arrosid",
    eventStartUTC: "20260405T010000Z", 
    eventEndUTC: "20260405T060000Z",   
    eventLocation: "GOR Jatimekar, Bandung",
    eventDesc: "Merupakan suatu kehormatan apabila Bapak/Ibu/Saudara/i berkenan hadir."
};

document.addEventListener("DOMContentLoaded", () => {
    
    window.addEventListener('load', () => {
        const loader = document.getElementById('loader-screen');
        if (loader) {
            setTimeout(() => {
                loader.classList.add('hide');
            }, 500); 
        }
    });

    const urlParams = new URLSearchParams(window.location.search);
    const guestName = urlParams.get('to');
    const guestNameEl = document.getElementById('guest-name');
    
    if (guestNameEl) {
        if (guestName && guestName.trim() !== '') {
            const safeName = guestName.replace(/</g, "<").replace(/>/g, ">");
            guestNameEl.innerHTML = safeName;
        } else {
            guestNameEl.innerHTML = "Tamu Kehormatan";
        }
    }

    const btnEnter = document.getElementById('btn-enter');
    const gate = document.getElementById('opening-gate');
    const deck = document.getElementById('spatial-deck');
    const island = document.getElementById('dynamic-island');
    const bgMusic = document.getElementById('bg-music');
    const musicFab = document.getElementById('music-fab');
    let isPlaying = false;

    const toggleMusic = () => {
        if (!bgMusic) return;
        if (isPlaying) {
            bgMusic.pause();
            if (musicFab) musicFab.classList.remove('playing');
        } else {
            bgMusic.play().catch(() => {});
            if (musicFab) musicFab.classList.add('playing');
        }
        isPlaying = !isPlaying;
    };

    if (musicFab) musicFab.addEventListener('click', toggleMusic);

    const openGateEvent = () => {
        gate.classList.add('slide-up');
        setTimeout(() => {
            gate.style.display = 'none';
            deck.classList.remove('hidden');
            island.classList.remove('hidden');
            if (musicFab) musicFab.classList.remove('hidden');
            initIntersectionObserver();
        }, 800);
        if (!isPlaying) toggleMusic();
    };

    if (btnEnter && gate) {
        btnEnter.addEventListener('click', openGateEvent);

        let startY = 0;
        gate.addEventListener('touchstart', e => {
            startY = e.touches[0].clientY;
        }, { passive: true });
        
        gate.addEventListener('touchend', e => {
            let endY = e.changedTouches[0].clientY;
            if (startY - endY > 60) openGateEvent();
        }, { passive: true });

        gate.addEventListener('wheel', e => {
            if (e.deltaY > 60) openGateEvent();
        }, { passive: true });
    }

    const initIntersectionObserver = () => {
        // Observer for reveal animations
        const elements = document.querySelectorAll('.reveal');
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    obs.unobserve(entry.target); 
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        elements.forEach(el => observer.observe(el));

        // Observer for active dynamic island navigation
        const sections = document.querySelectorAll('.floating-section');
        const navItems = document.querySelectorAll('.nav-item');
        
        const navObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if(entry.isIntersecting) {
                    let id = entry.target.getAttribute('id');
                    navItems.forEach(nav => {
                        nav.classList.remove('active');
                        if(nav.getAttribute('href') === `#${id}`) {
                            nav.classList.add('active');
                        }
                    });
                }
            });
        }, { rootMargin: "-30% 0px -60% 0px" }); // Aktif ketika section masuk ke zona tengah-atas layar
        
        sections.forEach(section => navObserver.observe(section));
    };

    const initCountdown = () => {
        const elDays = document.getElementById("days");
        const elHours = document.getElementById("hours");
        const elMinutes = document.getElementById("minutes");
        const elSeconds = document.getElementById("seconds");
        if(!elDays) return;

        let pD = -1, pH = -1, pM = -1, pS = -1;

        const animateDigit = (el) => {
            el.classList.remove('tick-anim');
            void el.offsetWidth;
            el.classList.add('tick-anim');
        };

        const updateTime = () => {
            const distance = CONFIG.weddingDate - new Date().getTime();
            if (distance < 0) {
                document.querySelector(".bento-countdown").innerHTML = "<h3 class='gradient-text-gold text-lg'>Acara Telah Berlangsung</h3>";
                return;
            }

            const d = Math.floor(distance / (1000 * 60 * 60 * 24));
            const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((distance % (1000 * 60)) / 1000);

            if (d !== pD) { elDays.innerText = String(d).padStart(2, '0'); animateDigit(elDays); pD = d; }
            if (h !== pH) { elHours.innerText = String(h).padStart(2, '0'); animateDigit(elHours); pH = h; }
            if (m !== pM) { elMinutes.innerText = String(m).padStart(2, '0'); animateDigit(elMinutes); pM = m; }
            if (s !== pS) { elSeconds.innerText = String(s).padStart(2, '0'); animateDigit(elSeconds); pS = s; }

            requestAnimationFrame(updateTime);
        };
        requestAnimationFrame(updateTime);
    };
    initCountdown();

    let lastScrollY = window.scrollY;
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const currentY = window.scrollY;
                
                // Menyembunyikan Dynamic Island saat scroll cepat ke bawah, tampil saat scroll ke atas
                if (currentY > lastScrollY && currentY > 200) {
                    island.classList.add('nav-hidden');
                } else {
                    island.classList.remove('nav-hidden');
                }
                
                lastScrollY = currentY;
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    if (typeof Swiper !== 'undefined') {
        new Swiper('.bento-swiper', {
            slidesPerView: "auto",
            spaceBetween: 20,
            grabCursor: true,
            freeMode: true
        });
    }

    const gCal = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(CONFIG.eventTitle)}&dates=${CONFIG.eventStartUTC}/${CONFIG.eventEndUTC}&details=${encodeURIComponent(CONFIG.eventDesc)}&location=${encodeURIComponent(CONFIG.eventLocation)}`;
    const btnGoogle = document.getElementById('btn-google-cal');
    if (btnGoogle) btnGoogle.href = gCal;

    const icsContent = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nDTSTART:${CONFIG.eventStartUTC}\nDTEND:${CONFIG.eventEndUTC}\nSUMMARY:${CONFIG.eventTitle}\nLOCATION:${CONFIG.eventLocation}\nDESCRIPTION:${CONFIG.eventDesc}\nEND:VEVENT\nEND:VCALENDAR`;
    const btnApple = document.getElementById('btn-apple-cal');
    if (btnApple) {
        btnApple.href = URL.createObjectURL(new Blob([icsContent], { type: 'text/calendar' }));
        btnApple.download = "Pernikahan_Zumrotus_Arrosid.ics";
    }

    const btnStory = document.getElementById('toggle-story');
    const fullStory = document.getElementById('story-full');
    if (btnStory && fullStory) {
        btnStory.addEventListener('click', () => {
            fullStory.classList.toggle('hidden');
            btnStory.innerHTML = fullStory.classList.contains('hidden') ? '<i class="fas fa-book-open"></i> Baca' : '<i class="fas fa-times"></i> Tutup';
        });
    }

    const btnGift = document.getElementById('toggle-gift');
    const drawerGift = document.getElementById('gift-drawer');
    if (btnGift && drawerGift) {
        btnGift.addEventListener('click', () => {
            drawerGift.classList.toggle('hidden');
            btnGift.innerHTML = drawerGift.classList.contains('hidden') ? '<i class="fas fa-chevron-down"></i> Buka' : '<i class="fas fa-chevron-up"></i> Tutup';
        });
    }

    const rsvpForm = document.getElementById('rsvp-form');
    const btnSubmit = document.getElementById('btn-submit-rsvp');
    
    fetchWishes(); 

    if (rsvpForm) {
        rsvpForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nama = document.getElementById('rsvp-name').value.trim();
            const pesan = document.getElementById('rsvp-message').value.trim();
            if (!nama || !pesan) return;

            const originalText = btnSubmit.innerHTML;
            btnSubmit.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Mengirim...';
            btnSubmit.disabled = true;

            const formData = new FormData(rsvpForm);
            fetch(CONFIG.scriptURL, { method: 'POST', body: formData })
            .then(res => res.json())
            .then(() => {
                fetchWishes();
                rsvpForm.reset();
                showToast("RSVP Berhasil Terkirim!");
            })
            .catch(() => {
                fetchWishes();
                rsvpForm.reset();
                showToast("RSVP Tersimpan!");
            })
            .finally(() => {
                btnSubmit.innerHTML = originalText;
                btnSubmit.disabled = false;
            });
        });
    }
});

window.copyText = function(id, btn) {
    const text = document.getElementById(id).innerText;
    navigator.clipboard.writeText(text).then(() => {
        const ori = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i>';
        btn.style.color = '#00ff88';
        btn.style.borderColor = '#00ff88';
        showToast("Teks berhasil disalin!");
        setTimeout(() => {
            btn.innerHTML = ori;
            btn.style.color = '';
            btn.style.borderColor = '';
        }, 2000);
    });
};

window.showToast = function(msg) {
    const toast = document.getElementById('glass-toast');
    const msgEl = document.getElementById('toast-text');
    if (!toast) return;
    
    msgEl.innerText = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
};

window.fetchWishes = function() {
    const container = document.getElementById('wishes-list');
    if (!container) return;

    fetch(CONFIG.scriptURL)
    .then(res => res.json())
    .then(data => {
        if(data.result === "success" && data.data) {
            let html = '';
            data.data.reverse().forEach(item => {
                let nameColor = item.kehadiran === 'Hadir' ? 'var(--orb-4)' : 'var(--orb-2)';
                html += `
                    <div class="chat-msg">
                        <div class="flex-between">
                            <h4 style="color: ${nameColor}; font-size: 1rem;">${item.nama}</h4>
                            <span class="text-xs text-muted"><i class="far fa-clock"></i> ${item.waktu || ''}</span>
                        </div>
                        <p class="text-sm mt-1">${item.pesan}</p>
                    </div>
                `;
            });
            container.innerHTML = html || '<p class="text-sm text-muted text-center italic mt-2">Jadilah yang pertama memberi ucapan!</p>';
        }
    }).catch(() => {
        if(container.innerHTML.includes('Memuat ucapan')) {
            container.innerHTML = '<p class="text-sm text-muted text-center italic mt-2">Gagal memuat buku tamu (Sedang luring/offline).</p>';
        }
    });
};