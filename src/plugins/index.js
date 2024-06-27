import { initI18n } from "./i18";
import { initPinia } from "./pinia";
import { initRouter } from "./router";

export const initPlugins = (app) => {
  const i18n = initI18n(app);
  const router = initRouter(app);
  const pinia = initPinia(app, router, i18n);

  app.use(i18n);
  app.use(pinia);
  app.use(router);
};
