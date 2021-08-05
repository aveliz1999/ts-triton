import FormData from "form-data";
import axios from "axios";

/**
 * Util function used to send the requests to the server
 *
 * @param url The URL to send the request to.
 * @param body The body object to be encoded.
 * @param authCookie The auth cookie to use to authenticate with the server.
 */
export async function sendPost(url: string, body: {[key: string]: string|number}, authCookie?: string) {
    const form = new FormData();
    Object.entries(body).forEach(([key, value]) => {form.append(key, value)});

    const headers = {
        ...form.getHeaders()
    }
    if(authCookie) {
        headers.cookie = `auth=${authCookie}`
    }

    const request = await axios.post(url, form, {
        headers
    });
    return [request.data, request];
}