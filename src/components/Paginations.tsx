import "./Paginations.css";
import type { Dispatch, SetStateAction } from "react";
import { useMemo } from "react";

type PaginationsProps = {
    totalPages: number;
    activePage: number;
    setActivePage: Dispatch<SetStateAction<number>>;
    activePageCollection: number;
    setActivePageCollection: Dispatch<SetStateAction<number>>;
    isMyCollectionPage: boolean | undefined;
};


export default function Paginations(props: PaginationsProps) {

    function handleClick(pageNumber: number) {
        // console.log("props.totalPages:", props.totalPages, "pageNumber:", pageNumber, "props.activePageCollection", props.activePageCollection);
        if (props.isMyCollectionPage) {
            if (props.activePageCollection !== pageNumber) {
                props.setActivePageCollection(pageNumber);
                localStorage.setItem('activePageCollection', pageNumber.toString());
            }
        } else {
            if (props.activePage !== pageNumber) {
                props.setActivePage(pageNumber);
                localStorage.setItem('activePage', pageNumber.toString());
            }
        }
    }


    const activePageToUse = useMemo(() => props.isMyCollectionPage ? props.activePageCollection : props.activePage, [props.activePage, props.activePageCollection, props.isMyCollectionPage]);

    const spanGroup = Array.from({ length: props.totalPages }, (_, p) => 
        <button  className={`pagination-item ${p+1} ${activePageToUse === p + 1 ? "active" : ""}`}
                key={p+1}
                onClick={() => handleClick(p+1)}
        >
        {p + 1}
        </button>);

return (
        <div className="pagination-wrapper">
            {spanGroup}
        </div>
    )
}