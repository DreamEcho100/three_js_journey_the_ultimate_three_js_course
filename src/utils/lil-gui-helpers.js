/**
 * @import { GUI } from "lil-gui";
 */

/** @type {unique symbol} */
const COLOR = Symbol("COLOR");
/** @type {unique symbol} */
const FOLDER = Symbol("FOLDER");
/** @type {unique symbol} */
const NORMAL = Symbol("NORMAL");

export const LIL_GUI_TYPES = /** @type {const} */ ({ COLOR, FOLDER, NORMAL });

/**
 * @typedef {ReturnType<GUI['add']>} GUIAddReturnType
 * @typedef {{
 * 		[Key in keyof GUIAddReturnType]?: Parameters<GUIAddReturnType[Key]> | Parameters<GUIAddReturnType[Key]>[0]
 * 	}} GUIAddParams
 */

/**
 * @typedef {ReturnType<GUI['addColor']>} GUIAddColorReturnType
 * @typedef {{
 * 		[Key in keyof GUIAddColorReturnType]?: Parameters<GUIAddColorReturnType[Key]> | Parameters<GUIAddColorReturnType[Key]>[0]
 * 	}} GUIAddColorParams
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
 * @param {keyof Obj & string} property
 * @param {GUIAddColorParams} param
 */
export function guiAddColor(gui, object, property, param) {
	const controller = gui.addColor(object, property);

	/** @type {keyof GUIAddColorReturnType} */
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
 * @typedef {GUIAddParams  & { $$type?: typeof LIL_GUI_TYPES['NORMAL']}} GUIAddManyNormalParams
 * @typedef {GUIAddColorParams & { $$type: typeof LIL_GUI_TYPES['COLOR']}} GUIAddManyColorParams
 *
 * @typedef {GUIAddManyNormalParams | GUIAddManyColorParams} GUIAddManyParams
 */

/**
 * @template {object} Obj
 *
 * @param {GUI} gui
 * @param {Obj} object
 * @param {{ [PropKey in keyof Obj & string]?: GUIAddManyParams }} properties
 * @param {{ 	shared?: GUIAddManyParams, }} [options]
 */
export function guiAddMany(gui, object, properties, options) {
	let controller;
	const shared = options?.shared;

	/** @type {keyof Obj & string} */
	let propertyKey;
	for (propertyKey in properties) {
		const { $$type, ...property } = properties[propertyKey];
		if (typeof property === "undefined") {
			continue;
		}

		switch ($$type) {
			case LIL_GUI_TYPES.COLOR:
				controller = guiAddColor(gui, object, propertyKey, {
					...shared,
					...property,
				});
				break;
			default:
				controller = guiAdd(gui, object, propertyKey, {
					...shared,
					...property,
				});
				break;
		}
	}

	return controller;
}
