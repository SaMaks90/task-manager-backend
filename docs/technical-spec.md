# 🧾 Технічне завдання: 
**Task Manager API з аутентифікацією, ролями, пагінацією, логуванням, сортуванням та Jest тестами**

## 🎯 Мета:
**Створити REST API для керування задачами із підтримкою аутентифікації, ролей користувачів, пагінації, сортування, логування та тестування.**

## ⚙️ Технології:
- NestJS (TypeScript)
- PostgreSQL
- Prisma
- JWT
- bcrypt
- Logger
- Jest

## Таблиця сутностей

| Сутність           | Призначення                  | Основні поля                                                                                 | Зв'язки                           |
| ------------------ | ---------------------------- | -------------------------------------------------------------------------------------------- | --------------------------------- |
| **User**           | Користувач системи           | id, email, username, password, role                                                          | hasMany Projects, Tasks, Comments |
| **Project**        | Проєкт, що об’єднує задачі   | id, name, description, ownerId, createdAt, updatedAt                                         | hasMany Tasks, hasMany Members    |
| **Task**           | Задача в проєкті             | id, title, description, status, priority, projectId, assignedToId, deadline, createdAt, etc. | belongsTo Project, User           |
| **TaskList**       | Секція задач у проєкті       | id, name, order, projectId                                                                   | hasMany Tasks                     |
| **Tag**            | Тег для задач                | id, name, color, projectId                                                                   | many-to-many with Tasks           |
| **Comment**        | Коментар до задачі           | id, content, taskId, userId, createdAt                                                       | belongsTo Task, User              |
| **Attachment**     | Файл, прикріплений до задачі | id, fileUrl, taskId, uploadedById, createdAt                                                 | belongsTo Task, User              |
| **ActivityLog**    | Лог змін по системі          | id, action, entity, entityId, userId, createdAt                                              | belongsTo User                    |
| **Team**           | Група користувачів           | id, name, ownerId                                                                            | hasMany Users                     |
| **TaskDependency** | Відношення залежності задач  | id, taskId, dependsOnId                                                                      | self-reference to Task            |

## 🧑‍🏫 Перелік ролей

| Роль      | Опис                                                                                 |
| --------- | ------------------------------------------------------------------------------------ |
| `admin`   | Повний доступ до всього: користувачів, задач, проєктів, прав                         |
| `manager` | Керує проєктами, задачами, користувачами в межах проєктів                            |
| `user`    | Базовий користувач: бачить свої задачі та завдання в проєктах                        |
| `auditor` | Має доступ лише для читання — проєкти, задачі, активності                            |
| `support` | Має доступ до задач та логів, але не може змінювати бізнес-дані (проєкти, ролі тощо) |


## 📦 Моделі:
**User**

  | Поле      | Тип       | Опис                                                   |
  |-----------|-----------|--------------------------------------------------------|
  | id        | uuid      | Унікальний ідентифікатор                               |
  | username  | string    | Ім'я користувача                                       |
  | email     | string    | Логін користувача                                      |
  | password  | string    | Захешований пароль                                     |
  | role      | enum      | Роль користувача (`user`, `admin`, `manager`, `guest`) |
  | createdAt | timestamp | Дата створення                                         |
  | updatedAt | timestamp | Дата оновлення                                         |

**Project**

| Поле        | Тип       | Опис                              |
| ----------- | --------- | --------------------------------- |
| id          | uuid      | Унікальний ідентифікатор          |
| name        | string    | Назва проєкту                     |
| description | text      | Опис проєкту                      |
| ownerId     | uuid      | ID користувача, що створив проєкт |
| createdAt   | timestamp | Дата створення                    |
| updatedAt   | timestamp | Дата оновлення                    |

**Task**

| Поле         | Тип       | Опис                                   |
| ------------ | --------- | -------------------------------------- |
| id           | uuid      | Унікальний ідентифікатор               |
| title        | string    | Заголовок задачі                       |
| description  | text      | Опис задачі                            |
| status       | enum      | Статус (`todo`, `in_progress`, `done`) |
| priority     | enum      | Пріоритет (`low`, `medium`, `high`)    |
| deadline     | date      | Дедлайн задачі                         |
| reminderAt   | datetime  | Час для нагадування                    |
| projectId    | uuid      | Проєкт, до якого належить задача       |
| listId       | uuid      | TaskList, до якого належить задача     |
| assignedToId | uuid      | Користувач, якому призначена задача    |
| createdById  | uuid      | Автор задачі                           |
| createdAt    | timestamp | Дата створення                         |
| updatedAt    | timestamp | Дата оновлення                         |

