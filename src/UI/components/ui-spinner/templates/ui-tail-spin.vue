<template>
  <g>
    <defs>
      <linearGradient
        x1="8.042%"
        y1="0%"
        x2="65.682%"
        y2="23.865%"
        :id="id"
      >
        <stop
          stop-opacity="0"
          offset="0%"
          class="gradient-stop"
        />
        <stop
          stop-opacity=".631"
          offset="63.146%"
          class="gradient-stop"
        />
        <stop
          offset="100%"
          class="gradient-stop"
        />
      </linearGradient>
    </defs>
    <g
      fill="none"
      fill-rule="evenodd"
    >
      <g transform="translate(1 1)">
        <path
          class="tail-spin-path"
          d="M120 64c0-9.94-8.06-60-60-60"
          id="Oval-2"
          :stroke="`url(#${id})`"
          stroke-width="4"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 60 60"
            to="360 60 60"
            dur="0.9s"
            repeatCount="indefinite"
          />
        </path>
        <circle
          cx="36"
          cy="18"
          r="1"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 60 60"
            to="360 60 60"
            dur="0.9s"
            repeatCount="indefinite"
          />
        </circle>
      </g>
    </g>
  </g>
</template>

<script setup lang="ts">
import { createGuid } from '../../../lib/guid';

const id = createGuid();
</script>
