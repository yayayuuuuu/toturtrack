import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { auth, db } from "../firebase";
import {
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const CalendarPage = () => {
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editEventId, setEditEventId] = useState(null);

  const [selectedDate, setSelectedDate] = useState("");
  const [studentName, setStudentName] = useState("");
  const [subject, setSubject] = useState("");
  const [startTime, setStartTime] = useState("18:00");
  const [endTime, setEndTime] = useState("20:00");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      const q = query(collection(db, "events"), where("userId", "==", user.uid));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetched = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            title: `${data.studentName} - ${data.subject}`,
            start: `${data.date}T${data.startTime}`,
            end: `${data.date}T${data.endTime}`,
            extendedProps: data,
          };
        });
        setEvents(fetched);
      });
      return () => unsubscribe();
    }
  }, [user]);

  const openModalForAdd = (dateStr) => {
    setSelectedDate(dateStr);
    setIsEditing(false);
    setStudentName("");
    setSubject("");
    setStartTime("18:00");
    setEndTime("20:00");
    setModalOpen(true);
  };

  const openModalForEdit = (info) => {
    const data = info.event.extendedProps;
    setEditEventId(info.event.id);
    setSelectedDate(data.date);
    setStudentName(data.studentName);
    setSubject(data.subject);
    setStartTime(data.startTime);
    setEndTime(data.endTime);
    setIsEditing(true);
    setModalOpen(true);
  };

  const handleAddEvent = async () => {
    if (!studentName || !subject || !startTime || !endTime) {
      alert("請填寫所有欄位");
      return;
    }

    await addDoc(collection(db, "events"), {
      userId: user.uid,
      studentName,
      subject,
      date: selectedDate,
      startTime,
      endTime,
      createdAt: new Date(),
    });

    setModalOpen(false);
  };

  const handleUpdateEvent = async () => {
    if (!editEventId) return;
    const ref = doc(db, "events", editEventId);
    await updateDoc(ref, {
      studentName,
      subject,
      date: selectedDate,
      startTime,
      endTime,
    });
    setModalOpen(false);
  };

  const handleDeleteEvent = async () => {
    if (!editEventId) return;
    await deleteDoc(doc(db, "events", editEventId));
    setModalOpen(false);
  };

  if (!user) return <p>請先登入才能使用行事曆。</p>;

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">我的行事曆</h1>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        dateClick={(arg) => openModalForAdd(arg.dateStr)}
        eventClick={openModalForEdit}
        events={events}
        height="auto"
      />

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-[300px]">
            <h2 className="text-xl font-semibold mb-4">
              {isEditing ? "編輯課程" : "新增課程"}
            </h2>
            <p className="mb-2 text-gray-600">日期：{selectedDate}</p>

            <div className="mb-2">
              <label>學生姓名</label>
              <input
                type="text"
                className="w-full border p-1"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
              />
            </div>

            <div className="mb-2">
              <label>科目</label>
              <input
                type="text"
                className="w-full border p-1"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            <div className="mb-2 flex gap-2">
              <div className="flex-1">
                <label>開始時間</label>
                <input
                  type="time"
                  className="w-full border p-1"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
              <div className="flex-1">
                <label>結束時間</label>
                <input
                  type="time"
                  className="w-full border p-1"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-between mt-4">
              <button
                className="bg-gray-500 text-white px-3 py-1 rounded"
                onClick={() => setModalOpen(false)}
              >
                取消
              </button>

              {isEditing ? (
                <>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded"
                    onClick={handleDeleteEvent}
                  >
                    刪除
                  </button>
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                    onClick={handleUpdateEvent}
                  >
                    更新
                  </button>
                </>
              ) : (
                <button
                  className="bg-green-500 text-white px-4 py-1 rounded"
                  onClick={handleAddEvent}
                >
                  新增
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;




