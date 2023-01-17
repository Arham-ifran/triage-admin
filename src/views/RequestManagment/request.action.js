import { GET_REQUESTS, BEFORE_REQUEST, MANAGE_REQUEST, GET_ERRORS, BEFORE_MANAGE_REQUEST } from '../../redux/types'
import { toast } from 'react-toastify';
import { emptyError } from '../../redux/shared/error/error.action';
import { ENV } from '../../config/config';

export const beforeRequest = () => {
    return {
        type: BEFORE_REQUEST
    }
}

export const boforeManageRequest = () => {
    return {
        type: BEFORE_MANAGE_REQUEST
    }
}


export const getRequest = (qs = '', body = {}) => dispatch => {
    console.log("there in the get Reqest ⭐")
    toast.dismiss();
    dispatch(emptyError());
    let url = `${ENV.url}request/get`;
    console.log("1")
    if (qs)
        url += `?${qs}`

    console.log("2")
    fetch(url, {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token,
            'x-access-token': localStorage.getItem('accessToken'),
        },
        // body: JSON.stringify(body)
    }).then(res => res.json()).then(data => {
        if (data.success) {
            console.log("3", data)
            toast.success(data.message, {
                toastId: "cms-stats-success"
            })
            dispatch({
                type: GET_REQUESTS,
                payload: data.data
            })
        } else {
            toast.error(data.message, {
                toastId: "cms-stats-error"
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
                toast.error(data.message)
        }
        dispatch({
            type: GET_ERRORS,
            payload: error
        })
    })
};

export const manageRequest = (body = {}) => dispatch => {
    dispatch(emptyError());
    const url = `${ENV.url}request/manage`;

    fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token,
            'x-access-token': localStorage.getItem('accessToken'),
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
    }).then(res => res.json()).then(data => {
        if (data.success) {
            console.log("data success = ", data)
            toast.success(data.message, {
                autoClose: 1000,
            })
            dispatch({
                type: MANAGE_REQUEST,
                payload: data
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