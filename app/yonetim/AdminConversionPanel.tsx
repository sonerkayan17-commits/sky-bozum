'use client';

import { collection, limit, onSnapshot, orderBy, query, type Firestore } from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';
import './admin-conversion.css';

type TimedRecord = { id: string; createdAt: Date | null };
type OrderRecord = TimedRecord & { productName: string; packLabel: string; priceMinor: number; userId: string };
type AlertRecord = TimedRecord & { productName: string; packLabel: string; catalogKey: string; userId: string };
type OperationRecord = TimedRecord & { service: string; status: string; payout: number; memberId: string };
type CaseRecord = TimedRecord & { status: string; kind: string; targetType: string };

const WINDOW_LIMIT = 1_000;
const DAY = 86_400_000;

function asDate(value: unknown) {
  if (value && typeof value === 'object' && 'toDate' in value && typeof value.toDate === 'function') return value.toDate();
  return null;
}

function percent(value: number) {
  return `%${new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 1 }).format(value)}`;
}

function money(value: number) {
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(value);
}

function trend(current: number, previous: number) {
  if (!previous) return current ? 'Yeni hareket' : 'Değişim yok';
  const change = ((current - previous) / previous) * 100;
  return `${change >= 0 ? '+' : ''}${new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 0 }).format(change)}%`;
}

function inRange(item: TimedRecord, start: number, end: number) {
  const time = item.createdAt?.getTime() || 0;
  return time >= start && time < end;
}

