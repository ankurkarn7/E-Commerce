import { useState } from "react";
import api from '../services/api';
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
      setMessage("Server Error")
    }
  }


  return (
    <div className="flex flex-col justify-center items-center mt-10">
      <h1 className="text-3xl mb-6 font-bold">Signup</h1>
      <form onSubmit={handleSubmit} className="bg-gray-100 flex flex-col w-80 gap-4 p-6 rounded-lg shadow-md">
        <input className="p-2 border rounded"
          type="text"
          placeholder="name"
          value={name}
          onChange={(e)=> setName(e.target.value)}
          required
        />
        <input className="p-2 border rounded"
          type="email"
          placeholder="email"
          value={email}
          onChange={(e)=> setEmail(e.target.value)}
          required
        />
        <input className="p-2 border rounded"
          type="password"
          placeholder="password"
          value={password}
          onChange={(e)=> setPassword(e.target.value)}
          required
        />
        <select
          className="p-2 border rounded"
          value={role}
          onChange={(e)=>setRole(e.target.value)}
          required
        >
          <option value="">Select role</option>
          <option value="user">User</option>
          <option value="seller">Seller</option>
        </select>
        <button type="submit" className="bg-blue px-2 bg-blue-500 p-2 rounded">Signup</button>
        {message && <p className="text-red-500 text-center">{message}</p>}
      </form>
    </div>
  );
};

export default Signup;
