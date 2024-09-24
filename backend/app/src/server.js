const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

// Подключение к PostgreSQL
const pool = new Pool({
    user: 'postgres',
    host: 'backend',
    database: 'jobsearch',
    password: '',
    port: 5432,
});

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

//  Регистрации пользователя
app.post('/signup', async (req, res) => {
    const { login, password, companyName, userType } = req.body;

    try {
        // Проверка уникальности логина
        const existingUser = await pool.query(
            'SELECT * FROM users WHERE login = $1',
            [login]
        );

        if (existingUser.rows.length > 0) {
            return res.status(400).json({ message: 'Логин уже занят' });
        }

        // Вставка нового пользователя в базу данных
        const result = await pool.query(
            'INSERT INTO users (login, password, user_type, company_name) VALUES ($1, $2, $3, $4) RETURNING *',
            [login, password, userType, userType === 'employer' ? companyName : null]
        );

        res.status(201).json({ user: result.rows[0] });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Error creating user' });
    }
});

//  Авторизации пользователя
app.post('/login', async (req, res) => {
    const { login, password } = req.body;

    try {
        const result = await pool.query('SELECT * FROM users WHERE login = $1', [login]);
        const user = result.rows[0];

        if (user && (password === user.password)) {
            res.status(200).json({ user });
        } else {
            res.status(401).json({ message: 'Invalid login or password' });
        }
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Error logging in' });
    }
});


//  Получения списка вакансий
app.get('/vacancies', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM vacancies');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching vacancies:', error);
        res.status(500).json({ message: error.message });
    }
});

//  Получения вакансий, на которые откликнулся пользователь
app.get('/my-vacancies/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        const result = await pool.query(`
            SELECT v.* FROM vacancies v
            JOIN vacanciesResponses vr ON v.id = vr.vacancy_id
            WHERE vr.user_id = $1
        `, [userId]);

        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching my vacancies:', error);
        res.status(500).json({ message: error.message });
    }
});

// Регистрация отклика
app.post('/registerVacancyResponse', async (req, res) => {
    const { userId, vacancyId } = req.body;

    try {
        // Вставка нового отклика в базу данных
        const result = await pool.query(
            'INSERT INTO vacanciesResponses (user_id, vacancy_id) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING *',
            [userId, vacancyId]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error' });
    }
});

// Получения информации о вакансии по ее идентификатору
app.get('/vacancies/:vacancyId', async (req, res) => {
    const vacancyId = req.params.vacancyId;

    try {
        const result = await pool.query(`
            SELECT v.*, vd.english_lvl, vd.grade, vd.tags
            FROM vacancies v
            LEFT JOIN vacancy_details vd ON v.id = vd.vacancy_id
            WHERE v.id = $1
        `, [vacancyId]);
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error' });
    }
});

// Запрос на удаление отклика на вакансию
app.delete('/vacanciesResponses', async (req, res) => {
    const { user_id, vacancy_id } = req.body;
    try {
        const result = await pool.query('DELETE FROM vacanciesResponses WHERE user_id = $1 AND vacancy_id = $2', [user_id, vacancy_id]);
        if (result.rowCount > 0) {
            res.status(200).json({ message: 'Response deleted successfully' });
        } else {
            res.status(404).json({ message: 'Response not found' });
        }
    } catch (error) {
        console.error('Error deleting response:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Запрос кол-ва откликов на вакансию
app.get('/responseVacancyCount', async (req, res) => {
    const { vacancyId } = req.query;

    try {
        const result = await pool.query(`
            SELECT v.id AS vacancy_id, COUNT(rv.id) AS responseCount 
            FROM vacancies v 
            LEFT JOIN vacanciesresponses rv ON v.id = rv.vacancy_id 
            WHERE v.id = $1 
            GROUP BY v.id;
        `, [vacancyId]);

        // Проверяем, есть ли результаты
        if (result.rows.length > 0) {
            const responseCount = result.rows[0].responsecount || 0; // Возвращаем 0, если откликов нет
            res.status(200).json({ responseCount });
        } else {
            res.status(404).json({ message: 'Vacancy not found' });
        }
    } catch (error) {
        console.error('Error by get vacancy response count:', error);
        res.status(500).json({ message: 'Error by get vacancy response count' });
    }
});

// Создание вакансии
app.post('/createVacancy', async (req, res) => {
    const { title, description, creator_id } = req.body; // Получаем creator_id из тела запроса

    try {
        const result = await pool.query(
            'INSERT INTO vacancies (title, description, creator_id) VALUES ($1, $2, $3) RETURNING *',
            [title, description, creator_id] // Передаем creator_id в запрос
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating vacancy:', error);
        res.status(500).json({ message: 'Error creating vacancy' });
    }
});

// Создание деталей вакансии
app.post('/createVacancyDetails', async (req, res) => {
    const { vacancy_id, english_level, grade, tags } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO vacancy_details (vacancy_id, english_lvl, grade, tags) VALUES ($1, $2, $3, $4)',
            [vacancy_id, english_level, grade, tags]
        );
        res.status(201).json({ message: 'Vacancy details created successfully' });
    } catch (error) {
        console.error('Error creating vacancy details:', error);
        res.status(500).json({ message: 'Error creating vacancy details' });
    }
});

// Получение активных вакансий, созданных пользователем
app.get('/active-vacancies/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        const result = await pool.query(`
            SELECT * FROM vacancies
            WHERE creator_id = $1
        `, [userId]);

        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching active vacancies:', error);
        res.status(500).json({ message: error.message });
    }
});

// Закрыть вакансию
app.delete('/closeVacancy', async (req, res) => {
    const { vacancyId } = req.body;

    try {
        // Затем удаляем вакансию
        await pool.query('DELETE FROM vacancies WHERE id = $1', [vacancyId]);

        res.status(200).json({ message: 'Vacancy closed successfully' });
    } catch (error) {
        console.error('Error closing vacancy:', error);
        res.status(500).json({ message: 'Error closing vacancy' });
    }
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});