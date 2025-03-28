/** @type {import('next').NextConfig} */

const nextConfig = {
  typescript: {
    // Exclude Supabase functions from TypeScript checking
    ignoreBuildErrors: true,
  },
};

if (process.env.NEXT_PUBLIC_TEMPO) {
  nextConfig["experimental"] = {
    // NextJS 14.1.3 to 14.2.11:
    swcPlugins: [[require.resolve("tempo-devtools/swc/0.90"), {}]],
  };
}

module.exports = nextConfig;
