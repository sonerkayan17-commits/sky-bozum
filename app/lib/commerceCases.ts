export type CommerceCaseTarget = 'operation' | 'order';
export type CommerceCaseKind = 'cancellation' | 'delivery_issue' | 'invalid_code' | 'payment_issue';
export type CommerceCaseStatus = 'open' | 'reviewing' | 'resolved' | 'rejected';

export type CommerceCase = {
  id: string;
  memberId: string;
  targetType: CommerceCaseTarget;
  targetId: string;
  kind: CommerceCaseKind;
  reason: string;
  status: CommerceCaseStatus;
  resolution: string;
  createdAt: Date | null;
  updatedAt: Date | null;
};

export const commerceCaseKindLabels: Record<CommerceCaseKind, string> = {
  cancellation: 'İptal incelemesi',
  delivery_issue: 'Teslimat sorunu',
  invalid_code: 'Kod kullanım sorunu',
  payment_issue: 'Ödeme sorunu',
};

export const commerceCaseStatusLabels: Record<CommerceCaseStatus, string> = {
  open: 'İnceleme bekliyor',
  reviewing: 'İnceleniyor',
  resolved: 'Çözüldü',
  rejected: 'Uygun bulunmadı',
};

export function commerceCaseId(memberId: string, targetType: CommerceCaseTarget, targetId: string, kind: CommerceCaseKind) {
  return `${memberId}_${targetType}_${targetId}_${kind}`.replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 240);
}
