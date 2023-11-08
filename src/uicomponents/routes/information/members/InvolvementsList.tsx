import React, { ReactNode } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IStyledFC } from "../../../IStyledFC";
import UseRipple from "../../../reusables/Ripple/UseRipple";
import { MinistryListItem, OrgaizationListItem } from "../GroupList";
import Revealer from "../../../reusables/Revealer";
interface IInvolvementsList extends IStyledFC {
    orgs: {
        avatar: null | string,
        description: string,
        organizationName: string,
        organizationUID: string
    }[] | null, 
    ministries: {
        avatar: null | string,
        description: string,
        ministryName: string,
        ministryUID: string
    }[] | null
}

const FCInvolvementsList: React.FC<IInvolvementsList> = ({className, orgs, ministries}) => {
    const [revealMinistryList, setRevealMinistryList] = React.useState(false);
    const [revealOrgList, setRevealOrgList] = React.useState(false);

    React.useEffect(() => {
        if(orgs && ministries) {
            orgs.length <= 3 && setRevealOrgList(true);
            ministries.length <= 3 && setRevealMinistryList(true)
        }
    }, [orgs, ministries])
    return (
        <div className={className}>
            <InvoleveMementsListReveal involvements={ministries? ministries.length : 0} group="Ministries" icon={<FontAwesomeIcon icon={["fas", "hand-holding-heart"]} />} reveal={revealMinistryList} onClick={() => setRevealMinistryList(!revealMinistryList)}/>
            <Revealer reveal={revealMinistryList}>
                {
                    ministries && ministries.map(ministry => (
                        <MinistryListItem key={ministry.ministryUID} avatar={ministry.avatar} groupName={ministry.ministryName} groupUID={ministry.ministryUID} />
                    ))
                }
            </Revealer>
            <InvoleveMementsListReveal involvements={orgs? orgs.length : 0} group="Organizations" icon={<FontAwesomeIcon icon={["fas", "people-group"]} />} reveal={revealOrgList} onClick={() => setRevealOrgList(!revealOrgList)} />
            <Revealer reveal={revealOrgList}>
                {
                    orgs && orgs.map(org => (
                        <OrgaizationListItem key={org.organizationUID} avatar={org.avatar} groupName={org.organizationName} groupUID={org.organizationUID} />
                    ))
                }
            </Revealer>
        </div>
    )
}

interface IInvoleveMementsListReveal extends IStyledFC {
    icon: ReactNode;
    group: string,
    involvements: number,
    reveal?: boolean,
    onClick?: () => void
}

const InvoleveMementsListRevealFC:React.FC<IInvoleveMementsListReveal> = ({className, icon, group, involvements, reveal, onClick}) => {

    return(
    <div className={className}>
        <span className="icon">
            {icon}
        </span>
        <span className="row">
            <h1>{group}</h1>
            <p>{involvements} involvements</p>
        </span>
        {
            involvements? <span className="arrow">
                <UseRipple onClick={() => onClick && onClick()}>
                    <FontAwesomeIcon icon={["fas", "angle-down"]} />
                </UseRipple>
            </span> : ''
        }
        
    </div>
    ) 
}

const InvoleveMementsListReveal = styled(InvoleveMementsListRevealFC)`
    display: flex;
    flex: 0 1 100%;
    padding: 10px 0;
    align-items: center;
    border-radius: 5px;
    /* background-color: ${({theme}) => theme.background.light}; */
    margin-bottom: 10px;

    .icon {
        display: inline-flex;
        height: 50px;
        width: 50px;
        border-radius: 50%;
        color: white;
        background-color: #081b9a;
        align-items: center;
        justify-content: center;
    }

    .row {
        display: flex;
        flex: 1;
        flex-wrap: wrap;
        margin-left: 10px;

        h1 {
            padding: 0;
            margin: 0;
            flex: 0 1 100%;
            font-size: 25px;
            font-weight: 600;
            color: ${({theme}) => theme.textColor.strong};
        }

        p {
            font-size: 15px;
            color: ${({theme}) => theme.textColor.light};
        }
    }

    .arrow {
        height: 40px;
        width: 40px;
        background-color: ${({theme}) => theme.background.lighter};;
        border-radius: 50%;
        margin-left: auto;
        
        ${UseRipple} {
            display: inline-flex;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            align-items: center;
            justify-content: center;
            color: ${({theme}) => theme.textColor.strong};
            rotate: ${(props) => props.reveal? "180deg" : 0};
            transition:  rotate 300ms ease-in-out;
            cursor: pointer;
        }
    }
`;

const InvolvementsList = styled(FCInvolvementsList)`
    display: flex;
    flex: 1;
    flex-wrap: wrap;
    padding: 30px;
    border-radius: 5px;
    border: 1px solid ${({theme}) => theme.borderColor};
`;

export default InvolvementsList;

