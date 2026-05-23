import { useState } from 'react'
import api from '../services/api'

export default function CheckoutModal({ event, onClose, onSuccess }) {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [ticket, setTicket] = useState(null)
  const [error, setError] = useState('')

  const handleConfirm = async () => {
    setLoading(true)
    setError('')
    try {
      const paymentId = `WH-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
      const res = await api.post('/tickets/', {
        event_id: event.id,
        payment_id: paymentId
      })
      setTicket({ ...res.data, payment_id: paymentId })
      setStep(2)
      if (onSuccess) onSuccess()
    } catch {
      setError('Error al procesar la compra. Intentá de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.75)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:100, padding:'16px'}}>
      <div style={{background:'#111827', borderRadius:'20px', width:'100%', maxWidth:'440px', overflow:'hidden'}}>

        {step === 1 ? (
          <>
            {/* Header */}
            <div style={{background:'#1f2937', padding:'20px 24px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <h2 style={{color:'white', fontWeight:'700', fontSize:'18px'}}>Confirmar compra</h2>
              <button onClick={onClose} style={{background:'none', border:'none', color:'#6b7280', cursor:'pointer', fontSize:'20px'}}>✕</button>
            </div>

            {/* Evento */}
            <div style={{padding:'24px'}}>
              <div style={{background:'#1f2937', borderRadius:'12px', padding:'16px', marginBottom:'20px'}}>
                <p style={{color:'#9ca3af', fontSize:'12px', marginBottom:'4px'}}>EVENTO</p>
                <h3 style={{color:'white', fontWeight:'600', fontSize:'16px', marginBottom:'4px'}}>{event.title}</h3>
                <p style={{color:'#9ca3af', fontSize:'13px'}}>{event.location}</p>
                <p style={{color:'#9ca3af', fontSize:'13px'}}>{new Date(event.date).toLocaleDateString('es-AR', {weekday:'long', year:'numeric', month:'long', day:'numeric', hour:'2-digit', minute:'2-digit'})}</p>
              </div>

              {/* Resumen de precio */}
              <div style={{marginBottom:'20px'}}>
                <div style={{display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid #1f2937'}}>
                  <span style={{color:'#9ca3af', fontSize:'14px'}}>Precio de entrada</span>
                  <span style={{color:'white', fontSize:'14px'}}>${event.price.toLocaleString()}</span>
                </div>
                <div style={{display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid #1f2937'}}>
                  <span style={{color:'#9ca3af', fontSize:'14px'}}>Cargo por servicio</span>
                  <span style={{color:'white', fontSize:'14px'}}>${Math.round(event.price * 0.05).toLocaleString()}</span>
                </div>
                <div style={{display:'flex', justifyContent:'space-between', padding:'14px 0'}}>
                  <span style={{color:'white', fontWeight:'700', fontSize:'16px'}}>Total</span>
                  <span style={{color:'#a78bfa', fontWeight:'700', fontSize:'18px'}}>${Math.round(event.price * 1.05).toLocaleString()}</span>
                </div>
              </div>

              {error && <p style={{color:'#f87171', fontSize:'13px', marginBottom:'12px', textAlign:'center'}}>{error}</p>}

              <button
                onClick={handleConfirm}
                disabled={loading}
                style={{width:'100%', padding:'14px', borderRadius:'12px', background: loading ? '#4c1d95' : '#7c3aed', border:'none', color:'white', fontWeight:'700', fontSize:'16px', cursor: loading ? 'not-allowed' : 'pointer', transition:'background 0.2s'}}>
                {loading ? 'Procesando...' : 'Confirmar compra'}
              </button>

              <p style={{color:'#6b7280', fontSize:'11px', textAlign:'center', marginTop:'12px'}}>
                Al confirmar aceptás los términos y condiciones de Wharty
              </p>
            </div>
          </>
        ) : (
          <>
            {/* Success */}
            <div style={{padding:'32px 24px', textAlign:'center'}}>
              <div style={{width:'64px', height:'64px', borderRadius:'50%', background:'#064e3b', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', fontSize:'28px'}}>
                ✅
              </div>
              <h2 style={{color:'white', fontWeight:'700', fontSize:'22px', marginBottom:'8px'}}>¡Compra exitosa!</h2>
              <p style={{color:'#9ca3af', fontSize:'14px', marginBottom:'24px'}}>Tu entrada fue confirmada</p>

              <div style={{background:'#1f2937', borderRadius:'16px', padding:'20px', marginBottom:'24px'}}>
                <p style={{color:'#9ca3af', fontSize:'11px', marginBottom:'8px', letterSpacing:'0.1em'}}>CÓDIGO DE ENTRADA</p>
                <p style={{color:'#a78bfa', fontWeight:'700', fontSize:'20px', letterSpacing:'0.15em', fontFamily:'monospace'}}>{ticket?.payment_id}</p>
                <div style={{margin:'16px 0', borderTop:'1px dashed #374151'}}></div>
                <p style={{color:'white', fontWeight:'600', fontSize:'15px'}}>{event.title}</p>
                <p style={{color:'#9ca3af', fontSize:'13px'}}>{event.location}</p>
                <p style={{color:'#9ca3af', fontSize:'13px'}}>{new Date(event.date).toLocaleDateString('es-AR', {weekday:'long', day:'numeric', month:'long'})}</p>
              </div>

              <button
                onClick={onClose}
                style={{width:'100%', padding:'14px', borderRadius:'12px', background:'#7c3aed', border:'none', color:'white', fontWeight:'700', fontSize:'16px', cursor:'pointer'}}>
                Ver mis entradas
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}