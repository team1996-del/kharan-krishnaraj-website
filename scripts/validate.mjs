import fs from 'node:fs';
const required=['index.html','services.html','about.html','discuss.html','enquiry-received.html','styles.css','api/enquiry.js','vercel.json','robots.txt'];
let failed=false;
for(const file of required){if(!fs.existsSync(file)){console.error(`Missing: ${file}`);failed=true;}}
const pages=['index.html','services.html','about.html','discuss.html'];
for(const file of pages){const html=fs.readFileSync(file,'utf8');const h1=(html.match(/<h1[ >]/g)||[]).length;if(h1!==1){console.error(`${file}: expected 1 H1, found ${h1}`);failed=true;}if(!html.includes('styles.css')){console.error(`${file}: stylesheet missing`);failed=true;}}
if(failed) process.exit(1);
console.log('Repository validation passed.');
