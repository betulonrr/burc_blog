# Zodya — Burçların Gizemi

Zodya, astroloji bilgilerini modern web teknolojileri ve AI analitiği ile harmanlayan bir astroloji platformudur. Diğer astroloji bloglarından esinlenerek, AI tarafından optimize edilmiş içerik sunan ve uçtan uca geliştirilmiş bir veritabanlı projedir.

##  Özellikler

- **Dinamik Burç Kartları:** 12 burç için element bazlı renk kodlaması, hover efektleri ve detay modallarına yer verildi.
- **AI Destekli Günlük Yorumlar:** MSSQL üzerinde kurgulanan mantıkla, haftanın her gününe özel otomatik değişen dinamik içerik sunuldu.
- **İstatistiksel Veri Görselleştirme:** Aşk, Para ve Sağlık durumları için özel "Metre Bar" grafikleri.
- **Uyum Hesaplayıcı:** İki burç arasındaki element uyumunu hesaplama.
- **Yükselen Burç Motoru:** Doğum saati ve tarih algoritması ile hassas yükselen burç tespiti.
- **Premium UI Deneyimi:** Yıldızlı gökyüzü arka planı, özel imleç ve akıcı scroll animasyonları kullanıldı.

##  Teknolojiler & Mimari

**Frontend** HTML5, CSS3 (BEM Metodolojisi), Vanilla JavaScript 
**Backend**  Node.js, Express.js 
**Veritabanı**  Microsoft SQL Server (MSSQL), T-SQL 
**Tasarım**  Google Fonts (Cinzel, Crimson Pro), SVG Animations 
**Yapay Zeka**  İçerik üretimi ve veri şeması optimizasyonunda AI desteği kullanılmıştır. 

##  Veritabanı ve API Yapısı

Proje, ilişkisel veritabanı şeması (`ZODYA_DB`) üzerine inşa edilmiştir:
- **Views:** Frontend tarafında performanslı veri çekimi için `vw_BugununYorumlari` görünümü kullanıldı.
- **Constraints:** Puanlama sisteminde veri bütünlüğünü korumak için `CHECK` kısıtlamaları ve `UNIQUE` anahtarlar uygulandı.
- **Middleware:** Hata yönetimi (Error Handling) ve veri güvenliği için özelleştirilmiş ara yazılımlar kullanıldı.

## Kurulum

### 1. Veritabanı Hazırlığı
SQL Server Management Studio (SSMS) üzerinde aşağıdaki scriptleri sırasıyla çalıştırın:
1. `backend/db/schema.sql` (Tablo yapıları ve View'lar)
2. `backend/db/yorum_stogu.sql` (AI tarafından hazırlanan örnek veri seti)

### 2. Backend Kurulumu
```bash
cd backend
npm install
# .env dosyasını oluşturun ve MSSQL bağlantı bilgilerinizi girin
node server.js




  




