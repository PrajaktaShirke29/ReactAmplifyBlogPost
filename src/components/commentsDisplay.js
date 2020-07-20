import React, {Component} from 'react';


class CommentsDisplay extends Component {
    componentDidMount = () => {
        console.log('Comments', this.props.data);
    }
    render () {
        const {content, createdAt, commentOwnerUsername} =this.props.data;
        return (
            <div className="commentCard">
                <span>
                        <i>{commentOwnerUsername} on {createdAt}</i>
                </span>
                <br />
                <span > 
                    {content}
                </span>
            </div>
        );
    }
}

export default CommentsDisplay;