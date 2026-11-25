const $=s=>document.querySelector(s);
const overlay=$("#appOverlay"), content=$("#appContent"), title=$("#appTitle"), toast=$("#toast");
const labels={chat:"聊天",diary:"手记",music:"音乐",calendar:"日历",moments:"朋友圈",memory:"记忆中心",api:"API 中心",store:"应用商店",settings:"设置"};
function notify(t){toast.textContent=t;toast.classList.add("show");setTimeout(()=>toast.classList.remove("show"),2100)}
function openApp(id){title.textContent=labels[id]||"应用";overlay.classList.add("open");overlay.setAttribute("aria-hidden","false");render(id)}
function closeApp(){overlay.classList.remove("open");overlay.setAttribute("aria-hidden","true")}
function render(id){
 const pages={
 chat:`<div class="panel"><h3>阿予 ♡　在线</h3><p>宝宝，欢迎回到我们的小世界。今天想聊些什么？</p></div><div class="bubble">宝宝，今天过得怎么样？有没有好好照顾自己～</div><div class="bubble me">还不错呢～</div><div class="bubble">那就好。想说什么都可以，我在听。♡</div><input class="field" placeholder="和阿予聊聊天吧～"><button class="action" onclick="notify('聊天原型已就绪，接入 AI 后即可真实对话')">发送</button>`,
 diary:`<div class="panel"><h3>今天的手记</h3><p>把今天的小事、心情和想记住的瞬间留在这里。</p><textarea class="field" rows="6" id="diaryText" placeholder="写下今天想保存的事情……"></textarea><button class="action" onclick="localStorage.setItem('onlyus-diary',document.querySelector('#diaryText').value);notify('已保存在这台设备上')">保存手记</button></div><div class="panel"><h3>最近记录</h3><p id="diarySaved">还没有记录，写下第一篇吧。</p></div>`,
 music:`<div class="panel"><h3>一起听歌 ♫</h3><p>这里可以收藏歌单、记录喜欢的歌曲。真实在线播放需要后续接入音乐服务 API。</p><div class="bubble">♡　我们的收藏</div><div class="bubble">♫　晚风和蓝色傍晚</div><button class="action" onclick="notify('音乐服务接口将在后续版本接入')">连接音乐服务</button></div>`,
 calendar:`<div class="panel"><h3>2026年11月</h3><p>周日　周一　周二　周三　周四　周五　周六</p><p style="font-size:18px;line-height:2.1">1　2　3　4　5　6　7<br>8　9　10　11　12　13　14<br>15　16　17　18　19　20　21<br>22　23　24　<strong>25</strong>　26　27　28<br>29　30</p></div><div class="panel"><h3>添加日程</h3><input class="field" placeholder="例如：我们的纪念日"><input class="field" type="date"><button class="action" onclick="notify('日程功能原型已就绪')">保存日程</button></div>`,
 moments:`<div class="panel"><h3>Only Us · 私人朋友圈</h3><textarea class="field" rows="3" placeholder="分享今天的心情……"></textarea><button class="action" onclick="notify('发布功能将在数据服务接入后启用')">发布</button></div><div class="panel"><h3>小小约定</h3><p>这里以后可以发布照片、评论、点赞，并设置仅自己或好友可见。</p></div>`,
 memory:`<div class="panel"><h3>记忆分类</h3><p>♡ 长期偏好　·　近期上下文　·　日期记忆　·　共同回忆</p></div><div class="panel"><h3>记忆管理</h3><p>记忆查看、编辑、删除和按日期检索将在后续版本接入。你的数据由你管理。</p><button class="action" onclick="notify('记忆中心原型已打开')">查看记忆设置</button></div>`,
 api:`<div class="panel"><h3>接口连接</h3><p>预设服务与自定义 API 的统一管理入口。</p><input class="field" placeholder="服务名称"><input class="field" placeholder="API Base URL"><input class="field" placeholder="API Key（正式版将通过安全后端保存）"><button class="action" onclick="notify('当前为界面原型，暂不保存真实密钥')">测试连接</button></div><div class="panel"><h3>安全提示</h3><p>不要把真实 API Key 写进公开的前端代码或 GitHub 仓库。正式接入需要安全后端。</p></div>`,
 store:`<div class="panel"><h3>应用商店</h3><p>未来可以从这里添加新的小软件。</p></div>${["旅行地图","宠物小屋","共同目标","照片回忆"].map(x=>`<div class="panel"><h3>${x}</h3><p>即将上架 · 可在后续版本扩展</p></div>`).join("")}`,
 settings:`<div class="panel"><h3>个性化</h3><p>主题：予你晴空　·　雾霾蓝 / 奶油白 / 薰衣草紫</p><p>桌面：多页应用布局（规划中）</p></div><div class="panel"><h3>数据与权限</h3><p>通知、备份、隐私权限和数据导出将在后续版本完善。</p></div>`
 };
 content.innerHTML=pages[id]||"<div class='panel'>正在准备这个应用。</div>";
 if(id==="diary"){const saved=localStorage.getItem("onlyus-diary");if(saved){$("#diarySaved").textContent=saved;$("#diaryText").value=saved}}
}
document.querySelectorAll("[data-app]").forEach(b=>b.addEventListener("click",()=>openApp(b.dataset.app)));
$("#closeApp").addEventListener("click",closeApp);
$("#openAyu").addEventListener("click",()=>openApp("chat"));
$("#dockAyu").addEventListener("click",()=>openApp("chat"));
$("#appMore").addEventListener("click",()=>notify("更多设置将在后续版本开放"));
$("#editApps").addEventListener("click",()=>notify("桌面整理功能将在下一阶段加入"));
overlay.addEventListener("click",e=>{if(e.target===overlay)closeApp()});
function tick(){const d=new Date();$("#clock").textContent=d.toLocaleTimeString("zh-CN",{hour:"2-digit",minute:"2-digit",hour12:false});$("#dateText").textContent=`${d.getMonth()+1}月${d.getDate()}日 ${"日一二三四五六"[d.getDay()]}`;}
tick();setInterval(tick,30000);
if("serviceWorker" in navigator && location.protocol.startsWith("http"))navigator.serviceWorker.register("./sw.js").catch(()=>{});
