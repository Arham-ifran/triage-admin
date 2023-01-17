import { toast } from 'react-toastify';
import { GET_ERRORS, GET_KYC, BEFORE_KYC, UPDATE_KYC,GET_KYCS } from '../../redux/types';
import { emptyError } from '../../redux/shared/error/error.action';
import { ENV } from './../../config/config';

export const beforeKyc = () => {
    return {
        type: BEFORE_KYC
    }
}

export const getKyc = (userId) => dispatch => {
    toast.dismiss();
    dispatch(emptyError());
    let url = `${ENV.url}kyc/get/${userId}`;

    fetch(url, {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token,
            'x-access-token': localStorage.getItem('accessToken'),
        }
    }).then(res => res.json()).then(data => {
        if (data.success) {
            dispatch({
                type: GET_KYC,
                payload: data.kyc
            })
        } else {
            if (qs !== '')
                toast.error(data.message, {
                    toastId: "users-stats-error"
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
                    toastId: "users-stats-error"
                })
        }
        dispatch({
            type: GET_ERRORS,
            payload: error
        })
    })
};

export const updatePersonalDoc = (body) => dispatch => {
    dispatch(emptyError());
    const url = `${ENV.url}kyc/update`;
    fetch(url, {
        method: 'PUT',
        headers: {
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token,
            'x-access-token': localStorage.getItem('accessToken'),
            'user-platform': 2
        },
        body
    }).then(res => res.json()).then(data => {
        if (data.success) {
            toast.success(data.message, { toastId : 'update-kyc-success'})
            dispatch({
                type: UPDATE_KYC
            })
        } else {
            toast.error(data.message)
            dispatch({
                type: GET_ERRORS,
                payload: data
            })
        }
    }).catch(error => {
        if (error.response && error.response.data) {
            const { data } = error.response
            if (data.message)
                toast.error(data.message)
        }
        dispatch({
            type: GET_ERRORS,
            payload: error
        })
    })
};

export const getKycs = (qs = '', body = {}) => dispatch => {
    toast.dismiss();
    dispatch(emptyError());
    let url = `${ENV.url}kyc/getkycs`;
    if (qs)
        url += `?${qs}`

    fetch(url, {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token
        },
    }).then(res => res.json()).then(data => {
        if (data.success) {
            toast.success(data.message, {
                toastId: "wallets-stats-success"
            })
            dispatch({
                type: GET_KYCS,
                payload: data.data
            })
        } else {
            toast.error(data.message, {
                toastId: "wallets-stats-error"
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
                    toastId: "wallets-stats-error"
                })
        }
        dispatch({
            type: GET_ERRORS,
            payload: error
        })
    })
};