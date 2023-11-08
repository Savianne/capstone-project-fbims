import { Link, useNavigate } from "react-router-dom";
import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import RouteContentBase, { RouteContentBaseHeader, RouteContentBaseBody } from "../RouteContentBase";
import doRequest from "../../../API/doRequest";
import Devider from "../../reusables/devider";
import SiteMap from "../SiteMap";
import GoBackBtn from "../../GoBackBtn";
import Button from "../../reusables/Buttons/Button";
import AddCategoryForm from "./AddCategoryForm";
import AddCategoryBanner from "./AddCategoryBanner";
import Categories, {ICategory} from "./Categories";
import SkeletonLoading from "../../reusables/SkeletonLoading";
import CreateEntryForm from "./CreateEntryForm";
import GenerateReportForm from "./GenerateReportForm";
import Scrollbar from "../../reusables/ScrollBar";

const IsLoadingCategories = styled.div`
    display: grid;
    flex: 1;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    grid-gap: 20px;
`;

const ContentWraper = styled.div`
    display: flex;
    flex: 1;
    flex-wrap: wrap;
    height: calc(100vh - 161.8px);
    overflow: hidden;
    padding: 15px 5px;
    gap: 5px;

    .tool-bar {
        display: flex;
        flex: 0 1 100%;
        border-bottom: 2px solid #2196F3;
        padding: 0 0 10px 0;
        align-items: center;

        .btn-group {
            display: flex;
            width: fit-content;
            height: fit-content;
            margin-left: auto;
        }

    }

    .forms-input-container,
    .categories-container {
        display: flex;
        flex-wrap: wrap;
        height: 100%;
        align-content: flex-start;
    }

    .forms-input-container {
        flex: 1;
        /* padding: 0 15px; */
    }
    
    .categories-container {
        flex: 1.5;
        border: 1px solid ${({theme}) => theme.borderColor};
        border-radius: 5px;
    }

    .forms-input-container .container-title,
    .categories-container .container-title {
        flex: 0 1 100%;
        font-size: 20px;
        font-weight: 600;
        padding: 5px 0 10px 0;
        color: ${({theme}) => theme.textColor.strong};
    }

    .categories-container .container-title {
        display: flex;
        align-items: center;
        padding: 10px;
        border-bottom: 1px solid ${({theme}) => theme.borderColor};
        margin-bottom: 10px;

        .category-count {
            display: inline-flex;
            align-items: center;
            color: ${({theme}) => theme.textColor.strong};
            align-items: center;
            margin-left: auto;

            .count {
                font-size: 20px;
                font-weight: bold;

            }

        }
    }

    .categories-container .scroll,
    .forms-input-container .scroll {
        display: flex;
        flex: 0 1 100%;
        height: calc(100% - 75px);
    }

    .forms-input-container .scroll {
        height: 100%;
    }

    .categories-container .scroll ${Categories},
    .categories-container .scroll ${IsLoadingCategories} {
        padding: 0 15px;
        padding-bottom: 20px;
    }

    .forms-input-container .scroll ${AddCategoryForm},
    .forms-input-container .scroll ${CreateEntryForm},
    .forms-input-container .scroll ${GenerateReportForm} {
        margin-right: 15px;
    }
`;

const Attendance: React.FC = () => {
    const [isLoadingCategories, setIsLoadingCategories] = React.useState(false);
    const [categories, setCategories] = React.useState<ICategory[]>([]);

    React.useEffect(() => {
        doRequest<ICategory[]>({
            url: "/attendance/congregation-attendance-categoty",
            method: "GET"
        })
        .then(result => {
            setIsLoadingCategories(false);
            if(result.success) {
                setCategories(result.data as ICategory[])
            } else throw result.error
        })
        .catch(err => {
            setIsLoadingCategories(false);
            console.log(err)
        })
    }, []);

    React.useEffect(() => {
        console.log(categories)
    }, [categories])
    return (<>
        <RouteContentBase>
            <RouteContentBaseHeader>
                <strong>Attendance</strong>
                <Devider $orientation="vertical" $variant="center" $css="margin: 0 5px" />
                <SiteMap>
                    / <Link to='/attendance'> attendance</Link>
                </SiteMap>
                <GoBackBtn />
            </RouteContentBaseHeader>
            <RouteContentBaseBody>
                <ContentWraper>
                    {/* <div className="tool-bar">
                        <span className="category-count">
                            <p className="count">5</p>
                            <p>Categories</p>
                        </span>
                        <div className="btn-group">
                            <Button color="primary" label="Create Entry" icon={<FontAwesomeIcon icon={['fas', 'clipboard-list']}/>} />
                            <Button color="primary" label="Generate Report" icon={<FontAwesomeIcon icon={['fas', 'file-pdf']}/>} />
                        </div>
                    </div> */}
                    <div className="forms-input-container">
                        <div className="scroll">
                            <Scrollbar>
                                <h1 className="container-title">Add Category</h1>
                                <AddCategoryForm dispatch={(category) => setCategories([category, ...categories])}/>
                                <h1 className="container-title">Create Entry</h1>
                                <CreateEntryForm categories={categories}/>
                                <h1 className="container-title">Generate Report</h1>
                                <GenerateReportForm />
                            </Scrollbar>
                        </div>
                    </div>
                    <div className="categories-container">
                        <h1 className="container-title">
                            Categories
                            <span className="category-count">
                                <p className="count">{categories.length}</p>
                            </span>    
                        </h1>
                        {
                            isLoadingCategories? 
                            <div className="scroll">
                                <Scrollbar>
                                    <IsLoadingCategories>
                                        <SkeletonLoading height="170px" />
                                        <SkeletonLoading height="170px" />
                                        <SkeletonLoading height="170px" />
                                        <SkeletonLoading height="170px" />
                                    </IsLoadingCategories>
                                </Scrollbar>
                            </div> : <>
                            {
                                categories.length? 
                                <div className="scroll">
                                    <Scrollbar>
                                        <Categories categories={categories} onDeleted={(uid) => setCategories(categories.filter(c => c.uid !== uid))}/>
                                    </Scrollbar>
                                </div> : 
                                <AddCategoryBanner>
                                    <img src="/assets/images/attendance.png" alt="banner-img" />
                                    <h1 className="primary-text">CATEGORIZE ATTENDANCE AND TRACK AS ONE.</h1>
                                </AddCategoryBanner>
                            }
                            </>
                        }
                    </div>
                </ContentWraper>
            </RouteContentBaseBody>
        </RouteContentBase>
    </>)
};



export default Attendance;