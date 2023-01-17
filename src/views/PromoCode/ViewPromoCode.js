import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { beforePromoCode, getPromoCode, updatePromoCode } from './PromoCode.action';
import FullPageLoader from 'components/FullPageLoader/FullPageLoader';
import 'rc-pagination/assets/index.css';
import { Button, Card, Form, Table, Container, Row, Col, OverlayTrigger, Tooltip, Modal } from "react-bootstrap";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import Select from 'react-select'
import { ENV } from '../../config/config'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import validator from 'validator';
import { faTachometerAlt } from '@fortawesome/free-solid-svg-icons';

const EditPromoCode = (props) => {

    const [data, setData] = useState({})

    const [msg, setMsg] = useState({
        title: '',
        NoOfTimesCodeAvailable: '',
        bonus: '',
        description: '',
        codeType: ''
    })

    const [loader, setLoader] = useState(true)

    useEffect(() => {
        props.getPromoCode(window.location.pathname.split('/')[3])
    }, [])

    useEffect(() => {
        if (props.promoCodes.getPromoCodeAuth) {
            setLoader(false)
            const { title, NoOfTimesCodeAvailable, codeType, bonus, status, description } = props.promoCodes.promoCode
            setData({ title, NoOfTimesCodeAvailable, codeType, bonus, status, description, _id: window.location.pathname.split('/')[3] })
            props.beforePromoCode()
        }
    }, [props.promoCodes.getPromoCodeAuth])



    useEffect(() => {
        if (props.promoCodes.editPromoCodeAuth) {
            props.beforePromoCode()
            props.history.push(`/promo-codes`)
        }
    }, [props.promoCodes.editPromoCodeAuth])


    const update = () => {
        if (data.title && data.NoOfTimesCodeAvailable && data.bonus && data.codeType && data.description) {
            setMsg({
                title: '',
                NoOfTimesCodeAvailable: "",
                codeType: '',
                bonus: '',
                description: '',
            })
            if (data.status === undefined)
                data.status = false
            let formData = new FormData()
            for (const key in data)
                formData.append(key, data[key])
            props.updatePromoCode(formData)
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
                                <Card className="pb-3">
                                    <Card.Header>
                                        <Card.Title as="h4">Promo Code</Card.Title>
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
                                                        disabled
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
                                                        onChange={(e) => {
                                                            setData({ ...data, NoOfTimesCodeAvailable: e.target.value });
                                                        }}
                                                        placeholder="No. Of Times Promo Code Available"
                                                        type="Number"
                                                        disabled
                                                        min={0}
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
                                                        isDisabled
                                                        value={codeTypes.filter(codeType => codeType.value === data.codeType)}
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
                                                        disabled
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
                                                    disabled
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

export default connect(mapStateToProps, { beforePromoCode, getPromoCode, updatePromoCode })(EditPromoCode);