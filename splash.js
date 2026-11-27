(()=>{
  const start=()=>{
    if(document.getElementById("ayuSplash"))return;
    const layer=document.createElement("div");
    layer.id="ayuSplash";
    layer.innerHTML=`
      <img class="splash-art" src="./assets/ayu-splash.png" alt="">
      <span class="splash-spark one"></span><span class="splash-spark two"></span><span class="splash-spark three"></span>
      <button class="splash-skip" type="button">SKIP ✦</button>
`;
    document.body.appendChild(layer);
    let ended=false;
    const finish=()=>{
      if(ended)return; ended=true;
      layer.classList.add("leaving");
      window.setTimeout(()=>layer.remove(),900);
    };
    layer.querySelector(".splash-skip").addEventListener("click",finish);
    layer.addEventListener("click",e=>{if(e.target===layer)finish()});
    window.setTimeout(finish,5200);
  };
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start,{once:true});
  else start();
})();
