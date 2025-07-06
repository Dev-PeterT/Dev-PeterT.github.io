// Wait for the DOM to be fully loaded before executing the script
document.addEventListener('DOMContentLoaded', () => {
  // Fetch the list of personal projects from the JSON file
  fetch('/src/data/personalProjects.json')
    .then(response => {
      // Check if the HTTP response is successful
      if (!response.ok) {
        // Throw an error if the response status is not OK (e.g., 404, 500)
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      // Parse and return the JSON body of the response
      return response.json();
    })
    .then(projects => {
      // Get the container element where project entries will be displayed
      const container = document.getElementById('projectsContent');
      if (!container) {
        // If the container element is missing, throw an error
        throw new Error('ProjectsContent element not found');
      }

      // Loop through each project in the JSON array
      projects.forEach(project => {
        // Create an anchor element to wrap the project display
        const a = document.createElement('a');

        // Link to project detail page with query param
        //a.href = `/src/pages/ProjectShowcase.html?id=${project.ID}`;

        // Apply styling class
        a.className = 'projectContainer';

        // Set the inner HTML of the anchor element to include video and text
        a.innerHTML = `
          <div class="projectVideo">
            <video></video>
          </div>
          <div class="projectText">
            <h2>${project.ProjectTitle}<span class="projectArrow">&gt;</span></h2>
            <p>Test</p>
          </div>
        `;

        // Append the anchor (project card) to the container
        container.appendChild(a);
      });
    })
    // Catch and log any errors that occur during the fetch or DOM manipulation process
    .catch(error => console.error('Error loading project data:', error));
});