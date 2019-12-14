import React, { Component } from 'react'
import NotefulForm from '../NotefulForm/NotefulForm'
import { withRouter } from 'react-router-dom'
import ValidationError from "../ValidationError/ValidationError";
import config from '../config'
import AppContext from "../AppContext";



class addFolder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            nameValid: false,
            formValid: false,
            validationMessages: {
                name: ""
            }
        }
    }


    updateFolderName = (name) => {
        this.setState({name}, () => {this.validateName(name)});
    }


    validateName = (fieldValue) => {
        const fieldErrors = {...this.state.validationMessages};
        let hasError = false;

        fieldValue = fieldValue.trim();
        if (fieldValue.length === 0) {
            fieldErrors.name = 'A name is required';
            hasError = true;
        } else {
            if (fieldValue.length < 3) {
                fieldErrors.name = 'Please add at least 3 characters';
                hasError = true;
            } else {
                fieldErrors.name = '';
                hasError = false;
            }
        }

        this.setState({
            validationMessages: fieldErrors,
            nameValid: !hasError
        }, this.validateForm );

    }


    validateForm = () => {
        this.setState({
            formValid: this.state.nameValid
        });
    }


    addFolderRequest = (callback) => {
        const folder = {
            name: this.state.name}

        fetch(`${config.API_ENDPOINT}/folders`, {
            method: "POST",
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(folder)
        })
            .then(res => {
                if (!res.ok) {
                    return res.json().then(error => {
                        throw error
                    })
                }
                return res.json()
            })
            .then(newFolder => {
                callback(newFolder)
            })
            .catch(error => alert(error))

    };



    render() {
        return (
            <AppContext.Consumer>
                {(context) => (
                    <section className='addFolder'>
                        <h2>Create a folder</h2>

                        <NotefulForm onSubmit={(e) => {
                            e.preventDefault();
                            this.addFolderRequest(context.addFolder);
                            this.props.history.push('/')
                        }}>
                            <div className='field'>
                                <label htmlFor='folderNameInput'>
                                    Name
                                </label>
                                <input type='text' id='folderNameInput' onChange={e => this.updateFolderName(e.target.value)} />
                                <ValidationError hasError={!this.state.nameValid} message={this.state.validationMessages.name}/>
                            </div>

                            <div className='buttons'>
                                <button type='submit' disabled={!this.state.formValid}>
                                    Add Folder
                                </button>
                            </div>
                        </NotefulForm>

                    </section>
                )}
            </AppContext.Consumer>
        )
    }
}

export default withRouter(addFolder);