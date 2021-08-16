import {TritonClient} from "./client";

/**
 * The actions that a ship can do once it arrives at each planet.
 */
export type Action = 'Do Nothing' | 'Collect All' | 'Drop All' | 'Collect' | 'Drop' | 'Collect All But' | 'Drop All But' | 'Garrison Star'

/**
 * Represents a fleet in the game
 */
export type Fleet = {
    /**
     * Unknown.
     */
    l: number,

    /**
     * The X coordinate of the fleet at the previous tick.
     */
    lx: string,

    /**
     * The Y coordinate of the fleet at the previous tick.
     */
    ly: string,

    /**
     * The name of the carrier.
     */
    n: string,

    /**
     * The list of orders.
     * Represented as an array of 4 number arrays.
     *
     * The number at position 0 represents the delay value in ticks for the order.
     *
     * The number at position 1 represents the ID of the star for the order.
     *
     * The number at position 2 represents the type of action for the order.
     * @see Action
     *
     * The number at position 3 represents the number of ships for the order.
     *
     */
    o: [number, number, number, number][],

    /**
     * The ID of the player who owns this fleet.
     */
    puid: number,

    /**
     * The ID of the star the fleet is located at.
     * Only present if this is the fleet is currently at a star.
     */
    ouid?: number,

    /**
     * The number of ships in the fleet.
     */
    st: number,

    /**
     * The ID of this fleet.
     */
    uid: number,

    /**
     * If the fleet is travelling through a warpgate (at 3x speed).
     * 0 = no
     * 1 = yes
     */
    w: number,

    /**
     * The current X coordinate of the fleet.
     */
    x: string,

    /**
     * The current Y coordinate of the fleet.
     */
    y: string
}

/**
 * Represents a technology owned by a player in the game
 */
export type Technology = {
    /**
     * Research cost per tech level for this technology.
     * Only present if this is the player of the current user.
     */
    brr?: number,

    /**
     * Used to calculate value.
     * Only present if this is the player of the current user.
     */
    bv?: number,

    /**
     * Used to calculate value.
     * Only present if this is the player of the current user.
     */
    sv?: number,

    /**
     * Unknown.
     */
    value: number,

    /**
     * The current technology level.
     */
    level: number,

    /**
     * Current progress to the next level.
     * Only present if this is the player of the current user.
     */
    research?: number
}

/**
 * Represents a player in the game
 */
export type Player = {
    /**
     * If the player is currently controlled by an AI.
     * 0 = no
     * 1 = yes
     */
    ai: number,

    /**
     * The player's alias / display name.
     */
    alias: string,

    /**
     * The ID of the player's avatar.
     */
    avatar: number,

    /**
     * The current funds of the player.
     * Only present if this is the player of the current user.
     */
    cash?: number,

    /**
     * The number of ticks until war begins with all the other players, if a permanent alliance has ended.
     * Only present if this is the player of the current user.
     */
    countdown_to_war?: {
        /**
         * The key is the ID of the other player.
         * The number is the number of ticks until the war begins.
         */
        [key: number]: number
    },

    /**
     * If the player has exited the game.
     * 0 = no
     * 1 = conceded
     * 2 = inactive
     * 3 = total wipe out
     */
    conceded: number,

    /**
     * The ID of the player's home star
     */
    huid: number,

    /**
     * The number of renown the player has not yet given in the game.
     */
    karma_to_give: number,

    /**
     * The number of turns the player has missed.
     */
    missed_turns: number,

    /**
     * If the player's current turn has been submitted.
     */
    ready: number,

    /**
     * The AI's opinion of the player.
     */
    regard: number,

    /**
     * The technology currently being researched.
     * Only present if this is the player of the current user.
     */
    researching?: string,

    /**
     * The technology being researched next.
     * Only present if this is the player of the current user.
     */
    researching_next?: string,

    /**
     * The number of stars abandoned this production cycle.
     * Cannot be higher than 1, resets to 0 at the next production cycle.
     * Only present if this is the player of the current user.
     */
    stars_abandoned?: number,

    /**
     * The player's technology research information
     */
    tech: {
        [key in 'banking' | 'manufacturing' | 'propulsion' | 'research' | 'scanning' | 'terraforming' | 'weapons']: Technology
    },

    /**
     * The total economy of the player.
     */
    total_economy: number,

    /**
     * The total number of carriers of the player.
     */
    total_fleets: number,

    /**
     * The total industry of the player.
     */
    total_industry: number,

    /**
     * The total science of the player.
     */
    total_science: number,

    /**
     * The number of stars the player owns.
     */
    total_stars: number,

    /**
     * The number ships the player owns.
     */
    total_strength: number
}

