import "./PokemonDetail.css";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import PokeCard from "../components/PokeCard";
import type {
  Ability,
  AbilityEffect,
  MyCollection,
  Pokemon,
  PokemonDetailPageType,
  PokemonDetailType,
} from "../interfaces";
import type { Dispatch, SetStateAction } from "react";

type PokemonDetailProps = {
  pokeList: Pokemon[];
  setPokeList: Dispatch<SetStateAction<Pokemon[]>>;
  theme: string;
  myCollection: MyCollection;
  setMyCollection: Dispatch<SetStateAction<MyCollection>>;
};

type PokemonApiResponse = {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number;
  abilities: Ability[];
  types: Array<{ type: { name: string } }>;
  species: {
    name: string;
    url: string;
  };
};

type PokemonSpeciesResponse = {
  evolution_chain: {
    url: string;
  };
};

type EvolutionChainNode = {
  species: {
    name: string;
  };
  evolves_to: EvolutionChainNode[];
};

type EvolutionChainResponse = {
  chain: EvolutionChainNode;
};

type EvolutionMapPokemon = {
  id: string;
  name: string;
  url: string;
  detail: PokemonDetailType;
};

const EMPTY_POKEMON: PokemonDetailPageType = {
  name: "",
  height: "",
  weight: "",
  base_experience: "",
  types: [
    {
      type: {
        name: "",
        primary: false,
      },
    },
  ],
};

function extractPokemonId(url: string) {
  const parts = url.split("/").filter(Boolean);
  return parts[parts.length - 1];
}

function mapPokemonDetail(data: PokemonApiResponse): PokemonDetailType {
  return {
    name: data.name,
    height: String(data.height),
    weight: String(data.weight),
    base_experience: String(data.base_experience),
    abilities: data.abilities,
    types: data.types.map((type, index) => ({
      type: {
        name: type.type.name,
        primary: index === 0,
      },
    })),
  };
}

function buildEvolutionStages(
  node: EvolutionChainNode,
  depth = 0,
  stages: string[][] = []
): string[][] {
  if (!stages[depth]) {
    stages[depth] = [];
  }

  if (!stages[depth].includes(node.species.name)) {
    stages[depth].push(node.species.name);
  }

  node.evolves_to.forEach((child) => buildEvolutionStages(child, depth + 1, stages));

  return stages;
}

