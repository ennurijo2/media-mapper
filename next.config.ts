import createMDX from "@next/mdx";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure `pageExtensions` to include markdown and MDX files
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  // Optionally, add any other Next.js config below
  experimental: {
    // HAD TO ADD THIS TO GET MDX AND TURBO TO WORK TOGETHER
    // See https://nextjs.org/docs/app/guides/mdx#using-the-rust-based-mdx-compiler-experimental
    mdxRs: true,
  },
};

const withMDX = createMDX({
  // Add markdown plugins here, as desired
});

// Merge MDX config with Next.js config
export default withMDX(nextConfig);
