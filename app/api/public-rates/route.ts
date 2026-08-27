type FirestoreNumber = {
  integerValue?: string;
  doubleValue?: number;
};

type FirestoreDocument = {
  name?: string;
  fields?: {
    rate?: FirestoreNumber;
    maxRate?: FirestoreNumber;
  };
};

type FirestoreQueryRow = {
  document?: FirestoreDocument;
};

const RESPONSE_HEADERS = {
  'Cache-Control': 'public, max-age=15, s-maxage=30, stale-while-revalidate=300',
};

function readNumber(field?: FirestoreNumber) {
  const value = field?.doubleValue ?? field?.integerValue;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

export async function GET() {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim();
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.trim();

  if (!projectId || !apiKey) {
    return Response.json({ rates: {} }, { headers: RESPONSE_HEADERS });
  }

  try {
    const response = await fetch(
      `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(projectId)}/databases/(default)/documents:runQuery?key=${encodeURIComponent(apiKey)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          structuredQuery: {
            from: [{ collectionId: 'rateOverrides' }],
            where: {
              fieldFilter: {
                field: { fieldPath: 'status' },
                op: 'EQUAL',
                value: { stringValue: 'published' },
              },
            },
          },
        }),
        next: { revalidate: 30 },
      },
    );

    if (!response.ok) {
      throw new Error(`Firestore public rates request failed: ${response.status}`);
    }

    const rows = await response.json() as FirestoreQueryRow[];
    const rates: Record<string, { rate: number; maxRate: number }> = {};

    rows.forEach(({ document }) => {
      if (!document?.name || !document.fields) return;
      const id = document.name.split('/').pop();
      const rate = readNumber(document.fields.rate);
      const maxRate = readNumber(document.fields.maxRate);
      if (!id || rate === null || maxRate === null || rate <= 0 || maxRate < rate || maxRate > 100) return;
      rates[id] = { rate, maxRate };
    });

    return Response.json({ rates }, { headers: RESPONSE_HEADERS });
  } catch {
    // Canlı kaynak geçici olarak kullanılamazsa istemci kodda doğrulanmış
    // statik oranları kullanmaya devam eder; ziyaretçi sayfası hata vermez.
    return Response.json({ rates: {} }, { headers: RESPONSE_HEADERS });
  }
}
