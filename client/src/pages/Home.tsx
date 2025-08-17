import { Shield, AlertTriangle, Eye, BookOpen } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <section className="w-full p-6 text-center py-20 bg-card shadow-xs rounded-2xl">
        <h1 className="text-8xl font-bold text-primary mb-6">Beholder</h1>
        <p className="text-lg max-w-2xl mx-auto mb-8">
          La seguridad digital para tus hijos, en tiempo real. Beholder conecta
          el dispositivo de tus hijos con los padres, detectando señales de
          violencia, grooming o comportamientos de riesgo.
        </p>
      </section>

      <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto py-16 px-6">
        <div className="bg-card rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition">
          <Eye className="w-10 h-10 text-indigo-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Monitoreo en vivo</h3>
          <p className="mb-1">
            Supervisa en tiempo real lo que tu hijo escribe mientras juega o
            navega.
          </p>
        </div>

        <div className="bg-card rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition">
          <AlertTriangle className="w-10 h-10 text-indigo-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Detección de riesgos</h3>
          <p className="mb-1">
            Beholder identifica grooming, violencia y mensajes peligrosos al
            instante.
          </p>
        </div>

        <div className="bg-card rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition">
          <Shield className="w-10 h-10 text-indigo-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">
            Advertencias y aprendizaje
          </h3>
          <p className="mb-1">
            El hijo recibe un pop-up y debe escribir frases como
            <span className="italic"> “No debo hablar así”</span>.
          </p>
        </div>

        <div className="bg-card rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition">
          <BookOpen className="w-10 h-10 text-indigo-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Bitácora para padres</h3>
          <p className="mb-1">
            Obtén un historial claro de advertencias y un feed en vivo de la
            actividad.
          </p>
        </div>
      </section>

      <section className="grid md:grid-cols-2 lg:grid-cols-2 gap-6 w-full py-16 px-6">
        <div className="w-full max-w-3xl mx-auto text-center py-20 bg-card shadow-xs rounded-2xl">
          <h2 className="text-3xl font-semibold text-primary mb-6">
            ¡La tranquilidad digital empieza con Beholder!
          </h2>
        </div>

        <div className="w-full max-w-3xl mx-auto p-6 text-center py-20 bg-card shadow-xs rounded-2xl">
          <p className="text-2xl max-w-xl mx-auto mb-8">
            Protege a tus hijos y enséñales a navegar con responsabilidad.
          </p>
        </div>
      </section>
    </div>
  )
}
