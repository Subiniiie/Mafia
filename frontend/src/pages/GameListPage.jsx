import GLHeader from "../components/GameListComponents/GLHeader";
import GLMain from "../components/GameListComponents/GLMain";
import GLFooter from "../components/GameListComponents/GLFooter";

function GameListPage() {
    return (
        <div>
            <GLHeader />
            <main>
                <GLMain />
            </main>
            <GLFooter />
        </div>
    );
}

export default GameListPage;
