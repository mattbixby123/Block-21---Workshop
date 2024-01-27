// app.js file is needed for handling the logic and interacting with the API

 // Move the contents of api.js here
async function fetchData(endpoint, method = 'GET', body = null) {
  const config = await fetchConfig();
  const url = `${config.baseUrl}${endpoint}`;

  try {
    const response = await fetch(url, {
      method,
      headers: config.headers,
      body: body ? JSON.stringify(body) : null,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

async function fetchConfig() {
  try {
    const response = await fetch('config.json');
    return await response.json();
  } catch (error) {
    console.error('Error fetching config:', error);
    throw error;
  }
}

// contents of api.js end and app.js start (but theyre being combined into one file)

document.addEventListener('DOMContentLoaded', () => {
  // Fetch parties and render on page load
  fetchParties();

  // Add event listener for form submission
  document.getElementById('partyForm').addEventListener('submit', addParty);
});

async function fetchParties() {
  try {
      // Use Fetch to GET party data from the API
      const response = await fetch('/events');
      const parties = await response.json();

      // Render parties on the page
      renderParties(parties);
  } catch (error) {
      console.error('Error fetching parties:', error);
  }
}

function renderParties(parties) {
  // Render each party on the page
  const partyList = document.getElementById('partyList');
  partyList.innerHTML = '';

  parties.forEach(party => {
      const partyElement = document.createElement('div');
      partyElement.innerHTML = `
          <p>Name: ${party.name}</p>
          <p>Date: ${party.date}</p>
          <p>Time: ${party.time}</p>
          <p>Location: ${party.location}</p>
          <p>Description: ${party.description}</p>
          <button onclick="deleteParty(${party.id})">Delete</button>
      `;
      partyList.appendChild(partyElement);
  });
}

async function addParty(event) {
  event.preventDefault();

  // Extract party details from the form
  const partyData = {
      name: document.getElementById('name').value,
      date: document.getElementById('date').value,
      time: document.getElementById('time').value,
      location: document.getElementById('location').value,
      description: document.getElementById('description').value,
  };

  try {
      // Use Fetch to POST a new party to the API
      const response = await fetch('/events', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(partyData),
      });

      // Refresh the list of parties after adding a new one
      fetchParties();
  } catch (error) {
      console.error('Error adding party:', error);
  }
}

async function deleteParty(partyId) {
  try {
      // Use Fetch to DELETE a party from the API
      await fetch(`/events/${partyId}`, {
          method: 'DELETE',
      });

      // Refresh the list of parties after deleting one
      fetchParties();
  } catch (error) {
      console.error('Error deleting party:', error);
  }
}

