/**
 * NewDashboard Component
 *
 * The NewDashboard component serves as the main dashboard for managers in the application, 
 * providing a comprehensive overview of the current date and time, as well as key features such as 
 * worker management and message displays. This dashboard is designed to be the central hub for 
 * managers, allowing them to interact with various components like viewing workers and checking messages.
 *
 * Key features:
 * - Displays the current date and time prominently at the top.
 * - Includes a navigation bar for easy access to different sections of the dashboard.
 * - Provides a section for displaying worker-related features, such as worker listings and management tools.
 * - Integrates a message display component for viewing messages sent by workers.
 * - Features a responsive and visually appealing design with a gradient background and centralized content.
 */

// Import necessary libraries and components
"use client";
import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { useRouter } from "next/navigation";
import { firebaseApp } from "../../utils/firebase"; // Adjust the import path according to your project structure
import DisplayDate from "@components/displayDate"; // date display component
import DisplayTime from "@components/displayTime"; // time display component 
import NavBarDashboard from "@components/dashBoardComponents/navBarDashboards";
import WorkersDisplayFeature from "@components/dashBoardComponents/workersDisplayFeature";
import WorkerMsgDisplay from "@components/dashBoardComponents/workerMsgDisplay"; // Import the new WorkerMsgDisplay component

import { getFirestore, doc, getDoc } from "firebase/firestore";

// Initialize Firestore
const db = getFirestore(firebaseApp);

const NewDashboard = () => {
  const [managerName, setManagerName] = useState("");
  const router = useRouter();
  const auth = getAuth(firebaseApp); // Initialize auth with firebaseApp

  // Fetch manager details on component mount
  useEffect(() => {
    const fetchManagerDetails = async () => {
      const user = auth.currentUser;
      if (user) {
        const managerDocRef = doc(db, "managers", user.uid);
        const managerDocSnap = await getDoc(managerDocRef);
        if (managerDocSnap.exists()) {
          setManagerName(managerDocSnap.data().displayName);
        }
      }
    };

    fetchManagerDetails();
  }, [auth, db]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-300 via-blue-600 to-blue-800 flex flex-col relative">
      <NavBarDashboard /> {/* Use the new NavBarDashboard component */}
      <main className="flex-1 flex flex-col text-white py-7 relative">
        <div className="flex flex-col font-bold font-comfortaa items-start ml-8"> {/* Added margin-left */}
          <DisplayDate />
          <DisplayTime />
        </div>
        <div className="flex w-full justify-between">
          <div className="flex-1 flex flex-col items-center -mt-40 -ml-48"> {/* Adjusted margin-top */}
            <div className="w-11/12 max-w-lg mt-3 mb-12">
              {/* Add any content here if needed */}
            </div>
            <WorkersDisplayFeature /> {/* Moved WorkersDisplayFeature here */}
          </div>
          <div className="flex-1 flex flex-col items-center mt-24">
            <WorkerMsgDisplay /> {/* Use the WorkerMsgDisplay component */}
          </div>
        </div>
      </main>
      <footer className="bg-black opacity-85 text-white py-1 w-full">
        <div className="container mx-auto text-center py-8">
          <p>
            &copy; {new Date().getFullYear()} ShiftEaze. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default NewDashboard;
