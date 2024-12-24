import { deleteCookie, getCookie, setCookie } from 'cookies-next';
import { ACCESS_TOKEN, INFO_USER, REFERSH_TOKEN, ROLE_USER } from '../configs/request';
import axios from 'axios';

const getCookieValues = <T>(key: string): T | undefined => {
    const value = getCookie(key);

    if (!value) {
        return undefined;
    }
    try {
        return JSON.parse(value) as T;
    } catch (e) {
        return JSON.parse(JSON.stringify(value));
    }
};


const setCookieValues = (key: string, value: any, expiresAt?: number) => {
    const options: any = {};

    if (expiresAt) {
        options.expires = new Date(expiresAt * 1000);
    }

    if (typeof value === 'string') {
        setCookie(key, value, options);
    } else {
        setCookie(key, JSON.stringify(value), options);
    }
};

const removeCookies = (key: string) => {
    deleteCookie(key);
};

const logOut = () => {
    const token = getCookie(ACCESS_TOKEN);
    // axios.post("http://localhost:8888/auth/log-out", {
    //     token: token
    // })
    removeCookies(ACCESS_TOKEN);
    removeCookies(REFERSH_TOKEN);
    localStorage.removeItem(INFO_USER)
    window.location.reload();
};

export { getCookieValues, logOut, removeCookies, setCookieValues };
