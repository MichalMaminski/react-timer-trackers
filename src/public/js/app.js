class Demo extends React.Component {
    render() {
        console.log("React is rendering component!!!");
        return (<h1>This is view from React component!</h1>);
    }
}

ReactDOM.render(<Demo/>, document.getElementById('content'));