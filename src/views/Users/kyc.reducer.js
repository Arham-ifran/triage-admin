import { GET_KYC, BEFORE_KYC, UPDATE_KYC,GET_KYCS } from '../../redux/types';

const initialState = {
    getKYCAuth: false,
    kycData: {},
    updateAuth: false,
    kycListAuth: false
}

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_KYC:
            return {
                ...state,
                kycData: action.payload,
                getKYCAuth: true
            }
            case GET_KYCS:
                return {
                    ...state,
                    kycs: action.payload,
                    kycListAuth: true
                }
        case UPDATE_KYC:
            return {
                ...state,
                updateAuth: true
            }
        case BEFORE_KYC:
            return {
                ...state,
                getKYCAuth: false,
                kycData: {},
                updateAuth: false,
                kycListAuth: false
            }
        default:
            return {
                ...state
            }
    }
}