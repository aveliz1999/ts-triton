import {TritonClient} from "./client";

type Action = 'Do Nothing' | 'Collect All' | 'Drop All' | 'Collect' | 'Drop' | 'Collect All But' | 'Drop All But' | 'Garrison Star'

type ShipOrder = {
    delay: number,
    targetPlanetId: number,
    action: Action,
    ships: number
}

export class TritonGame {
    client: TritonClient;
    id: string;

    constructor(client: TritonClient, gameId: string) {
        this.client = client;
        this.id = gameId;
    }

    order(type: string, order: string) {
        return this.client.gameRequest(type, this.id, {
            order
        })
    }

    getFullUniverse() {
        return this.order('order', 'full_universe_report');
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
    
    encodeShipOrders(orders: ShipOrder[]) {
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

    encodeAction(action: Action) {
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
}