import { LIST_NEWSLETTERS, BEFORE_NEWSLETTERS,SEND_NEWS_LETTER_EMAILS } from '../../redux/types';

const initialState = {
    newsletters: {},
    newslettersAuth: false,
    sendNewsLetterEmailsAuth:false
}

export default function newsletterRed(state = initialState, action) {
    switch (action.type) {
        case LIST_NEWSLETTERS:
            return {
                ...state,
                newsletters: action.payload,
                newslettersAuth: true
            }
            case SEND_NEWS_LETTER_EMAILS:
                return {
                    ...state,
                    sendNewsLetterEmailsAuth: true
                }
        case BEFORE_NEWSLETTERS:
            return {
                ...state,
                newsletters: {},
                newslettersAuth: false,
    sendNewsLetterEmailsAuth:false

            }
        default:
            return {
                ...state
            }
    }
}