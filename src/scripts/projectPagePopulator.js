// Wait for the DOM to be fully loaded before executing the script
document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const projectId = params.get('id');

  if (!projectId) {
    console.error("No project ID in URL.");
    return;
  }

  fetch('/src/data/personalProjects.json')
    .then(response => response.json())
    .then(projects => {
      const project = projects.find(p => p.Project_ID === projectId);
      if (!project) {
        console.error("Project not found.");
        return;
      }

      /*
      document.title = project.Project_Title;
      document.getElementById('projectTitle').textContent = project.Project_Title;

      // Game Info Details
      document.getElementById('roleDetail').textContent = project.Project_Role;
      document.getElementById('sizeDetail').textContent = project.Project_TeamSize;
      document.getElementById('timeDetail').textContent = project.Project_DevelopmentTime;
      document.getElementById('engineDetail').textContent = project.Project_Engine;
      document.getElementById('languageDetail').textContent = project.Project_Language;
      document.getElementById('platformDetail').textContent = project.Project_Platform;
      document.getElementById('genreDetail').textContent = project.Project_Genre;
      document.getElementById('perspectiveDetail').textContent = project.Project_Perspective;
      document.getElementById('statusDetail').textContent = project.Project_Status;
      */

      // Populate concept & overview section
      document.getElementById('projectContext').textContent = project.Project_ProjectContext;

      // Populate prototype section
      document.getElementById('prototypeContext').textContent = project.Project_PrototypeContext;
      const prototypeVideo = document.querySelectorAll('video')[0]; // First video
      if (prototypeVideo && project.Project_PrototypeVideoPath) {
        prototypeVideo.querySelector('source').src = project.Project_PrototypeVideoPath;
        prototypeVideo.load();
      }

      // Populate final showcase section
      document.getElementById('finalShowcaseContext').textContent = project.Project_FinalContext;
      const finalVideo = document.querySelectorAll('video')[1]; // Second video
      if (finalVideo && project.Project_FinalVideoPath) {
        finalVideo.querySelector('source').src = project.Project_FinalVideoPath;
        finalVideo.load();
      }

      // Populate technical feature / superclass code
      const codeFileName = project.Project_CodePath?.split('/').pop() || "Code Sample";
      const codeHeader = document.querySelector(".codeHeader");
      if (codeHeader && codeHeader.childNodes.length > 0) {
        codeHeader.childNodes[0].textContent = `${codeFileName} `;
      }

      const codeBlock = document.getElementById('codeBlock');
      fetch(project.Project_CodePath)
        .then(response => {
          if (!response.ok) throw new Error('Code file not found.');
          return response.text();
        })
        .then(code => {
          codeBlock.textContent = code;
          hljs.highlightElement(codeBlock);
        })
        .catch(error => {
          codeBlock.textContent = "// Failed to load code: " + error.message;
        });

      // Populate code context (optional if you use this)
      if (document.getElementById('technicalCodeContext') && project.Project_SuperClass) {
        document.getElementById('technicalCodeContext').textContent = project.Project_SuperClass;
      }

      // Recap section
      document.getElementById('recapContext').textContent = project.Project_RecapContext;
    })
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

// Toggle button to show/hide video
function toggleVideo(headerElement) {
  const videoContent = headerElement.nextElementSibling;
  const toggleBtn = headerElement.querySelector(".ToggleBtn");
  const videoElement = videoContent.querySelector("video");
  const isExpanded = videoContent.classList.toggle("expanded");

  toggleBtn.textContent = isExpanded ? "Hide Video ▲" : "Show Video ▼";

  if (!isExpanded && videoElement && !videoElement.paused) {
    videoElement.pause();
  }
}