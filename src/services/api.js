const API_KEY = 'cbbff4e0-dc44-4106-9e43-2b54667ea532';
const BASE_URL = 'https://data.solanatracker.io';
const WS_URL = 'wss://datastream.solanatracker.io/69826d9e-88f4-4d38-ba1e-88a16bfaa362';

const headers = {
  'x-api-key': API_KEY,
  'Content-Type': 'application/json'
};

export const createWebSocketConnection = () => {
  const ws = new WebSocket(WS_URL);
  
  ws.onopen = () => {
    console.log('WebSocket Connected');
    // Subscribe to real-time updates
    ws.send(JSON.stringify({
      type: 'subscribe',
      channel: 'tokens'
    }));
  };

  return ws;
};

export const fetchGraduatedTokens = async () => {
  try {
    const response = await fetch(`${BASE_URL}/tokens/multi/graduated`, {
      headers,
      method: 'GET'
    });
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching graduated tokens:', error);
    throw error;
  }
};

export const fetchTrendingTokens = async () => {
  try {
    const response = await fetch(`${BASE_URL}/tokens/trending`, {
      headers,
      method: 'GET'
    });
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching trending tokens:', error);
    throw error;
  }
};

// Add real-time price updates
export const subscribeToTokenUpdates = (token, callback) => {
  const ws = createWebSocketConnection();
  
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    callback(data);
  };

  return () => {
    ws.close();
  };
}; 