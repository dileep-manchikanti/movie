import {useState,useRef, useEffect} from 'react';
import {fetchPosts,addDocstoPost,deletepost} from './Data';
import {Button} from 'react-bootstrap';
import Post from './Post';
export default function Posts({movieId,userid,useremail}) 
{
    const commentRef = useRef();
    const likeref = useRef();
    const dislikeref = useRef();
    const [posts,setPosts] = useState([]);
    const imgref =useRef();
    const fileinputref =useRef();
    const [file,setFile] = useState();
    const getDocs =async ()=>
    {
        const Posts=[];
        const data = await fetchPosts(movieId);
        data.forEach((doc)=>
        {
            Posts.push({id:doc.id,...doc.data()});
        });
        setPosts(Posts);
    }
    useEffect(async ()=>
    {
        await getDocs();
    },[]);
    const postsubmitHandler=async (e)=>
    {
        const comment = commentRef.current.value;
        if(comment.split(" ").join("")==''){alert("Empty Post!");commentRef.current.value='';return;}
        const post = {title:comment,email:useremail,likes:"0",movieId:movieId};
        addDocstoPost(post);
        getDocs();

        commentRef.current.value='';
    }
    const deleteHandler=(id)=>
    {
        console.log("The id is "+id);
          return async (e)=>
          {
              e.preventDefault();
              setPosts(posts.filter(post => post.id!=id));
              deletepost(id);
          };
    }
    return (
        <>
        <div style={{marginLeft:"3vw"}}>
        <textarea ref={commentRef} style={{width:"50vw",height:"30vh"}} placeholder="Write Review...."></textarea>
        <Button style={{display:"block",marginTop:"3vh"}} onClick={postsubmitHandler}>Post</Button>
        <img ref={imgref} style={{width:"30%",height:"30%"}}></img>
    </div>
    <div style={{margin:"4vw",width:"90vw",display:"flex",flexDirection:"column",justifyContent:"space-around",alignItems:"center",borderRadius:"4px",marginTop:"4vh",marginLeft:"10vh",padding:"4vw"}}>
        {
            posts.length==0 ? <h1 style={{textAlign:"center"}}>No Posts Yet</h1> : posts.map((post)=>
            <Post key={post.id} id={post.id} email={post.email}
            userid={userid} likes={post.likes} deleteHandler={deleteHandler} post_userid={post.userid} posts={posts} setPosts={setPosts}
            title={post.title}/>)
        }
    </div>
    </>
    )
}