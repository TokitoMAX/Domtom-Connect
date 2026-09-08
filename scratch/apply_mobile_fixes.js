const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');

// 1. UPDATE guide.html
const guideHtmlPath = path.join(root, 'guide.html');
let guideHtml = fs.readFileSync(guideHtmlPath, 'utf8');

// Add close button to sidebar-header if not present
if (!guideHtml.includes('btn-sidebar-close')) {
    guideHtml = guideHtml.replace(
        `                </a>\r\n            </div>`,
        `                </a>\r\n                <button id="btn-sidebar-close" class="btn-sidebar-close" aria-label="Fermer le sommaire">\r\n                    <i class="fa-solid fa-xmark"></i>\r\n                </button>\r\n            </div>`
    );
    // fallback for LF
    if (!guideHtml.includes('btn-sidebar-close')) {
        guideHtml = guideHtml.replace(
            `                </a>\n            </div>`,
            `                </a>\n                <button id="btn-sidebar-close" class="btn-sidebar-close" aria-label="Fermer le sommaire">\n                    <i class="fa-solid fa-xmark"></i>\n                </button>\n            </div>`
        );
    }
}

// Add sidebar backdrop if not present
if (!guideHtml.includes('sidebar-backdrop')) {
    guideHtml = guideHtml.replace(
        `        </aside>`,
        `        </aside>\n\n        <!-- Mobile Sidebar Backdrop -->\n        <div class="sidebar-backdrop" id="sidebar-backdrop"></div>`
    );
}

// Wrap topbar tool labels in span.tool-label
guideHtml = guideHtml.replace(
    `<span style="display:inline-block; margin-left:4px;">L'E-book & Outils</span>`,
    `<span class="tool-label" style="display:inline-block; margin-left:4px;">L'E-book & Outils</span>`
);
guideHtml = guideHtml.replace(
    `<i class="fa-solid fa-house"></i> Accueil`,
    `<i class="fa-solid fa-house"></i> <span class="tool-label">Accueil</span>`
);

fs.writeFileSync(guideHtmlPath, guideHtml, 'utf8');
console.log('✅ guide.html updated');

// 2. UPDATE assets/js/guide-reader.js
const guideJsPath = path.join(root, 'assets', 'js', 'guide-reader.js');
let guideJs = fs.readFileSync(guideJsPath, 'utf8');

// Ensure backdrop and close button are wired and closing sidebar on mobile
if (!guideJs.includes('btnSidebarClose')) {
    const oldBind = `        // Toggle Sidebar on Mobile
        if (elements.btnToggleSidebar && elements.sidebar) {
            elements.btnToggleSidebar.addEventListener('click', () => {
                elements.sidebar.classList.toggle('open');
            });
        }`;

    const newBind = `        // Toggle Sidebar on Mobile with Backdrop & Close Button
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
        }`;

    if (guideJs.includes(oldBind)) {
        guideJs = guideJs.replace(oldBind, newBind);
    } else {
        // try normalized line endings
        const normOld = oldBind.replace(/\r\n/g, '\n');
        const normJs = guideJs.replace(/\r\n/g, '\n');
        if (normJs.includes(normOld)) {
            guideJs = normJs.replace(normOld, newBind);
        }
    }
}

// Auto close sidebar on mobile when chapter link clicked
if (!guideJs.includes('Auto-close sidebar on mobile')) {
    guideJs = guideJs.replace(
        `loadChapter(idx);`,
        `loadChapter(idx);
            // Auto-close sidebar on mobile
            if (window.innerWidth <= 850 && elements.sidebar) {
                elements.sidebar.classList.remove('open');
                const bd = document.getElementById('sidebar-backdrop');
                if (bd) bd.classList.remove('open');
            }`
    );
}

fs.writeFileSync(guideJsPath, guideJs, 'utf8');
console.log('✅ guide-reader.js updated');

// 3. UPDATE assets/css/guide-reader.css
const guideCssPath = path.join(root, 'assets', 'css', 'guide-reader.css');
let guideCss = fs.readFileSync(guideCssPath, 'utf8');

