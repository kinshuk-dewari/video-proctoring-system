import throttle from "lodash/throttle";

type LoggerFn = (msg: string) => void;

/**
 * Create a named, throttled logger.
 * Each call to createNamedLogger returns a function that logs
 * messages but will only actually print at most once per `limitMs`.
 */
export const createNamedLogger = (limitMs = 3000): ((type: string, msg: string) => void) => {
  const loggers = new Map<string, LoggerFn>();

  return (type: string, msg: string) => {
    if (!loggers.has(type)) {
      const fn = throttle((m: string) => {
        console.log(`[EVENT][${type}] ${m}`);
      }, limitMs, { trailing: false });
      loggers.set(type, fn);
    }
    loggers.get(type)!(msg);
  };
};
