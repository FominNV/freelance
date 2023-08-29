<template>
  <section :class="classes">
    <div
      v-for="(item, index) of items"
      :key="index"
      class="ui-timeline__event"
    >
      <div
        class="ui-timeline__event-opposite"
        v-if="useOpposite"
      >
        <!-- @slot слот для размещения информации во второй колонке при align = alternate -->
        <slot
          name="opposite"
          :item="item"
          :index="index"
        />
      </div>
      <div class="ui-timeline__event-separator">
        <!-- @slot слот для кастомизации маркера -->
        <slot
          name="marker"
          :item="item"
          :index="index"
        >
          <div class="ui-timeline__event-marker">
            <!-- @slot слот для добавления контента в маркер -->
            <slot
              name="marker-content"
              :item="item"
              :index="index"
            />
          </div>
        </slot>
        <!-- @slot слот для кастомизации коннектора -->
        <slot
          v-if="index !== items.length - 1"
          name="connector"
          :item="item"
          :index="index"
        >
          <div class="ui-timeline__event-connector" />
        </slot>
      </div>
      <div class="ui-timeline__event-content">
        <!-- @slot слот для размещения контента -->
        <slot
          name="content"
          :item="item"
          :index="index"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ClassPropsType } from '../../@types/props';
import {
  TimelineLayoutType,
  TimelineAlignType,
} from './interface';

export interface UiTimelineProps {
  /** направление элементов временной линии  */
  layout?: TimelineLayoutType;
  /** выравнивание маркеров */
  align?: TimelineAlignType;
  /** отобразить дополнительную колонку (обязательна для align = alternate) */
  useOpposite?: boolean;
  /** элементы временной линии */
  items: object[];
}

const props = withDefaults(defineProps<UiTimelineProps>(), {
  layout: 'vertical',
  align: 'left',
  useOpposite: true,
});

const classes = computed<ClassPropsType>(() => [
  'ui-timeline',
  {
    [`ui-timeline--layout-${props.layout}`]: props.layout,
    [`ui-timeline--align-${props.align}`]: props.align,
  },
]);

</script>
<style>
.ui-timeline {
  --timeline-marker-size: 24px;
  --timeline-marker-border-width: 2px;
  --timeline-marker-border-type: solid;
  --timeline-marker-border-color: var(--color-primary-500);
  --timeline-marker-background-color: var(--color-neutral-0);
  --timeline-connector-color: var(--color-primary-500);
  --timeline-connector-width: 2px;

  display: flex;
  flex-grow: 1;
  flex-direction: column;
}

.ui-timeline--align-left .ui-timeline__event-opposite {
  text-align: right;
}

.ui-timeline--align-left .ui-timeline__event-content {
  text-align: left;
}

.ui-timeline--align-right .ui-timeline__event {
  flex-direction: row-reverse;
}

.ui-timeline--align-right .ui-timeline__event-opposite {
  text-align: left;
}

.ui-timeline--align-right .ui-timeline__event-content {
  text-align: right;
}

.ui-timeline--layout-vertical.ui-timeline--align-alternate .ui-timeline__event:nth-child(even) {
  flex-direction: row-reverse;
}

.ui-timeline--layout-vertical.ui-timeline--align-alternate .ui-timeline__event:nth-child(odd) .ui-timeline__event-opposite {
  text-align: right;
}

.ui-timeline--layout-vertical.ui-timeline--align-alternate .ui-timeline__event:nth-child(odd) .ui-timeline__event-content {
  text-align: left;
}

.ui-timeline--layout-vertical.ui-timeline--align-alternate .ui-timeline__event:nth-child(even) .ui-timeline__event-opposite {
  text-align: left;
}

.ui-timeline--layout-vertical.ui-timeline--align-alternate .ui-timeline__event:nth-child(even) .ui-timeline__event-content {
  text-align: right;
}

.ui-timeline__event {
  display: flex;
  position: relative;
  min-height: 70px;
}

.ui-timeline__event:last-child {
  min-height: 0;
}

.ui-timeline__event-opposite {
  flex: 1;
  padding: 0 1rem;
}

.ui-timeline__event-content {
  flex: 1;
  padding: 0 1rem;
}

.ui-timeline__event-separator {
  flex: 0;
  display: flex;
  align-items: center;
  flex-direction: column;
}

.ui-timeline__event-marker {
  display: flex;
  align-self: baseline;
}

.ui-timeline__event-connector {
  flex-grow: 1;
}

.ui-timeline--layout-horizontal {
  flex-direction: row;
}

.ui-timeline--layout-horizontal .ui-timeline__event {
  flex-direction: column;
  flex: 1;
}

.ui-timeline--layout-horizontal .ui-timeline__event:last-child {
  flex: 1 0;
}

.ui-timeline--layout-horizontal .ui-timeline__event-separator {
  flex-direction: row;
}

.ui-timeline--layout-horizontal .ui-timeline__event-connector {
  width: 100%;
  height: var(--timeline-connector-width);
}

.ui-timeline--align-bottom .ui-timeline__event {
  flex-direction: column-reverse;
}

.ui-timeline--layout-horizontal.ui-timeline--align-alternate .ui-timeline__event:nth-child(even) {
  flex-direction: column-reverse;
}

.ui-timeline .ui-timeline__event-marker {
  border: var(--timeline-marker-border-width) var(--timeline-marker-border-type) var(--timeline-marker-border-color);
  width: 1em;
  height: 1em;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--timeline-marker-size);
  background-color: var(--timeline-marker-background-color);
  position: relative;
  z-index: 4;
  border-radius: 50%;
}

.ui-timeline.ui-timeline--layout-vertical .ui-timeline__event-connector {
  width: var(--timeline-connector-width);
}

.ui-timeline .ui-timeline__event-connector {
  background-color: var(--timeline-connector-color);
}
</style>