/**
 * Represents a star in the game
 */
export type Star = {
    /**
     * The name of the star.
     */
    n: string,

    /**
     * The ID of the player who owns this star.
     */
    puid: number,

    /**
     * The ID of this star.
     */
    uid: number,

    /**
     * If the star is visible to the user.
     * 0 = no
     * 1 = yes
     */
    v: string,

    /**
     * The X coordinate of the star.
     * The value is 1/8 the amount of light years distance.
     */
    x: string,

    /**
     * The Y coordinate of the star.
     * The value is 1/8 the amount of light years distance.
     */
    y: string,

    /**
     * The current economy level.
     * Only present when the star is visible to the user.
     */
    e?: number,

    /**
     * If the star has a warpgate.
     * Only present when the star is visible to the user.
     * 0 = no
     * 1 = yes
     */
    ga?: number,

    /**
     * The current industry level.
     * Only present when the star is visible to the user.
     */
    i?: number,

    /**
     * The natural resources of the star.
     * Only present when the star is visible to the user.
     */
    nr?: number,

    /**
     * The total resources of the star, including terraforming bonus.
     * Only present when the star is visible to the user.
     */
    r?: number,

    /**
     * The current science level.
     * Only present when the star is visible to the user.
     */
    s?: number,

    /**
     * The number of ships on the star.
     * Only present when the star is visible to the user.
     */
    st?: number
}

/**
 * The current state of the game universe.
 */
export type UniverseData = {
    /**
     * Unknown
     */
    fleet_speed: number,

    /**
     * If the game is paused
     */
    paused: boolean,

    /**
     * The number of production cycles that have passed.
     */
    productions: number,

    /**
     * The percent of the current tick that has been completed.
     */
    tick_fragment: number,

    /**
     * The timestamp of the current time.
     */
    now: number,

    /**
     * The number of minutes per tick.
     */
    tick_rate: number,

    /**
     * The number of ticks per production cycle.
     */
    production_rate: number,

    /**
     * The number of stars required to win the game
     */
    stars_for_victory: number,

    /**
     * If the game is completed.
     * 0 = no
     * 1 = yes
     */
    game_over: number,

    /**
     * If the game has started.
     */
    started: boolean,

    /**
     * The timestamp of when the game started.
     */
    start_time: number,

    /**
     * The total stars the user has.
     */
    total_stars: number,

    /**
     * The current tick within the current production cycle.
     */
    production_counter: number,

    /**
     * If trading is restricted to scanned users only.
     * 0 = no
     * 1 = yes
     */
    trade_scanned: number,

    /**
     * The current tick.
     */
    tick: number,

    /**
     * The cost per level of technology for trading.
     */
    trade_cost: number,

    /**
     * The name of the game
     */
    name: string,

    /**
     * The ID of the user.
     */
    player_uid: number,

    /**
     * If the player is the game admin.
     */
    admin: number,

    /**
     * If the game is turn based.
     * 0 = no
     * 1 = yes
     */
    turn_based: number,

    /**
     * Unknown
     */
    war: number,

    /**
     * The timestamp of when the current turn will forcefully end.
     */
    turn_based_time_out: number,

    /**
     * The list of fleets in the game.
     */
    fleets: {
        /**
         * The key is the ID of the fleet
         */
        [key: number]: Fleet
    },
    /**
     * The list of players in the game.
     */
    players: {
        /**
         * The key is the ID of the player
         */
        [key: number]: Player
    },
    /**
     * The stars in the game.
     */
    stars: {
        /**
         * The key is the star ID.
         * @see Star
         */
        [key: string]: Star
    },
}

/**
 * A way of representing ship orders rather than the array of numbers.
 * @see UniverseData.fleets.fleetId.o
 */
type ShipOrder = {
    delay: number,
    targetPlanetId: number,
    action: Action,
    ships: number
}

export class TritonGame {
    /**
     * The client to use to interact with the game.
     */
    client: TritonClient;

    /**
     * The ID of the game.
     */
    id: string;

    /**
     * The current data of the game universe.
     * Only updated when {@link getFullUniverse} is called.
     */
    currentUniverse: UniverseData;

    constructor(client: TritonClient, gameId: string) {
        this.client = client;
        this.id = gameId;
    }

    /**
     * Generic function used to send orders to the game.
     *
     * @param type The type of order.
     * @param order The order data.
     */
    order(type: string, order: string) {
        return this.client.gameRequest(type, this.id, {
            order
        })
    }

