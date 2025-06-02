import React, { useState, useEffect } from 'react';
import { db, storage, auth } from '../firebase';
import { doc, addDoc, collection, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import "../index.css";

export default function StudentForm({ isEdit, studentId, defaultData, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    grade: '',
    school: '',
    subject: '',
    hashtags: [],
    photoFile: null,
    photoURL: '',
    classRecords: [],
    scores: [],
    parents: []
  });

  const [hashtagInput, setHashtagInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (defaultData) {
      setFormData(prev => ({
        ...prev,
        ...defaultData,
        hashtags: defaultData.hashtags || [],
        classRecords: defaultData.classRecords || [],
        scores: defaultData.scores || [],
        parents: defaultData.parents || []
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
      classRecords: formData.classRecords,
      scores: formData.scores,
      parents: formData.parents
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

  const handleArrayChange = (section, index, field, value) => {
    setFormData(prev => {
      const newArray = [...prev[section]];
      newArray[index][field] = value;
      return { ...prev, [section]: newArray };
    });
  };

  const handleAddItem = (section) => {
    const newItem =
      section === 'classRecords'
        ? { date: '', content: '' }
        : section === 'scores'
        ? { subject: '', score: '' }
        : { name: '', contact: '' };
    setFormData(prev => ({
      ...prev,
      [section]: [...prev[section], newItem]
    }));
  };

  const handleDeleteItem = (section, index) => {
    setFormData(prev => {
      const newArray = [...prev[section]];
      newArray.splice(index, 1);
      return { ...prev, [section]: newArray };
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-6 rounded shadow space-y-4 w-full max-w-2xl">
        <h2 className="text-lg font-semibold">{isEdit ? '編輯學生' : '新增學生'}</h2>

        <div>
          <label>學生照片：</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          {formData.photoURL && <img src={formData.photoURL} alt="student" className="w-24 mt-2" />}
        </div>

        <div><label>姓名：</label><input name="name" value={formData.name} onChange={handleChange} className="border p-1 w-full" /></div>
        <div><label>年級：</label><input name="grade" value={formData.grade} onChange={handleChange} className="border p-1 w-full" /></div>
        <div><label>學校：</label><input name="school" value={formData.school} onChange={handleChange} className="border p-1 w-full" /></div>
        <div><label>科目：</label><input name="subject" value={formData.subject} onChange={handleChange} className="border p-1 w-full" /></div>

        <div>
          <label>學生個性 Hashtag：</label>
          <div className="flex flex-wrap gap-2 my-2">
            {formData.hashtags.map((tag, index) => (
              <span key={index} className="bg-blue-100 px-2 py-1 rounded text-sm cursor-pointer" onClick={() => handleRemoveHashtag(index)}>
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

        {/* Class Records */}
        <div>
          <label className="font-semibold">上課紀錄：</label>
          {formData.classRecords.map((record, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                className="border p-1 flex-1"
                placeholder="日期"
                value={record.date}
                onChange={(e) => handleArrayChange('classRecords', index, 'date', e.target.value)}
              />
              <input
                className="border p-1 flex-1"
                placeholder="內容"
                value={record.content}
                onChange={(e) => handleArrayChange('classRecords', index, 'content', e.target.value)}
              />
              <button onClick={() => handleDeleteItem('classRecords', index)} className="text-red-500">刪除</button>
            </div>
          ))}
          <button onClick={() => handleAddItem('classRecords')} className="text-blue-500">+ 新增紀錄</button>
        </div>

        {/* Scores */}
        <div>
          <label className="font-semibold">成績紀錄：</label>
          {formData.scores.map((score, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                className="border p-1 flex-1"
                placeholder="科目"
                value={score.subject}
                onChange={(e) => handleArrayChange('scores', index, 'subject', e.target.value)}
              />
              <input
                className="border p-1 flex-1"
                placeholder="分數"
                value={score.score}
                onChange={(e) => handleArrayChange('scores', index, 'score', e.target.value)}
              />
              <button onClick={() => handleDeleteItem('scores', index)} className="text-red-500">刪除</button>
            </div>
          ))}
          <button onClick={() => handleAddItem('scores')} className="text-blue-500">+ 新增成績</button>
        </div>

        {/* Parents */}
        <div>
          <label className="font-semibold">家長聯絡：</label>
          {formData.parents.map((parent, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                className="border p-1 flex-1"
                placeholder="姓名"
                value={parent.name}
                onChange={(e) => handleArrayChange('parents', index, 'name', e.target.value)}
              />
              <input
                className="border p-1 flex-1"
                placeholder="聯絡方式"
                value={parent.contact}
                onChange={(e) => handleArrayChange('parents', index, 'contact', e.target.value)}
              />
              <button onClick={() => handleDeleteItem('parents', index)} className="text-red-500">刪除</button>
            </div>
          ))}
          <button onClick={() => handleAddItem('parents')} className="text-blue-500">+ 新增家長</button>
        </div>

        <button onClick={handleSave} disabled={loading} className={`my-custom-btn ${loading ? 'disabled-btn' : ''}`}>
          {loading ? '儲存中...' : '儲存'}
        </button>
      </div>
    </div>
  );
}

  

