import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Search } from 'lucide-react';

const Login = () => {
  const { user, loginWithProvider, clearError } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      console.log('✅ User already logged in, redirecting to dashboard...');
      window.location.href = '/dashboard';
    }
  }, [user]);

  const handleProviderLogin = (provider) => {
    console.log(`🔄 Initiating ${provider} login...`);
    clearError();
    loginWithProvider(provider);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-white p-3 rounded-full">
                <Search className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Image Search</h1>
            <p className="text-blue-100">Discover and search millions of high-quality images</p>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Welcome</h2>
              <p className="text-gray-600">Sign in to start searching images</p>
            </div>

            {/* OAuth Buttons */}
            <div className="space-y-4">
              <button
                onClick={() => handleProviderLogin('google')}
                className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200"
              >
                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                Continue with Google
              </button>

              <button
                onClick={() => handleProviderLogin('facebook')}
                className="w-full flex items-center justify-center gap-3 bg-blue-600 text-white rounded-lg px-4 py-3 hover:bg-blue-700 transition-colors duration-200"
              >
                <img src="https://www.facebook.com/favicon.ico" alt="Facebook" className="w-5 h-5" />
                Continue with Facebook
              </button>

              <button
                onClick={() => handleProviderLogin('github')}
                className="w-full flex items-center justify-center gap-3 bg-gray-800 text-white rounded-lg px-4 py-3 hover:bg-gray-900 transition-colors duration-200"
              >
                <img src="https://github.com/favicon.ico" alt="GitHub" className="w-5 h-5" />
                Continue with GitHub
              </button>
            </div>

            {/* Features */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Features:</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center gap-3">
                  <Search className="h-5 w-5 text-green-500" />
                  Search millions of high-quality images
                </li>
                <li className="flex items-center gap-3">
                  <div className="h-5 w-5 text-blue-500">⭐</div>
                  Save your favorite searches
                </li>
                <li className="flex items-center gap-3">
                  <div className="h-5 w-5 text-purple-500">📊</div>
                  See popular search trends
                </li>
                <li className="flex items-center gap-3">
                  <div className="h-5 w-5 text-orange-500">✅</div>
                  Multi-select and download images
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-gray-500 text-sm">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;