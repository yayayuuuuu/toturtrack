// pages/StudentListPage.jsx
import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import StudentCard from '../components/StudentCard';

export default function StudentListPage() {
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();
  const userId = auth.currentUser.uid;

  useEffect(() => {
    const fetchStudents = async () => {
      const studentRef = collection(db, 'users', userId, 'students');
      const snapshot = await getDocs(studentRef);
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setStudents(list);
    };
    fetchStudents();
  }, [userId]);

  return (
    <div className="p-4">
      <button
        className="bg-teal-600 text-white px-4 py-2 rounded"
        onClick={() => navigate('/add-student')}
      >
        ＋ 新增學生
      </button>

      <div className="mt-4 space-y-4">
        {students.map(student => (
          <StudentCard key={student.id} student={student} />
        ))}
      </div>
    </div>
  );
}
