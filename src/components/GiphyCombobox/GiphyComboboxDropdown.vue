<script setup lang="ts">
import GiphyComboboxCard from './GiphyComboboxCard.vue';
import type {GiphyObject} from '@/api/types';

const props = defineProps<{
    giphyObjects?: GiphyObject[];
    onSelect: (giphy: GiphyObject) => void;
}>();
</script>

<template>
    <ul class="giphyList" role="listbox">
        <li
            role="option"
            class="giphyListItem"
            v-for="giphyObject in props.giphyObjects"
            :key="giphyObject.slug"
        >
            <GiphyComboboxCard
                :giphy-object="giphyObject"
                :on-select="props.onSelect"
            />
        </li>
    </ul>
</template>

<style scoped>
.giphyList {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    padding: 0;
    margin: 0;
}

.giphyListItem {
    display: block;
    padding: 0;
    margin: 0;
}
</style>
