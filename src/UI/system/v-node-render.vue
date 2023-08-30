<script lang="ts">
export default {
  functional: true,
  render: (h, ctx) => {
    ctx.props.vnode.componentOptions.listeners = Object.assign(ctx.props.vnode.componentOptions.listeners || {}, ctx.props.listeners);
    ctx.props.vnode.componentOptions.propsData = Object.assign(ctx.props.vnode.componentOptions.propsData, ctx.props.propsData);
    return ctx.props.vnode;
  },
};
</script>
