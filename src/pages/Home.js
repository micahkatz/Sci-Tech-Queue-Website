import React, { Component } from 'react';
import NoPostsYet from '../comps/NoPostsYet';
import { NewHall, GetHalls, CallHall } from '../funcs/CRUDFuncs';
import { CheckAlerts } from '../funcs/alertFuncs';
import { GLOBALS } from '../globals';
import '../App.css';
import Columns from 'react-columns';
import LogoScreen from './LogoScreen';
import AlertScreen from './AlertScreen';
import ClockScreen from './ClockScreen';

import Lottie from 'lottie-react';
import loadingAnimation from '../assets/loadingAnimation.json';
export default class Home extends Component {
    intervalID;
    constructor(props) {
        super(props);
        this.state = {
            halls: [],
            lowerHalls: [],
            upperHalls: [],
            h: 0,
            m: 0,
            s: 0,
            showLogo: false,
            alert: '',
            loading: true,
        };
        this.lastAlert = '';
        this.getHalls = this.getHalls.bind(this);
        this.startTime = this.startTime.bind(this);
        this.checkTime = this.checkTime.bind(this);
        this.checkAlerts = this.checkAlerts.bind(this);
    }
    isLowerCamp(hallsArray) {
        return hallsArray.filter((hall) => {
            const unit = hall.unit.replace(/\s+/g, '').toLowerCase();
            var isLower = false;
            GLOBALS.gradeLevels.lower.forEach((u) => {
                // console.log({ unit, u: u.toLowerCase() });
                if (unit === u.toLowerCase()) {
                    isLower = true;
                }
            });
            return isLower;
        });
    }
    isUpperCamp(hallsArray) {
        return hallsArray.filter((hall) => {
            const unit = hall.unit.replace(/\s+/g, '').toLowerCase();
            var isUpper = false;
            GLOBALS.gradeLevels.upper.forEach((u) => {
                // console.log({ unit, u: u.toLowerCase() });
                if (unit === u.toLowerCase()) {
                    isUpper = true;
                }
            });
            return isUpper;
        });
    }
    getHalls() {
        GetHalls().then(({ data }) => {
            console.log({ halls: data });
            if (data) {
                var hallsArray = data.Items;
                hallsArray.sort((firstItem, secondItem) => {
                    return firstItem.position - secondItem.position;
                });
                console.log(data.Items, hallsArray);
                this.setState({
                    halls: hallsArray,
                    lowerHalls: this.isLowerCamp(hallsArray),
                    upperHalls: this.isUpperCamp(hallsArray),
                });
            } else {
                this.setState({
                    halls: [],
                    lowerHalls: [],
                    upperHalls: [],
                });
            }
        });
        this.setState({ loading: false });
        this.checkAlerts();
    }
    checkAlerts() {
        CheckAlerts().then((res) => {
            console.log({ alerts: res });
            try {
                const { data } = res;
                if (data && data.Items && data.Items[0]) {
                    var alert = data.Items[0].type;

                    if (alert.includes('http')) {
                        if (this.lastAlert == alert) {
                            this.setState({ alert: '' });
                        } else {
                            this.setState({ alert });
                        }

                        this.lastAlert = alert;
                    } else {
                        this.setState({
                            alert,
                        });
                    }
                } else {
                    this.setState({
                        alert: '',
                    });
                }
            } catch (e) {
                console.log(e);
            }
        });
    }
    componentDidMount() {
        // posts = await DSList()
        // this.setState({posts})
        this.getHalls();
        this.startTime();
        this.intervalID = setInterval(this.getHalls.bind(this), 5000);
    }