**Task List**

| Поле      | Тип     | Опис                     |
| --------- | ------- | ------------------------ |
| id        | uuid    | Унікальний ідентифікатор |
| name      | string  | Назва списку задач       |
| order     | integer | Порядок відображення     |
| projectId | uuid    | ID проєкту               |

**Tag**

| Поле      | Тип    | Опис                          |
| --------- | ------ | ----------------------------- |
| id        | uuid   | Унікальний ідентифікатор      |
| name      | string | Назва тегу                    |
| color     | string | Колір тегу (hex-код)          |
| projectId | uuid   | Проєкт, до якого належить тег |

**Comment**

| Поле      | Тип       | Опис                     |
| --------- | --------- | ------------------------ |
| id        | uuid      | Унікальний ідентифікатор |
| content   | text      | Текст коментаря          |
| taskId    | uuid      | Задача, до якої належить |
| userId    | uuid      | Автор коментаря          |
| createdAt | timestamp | Дата створення           |

**Attachment**

| Поле         | Тип       | Опис                     |
| ------------ | --------- | ------------------------ |
| id           | uuid      | Унікальний ідентифікатор |
| fileUrl      | string    | Посилання на файл        |
| taskId       | uuid      | ID задачі                |
| uploadedById | uuid      | Хто завантажив файл      |
| createdAt    | timestamp | Дата завантаження        |

**Activity Log**

| Поле      | Тип       | Опис                                 |
| --------- | --------- | ------------------------------------ |
| id        | uuid      | Унікальний ідентифікатор             |
| action    | string    | Опис дії (наприклад: `task_updated`) |
| entity    | string    | Сутність (`Task`, `Project`, ...)    |
| entityId  | uuid      | ID сутності                          |
| userId    | uuid      | ID користувача                       |
| createdAt | timestamp | Дата виконання дії                   |

**Task Dependency**

| Поле        | Тип  | Опис                     |
| ----------- | ---- | ------------------------ |
| id          | uuid | Унікальний ідентифікатор |
| taskId      | uuid | Основна задача           |
| dependsOnId | uuid | Залежить від цієї задачі |

## 📥 Ендпоінти:
- Аутентифікація:
  - POST    /auth/register                      Реєстрація 
  - POST    /auth/login                         Логін, отримання JWT
- Користувачі:
  - PATCH   /users/:id/role                     Змінити роль користувача (тільки для admin)
  - PATCH   /users/:id                          Оновити користувача
  - DELETE  /users/:id                          Вилучити користувача
  - GET	    /users/:id	                        Отримати деталі користувача (тільки для admin або самого user)
  - GET	    /users	                            Отримати список користувачів (admin only)
- Проєкти:
  - GET	    /projects	                        Отримати список проєктів (можна фільтрувати за owner або member)
  - GET	    /projects/:id	                    Отримати один проєкт 
  - POST	/projects	                        Створити новий проєкт 
  - PATCH	/projects/:id	                    Оновити проєкт 
  - DELETE	/projects/:id	                    Видалити проєкт 
  - POST	/projects/:id/members	            Додати учасника до проєкту (manager/admin only)
  - DELETE	/projects/:id/members/:userId	    Вилучити учасника з проєкту 
  - POST	/projects/:id/lists	                Додати список до проєкту 
  - GET	    /projects/:id/lists	                Отримати всі списки задач у проєкті
- Задачі:
  - GET	    /tasks	                            Список задач (з фільтрами, пагінацією, сортуванням)
  - GET	    /tasks/:id	                        Отримати задачу за ID 
  - POST	/tasks	                            Створити задачу (потрібно вказати проєкт)
  - PATCH	/tasks/:id	                        Оновити задачу 
  - DELETE	/tasks/:id	                        Видалити задачу 
  - POST	/tasks/:id/comments	                Додати коментар до задачі
  - POST	/tasks/:id/dependencies	            Додати залежність до задачі 
  - DELETE	/tasks/:id/dependencies/:depId	    Видалити залежність 
  - GET	    /tasks/:id/dependencies	            Отримати всі залежності задачі 
  - POST	/tasks/:id/attachments	            Додати вкладення до задачі (файл upload)
  - GET	    /tasks/:id/attachments	            Отримати всі вкладення задачі 
  - POST	/tasks/:id/tags	                    Прив'язати теги до задачі 
  - DELETE	/tasks/:id/tags/:tagId	            Видалити тег із задачі
