import { BEFORE_FAQ, CREATE_FAQ, DELETE_FAQ, EDIT_FAQ, GET_FAQ, GET_FAQS, CREATE_FAQ_CAT, BEFORE_FAQ_CAT, LIST_FAQ_CAT, GET_FAQ_CAT, EDIT_FAQ_CAT, DELETE_FAQ_CAT } from '../../redux/types';

const initialState = {
    faqs: null,
    getFaqsAuth: false,
    faq: null,
    delFaqAuth: false,
    createAuth: false,
    getFaqAuth: false,
    editFaqAuth: false,
    createFaqCatAuth: false,
    listFaqCat: {},
    listFaqCatAuth: false,
    getFaqCat: {},
    getFaqCatAuth: false,
    editFaqCatAuth: false,
    delFaqCatAuth: false,
    delFaqCatId: {}
}

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_FAQ:
            return {
                ...state,
                faq: action.payload.faq,
                getFaqAuth: true
            }
        case CREATE_FAQ:
            return {
                ...state,
                createAuth: true
            }
        case GET_FAQS:
            return {
                ...state,
                faqs: action.payload,
                getFaqsAuth: true
            }
        case EDIT_FAQ:
            return {
                ...state,
                faq: action.payload,
                editFaqAuth: true
            }
        case DELETE_FAQ:
            return {
                ...state,
                faq: action.payload,
                delFaqAuth: true
            }
        case CREATE_FAQ_CAT:
            return {
                ...state,
                createFaqCatAuth: true
            }
        case BEFORE_FAQ:
            return {
                ...state,
                faqs: null,
                getFaqsAuth: false,
                faq: null,
                delFaqAuth: false,
                createAuth: false,
                getFaqAuth: false,
                editFaqAuth: false,
            }
        case LIST_FAQ_CAT:
            return {
                ...state,
                listFaqCat: action.payload,
                listFaqCatAuth: true
            }
        case GET_FAQ_CAT:
            return {
                ...state,
                getFaqCat: action.payload,
                getFaqCatAuth: true 
            }
        case EDIT_FAQ_CAT:
            return {
                ...state,
                editFaqCatAuth: true
            }
        case DELETE_FAQ_CAT:
            return {
                ...state,
                delFaqCatAuth: true,
                delFaqCatId: action.payload
            }
        case BEFORE_FAQ_CAT:
            return {
                ...state,
                createFaqCatAuth: false,
                listFaqCat: {},
                listFaqCatAuth: false,
                getFaqCat: {},
                getFaqCatAuth: false,
                editFaqCatAuth: false,
                delFaqCatAuth: false,
                delFaqCatId: {}
            }
        default:
            return {
                ...state
            }
    }
}