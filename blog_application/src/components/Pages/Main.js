import React,{ useState,useEffect } from 'react';
import {Paginator,Container,PageGroup,usePaginator} from "chakra-paginator";
import { Grid } from '@chakra-ui/react';
import PostList from '../blogComponents/PostList';
import { color } from 'framer-motion';






export default function Main() {
  
  const [postsTotal,setPostsTotal]=useState(undefined);
  const [posts,setPosts]=useState([]);

  const {
    pagesQuantity,
    offset,
    currentPage,
    setCurrentPage,
    pageSize,
  }=usePaginator({
    total:postsTotal,
    initialState:{
      pageSize:10,
      isDisabled:false,
      currentPage:1
    }
  });
  const normalStyle={
    w:10,
    h:10,
    bg:"#333",
    color:"#fff",
    fontSize:"lg",
    _hover:{
      bg:'red',
      color:"#fff",
    }
  }
  const activeStyle={
    w:10,
    h:10,
    bg:"green",
    color:"#fff",
    fontSize:"lg",
    _hover:{
      bg:'blue',
      color:"#fff",
    }
  }


  /*
  Fetching post from database.
  */
 const fetchPosts=async(pageSize,offSet)=>{
  const res=await fetch(
    `http://localhost:8080/reactwithphp/api/posts?limit=${pageSize}&offset=${offSet}`
  );

  return await res.json();
 }

  useEffect(()=>{

    
    fetchPosts(pageSize,offset).then((posts) => {
       setPostsTotal(posts.count);
       setPosts(posts.posts);
      //  console.log(posts.posts);
    });
  },[currentPage,pageSize,offset]);

  return (
    <Paginator pagesQuantity={pagesQuantity}
    currentPage={currentPage}
    onPageChange={setCurrentPage}
    activeStyles={activeStyle}
    normalStyles={normalStyle}>
      <Grid templateColumns='repeat(4,1fr)' gap={6}>
          {posts.map( function ({id,title, content, user_id, image}){
            return <PostList key={id} 
                  id={id} 
                    title={title}
                    content={content} 
                    user_id={user_id} 
                    image={image}/>
          })}
          
      </Grid>
      
      <Container align="center" justify="space-between" w="full" p={4} marginTop={'50px'}>
        <PageGroup isInline align="center"/>
      </Container>
    </Paginator>
  )
}
