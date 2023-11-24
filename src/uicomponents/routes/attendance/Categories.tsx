import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import ScaleLoader from "react-spinners/ScaleLoader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import doRequest from "../../../API/doRequest";
import AvatarGroup from "../../reusables/AvatarGroup";
import { IStyledFC } from "../../IStyledFC";
import Button from "../../reusables/Buttons/Button";
import useAddSnackBar from "../../reusables/SnackBar/useSnackBar";
import useConfirmModal from "../../reusables/ConfirmModal/useConfirmModal";
import ConfirmModal from "../../reusables/ConfirmModal/ConfirmModal";

export interface ICategory {
    title: string;
    type: "basic" | "detailed";
    attender: "all" | "select";
    uid: string
}

interface IDeleteCategoryBtn extends IStyledFC {
    categoryUID: string,
    categoryTitle: string,
    onDeleteSuccess: () => void,
    onDelete: () => void
}

const DeleteCategoryBtnF: React.FC<IDeleteCategoryBtn> = ({className, categoryUID, onDeleteSuccess, categoryTitle, onDelete}) => {
    const [isDeleting, setIsDeleting] = React.useState(false);
    const {modal, confirm} = useConfirmModal();
    const addSnackbar = useAddSnackBar();

    return(<>
        <ConfirmModal context={modal} variant={"delete"} />
        <Button isLoading={isDeleting} label="delete-category" icon={<FontAwesomeIcon icon={["fas", "trash"]} />} iconButton color="delete" variant="hidden-bg-btn" 
        onClick={() => {
            confirm("Delete Category", `Are you sure you want to delete ${categoryTitle} category?`, () => {
                setIsDeleting(true);
                onDelete();
                doRequest({
                    url: `/attendance/delete-attendance-category/${categoryUID}`,
                    method: "DELETE",
                })
                .then(response => {
                    if(response.success) {
                        setIsDeleting(false);
                        onDeleteSuccess();
                        addSnackbar("Delete Category success!", "default", 5)
                    } else throw response.error
                })
                .catch(err => {
                    setIsDeleting(false);
                    addSnackbar("Delete Category failed!", "error", 5);
                })
            })
        }}/>
    </>
    )
}
interface ICategories extends IStyledFC {
    categories: ({data: ICategory, fetchTotalEntryIncrementalVal: number})[];
    onDeleted: (uid: string) => void,
}

const FCCategories: React.FC<ICategories> = ({className, categories, onDeleted}) => {
    
    return (
        <div className={className}>
            {
                categories.map(category => {
                    return(
                        <Category key={category.data.uid} category={category} onDeleted={() => onDeleted(category.data.uid)}/>
                    )
                })
            }
            
        </div>
    )
}

const Categories = styled(FCCategories)`
    display: grid;
    flex: 1;
    padding: 20px;
    /* border: 1px solid ${({theme}) => theme.borderColor}; */
    /* min-width: 300px; */
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    grid-gap: 20px;
`;

interface ICategoryFC extends IStyledFC {
    category: {data: ICategory, fetchTotalEntryIncrementalVal: number};
    onDeleted: () => void
}

