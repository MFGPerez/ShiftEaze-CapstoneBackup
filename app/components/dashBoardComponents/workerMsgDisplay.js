"use client";

import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, query, getDocs, deleteDoc, where, doc, getDoc } from "firebase/firestore";
import { firebaseApp } from "utils/firebase";
import { FaTrashAlt } from 'react-icons/fa';
import { AiOutlineClose } from 'react-icons/ai';

/**
 * WorkerMsgDisplay Component
 * 
 * This component fetches and displays worker messages, particularly leave requests, 
 * for a manager. It shows the list of messages, allows viewing details of each message, 
 * and enables the manager to delete messages. The component also handles loading state 
 * and error cases.
 * 
 * @returns {JSX.Element} The rendered WorkerMsgDisplay component
 */

const WorkerMsgDisplay = () => {
  const auth = getAuth(firebaseApp);
  const db = getFirestore(firebaseApp);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [managerId, setManagerId] = useState("");

  /**
   * Fetches the manager's ID when the component mounts.
   */
  useEffect(() => {
    const fetchManagerId = async () => {
      const user = auth.currentUser;
      if (user) {
        const managerDocRef = doc(db, "managers", user.uid);
        const managerDocSnap = await getDoc(managerDocRef);
        if (managerDocSnap.exists()) {
          setManagerId(managerDocSnap.id);
        } else {
          console.error("Manager document not found");
        }
      }
    };

    fetchManagerId();
  }, [auth, db]);

  /**
   * Fetches the messages for the manager based on the managerId.
   */
  useEffect(() => {
    if (!managerId) return;

    const fetchMessages = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, "leaveRequests"), where("managerId", "==", managerId));
        const querySnapshot = await getDocs(q);
        const messagesList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          time: formatTimestamp(doc.data().timestamp.toDate()), // Format Firestore timestamp to date string
        }));
        setMessages(messagesList);
      } catch (error) {
        console.error("Error fetching messages: ", error);
      }
      setLoading(false);
    };

    fetchMessages();
  }, [managerId, db]);

  /**
   * Deletes a message from Firestore and removes it from the state.
   * 
   * @param {string} id - The ID of the message to delete.
   */
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "leaveRequests", id));
      setMessages(messages.filter(message => message.id !== id));
    } catch (error) {
      console.error("Error deleting message: ", error);
    }
  };

  /**
   * Formats a Firestore timestamp into a readable date string.
   * 
   * @param {Date} date - The date to format.
   * @returns {string} - The formatted date string.
   */
  const formatTimestamp = (date) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  };

  /**
   * Handles the click event to view the details of a message.
   * 
   * @param {Object} message - The message object to view.
   */
  const handleView = (message) => {
    setSelectedMessage(message);
  };

  /**
   * Closes the message detail popup.
   */
  const handleClosePopup = () => {
    setSelectedMessage(null);
  };

  /**
   * Formats a date range into a readable string.
   * 
   * @param {Array} dates - The array of dates to format.
   * @returns {string} - The formatted date range string.
   */
  const formatDateRange = (dates) => {
    if (!dates || dates.length === 0) return "";
    if (dates.length === 2) {
      return `${dates[0].toDate().toLocaleDateString()} to ${dates[1].toDate().toLocaleDateString()}`;
    } else {
      return dates[0].toDate().toLocaleDateString();
    }
  };

  return (
    <div className="w-full max-w-3xl">
      <div className="bg-gray-100 text-black text-center p-4 rounded-t-lg w-full">
        <h2 className="text-3xl font-comfortaa font-bold">Worker Messages</h2>
      </div>
      <div className="bg-black opacity-90 p-7 rounded-b-lg shadow-lg w-full" style={{ height: '27rem' }}>
        {loading ? (
          <p className="text-white">Loading messages...</p>
        ) : (
          <div className="flex flex-col space-y-4 overflow-y-auto h-full">
            {messages.length === 0 ? (
              <p className="text-white text-center">You have no support messages at this time.</p>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`relative py-3 px-6 rounded-lg shadow transition-colors border-2 cursor-pointer ${
                    msg.toBeDeleted === "Yes" ? "bg-red-100 border-red-600" : "bg-blue-100 hover:bg-blue-300 border-transparent hover:border-blue-600"
                  }`}
                  onClick={() => handleView(msg)}
                >
                  <h2 className="text-2xl font-comfortaa font-semibold text-blue-900 mb-1">{msg.workerName} - Leave Req</h2>
                  <p className="text-black font-nixie text-sm">{msg.notes}</p>
                  <p className="text-black font-nixie text-sm">Email: {msg.email}</p>
                  <p className="text-black font-nixie text-sm">Dates: {formatDateRange(msg.selectedDates)}</p>
                  <p className="text-black font-nixie text-sm">Time: {msg.time}</p>
                  <FaTrashAlt
                    className="absolute top-2 right-2 text-red-400 hover:text-red-700 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(msg.id);
                    }}
                  />
                  <hr className="border-t border-black my-4" />
                </div>
              ))
            )}
          </div>
        )}
      </div>
      {selectedMessage && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl relative">
            <button
              onClick={handleClosePopup}
              className="absolute top-4 right-4 text-red-400 hover:text-red-700"
            >
              <AiOutlineClose size={24} />
            </button>
            <div className="text-black">
              <h2 className="text-3xl font-comfortaa font-bold mb-4">{selectedMessage.workerName} - Leave Req</h2>
              <div className="mt-4">
                <p className="text-2xl font-nixie font-semibold mb-2">Message: {selectedMessage.notes}</p>
              </div>
              <p className="text-xl font-comfortaa mb-1">Email: {selectedMessage.email}</p>
              <p className="text-xl font-comfortaa mb-1">Dates: {formatDateRange(selectedMessage.selectedDates)}</p>
              <p className="text-xl font-comfortaa mb-1">Time: {selectedMessage.time}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkerMsgDisplay;
