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

      /* 
        
      */
     /*===============================================
       Populate dynamic sections using Project_Sections
       =============================================== */
      const contentContainer = document.getElementById("projectContent");
      if (contentContainer && Array.isArray(project.Project_Sections)) {
        project.Project_Sections.forEach(section => {
          // Create wrapper
          const sectionContent = document.createElement("div");
          sectionContent.classList.add("sectionContent");

          /*===============================================
             Create the section title block
            =============================================== */
          const sectionDivider = document.createElement("div");
          sectionDivider.classList.add("divider");
          sectionDivider.innerHTML = `
            <span>${section.Section_Title}</span><hr>
          `;

          /*===============================================
             Create the paragraph for context text
            =============================================== */
          const contextPara = document.createElement("p");
          contextPara.textContent = section.Section_Context || "";

          // Append divider and paragraph into sectionContent wrapper
          sectionContent.appendChild(sectionDivider);
          sectionContent.appendChild(contextPara);

          /*===============================================
             If "Technical_Example" exists and is not empty
            =============================================== */
          if ("Technical_Example" in section && section.Technical_Example?.trim()) {
            const codeTerminal = document.createElement("div");
            codeTerminal.classList.add("codeTerminal");

            // Code header
            const codeHeader = document.createElement("div");
            codeHeader.classList.add("codeHeader");
            codeHeader.setAttribute("onclick", "toggleCode()");
            codeHeader.innerHTML = `
              Superclass Spotlight
              <button class="ToggleBtn" id="toggleBtn">Show Code ▼</button>
            `;

            // Code content
            const codeContent = document.createElement("div");
            codeContent.classList.add("codeContent");
            codeContent.id = "codeContent";
            codeContent.innerHTML = `
              <pre><code id="codeBlock" class="language-csharp">${section.Technical_Example}</code></pre>
            `;

            // Append header + content into codeTerminal
            codeTerminal.appendChild(codeHeader);
            codeTerminal.appendChild(codeContent);

            // Add codeTerminal into sectionContent
            sectionContent.appendChild(codeTerminal);
          }

          // Finally, append wrapper to the container
          contentContainer.appendChild(sectionContent);
        });
      }

    })
    .catch(err => console.error("Error loading project:", err));
});

// Toggle button to show/hide code
let codeLoaded = false;
function toggleCode() {
  const codeContent = document.getElementById("codeContent");
  const toggleBtn = document.getElementById("toggleBtn");
  const codeBlock = document.getElementById("codeBlock");
  const isExpanded = codeContent.classList.toggle("expanded");

  toggleBtn.textContent = isExpanded ? "Hide Code ▲" : "Show Code ▼";
}