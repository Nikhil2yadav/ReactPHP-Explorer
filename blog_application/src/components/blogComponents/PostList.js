import { Box, Badge } from "@chakra-ui/react"
import {Link} from "react-router-dom"


export default function PostList({id,title, content, user_id, image }) {
    
    function slug(string){
        return string.toLowerCase()
            .replace(/ /g,'-')
            .replace(/[^\w-]+/g,'');
    }

  return (
    
    <Box maxW='sm' borderWidth='1px' borderRadius='lg' overflow='hidden' m={15}>
    <Link to={slug(title)} state={{id}}>
        <img src={image} alt={title}/>
        <Box p={6}>
            <Box slug={title}
                mt='1'
                fontWeight='semibold'
                as="h4"
                lineHeight='tight'>
                {title}
            </Box>
            <hr/>
            <Box display='flex' alignItems='baseline'>
                <Badge borderRadius='full' px='2'>
                    
                    User:
                </Badge>
            <Box
                color='gray.500'
                fontWeight='semibold'
                fontSize='xs'
                ml='2'>
                    {user_id}
                    
                </Box>
            </Box>
        </Box>
    </Link>
      
    </Box>
  )
}
