import { useEffect, useState, useRef } from 'react';
import { HashRouter, Routes, Route} from 'react-router-dom';
import './App.css'
import PokeHome from './PokeHome';
import PokemonList from './pages/PokemonList';
import Navbar from './components/Navbar';
import PokemonDetail from './pages/PokemonDetail';
import type { Pokemon, PokemonDetailType, OptionType, MyCollection } from './interfaces';

function App() {
  const [pokeList, setPokeList] = useState<Pokemon[]>([]);
  const pokeListRef = useRef<Pokemon[]>(pokeList);
  const [abilityFilters, setAbilityFilters] = useState<OptionType[]>([]);
  const [typeFilters, setTypeFilters] = useState<OptionType[]>([]);
  const [loading, setLoading] = useState(false);
  const [allPokemonsLoaded, setAllPokemonsLoaded] = useState(false);
  const [allPokemonDetailsLoaded, setAllPokemonDetailsLoaded] = useState(false);
  const itemsPerPage = 10;
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  const [searchStr, setSearchStr] = useState("");
  const [searchStrCollection, setSearchStrCollection] = useState("");
  const [activePage, setActivePage] = useState(1);
  const [activePageCollection, setActivePageCollection] = useState(1);
  const [abilityFilter, setAbilityFilter] = useState<string>("");
  const [abilityFilterCollection, setAbilityFilterCollection] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [typeFilterCollection, setTypeFilterCollection] = useState<string>("");
  const [sortType, setSortType] = useState<"none" | "name" | "xp" | "weight" | "height">("none");
  const [nameSort, setNameSort] = useState<"none" | "asc" | "desc">("none");
  const [xpSort, setXpSort] = useState<"none" | "asc" | "desc">("none");
  const [heightSort, setHeightSort] = useState<"none" | "asc" | "desc">("none");
  const [weightSort, setWeightSort] = useState<"none" | "asc" | "desc">("none");
  const [myCollection, setMyCollection] = useState<MyCollection>({collection: [], binderInfo: { noOfCols: 0, noOfRows: 0, noOfPages: 0}});
  const [paginateByPrimaryType, setPaginateByPrimaryType] = useState(false);

  useEffect(() => {
    console.log('my collection:', myCollection);
    console.log('pokeList:', pokeList);
  },[myCollection, pokeList])

  useEffect(() => {
    pokeListRef.current = pokeList;
  },[pokeList]);

  useEffect(() => {
      let pokemonCount = 0;
      const listingEndpoint = `https://pokeapi.co/api/v2/pokemon?offset=0&limit=${itemsPerPage}`;
      const fetchPokemon = async () => {
        // console.log('fetching pokemons, localStorage: ', localStorage);
        let data = null;
        // let count = 0;
        setLoading(true);
        try {
          const response = await fetch(listingEndpoint);
          if (!response.ok) {
            throw new Error(`Can't  fetch the initial ${itemsPerPage} Pokemons`);
          }
          data = await response.json();
          if (data.results) {
            setPokeList(data.results);
          }
          if (data.count) {
            // console.log("count:", data.count);
            pokemonCount = data.count;
            localStorage.setItem('pokemon-list-count', data.count);
          }
          // console.log(data.results);
        } catch(err) {
          console.error(err);
        } finally {
          setLoading(false);
        }

        try {
          const response2 = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${itemsPerPage}&limit=${pokemonCount-itemsPerPage}`);
          if (!response2.ok) {
            throw new Error("Can't fetch the remaining Pokemons");
          }
          const data2 = await response2.json();
          if (data2.results) {
            const fullList = [...data.results, ...data2.results];
            setPokeList(fullList);
            localStorage.setItem('pokeList', JSON.stringify(fullList));
          }
        } catch(err) {
          console.error(err);
        } finally {
          setAllPokemonsLoaded(true);

        }
      }

      const itemCount = Number(localStorage.getItem('pokemon-list-count'));
      const savedPokeListRaw = localStorage.getItem('pokeList');
      const savedPokeList = savedPokeListRaw  ? JSON.parse(savedPokeListRaw) : [];

      const savedAllPokeDetailsLoadedRaw = localStorage.getItem('all-poke-details-loaded');
      if (savedAllPokeDetailsLoadedRaw === "true") {
        setAllPokemonDetailsLoaded(true);
      }
      if (savedPokeListRaw && itemCount && savedAllPokeDetailsLoadedRaw === "true") {
        setAllPokemonsLoaded(true);
        setAllPokemonDetailsLoaded(true);
        setPokeList(savedPokeList);
      } else {
        fetchPokemon();
      }

      const savedAbilityFilter = localStorage.getItem('abilityFilter');
      if (savedAbilityFilter) {
        setAbilityFilter(savedAbilityFilter);
      }

      const savedAbilityFilterCollection = localStorage.getItem('abilityFilterCollection');
      if (savedAbilityFilterCollection) {
        setAbilityFilter(savedAbilityFilterCollection);
      }

      const savedTypeFilter = localStorage.getItem('typeFilter');
      if (savedTypeFilter) {
        setTypeFilter(savedTypeFilter);
      }

      const savedTypeFilterCollection = localStorage.getItem('typeFilterCollection');
      if (savedTypeFilterCollection) {
        setTypeFilter(savedTypeFilterCollection);
      }

      const savedCollectionRaw = localStorage.getItem('myCollection');
      const savedCollection = savedCollectionRaw ? JSON.parse(savedCollectionRaw) : {collection: [], binderInfo: {noOfCols: 0, noOfRows: 0, noOfPages: 0}};

      if (savedCollectionRaw) setMyCollection(savedCollection);

    },[]);

    useEffect(() => {
      const fetchPokeDetail = async (url: string) => {
        try {
          const res = await fetch(url);
            if (!res.ok) {
              console.log(`Can't fetch ${url}`);
            }
            const data = await res.json() as PokemonDetailType;
            return { abilities: data.abilities,
                     base_experience: data.base_experience,
                     height: data.height,
                     name: data.name,
                     types: [ ...data.types.map((t, index) => {
                      return {type: {name: t.type.name, primary: index === 0 }};
                    })],
                     weight: data.weight
            }
          } catch (err) {
            console.error(err);
            return { abilities: [],
                     base_experience: "",
                     height: "",
                     name: "",
                     types: [{type: {name: "", primary: false}}],
                     weight: ""
            };
          }
      }

      const fetchAllPokemonsDetail = async() => {
        if (!allPokemonsLoaded) return;
        const batchSize = 50;
        const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

        const updatedPokeList = [...pokeListRef.current];
        for (let i = 0; i < pokeListRef.current.length; i+= batchSize) {
          const batch = pokeListRef.current.slice(i, i + batchSize);
          const detailsArray = await Promise.all(
            batch.map((poke) => fetchPokeDetail(poke.url))
          );

          for (let j = 0; j < batch.length; j++) {
            updatedPokeList[i + j] = { ...updatedPokeList[i + j], detail: detailsArray[j]};
          }
          setPokeList([...updatedPokeList]);
          localStorage.setItem('pokeList', JSON.stringify(updatedPokeList));
          if (i + batchSize < pokeListRef.current.length) await delay(1000);
        }
        setAllPokemonDetailsLoaded(true);
        localStorage.setItem('all-poke-details-loaded', "true");
      }

      if (!allPokemonDetailsLoaded) {
        fetchAllPokemonsDetail();
      }
    },[allPokemonsLoaded, allPokemonDetailsLoaded])

    // get theme from local storage
    useEffect(() => {
      // const savedTheme = localStorage.getItem('theme');
      const savedSearch = localStorage.getItem('searchStr');
      if (savedSearch) {
        setSearchStr(savedSearch);
      }

      const savedSearchCollection = localStorage.getItem('searchStrCollection');
      if (savedSearchCollection) {
        setSearchStr(savedSearchCollection);
      }
      const savedActivePage = Number(localStorage.getItem('activePage'));
      // console.log('app use effect', activePage, savedActivePage);
      if (savedActivePage) {
        setActivePage(savedActivePage);
      } else {
        setActivePage(1);
        localStorage.setItem('activePage', "1");
      }

      const savedActivePageCollection = Number(localStorage.getItem('activePageCollection'));
      // console.log('app use effect', activePage, savedActivePage);
      if (savedActivePageCollection) {
        setActivePage(savedActivePageCollection);
      } else {
        setActivePageCollection(1);
        localStorage.setItem('activePageCollection', "1");
      }
    },[])

  return (
    <div className={`app-container ${theme}`}>
      <div className="content-container">
      <HashRouter>
        <Navbar {...{theme, setTheme, pokeList, searchStr, setSearchStr, setActivePage, abilityFilter, setAbilityFilter, typeFilter, setTypeFilter, sortType, setSortType, nameSort, setNameSort, xpSort, setXpSort, heightSort, setHeightSort, weightSort, setWeightSort, abilityFilters, typeFilters, searchStrCollection, setSearchStrCollection, setActivePageCollection, abilityFilterCollection, setAbilityFilterCollection, typeFilterCollection, setTypeFilterCollection, setAbilityFilters, setTypeFilters, paginateByPrimaryType, setPaginateByPrimaryType }}/>
        <Routes>
          <Route path="/" element={<PokeHome />} />
          {/* <Route path="/my-collection" element={<MyPokemonCollection />}/> */}
          <Route path="/my-collection" element={<PokemonList { ...{ isMyCollectionPage:true, pokeList, setPokeList, loading, theme, allPokemonDetailsLoaded, itemsPerPage, searchStr, searchStrCollection, activePage, setActivePage, activePageCollection, setActivePageCollection, abilityFilter, abilityFilterCollection, typeFilter, typeFilterCollection, abilityFilters, typeFilters, setAbilityFilters, setTypeFilters, sortType, nameSort, xpSort, heightSort, weightSort, myCollection, setMyCollection, paginateByPrimaryType } }/>} />
          <Route path="/pokemon-list" element={<PokemonList { ...{ pokeList, setPokeList, loading, theme, allPokemonDetailsLoaded, itemsPerPage, searchStr, searchStrCollection, activePage, setActivePage, activePageCollection, setActivePageCollection, abilityFilter, abilityFilterCollection, typeFilter, typeFilterCollection, abilityFilters, typeFilters, setAbilityFilters, setTypeFilters, sortType, nameSort, xpSort, heightSort, weightSort, myCollection, setMyCollection, paginateByPrimaryType } }/>} />
          <Route path="/pokemon/:id" 
                element={
                <PokemonDetail
                {...{ pokeList, setPokeList, theme, myCollection, setMyCollection }} />} />
        </Routes>
      </HashRouter>
      </div>
    </div>
  )
}

export default App;
