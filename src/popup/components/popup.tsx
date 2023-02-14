import React, { FC, useState } from "react";
import { fetchKrunkerGames } from "../krunker-service";
import './popup.scss'

const Popup = () => {
    //GLOBAL VARIABLES
    const [availablePlayersCount, setAvailablePlayersCount] = useState(4);
    const [games, setGames] = useState([] as any[]);

    let mapSelection: string;
    let location: string = "de-fra";
    let totPlayers: number;
    const freePlayers: HTMLElement | null = document.getElementById("counter");
    const minInGamePlayers = 2;
    let custom: boolean = false;
    let url = "https://krunker.io/?game=";
    let gamesArray = [];
    const audio: HTMLAudioElement = new Audio("/sounds/hover_0.mp3");

    function createAnchor(title: string, url: string) {
        // Create anchor element.

        // Create the text node for anchor element.
        const linkAnchor: HTMLAnchorElement = document.createElement("a");
        // Append the text node to anchor element.
        const linkTitle: Text = document.createTextNode(title);

        // Set the title.
        linkAnchor.appendChild(linkTitle);

        // Set the properties.
        linkAnchor.title = title;
        linkAnchor.href = url;

        return linkAnchor;
    }

    //CORE FUNCTION: calls the API, filters data and produces output links
    function handleClickGetLinks(
        ev: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) {
        fetchKrunkerGames()
            .then((response) => response.json())
            .then((data) => {
                gamesArray = data.games.filter((game: any) => {
                    return (
                        game[1] == location &&
                        game[3] - game[2] >= availablePlayersCount &&
                        game[2] >= minInGamePlayers &&
                        game[4].c == custom
                    );
                });

                gamesArray.sort();

                setGames(gamesArray);

                /*
                for (var i = 0; i < gamesArray.length; i++) {
                    const game = gamesArray[i];
                    const parameters = game[4];
                    const map = parameters.i;
                    let link = url + game[0];
                    let anchor =
                        '<a target="_blank" href="' +
                        link +
                        '">' +
                        map +
                        "</a>";
                    resultElement.innerHTML +=
                        "<li>" +
                        anchor +
                        " - totPosti: " +
                        game[3] +
                        " - liberi: " +
                        (game[3] - game[2]) +
                        "</li>";
                }

                const content: HTMLElement | null =
                    document.getElementById("vanish");
                if (content !== null) {
                    if (gamesArray.length != 0) content.style.display = "flex";
                    else content.style.display = "none";
                }
                */
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }

    function incrementCounter() {
        const newCount = availablePlayersCount + 1;
        setAvailablePlayersCount(
            newCount > 8 ? availablePlayersCount : newCount
        );
    }

    function decrementCounter() {
        const newCount = availablePlayersCount - 1;
        setAvailablePlayersCount(
            newCount < 0 ? availablePlayersCount : newCount
        );
    }

    function playButtonSound() {
        // Play from the beginning
        audio.currentTime = 0;

        // Set the volume to 30%
        audio.volume = 0.3;

        // Play the audio
        audio.play();
    }

    return (
        <>
            <main className="main-div">
                <div className="container">
                    <div className="row">
                        <div className="col">
                            <div className="row custom-row">
                                <div
                                    className="col center-all"
                                >
                                    <button
                                        className="custom-button btn btn-primary btn-circle counter-button center-all"
                                        id="request-decrement-counter"
                                        onClick={decrementCounter}
                                        onMouseOver={playButtonSound}
                                    >
                                        -
                                    </button>
                                </div>
                                <div
                                    className="col center-all"
                                    style={{ color: "white" }}
                                >
                                    <h3 id="counter">
                                        {availablePlayersCount}
                                    </h3>
                                </div>
                                <div
                                    className="col center-all"
                                >
                                    <button
                                        className="custom-button btn btn-primary btn-circle counter-button center-all"
                                        id="request-increment-counter"
                                        onClick={incrementCounter}
                                        onMouseOver={playButtonSound}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                            <div className="row center-all custom-row">
                                <button
                                    className="custom-button launch-button"
                                    id="request-links"
                                    onClick={handleClickGetLinks}
                                    onMouseOver={playButtonSound}
                                >
                                    Launch
                                </button>
                            </div>
                        </div>
                        <div
                            className="secondary-div col-5"
                            style={{ display: "flex" }}
                            id="vanish"
                        >
                            <div className="scrollable-div">
                                {games &&
                                    games.map((game: any) => {
                                        const parameters = game[4]
                                        const map = parameters.i
                                        const gameLink = url + game[0];

                                        return <>
                                            <li>
                                                <a target="_blank" href={gameLink} >
                                                {map}
                                                </a>
                                                - totPosti: {game[3]} - liberi: {game[3]-game[2]}
                                            </li>
                                        </>;
                                    })}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
};

export default Popup;
