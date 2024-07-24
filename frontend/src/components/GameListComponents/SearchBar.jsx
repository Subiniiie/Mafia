// const SearchBar = () => {

//     return (
//         <>
//             <p>SearchBar</p>
//         </>
//     )
// }

const SearchBar = () => {

    return (
        <form
            className="border border-solid border-gray-300 rounded-lg w-[300px] h-[35px] flex items-center"
        >
            <input
                required
                type="text"
                placeholder={"터전을 찾아보세요."}
                className="border-none w-[90%] pl-2"
            />
            <button className="w-[10%]">
                찾기
            </button>
        </form>
    )
}

export default SearchBar