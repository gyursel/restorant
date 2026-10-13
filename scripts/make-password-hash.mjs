import {scryptSync,randomBytes} from 'node:crypto';
import {stdin,stdout} from 'node:process';
if (!stdin.isTTY) {console.error('Стартирай скрипта в личен интерактивен терминал.');process.exit(1);}
stdout.write('Нова администраторска парола (въвеждането е скрито): ');
stdin.setRawMode(true);stdin.resume();stdin.setEncoding('utf8');
let pw='';
input: for await (const chunk of stdin) {
 for (const ch of chunk) {
  if (ch==='\n'||ch==='\r') break input;
  if (ch==='\u0003'){stdout.write('\n');process.exit(130);}
  if (ch==='\u007f'||ch==='\b'){pw=pw.slice(0,-1);continue;}
  if (ch>=' ' && ch!=='\u007f') pw+=ch;
 }
}
stdin.setRawMode(false);stdin.pause();stdout.write('\n');
if(pw.length<14) {console.error('Паролата трябва да е с поне 14 символа.');process.exit(1);}
const salt=randomBytes(16);
stdout.write('ADMIN_PASSWORD_HASH=scrypt:'+salt.toString('hex')+':'+scryptSync(pw,salt,64).toString('hex')+'\n');
