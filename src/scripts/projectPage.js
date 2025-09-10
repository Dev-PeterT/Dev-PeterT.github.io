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

      // Populate DOM elements with data
      document.getElementById("roleDetail").textContent = project.Development_Role;
      document.getElementById("sizeDetail").textContent = project.Development_TeamSize;
      document.getElementById("timeDetail").textContent = project.Development_Time;
      document.getElementById("statusDetail").textContent = project.Development_Status;
      document.getElementById("toolDetail").textContent = project.Development_Tools;
      document.getElementById("languageDetail").textContent = project.Development_Language;


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
          contextPara.innerHTML = section.Section_Context || "";

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
            codeTerminal.appendChild(codeHeader);
            codeTerminal.appendChild(codeContent);

            // Add codeTerminal into sectionContent
            sectionContent.appendChild(codeTerminal);

             // Determine the Highlight.js language class
            let languageClass = "";
            switch ((section.Technical_Language || "").toLowerCase()) {
              case "c#":
                languageClass = "language-csharp";
                break;
              case "c++":
                languageClass = "language-cpp";
                break;
              case "python":
                languageClass = "language-python";
                break;
              default:
                languageClass = ""; // fallback: let Highlight.js try auto-detect
            }

            // Fetch the code from the link
            fetch(section.Technical_Example)
              .then((response) => {
                if (!response.ok) throw new Error("Failed to fetch code");
                return response.text();
              })
              .then((codeText) => {
                codeContent.innerHTML = `
                  <pre><code id="codeBlock" class="language-csharp">${codeText}</code></pre>
                `;
                // Initialize Highlight.js
                hljs.highlightElement(codeContent.querySelector("code"));
              })
              .catch((err) => {
                codeContent.innerHTML = `<p style="color:red;">Error loading code: ${err.message}</p>`;
              });
          }

          /*===========================================
             If "Video_Example" exists and is not empty
            =========================================== */
          
          
          
          /*===========================================
             If "Photo_Example" exists and is not empty
            =========================================== */

          
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

/*============================================
  Helper functions to get the code from a link
  ============================================ */
function isValidURL(str) {
    try {
        new URL(str);
        return true;
    } catch (_) {
        return false;
    }
}
function escapeHTML(str) {
    return str.replace(/[&<>"']/g, function (match) {
        const escape = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;',
        };
        return escape[match];
    });
}