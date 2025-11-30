import { createContext, useState, useEffect } from "react";

export const coinContext = createContext();

const CoinContextProvider = (props) => {

    const [allCoin, setAllCoin] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currency, setCurrency] = useState({
        name: "usd",
        symbol: "$"
    });

    const fetchAllCoin = async () => {
        setLoading(true);
        const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency.name}&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h`;
        
        try {
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (Array.isArray(data)) {
                setAllCoin(data);
            } else {
                console.error('API returned non-array data:', data);
                setAllCoin([]);
            }
        } catch (error) {
            console.error('Error fetching coins:', error);
            setAllCoin([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchAllCoin();
    }, [currency])

    const contextValue = {
        allCoin, currency, setCurrency, loading
    }

    return(
        <coinContext.Provider value={contextValue}>
            {props.children}
        </coinContext.Provider>
    )
}

export default CoinContextProvider;