    /**
     * Updates and returns the current state of the game universe.
     * @see currentUniverse
     */
    async getFullUniverse() {
        this.currentUniverse = await this.order('order', 'full_universe_report')
        return this.currentUniverse;
    }

    /**
     * Returns intel data from the game.
     */
    getIntel() {
        return this.client.gameRequest('intel_data', this.id);
    }

    /**
     * Returns the amount of unread messages.
     */
    getUnreadCount() {
        return this.client.gameRequest('fetch_unread_count', this.id);
    }

    /**
     * Returns the player's achievements.
     */
    getPlayerAchievements() {
        return this.client.gameRequest('fetch_player_achievements', this.id);
    }

    /**
     * Generic function used to get messages sent to the player.
     *
     * @param messageType The type of message, either game_diplomacy or game_event.
     * @param count The amount of messages to retrieve.
     * @param offset The offset to retrieve from.
     */
    getMessages(messageType: 'game_diplomacy' | 'game_event', count: number, offset: number = 0) {
        const options = {
            count,
            offset,
            group: messageType
        }
        return this.client.gameRequest('fetch_game_messages', this.id, options);
    }

    /**
     * Get the messages sent to the user by other players.
     *
     * @param count The amount of messages to retrieve.
     * @param offset The offset to retrieve from.
     */
    getDiplomacyMessages(count: number, offset: number = 0) {
        return this.getMessages('game_diplomacy', count, offset);
    }

    /**
     * Get the game event messages.
     *
     * @param count The amount of messages to retrieve.
     * @param offset The offset to retrieve from.
     */
    getEventMessages(count: number, offset: number = 0) {
        return this.getMessages('game_event', count, offset);
    }

    /**
     * Marks a message as read.
     *
     * @param messageKey The message_key of the message.
     */
    readMessage(messageKey: string) {
        return this.client.gameRequest('read_game_message', this.id, {
            message_key: messageKey
        })
    }

    /**
     * Buy economy on a star.
     *
     * @param star The ID of the star to buy on.
     * @param price The price of the economy upgrade.
     */
    buyEconomy(star: string, price: number) {
        return this.order('batched_orders', `upgrade_economy,${star},${price}`);
    }

    /**
     * Buy industry on a star.
     *
     * @param star the ID of the star to buy on.
     * @param price The price of the industry upgrade.
     */
    buyIndustry(star: string, price: number) {
        return this.order('batched_orders', `upgrade_industry,${star},${price}`);
    }

    /**
     * Buy science on a star.
     *
     * @param star The ID of the star to buy on.
     * @param price The price of the industry upgrade.
     */
    buyScience(star: string, price: number) {
        return this.order('batched_orders', `upgrade_science,${star},${price}`);
    }

    /**
     * Sets the path and actions of a fleet.
     * The orders are set, not added.
     *
     * @param shipId The ID of the fleet to order.
     * @param orders An array of {@link ShipOrder} to be encoded and sent to the fleet.
     */
    giveShipOrder(shipId: number, orders: ShipOrder[]) {
        return this.order('order', `add_fleet_orders,${shipId},${this.encodeShipOrders(orders)},0`)
    }

    /**
     * Used to encode an array of {@link ShipOrder} into the right format string that the game is expecting.
     * All the values of the same type go at the same time, rather than the values of each star.
     * The format is ship_delays,target_planets,action_types,ship_amount.
     *
     * @param orders The array of orders.
     */
    encodeShipOrders(orders: ShipOrder[]): string {
        let encoded = '';

        // Encode the delays
        encoded = orders.reduce((previous, current) => {
            return previous + current.delay + '_'
        }, '').slice(0, -1) + ',';

        // Encode the target planets
        encoded = encoded + orders.reduce((previous, current) => {
            return previous + current.targetPlanetId + '_'
        }, '').slice(0, -1) + ',';

        // Encode the actions
        encoded = encoded + orders.reduce((previous, current) => {
            return previous + this.encodeAction(current.action) + '_'
        }, '').slice(0, -1) + ',';

        // Encode the ship amounts
        encoded = encoded + orders.reduce((previous, current) => {
            return previous + current.ships + '_'
        }, '').slice(0, -1);

        return encoded;
    }

    /**
     * Get the stars in travel distance of the given star.
     * The hyperspace research level of the user is used for all calculations, not the level of the given star's owner.
     *
     * @param starId The ID of the star to calculate for.
     */
    getStarsInDistance(starId: number): Star[] {
        /**
         * The light years a player can travel is (hyperspace_level + 3).
         * When using game coordinates, the light years have to be divided by 8 to be in proper scale.
         */
        const hyperspaceLevel = this.currentUniverse.players[this.currentUniverse.player_uid].tech.propulsion.level;
        const lightYears = hyperspaceLevel + 3;
        const translatedDistance = lightYears / 8;

        const originStar = this.currentUniverse.stars[starId];

        return Object.values(this.currentUniverse.stars).filter(star => {
            return (star.uid !== originStar.uid) &&
                (this.getDistanceBetweenStars(originStar.uid, star.uid) <= translatedDistance);
        });
    }

