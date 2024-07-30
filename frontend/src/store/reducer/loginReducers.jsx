const loginStatus = (state = {}, action) => {
    switch (action.type){
        case "LOGIN":
            return {...state, loginInfo: action.loginInfo, status: true};
        case "LOGOUT":
            return { ...state, loginInfo: "", status: undefined};
        default:
            return state;
    }
};

export default loginStatus;