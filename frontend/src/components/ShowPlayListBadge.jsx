import { Button } from '@chakra-ui/react'
import React from 'react'

const ShowPlayListBadge = ({ playlist, handleFunction }) => {
    return (
        <Button
            px={2}
            py={1}
            borderRadius="lg"
            m={1}
            mb={2}
            fontSize={12}
            className='btn btn-outline-primary'
            cursor='pointer'
            onClick={handleFunction}
            _hover={{ backgroundColor: "#3b71ca", color: 'white' }}
        >
            {playlist.name}
        </Button>
    )
}

export default ShowPlayListBadge