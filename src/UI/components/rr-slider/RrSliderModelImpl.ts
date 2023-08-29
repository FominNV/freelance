export interface RrSliderModelImpl {
  value: number | number[],
  dragging: boolean,
  handleIndex: number,
  initX: number,
  initY: number,
  barWidth: number,
  barHeight: number,
  dragListener: ((event: Event) => void) | null,
  dragEndListener: ((event: Event) => void) | null,
}
