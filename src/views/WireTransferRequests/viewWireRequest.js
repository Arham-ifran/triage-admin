import FullPageLoader from 'components/FullPageLoader/FullPageLoader';
import 'rc-pagination/assets/index.css';
import { useState, useEffect } from 'react';
import { Card, Col, Container, Row, Form } from "react-bootstrap";
import { connect } from 'react-redux';
import { getWireRequest, beforeWireRequest, updateWireRequest } from './wireTransfer.action';
import placeholderImg from '../../assets/images/placeholder.png';
import { useHistory } from 'react-router-dom';
import Lightbox from 'react-image-lightbox';
import moment from 'moment';
import 'react-image-lightbox/style.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

const EditWireRequest = (props) => {

    const history = useHistory();
    const [data, setData] = useState({

    })
    const [loader, setLoader] = useState(true)
    const [open, setOpen] = useState(false)
    const [lightBoxImage, setLightBoxImage] = useState()
    const [id, setId] = useState('')


    useEffect(() => {
        window.scroll(0, 0)
        const _id = window.location.href.split('/')[5]
        if (_id) {
            props.getWireRequest(window.atob(_id))
            setId(window.atob(_id))
        }
        else {
            setLoader(false)
        }
    }, [])

    useEffect(() => {
        if (props.wireRequest.requestAuth) {
            setData({ ...props.wireRequest.request })
            props.beforeWireRequest()
            setLoader(false)
        }
    }, [props.wireRequest.requestAuth])


    const handleLightBox = (image) => {
        setOpen(!open)
        setLightBoxImage(image)
    }

    const handleRequest = (status) => {
        let payload = {
            requestId: id,
            status
        }       
        props.updateWireRequest(payload)
    }

    useEffect(()=> {
        if(props.wireRequest.updateWireRequestAuth) {
            history.push('/wiretransfer-requests')
        }

    }, [props.wireRequest.updateWireRequestAuth])


    return (
        <>
            {
                loader ?
                    <FullPageLoader />
                    :
                    <Container> 
                        <div className="d-flex justify-content-between align-items-center flex-column flex-sm-row py-3">
                            <h3 className='text-white mx-0 mt-0 mb-2 mb-sm-0'>Receipt Details {data.status === 2 ? "(Approved)" : data.status === 3 ? "(Rejected)" : "" }</h3>
                        </div>
                        <Row>
                            <Col md="12">
                                <Card className="pb-3">
                                    <Card.Header className='d-flex justify-content-between flex-wrap align-items-end'>
                                        </Card.Header>
                                    <Card.Body>
                                        <Row>
                                            <Col md="3">
                                                <Form.Group>
                                                    <Form.Label className="d-block mb-2">Receipt</Form.Label>
                                                    <div className="receipt-detail-image-holder">
                                                        <img className="img-fluid" src={data.image ? data.image :placeholderImg} 
                                                        onClick={()=>handleLightBox(data.image ? data.image :placeholderImg)}
                                                        />
                                                    </div>
                                                </Form.Group>
                                                {/* <div className='text-white'>
                                                    <h4 className="mt-0 mb-3">Receipt</h4>
                                                    <div className='doc-holder'>
                                                        <img src={data.image ? data.image :placeholderImg} />
                                                    </div>
                                                </div> */}
                                            </Col>
                                            <Col md="9">
                                                <Row>
                                                    <Col md="12">
                                                        <Form.Group>
                                                            <Form.Label className="d-block mb-2">User Name</Form.Label>
                                                            <Form.Control type="text" value={data.userName} readOnly></Form.Control>
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md="6">
                                                        <Form.Group>
                                                            <Form.Label className="d-block mb-2">Email</Form.Label>
                                                            <Form.Control type="email" value={data.userEmail} readOnly></Form.Control>
                                                        </Form.Group>
                                                    </Col>
                                                    <Col sm="6">
                                                        <Form.Group>
                                                            <Form.Label className="d-block mb-2">Deposited Amount</Form.Label>
                                                            <Form.Control type="text" value={data.depositedAmount} readOnly></Form.Control>
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md="12">
                                                        <Form.Group className="pt-3">
                                                            <button disabled={data.status !== 1} className="btn btn-danger mr-2" onClick={()=> handleRequest(3)}>
                                                                <FontAwesomeIcon icon={faTimes} className="mr-2" />
                                                                Reject
                                                            </button>
                                                            <button disabled={data.status !== 1} className="btn btn-success mr-2" onClick={()=> handleRequest(2)}>
                                                            <FontAwesomeIcon icon={faCheck} className="mr-2" />
                                                                Approve
                                                            </button>
                                                        </Form.Group>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                        {open && <Lightbox mainSrc={lightBoxImage} onCloseRequest={() => setOpen(!open)} />}
                    </Container>
            }
        </>
    )
}

const mapStateToProps = state => ({
    wireRequest: state.wireRequest
});

export default connect(mapStateToProps, { getWireRequest, beforeWireRequest,updateWireRequest })(EditWireRequest);