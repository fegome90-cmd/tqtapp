export type CategoryId =
  | 'urgente'
  | 'dolor'
  | 'respiracion'
  | 'secreciones'
  | 'posicion'
  | 'familia'
  | 'necesidades'
  | 'emociones'
  | 'gratitud';

export interface Category {
  id: CategoryId;
  title: string;
  icon: string;
  color: string;
  description?: string;
}

export interface Phrase {
  id: string;
  text: string;
  categoryId: CategoryId;
}
