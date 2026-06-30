import "./SearchSortFilter.css";
import { useCallback, useMemo, useState } from 'react';
import type { Dispatch, SetStateAction } from "react";
import Dropdown from "./Dropdown";
import type { OptionType, Pokemon } from "../interfaces";

interface SearchSortFilterProps {
    pokeList: Pokemon[];
    searchStr: string;
    setSearchStr: Dispatch<SetStateAction<string>>;
    setActivePage: Dispatch<SetStateAction<number>>;
    abilityFilter: string;
    setAbilityFilter: Dispatch<SetStateAction<string>>;
    typeFilter: string;
    setTypeFilter: Dispatch<SetStateAction<string>>;
    sortType: "none" | "name" | "xp" | "weight" | "height";
    setSortType: Dispatch<SetStateAction<"none" | "name" | "xp" | "weight" | "height">>;
    nameSort: "none" | "asc" | "desc";
    setNameSort: Dispatch<SetStateAction<"none" | "asc" | "desc">>;
    xpSort: "none" | "asc" | "desc";
    setXpSort: Dispatch<SetStateAction<"none" | "asc" | "desc">>;
    heightSort: "none" | "asc" | "desc";
    setHeightSort: Dispatch<SetStateAction<"none" | "asc" | "desc">>;
    weightSort: "none" | "asc" | "desc";
    setWeightSort: Dispatch<SetStateAction<"none" | "asc" | "desc">>;
    abilityFilters: OptionType[];
    typeFilters: OptionType[];
    searchStrCollection: string;
    setSearchStrCollection: Dispatch<SetStateAction<string>>;
    setActivePageCollection: Dispatch<SetStateAction<number>>;
    abilityFilterCollection: string;
    setAbilityFilterCollection: Dispatch<SetStateAction<string>>;
    typeFilterCollection: string;
    setTypeFilterCollection: Dispatch<SetStateAction<string>>;
    isMyCollectionPage: boolean;
    paginateByPrimaryType: boolean;
    setPaginateByPrimaryType: Dispatch<SetStateAction<boolean>>;
}

