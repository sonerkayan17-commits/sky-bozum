"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import { collection, onSnapshot } from "firebase/firestore";
import { getFirebaseClient } from "../lib/firebase";
import "./content.css";
import "./admin-tools.css";
import "./site-settings.css";
import RichArticleEditor from "./RichArticleEditor";
import ForumArchivePanel from "./ForumArchivePanel";
import AdminRatePanel from "./AdminRatePanel";
import ForumModerationPanel from "./ForumModerationPanel";
import AdminOperationPanel from "./AdminOperationPanel";
import ArticleRevisionHistory from "./ArticleRevisionHistory";
import ArticleCoverField from "./ArticleCoverField";
import ReleaseReadinessPanel from "./ReleaseReadinessPanel";
import AdminBackupPanel from "./AdminBackupPanel";
import SiteSettingsPanel from "./SiteSettingsPanel";
import ProductInventoryPanel from "./ProductInventoryPanel";
import type { ArticleItem } from "../lib/site";
import {
  removeManagedArticle,
  saveManagedArticle,
  seedArticleForEditing,
  setArticleStatus,
  type ContentArticleDraft,
} from "../lib/contentAdmin";
import {
  changeMemberValue,
  banMember,
  moderateComment,
  removeComment,
  setMemberAccess,
  setMemberRestrictions,
  setMemberStatus,
  subscribeToContentAudit,
  subscribeToMemberLedger,
  subscribeToMembers,
  subscribeToModerationQueue,
  type AdminComment,
  type AdminMember,
  type ContentAuditEvent,
  type MemberLedgerEvent,
  type MemberRole,
  type MemberRestrictionKey,
} from "../lib/admin";

type View = "overview" | "release" | "backup" | "members" | "moderation" | "access" | "content" | "archive" | "audit" | "rates" | "forum" | "operations" | "inventory" | "settings";
type ManagedArticleRecord = ContentArticleDraft & { id: string };
type AuditFilter = 'all' | 'site' | 'content' | 'member' | 'community' | 'operation' | 'system';
const adminViews: readonly View[] = ["overview", "release", "backup", "members", "moderation", "access", "content", "archive", "audit", "rates", "forum", "operations", "inventory", "settings"];
const permissions = [
  "Yorum paylaşımı",
  "İçerik taslağı",
  "Yayınlama",
  "Özel kampanyalar",
];
const restrictionOptions: Array<{ key: MemberRestrictionKey; label: string; detail: string }> = [
  { key: "community", label: "Topluluk etkileşimi", detail: "Konu, yorum, beğeni ve puan gönderimini kapatır." },
  { key: "messaging", label: "Özel mesaj", detail: "Diğer üyelere mesaj göndermeyi kapatır." },
  { key: "code_sale", label: "Kod satışı", detail: "Şifreli kod satış talebi oluşturmayı kapatır." },
  { key: "store_purchase", label: "Ürün satın alma", detail: "Stoktan kod satın alma ve teslim alma akışını kapatır." },
  { key: "wallet", label: "Cüzdan ve ödeme", detail: "Bakiye harcama, IBAN ve ödeme hedefi işlemlerini kapatır." },
];
const bootstrapAdminEmail = "sonerkayan17@gmail.com";

