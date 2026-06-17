import { useState } from "react";
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      const res = await api.post('/auth/signup', {name, email, password, role});
      setMessage(res.data.message, 'Login to proceed');
      setTimeout(() => { navigate('/login') }, 500);
    } catch(err){
      setMessage(err.response?.data?.message || "Server Error")
    }
  }


  return (
    <div className="flex flex-col justify-center items-center mt-16 px-4">
      <form onSubmit={handleSubmit} className="bg-white flex flex-col w-full max-w-sm gap-4 p-8 rounded-2xl shadow-xl border border-slate-100">
        <h1 className="text-3xl font-extrabold text-slate-800 text-center mb-2">Create account</h1>
        <input className="px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e)=> setName(e.target.value)}
          required
        />
        <input className="px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e)=> setEmail(e.target.value)}
          required
        />
        <input className="px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e)=> setPassword(e.target.value)}
          required
        />
        <select
          className="px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
          value={role}
          onChange={(e)=>setRole(e.target.value)}
          required
        >
          <option value="">Select role</option>
          <option value="user">User</option>
          <option value="seller">Seller</option>
        </select>
        <button type="submit" className="bg-indigo-600 text-white font-semibold py-2.5 rounded-xl hover:bg-indigo-700 active:scale-95 transition shadow-sm">Signup</button>
        {message && <p className="text-rose-600 text-sm text-center">{message}</p>}
      </form>
    </div>
  );
};

export default Signup;
