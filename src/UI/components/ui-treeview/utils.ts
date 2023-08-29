export function recursionDown(obj: any, fn: any): any {
  let res;
  if (Array.isArray(obj)) {
    return obj.map((node: any) => recursionDown(node, fn));
  }
  res = fn(obj);
  if (res !== false && obj.nodes && obj.nodes.length) {
    res = recursionDown(obj.nodes, fn);
  }
  return res;
}
