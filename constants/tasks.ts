export const CATEGORIES = [
  { id: 'General', icon: 'list', color: '#8c8caaff' },
  { id: 'Trabajo', icon: 'briefcase', color: '#5856D6' },
  { id: 'Personal', icon: 'person', color: '#34C759' },
  { id: 'Urgente', icon: 'flash', color: '#FF3B30' },
];

export const getCategoryById = (id: string | string[] | undefined) => {
  return CATEGORIES.find(c => c.id === id) || CATEGORIES[0];
};