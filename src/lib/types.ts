type ImageFormat =
	| 'apng'
	| 'avif'
	| 'bmp'
	| 'gif'
	| 'vnd.microsoft.icon'
	| 'x-icon'
	| 'jpeg'
	| 'png'
	| 'svg+xml'
	| 'tiff'
	| 'webp'
	| 'heic'
	| 'heif'
	| 'jp2'
	| 'jxr';

export interface ImageSourceObject {
	sources?: Record<ImageFormat, string>;
	img?: { lqip?: string; src?: string; w?: number; h?: number };
}
