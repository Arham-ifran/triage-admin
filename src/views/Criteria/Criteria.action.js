import { BEFORE_CRITERIA, LIST_CRITERIA, LIST_LEVELS, GET_ERRORS, CREATE_CRITERIA, GET_CRITERIA, UPDATE_CRITERIA, DELETE_CRITERIA } from '../../redux/types'
import { toast } from 'react-toastify';
import { emptyError } from '../../redux/shared/error/error.action';
import { ENV } from './../../config/config';

export const beforeCriteria = () => {
    return {
        type: BEFORE_CRITERIA
    }
}

export const listLevels = (qs = '', body = {}, showToast = true) => dispatch => {
    toast.dismiss();
    dispatch(emptyError());
    let url = `${ENV.url}criteria/list-account-tiers`;
    if (qs)
        url += `?${qs}`

    fetch(url, {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token,
            'x-access-token': localStorage.getItem('accessToken'),
            'user-platform': 2
        }
    }).then(res => res.json()).then(data => {
        if (data.success) {
            if (qs !== '') {
                if (showToast)
                    toast.success(data.message)
            }
            dispatch({
                type: LIST_LEVELS,
                payload: data.accountTiers
            })
        } else {
            if (qs !== '') {
                if (showToast)
                    toast.error(data.message)
            }
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

export const addCriteria = (body) => dispatch => {
    dispatch(emptyError());
    const url = `${ENV.url}criteria/create`;

    fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token,
            'x-access-token': localStorage.getItem('accessToken'),
            'user-platform': 2
        },
        body
    }).then(res => res.json()).then(data => {
        if (data.success) {
            toast.success(data.message)
            dispatch({
                type: CREATE_CRITERIA
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

export const updateCriteria = (body) => dispatch => {
    dispatch(emptyError());
    const url = `${ENV.url}criteria/edit`;

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
            toast.success(data.message)
            dispatch({
                type: UPDATE_CRITERIA
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

export const listCriteria = (qs = '', body = {}, showToast = true) => dispatch => {
    toast.dismiss();
    dispatch(emptyError());
    let url = `${ENV.url}criteria/list`;
    if (qs)
        url += `?${qs}`

    fetch(url, {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token,
            'x-access-token': localStorage.getItem('accessToken'),
            'user-platform': 2
        }
    }).then(res => res.json()).then(data => {
        if (data.success) {
            toast.success(data.message)
            dispatch({
                type: LIST_CRITERIA,
                payload: data.data
            })
        } else {
            if (qs !== '') {
                if (showToast)
                    toast.error(data.message)
            }
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

export const getCriteria = (id = '', qs = '', body = {}, showToast = true) => dispatch => {
    toast.dismiss();
    dispatch(emptyError());
    let url = `${ENV.url}criteria/get/${id}`;
    if (qs)
        url += `?${qs}`

    fetch(url, {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token,
            'x-access-token': localStorage.getItem('accessToken'),
            'user-platform': 2
        }
    }).then(res => res.json()).then(data => {
        if (data.success) {
            if (qs !== '') {
                if (showToast)
                    toast.success(data.message)
            }
            dispatch({
                type: GET_CRITERIA,
                payload: data.criteria
            })
        } else {
            if (qs !== '') {
                if (showToast)
                    toast.error(data.message)
            }
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

export const delCriteria = (id = '', qs = '', body = {}, showToast = true) => dispatch => {
    toast.dismiss();
    dispatch(emptyError());
    let url = `${ENV.url}criteria/delete/${id}`;
    if (qs)
        url += `?${qs}`

    fetch(url, {
        method: 'DELETE',
        headers: {
            'content-type': 'application/json',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token,
            'x-access-token': localStorage.getItem('accessToken'),
            'user-platform': 2
        }
    }).then(res => res.json()).then(data => {
        if (data.success) {
            if (qs !== '') {
                if (showToast)
                    toast.success(data.message)
            }
            dispatch({
                type: DELETE_CRITERIA,
                payload: data.criteriaId
            })
        } else {
            if (qs !== '') {
                if (showToast)
                    toast.error(data.message)
            }
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