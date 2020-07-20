import React, {Component} from 'react';
import {
    Input, 
    Button,
    Form,
    FormGroup,
} from "reactstrap";
import { API, graphqlOperation, Auth } from "aws-amplify";
import { createComment } from "../graphql/mutations"

class CreateComment extends Component {
    constructor () {
        super();
        this.state = {
            commentOwnerId: "",
            commentOwnerUsername: "",
            content: "",
            createdAt: new Date().toISOString(),
            commentPostId: "",
            showButton: false,
        }
    }

    onChangeProperty = (event) => {
        let {value, name} = event.target;
        this.setState({[name]: value});
    }
    componentDidMount = async() => {
        const {postOwnerId, postOwnerUsername, id} = this.props.data;
        
        this.setState({
            commentOwnerId: postOwnerId,
            commentOwnerUsername: postOwnerUsername,
            commentPostId: id,
        })
    } 
    onSubmitComment = async () => {
        const {commentOwnerId, commentOwnerUsername, commentPostId, content, createdAt} = this.state;
        console.log('comment', this.state);
        const input = {
            commentOwnerId,
            commentOwnerUsername,
            content,
            createdAt,
            commentPostId
        };
        await API.graphql(graphqlOperation(createComment, {input}));
        this.setState({content: ""});
    }
    render(){
       return(
            <div>
                <Form className="formMadal">
                    <FormGroup>
                    <Input type= "textarea" cols="" rows=""
                        value={this.state.content}
                        name= "content"
                        onChange={this.onChangeProperty}
                        placeholder= "Enter Comment"
                    />
                    </FormGroup>
                <Button className="btn btn-success alignButton" onClick={this.onSubmitComment}>Add Comment</Button>
                </Form>
            </div>
        );
    }
} 

export default CreateComment;