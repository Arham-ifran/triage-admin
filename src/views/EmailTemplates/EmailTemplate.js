import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { beforeEmail, getEmail, updateEmail, addEmail } from './EmailTemplates.action';
import FullPageLoader from 'components/FullPageLoader/FullPageLoader';
import 'rc-pagination/assets/index.css';
import { Button, Card, Form, Table, Container, Row, Col, OverlayTrigger, Tooltip, Modal } from "react-bootstrap";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { Link, useHistory } from 'react-router-dom';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import validator from 'validator';
import { toast } from 'react-toastify';

const EmailTemplate = (props) => {
    const history = useHistory();
    const [emailData, setEmailData] = useState({
        type: '',
        subject: '',
        text: ''
    })
    const [addCheck, setAddCheck] = useState(false)
    const [msgCheck, setMsgCheck] = useState({
        type: '',
        subject: '',
        text: ''
    })
    const [loader, setLoader] = useState(true)

    useEffect(() => {
        toast.dismiss()
        window.scroll(0, 0)
        if (window.location.pathname.split('/')[3]) {
            props.getEmail(window.location.pathname.split('/')[3])
        }
        else {
            setLoader(false)
            setAddCheck(true)
        }
    }, [])

    useEffect(() => {
        if (props.email.getEmailAuth) {
            const { type, subject, text, _id } = props.email.email
            setEmailData({
                type,
                subject,
                text,
                _id
            })
            props.beforeEmail()
            setLoader(false)
        }
    }, [props.email.getEmailAuth])

    useEffect(() => {
        if (props.email.updateAuth) {
            const { type, subject, text, _id } = props.email.email
            setEmailData({
                type,
                subject,
                text,
                _id
            })
            props.beforeEmail()
        }
    }, [props.email.updateAuth])

    useEffect(() => {
        if (props.email.upsertAuth) {
            props.beforeEmail()
            history.push('/email-templates')
        }
    }, [props.email.upsertAuth])

    useEffect(() => {
        if (props.email.addEmailAuth) {
            props.beforeEmail()
            history.push('/email-templates')
        }
    }, [props.email.addEmailAuth])

    
    // when an error is received
    useEffect(() => {
        if (props.error.error)
            setLoader(false)
    }, [props.error.error])

    const update = () => {
        if (!validator.isEmpty(emailData.type) && !validator.isEmpty(emailData.subject) && !validator.isEmpty(emailData.text)) {
            setMsgCheck({
                subject: false,
                text: false
            })
            let formData = new FormData()
            for (const key in emailData)
                formData.append(key, emailData[key])
            if (addCheck) {
                props.addEmail(formData)
            }
            else {
                props.updateEmail(formData)
            }
        }
        else {
            let type = ''
            let subject = ''
            let text = ''
            if (validator.isEmpty(emailData.type)) {
                type = 'Type is required.'
            }
            if (validator.isEmpty(emailData.subject)) {
                subject = 'Subject is required.'
            }
            if (validator.isEmpty(emailData.text)) {
                text = 'Text / Description is required.'
            }
            setMsgCheck({ type, subject, text })
        }
    }

    const onEditorChange = (event, editor) => {
        let data = editor.getData();
        setEmailData({ ...emailData, text: data });
    }



    return (
        <>
            {
                loader ?
                    <FullPageLoader />
                    :
                    <Container>
                        <Row>
                            <Col md="12">
                                <Card className="pb-3">
                                    <Card.Header>
                                        <Card.Title as="h4" className='mb-3'>Email Template</Card.Title>
                                        <p className="card-collection text-white">Note: Make sure you {addCheck ? 'add' : 'edit'} content using source &amp; don't {addCheck ? 'add' : 'edit'} keywords starting &amp; ending with $$ (e.g. $$USER$$) or special text inside x tag.</p>
                                    </Card.Header>
                                    <Card.Body>
                                        <Row>
                                            <Col md="6">
                                                <Form.Group>
                                                    <label>Type<span className="text-danger"> *</span></label>
                                                    <Form.Control
                                                        value={emailData.type}
                                                        onChange={(e) => {
                                                            setEmailData({ ...emailData, type: e.target.value });
                                                        }}
                                                        placeholder="Type"
                                                        type="text"
                                                        disabled={addCheck ? false : true}
                                                    ></Form.Control>
                                                    <span className={msgCheck.type ? `` : `d-none`}>
                                                        <label className="pl-1 pt-1 text-danger">{msgCheck.type}</label>
                                                    </span>
                                                </Form.Group>
                                            </Col>
                                            <Col className="pl-3" md="6">
                                                <Form.Group>
                                                    <label>Subject<span className="text-danger"> *</span></label>
                                                    <Form.Control
                                                        value={emailData.subject}
                                                        onChange={(e) => {
                                                            setEmailData({ ...emailData, subject: e.target.value });
                                                        }}
                                                        placeholder="Subject"
                                                        type="text"
                                                    ></Form.Control>
                                                    <span className={msgCheck.subject ? `` : `d-none`}>
                                                        <label className="pl-1 pt-1 text-danger">{msgCheck.subject}</label>
                                                    </span>
                                                </Form.Group>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col md="12">
                                                <label>Text / Description<span className="text-danger"> *</span></label>
                                                <CKEditor
                                                    editor={ClassicEditor}
                                                    data={emailData?.text || ''}
                                                    content={emailData?.text || ''}
                                                    onChange={(event, editor) => onEditorChange(event, editor)}
                                                />
                                                <span className={msgCheck.text ? `` : `d-none`}>
                                                    <label className="pl-1 pt-1 text-danger">{msgCheck.text}</label>
                                                </span>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col md="12" sm="6">
                                                <div className='d-flex justify-content-end align-items-center'>
                                                    <Link to={'/email-templates'} className="btn-filled pull-right mt-3 mr-3 p-3 mb-1" variant="info" >Back</Link>
                                                    <Button className="btn-filled pull-right mt-3 p-3" type="submit" variant="info" onClick={update}>
                                                        {addCheck ? 'Add' : 'Update'}
                                                    </Button>
                                                </div>
                                            </Col>
                                        </Row>

                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
            }
        </>
    )
}

const mapStateToProps = state => ({
    email: state.email,
    error: state.error
});

export default connect(mapStateToProps, { beforeEmail, getEmail, updateEmail, addEmail })(EmailTemplate);