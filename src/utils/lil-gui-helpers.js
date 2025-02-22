/**
 * @import { GUI } from "lil-gui";
 */

/**
 * @typedef {ReturnType<GUI['add']>} GUIAddReturnType
 * @typedef {{
 * 		[Key in keyof GUIAddReturnType]?: Parameters<GUIAddReturnType[Key]> | Parameters<GUIAddReturnType[Key]>[0]
 * 	}} GUIAddParams
 */

/**
 * @template {object} Obj
 *
 * @param {GUI} gui
 * @param {Obj} object
 * @param {keyof Obj & string} property
 * @param {GUIAddParams} param
 *
 */
export function guiAdd(gui, object, property, param) {
	const controller = gui.add(object, property);

	/** @type {keyof GUIAddReturnType} */
	let key;
	for (key in param) {
		if (typeof param[key] === "undefined") {
			continue;
		}

		if (Array.isArray(param[key])) {
			controller[key](...param[key]);
		} else {
			controller[key](param[key]);
		}
	}

	return controller;
}

/**
 * @template {object} Obj
 *
 * @param {GUI} gui
 * @param {Obj} object
 * @param {{ [PropKey in keyof Obj & string]?: GUIAddParams }} properties
 * @param {{ 	shared?: GUIAddParams, }} [options]
 */
export function guiAddMany(gui, object, properties, options) {
	let controller;
	const shared = options?.shared;

	/** @type {keyof Obj & string} */
	let propertyKey;
	for (propertyKey in properties) {
		const property = properties[propertyKey];
		if (typeof property === "undefined") {
			continue;
		}

		if (shared) {
			controller = guiAdd(gui, object, propertyKey, {
				...shared,
				...property,
			});
		} else {
			controller = guiAdd(gui, object, propertyKey, property);
		}
	}

	return controller;
}
