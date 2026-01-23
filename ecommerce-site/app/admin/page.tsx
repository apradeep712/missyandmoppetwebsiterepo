import { redirect } from 'next/navigation';
  
export default function AdminIndex() {  
  // Default landing for /admin – choose /admin/products or /admin/home  
  redirect('/admin/products');  
}  