<template>
  <div class="ui-steps">
    <div
      class="ui-steps--size-default"
      v-if="size === 'default'"
    >
      <template v-for="step, index in steps">
        <ui-icon
          v-if="index > 0"
          :key="index"
          :name="'arrows/chevron-right'"
        />
        <ui-steps-item
          :number="showMode !== 'title' ? step.stepNumber : null"
          :title="showMode !== 'number' ? step.title : null"
          :active="step.id === currentStepId"
        />
      </template>
    </div>

    <div
      class="ui-steps--size-mini"
      v-if="size === 'mini'"
    >
      <div class="ui-steps__mini-numbers">
        <ui-steps-item
          :number="currentStep?.stepNumber"
          :active="true"
        />
        <ui-icon :name="'system/minus-small'" />
        <ui-steps-item :number="steps[steps.length - 1].stepNumber" />
      </div>
      <ui-steps-item
        :title="currentStep?.title"
        :active="true"
      />
    </div>

    <!-- @slot слот для размещения кнопки -->
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import rrIcon from '../ui-icon/ui-icon.vue';
import rrStepsItem from './ui-steps-item.vue';
import { StepImpl } from './StepImpl';

export interface UiStepsPropsImpl {
  /** список элементов-шагов */
  steps: StepImpl[]
  /** идентифокатор текущего шага */
  currentStepId: string;
  /**
   * Режим отображения названий и номеров шагов (не работает при size='mini')
   * @param all отображаются названия и номера шагов
   * @param title отображаются только названия шагов
   * @param number отображаются только номера шагов
   */
  showMode?: 'all' | 'title' | 'number';
  /**
   * Режим размера компонента
   * @param default размер по умолчанию
   * @param mini мини-версия
   */
  size?: 'default' | 'mini'
}

const props = withDefaults(defineProps<UiStepsPropsImpl>(), {
  showMode: 'all',
  size: 'default',
});

const currentStep = computed<StepImpl | undefined>(() => props.steps.find((step) => step.id === props.currentStepId));
</script>

<style>
.ui-steps {
  --steps-font-size: var(--paragraph-md-font-size);
  --steps-line-height: var(--paragraph-md-line-height);
  --steps-font-weight: var(--paragraph-md-font-weight);
  --steps-letter-spacing: var(--paragraph-md-letter-spacing);
  --steps-column-gap: var(--spacing-1);
  --steps-numbers-column-gap: var(--spacing-0-25);
}

.ui-steps,
.ui-steps--size-default,
.ui-steps--size-mini {
  display: flex;
  align-items: center;
  column-gap: 16px;
  font-family: var(--steps--font-famaly-primary);
  font-size: var(--steps--font-size);
  line-height: var(--steps--line-height);
  font-weight: var(--steps--font-weight);
  letter-spacing: var(--steps-letter-spacing);
}

.ui-steps--size-min {
  column-gap: var(--steps-column-gap);
}

.ui-steps__mini-numbers {
  display: flex;
  justify-content: center;
  align-items: center;
  column-gap: var(--steps-numbers-column-gap);
}
</style>
