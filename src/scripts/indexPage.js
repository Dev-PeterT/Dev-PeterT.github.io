document.addEventListener('DOMContentLoaded', () => {
  fetch('/src/data/projects.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(projects => {
      const projectsSection = document.getElementById("projects");
      if (!projectsSection) {
        throw new Error("Projects section not found");
      }

      // Utility function to create a section
      const createSection = (title, id) => {
        const wrapper = document.createElement("div");
        wrapper.innerHTML = `
          <div class="divider">
            <hr><span>${title}</span><hr>
          </div>
          <div class="projectsContent" id="${id}"></div>
        `;
        projectsSection.appendChild(wrapper);
      };

      // Check which types exist
      const hasProfessional = projects.some(p => p.Project_Type.toLowerCase().includes("professional"));
      const hasPersonal = projects.some(p => p.Project_Type.toLowerCase().includes("personal"));

      if (hasProfessional) createSection("Professional Work", "professionalProjectsContent");
      if (hasPersonal) createSection("Personal Projects", "personalProjectsContent");

      // Now distribute projects into the right section
      projects.forEach(project => {
        let targetContainer = null;

        if (project.Project_Type.toLowerCase().includes("professional")) {
          targetContainer = document.getElementById("professionalProjectsContent");
        } else if (project.Project_Type.toLowerCase().includes("personal")) {
          targetContainer = document.getElementById("personalProjectsContent");
        }

        if (!targetContainer) return; // Skip if no matching section

        const a = document.createElement('a');

        // Turn Project_Title into a URL-friendly slug
        const slug = project.Project_Title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "");

        a.href = `/src/pages/projectPage.html?title=${encodeURIComponent(slug)}`;
        a.className = 'projectContainer';
        a.innerHTML = `
          <div class="projectVideo">
            <video></video>
          </div>
          <div class="projectText">
            <h2>${project.Project_Title}<span class="projectArrow">&gt;</span></h2>
            <p>${project.Project_Pitch || ""}</p>
          </div>
        `;

        // Animate navbar/page out before navigation
        a.addEventListener('click', (e) => {
          e.preventDefault();
          const navbar = document.getElementById('navbar');
          if (navbar) {
            navbar.classList.remove("nav-animate-in");
            navbar.classList.add("nav-animate-out");
          }

          const pageContent = document.querySelector('.pageContent');
          if (pageContent) {
            document.body.classList.remove("body-animate-in");
            document.body.classList.add("body-animate-out");
          }

          setTimeout(() => {
            window.location.href = a.href;
          }, 300);
        });

        targetContainer.appendChild(a);
      });
    })
    .catch(error => console.error('Error loading project data:', error));
});