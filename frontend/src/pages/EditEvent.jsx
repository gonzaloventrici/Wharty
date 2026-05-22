import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import SideMenu from '../components/SideMenu'
import api from '../services/api'

export default function EditEvent() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [form, setForm] = useState({
    title: '', description: '', location: '',
    date: '', price: '', capacity: '', is_recurring: false
  })
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    api.get(`/events/${id}`).then(res => {
      const e = res.data
      setForm({
        title: e.title,
        description: e.description || '',
        location: e.location,
        date: e.date.slice(0, 16),
        price: e.price,
        capacity: e.capacity,
        is_recurring: e.is_recurring || false
      })
      setLoading(false)
    })
    api.get(`/events/${id}/images`).then(res => setImages(res.data))
  }, [id])

  const handleUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    try {
      const res = await api.post(`/events/${id}/images`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setImages([...images, res.data])
    } catch {
      setError('Error al subir la imagen')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const handleSetPrimary = async (imageId) => {
    await api.put(`/events/${id}/images/${imageId}/set-primary`)
    setImages(images.map(img => ({ ...img, is_primary: img.id === imageId })))
  }

  const handleDeleteImage = async (imageId) => {
    if (!window.confirm('¿Eliminar esta imagen?')) return
    await api.delete(`/events/${id}/images/${imageId}`)
    setImages(images.filter(img => img.id !== imageId))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      await api.put(`/events/${id}`, {
        ...form,
        price: parseFloat(form.price),
        capacity: parseInt(form.capacity),
        date: new Date(form.date).toISOString()
      })
      setSuccess('Evento actualizado correctamente')
    } catch {
      setError('Error al actualizar el evento')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">Cargando...</div>

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      <nav className="bg-gray-900 px-6 py-4 flex justify-between items-center">
        <div className="flex gap-4 items-center">
          <button onClick={() => setMenuOpen(true)} style={{width:'38px', height:'38px', borderRadius:'8px', background:'transparent', border:'none', cursor:'pointer', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', gap:'5px', padding:'4px'}}>
            <span style={{display:'block', width:'22px', height:'2px', background:'#a78bfa', borderRadius:'2px'}}></span>
            <span style={{display:'block', width:'22px', height:'2px', background:'#a78bfa', borderRadius:'2px'}}></span>
            <span style={{display:'block', width:'22px', height:'2px', background:'#a78bfa', borderRadius:'2px'}}></span>
          </button>
          <h1 className="text-xl font-bold text-purple-400 cursor-pointer" onClick={() => navigate('/events')}>Wharty</h1>
        </div>
        <button onClick={() => navigate('/my-events')} className="text-gray-400 hover:text-white transition text-sm">
          ← Mis eventos
        </button>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-10">
        <h2 className="text-3xl font-bold mb-8">Editar evento</h2>
        {success && <p className="text-green-400 mb-4">{success}</p>}
        {error && <p className="text-red-400 mb-4">{error}</p>}

        {/* Imágenes */}
        <div className="bg-gray-900 rounded-2xl p-6 mb-4">
          <p className="text-white font-semibold mb-4">Imágenes del evento</p>

          {images.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mb-4">
              {images.map(img => (
                <div key={img.id} className="relative rounded-xl overflow-hidden">
                  <img
                    src={`http://127.0.0.1:8000${img.url}`}
                    alt="evento"
                    className="w-full h-24 object-cover"
                  />
                  {img.is_primary && (
                    <span className="absolute top-1 left-1 bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full">Principal</span>
                  )}
                  <div className="absolute bottom-0 inset-x-0 bg-black/60 flex justify-between p-1">
                    {!img.is_primary && (
                      <button
                        onClick={() => handleSetPrimary(img.id)}
                        className="text-xs text-purple-300 hover:text-white">
                        Principal
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteImage(img.id)}
                      className="text-xs text-red-400 hover:text-white ml-auto">
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div>
            <label className="text-gray-400 text-sm mb-2 block">Subir nueva imagen</label>
            <input type="file" accept="image/*" onChange={handleUpload} disabled={uploading}
              className="text-gray-300 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-600 file:text-white file:cursor-pointer disabled:opacity-50" />
            {uploading && <p className="text-gray-400 text-sm mt-2">Subiendo...</p>}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input type="text" placeholder="Nombre del evento" required
            className="bg-gray-900 text-white rounded-lg px-4 py-3 outline-none"
            value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
          <textarea placeholder="Descripción"
            className="bg-gray-900 text-white rounded-lg px-4 py-3 outline-none resize-none h-28"
            value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
          <input type="text" placeholder="Ubicación" required
            className="bg-gray-900 text-white rounded-lg px-4 py-3 outline-none"
            value={form.location} onChange={e => setForm({...form, location: e.target.value})} />
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Fecha y hora</label>
            <input type="datetime-local" required
              className="bg-gray-900 text-white rounded-lg px-4 py-3 outline-none w-full"
              value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input type="number" placeholder="Precio" required
              className="bg-gray-900 text-white rounded-lg px-4 py-3 outline-none"
              value={form.price} onChange={e => setForm({...form, price: e.target.value})} />
            <input type="number" placeholder="Capacidad" required
              className="bg-gray-900 text-white rounded-lg px-4 py-3 outline-none"
              value={form.capacity} onChange={e => setForm({...form, capacity: e.target.value})} />
          </div>

          <label className="flex items-center gap-3 bg-gray-900 rounded-lg px-4 py-3 cursor-pointer">
            <input type="checkbox" checked={form.is_recurring}
              onChange={e => setForm({...form, is_recurring: e.target.checked})}
              className="w-4 h-4 accent-purple-600" />
            <div>
              <div className="text-white text-sm font-semibold">Evento recurrente</div>
              <div className="text-gray-500 text-xs">Este evento se repite ocasionalmente</div>
            </div>
          </label>

          <button type="submit" disabled={saving}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 mt-2">
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </form>
      </div>
    </div>
  )
}