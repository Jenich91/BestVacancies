import React, {useState} from 'react';
import styled from 'styled-components';
import {Link, useNavigate} from 'react-router-dom';

const SignupContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const SignupForm = styled.form`
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

const Signup = () => {
    const [companyName, setCompanyName] = useState('');
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [error, setError] = useState('');
    const [isEmployer, setIsEmployer] = useState(false); // Состояние для типа пользователя
    const navigate = useNavigate();

    const checkPasswords = () => {
        if (password !== repeatPassword) {
            setError('Passwords don\'t match');
            return false;
        }
        setError('');
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!checkPasswords()) {
            return;
        }
        try {
            const response = await fetch('http://localhost:5000/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({login, password, companyName, userType: isEmployer ? 'employer' : 'applicant'}),
            });

            if (response.ok) {
                const data = await response.json();
                // console.log('User created:', data.user);
                navigate('/login');
            } else {
                const errorData = await response.json();
                console.error('Signup failed:', errorData.message);
                alert(errorData.message);
            }
        } catch (error) {
            console.error('Error during signup:', error);
            alert(error.message);
        }
    };

    return (
        <SignupContainer>
            <SignupForm onSubmit={handleSubmit}>
                <h2>Sign Up</h2>
                <div>
                    <label>
                        <input
                            type="radio"
                            value="applicant"
                            checked={!isEmployer}
                            onChange={() => setIsEmployer(false)}
                        />
                        Applicant
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="employer"
                            checked={isEmployer}
                            onChange={() => setIsEmployer(true)}
                        />
                        Employer
                    </label>
                </div>
                {isEmployer && (
                    <Input
                        type="text"
                        placeholder="Company Name"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                    />
                )}
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
                <Input
                    type="password"
                    placeholder="Repeat Password"
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                />
                {error && <p style={{color: 'red'}}>{error}</p>}
                <p>Already have an account? <Link to="/login">Sign in</Link></p>
                <Button type="submit">Sign up</Button>
            </SignupForm>
        </SignupContainer>
    );
};

export default Signup;
