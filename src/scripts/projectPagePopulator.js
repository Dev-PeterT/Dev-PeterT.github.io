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
      const videoWrapper = document.querySelector('.videoWrapper');
      const videoElement = videoWrapper.querySelector('video');

      if (project.Project_PrototypeVideoPath) {
        const path = project.Project_PrototypeVideoPath;

        // Detect YouTube links
        const youtubeMatch = path.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);

        if (youtubeMatch) {
          // It's a YouTube link → replace <video> with <iframe>
          const videoId = youtubeMatch[1];
          const iframe = document.createElement('iframe');
          iframe.width = "100%";
          iframe.height = "100%";
          iframe.src = `https://www.youtube.com/embed/${videoId}`;
          iframe.title = "YouTube video player";
          iframe.frameBorder = "0";
          iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
          iframe.allowFullscreen = true;

          // Hide the <video> and append iframe
          videoElement.style.display = "none";
          videoWrapper.appendChild(iframe);

        } else {
          // It's a direct video file → use <video>
          videoElement.style.display = "block";
          videoElement.querySelector('source').src = path;
          videoElement.load();
        }
      }

      // Final showcase section
      document.getElementById('finalShowcaseContext').innerHTML = project.Project_FinalContext;
      const finalVideoWrapper = document.querySelectorAll('.videoWrapper')[1]; // assuming the wrapper matches your HTML structure
      const finalVideo = finalVideoWrapper.querySelector('video');

      if (finalVideo && project.Project_FinalVideoPath) {
        const path = project.Project_FinalVideoPath;

        // Detect YouTube links
        const youtubeMatch = path.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);

        if (youtubeMatch) {
          // It's a YouTube link → create an iframe
          const videoId = youtubeMatch[1];
          const iframe = document.createElement('iframe');
          iframe.width = "100%";
          iframe.height = "500px"; // adjust height as needed
          iframe.src = `https://www.youtube.com/embed/${videoId}`;
          iframe.title = "YouTube video player";
          iframe.frameBorder = "0";
          iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
          iframe.allowFullscreen = true;

          // Hide the <video> and append iframe
          finalVideo.style.display = "none";
          finalVideoWrapper.appendChild(iframe);

        } else {
          // It's a direct video file → use <video>
          finalVideo.style.display = "block";
          finalVideo.querySelector('source').src = path;
          finalVideo.load();
        }
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
