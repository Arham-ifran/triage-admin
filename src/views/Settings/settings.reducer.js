import { GET_SETTINGS, EDIT_SETTINGS, BEFORE_SETTINGS, GET_ERRORS,EDIT_BANK_DETAILS,GET_BANK_DETAILS } from '../../redux/types';

const initialState = {
    settings: null,
    settingsAuth: false,
    bankDetailsAuth: false,
    getBankDetailsAuth: false
}

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_SETTINGS:
            return {
                ...state,
                settings: action.payload,
                settingsAuth: true
            }
        case EDIT_SETTINGS:
            return {
                ...state,
                settings: action.payload,
                settingsAuth: true
            }
            case EDIT_BANK_DETAILS:
                return {
                    ...state,
                    bankDetails: action.payload,
                    bankDetailsAuth: true
                }
            case GET_BANK_DETAILS: 
            return {
                ...state,
                bankDetailsList: action.payload,
                getBankDetailsAuth: true
            }
        case BEFORE_SETTINGS:
            return {
                ...state,
                settings: null,
                settingsAuth: false,
                bankDetailsAuth: false,
                getBankDetailsAuth: false
            }
        default:
            return {
                ...state
            }
    }
}