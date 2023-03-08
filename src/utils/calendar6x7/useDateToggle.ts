import React from "react";

type TState = {
    onViewDate: Date;
  };
  
type TAction = { type: 'prevMonth' } | { type: 'nextMonth' } | { type: 'prevDate' } | { type: 'nextDate' } | { type: 'today' };

function reducer(state: TState, action: TAction): TState {
    switch (action.type) {
        case 'prevMonth': 
            const prevMonth = new Date(state.onViewDate.getFullYear(), state.onViewDate.getMonth() - 1);
            return { onViewDate: prevMonth };
        case 'nextMonth':
            const nextMonth = new Date(state.onViewDate.getFullYear(), state.onViewDate.getMonth() + 1);
            return { onViewDate: nextMonth };
        case 'prevDate':
            const prevDay = new Date(state.onViewDate.getFullYear(), state.onViewDate.getMonth(), state.onViewDate.getDate() - 1);
            return { onViewDate: prevDay };
        case 'nextDate':
            const nextDay = new Date(state.onViewDate.getFullYear(), state.onViewDate.getMonth(), state.onViewDate.getDate() + 1);
            return { onViewDate: nextDay };
        case "today":
            return { onViewDate: new Date() }
        default:
            return { onViewDate: new Date() }

    }
  }

function useDateToogle(initialDate: Date = new Date()) {
    const [date, dispatch] = React.useReducer(reducer, { onViewDate: initialDate });

    return [
        date.onViewDate, 
        {
            togglePrevMonth: () => dispatch({type: "prevMonth"}),
            toggleNextMonth: () => dispatch({type: "nextMonth"}),
            toggleNextDate: () => dispatch({type: "nextDate"}),
            togglePrevDate: () => dispatch({type: "prevDate"}),
            today: () => dispatch({ type: "today" })
        }
    ] as [
        typeof date.onViewDate, 
        {
            togglePrevMonth: () => void,
            toggleNextMonth: () => void,
            togglePrevDate: () => void,
            toggleNextDate: () => void,
            today: () => void,
        }
    ]
}

export default useDateToogle;