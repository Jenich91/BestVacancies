import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import styled from 'styled-components';
import {useLocation} from "react-router-dom";
import userpic_icon from './icons/userpic.png';
import {iconStyle} from "./SideMenu";

const VacancyCard = styled.div`
  width: 80%;
  max-width: 600px;
  height: 150px;
  border: 5px solid #ddd;
  border-radius: 10px;
  padding: 20px;
  margin: 10px 0;
  cursor: pointer;
`;

const VacancyTitle = styled.h2`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;

  flex: 70%;
`;

const VacancyDescription = styled.p`
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
`;

const RespondedIcon = styled.span`
  font-size: 18px;
  color: #0f0;

  flex: 30%;
`;

const ContainerRow = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const ResponseCounter = styled.div`
  span {
    font-size: 34px;
  }

  img {
    ${iconStyle}
  }
`;

export async function sendRegisterVacancyResponse(userId, vacancyId) {
    return await fetch('http://localhost:5000/registerVacancyResponse', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({userId: userId, vacancyId: vacancyId}),
    });
}

async function getVacancyResponseCount(vacancyId) {
    try {
        const response = await fetch(`http://localhost:5000/responseVacancyCount?vacancyId=${vacancyId}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.responseCount;
    } catch (error) {
        console.error('Error fetching vacancy response count:', error);
        return 0;
    }
}

function VacancyCardComponent({vacancy, onVacancyClick}) {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);
    const vacanciesResponses = useSelector(state => state.responses);
    const [hasResponded, setHasResponded] = useState(vacanciesResponses.some(responseVacancy => responseVacancy.id === vacancy.id));
    const location = useLocation();
    const [isWorker] = useState(user.user_type === 'applicant');
    const [responseCount, setResponseCount] = useState(0); // Состояние для хранения количества откликов

    useEffect(() => {
        if (!isWorker && vacancy) {
            const fetchResponseCount = async () => {
                const count = await getVacancyResponseCount(vacancy.id);
                setResponseCount(count);
            };
            fetchResponseCount();
        }
    }, [vacancy.id]); // Вызываем при изменении vacancy.id

    useEffect(() => {
        if (vacanciesResponses.length !== 0) {
            setHasResponded(vacanciesResponses.some(responseVacancy => responseVacancy.id === vacancy.id));
        }
    }, [vacanciesResponses]);

    const handleClick = async () => {
        if (isWorker) {
            if (location.pathname === '/vacancies') {
                if (hasResponded) {
                    alert('You have already responded to this vacancy.');
                    return;
                }

                try {
                    const responseStatus = (await sendRegisterVacancyResponse(user.id, vacancy.id)).ok;
                    if (responseStatus) {
                        setHasResponded(true);
                        dispatch({type: 'ADD_RESPONSE', payload: vacancy});
                    }
                } catch (e) {
                    console.error('Error during fetch:', e);
                }
            } else if (location.pathname === '/my-vacancies') {
                onVacancyClick(vacancy);
            }
        } else {
            if (location.pathname === '/active-vacancies') {
                onVacancyClick(vacancy);
            }
        }
    };

    return (
        <VacancyCard onClick={handleClick}>
            <ContainerRow>
                <VacancyTitle>{vacancy.title}</VacancyTitle>
                {isWorker && hasResponded &&
                    <RespondedIcon>✓ You responded</RespondedIcon>}
                {!isWorker &&
                    <ResponseCounter>
                        <ContainerRow>
                            <img src={userpic_icon} alt="Userpic"/>
                            <span>{responseCount}</span>
                        </ContainerRow>
                    </ResponseCounter>
                }
            </ContainerRow>
            <VacancyDescription>{vacancy.description.substring(0, 50)}...</VacancyDescription>
        </VacancyCard>
    );
}


export default VacancyCardComponent;


