document.addEventListener("DOMContentLoaded", () => {
  // ======== Navigation Slide Animation ========
  const navbar = document.getElementById("navbar");
  const navItems = document.querySelectorAll(".rightNavItem");

   // Remove classes in case they're left over (reset state)
  navbar.classList.remove("nav-animate-in", "nav-animate-out");

  // Delay adding the class to next animation frame
  requestAnimationFrame(() => {
    navbar.classList.add("nav-animate-in");
  });
  
  // Intercept link clicks to animate out
  document.querySelectorAll('.navItems a').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');

      // Skip in-page anchors like #about
      if (href.startsWith("#")) return;

      e.preventDefault();

      navbar.classList.remove("nav-animate-in");
      navbar.classList.add("nav-animate-out");

      setTimeout(() => {
        window.location.href = href;
      }, 300); // Match animation duration
    });
  });

  // Animate out on browser unload (page refresh, back/forward)
  window.addEventListener("beforeunload", (e) => {
    // Add animate out class
    navbar.classList.remove("nav-animate-in");
    navbar.classList.add("nav-animate-out");

    // IMPORTANT: Browsers generally don't delay unload for scripts.
    // So animation might not be visible here.

    // Attempt to delay unload with synchronous blocking
    // WARNING: this can cause poor UX and is often blocked by browsers.
    const start = Date.now();
    while (Date.now() - start < 300) {
      // Busy wait for animation duration to finish
      // This blocks page unload briefly to let animation play
    }
  });

  // ======== Hamburger Menu Toggle ========
  const hamburger = document.querySelector(".hamburger");
  hamburger?.addEventListener("click", () => {
    const navItems = document.getElementById('navItems');
    navItems?.classList.toggle('active');
  });

  // ======== Smooth Scroll to Hash on Load ========
  window.addEventListener('load', () => {
    const hash = window.location.hash;
    if (hash) {
      const target = document.querySelector(hash);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });

  // ======== Close Mobile Menu on Link Click ========
  document.querySelectorAll('.navItems a').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 800) {
        document.getElementById('navItems')?.classList.remove('active');
      }
    });
  });

  // ======== Section Highlighting with IntersectionObserver ========
  const sections = document.querySelectorAll("div[id]");
  const navLinks = document.querySelectorAll(".navItems li a");

  const observer = new IntersectionObserver(
    entries => {
      let visibleSections = entries.filter(entry => entry.isIntersecting);
      if (visibleSections.length === 0) return;

      visibleSections.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      const id = visibleSections[0].target.getAttribute("id");

      navLinks.forEach(link => link.classList.remove("active"));
      const activeLink = document.querySelector(`.navItems li a[href="#${id}"]`);
      if (activeLink) activeLink.classList.add("active");
    },
    {
      threshold: 0.5,
      rootMargin: "0px 0px -40% 0px",
    }
  );

  sections.forEach(section => observer.observe(section));

  // ======== Typing Text Effect with State Persistence ========
  const roles = ["Game Developer", "Software Developer"];
  const typingElement = document.getElementById("typingText");

  let i = parseInt(localStorage.getItem("typingIndex")) || 0;
  let j = parseInt(localStorage.getItem("typingCharIndex")) || 0;
  let isDeleting = localStorage.getItem("isDeleting") === "1";

  function type() {
    const currentRole = roles[i % roles.length];
    typingElement.innerHTML = currentRole.substring(0, j) + (j % 2 === 0 ? "|" : "");

    localStorage.setItem("typingIndex", i);
    localStorage.setItem("typingCharIndex", j);
    localStorage.setItem("isDeleting", isDeleting ? "1" : "0");

    if (!isDeleting && j < currentRole.length) {
      j++;
      setTimeout(type, 200);
    } else if (isDeleting && j > 0) {
      j--;
      setTimeout(type, 150);
    } else if (!isDeleting && j === currentRole.length) {
      isDeleting = true;
      setTimeout(type, 1500);
    } else if (isDeleting && j === 0) {
      isDeleting = false;
      i++;
      setTimeout(type, 500);
    }
  }

  type();
});