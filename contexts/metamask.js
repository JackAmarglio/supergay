import React, { 
    createContext, 
    useState, 
    useContext, 
    useEffect 
} from 'react';
import { ethers } from "ethers";

const MetamaskContext = createContext({}); 

export const MetamaskProvider = ({ children }) => {
    const [selectedAddress, setSelectedAddress] = useState(null)

    const connectToMetamask = async () => {
        try {
            if(!window.ethereum)
                throw new Error('Metamask not installed.')
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const accounts = await provider.send("eth_requestAccounts", []);
            setSelectedAddress(accounts[0]);
            return {
                status : true,
                message : 'Connected.'
            }
        } catch (err) {
            return {
                status : false,
                message: err.message
            }
        }
    }
    const disconnectMetamask = async () => {
        try {
            setSelectedAddress(null);
            return {
                status: true,
                message : 'Disconnected.'
            }
        } catch (err) {
            return {
                status : false,
                message : err.message
            }
        }
    }
    return (
        <MetamaskContext.Provider value={{ 
            selectedAddress,
            connectToMetamask,
            disconnectMetamask
        }}>
            {children}
        </MetamaskContext.Provider>
    )
}

export const useMetamask = () => useContext(MetamaskContext);