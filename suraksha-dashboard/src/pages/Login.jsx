import { useState } from 'react';
import { login } from '../api';

const Login = ({ setToken }) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(phone, password);
      // Backend should enforce role Check, but we can do it here too just in case
      if (res.data.role !== 'police' && res.data.role !== 'admin') {
        setError('Unauthorized access');
        return;
      }
      localStorage.setItem('policeToken', res.data.token);
      setToken(res.data.token);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-darkNavy flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          Suraksha Police Dispatch
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-policeBlue py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && <div className="text-red-500 text-sm text-center">{error}</div>}
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Operator Phone Number
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-policeAccent focus:border-policeAccent sm:text-sm bg-darkNavy text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">
                Dispatch Pin / Password
              </label>
              <div className="mt-1">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-policeAccent focus:border-policeAccent sm:text-sm bg-darkNavy text-white"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Sign in to Dispatch
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
