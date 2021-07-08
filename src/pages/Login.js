import React, { Component } from 'react';
import Form from 'react-jsonschema-form';
import { CheckPass } from '../funcs/auth';
import '../App.css';
import AdminPg from './Admin';
import { GLOBALS } from '../globals';
const schema = {
    title: 'Enter Password',
    type: 'object',
    required: ['password'],
    properties: {
        password: { type: 'string', title: 'Password', default: '' },
    },
};
const uiSchema = {
    done: {
        'ui:widget': 'password',
    },
};
export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            password: '',
            auth: false,
        };
        // this.state = {
        //   password: '',
        //   auth: true
        // }
        this.logout();
    }
    logout() {
        this.setState({ auth: false });
        // this.setState({auth: true})
    }
    login(isCorrect) {
        if (isCorrect) {
            this.setState({ auth: true });
        }
    }
    render() {
        if (this.state.auth) {
            return <AdminPg />;
        } else {
            return (
                <div className={'LoginPage'}>
                    <label>Enter Password:</label>
                    <input
                        style={{
                            margin: 10,
                            borderRadius: 5,
                            backgroundColor: '#f1f1f1',
                            borderWidth: 1,
                            width: '20vw',
                            fontSize: '1em',
                        }}
                        type={'password'}
                        name={'Password'}
                        onChange={(event) =>
                            this.setState({ password: event.target.value })
                        }
                    />
                    <button
                        onClick={() =>
                            CheckPass(this.state.password).then(
                                this.login.bind(this)
                            )
                        }
                    >
                        Enter
                    </button>
                </div>
            );
        }
    }
}
