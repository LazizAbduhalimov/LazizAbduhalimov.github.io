const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".site-nav");
const navLinks = document.querySelectorAll(".site-nav a");
const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");

function setHeaderState() {
    header.classList.toggle("scrolled", window.scrollY > 24);
}

function closeMenu() {
    menuToggle.classList.remove("active");
    menuToggle.setAttribute("aria-expanded", "false");
    nav.classList.remove("open");
}

menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.classList.toggle("active");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    nav.classList.toggle("open", isOpen);
});

navLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
});

filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const filter = button.dataset.filter;

        filterButtons.forEach((item) => item.classList.remove("active"));
        button.classList.add("active");

        projectCards.forEach((card) => {
            const categories = card.dataset.category.split(" ");
            const isVisible = filter === "all" || categories.includes(filter);
            card.classList.toggle("hidden", !isVisible);
        });
    });
});

const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                revealObserver.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.14 }
);

document.querySelectorAll(".project-card, .section-band, .hero-panel").forEach((element, index) => {
    element.classList.add("reveal");
    element.style.transitionDelay = `${Math.min(index * 60, 240)}ms`;
    revealObserver.observe(element);
});

const sections = document.querySelectorAll("main section[id]");
const navObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            navLinks.forEach((link) => {
                link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
            });
        });
    },
    { rootMargin: "-35% 0px -55% 0px" }
);

sections.forEach((section) => navObserver.observe(section));

window.addEventListener("scroll", setHeaderState, { passive: true });
window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
});

setHeaderState();
