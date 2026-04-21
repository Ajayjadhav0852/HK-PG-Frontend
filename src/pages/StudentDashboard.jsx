import { useEffect, useState, useCallback, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { showToast } from '../components/Toast'
import { roomApi, applicationApi } from '../services/api'
import UPIPaymentScreen from '../components/UPIPaymentScreen'

const ROOM_TYPES = ['1-sharing','2-sharing','3-sharing','4-sharing']
const ROOM_LABELS = {
  '1-sharing':'1 Sharing',
  '2-sharing':'2 Sharing',
  '3-sharing':'3 Sharing',
  '4-sharing':'4 Sharing'
}

export default function StudentDashboard() {
  const { user, logout, updateProfile, uploadPhoto } = useAuth()
  const navigate = useNavigate()

  const [rooms,setRooms]=useState({})
  const [myApplications,setMyApplications]=useState([])
  const [loading,setLoading]=useState(true)

  const fetchRooms = useCallback(async()=>{
    try{
      const [roomRes,appRes]=await Promise.all([
        roomApi.getAll(),
        applicationApi.getMyApplications()
      ])
      const map={}
      ;(roomRes.data||[]).forEach(rt=>map[rt.slug]=rt)
      setRooms(map)
      setMyApplications(appRes.data||[])
    }catch(e){
      showToast.error('Error', 'Failed to load')
    }finally{
      setLoading(false)
    }
  },[])

  useEffect(()=>{
    fetchRooms()
  },[fetchRooms])

  if(loading){
    return(
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    )
  }

  const confirmedApp = myApplications.find(a=>a.status==='CONFIRMED')

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdf4ff] via-[#fff7ed] to-[#fff1f2]">

      {/* HEADER */}
      <div className="sticky top-0 z-40 px-4 h-16 flex items-center justify-between 
      bg-white/70 backdrop-blur-xl border-b border-white/20 
      shadow-[0_8px_30px_rgba(0,0,0,0.06)]">

        <p className="font-bold text-gray-800">{user?.name}</p>

        <div className="flex gap-2">
          <button onClick={()=>navigate('/')}
            className="px-3 py-1 text-xs text-white rounded-lg bg-pink-500">
            Website
          </button>
          <button onClick={logout}
            className="px-3 py-1 text-xs text-white rounded-lg bg-pink-500">
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">

        {/* WELCOME */}
        <h1 className="text-xl font-bold text-gray-800">
          Welcome {user?.name}
        </h1>

        {/* 🔥 TOP SUMMARY */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">

          <div className="bg-gradient-to-br from-pink-500 to-purple-600 text-white rounded-2xl p-4 shadow-lg">
            <p className="text-xs opacity-80">Room</p>
            <p className="text-lg font-bold">
              {confirmedApp?.roomTypeTitle || '—'}
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-4 shadow border border-white/30">
            <p className="text-xs text-gray-400">Rent</p>
            <p className="font-bold text-green-600">
              {confirmedApp?.rentStatus || 'PENDING'}
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-4 shadow border border-white/30">
            <p className="text-xs text-gray-400">Due</p>
            <p className="font-bold text-gray-800">5th</p>
          </div>

        </div>

        {/* BOOKINGS */}
        {myApplications.length>0 && (
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-5 shadow border border-white/30">

            <h2 className="font-bold mb-3">My Booking</h2>

            {myApplications.map(a=>(
              <div key={a.id} className="border p-3 rounded-lg mb-2 bg-white/60">
                <p className="font-semibold">{a.roomTypeTitle}</p>
                <p className="text-xs">{a.status}</p>
              </div>
            ))}

          </div>
        )}

        {/* PAYMENT */}
        {confirmedApp && (
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-5 shadow border border-white/30">

            <h2 className="font-bold mb-3">Payment</h2>

            <p>₹{confirmedApp.monthlyPrice}</p>

            <button
              onClick={()=>navigate('/pay-rent')}
              className="mt-3 w-full py-2 rounded-xl text-white 
              bg-gradient-to-r from-pink-500 to-purple-600 
              shadow-[0_10px_30px_rgba(208,35,132,0.4)]
              hover:scale-105 transition">
              Pay Rent
            </button>

          </div>
        )}

        {/* ROOMS */}
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-5 shadow border border-white/30">

          <h2 className="font-bold mb-3">Rooms</h2>

          <div className="grid grid-cols-2 gap-3">

            {ROOM_TYPES.map(key=>{
              const rt = rooms[key]
              if(!rt) return null

              return (
                <div key={key}
                  className="p-3 rounded-xl bg-white/80 border 
                  hover:shadow-lg hover:-translate-y-1 transition">

                  <p className="text-sm font-semibold">{ROOM_LABELS[key]}</p>
                  <p className="text-xs text-gray-400">
                    Vacant: {rt.vacantBeds}
                  </p>

                </div>
              )
            })}

          </div>

        </div>

      </div>
    </div>
  )
}