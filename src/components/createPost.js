import React, {Component} from "react";
import {
    Input, 
    Button,
    Form,
    FormGroup,
} from "reactstrap";
import { API, graphqlOperation, Auth } from "aws-amplify";
import {createPost} from "../graphql/mutations"

class CreatePost extends Component {
    state = {
        postOwnerId:"",
        postOwnerUsername: "",
        postTitle: "",
        postBody: ""
    }

    componentDidMount = async () => {
        await Auth.currentUserInfo()
            .then(user =>  {
                this.setState({
                    postOwnerId: user.attributes.sub,
                    postOwnerUsername: user.username
                })
            })
    }

    onChangeProperty = (event) => {
        let {value, name} = event.target;
        this.setState({[name]: value});
    }

    onSubmit= async(event) => {
        event.preventDefault();

        const input = {
            postOwnerId: this.state.postOwnerId,
            postOwnerUsername: this.state.postOwnerUsername,
            postTitle: this.state.postTitle,
            postBody: this.state.postBody,
            createdAt: new Date().toISOString,
        }

        await API.graphql(graphqlOperation(createPost, {input}));
        this.setState({
            postOwnerId:"",
            postOwnerUsername: "",
            postTitle: "",
            postBody: "",
        })
    }

    render(){
        return(
            <div className="card">
                <div className="container">
                    <h4> Create new post </h4>
                <Form>
                    <FormGroup>
                        <Input type="text" name="postTitle" value={this.state.postTitle} onChange={this.onChangeProperty} placeholder="Enter Title" />
                    </FormGroup>
                    <FormGroup>
                        <Input type="textarea" name="postBody" value={this.state.postBody} onChange={this.onChangeProperty}placeholder="Enter Body" rows="3" cols="40" />
                    </FormGroup>
                    <Button className = "btn btn-success alignButton" onClick={this.onSubmit}>Submit</Button>
                </Form>
                </div>
            </div>
        )
    }
}

export default CreatePost;