    componentWillUnmount() {
        /*
      stop getData() from continuing to run even
      after unmounting this component
    */
        clearInterval(this.intervalID);
    }
    startTime() {
        var today = new Date();
        var h = today.getHours();
        var m = today.getMinutes();
        var s = today.getSeconds;
        var ampm;
        if (h > 11) {
            ampm = 'PM';
        } else {
            ampm = 'AM';
        }
        h = ((h + 11) % 12) + 1;
        m = this.checkTime(m);
        s = this.checkTime(s);
        this.setState({
            h,
            m,
            ampm,
        });
        var t = setTimeout(this.startTime, 30000);
    }
    checkTime(i) {
        if (i < 10) {
            i = '0' + i;
        } // add zero in front of numbers < 10
        return i;
    }
    render() {
        var hallFunc = this.getHalls;
        const renUpperHalls = this.state.upperHalls.map(function (data, idx) {
            return (
                <div
                    key={idx}
                    style={{
                        backgroundColor: data.isCalled
                            ? GLOBALS.orange
                            : GLOBALS.white,
                        marginBottom: 3,
                        width: '20vw',
                        height: '8vh',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        borderRadius: 15,
                        borderWidth: 2,
                        paddingBottom: 0,
                        borderStyle: 'solid',
                        borderColor: data.isCalled
                            ? 'transparent'
                            : GLOBALS.orange,
                    }}
                >
                    <h1
                        className={'App-hall-title'}
                        style={{
                            color: data.isCalled
                                ? GLOBALS.white
                                : GLOBALS.orange,
                        }}
                    >
                        {data.name}
                    </h1>
                </div>
            );
        });
        const renLowerHalls = this.state.lowerHalls.map(function (data, idx) {
            return (
                <div
                    key={idx}
                    style={{
                        backgroundColor: data.isCalled
                            ? GLOBALS.orange
                            : GLOBALS.white,
                        marginBottom: 3,
                        width: '20vw',
                        height: '8vh',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        borderRadius: 15,
                        borderWidth: 2,
                        paddingBottom: 0,
                        borderStyle: 'solid',
                        borderColor: data.isCalled
                            ? 'transparent'
                            : GLOBALS.orange,
                    }}
                >
                    <h1
                        className={'App-hall-title'}
                        style={{
                            color: data.isCalled
                                ? GLOBALS.white
                                : GLOBALS.orange,
                        }}
                    >
                        {data.name}
                    </h1>
                </div>
            );
        });
        alert = this.state.alert;
        if (alert.length > 0) {
            if (alert === 'LOGO') {
                return <LogoScreen />;
            } else if (alert === 'CLOCK') {
                return <ClockScreen />;
            } else if (alert.includes('http')) {
                if (alert.includes('/edit')) {
                    alert.replace('edit', 'present');
                } else {
                    alert = alert.concat('/present');
                }

                window.open(alert);

                return <div></div>;
            } else {
                return <AlertScreen alert={this.state.alert} />;
            }
        } else if (this.state.loading) {
            return <Lottie animationData={loadingAnimation} />;
        } else {
            return (
                <div>
                    <header
                        className='App-header'
                        style={{
                            backgroundColor: GLOBALS.white,
                            display: 'flex',
                            flexDirection: 'row',
                            paddingTop: 10,
                        }}
                    >
                        <img
                            src={
                                'https://6pointsscitech.org/wp-content/uploads/sites/22/2021/12/Sci-tech_logo_hi-res.png'
                            }
                            alt='Logo'
                            style={{
                                margin: 20,
                            }}
                            className={'App-logo'}
                        />
                    </header>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                        className='App-home-div'
                    >
                        <div>
                            <h1
                                style={{
                                    color: GLOBALS.black,
                                    fontWeight: 900,
                                }}
                            >
                                LOWER CAMP
                            </h1>
                            <div className='App-home-lc'>
                                {this.state.lowerHalls.length > 0 ? (
                                    renLowerHalls
                                ) : (
                                    <NoPostsYet />
                                )}
                            </div>
                        </div>
                        <div>
                            <h1
                                style={{
                                    color: GLOBALS.black,
                                    fontWeight: 900,
                                }}
                            >
                                UPPER CAMP
                            </h1>
                            <div className='App-home-uc'>
                                {this.state.upperHalls.length > 0 ? (
                                    renUpperHalls
                                ) : (
                                    <NoPostsYet />
                                )}
                            </div>
                            <div
                                style={{
                                    width: '65vw',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: 0,
                                }}
                            >
                                <h1
                                    className={'Clock-NUM'}
                                    style={{
                                        color: GLOBALS.black,
                                        margin: 0,
                                        marginRight: 10,
                                        height: '25vh',
                                    }}
                                >
                                    {this.state.h}:{this.state.m}
                                </h1>
                                <div
                                    style={{
                                        display: 'flex',
                                        height: '25vh',
                                        flexDirection: 'row',
                                        alignItems: 'flex-end',
                                    }}
                                >
                                    <h1
                                        style={{
                                            color: GLOBALS.black,
                                            margin: 0,
                                        }}
                                        className={'Clock-AMPM'}
                                    >
                                        {this.state.ampm}
                                    </h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }
}
