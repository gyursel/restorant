import type {NextConfig} from 'next';

// Low-risk, same-origin headers. The visual CMS editor embeds the storefront
// in an iframe on the same origin, so SAMEORIGIN is required instead of DENY.
const nextConfig:NextConfig={
  async headers(){
    return [{
      source:'/:path*',
      headers:[
        {key:'X-Content-Type-Options',value:'nosniff'},
        {key:'Referrer-Policy',value:'strict-origin-when-cross-origin'},
        {key:'X-Frame-Options',value:'SAMEORIGIN'},
        {key:'Permissions-Policy',value:'camera=(), microphone=(), geolocation=()'},
      ],
    }];
  },
};
export default nextConfig;
