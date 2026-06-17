import { useState } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
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
    <div className="flex flex-col items-center justify-center mt-16 px-4">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-full max-w-sm p-8 bg-white rounded-2xl shadow-xl border border-slate-100"
      >
        <h2 className="text-3xl font-extrabold text-slate-800 text-center mb-2">Welcome back</h2>
        <input
          type="email"
          placeholder="Email"
          className="px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white font-semibold py-2.5 rounded-xl hover:bg-indigo-700 active:scale-95 transition shadow-sm"
        >
          Login
        </button>
        {message && <p className="text-center text-rose-600 text-sm">{message}</p>}
      </form>
    </div>
  );
};

export default Login;
