'use client';

import { KeyboardEvent, useEffect, useMemo, useRef, useState } from 'react';
import { buildWhatsAppUrl } from '../../lib/conversion';

export type ChannelKind = 'whatsapp' | 'phone' | 'email';
export type ContactChannel = { title:string; value:string; href:string; note:string; eyebrow:string; response:string; kind:ChannelKind; external?:boolean; primary?:boolean };

type PurposeId = 'rate' | 'eligibility' | 'support' | 'corporate';
type Purpose = { id: PurposeId; code: string; title: string; note: string; channel: ChannelKind; fallback: ChannelKind; text: string; subject?: string; prepare: readonly string[]; privacy: string; outcome: string; reason: string; nextStep: string; profile: string };
const purposes: readonly Purpose[] = [
  { id:'rate', code:'01', title:'Güncel oran', note:'Anlık koşulları öğrenin', channel:'whatsapp', fallback:'phone', text:'Merhaba, Sky Bozum üzerinden güncel oran bilgisi almak istiyorum.', prepare:['İşlem türü','Yaklaşık tutar'], privacy:'Kimlik veya erişim bilgisi gerekmez.', outcome:'Güncel oran ve işlem öncesi koşullar netleşir.', reason:'Anlık bilgi için en kısa ve yazılı teyit alınabilen yol.', nextStep:'İşlem türünü ve yaklaşık tutarı paylaşarak başlayın.', profile:'ANLIK BİLGİ' },
  { id:'eligibility', code:'02', title:'İşlem uygunluğu', note:'İşleminizi önceden teyit edin', channel:'whatsapp', fallback:'phone', text:'Merhaba, işlemimin uygunluğunu kontrol etmek istiyorum. İşlem türü ve yaklaşık tutarı paylaşabilirim.', prepare:['İşlem türü','Yaklaşık tutar'], privacy:'Ön değerlendirme için hassas veri paylaşmayın.', outcome:'İşlemin uygunluğu ve izlenecek ilk adım teyit edilir.', reason:'Ön kontrol için yazılı bilgi akışı hızlı ve karşılıklı teyide uygundur.', nextStep:'İşlem türünü belirtin; uygunluk teyidinden sonra ilerleyin.', profile:'ÖN KONTROL' },
  { id:'support', code:'03', title:'İşlem desteği', note:'Devam eden süreç için destek', channel:'whatsapp', fallback:'phone', text:'Merhaba, mevcut işlemimle ilgili destek almak istiyorum.', prepare:['İşlem konusu','Varsa işlem referansı'], privacy:'Şifre, PIN, CVV veya SMS kodu paylaşmayın.', outcome:'Mevcut süreciniz doğru destek akışına yönlendirilir.', reason:'Devam eden işlemde yazılı referans ve durum paylaşımı takibi kolaylaştırır.', nextStep:'İşlem konusunu ve varsa referansınızı paylaşın; erişim kodu göndermeyin.', profile:'AKTİF İŞLEM' },
  { id:'corporate', code:'04', title:'Kurumsal talep', note:'Yazılı ve kayıtlı iletişim', channel:'email', fallback:'phone', subject:'Kurumsal Talep - Sky Bozum', text:'Merhaba, Sky Bozum ile kurumsal bir talep hakkında iletişime geçmek istiyorum. Kurum / yetkili bilgisi ve talebin kısa özetini paylaşabilirim.', prepare:['Kurum / yetkili adı','Talebin kısa özeti'], privacy:'Yalnızca talep için gerekli kurumsal bilgileri ekleyin.', outcome:'Talebiniz yazılı kayıt üzerinden kurumsal değerlendirmeye alınır.', reason:'Kurumsal taleplerde yazılı kayıt ve düzenlenebilir kapsam daha sağlıklı ilerler.', nextStep:'Kurum veya yetkili adını ve talebin kısa özetini e-postaya ekleyin.', profile:'KURUMSAL KAYIT' },
] as const;

