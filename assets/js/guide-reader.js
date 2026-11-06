/**
 * Guide Digital Reader & Workbook JS Engine
 * Domtom Connect
 */

(function () {
    'use strict';

    // State
    const STORAGE_KEY_RESPONSES = 'dtc_guide_workbook_responses_v1';
    const STORAGE_KEY_PROGRESS = 'dtc_guide_completed_chapters_v1';
    const STORAGE_KEY_LAST_CHAPTER = 'dtc_guide_last_chapter_v1';
    const STORAGE_KEY_UNLOCKED = 'dtc_guide_unlocked_v1';
    let currentChapterIndex = 0;
    let workbookResponses = {};
    let completedChapters = [];

    // DOM Elements
    const elements = {
        progressBar: document.getElementById('reading-progress-bar'),
        statsFill: document.getElementById('stats-bar-fill'),
        statsPercent: document.getElementById('stats-percent'),
        tocList: document.getElementById('sidebar-toc-list'),
        chapterContent: document.getElementById('chapter-content-container'),
        breadcrumb: document.getElementById('topbar-breadcrumb'),
        btnPrev: document.getElementById('btn-prev-chapter'),
        btnNext: document.getElementById('btn-next-chapter'),
        btnToggleSidebar: document.getElementById('btn-toggle-sidebar'),
        sidebar: document.getElementById('guide-sidebar'),
        btnExport: document.getElementById('btn-export-workbook'),
        btnModalClose: document.getElementById('btn-modal-close'),
        modalBackdrop: document.getElementById('modal-export'),
        modalContent: document.getElementById('modal-export-content'),
        btnPrintExport: document.getElementById('btn-print-export'),
        btnCopyExport: document.getElementById('btn-copy-export'),
        btnThemeToggle: document.getElementById('btn-theme-toggle'),
        btnTopbarSectorSwitch: document.getElementById('btn-topbar-sector-switch'),
        topbarSectorName: document.getElementById('topbar-sector-name'),
        sectorModalBackdrop: document.getElementById('modal-sector-selector'),
        btnSectorModalClose: document.getElementById('btn-sector-modal-close'),
        paywallModalBackdrop: document.getElementById('modal-paywall'),
        btnPaywallClose: document.getElementById('btn-paywall-close'),
        btnUnlockCode: document.getElementById('btn-unlock-code')
    };

    // Access Control & Gatekeeper
    function isGuideUnlocked() {
        // Dev environment is ALWAYS 100% unlocked for the creator
        const isDev = window.location.hostname === 'localhost' || 
                      window.location.hostname === '127.0.0.1' || 
                      window.location.protocol === 'file:';
        if (isDev) return true;

        // Check query parameters (e.g. redirected from Stripe: ?unlocked=true or ?session_id=...)
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('unlocked') === 'true' || urlParams.get('access') === 'granted' || urlParams.has('session_id') || urlParams.get('token') === 'dtc2026') {
            try {
                localStorage.setItem(STORAGE_KEY_UNLOCKED, 'true');
            } catch (e) {}
            return true;
        }

        // Check localStorage
        try {
            return localStorage.getItem(STORAGE_KEY_UNLOCKED) === 'true';
        } catch (e) {
            return false;
        }
    }

    function openPaywallModal() {
        if (elements.paywallModalBackdrop) {
            elements.paywallModalBackdrop.classList.add('open');
        }
    }

    function closePaywallModal() {
        if (elements.paywallModalBackdrop) {
            elements.paywallModalBackdrop.classList.remove('open');
        }
    }

    // Initialize
    function init() {
        loadStorage();
        initTheme();
        renderTOC();

        // Restore last read chapter from URL hash or storage
        const hash = window.location.hash.replace('#', '');
        let targetIndex = 0;
        if (hash) {
            const foundIdx = window.GUIDE_DATA.chapters.findIndex(c => c.id === hash);
            if (foundIdx !== -1) targetIndex = foundIdx;
        } else {
            const savedLast = localStorage.getItem(STORAGE_KEY_LAST_CHAPTER);
            if (savedLast !== null && !isNaN(parseInt(savedLast))) {
                targetIndex = Math.min(parseInt(savedLast), window.GUIDE_DATA.chapters.length - 1);
            }
        }

        loadChapter(targetIndex);
        bindEvents();
        updateSectorSelection();
        updateGlobalStats();

        // Notification post-paiement Stripe
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('unlocked') === 'true' || urlParams.get('access') === 'granted' || urlParams.has('session_id')) {
            setTimeout(() => {
                showSaveStatus('🎉 Félicitations ! Ton accès complet est débloqué à vie.', false);
            }, 600);
        }
    }

    // Storage Management
    function loadStorage() {
        try {
            const savedResponses = localStorage.getItem(STORAGE_KEY_RESPONSES);
            if (savedResponses) workbookResponses = JSON.parse(savedResponses);
            const savedProg = localStorage.getItem(STORAGE_KEY_PROGRESS);
            if (savedProg) completedChapters = JSON.parse(savedProg);
        } catch (e) {
            console.warn('Storage read failed', e);
        }
    }

    function saveResponse(fieldId, value) {
        workbookResponses[fieldId] = value;
        try {
            localStorage.setItem(STORAGE_KEY_RESPONSES, JSON.stringify(workbookResponses));
            showSaveStatus('✓ Sauvegardé automatiquement', false);
            updateGlobalStats();
        } catch (e) {
            console.error('Storage write failed', e);
        }
    }

    function markChapterCompleted(chapterId) {
        if (!completedChapters.includes(chapterId)) {
            completedChapters.push(chapterId);
            try {
                localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(completedChapters));
            } catch (e) { }
            updateTOCStatus();
            updateGlobalStats();
            updateChapterFooterCompletionBtn();
        }
    }

    function toggleChapterCompleted(chapterId) {
        const idx = completedChapters.indexOf(chapterId);
        if (idx > -1) {
            completedChapters.splice(idx, 1);
            showSaveStatus('Chapitre décoché', false);
        } else {
            completedChapters.push(chapterId);
            showSaveStatus('✓ Chapitre validé', false);
        }
        try {
            localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(completedChapters));
        } catch (e) { }
        updateTOCStatus();
        updateGlobalStats();
        updateChapterFooterCompletionBtn();
    }

    function updateChapterFooterCompletionBtn() {
        const btn = document.getElementById('btn-toggle-chapter-completed');
        if (!btn) return;
        const chap = window.GUIDE_DATA.chapters[currentChapterIndex];
        if (!chap) return;
        const isCompleted = completedChapters.includes(chap.id);
        if (isCompleted) {
            btn.classList.add('is-completed');
            btn.innerHTML = '<i class="fa-solid fa-circle-check"></i> <span>Chapitre validé (Cliquer pour décocher)</span>';
            btn.title = "Cliquer pour marquer comme non terminé";
        } else {
            btn.classList.remove('is-completed');
            btn.innerHTML = '<i class="fa-regular fa-circle"></i> <span>Marquer ce chapitre comme validé</span>';
            btn.title = "Cliquer pour marquer comme validé";
        }
    }

    // UI Updates
    function updateGlobalStats() {
        const total = window.GUIDE_DATA.chapters.length;
        const count = completedChapters.length;
        const percent = Math.round((count / total) * 100);

        if (elements.statsPercent) elements.statsPercent.textContent = `${percent}% complété`;
        if (elements.statsFill) elements.statsFill.style.width = `${percent}%`;
        if (elements.progressBar) elements.progressBar.style.width = `${percent}%`;
    }

    function showSaveStatus(text, isSaving) {
        const statusEl = document.getElementById('save-status-badge');
        if (!statusEl) return;

        statusEl.textContent = text;
        if (isSaving) {
            statusEl.classList.add('saving');
        } else {
            statusEl.classList.remove('saving');
        }
    }

    // Render Table of Contents
    function renderTOC() {
        if (!elements.tocList) return;
        elements.tocList.innerHTML = '';

        window.GUIDE_DATA.chapters.forEach((chap, idx) => {
            const isCompleted = completedChapters.includes(chap.id);
            const a = document.createElement('a');
            a.className = `toc-item ${isCompleted ? 'completed' : ''} ${idx === currentChapterIndex ? 'active' : ''}`;
            a.href = `#${chap.id}`;
            a.dataset.index = idx;

            const mainDiv = document.createElement('div');
            mainDiv.className = 'toc-item-main';

            const numSpan = document.createElement('span');
            numSpan.className = 'toc-number';
            if (chap.isCover) {
                numSpan.innerHTML = '<i class="fa-solid fa-book"></i>';
            } else {
                numSpan.textContent = chap.number === 0 ? '0' : chap.number;
            }

            const titleSpan = document.createElement('span');
            titleSpan.className = 'toc-title';
            titleSpan.textContent = chap.title;

            mainDiv.appendChild(numSpan);
            mainDiv.appendChild(titleSpan);
            a.appendChild(mainDiv);

            // Locked icon if not unlocked and past free preview
            if (!isGuideUnlocked() && idx >= 3) {
                const lockIcon = document.createElement('i');
                lockIcon.className = 'fa-solid fa-lock';
                lockIcon.style.cssText = 'font-size:0.75rem; color:#717c77; margin-left:auto; margin-right:8px; opacity:0.8;';
                lockIcon.title = 'Chapitre réservé aux membres';
                a.appendChild(lockIcon);
            }

            // Interactive check/uncheck button
            const checkBtn = document.createElement('button');
            checkBtn.className = 'toc-check-btn';
            checkBtn.type = 'button';
            checkBtn.title = isCompleted ? 'Cliquer pour décocher ce chapitre' : 'Marquer ce chapitre comme terminé';
            checkBtn.setAttribute('aria-label', checkBtn.title);
            checkBtn.innerHTML = isCompleted ? '<i class="fa-solid fa-check"></i>' : '<i class="fa-regular fa-circle"></i>';

            checkBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleChapterCompleted(chap.id);
            });
            a.appendChild(checkBtn);

            // Simple clean TOC row click
            a.addEventListener('click', (e) => {
                e.preventDefault();
                loadChapter(idx);
            // Auto-close sidebar on mobile
            if (window.innerWidth <= 850 && elements.sidebar) {
                elements.sidebar.classList.remove('open');
                const bd = document.getElementById('sidebar-backdrop');
                if (bd) bd.classList.remove('open');
            }
                if (window.innerWidth <= 850 && elements.sidebar) {
                    elements.sidebar.classList.remove('open');
                }
            });

            elements.tocList.appendChild(a);
        });
    }

    function updateTOCStatus() {
        const items = elements.tocList.querySelectorAll('.toc-item');
        items.forEach((item, idx) => {
            const chap = window.GUIDE_DATA.chapters[idx];
            if (!chap) return;
            const isCompleted = completedChapters.includes(chap.id);
            const checkBtn = item.querySelector('.toc-check-btn');

            if (isCompleted) {
                item.classList.add('completed');
                if (checkBtn) {
                    checkBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
                    checkBtn.title = 'Cliquer pour décocher ce chapitre';
                }
            } else {
                item.classList.remove('completed');
                if (checkBtn) {
                    checkBtn.innerHTML = '<i class="fa-regular fa-circle"></i>';
                    checkBtn.title = 'Marquer ce chapitre comme terminé';
                }
            }
            if (idx === currentChapterIndex) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
        updateChapterFooterCompletionBtn();
    }

    // Render Chapter Content
    function loadChapter(index) {
        if (index < 0 || index >= window.GUIDE_DATA.chapters.length) return;

        // Gatekeeper: Chapters beyond free preview (idx >= 3, i.e. Chapitre 2+) require unlocked access
        if (!isGuideUnlocked() && index >= 3) {
            openPaywallModal();
            return;
        }

        currentChapterIndex = index;
        const chap = window.GUIDE_DATA.chapters[index];
        localStorage.setItem(STORAGE_KEY_LAST_CHAPTER, index);
        window.location.hash = chap.id;

        // Breadcrumb
        if (elements.breadcrumb) {
            elements.breadcrumb.innerHTML = `<span>${chap.badge} • ${chap.title}</span>`;
        }

        // Case 1: Cover Chapter
        if (chap.isCover) {
            elements.chapterContent.innerHTML = `
                <article class="chapter-article cover-article-view">
                    ${chap.content}
                </article>
            `;

            const btnOpen = document.getElementById('btn-open-guide-now');
            if (btnOpen) {
                btnOpen.addEventListener('click', () => loadChapter(1));
            }
            const bookCover = document.getElementById('cover-3d-book');
            if (bookCover) {
                bookCover.addEventListener('click', () => loadChapter(1));
            }

            updateTOCStatus();
            updateGlobalStats();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            markChapterCompleted(chap.id);
            return;
        }

        // Direct Access to all Chapters (No blocking)
        let exerciseHtml = '';
        if (chap.exercise) {
            exerciseHtml = renderExerciseHTML(chap.exercise);
        }

        const html = `
            <article class="chapter-article">
                <header class="chapter-hero">
                    <span class="chapter-badge-top">${chap.badge}</span>
                    <h1 class="chapter-title">${chap.title}</h1>
                    <p class="chapter-subtitle">${chap.subtitle}</p>
                    <div class="chapter-meta-bar">
                        <span class="chapter-meta-item"><i class="fa-regular fa-clock"></i> Lecture : ${chap.readTime}</span>
                        <span class="chapter-meta-item"><i class="fa-solid fa-pen-ruler"></i> Exercice d'application inclus</span>
                        <span class="chapter-meta-item"><i class="fa-solid fa-layer-group"></i> Écosystème Domtom Connect</span>
                    </div>
                </header>

                <div class="article-body">
                    ${chap.content}
                </div>

                ${exerciseHtml}

                <footer class="chapter-nav-footer">
                    <div class="chapter-nav-actions-row">
                        <button type="button" id="btn-toggle-chapter-completed" class="btn-chapter-completed-toggle ${completedChapters.includes(chap.id) ? 'is-completed' : ''}">
                            <i class="fa-solid ${completedChapters.includes(chap.id) ? 'fa-circle-check' : 'fa-circle'}"></i>
                            <span>${completedChapters.includes(chap.id) ? 'Chapitre validé (Cliquer pour décocher)' : 'Marquer ce chapitre comme validé'}</span>
                        </button>
                    </div>
                    <div class="chapter-nav-buttons-row">
                        <button id="btn-prev-chapter-bottom" class="btn-nav-chapter" ${index === 0 ? 'disabled' : ''}>
                            <i class="fa-solid fa-arrow-left"></i> Chapitre Précédent
                        </button>
                        <button id="btn-next-chapter-bottom" class="btn-nav-chapter primary">
                            ${index === window.GUIDE_DATA.chapters.length - 1 ? 'Terminer la Consultation <i class="fa-solid fa-check"></i>' : 'Valider & Chapitre Suivant <i class="fa-solid fa-arrow-right"></i>'}
                        </button>
                    </div>
                </footer>
            </article>
        `;

        elements.chapterContent.innerHTML = html;

        // Bind interactive elements
        bindExerciseEvents(chap.exercise);
        bindNavButtons();
        if (chap.id === 'chapitre-6' || chap.id === 'chapitre-5' || document.getElementById('pathway-decision-grid')) {
            bindChapter5PathwayDecision();
        }
        updateTOCStatus();
        updateGlobalStats();
        updateSectorSelection();

        // Scroll smoothly to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Render Exercise Block
    function renderExerciseHTML(exercise) {
        let fieldsHtml = '';

        exercise.fields.forEach(field => {
            const savedVal = workbookResponses[field.id] || '';

            let singleFieldHtml = '';
            if (field.type === 'section-header') {
                singleFieldHtml = `
                    <div class="form-section-title" id="${field.id}">
                        <i class="${field.icon || 'fa-solid fa-chevron-right'}"></i>
                        <span>${field.label}</span>
                    </div>
                `;
            } else if (field.type === 'checkbox') {
                const isChecked = (savedVal === 'true' || savedVal === true) ? 'checked' : '';
                singleFieldHtml = `
                    <div class="form-checkbox-group">
                        <label class="custom-checkbox-container" for="${field.id}">
                            <input type="checkbox" id="${field.id}" class="workbook-checkbox" ${isChecked}>
                            <span class="checkbox-text">${field.label}</span>
                        </label>
                        ${field.hint ? `<span class="field-hint">${field.hint}</span>` : ''}
                    </div>
                `;
            } else if (field.type === 'url') {
                singleFieldHtml = `
                    <div class="form-field-group">
                        <label for="${field.id}">
                            <i class="fa-solid fa-link" style="color: var(--accent); margin-right: 6px;"></i>
                            ${field.label}
                        </label>
                        <input type="url" id="${field.id}" class="workbook-input workbook-url-input" value="${escapeHtml(savedVal)}" placeholder="${field.placeholder || 'https://...'}">
                        ${field.hint ? `<span class="field-hint">${field.hint}</span>` : ''}
                    </div>
                `;
            } else if (field.type === 'text') {
                singleFieldHtml = `
                    <div class="form-field-group">
                        <label for="${field.id}">${field.label}</label>
                        <input type="text" id="${field.id}" class="workbook-input" value="${escapeHtml(savedVal)}" placeholder="${field.placeholder || ''}">
                        ${field.hint ? `<span class="field-hint">${field.hint}</span>` : ''}
                    </div>
                `;
            } else if (field.type === 'number') {
                singleFieldHtml = `
                    <div class="form-field-group">
                        <label for="${field.id}">${field.label}</label>
                        <input type="number" id="${field.id}" class="workbook-input calc-input" value="${escapeHtml(savedVal)}" placeholder="${field.placeholder || ''}">
                        ${field.hint ? `<span class="field-hint">${field.hint}</span>` : ''}
                    </div>
                `;
            } else if (field.type === 'textarea') {
                singleFieldHtml = `
                    <div class="form-field-group">
                        <label for="${field.id}">${field.label}</label>
                        <textarea id="${field.id}" class="workbook-textarea" placeholder="${field.placeholder || ''}">${escapeHtml(savedVal)}</textarea>
                        ${field.hint ? `<span class="field-hint">${field.hint}</span>` : ''}
                    </div>
                `;
            } else if (field.type === 'select') {
                let optionsHtml = '';
                field.options.forEach(opt => {
                    const isSelected = savedVal === opt.value ? 'selected' : '';
                    optionsHtml += `<option value="${opt.value}" ${isSelected}>${opt.label}</option>`;
                });

                singleFieldHtml = `
                    <div class="form-field-group">
                        <label for="${field.id}">${field.label}</label>
                        <select id="${field.id}" class="workbook-select">
                            <option value="">-- Choisir une option --</option>
                            ${optionsHtml}
                        </select>
                        ${field.hint ? `<span class="field-hint">${field.hint}</span>` : ''}
                    </div>
                `;
            } else if (field.type === 'image-upload') {
                singleFieldHtml = `
                    <div class="form-field-group">
                        <label for="${field.id}">${field.label}</label>
                        <div class="logo-studio-container">
                            <div class="logo-dropzone-wrapper">
                                <div class="logo-uploader-zone" id="dropzone-${field.id}">
                                    <i class="fa-solid fa-cloud-arrow-up"></i>
                                    <h4 style="margin: 0 0 6px 0; color: #ffffff; font-size: 1rem;">Importer mon logo (PNG / JPG / SVG)</h4>
                                    <p style="margin: 0 0 12px 0; font-size: 0.8rem; color: var(--text-muted);">Glisser-déposer ou cliquer pour sélectionner</p>
                                    <input type="file" id="${field.id}-file" accept="image/*" style="display: none;">
                                    <button type="button" class="btn-topbar-tool" id="btn-browse-${field.id}" style="margin: 0 auto; display: inline-flex;">
                                        <i class="fa-solid fa-folder-open"></i> Parcourir mes fichiers
                                    </button>
                                </div>
                                <div class="logo-mockup-showcase">
                                    <div style="font-size: 0.8rem; font-weight: 700; color: #10b981; margin-bottom: 8px; text-align: center;">
                                        <i class="fa-solid fa-wand-magic-sparkles"></i> Aperçu Réel de ta Marque
                                    </div>
                                    <div class="logo-mockups-grid">
                                        <div class="mockup-item-box">
                                            <div class="mockup-avatar-circle" id="preview-avatar-${field.id}">
                                                ${savedVal ? `<img src="${savedVal}" alt="Logo" style="max-width:85%; max-height:85%; object-fit:contain;">` : `<i class="fa-solid fa-image" style="color:#717c77;"></i>`}
                                            </div>
                                            <span class="mockup-item-label">Avatar Profil</span>
                                        </div>
                                        <div class="mockup-item-box">
                                            <div class="mockup-card-surface" id="preview-card-${field.id}">
                                                ${savedVal ? `<img src="${savedVal}" alt="Logo" style="max-width:85%; max-height:85%; object-fit:contain;">` : `<i class="fa-solid fa-id-card" style="color:#717c77;"></i>`}
                                            </div>
                                            <span class="mockup-item-label">Carte de Visite</span>
                                        </div>
                                        <div class="mockup-item-box">
                                            <div class="mockup-avatar-circle" style="border-radius: 8px; background: #0c100e;" id="preview-fav-${field.id}">
                                                ${savedVal ? `<img src="${savedVal}" alt="Logo" style="max-width:85%; max-height:85%; object-fit:contain;">` : `<i class="fa-solid fa-tag" style="color:#717c77;"></i>`}
                                            </div>
                                            <span class="mockup-item-label">Favicon & Étiquette</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div style="margin-top: 14px;">
                                <input type="hidden" id="${field.id}" value="${escapeHtml(savedVal)}">
                                ${field.hint ? `<span class="field-hint">${field.hint}</span>` : ''}
                            </div>
                        </div>
                    </div>
                `;
            }

            fieldsHtml += `
                <div class="sector-field-wrapper ${field.channel ? 'channel-field-wrapper' : ''}" data-sector="${field.sector || 'all'}" ${field.channel ? `data-channel="${field.channel}"` : ''}>
                    ${singleFieldHtml}
                </div>
            `;
        });

        let calculatorHtml = '';
        if (exercise.isCalculator) {
            calculatorHtml = `
                <div class="calculator-results-box" id="calc-results-live">
                    <div class="calc-stat">
                        <div class="calc-value" id="res-marge-unitaire">0 €</div>
                        <div class="calc-label">Marge unitaire nette (Taux de marge)</div>
                    </div>
                    <div class="calc-stat">
                        <div class="calc-value" id="res-ca-point-mort">0 €</div>
                        <div class="calc-label">Chiffre d'Affaires mensuel d'équilibre</div>
                    </div>
                    <div class="calc-stat">
                        <div class="calc-value" id="res-ventes-requises">0</div>
                        <div class="calc-label">Ventes / Clients requis par mois</div>
                    </div>
                    <div class="calc-stat">
                        <div class="calc-value" id="res-ventes-semaine">0 / sem</div>
                        <div class="calc-label">Cadence hebdo requise</div>
                    </div>
                </div>
            `;
        }

        let sectorIndicatorHtml = '';
        const hasSectorFields = exercise.fields.some(f => f.sector && f.sector !== 'all');
        if (exercise.showSectorIndicator || hasSectorFields || exercise.id.includes('chapitre_6') || exercise.id.includes('chapitre_12') || exercise.id.includes('chapitre_13') || exercise.id.includes('chapitre_14') || exercise.id.includes('chapitre_15')) {
            sectorIndicatorHtml = `
                <div class="active-sector-indicator-bar" id="sector-indicator-bar">
                    <div class="indicator-left">
                        <span class="indicator-tag">MODÈLE SÉLECTIONNÉ</span>
                        <span class="indicator-sector-name" id="display-selected-sector-name">📦 Voie 1 : Produits Physiques & Terroirs</span>
                    </div>
                    <button type="button" class="btn-change-sector" id="btn-jump-sector-switcher">
                        <i class="fa-solid fa-arrows-rotate"></i> Changer de modèle
                    </button>
                </div>
            `;
        }

        let channelIndicatorHtml = '';
        const hasChannelFields = exercise.fields.some(f => f.channel && f.channel !== 'all');
        if (exercise.showChannelIndicator || hasChannelFields || exercise.id.includes('chapitre_17') || exercise.id.includes('chapitre_18') || exercise.id.includes('chapitre_19')) {
            channelIndicatorHtml = `
                <div class="active-sector-indicator-bar" id="channel-indicator-bar">
                    <div class="indicator-left">
                        <span class="indicator-tag">CANAL MAÎTRE SÉLECTIONNÉ</span>
                        <span class="indicator-sector-name" id="display-selected-channel-name">📸 Instagram : Tunnel Reels & Closing DM</span>
                    </div>
                    <button type="button" class="btn-change-sector" id="btn-jump-channel-switcher">
                        <i class="fa-solid fa-arrows-rotate"></i> Changer de canal
                    </button>
                </div>
            `;
        }

        return `
            <section class="workbook-section" id="section-${exercise.id}">
                <div class="workbook-header">
                    <div class="workbook-header-left">
                        <div class="workbook-icon"><i class="fa-solid fa-clipboard-check"></i></div>
                        <div class="workbook-title-group">
                            <h3>${exercise.title}</h3>
                            <p class="workbook-subtitle">${exercise.description}</p>
                        </div>
                    </div>
                    <div class="auto-save-status" id="save-status-badge">
                        ✓ Sauvegardé automatiquement
                    </div>
                </div>
                <div class="workbook-form">
                    ${sectorIndicatorHtml}
                    ${channelIndicatorHtml}
                    ${fieldsHtml}
                    ${calculatorHtml}
                </div>
            </section>
        `;
    }

    // Attach listeners to fields with Debounce
    function bindExerciseEvents(exercise) {
        if (!exercise) return;

        let saveTimeout;

        exercise.fields.forEach(field => {
            if (field.type === 'section-header') return;

            if (field.type === 'image-upload') {
                const fileInput = document.getElementById(`${field.id}-file`);
                const browseBtn = document.getElementById(`btn-browse-${field.id}`);
                const dropzone = document.getElementById(`dropzone-${field.id}`);
                const hiddenInput = document.getElementById(field.id);
                const prevAvatar = document.getElementById(`preview-avatar-${field.id}`);
                const prevCard = document.getElementById(`preview-card-${field.id}`);
                const prevFav = document.getElementById(`preview-fav-${field.id}`);

                const handleImageFile = (file) => {
                    if (!file || !file.type.startsWith('image/')) return;
                    const reader = new FileReader();
                    reader.onload = function(evt) {
                        const dataUrl = evt.target.result;
                        if (hiddenInput) hiddenInput.value = dataUrl;
                        saveResponse(field.id, dataUrl);
                        const imgHtml = `<img src="${dataUrl}" alt="Logo" style="max-width:85%; max-height:85%; object-fit:contain;">`;
                        if (prevAvatar) prevAvatar.innerHTML = imgHtml;
                        if (prevCard) prevCard.innerHTML = imgHtml;
                        if (prevFav) prevFav.innerHTML = imgHtml;
                        showSaveStatus('✓ Logo importé et prévisualisé en direct', false);
                    };
                    reader.readAsDataURL(file);
                };

                if (browseBtn && fileInput) {
                    browseBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        fileInput.click();
                    });
                }
                if (dropzone && fileInput) {
                    dropzone.addEventListener('click', () => fileInput.click());
                    dropzone.addEventListener('dragover', (e) => {
                        e.preventDefault();
                        dropzone.classList.add('dragover');
                    });
                    dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));
                    dropzone.addEventListener('drop', (e) => {
                        e.preventDefault();
                        dropzone.classList.remove('dragover');
                        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                            handleImageFile(e.dataTransfer.files[0]);
                        }
                    });
                }
                if (fileInput) {
                    fileInput.addEventListener('change', () => {
                        if (fileInput.files && fileInput.files[0]) {
                            handleImageFile(fileInput.files[0]);
                        }
                    });
                }
                return;
            }

            const el = document.getElementById(field.id);
            if (!el) return;

            const handler = () => {
                showSaveStatus('Sauvegarde en cours...', true);
                clearTimeout(saveTimeout);
                saveTimeout = setTimeout(() => {
                    const valueToSave = field.type === 'checkbox' ? (el.checked ? 'true' : 'false') : el.value;
                    saveResponse(field.id, valueToSave);
                    if (exercise.isCalculator) updateCalculator();
                    if (field.id.startsWith('pitch_') && field.id !== 'pitch_complet_final') updatePitchFormula();
                }, 300);
            };

            if (field.type === 'checkbox') {
                el.addEventListener('change', handler);
            } else {
                el.addEventListener('input', handler);
                el.addEventListener('change', handler);
            }
        });

        if (exercise.isCalculator) {
            updateCalculator();
        }

        // Bind Sector Tab clicks & Dropdown if present (Chapitre 12)
        document.querySelectorAll('.sector-tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const target = btn.getAttribute('data-target-sector');
                if (target) updateSectorSelection(target);
            });
        });

        // Bind Channel Tab clicks (Chapitre 17)
        document.querySelectorAll('.channel-strategy-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const target = btn.getAttribute('data-target-channel');
                if (target) updateChannelSelection(target);
            });
        });

        // Bind Matrix 6-Network Navigator clicks (Chapitre 16)
        document.querySelectorAll('.matrix-nav-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const target = btn.getAttribute('data-target-network');
                if (!target) return;

                document.querySelectorAll('.matrix-nav-btn').forEach(b => {
                    if (b.getAttribute('data-target-network') === target) {
                        b.classList.add('active');
                    } else {
                        b.classList.remove('active');
                    }
                });

                document.querySelectorAll('.matrix-card-panel').forEach(panel => {
                    if (panel.getAttribute('data-network') === target) {
                        panel.classList.add('active');
                    } else {
                        panel.classList.remove('active');
                    }
                });
            });
        });

        // Bind Sector Change buttons to Global Modal
        document.querySelectorAll('.btn-change-sector, #btn-jump-sector-switcher').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                openSectorModal();
            });
        });

        const jumpChanBtn = document.getElementById('btn-jump-channel-switcher');
        if (jumpChanBtn) {
            jumpChanBtn.addEventListener('click', () => {
                const switcher = document.querySelector('.channel-switcher-banner');
                if (switcher) switcher.scrollIntoView({ behavior: 'smooth', block: 'center' });
            });
        }

        if (document.querySelector('.sector-tab-btn') || document.querySelector('.sector-adaptive-card')) {
            updateSectorSelection();
        }
        if (document.querySelector('.channel-strategy-btn')) {
            updateChannelSelection();
        }
    }

    // Modal Sector Switcher Controls
    function openSectorModal() {
        if (elements.sectorModalBackdrop) {
            elements.sectorModalBackdrop.classList.add('open');
        }
    }

    function closeSectorModal() {
        if (elements.sectorModalBackdrop) {
            elements.sectorModalBackdrop.classList.remove('open');
        }
    }

    // Apply Intelligent Calculator Presets for Selected Sector (Chapitre 12)
    function applyCalculatorPreset(sector) {
        const priceEl = document.getElementById('prix_unitaire_vente');
        const varEl = document.getElementById('cout_unitaire_variable');
        const fixedEl = document.getElementById('charges_fixes_mensuelles') || document.getElementById('charges_fixes');
        const salaryEl = document.getElementById('salaire_net_vise');
        if (!priceEl || !varEl) return;

        const presets = {
            physique: { price: 35, variable: 12, fixed: 450, salary: 2000 },
            service: { price: 1200, variable: 0, fixed: 250, salary: 3000 },
            digital: { price: 47, variable: 2, fixed: 120, salary: 2500 },
            food: { price: 15, variable: 4.5, fixed: 1400, salary: 2200 },
            commerce: { price: 49, variable: 22, fixed: 650, salary: 2000 }
        };
        const p = presets[sector] || presets.physique;

        // Auto populate if default / empty or previously set via preset
        if (!priceEl.value || priceEl.value === '0' || priceEl.dataset.isPreset === 'true') {
            priceEl.value = p.price;
            priceEl.dataset.isPreset = 'true';
            saveResponse('prix_unitaire_vente', p.price);
        }
        if (!varEl.value || varEl.value === '0' || varEl.dataset.isPreset === 'true') {
            varEl.value = p.variable;
            varEl.dataset.isPreset = 'true';
            saveResponse('cout_unitaire_variable', p.variable);
        }
        if (fixedEl && (!fixedEl.value || fixedEl.value === '0' || fixedEl.dataset.isPreset === 'true')) {
            fixedEl.value = p.fixed;
            fixedEl.dataset.isPreset = 'true';
            saveResponse(fixedEl.id, p.fixed);
        }
        if (salaryEl && (!salaryEl.value || salaryEl.value === '0' || salaryEl.dataset.isPreset === 'true')) {
            salaryEl.value = p.salary;
            salaryEl.dataset.isPreset = 'true';
            saveResponse('salaire_net_vise', p.salary);
        }
        updateCalculator();
    }

    // Dynamic Sector Switcher & Strict Cross-Chapter Propagation
    function updateSectorSelection(targetSector, userExplicit) {
        let sector = targetSector;
        const selectEl = document.getElementById('secteur_activite_selection');
        if (!sector && selectEl) {
            sector = selectEl.value;
        }
        if (!sector) {
            sector = localStorage.getItem('dtc_guide_selected_sector') || 'physique';
        }

        if (userExplicit === true) {
            localStorage.setItem('dtc_guide_has_chosen_sector', 'true');
        } else if (userExplicit === false) {
            localStorage.setItem('dtc_guide_has_chosen_sector', 'false');
        }

        // Save preference in localStorage
        if (sector) {
            localStorage.setItem('dtc_guide_selected_sector', sector);
        }
        if (selectEl) {
            selectEl.value = (localStorage.getItem('dtc_guide_has_chosen_sector') === 'true') ? sector : '';
            saveResponse('secteur_activite_selection', selectEl.value);
        }

        // Sector Labels
        const sectorLabelsShort = {
            physique: "Voie 1 : Produits Physiques",
            service: "Voie 2 : Services B2B",
            digital: "Voie 3 : Produits Digitaux",
            food: "Voie 4 : Restauration & Food",
            commerce: "Voie 5 : Commerce & Achat"
        };
        const sectorLabelsFull = {
            physique: "📦 Voie 1 : Produits Physiques & Terroirs (Cosmétique, Mode)",
            service: "💼 Voie 2 : Prestations de Services & Agence B2B",
            digital: "💻 Voie 3 : Produits Digitaux & E-books",
            food: "🍳 Voie 4 : Restauration, Food & Street-Food",
            commerce: "🛍️ Voie 5 : Commerce & Achat-Revente"
        };

        const hasChosen = localStorage.getItem('dtc_guide_has_chosen_sector') === 'true';

        // Update Topbar Pill
        if (elements.topbarSectorName && elements.btnTopbarSectorSwitch) {
            if (!hasChosen) {
                elements.topbarSectorName.textContent = "✨ Choisis ta voie (Ch. 6)";
                elements.btnTopbarSectorSwitch.classList.add('unselected');
            } else {
                elements.topbarSectorName.textContent = sectorLabelsShort[sector] || sector;
                elements.btnTopbarSectorSwitch.classList.remove('unselected');
            }
        }

        // Update Modal Buttons active state
        document.querySelectorAll('.sector-modal-btn').forEach(btn => {
            if (btn.getAttribute('data-sector-choice') === sector) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Update indicator label across any chapter indicator bars
        const nameEl = document.getElementById('display-selected-sector-name');
        if (nameEl) nameEl.textContent = sectorLabelsFull[sector] || sector;
        document.querySelectorAll('.active-sector-label-text').forEach(el => {
            el.textContent = sectorLabelsFull[sector] || sector;
        });

        // 1. Sync Sector Tab buttons (Chapitre 13)
        document.querySelectorAll('.sector-tab-btn').forEach(btn => {
            const btnSec = btn.getAttribute('data-target-sector');
            if (btnSec === sector) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // 2. Sync Reading Panels (Chapitre 13)
        const readingPanels = document.querySelectorAll('.sector-article-panel');
        if (readingPanels.length > 0) {
            readingPanels.forEach(panel => {
                const panelSec = panel.getAttribute('data-sector');
                if (panelSec === sector) {
                    panel.classList.add('active');
                } else {
                    panel.classList.remove('active');
                }
            });
        }

        // 3. Sync Cross-Chapter Adaptive Cards (.sector-adaptive-card)
        document.querySelectorAll('.sector-adaptive-card').forEach(card => {
            const cardSec = card.getAttribute('data-sector');
            if (cardSec === sector) {
                card.classList.add('active');
                card.style.display = 'block';
            } else {
                card.classList.remove('active');
                card.style.display = 'none';
            }
        });

        // 4. Filter Workbook Form Fields strictly (Show ONLY selected sector)
        const fieldWrappers = document.querySelectorAll('.sector-field-wrapper');
        fieldWrappers.forEach(wrap => {
            const fieldSec = wrap.getAttribute('data-sector');
            if (!fieldSec || fieldSec === 'all' || fieldSec === sector) {
                wrap.classList.remove('hidden-sector');
            } else {
                wrap.classList.add('hidden-sector');
            }
        });

        // 5. Update Calculator Presets if present in current chapter
        applyCalculatorPreset(sector);
    }

    // Dynamic Social Channel Switcher & Filter (Chapitre 16)
    function updateChannelSelection(targetChannel) {
        let channel = targetChannel || localStorage.getItem('dtc_guide_selected_channel') || 'instagram';
        localStorage.setItem('dtc_guide_selected_channel', channel);

        // Update indicator label in workbook
        const channelLabels = {
            instagram: "📸 Instagram : Tunnel Reels & Closing DM",
            tiktok: "🎵 TikTok : Machine à Trafic & Storytelling",
            whatsapp: "💬 WhatsApp Business : L'Arme Fatale Outre-Mer",
            linkedin: "💼 LinkedIn : Pipeline B2B & Dirigeants",
            youtube: "📺 YouTube : Autorité Pérenne & Moteur de Recherche"
        };
        const nameEl = document.getElementById('display-selected-channel-name');
        if (nameEl) nameEl.textContent = channelLabels[channel] || channel;

        // 1. Sync Channel Tab buttons
        document.querySelectorAll('.channel-strategy-btn').forEach(btn => {
            const btnChan = btn.getAttribute('data-target-channel');
            if (btnChan === channel) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // 2. Sync Reading Panels
        const readingPanels = document.querySelectorAll('.channel-article-panel');
        if (readingPanels.length > 0) {
            readingPanels.forEach(panel => {
                const panelChan = panel.getAttribute('data-channel');
                if (panelChan === channel) {
                    panel.classList.add('active');
                } else {
                    panel.classList.remove('active');
                }
            });
        }

        // 3. Filter Workbook Form Fields
        const fieldWrappers = document.querySelectorAll('.channel-field-wrapper');
        fieldWrappers.forEach(wrap => {
            const fieldChan = wrap.getAttribute('data-channel');
            if (!fieldChan || fieldChan === 'all' || fieldChan === channel) {
                wrap.classList.remove('hidden-sector');
                wrap.classList.remove('hidden-channel');
            } else {
                wrap.classList.add('hidden-sector');
                wrap.classList.add('hidden-channel');
            }
        });
    }

    // Calculator Logic (Chapitre 11 - Seuil de Rentabilité & Salaire Réel)
    function updateCalculator() {
        const fixedEl = document.getElementById('charges_fixes_mensuelles') || document.getElementById('charges_fixes');
        const salaryEl = document.getElementById('salaire_net_vise');
        const rateEl = document.getElementById('taux_charges_sociales');
        const priceEl = document.getElementById('prix_unitaire_vente');
        const varEl = document.getElementById('cout_unitaire_variable');

        const resMarge = document.getElementById('res-marge-unitaire');
        const resCA = document.getElementById('res-ca-point-mort');
        const resVentes = document.getElementById('res-ventes-requises');
        const resSemaine = document.getElementById('res-ventes-semaine');

        if (!priceEl || !varEl) return;

        const fixed = parseFloat(fixedEl?.value) || 0;
        const targetNetSalary = parseFloat(salaryEl?.value) || 0;
        const socialRate = parseFloat(rateEl?.value) || 0;
        const price = parseFloat(priceEl.value) || 0;
        const variable = parseFloat(varEl.value) || 0;

        const unitMargin = price - variable;
        const marginRate = price > 0 ? Math.round((unitMargin / price) * 100) : 0;

        if (resMarge) {
            if (price > 0) {
                resMarge.textContent = `${unitMargin.toLocaleString('fr-FR')} € (${marginRate}%)`;
            } else {
                resMarge.textContent = '0 €';
            }
        }

        // Target Gross Salary including social charges
        const targetGrossSalary = socialRate < 100 && socialRate > 0 ? (targetNetSalary / (1 - (socialRate / 100))) : targetNetSalary;
        const totalMonthlyNeed = fixed + targetGrossSalary;

        if (unitMargin > 0 && totalMonthlyNeed > 0) {
            const unitsNeeded = Math.ceil(totalMonthlyNeed / unitMargin);
            const totalCA = Math.round(unitsNeeded * price);
            const weeklyCadence = (unitsNeeded / 4.2).toFixed(1);

            if (resVentes) resVentes.textContent = `${unitsNeeded.toLocaleString('fr-FR')} ventes`;
            if (resCA) resCA.textContent = `${totalCA.toLocaleString('fr-FR')} € / mois`;
            if (resSemaine) resSemaine.textContent = `~${weeklyCadence} / sem`;
        } else {
            if (resVentes) resVentes.textContent = '—';
            if (resCA) resCA.textContent = '—';
            if (resSemaine) resSemaine.textContent = '—';
        }
    }

    // Pitch Auto-Composer (Chapitre 16)
    function updatePitchFormula() {
        const cible = document.getElementById('pitch_cible')?.value.trim();
        const resultat = document.getElementById('pitch_resultat')?.value.trim();
        const methode = document.getElementById('pitch_methode')?.value.trim();
        const sans = document.getElementById('pitch_sans_douleur')?.value.trim();
        const completEl = document.getElementById('pitch_complet_final');

        if (cible && resultat && methode && sans && completEl) {
            if (!completEl.value || completEl.value.startsWith("J'aide")) {
                completEl.value = `J'aide ${cible} à ${resultat} grâce à ${methode}, sans ${sans}.`;
                saveResponse('pitch_complet_final', completEl.value);
            }
        }
    }

    // Bind Pathway Decision Cards in Chapter 6
    function bindChapter5PathwayDecision() {
        const grid = document.getElementById('pathway-decision-grid');
        if (!grid) return;

        const currentSector = localStorage.getItem('dtc_guide_selected_sector') || 'physique';
        const hasChosen = localStorage.getItem('dtc_guide_has_chosen_sector') === 'true';

        const updateVisuals = (chosen, isChosen) => {
            grid.querySelectorAll('.pathway-card').forEach(card => {
                const isSelected = card.getAttribute('data-sector') === chosen && isChosen;
                const btn = card.querySelector('.btn-choose-pathway');
                if (isSelected) {
                    card.classList.add('selected');
                    if (btn) btn.innerHTML = '<i class="fa-solid fa-circle-check"></i> Voie sélectionnée (Cliquer pour décocher)';
                } else {
                    card.classList.remove('selected');
                    if (btn) btn.innerHTML = 'Choisir cette voie <i class="fa-solid fa-arrow-right"></i>';
                }
            });
            const confBox = document.getElementById('pathway-confirmation-box');
            if (confBox) {
                if (isChosen) {
                    confBox.style.display = 'flex';
                    const title = document.getElementById('confirmation-title');
                    const sectorLabelsShort = {
                        physique: "Voie 1 : Produits Physiques & Terroirs",
                        service: "Voie 2 : Services & Agence B2B",
                        digital: "Voie 3 : Produits Digitaux & E-books",
                        food: "Voie 4 : Restauration, Food & Street-Food",
                        commerce: "Voie 5 : Commerce & Achat-Revente"
                    };
                    if (title) title.textContent = `✅ ${sectorLabelsShort[chosen] || chosen} validée pour ton projet !`;
                } else {
                    confBox.style.display = 'none';
                }
            }
        };

        const resetSelection = () => {
            updateSectorSelection(null, false);
            updateVisuals(null, false);
            showSaveStatus('Voie décochée (à choisir plus tard)', false);
        };

        if (hasChosen) {
            updateVisuals(currentSector, true);
        } else {
            updateVisuals(null, false);
        }

        grid.querySelectorAll('.pathway-card, .btn-choose-pathway').forEach(el => {
            el.addEventListener('click', (e) => {
                e.stopPropagation();
                const target = el.getAttribute('data-target') || el.closest('.pathway-card')?.getAttribute('data-sector');
                if (!target) return;

                const alreadyChosen = localStorage.getItem('dtc_guide_has_chosen_sector') === 'true';
                const activeSector = localStorage.getItem('dtc_guide_selected_sector');

                // TOGGLE OFF: If already chosen and clicked again, deselect!
                if (alreadyChosen && activeSector === target) {
                    resetSelection();
                    return;
                }

                updateSectorSelection(target, true);
                updateVisuals(target, true);
                markChapterCompleted('chapitre-6');
                showSaveStatus(`✓ Voie validée : ${target}`, false);
            });
        });

        // Reset button inside confirmation banner
        const resetBtn = document.getElementById('btn-reset-pathway');
        if (resetBtn) {
            resetBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                resetSelection();
            });
        }
    }

    // Bind Navigation Buttons
    function bindNavButtons() {
        const prev = document.getElementById('btn-prev-chapter-bottom');
        const next = document.getElementById('btn-next-chapter-bottom');
        const toggleBtn = document.getElementById('btn-toggle-chapter-completed');

        if (prev) {
            prev.addEventListener('click', () => loadChapter(currentChapterIndex - 1));
        }
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                const chap = window.GUIDE_DATA.chapters[currentChapterIndex];
                if (chap) toggleChapterCompleted(chap.id);
            });
        }
        if (next) {
            next.addEventListener('click', () => {
                const currentChap = window.GUIDE_DATA.chapters[currentChapterIndex];
                if (currentChap) {
                    markChapterCompleted(currentChap.id);
                }
                if (currentChapterIndex < window.GUIDE_DATA.chapters.length - 1) {
                    loadChapter(currentChapterIndex + 1);
                } else {
                    openExportModal();
                }
            });
        }
    }

    // Global Events
    function bindEvents() {
        // Toggle Sidebar on Mobile with Backdrop & Close Button
        const backdrop = document.getElementById('sidebar-backdrop');
        const btnSidebarClose = document.getElementById('btn-sidebar-close');

        const toggleSidebar = (forceState) => {
            if (!elements.sidebar) return;
            const willOpen = typeof forceState === 'boolean' ? forceState : !elements.sidebar.classList.contains('open');
            if (willOpen) {
                elements.sidebar.classList.add('open');
                if (backdrop) backdrop.classList.add('open');
            } else {
                elements.sidebar.classList.remove('open');
                if (backdrop) backdrop.classList.remove('open');
            }
        };

        if (elements.btnToggleSidebar) {
            elements.btnToggleSidebar.addEventListener('click', () => toggleSidebar());
        }
        if (btnSidebarClose) {
            btnSidebarClose.addEventListener('click', () => toggleSidebar(false));
        }
        if (backdrop) {
            backdrop.addEventListener('click', () => toggleSidebar(false));
        }

        // Keyboard navigation (Arrow keys)
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            if (e.key === 'ArrowRight' && currentChapterIndex < window.GUIDE_DATA.chapters.length - 1) {
                loadChapter(currentChapterIndex + 1);
            } else if (e.key === 'ArrowLeft' && currentChapterIndex > 0) {
                loadChapter(currentChapterIndex - 1);
            }
        });

        // Modal Open / Close
        if (elements.btnExport) {
            elements.btnExport.addEventListener('click', openExportModal);
        }
        if (elements.btnModalClose) {
            elements.btnModalClose.addEventListener('click', closeExportModal);
        }
        if (elements.modalBackdrop) {
            elements.modalBackdrop.addEventListener('click', (e) => {
                if (e.target === elements.modalBackdrop) closeExportModal();
            });
        }

        // Modal Actions
        if (elements.btnPrintExport) {
            elements.btnPrintExport.addEventListener('click', () => {
                window.print();
            });
        }

        if (elements.btnCopyExport) {
            elements.btnCopyExport.addEventListener('click', copyWorkbookText);
        }

        // Sector Modal Events
        if (elements.btnTopbarSectorSwitch) {
            elements.btnTopbarSectorSwitch.addEventListener('click', openSectorModal);
        }
        if (elements.btnSectorModalClose) {
            elements.btnSectorModalClose.addEventListener('click', closeSectorModal);
        }
        if (elements.sectorModalBackdrop) {
            elements.sectorModalBackdrop.addEventListener('click', (e) => {
                if (e.target === elements.sectorModalBackdrop) closeSectorModal();
            });
        }

        // Sector Modal Choices
        document.querySelectorAll('.sector-modal-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const choice = btn.getAttribute('data-sector-choice');
                if (choice) {
                    updateSectorSelection(choice, true);
                    closeSectorModal();
                }
            });
        });

        // Paywall Modal Events
        if (elements.btnPaywallClose) {
            elements.btnPaywallClose.addEventListener('click', closePaywallModal);
        }
        if (elements.paywallModalBackdrop) {
            elements.paywallModalBackdrop.addEventListener('click', (e) => {
                if (e.target === elements.paywallModalBackdrop) closePaywallModal();
            });
        }
        if (elements.btnUnlockCode) {
            elements.btnUnlockCode.addEventListener('click', () => {
                const code = prompt("Entre ton code d'accès ou mot de passe membre :");
                if (code) {
                    const clean = code.trim().toLowerCase();
                    if (clean === 'dtc2026' || clean === 'fondateur2026' || clean === 'domtomconnect' || clean === 'pulse2026') {
                        localStorage.setItem(STORAGE_KEY_UNLOCKED, 'true');
                        alert("✓ Accès complet débloqué avec succès ! Bienvenue dans la consultation.");
                        closePaywallModal();
                        renderTOC();
                        loadChapter(currentChapterIndex >= 3 ? currentChapterIndex : 3);
                    } else {
                        alert("Code d'accès non reconnu. Vérifie ton email de confirmation ou commande sur la boutique.");
                    }
                }
            });
        }
    }

    // Modal Export Generation
    function openExportModal() {
        if (!elements.modalBackdrop || !elements.modalContent) return;

        let content = `
            <div style="font-family: inherit; line-height: 1.7; color: var(--text-primary);">
                <div style="text-align: center; margin-bottom: 28px; padding-bottom: 20px; border-bottom: 1px solid var(--border-subtle);">
                    <h2 style="font-size: 1.6rem; color: var(--accent); margin-bottom: 8px;">Mon Plan d'Action Entrepreneur</h2>
                    <p style="color: var(--text-secondary); font-size: 0.95rem;">Synthèse de ma consultation — Domtom Connect 2026</p>
                </div>
        `;

        let filledCount = 0;
        const activeSector = localStorage.getItem('dtc_guide_selected_sector') || workbookResponses['secteur_activite_selection'] || 'physique';
        const activeChannel = localStorage.getItem('dtc_guide_selected_channel') || 'instagram';

        window.GUIDE_DATA.chapters.forEach(chap => {
            if (!chap.exercise) return;
            const fields = chap.exercise.fields;
            let chapterFieldsHtml = '';

            fields.forEach(f => {
                if (f.type === 'section-header') return;
                if (f.sector && f.sector !== 'all' && f.sector !== activeSector) return;
                if (f.channel && f.channel !== 'all' && f.channel !== activeChannel) return;

                const val = workbookResponses[f.id];
                if (val && val.trim()) {
                    filledCount++;
                    let displayVal = escapeHtml(val);
                    if (f.type === 'checkbox') {
                        displayVal = (val === 'true' || val === true) ? '✅ Fait / Validé' : '⬜ Non coché';
                    }
                    chapterFieldsHtml += `
                        <div style="margin-bottom: 14px;">
                            <strong style="color: var(--accent); display: block; font-size: 0.9rem;">${f.label}</strong>
                            <div style="background: rgba(255,255,255,0.04); padding: 10px 14px; border-radius: 6px; margin-top: 4px; white-space: pre-wrap; font-size: 0.95rem;">${displayVal}</div>
                        </div>
                    `;
                }
            });

            if (chapterFieldsHtml) {
                content += `
                    <div style="margin-bottom: 28px; background: var(--bg-card); padding: 20px; border-radius: 12px; border: 1px solid var(--border-subtle);">
                        <h4 style="font-size: 1.1rem; color: #ffffff; margin-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 8px;">
                            ${chap.badge} : ${chap.exercise.title}
                        </h4>
                        ${chapterFieldsHtml}
                    </div>
                `;
            }
        });

        if (filledCount === 0) {
            content += `
                <div style="text-align: center; padding: 40px 20px; color: var(--text-secondary);">
                    <p>Tu n'as pas encore rempli d'exercices dans le guide.</p>
                    <p style="font-size: 0.9rem; margin-top: 8px;">Parcours les chapitres et réponds aux questions pour générer ton carnet de bord personnalisé !</p>
                </div>
            `;
        }

        content += `</div>`;
        elements.modalContent.innerHTML = content;
        elements.modalBackdrop.classList.add('open');
    }

    function closeExportModal() {
        if (elements.modalBackdrop) elements.modalBackdrop.classList.remove('open');
    }

    function copyWorkbookText() {
        let plain = `=== MON PLAN D'ACTION ENTREPRENEUR (DOMTOM CONNECT) ===\n\n`;
        const activeSector = localStorage.getItem('dtc_guide_selected_sector') || workbookResponses['secteur_activite_selection'] || 'physique';
        const activeChannel = localStorage.getItem('dtc_guide_selected_channel') || 'instagram';

        window.GUIDE_DATA.chapters.forEach(chap => {
            if (!chap.exercise) return;
            let sectionHasVal = false;
            let sectionText = `--- ${chap.badge} : ${chap.title} ---\n`;

            chap.exercise.fields.forEach(f => {
                if (f.sector && f.sector !== 'all' && f.sector !== activeSector) return;
                if (f.channel && f.channel !== 'all' && f.channel !== activeChannel) return;
                const val = workbookResponses[f.id];
                if (val && val.trim()) {
                    sectionHasVal = true;
                    sectionText += `\n[${f.label}]\n${val}\n`;
                }
            });

            if (sectionHasVal) {
                plain += sectionText + '\n';
            }
        });

        navigator.clipboard.writeText(plain).then(() => {
            if (elements.btnCopyExport) {
                const original = elements.btnCopyExport.innerHTML;
                elements.btnCopyExport.innerHTML = '<i class="fa-solid fa-check"></i> Copié !';
                setTimeout(() => {
                    elements.btnCopyExport.innerHTML = original;
                }, 2000);
            }
        });
    }

    // Dark Mode Enforced (Zero broken contrast)
    function initTheme() {
        document.body.classList.remove('light-theme');
        try {
            localStorage.removeItem('dtc_guide_theme');
        } catch (e) {}
    }

    // Helpers
    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    // Launch on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
