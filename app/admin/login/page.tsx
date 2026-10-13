import {redirect} from 'next/navigation';
import {getAdmin} from '../../../server/auth';
import LoginForm from './login-form';
export const dynamic='force-dynamic';
export default async function Page(){if(await getAdmin())redirect('/admin');return <LoginForm/>;}
