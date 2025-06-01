// components/StudentForm.jsx
import React, { useState, useEffect } from 'react';
import { db, storage, auth } from '../firebase';
import { doc, addDoc, collection, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

export default function StudentForm({ isEdit, studentId, defaultData, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    grade: '',
    school: '',
    subject: '',
    hashtags: [],
    photoFile: null,
    photoURL: '',
  });

  const [hashtagInput, setHashtagInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (defaultData) {
      setFormData(prev => ({
        ...prev,
        ...defaultData,
        hashtags: defaultData.hashtags || [],
      }));
    }
  }, [defaultData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleHashtagKeyDown = (e) => {
    if (e.key === 'Enter' && hashtagInput.trim()) {
      e.preventDefault();
      setFormData(prev => ({
        ...prev,
        hashtags: [...prev.hashtags, hashtagInput.trim()],
      }));
      setHashtagInput('');
    }
  };

  const handleRemoveHashtag = (index) => {
    const newTags = [...formData.hashtags];
    newTags.splice(index, 1);
    setFormData(prev => ({ ...prev, hashtags: newTags }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, photoFile: file }));
    }
  };

  const handleSave = async () => {
    setLoading(true);
    const userId = auth.currentUser.uid;
    let photoURL = formData.photoURL;

    if (formData.photoFile) {
      const fileRef = ref(storage, `users/${userId}/students/${uuidv4()}`);
      await uploadBytes(fileRef, formData.photoFile);
      photoURL = await getDownloadURL(fileRef);
    }

    const studentData = {
      name: formData.name,
      grade: formData.grade,
      school: formData.school,
      subject: formData.subject,
      hashtags: formData.hashtags,
      photoURL: photoURL || '',
      classRecords: defaultData?.classRecords || [],
      scores: defaultData?.scores || [],
      parents: defaultData?.parents || [],
    };

    const studentRef = collection(db, 'users', userId, 'students');

    try {
      if (isEdit) {
        await setDoc(doc(studentRef, studentId), studentData);
      } else {
        await addDoc(studentRef, studentData);
      }
      onSuccess();
    } catch (error) {
      console.error('儲存錯誤:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow space-y-4">
      <h2 className="text-lg font-semibold">{isEdit ? '編輯學生' : '新增學生'}</h2>

      {/* 上傳頭像 */}
      <div>
        <label>學生照片：</label>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {formData.photoURL && <img src={formData.photoURL} alt="student" className="w-24 mt-2" />}
      </div>

      {/* 基本欄位 */}
      <div>
        <label>姓名：</label>
        <input name="name" value={formData.name} onChange={handleChange} className="border p-1 w-full" />
      </div>

      <div>
        <label>年級：</label>
        <input name="grade" value={formData.grade} onChange={handleChange} className="border p-1 w-full" />
      </div>

      <div>
        <label>學校：</label>
        <input name="school" value={formData.school} onChange={handleChange} className="border p-1 w-full" />
      </div>

      <div>
        <label>科目：</label>
        <input name="subject" value={formData.subject} onChange={handleChange} className="border p-1 w-full" />
      </div>

      {/* Hashtag */}
      <div>
        <label>學生個性 Hashtag：</label>
        <div className="flex flex-wrap gap-2 my-2">
          {formData.hashtags.map((tag, index) => (
            <span
              key={index}
              className="bg-blue-100 px-2 py-1 rounded text-sm cursor-pointer"
              onClick={() => handleRemoveHashtag(index)}
            >
              #{tag} ✕
            </span>
          ))}
        </div>
        <input
          placeholder="輸入後按 Enter 新增"
          value={hashtagInput}
          onChange={(e) => setHashtagInput(e.target.value)}
          onKeyDown={handleHashtagKeyDown}
          className="border p-1 w-full"
        />
      </div>

      <button
        onClick={handleSave}
        className="bg-teal-600 text-white px-4 py-2 rounded mt-4"
        disabled={loading}
      >
        {loading ? '儲存中...' : '儲存'}
      </button>
    </div>
  );
}

