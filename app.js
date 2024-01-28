// Updated events section
const COHORT = "2311-FSA-ET-WEB-PT-SF";
const API_URL_EVENTS = `https://fsa-async-await.herokuapp.com/api/${COHORT}/events`;

const stateEvents = {
  parties: [],
};

const partyList = document.querySelector("#partyList");

const addPartyForm = document.querySelector("#addParty");
addPartyForm.addEventListener("submit", addParty);

/**
 * Fetch parties and render on page load
 */
async function fetchParties() {
  try {
    // Fetch parties
    const events = await fetchData(API_URL_EVENTS);

    // Update state with fetched parties
    stateEvents.parties = events.parties || [];

    // Render parties
    renderPartiesList();
  } catch (error) {
    console.error('Error fetching events:', error);
  }
}

/**
 * Generic function to fetch data from an API
 * @param {string} endpoint - API endpoint to fetch data from
 * @param {string} method - HTTP method (default: 'GET')
 * @param {Object} body - Request body for POST requests
 * @returns {Promise<Object>} - JSON response from the API
 */
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

/**
 * Render parties from state
 */
function renderPartiesList() {
  if (!stateEvents.parties.length) {
    partyList.innerHTML = "<li>No parties.</li>";
    return;
  }

  const partyElements = stateEvents.parties.map((party) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <p>Name: ${party.name}</p>
      <p>Date: ${party.date}</p>
      <p>Time: ${party.time}</p>
      <p>Location: ${party.location}</p>
      <p>Description: ${party.description}</p>
      <button onclick="deleteParty(${party.id})">Delete</button>
    `;
    return li;
  });

  partyList.replaceChildren(...partyElements);
}

async function deleteParty(partyId) {
  try {
    const response = await fetch(`${API_URL_EVENTS}/${partyId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete party');
    }

    renderParties();
  } catch (error) {
    console.error('Error deleting party:', error);
  }
}

/**
 * Ask the API to create a new party based on form data
 * @param {Event} event
 */
async function addParty(event) {
  event.preventDefault();

  const partyData = {
    name: addPartyForm.name.value,
    date: new Date(addPartyForm.date.value),
    time: addPartyForm.time.value,
    location: addPartyForm.location.value,
    description: addPartyForm.description.value,
  };

  try {
    const response = await fetch(API_URL_EVENTS, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(partyData),
    });

    if (!response.ok) {
      throw new Error("Failed to create party");
    }

    renderParties();
  } catch (error) {
    console.error('Error adding party:', error);
  }
}

document.addEventListener('DOMContentLoaded', fetchParties);

