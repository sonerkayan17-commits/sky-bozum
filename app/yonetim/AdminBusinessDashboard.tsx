'use client';

import { collection, limit, onSnapshot, orderBy, query, type Firestore } from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';
import { formatStoreMoney, type StoreCatalogEntry } from '../lib/store';
import type { AdminMember, ContentAuditEvent, MemberLedgerEvent } from '../lib/admin';

type DashboardView = 'inventory' | 'operations' | 'members' | 'audit' | 'cases';
type OrderRecord = {
  id: string;
  productName: string;
  packLabel: string;
  userEmail: string;
  priceMinor: number;
  status: string;
  createdAt: Date | null;
};
type OperationRecord = { id: string; service: string; status: string; payout: number; memberId: string; createdAt: Date | null };

function asDate(value: unknown) {
  if (value && typeof value === 'object' && 'toDate' in value && typeof (value as { toDate?: unknown }).toDate === 'function') {
    return (value as { toDate: () => Date }).toDate();
  }
  const parsed = value ? new Date(String(value)) : null;
  return parsed && !Number.isNaN(parsed.getTime()) ? parsed : null;
}

function dateTime(value: Date | null) {
  return value ? value.toLocaleString('tr-TR', { dateStyle: 'short', timeStyle: 'short' }) : '—';
}

function orderStatus(value: string) {
  const labels: Record<string, string> = { delivered: 'Teslim edildi', pending: 'Bekliyor', processing: 'Hazırlanıyor', cancelled: 'İptal', failed: 'Başarısız', refunded: 'İade edildi' };
  return labels[value] || value || 'Durum yok';
}

function memberName(id: string, members: AdminMember[]) {
  return members.find((item) => item.id === id)?.displayName || id || 'Bilinmeyen üye';
}

