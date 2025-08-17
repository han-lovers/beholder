import { useEffect, useState } from 'react'

interface Denuncia {
  name_tag: string
  app: string
  description: string
  image_base64?: string
}

export default function Denuncias() {
  const [denuncias, setDenuncias] = useState<Denuncia[]>([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState<Denuncia>({
    name_tag: '',
    app: '',
    description: '',
    image_base64: '',
  })

  useEffect(() => {
    const getDenuncias = async () => {
      try {
        const response = await fetch(
          `https://api-257470668223.us-central1.run.app/v1/web/blacklist/get`
        )
        const data = await response.json()
        console.log(data)
        setDenuncias(data.sex_offenders)
      } catch (err) {
        console.error(err)
      }
    }

    getDenuncias()
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      setFormData({ ...formData, image_base64: reader.result as string })
    }
    reader.readAsDataURL(file) // convierte en base64
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      console.log(formData)
      const response = await fetch(
        'https://api-257470668223.us-central1.run.app/v1/web/blacklist/add',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        }
      )

      const result = await response.json()
      console.log(result)
      alert('Se ha mandado la denuncia')
      setShowForm(false)
    } catch (err) {
      console.error(err)
      alert('Error al enviar denuncia')
    }
  }

  return (
    <div className="w-full flex flex-col items-center p-10">
      {showForm ? (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center z-50">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-left space-y-4"
          >
            <h2 className="text-2xl font-bold text-black">Nueva denuncia</h2>

            <h3>Name Tag</h3>
            <input
              type="text"
              placeholder="Inserte el Name Tag"
              value={formData.name_tag}
              onChange={(e) =>
                setFormData({ ...formData, name_tag: e.target.value })
              }
              className="w-full border text-black px-4 py-2 rounded bg-gray-300"
              required
            />

            <h3>App </h3>
            <input
              type="text"
              placeholder="Inserte la App"
              value={formData.app}
              onChange={(e) =>
                setFormData({ ...formData, app: e.target.value })
              }
              className="w-full border text-black px-4 py-2 rounded bg-gray-300"
              required
            />

            <h3>Descripción</h3>
            <textarea
              placeholder="Complete con una descripción"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full border text-black px-4 py-2 rounded bg-gray-300"
              required
            />

            <label
              htmlFor="file-upload"
              className="cursor-pointer px-6 py-2 rounded bg-blue-500 text-white font-semibold hover:bg-blue-700 inline-block"
            >
              Subir imagen
            </label>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="flex justify-between">
              <button
                type="submit"
                className="px-6 py-2 rounded bg-blue-900 text-white font-semibold hover:bg-blue-700"
              >
                Enviar
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-2 rounded bg-gray-300 text-black font-semibold hover:bg-gray-400"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      ) : (
        <>
          <table className="w-full mx-auto bg-card rounded-xl shadow-lg overflow-hidden text-center">
            <thead className="bg-muted">
              <tr>
                <th className="py-3 px-4">Name Tag</th>
                <th className="py-3 px-4">App</th>
                <th className="py-3 px-4">Descripción</th>
              </tr>
            </thead>
            <tbody>
              {denuncias.map((d, i) => (
                <tr key={i} className="border-b last:border-b-0 bg-background">
                  <td className="py-3 px-4">{d.name_tag}</td>
                  <td className="py-3 px-4">{d.app}</td>
                  <td className="py-3 px-4">{d.description}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            className="mt-6 px-6 py-2 rounded bg-blue-900 text-white font-semibold hover:bg-blue-700"
            onClick={() => setShowForm(true)}
          >
            Agregar denuncia
          </button>
        </>
      )}
    </div>
  )
}
