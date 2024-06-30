import { ThemeProvider } from 'styled-components';
import { ChakraProvider, Box, Flex, HStack, Stack, Switch, Link as ChakraLink, Container, useDisclosure, Modal, ModalOverlay, ModalHeader, ModalBody, FormControl, Input, ModalFooter, Button, ModalContent, UnorderedList, ListItem } from '@chakra-ui/react';
import { lightTheme, darkTheme, GlobalStyles } from './theme';
import SinglePost from './components/blogComponents/SinglePost';
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Link, Route, Link as RouterLink, Routes } from 'react-router-dom';
import { MoonIcon, SunIcon, Search2Icon } from '@chakra-ui/icons';
import './App.css'
import Contact from './components/Pages/Contact';
import Main from './components/Pages/Main';
import NotFOund from './components/blogComponents/NotFOund';
function App() {
  const [theme, setTheme] = useState('light');
  const [isSwitchOn, setIsSwitchOn] = useState(true);
  const [searchTerm,setSearchTerm]=useState([]);
  const [searchResultitems,setSearchResultItems]=useState([]);
  const {isOpen,onOpen,onClose}=useDisclosure();
  const initialRef = React.useRef();
  /*
  Switch theme on and off
  */
  const changeThemeSwitch = () => {
    const newValue = !isSwitchOn;
    setIsSwitchOn(newValue);
    setTheme(newValue ? 'light' : 'dark');
  };

  /**
   * Get search results from database
   */
  const fetchSearchResults=async(searchTerm)=>{
    // try {
    //   const res = await fetch(
    //     `http://localhost:8080/reactwithphp/api/searchResult?keyword=${searchTerm}`
    //   );
    //   if (!res.ok) {
    //     throw new Error('Network response was not ok');
    //   }
    //   const data = await res.json();
    //   return data;
    // } catch (error) {
    //   console.error('Fetch error:', error);
    //   return { posts: [] };
    // }
    const res =await fetch(
    `http://localhost:8080/reactwithphp/api/searchResult?keyword=${searchTerm}`,
    {
      method:"POST",
      headers:{
        "Access-Control-Allow-Origin":"*",
        "Content-Type":"application/json"
      }
    }
      
    );
    return await res.json();
  }

  /**
   * When search term update fetch data ,
   */
  useEffect(()=>{
      const getUsersInput=setTimeout(()=>{
        fetchSearchResults(searchTerm).then((items)=>{
          // console.log(items.posts)
          setSearchResultItems(items.posts);
        });
      },100)

      return ()=>clearTimeout(getUsersInput);
  },[searchTerm])

  function slug(string){
    return string.toLowerCase()
        .replace(/ /g,'-')
        .replace(/[^\w-]+/g,'');
}
  return (
    <ChakraProvider>
      <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
        <BrowserRouter>
          <GlobalStyles />

          <Box bg={ theme ==='light' ? '#333' :'#fff'}
            borderBottom={theme === 'light' ? 'solid 1px #333':'solid 1px #fff'}
            color={theme ==='light'?'#fff':"#333"} px={4}
           >
            <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
              <HStack spacing={16} alignItems={'left'}>
                <HStack as={'nav'} spacing={6} display={{ base: 'none', md: 'flex' }}>
                  <ChakraLink as={RouterLink} to="/">
                    Home
                  </ChakraLink>
                  <ChakraLink as={RouterLink} to="/contact">
                    Contact
                  </ChakraLink>
                </HStack>
                </HStack>
                <Search2Icon onClick={onOpen} />
                <Flex alignItems={'center'}>
                  <Stack direction={'row'} spacing={7}>
                    <Switch isChecked={!isSwitchOn} onChange={changeThemeSwitch}>
                      {isSwitchOn ? <MoonIcon mr="5" /> : <SunIcon mr="5" />}
                    </Switch>
                  </Stack>
                </Flex>
            </Flex>
          </Box>
          <Modal
            initialFocusRef={initialRef}
            isCentered
            onClose={onClose}
            isOpen={isOpen}
            motionPreset='slideInBottom'
            bg="blue"
          >
            <ModalOverlay
              bg="none"
              backgroundFilter='auto'
              backgroundInvert='80%'
              backdropBlur='2px'
            >
            <ModalContent>
              <ModalHeader 
                  color={'#333'}
                >
                  Type keyword to search

                </ModalHeader>
                <ModalBody pd={6}>
                  <FormControl mt={4}>
                      <Input placeholder=''
                        ref={initialRef}
                        color={'#333'}
                        onChange={(e)=>setSearchTerm(e.target.value)}
                      />
                  </FormControl>
                  <br></br>
                  {searchResultitems && 
                  <UnorderedList>
                    {searchResultitems.map(function(item){
                      return (<Link to={slug(item.title)} key={item.id} state={{id:item.id}}><ListItem key={item.id}>{item.title}</ListItem></Link>)
                    })}
                  </UnorderedList>}
                </ModalBody>
                <ModalFooter>
                  <Button onClick={onClose}> Cancel</Button>
                </ModalFooter>
            </ModalContent>
              
            </ModalOverlay>
          </Modal>
          <div className='App'>
            <Container maxW="1200px" marginTop={"50px"}>
              <Routes>
                <Route path='/' element={<Main/>}/>
                <Route path='/contact' element={<Contact/>}/>
                <Route path=':slug' element={<SinglePost/>}/>
                <Route path='/404' element={<NotFOund/>}/>

              </Routes>
            </Container>
          </div>
        </BrowserRouter>
      </ThemeProvider>
    </ChakraProvider>
  );
}

export default App;
