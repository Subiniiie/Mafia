import GLHeader from "../components/GameListComponents/GLHeader";
import GLMain from "../components/GameListComponents/GLMain";
import GLFooter from "../components/GameListComponents/GLFooter";
import React from "react";

function GameListPage({setViduToken}) {
    return (
      <div>
        <div className="box-content h-48"></div>
        <GLHeader setViduToken={setViduToken}/>
        <main>
          <GLMain setViduToken={setViduToken}/>
        </main>
        <GLFooter/>
      </div>
    );
}

export default GameListPage;
