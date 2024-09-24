import React from 'react';
import {Navigate} from 'react-router-dom';
import {useSelector} from 'react-redux';

const ProtectedRoute = ({allowedRoles, children}) => {
    const user = useSelector(state => state.user);

    // Проверяем, есть ли пользователь и соответствует ли его тип разрешенным ролям
    const isAuthorized = user && allowedRoles.includes(user.user_type);

    if (!isAuthorized) {
        alert('Access denied');
        return <Navigate to="/login"/>; // Перенаправляем на страницу входа
    }

    return children; // Рендерим дочерний компонент, если авторизован
};

export default ProtectedRoute;
