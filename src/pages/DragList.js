import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { NewHall, GetHalls, CallHall, Reorder } from '../funcs/CRUDFuncs';
import { NewAlert, CheckAlerts, DelAlert } from '../funcs/alertFuncs';
import AdminHall from '../comps/AdminHall';
import { GLOBALS } from '../globals';
import Alert from '../comps/Alert';
import Form from 'react-jsonschema-form';
import { MdMenu } from 'react-icons/md';

import Spinner from 'react-bootstrap/Spinner';
import '../App.css';
// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

const grid = 8;

const hallFormParams = {
    definitions: {
        unitList: {
            type: 'string',
            enum: GLOBALS.gradeLevels.all,
        },
    },
    title: 'New Hall',
    required: ['name', 'unit', 'grade'],
    type: 'object',
    properties: {
        string: {
            type: 'string',
            title: 'Name',
        },
        Unit: {
            $ref: '#/definitions/unitList',
        },
        Grade: {
            type: 'string',
            title: 'Grade',
        },
    },
};

const hallFormUI = {
    name: {
        classNames: 'Home-input',
    },
    unit: {
        classNames: 'Home-input',
    },
    grade: {
        classNames: 'Home-input',
    },
};

const alertFormParams = {
    title: 'New Announcement',
    type: 'object',
    required: ['type'],
    properties: {
        type: { type: 'string', title: 'Text', default: '' },
    },
};

const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the halls look a bit nicer
    userSelect: 'none',
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,
    borderRadius: 15,
    // change background colour if dragging
    background: isDragging ? GLOBALS.blue : 'transparent',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',

    // styles we need to apply on draggables
    ...draggableStyle,
});

const getListStyle = (isDraggingOver) => ({
    background: isDraggingOver ? '#f5f5f5' : 'transparent',
    padding: grid,
    width: '100vw',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
});

export default class DragList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            halls: [],
            lowerHalls: [],
            upperHalls: [],
            alert: '',
        };
        this.getHalls = this.getHalls.bind(this);
        this.onDragEnd = this.onDragEnd.bind(this);
        this.checkAlerts = this.checkAlerts.bind(this);
    }
    componentDidMount() {
        this.getHalls();
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
        GetHalls().then((res) => {
            if (res) {
                var hallsArray = res.data.Items;
                hallsArray.sort((firstItem, secondItem) => {
                    return firstItem.position - secondItem.position;
                });
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
        this.checkAlerts();
    }
    checkAlerts() {
        CheckAlerts().then((res) => {
            try {
                if (res) {
                    if (res.data.Items[0]) {
                        var alert = res.data.Items[0].type;
                        this.setState({
                            alert,
                        });
                    } else {
                        this.setState({
                            alert: '',
                        });
                    }
                }
            } catch (e) {
                console.log(e);
            }
        });
    }
    async unCallAll() {
        var i = 0;
        // console.log(this.state.halls[0])
        for (let i = 0; i < this.state.halls.length; i++) {
            // console.log('uncalling', this.state.halls[i].name)
            const response = await CallHall(
                this.state.halls[i].id,
                true,
                this.state.halls[i].order
            );
        }
    }
    async reOrderAll() {
        var i = 0;
        // console.log(this.state.halls[0])
        for (let i = 0; i < this.state.halls.length; i++) {
            const response = await Reorder(
                this.state.halls[i].id,
                this.state.halls[i].order,
                i
            );
        }
    }
    async onDragEnd(result) {
        // dropped outside the list
        if (!result.destination) {
            return;
        }

        const halls = reorder(
            this.state.halls,
            result.source.index,
            result.destination.index
        );

        this.setState({
            halls,
        });

        this.reOrderAll();
    }

    // Normally you would want to split things out into separate components.
    // But in this example everything is just done in one place for simplicity
    // https://icon-library.net/images/3-line-menu-icon/3-line-menu-icon-3.jpg
    render() {
        return (
            <div>
                <DragDropContext onDragEnd={this.onDragEnd}>
                    <Droppable droppableId='droppable'>
                        {(provided, snapshot) => (
                            <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                style={getListStyle(snapshot.isDraggingOver)}
                            >
                                {this.state.halls.map((hall, index) => (
                                    <Draggable
                                        key={hall.id}
                                        draggableId={hall.id}
                                        index={index}
                                    >
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                style={getItemStyle(
                                                    snapshot.isDragging,
                                                    provided.draggableProps
                                                        .style
                                                )}
                                            >
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent:
                                                            'center',
                                                        width: '10vw',
                                                    }}
                                                >
                                                    <MdMenu
                                                        src={
                                                            'https://icon-library.net/images/3-line-menu-icon/3-line-menu-icon-3.jpg'
                                                        }
                                                        alt='Logo'
                                                        style={{
                                                            margin: 5,
                                                        }}
                                                        className={
                                                            'App-drag-img'
                                                        }
                                                    />
                                                </div>
                                                <Spinner
                                                    animation='border'
                                                    variant='dark'
                                                />
                                                <AdminHall
                                                    hallFunc={this.getHalls}
                                                    data={hall}
                                                    idx={index}
                                                />
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
                <Form
                    schema={hallFormParams}
                    uiSchema={hallFormUI}
                    className={'form form-wide'}
                    buttonText='Add Hall'
                    onSubmit={(data) =>
                        NewHall(data.formData, this.state.halls.length).then(
                            this.getHalls
                        )
                    }
                />
                <Form
                    schema={alertFormParams}
                    className={'form form-wide'}
                    onSubmit={(data) =>
                        NewAlert(data.formData.type).then(this.getHalls)
                    }
                />
                <div
                    style={{
                        alignItems: 'center',
                        display: 'flex',
                        justifyContent: 'center',
                    }}
                >
                    {this.state.alert.length > 0 ? (
                        <Alert
                            alert={this.state.alert}
                            hallFunc={this.getHalls}
                        />
                    ) : (
                        <div />
                    )}
                </div>
                <button
                    onClick={() => this.unCallAll().then(this.getHalls)}
                    style={{
                        backgroundColor: GLOBALS.orange,
                        color: 'white',
                        borderColor: 'transparent',
                    }}
                >
                    UNCALL ALL
                </button>
                <button
                    onClick={() => {
                        if (this.state.alert === 'LOGO') {
                            DelAlert().then(this.getHalls);
                        } else {
                            NewAlert('LOGO').then(this.getHalls);
                        }
                    }}
                    style={{
                        backgroundColor: GLOBALS.orange,
                        color: 'white',
                        borderColor: 'transparent',
                    }}
                >
                    {this.state.alert === 'LOGO' ? 'HIDE LOGO' : 'SHOW LOGO'}
                </button>
                <button
                    onClick={() => {
                        if (this.state.alert === 'CLOCK') {
                            DelAlert().then(this.getHalls);
                        } else {
                            NewAlert('CLOCK').then(this.getHalls);
                        }
                    }}
                    style={{
                        backgroundColor: GLOBALS.orange,
                        color: 'white',
                        borderColor: 'transparent',
                    }}
                >
                    {this.state.alert === 'CLOCK' ? 'HIDE CLOCK' : 'SHOW CLOCK'}
                </button>
                <button
                    onClick={() =>
                        NewAlert('MED CALL IN THE HALL').then(this.getHalls)
                    }
                    style={{
                        backgroundColor: GLOBALS.orange,
                        color: 'white',
                        borderColor: 'transparent',
                    }}
                >
                    MED CALL
                </button>
            </div>
        );
    }
}