    /**
     * Encode the action strings into the number the game is expecting.
     *
     * @param action The action string to encode.
     */
    encodeAction(action: Action): number {
        switch(action) {
            case 'Do Nothing': return 0;
            case 'Collect All': return 1;
            case 'Drop All': return 2;
            case 'Collect': return 3;
            case 'Drop': return 4;
            case 'Collect All But': return 5;
            case 'Drop All But': return 6;
            case 'Garrison Star': return 7;
        }
    }

    /**
     * Calculate the distance between stars using the distance formula.
     * The returned distance is in coordinate scale, not light year scale.
     * Multiply by 8 to get the amount of light years.
     *
     * @param startStarId The ID of the star to calculate from.
     * @param endStarId The ID of the star to calculate to.
     */
    getDistanceBetweenStars(startStarId: number, endStarId: number): number {
        const startStar = this.currentUniverse.stars[startStarId];
        const endStar = this.currentUniverse.stars[endStarId];
        return Math.sqrt(
            Math.pow(parseFloat(endStar.x) - parseFloat(startStar.x), 2) +
            Math.pow(parseFloat(endStar.y) - parseFloat(startStar.y), 2))
    }

    /**
     * Find a path between two stars.
     * Uses an implementation of the A* algorithm to find the path.
     * Returns the list of stars, in order from start to end, to travel to in order to reach the end.
     *
     * @param startStarId The ID of the star to start from.
     * @param endStarId The ID of the star to end in.
     * @param allowedToCrossOtherPlayers If the algorithm is allowed to consider stars owned by other players.
     * @param otherPlayerWeightMultiplied Weight to multiple the distance of stars owned by other players if allowed.
     */
    findPathToStar(startStarId: number, endStarId: number, allowedToCrossOtherPlayers: boolean = false,
                   otherPlayerWeightMultiplied: number = 2): Star[] {
        const stars = this.currentUniverse.stars;
        const endStar = stars[endStarId];

        const openList = [{
            star: stars[startStarId],
            f: 0,
            g: 0,
            h: 0,
            visited: false,
            closed: false,
            parent: null
        }];

        while(openList.length > 0) {
            let lowInd = 0;
            for(let i = 0; i < openList.length; i++) {
                if(openList[i].f < openList[lowInd].f) {
                    lowInd = i;
                }
            }
            const currentNode = openList[lowInd];

            if(currentNode.star.uid === endStarId) {
                let curr = currentNode;
                const finalPath = [];
                while(curr.parent) {
                    finalPath.push(curr);
                    curr = curr.parent;
                }
                return finalPath.reverse().map(r => r.star);
            }

            openList.splice(lowInd, 1);
            currentNode.closed = true;

            const neighbors = this.getStarsInDistance(currentNode.star.uid).map(star => {
                return {
                    star,
                    f: 0,
                    g: 0,
                    h: 0,
                    visited: false,
                    closed: false,
                    parent: null
                }
            });
            for(let i = 0; i < neighbors.length; i++) {
                const neighbor = neighbors[i];

                if(neighbor.closed) {
                    continue;
                }
                const otherPlayer = neighbor.star.puid !== this.currentUniverse.player_uid;
                if(otherPlayer && !allowedToCrossOtherPlayers) {
                    continue;
                }

                const gScore = currentNode.g + (this.getDistanceBetweenStars(currentNode.star.uid, neighbor.star.uid) *
                    (otherPlayer ? otherPlayerWeightMultiplied : 1));
                let gScoreIsBest = false;

                if(!neighbor.visited) {
                    gScoreIsBest = true;
                    neighbor.h = Math.abs(parseFloat(endStar.x) - parseFloat(neighbor.star.x)) +
                        Math.abs(parseFloat(endStar.y) - parseFloat(neighbor.star.y));
                    neighbor.visited = true;
                    openList.push(neighbor);
                }
                else if(gScore < neighbor.g) {
                    gScoreIsBest = true;
                }

                if(gScoreIsBest) {
                    neighbor.parent = currentNode;
                    neighbor.g = gScore;
                    neighbor.f = neighbor.g + neighbor.h;
                }
            }
        }

        return [];
    }
}