- Коментарі:
  - POST	/comments	                        Додати коментар до задачі 
  - DELETE	/comments/:id	                    Видалити коментар 
  - PATCH	/comments/:id	                    Редагувати коментар
- Activity Log:
  - GET	    /activities	                        Отримати всі активності (admin або учасники проєкту)
  - GET	    /activities/task/:taskId	        Отримати активності для конкретної задачі 
  - GET	    /activities/project/:projectId	    Отримати активності проєкту 
  - POST	/activities	                        Додати запис вручну (опціонально, більшість буде автоматизовано)
- Attachment:
  - DELETE	/attachments/:id	                Видалити вкладення 
  - GET	    /attachments/:id/download	        Завантажити файл
- Tag:
  - GET	    /tags	                            Отримати всі теги 
  - POST	/tags	                            Створити новий тег 
  - PATCH	/tags/:id	                        Оновити тег 
  - DELETE	/tags/:id	                        Видалити тег
- Task List:
  - GET	    /lists	                            Отримати всі списки задач 
  - POST	/lists	                            Створити новий список задач 
  - PATCH	/lists/:id	                        Оновити список задач 
  - DELETE	/lists/:id	                        Видалити список задач

## 🛡️ Ролі та їх можливості CASL

| Сутність           | Admin                                     | Manager                            | User                                     | Support                              | Auditor                  |
| ------------------ | ----------------------------------------- | ---------------------------------- | ---------------------------------------- | ------------------------------------ | ------------------------ |
| **User**           | 🔄 Create, Read, Update, Delete, Set Role | 🔄 Read users in own projects      | 👤 Read self profile                     | 👁️ Read all                         | 👁️ Read all (read-only) |
| **Project**        | ✅ Full access                             | 🔄 CRUD для своїх проєктів         | 👁️ View проєкти, де є учасником         | ❌ No access to change, 👁️ Read only | 👁️ Read all             |
| **Task**           | ✅ Full access                             | 🔄 CRUD для задач в своїх проєктах | 🔄 Read/Update свої задачі, Create Tasks | 👁️ Read all tasks                   | 👁️ Read all             |
| **TaskList**       | ✅ Full access                             | 🔄 CRUD у власних проєктах         | 👁️ Read lists                           | 👁️ Read only                        | 👁️ Read only            |
| **Tag**            | ✅ Full access                             | 🔄 CRUD у власних проєктах         | 👁️ Read tags                            | 👁️ Read only                        | 👁️ Read only            |
| **Attachment**     | ✅ Full access                             | 🔄 CRUD у задачах                  | 🆕 Upload, Delete own files              | 👁️ View attachments                 | 👁️ Read only            |
| **ActivityLog**    | ✅ View all logs                           | 👁️ View logs in own projects      | 👁️ View logs on own actions             | 👁️ View all                         | 👁️ View all             |
| **TaskDependency** | ✅ CRUD між задачами                       | 🔄 CRUD для задач у своїх проєктах | 👁️ View dependencies                    | 👁️ Read only                        | 👁️ Read only            |


## 🧰 Основні вимоги:
- JWT авторизація та рольова модель (user, admin)
- Валідація даних 
- Пагінація через параметри page та limit 
- Сортування за createdAt, title, status (asc/desc)
- Логування через Winston/Pino (запити, помилки)
- Обробка помилок та захист ресурсів 
- Jest: юніт і інтеграційні тести (авторизація, CRUD задач, зміна ролі)

## ✅ Тестування (Jest):
- Тестування реєстрації та логіну 
- Тестування ролей і авторизації (доступ admin до зміни ролей)
- CRUD задач із перевіркою прав доступу 
- Пагінація та сортування у відповідях 
- Логування (mock Winston/Pino)