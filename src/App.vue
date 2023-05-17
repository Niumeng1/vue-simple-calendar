<template>
	<div id="app">
		<h1 class="title" style="padding-top: 1rem; padding-left: 1rem">UI工作排期表</h1>

		<example-full v-if="exampleMode == 'Full'" />
		<example-simple v-else />
	</div>
</template>
<script setup lang="ts">
import { ref } from "vue"
import ExampleFull from "./ExampleFull.vue"

const exampleMode = ref("Full")
</script>
