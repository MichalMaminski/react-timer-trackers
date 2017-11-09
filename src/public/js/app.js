class Demo extends React.Component {
    render() {
        console.log("React is rendering component!!!");
        return (<h1>This is view from React component!</h1>);
class TimersDashboard extends React.Component {
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