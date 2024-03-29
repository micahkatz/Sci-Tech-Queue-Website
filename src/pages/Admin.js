import React, { Component } from 'react';
import NoPostsYet from '../comps/NoPostsYet';
import { NewHall, GetHalls, CallHall, DelHall } from '../funcs/CRUDFuncs';
import DragList from './DragList';
import { GLOBALS } from '../globals';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

export default class Admin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            halls: [],
        };
        this.getHalls = this.getHalls.bind(this);
    }
    getHalls() {
        GetHalls().then(({ data }) => {
            if (data) {
                var hallsArray = data.Items;
                hallsArray.sort((firstItem, secondItem) => {
                    return firstItem.order - secondItem.order;
                });
                this.setState({
                    halls: hallsArray,
                });
            } else {
                this.setState({
                    halls: [],
                });
            }
        });
    }

    async delAllHalls() {
        var i = 0;
        // console.log(this.state.halls[0])
        for (let i = 0; i < this.state.halls.length; i++) {
            // console.log('uncalling', this.state.halls[i].name)
            const response = await DelHall(
                this.state.halls[i].id,
                this.state.halls[i].order
            );
        }
    }
    componentDidMount() {
        this.getHalls();
    }
    render() {
        var hallFunc = this.getHalls;

        return (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
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
                <DragList />
            </div>
        );
    }
}