export default function SearchSortFilter( props: SearchSortFilterProps ) {
    const {searchStr, setSearchStr, setActivePage, abilityFilter, setAbilityFilter, typeFilter, setTypeFilter, searchStrCollection, setSearchStrCollection, setActivePageCollection, abilityFilterCollection, setAbilityFilterCollection, typeFilterCollection, setTypeFilterCollection, sortType, setSortType, nameSort, setNameSort, xpSort, setXpSort, heightSort, setHeightSort, weightSort, setWeightSort, abilityFilters, typeFilters, isMyCollectionPage } = props;

    const [dropdownOpen, setDropdownOpen] = useState(true);
    const [xpSortBtnLabel, setXpSortBtnLabel] = useState("Sort cards by Pokemon xp  (low to high)");
    const [heightSortBtnLabel, setHeightSortBtnLabel] = useState("Sort cards by Pokemon height (low to high)");
    const [weightSortBtnLabel, setWeightSortBtnLabel] = useState("Sort cards by Pokemon weight (low to high)");

    const handleSearch = useCallback((val: string) => {
        console.log('in handle search');
        if (isMyCollectionPage) {
            localStorage.setItem('searchStrCollection', val);
            setSearchStrCollection(val);
            setActivePageCollection(1);
            localStorage.setItem('activePageCollection', "1");
        } else {
            localStorage.setItem('searchStr', val);
            setSearchStr(val);
            setActivePage(1);
            localStorage.setItem('activePage', "1");
        }

    },[setSearchStr, setActivePage, setActivePageCollection, setSearchStrCollection, isMyCollectionPage])

    const handleAbilityFilterChange = useCallback((val: string) => {
        console.log('prev abilityFilter', abilityFilter);
        if (isMyCollectionPage) {
            localStorage.setItem('abilityFilterCollection', val);
            setAbilityFilterCollection(val);
            setActivePageCollection(1);
            localStorage.setItem('activePageCollection', "1");
        } else {
            localStorage.setItem('abilityFilter', val);
            setAbilityFilter(val);
            setActivePage(1);
            localStorage.setItem('activePage', "1");
        }

    },[setAbilityFilter, setActivePage, setAbilityFilterCollection, setActivePageCollection,isMyCollectionPage, abilityFilter])

    const handleTypeFilterChange = useCallback((val: string) => {
        if (isMyCollectionPage) {
            localStorage.setItem('typeFilterCollection', val);
            setTypeFilterCollection(val);
            setActivePageCollection(1);
            localStorage.setItem('activePageCollection', "1");
        } else {
            localStorage.setItem('typeFilter', val);
            setTypeFilter(val);
            setActivePage(1);
            localStorage.setItem('activePage', "1");
        }
    },[setTypeFilter, setActivePage, setTypeFilterCollection, setActivePageCollection, isMyCollectionPage])

    const processNewSort = useCallback((oldSort: string, sortType: "none" | "name" | "xp" | "weight" | "height") => {
        console.log('in process new sort');
        localStorage.setItem('sortType', sortType);
        setSortType(sortType);
        let newSort: "none" | "asc" | "desc" = "asc";
        if (oldSort === "asc") {
            newSort = "desc";
        } else if (oldSort === "desc") {
            newSort = 'none';
        } else if (oldSort === "none") {
            newSort = "asc";
        }
        // button title will show the action for thw next click
        const sortConversion = newSort === "none" ? "(low to high)" : (newSort === "asc" ? "(high to low)" : "");
        const btnTitle = newSort === "desc" ? `Remove ${sortType} sort` : `Sort cards by Pokemon ${sortType} ${sortConversion}`;
        if (sortType === "xp") {
            setXpSortBtnLabel(btnTitle);
        } else if (sortType === "weight") {
            setWeightSortBtnLabel(btnTitle);
        } else if (sortType === "height") {
            setHeightSortBtnLabel(btnTitle);
        }

        return newSort;
    },[setSortType])

    const handleNameSort = () => {
        const newSort = processNewSort(props.nameSort, 'name');
        setNameSort(newSort);
        localStorage.setItem('nameSort', newSort);
    }

    const handleXpSort = () => {
        const newSort = processNewSort(props.xpSort, 'xp');
        setXpSort(newSort);
        localStorage.setItem('xpSort', newSort);
    }

    const handleWeightSort = () => {
        const newSort = processNewSort(props.weightSort, 'weight');
        setWeightSort(newSort);
        localStorage.setItem('weightSort', newSort);
    }

    const handleHeightSort = () => {
        const newSort = processNewSort(props.heightSort, 'height');
        setHeightSort(newSort);
        localStorage.setItem('heightSort', newSort);
    }

    const sortIndicator = useCallback((sortDirection: string, type: string) => {
        let className = `sort-direction ${type}`;
        if (type !== sortType) {
            className += " inactive";
        }
        const classNameNone = " none";
        const upArrow = (className: string) => (<span className={className}>&#8593;</span>);
        const downArrow = (className: string) => (<span className={className}>&#8595;</span>);
        if (type !== "name") {
            if (sortDirection === "asc") {
                className += " asc";
                return upArrow(className);
            } else if (sortDirection === "desc") {
                className += " desc";
                return downArrow(className);
            } else if (sortDirection === "none") {
                className += classNameNone;
                return <span className={className}>&#8593;</span>;
            }
        } else if (type === "name") {
            if (sortDirection === "asc") {
                return <span className={className}>(a-z)</span>;
            } else if (sortDirection === "desc") {
                return <span className={className}>(z-a)</span>;
            } else if (sortDirection === "none") {
                className += classNameNone;
                return <span className={className}>(a-z)</span>;
            }
        }
    },[sortType]);

    const searchStrToUse = useMemo(() => {
        return isMyCollectionPage ? searchStrCollection : searchStr;
    },[isMyCollectionPage, searchStr, searchStrCollection])

    const abilityFilterToUse = useMemo(() => {
        return isMyCollectionPage ? abilityFilterCollection : abilityFilter;
    }, [isMyCollectionPage, abilityFilter, abilityFilterCollection])

    const typeFilterToUse = useMemo(() => {
        return isMyCollectionPage ? typeFilterCollection : typeFilter;
    }, [isMyCollectionPage, typeFilter, typeFilterCollection])

    const showFilterMsg = (isMyCollectionPage ? (typeFilterCollection || abilityFilterCollection || searchStrCollection) : (typeFilter || abilityFilter || searchStr)) && !dropdownOpen;

    const nameSortBtnTitle = useMemo(() => {
        const result = sortIndicator(nameSort, "name");
        if (result?.props.className.includes("none")) return "Sort cards by Pokemon name (a-z)";
        if (result && typeof result.props.children === "string" && result?.props.children.includes("a-z")) return "Sort cards by Pokemon name (z-a)";
        else return "Remove name sort";
    }, [nameSort, sortIndicator]);

    return  (
        <div className="search-sort-filter--outer-wrap ">
            <div className={`search-sort-filter--wrap ${!dropdownOpen ? 'collapsed' : ''}`}>
                <div className={`search-sort-filter__content ${!dropdownOpen ? 'hide' : ''}`}>
                    <div className="search--outer-wrap">
                        <span className="filter-label">Search: </span>
                        <span className="search--wrap">
                            <input id="pokemon-search-input" type="text" onChange={((e) => handleSearch(e.target.value))} value={searchStrToUse}/>
                            <button
                                className={`search--close ${searchStrToUse.length > 0 ? "" : "hide"}`}
                                aria-label="Clear search"
                                title="Clear search"
                                onClick={() => handleSearch("")}
                                >
                                <span className="first"></span>
                                <span className="second"></span>
                            </button>
                        </span>

                    </div>
                    {typeFilters.length && (
                        <div className="filter--wrap">
                            <span className="filter-label">Type<span className="mobile-hide"> filter</span>: </span>
                            <Dropdown id="type-filter" items={typeFilters} onChangeHandle={handleTypeFilterChange} value={typeFilterToUse}/>
                        </div>
                    )}
                    {abilityFilters.length && (
                        <div className="filter--wrap">
                            <span className="filter-label">Ability<span className="mobile-hide"> filter</span>: </span>
                            <Dropdown id="ability-filter" items={abilityFilters} onChangeHandle={handleAbilityFilterChange} value={abilityFilterToUse}/>
                        </div>
                    )}
                    <div className="sort--wrap">
                        <span className="filter-label">Sort: </span>
                        <button onClick={() => handleNameSort()}
                                aria-label={nameSortBtnTitle}
                                title={nameSortBtnTitle}>
                            <span className="sort-cta name">Name</span>
                            {sortIndicator(nameSort, "name")}
                        </button>
                        <button onClick={() => handleXpSort()}
                                aria-label={xpSortBtnLabel}
                                title={xpSortBtnLabel}>
                            <span className="sort-cta">XP</span>
                            {sortIndicator(xpSort, "xp")}
                        </button>
                        <button onClick={() => handleHeightSort()}
                                aria-label={heightSortBtnLabel}
                                title={heightSortBtnLabel}>
                            <span className="sort-cta">Height</span>{sortIndicator(heightSort, "height")}
                        </button>
                        <button onClick={() => handleWeightSort()}
                                aria-label={weightSortBtnLabel}
                                title={weightSortBtnLabel}>
                            <span className="sort-cta">Weight</span>
                            {sortIndicator(weightSort, "weight")}
                        </button>
                    </div>
                    {/* {props.isMyCollectionPage && 
                        <div className="group--wrap">
                            <button onClick={() => setPaginateByPrimaryType(!paginateByPrimaryType)}>
                                Group by primary type
                            </button>
                        </div>
                    } */}
                </div>
                
                <button className={`search-sort-filter--toggle-btn ${!dropdownOpen ? '' : 'rotate'}`}
                    title={`${!dropdownOpen ? 'Expand search, sort and filter menu' : 'Collapse search, sort and filter menu'}`}
                    onClick={() => setDropdownOpen(!dropdownOpen)}><span className={`search-sort-filter--toggle-icon ${!dropdownOpen ? '' : 'rotate'}`}></span></button>
            </div>
            {showFilterMsg &&
            <p className="filter-msg">Don't see as many Pokemons as expected? <button onClick={() => setDropdownOpen(true)}>Expand</button> the Search, Sort and Filter menu above and clear the search/filter.</p>}
        </div>
    )
}