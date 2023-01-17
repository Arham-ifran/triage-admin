import { LIST_HISTORY, BEFORE_HISTORY, GET_ERRORS } from '../../redux/types'
import { toast } from 'react-toastify';
import { emptyError } from '../../redux/shared/error/error.action';
import { ENV } from './../../config/config';

export const beforeHistory = () => {
    return {
        type: BEFORE_HISTORY
    }
}

export const listHistory = (qs = '', showToast = true) => dispatch => {
    toast.dismiss();
    dispatch(emptyError());
    let url = `${ENV.url}history/list`;
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
                    toast.success(data.message, {
                        toastId: "cms-stats-success"
                    })
            }
            dispatch({
                type: LIST_HISTORY,
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