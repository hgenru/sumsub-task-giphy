import type {GiphyMultiResponse} from '@/api/types';

const SEARCH_API_URL = 'https://api.giphy.com/v1/gifs/search';
const API_KEY = 'WxdyYLhMuub9clDtbglE0bJkSBExzePj';

type SearchGifsOptions = {
    signal: AbortSignal;
};

const DEFAULT_LIMIT = 15;

export function searchGiphy(
    query: string,
    options?: SearchGifsOptions
): Promise<GiphyMultiResponse> {
    const url = new URL(SEARCH_API_URL);
    url.search = new URLSearchParams({
        q: query,
        api_key: API_KEY,
        limit: String(DEFAULT_LIMIT),
    }).toString();
    return fetch(url, options).then((res) => res.json());
}
