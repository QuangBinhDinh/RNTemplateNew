import { useEffect } from 'react';

let signals: {
    action_name: string;
    controller: AbortController;
}[] = [];

const createSignal = (name: string) => {
    var controller = new AbortController();
    var obj = { action_name: name, controller };
    signals.push(obj);
    return signals[signals.length - 1].controller.signal;
};

const removeSignal = (name: string) => {
    signals = signals.filter(item => item.action_name != name);
};

const cancelRequest = (name: string) => {
    signals.find(item => item.action_name == name)?.controller.abort();
    //signals = signals.filter(item => item.action_name != name);
};

const cancelAll = () => {
    for (const item of signals) {
        item.controller.abort();
    }
    signals = [];
};

const useAbortController = () => {
    useEffect(() => {
        return () => {
            cancelAll();
        };
    }, []);
};

export { createSignal, removeSignal, cancelRequest, useAbortController };
