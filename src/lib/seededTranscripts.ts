import type { ParsedItem } from '@/lib/types/forms';

export const SEEDED = {
  scope: {
    en: 'Ran 3/4" Type L copper through the east wall from riser to room 204. Set three 1/2" brass shutoff valves. Pressure-tested at 125 psi, held for 30 min, no leaks. Tony helped stage materials; Miguel ran the 2nd floor supply extensions.',
    es: 'Pasamos cobre tipo L de 3/4" por la pared este desde la subida hasta la habitación 204. Instalamos tres válvulas de cierre de latón de 1/2". Probamos a presión de 125 psi durante 30 minutos sin fugas. Tony ayudó a preparar materiales; Miguel hizo las extensiones de suministro del 2do piso.',
  },
  dwoMaterials: [
    { qty: 30, unit: 'ft', name: '3/4" Type L copper',      supplier: 'Ferguson', amount: 480 },
    { qty: 14, unit: null, name: '1/2" brass ball valve',   supplier: 'Ferguson', amount: 224 },
    { qty: 1,  unit: null, name: 'Propress fitting kit',    supplier: 'Ferguson', amount: 1240 },
  ] as ParsedItem[],
  reqMaterials: [
    { qty: 40, unit: null, name: '1" PVC schedule 40',     supplier: 'Ferguson', source: 'order' },
    { qty: 20, unit: null, name: '3/4" copper elbow',      supplier: 'Ferguson', source: 'shop' },
    { qty: 6,  unit: null, name: '2" Watts 909 RPZ',       supplier: 'Winsupply', source: 'order' },
  ] as ParsedItem[],
  reqTools: [
    { qty: 1, unit: null, name: 'Propress jaw set, 1" and 1-1/4"', supplier: 'Shop' },
    { qty: 2, unit: null, name: 'Pipe stand (tall)',                supplier: 'Shop' },
  ] as ParsedItem[],
  reqNotes: {
    en: "Need everything by Thursday morning — we're racing the concrete pour Friday. If 1\" PVC is back-ordered at Ferguson, try Winsupply before substituting.",
    es: 'Necesito todo para el jueves por la mañana — vamos a contrarreloj con la colada de concreto del viernes. Si el PVC de 1" está agotado en Ferguson, prueba Winsupply antes de sustituir.',
  },
  problemNote: {
    en: 'Waiting on electrical rough-in at the east wall — GC says Monday earliest. Blocking our top-out there.',
    es: 'Esperando que terminen el cableado eléctrico en la pared este — el GC dice que lunes lo más pronto. Nos está bloqueando el remate ahí.',
  },
};
