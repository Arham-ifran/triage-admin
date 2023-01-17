import {GET_REQUESTS, BEFORE_REQUEST, MANAGE_REQUEST, BEFORE_MANAGE_REQUEST} from '../../redux/types'

const initialState = {
    getRequestPagesRes: {},
    getRequestAuth: false,
    manageRequestAuth: false
}

export default function (state = initialState, action) {
    switch (action.type) {
        case BEFORE_REQUEST:
            return {
                ...state,
                getRequestPagesRes: {},
                getRequestAuth: false,
            }
        case GET_REQUESTS:
            return {
                ...state,
                getRequestPagesRes : action.payload,
                getRequestAuth: true,
            }
        case BEFORE_MANAGE_REQUEST:
            return {
                ...state,
                manageRequestAuth: false
            }
        case MANAGE_REQUEST:
            return {
                ...state,
               manageRequestAuth: true
            }
        default:
            return {
                ...state
            }
    }
}