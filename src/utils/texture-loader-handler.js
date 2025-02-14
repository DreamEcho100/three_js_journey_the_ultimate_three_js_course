/**
 * @import { Texture, LoadingManager } from 'three';
 */

import { TextureLoader } from 'three';

/**
 * @description
 *
 * The following is a TS utility that will take something like this:
 * `/textures/door/color.jpg'` and return `doorColorTexture`
 * It will:
 * 	- Start the operation after the first `textures` segment.
 * 	- Replace `/` with ``.
 * 	- Capitalize the first letter of the segment after `textures`.
 * 	- Remove the file extension.
 * 	- Concatenate the segments in reverse order.
 * 	- Return the result with `Texture` appended.
 *
 *
 * @template {string} Path
 *
 * @typedef {Path extends `${infer Segment}/${infer Rest}` ? `${FormattedPath<Rest>}${Capitalize<Segment>}` : Path} FormattedPath
 */

/**
 * @description
 *
 * This utility that will take something like this:
 * `/textures/door/color.jpg'` and return `doorColorTexture`
 * It will:
 * 	- Start the operation after the first `textures` segment.
 * 	- Replace `/` with ``.
 * 	- Capitalize the first letter of the segment after `textures`.
 * 	- Remove the file extension.
 * 	- Concatenate the segments in reverse order.
 * 	- Return the result with `Texture` appended.
 *
 * @example
 *
 * ```js
 * const str = '/assets/textures/door/color.jpg';
 * const result = deriveTextureName(str);
 * console.log(result); // Output: 'colorDoorTexture'
 * ```
 *
 * @param {string} str
 * @returns {string}
 * @throws {Error}
 */
function deriveTextureName(str) {
	const segments = str.split('/');
	const lastSegment = segments.pop()?.split('.')[0];

	if (typeof lastSegment !== 'string' || segments.length < 2) {
		throw new Error(
			'Invalid path: Must have at least two segments before file name'
		);
	}

	let name = lastSegment[0].toLowerCase() + lastSegment.slice(1);

	let texturesIndex = segments.indexOf('textures');

	// if (str.startsWith('/') && !str.includes('/textures/')) {
	// 	throw new Error('Path must contain `/textures/` segment');
	// }

	if (texturesIndex === -1) {
		throw new Error('Invalid path, no `textures` segment found');
	}

	for (let j = segments.length - 1; j > texturesIndex; j--) {
		const segment = segments[j];
		name += segment[0].toUpperCase() + segment.slice(1);
	}

	return name + 'Texture';
}

/**
 * @template Path
 *
 * @typedef {Path extends `${string}/textures/${infer UnformattedName}.${string}`
 * 	? `${FormattedPath<UnformattedName>}Texture`
 * 	: never} PathTextureFormatter
 */

/**
 * @typedef {{
 * onLoad?: (data: Texture) => void,
 * onProgress?: (event: ProgressEvent) => void,
 * onError?: (err: unknown) => void,
 * }} TextureLoadParamsExceptUrlAsAsRecord
 */

/**
 * @template {string} Name
 * @template {string} Path
 * @template {([Path, Name] | [Path, Name, TextureLoadParamsExceptUrlAsAsRecord] | [Path] | [Path, TextureLoadParamsExceptUrlAsAsRecord] | Path)} ReturnItem
 *
 * @typedef {{
 * 	[Key in ReturnItem extends string
 * 		? PathTextureFormatter<ReturnItem>
 * 		: ReturnItem extends [infer Path, infer Name, ...infer Rest]
 * 			? Name extends string
 * 				? Name
 * 				: PathTextureFormatter<Path>
 * 			: ReturnItem extends [infer Path, ...infer Rest]
 * 				? PathTextureFormatter<Path>
 * 				: never
 * 	]: Texture;
 * }} TextureLoaderHandlerReturnObject
 */

