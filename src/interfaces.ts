import type { Dispatch, SetStateAction } from "react";

export interface ListProps {
    isMyCollectionPage?: boolean;
    pokeList: Pokemon[];
    setPokeList: Dispatch<SetStateAction<Pokemon[]>>;
    loading: boolean;
    theme: string;
    allPokemonDetailsLoaded: boolean;
    itemsPerPage: number;
    searchStr: string;
    searchStrCollection: string;
    activePage: number;
    setActivePage: Dispatch<SetStateAction<number>>;
    activePageCollection: number;
    setActivePageCollection: Dispatch<SetStateAction<number>>;
    abilityFilter: string;
    abilityFilterCollection: string;
    typeFilter: string;
    typeFilterCollection: string;
    typeFilters: OptionType[];
    abilityFilters: OptionType[];
    setAbilityFilters: Dispatch<SetStateAction<OptionType[]>>;
    setTypeFilters: Dispatch<SetStateAction<OptionType[]>>;
    sortType: "none" | "name" | "xp" | "weight" | "height";
    nameSort: "none" | "asc" | "desc";
    xpSort: "none" | "asc" | "desc";
    heightSort: "none" | "asc" | "desc";
    weightSort: "none" | "asc" | "desc";
    myCollection: MyCollection;
    setMyCollection: Dispatch<SetStateAction<MyCollection>>;
    paginateByPrimaryType: boolean;
}

export interface Pokemon {
    name: string;
    url: string;
    inMyCollection?: boolean;
    detail?: PokemonDetailType;
}

export interface PokemonDetailPageType {
    name: string;
    height: string;
    weight: string;
    base_experience: string;
    abilities?: Ability[];
    types: Type[];
}

export interface PokemonDetailType {
    name: string;
    height: string;
    weight: string;
    base_experience: string;
    abilities?: Ability[];
    types: Type[];
}

export interface AbilityItem {
    name: string;
    url: string;
    effect?: AbilityEnEffect;
    pokemon?: string[];
}

export interface Ability {
    ability: {
         name: string;
         url: string;
         desc?: string;
    };
}
export interface Type {
    type: TypeItem;
}

export interface TypeItem {
    name: string;
    primary?: boolean;
}


export interface AbilityEffect {
    effect: string;
    language: {
        name: string;
    };
    short_effect: string;
}

export interface AbilityEnEffect {
    effect: string;
    short_effect: string;
}

export type AbilityMap = Record<
    string,
    {
        url: string;
        effect: AbilityEffectInfo;
        pokemon: string[];
    }
>;

export type AbilityEffectInfo =  {
    effect: string;
    short_effect: string;
}

export type OptionType = {
    val: string;
    text: string;
}

export type CollectedPokemon = {
    name: string;
    positionInBinder: number;
}

export type MyCollection = {
    collection: CollectedPokemon[];
    binderInfo: {
        noOfCols: number;
        noOfRows: number;
        noOfPages: number;
    }
}