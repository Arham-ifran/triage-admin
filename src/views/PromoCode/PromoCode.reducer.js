import { BEFORE_PROMO_CODE, CREATE_PROMO_CODE, DELETE_FAQ, EDIT_PROMO_CODE, GET_PROMO_CODE, GET_PROMO_CODES, CREATE_FAQ_CAT, BEFORE_FAQ_CAT, LIST_FAQ_CAT, GET_FAQ_CAT, EDIT_FAQ_CAT, DELETE_PROMO_CODE } from '../../redux/types';

const initialState = {
    faqs: null,
    getPromoCodesAuth: false,
    faq: null,
    delPromoCodeAuth: false,
    createAuth: false,
    getPromoCodeAuth: false,
    editPromoCodeAuth: false,
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
        case GET_PROMO_CODE:
            return {
                ...state,
                promoCode: action.payload.promoCode,
                getPromoCodeAuth: true
            }
        case CREATE_PROMO_CODE:
            return {
                ...state,
                createPromoCodeAuth: true
            }
        case GET_PROMO_CODES:
            return {
                ...state,
                promocodes: action.payload,
                getPromoCodesAuth: true
            }
        case EDIT_PROMO_CODE:
            return {
                ...state,
                faq: action.payload,
                editPromoCodeAuth: true
            }
        case DELETE_PROMO_CODE:
            return {
                ...state,
                promoCode: action.payload,
                delPromoCodeAuth: true
            }
        case CREATE_FAQ_CAT:
            return {
                ...state,
                createFaqCatAuth: true
            }
        case BEFORE_PROMO_CODE:
            return {
                ...state,
                faqs: null,
                getPromoCodesAuth: false,
                faq: null,
                delPromoCodeAuth: false,
                createPromoCodeAuth: false,
                getPromoCodeAuth: false,
                editPromoCodeAuth: false,
            }
        case LIST_FAQ_CAT:
            return {
                ...state,
                listFaqCat: action.payload,
                listFaqCatAuth: true
            }
        case EDIT_FAQ_CAT:
            return {
                ...state,
                editFaqCatAuth: true
            }
        default:
            return {
                ...state
            }
    }
}