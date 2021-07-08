import React, { Component } from "react";
import {NewHall, GetHalls, CallHall, DelHall} from '../funcs/CRUDFuncs'
import {GLOBALS} from '../globals'
import {Spinner} from 'react-bootstrap';
export default class AdminHall extends Component {
  render(){
    var data = this.props.data
    var hallFunc = this.props.hallFunc
    var idx = this.props.idx
    return (
      <div style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center'
        }}>
        <button
          onClick={() => CallHall(data.id, data.called, data.order).then(hallFunc)}
          key = {idx}
          style={{
            backgroundColor: (data.called) ? GLOBALS.orange : GLOBALS.white,
            marginBottom: 3,
            minWidth: '60vw',
            maxWidth: '80vw',
            borderRadius: 15,
            paddingLeft: 20,
            paddingRight: 20,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: (data.called) ? 0 : 1,
          }}
          >
          <h1 className={'App-hall-title'} style={{margin: 5, color: (data.called) ? GLOBALS.white : GLOBALS.black,}}>{data.name}</h1>
          <div>
            <h1 className={'App-hall-unit'} style={{margin: 5, color: (data.called) ? GLOBALS.white : GLOBALS.black,}}>{(data.unit) ? data.unit.toUpperCase() : ''}</h1>
            <h1 className={'App-hall-unit'} style={{margin: 5, color: (data.called) ? GLOBALS.white : GLOBALS.black,}}>{data.grade}</h1>
          </div>
        </button>
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '10vw',
            margin: 10,
          }}>
          <button
            onClick={() => {
              if (window.confirm("Are you sure you want to delete?")) {
                DelHall(data.id, data.order).then(hallFunc)
              }
            }}
            style={{
              backgroundColor: GLOBALS.orange,
              color: 'white',
              borderColor: 'transparent'
            }}
            >
            DELETE
          </button>
        </div>
      </div>
    )
  }
}
