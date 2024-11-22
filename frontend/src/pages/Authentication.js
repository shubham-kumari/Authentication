import { json, redirect } from 'react-router-dom';
import AuthForm from '../components/AuthForm';

function AuthenticationPage() {
  return <AuthForm />;
}

export default AuthenticationPage;

export async function action({ request }) {
  const searchParams = new URL(request.url).searchParams;
  const mode = searchParams.get('mode') || 'login';

  // Validate mode
  if (mode !== 'login' && mode !== 'signup') {
    throw json({ message: 'Unsupported mode' }, { status: 422 });
  }

  // Retrieve form data
  const data = await request.formData();
  const authData = {
    email: data.get('email'),
    password: data.get('password'),
  };

  console.log('Auth Data:', authData); // Debugging

 
    // Perform the API request
    const response = await fetch(`http://localhost:8080/${mode}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(authData),
    });
    console.log('Auth Data:', authData);
    
    // console.log('API Response:', responseBody, 'Status:', response.status); // Debugging

    // Handle specific error responses
    if (response.status === 422 || response.status === 401) {
      return response; // Pass the response back for client-side handling
    }

    // Handle general errors
    if (!response.ok) {
      throw json({ message: 'Could not authenticate user.' }, { status: 500 });
    }

    const resData = await response.json();
    const token = resData.token;
    localStorage.setItem('token', token)
    const expiration = new Date();
    expiration.setHours(expiration.getHours + 1);
    localStorage.setItem('expiration', expiration.toISOString())
    // Redirect on success
    return redirect('/');
  
}
