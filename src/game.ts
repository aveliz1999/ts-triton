import {TritonClient} from "./client";

type Action = 'Do Nothing' | 'Collect All' | 'Drop All' | 'Collect' | 'Drop' | 'Collect All But' | 'Drop All But' | 'Garrison Star'

type Star = {
    n: string,
    puid: number,
    uid: number,
    v: string,
    x: string,
    y: string
}

export type UniverseData = {
    fleet_speed: number,
    paused: boolean,
    productions: number,
    tick_fragment: number,
    now: number,
    tick_rate: number,
    production_rate: number,
    stars_for_victory: number,
    game_over: number,
    started: boolean,
    start_time: number,
    total_stars: number,
    production_counter: number,
    trade_scanned: number,
    tick: number,
    trade_cost: number,
    name: string,
    player_uid: number,
    admin: number,
    turn_based: number,
    war: number,
    turn_based_time_out: number,

    fleets: {
        [key: number]: {
            l: number,
            lx: string,
            ly: string,
            n: string,
            o: any,
            puid: number,
            st: number,
            uid: number,
            w: number,
            x: string,
            y: string
        }
    },
    players: {
        [key: number]: {
            ai: number,
            alias: string,
            avatar: number,
            conceded: number,
            huid: number,
            karma_to_give: number,
            missed_turns: number,
            ready: number,
            regard: number,
            tech: {
                [key in 'banking' | 'manufacturing' | 'propulsion' | 'research' | 'scanning' | 'terraforming' | 'weapons']: {
                    value: number,
                    level: number
                }
            },
            total_economy: number,
            total_fleets: number,
            total_industry: number,
            total_science: number,
            total_stars: number,
            total_strength: number
        }
    },
    stars: {
        [key: string]: Star
    },
}


type ShipOrder = {
    delay: number,
    targetPlanetId: number,
    action: Action,
    ships: number
}

export class TritonGame {
    client: TritonClient;
    id: string;
    currentUniverse: UniverseData;

    constructor(client: TritonClient, gameId: string) {
        this.client = client;
        this.id = gameId;
    }

    order(type: string, order: string) {
        return this.client.gameRequest(type, this.id, {
            order
        })
    }

    async getFullUniverse() {
        this.currentUniverse = await this.order('order', 'full_universe_report')
        return this.currentUniverse;
    }

    getIntel() {
        return this.client.gameRequest('intel_data', this.id);
    }

    getUnreadCount() {
        return this.client.gameRequest('fetch_unread_count', this.id);
    }

    getPlayerAchievements() {
        return this.client.gameRequest('fetch_player_achievements', this.id);
    }

    getMessages(messageType: 'game_diplomacy' | 'game_event', count: number, offset: number = 0) {
        const options = {
            count,
            offset,
            group: messageType
        }
        return this.client.gameRequest('fetch_game_messages', this.id, options);
    }

    getDiplomacyMessages(count: number, offset: number = 0) {
        return this.getMessages('game_diplomacy', count, offset);
    }

    getEventMessages(count: number, offset: number = 0) {
        return this.getMessages('game_event', count, offset);
    }

    buyEconomy(star: string, price: number) {
        return this.order('batched_orders', `upgrade_economy,${star},${price}`);
    }

    buyIndustry(star: string, price: number) {
        return this.order('batched_orders', `upgrade_industry,${star},${price}`);
    }

    buyScience(star: string, price: number) {
        return this.order('batched_orders', `upgrade_science,${star},${price}`);
    }

    giveShipOrder(shipId: number, orders: ShipOrder[]) {
        return this.order('order', `add_fleet_orders,${shipId},${this.encodeShipOrders(orders)},0`)
    }

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

    getStarsInDistance(starId: number): Star[] {
        const hyperspaceLevel = this.currentUniverse.players[this.currentUniverse.player_uid].tech.propulsion.level;
        const lightYears = hyperspaceLevel + 3;
        const translatedDistance = lightYears / 8;

        const originStar = this.currentUniverse.stars[starId];

        return Object.values(this.currentUniverse.stars).filter(star => {
            return (star.uid !== originStar.uid) &&
                (this.getDistanceBetweenStars(originStar.uid, star.uid) <= translatedDistance);
        });
    }

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

    getDistanceBetweenStars(startStarId: number, endStarId: number): number {
        const startStar = this.currentUniverse.stars[startStarId];
        const endStar = this.currentUniverse.stars[endStarId];
        return Math.sqrt(
            Math.pow(parseFloat(endStar.x) - parseFloat(startStar.x), 2) +
            Math.pow(parseFloat(endStar.y) - parseFloat(startStar.y), 2))
    }

    findPathToStar(startStarId: number, endStarId: number): Star[] {
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

                const gScore = currentNode.g + this.getDistanceBetweenStars(currentNode.star.uid, neighbor.star.uid);
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
