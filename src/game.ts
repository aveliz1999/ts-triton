import {TritonClient} from "./client";

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
}