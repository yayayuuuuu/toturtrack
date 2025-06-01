// pages/StudentFormPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StudentForm from '../components/StudentForm';
import { db, auth } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function StudentFormPage() {
  const { id } = useParams();
  const [defaultData, setDefaultData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    const fetchStudent = async () => {
      const ref = doc(db, 'users', auth.currentUser.uid, 'students', id);
      const snapshot = await getDoc(ref);
      if (snapshot.exists()) {
        setDefaultData(snapshot.data());
      }
    };
    fetchStudent();
  }, [id]);

  return (
    <div className="p-4">
      <StudentForm
        isEdit={!!id}
        studentId={id}
        defaultData={defaultData}
        onSuccess={() => navigate('/')}
      />
    </div>
  );
}
