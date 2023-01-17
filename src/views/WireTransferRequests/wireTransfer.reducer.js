import {GET_REQUESTS, BEFORE_REQUEST, MANAGE_REQUEST, BEFORE_MANAGE_REQUEST,GET_WIRE_REQUESTS,BEFORE_WIRE_REQUEST,GET_WIRE_REQUEST,UPDATE_WIRE_REQ
    ,GET_WITHDRAW_REQUESTS,UPLOAD_RECEIPT,DEDUCT_TRI} from '../../redux/types'

const initialState = {
    getRequestPagesRes: {},
    getWireRequestAuth: false,
    manageRequestAuth: false,
    updateWireRequestAuth: false,
    getWithdrawRequestAuth: false,
    receiptUploadAuth: false,
    requestAuth: false,
    triDeductionAuth: false
}

export default function (state = initialState, action) {
    switch (action.type) {
        case BEFORE_WIRE_REQUEST:
            return {
                ...state,
                getWireRequestAuth: false,
                updateWireRequestAuth: false,
                getWithdrawRequestAuth: false,
                receiptUploadAuth: false,
                triDeductionAuth: false,
                requestAuth: false
            }
        case GET_WIRE_REQUESTS:
            return {
                ...state,
                getWireRequestsList : action.payload,
                getWireRequestAuth: true,
            }
        case UPDATE_WIRE_REQ:
            return {
                ...state,
                updateWireRequestAuth: true
            }
            case UPLOAD_RECEIPT: 
            return {
                ...state,
                receiptUploadAuth: true
            }
        case DEDUCT_TRI:
            return {
                ...state,
                triDeductionAuth: true
            }
        case GET_WITHDRAW_REQUESTS:
            return {
                ...state,
                getWithdrawRequestAuth: true,
                getWithdrawRequestsList : action.payload,
            }
        case GET_WIRE_REQUEST:
            return {
                ...state,
                request : action.payload,
                requestAuth: true,
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