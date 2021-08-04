import FormData from "form-data";
import axios from "axios";

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