import React, { 
    createContext, 
    useState, 
    useContext, 
    useEffect 
} from 'react';
import api from 'services/api';

const AuthContext = createContext({}); 
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [authenticated, setAuthenticated] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadUserFromCookies() {
            try {
                const { data: rus } = await api.get('/auth/logged');
                if (rus) {
                    setAuthenticated(rus.success);
                    setUser(rus.user);
                }
                setLoading(false)
            } catch (err) {
                setAuthenticated(false);
                setLoading(false)
            }
        }
        loadUserFromCookies()
    }, [])

    const login = (username, password) => {
        return new Promise( async (resolve) => {
            try {
                const { data: request } = await api.post('/auth/login', {
                    username,
                    password
                });
                if(request.success) {
                    localStorage.setItem('publictoken', request.publicKey);
                    localStorage.setItem('authenticationkey', request.authKey);
                    resolve({
                        status : true,
                        message : request.message
                    });
                } else {
                    throw new Error(request.message);
                }
            } catch (err) {
                resolve({
                    status : false,
                    message : err.message
                });
            }
        });
    }

    const logout = () => {
        return new Promise( async (resolve) => {
            try {
                const { data : request } = await api.post('/auth/logout');
                localStorage.removeItem('publictoken')
                localStorage.removeItem('authenticationkey')
                if(request.success) {
                    resolve({
                        status : true,
                        message : request.message
                    });
                } else {
                    throw new Error(request.message);
                }
            } catch (err) {
                resolve({
                    status : false,
                    message : err.message
                })
            }
        })
    }

    return (
        <AuthContext.Provider value={{ 
            login, 
            logout, 
            isAuthenticated: authenticated, 
            user, 
            loading
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);