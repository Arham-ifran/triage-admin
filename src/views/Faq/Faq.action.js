import { toast } from 'react-toastify';
import { emptyError } from '../../redux/shared/error/error.action';
import { BEFORE_FAQ, CREATE_FAQ, DELETE_FAQ, EDIT_FAQ, GET_ERRORS, GET_FAQ, GET_FAQS, CREATE_FAQ_CAT, BEFORE_FAQ_CAT, LIST_FAQ_CAT, GET_FAQ_CAT, EDIT_FAQ_CAT, DELETE_FAQ_CAT } from '../../redux/types';
import { ENV } from './../../config/config';

export const beforeFaq = () => {
    return {
        type: BEFORE_FAQ
    }
}

export const getFaqs = (qs = '', body = {}) => dispatch => {
    toast.dismiss();
    dispatch(emptyError());
    let url = `${ENV.url}faq/list`;
    if (qs)
        url += `?${qs}`

    fetch(url, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token
        },
        body: JSON.stringify(body)
    }).then(res => res.json()).then(data => {
        if (data.success) {
            toast.success(data.message)
            dispatch({
                type: GET_FAQS,
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

export const updateFaq = (body) => dispatch => {
    dispatch(emptyError());
    const url = `${ENV.url}faq/edit`;

    fetch(url, {
        method: 'PUT',
        headers: {
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token
        },
        body
    }).then(res => res.json()).then(data => {
        if (data.success) {
            toast.success(data.message, { toastId: 'update-faq-success' })
            dispatch({
                type: EDIT_FAQ,
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

export const deleteFaq = (faqId) => dispatch => {
    dispatch(emptyError());
    let url = `${ENV.url}faq/delete/${faqId}`;

    fetch(url, {
        method: 'DELETE',
        headers: {
            'content-type': 'application/json',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token
        }
    }).then(res => res.json()).then(data => {
        if (data.success) {
            toast.success(data.message)
            dispatch({
                type: DELETE_FAQ,
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

export const addFaq = (body) => dispatch => {
    dispatch(emptyError());
    const url = `${ENV.url}faq/create`;

    fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token
        },
        body
    }).then(res => res.json()).then(data => {
        if (data.success) {
            toast.success(data.message)
            dispatch({
                type: CREATE_FAQ,
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

export const getFaq = (faqId) => dispatch => {
    dispatch(emptyError());
    let url = `${ENV.url}faq/get/${faqId}`;

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
                type: GET_FAQ,
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

// Faq Categories

export const beforeFaqCat = () => {
    return {
        type: BEFORE_FAQ_CAT
    }
}

export const addFaqCat = (body) => dispatch => {
    dispatch(emptyError());
    const url = `${ENV.url}faq-categories/create`;

    fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token
        },
        body
    }).then(res => res.json()).then(data => {
        if (data.success) {
            toast.success(data.message)
            dispatch({
                type: CREATE_FAQ_CAT,
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

export const listFaqCategories = (qs = '', showToast = true, body = {}) => dispatch => {
    toast.dismiss();
    dispatch(emptyError());
    let url = `${ENV.url}faq-categories/list`;
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
            if (showToast)
                toast.success(data.message, {
                    toastId: "faqs-stats-success"
                })
            dispatch({
                type: LIST_FAQ_CAT,
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

export const getFaqCategory = (faqCatId) => dispatch => {
    dispatch(emptyError());
    let url = `${ENV.url}faq-categories/get/${faqCatId}`;

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
                type: GET_FAQ_CAT,
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

export const editFaqCategory = (body) => dispatch => {
    dispatch(emptyError());
    const url = `${ENV.url}faq-categories/edit`;

    fetch(url, {
        method: 'PUT',
        headers: {
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token
        },
        body
    }).then(res => res.json()).then(data => {
        if (data.success) {
            toast.success(data.message, { toastId: 'update-faq-success' })
            dispatch({
                type: EDIT_FAQ_CAT,
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

export const deleteFaqCat = (faqCatId) => dispatch => {
    dispatch(emptyError());
    let url = `${ENV.url}faq-categories/delete/${faqCatId}`;

    fetch(url, {
        method: 'DELETE',
        headers: {
            'content-type': 'application/json',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token
        }
    }).then(res => res.json()).then(data => {
        if (data.success) {
            toast.success(data.message)
            dispatch({
                type: DELETE_FAQ_CAT,
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