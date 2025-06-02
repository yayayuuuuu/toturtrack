import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function HamburgerMenu() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* 漢堡按鈕 */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed top-4 left-4 z-50 text-gray-800 bg-white p-2 rounded-md shadow-md"
      >
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* 側邊選單 */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-white z-40 transition-transform duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 text-lg font-bold border-b border-gray-700"></div>
        <ul className="flex flex-col p-4 space-y-4 pt-15">
          <li>
            <Link
              to="/calendar"
              onClick={() => setOpen(false)}
              className="hover:text-yellow-300"
            >
              行事曆
            </Link>
          </li>
          <li>
            <Link
              to="/students"
              onClick={() => setOpen(false)}
              className="hover:text-yellow-300"
            >
              學生列表
            </Link>
          </li>
        </ul>
      </div>

      {/* 背景遮罩（點擊可關閉） */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 z-30"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}
