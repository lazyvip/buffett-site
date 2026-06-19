(function(){
var idx=null, input=document.getElementById('search-input'), box=document.getElementById('search-results');
if(!input)return;
var root=document.querySelector('script[src$="search.js"]').src.replace(/search\.js$/,'');

input.addEventListener('input',function(){
  var q=this.value.trim().toLowerCase();
  if(q.length<2){box.innerHTML='';box.style.display='none';return;}
  if(!idx){
    fetch(root+'search-index.json').then(function(r){return r.json()}).then(function(d){idx=d;doSearch(q)});
    return;
  }
  doSearch(q);
});

input.addEventListener('keydown',function(e){
  if(e.key==='Escape'){input.value='';box.innerHTML='';box.style.display='none';}
});

function doSearch(q){
  var terms=q.split(/\s+/);
  var results=idx.map(function(item){
    var title=(item.t+' '+item.e).toLowerCase();
    var body=item.b.toLowerCase();
    var score=0;
    for(var i=0;i<terms.length;i++){
      var t=terms[i];
      if(title.indexOf(t)>=0) score+=10;
      if(item.t.toLowerCase()===q) score+=20;
      if(body.indexOf(t)>=0) score+=1;
    }
    return {item:item,score:score};
  }).filter(function(r){return r.score>0})
    .sort(function(a,b){return b.score-a.score})
    .slice(0,15);

  if(results.length===0){
    box.innerHTML='<div class="sr-empty">无结果</div>';
    box.style.display='block';
    return;
  }

  var html=results.map(function(r){
    var item=r.item;
    var snippet=getSnippet(item.b,terms);
    return '<a class="sr-item" href="'+root+item.p+'">'
      +'<span class="sr-title">'+esc(item.t)+'</span>'
      +'<span class="sr-type">'+esc(item.y)+'</span>'
      +'<span class="sr-snippet">'+snippet+'</span>'
      +'</a>';
  }).join('');
  box.innerHTML=html;
  box.style.display='block';
}

function getSnippet(body,terms){
  // 在正文中找到第一个匹配关键词的位置，截取前后上下文
  var lower=body.toLowerCase();
  var bestPos=-1;
  for(var i=0;i<terms.length;i++){
    var pos=lower.indexOf(terms[i]);
    if(pos>=0&&(bestPos<0||pos<bestPos)) bestPos=pos;
  }
  var start,end,prefix='',suffix='';
  if(bestPos>=0){
    start=Math.max(0,bestPos-15);
    end=Math.min(body.length,bestPos+80);
    if(start>0) prefix='…';
    if(end<body.length) suffix='…';
  }else{
    start=0; end=Math.min(body.length,80);
    if(end<body.length) suffix='…';
  }
  var raw=body.slice(start,end).replace(/\n/g,' ');
  return prefix+highlight(raw,terms)+suffix;
}

function highlight(text,terms){
  var s=esc(text);
  for(var i=0;i<terms.length;i++){
    var t=terms[i];
    if(!t)continue;
    var re=new RegExp('('+t.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+')','gi');
    s=s.replace(re,'<mark>$1</mark>');
  }
  return s;
}

function esc(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}

document.addEventListener('click',function(e){
  if(!e.target.closest('.search-box'))box.style.display='none';
});
})();
