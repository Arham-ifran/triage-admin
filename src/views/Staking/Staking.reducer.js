import { BEFORE_STAKING, LIST_STAKING, SEND_PROFIT, BEFORE_SEND_PROFIT, BEFORE_TRANSFER_AMOUNT, TRANSFER_AMOUNT} from '../../redux/types';

const initialState = {
    listStaking: {},
    listStakingAuth: false,
    sendProfitAuth: false,
    sentProfitRes: null,
    
    transferAmountAuth: false,
    
}

export default function (state = initialState, action) {
    switch (action.type) {
        case LIST_STAKING:
            return {
                ...state,
                listStaking: action.payload,
                listStakingAuth: true
            }
        case BEFORE_STAKING:
            return {
                ...state,
                listStaking: {},
                listStakingAuth: false
            }
        case SEND_PROFIT: 
            return { 
                ...state,
                sentProfitRes: action.payload,
                sendProfitAuth: true,
            }
        case BEFORE_SEND_PROFIT: 
            return { 
                ...state,
                sentProfitRes: null,
                sendProfitAuth: false,
            }
        case BEFORE_TRANSFER_AMOUNT: 
            return {
                ...state,
                transferAmountAuth: false
            }
        case TRANSFER_AMOUNT: 
            return {
                ...state,
                transferAmountAuth: true
            }
        default:
            return {
                ...state
            }
    }
}