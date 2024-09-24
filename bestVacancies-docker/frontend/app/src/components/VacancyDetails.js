import React, {useState} from 'react';
import styled from 'styled-components';
import {useDispatch, useSelector} from "react-redux";

const DetailsContainer = styled.div`
  width: 100%; /* Занимает всю ширину родительского элемента */
  min-width: 300px;
  padding: 20px;
  border-radius: 10px;
  margin-top: 20px;
  max-height: 80vh; /* Максимальная высота */
  overflow-y: auto; /* Прокрутка при переполнении */
  border: 5px solid #ddd;
  cursor: pointer;
`;

const Title = styled.h2`
  font-size: 24px;
`;

const InfoContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const Description = styled.p`
  font-size: 18px;
  border: 1px solid #e600ff;
  margin: 10px 0; /* Отступы сверху и снизу */
`;

const TagsContainer = styled.div`
  margin: 10px 0;
  display: flex;
  flex-wrap: wrap;
`;

const Tag = styled.span`
  border: 1px solid #00f;
  border-radius: 5px;
  padding: 5px;
  margin: 5px;
`;

const Skills = styled.span`
  border: 1px solid #00f;
  border-radius: 5px;
  padding: 5px;
  margin: 5px;
`;

const VacancyDetailsComponent = ({vacancy, setSelectedVacancy, onCloseVacancy}) => {
    const dispatch = useDispatch()
    const user = useSelector(state => state.user);
    const [visible, setVisible] = useState(true)
    const [isWorker] = useState(user.user_type === 'applicant');

    const handleCancelResponse = async () => {
        if (!isWorker) {
            onCloseVacancy(vacancy)
            setVisible(false);  // Закрываем детализированную карточку
            setSelectedVacancy(null); // Сбрасываем состояние выбранной вакансии
        } else {
            try {
                const response = await fetch(`http://localhost:5000/vacanciesResponses`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        user_id: user.id,
                        vacancy_id: vacancy.id
                    }),
                });

                if (response.ok) {
                    dispatch({type: 'REMOVE_RESPONSE', payload: vacancy.id});
                    setVisible(false);  // Закрываем детализированную карточку
                    setSelectedVacancy(null); // Сбрасываем состояние выбранной вакансии

                    const data = await response.json();
                    // console.log('Response deleted successfully:', data);
                    alert("Response deleted successfully")
                }
            } catch (error) {
                console.error('Error deleting response:', error);
            }
        }
    };

    return (
        <div>
            {visible &&
                <DetailsContainer>
                    <Title>{vacancy.title}</Title>
                    {isWorker &&
                        <InfoContainer>
                            <div>
                                <Skills>English level: {vacancy.english_lvl || 'N/A'}</Skills>
                                <Skills>Grade: {vacancy.grade || 'N/A'}</Skills>
                            </div>
                        </InfoContainer>
                    }
                    <Description>{vacancy.description}</Description>
                    <h3>Contacts</h3>
                    <TagsContainer>
                        {vacancy.tags && vacancy.tags.map(tag => (
                            <Tag key={tag}>{tag}</Tag>
                        ))}
                    </TagsContainer>
                    {isWorker && <button onClick={handleCancelResponse}>Cancel response</button>}
                    {!isWorker && <button onClick={handleCancelResponse}>Cancel vacancy</button>}
                </DetailsContainer>
            }
        </div>
    );
};

export default VacancyDetailsComponent;