import styles from "./SearchBar.module.css"
import SearchButton from "../assets/Buttons/SearchButton.png"
const SearchBar = ({ placeholder }) => {

    return (
        <div>
            <form className={styles.searchBarContainer}>
                <div className={styles.inputUnderline}>
                    <input
                        required
                        type="text"
                        placeholder={placeholder}
                        className={styles.searchBarInput}
                    />
                </div>

                {/* <button className="w-[10%]">
                    찾기
                </button> */}
                <img src={SearchButton} alt="SearchButton" className={styles.searchButton} />
            </form>
        </div>
    )
}

export default SearchBar