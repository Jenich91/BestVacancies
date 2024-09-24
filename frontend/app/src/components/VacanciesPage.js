import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import SideMenu from './SideMenu';
import VacanciesListComponent from './VacanciesList';
import styled from 'styled-components';
import {fetchVacancies} from "./Login";

export const PageContainer = styled.div`
  display: flex;
  overflow: hidden;;
`;

export const SideMenuContainer = styled.div`
  flex: 0 0 30%;
`;

export const VacanciesListContainer = styled.div`
  flex: 0 0 80%;
  //padding: 20px;
`;

const VacanciesComponent = () => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);
    const vacancies = useSelector(state => state.vacancies);
    const vacanciesResponses = useSelector(state => state.responses);

    useEffect(() => {
        if (vacancies.length !== 0) {
            async function fetchData() {
                const data = await fetchVacancies();
                dispatch({type: 'SET_VACANCIES', payload: data});
            }

            fetchData();
        }
    }, [dispatch]);

    async function sendRegisterVacancyResponse(userId, vacancyId) {
        return await fetch('http://localhost:5000/registerVacancyResponse', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({userId: userId, vacancyId: vacancyId}),
        });
    }

    const handleVacancyClick = async (vacancy) => {
        const hasResponded = vacanciesResponses.some(responseVacancy => responseVacancy.id === vacancy.id);
        if (hasResponded) {
            alert('You have already responded to this vacancy.');
            return;
        }

        try {
            const responseStatus = (await sendRegisterVacancyResponse(user.id, vacancy.id)).ok;
            if (responseStatus) {
                dispatch({type: 'ADD_RESPONSE', payload: vacancy});
            }
        } catch (e) {
            console.error('Error during fetch:', e);
        }
    };

    return (
        <PageContainer>
            <SideMenuContainer>
                <SideMenu/>
            </SideMenuContainer>
            <VacanciesListContainer>
                <VacanciesListComponent vacancies={vacancies}
                                        onVacancyClick={handleVacancyClick}/>
            </VacanciesListContainer>
        </PageContainer>
    );
};

export default VacanciesComponent;