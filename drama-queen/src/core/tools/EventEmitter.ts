
export type EventEmitter<T> = {
    post: (event: T) => void;
    attach: (handler: (event: T) => void) => void;
    detach: (handler: (event: T) => void) => void;  
}

export type NonPostable<T> = {
    attach: (handler: (event: T) => void) => void;
    detach: (handler: (event: T) => void) => void;  
}

export function createEventEmitter<T>(): EventEmitter<T> {
    const handlers: ((event: T) => void)[] = [];
    return {
        "post": (event) => {
            for (const handler of handlers) {
                handler(event);
            }
        },
        "attach": (handler) => {
            handlers.push(handler);
        },
        "detach": (handler) => {
            const index = handlers.indexOf(handler);
            if (index !== -1) {
                handlers.splice(index, 1);
            }
        }
    };
}