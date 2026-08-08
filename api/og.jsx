import { ImageResponse } from '@vercel/og';

export default function handler() {
  return new ImageResponse(
    (
      <div style={{width:'100%',height:'100%',display:'flex',background:'#F6F2EC',color:'#34241F'}}>
        <div style={{width:'55%',height:'100%',display:'flex',flexDirection:'column',padding:'54px 56px 46px 56px',justifyContent:'space-between'}}>
          <div style={{display:'flex',flexDirection:'column'}}>
            <div style={{fontSize:24,letterSpacing:'0.18em',fontWeight:600}}>KHARAN KRISHNARAJ</div>
            <div style={{fontSize:24,fontStyle:'italic',marginTop:4,color:'#9B654E'}}>Brand Strategist</div>
          </div>
          <div style={{display:'flex',flexDirection:'column'}}>
            <div style={{width:66,height:4,background:'#9B654E',marginBottom:26}} />
            <div style={{fontSize:58,lineHeight:1.06,fontWeight:400,letterSpacing:'-0.03em'}}>I help founder-led businesses turn clarity into a brand that grows with them.</div>
            <div style={{width:'72%',height:1,background:'#B99C8C',marginTop:28,marginBottom:22}} />
            <div style={{fontSize:27,fontStyle:'italic',lineHeight:1.35,color:'#9B654E'}}>A brand should be understood before it is designed.</div>
          </div>
          <div style={{fontSize:44,fontWeight:500}}>K</div>
        </div>
        <div style={{width:'45%',height:'100%',display:'flex',position:'relative',overflow:'hidden'}}>
          <img src="https://kharankrishnaraj.com/assets/kharan-portrait-emotional.jpg" style={{width:'100%',height:'100%',objectFit:'cover'}} />
          <div style={{position:'absolute',inset:0,background:'rgba(93,60,42,0.10)'}} />
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
