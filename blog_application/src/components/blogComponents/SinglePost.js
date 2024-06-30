import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Container,Heading } from "@chakra-ui/react";

export default function SinglePost() {

  const location=useLocation();
  const [postDataId,setPostData]=useState({});
  const [postData,setCurrentPost]=useState(null);

  const fetchCurrentPost=async(id)=>{
    const res=await fetch(
    `http://localhost:8080/reactwithphp/api/getCurrentTopic?id=${id}`,
    {
        headers:{
          "Access-Control-Allow-Origin":"*",
          "Content-Type": "application/json"
        }
    }

    )
    return await res.json();
  }

  useEffect(()=>{
    if(location.state){
      const {id}=location.state;
    setPostData(location.state);

    //Get Data from backend

    fetchCurrentPost(id).then((item)=>{
      setCurrentPost(item);
    });
   
    } else{
      window.location.href="/404";
    }
    setTimeout(()=>{
      if(location.state==null){
        window.location.href='/404'
      }
    },100)
  },[location.state]);
  

  return (
    <>
      {postData != null &&<Container maxW='1200px' marginTop={'50px'}>
            <Heading
              size='lg'
              textAlign='center'
              color='gray.700'
            >
              {postData.title}
            </Heading>

            <img src={postData.image} width='300px' height='100px'/>
            <br></br>
            <hr/>
            <br/>
            <p>
              {postData.content}
            </p>
            </Container>
      }
    </>
  )
}
