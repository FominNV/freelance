<template lang="pug">
div
  ui-button(text="ui-button" theme="primary")
  ui-table(
    :columns=[{id: 'name'}]
    :items="[{name: 'Testing'}]"
  )
</template>

<script setup lang="ts">
</script>

