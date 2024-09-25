# Веб-приложение BestVacancies

## Описание проекта

Данное веб-приложение представляет собой платформу для поиска работы, где пользователи могут взаимодействовать в зависимости от их роли: соискатели и работодатели. В зависимости от типа пользователя, доступные функции и возможности различаются.
![userDemo GIF](/images/bestVacancies-demo.gif)

## Технологии

- **Frontend**:
  - **React**: Библиотека для построения пользовательского интерфейса.
  - **React Router**: Для управления маршрутизацией в приложении.
  - **Redux**: Для управления состоянием приложения.
  - **Styled Components**: Для стилизации компонентов.

- **Backend**:
  - **Node.js**: Среда выполнения JavaScript на сервере.
  - **Express**: Фреймворк для создания веб-приложений на Node.js.
  - **PostgreSQL**: Реляционная база данных для хранения данных.

## Архитектура приложения

Приложение состоит из двух типов пользователей:
- **Соискатели**: Пользователи, ищущие работу.
- **Работодатели**: Компании, размещающие вакансии.

Каждый тип пользователя имеет свои уникальные возможности и доступ к различным страницам приложения.

## Основные функции

- **Авторизация и регистрация**:
  - Пользователи могут зарегистрироваться как соискатели или работодатели.
  - Неавторизованные пользователи не имеют доступа к приложению.
  - При перезагрузке страницы состояние пользователя сохраняется.

- **Страницы приложения**:
  1. **Страница вакансий**: Доступна обоим типам пользователей; отображает список всех вакансий.
  2. **Страница вакансии**: Доступна обоим типам пользователей; показывает детали конкретной вакансии.
  3. **Страница "Мои вакансии"**: Доступна только соискателям; отображает вакансии, на которые они откликались.
  4. **Страница "Активные вакансии"**: Доступна только работодателям; показывает активные вакансии, созданные пользователем.
  5. **Страница "Активная вакансия"**: Доступна только работодателям; отображает конкретную активную вакансию.
  6. **Страница "Создать вакансию"**: Доступна только работодателям; позволяет создать новую вакансию.
  7. **Страница авторизации**: Для входа в систему.
  8. **Страница регистрации соискателя и компании**.

- **Функциональность для работодателей**:
  - Видит количество откликов на свои вакансии.
  - Может закрыть вакансию, которая не будет видна в общем списке, но останется доступной на странице "Активные вакансии".

- **Функциональность для соискателей**:
  - Вакансии, на которые они откликнулись, помечаются.
  - Не могут дважды откликнуться на одну и ту же вакансию, но могут отменить свой отклик.
    
- **Редиректы и ограничения доступа**:
  - Если соискатель попытается перейти на страницу создания вакансии, произойдет редирект на страницу вакансий.

## Структура маршрутов
Главная страница приложения располагается по адресу `/vacancies`.

## Используемые эндпоинты

- `POST /login` — Авторизация пользователя.
- `POST /signup` — Регистрация нового пользователя.
- `GET /vacancies` — Получение списка всех вакансий.
- `GET /vacancies/:id` — Получение информации о конкретной вакансии по ID.
- `POST /vacancies` — Создание новой вакансии (доступно только работодателям).
- `PUT /vacancies/:id` — Обновление информации о вакансии (доступно только работодателям).
- `DELETE /vacancies/:id` — Удаление вакансии (доступно только работодателям).
- `GET /my-vacancies` — Получение списка вакансий, на которые откликнулся соискатель.

## Запуск проекта с использованием Docker Compose

Для запуска сборки выполните следующие шаги:

1. Установите Docker на вашем компьютере.
2. Перейдите в корневую директорию проекта, где находится файл `docker-compose.yml`.
3. Введите в терминале команду:
   ```bash
   docker-compose up --build

4. Откройте браузер и перейдите по адресу http://localhost:3000.

