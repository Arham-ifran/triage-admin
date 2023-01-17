import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { addFaqCat, beforeFaqCat, getFaqCategory, editFaqCategory } from './Faq.action';
import FullPageLoader from 'components/FullPageLoader/FullPageLoader';
import 'rc-pagination/assets/index.css';
import { Button, Card, Form, Table, Container, Row, Col, OverlayTrigger, Tooltip, Modal } from "react-bootstrap";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import validator from 'validator';

const UpsertFaqCategory = (props) => {

    const [data, setData] = useState({
        title: '',
        desc: '',
        status: false
    })

    const [msg, setMsg] = useState({
        title: '',
        desc: ''
    })
    const [id, setId] = useState('')
    const [loader, setLoader] = useState(true)


    useEffect(() => {
        window.scroll(0, 0)
        if (window.location.href.split('/')[5]) {
            setId(window.atob(window.location.href.split('/')[5]))
            props.getFaqCategory(window.atob(window.location.href.split('/')[5]))
        }
        else {
            setLoader(false)
        }
    }, [])

    useEffect(() => {
        if (props.faqs.createFaqCatAuth) {
            props.beforeFaqCat()
            props.history.push(`/faq-categories`)
        }
    }, [props.faqs.createFaqCatAuth])

    useEffect(() => {
        if (props.faqs.getFaqCatAuth) {
            if (props.faqs.getFaqCat.faqCategories) {
                setData(props.faqs.getFaqCat.faqCategories)
            }
            setLoader(false)
            props.beforeFaqCat()
        }
    }, [props.faqs.getFaqCatAuth])

    useEffect(() => {
        if (props.faqs.editFaqCatAuth) {
            props.beforeFaqCat()
            props.history.push(`/faq-categories`)
        }
    }, [props.faqs.editFaqCatAuth])


    const submit = () => {
        if (!validator.isEmpty(data.title) && !validator.isEmpty(data.desc)) {
            setMsg({
                title: '',
                desc: ''
            })
            let formData = new FormData()
            for (const key in data)
                formData.append(key, data[key])
            if (id) {
                props.editFaqCategory(formData)
            }
            else {
                props.addFaqCat(formData)
            }
        }
        else {
            let title = ''
            let desc = ''
            if (validator.isEmpty(data.title)) {
                title = 'Title Required.'
            }
            if (validator.isEmpty(data.desc)) {
                desc = 'Description Required.'
            }
            setMsg({ title, desc })
        }
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
                                <Card className="pb-3 table-big-boy">
                                    <Card.Header>
                                        <Card.Title as="h4">{id ? 'Edit' : 'Add'} FAQ Category</Card.Title>
                                    </Card.Header>
                                    <Card.Body>
                                        <Row>
                                            <Col md="6">
                                                <Form.Group>
                                                    <label>Title<span className="text-danger"> *</span></label>
                                                    <Form.Control
                                                        value={data.title ? data.title : ''}
                                                        onChange={(e) => {
                                                            setData({ ...data, title: e.target.value });
                                                        }}
                                                        placeholder="Title"
                                                        type="text"
                                                    ></Form.Control>
                                                    <span className={msg.title ? `` : `d-none`}>
                                                        <label className="pl-1 text-danger">{msg.title}</label>
                                                    </span>
                                                </Form.Group>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col md="12" sm="6">
                                                <label>Text / Description<span className="text-danger"> *</span></label>
                                                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                                    <Form.Control as="textarea" rows={5} placeholder={'Description'} value={data.desc} onChange={(e) => { setData({ ...data, desc: e.target.value }) }} />
                                                </Form.Group>
                                                <span className={msg.desc ? `` : `d-none`}>
                                                    <label className="pl-1 text-danger">{msg.desc}</label>
                                                </span>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col md="6">
                                                <Form.Group>
                                                    <div className='d-flex pt-3'>
                                                        <label className='mr-3'>Status<span className="text-danger"> *</span></label>
                                                        <label className="right-label-radio mr-3 mb-2">Active
                                                            <input name="status" type="radio" checked={data.status} value={data.status} onChange={(e) => { setData({ ...data, status: true }) }} />
                                                            <span className="checkmark"></span>
                                                        </label>
                                                        <label className="right-label-radio mr-3 mb-2">Inactive
                                                            <input name="status" type="radio" checked={!data.status} value={!data.status} onChange={(e) => { setData({ ...data, status: false }) }} />
                                                            <span className="checkmark"></span>
                                                        </label>
                                                    </div>
                                                </Form.Group>
                                            </Col>
                                        </Row>

                                        <Row>
                                        <Col  md="6" sm="6">
                                                <div className='d-flex justify-content-start align-items-center'>
                                                    <Button
                                                        className="btn-filled pull-right mt-3"
                                                        type="submit"
                                                        variant="info"
                                                        onClick={()=> props.history.goBack()}
                                                    >
                                                        Back
                                                    </Button>
                                                </div>
                                            </Col>
                                            <Col md="6" sm="6">
                                                <div className='d-flex justify-content-end align-items-center'>
                                                    <Button
                                                        className="btn-filled pull-right mt-3"
                                                        type="submit"
                                                        variant="info"
                                                        onClick={submit}
                                                    >
                                                        {id ? 'Update' : 'Add'}
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
    faqs: state.faqs,
    error: state.error
});

export default connect(mapStateToProps, { addFaqCat, beforeFaqCat, getFaqCategory, editFaqCategory })(UpsertFaqCategory);