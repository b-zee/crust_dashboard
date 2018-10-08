import React, { Component } from "react";
import { Row, Col, Card, Button } from "antd";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import TabComp from "../components/TabComp";
import "./Dashboard.css";
import ButtonGroup from "../components/ButtonGroup";
import { filterByConnectionResult,revalidate,filterChange }from '../redux/dispatcher/logs_action';
import {mods} from "../redux/FilterTypes"
import data from "../assets/data";
import { LineChartArray } from "../assets/data"
import ActionType from "../redux/ActionType";
import {NatType,OS,PROTOCOL} from "../redux/FilterTypes";

//import "./pages.css"
class ConnectionAttempts extends Component {
  prepareChartData() {
    const osArr = [];
    data.logs.forEach((log) => {
      osArr.push(log.peer_requester.os, log.peer_responder.os);
    });

    let osNames = new Set(osArr);
    const osName = Array.from(osNames);
    const osCount = osName.map(osN => (osArr.filter(os => os===osN).length));

    let osList = []
    osName.forEach((os, i) => {
      let osObj = {};
      osObj["x"]=os;
      osObj["y"]=osCount[i];
      osList.push(osObj);
    }
    );

    const listCountry = data.globalNetworkActivity.map((coun, i) => (
      <li>
        {coun.x} {coun.y}
      </li>
    ));

    const listOS = osName.map((os, i) => (
      <li>
        {os}
      </li>
    ))

    return [
      {"values":LineChartArray,
      "dataSource":null,
      "interval":null
      },
      {"values":listCountry,
      "dataSource":data.globalNetworkActivity,
      "interval":1000
      },
      {"values":listOS,
      "dataSource":osList,
      "interval":10
      }
    ]  
  }
  constructor(props) {
    super(props); 
    this.props.revalidate(mods.CON_ACT_,this.props.store.filteredConnectionResults);
  }
  shouldComponentUpdate(nextProps, nextState) {
    //initially if returns false since the state isn't changed. 
    //we set the initial state using constructor and this function for later changes
    if (this.props.store.filteredConnectionResults != nextProps.store.filteredConnectionResults) {
      this.props.revalidate(mods.CON_ACT_,nextProps.store.filteredConnectionResults);
    }
  }

  render() {
    return (
      <div className="gutter-example">
      <span className="page-heading">
      <h1 style={{ padding: "5px 0px 0px 40px", display: "inline"}}>Connection Attempts </h1>
          <span style={{ float: "right", padding: "10px 20px 0px 0px" }}>
            <h3 style={{ float: "left", padding: "5px 30px 0px 0px"}}>  Connection result:</h3>
            <ButtonGroup selectedIndex={this.props.store.connectionResultFilter}  
            changeFilter={this.props.filterByConnectionResult}/>
          </span>
        </span>
        <Row gutter={24} style={{ margin: "24px 8px" }}>
          <Col className="gutter-row" span={24}>
            <Card
              style={{
                background: "#fff",
                borderRadius: 5,
                minHeight: 100
              }}
            >
            <TabComp chartData={this.prepareChartData()} tableData={this.props.store.filteredConnectionResults}/>
          </Card>
          </Col>
        </Row>
      </div> 
    );
  }
}

const mapStateToProps = (store) => {
  return {
    store: store.logReducer
  }
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    filterByConnectionResult,
    revalidate,
    filterChange
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(ConnectionAttempts);
