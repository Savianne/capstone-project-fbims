import React from 'react';
import styled from 'styled-components';
import SkeletonLoading from '../../../reusables/SkeletonLoading';
import { IStyledFC } from '../../../IStyledFC';

const AttendanceCategorySkeletoFC: React.FC<IStyledFC> = ({className}) => {
    return(
        <div className={className}>
            <header>
                <div className="title">
                    <SkeletonLoading />
                </div>
                <div className="list-view-toggle">
                    <div className="toggle">
                        <SkeletonLoading />
                    </div>
                    <div className="toggle">
                        <SkeletonLoading />
                    </div>
                </div>
            </header>
            <div className="btn-row">
                <div className="btn"><SkeletonLoading /></div>
                <div className="btn"><SkeletonLoading /></div>
                <div className="btn"><SkeletonLoading /></div>
            </div>
            <div className="list-toolbar">
                <SkeletonLoading />
            </div>
            <div className="list">
                <SkeletonLoading height={140} /><SkeletonLoading height={140} /><SkeletonLoading height={140} /><SkeletonLoading height={140} /><SkeletonLoading height={140} />
                <SkeletonLoading height={140} /><SkeletonLoading height={140} /><SkeletonLoading height={140} /><SkeletonLoading height={140} /><SkeletonLoading height={140} />
            </div>
        </div>
    )
}

const AttendanceCategorySkeleton = styled(AttendanceCategorySkeletoFC)`
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start; 
    flex: 0 1 100%;
    
    && > header {
        display: flex;
        flex: 0 1 100%;
        align-items: center;
        height: 50px;
        /* /background-color: gray; */

        .title {
            display: inline-block;
            height: 30px;
            width: 200px;
        }

        .list-view-toggle {
            display: flex;
            gap: 5px;
            width: fit-content;
            height: fit-content;
            margin-left: auto;

            .toggle {
                display: inline-block;
                height: 30px;
                width: 30px;
            }
        }
    }

    .btn-row {
        display: flex;
        flex: 0 1 100%;
        gap: 10px;
        margin-top: 10px;
        height: fit-content;

        .btn {
            display: inline-block;
            height: 50px;
            width: 120px;
        }
    }

    .list-toolbar {
        display: flex;
        flex: 0 1 100%;
        height: 60px;
        margin-top: 15px;
    }

    .list {
        display: grid;
        flex: 0 1 100%;
        margin-top: 15px;
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
        grid-gap: 20px;
    }
`;

export default AttendanceCategorySkeleton;