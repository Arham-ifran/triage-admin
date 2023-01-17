import { LIST_HISTORY, BEFORE_HISTORY } from '../../redux/types'

const initialState = {
    listHistory: {},
    listHistoryAuth: false
}

export default function (state = initialState, action) {
    switch (action.type) {
        case LIST_HISTORY:
            return {
                ...state,
                listHistory: action.payload,
                listHistoryAuth: true
            }
        case BEFORE_HISTORY:
            return {
                ...state,
                listHistory: {},
                listHistoryAuth: false
            }
        default:
            return {
                ...state
            }
    }
}