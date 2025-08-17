
import CrearAlerta from '@/components/custom/CrearAlerta'
import Alertas from '@/components/custom/Alertas'
import Denuncias from '@/components/custom/Denuncias'
import LiveFeed from '@/components/custom/LiveFeed'
import { useState } from 'react';


export default function About() {
  const [alertCounts, setAlertCounts] = useState({ leve: 0, intermedio: 0, alto: 0 });
  return (
    <div className="flex min-h-svh flex-col items-center bg-background justify-center">
      <section className="grid grid-cols-[3fr_2fr] w-full py-5 px-6 gap-x-4">
        <div className="w-full text-center py-20 bg-card shadow-xs rounded-2xl">
          <h1 className="text-2xl font-bold">Live feed</h1>
          <LiveFeed onTipoCountChange={setAlertCounts} />
        </div>
        <div className="flex flex-col gap-y-4">
          <div className="w-full text-center py-6 bg-card shadow-xs rounded-xl">
            <h1 className="text-base font-semibold p-2">Crea tu propia alerta</h1>
            <CrearAlerta />
          </div>
          <div className="w-full text-center py-6 bg-card shadow-xs rounded-xl">
            <h1 className="text-base font-semibold">Alertas que ha obtenido</h1>
            <Alertas {...alertCounts} />
          </div>
        </div>
      </section>
      <section className="w-full py-5 px-6">
        <div className="w-full text-center py-6 bg-card shadow-xs rounded-xl">
          <h1 className="text-base font-semibold">Sex offenders</h1>
          <Denuncias />
        </div>
      </section>
    </div>
  )
}
