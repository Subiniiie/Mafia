// const SearchBar = () => {

//     return (
//         <>
//             <p>SearchBar</p>
//         </>
//     )
// }

const SearchBar = ({placeholder}) => {

    return (
        <form
            className="border border-solid border-gray-300 rounded-lg w-[300px] h-[35px] flex items-center"
        >
            <input
                required
                type="text"
                placeholder={placeholder}
                className="border-none w-[90%] pl-2"
            />
            <button className="w-[10%]">
                찾기
            </button>
        </form>
    )
}

export default SearchBar