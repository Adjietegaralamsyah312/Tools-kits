/* Tools Kits – shared UI: theme, nav, search/filter, analytics stub, helpers. No tracking by default. */
(function(){
  "use strict";
  var root=document.documentElement;
  function themeInit(){
    var saved=null;
    try{saved=localStorage.getItem("tk-theme");}catch(e){}
    if(saved==="light"||saved==="dark"){root.setAttribute("data-theme",saved);}
    else if(window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches){root.setAttribute("data-theme","dark");}
  }
  themeInit();
  function toggleTheme(){
    var cur=root.getAttribute("data-theme")==="dark"?"light":"dark";
    root.setAttribute("data-theme",cur);
    try{localStorage.setItem("tk-theme",cur);}catch(e){}
    var b=document.getElementById("themeBtn");
    if(b)b.setAttribute("aria-label",cur==="dark"?"Switch to light mode":"Switch to dark mode");
  }
  // Analytics placeholder – enable later without collecting tool inputs.
  window.ToolskitsAnalytics={track:function(){},page:function(){}};

  function esc(s){return String(s).replace(/[&<>"']/g,function(c){return({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]);});}
  window.tkEsc=esc;

  function copyText(text,msgEl){
    function done(ok,msg){
      if(!msgEl)return;
      msgEl.textContent=msg;msgEl.className="alert "+(ok?"success":"error");msgEl.hidden=false;
    }
    if(navigator.clipboard&&navigator.clipboard.writeText){
      navigator.clipboard.writeText(text).then(function(){done(true,"Copied to clipboard.");},function(){fallback();});
    }else{fallback();}
    function fallback(){
      try{
        var ta=document.createElement("textarea");ta.value=text;ta.setAttribute("readonly","");ta.style.position="fixed";ta.style.opacity="0";
        document.body.appendChild(ta);ta.select();
        var ok=document.execCommand("copy");document.body.removeChild(ta);
        done(!!ok,ok?"Copied to clipboard.":"Copy failed. Please select and copy manually.");
      }catch(e){done(false,"Copy failed. Please select and copy manually.");}
    }
  }
  window.tkCopy=copyText;

  function download(filename,content,mime){
    var blob=new Blob([content],{type:mime||"text/plain;charset=utf-8"});
    var a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=filename;
    document.body.appendChild(a);a.click();
    setTimeout(function(){URL.revokeObjectURL(a.href);a.remove();},500);
  }
  window.tkDownload=download;

  document.addEventListener("DOMContentLoaded",function(){
    var tb=document.getElementById("themeBtn");
    if(tb)tb.addEventListener("click",toggleTheme);
    var mb=document.getElementById("menuBtn"),nl=document.getElementById("navLinks");
    function isMenuOpen(){return !!nl&&nl.classList.contains("open");}
    function setMenu(open){
      if(!mb||!nl)return;
      nl.classList.toggle("open",open);
      mb.setAttribute("aria-expanded",open?"true":"false");
      mb.setAttribute("aria-label",open?"Close menu":"Open menu");
      mb.textContent=open?"\u00D7":"\u2630";
    }
    function toggleMenu(){setMenu(!isMenuOpen());}
    if(mb&&nl){
      mb.addEventListener("click",function(e){e.stopPropagation();toggleMenu();});
      nl.querySelectorAll("a").forEach(function(a){a.addEventListener("click",function(){if(isMenuOpen())setMenu(false);});});
      document.addEventListener("click",function(e){
        if(!isMenuOpen())return;
        if(nl.contains(e.target)||mb.contains(e.target))return;
        var header=e.target.closest?e.target.closest("header.site"):null;
        if(header&&header.contains(nl)&&!nl.contains(e.target)&&!mb.contains(e.target)){setMenu(false);return;}
        setMenu(false);
      });
      document.addEventListener("keydown",function(e){
        if(e.key==="Escape"&&isMenuOpen()){setMenu(false);mb.focus();}
      });
    }
    // Footer year
    document.querySelectorAll("[data-year]").forEach(function(el){el.textContent=new Date().getFullYear();});
    // Related tools injection
    var rel=document.getElementById("relatedTools");
    if(rel&&window.TOOLS&&window.RELATED){
      var slug=rel.getAttribute("data-tool");
      var ids=window.RELATED[slug]||[];
      var map={};window.TOOLS.forEach(function(t){map[t.slug]=t;});
      rel.innerHTML=ids.filter(function(id){return map[id];}).map(function(id){
        var t=map[id];
        return '<a href="../'+esc(t.slug)+'/">'+esc(t.name)+'</a>';
      }).join("");
    }
    // Homepage + tools index rendering
    renderToolCards();
  });

  function toolCard(t){
    return '<article class="card" data-cat="'+esc(t.category)+'" data-search="'+esc((t.name+" "+t.description+" "+t.category).toLowerCase())+'">'+
      '<div class="meta"><span class="pill">'+esc(t.icon)+'</span><span class="pill">'+esc(t.category)+'</span></div>'+
      '<h3><a href="'+(location.pathname.indexOf("/tools")>-1?"":"tools/")+esc(t.slug)+'/">'+esc(t.name)+'</a></h3>'+
      '<p>'+esc(t.description)+'</p></article>';
  }

  function renderToolCards(){
    var grid=document.getElementById("toolsGrid");
    if(!grid||!window.TOOLS)return;
    var base=grid.getAttribute("data-base")||"";
    grid.innerHTML=window.TOOLS.map(function(t){
      return '<article class="card" data-cat="'+esc(t.category)+'" data-search="'+esc((t.name+" "+t.description+" "+t.category).toLowerCase())+'">'+
        '<div class="meta"><span class="pill">'+esc(t.icon)+'</span><span class="pill">'+esc(t.category)+'</span></div>'+
        '<h3><a href="'+esc(base)+esc(t.slug)+'/">'+esc(t.name)+'</a></h3><p>'+esc(t.description)+'</p></article>';
    }).join("");
    var count=document.getElementById("toolCount");
    if(count)count.textContent=window.TOOLS.length+" free tools";
    bindSearch();
  }

  function bindSearch(){
    var input=document.getElementById("toolSearch");
    var grid=document.getElementById("toolsGrid");
    if(!input||!grid)return;
    var empty=document.getElementById("noResults");
    var activeCat="all";
    // Support shareable/bookmarkable "?q=" (e.g. /tools/?q=json links).
    // Prefill once from URL, then keep URL in sync as the user types.
    var urlSync=true;
    try{
      var params=new URLSearchParams(window.location.search);
      var q0=params.get("q");
      if(q0!==null&&q0!==""){input.value=q0;}
    }catch(e){urlSync=false;}
    function syncUrl(){
      if(!urlSync||!window.history||!window.history.replaceState)return;
      try{
        var url=new URL(window.location.href);
        var v=input.value.trim();
        if(v){url.searchParams.set("q",v);}else{url.searchParams.delete("q");}
        window.history.replaceState(null,"",url.pathname+(url.search?"?"+url.searchParams.toString():"")+url.hash);
      }catch(e){}
    }
    function apply(){
      var q=input.value.trim().toLowerCase();
      var shown=0;
      grid.querySelectorAll(".card").forEach(function(card){
        var okCat=activeCat==="all"||card.getAttribute("data-cat")===activeCat;
        var okQ=!q||card.getAttribute("data-search").indexOf(q)>-1;
        var show=okCat&&okQ;
        card.style.display=show?"":"none";
        if(show)shown++;
      });
      if(empty)empty.hidden=shown!==0;
    }
    input.addEventListener("input",function(){apply();syncUrl();});
    document.querySelectorAll("[data-filter]").forEach(function(btn){
      btn.addEventListener("click",function(){
        document.querySelectorAll("[data-filter]").forEach(function(b){b.setAttribute("aria-pressed","false");});
        btn.setAttribute("aria-pressed","true");
        activeCat=btn.getAttribute("data-filter");apply();
      });
    });
    apply();
  }
})();