/**
 * @template {string} Name
 * @template {string} Path
 * @template {([Path, Name] | [Path, Name, TextureLoadParamsExceptUrlAsAsRecord] | [Path] | [Path, TextureLoadParamsExceptUrlAsAsRecord] | Path)} ReturnItem
 *
 * @typedef {TextureLoaderHandlerReturnObject<Name, Path, ReturnItem> extends infer Output ? Map<keyof Output, Output[keyof Output]> : never} TextureLoaderHandlerReturn
 */

/**
 * @template {string} Name
 * @template {string} Path
 * @template {([Path, Name] | [Path, Name, TextureLoadParamsExceptUrlAsAsRecord] | [Path] | [Path, TextureLoadParamsExceptUrlAsAsRecord] | Path)} ReturnItem
 *
 * @param {ReturnItem extends ([Path, Name] | [Path, Name, TextureLoadParamsExceptUrlAsAsRecord] | [Path] | [Path, TextureLoadParamsExceptUrlAsAsRecord] | Path)} item
 * @param {TextureLoader} textureLoader
 * @returns {[name: string, texture: Texture]}
 * @throws {Error}
 */
function loadTexture(item, textureLoader) {
	let name = '';
	let path = '';
	let onLoad;
	let onProgress;
	let onError;

	if (typeof item === 'string') {
		name = deriveTextureName(item);
		path = item;
	} else if (!Array.isArray(item) || item.length === 0 || item.length > 3) {
		throw new Error(
			`Invalid input shape for loadTexture: ${JSON.stringify(item)}`
		);
	} else if (item.length === 1) {
		name = deriveTextureName(item[0]);
		path = item[0];
	} else if (item.length === 2) {
		path = item[0];

		if (typeof item[1] === 'string') {
			name = item[1];
		} else {
			name = deriveTextureName(item[0]);
			onLoad = item[1].onLoad;
			onProgress = item[1].onProgress;
			onError = item[1].onError;
		}
	} else if (item.length === 3) {
		path = item[0];
		name = item[1];
		onLoad = item[2].onLoad;
		onProgress = item[2].onProgress;
		onError = item[2].onError;
	}

	const texture = textureLoader.load(path, onLoad, onProgress, onError);

	return [name, texture];
}

/**
 * @template {string} Name
 * @template {string} Path
 * @template {([Path, Name] | [Path, Name, TextureLoadParamsExceptUrlAsAsRecord] | [Path] | [Path, TextureLoadParamsExceptUrlAsAsRecord] | Path)} ReturnItem
 *
 * @param {ReturnItem[]} items
 * @param {{ textureLoader: TextureLoader; loadingManager?: LoadingManager }} [options]
 * @returns {[TextureLoaderHandlerReturn<Name, Path, ReturnItem>, textureLoader]}
 *
 * @example
 * ```js
 * import { RepeatWrapping } from 'three';
 * import { loadTextures_map } from '#utils/texture-loader-handler.js';
 *
 * const [textures, textureLoader] = loadTextures_map([
 * 	['/textures/door/color.jpg'],
 * 	['/textures/door/alpha.jpg', 'doorAlphaTexture'],
 * 	'/textures/door/height.jpg',
 * 	[
 * 		'/textures/door/normal.jpg',
 * 		{
 * 			onLoad: (texture) => {
 * 				texture.repeat.set(2, 1);
 * 				texture.wrapS = texture.wrapT = RepeatWrapping;
 * 			}
 * 		}
 * 	],
 * 	[
 * 		'/textures/door/ambientOcclusion.jpg',
 * 		'ambientOcclusionTexture',
 * 		{
 * 			onLoad: (texture) => {
 * 				texture.repeat.set(2, 1);
 * 				texture.wrapS = texture.wrapT = RepeatWrapping;
 * 			}
 * 		}
 * 	]
 * ]);
 *
 * const colorDoorTexture = textures.get('colorDoorTexture'); // Texture | undefined
 * const doorAlphaTexture = textures.get('doorAlphaTexture'); // Texture | undefined
 * const heightDoorTexture = textures.get('heightDoorTexture'); // Texture | undefined
 * const normalDoorTexture = textures.get('normalDoorTexture'); // Texture | undefined
 * const ambientOcclusionTexture = textures.get('ambientOcclusionTexture'); // Texture | undefined
 * ```
 * @throws {Error}
 */
