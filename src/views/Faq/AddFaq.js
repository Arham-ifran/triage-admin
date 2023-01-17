import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { addFaq, beforeFaq, listFaqCategories, beforeFaqCat } from './Faq.action';
import FullPageLoader from 'components/FullPageLoader/FullPageLoader';
import 'rc-pagination/assets/index.css';
import { Button, Card, Form, Table, Container, Row, Col, OverlayTrigger, Tooltip, Modal } from "react-bootstrap";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import Select from 'react-select'
import { ENV } from '../../config/config'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import validator from 'validator';

const AddFaq = (props) => {

    const [data, setData] = useState({
        title: '',
        desc: '',
        catId: '',
        status: false
    })

    const [msg, setMsg] = useState({
        title: '',
        desc: '',
        faqCat: ''
    })
    const [faqCats, setFaqCats] = useState([])
    const [loader, setLoader] = useState(true)

    useEffect(() => {
        window.scroll(0, 0)
        const qs = ENV.objectToQueryString({ all: true, status: true })
        props.listFaqCategories(qs, false)
    }, [])

    useEffect(() => {
        if (props.faqs.listFaqCatAuth) {
            let faqCat = props.faqs.listFaqCat.faqCategories
            if (faqCat && faqCat.length) {
                setFaqCats(
                    faqCat.map((item) => {
                        return ({
                            value: item._id, label: item.title
                        })
                    })
                )
            }
            setLoader(false)
            props.beforeFaqCat()
        }
    }, [props.faqs.listFaqCatAuth])

    useEffect(() => {
        if (props.faqs.createAuth) {
            props.beforeFaq()
            props.history.push(`/faqs`)
        }
    }, [props.faqs.createAuth])

    const add = () => {
        if (!validator.isEmpty(data.title) && !validator.isEmpty(data.desc) && !validator.isEmpty(data.catId)) {
            setMsg({
                title: '',
                desc: '',
                faqCat: ''
            })
            let formData = new FormData()
            for (const key in data)
                formData.append(key, data[key])
            props.addFaq(formData)
        }
        else {
            let title = ''
            let desc = ''
            let faqCat = ''
            if (validator.isEmpty(data.title)) {
                title = 'Title Required.'
            }
            if (validator.isEmpty(data.desc)) {
                desc = 'Description Required.'
            }
            if (validator.isEmpty(data.catId)) {
                faqCat = 'Faq Category Required.'
            }
            setMsg({ title, desc, faqCat })
        }
    }

    const onEditorChange = (event, editor) => {
        let editorData = editor.getData();
        setData({ ...data, desc: editorData });
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
                                        <Card.Title as="h4">Add FAQ</Card.Title>
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
                                            <Col md="6">
                                                <Form.Group>
                                                    <label>Faq Category<span className="text-danger"> *</span></label>
                                                    <div className='select-items'>
                                                    <Select classNamePrefix="triage-select" placeholder={<span>Select Faq Category</span>} className="w-100" options={faqCats} onChange={(e) => { setData({ ...data, catId: e.value }) }} />
                                                    </div>
                                                    <span className={msg.faqCat ? `` : `d-none`}>
                                                        <label className="pl-1 text-danger">{msg.faqCat}</label>
                                                    </span>
                                                </Form.Group>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col md="12" sm="6">
                                                <label>Text / Description<span className="text-danger"> *</span></label>
                                                <CKEditor
                                                    editor={ClassicEditor}
                                                    data={data.desc ? data.desc : ''}
                                                    content={data.desc ? data.desc : ''}
                                                    onChange={(event, editor) => onEditorChange(event, editor)}
                                                />
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
                                            <Col md="12" sm="6">
                                                <div className='d-flex justify-content-end align-items-center'>
                                                    <Button
                                                        className="btn-filled pull-right mt-3"
                                                        type="submit"
                                                        variant="info"
                                                        onClick={add}
                                                    >
                                                        Add
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

export default connect(mapStateToProps, { addFaq, beforeFaq, listFaqCategories, beforeFaqCat })(AddFaq);