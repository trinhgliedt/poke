import { useMemo, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import "./Navbar.css";
import { Link, useMatch } from "react-router-dom";
import type { OptionType, Pokemon } from "../interfaces";
import SearchSortFilter from "./SearchSortFilter";
import logo from "../assets/logo/main-logo.webp";

interface NavbarProps {
    theme: string;
    setTheme: Dispatch<SetStateAction<string>>;
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
    setAbilityFilters: Dispatch<SetStateAction<OptionType[]>>;
    setTypeFilters: Dispatch<SetStateAction<OptionType[]>>;
    searchStrCollection: string;
    setSearchStrCollection: Dispatch<SetStateAction<string>>;
    setActivePageCollection: Dispatch<SetStateAction<number>>;
    abilityFilterCollection: string;
    setAbilityFilterCollection: Dispatch<SetStateAction<string>>;
    typeFilterCollection: string;
    setTypeFilterCollection: Dispatch<SetStateAction<string>>;
    paginateByPrimaryType: boolean;
    setPaginateByPrimaryType: Dispatch<SetStateAction<boolean>>;
}



export default function Navbar(props: NavbarProps) {
    const isPokemonListPage = useMatch('/pokemon-list');
    const isMyCollectionPage = useMatch('/my-collection');
    const [showMenu, setShowMenu] = useState(false);

    // useEffect(() => {
    //     console.log('rendering nav bar');
    // },[]);
    function toggleTheme(prevTheme: string) {
        if (prevTheme === "light") {
            // change theme in localStorage
            localStorage.setItem('theme', 'dark');
            return "dark";
        } else {
            // change theme in localStorage
            localStorage.setItem('theme', 'light');
            return "light";
        }
    }

    const theOtherTheme = useMemo(() => {
        return props.theme === "light" ? "dark" : "light";
    },[props.theme])

    const { theme, setTheme, pokeList, searchStr, setSearchStr, setActivePage, abilityFilter, setAbilityFilter, typeFilter, setTypeFilter, sortType, setSortType, nameSort, setNameSort, xpSort, setXpSort, heightSort, setHeightSort, weightSort, setWeightSort, abilityFilters, typeFilters, setAbilityFilters, setTypeFilters, searchStrCollection, setSearchStrCollection, setActivePageCollection, abilityFilterCollection, setAbilityFilterCollection, typeFilterCollection, setTypeFilterCollection, paginateByPrimaryType, setPaginateByPrimaryType } = props;

    return (
        <div className="navbar">
            
            <span className="navbar--left">
                <div className={`backdrop ${showMenu ? '' : 'hide'}`} ></div>
            <Link to="/" className="navbar--logo"><img src={logo} alt="Pikachu" width="100%"/></Link>
            </span>
            <span className="navbar--right">
                {isPokemonListPage &&
                <SearchSortFilter {...{pokeList, searchStr, setSearchStr, setActivePage, abilityFilter, setAbilityFilter, typeFilter, setTypeFilter, searchStrCollection, setSearchStrCollection, setActivePageCollection, abilityFilterCollection, setAbilityFilterCollection, typeFilterCollection, setTypeFilterCollection, sortType, setSortType, nameSort, setNameSort, xpSort, setXpSort, heightSort, setHeightSort, weightSort, setWeightSort, abilityFilters, typeFilters, isMyCollectionPage:false, setAbilityFilters, setTypeFilters, paginateByPrimaryType, setPaginateByPrimaryType }}/>}

                {isMyCollectionPage &&
                <SearchSortFilter {...{pokeList, searchStr, setSearchStr, setActivePage, abilityFilter, setAbilityFilter, typeFilter, setTypeFilter, searchStrCollection, setSearchStrCollection, setActivePageCollection, abilityFilterCollection, setAbilityFilterCollection, typeFilterCollection, setTypeFilterCollection, sortType, setSortType, nameSort, setNameSort, xpSort, setXpSort, heightSort, setHeightSort, weightSort, setWeightSort, abilityFilters, typeFilters, isMyCollectionPage:true, setAbilityFilters, setTypeFilters, paginateByPrimaryType, setPaginateByPrimaryType }}/>}
                <button className={`hamburger-btn ${showMenu ? 'close-icon' : ''}`} onClick={() => setShowMenu(!showMenu)} aria-label="Toggle menu" title="Toggle menu">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
                
                <span className={`nav-link-list ${showMenu ? 'open' : ''}`}>
                    <Link to="/pokemon-list" onClick={() => setShowMenu(false)}>Pokemon List</Link>
                    <Link to="/my-collection" onClick={() => setShowMenu(false)}>My Collection</Link>
                    <button title={`Switch to ${theOtherTheme} theme`} onClick={() => {
                        setTheme(toggleTheme(theme))
                        setShowMenu(false);
                    }}>{theme} theme</button>
                </span>
            </span>
        </div>
    )
}