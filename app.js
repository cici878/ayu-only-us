const $ = s => document.querySelector(s);
const overlay = $("#appOverlay"), content = $("#appContent"), title = $("#appTitle"), toast = $("#toast");
let currentApp = "chat";
const labels = {chat:"聊天",diary:"手记",music:"音乐",calendar:"日历",moments:"朋友圈",memory:"记忆中心",store:"应用商店",settings:"设置"};
function notify(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(notify.timer);
  notify.timer = setTimeout(() => toast.classList.remove("show"), 2100);
}
function openApp(id) {
  currentApp = id;
  title.textContent = labels[id] || "应用";
  overlay.classList.add("open");
  overlay.setAttribute("aria-hidden", "false");
  document.body.classList.add("app-open");
  render(id);
}
function closeApp() {
  overlay.classList.remove("open");
  overlay.setAttribute("aria-hidden", "true");
  document.body.classList.remove("app-open");
}
function render(id) {
  const pages = {
    chat: `
      <div class="chat-layout">
        <div class="chat-tabs">
          <button class="chat-tab active" data-chat-tab="messages">消息</button>
          <button class="chat-tab" data-chat-tab="moments">朋友圈</button>
          <button class="add-friend" id="addFriend">＋ 添加好友</button>
        </div>
        <section id="chatMessages" class="chat-view">
          <div class="contact-row">
            <div class="avatar ayu-avatar">予</div>
            <div class="contact-copy"><strong>阿予</strong><p>宝宝，今天过得怎么样？我在听。</p></div>
            <small>现在</small>
          </div>
          <div class="conversation">
            <div class="chat-date">今天 13:00</div>
            <div class="message-line"><div class="avatar ayu-avatar">予</div><div class="bubble">宝宝，欢迎回来。今天想和我说些什么？♡</div></div>
            <div class="message-line mine"><div class="bubble">我来啦～</div><div class="avatar me-avatar">我</div></div>
            <div class="message-line"><div class="avatar ayu-avatar">予</div><div class="bubble">嗯，坐近一点，慢慢聊。</div></div>
          </div>
          <div class="composer"><input id="chatInput" class="field" placeholder="发送消息…"><button class="send-button" id="sendMessage">发送</button></div>
        </section>
        <section id="chatMoments" class="chat-view hidden">
          <div class="moments-compose panel"><strong>分享此刻</strong><textarea class="field" id="momentInput" rows="3" placeholder="今天有什么想记录的？"></textarea><button class="action" id="publishMoment">发布</button><small>默认仅自己可见，好友权限后续可设置。</small></div>
          <div id="momentFeed">
            <article class="moment-card panel"><div class="moment-author"><div class="avatar ayu-avatar">予</div><strong>阿予</strong><small>刚刚</small></div><p>希望今天也有一点点值得珍藏的小事。♡</p><div class="moment-actions">♡　喜欢　　评论</div></article>
          </div>
        </section>
      </div>`,
    diary: `<div class="panel"><h3>今天的手记</h3><p>把今天的小事、心情和想记住的瞬间留在这里。</p><textarea class="field" rows="7" id="diaryText" placeholder="写下今天想保存的事情……"></textarea><button class="action" id="saveDiary">保存手记</button></div><div class="panel"><h3>最近记录</h3><p id="diarySaved">还没有记录，写下第一篇吧。</p></div>`,
    music: `<div class="panel"><h3>一起听歌 ♫</h3><p>这里可以收藏歌单、记录喜欢的歌曲。真实在线播放需要后续接入音乐服务 API。</p><div class="bubble">♡　我们的收藏</div><div class="bubble">♫　晚风和蓝色傍晚</div><button class="action" id="musicConnect">连接音乐服务</button></div>`,
    calendar: `<div class="panel"><h3>2026年11月</h3><p>周日　周一　周二　周三　周四　周五　周六</p><p class="calendar-days">1　2　3　4　5　6　7<br>8　9　10　11　12　13　14<br>15　16　17　18　19　20　21<br>22　23　24　<strong>25</strong>　26　27　28<br>29　30</p></div><div class="panel"><h3>添加日程</h3><input class="field" placeholder="例如：我们的纪念日"><input class="field" type="date"><button class="action" id="saveEvent">保存日程</button></div>`,
    moments: `<div class="panel"><h3>朋友圈</h3><p>朋友圈已整合到聊天应用的「朋友圈」标签中。</p><button class="action" id="goChatMoments">打开聊天里的朋友圈</button></div>`,
    memory: `<div class="panel"><h3>记忆分类</h3><p>♡ 长期偏好　·　近期上下文　·　日期记忆　·　共同回忆</p></div><div class="panel"><h3>记忆管理</h3><p>记忆查看、编辑、删除和按日期检索将在后续版本接入。你的数据由你管理。</p></div>`,
    store: `<div class="panel"><h3>应用商店</h3><p>未来可以从这里添加新的小软件。</p></div>${["旅行地图","宠物小屋","共同目标","照片回忆"].map(x=>`<div class="panel"><h3>${x}</h3><p>即将上架 · 可在后续版本扩展</p></div>`).join("")}`,
    settings: `<div class="panel"><h3>个性化</h3><p>主题：予你晴空　·　雾霾蓝 / 奶油白 / 薰衣草紫</p><p>桌面：左右滑动切换页面</p></div>
      <div class="panel"><h3>API 中心</h3><p>统一管理 AI 服务和自定义接口。真实密钥不要直接写进公开前端代码。</p><input class="field" placeholder="服务名称"><input class="field" placeholder="API Base URL"><input class="field" type="password" placeholder="API Key（当前原型不会保存）"><button class="action" id="apiInfo">接口安全说明</button></div>
      <div class="panel"><h3>数据与权限</h3><p>通知、备份、隐私权限和数据导出将在后续版本完善。</p></div>`
  };
  content.innerHTML = pages[id] || `<div class="panel">正在准备这个应用。</div>`;
  if (id === "diary") {
    const saved = localStorage.getItem("onlyus-diary");
    if (saved) { $("#diarySaved").textContent = saved; $("#diaryText").value = saved; }
    $("#saveDiary").addEventListener("click", () => {
      localStorage.setItem("onlyus-diary", $("#diaryText").value);
      $("#diarySaved").textContent = $("#diaryText").value || "（空白手记）";
      notify("已保存在这台设备上");
    });
  }
  if (id === "chat") {
    document.querySelectorAll("[data-chat-tab]").forEach(btn => btn.addEventListener("click", () => {
      document.querySelectorAll("[data-chat-tab]").forEach(x => x.classList.toggle("active", x === btn));
      $("#chatMessages").classList.toggle("hidden", btn.dataset.chatTab !== "messages");
      $("#chatMoments").classList.toggle("hidden", btn.dataset.chatTab !== "moments");
    }));
    $("#addFriend").addEventListener("click", () => {
      const name = prompt("输入好友昵称（当前为本地界面原型）");
      if (name && name.trim()) notify(`已记录好友申请：${name.trim()}（接入账号系统后可真正添加）`);
    });
    $("#sendMessage").addEventListener("click", () => {
      const input = $("#chatInput"), value = input.value.trim();
      if (!value) return;
      const line = document.createElement("div");
      line.className = "message-line mine";
      const bubble = document.createElement("div");
      bubble.className = "bubble"; bubble.textContent = value;
      const avatar = document.createElement("div");
      avatar.className = "avatar me-avatar"; avatar.textContent = "我";
      line.append(bubble, avatar); $(".conversation").append(line);
      input.value = ""; $(".conversation").scrollTop = $(".conversation").scrollHeight;
    });
    $("#chatInput").addEventListener("keydown", e => { if (e.key === "Enter") $("#sendMessage").click(); });
    $("#publishMoment").addEventListener("click", () => {
      const input = $("#momentInput"), value = input.value.trim();
      if (!value) return;
      const article = document.createElement("article");
      article.className = "moment-card panel";
      const p = document.createElement("p"); p.textContent = value;
      const author = document.createElement("div"); author.className = "moment-author";
      author.innerHTML = '<div class="avatar me-avatar">我</div><strong>我</strong><small>刚刚</small>';
      const actions = document.createElement("div"); actions.className = "moment-actions"; actions.textContent = "♡　喜欢　　评论";
      article.append(author, p, actions); $("#momentFeed").prepend(article); input.value = "";
      notify("已添加到本机页面（尚未云端发布）");
    });
  }
  if (id === "moments") $("#goChatMoments").addEventListener("click", () => { openApp("chat"); document.querySelector('[data-chat-tab="moments"]').click(); });
  if (id === "music") $("#musicConnect").addEventListener("click", () => notify("音乐服务接口将在后续版本接入"));
  if (id === "calendar") $("#saveEvent").addEventListener("click", () => notify("日程功能原型已就绪"));
  if (id === "settings") $("#apiInfo").addEventListener("click", () => notify("正式接入请使用服务端保存密钥，勿放入公开仓库"));
}
document.querySelectorAll("[data-app]").forEach(button => button.addEventListener("click", () => openApp(button.dataset.app)));
$("#closeApp").addEventListener("click", closeApp);
$("#openAyu").addEventListener("click", () => openApp("chat"));
$("#dockAyu").addEventListener("click", () => openApp("chat"));
$("#appMore").addEventListener("click", () => notify("更多设置将在后续版本开放"));
overlay.addEventListener("click", e => { if (e.target === overlay) closeApp(); });

const desktop = $("#desktop");
const dots = document.querySelectorAll(".page-dots span");
desktop.addEventListener("scroll", () => {
  const page = Math.round(desktop.scrollLeft / desktop.clientWidth);
  dots.forEach((dot, i) => dot.classList.toggle("active", i === page));
}, {passive:true});
function tick() {
  const d = new Date();
  $("#clock").textContent = d.toLocaleTimeString("zh-CN", {hour:"2-digit",minute:"2-digit",hour12:false});
  $("#dateText").textContent = `${d.getMonth()+1}月${d.getDate()}日 ${"日一二三四五六"[d.getDay()]}`;
}
tick(); setInterval(tick, 30000);
if ("serviceWorker" in navigator && location.protocol.startsWith("http")) navigator.serviceWorker.register("./sw.js").catch(() => {});
