const required = ['name','role','email','company','business','changed','unclear','decision','investment','timeline'];
const esc = (v='') => String(v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
const labels = {
  name:'Name', role:'Role', email:'Email', phone:'Phone / WhatsApp', company:'Company', url:'Website / Primary Presence',
  business:'What the Business Does', changed:'What Has Changed', unclear:'What Feels Unclear', impact:'Business Impact',
  considering:'What They Are Considering', stage:'Business Stage', decision:'Decision-Maker', investment:'Investment Range',
  timeline:'Timeline', why:'Why Kharan', anything:'Additional Context'
};
const sections = [
  ['ABOUT YOU',['name','role','email','phone']],
  ['THE BUSINESS',['company','url','business']],
  ['THE BRAND PROBLEM',['changed','unclear','impact']],
  ['ENGAGEMENT CONTEXT',['considering','stage','decision','investment','timeline']],
  ['FINAL CONTEXT',['why','anything']]
];

function row(label,value){
  return `<tr><td style="padding:10px 12px;border-bottom:1px solid #e4ddd5;vertical-align:top;width:34%;font-weight:600;color:#2C211D">${esc(label)}</td><td style="padding:10px 12px;border-bottom:1px solid #e4ddd5;color:#2C211D">${esc(value).replace(/\n/g,'<br>')}</td></tr>`;
}

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

  const content = sections.map(([title,fields]) => {
    const rows = fields.filter(k => String(body[k] || '').trim()).map(k => row(labels[k] || k, body[k])).join('');
    if(!rows) return '';
    return `<h3 style="font-size:12px;letter-spacing:.12em;margin:28px 0 8px;color:#755748">${title}</h3><table style="border-collapse:collapse;width:100%;background:#fff">${rows}</table>`;
  }).join('');

  const html = `<div style="font-family:Arial,sans-serif;background:#F6F2EC;padding:32px;color:#2C211D"><div style="max-width:760px;margin:auto"><p style="font-size:12px;letter-spacing:.12em;margin:0 0 12px">KHARAN KRISHNARAJ / WEBSITE ENQUIRY</p><h2 style="font-family:Georgia,serif;font-weight:400;font-size:30px;margin:0 0 10px">New brand enquiry</h2><p style="margin:0 0 24px">${esc(body.name)} from ${esc(body.company)}</p>${content}<p style="margin:28px 0 0;font-size:12px;color:#755748">Replying to this email will reply directly to ${esc(body.email)}.</p></div></div>`;

  const response = await fetch('https://api.resend.com/emails',{
    method:'POST',
    headers:{Authorization:`Bearer ${apiKey}`,'Content-Type':'application/json'},
    body:JSON.stringify({
      from,
      to:[to],
      reply_to:body.email,
      subject:`New brand enquiry — ${body.name} / ${body.company}`,
      html
    })
  });

  if(!response.ok){ console.error('Resend error',await response.text()); return res.status(502).send('Your enquiry could not be delivered. Please try again.'); }
  return res.redirect(303,'/enquiry-received');
}
