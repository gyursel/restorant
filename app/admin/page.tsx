import {redirect} from 'next/navigation';
import {getAdmin} from '../../server/auth';
import Admin from './panel';
export const dynamic='force-dynamic';
export default async function Page(){if(!await getAdmin())redirect('/admin/login');return <Admin/>;}
