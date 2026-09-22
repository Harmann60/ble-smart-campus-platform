import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_BASE from '../api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post(`${API_BASE}/api/auth/login`, {
        email,
        password
      });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);

      navigate('/dashboard');

    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed');
    }
  };

  return (
      // 1. Replaced 'bg-gray-900' with 'bg-campus-bg' so it adapts to theme
      <div className="min-h-screen flex items-center justify-center bg-campus-bg transition-colors duration-300 font-sans">

        {/* 2. Replaced 'bg-white' with 'bg-campus-card' and added dynamic border */}
        <div className="bg-campus-card p-8 rounded-2xl shadow-xl w-96 border border-campus-border transition-colors duration-300">

          {/* 3. Text colors changed to 'text-campus-text' */}
          <h2 className="text-3xl font-extrabold text-center text-campus-text mb-8">Admin Login</h2>

          {error && <div className="bg-red-100 text-red-700 p-3 rounded-xl mb-6 text-sm font-bold text-center">{error}</div>}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-campus-secondary text-xs font-bold uppercase mb-2">Email</label>
              {/* 4. Inputs now use 'bg-campus-bg' so they are visible in Dark Mode */}
              <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-campus-bg border border-campus-border rounded-xl text-campus-text outline-none focus:border-campus-primary transition-all"
                  placeholder="admin@college.edu"
                  required
              />
            </div>

            <div>
              <label className="block text-campus-secondary text-xs font-bold uppercase mb-2">Password</label>
              <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-campus-bg border border-campus-border rounded-xl text-campus-text outline-none focus:border-campus-primary transition-all"
                  placeholder="********"
                  required
              />
            </div>

            <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition duration-200 shadow-lg"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
  );
};

export default Login;