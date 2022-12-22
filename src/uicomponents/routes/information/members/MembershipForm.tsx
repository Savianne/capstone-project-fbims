import React from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import RouteContentBase, { RouteContentBaseHeader, RouteContentBaseBody } from "../../RouteContentBase";

import Devider from "../../../reusables/devider";
import { SiteMap } from "../Information";
import GoBackBtn from "../../../GoBackBtn";
import Input from "../../../reusables/Inputs/Input";
import FormControl from "../../../reusables/FormControl/FormControl";
import Select, { Option } from "../../../reusables/Inputs/Select";

//Custom Hooks
import useFormControl from "../../../../utils/hooks/useFormControl";
import { InputFiles } from "typescript";

const ContentWraper = styled.div`
    display: flex;
    flex: 1;
    justify-content: center;
    flex-wrap: wrap;
    padding: 15px 5px;

    & #membershipForm {
        display: flex;
        flex-wrap: wrap;
        flex: 0 1 800px;
        padding: 15px;
        height: fit-content;
        background-color:  ${({theme}) => theme.background.primary};
        /* box-shadow: 3px 3px 5px 1px rgb(0 0 0 / 5%); */
    }

    & #membershipForm .information-category-title {
        flex: 0 1 100%;
        height: fit-content;
        text-align: center;
        border-bottom: 1px solid ${({theme}) => theme.borderColor};
        padding-bottom: 5px;
        margin-bottom: 15px;
        color: ${({theme}) => theme.textColor.strong};
    }

    & #membershipForm .data-category {
        display: flex;
        flex: 0 1 100%;
        align-items: center;
        padding: 10px 0;
    }

    & #membershipForm .data-category .data-category-title-container,
    & #membershipForm .data-category .input-category-group {
        display: flex;
        flex: 0 0 70px;
        height: 50px;
    }
    
    & #membershipForm .data-category .data-category-title-container {
        background-color: ${({theme}) => theme.background.light};
        align-items: center;
        justify-content: center;
        flex-direction: column;
    }

    & #membershipForm .data-category .data-category-title-container p {
        font-size: 11px;
    }

    & #membershipForm .full-name-group .data-category-title-container {
        background-color: #019aff33;
        color: #4bb2f7;
    }

    & #membershipForm .birth-date-group .data-category-title-container {
        background-color: #ffb72f75;
        color: #ffac1f;
    }

    & #membershipForm .gender-group .data-category-title-container {
        background-color: #f696fc52;
        color: #ee3ff9;
    }

    & #membershipForm .marital-status-group .data-category-title-container {
        background-color: #fd151547;
        color: #f74a4a;
    }

    & #membershipForm .address-group .data-category-title-container {
        background-color: #2dff7636;
        color: #23c703;
    }

    & #membershipForm .contact-group .data-category-title-container {
        background-color: #4706a13d;
        color: #5407c0;
    }

    & #membershipForm .data-category .input-category-group {
        flex: 0 1 100%;
        height: fit-content;
    }

    & #membershipForm .data-category .input-category-group ${Input},
    & #membershipForm .data-category .input-category-group ${Select} {
        /* border-left: 1px solid ${({theme}) => theme.borderColor}; */
        margin-left: 10px;
    }
`;

