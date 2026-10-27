// Destellos dorados flotantes
(function(){const c=document.createElement('canvas');c.id='sparks';document.body.appendChild(c);const x=c.getContext('2d');let W,H,P=[];
function rs(){W=c.width=innerWidth*devicePixelRatio;H=c.height=innerHeight*devicePixelRatio}rs();addEventListener('resize',rs);
for(let i=0;i<34;i++)P.push({x:Math.random(),y:Math.random(),r:Math.random()*1.6+.5,s:Math.random()*.05+.025,a:Math.random()*6,w:Math.random()*.6+.3});
let last=performance.now();
(function f(now){const dt=Math.min(.1,(now-last)/1000);last=now;x.clearRect(0,0,W,H);
P.forEach(p=>{p.y-=p.s*dt;p.a+=2.2*dt;p.x+=Math.sin(p.a*.7)*.004*dt;if(p.y<-.02){p.y=1.02;p.x=Math.random()}
const al=(.25+.6*Math.abs(Math.sin(p.a)))*.8,R=p.r*5*devicePixelRatio,X=p.x*W,Y=p.y*H;
const g=x.createRadialGradient(X,Y,0,X,Y,R);g.addColorStop(0,`rgba(255,240,170,${al})`);g.addColorStop(.35,`rgba(240,200,90,${al*.55})`);g.addColorStop(1,'rgba(212,175,55,0)');
x.fillStyle=g;x.beginPath();x.arc(X,Y,R,0,7);x.fill();
if(p.r>1.6){x.strokeStyle=`rgba(255,246,200,${al*.7})`;x.lineWidth=devicePixelRatio*.8;x.beginPath();x.moveTo(X-R*1.4,Y);x.lineTo(X+R*1.4,Y);x.moveTo(X,Y-R*1.4);x.lineTo(X,Y+R*1.4);x.stroke()}});
requestAnimationFrame(f)})(last)})();
