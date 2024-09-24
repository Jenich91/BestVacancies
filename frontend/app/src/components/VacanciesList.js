import React from 'react';
import styled from 'styled-components';
import VacancyCardComponent from './VacancyCard';

const VacanciesContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%; /* Занимает всю ширину родительского элемента */
`;

const VacanciesList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%; /* Занимает всю ширину родительского элемента */
`;

const VacancyItem = styled.div`
  width: 80%; /* Занимает 80% ширины родительского элемента */
  margin: 10px 0; /* Отступ между карточками */
`;

const VacanciesListComponent = ({vacancies, onVacancyClick}) => {
    return (
        <VacanciesContainer>
            <VacanciesList>
                {vacancies.map((vacancy) => (
                    <VacancyItem key={vacancy.id}>
                        <VacancyCardComponent vacancy={vacancy}
                                              onVacancyClick={onVacancyClick}/>
                    </VacancyItem>
                ))}
            </VacanciesList>
        </VacanciesContainer>
    );
};

export default VacanciesListComponent;
