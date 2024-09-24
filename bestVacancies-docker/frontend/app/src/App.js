import React from 'react';
import {Navigate, Route, Routes} from 'react-router-dom';
import {useDispatch} from "react-redux";
import Vacancies from './components/VacanciesPage';
import Login from './components/Login';
import Signup from './components/Signup';
import MyVacancies from './components/MyVacanciesPage';
import ProtectedRoute from './components/ProtectedRoute';
import VacancyDetails from "./components/VacancyDetails";
import CreateVacancyPage from "./components/CreateVacancyPage";
import ActiveVacancies from "./components/ActiveVacancies";

const App = () => {
    return (
        <Routes>
            {/*Открытые маршруты */}
            <Route path="/login" element={<Login/>}/>
            <Route path="/signup" element={<Signup/>}/>

            {/*Доступно обоим типам пользователей */}
            <Route
                path="/vacancies"
                element={
                    <ProtectedRoute allowedRoles={['applicant', 'employer']}>
                        <Vacancies/>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/my-vacancies/:vacancyId"
                element={
                    <ProtectedRoute allowedRoles={['applicant', 'employer']}>
                        <MyVacancies/>
                    </ProtectedRoute>
                }
            />

            {/*Маршруты для соискателей*/}
            <Route
                path="/my-vacancies"
                element={
                    <ProtectedRoute allowedRoles={['applicant']}>
                        <MyVacancies/>
                    </ProtectedRoute>
                }
            />

            {/* Маршруты для компаний */}
            ActiveVacancies по адресу /active-vacancies(Тут должен быть список активных вакансий которые создала эта
            компания)
            <Route
                path="/active-vacancies"
                element={
                    <ProtectedRoute allowedRoles={['employer']}>
                        <ActiveVacancies/>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/active-vacancy/:id"
                element={
                    <ProtectedRoute allowedRoles={['employer']}>
                        <ActiveVacancies/>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/create-vacancy"
                element={
                    <ProtectedRoute allowedRoles={['employer']}>
                        <CreateVacancyPage/>
                    </ProtectedRoute>
                }
            />

            {/* Редирект на страницу входа, если маршрут не найден */}
            <Route path="*" element={<Navigate to="/login"/>}/>
        </Routes>
    );
};

export default App;

