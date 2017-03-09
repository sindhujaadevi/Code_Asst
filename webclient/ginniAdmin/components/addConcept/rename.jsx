import React from 'react';
import {
    Form,
    Grid,
    Button,
    Icon,
    Divider
} from 'semantic-ui-react';
import AllConcepts from './allConcept';
import Config from '../../../../config/url';
import Axios from 'axios';
import Snackbar from 'material-ui/Snackbar';
import './addConcept.css';

export default class renameConcept extends React.Component {
    constructor(props) {
        super(props);
        this.getConcept = this.getConcept.bind(this);
        this.renameConcepts = this.renameConcepts.bind(this);
        this.state = {
            relationValue: '',
            conceptValue: '',
            opensnackbar: false,
            snackbarMsg: '',
            concepts: []
                  };
    }
    // load the dropdown with all concepts from neo4j database
    componentDidMount() {
        let url = Config.url + '/concept/rc';
        Axios.get(url).then((response) => {
            let concepts = response.data.rc._fields[1];
            concepts.forEach((concept) => {
                this.state.concepts.push({text: concept, value: concept});
            });
        }).catch((error) => {
            console.log(error);
        });
    }
    getConcept(concept) {
        this.setState({conceptValue: concept});
    }
    handleopen = () => {
        this.setState({open: true});
    }
    handleclose = () => {
        this.setState({open: false});
    }
    handleRequestClose = () => {
        this.setState({opensnackbar: false});
    };
renameConcepts(e) {
    e.preventDefault();
    // getting the value of concept name to be renamed from text field
    let renameConceptText = this.refs.renameConceptText.value;
    let existingConcept = this.state.conceptValue;
    // checking for empty field since empty node is not required
    if (renameConceptText && existingConcept) {
    // ajax call for renaming concept in graph databse
        let url = Config.url + '/concept/renameConcept';
        Axios.put(url, {
            renameConcept: renameConceptText,
            oldConcept: existingConcept
        }).then((response) => {
            if (response.data.saved) {
              let conceptsCopy = this.state.concepts;
              let index = conceptsCopy.map((data) => data.text).indexOf(existingConcept);
              conceptsCopy.splice(index, 1, {text: renameConceptText, value: renameConceptText});
            }
            // clearing the input fields
            this.refs.renameConceptText.value = '';
            this.setState({conceptValue: ''});
        }).catch((error) => {
            console.log(error);
        });
    } else {
        this.setState({opensnackbar: true, snackbarMsg: 'Please fill all the fields'});
    }
}
    render() {
        return (
            <div style={{
                backgroundImage: 'url(\'../../images/background.jpg\')',
                height: '100%'
            }}>
                <Grid >
                  <Grid.Column width={4}/>
                    <Grid.Column width={6}>
                        <Grid.Row/>
                        <Grid.Row textAlign='center'>
                            <Grid.Column width={5}>
                                <h4>RENAME CONCEPT</h4>
                            </Grid.Column>
                            <Divider/>
                        </Grid.Row>

                        <Grid.Row>
                            <Grid.Column width={5} />
                            <Grid.Column width={6}>
                                <AllConcepts
                                  concepts={this.state.concepts} handleConcept={this.getConcept}
                                    value={this.state.conceptValue}/>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column width={5}/>
                            <Grid.Column width={6}>
                                <Form>
                                    <Form.Field>
                                        <label>
                                            <h4>Rename Concept</h4>
                                        </label>
                            <input autoComplete='off' type='text' ref='renameConceptText'
                                          placeholder='Type Concept Name'/>
                                    </Form.Field>
                                </Form>
                            </Grid.Column>
                        </Grid.Row>
                        <br/>
                        <Grid.Row>
                            <Button color="facebook" fluid large onClick={this.renameConcepts}>
                                <Icon name='refresh'>Rename</Icon>
                            </Button>
                        </Grid.Row>
                    </Grid.Column>
                </Grid>
                <Snackbar open={this.state.opensnackbar} message={this.state.snackbarMsg}
                  autoHIdeDuration={400} onRequestClose={this.handleRequestClose}/>
            </div>
        );
    }
}
