import React from 'react'
import { Card, Text, CardBody, Image, Stack, Box, Button } from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import PlayListModal from './PlayListModal';
const VideoPreview = ({ item }) => {
    return (
        <Box p={2}>
            <Card
                direction={{ base: 'column', sm: 'row' }}
                overflow='hidden'
                variant='outline'
            >
                <Image
                    objectFit='cover'
                    maxW={{ base: '100%', sm: '200px' }}
                    src={`https://image.tmdb.org/t/p/w200${item.poster_path}`}
                    alt={item.title}
                />
                <Stack>
                    <CardBody>
                        <Text fontSize='lg' fontWeight='bold'>Title: {item.title}</Text>
                        <Text fontSize='medium'><b>Overview:</b> {item.overview}</Text>
                        <Text fontSize='sm'><strong>Release Date:</strong> {item.release_date}</Text>
                        <Text fontSize='sm'><strong>Rating:</strong> {item.vote_average}</Text>
                        <Text fontSize='sm'><strong>Language:</strong> {item.original_language}</Text>
                        <PlayListModal item={item}>
                            <Button size='sm' leftIcon={<AddIcon />} className='bg-primary' color='white'>Add to Playlist</Button>
                        </PlayListModal>
                    </CardBody>
                </Stack>
            </Card>

        </Box>
    )
};

export default VideoPreview;