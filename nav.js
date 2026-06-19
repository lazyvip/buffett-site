function toggle(id){
var el=document.getElementById(id),t=el.previousElementSibling;
el.classList.toggle('open');t.classList.toggle('open');
}
document.querySelector('.main').addEventListener('click',function(e){
if(!e.target.closest('.fav-wrap'))
  document.getElementById('sidebar').classList.remove('open');
});

/* Fav button */
(function(){
var btn=document.getElementById('fav-btn');
var pop=document.getElementById('fav-pop');
if(!btn||!pop) return;

var isMac=/Mac|iPhone|iPad/.test(navigator.userAgent);
var isMobile=/iPhone|iPad|Android/i.test(navigator.userAgent);
var shortcut=isMac?'<kbd>⌘</kbd> + <kbd>D</kbd>':'<kbd>Ctrl</kbd> + <kbd>D</kbd>';

pop.innerHTML='<div>'+shortcut+' 收藏本页到浏览器书签</div>'
  +'<button class="fav-pop-copy" id="fav-copy">📋 复制链接</button>'
  +'<button class="fav-pop-share" id="fav-share">📤 分享本页</button>';

btn.addEventListener('click',function(e){
  e.stopPropagation();
  pop.classList.toggle('show');
});

document.getElementById('fav-copy').addEventListener('click',function(e){
  e.stopPropagation();
  var b=this;
  navigator.clipboard.writeText(window.location.href).then(function(){
    b.textContent='✅ 已复制！';b.classList.add('copied');
    setTimeout(function(){b.textContent='📋 复制链接';b.classList.remove('copied');},1500);
  });
});

var shareBtn=document.getElementById('fav-share');
if(navigator.share){
  shareBtn.style.display='block';
  shareBtn.addEventListener('click',function(e){
    e.stopPropagation();
    navigator.share({title:document.title,url:window.location.href});
  });
}

document.addEventListener('click',function(e){
  if(!e.target.closest('.fav-wrap')) pop.classList.remove('show');
});
})();
