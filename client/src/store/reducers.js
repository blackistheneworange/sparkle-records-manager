import {combineReducers} from 'redux';

const records = (state={records:[]},action) => {
    switch(action.type){
        case 'SET_RECORDS':
            return {...state, records:action.payload}
        case 'CREATE_RECORD':
            return {...state, records:[...state.records, action.payload]}
        case 'UPDATE_RECORD':
            return {...state, records:state.records.map(r=>r.id==action.payload.id?action.payload:r)}
        case 'DELETE_RECORDS':
            return {...state, records:action.payload==='all' ? [] : state.records.filter(r=>!action.payload.includes(r.id))}
        default:
            return state;
    }
}

export default combineReducers({
    records,
})