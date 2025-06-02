// components/StudentCard.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function StudentCard({ student }) {
  const navigate = useNavigate();
  const [hover, setHover] = useState(false);

  return (
    <div className="flex bg-white shadow p-4 rounded-md items-center justify-between">
      <div className="flex items-center space-x-4">
        <img
          src={student.photoURL || 'https://via.placeholder.com/50'}
          className="w-12 h-12 rounded-full"
          alt="avatar"
        />
        <div>
          <div className="font-semibold">{student.name}</div>
          <div className="text-sm">年級：{student.grade}</div>
          <div className="text-sm">學校：{student.school}</div>
          <div className="text-sm">科目：{student.subject}</div>
        </div>
      </div>
      <button
        style={{
          backgroundColor: hover ? 'white' : '#228991',
          color: hover ? '#228991' : 'white',
          border: '1px solid #228991',
        }}
        className="px-3 py-1 rounded transition-colors duration-200"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={() => navigate(`/edit-student/${student.id}`)}
      >
        詳細檔案
      </button>
    </div>
  );
}
