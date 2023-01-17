import { BEFORE_EMAIL, GET_EMAILS, UPSERT_COLLECTION, DELETE_COLLECTION, GET_EMAIL, UPDATE_EMAIL, ADD_EMAIL, DELETE_EMAIL } from '../../redux/types';

const initialState = {
    email: null,
    getEmailAuth: false,
    emails: null,
    pagination: null,
    deleteAuth: false,
    updateAuth: false,
    upsertAuth: false,
    getAuth: false,
    addEmailAuth: false,
    delData: null,
    delAuth: false
}

export default function (state = initialState, action) {
    switch (action.type) {
        case ADD_EMAIL:
            return {
                ...state,
                addEmailAuth: true
            }
        case DELETE_EMAIL:
            return {
                ...state,
                delData: action.payload,
                delAuth: true
            }
        case UPDATE_EMAIL:
            return {
                ...state,
                email: action.payload.email,
                updateAuth: true
            }
        case UPSERT_COLLECTION:
            return {
                ...state,
                email: action.payload,
                upsertAuth: true
            }
        case DELETE_COLLECTION:
            return {
                ...state,
                email: action.payload,
                deleteAuth: true
            }
        case GET_EMAILS:
            return {
                ...state,
                emails: action.payload.emails,
                pagination: action.payload.pagination,
                getAuth: true
            }
        case GET_EMAIL:
            return {
                ...state,
                email: action.payload.email,
                getEmailAuth: true
            }
        case BEFORE_EMAIL:
            return {
                ...state,
                email: null,
                emails: null,
                pagination: null,
                deleteAuth: false,
                updateAuth: false,
                upsertAuth: false,
                getAuth: false,
                getEmailAuth: false,
                addEmailAuth: false,
                delData: null,
                delAuth: false
            }
        default:
            return {
                ...state
            }
    }
}