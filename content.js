(() => {
  let active=false, offset=0, busy=false, done=false, generation=0;
  const seed=Math.floor(Math.random()*1000000);
  let panel, grid, status, more;
  let nativeSelected=[];
  function deactivateNative(){
    document.querySelectorAll('ytd-feed-filter-chip-bar-renderer yt-chip-cloud-chip-renderer[selected]').forEach(chip=>{
      if(!nativeSelected.some(entry=>entry.chip===chip))nativeSelected.push({chip,aria:chip.getAttribute('aria-selected')});
      chip.removeAttribute('selected');chip.setAttribute('aria-selected','false');
    });
  }
  function restoreNative(){for(const {chip,aria} of nativeSelected){if(chip.isConnected){chip.setAttribute('selected','');if(aria===null)chip.removeAttribute('aria-selected');else chip.setAttribute('aria-selected',aria);}}nativeSelected=[];}

  const pager = new IntersectionObserver(entries => { if (active && entries.some(e => e.isIntersecting)) load(); }, {rootMargin:"800px"});
  const el=(tag,text,cls)=>{const n=document.createElement(tag);if(text)n.textContent=text;if(cls)n.className=cls;return n;};
  function close(){if(!active)return;active=false;restoreNative();generation++;busy=false;document.documentElement.classList.remove('hn-active');document.querySelectorAll('.hn-preview').forEach(n=>n.remove());document.querySelector('#hn-pill')?.setAttribute('aria-pressed','false');}
  async function load(){
    if(busy||done)return;busy=true;const run=generation;more.disabled=true;status.textContent='Loading HackerTube…';grid.setAttribute('aria-busy','true');const skeletons=[];for(let i=0;i<(offset?3:9);i++){const sk=el('div',null,'hn-skeleton');sk.append(el('div',null,'hn-skeleton-thumb'),el('div',null,'hn-skeleton-line'),el('div',null,'hn-skeleton-line short'));grid.append(sk);skeletons.push(sk);}
    try{
      const result=await chrome.runtime.sendMessage({type:'hn-feed',offset,seed});
      if(run!==generation)return;
      if(result.error)throw Error(result.error);
      for(const d of result.items){
        if(!/^[\w-]{11}$/.test(d.vid))continue;
        const card=el('article',null,'hn-card'), link=el('a');link.href=`https://www.youtube.com/watch?v=${d.vid}`;link.addEventListener('click',event=>{if(event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;event.preventDefault();event.stopPropagation();location.assign(link.href);});
        const thumb=el('div',null,'hn-thumb');const img=el('img');img.src=`https://i.ytimg.com/vi/${d.vid}/hqdefault.jpg`;img.alt='';img.loading='lazy';const seconds=Number(d.duration_s)||0;const duration=seconds>=3600?`${Math.floor(seconds/3600)}:${String(Math.floor(seconds/60)%60).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`:`${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,'0')}`;thumb.append(img,el('span',duration,'hn-duration'));
        let previewTimer, preview;
        const stopPreview=()=>{clearTimeout(previewTimer);preview?.remove();preview=null;};
        thumb.addEventListener('mouseenter',()=>{previewTimer=setTimeout(()=>{
          if(!active)return;
          preview=el('iframe',null,'hn-preview');
          preview.src=`https://www.youtube.com/embed/${d.vid}?autoplay=1&mute=1&controls=0&playsinline=1&rel=0`;
          preview.title=`Preview: ${d.title||'Video'}`;preview.allow='autoplay; encrypted-media';preview.tabIndex=-1;
          thumb.append(preview);
        },650);});
        thumb.addEventListener('mouseleave',stopPreview);
        link.addEventListener('click',stopPreview);
link.append(thumb,el('h3',d.title||'Untitled video'));card.append(link,el('p',d.channel||''),el('p',`${new Intl.NumberFormat('en',{notation:'compact'}).format(Number(d.views)||0)} views · ${d.hn?.recommenders||0} HN recommendations`));
        const source=el('a','HN discussion ↗','hn-source');source.href=d.quote?.id?`https://news.ycombinator.com/item?id=${Number(d.quote.id)}`:`https://hackertube.org/watch/${d.vid}`;source.target='_blank';source.rel='noopener noreferrer';card.append(source);grid.append(card);
      }
      offset+=result.items.length;done=result.items.length===0;status.textContent=done?'You’re all caught up.':'';
    }catch(e){if(run===generation)status.textContent=`Couldn’t load videos. ${e.message}. Try again.`;}
    finally{skeletons.forEach(n=>n.remove());if(run===generation){busy=false;grid.setAttribute('aria-busy','false');more.disabled=false;more.hidden=done;if(active&&!done&& !status.textContent && more.getBoundingClientRect().top<innerHeight+800)requestAnimationFrame(load);}}
  }
  function open(){
    active=true;deactivateNative();generation++;busy=false;document.documentElement.classList.add('hn-active');document.querySelector('#hn-pill').setAttribute('aria-pressed','true');
    if(!panel){panel=el('section',null,'hn-panel');panel.id='hn-panel';grid=el('div',null,'hn-grid');status=el('p');status.setAttribute('role','status');more=el('button','Load more');more.onclick=load;panel.append(grid,status,more);pager.observe(more);}
    const renderer=document.querySelector('ytd-browse[page-subtype="home"] ytd-rich-grid-renderer');renderer?.append(panel);
    if(!done)load();
  }
  function mount(){
    if(location.pathname!=='/'){close();return;}
    const row=document.querySelector('ytd-browse[page-subtype="home"] ytd-feed-filter-chip-bar-renderer #chips');
    if(!row||document.querySelector('#hn-pill'))return;
    const pill=el('button','HN');pill.id='hn-pill';pill.title='Videos recommended on Hacker News · HackerTube';pill.setAttribute('aria-pressed',String(active));pill.onclick=()=>active?close():open();row.prepend(pill);
    row.addEventListener('click',e=>{if(!pill.contains(e.target))close();},true);
  }
  new MutationObserver(()=>{if(active)deactivateNative();mount();}).observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['selected']});
  document.addEventListener('yt-navigate-finish',()=>{close();mount();});mount();
})();
