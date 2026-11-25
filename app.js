const $ = s => document.querySelector(s);
const overlay=$("#appOverlay"), content=$("#appContent"), title=$("#appTitle"), toast=$("#toast");
const labels={chat:"聊天",diary:"手记",music:"音乐",calendar:"日历",moments:"朋友圈",memory:"记忆中心",store:"应用商店",settings:"设置"};
let currentApp="";
function notify(msg){toast.textContent=msg;toast.classList.add("show");clearTimeout(notify.timer);notify.timer=setTimeout(()=>toast.classList.remove("show"),2300)}
function openApp(id){currentApp=id;title.textContent=labels[id]||"应用";overlay.classList.add("open");overlay.setAttribute("aria-hidden","false");document.body.classList.add("app-open");render(id);content.scrollTop=0}
function closeApp(){overlay.classList.remove("open");overlay.setAttribute("aria-hidden","true");document.body.classList.remove("app-open")}
function panel(title,body){return `<section class="panel"><h3>${title}</h3>${body}</section>`}
function render(id){
 const pages={
 chat:`<div class="chat-layout"><div class="chat-tabs"><button class="chat-tab active" data-chat-tab="messages">消息</button><button class="chat-tab" data-chat-tab="moments">朋友圈</button><button class="add-friend" id="addFriend">＋ 添加好友</button></div><section id="chatMessages" class="chat-view"><div class="contact-row"><div class="avatar ayu-avatar">予</div><div class="contact-copy"><strong>阿予</strong><p>宝宝，今天过得怎么样？我在听。</p></div><small>现在</small></div><div class="conversation" id="conversation"><div class="chat-date">今天</div><div class="message-line"><div class="avatar ayu-avatar">予</div><div class="bubble">宝宝，欢迎回来。今天想和我说些什么？♡</div></div></div><div class="composer"><input id="chatInput" class="field" placeholder="发送消息…"><button class="send-button" id="sendMessage">发送</button></div></section><section id="chatMoments" class="chat-view hidden"><div class="panel"><strong>分享此刻</strong><textarea class="field" id="momentInput" rows="3" placeholder="今天有什么想记录的？"></textarea><button class="action" id="publishMoment">发布</button><small>默认仅自己可见。</small></div><div id="momentFeed">${panel("阿予","<p>希望今天也有一点点值得珍藏的小事。♡</p>")}</div></section></div>`,
 diary:`${panel("今天的手记",'<textarea class="field" rows="7" id="diaryText" placeholder="写下今天想保存的事情……"></textarea><button class="action" id="saveDiary">保存手记</button>')}${panel("最近记录",'<p id="diarySaved">还没有记录。</p>')}`,
 music:`${panel("音乐 · 一起听歌 ♫",'<p>在这里管理音乐账号、音乐服务接口和喜欢的歌单。</p><div class="music-tabs"><button class="chat-tab active" data-music-tab="account">账号登录</button><button class="chat-tab" data-music-tab="api">音乐 API</button></div><section id="musicAccount"><div class="service-card"><strong>网易云音乐</strong><p>使用自己的账号和歌单。网页版本不能直接读取手机网易云 App 的登录状态，需要服务方支持的授权流程。</p><button class="action" id="neteaseLogin">网易云账号登录</button></div><p class="hint">当前版本尚未配置网易云官方 OAuth 应用，因此暂不能完成真实授权。</p></section><section id="musicApi" class="hidden"><label>音乐服务类型</label><select class="field" id="musicProvider"><option value="custom">自定义兼容接口</option><option value="netease">网易云兼容 API</option><option value="其他">其他服务</option></select><label>API Base URL</label><input class="field" id="musicBase" placeholder="https://example.com/api"><label>接口说明 / 搜索路径</label><input class="field" id="musicSearch" placeholder="/search 或按服务商文档填写"><label>API Key（如服务需要）</label><input class="field" id="musicKey" type="password" autocomplete="off" placeholder="仅本次填写，不会保存密钥"><button class="action" id="saveMusic">保存接口配置</button><p class="hint">目前只保存非敏感配置到本机。密钥不会写入公开仓库或浏览器存储；真实搜索、播放需按服务商协议完成后端代理。</p></section>')}`,
 calendar:`${panel("日历",'<p>2026年11月</p><p>周日　周一　周二　周三　周四　周五　周六</p><p class="calendar-days">1　2　3　4　5　6　7<br>8　9　10　11　12　13　14<br>15　16　17　18　19　20　21<br>22　23　24　<strong>25</strong>　26　27　28<br>29　30</p>')}${panel("添加日程",'<input class="field" placeholder="例如：我们的纪念日"><input class="field" type="date"><button class="action" id="saveEvent">保存日程</button>')}`,
 moments:`${panel("朋友圈",'<p>朋友圈已整合到聊天应用。</p><button class="action" id="goChatMoments">打开聊天里的朋友圈</button>')}`,
 memory:`${panel("记忆分类",'<p>♡ 长期偏好　·　近期上下文　·　日期记忆　·　共同回忆</p>')}${panel("记忆管理",'<p>记忆查看、编辑、删除和按日期检索将在后续版本接入。</p>')}`,
 store:`${panel("应用商店",'<p>未来可以从这里添加新的小软件。</p>')}`,
 settings:`${panel("个性化",'<p>主题：予你晴空　·　雾霾蓝 / 奶油白 / 薰衣草紫</p><p>桌面支持左右滑动切换页面。</p>')}${panel("API 中心",'<p>这里管理 AI 服务等通用接口。音乐服务配置请进入「音乐」应用。</p><input class="field" placeholder="AI 服务名称"><input class="field" placeholder="API Base URL"><input class="field" type="password" placeholder="API Key（原型不保存）"><button class="action" id="apiInfo">接口安全说明</button>')}${panel("数据与权限",'<p>通知、备份、隐私权限和数据导出将在后续版本完善。</p>')}`
 };
 content.innerHTML=pages[id]||panel("应用","<p>正在准备这个应用。</p>");
 if(id==="diary"){let v=localStorage.getItem("onlyus-diary")||"";$("#diaryText").value=v;$("#diarySaved").textContent=v||"还没有记录。";$("#saveDiary").onclick=()=>{localStorage.setItem("onlyus-diary",$("#diaryText").value);$("#diarySaved").textContent=$("#diaryText").value||"（空白手记）";notify("已保存在这台设备上")}}
 if(id==="chat"){
 document.querySelectorAll("[data-chat-tab]").forEach(b=>b.onclick=()=>{document.querySelectorAll("[data-chat-tab]").forEach(x=>x.classList.toggle("active",x===b));$("#chatMessages").classList.toggle("hidden",b.dataset.chatTab!=="messages");$("#chatMoments").classList.toggle("hidden",b.dataset.chatTab!=="moments")});
 $("#addFriend").onclick=()=>{const n=prompt("输入好友昵称");if(n&&n.trim())notify(`已记录好友申请：${n.trim()}（账号系统接入后可真正添加）`)};
 $("#sendMessage").onclick=()=>{const i=$("#chatInput"),v=i.value.trim();if(!v)return;const line=document.createElement("div");line.className="message-line mine";const b=document.createElement("div");b.className="bubble";b.textContent=v;line.append(b);$("#conversation").append(line);i.value="";$("#conversation").scrollTop=$("#conversation").scrollHeight};
 $("#chatInput").onkeydown=e=>{if(e.key==="Enter")$("#sendMessage").click()};
 $("#publishMoment").onclick=()=>{const i=$("#momentInput"),v=i.value.trim();if(!v)return;const p=document.createElement("section");p.className="panel";const t=document.createElement("p");t.textContent=v;p.append(t);$("#momentFeed").prepend(p);i.value="";notify("已添加到本机页面")};
 }
 if(id==="moments")$("#goChatMoments").onclick=()=>{openApp("chat");document.querySelector('[data-chat-tab="moments"]').click()};
 if(id==="music"){
 document.querySelectorAll("[data-music-tab]").forEach(b=>b.onclick=()=>{document.querySelectorAll("[data-music-tab]").forEach(x=>x.classList.toggle("active",x===b));$("#musicAccount").classList.toggle("hidden",b.dataset.musicTab!=="account");$("#musicApi").classList.toggle("hidden",b.dataset.musicTab!=="api")});
 $("#neteaseLogin").onclick=()=>notify("需要先申请并配置网易云官方授权应用，当前版本不能直接读取手机 App 登录态");
 $("#saveMusic").onclick=()=>{const base=$("#musicBase").value.trim(),path=$("#musicSearch").value.trim();if(!base){notify("请先填写 API Base URL");return}localStorage.setItem("onlyus-music-config",JSON.stringify({provider:$("#musicProvider").value,base,search:path}));$("#musicKey").value="";notify("已保存接口地址和类型；密钥未保存")};
 const saved=JSON.parse(localStorage.getItem("onlyus-music-config")||"null");if(saved){$("#musicProvider").value=saved.provider||"custom";$("#musicBase").value=saved.base||"";$("#musicSearch").value=saved.search||""}
 }
 if(id==="calendar")$("#saveEvent").onclick=()=>notify("日程原型已就绪");
 if(id==="settings")$("#apiInfo").onclick=()=>notify("正式接入请使用服务端保存密钥，勿放入公开仓库");
}
document.querySelectorAll("[data-app]").forEach(b=>b.addEventListener("click",()=>openApp(b.dataset.app)));
$("#closeApp").onclick=closeApp;$("#appMore").onclick=()=>notify("更多设置将在后续版本开放");
overlay.addEventListener("click",e=>{if(e.target===overlay)closeApp()});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&overlay.classList.contains("open"))closeApp()});

