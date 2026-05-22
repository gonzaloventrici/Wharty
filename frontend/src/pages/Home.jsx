import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import SideMenu from '../components/SideMenu'
import api from '../services/api'

function EventCard({ event }) {
  const [primaryImage, setPrimaryImage] = useState(null)

  useEffect(() => {
    api.get(`/events/${event.id}/images`).then(res => {
      const primary = res.data.find(img => img.is_primary) || res.data[0]
      setPrimaryImage(primary)
    }).catch(() => {})
  }, [event.id])

  return (
    <Link to={`/events/${event.id}`}>
      <div className="bg-gray-900 rounded-2xl overflow-hidden hover:ring-2 hover:ring-purple-500 transition">
        <div className="bg-gray-800 h-40 flex items-center justify-center overflow-hidden">
          {primaryImage ? (
            <img
              src={`http://127.0.0.1:8000${primaryImage.url}`}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-4xl text-gray-600">📷</span>
          )}
        </div>
        <div className="p-5">
          <h3 className="text-lg font-semibold mb-1">{event.title}</h3>
          <p className="text-gray-400 text-sm mb-2">{event.location}</p>
          <div className="flex justify-between items-center">
            <span className="text-purple-400 font-bold">${event.price.toLocaleString()}</span>
            <span className="text-yellow-400 text-sm">⭐ {event.average_rating.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function Home() {
  const [events, setEvents] = useState([])
  const [menuOpen, setMenuOpen] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    api.get('/events/').then(res => setEvents(res.data))
  }, [])

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      <nav className="bg-gray-900 px-6 py-4 flex justify-between items-center">
        <div className="flex gap-4 items-center">
          {user && (
            <button
              onClick={() => setMenuOpen(true)}
              style={{width:'38px', height:'38px', borderRadius:'8px', background:'transparent', border:'none', cursor:'pointer', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', gap:'5px', padding:'4px'}}>
              <span style={{display:'block', width:'22px', height:'2px', background:'#a78bfa', borderRadius:'2px'}}></span>
              <span style={{display:'block', width:'22px', height:'2px', background:'#a78bfa', borderRadius:'2px'}}></span>
              <span style={{display:'block', width:'22px', height:'2px', background:'#a78bfa', borderRadius:'2px'}}></span>
            </button>
          )}
          <h1 className="text-xl font-bold text-purple-400">Wharty</h1>
        </div>
        <div className="flex gap-4 items-center">
          {user?.isOrganizer && (
            <Link to="/events/create" className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition text-sm font-semibold">
              + Crear evento
            </Link>
          )}
          {!user && (
            <>
              <Link to="/login" className="text-gray-400 hover:text-white transition">Iniciar sesión</Link>
              <Link to="/register" className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition">Registrarse</Link>
            </>
          )}
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <h2 className="text-3xl font-bold mb-8">Eventos disponibles</h2>
        {events.length === 0 ? (
          <p className="text-gray-400">No hay eventos disponibles por ahora.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}