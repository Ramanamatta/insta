import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, PlusSquare, Play, User } from 'lucide-react';
import useAuthStore from '../just/authStore.js';
import CreatePost from './CreatePost.jsx';

const MobileBottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const [openCreatePost, setOpenCreatePost] = useState(false);

  const bottomNavItems = [
    { icon: Home, text: 'Home', path: '/' },
    { icon: ShoppingBag, text: 'Products', path: '/all-products' },
    { icon: PlusSquare, text: 'Create', path: '/create' },
    { icon: Play, text: 'Reels', path: '/reels' },
    { icon: User, text: 'Profile', path: `/profile/${user?._id}` },
  ];

  const handleNavigation = (item) => {
    if (item.text === 'Create') {
      setOpenCreatePost(true);
      return;
    }
    navigate(item.path);
  };

  return (
    <>
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2 z-40">
        <div className="flex justify-around items-center">
          {bottomNavItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <button
                key={index}
                onClick={() => handleNavigation(item)}
                className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                  isActive 
                    ? 'text-black' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon size={24} />
                <span className="text-xs mt-1">{item.text}</span>
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Create Post Modal */}
      <CreatePost open={openCreatePost} setOpen={setOpenCreatePost} />
    </>
  );
};

export default MobileBottomNav;