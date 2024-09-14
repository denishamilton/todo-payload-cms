import type { CollectionConfig } from 'payload';

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email', // Используем электронный адрес как заголовок
  },
  auth: true, // Включаем авторизацию для этой коллекции, это значит что коллекция будет доступна только зарегистрированным пользователям
  fields: [
    // Email added by default
    // Add more fields as needed
  ],
};
