import type { Category, PhraseTemplate } from '../types';

export const CATEGORIES: Category[] = [
  {
    id: 'urgente',
    title: 'Urgente',
    icon: 'AlertTriangle',
    color: 'bg-red-50 text-red-600 border-red-200',
    description: 'Necesito atención inmediata',
  },
  {
    id: 'respiracion',
    title: 'Respiración',
    icon: 'Wind',
    color: 'bg-blue-50 text-blue-600 border-blue-200',
    description: 'Dificultad para respirar',
  },
  {
    id: 'secreciones',
    title: 'Aspiración',
    icon: 'Droplets',
    color: 'bg-cyan-50 text-cyan-600 border-cyan-200',
    description: 'Necesito que me aspiren secreciones',
  },
  {
    id: 'dolor',
    title: 'Dolor',
    icon: 'Activity',
    color: 'bg-orange-50 text-orange-600 border-orange-200',
    description: 'Me duele algo',
  },
  {
    id: 'posicion',
    title: 'Posición',
    icon: 'Move',
    color: 'bg-indigo-50 text-indigo-600 border-indigo-200',
    description: 'Quiero cambiar de posición',
  },
  {
    id: 'familia',
    title: 'Familia',
    icon: 'Users',
    color: 'bg-purple-50 text-purple-600 border-purple-200',
    description: 'Quiero ver a mi familia',
  },
  {
    id: 'necesidades',
    title: 'Necesidades',
    icon: 'Coffee',
    color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    description: 'Tengo necesidades básicas',
  },
  {
    id: 'emociones',
    title: 'Emociones',
    icon: 'Heart',
    color: 'bg-pink-50 text-pink-600 border-pink-200',
    description: 'Expreso mis emociones',
  },
  {
    id: 'gratitud',
    title: 'Gratitud',
    icon: 'Star',
    color: 'bg-amber-50 text-amber-600 border-amber-200',
    description: 'Quiero agradecer',
  },
];

