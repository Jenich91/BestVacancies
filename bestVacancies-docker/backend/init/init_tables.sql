\c jobsearch;

-- Вставка данных в таблицу users
INSERT INTO users (login, password, user_type, company_name) VALUES
('user1', 'pass', 'applicant', NULL),  -- Соискатель 1
('user2', 'pass', 'applicant', NULL),  -- Соискатель 2
('comp1', 'pass', 'employer', 'Company 1'),  -- Работодатель 1
('comp2', 'pass', 'employer', 'Company 2');  -- Работодатель 2

-- Вставка данных в таблицу вакансий
INSERT INTO vacancies (id, title, description, creator_id) VALUES
(1, 'Frontend Developer', 'We are looking for a skilled Frontend Developer with experience in React.js and JavaScript.', 3),
(2, 'Backend Developer', 'Join our team as a Backend Developer. Experience with Node.js and Express is required.', 3),
(3, 'Full Stack Developer', 'Seeking a Full Stack Developer with a passion for building scalable web applications.', 3),
(4, 'UI/UX Designer', 'We need a creative UI/UX Designer to help us improve user experience across our platforms.', 3),
(5, 'Data Scientist', 'Looking for a Data Scientist to analyze data and provide insights for business decisions.', 3),
(6, 'DevOps Engineer', 'Join our team as a DevOps Engineer to manage infrastructure and automate deployment processes.', 3),
(7, 'Product Manager', 'We are seeking a Product Manager to lead product development and strategy.', 4),
(8, 'Marketing Specialist', 'Looking for a Marketing Specialist to develop and implement marketing strategies.', 4),
(9, 'Quality Assurance Engineer', 'Join our team as a QA Engineer to ensure the quality of our software products.', 4),
(10, 'Sales Executive', 'We need a Sales Executive to drive sales and build relationships with clients.', 4);

-- Вставка данных в таблицу деталей вакансий
INSERT INTO vacancy_details (vacancy_id, english_lvl, grade, tags) VALUES
(1, 'Intermediate', 'A', ARRAY['JavaScript', 'React', 'Frontend', 'Web Development']),
(2, 'Advanced', 'B', ARRAY['Node.js', 'Express', 'Backend', 'API']),
(3, 'Intermediate', 'A', ARRAY['JavaScript', 'Node.js', 'React', 'Full Stack']),
(4, 'Advanced', 'B', ARRAY['UI Design', 'UX Design', 'Creative', 'Design']),
(5, 'Intermediate', 'A', ARRAY['Data Science', 'Machine Learning', 'Python', 'Analytics']),
(6, 'Advanced', 'B', ARRAY['DevOps', 'AWS', 'Docker', 'Automation']),
(7, 'Intermediate', 'A', ARRAY['Product Management', 'Strategy', 'Leadership', 'Agile']),
(8, 'Advanced', 'B', ARRAY['Marketing', 'Strategy', 'SEO', 'Content']),
(9, 'Intermediate', 'A', ARRAY['QA', 'Testing', 'Automation', 'Software Quality']),
(10, 'Advanced', 'B', ARRAY['Sales', 'Business Development', 'Client Relations', 'Negotiation']);