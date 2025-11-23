import { EventHandlerRequest, getHeader, H3Event } from 'h3';

export function getCurrentURL(event: H3Event<EventHandlerRequest>) {
  const host = getHeader(event, 'host') || 'localhost';
  const protocol = getHeader(event, 'x-forwarded-proto');
  return `${protocol}://${host}`;
}
