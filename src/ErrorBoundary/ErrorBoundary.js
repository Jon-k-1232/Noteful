import React from 'react'


export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state ={
            hasError:false
        };
    }


    static getDerivedStateFromError(error){
        return {hasError: true}
    }


    render() {
        if (this.state.hasError){
            return(
                <div className="error">
                    <h3 className="errorMessage">Somethings broken. Throw the computer out the window!</h3>
                </div>
            );
        }
        return this.props.children;
    }
}