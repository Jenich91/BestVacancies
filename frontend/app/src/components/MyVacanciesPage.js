import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import SideMenu from './SideMenu';
import VacanciesListComponent from './VacanciesList';
import VacancyDetailsComponent from './VacancyDetails';
import {SideMenuContainer, VacanciesListContainer, PageContainer} from "./VacanciesPage";
import styled from "styled-components";

export const ContainerRowParent = styled.div`
  display: flex;
`;

export const ContainerRowChild = styled.div`
  width: ${props => (props.isSelected ? '35%' : '65%')}; /* Изменение ширины в зависимости от состояния */
  box-sizing: border-box;
  transition: width 0.5s ease-out; /* Плавный переход при изменении ширины */
`;

const MyVacanciesComponent = () => {
    const navigate = useNavigate();
    const vacanciesResponses = useSelector(state => state.responses);
    const [selectedVacancy, setSelectedVacancy] = useState(null);

    useEffect(() => {
        if (!Array.isArray(vacanciesResponses) || vacanciesResponses.length === 0) {
            alert("Vacancies responses not found");
            navigate('/vacancies');
        }
    }, [vacanciesResponses]);

    const handleVacancyClick = async (vacancy) => {
        const response = await fetch(`http://localhost:5000/vacancies/${vacancy.id}`);
        const vacancyData = await response.json();
        setSelectedVacancy(vacancyData);
    };

    return (
        <PageContainer>
            <SideMenuContainer>
                <SideMenu/>
            </SideMenuContainer>

            <VacanciesListContainer style={{marginLeft: '97px'}}>
                <ContainerRowParent>
                    <ContainerRowChild isSelected={!!selectedVacancy}>
                        <VacanciesListComponent vacancies={vacanciesResponses}
                                                onVacancyClick={handleVacancyClick}/>
                    </ContainerRowChild>

                    <ContainerRowChild isSelected={!!selectedVacancy}>
                        {selectedVacancy &&
                            <VacancyDetailsComponent vacancy={selectedVacancy}
                                                     setSelectedVacancy={setSelectedVacancy}/>}
                    </ContainerRowChild>
                </ContainerRowParent>
            </VacanciesListContainer>
        </PageContainer>
    );
};

export default MyVacanciesComponent;