const MembershipForm: React.FC = ({}) => {
    const [jsonData, inputFields, formState] = useFormControl([{name: 'firstName', required: true}, {name: 'email'}]);

    React.useEffect(() => {
        // inputFields && console.log(inputFields['firstName']);

        const t = [
            {name: 'fname', val: 'hello'},
            {name: 'lname', val: 'hello to the worls'},
            {name: 'mname', val: 'goodmorning'}
        ];

        function createType(p: {name: string, val: string}) {
            return {
                [p.name]: p.val
            }
        }

        const obj = t.reduce((p, c) => {
            return {...p, ...createType(c)}
        }, {});
        
        console.log(obj);

    }, [inputFields])
    return (
        <RouteContentBase>
            <RouteContentBaseHeader>
                <strong>Membership Form</strong>
                <Devider $orientation="vertical" $variant="center" $css="margin: 0 5px" />
                <SiteMap>
                    / <Link to='/information'> information</Link>  / <Link to='/information/members'> members</Link>
                </SiteMap>
                <GoBackBtn />
            </RouteContentBaseHeader>
            <RouteContentBaseBody>
                <ContentWraper>
                    <Input name="first-name" type="text" placeholder="First Name" />
                    <Input name="middle-name" type="text" placeholder="Middle Name" />
                    <Input name="last-name" type="text" placeholder="Last Name" />
                    {/* <div id="membershipForm">
                        <strong className="information-category-title">Personal Information</strong>
                        <div className="data-category full-name-group">
                            <span className="data-category-title-container">
                                <FontAwesomeIcon icon={["fas", "user"]} />
                                <p>Full Name</p>
                            </span>
                            <Devider $orientation="vertical" $variant="center" $css="margin: 0 5px" />
                            <div className="input-category-group">
                                <Input placeholder="First Name"   type="text" />
                                <Input type="text" placeholder="Middle Name" onValChange={(e) => console.log(e)} />
                                <Input type="text" placeholder="Surname" onValChange={(e) => console.log(e)} />
                                <Select placeholder="Ex. Name">
                                    <Option value="">Please select</Option>
                                    <Option value="jr">JR</Option>
                                    <Option value="sr">SR</Option>
                                </Select>
                            </div>
                        </div>
                        <div className="data-category birth-date-group">
                            <span className="data-category-title-container">
                                <FontAwesomeIcon icon={["fas", "cake-candles"]} />
                                <p>Date of Birth</p>
                            </span>
                            <Devider $orientation="vertical" $variant="center" $css="margin: 0 5px" />
                            <div className="input-category-group">
                                <Input type="number" placeholder="Email Address" onValChange={(e) => console.log(e)} />
                                <Input type="email" placeholder="Email Address" onValChange={(e) => console.log(e)} />
                                <Input type="email" placeholder="Email Address" onValChange={(e) => console.log(e)} />
                            </div>
                        </div>
                        <div className="data-category gender-group">
                            <span className="data-category-title-container">
                                <FontAwesomeIcon icon={["fas", "venus-mars"]} />
                                <p>Gender</p>
                            </span>
                            <Devider $orientation="vertical" $variant="center" $css="margin: 0 5px" />
                            <div className="input-category-group">
                                <Select placeholder="Gender">
                                    <Option value="">Please select</Option>
                                    <Option value="male">Male</Option>
                                    <Option selected value="female">Female</Option>
                                    <Option value="gay1">Gay1</Option>
                                    <Option value="male1">Male1</Option>
                                    <Option value="female1">Female1</Option>
                                </Select>
                            </div>
                        </div>
                        <div className="data-category marital-status-group">
                            <span className="data-category-title-container">
                                <FontAwesomeIcon icon={["fas", "heart"]} />
                                <p>Marital Status</p>
                            </span>
                            <Devider $orientation="vertical" $variant="center" $css="margin: 0 5px" />
                            <div className="input-category-group">
                                <Input type="number" placeholder="Email Address" onValChange={(e) => console.log(e)} />
                            </div>
                        </div>
                        <div className="data-category address-group">
                            <span className="data-category-title-container">
                                <FontAwesomeIcon icon={["fas", "map-location-dot"]} />
                                <p>Address</p>
                            </span>
                            <Devider $orientation="vertical" $variant="center" $css="margin: 0 5px" />
                            <div className="input-category-group">
                                <Input type="email" placeholder="Email Address" onValChange={(e) => console.log(e)} />
                                <Input type="email" placeholder="Email Address" onValChange={(e) => console.log(e)} />
                                <Input type="email" placeholder="Email Address" onValChange={(e) => console.log(e)} />
                            </div>
                        </div>
                        <div className="data-category contact-group">
                            <span className="data-category-title-container">
                                <FontAwesomeIcon icon={["fas", "map-location-dot"]} />
                                <p>Contact</p>
                            </span>
                            <Devider $orientation="vertical" $variant="center" $css="margin: 0 5px" />
                            <div className="input-category-group">
                                <Input type="email" placeholder="Email Address" onValChange={(e) => console.log(e)} />
                                <Input type="email" placeholder="Email Address" onValChange={(e) => console.log(e)} />
                            </div>
                        </div>
                        <strong className="information-category-title">Contact Information</strong>
                    </div> */}
                </ContentWraper>
            </RouteContentBaseBody>
        </RouteContentBase>
    )
}

export default MembershipForm;