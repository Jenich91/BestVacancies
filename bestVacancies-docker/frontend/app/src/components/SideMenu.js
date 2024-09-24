import React from 'react';
import styled from 'styled-components';
import logout_icon from './icons/logout.png';
import vacancies_icon from './icons/vacancies.png';
import vacancies2_icon from './icons/vacancies2.png';
import create_vacancy_icon from './icons/create_vacancy.png';
import {Link, useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from "react-redux";

const SideMenuContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 15vw;
  height: 100vh;
  background-color: #f0f0f0;
  padding: 30px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const iconStyle = `
  width: 34px;
  height: 34px;
`;

const MenuItem = styled.div`
  margin: 50px 0; /* Отступы сверху и снизу для MenuItem */
  display: flex;
  flex-direction: column;
  align-items: center;

  img {
    ${iconStyle}
  }
`;

const LogoutItem = styled(MenuItem)`
  margin-top: auto; /* Позволяет элементу занимать оставшееся пространство */
  margin-bottom: 50vh; /* Отступ снизу */
`;

const SideMenu = () => {
    const user = useSelector(state => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    function handleLogout() {
        dispatch({type: 'RESET_USER'});
        dispatch({type: 'RESET_VACANCIES'});
        dispatch({type: 'RESET_RESPONSES'});

        navigate('/login');
    }

    if (user.user_type === 'applicant') {
        return (
            <SideMenuContainer>
                <MenuItem>
                    <img src={vacancies_icon} alt="Логотип"/>
                    <Link to="/vacancies">Vacancies</Link>
                </MenuItem>
                <MenuItem>
                    <img src={vacancies2_icon} alt="Логотип"/>
                    <Link to="/my-vacancies">My Vacancies</Link>
                </MenuItem>
                <LogoutItem onClick={handleLogout}>
                    <img src={logout_icon} alt="Логотип"/>
                    <Link to="/login">Logout</Link>
                </LogoutItem>
            </SideMenuContainer>
        );
    }

    return (
        <SideMenuContainer>
            <MenuItem>
                <img src={vacancies_icon} alt="Логотип"/>
                <Link to="/vacancies">Vacancies</Link>
            </MenuItem>
            <MenuItem>
                <img src={vacancies2_icon} alt="Логотип"/>
                <Link to="/active-vacancies">Active vacancies</Link>
            </MenuItem>
            <MenuItem>
                <img src={create_vacancy_icon} alt="Логотип"/>
                <Link to="/create-vacancy">Create vacancy</Link>
            </MenuItem>
            <LogoutItem onClick={handleLogout}>
                <img src={logout_icon} alt="Логотип"/>
                <Link to="/login">Logout</Link>
            </LogoutItem>
        </SideMenuContainer>
    );
};

export default SideMenu;
