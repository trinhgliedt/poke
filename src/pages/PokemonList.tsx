import "./PokemonList.css";
import { useEffect, useMemo } from "react";
import type { Ability, ListProps, Pokemon, Type } from "../interfaces";
import Paginations from "../components/Paginations";
import PokeCard from "../components/PokeCard";
import { Link } from "react-router-dom";


export default function PokemonList( props: ListProps) {
    const { isMyCollectionPage, pokeList, setPokeList, loading, theme, allPokemonDetailsLoaded, itemsPerPage, searchStr, searchStrCollection, activePage, setActivePage, activePageCollection, setActivePageCollection, abilityFilter, abilityFilterCollection, typeFilter, typeFilterCollection, setAbilityFilters, setTypeFilters, sortType, nameSort, xpSort, heightSort, weightSort, myCollection, setMyCollection} = props;

    useEffect(() => {
        console.log('rendering poke list: myCollection,:', myCollection.collection.length);
    },[myCollection]);

    function extractId(pokeURL: string) {
        const urlParts = pokeURL.split("/");
        const pokeId = urlParts[urlParts.length - 2];
        return pokeId;
    }
    function constructImageURL(pokeURL: string) {
        return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${extractId(pokeURL)}.png`;
    }
    function constructSinglePokePagePath(pokeURL: string) {
        return `/pokemon/${extractId(pokeURL)}`;
    }

    const searchStrToUse = useMemo(() => {
        return isMyCollectionPage ? searchStrCollection : searchStr;
    },[isMyCollectionPage, searchStr, searchStrCollection])

    const abilityFilterToUse = useMemo(() => {
        return isMyCollectionPage ? abilityFilterCollection : abilityFilter;
    }, [isMyCollectionPage, abilityFilter, abilityFilterCollection])

    const typeFilterToUse = useMemo(() => {
        return isMyCollectionPage ? typeFilterCollection : typeFilter;
    }, [isMyCollectionPage, typeFilter, typeFilterCollection])

    const pokeListWithSearch = useMemo(() => {

        const q = searchStrToUse.trim().toLowerCase();
        if (!allPokemonDetailsLoaded) return pokeList;

        const resultAfterSearch = (q && pokeList.length) ? pokeList.filter((pokemon) => pokemon.name.toLowerCase().includes(q)) : pokeList;

        const myCollectionFilter = resultAfterSearch.filter((p) => p.inMyCollection === true);
        // console.log('--pokelist: ', pokeList, 'q:', q, 'resultAfterSearch: ', resultAfterSearch, "myCollectionFilter: ", myCollectionFilter);

        if (isMyCollectionPage) return myCollectionFilter;

        // console.log('recalculating pokelist with search and my collection page');

        return resultAfterSearch;
    },[allPokemonDetailsLoaded, pokeList, searchStrToUse, isMyCollectionPage]);

    const resultAfterSearchAndTypeFilter = useMemo(() => {
        const resultAfterSearchAndTypeFilter = typeFilterToUse ? pokeListWithSearch.filter(
            (poke) => poke.detail?.types.some((t: Type) => t.type.name === typeFilterToUse)) : pokeListWithSearch;
        return resultAfterSearchAndTypeFilter;
    },[typeFilterToUse, pokeListWithSearch])

    const resultAfterSearchAndAbilityFilter = useMemo(() => {
        const resultAfterSearchAndAbilityFilter = abilityFilterToUse ? pokeListWithSearch .filter(
            (poke) => poke.detail?.abilities?.some((a: Ability) => a.ability.name === abilityFilterToUse)
        )
        : pokeListWithSearch ;

        return resultAfterSearchAndAbilityFilter;
    },[abilityFilterToUse, pokeListWithSearch])

    const filteredPokeList = useMemo(() => {
        const resultAfterSearchAbilityAndTypeFilter = typeFilterToUse ? resultAfterSearchAndAbilityFilter.filter(
            (poke) => poke.detail?.types.some((t: Type) => t.type.name === typeFilterToUse)) : resultAfterSearchAndAbilityFilter;

        function sort() {
            if (sortType === "name") {
                if (nameSort === 'asc') {
                    return [...resultAfterSearchAbilityAndTypeFilter].sort((a, b) => a.name.localeCompare(b.name));
                } else if (nameSort === 'desc') {
                    return [...resultAfterSearchAbilityAndTypeFilter].sort((a, b) => b.name.localeCompare(a.name));
                } else {
                    return resultAfterSearchAbilityAndTypeFilter;
                }
            }

            if (sortType === "xp") {
                const resultWithXP = [...resultAfterSearchAbilityAndTypeFilter].filter((poke) => poke.detail?.base_experience);
                if (xpSort === 'asc') {
                    return resultWithXP .sort((a, b) => Number(a.detail?.base_experience) - Number(b.detail?.base_experience));
                } else if (xpSort === 'desc') {
                    return resultWithXP .sort((a, b) => Number(b.detail?.base_experience) - Number(a.detail?.base_experience));
                } else {
                    return resultAfterSearchAbilityAndTypeFilter;
                }
            }

            if (sortType === "weight") {
                if (weightSort === 'asc') {
                    return [...resultAfterSearchAbilityAndTypeFilter].sort((a, b) => Number(a.detail?.weight) - Number(b.detail?.weight));
                } else if (weightSort === 'desc') {
                    return [...resultAfterSearchAbilityAndTypeFilter].sort((a, b) => Number(b.detail?.weight) - Number(a.detail?.weight));
                } else {
                    return resultAfterSearchAbilityAndTypeFilter;
                }
            }

            if (sortType === "height") {
                if (heightSort === 'asc') {
                    return [...resultAfterSearchAbilityAndTypeFilter].sort((a, b) => Number(a.detail?.height) - Number(b.detail?.height));
                } else if (heightSort === 'desc') {
                    return [...resultAfterSearchAbilityAndTypeFilter].sort((a, b) => Number(b.detail?.height) - Number(a.detail?.height));
                } else {
                    return resultAfterSearchAbilityAndTypeFilter;
                }
            }

            return resultAfterSearchAbilityAndTypeFilter;

        }

        // console.log("filtering pokelist: activePage: ", activePage, ", result:", result);
        return sort();
    },[resultAfterSearchAndAbilityFilter, typeFilterToUse, sortType, nameSort, xpSort, weightSort, heightSort]);

    const pagedPokemons = useMemo(() => {
        const pages: Pokemon[][] = [];
        for (let i = 0; i < filteredPokeList.length; i += itemsPerPage) {
            pages.push(filteredPokeList.slice(i, i + itemsPerPage))
        }
        return pages;
    }, [filteredPokeList, itemsPerPage])

    useEffect(() => {
        const defaultFilter = { val: "", text: "Select one"};
        function createFilterOptions(baseList: Pokemon[], kind: "ability" | "type") {
            const optionSet = new Set<string>();
            for (const poke of baseList) {
                if (kind === "ability") {
                    for (const ability of poke.detail?.abilities ?? []) {
                        optionSet.add(ability.ability.name);
                    }
                } else if (kind === "type") {
                    for (const type of poke.detail?.types ?? []) {
                        optionSet.add(type.type.name);
                    }
                }
            }
            const sortedList = [...optionSet].sort();
            const sortedOptionsForDropdown = sortedList.map((item: string) => {
                return { val: item, text: item};
            })
            return [defaultFilter, ...sortedOptionsForDropdown];
        }
        let nextAbilityFilters = createFilterOptions(resultAfterSearchAndTypeFilter, "ability");
        if (abilityFilterToUse && !nextAbilityFilters.some((item) => item.val === abilityFilterToUse)) {
            nextAbilityFilters = [{val: "disabled", text: abilityFilterToUse}, ...nextAbilityFilters];
        }
        setAbilityFilters(nextAbilityFilters);

        let nextTypeFilters = createFilterOptions(resultAfterSearchAndAbilityFilter, "type");
        if (typeFilterToUse && !nextTypeFilters.some((item) => item.val === typeFilterToUse)) {
            nextTypeFilters = [{val: "disabled", text: typeFilterToUse}, ...nextTypeFilters];
        }
        setTypeFilters(nextTypeFilters);

    },[resultAfterSearchAndTypeFilter, resultAfterSearchAndAbilityFilter, setAbilityFilters, setTypeFilters, abilityFilter, typeFilter, abilityFilterToUse, typeFilterToUse])

    const activePageToUse = useMemo(() => isMyCollectionPage ? activePageCollection : activePage, [activePage, activePageCollection, isMyCollectionPage]);

    if (loading) return "Loading...";

    if (isMyCollectionPage &&  myCollection.collection.length === 0) {
        return <p style={{marginTop: '50px'}}>There's no Pokemon in your collection. You can add them to your collection from <Link to="/pokemon-list">Pokemon List</Link> page.</p>
    } else {
        return (
            <div className="poke-list">
                {filteredPokeList.length === 0 &&
                    <p className="no-match-found">No match found{isMyCollectionPage ? " in your collection" : ""} for the search and filter condition above!</p>
                }
                {(searchStrToUse && filteredPokeList.length === 0 && pokeListWithSearch.length > 0 ) &&
                <p>There {pokeListWithSearch.length > 1 ? "are" : "is"} {pokeListWithSearch.length} Pokemon matching the name search if you clear the filters.</p>}
                {pagedPokemons.map((page, p) => (
                    <div className={`poke-list-page ${p+1} ${activePageToUse === p+1 ? "active" : ""}`} key={p+1}>
                        {page.map((pokemon, index) => {
                            const imgUrl = constructImageURL(pokemon.url);
                            const detailPagePath = constructSinglePokePagePath(pokemon.url);
                            const pokeId = extractId(pokemon.url);
                            const pokeName = pokemon.name;
                            const experience = pokemon.detail?.base_experience;
                            const height = pokemon.detail?.height;
                            const weight = pokemon.detail?.weight;
                            const inMyCollection = pokemon.inMyCollection;
                            const showImg = activePageToUse === p + 1;
                            // const currentPokemon = pokeList.find((p) => p.name === pokeName);
                            const types = pokemon?.detail ? pokemon.detail.types.map((t) => ({type: {name: t.type.name, primary: t.type.primary}})) : [{type: {name: "", primary: false}}];
                            return (
                                <PokeCard key={`${index}-${pokeId}`} {...{pokeList, setPokeList, theme, imgUrl, detailPagePath, pokeId, pokeName, experience, height, weight, inMyCollection, showImg, myCollection, setMyCollection, types}} />
                            );
                        })}
                    </div>
                ))}
                {!props.paginateByPrimaryType &&
                <Paginations totalPages={pagedPokemons.length}
                            activePage={activePage}
                            setActivePage={setActivePage}
                            activePageCollection={activePageCollection}
                            setActivePageCollection={setActivePageCollection}
                            isMyCollectionPage={isMyCollectionPage}/>
                }
            </div>
        )
    }
}

