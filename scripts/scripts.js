document.addEventListener('DOMContentLoaded', function() {
  const csvFilePath = "kaggle_poem_dataset.csv";
  let csvData = []; 

  fetch(csvFilePath)
    .then(response => response.text())
    .then(csvText => {
      Papa.parse(csvText, {
        header: true,
        complete: function(results) {
          csvData = results.data;
          document.getElementById("find-poem-click").addEventListener("click", function() {
            const poemName = document.getElementById('poem-search-input').value.toLowerCase();
            const foundPoem = csvData.find(entry => entry['Title'].toLowerCase().includes(poemName));
            if (!foundPoem) {
              displayNotFoundMessage();
            } else {
              displayPoem({
                title: foundPoem['Title'],
                author: foundPoem['Author'],
                content: foundPoem['Content']
              });
            }
          });
        }
      });
    })
    .catch(error => console.error("Error loading CSV file:", error));

  document.addEventListener('click', function(e) {
    if (e.target && e.target.id === 'clear-saved-poems') {
      localStorage.removeItem("savedPoems"); 
      displaySavedPoems(); 
    }
  });

  displaySavedPoems();
});

function displayNotFoundMessage() {
  const displayArea = document.getElementById('poem-display-area');
  displayArea.innerHTML = "<p>Poem not found. Try another search!</p>";
  displayArea.style.display = 'block'; 
}

function displayPoem(poem) {
  const displayArea = document.getElementById('poem-display-area');
  displayArea.innerHTML = `
      <h2>${poem.title}</h2>
      <p>${poem.author}</p>
      <pre>${poem.content}</pre>
      <button id="save-poem" class="btn btn-primary">Save Title</button>
  `;

  $('#poemModal').modal('show');

  const saveButton = document.getElementById('save-poem');
  saveButton.removeEventListener('click', savePoemHandler);

  function savePoemHandler() {
      savePoemTitle(poem.title, poem.author);
      displaySavedPoems();
  }

  saveButton.addEventListener('click', savePoemHandler);
}

function savePoemTitle(title, author) {
  let savedPoems = localStorage.getItem('savedPoems');
  savedPoems = savedPoems ? JSON.parse(savedPoems) : [];
  savedPoems.push({ title, author });
  localStorage.setItem('savedPoems', JSON.stringify(savedPoems));
  
  alert("Poem saved!");
}

function displaySavedPoems() {
  const savedPoems = JSON.parse(localStorage.getItem('savedPoems') || '[]');
  const displayArea = document.getElementById('saved-titles-display-area');
  if (savedPoems.length === 0) {
      displayArea.innerHTML = "No saved poems.";
      return;
  }
  const poemsList = savedPoems.map(poem => `<li>${poem.title} by ${poem.author}</li>`).join('');
  displayArea.innerHTML = `<ul>${poemsList}</ul>`;
}

function closePoemDisplay() {
  const displayArea = document.getElementById('poem-display-area');
  displayArea.style.display = 'none'; 
}
