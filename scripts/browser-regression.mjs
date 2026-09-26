/* global document, innerWidth, localStorage */
import console from "node:console";
import { URL } from "node:url";
// Requires Playwright and a running NCreate server. Auth requests are local fixtures.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdir } from "node:fs/promises";
import process from "node:process";
const {chromium}=createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE || "playwright");
const base=process.env.NCREATE_BASE || "http://127.0.0.1:3102";
const output=process.env.E2E_OUTPUT || "/tmp/ncreate-browser-regression";
await mkdir(output,{recursive:true});
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH || "/usr/bin/chromium",args:["--no-sandbox"]});
for(const width of [1920,1366,768,390]) {
 const context=await browser.newContext({viewport:{width,height:width===390?844:1080}});
 const page=await context.newPage(),errors=[];
 page.on("pageerror",e=>errors.push(e.message));
 for(const path of ["/","/#server","/login","/register","/forum","/forum/category/invalid-regression-slug","/forum/topic/invalid-regression-slug"]) {
  const response=await page.goto(base+path,{waitUntil:"networkidle"});
  assert.equal(response?.status() ?? 200,200);
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`overflow ${path} ${width}`);
  if(path==="/login") {
   await page.getByRole("button",{name:"Войти",exact:true}).click();
   await page.getByText("Введите корректный email",{exact:true}).waitFor();
   assert(new URL(page.url()).pathname==="/login");
  }
 }
 await page.goto(base,{waitUntil:"networkidle"});
 if(width===390 || width===768) {
  await page.getByRole("button",{name:"Открыть меню"}).click();
  await page.getByRole("navigation",{name:"Мобильная навигация"}).getByRole("link",{name:"Сервер",exact:true}).click();
  await page.getByRole("button",{name:"Открыть меню"}).waitFor();
  assert.equal(new URL(page.url()).hash,"#server");
  assert.equal(await page.getByRole("navigation",{name:"Мобильная навигация"}).count(),0);
 }
 await page.getByRole("button",{name:"Начать играть",exact:true}).first().click();
 await page.getByRole("dialog").waitFor();
 await page.getByRole("button",{name:"Закрыть окно"}).click();
 await page.screenshot({path:`${output}/ncreate-${width}.png`,fullPage:true});
 assert.deepEqual(errors,[]);
 await context.close();console.log(`PASS NCreate ${width}: routes, anchor navigation, form validation, dialog and responsive`);
}
// Validate a Russian topic and logout using intercepted user auth, never production credentials.
{
 const context=await browser.newContext();
 const now=new Date().toISOString(),id="10000000-0000-4000-8000-000000000001";
 const user={id,aud:"authenticated",role:"authenticated",email:"qa@example.invalid",app_metadata:{},user_metadata:{},created_at:now};
 const session={access_token:"fixture-access-token",refresh_token:"fixture-refresh-token",expires_at:Math.floor(Date.now()/1000)+3600,expires_in:3600,token_type:"bearer",user};
 await context.addInitScript(({session})=>localStorage.setItem("sb-bualqaeinwifoopzflbt-auth-token",JSON.stringify(session)),{session});
 const topic={id:"70000000-0000-4000-8000-000000000001",category_id:1,author_id:id,title:"Русская тема",slug:"",is_pinned:false,is_locked:false,created_at:now};
 let submitted=null;
 await context.route("**/bualqaeinwifoopzflbt.supabase.co/**",async route=>{
  const req=route.request(),url=new URL(req.url()),entity=url.pathname.split("/").pop();
  if(entity==="logout")return route.fulfill({status:204});
  if(url.pathname.includes("/auth/"))return route.fulfill({json:entity==="user"?user:session});
  if(entity==="create_ncreate_forum_topic") {
   submitted=req.postDataJSON();
   assert.match(submitted._slug,/^[a-z0-9]+(?:-[a-z0-9]+)*-[0-9a-f]{8}$/);
   topic.slug=submitted._slug;return route.fulfill({json:topic.id});
  }
  const category={id:1,name:"Обсуждение",slug:"general",description:null,sort_order:10,is_active:true};
  const rows={profiles:[{id,username:"qa_user",display_name:"QA",avatar_url:null}],user_roles:[{user_id:id,role:"user"}],ncreate_forum_categories:[category],ncreate_forum_topics:topic.slug?[topic]:[],ncreate_forum_posts:[{id:"90000000-0000-4000-8000-000000000001",topic_id:topic.id,author_id:id,body:"Содержимое темы",created_at:now}]};
  const data=rows[entity]??[];
  return route.fulfill({json:req.headers().accept?.includes("vnd.pgrst.object")?data[0]??null:data});
 });
 const page=await context.newPage();await page.goto(base+"/forum/category/general",{waitUntil:"networkidle"});
 await page.getByRole("textbox",{name:"Заголовок"}).fill("Русская тема");
 await page.getByRole("textbox",{name:"Сообщение"}).fill("Содержимое темы");
 await page.getByRole("button",{name:"Создать тему",exact:true}).click();
 await page.waitForURL("**/forum/topic/**");
 await page.getByRole("heading",{name:"Русская тема",exact:true}).waitFor();
 assert.equal(submitted._title,"Русская тема");
 await page.reload({waitUntil:"networkidle"});
 await page.getByRole("button",{name:"Выйти",exact:true}).click();
 await page.getByRole("link",{name:"Войти",exact:true}).first().waitFor();
 assert.equal(await page.evaluate(()=>localStorage.getItem("sb-bualqaeinwifoopzflbt-auth-token")),null);
 await context.close();console.log("PASS NCreate Russian topic, authenticated reload and logout (intercepted fixtures)");
}
{
 const context=await browser.newContext();let fail=true;
 await context.route("**/rest/v1/ncreate_forum_categories*",route=>route.fulfill(fail?{status:503,json:{message:"Backend temporarily unavailable"}}:{json:[{id:1,name:"Обсуждение",slug:"general",description:null,sort_order:10,is_active:true}]}));
 const page=await context.newPage();await page.goto(base+"/forum/category/general");
 await page.getByRole("status").filter({hasText:"Загружаем форум"}).waitFor();
 await page.getByRole("alert").filter({hasText:"Не удалось загрузить форум"}).waitFor();
 assert.equal(await page.getByText("Категория недоступна",{exact:true}).count(),0);
 fail=false;await page.getByRole("button",{name:"Повторить",exact:true}).click();
 await page.getByRole("heading",{name:"Обсуждение",exact:true}).waitFor();
 await context.close();console.log("PASS NCreate backend failure, loading and retry (intercepted fixtures)");
}
await browser.close();
