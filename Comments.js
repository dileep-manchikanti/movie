import { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { fetchComments,deleteComment } from "./Data";
import {BsFillTrashFill} from 'react-icons/bs';
import { useAuth } from "./Contexts/AuthContext";
import {FcCollapse} from 'react-icons/fc';
export default function Comments({postid,comments,setComments,setClicked})
{
    const {useremail} = useAuth();
    useEffect(async ()=>
    {
        const fetchedcomments = await fetchComments(postid);
        if(fetchedcomments.length!=0){setComments(fetchedcomments);}
    },[]);
    const deleteHandler=(id)=>
    {
        return (e)=>
        {
            setComments(comments.filter((comment)=>comment.id!=id));
            deleteComment(id);
        }
    }
    return(
        <>
        {
            comments.map((comment)=>
            {
                return <Card key={comment.id} style={{padding:"1.5vw"}}>
                    <p>{comment.useremail}</p>
                    <Card.Body>
                        <Card.Title>
                            {comment.title}
                        </Card.Title>
                    {
                        useremail==comment.useremail && <BsFillTrashFill className='enlarge-icons' style={{cursor:"pointer",marginLeft:"90%"}}onClick={deleteHandler(comment.id)}/>
                    }
                    </Card.Body>
                </Card>
            })
        }
        <FcCollapse className='enlarge-icons' style={{cursor:"pointer",float:"right",marginTop:"1vw"}} onClick={(e)=>{setClicked(false)}}/>     
        </>
    )
}