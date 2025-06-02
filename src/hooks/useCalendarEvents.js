// src/hooks/useCalendarEvents.js
import { useEffect, useState } from "react";
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
import { db } from "../firebase";

export const useCalendarEvents = (userId) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (!userId) return;
    const q = query(collection(db, "events"), where("userId", "==", userId));
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
  }, [userId]);

  const addEvent = (data) =>
    addDoc(collection(db, "events"), { ...data, createdAt: new Date() });

  const updateEvent = (id, data) => updateDoc(doc(db, "events", id), data);

  const deleteEvent = (id) => deleteDoc(doc(db, "events", id));

  return { events, addEvent, updateEvent, deleteEvent };
};
