/* Tools Kits – Image Compressor logic (external). Limits + revoke audited. */
document.addEventListener("DOMContentLoaded",function(){
  "use strict";
  var MAX_FILE=20*1048576;      // 20 MB
  var MAX_PIXELS=50*1000*1000;  // 50 MP source cap (memory safety)
  var drop=document.getElementById("drop"),file=document.getElementById("file"),q=document.getElementById("quality"),qv=document.getElementById("qVal"),
  fmt=document.getElementById("format"),go=document.getElementById("bGo"),dl=document.getElementById("bDl"),msg=document.getElementById("msg"),
  prev=document.getElementById("preview"),stats=document.getElementById("stats"),img=null,origSize=0,outBlob=null,prevUrl=null,fileName="compressed";
  function say(t,ok){msg.hidden=false;msg.textContent=t;msg.className="alert "+(ok?"success":"error");}
  function fmtSize(b){return b>1048576?(b/1048576).toFixed(2)+" MB":(b/1024).toFixed(1)+" KB";}
  function extFor(mime){return mime==="image/png"?".png":mime==="image/webp"?".webp":".jpg";}
  q.addEventListener("input",function(){qv.textContent=q.value+"%";});
  drop.addEventListener("click",function(){file.click();});
  drop.addEventListener("keydown",function(e){if(e.key==="Enter"||e.key===" "){e.preventDefault();file.click();}});
  ["dragover","dragenter"].forEach(function(ev){drop.addEventListener(ev,function(e){e.preventDefault();drop.classList.add("drag");});});
  ["dragleave","drop"].forEach(function(ev){drop.addEventListener(ev,function(e){e.preventDefault();drop.classList.remove("drag");});});
  drop.addEventListener("drop",function(e){if(e.dataTransfer.files[0])load(e.dataTransfer.files[0]);});
  file.addEventListener("change",function(){if(file.files[0])load(file.files[0]);});
  function load(f){
    if(!/^image\/(jpeg|png|webp)$/.test(f.type)){say("Silakan pilih gambar JPG, PNG atau WebP.",false);return;}
    if(f.size>MAX_FILE){say("Berkas terlalu besar (maks 20 MB). Silakan pilih gambar yang lebih kecil.",false);return;}
    fileName=f.name.replace(/\.\w+$/,"")+"-compressed";
    origSize=f.size;var url=URL.createObjectURL(f),im=new Image();
    im.onload=function(){
      URL.revokeObjectURL(url);
      if(im.naturalWidth*im.naturalHeight>MAX_PIXELS){say("Gambar terlalu besar (lebih dari 50 megapiksel). Silakan gunakan gambar yang lebih kecil.",false);return;}
      img=im;go.disabled=false;say("Gambar dimuat ("+fmtSize(origSize)+"). Sesuaikan kualitas lalu kompres.",true);
    };
    im.onerror=function(){URL.revokeObjectURL(url);say("Gagal membaca gambar tersebut. Mungkin rusak atau tidak didukung.",false);};
    im.src=url;
  }
  go.addEventListener("click",function(){
    if(!img){say("Unggah gambar terlebih dahulu.",false);return;}
    var type=fmt.value;
    var c=document.createElement("canvas");c.width=img.naturalWidth;c.height=img.naturalHeight;
    var ctx=c.getContext("2d");if(type==="image/jpeg"){ctx.fillStyle="#fff";ctx.fillRect(0,0,c.width,c.height);}
    ctx.drawImage(img,0,0);
    var quality=parseInt(q.value,10)/100;
    c.toBlob(function(blob){
      if(!blob){say("Browser ini tidak dapat mengekspor "+type+". Coba JPG.",false);return;}
      outBlob=blob;
      if(prevUrl)URL.revokeObjectURL(prevUrl);
      prevUrl=URL.createObjectURL(blob);
      prev.src=prevUrl;prev.hidden=false;
      stats.hidden=false;
      document.getElementById("sBefore").textContent=fmtSize(origSize);
      document.getElementById("sAfter").textContent=fmtSize(blob.size);
      var pct=origSize?Math.round((1-blob.size/origSize)*100):0;
      document.getElementById("sSaved").textContent=pct+"%";
      dl.disabled=false;say("Terkompresi: "+fmtSize(origSize)+" → "+fmtSize(blob.size)+" ("+pct+"% lebih kecil).",true);
    },type,type==="image/png"?undefined:quality);
  });
  dl.addEventListener("click",function(){
    if(!outBlob)return;var a=document.createElement("a");a.href=URL.createObjectURL(outBlob);
    // Use the ACTUAL output type: browsers may fall back (e.g. WebP→PNG).
    var ext=extFor(outBlob.type||fmt.value);
    a.download=fileName+ext;document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.remove();},500);
  });
});