export default function AdminConversionPanel({ db }: { db: Firestore | null }) {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [alerts, setAlerts] = useState<AlertRecord[]>([]);
  const [operations, setOperations] = useState<OperationRecord[]>([]);
  const [cases, setCases] = useState<CaseRecord[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [reportNow] = useState(() => Date.now());

  useEffect(() => {
    if (!db) return;
    const listen = <T extends TimedRecord>(name: string, map: (id: string, data: Record<string, unknown>) => T, update: (items: T[]) => void) => onSnapshot(
      query(collection(db, name), orderBy('createdAt', 'desc'), limit(WINDOW_LIMIT)),
      (snapshot) => update(snapshot.docs.map((entry) => map(entry.id, entry.data()))),
      () => setErrors((current) => current.includes(name) ? current : [...current, name]),
    );
    const stops = [
      listen<OrderRecord>('productOrders', (id, data) => ({ id, createdAt: asDate(data.createdAt), productName: String(data.productName || 'Dijital ürün'), packLabel: String(data.packLabel || ''), priceMinor: Number(data.priceMinor) || 0, userId: String(data.userId || '') }), setOrders),
      listen<AlertRecord>('stockAlerts', (id, data) => ({ id, createdAt: asDate(data.createdAt), productName: String(data.productName || 'Dijital ürün'), packLabel: String(data.packLabel || ''), catalogKey: String(data.catalogKey || ''), userId: String(data.userId || '') }), setAlerts),
      listen<OperationRecord>('operations', (id, data) => ({ id, createdAt: asDate(data.createdAt), service: String(data.service || 'İşlem'), status: String(data.status || 'new'), payout: Number(data.payout) || 0, memberId: String(data.memberId || '') }), setOperations),
      listen<CaseRecord>('commerceCases', (id, data) => ({ id, createdAt: asDate(data.createdAt), status: String(data.status || 'open'), kind: String(data.kind || ''), targetType: String(data.targetType || '') }), setCases),
    ];
    return () => stops.forEach((stop) => stop());
  }, [db]);

  const report = useMemo(() => {
    const now = reportNow;
    const currentStart = now - (30 * DAY);
    const previousStart = now - (60 * DAY);
    const currentOrders = orders.filter((item) => inRange(item, currentStart, now));
    const previousOrders = orders.filter((item) => inRange(item, previousStart, currentStart));
    const currentAlerts = alerts.filter((item) => inRange(item, currentStart, now));
    const previousAlerts = alerts.filter((item) => inRange(item, previousStart, currentStart));
    const currentOperations = operations.filter((item) => inRange(item, currentStart, now));
    const previousOperations = operations.filter((item) => inRange(item, previousStart, currentStart));
    const currentCases = cases.filter((item) => inRange(item, currentStart, now));
    const completedOperations = currentOperations.filter((item) => item.status === 'completed');
    const previousCompleted = previousOperations.filter((item) => item.status === 'completed');
    const demand = new Map<string, { label: string; alerts: number; orders: number }>();
    currentAlerts.forEach((item) => {
      const key = item.catalogKey || `${item.productName}-${item.packLabel}`;
      const entry = demand.get(key) || { label: [item.productName, item.packLabel].filter(Boolean).join(' · '), alerts: 0, orders: 0 };
      entry.alerts += 1; demand.set(key, entry);
    });
    currentOrders.forEach((item) => {
      const key = `${item.productName}-${item.packLabel}`;
      const existing = [...demand.entries()].find(([, value]) => value.label === [item.productName, item.packLabel].filter(Boolean).join(' · '));
      const entryKey = existing?.[0] || key;
      const entry = existing?.[1] || { label: [item.productName, item.packLabel].filter(Boolean).join(' · '), alerts: 0, orders: 0 };
      entry.orders += 1; demand.set(entryKey, entry);
    });
    return {
      currentOrders, currentAlerts, currentOperations, currentCases, completedOperations,
      revenue: currentOrders.reduce((sum, item) => sum + item.priceMinor, 0) / 100,
      payout: completedOperations.reduce((sum, item) => sum + item.payout, 0),
      purchaseRate: currentAlerts.length ? (currentOrders.length / currentAlerts.length) * 100 : 0,
      operationRate: currentOperations.length ? (completedOperations.length / currentOperations.length) * 100 : 0,
      issueRate: currentOrders.length + currentOperations.length ? (currentCases.length / (currentOrders.length + currentOperations.length)) * 100 : 0,
      uniqueMembers: new Set([...currentOrders.map((item) => item.userId), ...currentAlerts.map((item) => item.userId), ...currentOperations.map((item) => item.memberId)].filter(Boolean)).size,
      orderTrend: trend(currentOrders.length, previousOrders.length),
      alertTrend: trend(currentAlerts.length, previousAlerts.length),
      operationTrend: trend(currentOperations.length, previousOperations.length),
      completedTrend: trend(completedOperations.length, previousCompleted.length),
      demand: [...demand.values()].sort((a, b) => (b.alerts + b.orders) - (a.alerts + a.orders)).slice(0, 6),
    };
  }, [alerts, cases, operations, orders, reportNow]);

  return <section className="admin-section admin-conversion">
    <div className="admin-section-head"><div><span>GERÇEK DÖNÜŞÜM ANALİTİĞİ</span><h2>Talep, satış ve sonuç</h2></div><p>Son 30 gün; yalnız gerçek stok talebi, sipariş, işlem ve inceleme kayıtlarından hesaplanır. Kişisel bilgi ve teslim edilen kod gösterilmez.</p></div>
    {errors.length ? <p className="admin-notice">Bazı veri kaynakları okunamadı: {errors.join(', ')}. Yetki veya bağlantıyı kontrol edin.</p> : null}
    <div className="admin-conversion__metrics">
      <article><span>STOK TALEBİ</span><strong>{report.currentAlerts.length}</strong><small>Önceki döneme göre {report.alertTrend}</small></article>
      <article><span>TESLİM EDİLEN SİPARİŞ</span><strong>{report.currentOrders.length}</strong><small>Önceki döneme göre {report.orderTrend}</small></article>
      <article><span>İŞLEM TALEBİ</span><strong>{report.currentOperations.length}</strong><small>Önceki döneme göre {report.operationTrend}</small></article>
      <article><span>TAMAMLANAN İŞLEM</span><strong>{report.completedOperations.length}</strong><small>Önceki döneme göre {report.completedTrend}</small></article>
    </div>
    <div className="admin-conversion__funnels">
      <article><header><div><span>ÜRÜN HUNİSİ</span><h3>Talep → dijital teslimat</h3></div><b>{percent(report.purchaseRate)}</b></header><div className="admin-conversion__bar"><i style={{ width: `${Math.min(100, report.purchaseRate)}%` }} /></div><p>{report.currentAlerts.length} stok talebine karşılık {report.currentOrders.length} güvenli sipariş teslim edildi.</p></article>
      <article><header><div><span>İŞLEM HUNİSİ</span><h3>Talep → tamamlanan ödeme</h3></div><b>{percent(report.operationRate)}</b></header><div className="admin-conversion__bar is-gold"><i style={{ width: `${Math.min(100, report.operationRate)}%` }} /></div><p>{report.currentOperations.length} işlem talebinin {report.completedOperations.length} tanesi tamamlandı.</p></article>
    </div>
    <div className="admin-conversion__split">
      <article><header><span>TALEP HARİTASI</span><h3>En çok ilgi gören paketler</h3></header>{report.demand.length ? <ol>{report.demand.map((item) => <li key={item.label}><strong>{item.label}</strong><span>{item.alerts} bildirim · {item.orders} sipariş</span></li>)}</ol> : <p>Son 30 günde ürün talebi oluşmadı.</p>}</article>
      <article className="admin-conversion__health"><header><span>İŞ SAĞLIĞI</span><h3>Finans ve satış sonrası</h3></header><dl><div><dt>Dijital satış hacmi</dt><dd>{money(report.revenue)}</dd></div><div><dt>Tamamlanan işlem ödemesi</dt><dd>{money(report.payout)}</dd></div><div><dt>İnceleme kaydı oranı</dt><dd>{percent(report.issueRate)}</dd></div><div><dt>Hareket üreten tekil üye</dt><dd>{report.uniqueMembers}</dd></div></dl><small>Bu özet muhasebe belgesi değildir; operasyon karar desteğidir.</small></article>
    </div>
  </section>;
}
