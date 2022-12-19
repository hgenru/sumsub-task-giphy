<script setup lang="ts">
import {nextTick, ref} from 'vue';
import {debounce} from '@/utils/debounce';
import {searchGiphy} from '@/api/search-giphy';
import GifyComboboxDropdown from './GiphyComboboxDropdown.vue';
import type {GiphyObject} from '@/api/types';

type SearchRequest =
    | {
          status: 'initial' | 'loading';
      }
    | {
          status: 'success';
          data: GiphyObject[];
      }
    | {
          status: 'failed';
          reason: Error | any;
      };

let searchRequestAbortController: AbortController;
const searchRequest = ref<SearchRequest>({status: 'initial'});

const query = ref<string>('');
async function handleQueryChange(e: Event) {
    const target = (e.currentTarget || e.target) as HTMLInputElement;
    searchRequest.value = {status: 'loading'};
    if (searchRequestAbortController) {
        searchRequestAbortController.abort();
    }
    searchRequestAbortController = new AbortController();
    try {
        const searchResponse = await searchGiphy(target.value, {
            signal: searchRequestAbortController.signal,
        });
        searchRequest.value = {
            status: 'success',
            data: searchResponse.data,
        };
    } catch (e) {
        if (!(e instanceof Error && e.name === 'AbortError')) {
            console.error(e);
            searchRequest.value = {
                status: 'failed',
                reason: e,
            };
        }
    }
}
const handleQueryChangeDebounced = debounce(handleQueryChange);

const shouldShowDropdown = ref(false);
const comboboxElementRef = ref<HTMLElement>();
const comboboxInputElementRef = ref<HTMLElement>();
function hideDropdownOnClickOutside(e: MouseEvent) {
    const element = comboboxElementRef.value;
    const target = e.target as HTMLElement;
    const wasClickInside = element && target && element.contains(target);
    if (!wasClickInside) {
        document.documentElement.removeEventListener(
            'click',
            hideDropdownOnClickOutside
        );
        hideDropdown();
    }
}
function showDropdown(e: Event) {
    shouldShowDropdown.value = true;
    nextTick(() => {
        if (comboboxInputElementRef.value) {
            comboboxInputElementRef.value?.focus();
        }
        document.documentElement.addEventListener(
            'click',
            hideDropdownOnClickOutside
        );
    });
}
function hideDropdown() {
    shouldShowDropdown.value = false;
}

const currentGiphy = ref<GiphyObject>();
function handleGiphySelect(giphy: GiphyObject) {
    currentGiphy.value = giphy;
    hideDropdown();
}
</script>

<template>
    <div class="giphyCombobox" ref="comboboxElementRef">
        <div class="giphyComboboxControl">
            <button
                class="giphyComboboxButton"
                @click="showDropdown"
                aria-label="Giphy select"
            >
                {{
                    currentGiphy?.title ||
                    currentGiphy?.slug ||
                    '[Select Giphy]'
                }}
            </button>
        </div>
        <div class="giphyComboboxDropdown" v-show="shouldShowDropdown">
            <input
                class="giphyComboboxSearchInput"
                type="text"
                role="combobox"
                aria-autocomplete="none"
                :aria-expanded="shouldShowDropdown"
                @input="handleQueryChangeDebounced"
                v-model="query"
                ref="comboboxInputElementRef"
            />
            <div
                class="giphyComboboxLoader"
                v-show="searchRequest.status === 'loading'"
            >
                <div
                    class="giphyComboboxLoaderPlaceholder"
                    style="width: 200px"
                />
                <div
                    class="giphyComboboxLoaderPlaceholder"
                    style="width: 400px"
                />
                <div
                    class="giphyComboboxLoaderPlaceholder"
                    style="width: 200px"
                />
                <div
                    class="giphyComboboxLoaderPlaceholder"
                    style="width: 300px"
                />
                <div
                    class="giphyComboboxLoaderPlaceholder"
                    style="width: 400px"
                />
            </div>
            <div v-show="searchRequest?.data?.length === 0">Gifs not found</div>
            <GifyComboboxDropdown
                :on-select="handleGiphySelect"
                :giphy-objects="searchRequest.data"
            />
            <button
                class="giphyComboboxClose"
                @click="hideDropdown"
                aria-label="Close giphy select"
            >
                ×
            </button>
        </div>
    </div>
</template>

<style scoped>
.giphyCombobox {
    position: relative;
}

.giphyComboboxButton {
    display: block;
    padding: 14px;

    font-size: 1.2em;
    color: black;
    background: white;
    border: solid 4px #b0b0fc;

    text-align: center;

    cursor: pointer;
}

.giphyComboboxDropdown {
    position: fixed;
    padding: 10px;
    width: 100%;
    height: 100vh;
    top: 0;
    left: 0;
    box-sizing: border-box;
    overflow-x: hidden;
    overflow-y: auto;
    border: solid 4px #b0b0fc;
    background: white;
}
@media (min-width: 768px) {
    .giphyComboboxDropdown {
        position: absolute;
        height: auto;
        max-height: 60vh;
        top: auto;
        left: auto;
    }
}

.giphyComboboxClose {
    position: fixed;
    bottom: 10px;
    right: 10px;
    font-size: 2em;
    background: white;
    appearance: none;
    float: right;
    padding: 2px 10px;
    border-radius: 50%;
    border: solid 4px #b0b0fc;
}
@media (min-width: 768px) {
    .giphyComboboxClose {
        display: none;
    }
}

.giphyComboboxSearchInput {
    position: sticky;
    z-index: 1;
    top: 0;
    width: 100%;
    box-sizing: border-box;
    margin-bottom: 20px;
    padding: 10px;
    font-size: 1.2em;
    color: black;
    background: white;
    border: solid 4px #b0b0fc;
}

.giphyComboboxLoader {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
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

.giphyComboboxLoaderPlaceholder {
    height: 200px;
    width: 400px;
    border-radius: 5px;
    background: linear-gradient(
            100deg,
            rgba(255, 255, 255, 0) 40%,
            rgba(255, 255, 255, 0.5) 50%,
            rgba(255, 255, 255, 0) 60%
        )
        rgb(224, 224, 224);
    background-size: 200% 100%;
    background-position-x: 180%;
    animation: 1.5s loading ease-in-out infinite;
}

@keyframes loading {
    to {
        background-position-x: -20%;
    }
}
</style>