function copyWithFallback(value:string){ const el=document.createElement('textarea'); el.value=value; el.setAttribute('readonly',''); el.style.position='fixed'; el.style.left='-9999px'; document.body.appendChild(el); try{el.select(); return document.execCommand('copy')}finally{el.remove()} }
function ChannelIcon({kind}:{kind:ChannelKind}){ if(kind==='phone')return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><path d="M7.1 3.5 4.9 5.7c-.7.7-.9 1.8-.5 2.7 2 4.7 5.7 8.4 10.4 10.4.9.4 2 .2 2.7-.5l2.2-2.2-4-3-1.8 1.8a13.4 13.4 0 0 1-4.8-4.8l1.8-1.8-3-4Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/></svg>; if(kind==='email')return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><rect x="3.5" y="5.5" width="17" height="13" rx="2.5" stroke="currentColor" strokeWidth="1.7"/><path d="m5 7 7 5.2L19 7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>; return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><path d="M12 3.5a8.5 8.5 0 0 0-7.3 12.9L3.5 20.5l4.2-1.1A8.5 8.5 0 1 0 12 3.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/><path d="M8.5 8.2c.2 3.4 3 6.1 6.4 6.4l1-1.6-2.1-1-1 1a6.8 6.8 0 0 1-2.1-2.1l1-1-1-2.1-2.2.4Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg> }

