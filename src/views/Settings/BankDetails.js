import { useState, useEffect } from "react";
import { ENV } from '../../config/config';
import { connect } from 'react-redux';
import FullPageLoader from "components/FullPageLoader/FullPageLoader";
var CryptoJS = require("crypto-js");
import {editBankDetails,beforeSettings,getBankDetails} from "./settings.action"


// react-bootstrap components
import {
    Button,
    Card,
    Form,
    Container,
    Row,
    Col,
} from "react-bootstrap";


const SiteSettings = (props) => {

    const [data, setData] = useState({})

    useEffect(()=> {
        props.getBankDetails()
    },[])

    useEffect(()=> {
        if(props.settings.getBankDetailsAuth) {
            props.beforeSettings()
            const bankList = props.settings.bankDetailsList
            setData(bankList)
        }
        
    }, [props.settings.getBankDetailsAuth])

    const save = () => {
        props.editBankDetails(data)
    }

    return (
        <>
            <Container fluid>
                <Row>
                    <Col md="12">
                        <Form action="" className="form-horizontal" id="TypeValidation" method="">
                            <Card className="table-big-boy">
                                <Card.Header>
                                    <div className="d-block d-md-flex align-items-center justify-content-between">
                                        <Card.Title as="h4">Bank Details</Card.Title>
                                    </div>
                                </Card.Header>

                                <Card.Body>
                                    <Row>
                                        <Col xl={6} md={12} >
                                            <Form.Group>
                                                <Form.Label className="d-block mb-2">Reference ID</Form.Label>
                                                <Form.Control type="text"
                                                    value={data?.referenceId}
                                                    onChange={(e) => { setData({ ...data, referenceId: e.target.value }) }}>
                                                </Form.Control>
                                            </Form.Group>
                                        </Col>
                                        <Col xl={6} md={12} >
                                            <Form.Group>
                                                <Form.Label className="d-block mb-2">Beneficiary name</Form.Label>
                                                <Form.Control type="text"
                                                    value={data?.beneficiaryName}
                                                    onChange={(e) => { setData({ ...data, beneficiaryName: e.target.value }) }}>
                                                </Form.Control>
                                            </Form.Group>
                                        </Col>
                                        <Col xl={6} md={12} >
                                            <Form.Group>
                                                <Form.Label className="d-block mb-2">Beneficiary address</Form.Label>
                                                <Form.Control type="text"
                                                    value={data?.beneficiaryAddress}
                                                    onChange={(e) => { setData({ ...data, beneficiaryAddress: e.target.value }) }}>
                                                </Form.Control>
                                            </Form.Group>
                                        </Col>
                                        <Col xl={6} md={12} >
                                            <Form.Group>
                                                <Form.Label className="d-block mb-2">Beneficiary Bank name</Form.Label>
                                                <Form.Control type="text"
                                                    value={data?.beneficiaryBankName}
                                                    onChange={(e) => { setData({ ...data, beneficiaryBankName: e.target.value }) }}>
                                                </Form.Control>
                                            </Form.Group>
                                        </Col>
                                        <Col xl={6} md={12} >
                                            <Form.Group>
                                                <Form.Label className="d-block mb-2">Beneficiary Bank address</Form.Label>
                                                <Form.Control type="text"
                                                    value={data?.beneficiaryBankAddress}
                                                    onChange={(e) => { setData({ ...data, beneficiaryBankAddress: e.target.value }) }}>
                                                </Form.Control>
                                            </Form.Group>
                                        </Col>
                                        <Col xl={6} md={12} >
                                            <Form.Group>
                                                <Form.Label className="d-block mb-2">Beneficiary bank account number - IBAN</Form.Label>
                                                <Form.Control type="text"
                                                    value={data?.Iban}
                                                    onChange={(e) => { setData({ ...data, Iban: e.target.value }) }}>
                                                </Form.Control>
                                            </Form.Group>
                                        </Col>
                                        <Col xl={6} md={12} >
                                            <Form.Group>
                                                <Form.Label className="d-block mb-2">BIC / SWIFT</Form.Label>
                                                <Form.Control type="text"
                                                    value={data?.bic}
                                                    onChange={(e) => { setData({ ...data, bic: e.target.value }) }}>
                                                </Form.Control>
                                            </Form.Group>
                                        </Col>
                                        <Col xl={6} md={12} >
                                            <Form.Group>
                                                <Form.Label className="d-block mb-2">Conditions</Form.Label>
                                                <Form.Control type="text"
                                                    value={data?.condition}
                                                    onChange={(e) => { setData({ ...data, condition: e.target.value }) }}>
                                                </Form.Control>
                                            </Form.Group>
                                        </Col>
                                        <Col xl={6} md={12} >
                                            <Form.Group>
                                                <Form.Label className="d-block mb-2">Attention</Form.Label>
                                                <Form.Control type="text"
                                                    value={data?.attention}
                                                    onChange={(e) => { setData({ ...data, attention: e.target.value }) }}>
                                                </Form.Control>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </Card.Body>
                                <Card.Footer>
                                    <Row className="float-right">
                                            <Col sm={12}>
                                                <Button onClick={()=> save()} className="btn-filled" >Save</Button>
                                            </Col>
                                    </Row>
                                </Card.Footer>
                            </Card>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

const mapStateToProps = state => ({
    settings: state.settings
});

export default connect(mapStateToProps, {editBankDetails,beforeSettings,getBankDetails})(SiteSettings);
