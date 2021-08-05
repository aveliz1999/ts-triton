import {sendPost} from "./util";
import {TritonGame} from "./game";
import {TritonServer} from "./server";

export class TritonClient {
    /**
     * The version of the API.
     */
    version: number;

    /**
     * The cookie to use for authenticating with the game.
     * Set when you run {@link authenticate} and updated when succesful requests are made.
     */
    authCookie: string;

    /**
     * If the client is logged in.
     */
    loggedIn: boolean;

    /**
     * The alias to use to authenticate with the game.
     */
    alias: string;

    /**
     * The password to use to authenticate with the game.
     */
    password: string;

    /**
     * The base Neptune's Planet URL.
     */
    url: string;

    /**
     * The error message returned when logging in.
     */
    loginErrorMessage: string;

    constructor(alias: string, password: string, version: number = 7) {
        this.version = version;
        this.authCookie = "";
        this.alias = alias;
        this.password = password;
        this.loggedIn = false;
        this.url = "https://np.ironhelmet.com"
    }

    /**
     * Uses the given username and password to attempt to log in.
     * Returns true if successful, and false if not.
     * If it was not successful, the error message will be put in {@link loginErrorMessage}.
     */
    async authenticate() {
        const url = `${this.url}/arequest/login`;

        const [result, response] = await sendPost(url, {
            type: "login",
            alias: this.alias,
            password: this.password
        });

        if(result[0] === 'meta:login_success') {
            const cookie = response.headers['set-cookie'][0].substring(5);
            this.authCookie = cookie.substring(0, cookie.indexOf(';'));

            this.loggedIn = true;

            return true;
        }
        else {
            const errorMessage = result[1];
            this.loggedIn = false;
            switch(errorMessage) {
                case 'account_not_found': {
                    this.loginErrorMessage = 'Login Error: Unknown Alias';
                    break;
                }
                case 'login_wrong_password': {
                    this.loginErrorMessage = 'Login Error: Wrong Password';
                    break;
                }
                default: {
                    this.loginErrorMessage = 'Login Error: Unknown Error'
                }
            }
            return false;
        }
    }

    /**
     * Get a {@link TritonGame} instance for a game.
     *
     * @param gameId The ID of the game.
     */
    getGame(gameId: string) {
        return new TritonGame(this, gameId);
    }

    /**
     * Get a {@link TritonServer} instance for the player.
     */
    getServer() {
        return new TritonServer(this);
    }

    /**
     * Used for requests for the server.
     *
     * @param type The type of request
     */
    async serverRequest(type: string) {
        if(this.loggedIn) {
            const url = `${this.url}/mrequest/${type}`;
            const fields = {
                type
            }

            const [result, response] = await sendPost(url, fields, this.authCookie);

            if(!!result) {
                if(result[0] === `meta:${type}`) {
                    const cookie = response.headers['set-cookie'][0].substring(5);
                    this.authCookie = cookie.substring(0, cookie.indexOf(';'));

                    return result[1];
                }
                else {
                    const errorMessage = result[1];
                    switch(errorMessage) {
                        case 'meta:login_required': {
                            this.loggedIn = false;
                            throw new Error('Not Logged In');
                        }
                        default: {
                            this.loginErrorMessage = 'Unknown Error'
                        }
                    }
                }
            }
            else {
                throw new Error(`Unknown request ${type}`);
            }
        }
        else {
            throw new Error('Not Logged In');
        }
    }

    /**
     * Used for requests for a game.
     *
     * @param type The type of request.
     * @param gameId The ID of the game.
     * @param options Extra options to include in the request body.
     */
    async gameRequest(type: string, gameId: string, options?: {[key: string]: string|number}) {
        if(this.loggedIn) {
            const url = `${this.url}/grequest/${type}`;
            let fields = {
                type,
                version: this.version,
                game_number: gameId,
            };
            if(options) {
                fields = {
                    ...fields,
                    ...options
                }
            }

            const [result, response] = await sendPost(url, fields, this.authCookie);

            if(!!result) {
                if(result['event'] !== `${type}:error` && result['event'] != 'None') {
                    const cookie = response.headers['set-cookie'][0].substring(5);
                    this.authCookie = cookie.substring(0, cookie.indexOf(';'));

                    return result['report'];
                }
                else {
                    const errorMessage = result['report'];
                    switch(errorMessage) {
                        case 'must_be_logged_in': {
                            this.loggedIn = false;
                            throw new Error('Not Logged In');
                        }
                        case 'client_on_wrong_version': {
                            throw new Error('Using wrong api version');
                        }
                        case 'None': {
                            throw new Error('Game not found');
                        }
                        default: {
                            this.loginErrorMessage = 'Unknown Error'
                        }
                    }
                }
            }
            else {
                throw new Error(`Unknown request ${type}`);
            }
        }
        else {
            throw new Error('Not Logged In');
        }
    }
}