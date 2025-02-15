import { RepeatWrapping } from 'three';
import {
	loadTextures_map,
	loadTextures_obj
} from '#utils/texture-loader-handler.js';
{
	const [textures, textureLoader] = loadTextures_map([
		['/textures/door/color.jpg'],
		['/textures/door/alpha.jpg', 'doorAlphaTexture'],
		'/textures/door/height.jpg',
		[
			'/textures/door/normal.jpg',
			{
				onLoad: (texture) => {
					texture.repeat.set(2, 1);
					texture.wrapS = texture.wrapT = RepeatWrapping;
				}
			}
		],
		[
			'/textures/door/ambientOcclusion.jpg',
			'ambientOcclusionTexture',
			{
				onLoad: (texture) => {
					texture.repeat.set(2, 1);
					texture.wrapS = texture.wrapT = RepeatWrapping;
				}
			}
		]
	]);

	const colorDoorTexture = textures.get('colorDoorTexture'); // Texture | undefined
	const doorAlphaTexture = textures.get('doorAlphaTexture'); // Texture | undefined
	const heightDoorTexture = textures.get('heightDoorTexture'); // Texture | undefined
	const normalDoorTexture = textures.get('normalDoorTexture'); // Texture | undefined
	const ambientOcclusionTexture = textures.get('ambientOcclusionTexture'); // Texture | undefined
}

{
	const [
		{
			colorDoorTexture,
			doorAlphaTexture,
			heightDoorTexture,
			normalDoorTexture,
			ambientOcclusionTexture
		},
		textureLoader
	] = loadTextures_obj([
		['/textures/door/color.jpg'],
		['/textures/door/alpha.jpg', 'doorAlphaTexture'],
		'/textures/door/height.jpg',
		[
			'/textures/door/normal.jpg',
			{
				onLoad: (texture) => {
					texture.repeat.set(2, 1);
					texture.wrapS = texture.wrapT = RepeatWrapping;
				}
			}
		],
		[
			'/textures/door/ambientOcclusion.jpg',
			'ambientOcclusionTexture',
			{
				onLoad: (texture) => {
					texture.repeat.set(2, 1);
					texture.wrapS = texture.wrapT = RepeatWrapping;
				}
			}
		]
	]);
}
