document.addEventListener("DOMContentLoaded", () => {
  // Animate in on load
  document.body.classList.add("body-animate-in");

  // Universal click handler for all <a> elements
  document.addEventListener('click', function (e) {
    const link = e.target.closest('a');

    // If it's not a link or it's not in the DOM, ignore
    if (!link || !link.href) return;

    const href = link.getAttribute('href');

    // Skip anchor links, mailto, tel, or target=_blank
    if (
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        link.target === '_blank'
    ) return;

    // Treat anchor-only links on *same page* as instant (no animation)
    if (href.startsWith('#') && link.pathname === window.location.pathname) {
        return;
    }

    // External links (not same origin) → skip animation
    if (link.hostname !== window.location.hostname) return;

    // Prevent default navigation
    e.preventDefault();

    // Animate out navbar (if present)
    const navbar = document.getElementById('navbar');
    if (navbar) {
      navbar.classList.remove("nav-animate-in");
      navbar.classList.add("nav-animate-out");
    }

    // Animate out page content
    const pageContent = document.querySelector('.pageContent');
    if (pageContent) {
      document.body.classList.remove("body-animate-in");
      document.body.classList.add("body-animate-out");
    }

    // Navigate after animation completes
    setTimeout(() => {
      window.location.href = link.href;
    }, 600); // Match your CSS transition duration
  });
});