export default function PokemonDetail(props: PokemonDetailProps) {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [evolutionLoading, setEvolutionLoading] = useState(false);
  const [currentPokemon, setCurrentPokemon] =
    useState<PokemonDetailPageType>(EMPTY_POKEMON);
  const [evolutionStages, setEvolutionStages] = useState<EvolutionMapPokemon[][]>([]);

  const imgUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

  async function fetchAbilityDesc(abilityUrl: string) {
    try {
      const response = await fetch(abilityUrl);
      if (!response.ok) {
        throw new Error("Can't fetch ability desc");
      }

      const data = await response.json();
      const englishEntry = data.effect_entries.find(
        (entry: AbilityEffect) => entry.language.name === "en"
      );

      return englishEntry?.effect || "No description available";
    } catch (err) {
      console.error(err);
      return "Can't fetch ability desc";
    }
  }

  async function fetchPokemonByIdOrName(identifier: string) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${identifier}`);
    if (!response.ok) {
      throw new Error("Can't fetch data");
    }

    return (await response.json()) as PokemonApiResponse;
  }

  async function enrichAbilities(abilities: Ability[] = []) {
    return Promise.all(
      abilities.map(async (item) => ({
        ...item,
        ability: {
          ...item.ability,
          desc: await fetchAbilityDesc(item.ability.url),
        },
      }))
    );
  }

  async function fetchEvolutionPokemon(name: string): Promise<EvolutionMapPokemon> {
    const cachedPokemon = props.pokeList.find((pokemon) => pokemon.name === name);

    if (cachedPokemon?.detail) {
      return {
        id: extractPokemonId(cachedPokemon.url),
        name: cachedPokemon.name,
        url: cachedPokemon.url,
        detail: cachedPokemon.detail,
      };
    }

    const pokemonData = await fetchPokemonByIdOrName(name);

    return {
      id: String(pokemonData.id),
      name: pokemonData.name,
      url: `https://pokeapi.co/api/v2/pokemon/${pokemonData.id}/`,
      detail: mapPokemonDetail(pokemonData),
    };
  }

  function isInMyCollection(name: string) {
    return props.myCollection.collection.some((pokemon) => pokemon.name === name);
  }

  useEffect(() => {
    let ignore = false;

    async function loadPokemonDetailPage() {
      if (!id) return;

      setLoading(true);
      setEvolutionLoading(true);
      setCurrentPokemon(EMPTY_POKEMON);
      setEvolutionStages([]);

      try {
        const pokemonData = await fetchPokemonByIdOrName(id);
        const abilitiesWithDesc = await enrichAbilities(pokemonData.abilities);

        if (!ignore) {
          setCurrentPokemon({
            ...mapPokemonDetail(pokemonData),
            abilities: abilitiesWithDesc,
          });
          setLoading(false);
        }

        const speciesResponse = await fetch(pokemonData.species.url);
        if (!speciesResponse.ok) {
          throw new Error("Can't fetch species data");
        }

        const speciesData = (await speciesResponse.json()) as PokemonSpeciesResponse;

        const evolutionResponse = await fetch(speciesData.evolution_chain.url);
        if (!evolutionResponse.ok) {
          throw new Error("Can't fetch evolution chain");
        }

        const evolutionData = (await evolutionResponse.json()) as EvolutionChainResponse;
        const stageNames = buildEvolutionStages(evolutionData.chain);
        const uniqueNames = Array.from(new Set(stageNames.flat()));

        const evolutionPokemons = await Promise.all(
          uniqueNames.map((name) => fetchEvolutionPokemon(name))
        );

        const evolutionPokemonMap = new Map(
          evolutionPokemons.map((pokemon) => [pokemon.name, pokemon])
        );

        const nextStages = stageNames.map((stage) =>
          stage
            .map((name) => evolutionPokemonMap.get(name))
            .filter((pokemon): pokemon is EvolutionMapPokemon => Boolean(pokemon))
        );

        if (!ignore) {
          setEvolutionStages(nextStages);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (!ignore) {
          setLoading(false);
          setEvolutionLoading(false);
        }
      }
    }

    loadPokemonDetailPage();

    return () => {
      ignore = true;
    };
  }, [id]);

  return (
    <>
      {loading && "Loading..."}

      {!loading && (
        <div className="pokemon--detail__page">
            <div className="pokemon--detail">
                <h1 className="pokemon--detail--name">{currentPokemon.name}</h1>

                <img
                    className="pokemon--detail--img"
                    src={imgUrl}
                    alt={currentPokemon.name}
                    width="250"
                />

                <table className="pokemon--detail--wrap">
                    <tbody>
                    {currentPokemon.base_experience && (
                        <tr>
                        <td>Experience:</td>
                        <td className="pokemon--ability--list-base-experience" colSpan={2}>
                            {currentPokemon.base_experience}
                        </td>
                        </tr>
                    )}

                    {currentPokemon.weight && (
                        <tr>
                        <td>Weight:</td>
                        <td className="pokemon--ability--list-base-experience" colSpan={2}>
                            {currentPokemon.weight}
                        </td>
                        </tr>
                    )}

                    {currentPokemon.height && (
                        <tr>
                        <td>Height:</td>
                        <td className="pokemon--ability--list-base-experience" colSpan={2}>
                            {currentPokemon.height}
                        </td>
                        </tr>
                    )}

                    {currentPokemon.types && (
                        <tr>
                        <td>Types:</td>
                        <td className="pokemon--ability--list-name" colSpan={2}>
                            {currentPokemon.types.map((type) => type.type.name).join(", ")}
                        </td>
                        </tr>
                    )}

                    <tr>
                        <td>Abilities:</td>
                        {currentPokemon.abilities && currentPokemon.abilities.length > 0 && (
                        <td className="pokemon--ability--list-name">
                            {currentPokemon.abilities[0]?.ability.name}
                        </td>
                        )}
                        <td>
                        {currentPokemon.abilities && currentPokemon.abilities.length > 0
                            ? currentPokemon.abilities[0].ability.desc
                            : ""}
                        </td>
                    </tr>

                    <>
                        {currentPokemon.abilities &&
                        currentPokemon.abilities.length > 1 &&
                        currentPokemon.abilities.map((ability, index) => {
                            if (index > 0) {
                            return (
                                <tr key={ability.ability.name}>
                                <td></td>
                                <td className="pokemon--ability--list-name">
                                    {ability.ability.name}:
                                </td>
                                <td>{ability.ability.desc}</td>
                                </tr>
                            );
                            }
                            return null;
                        })}
                    </>
                    </tbody>
                </table>
            </div>

          <section className="evolution-map">
            <h2 className="evolution-map__title">Evolution map</h2>

            {evolutionLoading && <p>Loading evolution chain...</p>}

            {!evolutionLoading && evolutionStages.length === 0 && (
              <p>No evolution data available.</p>
            )}

            {!evolutionLoading &&
              evolutionStages.map((stage, stageIndex) => {
                console.log('sth');
                const stageCount = evolutionStages.length;
                const label = 
                    stageIndex === 0
                    ? "Base" : stageCount === 2 ? "Evolutions"
                    : `Stage ${stageIndex + 1}`;

                    return (
                        <div className="evolution-map__stage-wrap" key={`stage-${stageIndex}`}>
                        {stageIndex > 0 && (
                            <div className="evolution-map__arrow" aria-hidden="true">
                            ↓
                            </div>
                        )}

                        <div className="evolution-map__stage-label">{label}</div>

                        <div className="evolution-map__stage">
                            {stage.map((pokemon) => {
                            const pokemonImgUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;

                            return (
                                <PokeCard
                                key={`${pokemon.id}-${pokemon.name}`}
                                pokeList={props.pokeList}
                                setPokeList={props.setPokeList}
                                theme={props.theme}
                                imgUrl={pokemonImgUrl}
                                detailPagePath={`/pokemon/${pokemon.id}`}
                                pokeId={pokemon.id}
                                pokeName={pokemon.name}
                                experience={pokemon.detail.base_experience}
                                height={pokemon.detail.height}
                                weight={pokemon.detail.weight}
                                inMyCollection={isInMyCollection(pokemon.name)}
                                showImg={true}
                                myCollection={props.myCollection}
                                setMyCollection={props.setMyCollection}
                                types={pokemon.detail.types}
                                linkTarget="_self"
                                isActive={pokemon.id === id}
                                />
                            );
                            })}
                        </div>
                        </div>
                    )
                })}
          </section>
        </div>
      )}
    </>
  );
}