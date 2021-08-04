import {TritonClient} from "./client";

export class TritonServer {
    client: TritonClient;

    constructor(client: TritonClient) {
        this.client = client;
    }

    getPlayer() {
        return this.client.serverRequest('init_player');
    }

    getOpenGames() {
        return this.client.serverRequest('open_games');
    }
}