import PropTypes from "prop-types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  useMemo
} from "react";

const DataContext = createContext({});

export const api = {
  loadData: async () => {
    const json = await fetch("/events.json");
    return json.json();
  },
};

export const DataProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [last, setLast] = useState(null); // créé pour gérer l'événement le plus récent

  const getData = useCallback(async () => {
    try {
      const loadedData = await api.loadData();
      setData(loadedData);

      // Calculer l'événement le plus récent si les données sont disponibles et contiennent des événements
      if (loadedData && loadedData.events && loadedData.events.length > 0) {
        const latestEvent = loadedData.events.reduce((a, b) => new Date(a.date) > new Date(b.date) ? a : b);
        setLast(latestEvent);
      }

    } catch (err) { 
      setError(err);
    }
  }, []);
 
  

  useEffect(() => {
    if (!data) getData();
  }, [data]); // Ajout de dépendance pour éviter les appels inutiles

  const contextValue = useMemo(() => ({ data, error, last }), [data, error, last]); // une eslint alert demande useMemo

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
};

DataProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export const useData = () => useContext(DataContext);

export default DataContext;