// Append comprehensive Mobile Phone Styles
const mobilePhoneCss = `

/* ==========================================================================
   ENHANCED MOBILE PHONE EXPERIENCE (DOMTOM CONNECT 2026)
   ========================================================================== */

/* Mobile Sidebar Close Button */
.btn-sidebar-close {
    display: none;
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.15);
    color: var(--text-secondary);
    width: 34px;
    height: 34px;
    border-radius: 8px;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 1rem;
    transition: all 0.2s ease;
}

.btn-sidebar-close:hover {
    color: #ffffff;
    background: rgba(239, 68, 68, 0.2);
    border-color: rgba(239, 68, 68, 0.4);
}

/* Mobile Sidebar Backdrop */
.sidebar-backdrop {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(2, 6, 23, 0.75);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    z-index: 890;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.25s ease;
}

.sidebar-backdrop.open {
    display: block;
    opacity: 1;
    pointer-events: auto;
}

@media (max-width: 850px) {
    .btn-sidebar-close {
        display: flex;
    }
    .guide-sidebar {
        width: min(320px, 86vw) !important;
        z-index: 1000 !important;
    }
    .sidebar-toc .toc-title {
        white-space: normal !important;
        line-height: 1.35 !important;
        font-size: 0.88rem !important;
    }
    
    /* Topbar Mobile Cleanup: no text overlap */
    .reader-topbar {
        height: 56px !important;
        padding: 0 12px !important;
        gap: 8px !important;
    }
    .topbar-left {
        flex: 1 1 auto !important;
        min-width: 0 !important;
        gap: 8px !important;
        overflow: hidden !important;
    }
    .breadcrumb-chapter {
        white-space: nowrap !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        font-size: 0.82rem !important;
        max-width: 100% !important;
    }
    .topbar-right {
        flex-shrink: 0 !important;
        gap: 6px !important;
    }
    .btn-topbar-tool {
        padding: 8px 10px !important;
        font-size: 0.82rem !important;
        border-radius: 8px !important;
    }
    .btn-topbar-tool .tool-label {
        display: none !important;
    }
    .topbar-sector-pill {
        display: none !important;
    }

    /* Container & Reader Body */
    .reader-container {
        padding: 20px 14px 90px !important;
        max-width: 100% !important;
    }
    .chapter-hero {
        margin-bottom: 24px !important;
        padding-bottom: 18px !important;
    }
    .chapter-badge-top {
        font-size: 0.72rem !important;
        padding: 4px 10px !important;
        margin-bottom: 10px !important;
    }
    .chapter-title {
        font-size: 1.65rem !important;
        line-height: 1.24 !important;
        word-break: break-word !important;
        hyphens: auto !important;
        margin-bottom: 12px !important;
    }
    .chapter-subtitle {
        font-size: 0.98rem !important;
        line-height: 1.55 !important;
        margin-bottom: 14px !important;
    }
    .chapter-meta-bar {
        flex-wrap: wrap !important;
        gap: 8px 14px !important;
        font-size: 0.78rem !important;
    }
    .article-body {
        font-size: 0.98rem !important;
        line-height: 1.68 !important;
    }
    .article-body p {
        margin-bottom: 16px !important;
    }
    .article-body h3 {
        font-size: 1.25rem !important;
        margin: 28px 0 12px !important;
    }

    /* Chapter Footer: Fixed Stack on Phone */
    .chapter-nav-footer {
        flex-direction: column !important;
        gap: 14px !important;
        align-items: stretch !important;
        margin-top: 36px !important;
        padding-top: 20px !important;
    }
    .chapter-nav-actions-row {
        width: 100% !important;
    }
    .btn-chapter-completed-toggle {
        width: 100% !important;
        justify-content: center !important;
        padding: 12px 16px !important;
        font-size: 0.85rem !important;
        text-align: center !important;
    }
    .chapter-nav-buttons-row {
        flex-direction: column-reverse !important;
        width: 100% !important;
        gap: 10px !important;
    }
    .chapter-nav-buttons-row .btn-nav-chapter {
        width: 100% !important;
        justify-content: center !important;
        padding: 14px 20px !important;
        font-size: 0.95rem !important;
        border-radius: 10px !important;
    }

    /* Workbook on Phone */
    .workbook-section {
        padding: 20px 14px !important;
        margin-top: 36px !important;
        border-radius: 16px !important;
    }
    .workbook-header {
        flex-direction: column !important;
        align-items: flex-start !important;
        gap: 10px !important;
    }
    .workbook-title-group h3 {
        font-size: 1.15rem !important;
    }
    .workbook-input, .workbook-textarea, .workbook-select {
        font-size: 16px !important; /* Prevents auto zoom in iOS Safari */
        padding: 12px 14px !important;
    }

    /* Clean Cover Chapitre 0 on Mobile */
    .clean-cover-page {
        padding: 1.5rem 0.5rem 2rem !important;
        min-height: auto !important;
    }
    .clean-cover-wrapper {
        max-width: 300px !important;
    }
    .btn-clean-open-cover {
        width: 100% !important;
        max-width: 320px !important;
        padding: 14px 20px !important;
        font-size: 0.98rem !important;
    }

    /* Grids & Cards fallback to 1 column */
    .funnel-phases-grid,
    .accounts-flow-grid,
    .pros-cons-split,
    .vs-container,
    .grid-2,
    .logo-dropzone-wrapper,
    .logo-mockups-grid,
    .pathway-decision-grid,
    .color-psychology-grid {
        grid-template-columns: 1fr !important;
        gap: 14px !important;
    }

    /* Modal Responsive */
    .modal-card {
        width: 95vw !important;
        max-height: 90vh !important;
        border-radius: 16px !important;
    }
    .modal-header {
        padding: 16px 18px !important;
    }
    .modal-header h3 {
        font-size: 1.1rem !important;
    }
    .modal-body {
        padding: 16px 18px !important;
    }
    .modal-footer {
        flex-direction: column !important;
        gap: 10px !important;
        padding: 14px 18px !important;
    }
    .modal-footer button {
        width: 100% !important;
        justify-content: center !important;
    }
}
`;

