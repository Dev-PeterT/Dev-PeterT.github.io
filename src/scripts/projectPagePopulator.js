// Wait for the DOM to be fully loaded before executing the script
document.addEventListener('DOMContentLoaded', () => {
  // Parse query parameters from the current URL
  const params = new URLSearchParams(window.location.search);
  const projectId = params.get('id');

  // If no project ID is provided in the URL, log an error and stop execution
if (!projectId) {
    console.error("No project ID in URL.");
    return;
}
  // Fetch project data from the JSON file
  fetch('/src/data/personalProjects.json')
    .then(response => response.json())
    .then(projects => {
      // Find the project object with a matching ID
      const project = projects.find(p => p.Project_ID === projectId);
      
      // If the project is not found, log an error and stop execution
      if (!project) {
        console.error("Project not found.");
        return;
      }

      // Set the page title to the project's title
      document.title = project.Project_Title;

      const paragraphs = project.Project_SuperClass.split('\n\n');

      // Populate elements
      document.getElementById('projectTitle').textContent = project.Project_Title;

      document.getElementById('roleDetail').textContent = project.Project_Role;
      document.getElementById('sizeDetail').textContent = project.Project_TeamSize;
      document.getElementById('timeDetail').textContent = project.Project_DevelopmentTime;
      document.getElementById('engineDetail').textContent = project.Project_Engine;
      document.getElementById('languageDetail').textContent = project.Project_Language;

      document.getElementById('platformDetail').textContent = project.Project_Platform;
      document.getElementById('genreDetail').textContent = project.Project_Genre;
      document.getElementById('perspectiveDetail').textContent = project.Project_Perspective;
      document.getElementById('statusDetail').textContent = project.Project_Status;

       // Change "Superclass Spotlight" to CodePath script filename
      const codeFileName = project.Project_CodePath.split('/').pop();
      const codeHeader = document.querySelector(".CodeHeader");
      if (codeHeader && codeHeader.childNodes.length > 0) {
        codeHeader.childNodes[0].textContent = `${codeFileName} `;
      }

      // Load and display the code from the CodePath
      const codeBlock = document.getElementById('codeBlock');
      fetch(project.CodePath)
        .then(response => {
          if (!response.ok) {
            throw new Error('Code file not found.');
          }
          return response.text();
        })
        .then(code => {
          codeBlock.textContent = code;
          hljs.highlightElement(codeBlock);
        })
      .catch(error => {
        codeBlock.textContent = "// Failed to load code: " + error.message;
      });

      document.getElementById('RecapDetail').textContent = project.Recap;
    })
    // Log any errors that occur during the fetch or processing
    .catch(error => console.error('Error loading project details:', error));
});

// Toggle button to show code
let codeLoaded = false;
function toggleCode() {
  const codeContent = document.getElementById("codeContent");
  const toggleBtn = document.getElementById("toggleBtn");
  const codeBlock = document.getElementById("codeBlock");
  const isExpanded = codeContent.classList.toggle("expanded");

  toggleBtn.textContent = isExpanded ? "Hide Code ▲" : "Show Code ▼";
}