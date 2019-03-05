<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>
import { initDBTables } from "@/utils/dbUtil";
import { initDirs } from "@/utils/util";
export default {
    name: "timebook",
    created() {
        initDBTables();
        initDirs();
    },
    methods: {}
};
</script>

<style>
</style>
