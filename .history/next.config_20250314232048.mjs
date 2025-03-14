/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{ 
        domains:["res.cloudinary.com", "res-console.cloudinary.com", "example.com"] 
        }, 
        env:{ 
        URL : "https://ecommerce-nextjs-prisma-mui-nextauth.onrender.com/" 
        }   
};

export default nextConfig;
