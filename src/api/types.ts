interface GiphyBaseImage {
    url: string;
    width: string;
    height: string;
}

export interface GiphyImages {
    fixed_height: GiphyBaseImage & {
        size: string;
        mp4: string;
        mp4_size: string;
        webp: string;
        webp_size: string;
    };
    fixed_height_still: GiphyBaseImage;
    fixed_height_downsampled: GiphyBaseImage & {
        size: string;
        webp: string;
        webp_size: string;
    };
    fixed_width: GiphyBaseImage & {
        size: string;
        mp4: string;
        mp4_size: string;
        webp: string;
        webp_size: string;
    };
    original_still: GiphyBaseImage;
    fixed_width_still: GiphyBaseImage;
    fixed_width_downsampled: GiphyBaseImage & {
        size: string;
        webp: string;
        webp_size: string;
    };
    fixed_height_small: GiphyBaseImage & {
        size: string;
        mp4: string;
        mp4_size: string;
        webp: string;
        webp_size: string;
    };
    fixed_height_small_still: GiphyBaseImage;
    fixed_width_small: GiphyBaseImage & {
        size: string;
        mp4: string;
        mp4_size: string;
        webp: string;
        webp_size: string;
    };
    fixed_width_small_still: GiphyBaseImage;
    downsized: GiphyBaseImage & {
        size: string;
    };
    downsized_still: GiphyBaseImage;
    downsized_large: GiphyBaseImage & {
        size: string;
    };
    downsized_medium: GiphyBaseImage & {
        size: string;
    };
    downsized_small: GiphyBaseImage & {
        size: string;
    };
    original: GiphyBaseImage & {
        size: string;
        frames: string;
        mp4: string;
        mp4_size: string;
        webp: string;
        webp_size: string;
    };
    looping: {mp4: string};
    preview: {
        width: string;
        height: string;
        mp4: string;
        mp4_size: string;
    };
    preview_gif: GiphyBaseImage & {
        size: string;
    };
}

type GiphyRating = 'y' | 'g' | 'pg' | 'pg-13' | 'r';

export interface GiphyObject {
    type: string;
    id: string;
    slug: string;
    url: string;
    bitly_url: string;
    embed_url: string;
    username: string;
    source: string;
    rating: GiphyRating;
    content_url: string;
    user?:
        | {
              avatar_url: string;
              banner_url: string;
              profile_url: string;
              username: string;
              display_name: string;
              twitter: string;
          }
        | undefined;
    source_tld: string;
    source_post_url: string;
    update_datetime: string;
    create_datetime: string;
    import_datetime: string;
    trending_datetime: string;
    title: string;
    images: GiphyImages;
}

interface GiphyBaseResponse {
    pagination: {total_count: number; count: number; offset: number};
    meta: {
        status: number;
        msg: string;
        response_id: string;
    };
}

export interface GiphyMultiResponse extends GiphyBaseResponse {
    data: GiphyObject[];
}
