import React, { Component } from "react";
import {GLOBALS} from '../globals'
import '../App.css'
export default class AlertScreen extends Component {

  render() {
    return (
      <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100vw',
          height: '100vh',
          flexDirection: 'column'
        }}>
        <header className="App-header"
          style={{
            backgroundColor: GLOBALS.white,
            display: 'flex',
            flexDirection: 'row',
            paddingTop: 10,
            position: 'absolute',
            top: 25
          }}
          >

          <img src={'https://6pointsscitech.org/wp-content/uploads/sites/82/2016/07/6points-logo-final-east-768x325.jpg'} alt="Logo"
            style={{
              margin: 20
            }}
            className={'App-logo'}
            />
        </header>
        <h1 className={'Home-alert'} style={{
            color: GLOBALS.black
          }}>{this.props.alert}</h1>
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
