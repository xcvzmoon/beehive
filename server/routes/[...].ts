import proxyOverridesJson from '../config/proxy-overrides.json';

import { eventHandler, createError, proxyRequest } from 'h3';
import { getCachedServices } from '../utils/getCachedServices';
import { useRuntimeConfig } from 'nitropack/runtime/config';
import { getCurrentURL } from '../utils/getCurrentURL';

export default eventHandler(async (event) => {
  const nodeRequestURL = event.node.req.url;
  if (!nodeRequestURL) {
    throw createError({
      status: 400,
      statusMessage: 'Bad Request',
      message: 'URL is undefined or missing',
    });
  }

  const services = await getCachedServices();
  const matched = services?.find((service) => {
    if (!service.url || !service.target || !service.active) return;
    return nodeRequestURL.startsWith(service.url);
  });

  if (!matched) {
    throw createError({
      status: 404,
      statusMessage: 'Not Found',
      message: 'The requested path does not match any known routes',
    });
  }

  if (!matched.url) {
    throw createError({
      status: 502,
      statusMessage: 'Bad Gateway',
      message: `Service "${matched.url}" is misconfigured: missing URL.`,
    });
  }

  if (!matched.target) {
    throw createError({
      status: 502,
      statusMessage: 'Bad Gateway',
      message: `Service "${matched.url}" is misconfigured: missing target URL.`,
    });
  }

  const overrides: Record<string, string> = proxyOverridesJson as {};
  const runtimeConfig = useRuntimeConfig();

  let baseURL = getCurrentURL(event);

  if (overrides[matched.url]) baseURL = overrides[matched.url];
  else if (runtimeConfig.api.baseURL) baseURL = runtimeConfig.api.baseURL;

  const target = new URL(matched.url, baseURL);
  return proxyRequest(event, target.toString()) as unknown;
});
