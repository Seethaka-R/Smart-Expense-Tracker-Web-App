import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LogOut, Wallet, User as UserIcon } from 'lucide-react';

const Navbar = () => {
  const { user, logoutUser } = useContext(AuthContext);

  if (!user) return null;

  return (
    <nav className="glass border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Branding */}
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <Wallet className="h-6 w-6" />
            </div>
            <div>
              <span className="font-extrabold text-xl bg-gradient-to-r from-indigo-400 to-blue-500 bg-clip-text text-transparent tracking-tight">
                Antigravity Pay
              </span>
              <span className="text-[10px] block text-gray-500 font-medium -mt-1 tracking-wider uppercase">
                Smart Tracker
              </span>
            </div>
          </div>

          {/* User Section */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 bg-gray-900 border border-gray-800 px-3 py-1.5 rounded-full">
              <UserIcon className="h-4 w-4 text-indigo-400" />
              <span className="text-sm font-medium text-gray-300">
                Hi, {user.name}
              </span>
            </div>

            <button
              onClick={logoutUser}
              className="flex items-center gap-2 bg-gradient-to-r from-red-500/10 to-pink-500/10 hover:from-red-500/20 hover:to-pink-500/20 text-red-400 border border-red-500/20 hover:border-red-500/40 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
