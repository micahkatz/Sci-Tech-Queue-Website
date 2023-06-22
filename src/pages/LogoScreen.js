import React, { Component } from 'react';
import { GLOBALS } from '../globals';
import '../App.css';
export default class LogoScreen extends Component {
    render() {
        return (
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100vw',
                    height: '100vh',
                }}
            >
                <img
                    src={
                        'https://6pointsscitech.org/wp-content/uploads/sites/22/2021/12/Sci-tech_logo_hi-res.png'
                    }
                    alt='Logo'
                    className={'App-big-logo'}
                />
                <div
                    style={{
                        width: '100vw',
                        height: '10px',
                        backgroundColor: GLOBALS.orange,
                        position: 'absolute',
                        bottom: 0,
                    }}
                />
            </div>
        );
    }
}
