import "./PokemonDetail.css";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Ability, AbilityEffect, PokemonDetailPageType } from "../interfaces";

export default function PokemonDetail() {
    const { id } = useParams<{ id: string}>();
    const [loading, setLoading] = useState(false);
    const [currentPokemon, setCurrentPokemon] = useState<PokemonDetailPageType>({
        name: "",
        height: "",
        weight: "",
        base_experience: "",
        types: [
            {
                type: {
                    name: "",
                    primary: false
                },
            }
        ]
    });
    const imgUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

    async function fetchAbilityDesc(abilityUrl: string) {
        setLoading(true);
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

        } catch(err) {
            console.error(err);
            return "Can't fetch ability desc";
        } finally {
            setLoading(false);
        }
    }

    async function fetchPokemon(id: string) {
        setLoading(true);
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
            if (!response.ok) {
                throw new Error("Can't fetch data");
            }
            const data = await response.json();
            // console.log('ability:', data.abilities);
            await Promise.all(
                data.abilities.map(async (item: Ability) => {
                    item.ability.desc = await fetchAbilityDesc(item.ability.url);
                })
            );
            setCurrentPokemon(data);
            // console.log('currentPokemon: ', data);
        } catch(err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (id !== undefined) fetchPokemon(id);
    }, []);

    return (
        <>
        {loading && "Loading..."}
        {!loading && 
            <div className="pokemon--detail">
                <h1 className="pokemon--detail--name">{currentPokemon.name}</h1>
                <img className="pokemon--detail--img" src={imgUrl} alt={currentPokemon.name} width="250"/>
                <table className="pokemon--detail--wrap">
                    <tbody>
                        {currentPokemon.base_experience && 
                            <tr>
                                <td>Experience:</td>
                                <td className="pokemon--ability--list-base-experience" colSpan={2}>{currentPokemon.base_experience}</td>
                            </tr>
                        }
                        {currentPokemon.weight && 
                            <tr>
                                <td>Weight:</td>
                                <td className="pokemon--ability--list-base-experience" colSpan={2}>{currentPokemon.weight}</td>
                            </tr>
                        }
                        {currentPokemon.height && 
                            <tr>
                                <td>Height:</td>
                                <td className="pokemon--ability--list-base-experience" colSpan={2}>{currentPokemon.height}</td>
                            </tr>
                        }
                        {currentPokemon.types && 
                            <tr>
                                <td>Types:</td>
                                <td className="pokemon--ability--list-name" colSpan={2}>{currentPokemon.types.map((type) => type.type.name).join(', ')}</td>
                            </tr>
                        }
                            <tr>
                                <td>Abilities:</td>
                                {currentPokemon.abilities && currentPokemon.abilities.length > 0 &&
                                <td className="pokemon--ability--list-name">{currentPokemon.abilities[0]?.ability.name}</td>
                                }
                                <td>{currentPokemon.abilities && currentPokemon.abilities.length > 0 ? currentPokemon.abilities[0].ability.desc : ""}</td>
                            </tr>
                            <>
                            {currentPokemon.abilities && currentPokemon.abilities.length > 1
                            && currentPokemon.abilities.map((ability, index) => {
                                if (index > 0) {
                                    return (
                                    <tr key={ability.ability.name}>
                                        <td></td>
                                        <td className="pokemon--ability--list-name">{ability.ability.name}:</td>
                                        <td>{ability.ability.desc}</td>
                                    </tr>
                                )
                                }
                            } )}
                            </>
                    </tbody>
                </table>
            </div>
        }
        </>
    )
};