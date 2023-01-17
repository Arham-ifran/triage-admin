import { GET_WALLETS, BEFORE_WALLET, DELETE_WALLET, CREATE_WALLET, GET_WALLET, EDIT_WALLET } from '../../redux/types';

const initialState = {
    wallets: null,
    getWalletsAuth: false,
    wallet: null,
    delWalletAuth: false,
    createAuth: false,
    getWalletAuth: false,
    editWalletAuth: false
}

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_WALLET:
            return {
                ...state,
                wallet: action.payload.wallet,
                getWalletAuth: true
            }
        case CREATE_WALLET:
            return {
                ...state,
                createAuth: true
            }
        case GET_WALLETS:
            return {
                ...state,
                wallets: action.payload,
                getWalletsAuth: true
            }
        case EDIT_WALLET:
            return {
                ...state,
                wallet: action.payload,
                editWalletAuth: true
            }
        case DELETE_WALLET:
            return {
                ...state,
                wallet: action.payload,
                delWalletAuth: true
            }
        case BEFORE_WALLET:
            return {
                ...state,
                wallets: null,
                getWalletsAuth: false,
                wallet: null,
                delWalletAuth: false,
                createAuth: false,
                getWalletAuth: false,
                editWalletAuth: false
            }
        default:
            return {
                ...state
            }
    }
}