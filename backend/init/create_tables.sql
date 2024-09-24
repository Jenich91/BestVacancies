\c jobsearch;

DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    login VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    user_type VARCHAR(50) NOT NULL, -- 'applicant' или 'employer'
    company_name VARCHAR(255), -- Для работодателей
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS vacancies CASCADE;
CREATE TABLE vacancies (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    creator_id INT NOT NULL, -- Добавляем поле для идентификатора создателя
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (creator_id) REFERENCES users(id) -- Связываем с таблицей users
);

DROP TABLE IF EXISTS vacanciesResponses CASCADE;
CREATE TABLE vacanciesResponses (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    vacancy_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (vacancy_id) REFERENCES vacancies(id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS vacancy_details CASCADE;
CREATE TABLE vacancy_details (
    id SERIAL PRIMARY KEY,
    vacancy_id INT NOT NULL,
    english_lvl VARCHAR(255),
    grade VARCHAR(255),
    tags TEXT[],
    FOREIGN KEY (vacancy_id) REFERENCES vacancies(id)
);

ALTER TABLE vacancy_details
DROP CONSTRAINT vacancy_details_vacancy_id_fkey;

ALTER TABLE vacancy_details
ADD CONSTRAINT vacancy_details_vacancy_id_fkey
FOREIGN KEY (vacancy_id) REFERENCES vacancies(id) ON DELETE CASCADE;
