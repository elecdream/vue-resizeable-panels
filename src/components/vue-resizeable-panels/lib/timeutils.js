const DEFAULT_MS = 10;

let throttle_timer = undefined;
let throttled_fn = undefined;

export function throttle(fn, ms = DEFAULT_MS) {
  if (throttle_timer === undefined) {
    fn();
    throttle_timer = setTimeout(() => {
      if (throttled_fn !== undefined) throttled_fn();
      throttled_fn = undefined;
      throttle_timer = undefined;
    }, ms);
  } else {
    throttled_fn = fn;
  }
}

let deferred_timer = undefined;
let deferred_fn = undefined;

export function defer(fn, ms = DEFAULT_MS) {
  setTimeout(() => {
    fn();
  }, ms)
}