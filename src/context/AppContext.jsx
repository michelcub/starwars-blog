import { useContext, createContext, useEffect } from "react";
import { useState } from "react";

import getCharacters from "../services/characters";
import getCharactersDetails from "../services/charactersDetails";
import getPlanets from "../services/planets";
import getPlanetsDetails from "../services/planetsDetails";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [favoritesList, setFavoritesList] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [charactersDetails, setCharactersDetails] = useState([]);
  const [planets, setPlanets] = useState([]);
  const [planetsDetails, setPlanetsDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => setFavoritesList([]), []);

  const handleAddFavoritesList = (e) => {
    const elementId = e.target.id;
    const newList = [...favoritesList, elementId];
    setFavoritesList(newList);
  };

  useEffect(() => {
    getCharacters(setCharacters);
  }, []);

  useEffect(() => {
    const getAllCharDetails = async () => {
      const orderedDetails = await Promise.all(
        characters.map(async (character) => {
          return await getCharactersDetails(character.uid);
        })
      );

      orderedDetails.sort((a, b) => a.uid - b.uid);
      setCharactersDetails(orderedDetails);
    };

    getAllCharDetails();
  }, [characters]);

  useEffect(() => {
    getPlanets(setPlanets);
  }, []);

  useEffect(() => {
    const getAllPlanetsDetails = async () => {
      const planetsDetails = await Promise.all(
        planets.map(async (planet) => {
          return await getPlanetsDetails(planet.uid);
        })
      );

      const orderedDetails = planetsDetails.sort((a, b) => a.uid - b.uid);
      setPlanetsDetails(orderedDetails);
    };

    getAllPlanetsDetails();
  }, [planets]);

  //USE EFFECT PARA CONTROLAR LOADING (ESTO ES MEJORABLE, ¿NO?)
  useEffect(() => {
    if (
      charactersDetails.length > 0 &&
      characters.length === charactersDetails.length &&
      planetsDetails.length > 0 &&
      planets.length === planetsDetails.length
    ) {
      setLoading(false);
    }
  }, [characters, charactersDetails, planets, planetsDetails]);

  const handleDeleteFavorites = (e) => {
    const elementId = e.target.id;
    const newList = favoritesList.filter(
      (item) => item.id != parseInt(elementId)
    );
    setFavoritesList([...newList]);
  };

  const actions = {
    handleDeleteFavorites,
    handleAddFavoritesList,
  };

  const store = {
    favoritesList,
    characters,
    charactersDetails,
    planets,
    planetsDetails,
    loading,
  };

  return (
    <AppContext.Provider value={{ actions, store }}>
      {children}
    </AppContext.Provider>
  );
};

const useAppContext = () => useContext(AppContext);

export default useAppContext;
