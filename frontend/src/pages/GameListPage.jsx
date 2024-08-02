import GLHeader from "../components/GameListComponents/GLHeader";
import GLMain from "../components/GameListComponents/GLMain";
import GLFooter from "../components/GameListComponents/GLFooter";
import styles from "./GameListPage.module.css";


function GameListPage({setToken}) {
    return (
        <div className={styles.layout}>
            <GLHeader />
            <main className={styles.main}>
                <GLMain setToken={setToken}/>
            </main>
            <GLFooter />
        </div>
    );
}

export default GameListPage;
