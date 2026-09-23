import { createClient, type Session, type User } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

export const COMING_SOON = "Скоро будет";
const supabase = createClient(import.meta.env.VITE_SUPABASE_URL || "https://bualqaeinwifoopzflbt.supabase.co",import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_rPbG4EP0YEypHLKVMHEYpA_pGVFQX0M",{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
export { supabase };

export interface Settings {site_id:string;server_name:string;hero_title:string;hero_subtitle:string|null;server_ip:string|null;minecraft_version:string|null;online_players:number;record_players:number;total_players:number;discord_url:string|null;telegram_url:string|null;youtube_url:string|null;vk_url:string|null;donate_url:string|null;launcher_url:string|null;status:string;updated_at:string}
export interface Category {id:number;slug:string;name:string;description:string|null;sort_order:number;is_active:boolean}
export interface Topic {id:string;category_id:number;author_id:string;title:string;slug:string;is_pinned:boolean;is_locked:boolean;created_at:string;author_name:string;reply_count:number}
export interface Post {id:string;topic_id:string;author_id:string;body:string;created_at:string;author_name:string}
export interface Profile {id:string;username:string;display_name:string|null;avatar_url:string|null}

export async function getSettings(){const{data,error}=await supabase.from("ncreate_site_settings").select("*").eq("site_id","ncreate").maybeSingle();if(error)throw error;return data as Settings|null}
export async function getCategories(){const{data,error}=await supabase.from("ncreate_forum_categories").select("id,slug,name,description,sort_order,is_active").eq("is_active",true).order("sort_order");if(error)throw error;return(data??[])as Category[]}
async function authors(ids:string[]){if(!ids.length)return new Map<string,Profile>();const{data}=await supabase.from("profiles").select("id,username,display_name,avatar_url").in("id",[...new Set(ids)]);return new Map((data??[]).map(p=>[p.id as string,p as Profile]))}
export async function getTopics(categoryId?:number){let q=supabase.from("ncreate_forum_topics").select("id,category_id,author_id,title,slug,is_pinned,is_locked,created_at").is("deleted_at",null).order("is_pinned",{ascending:false}).order("created_at",{ascending:false});if(categoryId!==undefined)q=q.eq("category_id",categoryId);const{data,error}=await q;if(error)throw error;const rows=(data??[])as Omit<Topic,"author_name"|"reply_count">[];const[a,p]=await Promise.all([authors(rows.map(x=>x.author_id)),rows.length?supabase.from("ncreate_forum_posts").select("topic_id").in("topic_id",rows.map(x=>x.id)).is("deleted_at",null):Promise.resolve({data:[]})]);const counts=new Map<string,number>();for(const x of p.data??[])counts.set(x.topic_id as string,(counts.get(x.topic_id as string)??0)+1);return rows.map(x=>({...x,author_name:a.get(x.author_id)?.display_name??a.get(x.author_id)?.username??"Пользователь",reply_count:Math.max(0,(counts.get(x.id)??1)-1)}))}
export async function getCategory(slug:string){const{data,error}=await supabase.from("ncreate_forum_categories").select("id,slug,name,description,sort_order,is_active").eq("slug",slug).eq("is_active",true).maybeSingle();if(error)throw error;return data as Category|null}
export async function getTopic(slug:string){const{data,error}=await supabase.from("ncreate_forum_topics").select("id,category_id,author_id,title,slug,is_pinned,is_locked,created_at").eq("slug",slug).is("deleted_at",null).maybeSingle();if(error)throw error;if(!data)return null;const row=data as Omit<Topic,"author_name"|"reply_count">;const a=await authors([row.author_id]);return{...row,author_name:a.get(row.author_id)?.display_name??a.get(row.author_id)?.username??"Пользователь",reply_count:0}as Topic}
export async function getPosts(topicId:string){const{data,error}=await supabase.from("ncreate_forum_posts").select("id,topic_id,author_id,body,created_at").eq("topic_id",topicId).is("deleted_at",null).order("created_at");if(error)throw error;const rows=(data??[])as Omit<Post,"author_name">[];const a=await authors(rows.map(x=>x.author_id));return rows.map(x=>({...x,author_name:a.get(x.author_id)?.display_name??a.get(x.author_id)?.username??"Пользователь"}))}
export async function createTopic(categoryId:number,title:string,slug:string,body:string){const{error}=await supabase.rpc("create_ncreate_forum_topic",{_category_id:categoryId,_title:title,_slug:slug,_body:body});if(error)throw error}
export async function createReply(topicId:string,body:string){const{error}=await supabase.rpc("create_ncreate_forum_reply",{_topic_id:topicId,_body:body});if(error)throw error}
export const slugify=(v:string)=>`${v.toLowerCase().trim().replace(/[^a-zа-яё0-9]+/gi,"-").replace(/^-|-$/g,"")||"topic"}-${crypto.randomUUID().slice(0,8)}`;
export const formatDate=(v:string)=>new Intl.DateTimeFormat("ru-RU",{dateStyle:"medium",timeStyle:"short"}).format(new Date(v));

interface Auth {ready:boolean;session:Session|null;user:User|null;profile:Profile|null;role:string|null;logout:()=>Promise<void>}
const Context=createContext<Auth|null>(null);
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let version = 0;
    let active = true;
    let receivedEvent = false;
    let currentUserId: string | null = null;
    const sync = async (nextSession: Session | null) => {
      const current = ++version;
      setSession(nextSession);
      if (!nextSession) {
        currentUserId = null;
        setProfile(null);
        setRole(null);
        setReady(true);
        return;
      }
      if (currentUserId !== nextSession.user.id) {
        currentUserId = nextSession.user.id;
        setReady(false);
        setProfile(null);
        setRole(null);
      }
      try {
        const [{ data: nextProfile }, { data: nextRole }] = await Promise.all([
          supabase.from("profiles").select("id,username,display_name,avatar_url").eq("id", nextSession.user.id).maybeSingle(),
          supabase.from("user_roles").select("role").eq("user_id", nextSession.user.id).maybeSingle(),
        ]);
        if (!active || current !== version) return;
        setProfile(nextProfile as Profile | null);
        setRole((nextRole?.role as string | undefined) ?? "user");
      } catch {
        if (!active || current !== version) return;
        setProfile(null);
        setRole(null);
      } finally {
        if (active && current === version) setReady(true);
      }
    };
    void supabase.auth.getSession().then(({ data }) => {
      if (active && !receivedEvent) void sync(data.session);
    }).catch(() => { if (active && !receivedEvent) setReady(true); });
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      receivedEvent = true;
      queueMicrotask(() => { if (active) void sync(nextSession); });
    });
    return () => { active = false; version++; data.subscription.unsubscribe(); };
  }, []);

  const value = useMemo<Auth>(() => ({
    ready, session, user: session?.user ?? null, profile, role,
    logout: async () => { await supabase.auth.signOut(); },
  }), [ready, session, profile, role]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useAuth(){const v=useContext(Context);if(!v)throw new Error("AuthProvider missing");return v}
