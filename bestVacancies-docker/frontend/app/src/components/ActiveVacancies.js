import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import SideMenu from './SideMenu';
import VacanciesListComponent from './VacanciesList';
import VacancyDetailsComponent from './VacancyDetails';
import styled from 'styled-components';
import {PageContainer, SideMenuContainer, VacanciesListContainer} from "./VacanciesPage";
import {ContainerRowChild, ContainerRowParent} from "./MyVacanciesPage";

const VacancyDetailsContainer = styled.div`
  flex: 0 0 40%;
  padding: 20px;
`;

const ActiveVacanciesComponent = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);
    const [activeVacancies, setActiveVacancies] = useState([]);
    const [selectedVacancy, setSelectedVacancy] = useState(null);

    useEffect(() => {
        const fetchActiveVacancies = async () => {
            const response = await fetch(`http://localhost:5000/active-vacancies/${user.id}`);
            if (!response.ok) {
                console.error('Error fetching active vacancies:', response.statusText);
                return;
            }
            const data = await response.json();
            setActiveVacancies(data);
        };

        fetchActiveVacancies();
    }, [user.id]);

    const handleVacancyClick = async (vacancy) => {
        const response = await fetch(`http://localhost:5000/vacancies/${vacancy.id}`);
        if (!response.ok) {
            console.error('Error fetching vacancy:', response.statusText);
            return;
        }

        const data = await response.json();
        setSelectedVacancy(data);
    };

    const handleCloseVacancy = async (vacancy) => {
        // console.log('Closing vacancy with ID:', vacancy.id);
        const vacancy_id = vacancy.id
        try {
            const response = await fetch(`http://localhost:5000/closeVacancy`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    vacancyId: vacancy_id
                }),
            });

            if (response.ok) {
                // console.log('Vacancy closed successfully');
                setActiveVacancies(prev => prev.filter(vacancy => vacancy.id !== vacancy_id));
            } else {
                const errorData = await response.json();
                console.error('Error closing vacancy:', errorData.message);
            }
        } catch (error) {
            console.error('Error closing vacancy:', error);
        }
    };


    return (
        <PageContainer>
            <SideMenuContainer>
                <SideMenu/>
            </SideMenuContainer>

            <VacanciesListContainer style={{marginLeft: '97px'}}>
                <ContainerRowParent>
                    <ContainerRowChild isSelected={!!selectedVacancy}>
                        <VacanciesListComponent vacancies={activeVacancies}
                                                onVacancyClick={handleVacancyClick}
                        />
                    </ContainerRowChild>

                    <ContainerRowChild
                        isSelected={!!selectedVacancy}>
                        <VacancyDetailsContainer style={{margin: '-20px'}}>
                            {selectedVacancy && (
                                <VacancyDetailsComponent vacancy={selectedVacancy}
                                                         setSelectedVacancy={setSelectedVacancy}
                                                         onCloseVacancy={handleCloseVacancy}
                                />
                            )}
                        </VacancyDetailsContainer>
                    </ContainerRowChild>
                </ContainerRowParent>
            </VacanciesListContainer>
        </PageContainer>
    );
};

export default ActiveVacanciesComponent;

