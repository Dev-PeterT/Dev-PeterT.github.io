document.addEventListener("DOMContentLoaded", () => {
	// Toggles the visibility of the mobile navigation menu
	const hamburger = document.querySelector(".hamburger");
	hamburger.addEventListener("click", () => {
		const navItems = document.getElementById('navItems');
		navItems.classList.toggle('active');
	});

	// Smoothly scrolls to a section on page load if a hash is present in the URL (e.g., #About)
	window.addEventListener('load', () => {
		const hash = window.location.hash;
		if (hash) {
			const target = document.querySelector(hash);
			if (target) {
				target.scrollIntoView({ behavior: 'smooth' });
			}
		}
	});

	// Closes the mobile menu after a user clicks any navigation link
	document.querySelectorAll('.navItems a').forEach(link => {
		link.addEventListener('click', () => {
			if (window.innerWidth <= 800) {
				document.getElementById('navItems').classList.remove('active');
			}
		});
	});

	// Selects all page sections and navigation links for intersection observation
	const sections = document.querySelectorAll("div[id]");
	const navLinks = document.querySelectorAll(".navItems li a");

	// Sets up an IntersectionObserver to highlight the nav link of the section currently in view
	const observer = new IntersectionObserver(
        entries => {
            let visibleSections = entries.filter(entry => entry.isIntersecting);
            if (visibleSections.length === 0) return;

            // Sort by top-most intersection
            visibleSections.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
            const id = visibleSections[0].target.getAttribute("id");

            navLinks.forEach(link => link.classList.remove("active"));
            const activeLink = document.querySelector(`.navItems li a[href="#${id}"]`);
            if (activeLink) activeLink.classList.add("active");
        },
        {
            threshold: 0.5, // Require at least 50% of section to be visible
            rootMargin: "0px 0px -40% 0px", // Triggers earlier when scrolling up
        }
    );

	// Start observing each section to detect when it enters the viewport
	sections.forEach(section => {
		observer.observe(section);
	});

	// Typing text effect beside my name
	const roles = ["Game Developer", "Software Developer"];
	let i = 0;
	let j = 0;
	let currentRole = "";
	let isDeleting = false;
	const typingElement = document.getElementById("typingText");

	function type() {
		if (i >= roles.length) i = 0;
		currentRole = roles[i];

		typingElement.innerHTML = currentRole.substring(0, j) + (j % 2 === 0 ? "|" : "");

		if (!isDeleting && j < currentRole.length) {
			j++;
			setTimeout(type, 200); // slower typing
		} else if (isDeleting && j > 0) {
			j--;
			setTimeout(type, 150); // slower deleting
		} else if (!isDeleting && j === currentRole.length) {
			isDeleting = true;
			setTimeout(type, 1500); // pause before delete
		} else if (isDeleting && j === 0) {
			isDeleting = false;
			i++;
			setTimeout(type, 500); // pause before next word
		}
	}

	type();
});