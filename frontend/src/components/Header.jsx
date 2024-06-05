import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Avatar,
    Box,
    useToast,
    Drawer,
    DrawerBody,
    DrawerOverlay,
    DrawerContent,
    useBreakpointValue,
    useDisclosure,
    DrawerHeader,
    Spinner,
} from '@chakra-ui/react'

import { HamburgerIcon } from '@chakra-ui/icons'

import { useUser } from '../context/UserContext'
import PlayListItem from './PlayListItem'

const Header = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const toast = useToast();
    const location = useLocation();
    const [allPlayLists, setAllPlayLists] = useState([])
    const [drawerLoading, setDrawerLoading] = useState(false)
    const [isEmpty, setIsEmpty] = useState(false);

    const { isOpen, onOpen, onClose } = useDisclosure()
    const showDrawer = useBreakpointValue({ base: true, md: false });

    const { setResultSet, user, setUser, setMyPlayList, setHomePageLoading } = useUser()

    useEffect(() => {
        const fetchAllPlaylists = async () => {
            try {
                setDrawerLoading(true);
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
                setDrawerLoading(false)
            }
        }
        if (isOpen && user) {
            fetchAllPlaylists();
        }
    }, [isOpen]);

    useEffect(() => {
        const url = new URLSearchParams(location.search)
        const movieName = url.get('movie-name')
        console.log(movieName);
        setSearch(movieName)
        searchMovie(movieName)
    }, [])

    useEffect(() => {
        setIsEmpty(false)
    }, [location.pathname !== "/search-result"])

    const handleSearchInputChange = (e) => {
        setSearch(e.target.value);
        setIsEmpty(e.target.value.trim() === "");
    };

    const searchMovie = async (search) => {
        if (search && search.trim() !== "" && search.length > 0) {
            setIsEmpty(false)
            setResultSet(null);
            setHomePageLoading(true)
            navigate(`/search-result?movie-name=${search}`)
            try {
                const response = await fetch(`https://filmfolio-backend.onrender.com/api/movie/search?keyword=${search}`, {
                    method: "GET"
                })

                const data = await response.json()
                if (response.ok) { setResultSet(data.result) }
                else {
                    toast({
                        title: data.message,
                        description: "Please try again",
                        status: "warning",
                        duration: 3000,
                        isCloseable: true,
                        position: 'top'
                    });
                }
            } catch (error) {
                if (!search) {
                    toast({
                        title: error.message,
                        status: "error",
                        duration: 3000,
                        isCloseable: true,
                        position: 'bottom'
                    });
                }
            }
            finally {
                setHomePageLoading(false)
            }
        } else {
            setIsEmpty(true)
        }
    }

    const signout = () => {
        localStorage.removeItem('currentUser');
        setUser();
        localStorage.removeItem('currentUserToken');
        setSearch("")
        setIsEmpty(false)
        setAllPlayLists([])
        setResultSet(null)
        navigate('/');
    }

    const handleFunction = (playlist) => {
        setHomePageLoading(true);
        setMyPlayList(playlist)
        navigate(`/my-playlist?playlist-name=${playlist.name}`)
        onClose();
    }

    const handleEnterBtn = (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            if (search && search.length > 0) {
                searchMovie(search);
            }
            else {
                setIsEmpty(true);
            }
        }
    }

    return (
        <>
            <nav className='navbar navbar-expand-sm navbar-light bg-body-tertiary fixed-top'>
                <Box className='nav-box' ms='3' me='3'>
                    <div className='d-flex justify-content-center align-items-center'>
                        <HamburgerIcon aria-label='Open Menu' boxSize={6} _hover={{ cursor: "pointer" }} onClick={onOpen} />
                        {(showDrawer || location.pathname !== '/') ?
                            (
                                <>
                                    <Drawer placement='left' onClose={onClose} isOpen={isOpen} size='xs'>
                                        <DrawerOverlay />

                                        <DrawerContent>
                                            {user &&
                                                <DrawerHeader className='bg-primary text-white'>
                                                    <span><i className="fa-solid fa-list-check"></i>&nbsp;My Playlists</span>
                                                </DrawerHeader>
                                            }
                                            <DrawerBody>
                                                {!user && <div>
                                                    <ul className="navbar-nav ms-auto">
                                                        <li className="nav-item mb-3">
                                                            <Link onClick={onClose} data-mdb-ripple-init className="btn btn-link px-3 me-2" to="/" style={{ width: "100%" }}>Login</Link>
                                                        </li>
                                                        <li className="nav-item mb-3">
                                                            <Link onClick={onClose} data-mdb-ripple-init to="/signup" className="btn btn-primary me-3"
                                                                style={{ whiteSpace: "nowrap", width: '100%' }}>Sign up for free</Link>
                                                        </li>
                                                    </ul>
                                                </div>}
                                                {user &&
                                                    <div>
                                                        {drawerLoading &&
                                                            <span className='d-flex justify-content-center mt-3'><Spinner size='xl' speed='0.40s' emptyColor='gray.200' thickness='4px' color='blue.500' /></span>
                                                        }
                                                        {allPlayLists.length > 0 ?
                                                            (
                                                                allPlayLists.map((playlist, index) => (
                                                                    <PlayListItem key={index} playlist={playlist} handleFunction={() => handleFunction(playlist)} />
                                                                ))
                                                            ) : (
                                                                <>
                                                                    {!drawerLoading &&
                                                                        <h5 className='text-center'>No playlist created</h5>
                                                                    }
                                                                </>
                                                            )
                                                        }
                                                    </div>
                                                }
                                            </DrawerBody>
                                        </DrawerContent>
                                    </Drawer>
                                </>
                            )
                            : (<></>)}

                        <Link className="navbar-brand ms-3 me-2" to="/homepage">
                            <img src="https://flowbite.com/docs/images/logo.svg" height="25" alt="FilmPholio Logo"
                                style={{ marginTop: "-1px", cursor: "pointer" }} />
                            <span className="align-items-center fs-auto fw-bolder text-black brand">FilmPholio</span>
                        </Link>



                    </div>

                    {/* Section 2 */}
                    <div className='d-flex justify-content-center align-items-center'>
                        {user && <form className="input-group" onKeyDown={handleEnterBtn}>
                            <input
                                type="search" className={`form-control rounded ${isEmpty ? 'border-danger border-3' : ''}`} placeholder="Search" aria-label="Search"
                                aria-describedby="search-addon"
                                value={search}
                                onChange={handleSearchInputChange}
                            />
                            <span className="input-group-text border-0" id="search-addon">
                                <i className="fas fa-search" style={{ cursor: "pointer" }} onClick={() => searchMovie(search)}></i>
                            </span>
                        </form>}
                    </div>

                    {/* Section 3 */}
                    <div className='d-flex justify-content-center align-items-center'>
                        {(!user && !showDrawer) && <>
                            <ul className="navbar-nav ms-auto">
                                <li className="nav-item">
                                    <Link data-mdb-ripple-init className="btn btn-link px-3 me-2" to="/">Login</Link>
                                </li>
                                <li className="nav-item">
                                    <Link data-mdb-ripple-init to="/signup" className="btn btn-primary me-3"
                                        style={{ whiteSpace: "nowrap" }}>Sign up for free</Link>
                                </li>
                            </ul>
                        </>}


                        {user &&
                            <Menu>
                                <MenuButton>
                                    <Avatar size='sm' src={user ? user.profilePicture : "https://bit.ly/broken-link"} />
                                </MenuButton>
                                <MenuList>
                                    <MenuItem _hover={{ backgroundColor: "#3b71ca", color: "white" }} isDisabled>{`${user.firstname} ${user.lastname}`}</MenuItem>
                                    <MenuItem _hover={{ backgroundColor: "#3b71ca", color: "white" }} isDisabled>{`${user.email}`}</MenuItem>
                                    <MenuItem _hover={{ backgroundColor: "#3b71ca", color: "white" }} onClick={signout}>Sign out</MenuItem>
                                </MenuList>
                            </Menu>
                        }

                    </div>
                </Box>
            </nav>
        </>
    )
}

export default Header
