import { toast } from 'react-toastify';
import { emptyError } from '../../redux/shared/error/error.action';
import { BEFORE_STAKING, GET_ERRORS, LIST_STAKING, BEFORE_SEND_PROFIT, SEND_PROFIT, BEFORE_TRANSFER_AMOUNT, TRANSFER_AMOUNT } from '../../redux/types';
import { ENV } from './../../config/config';

export const beforeStaking = () => {
    return {
        type: BEFORE_STAKING
    }
}

export const listStaking = (qs = '', body = {}) => dispatch => {
    toast.dismiss();
    dispatch(emptyError());
    let url = `${ENV.url}staking/list`;
    if (qs)
        url += `?${qs}`

    fetch(url, {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token
        }
    }).then(res => res.json()).then(data => {
        if (data.success) {
            toast.success(data.message, {
                toastId: "faqs-stats-success"
            })
            dispatch({
                type: LIST_STAKING,
                payload: data.data
            })
        } else {
            toast.error(data.message, {
                toastId: "faqs-stats-error"
            })
            dispatch({
                type: GET_ERRORS,
                payload: data
            })
        }
    }).catch(error => {
        if (error.response && error.response.data) {
            const { data } = error.response
            if (data.message)
                toast.error(data.message, {
                    toastId: "faqs-stats-error"
                })
        }
        dispatch({
            type: GET_ERRORS,
            payload: error
        })
    })
};

export const listRecStaking = (qs = '', body = {}) => dispatch => {
    toast.dismiss();
    dispatch(emptyError());
    let url = `${ENV.url}staking/rec-staking-list`;
    if (qs)
        url += `?${qs}`

    fetch(url, {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token
        }
    }).then(res => res.json()).then(data => {
        if (data.success) {
            toast.success(data.message)
            dispatch({
                type: LIST_STAKING,
                payload: data.data
            })
        } else {
            toast.error(data.message, {
                toastId: "faqs-stats-error"
            })
            dispatch({
                type: GET_ERRORS,
                payload: data
            })
        }
    }).catch(error => {
        if (error.response && error.response.data) {
            const { data } = error.response
            if (data.message)
                toast.error(data.message, {
                    toastId: "faqs-stats-error"
                })
        }
        dispatch({
            type: GET_ERRORS,
            payload: error
        })
    })
};

export const sendProfit = (body = {}) => dispatch => {
    console.log("body in send profit = ", body)
    toast.dismiss();
    dispatch(emptyError());
    let url = `${ENV.url}staking/sendInterest`;
    fetch(url, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token
        },
        body: JSON.stringify(body)
    }).then(res => res.json()).then(data => {
        console.log("data = ", data.message)
        if (data.success) {
            toast.success(data.message, {
                toastId: "faqs-stats-success"
            })
            dispatch({
                type: SEND_PROFIT,
                payload: data.data
            })
        } else {
            toast.error(data.message, {
                toastId: "faqs-stats-error"
            })
            dispatch({
                type: GET_ERRORS,
                payload: data
            })
            setTimeout(() => {
                dispatch({
                    type: SEND_PROFIT,
                    payload: null
                })
            }, [1000])
        }
    }).catch(error => {
        if (error.response && error.response.data) {
            const { data } = error.response
            if (data.message)
                toast.error(data.message, {
                    toastId: "faqs-stats-error"
                })
        }
        dispatch({
            type: GET_ERRORS,
            payload: error
        })
    })
};

export const beforeSendProfit = () => {
    return {
        type: BEFORE_SEND_PROFIT
    }
}

export const beforeTransferAmount = () => {
    return {
        type: BEFORE_TRANSFER_AMOUNT
    }
}

export const transferAmount = (body = {}) => dispatch => { // get amount in admin wallet
    toast.dismiss();
    dispatch(emptyError());
    let url = `${ENV.url}staking/transferAmount`;
    fetch(url, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token
        },
        body: JSON.stringify(body)
    }).then(res => res.json()).then(data => {
        console.log("data = ", data.message)
        if (data.success) {
            toast.success(data.message, {
                toastId: "faqs-stats-success"
            })
            dispatch({
                type: TRANSFER_AMOUNT,
                payload: data.data
            })
        } else {
            toast.error(data.message, {
                toastId: "faqs-stats-error"
            })
            dispatch({
                type: GET_ERRORS,
                payload: data
            })
        }
    }).catch(error => {
        if (error.response && error.response.data) {
            const { data } = error.response
            if (data.message)
                toast.error(data.message, {
                    toastId: "faqs-stats-error"
                })
        }
        dispatch({
            type: GET_ERRORS,
            payload: error
        })
    })
};