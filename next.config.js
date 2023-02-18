/** @type {import('next').NextConfig} */
module.exports = {
	reactStrictMode: true,
	trailingSlash: false,
	env: {
		API_URL: process.env.NEXT_PUBLIC_API_URL,
	},
};