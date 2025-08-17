import { useEffect, useState } from 'react'

interface BitacoraItem {
  hora: string
  tipo: string
  descripcion: string
  imagen?: string
}

const tipoLabels: Record<string, string> = {
  low: 'Leve',
  medium: 'Intermedio',
  high: 'Alto',
}

const tipoColors: Record<string, string> = {
  low: 'bg-yellow-300',
  medium: 'bg-orange-400',
  high: 'bg-red-500',
}

export default function Bitacora() {
  const selectedKey = localStorage.getItem('user_id') || ''
  const [items, setItems] = useState<BitacoraItem[]>([])
  const [showImg, setShowImg] = useState<string | null>(null)
  const [sort, setSort] = useState<'recientes' | 'antiguos'>('recientes')

  useEffect(() => {
    if (!selectedKey) return

    const fetchBitacora = async () => {
      try {
        const response = await fetch(
          `https://api-257470668223.us-central1.run.app/v1/key_logger/warning/${selectedKey}`
        )
        const data = await response.json()
        const warnings = data.warnings
        console.log(warnings)

        if (Array.isArray(warnings)) {
          const mapped = warnings.map((item: any) => ({
            hora: item.created_at,
            tipo: item.importance,
            descripcion: item.description || item.descripcion || '',
            imagen: item.image || item.img || '',
          }))
          setItems(mapped)
        } else {
          setItems([])
        }
      } catch {
        setItems([])
      }
    }
    fetchBitacora()
  }, [selectedKey])

  const sortedItems = [...items].sort((a, b) => {
    if (sort === 'recientes') {
      return new Date(b.hora).getTime() - new Date(a.hora).getTime()
    } else {
      return new Date(a.hora).getTime() - new Date(b.hora).getTime()
    }
  })

  const totalAlertas = items.length
  const porTipo: Record<string, number> = { low: 0, medium: 0, high: 0 }
  items.forEach((i) => {
    if (porTipo[i.tipo] !== undefined) porTipo[i.tipo]++
  })

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-left text-6xl font-bold p-4">Resumen de Bitácora</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-card rounded-xl shadow p-6 flex flex-col items-center">
          <div className="text-3xl font-bold text-primary mb-2">
            {totalAlertas}
          </div>
          <div className="text-sm text-muted-foreground">Total de alertas</div>
        </div>
        <div className="bg-card rounded-xl shadow p-6 flex flex-col items-center">
          <div className="text-lg font-semibold mb-2">Alertas totales por tipo</div>
          <div className="flex gap-3">
            {Object.keys(porTipo).map((tipo) => (
              <div
                key={tipo}
                className={`flex flex-col text-black items-center ${tipoColors[tipo] || ''} rounded p-2 min-w-[60px]`}
              >
                <span className="text-lg font-bold text-black">
                  {porTipo[tipo]}
                </span>
                <span className="text-xs text-black">
                  {tipoLabels[tipo] || tipo}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <button
            className={`px-3 py-1 rounded ${sort === 'recientes' ? 'bg-primary text-black' : 'bg-muted'}`}
            onClick={() => setSort('recientes')}
          >
            Más recientes
          </button>
          <button
            className={`px-3 py-1 rounded ${sort === 'antiguos' ? 'bg-primary text-black' : 'bg-muted'}`}
            onClick={() => setSort('antiguos')}
          >
            Más antiguos
          </button>
        </div>
      </div>
      <div className="w-full flex flex-col gap-2">
        {sortedItems.length === 0 && (
          <div className="w-full text-center text-muted-foreground">
            Sin registros en la bitácora
          </div>
        )}
        {sortedItems.map((item, idx) => (
          <div
            key={idx}
            className="w-full bg-card rounded-xl shadow border border-gray-200 p-4 flex flex-col gap-2"
          >
            <div className="w-full flex items-center justify-between mb-1">
              <span className="text-xs text-gray-500 font-mono">
                {new Date(item.hora).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })}
              </span>
              <span className={`text-xs px-2 py-1 rounded-full font-semibold ${tipoColors[item.tipo] || 'bg-gray-300'} text-black ml-2`}>
                {tipoLabels[item.tipo] || item.tipo}
              </span>
            </div>
            <div className="text-base font-medium text-left mb-1">
              {item.descripcion}
            </div>
            {item.imagen && (
              <button
                className="self-start mt-1 px-3 py-1 rounded-lg bg-blue-500 text-white text-xs hover:bg-blue-700"
                onClick={() => setShowImg(item.imagen!)}
              >
                Ver captura de pantalla del momento
              </button>
            )}
          </div>
        ))}
        {showImg && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-4 shadow-lg flex flex-col items-center">
              <img src={`data:image/png;base64,${showImg}`} alt="Evidencia" className="max-w-[80vw] max-h-[80vh]" />
              <button
                className="mt-4 px-4 py-2 rounded bg-blue-900 text-white font-semibold hover:bg-blue-700"
                onClick={() => setShowImg(null)}
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
