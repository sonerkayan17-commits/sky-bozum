# Sky Bozum Yönetim Merkezi kurulumu

`/yonetim` yalnız Firebase Authentication ile oturum açan ve Firebase özel yetkisinde `admin: true` bulunan kullanıcıları yönetim verilerine ulaştırır.

1. Firebase Authentication bölümünde **E-posta/Parola** sağlayıcısını açın ve ilk yönetici hesabını oluşturun.
2. Güvenilir bir Firebase Admin SDK ortamında bu hesaba `admin: true` özel yetkisini tanımlayın. Bu yetki tarayıcı koduna veya Firestore belgesine yazılmaz.
3. Güncellenmiş `firestore.rules` dosyasını Firebase'e dağıtın.
4. Yönetilecek her hesabı `members/{firebaseUid}` belgesi olarak oluşturun. Önerilen alanlar: `displayName`, `email`, `role`, `status`, `balance`, `points`, `permissions`, `createdAt`.

Parolalar yönetim panelinde asla gösterilmez, saklanmaz veya elle onaylanmaz. Yönetici yalnız güvenli parola sıfırlama bağlantısı başlatabilir. Bakiye ve puan değişiklikleri, değiştirilemeyen `memberLedger` işlem defterine kaydedilir.
