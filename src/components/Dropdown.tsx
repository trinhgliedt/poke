import "./Dropdown.css";
import type { Dispatch, SetStateAction } from "react";
import type { OptionType } from "../interfaces";

interface DropdownProps {
    id?: string;
    items: OptionType[];
    onChangeHandle: Function | Dispatch<SetStateAction<string>>;
    value: string;
}

export default function Dropdown( props: DropdownProps) {

    return (
        <>
        <select className="filter-select" id={props.id}
            value={props.value}
            onChange={(e) => props.onChangeHandle(e.target.value)}>
            {props.items.map((item, index) => {
                return <option
                            key={`${index}-${item.val}`} value={item.val}
                            >{item.text?.charAt(0).toUpperCase()}{item.text?.slice(1)}</option>
            })}
        </select>
        <button className='clear-filter'
                onClick={() => props.onChangeHandle("")}
                aria-label="Clear filter"
                title="Clear filter">Clear</button>
        </>
    )
}