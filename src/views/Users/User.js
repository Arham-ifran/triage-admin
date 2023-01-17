import FullPageLoader from 'components/FullPageLoader/FullPageLoader';
import 'rc-pagination/assets/index.css';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { Card, Col, Container, Row, Form, Button } from "react-bootstrap";
import { connect } from 'react-redux';
import { getKyc, beforeKyc, updatePersonalDoc } from './kyc.action';
import placeholderImg from '../../assets/images/placeholder.png';
import { Link, useHistory } from 'react-router-dom';
import Lightbox from 'react-image-lightbox';
import moment from 'moment';
import 'react-image-lightbox/style.css'; 

const User = (props) => {

    const history = useHistory();
    const [data, setData] = useState({
      
    })
    const [loader, setLoader] = useState(true)
    const [open, setOpen] = useState(false)
    const [lightBoxImage, setLightBoxImage] = useState()
    const [id, setId] = useState('')
    const [kycStatus, setkycStatus] = useState(false)


    useEffect(() => {
        window.scroll(0, 0)
        const _id = window.location.href.split('/')[5]
        if (_id) {
            props.getKyc(window.atob(_id))
            setId(window.atob(_id))
        }
        else {
            setLoader(false)
        }
    }, [])

    useEffect(() => {
        if (props.kyc.getKYCAuth) {
            setData({ ...props.kyc.kycData })
            if((props.kyc.kycData.appliedKYC)==3)
            {
                   setkycStatus(true)
            }
            else{
                   setkycStatus(false)
            }
            props.beforeKyc()
            setLoader(false)
        }
    }, [props.kyc.getKYCAuth])

    useEffect(() => {
        if (props.kyc.updateAuth) {
            history.push('/kyc')
            props.beforeKyc()
        }
    }, [props.kyc.updateAuth])


    const AllowUser = () => {
        if(!kycStatus)
        {
        Swal.fire({
            title: 'ARE YOU SURE! Want to Approve?',
            html: 'If you Approve, User will be able to Perform all Funtionality',
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'OK'
        }).then(async (result) => {
            if (result.value) {
                setkycStatus(true)
                onChange()              
            }
        })
    }
    }

    const onChange = () => {
        let formData = new FormData()
        formData.append('userId', id)
        formData.append('appliedKYC', 3)
        props.updatePersonalDoc(formData)
        setLoader(true)
    }

    const handleLightBox = (image) => {
        setOpen(!open)
        setLightBoxImage(image)
    }

console.log("dataofCurrent",data)
    return (
        <>
            {
                loader ?
                    <FullPageLoader />
                    :
                    <Container> {console.log(data,"datatatataat")}
                        <div className="d-flex justify-content-between align-items-center flex-column flex-sm-row py-3">
                            <h3 className='text-white mx-0 mt-0 mb-2 mb-sm-0'>KYC Details</h3>
                            <span className="text-white">{moment(data?.createdAt).format('MMMM Do YYYY, h:mm:ss a')}</span>
                        </div>
                        <Row>
                            <Col md="12">
                                <Card className="pb-3">
                                    <Card.Header className='d-flex justify-content-between flex-wrap align-items-end'>
                                        <div>      <Card.Title as="h4" className='mb-3'>Proof of Identity</Card.Title></div>
                                        <div className='kyc-edit-sec text-center'>
                                            <label>KYC Verification</label>
                                            <div className='text-white'>
                                                <Form>
                                                    <Form.Check
                                                        type="switch"
                                                        id="kyc-switch"
                                                        checked={kycStatus}
                                                        onChange={AllowUser}
                                                    />
                                                </Form>
                                            </div>
                                        </div>
                                    </Card.Header>
                                    <Card.Body>
                                        <>
                                            <Row>
                                                <Col md="12">
                                                    <div className='text-white pb-3'>
                                                        Type:
                                                        {data?.personalDocumentPassportFront ? " Passport" :
                                                        data?.personalDocumentIDCardFront ? " IDCard" :
                                                        data?.personalDocumentDrivingIDFront ? " DrivingID" : 'N/A' }
                                                    
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md="6">
                                                    <div className='text-white'>
                                                        <h4 className="mt-0 mb-3">Front</h4>
                                                        <div className='doc-holder'>
                                                            <img src={
                                                                 data?.personalDocumentPassportFront ? data?.personalDocumentPassportFront :
                                                                 data?.personalDocumentIDCardFront ? data?.personalDocumentIDCardFront  :
                                                                 data?.personalDocumentDrivingIDFront ?data?.personalDocumentDrivingIDFront :
                                                                    placeholderImg} className="img-fluid" width='260' height='260' onClick={()=> handleLightBox(
                                                                        data?.personalDocumentPassportFront ? data?.personalDocumentPassportFront :
                                                                        data?.personalDocumentIDCardFront ? data?.personalDocumentIDCardFront  :
                                                                        data?.personalDocumentDrivingIDFront ?data?.personalDocumentDrivingIDFront :
                                                                           placeholderImg                                                                        )}/>
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col className="pl-3" md="6">
                                                    <div className='text-white'>
                                                        <h4 className="mb-3 mt-0">Back</h4>
                                                        <div className='doc-holder'>
                                                            <img src={
                                                                 data?.personalDocumentPassportBack ? data?.personalDocumentPassportBack :
                                                                 data?.personalDocumentIDCardBack ? data?.personalDocumentIDCardBack  :
                                                                 data?.personalDocumentDrivingIDBack ?data?.personalDocumentDrivingIDBack :
                                                                    placeholderImg} className="img-fluid" width='260' height='260' onClick={()=> handleLightBox(
                                                                        data?.personalDocumentPassportBack ? data?.personalDocumentPassportBack :
                                                                        data?.personalDocumentIDCardBack ? data?.personalDocumentIDCardBack  :
                                                                        data?.personalDocumentDrivingIDBack ?data?.personalDocumentDrivingIDBack :
                                                                           placeholderImg
                                                                        )}/>
                                                        </div>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                        <Row>
                            <Col md="12" >
                                <Card className='pb-3'>
                                    <Row>
                                        <Col md="6">
                                            <Card.Header>
                                                <Card.Title as="h4" className='mb-3'>Address</Card.Title>
                                            </Card.Header>
                                            <Card.Body>
                                                <div className='text-white'>
                                                    <h4 className="mb-3 mt-0">Phone: {data?.countryCode ? data?.countryCode : ''} {data?.phone ? data?.phone : 'N/A'}</h4>
                                                </div>
                                            </Card.Body>
                                        </Col>
                                        <Col md="6">
                                            <Card.Header className="d-none d-md-block">
                                                <Card.Title as="h4" className='mb-3'>&nbsp;</Card.Title>
                                            </Card.Header>
                                            <Card.Body>
                                                <div className='text-white'>
                                                    <h4 className="mb-3 mt-0">Country: {data?.country ? data?.country : 'N/A'}</h4>
                                                </div>
                                            </Card.Body>
                                        </Col>
                                    </Row>
                                    <Row >
                                        <Col md="6">
                                            <Card.Body>
                                                <div className='text-white'>
                                                    <h4 className="mb-3 mt-0">Document With Address</h4>
                                                    <div className='doc-holder'>
                                                        <img src={data && data.addressDocument ? data && data.addressDocument : placeholderImg} className="img-fluid" 
                                                        onClick={()=> handleLightBox(data?.addressDocument)}
                                                        />
                                                    </div>
                                                </div>
                                            </Card.Body>
                                        </Col>
                                        {data && data.additionalDocument ?
                                            <Col md="6">
                                                <Card.Body>
                                                    <div className='text-white'>
                                                        <h4 className="mb-3 mt-0">Additional File</h4>
                                                        <div className='doc-holder'>
                                                            <img src={data && data.additionalDocument} className="img-fluid" onClick={()=> handleLightBox(data?.additionalDocument)} />
                                                        </div>
                                                    </div>
                                                </Card.Body>
                                            </Col>
                                        :
                                            ""
                                        }
                                    </Row>
                                </Card>
                            </Col>
                        </Row>
                        <Link to={'/kyc'}  variant="info" className='btn-filled' >Back</Link>
                        {open &&<Lightbox mainSrc={lightBoxImage} onCloseRequest={() => setOpen(!open)} /> }
                    </Container>
            }
        </>
    )
}

const mapStateToProps = state => ({
    kyc: state.kyc
});

export default connect(mapStateToProps, { getKyc, beforeKyc, updatePersonalDoc })(User);