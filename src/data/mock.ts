import type { Category, Phrase } from '../types';

export const CATEGORIES: Category[] = [
  {
    id: 'urgente',
    title: 'Urgente',
    icon: 'AlertTriangle',
    color: 'bg-red-50 text-red-600 border-red-200',
  },
  {
    id: 'respiracion',
    title: 'Respiración',
    icon: 'Wind',
    color: 'bg-blue-50 text-blue-600 border-blue-200',
  },
  {
    id: 'secreciones',
    title: 'Aspiración',
    icon: 'Droplets',
    color: 'bg-cyan-50 text-cyan-600 border-cyan-200',
  },
  {
    id: 'dolor',
    title: 'Dolor',
    icon: 'Activity',
    color: 'bg-orange-50 text-orange-600 border-orange-200',
  },
  {
    id: 'posicion',
    title: 'Posición',
    icon: 'Move',
    color: 'bg-indigo-50 text-indigo-600 border-indigo-200',
  },
  {
    id: 'familia',
    title: 'Familia',
    icon: 'Users',
    color: 'bg-purple-50 text-purple-600 border-purple-200',
  },
  {
    id: 'necesidades',
    title: 'Necesidades',
    icon: 'Coffee',
    color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  },
  {
    id: 'emociones',
    title: 'Emociones',
    icon: 'Heart',
    color: 'bg-pink-50 text-pink-600 border-pink-200',
  },
];

export const MOCK_PHRASES: Phrase[] = [
  { id: 'p1', text: 'Tengo dolor', categoryId: 'dolor' },
  { id: 'p2', text: 'El dolor es insoportable', categoryId: 'dolor' },
  { id: 'p3', text: 'Me falta el aire', categoryId: 'respiracion' },
  { id: 'p4', text: 'Siento que me ahogo', categoryId: 'respiracion' },
  { id: 'p5', text: 'Necesito que me aspiren', categoryId: 'secreciones' },
  { id: 'p6', text: 'Tengo muchas secreciones', categoryId: 'secreciones' },
  { id: 'p7', text: 'Quiero cambiar de posición', categoryId: 'posicion' },
  { id: 'p8', text: 'Estoy incómodo en esta postura', categoryId: 'posicion' },
  { id: 'p9', text: 'Quiero ver a mi familia', categoryId: 'familia' },
  { id: 'p10', text: '¿Pueden llamar a mi familia?', categoryId: 'familia' },
  { id: 'p11', text: 'Tengo sed / Necesito agua', categoryId: 'necesidades' },
  {
    id: 'p12',
    text: 'Necesito ayuda para ir al baño',
    categoryId: 'necesidades',
  },
  { id: 'p13', text: 'Tengo frío', categoryId: 'necesidades' },
  { id: 'p14', text: 'Tengo mucho miedo', categoryId: 'emociones' },
  { id: 'p15', text: 'Estoy frustrado', categoryId: 'emociones' },
  { id: 'p16', text: 'Gracias por ayudarme', categoryId: 'emociones' },
  { id: 'p17', text: 'Sí', categoryId: 'emociones' },
  { id: 'p18', text: 'No', categoryId: 'emociones' },
];
