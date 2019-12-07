import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import NotefulForm from '../NotefulForm/NotefulForm'
import ValidationError from "../ValidationError/ValidationError";
import AppContext from '../Context/AppContext'

class addNote extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            content: "",
            folderId: null,
            nameValid: false,
            folderIdValid: false,
            formValid: false,
            validationMessages: {
                name: '',
                folderId: ''
            }
        }
    }

    updateName(name) {
        this.setState({name}, () => {this.validateName(name)});
    }

    updateContent(content) {
        this.setState({content})
    }

    updateFolderId(folderId) {
        this.setState({folderId}, () => {this.validateFolderId(folderId)});
    }

    validateName(fieldValue) {
        const fieldErrors = {...this.state.validationMessages};
        let hasError = false;

        fieldValue = fieldValue.trim();
        if (fieldValue.length === 0) {
            fieldErrors.name = 'Name is required';
            hasError = true;
        } else {
            if (fieldValue.length < 3) {
                fieldErrors.name ="Please inpute at least 3 characters.";
                hasError = true;
            } else {
                fieldErrors.name = '';
                hasError = false;
            }
        }

        this.setState({
            validationMessages: fieldErrors,
            nameValid: !hasError
        }, this.formValid );

    }

    validateFolderId(fieldValue) {
        const fieldErrors = {...this.state.validationMessages};
        let hasError = false;

        fieldValue = fieldValue.trim();
        if (fieldValue === "..." || fieldValue === null) {
            fieldErrors.folderId = 'What folder should this go in?';
            hasError = true;
        } else {
            fieldErrors.folderId = '';
            hasError = false;
        }

        this.setState({
            validationMessages: fieldErrors,
            folderIdValid: !hasError
        }, this.formValid );

    }


    formValid() {
        this.setState({
            formValid: this.state.nameValid && this.state.folderIdValid
        });
    }


    addNoteRequest = (callback) => {
        const newNote = {
            name: this.state.name,
            content: this.state.content,
            folderId: this.state.folderId,
        }

        fetch("http://localhost:9090/notes", {
            method: "POST",
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(newNote)
        })
            .then(res => {
                if (!res.ok) {
                    return res.json().then(error => {
                        throw error
                    })
                }
                return res.json()
            })
            .then(addedNote => {
                callback(addedNote);
            })
            .catch(error => alert(error))

    }

    render() {
        return (
            <AppContext.Consumer>
                {(context) => (
                    <section className='addNote'>
                        <h2>Create a note</h2>
                        <NotefulForm onSubmit={e => {
                            e.preventDefault();
                            this.addNoteRequest(context.addNote)
                            this.props.history.push(`/folder/${this.state.folderId}`)
                        }}>
                            <div className='field'>
                                <label htmlFor='noteNameInput'>
                                    Name
                                </label>
                                <input type='text' id='noteNameInput' onChange={e => this.updateName(e.target.value)} />
                                <ValidationError hasError={!this.state.nameValid} message={this.state.validationMessages.name}/>
                            </div>
                            <div className='field'>
                                <label htmlFor='noteContentInput'>
                                    Content
                                </label>
                                <textarea id='noteContentInput' onChange={e =>
                                    this.updateContent(e.target.value)}/>
                            </div>
                            <div className='field'>
                                <label htmlFor='noteFolder=Select'>
                                    Folder
                                </label>
                                <select id='noteFolderSelect' onChange={e =>
                                    this.updateFolderId(e.target.value)}>
                                    <option value={null}>...</option>
                                    {context.folders.map(folder =>
                                        <option key={folder.id} value={folder.id}>
                                            {folder.name}
                                        </option>
                                    )}
                                </select>
                                <ValidationError hasError={!this.state.folderIdValid} message={this.state.validationMessages.folderId}/>
                            </div>
                            <div className='buttons'>
                                <button type='submit' disabled={!this.state.formValid}>
                                    Add note
                                </button>
                            </div>
                        </NotefulForm>
                    </section>
                )}
            </AppContext.Consumer>
        )
    }
}

export default withRouter(addNote);