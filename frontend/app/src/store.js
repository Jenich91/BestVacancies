import {createStore} from 'redux';

const initialState = {
    user: null,
    vacancies: [],
    responses: [],
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_USER':
            return {...state, user: action.payload};
        case 'SET_VACANCIES':
            return {...state, vacancies: action.payload};
        case 'SET_RESPONSES':
            return {...state, responses: action.payload};

        case 'ADD_RESPONSE':
            return {...state, responses: [...state.responses, action.payload]};
        case 'REMOVE_RESPONSE':
            return {...state, responses: state.responses.filter((item) => item.id !== action.payload)};

        case 'RESET_USER':
            return {...state, user: null};
        case 'RESET_VACANCIES':
            return {...state, vacancies: []};
        case 'RESET_RESPONSES':
            return {...state, responses: []};
        default:
            return state;
    }
};


const store = createStore(reducer);

export default store;
