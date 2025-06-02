// src/components/CalendarModal.jsx
import React from "react";

const CalendarModal = ({
  isEditing,
  selectedDate,
  studentName,
  subject,
  startTime,
  endTime,
  setStudentName,
  setSubject,
  setStartTime,
  setEndTime,
  onCancel,
  onSubmit,
  onDelete,
}) => {
  return (
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
            onClick={onCancel}
            className="px-3 py-1 rounded border text-white"
            style={{
              backgroundColor: "#912224",
              borderColor: "#912224",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "white";
              e.target.style.color = "#912224";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#912224";
              e.target.style.color = "white";
            }}
          >
            取消
          </button>

          {isEditing ? (
            <div className="flex gap-2">
              <button
                onClick={onDelete}
                className="px-3 py-1 rounded border text-white"
                style={{
                  backgroundColor: "#912224",
                  borderColor: "#912224",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "white";
                  e.target.style.color = "#912224";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#912224";
                  e.target.style.color = "white";
                }}
              >
                刪除
              </button>
              <button
                onClick={onSubmit}
                className="px-3 py-1 rounded border text-white"
                style={{
                  backgroundColor: "#228991",
                  borderColor: "#228991",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "white";
                  e.target.style.color = "#228991";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#228991";
                  e.target.style.color = "white";
                }}
              >
                更新
              </button>
            </div>
          ) : (
            <button
              onClick={onSubmit}
              className="px-4 py-1 rounded border text-white"
              style={{
                backgroundColor: "#228991",
                borderColor: "#228991",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "white";
                e.target.style.color = "#228991";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "#228991";
                e.target.style.color = "white";
              }}
            >
              新增
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarModal;

