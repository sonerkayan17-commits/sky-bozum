'use client';
/* eslint-disable react-hooks/exhaustive-deps */
import Link from 'next/link';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { useEffect, useState, type FormEvent } from 'react';
import { getFirebaseClient } from '../../lib/firebase';
import { likeProfile, sendMessage, sendPointGift } from '../../lib/social';

export default function PublicMemberProfile({ memberId }: { memberId: string }) {
  const [user,setUser]=useState<User|null>(null); const [name,setName]=useState('Sky Bozum üyesi'); const [likes,setLikes]=useState(0); const [gifts,setGifts]=useState(0); const [message,setMessage]=useState(''); const [notice,setNotice]=useState('');
  useEffect(()=>{ const {auth,db}=getFirebaseClient(); if(!auth||!db)return; const stop=onAuthStateChanged(auth,setUser); Promise.all([getDoc(doc(db,'publicProfiles',memberId)),getDocs(query(collection(db,'profileLikes'),where('receiverId','==',memberId)))]).then(([profile,likeDocs])=>{if(profile.exists())setName(String(profile.data().displayName||name));setLikes(likeDocs.size);}); return stop; },[memberId]);
  const senderName=user?.displayName||user?.email?.split('@')[0]||'Bir üye';
  async function act(kind:'like'|'gift'){const {db}=getFirebaseClient();if(!user||!db){location.assign('/giris');return}try{if(kind==='like'){await likeProfile(db,user.uid,memberId,senderName);setLikes(v=>v+1);setNotice('Profil beğenildi.');}else{await sendPointGift(db,user.uid,memberId,senderName);setGifts(v=>v+5);setNotice('5 topluluk puanı gönderildi.');}}catch{setNotice('Bu işlemi daha önce yaptınız.')}}
  async function submit(e:FormEvent){e.preventDefault();const {db}=getFirebaseClient();if(!user||!db){location.assign('/giris');return}await sendMessage(db,user.uid,memberId,senderName,message);setMessage('');setNotice('Mesajınız gönderildi.');}
  return <main className="public-profile-page"><section className="public-profile-card"><div className="public-profile-avatar">{name.charAt(0).toUpperCase()}</div><p>TOPLULUK PROFİLİ</p><h1>{name}</h1><div className="public-profile-stats"><span><b>{likes}</b> profil beğenisi</span><span><b>{gifts}</b> gelen puan</span></div>{user?.uid===memberId?<Link href="/hesabim" className="public-profile-primary">Profilimi yönet</Link>:<><div className="public-profile-actions"><button onClick={()=>act('like')}>♡ Profili beğen</button><button onClick={()=>act('gift')}>✦ 5 puan gönder</button></div><form onSubmit={submit}><label>Özel mesaj<textarea value={message} onChange={e=>setMessage(e.target.value)} minLength={1} maxLength={600} required placeholder="Kısa ve saygılı bir mesaj yazın…"/></label><button>Mesaj gönder</button></form></>}{notice&&<div className="public-profile-notice">{notice}</div>}</section></main>;
}
