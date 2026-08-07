const required = ['name','role','email','company','business','changed','unclear','decision','investment','timeline'];
const esc = (v='') => String(v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));

export default async function handler(req,res){
  if(req.method !== 'POST') return res.status(405).json({error:'Method not allowed'});
  const body = req.body || {};
  if(body.website) return res.redirect(303,'/enquiry-received');
  for(const field of required){ if(!String(body[field] || '').trim()) return res.status(400).send(`Missing required field: ${field}`); }
  if(!/^\S+@\S+\.\S+$/.test(body.email)) return res.status(400).send('Please enter a valid email address.');
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ENQUIRY_TO_EMAIL;
  const from = process.env.ENQUIRY_FROM_EMAIL;
  if(!apiKey || !to || !from) return res.status(500).send('Enquiry delivery is not configured yet.');
  const rows = Object.entries(body).filter(([k])=>k!=='website').map(([k,v])=>`<tr><td style="padding:8px;border-bottom:1px solid #ddd;vertical-align:top"><strong>${esc(k)}</strong></td><td style="padding:8px;border-bottom:1px solid #ddd">${esc(v).replace(/\n/g,'<br>')}</td></tr>`).join('');
  const response = await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${apiKey}`,'Content-Type':'application/json'},body:JSON.stringify({from,to:[to],reply_to:body.email,subject:`New brand enquiry — ${body.name} / ${body.company}`,html:`<h2>New Kharan Krishnaraj website enquiry</h2><table style="border-collapse:collapse;width:100%">${rows}</table>`})});
  if(!response.ok){ console.error('Resend error',await response.text()); return res.status(502).send('Your enquiry could not be delivered. Please try again.'); }
  return res.redirect(303,'/enquiry-received');
}
