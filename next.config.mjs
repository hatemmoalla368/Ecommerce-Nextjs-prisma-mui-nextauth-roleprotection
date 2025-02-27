/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{ 
        domains:["res.cloudinary.com", "res-console.cloudinary.com", "example.com"] 
        }, 
        env:{ 
        URL : "http://localhost:3000" 
        }   
};

export default nextConfig;
