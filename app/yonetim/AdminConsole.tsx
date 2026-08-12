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
import RichArticleEditor from "./RichArticleEditor";
import { articles } from "../lib/site";
import {
  removeManagedArticle,
  saveManagedArticle,
  seedArticleForEditing,
  setArticleStatus,
  type ContentArticleDraft,
} from "../lib/contentAdmin";
import {
  changeMemberValue,
  moderateComment,
  removeComment,
  setMemberAccess,
  setMemberStatus,
  subscribeToContentAudit,
  subscribeToMembers,
  subscribeToModerationQueue,
  type AdminComment,
  type AdminMember,
  type ContentAuditEvent,
  type MemberRole,
} from "../lib/admin";

type View = "overview" | "members" | "moderation" | "access" | "content";
type ManagedArticleRecord = ContentArticleDraft & { id: string };
const permissions = [
  "Yorum paylaşımı",
  "İçerik taslağı",
  "Yayınlama",
  "Özel kampanyalar",
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

export default function AdminConsole({
  articleCount,
  rateCount,
}: {
  articleCount: number;
  rateCount: number;
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
  const [managedArticles, setManagedArticles] = useState<ManagedArticleRecord[]>([]);
  const [contentQuery, setContentQuery] = useState("");
  const [contentStatus, setContentStatus] = useState<"all" | ContentArticleDraft["status"]>("all");
  const [selectedMember, setSelectedMember] = useState<AdminMember | null>(
    null,
  );
  const [editingArticle, setEditingArticle] =
    useState<ContentArticleDraft | null>(null);
  const [amount, setAmount] = useState("");
  const [valueKind, setValueKind] = useState<"balance" | "points">("balance");
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [clientReady, setClientReady] = useState(false);
  const auth = firebaseClient.auth;
  const db = firebaseClient.db;

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
    return () => {
      stopMembers();
      stopComments();
      stopContentAudit();
    };
  }, [isAdmin]);

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

  const pendingComments = useMemo(
    () => comments.filter((comment) => comment.status === "pending"),
    [comments],
  );
  const activeMembers = useMemo(
    () => members.filter((member) => member.status === "active"),
    [members],
  );
  const customArticles = useMemo(
    () =>
      managedArticles.filter(
        (article) => !articles.some((siteArticle) => siteArticle.slug === article.slug),
      ),
    [managedArticles],
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
    setError("");
    setMessage("");
    try {
      await action();
      setMessage(success);
    } catch (nextError) {
      setError(
        nextError instanceof Error ? nextError.message : "İşlem tamamlanamadı.",
      );
    }
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
          {(
            [
              ["overview", "Genel bakış"],
              ["content", "İçerik"],
              ["members", "Üyeler"],
              ["moderation", "Yorumlar"],
              ["access", "Yetkiler"],
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
              {contentAudit.length === 0 ? <p>Henüz içerik işlemi kaydı yok.</p> : <ol>{contentAudit.map((event) => <li key={event.id}><b>{event.articleSlug}</b><span>{event.action}</span><small>{formatDate(event.createdAt)}</small></li>)}</ol>}
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
              <span>{articles.length + customArticles.length} içerik kaydı</span>
            </div>
            <div className="admin-content-list">
              {articles.filter((article) => {
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
                        run(
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
                    <button className="admin-danger" onClick={() => run(() => removeManagedArticle(db!, article.slug, user.uid), "Makale silindi.")}>Sil</button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
        {view === "members" && (
          <section className="admin-section">
            <div className="admin-section-head">
              <div>
                <span>ÜYE KAYITLARI</span>
                <h2>Hesap, durum ve bakiye</h2>
              </div>
              <p>Ban, onay ve bakiye hareketleri kullanıcı kaydına işlenir.</p>
            </div>
            <div className="admin-table">
              {members.length === 0 ? (
                <p className="admin-empty">
                  Henüz yönetilebilir üye kaydı yok. Yeni üyeler{" "}
                  <code>members</code> koleksiyonuna güvenli kayıt akışıyla
                  düşer.
                </p>
              ) : (
                members.map((member) => (
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
                    <button onClick={() => setSelectedMember(member)}>
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
            <div className="admin-comments">
              {comments.length === 0 ? (
                <p className="admin-empty">İncelenecek yorum bulunmuyor.</p>
              ) : (
                comments.map((comment) => (
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
                          run(
                            () => removeComment(db!, comment.id),
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
                members.map((member) => (
                  <article key={member.id}>
                    <div>
                      <strong>{member.displayName}</strong>
                      <span>{member.email}</span>
                    </div>
                    <select
                      aria-label={`${member.displayName} rolü`}
                      defaultValue={
                        member.role === "admin" ? "moderator" : member.role
                      }
                      onChange={(event) =>
                        run(
                          () =>
                            setMemberAccess(
                              db!,
                              member.id,
                              event.target.value as MemberRole,
                              member.permissions,
                            ),
                          "Rol güncellendi.",
                        )
                      }
                    >
                      <option value="member">Üye</option>
                      <option value="editor">İçerik editörü</option>
                      <option value="publisher">Yayın yetkisi</option>
                      <option value="moderator">Moderatör</option>
                    </select>
                    <p>
                      {member.permissions.length
                        ? member.permissions.join(" · ")
                        : "Ek paylaşım yetkisi yok"}
                    </p>
                  </article>
                ))
              )}
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
                Kapak görsel yolu
                <input
                  value={editingArticle.cover}
                  onChange={(event) =>
                    setEditingArticle({
                      ...editingArticle,
                      cover: event.target.value,
                    })
                  }
                  placeholder="/images/..."
                />
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
            <div className="admin-modal-actions">
              <button
                onClick={() =>
                  run(
                    () => setMemberStatus(db!, selectedMember.id, "active"),
                    "Üye etkinleştirildi.",
                  )
                }
              >
                Üyeyi onayla
              </button>
              <button
                onClick={() =>
                  run(
                    () => setMemberStatus(db!, selectedMember.id, "banned"),
                    "Üye banlandı.",
                  )
                }
              >
                Üyeyi banla
              </button>
            </div>
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
              <button className="admin-primary" type="submit">
                İşlem defterine kaydet →
              </button>
            </form>
            <div className="admin-permission-list">
              <h3>Paylaşım yetkileri</h3>
              {permissions.map((permission) => (
                <label key={permission}>
                  <input
                    type="checkbox"
                    defaultChecked={selectedMember.permissions.includes(
                      permission,
                    )}
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
