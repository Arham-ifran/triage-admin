import { LIST_NEWSLETTERS, BEFORE_NEWSLETTERS,SEND_NEWS_LETTER_EMAILS,GET_ERRORS} from '../../redux/types';
import { ENV } from '../../config/config';
import { emptyError } from '../../redux/shared/error/error.action'
import { toast } from 'react-toastify';

export const beforeNewsletter = () => {
    return {
        type: BEFORE_NEWSLETTERS
    }
}

export const listNewsletter = (qs = null) => dispatch => {
    toast.dismiss()
    dispatch(emptyError());
    let url = `${ENV.url}newsletter/list`;
    if (qs)
        url += `?${qs}`
    fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token,
        },
    }).then(res => res.json()).then(data => {
        if (data.success) {
            toast.success(data.message)
            dispatch({
                type: LIST_NEWSLETTERS,
                payload: data.data
            })
        } else {
            dispatch({
                type: GET_ERRORS,
                payload: data
            })
        }
    }).catch(errors => {
        dispatch({
            type: GET_ERRORS,
            payload: errors
        })
    })
};

export const sendEmail = (body) => dispatch => {
    dispatch(emptyError());
    let url = `${ENV.url}newsletter/send-email`;
    fetch(url, {
        method: "POST",
        headers: {
            "content-type": "application/json",
            "Authorization": ENV.Authorization,
            "x-auth-token": ENV.x_auth_token,
        },
        body: JSON.stringify(body),
    }).then((res) => res.json())
        .then((data) => {
            if (data.status) {
                if (data.message) {
                    toast.success(`${data.message}`, {
                        toastId: "SEND_NEWS_LETTER_EMAILS_SUCCESS"
                    });
                }
                dispatch({
                    type: SEND_NEWS_LETTER_EMAILS,
                });
            } else {
                dispatch({
                    type: GET_ERRORS,
                    payload: data,
                });
            }
        })
        .catch((errors) => {
            dispatch({
                type: GET_ERRORS,
                payload: errors,
            });
        });
};
