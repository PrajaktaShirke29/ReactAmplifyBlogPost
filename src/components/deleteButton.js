import React, {Component} from "react";
import {Button} from "reactstrap";
import { API, graphqlOperation, Auth } from "aws-amplify";
import { deletePost } from "../graphql/mutations"
class DeleteButton extends Component {
    state = {
        showButton: false,
    }

    deletePost = async (id) => {
        const  input = {
            id,
        }
        await API.graphql(graphqlOperation(deletePost, {input}))
    }
    render(){
        const {data} = this.props
        return(
            <div>
                <Button className="btn btn-danger alignButton" onClick={() => this.deletePost(data.id)}>Delete</Button>
            </div>
        )
    }
}

export default DeleteButton;