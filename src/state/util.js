import { useDispatch } from "react-redux";

/**
 * @function StateUpdater
 * @param {object} state
 * @return {object} updated state
 */

/**
 * @function Actor
 * @param {*} payload
 * @return StateUpdater
 */

const required = ([name] = [""]) => {
  throw new Error(`${name || "value"} is required.`);
};
const r = required;
/**
 * A function that assumes only one value in the matching object will be true.
 * Calls last value in an object where key is true.
 *
 * @param {Object.<string, function>} obj
 * @param {*} payload - Optional payload to include in the matching function
 * @returns {*}
 *
 * @example
 * const test = payload =>
 *  match({
 *      true: () => payload,
 *      [payload.length === 0]: () => undefined,
 *      [payload.length === 1]: () => payload[0]
 *  })
 */
export const match = (obj = r`matcher object`, ...payload) => {
  if (!obj || typeof obj !== "object" || Array.isArray(obj))
    throw new Error("Match requires an object");
  if (obj[true] === undefined) return obj.default || obj._ || null;
  if (typeof obj[true] === "function") return obj[true](...payload);
  return obj[true];
};

/**
 *
 * @param payload
 * @returns {*}
 */
const payloadUnpacker = payload =>
  match({
    true: payload,
    [payload.length === 0]: () => undefined,
    [payload.length === 1]: () => payload[0]
  });

/**
 * Actor functions expect an exact payload and then state.
 * Actions fired from the interface take the shape { type: string, payload: object }
 * This function takes on object of actors and converts them into actions ready for use with Redux.
 * @param updaters
 * @returns {{}}
 */
export const createActions = updaters =>
  Object.keys(updaters).reduce(
    (acc, type) => ({
      ...acc,
      [type]: (...payload) => ({
        type,
        payload: payloadUnpacker(payload)
      })
    }),
    {}
  );

export const createReducer = (actors, initialState) => (
  state = initialState,
  { type, payload } = {}
) => (type in actors ? actors[type](payload)(state) : state);

export const useEntityDispatch = entityId => {
  const dispatch = useDispatch();
  return action => {
    dispatch({ id: entityId, ...action });
  };
};

/**
 * @typedef {Object<string, function(*=, *=): function({x: *, y: *}): {x: *, y: *}>} Actors
 */

/**
 *
 * @type {Actors}
 */
const o = {
  move: (nextX, nextY) => ({ x, y }) => ({ x: nextX, y: nextY || y }),
  test: "a",
  func: () => "func"
};

// console.log(o, o.move(1)(1));
