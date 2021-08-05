import {TritonClient} from "./client";

export class TritonServer {
    /**
     * The client to use to interact with the server.
     */
    client: TritonClient;

    constructor(client: TritonClient) {
        this.client = client;
    }

    /**
     * Get the player information.
     */
    getPlayer() {
        return this.client.serverRequest('init_player');
    }

    /**
     * Get the player's open games.
     */
    getOpenGames() {
        return this.client.serverRequest('open_games');
    }
}