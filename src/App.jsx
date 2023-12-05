import Homepage from './pages/Homepage';
import { useState, useEffect } from 'react';
import LoadingPage from './pages/LoadingPage';
import api from './api.js';

const WS_URL = 'ws://127.0.0.1:5173';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedUser, setLoggedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [config, setConfig] = useState({
    accessToken: '',
    client: '',
    expiry: '',
    uid: '',
  });

  const ws = new WebSocket(WS_URL)

  ws.onopen = () => {
    console.log("Connected to websocket")
    ws.send(JSON.stringify(localStorage.getItem('uid')))
  }

  ws.onmessage = (message) => {
    console.log(message)
  }

  useEffect(() => {
    const accessToken = localStorage.getItem('access-token');
    const client = localStorage.getItem('client');
    const expiry = localStorage.getItem('expiry');
    const uid = localStorage.getItem('uid');

    if (accessToken && client && expiry && uid) {
      api.defaults.headers.common['access-token'] = accessToken;
      api.defaults.headers.common.client = client;
      api.defaults.headers.common.expiry = expiry;
      api.defaults.headers.common.uid = uid;

      api
        .get('http://206.189.91.54/api/v1/auth/validate_token')
        .then((response) => {
          setLoggedUser(response.data.data);
          setConfig({
            accessToken: accessToken,
            client: client,
            expiry: expiry,
            uid: uid,
          });
          setIsLoggedIn(true);
          setIsLoading(false); // Set isLoading to false after successful authentication
        })
        .catch((error) => {
          console.error(error);
          setIsLoggedIn(false);
          setLoggedUser(null);
          setIsLoading(false); // Set isLoading to false after authentication check fails
        });
    } else {
      setIsLoggedIn(false);
      setLoggedUser(null);
      setIsLoading(false); // Set isLoading to false when there are no authentication keys
    }
  }, []);

  return (
    <>
      {isLoading ? (
        <LoadingPage />
      ) : (
        <Homepage
          loggedUser={loggedUser}
          setLoggedUser={setLoggedUser}
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
        />
      )}
    </>
  );
}

export default App;