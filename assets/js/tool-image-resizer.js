/* Tools Kits – Image Resizer logic (external). Limits + revoke audited. */
document.addEventListener("DOMContentLoaded",function(){
  "use strict";
  var MAX_FILE=20*1048576;      // 20 MB
  var MAX_PIXELS=50*1000*1000;  // 50 MP source cap (memory safety)
  var MAX_DIM=8000;
  var drop=document.getElementById("drop"),file=document.getElementById("file"),W=document.getElementById("w"),H=document.getElementById("h"),
  lock=document.getElementById("lock"),preset=document.getElementById("preset"),go=document.getElementById("bGo"),dl=document.getElementById("bDl"),
  msg=document.getElementById("msg"),prev=document.getElementById("preview"),dims=document.getElementById("dims"),img=null,ratio=1,outUrl=null;
  function say(t,ok){msg.hidden=false;msg.textContent=t;msg.className="alert "+(ok?"success":"error");}
  drop.addEventListener("click",function(){file.click();});
  drop.addEventListener("keydown",function(e){if(e.key==="Enter"||e.key===" "){e.preventDefault();file.click();}});
  drop.addEventListener("dragover",function(e){e.preventDefault();drop.classList.add("drag");});
  drop.addEventListener("dragleave",function(e){e.preventDefault();drop.classList.remove("drag");});
  drop.addEventListener("drop",function(e){e.preventDefault();drop.classList.remove("drag");if(e.dataTransfer.files[0])load(e.dataTransfer.files[0]);});
  file.addEventListener("change",function(){if(file.files[0])load(file.files[0]);});
  function load(f){
    if(!/^image\/(jpeg|png|webp)$/.test(f.type)){say("Silakan pilih JPG/PNG/WebP.",false);return;}
    if(f.size>MAX_FILE){say("Berkas terlalu besar (maks 20 MB). Silakan pilih gambar yang lebih kecil.",false);return;}
    var url=URL.createObjectURL(f),im=new Image();
    im.onload=function(){
      URL.revokeObjectURL(url);
      if(im.naturalWidth*im.naturalHeight>MAX_PIXELS){say("Gambar terlalu besar (lebih dari 50 megapiksel). Silakan gunakan gambar yang lebih kecil.",false);return;}
      img=im;ratio=im.naturalWidth/im.naturalHeight;W.value=im.naturalWidth;H.value=im.naturalHeight;go.disabled=false;say("Dimuat "+im.naturalWidth+"×"+im.naturalHeight+".",true);
    };
    im.onerror=function(){URL.revokeObjectURL(url);say("Gagal membaca gambar. Mungkin rusak atau tidak didukung.",false);};im.src=url;
  }
  W.addEventListener("input",function(){if(lock.checked&&img&&W.value){H.value=Math.round(W.value/ratio);}});
  H.addEventListener("input",function(){if(lock.checked&&img&&H.value){W.value=Math.round(H.value*ratio);}});
  preset.addEventListener("change",function(){if(!preset.value)return;var p=preset.value.split("x");W.value=p[0];H.value=p[1];});
  go.addEventListener("click",function(){
    if(!img){say("Unggah terlebih dahulu.",false);return;}
    var w=parseInt(W.value,10),h=parseInt(H.value,10);
    if(!w||!h||w<1||h<1||w>MAX_DIM||h>MAX_DIM){say("Masukkan dimensi yang valid (1–8000px).",false);return;}
    if(w*h>MAX_PIXELS){say("Hasil terlalu besar (lebih dari 50 megapiksel). Silakan gunakan dimensi yang lebih kecil.",false);return;}
    var c=document.createElement("canvas");c.width=w;c.height=h;
    c.getContext("2d").drawImage(img,0,0,w,h);
    c.toBlob(function(b){
      if(!b){say("Gagal mengekspor.",false);return;}
      if(outUrl)URL.revokeObjectURL(outUrl);
      outUrl=URL.createObjectURL(b);prev.src=outUrl;prev.hidden=false;
      // Use the ACTUAL output type for size label and filename.
      var ext=(b.type||"image/png")==="image/jpeg"?".jpg":".png";
      dims.textContent="Hasil: "+w+"×"+h+" ("+(b.size/1024).toFixed(1)+" KB)";
      dl.disabled=false;say("Diubah ukurannya menjadi "+w+"×"+h+".",true);
      dl.onclick=function(){var a=document.createElement("a");a.href=outUrl;a.download="resized-"+w+"x"+h+ext;document.body.appendChild(a);a.click();a.remove();};
    },"image/png");
  });
});
