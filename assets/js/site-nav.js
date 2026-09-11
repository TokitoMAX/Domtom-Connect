/**
 * Universal Responsive Navigation Controller
 * Domtom Connect
 */

(function () {
    function initSiteNav() {
        const toggleBtn = document.getElementById('mobile-menu-btn');
        const drawer = document.getElementById('mobile-nav-drawer');

        if (!toggleBtn || !drawer) return;

        // Toggle Drawer
        toggleBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            const isOpen = drawer.classList.contains('active');
            if (isOpen) {
                closeDrawer();
            } else {
                openDrawer();
            }
        });

        // Close when clicking any link inside the drawer
        const drawerLinks = drawer.querySelectorAll('a');
        drawerLinks.forEach(function (link) {
            link.addEventListener('click', function () {
                closeDrawer();
            });
        });

        // Close when clicking outside
        document.addEventListener('click', function (e) {
            if (drawer.classList.contains('active')) {
                if (!drawer.contains(e.target) && !toggleBtn.contains(e.target)) {
                    closeDrawer();
                }
            }
        });

        // Close on escape key
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && drawer.classList.contains('active')) {
                closeDrawer();
            }
        });

        function openDrawer() {
            drawer.classList.add('active');
            toggleBtn.setAttribute('aria-expanded', 'true');
            const icon = toggleBtn.querySelector('i');
            if (icon) {
                icon.className = 'fas fa-times';
            }
        }

        function closeDrawer() {
            drawer.classList.remove('active');
            toggleBtn.setAttribute('aria-expanded', 'false');
            const icon = toggleBtn.querySelector('i');
            if (icon) {
                icon.className = 'fas fa-bars';
            }
        }

        // Mobile Nav Accordion Toggles
        const groupHeaders = drawer.querySelectorAll('.mobile-nav-group-header');
        groupHeaders.forEach(function (header) {
            header.addEventListener('click', function (e) {
                e.stopPropagation();
                const parentGroup = header.closest('.mobile-nav-group');
                if (parentGroup) {
                    parentGroup.classList.toggle('open');
                }
            });
        });

        // Desktop Dropdown Toggle Support
        const dropdownToggles = document.querySelectorAll('.site-nav .dropdown-toggle');
        dropdownToggles.forEach(function (toggle) {
            toggle.addEventListener('click', function (e) {
                // If clicked on desktop without touch, default hover handles it, but click can navigate or toggle
                const parentLi = toggle.closest('.has-dropdown');
                if (parentLi) {
                    const dropdownMenu = parentLi.querySelector('.nav-dropdown-menu');
                    if (dropdownMenu && window.innerWidth > 1024) {
                        // Allow clicking to open if touch device
                        if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
                            e.preventDefault();
                            dropdownMenu.classList.toggle('show');
                        }
                    }
                }
            });
        });

        // Close dropdown when clicking outside on desktop
        document.addEventListener('click', function (e) {
            if (!e.target.closest('.has-dropdown')) {
                document.querySelectorAll('.site-nav .nav-dropdown-menu.show').forEach(function (menu) {
                    menu.classList.remove('show');
                });
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSiteNav);
    } else {
        initSiteNav();
    }
})();
