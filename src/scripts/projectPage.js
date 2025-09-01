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
    })
    .catch(err => console.error("Error loading project:", err));
});