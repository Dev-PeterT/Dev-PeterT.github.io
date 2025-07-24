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

      document.title = project.Project_Title;

      const logoImg = document.getElementById('gameLogoImg');
      if (project.Project_IconPath && logoImg) {
        logoImg.src = project.Project_IconPath;
        logoImg.alt = `${project.Project_Title} Logo`;
      }

      // Game Info Details
      document.getElementById('roleDetail').textContent = project.Project_Role;
      document.getElementById('teamSizeDetail').textContent = project.Project_TeamSize;
      document.getElementById('devTimeDetail').textContent = project.Project_DevelopmentTime;
      document.getElementById('engineDetail').textContent = project.Project_Engine;
      document.getElementById('statusDetail').textContent = project.Project_Status;

      // Concept & Overview
      document.getElementById('projectContext').innerHTML = project.Project_ProjectContext;

      // Prototype section
      document.getElementById('prototypeContext').innerHTML = project.Project_PrototypeContext;
      const prototypeVideo = document.querySelectorAll('video')[0];
      if (prototypeVideo && project.Project_PrototypeVideoPath) {
        prototypeVideo.querySelector('source').src = project.Project_PrototypeVideoPath;
        prototypeVideo.load();
      }

      // Final showcase section
      document.getElementById('finalShowcaseContext').innerHTML = project.Project_FinalContext;
      const finalVideo = document.querySelectorAll('video')[1];
      if (finalVideo && project.Project_FinalVideoPath) {
        finalVideo.querySelector('source').src = project.Project_FinalVideoPath;
        finalVideo.load();
      }

      // Superclass code block
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

      // Technical context
      const technicalContext = document.getElementById('technicalCodeContext');
      if (document.getElementById('technicalCodeContext') && project.Project_SuperClass) {
        document.getElementById('technicalCodeContext').innerHTML = project.Project_SuperClass;
      
        const linkContainer = document.getElementById('superclassLinkContainer');
        if (linkContainer && project.Project_CodeLink) {
          const link = document.createElement('a');
          link.href = project.Project_CodeLink;
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          link.className = 'superclassLink'; // For styling
          link.textContent = 'View Full Source on GitHub';

          linkContainer.appendChild(link);
        }
      }

      // Recap
      document.getElementById('recapContext').innerHTML = project.Project_RecapContext;

      // Platform Icons for Download Section 
      const containers = ['platformIconsDesktop', 'platformIconsMobile'];
      containers.forEach(id => {
        const container = document.getElementById(id);
        if (container && project.Project_Availability?.length > 0) {
          project.Project_Availability.forEach(platform => {
            const link = document.createElement('a');
            link.href = platform.Link;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';

            const img = document.createElement('img');
            img.src = `/public/images/Logos/${platform.Platform}.png`;
            img.alt = platform.Platform;

            link.appendChild(img);
            container.appendChild(link);
          });
        }
      });
    })
    .catch(error => console.error('Error loading project details:', error));
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
