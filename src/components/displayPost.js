import React, { Component } from "react";
import { listPosts} from "../graphql/queries";
import { API, graphqlOperation, Auth } from "aws-amplify";
import  DeleteButton from "./deleteButton";
import EditButton from "./editButton";
import {onCreatePost, onDeletePost, onUpdatePost, onCreateComment, onCreateLike} from "../graphql/subscriptions"
import { updatePost, createComment, createLike } from "../graphql/mutations";
import CreateComment from "./createComment";
import CommentsDisplay from "./commentsDisplay";
import { FaThumbsUp } from 'react-icons/fa';

class DisplayPost extends Component {
    state = {
        posts: [],
        comments: [],
        postOwnerId:"",
        postOwnerUsername:"",
        errorMessage: false
    }
    
    componentDidMount= async() => {
        this.getPosts();
        await Auth.currentUserInfo()
            .then(user =>  {
                this.setState({
                    postOwnerId: user.attributes.sub,
                    postOwnerUsername: user.username
                })
            })
        this.createPostListner = API.graphql(graphqlOperation(onCreatePost))
            .subscribe({
                next: postData => {
                    const newPost = postData.value.data.onCreatePost;
                    const prevPost = this.state.posts.filter(post => post.id !== newPost.id)

                    const updatePosts = [newPost, ...prevPost];

                    this.setState({posts: updatePosts});
                }
            }) 
            
        this.deletePostListner = API.graphql(graphqlOperation(onDeletePost))
        .subscribe({
            next: postData => {
                const deletedPost = postData.value.data.onDeletePost;
                const prevPost = this.state.posts.filter(post => post.id !== deletedPost.id)

                this.setState({posts: prevPost});
            }
        })

        this.updatePostListner = API.graphql(graphqlOperation(onUpdatePost))
        .subscribe({
            next: postData => {
                const updatedPost = postData.value.data.onUpdatePost;
                const prevPost = this.state.posts.filter(post => post.id !== updatePost.id);

                const updatedPosts = [updatedPost, ...prevPost];
                this.setState({posts: updatedPosts});
            }
        })

        this.createCommentListner = API.graphql(graphqlOperation(onCreateComment))
        .subscribe({
            next: postData => {
                const createdComment = postData.value.data.onCreateComment;
                let posts = [ ...this.state.posts];
                posts.map((post) => {
                    if(createComment.id === post.comments.items.id) {
                        post.comments.items.push(createdComment);
                    }
                })
                this.setState({posts: posts});
            }
        })

        this.createLikeListner = API.graphql(graphqlOperation(onCreateLike))
        .subscribe({
            next: postData => {
                const createLike = postData.value.data.onCreateLike;
                let posts = [ ...this.state.posts];
                posts.map((post) => {
                    if(createLike.id !== post.likes.items.id) {
                        post.likes.items.push(createLike);
                    }
                })
                this.setState({posts: posts});
            }
        })
    }

    componentWillUnmount = () => {
        this.createPostListner.unsubscribe();
        this.deletePostListner.unsubscribe();
        this.updatePostListner.unsubscribe();
        this.createCommentListner.unsubscribe();
        this.createLikeListner.unsubscribe();
    }

    getPosts = async() => {
        const result = await API.graphql(graphqlOperation(listPosts));
        console.log("ALL Posts", result.data.listPosts.items);
        this.setState({posts: result.data.listPosts.items})
    }

    createLikes = async(id) => {
        const input = {
            likePostId:id,
            numberLikes: 1,
            likeOwnerId: this.state.postOwnerId,
            likeOwnerUsername: this.state.postOwnerUsername,
        }

        await API.graphql(graphqlOperation(createLike, {input}));
    }
    render(){
        const { posts, postOwnerId } = this.state;

        return posts.map((post) => {
            return(<div className= "card" key={post.id}>
                <div className="container">
                    <span className= "alignButton">{post.likes.items.length}</span>
                    {post.likes.items.filter(x => x.likeOwnerId === postOwnerId) && 
                    <span 
                        className= "alignButton"
                        onClick={() => this.createLikes(post.id)} 
                        ><FaThumbsUp style={{color:"#50b5fd" }}/> 
                        </span>}
                    {/* {postOwnerId !== post.postOwnerId && 
                        <span className= "alignButton"><FaThumbsUp style={{color:"grey" }}/></span> } */}
                    <h4> {post.postTitle} </h4>
                    <p> {post.postBody}</p>
                    <span>
                        <i>Created By {post.postOwnerUsername} on {post.createdAt}</i>
                    </span>
                    
                    {post.postOwnerId === postOwnerId && 
                        <span>
                            <EditButton data={post}/>
                            <DeleteButton data={post}/>
                        </span>
                    }
                </div>

                <CreateComment data={post}/>
                <div className="card">
                    <div className="container">
                        <span>Comments: </span>
                        {post.comments.items.length > 0 &&
                            (
                                post.comments.items.map((comment, index) => {
                                    return(<CommentsDisplay data={comment} key={index}/>);
                                })
                            )
                        }
                    </div>
                </div>
            </div>)
        })
    }
}

export default DisplayPost;