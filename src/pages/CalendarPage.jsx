import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { auth, db } from "../firebase";
import "../index.css";

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

  const [successMessage, setSuccessMessage] = useState("");

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
    setEditEventId(null);
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

  const resetForm = () => {
    setStudentName("");
    setSubject("");
    setStartTime("18:00");
    setEndTime("20:00");
    setSelectedDate("");
    setEditEventId(null);
    setIsEditing(false);
  };

  const showSuccess = (msg) => {
    setSuccessMessage(msg);
    setTimeout(() => {
      setSuccessMessage("");
    }, 2000);
  };

  const handleAddEvent = async () => {
    if (!studentName || !subject || !startTime || !endTime) {
      alert("請填寫所有欄位");
      return;
    }

    try {
      await addDoc(collection(db, "events"), {
        userId: user.uid,
        studentName,
        subject,
        date: selectedDate,
        startTime,
        endTime,
        createdAt: new Date(),
      });

      setSuccessMessage("✅ 新增成功！");
      setModalOpen(false);
      resetForm();
      setTimeout(() => {
        setSuccessMessage("");
      }, 2000); // 讓訊息顯示一段時間再消失
    } catch (error) {
      console.error("新增失敗:", error);
      alert("新增失敗，請稍後再試");
    }
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

    showSuccess("✅ 更新成功！");
    setTimeout(() => {
      setModalOpen(false);
      resetForm();
    }, 300);
  };

  const handleDeleteEvent = async () => {
    if (!editEventId) return;

    await deleteDoc(doc(db, "events", editEventId));
    showSuccess("✅ 刪除成功！");
    setTimeout(() => {
      setModalOpen(false);
      resetForm();
    }, 300);
  };

  if (!user) return <p>請先登入才能使用行事曆。</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 overflow-x-hidden">
      <div className="w-full w-full p-4 relative mx-4">
        {/* ✅ 成功提示訊息 */}
        {successMessage && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-green-100 border border-green-400 text-green-800 px-4 py-2 rounded shadow-md z-50">
            {successMessage}
          </div>
        )}

        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          dateClick={(arg) => openModalForAdd(arg.dateStr)}
          eventClick={openModalForEdit}
          events={events}
          height="auto"
        />

        {/* Modal */}
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
                  className="px-3 py-1 rounded border transition-colors duration-200"
                  style={{
                    backgroundColor: "#912224",
                    color: "white",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "white";
                    e.target.style.color = "#912224";
                    e.target.style.border = "1px solid #912224";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "#912224";
                    e.target.style.color = "white";
                  }}
                  onClick={() => {
                    setModalOpen(false);
                    resetForm();
                  }}
                >
                  取消
                </button>

                {isEditing ? (
                  <div className="flex gap-2">
                    <button
                      className="px-3 py-1 rounded border transition-colors duration-200"
                      style={{
                        backgroundColor: "#912224",
                        color: "white",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = "white";
                        e.target.style.color = "#912224";
                        e.target.style.border = "1px solid #912224";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = "#912224";
                        e.target.style.color = "white";
                      }}
                      onClick={handleDeleteEvent}
                    >
                      刪除
                    </button>
                    <button
                      className="px-3 py-1 rounded border transition-colors duration-200"
                      style={{
                        backgroundColor: "#228991",
                        color: "white",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = "white";
                        e.target.style.color = "#228991";
                        e.target.style.border = "1px solid #228991";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = "#228991";
                        e.target.style.color = "white";
                      }}
                      onClick={handleUpdateEvent}
                    >
                      更新
                    </button>
                  </div>
                ) : (
                  <button
                    className="px-4 py-1 rounded border transition-colors duration-200"
                    style={{
                      backgroundColor: "#228991",
                      color: "white",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = "white";
                      e.target.style.color = "#228991";
                      e.target.style.border = "1px solid #228991";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = "#228991";
                      e.target.style.color = "white";
                    }}
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
    </div>
  );
};

export default CalendarPage;










