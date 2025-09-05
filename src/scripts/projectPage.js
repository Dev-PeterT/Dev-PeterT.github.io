document.addEventListener("DOMContentLoaded", () => {
  // Read slug from query string
  const params = new URLSearchParams(window.location.search);
  const slugFromUrl = params.get("title");

  if (!slugFromUrl) {
    console.error("No project title found in URL");
    return;
  }

  // Slugify helper (same as in indexProjectPopulator.js)
  const slugify = str =>
    str
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

  fetch("/src/data/projects.json")
    .then(res => res.json())
    .then(projects => {
      const project = projects.find(
        p => slugify(p.Project_Title) === slugFromUrl
      );

      if (!project) {
        console.error("Project not found:", slugFromUrl);
        document.title = "Project Not Found";
        return;
      }

      // Update the <title>
      document.title = project.Project_Title;

      // Example: fill project details into the page
      const container = document.getElementById("projectDetails");
      if (container) {
        container.innerHTML = `
          <h1>${project.Project_Title}</h1>
          <p>${project.Project_Pitch || ""}</p>
        `;
      }

      // Populate dynamic sections using Project_Sections
      const contentContainer = document.getElementById("projectContent");

      if (contentContainer && Array.isArray(project.Project_Sections)) {
        project.Project_Sections.forEach(section => {
          // Create the section title block
          const divider = document.createElement("div");
          divider.classList.add("divider", "divider");
          divider.innerHTML = `
            <span>${section.Section_Title}</span><hr>
          `;

          // Create the section context content (paragraph)
          const context = document.createElement("p");
          context.textContent = section.Section_Context || "";

          // Append both to the container
          contentContainer.appendChild(divider);
          contentContainer.appendChild(context);
        });
      }

    })
    .catch(err => console.error("Error loading project:", err));
});