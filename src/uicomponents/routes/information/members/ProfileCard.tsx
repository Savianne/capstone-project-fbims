import React from "react";
import styled from "styled-components";
import { IStyledFC } from "../../../IStyledFC";
import Avatar from "../../../reusables/Avatar";
import DataDisplayChip from "../../../reusables/DataDisplayChip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../../../reusables/Buttons/Button";
import Menu, { MenuItem, MenuItemIcon, MenuItemLabel} from "../../../reusables/Menu/Menu";
import Devider from "../../../reusables/devider";
import UseRipple from "../../../reusables/Ripple/UseRipple";
import { useNavigate } from "react-router-dom";

const MenuBtn = styled(UseRipple)`
    display: flex;
    width: 23px;
    height: 23px;
    border: 1.5px solid ${({theme}) => theme.textColor.strong};
    border-radius: 50%;
    align-items: center;
    justify-content: center;
    color: ${({theme}) => theme.textColor.strong};
    font-size: 13px;
    cursor: pointer;

    & #ripple {
        background-color: whitesmoke;
    }

`

interface IProfileCard extends IStyledFC {
    name: string,
    picture: null| string,
    memberUID: string
}

const FCProfileCard: React.FC<IProfileCard> = ({className, name, picture, memberUID}) => {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <div className={className}>
            <Avatar round={false} src={picture} alt={name} size="180px" />
            <div className="row">
                <h1 className="name">{name}</h1>
                <p className="memberuid"><FontAwesomeIcon icon={["fas", "user"]} style={{marginRight: "5px", fontSize: '13px'}}/> {memberUID}</p>
                <DataDisplayChip 
                variant="outlined"
                icon={
                    <span className="fa-layers fa-fw fa-lg">
                        <FontAwesomeIcon icon={["fas", "certificate"]} />
                        <FontAwesomeIcon icon={["fas", "check"]} transform="shrink-6" inverse />
                    </span>
                }>Active member</DataDisplayChip>
                <div className="overall-performance-data">
                    <div className="data-category">
                        <p className="data-label">Current Worship Streaks</p>
                        <span>
                            <FontAwesomeIcon icon={["fas", "fire"]} style={{color: 'orange'}} />
                            <p className="data">23</p>
                        </span>
                    </div>
                    <Devider $orientation="vertical" $variant="center" $css="height: 60px; border-width: 4px; margin: 0 10px 0 0" />
                    <div className="data-category">
                        <p className="data-label">Highest Worship Streaks</p>
                        <span>
                            <FontAwesomeIcon icon={["fas", "fire"]} style={{color: 'orange'}} />
                            <p className="data">30</p>
                        </span>
                    </div>
                    <Devider $orientation="vertical" $variant="center" $css="height: 60px; border-width: 4px; margin: 0 10px 0 0" />
                    <div className="data-category">
                        <p className="data-label">Worship Streaks Rank</p>
                        <span>
                            <FontAwesomeIcon icon={["fas", "certificate"]} style={{color: 'orange'}} />
                            <p className="data">89</p>
                        </span>
                    </div>
                    <Devider $orientation="vertical" $variant="center" $css="height: 60px; border-width: 4px; margin: 0 10px 0 0" />
                    <div className="data-category">
                        <p className="data-label">Givings</p>
                        <span>
                            <FontAwesomeIcon icon={["fas", "hand-holding-heart"]} style={{color: 'pink'}} />
                            <p className="data">1500</p>
                        </span>
                    </div>
                </div>
                <MenuBtn onClick={handleClick}><FontAwesomeIcon icon={["fas", "ellipsis-h"]} /></MenuBtn>
                <Menu
                placement="left"
                anchorEl={anchorEl} 
                open={open} 
                onClose={handleClose}>
                    <MenuItem onClick={() => {
                        handleClose();
                        navigate(`/app/information/members/edit/${memberUID}`)
                    }}>
                        <MenuItemIcon><FontAwesomeIcon icon={["fas", "edit"]} /></MenuItemIcon>
                        <MenuItemLabel>Edit Information</MenuItemLabel>
                    </MenuItem>
                    <MenuItem>
                        <MenuItemIcon><FontAwesomeIcon icon={["fas", "trash"]} /></MenuItemIcon>
                        <MenuItemLabel>Remove</MenuItemLabel>
                    </MenuItem>
                    <MenuItem>
                        <MenuItemIcon><FontAwesomeIcon icon={["fas", "print"]} /></MenuItemIcon>
                        <MenuItemLabel>Print ID</MenuItemLabel>
                    </MenuItem>
                </Menu>
            </div>
        </div>
    )
}

const ProfileCard = styled(FCProfileCard)`
    && {
        display: flex;
        flex: 0 1 100%;
        flex-wrap: wrap;
        min-height: 190px;
        background-color: ${({theme}) => theme.background.lighter};
        border-radius: 5px;
        align-items: center;
        justify-content: center;
        padding: 30px;
        color: ${({theme}) => theme.textColor.strong};
    
        .row {
            position: relative;
            display: flex;
            flex: 1;
            flex-wrap: wrap;
            height: 180px;
            min-width: 250px;
            margin-left: 20px;
            align-content: flex-start;
    
            .name {
                flex: 0 1 100%;
                font-size: 30px;
                font-variant-caps: all-small-caps;
                font-weight: 600;
            }
    
            .memberuid {
                flex: 0 1 100%;
                font-size: 13px;
                color: ${({theme}) => theme.textColor.light};
                margin-bottom: 10px;
            }
            
            .overall-performance-data {
                display: flex;
                flex: 0 1 100%;
                margin-top: 5px;
                height: fit-content;
                align-items: center;
                padding-top: 5px;
                /* background-color: pink; */
                border-top: 1px solid ${({theme}) => theme.borderColor};
                /* justify-content: flex-end; */
    
                .data-category {
                    display: flex;
                    flex: 0 1 150px;
                    flex-wrap: wrap;
                    
                    .data-label {
                        flex: 0 1 100%;
                        color: ${({theme}) => theme.textColor.light};
                        font-size: 12px;
                        font-weight: 600;
                    }
    
                    span {
                        display: flex;
                        flex: 0 1 100%;
                        align-items: center;
                        font-size: 30px;
                        font-weight: bold;
    
                        p {
                            margin-left: 10px;
                        }
                    }
                }
            }
    
            ${MenuBtn} {
                position: absolute;
                top: 0;
                right: 0;
            }
            
        }
    }
`;

export default ProfileCard

