import { useState, useEffect } from 'react';

export default function useFetchData(url) {
  const [response, setResponse] = useState({
    data: null,
    error: false,
    loading: 0,
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const filmData = await fetch(url).then((resp) => resp.json());

        setResponse((prevResponse) => ({
          ...prevResponse,
          loading: 1,
        }));

        const homeworldUrls = new Set();
        const characterPromises = filmData.characters.map(
          async (url) =>
            await fetch(url)
              .then((resp) => resp.json())
              .then((character) => {
                homeworldUrls.add(character.homeworld);
                return character;
              }),
        );

        const characterData = await Promise.allSettled(
          characterPromises,
        ).then((resolved) => resolved.map((entry) => entry.value));

        setResponse((prevResponse) => ({
          ...prevResponse,
          loading: 2,
        }));

        const homeworldUrlArray = [...homeworldUrls];

        const homeworldPromises = homeworldUrlArray.map(
          async (url) => await fetch(url).then((resp) => resp.json()),
        );

        const homeworldResolved = await Promise.allSettled(
          homeworldPromises,
        );

        let totalPopulation = 0;
        const homeworldData = homeworldUrlArray.reduce(
          (result, key, i) => {
            const world = homeworldResolved[i].value;
            const worldPopulation = parseInt(world.population, 10);

            if (!isNaN(worldPopulation)) {
              world.population = worldPopulation.toLocaleString();
              totalPopulation += worldPopulation;
            }
            return { ...result, [key]: world };
          },
          {},
        );

        setResponse({
          data: {
            characters: characterData,
            homeworld: homeworldData,
            totalPopulation,
          },
          error: false,
          loading: 3,
        });
      } catch (error) {
        setResponse({
          data: 'Network error',
          error: true,
          loading: 3,
        });
      }
    }
    fetchData();
  }, [url]);

  return response;
}