export default function ContactChannels({channels}:{channels:readonly ContactChannel[]}){
  const [status,setStatus]=useState<{channel:ChannelKind|'brief'|null;message:string}|null>(null);
  const [purposeId,setPurposeId]=useState<PurposeId>('rate');
  const [prepared,setPrepared]=useState<boolean[]>(()=>purposes[0].prepare.map(()=>false));
  const timerRef=useRef<ReturnType<typeof setTimeout>|null>(null);
  useEffect(()=>()=>{if(timerRef.current)clearTimeout(timerRef.current)},[]);
  async function copyValue(value:string, successMessage:string, channel:ChannelKind|'brief'){ if(timerRef.current)clearTimeout(timerRef.current); let ok=false; try{ if(navigator.clipboard?.writeText){try{await navigator.clipboard.writeText(value);ok=true}catch{ok=copyWithFallback(value)}}else ok=copyWithFallback(value); setStatus({channel:ok?channel:null,message:ok?successMessage:'Bilgi kopyalanamadı'}) }catch{setStatus({channel:null,message:'Bilgi kopyalanamadı'})} timerRef.current=setTimeout(()=>setStatus(null),2200) }
  async function copy(channel:ContactChannel){ await copyValue(channel.value,'Bilgi kopyalandı',channel.kind) }

  const selected = useMemo(()=>purposes.find(item=>item.id===purposeId)??purposes[0],[purposeId]);
  useEffect(()=>setPrepared(selected.prepare.map(()=>false)),[selected.id, selected.prepare]);
  const readyCount=prepared.filter(Boolean).length;
  const readyTotal=selected.prepare.length;
  const readyPercent=readyTotal?Math.round((readyCount/readyTotal)*100):100;
  const readinessLabel = readyCount===readyTotal ? 'Hazır' : readyCount>0 ? 'Hazırlanıyor' : 'Başlangıç';
  const readinessNote = readyCount===readyTotal ? 'Temel bilgiler tamamlandı' : readyCount>0 ? 'Bir adım daha kaldı' : 'İki kısa bilgi yeterli';
  const handoffLabel = readyCount===readyTotal ? 'DEVAMA HAZIR' : readyCount>0 ? 'HAZIRLIK SÜRÜYOR' : 'GÜVENLİ BAŞLANGIÇ';
  const handoffText = readyCount===readyTotal ? 'Başlangıç özeti tamamlandı. Önerilen kanala geçebilirsiniz.' : readyCount>0 ? `Son ${readyTotal-readyCount} kısa bilgiyi hazırladığınızda özet tamamlanır.` : 'Hazırlık zorunlu değil; iki kısa bilgi ilk teması hızlandırır.';
  const primary=channels.find(c=>c.primary)??channels[0];
  const email=channels.find(c=>c.kind==='email');
  const secondary=channels.filter(c=>c.kind!==primary.kind);
  const selectedChannel=channels.find(c=>c.kind===selected.channel)??primary;
  const fallbackChannel=channels.find(c=>c.kind===selected.fallback);
  const actionHref = selected.channel==='email' && email ? `${email.href}?subject=${encodeURIComponent(selected.subject??selected.title)}&body=${encodeURIComponent(selected.text)}` : buildWhatsAppUrl(selected.text);
  const actionLabel = selected.channel==='email' ? 'E-posta taslağını aç' : 'Hazır mesajla WhatsApp’a geç';
  const fallbackLabel = fallbackChannel?.kind==='phone' ? 'Telefonla görüş' : fallbackChannel?.kind==='email' ? 'E-posta gönder' : 'Alternatif kanalı aç';
  const privacyLevel = selected.id==='support' ? 'Sıkı' : 'Standart';
  const briefText = `Talep: ${selected.title}\nProfil: ${selected.profile}\nÖnerilen kanal: ${selectedChannel.title}\nHazırlık: ${selected.prepare.join(', ')}\nGizlilik: ${selected.privacy}\nSonraki adım: ${selected.nextStep}`;
  function handlePurposeKeyDown(event:KeyboardEvent<HTMLButtonElement>, index:number){
    if(!['ArrowRight','ArrowLeft','ArrowDown','ArrowUp','Home','End'].includes(event.key)) return;
    event.preventDefault();
    let next=index;
    if(event.key==='ArrowRight'||event.key==='ArrowDown') next=(index+1)%purposes.length;
    if(event.key==='ArrowLeft'||event.key==='ArrowUp') next=(index-1+purposes.length)%purposes.length;
    if(event.key==='Home') next=0;
    if(event.key==='End') next=purposes.length-1;
    setPurposeId(purposes[next].id);
    requestAnimationFrame(()=>document.getElementById(`contact-purpose-${purposes[next].id}`)?.focus());
  }

  return <>
    <div id="iletisim-yonlendirici" className="contact-access-layout contact-access-layout--263 contact-access-layout--268">
      <article className="contact-access-primary contact-access-primary--263 contact-access-primary--268">
        <div className="contact-access-overline contact-access-overline--269"><span>01</span><b>TALEP YÖNLENDİRİCİ</b><em>ÖZEL MÜŞTERİ ERİŞİMİ</em></div>
        <div className="contact-journey-rail contact-journey-rail--267 contact-journey-rail--268" aria-label="İletişim akışı">
          <span className="is-active"><i>01</i><b>Amacınız</b></span>
          <span><i>02</i><b>Temas özeti</b></span>
          <span><i>03</i><b>Resmî kanal</b></span>
        </div>
        <div className="contact-access-primary-head contact-access-primary-head--263">
          <div className="contact-channel-icon"><ChannelIcon kind={selected.channel}/></div>
          <div><p>Müşteri erişim masası</p><h3>Ne için iletişim kurduğunuzu seçin.</h3><small className="contact-access-helper">Doğru kanal ve gerekli hazırlık otomatik olarak eşleşir.</small></div>
        </div>

        <div className="contact-intent-grid contact-intent-grid--268 contact-intent-grid--269" role="tablist" aria-label="İletişim amacını seçin">
          {purposes.map((item,index)=><button id={`contact-purpose-${item.id}`} key={item.id} type="button" role="tab" tabIndex={selected.id===item.id?0:-1} aria-selected={selected.id===item.id} aria-controls="contact-purpose-panel" onKeyDown={(event)=>handlePurposeKeyDown(event,index)} onClick={()=>setPurposeId(item.id)} className={`contact-intent-option contact-intent-option--269 focus-ring${selected.id===item.id?' is-active':''}`}>
            <span>{item.code}</span><div><b>{item.title}</b><small>{item.note}</small></div><i aria-hidden="true">{selected.id===item.id?'✓':'+'}</i>
          </button>)}
        </div>

        <div id="contact-purpose-panel" role="tabpanel" aria-labelledby={`contact-purpose-${selected.id}`} className="contact-recommendation contact-recommendation--266 contact-recommendation--267 contact-recommendation--268 contact-recommendation--269 contact-recommendation--271" aria-live="polite">
          <div className="contact-recommendation-label contact-recommendation-label--267">
            <span>AKILLI TEMAS ÖZETİ</span>
            <b>{selected.channel==='email'?'YAZILI KAYIT / E-POSTA':'ÖNCELİKLİ ERİŞİM / WHATSAPP'}</b>
          </div>

          <div className="contact-dossier contact-dossier--267 contact-dossier--268">
            <div className="contact-dossier-main">
              <div className="contact-dossier-heading contact-dossier-heading--269">
                <small>Seçili talep</small>
                <h4>{selected.title}</h4>
                <p>{selected.outcome}</p>
                <div className="contact-dossier-strip contact-dossier-strip--277" aria-label="Temas özeti">
                  <span><small>PROFİL</small><b>{selected.profile}</b></span>
                  <span><small>KANAL</small><b>{selected.channel==='email'?'E-posta':'WhatsApp'}</b></span>
                  <span><small>GİZLİLİK</small><b>{privacyLevel}</b></span>
                  <span><small>DURUM</small><b>{readinessLabel}</b></span>
                </div>
              </div>

              <div className="contact-dossier-message" aria-label="Hazır başlangıç mesajı">
                <div><span>HAZIR BAŞLANGIÇ</span><b>Mesajı düzenleyebilir veya doğrudan kullanabilirsiniz.</b></div>
                <p>{selected.text}</p>
                <button type="button" onClick={()=>copyValue(selected.text,'Hazır mesaj kopyalandı','brief')} className="contact-brief-copy contact-brief-copy--267 focus-ring">
                  {status?.channel==='brief'?'Kopyalandı':'Mesajı kopyala'} <span aria-hidden="true">⧉</span>
                </button>
              </div>
              <div className="contact-concierge-guidance" aria-label="Concierge yönlendirme notu">
                <div><span>NEDEN BU KANAL?</span><p>{selected.reason}</p></div>
                <div><span>SONRAKİ ADIM</span><p>{selected.nextStep}</p></div>
              </div>
              <button type="button" onClick={()=>copyValue(briefText,'Temas özeti kopyalandı','brief')} className="contact-dossier-copyall focus-ring">Temas özetini kopyala <span aria-hidden="true">⧉</span></button>
            </div>

            <aside className="contact-dossier-side contact-dossier-side--275" aria-label="Müşteri kabul özeti">
              <div className="contact-intake-summary contact-intake-summary--276">
                <div className="contact-intake-head contact-intake-head--276 contact-intake-head--277">
                  <div>
                    <span>MÜŞTERİ KABUL DOSYASI</span>
                    <b>{selected.title}</b>
                    <small>SB-{selected.code} · {selected.profile}</small>
                  </div>
                  <div className="contact-intake-seal" aria-label="Doğrulanmış erişim">
                    <strong>SB</strong><span>DOĞRULANMIŞ<br/>ERİŞİM</span>
                  </div>
                </div>
                <div className="contact-intake-statusline" role="status" aria-live="polite">
                  <span>HAZIRLIK DURUMU</span>
                  <em className={`contact-intake-state${readyCount===readyTotal?' is-ready':readyCount>0?' is-progress':''}`}>{readinessLabel} · {readyCount}/{readyTotal}</em>
                </div>
                <dl className="contact-intake-facts contact-intake-facts--276 contact-intake-facts--277">
                  <div><dt>Resmî kanal</dt><dd>{selectedChannel.title}<small>{selectedChannel.response}</small></dd></div>
                  <div><dt>Gizlilik</dt><dd>{privacyLevel}<small>{selected.privacy}</small></dd></div>
                </dl>
                <div className="contact-intake-signature" aria-label="İletişim standardı">
                  <span>SKY BOZUM</span><b>İLETİŞİM STANDARDI</b><i aria-hidden="true" />
                </div>
              </div>
              <div className="contact-dossier-prepare contact-dossier-prepare--271 contact-dossier-prepare--272 contact-dossier-prepare--275">
                <div className="contact-prepare-title"><span>HAZIRLIK KONTROLÜ</span>{readyCount>0 ? <button type="button" onClick={()=>setPrepared(selected.prepare.map(()=>false))} className="contact-readiness-reset contact-readiness-reset--275 focus-ring">Sıfırla</button> : null}</div>
                <ol>{selected.prepare.map((item,index)=><li key={item}><button type="button" aria-pressed={prepared[index]} onClick={()=>setPrepared(current=>current.map((value,i)=>i===index?!value:value))} className={`contact-prepare-check focus-ring${prepared[index]?' is-ready':''}`}><i aria-hidden="true">{prepared[index]?'✓':String(index+1).padStart(2,'0')}</i><b>{item}</b><span>{prepared[index]?'Hazır':'İşaretle'}</span></button></li>)}</ol>
                <div className={`contact-handoff-note contact-handoff-note--275${readyCount===readyTotal?' is-ready':''}`} aria-live="polite"><i aria-hidden="true">{readyCount===readyTotal?'✓':'→'}</i><div><span>{handoffLabel}</span><p>{handoffText}</p></div></div>
              </div>
            </aside>
          </div>

          <div className="contact-dossier-actions contact-dossier-actions--267 contact-dossier-actions--271">
            <a href={actionHref} target={selected.channel==='email'?undefined:'_blank'} rel={selected.channel==='email'?undefined:'noopener noreferrer'} className={`contact-channel-open contact-channel-open--263 contact-channel-open--267 contact-channel-open--273 focus-ring${readyCount===readyTotal?' is-ready':''}`}>
              <span><small>{readyCount===readyTotal?'HAZIR · ÖNERİLEN DEVAM':'GÜVENLİ BAŞLANGIÇ'}</small>{readyCount===readyTotal?actionLabel:`${actionLabel} · hazırlık isteğe bağlı`}</span><b aria-hidden="true">↗</b>
            </a>
            {fallbackChannel ? <a href={fallbackChannel.href} className="contact-route-fallback contact-route-fallback--267 focus-ring"><span>{fallbackLabel}</span><b aria-hidden="true">→</b></a> : null}
            <p className="contact-action-assurance"><i aria-hidden="true">✓</i><span>Temas, hassas erişim verisi istemeden başlatılır.</span></p>
          </div>
        </div>

        <div className="contact-access-meta contact-access-meta--263 contact-access-meta--266">
          <span><i aria-hidden="true" /> İlk temas için işlem türü + yaklaşık tutar yeterlidir.</span>
          <span><i aria-hidden="true" /> Şifre, PIN, CVV ve SMS kodu paylaşmayın.</span>
        </div>
      </article>

      <aside className="contact-access-directory contact-access-directory--263 contact-access-directory--268" aria-label="Resmi iletişim kanalları">
        <div className="contact-access-directory-head contact-access-directory-head--263 contact-access-directory-head--268 contact-access-directory-head--269"><span>02 / RESMÎ KANALLAR</span><h3>İhtiyaca göre üç resmî erişim yolu.</h3><p>Yönlendirici en uygun seçeneği önerir. İsterseniz doğrulanmış kanallara doğrudan da geçebilirsiniz.</p><div className="contact-directory-standard"><span>HIZLI</span><span>DOĞRUDAN</span><span>YAZILI</span></div></div>
        <article className="contact-directory-row contact-directory-row--primary">
          <div className="contact-directory-icon"><ChannelIcon kind={primary.kind}/></div>
          <div className="contact-directory-copy"><span>ÖNCELİKLİ ERİŞİM</span><h4>{primary.title}</h4><p>{primary.value}</p><small>{primary.note}</small></div>
          <div className="contact-directory-actions"><a href={primary.href} target="_blank" rel="noopener noreferrer" className="focus-ring">Aç <span aria-hidden="true">↗</span></a><button type="button" onClick={()=>copy(primary)} className="focus-ring">{status?.channel===primary.kind?'Kopyalandı':'Kopyala'}</button></div>
        </article>
        {secondary.map((channel)=><article key={channel.kind} className="contact-directory-row">
          <div className="contact-directory-icon"><ChannelIcon kind={channel.kind}/></div>
          <div className="contact-directory-copy"><span>{channel.kind==='phone'?'DOĞRUDAN GÖRÜŞME':'YAZILI KAYIT'}</span><h4>{channel.title}</h4><p>{channel.value}</p><small>{channel.note}</small></div>
          <div className="contact-directory-actions"><a href={channel.href} className="focus-ring">{channel.kind==='phone'?'Ara':'E-posta'} <span aria-hidden="true">→</span></a><button type="button" onClick={()=>copy(channel)} className="focus-ring">{status?.channel===channel.kind?'Kopyalandı':'Kopyala'}</button></div>
        </article>)}
        <div className="contact-directory-foot contact-directory-foot--263 contact-directory-foot--268"><span>Tek talep · Doğru kanal · Açık teyit</span><b>SKY BOZUM</b></div>
      </aside>
    </div>
    <p className="sr-only" role="status" aria-live="polite">{status?.message??''}</p>
  </>
}
