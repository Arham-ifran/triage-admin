import FullPageLoader from "components/FullPageLoader/FullPageLoader";
import "rc-pagination/assets/index.css";
import Select from "react-select";
import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { connect } from "react-redux";
import validator from "validator";
import {
  listLevels,
  beforeCriteria,
  addCriteria,
  getCriteria,
  updateCriteria,
} from "./Criteria.action";
import { useHistory } from "react-router-dom";
import { getWallets } from "../Wallets/Wallet.action";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const UpsertCriteria = (props) => {
  const history = useHistory();
  const [loader, setLoader] = useState(true);
  const [_id, setId] = useState("");
  const [level, setLevel] = useState();
  const [subLevel, setSubLevel] = useState();
  const [levels, setLevels] = useState();
  const [currencies, setCurrencies] = useState([]);
  const [currency, setCurrency] = useState();
  const [viewCheck, setViewCheck] = useState(false)
  const [data, setData] = useState({
    level: "",
    subLevel: "",
    minInvestment: "",
    maxInvestment: ""
  });
  const [msg, setMsg] = useState({
    level: "",
    subLevel: "",
    minInvestment: "",
    maxInvestment: "",
    profitList: [{
      months: "",
      availableProfit: "",
      lockedProfit: ""
    }]
  });
  const subLevels = [
    { value: 1, label: 1 },
    { value: 2, label: 2 },
    { value: 3, label: 3 },
  ];
  const [profitList, setProfitList] = useState([
    {
      months: "",
      availableProfit: "",
      lockedProfit: ""
    },
  ]);

  useEffect(() => {
    window.scroll(0, 0);
    props.listLevels();
    props.getWallets();
    const _id = window.location.href.split("/")[5];
    if (window.location.href.split('/')[4] === 'view-criteria') {
      setViewCheck(true)
    }
    if (_id) {
      setId(_id);
    } else {
      setLoader(false);
    }
  }, []);

  useEffect(() => {
    if (props.wallets.getWalletsAuth) {
      let walletsList = props.wallets?.wallets?.wallets;
      const currency = [];
      for (let index = 0; index < walletsList.length; index++) {
        const e = walletsList[index];
        currency.push({ value: e.symbol, label: e.symbol });
      }
      setCurrencies([...currency]);
    }
  }, [props.wallets?.getWalletsAuth]);

  useEffect(() => {
    if (props.criteria.listLevelsAuth) {
      let localLevels = [];
      for (let i = 0; i < props.criteria.listLevels.length; i++) {
        if (props.criteria.listLevels[i].level === 1) {
          localLevels.push({
            value: props.criteria.listLevels[i]._id,
            label: "Bronze",
          });
        } else if (props.criteria.listLevels[i].level === 2) {
          localLevels.push({
            value: props.criteria.listLevels[i]._id,
            label: "Silver",
          });
        } else if (props.criteria.listLevels[i].level === 3) {
          localLevels.push({
            value: props.criteria.listLevels[i]._id,
            label: "Gold",
          });
        } else if (props.criteria.listLevels[i].level === 4) {
          localLevels.push({
            value: props.criteria.listLevels[i]._id,
            label: "platinum",
          });
        }
      }
      setLevels(localLevels);
      if (!_id) setLoader(false);
      else props.getCriteria(window.atob(_id));
    }
  }, [props.criteria.listLevelsAuth]);

  useEffect(() => {
    if (props.criteria.createAuth) {
      props.beforeCriteria();
      history.push("/criteria");
    }
  }, [props.criteria.createAuth]);

  useEffect(() => {
    if (props.criteria.updateAuth) {
      props.beforeCriteria();
      history.push("/criteria");
    }
  }, [props.criteria.updateAuth]);

  useEffect(() => {
    if (props.criteria.getCriteraAuth) {
      let resData = props.criteria.getCriteria;
      setLevel(levels.find(({ label }) => label === getLabel(resData.level)));
      setSubLevel(subLevels.find(({ label }) => label === resData.subLevel));
      delete resData["level"];
      setData(resData);
      let localMsgProfitList = new Array(resData.profitInMonths.length)
      localMsgProfitList.fill({
        months: "",
        availableProfit: "",
        lockedProfit: ""
      })
      setMsg({ ...msg, profitList: localMsgProfitList })
      setProfitList(resData.profitInMonths)
      props.beforeCriteria();
      setLoader(false);
    }
  }, [props.criteria.getCriteraAuth]);

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    let list = [...profitList];
    list[index][name] = value;
    setProfitList(list);
  };

  const addProfits = () => {
    setProfitList([
      ...profitList,
      {
        months: "",
        availableProfit: "",
        lockedProfit: ""
      },
    ]);
    let localMsgProfitList = msg.profitList
    localMsgProfitList.push({
      months: "",
      availableProfit: "",
      lockedProfit: ""
    })
    setMsg({ ...msg, profitList: localMsgProfitList })
  };

  const removeProfit = (index) => {
    let list = [...profitList];
    list.splice(index, 1);
    setProfitList(list);
  };

  const getLabel = (value) => {
    switch (value) {
      case 1:
        return "Bronze";
        break;
      case 2:
        return "Silver";
        break;
      case 3:
        return "Gold";
        break;
      case 4:
        return "platinum";
        break;
    }
  };

  const submit = () => {
    if (
      !validator.isEmpty(`${data.level}`) &&
      !validator.isEmpty(`${data.minInvestment}`) &&
      validator.isInt(`${data.minInvestment}`) &&
      !validator.isEmpty(`${data.maxInvestment}`) &&
      validator.isInt(`${data.maxInvestment}`) &&
      !validator.isEmpty(`${data.subLevel}`) &&
      validator.isInt(`${data.subLevel}`)
    ) {
      let listCheck = true
      let localMsg = []
      let localObj = {}
      if (profitList && profitList.length) {
        for (let i = 0; i < profitList.length; i++) {
          for (let key in profitList[i]) {
            if (!profitList[i][key]) {
              listCheck = false
              if (key === 'availableProfit') {
                localObj[key] = `Avaliable % is required.`
              }
              else if (key === 'lockedProfit') {
                localObj[key] = `Locked % is required.`
              }
              else {
                localObj[key] = `Months are required.`
              }
            }
          }
          localMsg.push(localObj)
          localObj = {}
        }
      }
      if (localMsg && localMsg.length) {
        setMsg({ ...msg, profitList: localMsg })
      }
      if (listCheck) {
        setMsg({
          level: "",
          subLevel: "",
          minInvestment: "",
          maxInvestment: "",
        });

        delete data['profitInMonths']
        data.profitInMonths = JSON.stringify(profitList)

        let formData = new FormData();
        for (const key in data) {
          if (key == "level") {
            formData.append("accountTierId", data[key]);
          } else {
            formData.append(key, data[key]);
          }
        }
        if (_id) {
          props.updateCriteria(formData);
        } else {
          props.addCriteria(formData);
        }
      }
    } else {
      let level = "";
      let subLevel = "";
      let minInvestment = "";
      let maxInvestment = "";

      if (validator.isEmpty(`${data.level}`)) {
        level = "Level Required.";
      }
      if (
        validator.isEmpty(`${data.subLevel}`) ||
        !validator.isInt(`${data.subLevel}`)
      ) {
        subLevel = "Sub Level Required.";
      }
      if (
        validator.isEmpty(`${data.minInvestment}`) ||
        !validator.isInt(`${data.minInvestment}`)
      ) {
        minInvestment = "Min Investment Required.";
      }
      if (
        validator.isEmpty(`${data.maxInvestment}`) ||
        !validator.isInt(`${data.maxInvestment}`)
      ) {
        maxInvestment = "Max Investment Required.";
      }

      setMsg({
        level,
        subLevel,
        minInvestment,
        maxInvestment,
      });
    }
  };


  return (
    <>
      {loader ? (
        <FullPageLoader />
      ) : (
        <Container>
          <Row>
            <Col md="12">
              <Card className="pb-3 table-big-boy">
                <Card.Header>
                  <Card.Title as="h4">
                    {viewCheck ? 'View Criteria' : (_id ? "Edit" : "Add") + " Criteria"}
                  </Card.Title>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md="6">
                      <Form.Group>
                        <label>
                          Level<span className="text-danger"> *</span>
                        </label>
                        <div className="">
                          <Select
                            classNamePrefix="triage-select"
                            placeholder={<span>Select Level</span>}
                            className="w-100"
                            value={level}
                            options={levels}
                            isDisabled={viewCheck}
                            onChange={(e) => {
                              setData({ ...data, level: e.value });
                              setLevel({ label: e.label, value: e.value });
                            }}
                          />
                        </div>
                        <span className={msg.level ? `` : `d-none`}>
                          <label className="pl-1 text-danger">
                            {msg.level}
                          </label>
                        </span>
                      </Form.Group>
                    </Col>
                    <Col md="6">
                      <Form.Group>
                        <label>
                          Sub Level<span className="text-danger"> *</span>
                        </label>
                        <div className="">
                          <Select
                            classNamePrefix="triage-select"
                            placeholder={<span>Select Sub Level</span>}
                            className="w-100"
                            value={subLevel}
                            options={subLevels}
                            isDisabled={viewCheck}
                            onChange={(e) => {
                              setData({ ...data, subLevel: e.value });
                              setSubLevel({ label: e.label, value: e.value });
                            }}
                          />
                        </div>
                        <span className={msg.subLevel ? `` : `d-none`}>
                          <label className="pl-1 text-danger">
                            {msg.subLevel}
                          </label>
                        </span>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="6">
                      <Form.Group>
                        <label>
                          Min Investment ($)
                          <span className="text-danger"> *</span>
                        </label>
                        <Form.Control
                          value={data.minInvestment ? data.minInvestment : ""}
                          onChange={(e) => {
                            setData({ ...data, minInvestment: e.target.value });
                          }}
                          disabled={viewCheck}
                          placeholder="Min Investment"
                          type="number"
                          min="0"
                          step="1"
                        ></Form.Control>
                        <span className={msg.minInvestment ? `` : `d-none`}>
                          <label className="pl-1 text-danger">
                            {msg.minInvestment}
                          </label>
                        </span>
                      </Form.Group>
                    </Col>
                    <Col md="6">
                      <Form.Group>
                        <label>
                          Max Investment ($)
                          <span className="text-danger"> *</span>
                        </label>
                        <Form.Control
                          value={data.maxInvestment ? data.maxInvestment : ""}
                          onChange={(e) => {
                            setData({ ...data, maxInvestment: e.target.value });
                          }}
                          disabled={viewCheck}
                          placeholder="Max Investment"
                          type="number"
                          min="0"
                          step="1"
                        ></Form.Control>
                        <span className={msg.maxInvestment ? `` : `d-none`}>
                          <label className="pl-1 text-danger">
                            {msg.maxInvestment}
                          </label>
                        </span>
                      </Form.Group>
                    </Col>
                  </Row>
                  {profitList.map((listItem, index) => {
                    return (
                      <Row>
                        <Col lg="3" md="6">
                          <Form.Group className="pb-3">
                            <label>
                              Months<span className="text-danger"> *</span>
                            </label>
                            <Form.Control
                              value={listItem.months}
                              onChange={(e) => handleChange(e, index)}
                              placeholder="Months"
                              disabled={viewCheck}
                              type="number"
                              min="0"
                              step="1"
                              name="months"
                            ></Form.Control>
                            <span className={msg.profitList && msg.profitList.length ? msg.profitList[index].months ? `` : `d-none` : ''}>
                              <label className="pl-1 text-danger">
                                {msg.profitList && msg.profitList.length ? msg.profitList[index].months : ''}
                              </label>
                            </span>
                          </Form.Group>
                        </Col>
                        <Col lg="4" md="6">
                          <Form.Group className="pb-3">
                            <label>
                              Available %<span className="text-danger"> *</span>
                            </label>
                            <Form.Control
                              value={listItem.availableProfit}
                              onChange={(e) => handleChange(e, index)}

                              placeholder="Profits In Currency To Available Balance"
                              disabled={viewCheck}
                              type="number"
                              min="0"
                              step="1"
                              name="availableProfit"
                            ></Form.Control>
                            <span className={msg.profitList && msg.profitList.length ? msg.profitList[index].availableProfit ? `` : `d-none` : ''}>
                              <label className="pl-1 text-danger">
                                {msg.profitList && msg.profitList.length ? msg.profitList[index].availableProfit : ''}
                              </label>
                            </span>
                          </Form.Group>
                        </Col>
                        <Col lg="4" md="6">
                          <Form.Group className="pb-3">
                            <label>
                              Locked %<span className="text-danger"> *</span>
                            </label>
                            <Form.Control
                              value={listItem.lockedProfit}
                              onChange={(e) => handleChange(e, index)}
                              placeholder="Profits In Currency To Locked Balance"
                              type="number"
                              disabled={viewCheck}
                              min="0"
                              step="1"
                              name="lockedProfit"
                            ></Form.Control>
                            <span className={msg.profitList && msg.profitList.length ? msg.profitList[index].lockedProfit ? `` : `d-none` : ''}>
                              <label className="pl-1 text-danger">
                                {msg.profitList && msg.profitList.length ? msg.profitList[index].lockedProfit : ''}
                              </label>
                            </span>
                          </Form.Group>
                        </Col>
                        {
                          !viewCheck ?
                            <Col lg="1" md="6">
                              <Form.Group>
                                <label className="d-block">&nbsp;</label>
                                <div className="d-flex profit-row-buttons justify-content-between">

                                  {profitList.length !== 1 && (
                                    <Button
                                      className="btn-filled pull-right"
                                      onClick={() => removeProfit(index)}
                                    >
                                      <FontAwesomeIcon icon={faMinus} />
                                    </Button>
                                  )}
                                  {profitList.length - 1 === index && (
                                    <Button
                                      className="btn-filled pull-right"
                                      onClick={() => addProfits()}
                                    >
                                      <FontAwesomeIcon icon={faPlus} />
                                    </Button>
                                    
                                  )}
                                </div>
                              </Form.Group>
                            </Col>
                            : ''
                        }
                      </Row>
                    );
                  })}
                  {
                    !viewCheck ?
                      <Row>
                        <Col  md="6" >
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
                        <Col md="6">
                          <div className="d-flex justify-content-end align-items-center">
                            <Button
                              className="btn-filled pull-right mt-3"
                              type="submit"
                              variant="info"
                              onClick={submit}
                            >
                              {_id ? "Edit Criteria" : "Add Criteria"}
                            </Button>
                          </div>
                        </Col>
                      </Row>
                      : 
                      
                    <Row>
                      <Col  md="12" >
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
                      
                    </Row>
                  }
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  criteria: state.criteria,
  wallets: state.wallets,
  error: state.error,
});

export default connect(mapStateToProps, {
  listLevels,
  beforeCriteria,
  addCriteria,
  getCriteria,
  updateCriteria,
  getWallets,
})(UpsertCriteria);
