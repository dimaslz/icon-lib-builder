/** @type {import('next').NextConfig} */
module.exports = {
	reactStrictMode: true,
	trailingSlash: false,
	devIndicators: {
		autoPrerender: false
	},
	env: {
		API_URL: process.env.NEXT_PUBLIC_API_URL
	}
};