import React, { useEffect, useState } from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Button,
    FormControl,
    Input,
    FormLabel,
    useToast,
    Spinner,
} from '@chakra-ui/react'
import { BeatLoader } from 'react-spinners'
import { useUser } from '../context/UserContext'
import ShowPlayListBadge from './ShowPlayListBadge'

const PlayListModal = ({ item, children }) => {
    const toast = useToast()
    const { isOpen, onOpen, onClose } = useDisclosure()

    const [playListName, setPlayListName] = useState('');
    const [toAddPlayList, setToAddPlayList] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loading2, setLoading2] = useState(false);

    const [allPlayLists, setAllPlayLists] = useState([])

    const { user } = useUser()

    useEffect(() => {
        if (item) {
            setToAddPlayList(item);
        }
    }, []);

    const createAndAddPlaylist = async () => {
        try {
            setLoading(true)
            const response = await fetch('https://filmfolio-backend.onrender.com/api/user/playlist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ playListName: playListName.trim(), file: toAddPlayList, uid: user.uid, privacy: false })
            })

            const data = await response.json();
            if (response.status === 201) {
                toast({
                    description: data.message,
                    status: 'success',
                    duration: "2000",
                    isClosable: false,
                    position: 'top'
                })
                setAllPlayLists([])
                fetchAllPlaylists()
            } else {
                toast({
                    description: data.message,
                    status: 'error',
                    duration: "2000",
                    isClosable: false,
                    position: 'top'
                })
            }

        } catch (error) {
            toast({
                description: error.message,
                status: 'error',
                duration: "2000",
                isClosable: false,
                position: 'top'
            })
        }
        finally {
            setLoading(false)
        }
    }

    const fetchAllPlaylists = async () => {
        setLoading2(true)
        try {
            const response = await fetch(`https://filmfolio-backend.onrender.com/api/user/playlist?uid=${user.uid}`);
            const data = await response.json();
            if (response.ok) {
                setAllPlayLists(data.playlists)
            } else {
                console.log(data.message);
            }
        } catch (error) {
            console.log(error.message);
        }
        finally {
            setLoading2(false)
        }
    }

    const updatePlaylist = async (name) => {
        setLoading2(true);
        try {
            const response = await fetch('https://filmfolio-backend.onrender.com/api/user/playlist', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ playListName: name, file: toAddPlayList, uid: user.uid })
            })

            const data = await response.json();
            if (response.status === 200) {
                toast({
                    description: data.message,
                    status: 'success',
                    duration: "2000",
                    isClosable: false,
                    position: 'top'
                })
                fetchAllPlaylists()
            } else {
                toast({
                    description: data.message,
                    status: 'error',
                    duration: "2000",
                    isClosable: false,
                    position: 'top'
                })
            }

        } catch (error) {
            toast({
                description: error.message,
                status: 'error',
                duration: "2000",
                isClosable: false,
                position: 'top'
            })
        } finally {
            setLoading2(false);
            onClose()
        }
    }

    useEffect(() => {
        if (isOpen) {
            fetchAllPlaylists();
        }
    }, [isOpen]);

    return (
        <>
            <span onClick={onOpen}>{children}</span>
            <Modal isCentered isOpen={isOpen} onClose={onClose}>
                <ModalOverlay
                    bg='none'
                    backdropFilter='auto'
                    backdropInvert='80%'
                    backdropBlur='2px'
                />
                <ModalContent>
                    <ModalHeader textAlign='center'>Add to Playlist</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <div className='d-flex'>
                            <FormControl variant="floating" isRequired className='me-2'>
                                <Input
                                    placeholder=" "
                                    type='text'
                                    value={playListName}
                                    onChange={(e) => setPlayListName(e.target.value)}
                                />
                                <FormLabel style={{ fontWeight: "400" }} className='text-primary'>Create New Playlist</FormLabel>
                            </FormControl>
                            <Button
                                isLoading={loading}
                                spinner={<BeatLoader size={8} color='white' />}
                                className='bg-primary mb-4'
                                type='submit'
                                color='white'
                                onClick={createAndAddPlaylist}
                            >
                                &nbsp;Create & Add&nbsp;
                            </Button>
                        </div>
                        <div className='d-flex flex-column justify-content-center align-items-center'>
                            <h5 className='fw-bold'>My Playlists</h5>
                            <div>
                                {allPlayLists.length > 0 ?
                                    (
                                        allPlayLists.map((playlist, index) => (
                                            <ShowPlayListBadge key={index} playlist={playlist} handleFunction={() => updatePlaylist(playlist.name)} />
                                        ))
                                    ) : (
                                        <>Nothing to show</>
                                    )
                                }
                            </div>
                            {loading2 && <Spinner size='lg' mt='3' speed='0.40s'
                                emptyColor='gray.200' thickness='4px' className='text-primary' />}
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={onClose}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default PlayListModal