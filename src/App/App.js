import React, { Component } from 'react'
import { Route, Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import NoteListNav from '../NoteListNav/NoteListNav'
import NotePageNav from '../NotePageNav/NotePageNav'
import NoteListMain from '../NoteListMain/NoteListMain'
import NotePageMain from '../NotePageMain/NotePageMain'
import addFolder from '../AddFolder/AddFolder'
import AddNote from '../AddNote/AddNote'
import AppContext from '../Context/AppContext'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'
import config from '../config'
import './App.css'


class App extends Component {
    state = {
        notes: [],
        folders: [],
    };

    componentDidMount() {
        const folderURL = `${config.API_ENDPOINT}/folders`
        const noteURL = `${config.API_ENDPOINT}/notes`

        fetch(folderURL)
            .then(res => {
                if (!res.ok) {
                    return res.json().then(error => {
                        throw error
                    })
                }
                return res.json()
            })
            .then(data => this.setState({
                folders: data,
            }))
            .catch(error => alert(error))


        fetch(noteURL)
            .then(res => {
                if (!res.ok) {
                    return res.json().then(error => {
                        throw error
                    })
                }
                return res.json()
            })
            .then(data => this.setState({
                notes: data,
            }))
            .catch(error => alert(error))
    }

    handleDeleteNote = (noteId) => {
        const newNotes = this.state.notes.filter(note => note.id !== noteId)

        this.setState({
            notes: newNotes
        })
    }

    handleaddFolder = (newFolder) => {
        this.setState({
            folders: [...this.state.folders, newFolder]
        })
    }

    handleAddNote = (addedNote) => {
        this.setState({
            notes: [...this.state.notes, addedNote]
        })
    }

    renderNavRoutes() {
        return (
            <>
                {['/', '/folder/:folderId'].map(path =>
                    <Route
                        exact
                        key={path}
                        path={path}
                        component={NoteListNav}
                    />
                )}
                <Route
                    path='/note/:noteId'
                    component={NotePageNav}
                />
                <Route
                    path='/add-folder'
                    component={NoteListNav}
                />
                <Route
                    path='/add-note'
                    component={NoteListNav}
                />
            </>
        )
    }

    renderMainRoutes() {
        return (
            <>
                {['/', '/folder/:folderId'].map(path =>
                    <Route
                        exact
                        key={path}
                        path={path}
                        component={NoteListMain}
                    />
                )}
                <Route
                    path='/note/:noteId'
                    component={NotePageMain}
                />
                <Route
                    path='/add-folder'
                    component={addFolder}
                />
                <Route
                    path='/add-note'
                    component={AddNote}
                />
            </>
        )
    }

    render() {
        return (
            <AppContext.Provider value={{
                folders: this.state.folders,
                notes: this.state.notes,
                deleteNote: this.handleDeleteNote,
                addFolder: this.handleaddFolder,
                addNote: this.handleAddNote
            }}>
                <ErrorBoundary>
                    <div className='App'>
                        <nav className='AppNav'>
                            {this.renderNavRoutes()}
                        </nav>
                        <header className='AppHeader'>
                            <h1>
                                <Link to='/'>Noteful</Link>
                                {' '}
                                <FontAwesomeIcon icon='check-double' />
                            </h1>
                        </header>
                        <main className='AppMain'>
                            {this.renderMainRoutes()}
                        </main>
                    </div>
                </ErrorBoundary>
            </AppContext.Provider>
        )
    }
}

export default App