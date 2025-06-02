import React, { useState, useMemo, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useAuth } from "../contexts/AuthContext";
import CalendarModal from "./CalendarModal";
import { useCalendarEvents } from "../hooks/useCalendarEvents";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(duration);
dayjs.extend(relativeTime);

const CalendarSection = () => {
  const { currentUser } = useAuth();
  const userId = currentUser?.uid;

  const {
    events,
    addEvent,
    updateEvent,
    deleteEvent,
  } = useCalendarEvents(userId);

  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [studentName, setStudentName] = useState("");
  const [subject, setSubject] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [countdownText, setCountdownText] = useState("");

  const resetModal = () => {
    setStudentName("");
    setSubject("");
    setStartTime("");
    setEndTime("");
    setIsEditing(false);
    setSelectedEventId(null);
  };

  const handleDateClick = (arg) => {
    setSelectedDate(arg.dateStr);
    resetModal();
    setModalOpen(true);
  };

  const handleEventClick = (clickInfo) => {
    const { extendedProps, start, end, id } = clickInfo.event;
    setSelectedDate(start.toISOString().split("T")[0]);
    setStudentName(extendedProps.studentName);
    setSubject(extendedProps.subject);
    setStartTime(start.toISOString().substring(11, 16));
    setEndTime(end.toISOString().substring(11, 16));
    setSelectedEventId(id);
    setIsEditing(true);
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    const newData = {
      userId,
      date: selectedDate,
      studentName,
      subject,
      startTime,
      endTime,
    };

    try {
      if (isEditing && selectedEventId) {
        await updateEvent(selectedEventId, newData);
      } else {
        await addEvent(newData);
      }
      setModalOpen(false);
    } catch (err) {
      console.error("事件處理錯誤：", err);
    }
  };

  const handleDelete = async () => {
    if (selectedEventId) {
      await deleteEvent(selectedEventId);
      setModalOpen(false);
    }
  };

  const upcomingEvent = useMemo(() => {
    if (!events || events.length === 0) return null;

    const now = new Date();
    const sorted = [...events]
      .map((e) => ({
        ...e,
        start: new Date(e.start),
      }))
      .filter((e) => e.start > now)
      .sort((a, b) => a.start - b.start);

    return sorted[0] || null;
  }, [events]);

  // 🔁 倒數時間更新邏輯
  useEffect(() => {
    if (!upcomingEvent) {
      setCountdownText("");
      return;
    }

    const updateCountdown = () => {
      const now = dayjs();
      const start = dayjs(upcomingEvent.start);
      const diff = dayjs.duration(start.diff(now));

      const days = diff.days();
      const hours = diff.hours();
      const minutes = diff.minutes();

      const text = `${days > 0 ? `${days} 天 ` : ""}${
        hours > 0 ? `${hours} 小時 ` : ""
      }${minutes} 分鐘`;

      setCountdownText(text);
    };

    updateCountdown(); // 初始更新
    const interval = setInterval(updateCountdown, 60000); // 每分鐘更新

    return () => clearInterval(interval); // 清除 interval
  }, [upcomingEvent]);

  return (
    <div className="mt-10">
      {upcomingEvent && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded shadow">
          <p className="font-semibold">提醒事項：</p>
          <p>
            <span className="font-bold">{upcomingEvent.extendedProps.studentName}</span> 的{" "}
            <span className="italic">{upcomingEvent.extendedProps.subject}</span> 課程將於{" "}
            <span className="font-bold">
              {dayjs(upcomingEvent.start).format("YYYY/MM/DD HH:mm")}
            </span>{" "}
            開始。
          </p>
          <p className="mt-1 text-sm text-gray-600">⏳ 距離開始：{countdownText}</p>
        </div>
      )}

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        events={events}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        height="auto"
      />

      {modalOpen && (
        <CalendarModal
          isEditing={isEditing}
          selectedDate={selectedDate}
          studentName={studentName}
          subject={subject}
          startTime={startTime}
          endTime={endTime}
          setStudentName={setStudentName}
          setSubject={setSubject}
          setStartTime={setStartTime}
          setEndTime={setEndTime}
          onCancel={() => setModalOpen(false)}
          onSubmit={handleSubmit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default CalendarSection;


