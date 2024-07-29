export const login = (loginInfo) => {
    return {
        type: "LOGIN",
        loginInfo,
    };
};

export const logout = () => {
    return {
        type: "LOGOUT",
    };
};