export function loadTextures_map(items, options) {
	const textureLoader = options?.textureLoader ?? new TextureLoader();

	/** @type {Map<string, any>} */
	const loadedItems = new Map();

	for (const item of items) {
		const [name, texture] = loadTexture(item, textureLoader);
		loadedItems.set(name, texture);
	}

	return [
		/** @type {TextureLoaderHandlerReturn<Name, Path, ReturnItem>} */ (
			loadedItems
		),
		textureLoader
	];
}

/**
 * @template {string} Name
 * @template {string} Path
 * @template {([Path, Name] | [Path, Name, TextureLoadParamsExceptUrlAsAsRecord] | [Path] | [Path, TextureLoadParamsExceptUrlAsAsRecord] | Path)} ReturnItem
 *
 * @param {ReturnItem[]} items
 * @param {{ textureLoader: TextureLoader; loadingManager?: LoadingManager }} [options]
 * @returns {[TextureLoaderHandlerReturnObject<Name, Path, ReturnItem>, textureLoader]}
 *
 * @example
 * ```js
 * import { RepeatWrapping } from 'three';
 * import { textureLoaderHandler } from '#utils/texture-loader-handler.js';
 *
 * const [
 * 	{
 * 		colorDoorTexture,
 * 		doorAlphaTexture,
 * 		heightDoorTexture,
 * 		normalDoorTexture,
 * 		ambientOcclusionTexture
 * 	},
 * 	textureLoader
 * ] = textureLoaderHandler([
 * 	['/textures/door/color.jpg'],
 * 	['/textures/door/alpha.jpg', 'doorAlphaTexture'],
 * 	'/textures/door/height.jpg',
 * 	[
 * 		'/textures/door/normal.jpg',
 * 		{
 * 			onLoad: (texture) => {
 * 				texture.repeat.set(2, 1);
 * 				texture.wrapS = texture.wrapT = RepeatWrapping;
 * 			}
 * 		}
 * 	],
 * 	[
 * 		'/textures/door/ambientOcclusion.jpg',
 * 		'ambientOcclusionTexture',
 * 		{
 * 			onLoad: (texture) => {
 * 				texture.repeat.set(2, 1);
 * 				texture.wrapS = texture.wrapT = RepeatWrapping;
 * 			}
 * 		}
 * 	]
 * ]);
 * ```
 * @throws {Error}
 */
export function loadTextures_obj(items, options) {
	const textureLoader = options?.textureLoader ?? new TextureLoader();

	/** @type {Record<string, any>} */
	const loadedItems = {};

	for (const item of items) {
		const [name, texture] = loadTexture(item, textureLoader);
		loadedItems[name] = texture;
	}

	return [
		/** @type {TextureLoaderHandlerReturnObject<Name, Path, ReturnItem>} */ (
			loadedItems
		),
		textureLoader
	];
}

/*
Current shapes handled:
- Path: `/textures/door/color.jpg`
- [Path]: `['/textures/door/color.jpg']`
- [Path, TextureLoaderParamsExceptUrlAsRecord]: `['/textures/door/color.jpg', 'doorColorTexture', { onLoad: () => {} }]`
- [Path, Name]: `['/textures/door/color.jpg', 'doorColorTexture']`
- [Path, Name, TextureLoaderParamsExceptUrlAsRecord]: `['/textures/door/color.jpg', 'doorColorTexture', { onLoad: () => {} }]`


Other shapes to handle:
- [Path, TextureLoader & { name: Name }]: `['/textures/door/color.jpg', { name: 'doorColorTexture', onLoad: () => {} }]`
- { path: Path, name?: Name, ...TextureLoaderParamsExceptUrlAsRecord }: `{ path: '/textures/door/color.jpg', name: 'doorColorTexture', onLoad: () => {} }`
*/