export default function AdminBusinessDashboard({
  db,
  members,
  memberLedger,
  contentAudit,
  pendingComments,
  onNavigate,
}: {
  db: Firestore | null;
  members: AdminMember[];
  memberLedger: MemberLedgerEvent[];
  contentAudit: ContentAuditEvent[];
  pendingComments: number;
  onNavigate: (view: DashboardView) => void;
}) {
  const [catalog, setCatalog] = useState<StoreCatalogEntry[]>([]);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [operations, setOperations] = useState<OperationRecord[]>([]);
  const [notice, setNotice] = useState('');
  const [reportNow] = useState(() => Date.now());

  useEffect(() => {
    if (!db) return;
    const fail = (reason: Error) => setNotice(`Canlı işletme verisi okunamadı: ${reason.message}`);
    const stopCatalog = onSnapshot(collection(db, 'productCatalog'), (snapshot) => setCatalog(snapshot.docs.map((entry) => {
      const data = entry.data();
      return {
        key: entry.id,
        productSlug: String(data.productSlug || ''),
        productName: String(data.productName || 'Dijital ürün'),
        packId: String(data.packId || ''),
        packLabel: String(data.packLabel || ''),
        priceMinor: Number.isSafeInteger(Number(data.priceMinor)) ? Number(data.priceMinor) : null,
        stockCount: Math.max(0, Math.trunc(Number(data.stockCount) || 0)),
        active: data.active === true,
      };
    })), fail);
    const stopOrders = onSnapshot(query(collection(db, 'productOrders'), orderBy('createdAt', 'desc'), limit(200)), (snapshot) => setOrders(snapshot.docs.map((entry) => {
      const data = entry.data();
      return { id: entry.id, productName: String(data.productName || 'Dijital ürün'), packLabel: String(data.packLabel || ''), userEmail: String(data.userEmail || data.userId || ''), priceMinor: Math.max(0, Math.trunc(Number(data.priceMinor) || 0)), status: String(data.status || 'pending'), createdAt: asDate(data.createdAt) };
    })), fail);
    const stopOperations = onSnapshot(query(collection(db, 'operations'), orderBy('createdAt', 'desc'), limit(100)), (snapshot) => setOperations(snapshot.docs.map((entry) => {
      const data = entry.data();
      return { id: entry.id, service: String(data.service || 'İşlem'), status: String(data.status || 'new'), payout: Number(data.payout) || 0, memberId: String(data.memberId || ''), createdAt: asDate(data.createdAt) };
    })), fail);
    return () => { stopCatalog(); stopOrders(); stopOperations(); };
  }, [db]);

  const report = useMemo(() => {
    const now = reportNow;
    const startToday = new Date(reportNow); startToday.setHours(0, 0, 0, 0);
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
    const delivered = orders.filter((item) => item.status === 'delivered');
    const today = delivered.filter((item) => (item.createdAt?.getTime() || 0) >= startToday.getTime());
    const week = delivered.filter((item) => (item.createdAt?.getTime() || 0) >= sevenDaysAgo);
    const productSales = new Map<string, { label: string; count: number; revenue: number }>();
    delivered.forEach((item) => {
      const label = [item.productName, item.packLabel].filter(Boolean).join(' · ');
      const current = productSales.get(label) || { label, count: 0, revenue: 0 };
      current.count += 1; current.revenue += item.priceMinor; productSales.set(label, current);
    });
    const availableStock = catalog.filter((item) => item.active).reduce((total, item) => total + item.stockCount, 0);
    const lowStock = catalog.filter((item) => item.active && item.stockCount > 0 && item.stockCount <= 3);
    const outOfStock = catalog.filter((item) => item.active && item.stockCount === 0);
    return {
      todayCount: today.length,
      todayRevenue: today.reduce((total, item) => total + item.priceMinor, 0),
      weekCount: week.length,
      weekRevenue: week.reduce((total, item) => total + item.priceMinor, 0),
      availableStock,
      lowStock,
      outOfStock,
      pendingOrders: orders.filter((item) => !['delivered', 'cancelled', 'failed', 'refunded'].includes(item.status)).length,
      openOperations: operations.filter((item) => !['completed', 'cancelled', 'rejected'].includes(item.status)).length,
      topProducts: [...productSales.values()].sort((a, b) => b.count - a.count || b.revenue - a.revenue).slice(0, 5),
    };
  }, [catalog, operations, orders, reportNow]);

  const memberLogs = useMemo(() => {
    const ledger = memberLedger.map((item) => ({ id: `ledger-${item.id}`, at: item.createdAt, title: memberName(item.memberId, members), detail: item.note, value: `${item.amount >= 0 ? '+' : ''}${item.amount.toLocaleString('tr-TR')} ${item.kind === 'balance' ? 'TL' : 'puan'}` }));
    const audit = contentAudit.filter((item) => item.action.startsWith('member-')).map((item) => ({ id: `audit-${item.id}`, at: item.createdAt, title: memberName(item.articleSlug, members), detail: item.action.replaceAll(':', ' · '), value: 'Üye işlemi' }));
    return [...ledger, ...audit].sort((a, b) => (b.at?.getTime() || 0) - (a.at?.getTime() || 0)).slice(0, 8);
  }, [contentAudit, memberLedger, members]);

  return <section className="business-dashboard">
    <header className="business-dashboard-head">
      <div><span>CANLI İŞLETME MERKEZİ</span><h2>Satış, stok ve üye hareketleri</h2><p>Gösterilen tüm rakamlar Firestore kayıtlarından anlık hesaplanır; örnek veya tahmini veri kullanılmaz.</p></div>
      <button className="admin-primary" onClick={() => onNavigate('inventory')}>Stok yönetimine git →</button>
    </header>

    {notice ? <p className="admin-notice admin-error" role="alert">{notice}</p> : null}

    <div className="business-kpis" aria-label="Satış ve stok özeti">
      <article><span>BUGÜN TESLİM EDİLEN</span><strong>{formatStoreMoney(report.todayRevenue)}</strong><small>{report.todayCount} sipariş</small></article>
      <article><span>SON 7 GÜN</span><strong>{formatStoreMoney(report.weekRevenue)}</strong><small>{report.weekCount} teslimat</small></article>
      <article className={report.pendingOrders ? 'is-warning' : ''}><span>BEKLEYEN SİPARİŞ</span><strong>{report.pendingOrders}</strong><small>işlem gerektiren kayıt</small></article>
      <article className={report.outOfStock.length ? 'is-danger' : ''}><span>STOKTAKİ KOD</span><strong>{report.availableStock}</strong><small>{report.outOfStock.length} paket tükendi</small></article>
      <article className={report.openOperations ? 'is-warning' : ''}><span>AÇIK İŞLEM</span><strong>{report.openOperations}</strong><small>sonuçlandırılmayı bekliyor</small></article>
      <article className={pendingComments ? 'is-warning' : ''}><span>MODERASYON</span><strong>{pendingComments}</strong><small>bekleyen yorum</small></article>
    </div>

    <div className="business-grid">
      <section className="business-panel">
        <header><div><span>SON SİPARİŞLER</span><h3>Satış ve teslimatlar</h3></div><button onClick={() => onNavigate('inventory')}>Tümünü aç →</button></header>
        <div className="business-table">
          {orders.length ? orders.slice(0, 8).map((item) => <article key={item.id}><div><strong>{item.productName}</strong><small>{item.packLabel} · {item.userEmail}</small></div><b>{formatStoreMoney(item.priceMinor)}</b><em className={`order-${item.status}`}>{orderStatus(item.status)}</em><time>{dateTime(item.createdAt)}</time></article>) : <p className="admin-empty">Henüz ürün siparişi bulunmuyor.</p>}
        </div>
      </section>

      <section className="business-panel stock-health">
        <header><div><span>STOK SAĞLIĞI</span><h3>Kritik paketler</h3></div><button onClick={() => onNavigate('inventory')}>Stok ekle →</button></header>
        {[...report.outOfStock, ...report.lowStock].length ? <div>{[...report.outOfStock, ...report.lowStock].slice(0, 8).map((item) => <article key={item.key}><div><strong>{item.productName}</strong><small>{item.packLabel}</small></div><b className={item.stockCount === 0 ? 'is-empty' : ''}>{item.stockCount} kod</b></article>)}</div> : <p className="admin-empty">Satışa açık paketlerde kritik stok bulunmuyor.</p>}
      </section>

      <section className="business-panel">
        <header><div><span>ÜRÜN ANALİZİ</span><h3>En çok satılanlar</h3></div><button onClick={() => onNavigate('inventory')}>Kataloğu aç →</button></header>
        {report.topProducts.length ? <ol className="business-ranking">{report.topProducts.map((item, index) => <li key={item.label}><i>{String(index + 1).padStart(2, '0')}</i><div><strong>{item.label}</strong><small>{item.count} teslimat</small></div><b>{formatStoreMoney(item.revenue)}</b></li>)}</ol> : <p className="admin-empty">Ürün analizi için teslim edilmiş sipariş bekleniyor.</p>}
      </section>

      <section className="business-panel">
        <header><div><span>ÜYE LOGLARI</span><h3>Son hesap hareketleri</h3></div><button onClick={() => onNavigate('audit')}>Tüm logları aç →</button></header>
        <div className="member-log-list">{memberLogs.length ? memberLogs.map((item) => <article key={item.id}><div><strong>{item.title}</strong><small>{item.detail}</small></div><b>{item.value}</b><time>{dateTime(item.at)}</time></article>) : <p className="admin-empty">Henüz üye hareket kaydı bulunmuyor.</p>}</div>
      </section>
    </div>
  </section>;
}
