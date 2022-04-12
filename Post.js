import {AiFillLike} from 'react-icons/ai';
import {BsFillTrashFill} from 'react-icons/bs';
import {Card,Button} from 'react-bootstrap';
import {createLikeDoc,deleteLikeDoc,checkuserlikedpost, createcomment, fetchComments} from './Data';
import {doc, getDocs, setDoc} from 'firebase/firestore';
import {db} from './firebase';
import {useRef,useEffect,useState} from 'react';
import {FaComments} from 'react-icons/fa';
import Comments from './Comments';
import {useAuth} from './Contexts/AuthContext';
export default function Post({id,email,title,userid,likes,deleteHandler,post_userid,posts,setPosts})
{
    const [liked,setLiked] = useState(false);
    const [clicked,setClicked] = useState(false);
    const [comments,setComments] = useState([]);
    const commentref = useRef();
    const {useremail} = useAuth();
    const [saved,setSaved] = useState(false);
    useEffect(async ()=>
    {
          const isliked = await checkuserlikedpost(userid,id);
          setLiked(isliked);
    },[]);
    const likeHandler=(id,likes)=>
    {
        return async (e)=>
        {
            if(!liked)
            {
             console.log(id);   
             const docref = doc(db,"posts",id);
             setDoc(docref,{likes:Number(likes)+1},{merge:true});
             var dup_posts=[];
             var index=0;
             posts.forEach((post)=>
             {
                 dup_posts.push(post);
                 index++;
                 if(post.id==id)
                 {
                     dup_posts[index-1].likes=String(Number(dup_posts[index-1].likes)+1);
                 }
             });
             setPosts(dup_posts);
             e.target.style["color"]="green";
             setLiked(true);
             createLikeDoc(id,userid);
            }
            else
            {
              const docref = doc(db,"posts",id);
              setDoc(docref,{likes:Number(likes)-1},{merge:true});
              var dup_posts=[];
              var index=0;
              posts.forEach((post)=>
              {
                  dup_posts.push(post);
                  index++;
                  if(post.id==id)
                  {
                      dup_posts[index-1].likes=String(Number(dup_posts[index-1].likes)-1);
                  }
              });
              setPosts(dup_posts);
              e.target.style["color"]="black";
              setLiked(false);
              deleteLikeDoc(id,userid);   
            }
        }
    }
    const getComments = async ()=>
    {
        const commentscollection  = await fetchComments(id);
        setComments(commentscollection);
    }
    const addCommentHandler=async (e)=>
    {
        e.preventDefault();
        const title = commentref.current.value;
        if(title.split(" ").join("")==""){alert("Comment Body is Empty!");commentref.current.value='';return;}
        setComments([{title,useremail,postid:id},...comments]);
        await createcomment(id,title,useremail);
        await getComments();
        commentref.current.value='';
    }
    return(
        <Card key={id} style={{padding:"1vw",width:"40vw",marginTop:"2vw"}}>
        <p>{email}</p>
        <Card.Body>
            <h5>{title}</h5>
        </Card.Body>
        <div style={{display:"flex",justifyContent:"space-around",alignItems:"center"}}>
        <div>
        <AiFillLike color={liked ? "green":"black"} onClick={likeHandler(id,likes)} style={{cursor:"pointer"}} className='enlarge-icons'></AiFillLike>
        <h2 style={{display:"inline",marginLeft:"1vw"}}>{likes}</h2>
        </div>
        {!clicked  && <FaComments className='enlarge-icons' style={{cursor:"pointer"}} onClick={(e)=>{setClicked(true);}}/>}
        {useremail==email && <BsFillTrashFill style={{cursor:"pointer"}} className='enlarge-icons' onClick={deleteHandler(id)}/>}
        </div>
        {
          clicked && <div className='comments-section' style={{display:"flex",flexDirection:"column",justifyContent:"space-evenly",padding:"0.5vw"}}>
          <textarea placeholder='Add comment' ref={commentref} style={{borderRadius:"4px",padding:"0.3vw"}}></textarea>
          <Button style={{alignSelf:"flex-end"}} onClick={addCommentHandler}>Comment</Button>
          <div style={{marginLeft:"20%"}}>
           <Comments comments={comments} setComments={setComments} postid={id} setClicked={setClicked}/>
          </div>
          </div>
        }
        </Card>
    );
}