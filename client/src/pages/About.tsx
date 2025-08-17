export default function About() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center">
      <section className="grid grid-cols-[3fr_2fr] w-full py-5 px-6 gap-x-4">
        <div className="w-full text-center py-20 bg-card shadow-xs rounded-2xl">
          <h1 className="text-2xl font-bold">Live feed</h1>
        </div>

        <div className="w-full text-center py-20 bg-card shadow-xs rounded-2xl">
          <h1 className="text-2xl font-bold">Crea tu propia alerta</h1>
        </div>
      </section>


      <section className="grid grid-cols-[2fr_3fr] w-full py-5 px-6 gap-x-4">
        <div className="w-full text-center py-20 bg-card shadow-xs rounded-2xl">
          <h1 className="text-2xl font-bold">Sex offenders</h1>
        </div>

        <section className="grid grid-rows-[3fr_2fr] w-full py-5 px-6 gap-x-4 gap-y-4">
          <div className="w-full text-center py-20 bg-card shadow-xs rounded-2xl">
            <h1 className="text-2xl font-bold">Bitacora</h1>
          </div>
          <div className="w-full text-center py-20 bg-card shadow-xs rounded-2xl">
            <h1 className="text-2xl font-bold">Alertas</h1>
          </div>
        </section>


      </section>

    </div>
  )
}
