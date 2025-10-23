import { useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const { setUser} = useAuth();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const res = await api.post('/auth/login', { email, password });
      setMessage(res.data.message || 'Login successful!');
      setUser(res.data.user);
      setTimeout(() => { navigate('/') }, 500);
    } catch (err) {
      if(err.response) setMessage(err.response.data.message);
      else setMessage('Server error');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mt-10">
      <h2 className="text-3xl font-bold mb-6">Login</h2>
      <form 
        onSubmit={handleSubmit} 
        className="flex flex-col gap-4 w-80 p-6 bg-gray-100 rounded-lg shadow-md"
      >
        <input 
          type="email" 
          placeholder="Email" 
          className="p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input 
          type="password" 
          placeholder="Password" 
          className="p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button 
          type="submit" 
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Login
        </button>
        {message && <p className="text-center text-red-600">{message}</p>}
      </form>
    </div>
  );
};

export default Login;
