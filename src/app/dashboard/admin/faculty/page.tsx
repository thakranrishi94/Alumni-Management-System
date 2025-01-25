"use client"
import React, { useState, useEffect } from 'react';
import AddNewFaculty from '@/components/AddNewFaculty'
import { CiEdit } from "react-icons/ci";
export default function AlumniPage() {
  const alumni = [
    { name: 'Marie Johnson', email: 'marie@acme.com', school: 'SOMC', Cno: 1234567890, updated: '3 days ago', designation: 'prof',status:'Active' },
    { name: 'Sarah Liu', email: 'sarah@acme.com', school: 'SOET', Cno: 1234567840, updated: '2 weeks ago', designation: 'As prof',status:'Active' },
    { name: 'Alex Grimes', email: 'alex@acme.com', school: 'SOMC', Cno: 1234567890, updated: '1 month ago', designation: 'prof',status:'Inactive' },
    { name: 'Chris Davis', email: 'chris@acme.com', school: 'SOET', Cno: 1234567820, updated: '2 days ago', designation: 'As prof',status:'Inactive' },
    { name: 'Tara Smith', email: 'tara@acme.com', school: 'SOET', Cno: 1234567870, updated: '1 week ago', designation: 'prof',status:'Active' },
  ];

  return (
    <div className=" bg-gray-100 w-full">
      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        <h1 className="text-2xl font-bold ml-5 md:ml-0">Faculty</h1>
        <p className="text-gray-600">Manage Faculty profiles</p>

        {/* Search */}
        <div className="mt-6">
          <input
            type="text"
            placeholder="Search alumni by name, email or grad year"
            className="w-3/4 p-3 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
          /> <AddNewFaculty/>
        </div>

        {/* Alumni Table */}
        <div className="mt-8 bg-white shadow-md rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">School</th>
                <th className="p-4 text-left">Contact No</th>
                <th className="p-4 text-left">Designation</th>
                <th className="p-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {alumni.map((person, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="p-4">{person.name}</td>
                  <td className="p-4">{person.email}</td>
                  <td className="p-4">{person.school}</td>
                  <td className="p-4">{person.Cno}</td>
                  <td className='p-4'>{person.designation}</td>
                  <td className="p-4 flex">
                    
                    <a
                      href="#"
                      className={`p-2 w-24 h-10 text-center rounded-xl border-solid ${person.status=='Active' ? "bg-green-400 hover:bg-green-700" : "bg-red-400 hover:bg-red-700"
                        } border-black text-white bg-green-400 m-1 hover:bg-green-700`}
                    >
                      {person.status}
                    </a>
                    <a href="#"
                      className={`p-2 w-12 text-white font-bold text-center rounded-xl bg-blue-500`}
                    >
                      <CiEdit size={30} />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex justify-center">
          <nav className="flex items-center space-x-2">
            <a href="#" className="px-4 py-2 border rounded-lg">
              1
            </a>
            <a href="#" className="px-4 py-2 border rounded-lg text-gray-500">
              2
            </a>
            <a href="#" className="px-4 py-2 border rounded-lg text-gray-500">
              3
            </a>
            <a href="#" className="px-4 py-2 border rounded-lg text-gray-500">
              4
            </a>
            <a href="#" className="px-4 py-2 border rounded-lg text-gray-500">
              5
            </a>
          </nav>
        </div>
      </main>
    </div>
  );
}