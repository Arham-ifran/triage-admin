import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { addPromoCode, beforePromoCode } from './PromoCode.action';
import FullPageLoader from 'components/FullPageLoader/FullPageLoader';
import 'rc-pagination/assets/index.css';
import { Button, Card, Form, Container, Row, Col } from "react-bootstrap";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import Select from 'react-select'
import { ENV } from '../../config/config'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import validator from 'validator';
import { Link } from 'react-router-dom';

const AddPromoCode = (props) => {

    const [data, setData] = useState({
        title: '',
        NoOfTimesCodeAvailable: '',
        description: '',
        bonus: '',
        codeType: '',
        status: false
    })
    const [loader, setLoader] = useState(false)


    const [msg, setMsg] = useState({
        title: '',
        NoOfTimesCodeAvailable: '',
        bonus: '',
        description: '',
        codeType: ''
    })


    useEffect(() => {
        if (props.promoCodes.createPromoCodeAuth) {
            props.beforePromoCode()
            props.history.push(`/promo-codes`)
        }
    }, [props.promoCodes.createPromoCodeAuth])

    const add = () => {
        if (data.title && data.NoOfTimesCodeAvailable && data.bonus && data.codeType && data.description) {
            setMsg({
                title: '',
                NoOfTimesCodeAvailable: "",
                codeType: '',
                bonus: '',
                description: '',
            })
            let formData = new FormData()
            for (const key in data)
                formData.append(key, data[key])
            props.addPromoCode(formData)
        }
        else {
            let title = ''
            let NoOfTimesCodeAvailable = ""
            let description = ''
            let codeType = ""
            let bonus = ""
            if (!data.title) {
                title = 'Title Required.'
            }
            if (!data.NoOfTimesCodeAvailable) {
                NoOfTimesCodeAvailable = 'Specify How many times this promo code will be available.'
            }
            if (!data.codeType) {
                codeType = 'Select Code Type.'
            }
            if (!data.bonus) {
                bonus = 'Bonus Required.'
            }
            if (!data.description) {
                description = 'Description Required.'
            }
            setMsg({ title, NoOfTimesCodeAvailable, codeType, description, bonus })
        }
    }

    const onEditorChange = (event, editor) => {
        let editorData = editor.getData();
        setData({ ...data, description: editorData });
    }

    const codeTypes = [
        { label: 'Tokens', value: 1 },
        { label: 'Profit', value: 2 },
    ];


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
                                        <Card.Title as="h4">Add Promo Code</Card.Title>
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
                                            <Col md="6">
                                                <Form.Group>
                                                    <label>No. Of Times Promo Code Available<span className="text-danger"> *</span></label>
                                                    <Form.Control
                                                        value={data.NoOfTimesCodeAvailable ? data.NoOfTimesCodeAvailable : ''}
                                                        onKeyDown={(e) => ENV.integerNumberValidator(e)}
                                                        onChange={(e) => {
                                                            setData({ ...data, NoOfTimesCodeAvailable: e.target.value });
                                                        }}
                                                        placeholder="No. Of Times Promo Code Available"
                                                        type="number"
                                                        min={1}
                                                        step={1}
                                                    ></Form.Control>
                                                    <span className={msg.NoOfTimesCodeAvailable ? `` : `d-none`}>
                                                        <label className="pl-1 text-danger">{msg.NoOfTimesCodeAvailable}</label>
                                                    </span>
                                                </Form.Group>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col md="6">
                                                <Form.Group>
                                                    <label>Code Type<span className="text-danger"> *</span></label>
                                                    <div className='select-items'>
                                                        <Select placeholder={<span>Select Code Type</span>} className="w-100" classNamePrefix="triage-select"
                                                            options={codeTypes}
                                                            onChange={(e) => { setData({ ...data, codeType: e.value }) }}

                                                        />
                                                    </div>
                                                    <span className={msg.codeType ? `` : `d-none`}>
                                                        <label className="pl-1 text-danger">{msg.codeType}</label>
                                                    </span>
                                                </Form.Group>
                                            </Col>
                                            <Col md="6">
                                                <Form.Group>
                                                    <label>Bonus<span className="text-danger"> *</span></label>
                                                    <Form.Control
                                                        value={data.bonus ? data.bonus : ''}
                                                        onChange={(e) => {
                                                            setData({ ...data, bonus: e.target.value });
                                                        }}
                                                        placeholder="Amount of Promo Code"
                                                        type="Number"
                                                        min={0}
                                                    ></Form.Control>
                                                    <span className={msg.bonus ? `` : `d-none`}>
                                                        <label className="pl-1 text-danger">{msg.bonus}</label>
                                                    </span>
                                                </Form.Group>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col md="12" sm="6">
                                                <label>Text / Description<span className="text-danger"> *</span></label>
                                                <CKEditor
                                                    editor={ClassicEditor}
                                                    data={data.description ? data.description : ''}
                                                    content={data.description ? data.description : ''}
                                                    onChange={(event, editor) => onEditorChange(event, editor)}
                                                />
                                                <span className={msg.description ? `` : `d-none`}>
                                                    <label className="pl-1 text-danger">{msg.description}</label>
                                                </span>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col md="6">
                                                <Form.Group>
                                                    <div className='d-flex pt-3'>
                                                        <label className='mr-3'>Status<span className="text-danger"> *</span></label>
                                                        <label className="right-label-radio mr-3 mb-2 mt-1">Active
                                                            <input name="status" type="radio" checked={data.status} value={data.status} onChange={(e) => { setData({ ...data, status: true }) }} />
                                                            <span className="checkmark"></span>
                                                        </label>
                                                        <label className="right-label-radio mr-3 mb-2 mt-1">Inactive
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
                                                    <Link
                                                        className="btn-filled pull-right mt-3 mr-3"
                                                        variant="info"
                                                        to={'/promo-codes'}
                                                    >
                                                        Back
                                                    </Link>
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
    promoCodes: state.promoCodes,
    error: state.error
});

export default connect(mapStateToProps, { addPromoCode, beforePromoCode })(AddPromoCode);