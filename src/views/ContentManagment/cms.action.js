import { GET_CONTENT_PAGE, GET_CONTENT_PAGES, EDIT_CONTENT_PAGE, DELETE_CONTENT_PAGE, ADD_CONTENT_PAGE, BEFORE_CONTENT, GET_ERRORS } from '../../redux/types'
import { toast } from 'react-toastify';
import { emptyError } from '../../redux/shared/error/error.action';
import { ENV } from './../../config/config';

export const beforeContent = () => {
    return {
        type: BEFORE_CONTENT
    }
}

export const listContent = (qs = '', body = {}, showToast = true) => dispatch => {
    toast.dismiss();
    dispatch(emptyError());
    let url = `${ENV.url}content/list`;
    if (qs)
        url += `?${qs}`

    fetch(url, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token,
            'x-access-token': localStorage.getItem('accessToken'),
            'user-platform': 2
        },
        body: JSON.stringify(body)
    }).then(res => res.json()).then(data => {
        if (data.success) {
            toast.success(data.message, {
                toastId: "cms-stats-success"
            })
            dispatch({
                type: GET_CONTENT_PAGES,
                payload: data.data
            })
        } else {
            if (qs !== '') {
                if (showToast)
                    toast.error(data.message, {
                        toastId: "cms-stats-error"
                    })

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

export const updateContent = (body) => dispatch => {
    dispatch(emptyError());
    const url = `${ENV.url}content/edit`;

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
            toast.success(data.message, {
                toastId: "upsert-content",
                // autoClose: 5000,
            })
            dispatch({
                type: EDIT_CONTENT_PAGE,
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

export const deleteContent = (contentId) => dispatch => {
    dispatch(emptyError());
    let url = `${ENV.url}content/delete/${contentId}`;

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
            toast.success(data.message)
            dispatch({
                type: DELETE_CONTENT_PAGE,
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

export const addContent = (body) => dispatch => {
    dispatch(emptyError());
    const url = `${ENV.url}content/create`;

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
            toast.success(data.message, {
                toastId: "add-content",
                // autoClose: 5000,
            })
            dispatch({
                type: ADD_CONTENT_PAGE,
                payload: data
            })
        } else {
            toast.error(data.message),
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

export const getContent = (contentId) => dispatch => {
    dispatch(emptyError());
    let url = `${ENV.url}content/get/${contentId}`;

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
            dispatch({
                type: GET_CONTENT_PAGE,
                payload: data.content
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