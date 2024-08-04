import GLHeader from "../components/GameListComponents/GLHeader";
import GLMain from "../components/GameListComponents/GLMain";
import GLFooter from "../components/GameListComponents/GLFooter";
import styles from "./GameListPage.module.css";

function GameListPage({setViduToken}) {
    return (
        <div className={styles.layout}>
            <GLHeader setViduToken={setViduToken} />
            <main className={styles.main}>
                <GLMain setViduToken={setViduToken}/>
            </main>
            <GLFooter />
        </div>
    );
}

export default GameListPage;
