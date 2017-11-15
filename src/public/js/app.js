class TimerActionButton extends React.Component {
    render() {
        if (this.props.timerIsRunning) {
            return (
                <div className='ui button attached red basic button'
                    onClick={this.props.onStopClick}>Stop</div>
            );
        } else {
            return (
                <div className='ui button attached green basic button'
                    onClick={this.props.onStartClick}>Start</div>
            );
        }
    }
}

class Timer extends React.Component {
    componentDidMount() {
        console.log("New system interval function added");
        this.forceUpdateInterval = setInterval(() => this.forceUpdate(), 50);
    }
    componentWillUnmount() {
        console.log("New system interval function removed");
        clearInterval(this.forceUpdateInterval);
    }
    handleStartClick = () => {
        this.props.onStartClick(this.props.id);
    }
    handleStopClick = () => {
        this.props.onStopClick(this.props.id);
    }
    render() {
        const elapsedString = helpers.renderElapsedString(this.props.elapsed, this.props.runningSince);
        return (
            <div className='ui centered card'>
                <div className='content'>
                    <div className='header'>{this.props.title}</div>
                    <div className='meta'>{this.props.project}</div>

                    <div className='center aligned description'>
                        <h2>{elapsedString}</h2>
                    </div>
                    <div className='extra content'>
                        <span className='right floated trash icon' onClick={this.props.onRemoveTimer}>
                            <i className='trash icon' />
                        </span>
                        <span className='right floated edit icon' onClick={this.props.onEditClick}>
                            <i className='edit icon' />
                        </span>
                    </div>
                </div>
                <TimerActionButton timerIsRunning={!!this.props.runningSince}
                    onStartClick={this.handleStartClick}
                    onStopClick={this.handleStopClick} />
            </div>
        );
    }
}

class ToggleableTimerForm extends React.Component {
    state = {
        isOpen: false
    }
    handleFormOpen = () => {
        this.setState({ isOpen: true });
    }
    onFormSubmit = (timer) => {
        this.props.onFormSubmit(timer);
        this.setState({ isOpen: false })
    }
    onFormCancel = () => {
        this.setState({ isOpen: false })
    }
    render() {
        if (this.state.isOpen) {
            return (<TimerForm onFormSubmit={this.onFormSubmit}
                onFormCancel={this.onFormCancel} />);
        } else {
            return (<div className='ui basic content center aligned segment'>
                <button className='ui basic button icon' onClick={this.handleFormOpen}>
                    <i className='plus icon' />
                </button>
            </div>);
        }
    }
}

class TimerForm extends React.Component {
    state = {
        title: this.props.title || '',
        project: this.props.project || ''
    }
    handleTitleChange = (e) => {
        this.setState({ title: e.target.value })
    }
    handleProjectChange = (e) => {
        this.setState({ project: e.target.value })
    }
    handleSubmit = () => {
        this.props.onFormSubmit({
            id: this.props.id,
            title: this.state.title,
            project: this.state.project
        })
    }
    handleCancel = () => {
        this.props.onFormCancel();
    }
    render() {
        const submitText = this.props.id ? 'Update' : 'Create';

        return (
            <div className='ui centered card'>
                <div className='content'>
                    <div className='ui form'>
                        <div className='field'>
                            <label>Title</label>
                            <input type='text'
                                value={this.state.title}
                                onChange={this.handleTitleChange} />
                        </div>
                        <div className='field'>
                            <label>Project</label>
                            <input type='text'
                                value={this.state.project}
                                onChange={this.handleProjectChange} />
                        </div>
                        <div className='ui two bottom attached buttons'>
                            <button className='ui basic blue button'
                                onClick={this.handleSubmit}>
                                {submitText}</button>
                            <button className='ui basic red button'
                                onClick={this.handleCancel}>Cancel</button>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}

class EditableTimer extends React.Component {
    state = {
        editFormOpen: false
    }

    handleEditClick = () => {
        this.openForm();
    }
    handleFormClose = () => {
        this.closeForm();
    }
    handleSubmit = (timer) => {
        this.props.onEditFormSubmit(timer);
        this.closeForm();
    }
    closeForm = () => {
        this.setState({ editFormOpen: false });
    }
    openForm = () => {
        this.setState({ editFormOpen: true });
    }
    handleRemoveTimer = () => {
        this.props.onRemoveTimer(this.props.id);
    }
    render() {
        if (this.state.editFormOpen) {
            return (
                <TimerForm
                    id={this.props.id}
                    title={this.props.title}
                    project={this.props.project}
                    onFormSubmit={this.handleSubmit}
                    onFormCancel={this.handleFormClose}
                />
            )
        } else {
            return (
                <Timer id={this.props.id}
                    title={this.props.title}
                    project={this.props.project}
                    elapsed={this.props.elapsed}
                    runningSince={this.props.runningSince}
                    onEditClick={this.handleEditClick}
                    onRemoveTimer={this.handleRemoveTimer}
                    onStopClick={this.props.onStopClick}
                    onStartClick={this.props.onStartClick} />
            );
        }
    }
}

class EditableTimerList extends React.Component {
    render() {

        const timers = this.props.timers.map((timer) => (
            <EditableTimer key={timer.id}
                id={timer.id}
                title={timer.title}
                project={timer.project}
                elapsed={timer.elapsed}
                runningSince={timer.runningSince}
                onEditFormSubmit={this.props.onEditFormSubmit}
                onRemoveTimer={this.props.onRemoveTimer}
                onStartClick={this.props.onStartClick}
                onStopClick={this.props.onStopClick} />
        ));
        return (
            <div id="timers">
                {timers}
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
    handleEditFormSubmit = (timer) => {
        this.updateTimer(timer);
    }
    handleRemoveTimer = (timerId) => {
        this.setState({
            timers: this.state.timers.filter(t => t.id !== timerId)
        });
    }
    handleStartClick = (timerId) => {
        const now = Date.now();
        this.updateTimer({
            id: timerId,
            runnningSince: now
        });
    }
    handleStopClick = (timerId) => {
        const now = Date.now();
        this.updateTimer({
            id: timerId,
        }, prevTimerState => {
            const lastElapsed = now - prevTimerState.runnningSince;
            return { runnningSince: null, elapsed: prevTimerState.elapsed + lastElapsed }
        });
    }

    updateTimer = (timerNewState, setNewStateFunc) => {
        let newTimers = this.state.timers.map((t) => {
            if (t.id === timerNewState.id) {

                if (setNewStateFunc) {
                    return Object.assign({}, t, setNewStateFunc(t));
                } else {
                    return Object.assign({}, t, timerNewState);
                }
            } else {
                return t;
            }
        });
        this.setState({ timers: newTimers });
    }
    render() {
        return (
            <div className="ui three column centered grid">
                <div>
                    <EditableTimerList timers={this.state.timers}
                        onEditFormSubmit={this.handleEditFormSubmit}
                        onRemoveTimer={this.handleRemoveTimer}
                        onStartClick={this.handleStartClick}
                        onStopClick={this.handleStopClick} />
                    <ToggleableTimerForm isOpen={false}
                        onFormSubmit={this.onFormSubmit} />
                </div>
            </div>
        );
    }
}

ReactDOM.render(<TimersDashboard />, document.getElementById('content'));