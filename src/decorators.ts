export function method(method: string, path: string) {

  return (target: any, key: string, descriptor: any) => {
    target.routes = target.routes || {}

    let routeKey = `${method}_${path}`;

    if (routeKey in target.routes) {
      target.routes[routeKey].args.push(descriptor.value);
    } else {
      target.routes[routeKey] = {
        method,
        args: [path, descriptor.value]
      }
    }
    return descriptor;
  }
}
