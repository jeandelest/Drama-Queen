export const listenActivity = (): Promise<void> => {
  const activityEvents: (keyof HTMLElementEventMap)[] = [
    "mousedown",
    "mousemove",
    "keydown",
    "scroll",
    "touchstart",
  ];
  return new Promise((resolve) => {
    const listener = (): void => {
      resolve();
    };
    activityEvents.forEach((eventName: keyof HTMLElementEventMap) => {
      window.addEventListener(eventName, listener, { once: true });
    });
  });
};
