import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import styled from 'styled-components';

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  width: 300px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Input = styled.input`
  margin-bottom: 10px;
  padding: 10px;
`;

const Button = styled.button`
  margin-top: 10px;
`;

export async function fetchVacancies() {
    try {
        const vacanciesResponse = await fetch('http://localhost:5000/vacancies');
        if (vacanciesResponse.ok) {
            return await vacanciesResponse.json()
        }
    } catch (e) {
        console.error('Error during fetch:', e);
        alert('Error during fetch');
    }
}

export async function fetchVacanciesResponses(userId) {
    try {
        const vacanciesResponse = await fetch(`http://localhost:5000/my-vacancies/${userId}`);
        if (vacanciesResponse.ok) {
            return await vacanciesResponse.json();
        }
    } catch (e) {
        console.error('Error during fetch:', e);
        alert('Error during fetch');
    }
}

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');

    async function fetchUser() {
        try {
            const loginResponse = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({login, password}),
            });

            if (loginResponse.ok) {
                const loginResponseJSON = await loginResponse.json();
                return loginResponseJSON.user;
            }
        } catch (e) {
            console.error('Error during fetch:', e);
            alert('Error during fetch');
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const user = await fetchUser()
            if (!user) throw Error("Login failed")
            dispatch({type: 'SET_USER', payload: user});
            // console.log("user: "+JSON.stringify(user))

            // Загружаем вакансии и отклики
            const vacancies = await fetchVacancies();
            if (!vacancies) return
            dispatch({type: 'SET_VACANCIES', payload: vacancies});
            // console.log("vacancies: "+JSON.stringify(vacancies))

            const vacanciesResponses = await fetchVacanciesResponses(user.id);
            if (!vacanciesResponses) return
            dispatch({type: 'SET_RESPONSES', payload: vacanciesResponses});
            // console.log("vacanciesResponses: "+JSON.stringify(vacanciesResponses))

            navigate('/vacancies');
        } catch (e) {
            console.error('Error during submit:', e);
            alert(e.message);
        }
    };

    return (
        <LoginContainer>
            <LoginForm onSubmit={handleSubmit}>
                <h2>Login</h2>
                <Input
                    type="text"
                    placeholder="Login"
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                />
                <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <p>New to BestVacancies? <a href="/signup">Create an account</a></p>
                <Button type="submit">Sign in</Button>
            </LoginForm>
        </LoginContainer>
    );
};

export default Login;
