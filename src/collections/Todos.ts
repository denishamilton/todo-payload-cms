import type { CollectionConfig } from 'payload'

export const Todos: CollectionConfig = {
  slug: 'todos',
  access: {
    read: () => true, // разрешаем всем пользователям чтение записей без авторизации
    create: () => true, // разрешаем всем пользователям создание записей без авторизации
    update: () => true, // разрешаем всем пользователям обновление записей без авторизации
    delete: () => true, // разрешаем всем пользователям удаление записей без авторизации
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'completed',
      type: 'checkbox',
    },
  ],
}
