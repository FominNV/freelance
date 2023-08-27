<!-- eslint-disable vue/max-len -->
<template>
  <g>
    <path
      :fill="`url(#${id})`"
      d="M13.4 36.8a8 8 0 0 1 5.5 10.8l-.7 1.9a48.1 48.1 0 1 0 93.6 22c.7-4.4 4.3-8 8.7-8 4.4 0 8.1 3.6 7.5 8A64.1 64.1 0 1 1 3.8 42a8 8 0 0 1 9.6-5.2z"
    >
      <animateTransform
        attributeName="transform"
        dur="0.9s"
        from="360 64 64"
        repeatCount="indefinite"
        to="0 64 64"
        type="rotate"
      />
    </path>

    <linearGradient
      :id="id"
      x1="-232.4"
      x2="-235.5"
      y1="448.8"
      y2="456.2"
      gradientTransform="matrix(12.8571 -9 -9 -12.8571 7136.7 3790.3)"
      gradientUnits="userSpaceOnUse"
    >
      <stop
        offset="0"
        class="gradient-stop"
      />
      <stop
        class="gradient-stop"
        offset=".8"
        stop-opacity=".1"
      />
      <stop
        class="gradient-stop"
        offset=".9"
        stop-opacity="0"
      />
      <stop
        class="gradient-stop"
        offset="1"
        stop-opacity="0"
      />
    </linearGradient>
  </g>
</template>

<script setup lang="ts">
import { createGuid } from '../../../lib/guid';

const id = createGuid();
</script>
