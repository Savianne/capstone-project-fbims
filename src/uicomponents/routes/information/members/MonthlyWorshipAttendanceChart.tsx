import React from "react";
import styled from "styled-components";
import { IStyledFC } from "../../../IStyledFC";
import { Pie } from 'react-chartjs-2';

interface IMonthlyWorshipAttendanceChart extends IStyledFC {
    memberUID: string
}

const FCMonthlyWorshipAttendanceChart: React.FC<IMonthlyWorshipAttendanceChart> = ({className, memberUID}) => {

    const data = {
        labels: ['Absence', ' Engagements'],
        datasets: [
          {
            label: 'Monthly Worship Attendance Chart',
            data: [12, 19],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
            ],
            borderWidth: 1,
          },
        ],
      };
    return (
        <div className={className}>
            <Pie data={data} />
        </div>
    )
};

const MonthlyWorshipAttendanceChart = styled(FCMonthlyWorshipAttendanceChart)`
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    padding: 30px;
    border-radius: 5px;
    background-color: ${({theme}) => theme.background.lighter};
`;

export default MonthlyWorshipAttendanceChart;