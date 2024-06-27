// this middleware is used to dynamically update the Layouts system.

// as soon as the route changes, it tries to pull the layout that the users want to display. Then it loads the layout component, and assigns the loaded component to the meta in the layout Component variable.

// if there is no layout defined, the default layout will be used: default

export async function loadLayoutMiddleware(route) {
  try {
    const layout = route.meta.layout
    const layoutComponent = await import(`../../layouts/${layout}.vue`)
    route.meta.layoutComponent = layoutComponent.default
  } catch (_e) {
    const layoutComponent = await import(`../../layouts/Default.vue`)
    route.meta.layoutComponent = layoutComponent.default
  }
}