function formatDate(date: Date | null) {
  return date
    ? new Intl.DateTimeFormat("tr-TR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(date)
    : "—";
}

function viewFromUrl(): View | null {
  if (typeof window === "undefined") return null;
  const candidate = new URLSearchParams(window.location.search).get("view");
  return candidate && adminViews.includes(candidate as View) ? candidate as View : null;
}

function auditActionLabel(action: string) {
  const labels: Record<string, string> = {
    'site-inline-updated': 'Sayfa içeriği güncellendi',
    'release-readiness:updated': 'Yayın kontrolü güncellendi',
    'admin-backup:downloaded': 'Yönetim yedeği indirildi',
    'edit-ready': 'Makale düzenlemeye açıldı',
    saved: 'Makale kaydedildi',
    published: 'Makale yayımlandı',
    draft: 'Makale taslağa alındı',
    archived: 'Makale arşivlendi',
    restored: 'Önceki makale sürümü geri yüklendi',
    'comment:inline-edited': 'Yorum güncellendi',
    'comment:inline-removed': 'Yorum kaldırıldı',
    'comment:approved': 'Yorum onaylandı',
    'comment:rejected': 'Yorum reddedildi',
    'comment:deleted': 'Yorum silindi',
    'comment:removed-from-report': 'Raporlanan yorum kaldırıldı',
    'forum:edited': 'Forum konusu güncellendi',
    'forum:report-resolved': 'Forum raporu çözüldü',
    'forum:restored': 'Forum konusu geri yüklendi',
    'forum:locked': 'Forum konusu kilitlendi',
    'forum:unlocked': 'Forum konusu yeniden açıldı',
    'forum:inline-publish': 'Forum konusu yayımlandı',
    'forum:inline-archive': 'Forum konusu arşivlendi',
    'forum:inline-lock': 'Forum konusu kilitlendi',
    'forum:inline-unlock': 'Forum konusu yeniden açıldı',
    'operation:created': 'İşlem talebi oluşturuldu',
    'operation:note': 'İşlem notu eklendi',
    'stock:batch-updated': 'Stok partisi güncellendi',
  };
  if (labels[action]) return labels[action];
  if (action.startsWith('rate:')) return action.endsWith(':published') ? 'Oran yayımlandı' : 'Oran taslak olarak kaydedildi';
  if (action.startsWith('member-status:')) return `Üye durumu güncellendi: ${action.split(':')[1]}`;
  if (action.startsWith('member-access:')) return 'Üye yetkileri güncellendi';
  if (action.startsWith('member-balance:')) return action.endsWith(':credit') ? 'Üye bakiyesine ekleme yapıldı' : 'Üye bakiyesinden düşüş yapıldı';
  if (action.startsWith('member-points:')) return action.endsWith(':credit') ? 'Üye puanına ekleme yapıldı' : 'Üye puanından düşüş yapıldı';
  if (action.startsWith('operation:priority:')) return 'İşlem önceliği güncellendi';
  if (action.startsWith('operation:')) return 'İşlem durumu güncellendi';
  return 'Yönetim kaydı güncellendi';
}

function auditTargetLabel(event: ContentAuditEvent, managedArticles: ManagedArticleRecord[], baseArticles: ArticleItem[], members: AdminMember[]) {
  const member = members.find((item) => item.id === event.articleSlug);
  if (member) return member.displayName;
  const article = [...managedArticles, ...baseArticles].find((item) => item.slug === event.articleSlug);
  if (article) return article.title;
  if (event.targetLabel) return event.targetLabel;
  if (event.contentKey) {
    const labels: Record<string, string> = {
      'home.hero.eyebrow': 'Ana Sayfa · üst başlık',
      'home.hero.title': 'Ana Sayfa · ana başlık',
      'home.hero.lead': 'Ana Sayfa · açıklama',
      'home.hero.app-logo': 'Ana Sayfa · uygulama logosu',
      'home.final-cta.description': 'Ana Sayfa · alt çağrı metni',
      'site.footer.description': 'Alt bilgi · açıklama',
      'site.footer.tagline': 'Alt bilgi · slogan',
      'home.trust.description': 'Ana Sayfa · güven açıklaması',
    };
    if (labels[event.contentKey]) return labels[event.contentKey];
    if (event.contentKey.startsWith('page-')) return 'Sayfa içi düzenleme';
    return `Site içeriği: ${event.contentKey.replace(/\./g, ' · ')}`;
  }
  if (event.articleSlug === 'global') return 'Yayın kontrolü';
  if (event.articleSlug === 'unknown') return 'Genel yönetim';
  if (event.action.startsWith('rate:')) return `Oran kaydı: ${event.articleSlug}`;
  if (event.action.startsWith('operation:')) return `İşlem kaydı: ${event.articleSlug.slice(0, 8)}`;
  if (event.action.startsWith('forum:') || event.action.startsWith('comment:')) return `Topluluk kaydı: ${event.articleSlug.slice(0, 8)}`;
  return event.articleSlug.replace(/-/g, ' ');
}

function auditActorLabel(actorId: string, members: AdminMember[], currentUserId: string) {
  if (actorId === currentUserId) return 'Siz';
  return members.find((member) => member.id === actorId)?.displayName || 'Yönetici hesabı';
}

function auditCategory(action: string): Exclude<AuditFilter, 'all'> {
  if (action === 'site-inline-updated') return 'site';
  if (action.startsWith('member-')) return 'member';
  if (action.startsWith('comment:') || action.startsWith('forum:')) return 'community';
  if (action.startsWith('operation:')) return 'operation';
  if (action.startsWith('rate:') || action.startsWith('release-') || action.startsWith('admin-backup:')) return 'system';
  return 'content';
}

export default function AdminConsole({
  articleCount,
  rateCount,
  referenceCount,
  latestReferenceAt,
}: {
  articleCount: number;
  rateCount: number;
  referenceCount: number;
  latestReferenceAt: string;
}) {
  const [firebaseClient, setFirebaseClient] = useState(() =>
    getFirebaseClient(),
  );
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [view, setView] = useState<View>("overview");
  const [members, setMembers] = useState<AdminMember[]>([]);
  const [comments, setComments] = useState<AdminComment[]>([]);
  const [contentAudit, setContentAudit] = useState<ContentAuditEvent[]>([]);
  const [memberLedger, setMemberLedger] = useState<MemberLedgerEvent[]>([]);
  const [memberQuery, setMemberQuery] = useState("");
  const [memberStatusFilter, setMemberStatusFilter] = useState<"all" | AdminMember["status"]>("all");
  const [commentStatusFilter, setCommentStatusFilter] = useState<"all" | AdminComment["status"]>("all");
  const [managedArticles, setManagedArticles] = useState<ManagedArticleRecord[]>([]);
  const [baseArticles, setBaseArticles] = useState<ArticleItem[]>([]);
  const [contentQuery, setContentQuery] = useState("");
  const [contentStatus, setContentStatus] = useState<"all" | ContentArticleDraft["status"]>("all");
  const [auditFilter, setAuditFilter] = useState<AuditFilter>('all');
  const [auditQuery, setAuditQuery] = useState('');
  const [selectedMember, setSelectedMember] = useState<AdminMember | null>(
    null,
  );
  const [editingArticle, setEditingArticle] =
    useState<ContentArticleDraft | null>(null);
  const [amount, setAmount] = useState("");
  const [valueKind, setValueKind] = useState<"balance" | "points">("balance");
  const [note, setNote] = useState("");
  const [banReason, setBanReason] = useState("");
  const [banDuration, setBanDuration] = useState("permanent");
  const [actionBusy, setActionBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [clientReady, setClientReady] = useState(false);
  const [todayKey] = useState(() => new Date().toISOString().slice(0, 10));
  const auth = firebaseClient.auth;
  const db = firebaseClient.db;
  const visibleContentAudit = useMemo(() => {
    const term = auditQuery.trim().toLocaleLowerCase('tr-TR');
    return contentAudit.filter((event) => {
      if (auditFilter !== 'all' && auditCategory(event.action) !== auditFilter) return false;
      if (!term) return true;
      return [auditTargetLabel(event, managedArticles, baseArticles, members), auditActionLabel(event.action), auditActorLabel(event.actorId, members, user?.uid || '')]
        .some((value) => value.toLocaleLowerCase('tr-TR').includes(term));
    });
  }, [auditFilter, auditQuery, baseArticles, contentAudit, managedArticles, members, user?.uid]);
  const visibleMemberLedger = useMemo(() => {
    const term = auditQuery.trim().toLocaleLowerCase('tr-TR');
    if (!term) return memberLedger;
    return memberLedger.filter((event) => [members.find((member) => member.id === event.memberId)?.displayName || event.memberId, event.note, event.kind]
      .some((value) => value.toLocaleLowerCase('tr-TR').includes(term)));
  }, [auditQuery, memberLedger, members]);

  useEffect(() => {
    const requestedView = viewFromUrl();
    if (requestedView) setView(requestedView);
  }, []);

  useEffect(() => {
    setClientReady(true);
    const client = getFirebaseClient();
    setFirebaseClient(client);
    if (!client.auth) {
      setChecking(false);
      return;
    }
    return onAuthStateChanged(client.auth, async (nextUser) => {
      setUser(nextUser);
      const token = nextUser ? await nextUser.getIdTokenResult() : null;
      setIsAdmin(
        token?.claims.admin === true || nextUser?.email === bootstrapAdminEmail,
      );
      setChecking(false);
    });
  }, []);

  useEffect(() => {
    if (!db || !isAdmin) return;
    const stopMembers = subscribeToMembers(db, setMembers, (nextError) =>
      setError(nextError.message),
    );
    const stopComments = subscribeToModerationQueue(
      db,
      setComments,
      (nextError) => setError(nextError.message),
    );
    const stopContentAudit = subscribeToContentAudit(
      db,
      setContentAudit,
      (nextError) => setError(nextError.message),
    );
    const stopMemberLedger = subscribeToMemberLedger(
      db,
      setMemberLedger,
      (nextError) => setError(nextError.message),
    );
    return () => {
      stopMembers();
      stopComments();
      stopContentAudit();
      stopMemberLedger();
    };
  }, [db, isAdmin]);

  useEffect(() => {
    setSelectedMember((current) => {
      if (!current) return null;
      return members.find((member) => member.id === current.id) || current;
    });
  }, [members]);

  useEffect(() => {
    if (!db || !isAdmin) return;
    return onSnapshot(
      collection(db, "contentArticles"),
      (snapshot) => {
        setManagedArticles(
          snapshot.docs.map((item) => {
            const data = item.data();
            const status = data.status;
            return {
              id: item.id,
              slug: String(data.slug || item.id),
              title: String(data.title || "Başlıksız makale"),
              excerpt: String(data.excerpt || "Kısa özet eklenmedi."),
              category: String(data.category || "Genel"),
              seoTitle: String(data.seoTitle || ""),
              metaDescription: String(data.metaDescription || ""),
              cover: String(data.cover || ""),
              body: String(data.body || ""),
              keywords: Array.isArray(data.keywords) ? data.keywords.map(String) : [],
              serviceSlug: String(data.serviceSlug || ""),
              reviewDueAt: String(data.reviewDueAt || ""),
              status: ["draft", "published", "archived"].includes(status)
                ? status
                : "draft",
            } as ManagedArticleRecord;
          }),
        );
      },
      (nextError) => setError(nextError.message),
    );
  }, [db, isAdmin]);

  useEffect(() => {
    if (!isAdmin || baseArticles.length) return;
    let active = true;
    void import("../lib/site").then(({ articles: nextArticles }) => {
      if (active) setBaseArticles(nextArticles);
    });
    return () => {
      active = false;
    };
  }, [baseArticles.length, isAdmin]);

  const pendingComments = useMemo(
    () => comments.filter((comment) => comment.status === "pending"),
    [comments],
  );
  const activeMembers = useMemo(
    () => members.filter((member) => member.status === "active"),
    [members],
  );
  const filteredMembers = useMemo(() => {
    const query = memberQuery.trim().toLocaleLowerCase("tr-TR");
    return members.filter((member) => {
      const matchesQuery = !query || `${member.displayName} ${member.email}`.toLocaleLowerCase("tr-TR").includes(query);
      return matchesQuery && (memberStatusFilter === "all" || member.status === memberStatusFilter);
    });
  }, [memberQuery, memberStatusFilter, members]);
  const filteredComments = useMemo(
    () => comments.filter((comment) => commentStatusFilter === "all" || comment.status === commentStatusFilter),
    [commentStatusFilter, comments],
  );
  const publishedContentCount = useMemo(() => managedArticles.filter((article) => article.status === "published").length, [managedArticles]);
  const draftContentCount = useMemo(() => managedArticles.filter((article) => article.status === "draft").length, [managedArticles]);
  const customArticles = useMemo(
    () =>
      managedArticles.filter(
        (article) => !baseArticles.some((siteArticle) => siteArticle.slug === article.slug),
      ),
    [baseArticles, managedArticles],
  );

  const contentMatches = (article: Pick<ContentArticleDraft, "title" | "excerpt" | "category" | "status">) => {
    const query = contentQuery.trim().toLocaleLowerCase("tr-TR");
    const matchesQuery = !query || `${article.title} ${article.excerpt} ${article.category}`.toLocaleLowerCase("tr-TR").includes(query);
    return matchesQuery && (contentStatus === "all" || article.status === contentStatus);
  };

  const duplicateArticle = (article: ContentArticleDraft) => {
    setEditingArticle({
      ...article,
      slug: `${article.slug}-kopya`,
      title: `${article.title} — Kopya`,
      status: "draft",
    });
  };

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!auth) return;
    setError("");
    setMessage("");
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch {
      setError("Giriş bilgileri doğrulanamadı.");
    }
  }

  async function resetPassword() {
    if (!auth || !email.trim()) {
      setError("Şifre sıfırlama için e-posta adresinizi yazın.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setMessage("Şifre sıfırlama bağlantısı gönderildi.");
    } catch {
      setError("Bağlantı gönderilemedi. E-posta adresini kontrol edin.");
    }
  }

  async function run(action: () => Promise<void>, success: string) {
    if (actionBusy) return;
    setActionBusy(true);
    setError("");
    setMessage("");
    try {
      await action();
      setMessage(success);
    } catch (nextError) {
      setError(
        nextError instanceof Error ? nextError.message : "İşlem tamamlanamadı.",
      );
    } finally {
      setActionBusy(false);
    }
  }

  function confirmAction(message: string, action: () => Promise<void>, success: string) {
    if (!window.confirm(message)) return;
    run(action, success);
  }

  if (!clientReady || checking)
    return (
      <main className="admin-shell">
        <p className="admin-loading">Yönetim erişimi doğrulanıyor…</p>
      </main>
    );
  if (!auth || !db)
    return (
      <main className="admin-shell">
        <section className="admin-gate">
          <span>SKY BOZUM · YÖNETİM</span>
          <h1>Panel bağlantısı hazır değil.</h1>
          <p>
            Firebase yapılandırması eklenmeden kullanıcı, bakiye ve yetki
            verilerine güvenli erişim açılamaz.
          </p>
        </section>
      </main>
    );
  if (!user || !isAdmin)
    return (
      <main className="admin-shell">
        <section className="admin-gate">
          <span>GÜVENLİ YÖNETİM GİRİŞİ</span>
          <h1>Yalnız yetkili ekip.</h1>
          <p>
            Parolalar görüntülenmez veya onaylanmaz. Firebase kimlik doğrulaması
            ile giriş yapılır; şifre işlemleri güvenli sıfırlama bağlantısıyla
            yürür.
          </p>
          <form onSubmit={login}>
            <label>
              E-posta
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                required
              />
            </label>
            <label>
              Parola
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                required
              />
            </label>
            <button className="admin-primary" type="submit">
              Güvenli giriş yap <span>→</span>
            </button>
            <button
              className="admin-text-action"
              type="button"
              onClick={resetPassword}
            >
              Şifre sıfırlama bağlantısı gönder
            </button>
          </form>
          {error && <p className="admin-error">{error}</p>}
          {message && <p className="admin-success">{message}</p>}
          <small>
            Bu hesabın Firebase özel yetkisinde <b>admin: true</b> bulunmalıdır.
          </small>
        </section>
      </main>
    );

  return (
    <main className="admin-shell">
      <div className="admin-frame">
        <header className="admin-top">
          <div>
            <span>SKY BOZUM / KONTROL MERKEZİ</span>
            <h1>Operasyon yönetimi</h1>
          </div>
          <div className="admin-user">
            <strong>{user.email}</strong>
            <button onClick={() => signOut(auth!)}>Çıkış</button>
          </div>
        </header>
        <nav className="admin-nav" aria-label="Yönetim bölümleri">
          <button className={view === "settings" ? "is-active" : ""} onClick={() => setView("settings")}>Site ayarları</button>
          {(
            [
              ["overview", "Genel bakış"],
              ["release", "Yayın kontrolü"],
              ["backup", "Yedek"],
              ["content", "İçerik"],
              ["rates", "Oranlar"],
              ["operations", "Kod satışları / İşlemler"],
              ["inventory", "Ürün stokları"],
              ["members", "Üyeler"],
              ["moderation", "Yorumlar"],
              ["forum", "Forum"],
              ["access", "Yetkiler"],
              ["archive", "Forum arşivi"],
              ["audit", "İşlem geçmişi"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              className={view === id ? "is-active" : ""}
              onClick={() => setView(id)}
            >
              {label}
            </button>
          ))}
        </nav>
        {(error || message) && (
          <p
            className={
              error ? "admin-error admin-notice" : "admin-success admin-notice"
            }
          >
            {error || message}
          </p>
        )}
        {view === "overview" && (
          <section className="admin-overview">
            <div className="admin-intro">
              <span>CANLI OPERASYON ÖZETİ</span>
              <h2>
                Net kararlar,
                <br />
                iz bırakacak işlemler.
              </h2>
              <p>
                Kullanıcı durumu, bakiye hareketi ve moderasyon kararları tek
                kayıt hattında takip edilir.
              </p>
            </div>
            <div className="admin-metrics">
              <article>
                <strong>{activeMembers.length}</strong>
                <span>aktif üye</span>
              </article>
              <article>
                <strong>{pendingComments.length}</strong>
                <span>bekleyen yorum</span>
              </article>
              <article>
                <strong>{rateCount}</strong>
                <span>oran kaydı</span>
              </article>
              <article>
                <strong>{articleCount}</strong>
                <span>rehber içeriği</span>
              </article>
            </div>
            <div className="admin-command-strip">
              <button onClick={() => setView("content")}><b>{publishedContentCount}</b><span>yönetilen yayın</span></button>
              <button onClick={() => setView("content")}><b>{draftContentCount}</b><span>hazırlanan taslak</span></button>
              <button onClick={() => setView("members")}><b>{members.filter((member) => member.status === "pending").length}</b><span>üyelik onayı</span></button>
              <button onClick={() => setView("audit")}><b>{contentAudit.length + memberLedger.length}</b><span>denetim kaydı</span></button>
            </div>
            <div className="admin-checklist">
              <h3>Bugünün kontrolü</h3>
              <p>
                <b>{pendingComments.length}</b> yorum moderasyon bekliyor.
              </p>
              <p>Üye bakiyesi yalnız işlem defteri üzerinden değiştirilir.</p>
              <button onClick={() => setView("moderation")}>
                Yorumları incele →
              </button>
            </div>
            <section className="admin-activity" aria-label="İçerik işlem geçmişi">
              <div><span>İÇERİK HAREKETLERİ</span><h3>Son yayın kararları</h3></div>
              {contentAudit.length === 0 ? <p>Henüz içerik işlemi kaydı yok.</p> : <ol>{contentAudit.map((event) => <li key={event.id}><b>{auditTargetLabel(event, managedArticles, baseArticles, members)}</b><span>{auditActionLabel(event.action)}</span><small>{formatDate(event.createdAt)}</small></li>)}</ol>}
              <button onClick={() => setView("content")}>İçerik merkezine git →</button>
            </section>
          </section>
        )}
        {view === "content" && (
          <section className="admin-section">
            <div className="admin-section-head">
              <div>
                <span>İÇERİK MERKEZİ</span>
                <h2>Makale ve SEO kontrolü</h2>
              </div>
              <p>
                Her makale yönetici kaydına alınır; taslak, yayın ve arşiv
                kararları işlem geçmişine yazılır.
              </p>
            </div>
            <button
              className="admin-primary"
              onClick={() =>
                setEditingArticle({
                  slug: "",
                  title: "",
                  excerpt: "",
                  category: "Genel",
                  seoTitle: "",
                  metaDescription: "",
                  cover: "",
                  body: "",
                  keywords: [],
                  serviceSlug: "",
                  reviewDueAt: "",
                  status: "draft",
                })
              }
            >
              Yeni makale oluştur <span>→</span>
            </button>
            <div className="admin-content-tools" role="search" aria-label="İçerik filtreleri">
              <input value={contentQuery} onChange={(event) => setContentQuery(event.target.value)} placeholder="Başlık, kategori veya özet ara" />
              <select value={contentStatus} onChange={(event) => setContentStatus(event.target.value as "all" | ContentArticleDraft["status"])}>
                <option value="all">Tüm durumlar</option>
                <option value="published">Yayında</option>
                <option value="draft">Taslak</option>
                <option value="archived">Arşiv</option>
              </select>
              <span>{baseArticles.length + customArticles.length} içerik kaydı</span>
            </div>
            <div className="admin-content-list">
              {baseArticles.filter((article) => {
                const managed = managedArticles.find((entry) => entry.slug === article.slug);
                return contentMatches({ title: article.title, excerpt: article.excerpt, category: article.category, status: managed?.status || "published" });
              }).map((article) => (
                <article key={article.slug}>
                  <div>
                    <small>
                      {article.category} · {article.readTime}
                    </small>
                    <strong>{article.title}</strong>
                    <p>{article.excerpt}</p>
                    {managedArticles.find((entry) => entry.slug === article.slug)?.reviewDueAt ? <time className={`admin-review-date ${managedArticles.find((entry) => entry.slug === article.slug)!.reviewDueAt! < todayKey ? "is-overdue" : ""}`}>İçerik kontrolü: {new Date(`${managedArticles.find((entry) => entry.slug === article.slug)!.reviewDueAt}T12:00:00`).toLocaleDateString("tr-TR")}</time> : null}
                  </div>
                  <div>
                    <button
                      className="admin-primary compact"
                      onClick={() =>
                        setEditingArticle({
                          slug: article.slug,
                          title: article.title,
                          excerpt: article.excerpt,
                          category: article.category,
                          seoTitle: article.seoTitle || article.title,
                          metaDescription:
                            article.metaDescription || article.excerpt,
                          cover: article.cover || "",
                          body: article.sections
                            .flatMap((section) => section.paragraphs)
                            .join("\n\n"),
                          keywords: article.keywords ? [...article.keywords] : [],
                          serviceSlug: article.serviceSlug || "",
                          reviewDueAt: managedArticles.find((entry) => entry.slug === article.slug)?.reviewDueAt || "",
                          status: "published",
                        })
                      }
                    >
                      Düzenle
                    </button>
                    <a className="admin-secondary compact" href={`/bilgi-merkezi/${article.slug}`} target="_blank" rel="noreferrer">Önizle</a>
                    <button
                      className="admin-secondary compact"
                      onClick={() =>
                        run(
                          () => seedArticleForEditing(db!, article, user.uid),
                          "Makale yönetim kaydına alındı.",
                        )
                      }
                    >
                      Hazırla
                    </button>
                    <button
                      className="admin-secondary compact"
                      onClick={() =>
                        run(
                          () =>
                            setArticleStatus(
                              db!,
                              article.slug,
                              "draft",
                              user.uid,
                            ),
                          "Makale taslağa alındı.",
                        )
                      }
                    >
                      Taslak
                    </button>
                    <button
                      className="admin-secondary compact"
                      onClick={() =>
                        run(
                          () =>
                            setArticleStatus(
                              db!,
                              article.slug,
                              "published",
                              user.uid,
                            ),
                          "Makale yayına alındı.",
                        )
                      }
                    >
                      Yayınla
                    </button>
                    <button
                      className="admin-danger"
                      onClick={() =>
                        confirmAction(
                          `“${article.title}” yayından kaldırılıp arşive alınacak. Devam edilsin mi?`,
                          () =>
                            removeManagedArticle(db!, article.slug, user.uid),
                          "Makale yayından kaldırıldı; arşivden tekrar açılabilir.",
                        )
                      }
                    >
                      Kaldır
                    </button>
                  </div>
                </article>
              ))}
              {customArticles.filter(contentMatches).map((article) => (
                <article key={article.id}>
                  <div>
                    <small>
                      {article.category} · {article.status === "published" ? "Yayında" : article.status === "archived" ? "Arşiv" : "Taslak"}
                    </small>
                    <strong>{article.title}</strong>
                    <p>{article.excerpt}</p>
                    {article.reviewDueAt ? <time className={`admin-review-date ${article.reviewDueAt < todayKey ? "is-overdue" : ""}`}>İçerik kontrolü: {new Date(`${article.reviewDueAt}T12:00:00`).toLocaleDateString("tr-TR")}</time> : <time className="admin-review-date">Kontrol tarihi planlanmadı</time>}
                  </div>
                  <div>
                    <button className="admin-primary compact" onClick={() => setEditingArticle(article)}>
                      Düzenle
                    </button>
                    {article.status === "published" && <a className="admin-secondary compact" href={`/bilgi-merkezi/${article.slug}`} target="_blank" rel="noreferrer">Önizle</a>}
                    <button className="admin-secondary compact" onClick={() => duplicateArticle(article)}>
                      Kopyala
                    </button>
                    <button className="admin-secondary compact" onClick={() => run(() => setArticleStatus(db!, article.slug, "draft", user.uid), "Makale taslağa alındı.")}>Taslak</button>
                    <button className="admin-secondary compact" onClick={() => run(() => setArticleStatus(db!, article.slug, "published", user.uid), "Makale yayına alındı.")}>Yayınla</button>
                    <button className="admin-danger" onClick={() => confirmAction(`“${article.title}” yayından kaldırılıp arşive alınacak. Devam edilsin mi?`, () => removeManagedArticle(db!, article.slug, user.uid), "Makale arşive alındı; istediğiniz zaman yeniden yayınlayabilirsiniz.")}>Arşivle</button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
        {view === "settings" && <SiteSettingsPanel db={db} actorId={user.uid} />}
        {view === "release" && <ReleaseReadinessPanel db={db} actorId={user.uid} referenceCount={referenceCount} latestReferenceAt={latestReferenceAt} />}
        {view === "backup" && <AdminBackupPanel db={db} actorId={user.uid} />}
        {view === "rates" && <AdminRatePanel db={db} actorId={user.uid} />}
        {view === "operations" && <AdminOperationPanel db={db} actorId={user.uid} />}
        {view === "inventory" && <ProductInventoryPanel user={user} />}
        {view === "members" && (
          <section className="admin-section">
            <div className="admin-section-head">
              <div>
                <span>ÜYE KAYITLARI</span>
                <h2>Hesap, durum ve bakiye</h2>
              </div>
              <p>Ban, onay ve bakiye hareketleri kullanıcı kaydına işlenir.</p>
            </div>
            <div className="admin-filterbar" role="search" aria-label="Üye filtreleri">
              <input value={memberQuery} onChange={(event) => setMemberQuery(event.target.value)} placeholder="Ad veya e-posta ara" />
              <select value={memberStatusFilter} onChange={(event) => setMemberStatusFilter(event.target.value as "all" | AdminMember["status"])}>
                <option value="all">Tüm üyeler</option><option value="pending">Onay bekleyen</option><option value="active">Aktif</option><option value="banned">Banlı</option>
              </select>
              <span>{filteredMembers.length} kayıt</span>
            </div>
            <div className="admin-table">
              {filteredMembers.length === 0 ? (
                <p className="admin-empty">
                  Henüz yönetilebilir üye kaydı yok. Yeni üyeler{" "}
                  <code>members</code> koleksiyonuna güvenli kayıt akışıyla
                  düşer.
                </p>
              ) : (
                filteredMembers.map((member) => (
                  <article key={member.id}>
                    <div>
                      <strong>{member.displayName}</strong>
                      <span>{member.email}</span>
                    </div>
                    <span className={`admin-status status-${member.status}`}>
                      {member.status === "active"
                        ? "Aktif"
                        : member.status === "banned"
                          ? "Banlı"
                          : "Onay bekliyor"}
                    </span>
                    <b>
                      {member.balance.toLocaleString("tr-TR")} TL ·{" "}
                      {member.points} puan
                    </b>
                    <small>{formatDate(member.createdAt)}</small>
                    <button onClick={() => { setSelectedMember(member); setBanReason(member.banReason || ''); setBanDuration('permanent'); }}>
                      Yönet →
                    </button>
                  </article>
                ))
              )}
            </div>
          </section>
        )}
        {view === "moderation" && (
          <section className="admin-section">
            <div className="admin-section-head">
              <div>
                <span>YORUM MODERASYONU</span>
                <h2>Yayın kararları</h2>
              </div>
              <p>
                Onaylanan yorum yayına çıkar; silme işlemi geri döndürülemez.
              </p>
            </div>
            <div className="admin-filterbar">
              <select value={commentStatusFilter} onChange={(event) => setCommentStatusFilter(event.target.value as "all" | AdminComment["status"])}>
                <option value="all">Tüm yorumlar</option><option value="pending">Bekleyen</option><option value="approved">Onaylanan</option><option value="rejected">Reddedilen</option>
              </select>
              <span>{filteredComments.length} yorum</span>
            </div>
            <div className="admin-comments">
              {filteredComments.length === 0 ? (
                <p className="admin-empty">İncelenecek yorum bulunmuyor.</p>
              ) : (
                filteredComments.map((comment) => (
                  <article key={comment.id}>
                    <div>
                      <span className={`admin-status status-${comment.status}`}>
                        {comment.status}
                      </span>
                      <strong>
                        {comment.author} · {comment.service}
                      </strong>
                      <p>{comment.message}</p>
                      <small>{formatDate(comment.createdAt)}</small>
                    </div>
                    <div>
                      {comment.status !== "approved" && (
                        <button
                          className="admin-primary compact"
                          onClick={() =>
                            run(
                              () =>
                                moderateComment(
                                  db!,
                                  comment.id,
                                  "approved",
                                  user.uid,
                                ),
                              "Yorum yayınlandı.",
                            )
                          }
                        >
                          Onayla
                        </button>
                      )}
                      {comment.status !== "rejected" && (
                        <button
                          className="admin-secondary compact"
                          onClick={() =>
                            run(
                              () =>
                                moderateComment(
                                  db!,
                                  comment.id,
                                  "rejected",
                                  user.uid,
                                ),
                              "Yorum reddedildi.",
                            )
                          }
                        >
                          Reddet
                        </button>
                      )}
                      <button
                        className="admin-danger"
                        onClick={() =>
                          confirmAction(
                            "Bu yorum kalıcı olarak silinecek. Devam edilsin mi?",
                            () => removeComment(db!, comment.id, user.uid),
                            "Yorum silindi.",
                          )
                        }
                      >
                        Sil
                      </button>
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>
        )}
        {view === "forum" && <ForumModerationPanel db={db} actorId={user.uid} />}
        {view === "access" && (
          <section className="admin-section">
            <div className="admin-section-head">
              <div>
                <span>YETKİ MATRİSİ</span>
                <h2>Paylaşım ve rol yönetimi</h2>
              </div>
              <p>
                Yayınlama rolleri burada verilir; sistem yöneticiliği yalnız
                Firebase özel yetkisiyle tanımlanır.
              </p>
            </div>
            <div className="admin-access-list">
              {members.length === 0 ? (
                <p className="admin-empty">
                  Yetki verilecek kayıtlı üye bulunmuyor.
                </p>
              ) : (
                members.map((member) => {
                  const systemAdmin = member.id === user.uid || member.role === "admin";
                  return <article key={member.id}>
                    <div>
                      <strong>{member.displayName}</strong>
                      <span>{member.email}</span>
                    </div>
                    {systemAdmin ? (
                      <span className="admin-system-role">Sistem yöneticisi · Firebase yetkisi</span>
                    ) : (
                      <select
                        aria-label={`${member.displayName} rolü`}
                        value={member.role}
                        onChange={(event) => {
                          const nextRole = event.target.value as MemberRole;
                          event.currentTarget.value = member.role;
                          if (nextRole === member.role || !window.confirm(`${member.displayName} kullanıcısının rolü “${nextRole}” olarak değiştirilsin mi? Bu değişiklik yönetim günlüğüne kaydedilir.`)) return;
                          run(
                            () => setMemberAccess(db!, member.id, nextRole, member.permissions, user.uid),
                            "Rol güncellendi.",
                          );
                        }}
                      >
                        <option value="member">Üye</option>
                        <option value="editor">İçerik editörü</option>
                        <option value="publisher">Yayın yetkisi</option>
                        <option value="moderator">Moderatör</option>
                        <option value="operator">Operasyon ekibi</option>
                      </select>
                    )}
                    <p>
                      {member.permissions.length
                        ? member.permissions.join(" · ")
                        : "Ek paylaşım yetkisi yok"}
                    </p>
                  </article>;
                })
              )}
            </div>
          </section>
        )}
        {view === "archive" && <ForumArchivePanel db={db} />}
        {view === "audit" && (
          <section className="admin-section">
            <div className="admin-section-head">
              <div><span>DENETİM MERKEZİ</span><h2>Değişiklik ve değer hareketleri</h2></div>
              <p>İçerik kararları ile bakiye ve puan işlemleri zaman damgası ve yönetici kimliğiyle izlenir.</p>
            </div>
            <div className="admin-audit-filterbar" role="search" aria-label="İşlem geçmişinde ara">
              <input value={auditQuery} onChange={(event) => setAuditQuery(event.target.value)} placeholder="İçerik, üye veya işlem ara..." />
              <select value={auditFilter} onChange={(event) => setAuditFilter(event.target.value as AuditFilter)} aria-label="Kayıt türü">
                <option value="all">Tüm kayıt türleri</option>
                <option value="site">Sayfa düzenlemeleri</option>
                <option value="content">Makale içerikleri</option>
                <option value="member">Üye işlemleri</option>
                <option value="community">Forum ve yorumlar</option>
                <option value="operation">Bozum işlemleri</option>
                <option value="system">Sistem ve yayın</option>
              </select>
              <span>{visibleContentAudit.length + visibleMemberLedger.length} kayıt gösteriliyor</span>
            </div>
            <div className="admin-audit-grid">
              <section>
                <header><h3>İçerik geçmişi</h3><span>{visibleContentAudit.length}/{contentAudit.length} kayıt</span></header>
                <div className="admin-audit-list">
                  {visibleContentAudit.length ? visibleContentAudit.map((event) => <article key={event.id}><div><strong>{auditTargetLabel(event, managedArticles, baseArticles, members)}</strong><span>{auditActionLabel(event.action)}</span></div><small>{formatDate(event.createdAt)}</small><code>{auditActorLabel(event.actorId, members, user.uid)}</code></article>) : <p className="admin-empty">Bu filtreyle eşleşen içerik hareketi bulunmuyor.</p>}
                </div>
              </section>
              <section>
                <header><h3>Bakiye ve puan defteri</h3><span>{visibleMemberLedger.length}/{memberLedger.length} kayıt</span></header>
                <div className="admin-audit-list">
                  {visibleMemberLedger.length ? visibleMemberLedger.map((event) => {
                    const member = members.find((item) => item.id === event.memberId);
                    return <article key={event.id}><div><strong>{member?.displayName || event.memberId}</strong><span>{event.note}</span></div><b className={event.amount >= 0 ? "is-positive" : "is-negative"}>{event.amount >= 0 ? "+" : ""}{event.amount.toLocaleString("tr-TR")} {event.kind === "balance" ? "TL" : "puan"}</b><small>{formatDate(event.createdAt)}</small></article>;
                  }) : <p className="admin-empty">Bu aramayla eşleşen değer hareketi bulunmuyor.</p>}
                </div>
              </section>
            </div>
          </section>
        )}
      </div>
      {editingArticle && (
        <div className="admin-modal-backdrop" role="presentation">
          <section
            className="admin-modal admin-content-modal"
            role="dialog"
            aria-modal="true"
          >
            <button
              className="admin-close"
              onClick={() => setEditingArticle(null)}
              aria-label="Pencereyi kapat"
            >
              ×
            </button>
            <span>İÇERİK DÜZENLEYİCİ</span>
            <h2>{editingArticle.slug ? "Makale düzenle" : "Yeni makale"}</h2>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                run(
                  () => saveManagedArticle(db!, editingArticle, user.uid),
                  "İçerik kaydedildi.",
                ).then(() => setEditingArticle(null));
              }}
            >
              <label>
                Bağlantı adı
                <input
                  value={editingArticle.slug}
                  onChange={(event) =>
                    setEditingArticle({
                      ...editingArticle,
                      slug: event.target.value,
                    })
                  }
                  placeholder="ornek-makale"
                  required
                />
              </label>
              <label>
                Başlık
                <input
                  value={editingArticle.title}
                  onChange={(event) =>
                    setEditingArticle({
                      ...editingArticle,
                      title: event.target.value,
                    })
                  }
                  required
                />
              </label>
              <label>
                Kısa özet
                <textarea
                  value={editingArticle.excerpt}
                  onChange={(event) =>
                    setEditingArticle({
                      ...editingArticle,
                      excerpt: event.target.value,
                    })
                  }
                  required
                />
              </label>
              <label>
                Kategori
                <input
                  value={editingArticle.category}
                  onChange={(event) =>
                    setEditingArticle({
                      ...editingArticle,
                      category: event.target.value,
                    })
                  }
                  required
                />
              </label>
              <label>
                SEO başlığı
                <input
                  value={editingArticle.seoTitle}
                  onChange={(event) =>
                    setEditingArticle({
                      ...editingArticle,
                      seoTitle: event.target.value,
                    })
                  }
                />
              </label>
              <label>
                SEO açıklaması
                <textarea
                  value={editingArticle.metaDescription}
                  onChange={(event) =>
                    setEditingArticle({
                      ...editingArticle,
                      metaDescription: event.target.value,
                    })
                  }
                />
              </label>
              <label>
                Kapak görseli
                <ArticleCoverField
                  value={editingArticle.cover}
                  onChange={(cover) =>
                    setEditingArticle({
                      ...editingArticle,
                      cover,
                    })
                  }
                />
              </label>
              <label>
                Arama anahtar kelimeleri
                <input
                  value={(editingArticle.keywords || []).join(", ")}
                  onChange={(event) => setEditingArticle({ ...editingArticle, keywords: event.target.value.split(",").map((item) => item.trim()).filter(Boolean) })}
                  placeholder="mobil ödeme, bozum, vodafone"
                />
              </label>
              <label>
                Bağlı hizmet kodu
                <input
                  value={editingArticle.serviceSlug || ""}
                  onChange={(event) => setEditingArticle({ ...editingArticle, serviceSlug: event.target.value })}
                  placeholder="vodafone-mobil-odeme"
                />
              </label>
              <label>
                Yeniden inceleme tarihi
                <input
                  type="date"
                  value={editingArticle.reviewDueAt || ""}
                  onChange={(event) => setEditingArticle({ ...editingArticle, reviewDueAt: event.target.value })}
                />
                <small>Oran, yasal açıklama, bağlantı ve kaynakların tekrar denetleneceği gün.</small>
              </label>
              <label>
                Makale metni
                <RichArticleEditor
                  value={editingArticle.body || ""}
                  onChange={(body) =>
                    setEditingArticle({
                      ...editingArticle,
                      body,
                    })
                  }
                  placeholder="Makalenin paragraflarını boş bir satır bırakarak yazın."
                />
              </label>
              <label>
                Durum
                <select
                  value={editingArticle.status}
                  onChange={(event) =>
                    setEditingArticle({
                      ...editingArticle,
                      status: event.target
                        .value as ContentArticleDraft["status"],
                    })
                  }
                >
                  <option value="draft">Taslak</option>
                  <option value="published">Yayında</option>
                  <option value="archived">Arşiv</option>
                </select>
              </label>
              {editingArticle.slug && <ArticleRevisionHistory
                db={db}
                articleSlug={editingArticle.slug}
                actorId={user.uid}
                onRestore={(revision) => setEditingArticle(revision)}
              />}
              <button className="admin-primary" type="submit">
                İçeriği kaydet →
              </button>
            </form>
          </section>
        </div>
      )}
      {selectedMember && (
        <div className="admin-modal-backdrop" role="presentation">
          <section
            className="admin-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="member-title"
          >
            <button
              className="admin-close"
              onClick={() => setSelectedMember(null)}
              aria-label="Pencereyi kapat"
            >
              ×
            </button>
            <span>ÜYE İŞLEMİ</span>
            <h2 id="member-title">{selectedMember.displayName}</h2>
            <p>{selectedMember.email}</p>
            {selectedMember.status === "active" && <p className="admin-status status-approved">✓ Onaylı üye{selectedMember.approvedAt ? ` · ${formatDate(selectedMember.approvedAt)}` : ""}</p>}
            {selectedMember.status === "pending" && <p className="admin-status status-pending">Onay bekliyor</p>}
            {selectedMember.status === "banned" && <p className="admin-status status-banned">{selectedMember.bannedUntil ? `Geçici uzaklaştırma · ${formatDate(selectedMember.bannedUntil)} tarihine kadar` : "Kalıcı olarak banlı"} · {selectedMember.banReason || "Gerekçe belirtilmedi"}</p>}
            <div className="admin-modal-actions">
              {selectedMember.status !== "active" && <button
                disabled={actionBusy}
                onClick={() =>
                  run(
                    () => setMemberStatus(db!, selectedMember.id, "active", user.uid),
                    "Üye etkinleştirildi.",
                  )
                }
              >
                {selectedMember.status === "banned" ? "Engeli kaldır ve etkinleştir" : "Üyeyi onayla"}
              </button>}
              <button
                disabled={actionBusy || selectedMember.status === "banned"}
                onClick={() =>
                  confirmAction(
                    `${selectedMember.displayName} adlı üyenin erişimi engellenecek. Devam edilsin mi?`,
                    () => banMember(db!, selectedMember.id, banReason, user.uid, banDuration === 'permanent' ? null : Number(banDuration)),
                    banDuration === 'permanent' ? "Üye kalıcı olarak banlandı." : "Üye seçilen süre boyunca uzaklaştırıldı.",
                  )
                }
              >
                {selectedMember.status === "banned" ? "Üye zaten engelli" : "Uzaklaştır / banla"}
              </button>
            </div>
            <label>
              Uzaklaştırma süresi
              <select value={banDuration} onChange={(event) => setBanDuration(event.target.value)} disabled={selectedMember.status === "banned"}>
                <option value="24">24 saat</option>
                <option value="168">7 gün</option>
                <option value="720">30 gün</option>
                <option value="2160">90 gün</option>
                <option value="permanent">Kalıcı ban</option>
              </select>
            </label>
            <label>
              Ban gerekçesi
              <textarea value={banReason} onChange={(event) => setBanReason(event.target.value)} maxLength={240} rows={3} placeholder="Örn. topluluk kurallarına aykırı tekrar eden içerik" />
            </label>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                const numeric = Number(amount.replace(",", "."));
                run(
                  () =>
                    changeMemberValue(
                      db!,
                      user.uid,
                      selectedMember,
                      valueKind,
                      numeric,
                      note,
                    ),
                  valueKind === "balance" ? "Bakiye hareketi kayda alındı." : "Puan hareketi kayda alındı.",
                ).then(() => {
                  setAmount("");
                  setNote("");
                });
              }}
            >
              <h3>Bakiye ve puan hareketi</h3>
              <label>
                İşlem türü
                <select value={valueKind} onChange={(event) => setValueKind(event.target.value as "balance" | "points")}>
                  <option value="balance">Bakiye (TL)</option>
                  <option value="points">Puan</option>
                </select>
              </label>
              <label>
                Tutar (+ ekle, − düş)
                <input
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  placeholder="Örn. 250 veya -100"
                  inputMode="decimal"
                  required
                />
              </label>
              <label>
                Açıklama
                <input
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  placeholder="İşlem nedeni"
                  required
                />
              </label>
              <button className="admin-primary" type="submit" disabled={actionBusy}>
                İşlem defterine kaydet →
              </button>
            </form>
            <div className="admin-permission-list admin-restriction-list">
              <h3>Hesap özelliklerini kısıtla</h3>
              <p>Seçilen özellik güvenlik kurallarında da engellenir; yalnızca düğme gizlenmez.</p>
              {restrictionOptions.map((restriction) => (
                <label key={restriction.key}>
                  <input
                    type="checkbox"
                    checked={selectedMember.restrictions.includes(restriction.key)}
                    disabled={actionBusy}
                    onChange={(event) => {
                      const next = event.target.checked
                        ? [...selectedMember.restrictions, restriction.key]
                        : selectedMember.restrictions.filter((item) => item !== restriction.key);
                      void run(
                        () => setMemberRestrictions(db!, selectedMember.id, next, user.uid),
                        "Üye özellik kısıtları güncellendi.",
                      );
                    }}
                  />
                  <span><strong>{restriction.label}</strong><small>{restriction.detail}</small></span>
                </label>
              ))}
            </div>
            <div className="admin-permission-list">
              <h3>Paylaşım yetkileri</h3>
              {permissions.map((permission) => (
                <label key={permission}>
                  <input
                    type="checkbox"
                    checked={selectedMember.permissions.includes(
                      permission,
                    )}
                    disabled={actionBusy}
                    onChange={(event) => {
                      const next = event.target.checked
                        ? [...selectedMember.permissions, permission]
                        : selectedMember.permissions.filter(
                            (item) => item !== permission,
                          );
                      run(
                        () =>
                          setMemberAccess(
                            db!,
                            selectedMember.id,
                            selectedMember.role,
                            next,
                            user.uid,
                          ),
                        "Paylaşım yetkisi güncellendi.",
                      );
                    }}
                  />
                  {permission}
                </label>
              ))}
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
