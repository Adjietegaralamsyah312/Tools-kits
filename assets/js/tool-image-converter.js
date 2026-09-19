/* Tools Kits – Image Converter logic (external). Limits + revoke + real-type naming audited. */
document.addEventListener("DOMContentLoaded",function(){
  "use strict";
  var MAX_FILE=20*1048576;      // 20 MB
  var MAX_PIXELS=50*1000*1000;  // 50 MP source cap (memory safety)
  var drop=document.getElementById("drop"),file=document.getElementById("file"),fmt=document.getElementById("fmt"),q=document.getElementById("q"),qv=document.getElementById("qv"),
  go=document.getElementById("bGo"),dl=document.getElementById("bDl"),msg=document.getElementById("msg"),prev=document.getElementById("preview"),img=null,outUrl=null,outBlob=null,base="image";
  function say(t,ok){msg.hidden=false;msg.textContent=t;msg.className="alert "+(ok?"success":"error");}
  function labelFor(mime){return mime==="image/png"?"PNG":mime==="image/webp"?"WebP":mime==="image/jpeg"?"JPG":mime;}
  function extFor(mime){return mime==="image/png"?".png":mime==="image/webp"?".webp":mime==="image/jpeg"?".jpg":".bin";}
  q.addEventListener("input",function(){qv.textContent=q.value+"%";});
  drop.addEventListener("click",function(){file.click();});
  drop.addEventListener("keydown",function(e){if(e.key==="Enter"||e.key===" "){e.preventDefault();file.click();}});
  drop.addEventListener("dragover",function(e){e.preventDefault();drop.classList.add("drag");});
  drop.addEventListener("dragleave",function(e){e.preventDefault();drop.classList.remove("drag");});
  drop.addEventListener("drop",function(e){e.preventDefault();drop.classList.remove("drag");if(e.dataTransfer.files[0])load(e.dataTransfer.files[0]);});
  file.addEventListener("change",function(){if(file.files[0])load(file.files[0]);});
  function load(f){
    if(!/^image\/(jpeg|png|webp)$/.test(f.type)){say("Choose JPG/PNG/WebP.",false);return;}
    if(f.size>MAX_FILE){say("File too large (max 20 MB). Please choose a smaller image.",false);return;}
    base=f.name.replace(/\.\w+$/,"")||"image";
    var url=URL.createObjectURL(f),im=new Image();
    im.onload=function(){
      URL.revokeObjectURL(url);
      if(im.naturalWidth*im.naturalHeight>MAX_PIXELS){say("Image is too large (over 50 megapixels). Please use a smaller image.",false);return;}
      img=im;go.disabled=false;say("Loaded "+im.naturalWidth+"×"+im.naturalHeight+".",true);
    };
    im.onerror=function(){URL.revokeObjectURL(url);say("Could not read image. It may be corrupt or unsupported.",false);};
    im.src=url;
  }
  go.addEventListener("click",function(){
    if(!img){say("Upload first.",false);return;}
    var c=document.createElement("canvas");c.width=img.naturalWidth;c.height=img.naturalHeight;var ctx=c.getContext("2d");
    if(fmt.value==="image/jpeg"){ctx.fillStyle="#fff";ctx.fillRect(0,0,c.width,c.height);}
    ctx.drawImage(img,0,0);
    c.toBlob(function(b){
      if(!b){say("Format not supported by this browser. Try JPG/PNG.",false);return;}
      outBlob=b;
      if(outUrl)URL.revokeObjectURL(outUrl);
      outUrl=URL.createObjectURL(b);prev.src=outUrl;prev.hidden=false;dl.disabled=false;
      // Use the ACTUAL output type: browsers may fall back (e.g. WebP→PNG).
      var real=b.type||fmt.value,ext=extFor(real);
      dl.onclick=function(){var a=document.createElement("a");a.href=outUrl;a.download=base+"-converted"+ext;document.body.appendChild(a);a.click();a.remove();};
      say("Converted to "+labelFor(real)+" ("+(b.size/1024).toFixed(1)+" KB).",true);
    },fmt.value,fmt.value==="image/png"?undefined:q.value/100);
  });
});