if (!guideCss.includes('ENHANCED MOBILE PHONE EXPERIENCE')) {
    guideCss += mobilePhoneCss;
    fs.writeFileSync(guideCssPath, guideCss, 'utf8');
    console.log('✅ guide-reader.css updated with enhanced mobile styles');
}

// 4. UPDATE guide-entrepreneur.html (Make preview chapter selector horizontal scrolling pills on mobile)
const salesHtmlPath = path.join(root, 'guide-entrepreneur.html');
let salesHtml = fs.readFileSync(salesHtmlPath, 'utf8');

const salesMobileEnhancement = `
        @media (max-width: 768px) {
            /* Mobile Optimization for Guide Preview */
            .guide-preview-sidebar {
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                padding-bottom: 12px;
                margin-bottom: 14px;
            }
            .guide-preview-sidebar .sidebar-header {
                font-size: 0.82rem;
                margin-bottom: 8px;
            }
            .preview-chapter-list {
                display: flex !important;
                flex-direction: row !important;
                overflow-x: auto !important;
                gap: 8px !important;
                padding-bottom: 6px !important;
                scroll-snap-type: x mandatory;
                -webkit-overflow-scrolling: touch;
            }
            .preview-chapter-list li {
                flex: 0 0 auto !important;
                white-space: nowrap !important;
                scroll-snap-align: start;
                padding: 8px 12px !important;
                border-radius: 999px !important;
                font-size: 0.82rem !important;
            }
            .preview-chapter-list li .chap-badge {
                font-size: 0.7rem !important;
                padding: 2px 6px !important;
            }
            .preview-checklist-card {
                padding: 14px !important;
            }
            .preview-check-item {
                font-size: 0.86rem !important;
                padding: 8px !important;
            }
        }
`;

if (!salesHtml.includes('Mobile Optimization for Guide Preview')) {
    salesHtml = salesHtml.replace(
        `        @media (max-width: 768px) {`,
        `        @media (max-width: 768px) {` + salesMobileEnhancement
    );
    fs.writeFileSync(salesHtmlPath, salesHtml, 'utf8');
    console.log('✅ guide-entrepreneur.html updated with mobile preview enhancements');
}
