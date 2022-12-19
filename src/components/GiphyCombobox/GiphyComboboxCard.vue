<script setup lang="ts">
import type {GiphyObject} from '@/api/types';
import {ref} from 'vue';
/**
 * @See https://developers.giphy.com/docs/optional-settings#rendition-guide
 */
const props = defineProps<{
    giphyObject: GiphyObject;
    onSelect: (giphy: GiphyObject) => void;
}>();

const isThereVideo = Boolean(props.giphyObject.images.fixed_height.mp4);
const shouldShowImageFallback = ref<boolean>(!isThereVideo);
function activateImageFallback() {
    shouldShowImageFallback.value = true;
}

const isThereResponsiveImages = Boolean(
    props.giphyObject.images.fixed_height.webp &&
        props.giphyObject.images.original.webp
);
const imageSrcset = isThereResponsiveImages
    ? `${props.giphyObject.images.fixed_height.webp} ${props.giphyObject.images.fixed_height.width}w,
       ${props.giphyObject.images.original.webp} ${props.giphyObject.images.original.width}w,`
    : '';

function handleSelect() {
    props.onSelect(props.giphyObject);
    // TODO: Notify user via toast
    navigator.clipboard.writeText(props.giphyObject.url);
}
</script>

<template>
    <div
        class="giphy"
        :style="{
            'max-width': props.giphyObject.images.fixed_height.width + 'px',
        }"
        @click="handleSelect"
        @keyup.enter="handleSelect"
        tabindex="0"
    >
        <img
            loading="lazy"
            :class="[
                'giphyImageFallback',
                shouldShowImageFallback ? 'giphyImageFallbackActive' : '',
            ]"
            :src="props.giphyObject.images.fixed_height.url"
            :srcset="imageSrcset"
            sizes="(min-width: 768px) 360px, 200px"
            :alt="props.giphyObject.title"
        />
        <video v-if="isThereVideo" class="giphyVideo" autoplay playsinline loop>
            <source
                :src="props.giphyObject.images.fixed_height.mp4"
                @error="activateImageFallback"
                type="video/mp4"
            />
            <!-- fixed_height: 200px, width: 100-600px -->
        </video>
        <div class="giphyTitle">
            {{ props.giphyObject?.title || props.giphyObject?.slug }}
        </div>
    </div>
</template>

<style scoped>
.giphy {
    position: relative;
    height: 200px;
    width: 100%;
    animation: 1s fade-in forwards;
}

@keyframes fade-in {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

@media (min-width: 768px) {
    .giphy {
        width: auto;
        max-width: 600px;
    }
}

.giphyVideo,
.giphyImageFallback {
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    border-radius: 5px;
    background: #eaeaea;
}

.giphyImageFallback {
    position: absolute;
    display: none;
}

.giphyImageFallbackActive {
    display: block;
}

.giphyTitle {
    display: none;
    position: absolute;
    padding: 10px 5px;
    bottom: 0;
}
.giphy:hover .giphyTitle {
    display: block;
    background: #b0b0fc;
}
</style>
