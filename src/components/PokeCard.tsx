import "./PokeCard.css";
import { Link } from "react-router-dom";
import type { Pokemon, MyCollection, Type } from "../interfaces";
import type { Dispatch, SetStateAction } from "react";
import addIconDark from "../assets/icons/add-to-collection__dark.svg";
import addIcon from "../assets/icons/add-to-collection.svg";
import removeIconDark from "../assets/icons/remove-from-collection__dark.svg";
import removeIcon from "../assets/icons/remove-from-collection.svg";

type PokeCardProps = {
    pokeList: Pokemon[];
    setPokeList: Dispatch<SetStateAction<Pokemon[]>>;
    theme: string;
    imgUrl: string;
    detailPagePath: string;
    pokeId: string;
    pokeName: string;
    experience?: string;
    height?: string;
    weight?: string;
    inMyCollection?: boolean;
    showImg: boolean;
    myCollection: MyCollection;
    setMyCollection: Dispatch<SetStateAction<MyCollection>>;
    types: Type[];
    isActive?: boolean;
    linkTarget?: string;
};

export default function PokeCard( props: PokeCardProps) {
    const addToCollectionText = "Add to my collection";
    const removeFromCollectionText = "Remove from my collection";
    const formattedName = props.pokeName ? props.pokeName.charAt(0).toUpperCase() + props.pokeName.slice(1) : "";
    const linkTarget = props.linkTarget || "_self";

    // useEffect(() => {
    //     console.log("types:", props.types);
    // },[props.types]);

    const handleAddToCollection = (pokeName: string) => {
        if (!pokeName) return;

        props.setMyCollection((prev) => {
            if (prev.collection.some((p) => p.name === pokeName)) return prev;

            const newCollection = {
                        ...prev,
                        collection: [
                            ...prev.collection,
                            {name: pokeName, positionInBinder: -1}
                        ]
                    };
            localStorage.setItem('myCollection', JSON.stringify(newCollection));
            return newCollection;
        })

        props.setPokeList((prevList) => {
            const newList = prevList.map((p) => p.name === pokeName
                ? { ...p, inMyCollection: true}
                : p
            );
            localStorage.setItem('pokeList', JSON.stringify(newList));
            return newList;
        })
    };

    const handleRemoveFromCollection = (pokeName: string) => {
        props.setMyCollection((prev) => {
            if (prev.collection.every((p) => p.name !== pokeName)) return prev;

            const newCollection = {
                            ...prev,
                            collection: [
                                ...prev.collection.filter((p) => p.name !== pokeName)
                            ]
                        };
            localStorage.setItem('myCollection', JSON.stringify(newCollection));

            return newCollection;
        })

        props.setPokeList((prevList) => {
            const newList = prevList.map((p) =>
                            p.name === pokeName
                            ? {...p, inMyCollection: false}
                            : p
        );
            localStorage.setItem('pokeList', JSON.stringify(newList));
            return newList;
        })
    }

    const changePrimaryType = (newType: string) => {
        props.setPokeList((prevList) => {
            const newList = prevList.map((p) => {
                if (p.name !== props.pokeName) return p;
                if (!p.detail) return p;

                return {
                    ...p,
                    detail: {
                        ...p.detail,
                        types: p.detail.types.map((t) => ({
                            ...t,
                            type: {
                                ...t.type,
                                primary: t.type.name === newType
                            }
                        }))
                    }
                };
            })
            return newList;
        })
    }

    return (
        <span className={`poke-card ${props.inMyCollection ? "collected" : ""} ${props.isActive ? "active" : ""}`}>
            {props.inMyCollection && 
            <div className="card-tag" >Collected</div>}

            <div className='btn-wrap'>
                {props.theme === "light" && !props.inMyCollection &&
                    <button
                        className="card-btn"
                        title={addToCollectionText}
                        onClick={() => handleAddToCollection(props.pokeName)} >
                        <img src={addIcon} width='35' height='35'
                        alt={addToCollectionText} />
                    </button>
                }
                {props.theme === "dark" && !props.inMyCollection &&
                    <button
                        className="card-btn"
                        title={addToCollectionText}
                        onClick={() => handleAddToCollection(props.pokeName)} >
                        <img src={addIconDark} width='35' height='35'
                        alt={addToCollectionText} />
                    </button>
                }
                {props.theme === "light" && props.inMyCollection &&
                    <button
                        className="card-btn"
                        title={removeFromCollectionText}
                        onClick={() => handleRemoveFromCollection(props.pokeName)}>
                        <img src={removeIcon} width='35' height='35'
                        alt={removeFromCollectionText} />
                    </button>
                }
                {props.theme === "dark" && props.inMyCollection &&
                <button
                        className="card-btn"
                        title={removeFromCollectionText}
                        onClick={() => handleRemoveFromCollection(props.pokeName)}>
                        <img src={removeIconDark} width='35' height='35'
                        alt={removeFromCollectionText} />
                    </button>
                }
            </div>

            <Link to={props.detailPagePath}
                    target={linkTarget}
                    className="poke-card--link"
                    aria-current={props.isActive ? "page" : undefined}
                    aria-label={`Learn more about ${formattedName}`}
                    title={`Learn more about ${formattedName}`}>
                {props.showImg &&
                    <img className="poke-card--img" src={props.imgUrl} alt={formattedName} width={200} />
                }
            </Link>
            <span className="poke-card__name">{formattedName}</span>
            <span className="poke-card__types">{props.types.map((t, index) => 
                <button key={`${index}-${t.type.name}`}
                        disabled={t.type.primary}
                        title={t.type.primary ? '' : `Change primary type to ${t.type.name}`}
                        onClick={() => changePrimaryType(t.type.name)}
                        >{t.type.name}</button>)}</span>
            <span className="poke-card__info">
                <span className="poke-card__info__label">XP:</span>
                <span className="poke-card__info__xp">{props.experience}</span>
                &nbsp;- <span className="poke-card__info__label">W:</span>
                <span className="poke-card__info__weight">{props.weight}</span>
                &nbsp;- <span className="poke-card__info__label">H:</span>
                <span className="poke-card__info__height">{props.height}</span>
            </span>

        </span>
    )
}
