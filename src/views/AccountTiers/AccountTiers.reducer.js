import { CREATE_ACCOUNT_TIER, EDIT_ACCOUNT_TIER, GET_ACCOUNT_TIER, LIST_ACCOUNT_TIERS, BEFORE_ACCOUNT_TIERS, DELETE_ACCOUNT_TIERS } from '../../redux/types'

const initialState = {
    listAccountTiers: {},
    listAccountTiersAuth: false,
    createAccountTierAuth: false,
    getAccountTier: {},
    getAccountTierAuth: false,
    editAccountTierAuth: false,
    deleteAccountTier: {},
    deleteAccountTierAuth: false
}

export default function (state = initialState, action) {
    switch (action.type) {
        case LIST_ACCOUNT_TIERS:
            return {
                ...state,
                listAccountTiers: action.payload,
                listAccountTiersAuth: true
            }
        case CREATE_ACCOUNT_TIER:
            return {
                ...state,
                createAccountTierAuth: true
            }
        case GET_ACCOUNT_TIER:
            return {
                ...state,
                getAccountTier: action.payload,
                getAccountTierAuth: true
            }
        case EDIT_ACCOUNT_TIER:
            return {
                ...state,
                editAccountTierAuth: true
            }
        case DELETE_ACCOUNT_TIERS:
            return {
                ...state,
                deleteAccountTier: action.payload,
                deleteAccountTierAuth: true
            }
        case BEFORE_ACCOUNT_TIERS:
            return {
                ...state,
                listAccountTiers: {},
                listAccountTiersAuth: false,
                createAccountTierAuth: false,
                getAccountTier: {},
                getAccountTierAuth: false,
                editAccountTierAuth: false,
                deleteAccountTier: {},
                deleteAccountTierAuth: false
            }
        default:
            return {
                ...state
            }
    }
}