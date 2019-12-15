import React from 'react'
import { withRouter, Link } from 'react-router-dom'
import { format } from 'date-fns'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './Note.css'
import PropTypes from 'prop-types';
import config from '../config'
import AppContext from "../AppContext";


function deleteNoteRequest(noteId, callback) {
    const deleteURL = `${config.API_ENDPOINT}/notes/${noteId}`

    fetch(deleteURL, {
        method: 'DELETE',
        headers: {
            'content-type': 'application/json'
        }
    })
        .then(res => {
            if (!res.ok) {
                return res.json().then(error => {
                    throw error
                })
            }
            return res.json()
        })
        .then(() => {
            callback(noteId)
        })
        .catch(error => alert(error))

}

class Note extends React.Component {

    render() {
        return (
            <AppContext.Consumer>
                { (context) => (
                    <div className='Note'>
                        <h2 className='Note__title'>
                            <Link to={`/note/${this.props.id}`}>
                                {this.props.name}
                            </Link>
                        </h2>
                        <button
                            className='Note__delete'
                            type='button'
                            onClick={() => {
                                deleteNoteRequest(this.props.id, context.deleteNote);
                                this.props.history.push('/')

                            }}>
                            <FontAwesomeIcon icon='trash-alt' />
                            {' '}
                            remove
                        </button>
                        <div className='Note__dates'>
                            <div className='Note__dates-modified'>
                                Modified
                                {' '}
                                <span className='Date'>
                {this.props.modified ? format(new Date(this.props.modified), 'MM-dd-yyyy') : ''}
              </span>
                            </div>
                        </div>
                    </div>
                )}
            </AppContext.Consumer>
        )
    }
}

Note.propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    modified: PropTypes.string
}

export default withRouter(Note);