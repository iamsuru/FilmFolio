import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


const DetailContext = createContext();

const UserProvider = ({ children }) => {
    const [homePageLoading, setHomePageLoading] = useState(false);
    const [token, setToken] = useState()
    const [resultSet, setResultSet] = useState(null);
    const [user, setUser] = useState()

    const [myPlayList, setMyPlayList] = useState();

    const navigate = useNavigate();

    useEffect(() => {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'))
        setUser(currentUser)
    }, [navigate])

    return (
        <DetailContext.Provider value={{ homePageLoading, setHomePageLoading, token, setToken, resultSet, setResultSet, user, setUser, myPlayList, setMyPlayList }}>
            {children}
        </DetailContext.Provider>
    );
};

export const useUser = () => useContext(DetailContext);

export default UserProvider;