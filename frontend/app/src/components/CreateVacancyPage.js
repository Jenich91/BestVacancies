import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import styled from 'styled-components';
import SideMenu from './SideMenu';
import {useDispatch, useSelector} from 'react-redux';
import {PageContainer, SideMenuContainer, VacanciesListContainer} from "./VacanciesPage";

const CreateVacancyContainer = styled.div`
  max-width: 450px;
  padding: 20px;
  margin-top: 15%;
  margin-left: 15%;
  border-radius: 10px;
  border: 5px solid #ddd;
  cursor: pointer;
  display: flex;
  flex-direction: column; /* Устанавливаем вертикальное направление */
  justify-content: center;
  align-items: center;
  gap: 5px;
`;

const InputContainer = styled.div`
  margin-bottom: 10px; /* Отступ между полями ввода */
  display: flex;
  flex-direction: row;
  gap: 10px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end; /* Выравнивание кнопок по правому краю */
  margin-top: 20px; /* Отступ сверху для кнопок */
`;

const CreateVacancyPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch(); // Получаем dispatch для обновления состояния
    const user = useSelector(state => state.user); // Получаем текущего пользователя из Redux
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [englishLevel, setEnglishLevel] = useState('');
    const [grade, setGrade] = useState('');
    const [tags, setTags] = useState('');

    const handleSave = async () => {
        const vacancyData = {
            title,
            description,
            creator_id: user.id, // Добавляем идентификатор создателя
        };

        const vacancyDetailsData = {
            english_level: englishLevel,
            grade,
            tags: tags.split(',').map(tag => tag.trim()),
        };

        try {
            const vacancyResponse = await fetch('http://localhost:5000/createVacancy', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(vacancyData),
            });

            if (vacancyResponse.ok) {
                const vacancy = await vacancyResponse.json();

                const detailsResponse = await fetch('http://localhost:5000/createVacancyDetails', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        vacancy_id: vacancy.id,
                        ...vacancyDetailsData,
                    }),
                });

                if (detailsResponse.ok) {
                    const updatedVacanciesResponse = await fetch('http://localhost:5000/vacancies');
                    const updatedVacancies = await updatedVacanciesResponse.json();
                    dispatch({type: 'SET_VACANCIES', payload: updatedVacancies});

                    navigate('/vacancies');
                } else {
                    console.error('Error saving vacancy details:', detailsResponse.statusText);
                }
            } else {
                console.error('Error saving vacancy:', vacancyResponse.statusText);
            }
        } catch (error) {
            console.error('Error during fetch:', error);
        }
    };

    return (
        <PageContainer>
            <SideMenuContainer>
                <SideMenu/>
            </SideMenuContainer>

            <VacanciesListContainer>

                <CreateVacancyContainer>
                    <InputContainer>
                        <label>Vacancy Title</label>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}/>
                    </InputContainer>
                    <InputContainer>
                        <label>Vacancy Description</label>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)}/>
                    </InputContainer>
                    <InputContainer>
                        <label>English Level</label>
                        <select value={englishLevel} onChange={(e) => setEnglishLevel(e.target.value)}>
                            <option value="">Select...</option>
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                        </select>
                    </InputContainer>
                    <InputContainer>
                        <label>Grade</label>
                        <select value={grade} onChange={(e) => setGrade(e.target.value)}>
                            <option value="">Select...</option>
                            <option value="Junior">Junior</option>
                            <option value="Middle">Middle</option>
                            <option value="Senior">Senior</option>
                        </select>
                    </InputContainer>
                    <InputContainer>
                        <label>Tags (comma separated)</label>
                        <input type="text" value={tags} onChange={(e) => setTags(e.target.value)}/>
                    </InputContainer>
                    <ButtonContainer>
                        <button style={{border: '1px solid red', marginRight: '10px'}}
                                onClick={() => navigate('/vacancies')}>Close
                        </button>
                        <button style={{border: '1px solid green'}} onClick={handleSave}>Save</button>
                    </ButtonContainer>
                </CreateVacancyContainer>

            </VacanciesListContainer>
        </PageContainer>
    );
};

export default CreateVacancyPage;