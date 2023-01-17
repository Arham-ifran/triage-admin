import { BEFORE_CRITERIA, LIST_CRITERIA, LIST_LEVELS, CREATE_CRITERIA, UPDATE_CRITERIA, GET_CRITERIA, DELETE_CRITERIA } from '../../redux/types'

const initialState = {
    listLevels: {},
    listLevelsAuth: false,
    createAuth: false,
    listCritera: {},
    listCriteriaAuth: false,
    getCriteria: {},
    getCriteraAuth: false,
    updateAuth: false,
    delCriteria: {},
    delAuth: false
}

export default function (state = initialState, action) {
    switch (action.type) {
        case LIST_LEVELS:
            return {
                ...state,
                listLevels: action.payload,
                listLevelsAuth: true
            }
        case CREATE_CRITERIA:
            return {
                ...state,
                createAuth: true
            }
        case LIST_CRITERIA:
            return {
                ...state,
                listCritera: action.payload,
                listCriteriaAuth: true
            }
        case GET_CRITERIA:
            return {
                ...state,
                getCriteria: action.payload,
                getCriteraAuth: true
            }
        case UPDATE_CRITERIA:
            return {
                ...state,
                updateAuth: true
            }
        case DELETE_CRITERIA:
            return {
                ...state,
                delCriteria: action.payload,
                delAuth: true
            }
        case BEFORE_CRITERIA:
            return {
                ...state,
                listLevels: {},
                listLevelsAuth: false,
                createAuth: false,
                listCritera: {},
                listCriteriaAuth: false,
                getCriteria: {},
                getCriteraAuth: false,
                updateAuth: false,
                delCriteria: {},
                delAuth: false
            }
        default:
            return {
                ...state
            }
    }
}