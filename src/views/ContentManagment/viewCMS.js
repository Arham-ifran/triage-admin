import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import FullPageLoader from 'components/FullPageLoader/FullPageLoader';
import 'rc-pagination/assets/index.css';
import { useEffect, useState } from 'react';
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { connect } from 'react-redux';
import validator from 'validator';
import { addContent, beforeContent, getContent, updateContent } from './cms.action';
import { useHistory } from 'react-router-dom';

const viewCMS = (props) => {

    const history = useHistory();
    const [data, setData] = useState({
        title: '',
        description: '',
        status: false,
        showInFooter: false
    })

    const [msg, setMsg] = useState({
        title: '',
        description: ''
    })
    const [_id, setId] = useState('')
    const [loader, setLoader] = useState(true)


    useEffect(() => {
        window.scroll(0, 0)
        const _id = window.location.href.split('/')[5]
        if (_id) {
            setId(_id)
            props.getContent(window.atob(_id))
        }
        else {
            setLoader(false)
        }
    }, [])

    useEffect(() => {
        if (props.content.getContentAuth) {
            setData(props.content.getContentRes)
            setLoader(false)
        }
    }, [props.content.getContentAuth])

    useEffect(() => {
        if (props.content.addContentAuth) {
            props.beforeContent()
            history.push('/cms')
        }
    }, [props.content.addContentAuth])

    useEffect(() => {
        if (props.content.editContentAuth) {
            props.beforeContent()
            history.push('/cms')
        }
    }, [props.content.editContentAuth])

    const submit = () => {
        if (!validator.isEmpty(data.title) && !validator.isEmpty(data.description)) {
            setMsg({
                title: '',
                description: ''
            })
            let formData = new FormData()
            for (const key in data)
                formData.append(key, data[key])

            if (_id) {
                props.updateContent(formData)
            }
            else {
                props.addContent(formData)
            }
        }
        else {
            let title = ''
            let description = ''
            if (validator.isEmpty(data.title)) {
                title = 'Title Required.'
            }
            if (validator.isEmpty(data.description)) {
                description = 'Description Required.'
            }
            setMsg({ title, description })
        }
    }

    const onEditorChange = (event, editor) => {
        let editorData = editor.getData();
        setData({ ...data, description: editorData });
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
                                        <Card.Title as="h4">CMS Details</Card.Title>
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
                                                        disabled
                                                        type="text"
                                                    ></Form.Control>
                                                    <span className={msg.title ? `` : `d-none`}>
                                                        <label className="pl-1 text-danger">{msg.title}</label>
                                                    </span>
                                                </Form.Group>
                                            </Col>
                                        </Row>

                                        {
                                            _id ?
                                                <Row>
                                                    <Col md="6">
                                                        <Form.Group>
                                                            <label>Slug</label>
                                                            <Form.Control
                                                                value={data.slug ? data.slug : ''}
                                                                placeholder="slug"
                                                                disabled
                                                                type="text"
                                                            ></Form.Control>
                                                            <span className={msg.slug ? `` : `d-none`}>
                                                                <label className="pl-1 text-danger">{msg.slug}</label>
                                                            </span>
                                                        </Form.Group>
                                                    </Col>
                                                </Row>
                                                : ''
                                        }

                                        <Row>
                                            <Col md="12" sm="6">
                                                <label>Text / Description<span className="text-danger"> *</span></label>
                                                <CKEditor
                                                    editor={ClassicEditor}
                                                    disabled
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
                                                        <label className='mr-3'>Status</label>
                                                        <label className="right-label-radio mr-3 mb-2">Active
                                                            <input name="status" type="radio" disabled checked={data.status} value={data.status} onChange={(e) => { setData({ ...data, status: true }) }} />
                                                            <span className="checkmark"></span>
                                                        </label>
                                                        <label className="right-label-radio mr-3 mb-2">Inactive
                                                            <input name="status" type="radio" disabled checked={!data.status} value={!data.status} onChange={(e) => { setData({ ...data, status: false }) }} />
                                                            <span className="checkmark"></span>
                                                        </label>
                                                    </div>
                                                </Form.Group>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col md="6">
                                                <Form.Group>
                                                    <div className='d-flex pt-3'>
                                                        <label className='mr-3'>Show In Footer</label>
                                                        <label className='mr-3 pt-1'>
                                                            {/* <input class="form-check-input" type="checkbox" checked={data.showInFooter} onChange={(e) => { setData({ ...data, showInFooter: !data.showInFooter }); }} /> */}

                                                            <label class="right-label-checkbox">&nbsp;
                                                                <input type="checkbox" disabled checked={data.showInFooter} onChange={(e) => { setData({ ...data, showInFooter: !data.showInFooter }); }} />
                                                                <span class="checkmark"></span>
                                                            </label>
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
                                                        onClick={()=> history.goBack()}
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
    content: state.content,
    error: state.error
});

export default connect(mapStateToProps, { addContent, beforeContent, getContent, updateContent })(viewCMS);