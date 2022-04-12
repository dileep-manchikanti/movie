import axios from 'axios';
import {db} from './firebase';
import {addDoc, collection, getDocs, query,setDoc,where,doc,getDoc,deleteDoc, updateDoc} from 'firebase/firestore';
import { getAdditionalUserInfo } from 'firebase/auth';
import Movies from './movies.json';
import { auth } from './firebase';
export const fetchMovies= ()=>
{
    console.log("Fetched Movies",Movies);
    return Movies;
}

export const fetchMovieById = async(id)=>
{
   const data =  Movies.filter((movie)=>movie._id==id);
   console.log(data);
   return data[0];
}

export const fetchPosts = async (movieId) =>
{
    const posts =collection(db,"posts");   
    const q = query(posts,where("movieId","==",movieId))
    const docs = await getDocs(q);
    const data=[];
    docs.forEach((doc)=>
    {
        data.push(doc);
    })
    return data;
}

export const addDocstoPost = async(post) =>
{
    await addDoc(collection(db,"posts"),post);
}
export const deletepost=async (id) =>
{
    await deleteDoc(doc(db,"posts",id));
    await deletealllikesforpost(id);
    const q = query(collection(db,"comments"),where("postid","==",id));
    const docs = await getDocs(q);
    docs.forEach((docx)=>
    {
        deleteDoc(doc(db,"comments",docx.id));
    })
}

export const createLikeDoc=async (post_id,user_id)=>
{
   const likes = collection(db,"likes");
   await addDoc(likes,{postid:post_id,userid:user_id});
}

export const deleteLikeDoc=async (post_id,user_id)=>
{
   const likes = collection(db,"likes");
   const q = query(likes,where("postid","==",post_id),where("userid","==",user_id));
   const docs = await getDocs(q);
   docs.forEach((docx)=>
   {
       deleteDoc(doc(db,"likes",docx.id));
   });
}

export const deletealllikesforpost=async (postid)=>
{
    const likes = collection(db,"likes");
    const q = await query(likes,where("postid",'==',postid));
    const docs = await getDocs(q);
    docs.forEach((docx)=>
    {
       deleteDoc(doc(db,"likes",docx.id));
    })
}

export const checkuserlikedpost=async (userid,postid)=>
{
  const q = await query(collection(db,"likes"),where("postid","==",postid),where("userid","==",userid));
  const docs = await getDocs(q);
  return docs.size!=0;
}

export const fetchComments = async(postid) =>
{
   const comments = collection(db,"comments");
   const q = query(comments,where("postid","==",postid));
   const docs = await getDocs(q);
   const collectedcomments=[];
   docs.forEach((docx)=>
   {
      const comment = {id:docx.id,...docx.data()};
      collectedcomments.push(comment);
   });
   return collectedcomments;
}

export const deleteComment = async(id) =>
{
    deleteDoc(doc(db,"comments",id)); 
}

export const createcomment = async(postid,title,useremail)=>
{
    await addDoc(collection(db,"comments"),{postid:postid,title:title,useremail:useremail});
}

export  async function deleteCommentsByUser(email)
{
    console.log(email);
    const comments = collection(db,"comments");
    const q=query(comments,where("useremail","==",email));
    const docs = await getDocs(q);
    docs.forEach(async (docx)=>
    {
        deleteDoc(doc(db,"comments",docx.id));
    })
}

export async function deleteLikesByUser(userid)
{
    console.log(userid);
    const likes = collection(db,"likes");
    const q= query(likes,where("userid","==",userid));
    const docs = await getDocs(q);
    docs.forEach(async (docx)=>{deleteDoc(db,"likes",docx.id)});
}

export async function deletePostsByUser(email)
{
    console.log(email);
    const posts = collection(db,"posts");
    const q= query(posts,where("email","==",email));
    const docs = await getDocs(q);
    docs.forEach(async (docx)=>{deleteDoc(db,"posts",docx.id)});
}