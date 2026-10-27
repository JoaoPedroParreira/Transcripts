const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
function setup(hostname,hash='',api='') {
  const elements={}; const events={}; let fetches=0; let cleared=false;
  const element=id=>elements[id]??={value:'',textContent:'',dataset:{},options:[{value:'auto'},{value:'vi'}],setAttribute(){},scrollIntoView(){},addEventListener(name,fn){events[id+':'+name]=fn;}};
  element('url'); element('language').value='auto';
  const context=vm.createContext({window:{FIO_API_BASE:api,open(url){elements.openedUrl=url;}},AbortSignal,document:{documentElement:{dataset:{theme:'light'}},getElementById:element},location:{hostname,hash,pathname:'/'},history:{replaceState(){cleared=true;}},URLSearchParams,t:text=>text,localStorage:{setItem(){}},setTimeout,clearTimeout,fetch(url){fetches++; if(!api)throw Error('Unexpected network request'); return Promise.resolve(url.endsWith('/health')? {ok:true}:{ok:false,headers:{get:()=> 'application/json'},json:async()=>({error:'Temporarily blocked'})});}});
  vm.runInContext(fs.readFileSync('public/app.js','utf8'),context);
  return {elements,events,fetches:()=>fetches,cleared:()=>cleared};
}
(async()=>{
  const hosted=setup('joaopedroparreira.github.io');
  hosted.elements.url.value='https://www.youtube.com/watch?v=7P_4cFZrjqI';
  hosted.elements.language.value='vi';
  await hosted.events['extract-form:submit']({preventDefault(){}});
  assert.equal(hosted.fetches(),0);
  assert.equal(hosted.elements.openedUrl,hosted.elements['local-open'].href);
  assert.equal(hosted.elements['local-setup'].hidden,false);
  const fragment=new URLSearchParams(new URL(hosted.elements['local-open'].href).hash.slice(1));
  assert.equal(fragment.get('language'),'vi');
  assert.equal(fragment.get('url'),hosted.elements.url.value);
  const local=setup('127.0.0.1','#'+fragment);
  assert.equal(local.elements.url.value,hosted.elements.url.value);
  assert.equal(local.elements.language.value,'vi');
  assert.equal(local.elements['local-setup'].hidden,true);
  assert.equal(local.cleared(),true);
  console.log('Hosted extraction stays local; URL/language handoff and fragment cleanup OK');
  const online=setup('joaopedroparreira.github.io','','https://fio-transcripts-api.onrender.com');
  online.elements.url.value='https://www.youtube.com/watch?v=7P_4cFZrjqI';
  await online.events['extract-form:submit']({preventDefault(){}});
  assert.equal(online.fetches(),2);
  assert.equal(online.elements['local-setup'].hidden,true);
  assert.equal(online.elements.openedUrl,undefined);
  assert.equal(online.elements.status.textContent,'Temporarily blocked');
  console.log('Online mode keeps requests and errors in the same page, without opening local app');
})();