const FCCategory: React.FC<ICategoryFC> = ({className, category, onDeleted}) => {
    const navigate = useNavigate();
    const [isLoadingAttenders, setIsLoadingAttenders] = React.useState(true);
    const [isLoadingTotalEntries, setIsLoadingTotalEntries] = React.useState(true);
    const [isErrorLoadingTotalEntries, setIsErrorLoadingTotalEntries] = React.useState(false);
    const [attenders, setAttenders] = React.useState<({name: string, picture: string | null, memberUID: string})[]>([]);
    const [entries, setEntries] = React.useState(0);
    const [categoryOnDelete, setCategoryOnDelete] = React.useState(false);
    const compRef = React.useRef<HTMLDivElement | null>(null);

    const fetchTotalEntries = () => {
        setIsLoadingTotalEntries(true);
        doRequest<number>({
            url: `/attendance/get-attendance-category-total-entries/${category.data.uid}`
        })
        .then(response => {
            setEntries(response.data as number)
        })
        .catch(err => {
            setIsErrorLoadingTotalEntries(true);
        })
        .finally(() => {
            setIsLoadingTotalEntries(false)
        });
    }

    React.useEffect(() => {
        if(category.data.attender == "select") {
            doRequest<({name: string, picture: string | null, memberUID: string})[]>({
                url: `/attendance/attendance-categoty-attenders/${category.data.uid}`,
                method: "GET"
            })
            .then(result => {
                if(result.success) {
                    setAttenders(result.data as ({name: string, picture: string | null, memberUID: string})[]);
                } else throw result.error
            })
            .catch(err => {
                console.log(err)
            })
            .finally(() => {
                setIsLoadingAttenders(false);
            })
        } else {
            setIsLoadingAttenders(false);
        }

        fetchTotalEntries();

    }, []);

    React.useEffect(() => {
        fetchTotalEntries()
    }, [category.fetchTotalEntryIncrementalVal]);

    React.useEffect(() => {
        compRef.current?.setAttribute('onDelete', categoryOnDelete? "true" : "false");
    }, [categoryOnDelete])
    return(
        <div className={className} ref={compRef}>
            <div className="top-container">
                <h3>{category.data.title}</h3>
                {
                    !isLoadingTotalEntries && entries == 0? <>
                    <span className="btn-area">
                        <DeleteCategoryBtnF onDelete={() => setCategoryOnDelete(true)} categoryTitle={category.data.title} categoryUID={category.data.uid} onDeleteSuccess={() => {
                            setTimeout(() => {
                                onDeleted()
                            }, 1000)
                        }} />
                    </span>
                    </> : ""
                }
            </div>
            <span className="data-row">
                <strong>Type: </strong>
                <p>{category.data.type == "basic"? "Basic (Present/Absent)" : "Detailed (Time-in/Time-out)"}</p>
            </span>
            <span className="data-row">
                <strong>Attenders: </strong>
                {
                    isLoadingAttenders? <ScaleLoader color="#36d7b7" height={"15px"}/> : <>
                        {
                            category.data.attender == "all"? <p>All Members</p> : <AvatarGroup avatars={attenders.map(att => ({src: att.picture, alt: att.name}))} limit={5} size="30px" />
                        }
                    </>
                }
            </span>
            <div className="bot-container">
                {
                    isLoadingTotalEntries? <ScaleLoader color="#36d7b7" height={"15px"}/> : 
                    isErrorLoadingTotalEntries? <span className="error-loading-total-entries">
                        <FontAwesomeIcon icon={["fas", "exclamation-circle"]} /> <p>error!</p>
                    </span> : <>
                        <p className="entries-count">{entries}</p>
                        <p>{entries <= 1? "Entry" : "Entries"}</p>
                    </>
                }
                
                <Button label="view" icon={<FontAwesomeIcon icon={["fas", "angle-right"]} />} iconButton color="theme" variant="hidden-bg-btn" onClick={() => navigate(`/app/attendance/category/${category.data.uid}`)}/>
            </div>
        </div>
    )
}

const Category = styled(FCCategory)`
    position: relative;
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    flex: 1;
    height: 170px;
    box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
    /* box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25); */
    /* background-color: ${({theme}) => theme.mode == 'dark'? '#383e51' : theme.background.lighter}; */
    background-color: ${({theme}) => theme.background.primary};
    padding: 20px;
    border-radius: 5px;
    min-width: 0;
    transition: opacity 300ms;
    
    &&[onDelete=true] {
        opacity: 0.4;
    }

    &&[onDelete=false] {
        opacity: 1;
    }

    :hover {
        transition: box-shadow 300ms;
        /* box-shadow: 0 8px 8px 0 rgba(0, 0, 0, 0.25); */
    }

    && .data-row {
        display: flex;
        flex: 0 1 100%;
        padding: 5px 0;
        font-size: 13px;
        align-items: center;
        color: ${({theme}) => theme.textColor.light};

        strong {
            font-weight: 700;
            margin-right: 5px;
        }
    }

    && .top-container {
        display: flex;
        flex: 0 1 100%;
        align-items: center;
        min-width: 0;
        
        h3 {
            /* display: flex; */
            flex: 1;
            font-size: 25px;
            min-width: 0;
            font-weight: 600;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            color: ${({theme}) => theme.textColor.strong};
        }

        .btn-area {
           width: fit-content;
           display: flex;
           justify-content: flex-end;
        }
    }

    .bot-container {
        display: flex;
        align-items: center;
        width: 90%;
        padding: 0 5%;
        height: 70px;
        /* background-color: #303347; */
        background-color: #455A64;
        position: absolute;
        bottom: 0;
        left: 0;
        border-radius: 0 0 5px 5px;
        color: white;

        .entries-count {
            font-size: 30px;
            font-weight: bold;
            margin-right: 5px;
        }

        .error-loading-total-entries {
            display: flex;
            width: fit-content;
            align-items: center;
            color: ${({theme}) => theme.staticColor.delete};
        }

        .error-loading-total-entries > p {
            margin-left: 5px;
        }

        ${Button} {
            margin-left: auto;
            color: white;

            :hover {
                background-color: #323d5c;
            }
        }
    }
`;


export default Categories;