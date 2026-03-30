export type CounterState = {
    data: number
}

const initialState: CounterState = {
    data: 42
}

export default function counterReducer(state = initialState, action: {type: string, payload: number})
{
    switch (action.type) {
        case 'increment':
            return {
                ...state,
                data: state.data + 1
            }
        case 'decrement':
            return {
                ...state,
                data: state.data - 1 
            }
        default:
            return state;
    }
}