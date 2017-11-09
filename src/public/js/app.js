class Timer extends React.Component {
    render() {
        const elapsedString = helpers.renderElapsedString(this.props.elapsed);
        return (
            <div className='ui centered card'>
                <div className='content'>
                    <div className='header'>{this.props.title}</div>
                    <div className='meta'>{this.props.project}</div>

                    <div className='center aligned description'>
                        <h2>{elapsedString}</h2>
                    </div>
                    <div className='extra content'>
                        <span className='right floated edit icon'>
                            <i className='edit icon' />
                        </span>
                        <span className='right floated trash icon'>
                            <i className='trash icon' />
                        </span>
                    </div>
                </div>
                <div className='ui bottom attached blue basic button'>
                    Start
                </div>
            </div>
        );
    }
}

class ToggleableTimerForm extends React.Component {
    render() {
        if (this.props.isOpen) {
            return (<TimerForm />);
        } else {
            return (<div className='ui basic content center aligned segment'>
                <button className='ui basic button icon'>
                    <i className='plus icon' />
                </button>
            </div>);
        }
    }
}

class TimerForm extends React.Component {
    render() {
        const submitText = this.props.title ? 'Update' : 'Create';

        return (
            <div className='ui centered card'>
                <div className='content'>
                    <div className='ui form'>
                        <div className='field'>
                            <label>Title</label>
                            <input type='text' defaultValue={this.props.title} />
                        </div>
                        <div className='field'>
                            <label>Project</label>
                            <input type='text' defaultValue={this.props.project} />
                        </div>
                        <div className='ui two bottom attached buttons'>
                            <button className='ui basic blue button'>{submitText}</button>
                            <button className='ui basic red button'>Cancel</button>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}

class EditableTimer extends React.Component {
    render() {
        if (this.props.editFormOpen) {
            return (
                <TimerForm title={this.props.title}
                    project={this.props.project} />
            )
        } else {
            return (
                <Timer title={this.props.title}
                    project={this.props.project}
                    elapsed={this.props.elapsed}
                    runnningSince={this.props.runnningSince} />
            );
        }
    }
}

class EditableTimerList extends React.Component {
    render() {
        return (
            <div id="timers">
                <EditableTimer title="Learn React"
                    project='Web Domination'
                    elapsed='8986300'
                    runnningSince={null}
                    editFormOpen={false} />
                <EditableTimer title="Learn extreme ironing"
                    project='World Domination'
                    elapsed='5032212'
                    runnningSince={null}
                    editFormOpen={true} />
            </div>
        );
    }
}

class TimersDashboard extends React.Component {
    state = {
        timers: [
            {
                title: 'Pratice squat',
                project: 'Gym Chores',
                id: uuid.v4(),
                elapsed: 5456099,
                runnningSince: Date.now()
            },
            {
                title: 'Bake squasht',
                project: 'Kitechen Chores',
                id: uuid.v4(),
                elapsed: 1273998,
                runnningSince: null
            }
        ]
    }
    onFormSubmit = (timer) => {
        let newTimer = helpers.newTimer(timer);
        this.setState((prev, prop) => {
            return { timers: prev.timers.concat(newTimer) };
        });
    }
    render() {
        return (
            <div className="ui three column centered grid">
                <div>
                    <EditableTimerList />
                    <ToggleableTimerForm isOpen={true} />
                </div>
            </div>
        );
    }
}

ReactDOM.render(<TimersDashboard />, document.getElementById('content'));