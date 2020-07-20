import React, {Component} from "react";
import Modal from 'react-modal';
import {
    Input, 
    Button,
    Form,
    FormGroup,
} from "reactstrap";
import { API, graphqlOperation } from "aws-amplify";
import { updatePost} from "../graphql/mutations"

class EditButton extends Component {
    constructor () {
        super();
        this.state = {
            showModal: false,
            postOwnerId: "",
            postOwnerUsername: "",
            postTitle: "",
            postBody: "",
            id: "",
            postData: {},
        };
        
        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
      }
      
      handleOpenModal () {
        this.setState({ showModal: true });
      }
      
      handleCloseModal () {
        this.setState({ showModal: false });
      }
      onChangeProperty = (event) => {
        let {value, name} = event.target;
        this.setState({[name]: value});
    }
      componentDidMount = () => {
          const {postBody, postTitle, postOwnerId, postOwnerUsername, id} = this.props.data;
          this.setState({
              postOwnerId: postOwnerId,
              postOwnerUsername: postOwnerUsername,
              postBody:postBody,
              postTitle:postTitle,
              id: id
          });
      }

      onEdit = async() => {
        const {postBody, postTitle, postOwnerId, postOwnerUsername, id} = this.state;
          const input = {
                id,
                postOwnerId: postOwnerId,
                postOwnerUsername: postOwnerUsername,
                postBody:postBody,
                postTitle:postTitle,
                updatedAt: new Date().toISOString()
          }
          
          await API.graphql(graphqlOperation(updatePost, {input}))
          this.handleCloseModal();
      }
    render(){
        return(
            <div id="main">
                {this.state.showModal && (
                    // <h1>Hello</h1>
                    <Modal 
                    isOpen={this.state.showModal}
                    contentLabel="onRequestClose Example"
                    onRequestClose={this.handleCloseModal}
                    className="Modal"
                    overlayClassName="Overlay"
                    >
                     <div className="container">
                     <Button close onClick={this.handleCloseModal}>X</Button>
                        <h4> Update Post </h4>

                        <Form className="formMadal">
                            <FormGroup>
                                <Input type="text" name="postTitle" value={this.state.postTitle} onChange={this.onChangeProperty} placeholder="Enter Title" />
                            </FormGroup>
                            <FormGroup>
                                <Input type="textarea" name="postBody" value={this.state.postBody} onChange={this.onChangeProperty}placeholder="Enter Body" rows="3" cols="40" />
                            </FormGroup>
                            <Button className = "btn btn-success alignButton" onClick={this.onEdit}>Edit</Button>
                        </Form>
                    </div>
                    </Modal>
                )
                }
                <Button className="btn btn-info alignButton" onClick={this.handleOpenModal}>Edit</Button>
            </div>
        )
    }
}

export default EditButton;