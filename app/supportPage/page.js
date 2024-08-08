"use client";
/**
 * Support Component
 * 
 * The Support component renders the support page for the ShiftEaze application. It provides users with a contact form 
 * to reach out to the support team for any assistance or inquiries. The page is styled to be consistent with the overall 
 * theme of the application, featuring a background gradient and a clean, user-friendly interface. The form includes fields 
 * for the user's name, email, and message, ensuring that the support team receives all necessary information to assist the user effectively.
 * 
 * Key features:
 * - A responsive and accessible contact form that users can fill out to request support.
 * - A navigation bar at the top of the page for easy navigation.
 * - A visually appealing layout with clear instructions and labels for each form field.
 * - Integration with the ShiftEaze theme, ensuring a cohesive user experience across the application.
 * 
 * @returns {JSX.Element} The Support component
 */

import React from "react";
import NavBar from "@/components/navBarLogin";

const Support = () => {
  return (
    <>
      <NavBar />
      <main className="flex min-h-screen bg-gradient-to-r from-blue-300 via-blue-600 to-blue-800 flex-col items-center justify-between pt-20">
        <div className="w-full h-screen flex flex-col justify-center items-center">
          <h1 className="font-comfortaa font-bold text-6xl text-white mb-8">Support</h1>
          <div className="bg-black opacity-85 rounded-lg shadow-md p-8 max-w-3xl w-full">
            <h2 className="text-2xl font-comfortaa font-bold text-white mb-4">Contact Us</h2>
            <p className="text-white font-comfortaa mb-6">
              If you have any questions or need assistance, please fill out the form below, and our support team will get back to you as soon as possible.
            </p>
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-comfortaa text-white">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="text-black mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 focus:outline-none font-nixie"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-comfortaa text-white">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="text-black mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 focus:outline-none font-nixie"
                  required
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-comfortaa text-white">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  className="text-black mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 focus:outline-none font-nixie"
                  required
                ></textarea>
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-md py-3 px-6 transition-colors border-2 border-transparent hover:border-blue-300 font-comfortaa"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </>
  );
};

export default Support;
