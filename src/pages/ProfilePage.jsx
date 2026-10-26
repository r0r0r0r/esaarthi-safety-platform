import React, { useState } from 'react';
import { User, ShieldCheck, Phone, Mail, MapPin, Heart, Key, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const ProfilePage = () => {
  const { user, logout } = useAuth();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center gap-5 pb-6 border-b border-slate-100">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-blue-500/20">
            {user?.fullName?.charAt(0) || 'P'}
          </div>
          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl font-black text-slate-900">{user?.fullName || 'Priya Sharma'}</h2>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
                Verified Citizen
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">{user?.email || 'priya.sharma@example.com'}</p>
            <p className="text-xs text-slate-400 mt-0.5">{user?.phone || '+91 98765 43210'}</p>
          </div>
        </div>

        {/* Security & Health Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-6 border-b border-slate-100">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-1">
              <Heart className="w-4 h-4 text-red-500" />
              <span>Medical / Blood Group</span>
            </div>
            <p className="text-base font-black text-slate-900">Blood Group {user?.bloodGroup || 'B+'}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Attached to Emergency SOS Dispatch</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-1">
              <Key className="w-4 h-4 text-amber-500" />
              <span>Emergency Disarm PIN</span>
            </div>
            <p className="text-base font-black text-slate-900">•••• ({user?.emergencyPin || '9912'})</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Used to silence active sirens securely</p>
          </div>
        </div>

        {/* Saved Addresses */}
        <div className="py-6 border-b border-slate-100 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Saved Frequent Safe Destinations
          </h4>
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
            <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <div>
              <span className="text-xs font-bold text-slate-900 block">Home Address</span>
              <span className="text-xs text-slate-500">{user?.homeAddress || 'Sector 15, Rohini, New Delhi'}</span>
            </div>
          </div>
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
            <MapPin className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <div>
              <span className="text-xs font-bold text-slate-900 block">Work / Office</span>
              <span className="text-xs text-slate-500">{user?.workAddress || 'Barakhamba Road, Connaught Place'}</span>
            </div>
          </div>
        </div>

        {/* Logout */}
        <div className="pt-6 flex justify-end">
          <button
            onClick={logout}
            className="py-2.5 px-5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
