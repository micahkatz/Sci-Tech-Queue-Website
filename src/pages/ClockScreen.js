import React, { Component } from "react";
import {GLOBALS} from '../globals'
import '../App.css'
export default class ClockScreen extends Component {
  constructor(props){
    super(props)
    this.state = {
      h: 0,
      m: 0,
      s: 0,
      ampm: ''
    }
    this.startTime = this.startTime.bind(this)
    this.checkTime = this.checkTime.bind(this)
  }
  startTime() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds
    var ampm
    if(h > 11){
      ampm = 'PM'
    } else {
      ampm = 'AM'
    }
    h = ((h + 11) % 12 + 1);
    m = this.checkTime(m);
    s = this.checkTime(s);
    this.setState({
      h,
      m,
      ampm
    })
    var t = setTimeout(this.startTime, 30000);
  }
  checkTime(i) {
    if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
    return i;
  }
  componentDidMount(){
    this.startTime()
  }
  render() {
    return (
      <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          alignSelf: 'center',
          textAlign: 'center',
          width: '100vw',
          height: '100vh',
        }}>
        <img src={'https://6pointsscitech.org/wp-content/uploads/sites/82/2016/07/6points-logo-final-east-768x325.jpg'} alt="Logo"
          style={{
            position: 'absolute',
            top: 25
          }}
          className={'App-logo'}
          />
        <div style={{
            height: '30vh',
            width: '65vw',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0
          }}>
          <h1 className={'Clock-NUM'}
            style={{
              color: GLOBALS.black,
              margin: 0,
              marginRight: 10,
              height: '25vh'
            }}
            >{this.state.h}:{this.state.m}</h1>
          <div style={{
              display: 'flex',
              height: '25vh',
              flexDirection: 'row',
              alignItems: 'flex-end'
            }}>
            <h1 style={{
                color: GLOBALS.black,
                margin: 0
              }}
              className={'Clock-AMPM'}>{this.state.ampm}</h1>
          </div>
        </div>
        <div
          style={{
            width: '100vw',
            height: '10px',
            backgroundColor: GLOBALS.orange,
            position: 'absolute',
            bottom: 0
          }}
          />
      </div>
    );
  }
}
