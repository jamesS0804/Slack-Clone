import CredentialsInput from '../components/CredentialsInput.jsx';
import { useState, useEffect } from 'react';
import axios from 'axios';

function CredentialsPage(props) {
  const { setIsLoggedIn, setLoggedUser } = props;
  const [credentialsLabel, setCredentialsLabel] = useState('Login');
  const [confirmPasswordShow, setConfirmPasswordShow] = useState(false);
  const [submitFunction, setSubmitFunction] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [alert, setAlert] = useState('')

  const showSignup = () => {
    if (credentialsLabel === 'Login') {
      setCredentialsLabel('Signup');
      setConfirmPasswordShow(true);
      setSubmitFunction(true);
    } else {
      setError('')
      setAlert('')
      setCredentialsLabel('Login');
      setConfirmPasswordShow(false);
      setSubmitFunction(false);
    }
  };

  async function loginUser() {
    try {
      const response = await axios.post(
        'http://206.189.91.54/api/v1/auth/sign_in',
        {
          email: username,
          password: password,
        }
      );
      const userData = response.data.data;

      if (response.status === 200) {
        setIsLoggedIn(true);
        setLoggedUser({ ...response.data.data });

        let localContacts = JSON.parse(localStorage.getItem('contacts'));

        if(localContacts) {
          const userContacts = localContacts[userData.id]
          if(!userContacts) {
            localStorage.setItem("contacts",JSON.stringify({...localContacts, [userData.id] : {} }))
          }
        } else {
          localStorage.setItem("contacts", JSON.stringify({ [userData.id] : {} }))
        }
        
        // 3422: "jose.saribong@email.com", 3466: "jsmith98@gmail.com"

        localStorage.setItem('access-token', response.headers['access-token']);
        localStorage.setItem('client', response.headers['client']);
        localStorage.setItem('expiry', response.headers['expiry']);
        localStorage.setItem('uid', response.headers['uid']);
      } else {
        setError('Invalid username or password. Please try again.'); // Set the error state
      }
    } catch (error) {
      console.error(error);
      setError('An error has occured. Please try again.'); // Set the error state
    }
  }

  async function registerUser() {
    try {
      const response = await axios.post('http://206.189.91.54/api/v1/auth/', {
        email: username,
        password: password,
        password_confirmation: confirmPassword,
      });
      console.log(response)
      setError('')
      setAlert('User registered successfully!')
    } catch (error) {
      console.error(error);
      setError('An error has occured. Please try again.'); // Set the error state
      // setError(error.response.data.errors?.full_messages[1] ?? error.response.data.errors?.full_messages[0]); // Set the error state
    }
  }

  const handleSubmitForm = (event) => {
    event.preventDefault();
    if (submitFunction === false) {
      loginUser();
    } else {
      registerUser();
    }
  };

  return (
    <div className="container-fluid w-25" style={{ marginRight: '10rem', zIndex: "2" }}>
      <div className="container">
        <div className="container-fluid d-flex flex-column justify-content-center align-items-center p-3">
          <h1 className="mb-4">{credentialsLabel}</h1>
          <form
            autoComplete="off"
            onSubmit={handleSubmitForm}
            className="container-fluid p-2 d-flex flex-column justify-content-center align-items-center gap-3"
          >
            <div className="mb-3 main-form container-fluid">
              <CredentialsInput
                name="username"
                type="email"
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="mb-3 main-form container-fluid">
              <CredentialsInput
                name="password"
                type="password"
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {confirmPasswordShow && (
              <div className="mb-3 main-form container-fluid">
                <CredentialsInput
                  name="confirm password"
                  type="password"
                  label="Confirm Password"
                  value={confirmPassword} // Bind value to state variable
                  onChange={(e) => setConfirmPassword(e.target.value)} // Update state on change
                />
              </div>
            )}
            {error ? <div className="text-danger mb-3">{error}</div> : <div className='text-success mb-3'>{alert}</div>}
            <button type="submit" className="btn btn-primary container-fluid">
              {credentialsLabel}
            </button>
            <div className="mt-3">
              {confirmPasswordShow
                ? 'Already have an account?'
                : "Don't have an account?"}{' '}
              <button
                className="btn btn-link p-0 text-btn"
                type="button"
                onClick={showSignup}
              >
                {confirmPasswordShow ? 'Login here' : 'Sign up here'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CredentialsPage;
