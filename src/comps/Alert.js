import React, { Component } from "react";
import '../App.css'
import {GLOBALS} from '../globals'
import {DelAlert} from '../funcs/alertFuncs'
export default class Alert extends Component {
  render() {
    return (
      <div style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: '1px',
          borderColor: 'black',
          borderStyle: 'solid',
          borderRadius: 15,
          width: '50vw',
          alignSelf: 'center'
        }}>
        <p className={'Admin-alert'}>"{this.props.alert}"</p>
        <button
          onClick={() => {
            DelAlert().then(this.props.hallFunc)
          }}
          style={{
            backgroundColor: GLOBALS.blue,
            color: 'white',
            borderColor: 'transparent'
          }}
          >
          REMOVE
        </button>
      </div>
    );
  }
}