export const SEED_PHRASES: PhraseTemplate[] = [
  // Urgente (4 phrases)
  {
    id: 'urg-1',
    text: 'Necesito ayuda urgente',
    categoryId: 'urgente',
    isCustom: false,
    carePhase: [
      'preop',
      'hospitalization',
      'early-rehab',
      'late-rehab',
      'follow-up',
    ],
    isEmergency: true,
    sortOrder: 1,
  },
  {
    id: 'urg-2',
    text: 'No puedo respirar',
    categoryId: 'urgente',
    isCustom: false,
    carePhase: ['hospitalization', 'early-rehab'],
    isEmergency: true,
    sortOrder: 2,
  },
  {
    id: 'urg-3',
    text: 'Me estoy ahogando',
    categoryId: 'urgente',
    isCustom: false,
    carePhase: ['hospitalization', 'early-rehab'],
    isEmergency: true,
    sortOrder: 3,
  },
  {
    id: 'urg-4',
    text: 'Llamen al médico por favor',
    categoryId: 'urgente',
    isCustom: false,
    carePhase: ['hospitalization', 'early-rehab'],
    isEmergency: true,
    sortOrder: 4,
  },

  // Respiración (4 phrases)
  {
    id: 'resp-1',
    text: 'Me falta el aire',
    categoryId: 'respiracion',
    isCustom: false,
    carePhase: ['hospitalization', 'early-rehab', 'late-rehab'],
    isEmergency: false,
    sortOrder: 1,
  },
  {
    id: 'resp-2',
    text: 'Siento que me ahogo',
    categoryId: 'respiracion',
    isCustom: false,
    carePhase: ['hospitalization', 'early-rehab'],
    isEmergency: false,
    sortOrder: 2,
  },
  {
    id: 'resp-3',
    text: 'Necesito mi cánula limpia',
    categoryId: 'respiracion',
    isCustom: false,
    carePhase: ['early-rehab', 'late-rehab', 'follow-up'],
    isEmergency: false,
    sortOrder: 3,
  },
  {
    id: 'resp-4',
    text: 'Tengo dificultad para respirar por la cánula',
    categoryId: 'respiracion',
    isCustom: false,
    carePhase: ['early-rehab', 'late-rehab'],
    isEmergency: false,
    sortOrder: 4,
  },

  // Secreciones (3 phrases)
  {
    id: 'sec-1',
    text: 'Necesito que me aspiren',
    categoryId: 'secreciones',
    isCustom: false,
    carePhase: ['hospitalization', 'early-rehab'],
    isEmergency: false,
    sortOrder: 1,
  },
  {
    id: 'sec-2',
    text: 'Tengo muchas secreciones',
    categoryId: 'secreciones',
    isCustom: false,
    carePhase: ['hospitalization', 'early-rehab'],
    isEmergency: false,
    sortOrder: 2,
  },
  {
    id: 'sec-3',
    text: 'Necesito aspirar las secreciones de la cánula',
    categoryId: 'secreciones',
    isCustom: false,
    carePhase: ['early-rehab', 'late-rehab', 'follow-up'],
    isEmergency: false,
    sortOrder: 3,
  },

  // Dolor (5 phrases)
  {
    id: 'dol-1',
    text: 'Tengo dolor',
    categoryId: 'dolor',
    isCustom: false,
    carePhase: ['hospitalization', 'early-rehab', 'late-rehab'],
    isEmergency: false,
    sortOrder: 1,
  },
  {
    id: 'dol-2',
    text: 'El dolor es insoportable',
    categoryId: 'dolor',
    isCustom: false,
    carePhase: ['hospitalization', 'early-rehab'],
    isEmergency: false,
    sortOrder: 2,
  },
  {
    id: 'dol-3',
    text: 'Me duele la zona de la cirugía',
    categoryId: 'dolor',
    isCustom: false,
    carePhase: ['hospitalization', 'early-rehab'],
    isEmergency: false,
    sortOrder: 3,
  },
  {
    id: 'dol-4',
    text: 'Necesito más analgesia',
    categoryId: 'dolor',
    isCustom: false,
    carePhase: ['hospitalization', 'early-rehab'],
    isEmergency: false,
    sortOrder: 4,
  },
  {
    id: 'dol-5',
    text: 'Me duele al tragar',
    categoryId: 'dolor',
    isCustom: false,
    carePhase: ['hospitalization', 'early-rehab', 'late-rehab'],
    isEmergency: false,
    sortOrder: 5,
  },

  // Posición (3 phrases)
  {
    id: 'pos-1',
    text: 'Quiero cambiar de posición',
    categoryId: 'posicion',
    isCustom: false,
    carePhase: ['hospitalization', 'early-rehab'],
    isEmergency: false,
    sortOrder: 1,
  },
  {
    id: 'pos-2',
    text: 'Estoy incómodo en esta postura',
    categoryId: 'posicion',
    isCustom: false,
    carePhase: ['hospitalization', 'early-rehab'],
    isEmergency: false,
    sortOrder: 2,
  },
  {
    id: 'pos-3',
    text: 'Quiero sentarme',
    categoryId: 'posicion',
    isCustom: false,
    carePhase: ['hospitalization', 'early-rehab'],
    isEmergency: false,
    sortOrder: 3,
  },

  // Familia (3 phrases)
  {
    id: 'fam-1',
    text: 'Quiero ver a mi familia',
    categoryId: 'familia',
    isCustom: false,
    carePhase: ['hospitalization', 'early-rehab'],
    isEmergency: false,
    sortOrder: 1,
  },
  {
    id: 'fam-2',
    text: '¿Pueden llamar a mi familia?',
    categoryId: 'familia',
    isCustom: false,
    carePhase: ['hospitalization', 'early-rehab'],
    isEmergency: false,
    sortOrder: 2,
  },
  {
    id: 'fam-3',
    text: 'Necesito hablar con mi acompañante',
    categoryId: 'familia',
    isCustom: false,
    carePhase: ['hospitalization'],
    isEmergency: false,
    sortOrder: 3,
  },

  // Necesidades (4 phrases)
  {
    id: 'nec-1',
    text: 'Tengo sed / Necesito agua',
    categoryId: 'necesidades',
    isCustom: false,
    carePhase: ['hospitalization', 'early-rehab'],
    isEmergency: false,
    sortOrder: 1,
  },
  {
    id: 'nec-2',
    text: 'Necesito ayuda para ir al baño',
    categoryId: 'necesidades',
    isCustom: false,
    carePhase: ['hospitalization', 'early-rehab'],
    isEmergency: false,
    sortOrder: 2,
  },
  {
    id: 'nec-3',
    text: 'Tengo frío',
    categoryId: 'necesidades',
    isCustom: false,
    carePhase: ['hospitalization'],
    isEmergency: false,
    sortOrder: 3,
  },
  {
    id: 'nec-4',
    text: 'Necesito mi pañuelo',
    categoryId: 'necesidades',
    isCustom: false,
    carePhase: ['hospitalization', 'early-rehab', 'late-rehab'],
    isEmergency: false,
    sortOrder: 4,
  },

  // Emociones (4 phrases)
  {
    id: 'emo-1',
    text: 'Tengo mucho miedo',
    categoryId: 'emociones',
    isCustom: false,
    carePhase: ['preop', 'hospitalization'],
    isEmergency: false,
    sortOrder: 1,
  },
  {
    id: 'emo-2',
    text: 'Estoy frustrado',
    categoryId: 'emociones',
    isCustom: false,
    carePhase: ['hospitalization', 'early-rehab'],
    isEmergency: false,
    sortOrder: 2,
  },
  {
    id: 'emo-3',
    text: 'Sí',
    categoryId: 'emociones',
    isCustom: false,
    carePhase: [
      'preop',
      'hospitalization',
      'early-rehab',
      'late-rehab',
      'follow-up',
    ],
    isEmergency: false,
    sortOrder: 3,
  },
  {
    id: 'emo-4',
    text: 'No',
    categoryId: 'emociones',
    isCustom: false,
    carePhase: [
      'preop',
      'hospitalization',
      'early-rehab',
      'late-rehab',
      'follow-up',
    ],
    isEmergency: false,
    sortOrder: 4,
  },

  // Gratitud (3 phrases)
  {
    id: 'gra-1',
    text: 'Gracias por ayudarme',
    categoryId: 'gratitud',
    isCustom: false,
    carePhase: ['hospitalization', 'early-rehab', 'late-rehab', 'follow-up'],
    isEmergency: false,
    sortOrder: 1,
  },
  {
    id: 'gra-2',
    text: 'Gracias por su paciencia',
    categoryId: 'gratitud',
    isCustom: false,
    carePhase: ['hospitalization', 'early-rehab', 'late-rehab', 'follow-up'],
    isEmergency: false,
    sortOrder: 2,
  },
  {
    id: 'gra-3',
    text: 'Muchas gracias, me siento mejor',
    categoryId: 'gratitud',
    isCustom: false,
    carePhase: ['hospitalization', 'early-rehab', 'late-rehab', 'follow-up'],
    isEmergency: false,
    sortOrder: 3,
  },
];

