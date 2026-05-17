import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import SideMenu from '../components/SideMenu'
import api from '../services/api'

export default function Profile() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [form, setForm] = useState({})
  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/auth/me').then(res => {
      setForm(res.data)
      setLoading(false)
    })
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    try {
      await api.put('/auth/me', form)
      setSuccess('Perfil actualizado correctamente')
    } catch {
      setError('Error al actualizar el perfil')
    }
  }

  if (loading) return <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">Cargando...</div>

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      <nav className="bg-gray-900 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-purple-400 cursor-pointer" onClick={() => navigate('/events')}>Wharty</h1>
        <button
          onClick={() => setMenuOpen(true)}
          style={{width:'38px', height:'38px', borderRadius:'50%', background:'#7c3aed', border:'none', cursor:'pointer', color:'white', fontSize:'16px'}}>
          {user?.isOrganizer ? '🎛️' : '🎉'}
        </button>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-10">
        <h2 className="text-3xl font-bold mb-8">Mi perfil</h2>
        {success && <p className="text-green-400 mb-4">{success}</p>}
        {error && <p className="text-red-400 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!user?.isOrganizer ? (
            <>
              <input type="text" placeholder="Nombre y Apellido"
                className="bg-gray-800 text-white rounded-lg px-4 py-3 outline-none"
                value={form.name || ''} onChange={e => setForm({...form, name: e.target.value})} />
              <input type="email" placeholder="Email" disabled
                className="bg-gray-800 text-gray-500 rounded-lg px-4 py-3 outline-none cursor-not-allowed"
                value={form.email || ''} />
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Fecha de nacimiento</label>
                <input type="date"
                  className="bg-gray-800 text-white rounded-lg px-4 py-3 outline-none w-full"
                  value={form.birth_date || ''} onChange={e => setForm({...form, birth_date: e.target.value})} />
              </div>
              <input type="text" placeholder="DNI / Pasaporte"
                className="bg-gray-800 text-white rounded-lg px-4 py-3 outline-none"
                value={form.dni || ''} onChange={e => setForm({...form, dni: e.target.value})} />
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Género</label>
                <div className="flex gap-3">
                  {['M', 'F', 'X'].map(g => (
                    <button key={g} type="button"
                      onClick={() => setForm({...form, gender: g})}
                      className={`flex-1 py-3 rounded-lg border transition font-semibold ${form.gender === g ? 'bg-purple-600 border-purple-600 text-white' : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-purple-500'}`}>
                      {g === 'M' ? 'Masculino' : g === 'F' ? 'Femenino' : 'No binario'}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              <input type="text" placeholder="Nombre de la Productora"
                className="bg-gray-800 text-white rounded-lg px-4 py-3 outline-none"
                value={form.producer_name || ''} onChange={e => setForm({...form, producer_name: e.target.value})} />
              <input type="text" placeholder="CUIT / CUIL"
                className="bg-gray-800 text-white rounded-lg px-4 py-3 outline-none"
                value={form.cuit || ''} onChange={e => setForm({...form, cuit: e.target.value})} />
              <input type="text" placeholder="Razón Social"
                className="bg-gray-800 text-white rounded-lg px-4 py-3 outline-none"
                value={form.razon_social || ''} onChange={e => setForm({...form, razon_social: e.target.value})} />
              <input type="email" placeholder="Email" disabled
                className="bg-gray-800 text-gray-500 rounded-lg px-4 py-3 outline-none cursor-not-allowed"
                value={form.email || ''} />
              <div>
                <input type="email" placeholder="Email corporativo"
                  className="bg-gray-800 text-white rounded-lg px-4 py-3 outline-none w-full"
                  value={form.corporate_email || ''} onChange={e => setForm({...form, corporate_email: e.target.value})} />
                <p className="text-gray-500 text-xs mt-1">Si lo dejás vacío se usará tu email de acceso</p>
              </div>
              <input type="tel" placeholder="Teléfono"
                className="bg-gray-800 text-white rounded-lg px-4 py-3 outline-none"
                value={form.phone || ''} onChange={e => setForm({...form, phone: e.target.value})} />
              <input type="text" placeholder="CBU / CVU"
                className="bg-gray-800 text-white rounded-lg px-4 py-3 outline-none"
                value={form.cbu || ''} onChange={e => setForm({...form, cbu: e.target.value})} />
            </>
          )}

          <button type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition mt-2">
            Guardar cambios
          </button>
        </form>
      </div>
    </div>
  )
}