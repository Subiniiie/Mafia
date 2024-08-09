import GLHeader from "../components/GameListComponents/GLHeader";
import GLMain from "../components/GameListComponents/GLMain";
import GLFooter from "../components/GameListComponents/GLFooter";

function GameListPage({setViduToken}) {
    return (
        <div>
            <GLHeader setViduToken={setViduToken}/>
            <main>
                <GLMain setViduToken={setViduToken}/>
            </main>
            <GLFooter />
        </div>
    );
}

export default GameListPage;