// Backward-compatible mapping: old p1-p18 IDs to new seed IDs
// Used to migrate any existing localStorage data
export const LEGACY_ID_MAP: Record<string, string> = {
  p1: 'dol-1', // 'Tengo dolor'
  p2: 'dol-2', // 'El dolor es insoportable'
  p3: 'resp-1', // 'Me falta el aire'
  p4: 'resp-2', // 'Siento que me ahogo'
  p5: 'sec-1', // 'Necesito que me aspiren'
  p6: 'sec-2', // 'Tengo muchas secreciones'
  p7: 'pos-1', // 'Quiero cambiar de posición'
  p8: 'pos-2', // 'Estoy incómodo en esta postura'
  p9: 'fam-1', // 'Quiero ver a mi familia'
  p10: 'fam-2', // '¿Pueden llamar a mi familia?'
  p11: 'nec-1', // 'Tengo sed / Necesito agua'
  p12: 'nec-2', // 'Necesito ayuda para ir al baño'
  p13: 'nec-3', // 'Tengo frío'
  p14: 'emo-1', // 'Tengo mucho miedo'
  p15: 'emo-2', // 'Estoy frustrado'
  p16: 'gra-1', // 'Gracias por ayudarme' (was emociones, now gratitud)
  p17: 'emo-3', // 'Sí'
  p18: 'emo-4', // 'No'
};

// Keep MOCK_PHRASES as a backward-compatible alias (plain Phrase objects)
// for existing tests that depend on the old structure
export const MOCK_PHRASES = SEED_PHRASES.map((p) => ({
  id: p.id,
  text: p.text,
  categoryId: p.categoryId,
}));