// 手机桌面：使用明确的左右滑动手势切页，避免部分 Android 浏览器不触发横向原生滚动。
const desktop=$("#desktop"), dots=document.querySelectorAll("#pageDots span");
let touchStartX=0,touchStartY=0,touchStartAt=0;
function currentPage(){return Math.round(desktop.scrollLeft/Math.max(1,desktop.clientWidth))}
function goPage(index){
 const target=Math.max(0,Math.min(1,index));
 desktop.scrollTo({left:target*desktop.clientWidth,behavior:"smooth"});
 dots.forEach((d,i)=>d.classList.toggle("active",i===target));
}
desktop.addEventListener("touchstart",e=>{
 if(document.body.classList.contains("app-open"))return;
 const t=e.changedTouches[0];touchStartX=t.clientX;touchStartY=t.clientY;touchStartAt=Date.now();
},{passive:true});
desktop.addEventListener("touchend",e=>{
 if(document.body.classList.contains("app-open"))return;
 const t=e.changedTouches[0],dx=t.clientX-touchStartX,dy=t.clientY-touchStartY;
 if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.15&&Date.now()-touchStartAt<900){
   goPage(currentPage()+(dx<0?1:-1));
 }
},{passive:true});
desktop.addEventListener("scroll",()=>{const p=currentPage();dots.forEach((d,i)=>d.classList.toggle("active",i===p))},{passive:true});
document.querySelectorAll("[data-shortcut]").forEach(b=>b.addEventListener("click",()=>{
 const names={phone:"电话",contacts:"联系人",notifications:"通知",browser:"浏览器"};
 notify(`${names[b.dataset.shortcut]}功能后续接入`);
}));
function tick(){const d=new Date();$("#clock").textContent=d.toLocaleTimeString("zh-CN",{hour:"2-digit",minute:"2-digit",hour12:false});$("#dateText").textContent=`${d.getMonth()+1}月${d.getDate()}日 ${"日一二三四五六"[d.getDay()]}`}
tick();setInterval(tick,30000);
if("serviceWorker"in navigator&&location.protocol.startsWith("http"))navigator.serviceWorker.register("./sw.js?v=4").catch(()=>{});
