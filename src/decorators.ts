import { Helper } from 'classes';

export function method(method: string, path: string, hasAuth = false) {

  return (target: any, key: string, descriptor: any) => {
    target.routes = target.routes || {}

    let routeKey = `${method}_${path}`;

    if (routeKey in target.routes) {
      target.routes[routeKey].args.push(descriptor.value);
    } else {
      let args = hasAuth ? [path, Helper.hasAuth, descriptor.value] : [path, descriptor.value];

      target.routes[routeKey] = { method, args }
    }
    return descriptor;
  }
}
