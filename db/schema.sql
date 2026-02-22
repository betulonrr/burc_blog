


USE ZODYA_DB;
GO

--  TABLO: Burclar 
IF OBJECT_ID('dbo.Burclar', 'U') IS NOT NULL DROP TABLE dbo.Burclar;

CREATE TABLE dbo.Burclar (
    Id          INT IDENTITY(1,1) PRIMARY KEY,
    Ad          NVARCHAR(50)  NOT NULL,
    Sembol      NVARCHAR(5)   NOT NULL,
    TarihBasl   NVARCHAR(20)  NOT NULL,   -- örn: "21 Mar"
    TarihBitis  NVARCHAR(20)  NOT NULL,   -- örn: "19 Nis"
    TarihAralik NVARCHAR(50)  NOT NULL,   -- örn: "21 Mar – 19 Nis"
    Element     NVARCHAR(20)  NOT NULL,   -- Ateş / Toprak / Hava / Su
    ElementKey  NVARCHAR(10)  NOT NULL,   -- ates / toprak / hava / su
    Modalite    NVARCHAR(20)  NOT NULL,   -- Öncü / Sabit / Değişken
    YoneticiGez NVARCHAR(50)  NOT NULL,
    Aciklama    NVARCHAR(MAX) NOT NULL,
    GucluOz     NVARCHAR(MAX) NOT NULL,   -- virgülle ayrılmış liste
    GelistirOz  NVARCHAR(MAX) NOT NULL,   -- virgülle ayrılmış liste
    UyumluBurc  NVARCHAR(MAX) NOT NULL,   -- virgülle ayrılmış liste
    OlusturmaTar DATETIME     DEFAULT GETDATE()
);
GO

--  TABLO: GunlukYorumlar
IF OBJECT_ID('dbo.GunlukYorumlar', 'U') IS NOT NULL DROP TABLE dbo.GunlukYorumlar;

CREATE TABLE dbo.GunlukYorumlar (
    Id          INT IDENTITY(1,1) PRIMARY KEY,
    BurcId      INT           NOT NULL FOREIGN KEY REFERENCES dbo.Burclar(Id),
    Tarih       DATE          NOT NULL DEFAULT CAST(GETDATE() AS DATE),
    Yorum       NVARCHAR(MAX) NOT NULL,
    AskPuan     TINYINT       NOT NULL CHECK (AskPuan BETWEEN 0 AND 100),
    ParaPuan    TINYINT       NOT NULL CHECK (ParaPuan BETWEEN 0 AND 100),
    SaglikPuan  TINYINT       NOT NULL CHECK (SaglikPuan BETWEEN 0 AND 100),
    OlusturmaTar DATETIME     DEFAULT GETDATE(),
    CONSTRAINT UQ_BurcTarih UNIQUE (BurcId, Tarih)
);
GO

--  TABLO: UyumTablosu 
IF OBJECT_ID('dbo.UyumTablosu', 'U') IS NOT NULL DROP TABLE dbo.UyumTablosu;

CREATE TABLE dbo.UyumTablosu (
    Id          INT IDENTITY(1,1) PRIMARY KEY,
    Element1    NVARCHAR(10)  NOT NULL,
    Element2    NVARCHAR(10)  NOT NULL,
    Puan        TINYINT       NOT NULL CHECK (Puan BETWEEN 0 AND 100),
    Baslik      NVARCHAR(100) NOT NULL,
    Aciklama    NVARCHAR(MAX) NOT NULL,
    CONSTRAINT UQ_ElementCift UNIQUE (Element1, Element2)
);
GO

--  SEED: Burçlar
INSERT INTO dbo.Burclar (Ad, Sembol, TarihBasl, TarihBitis, TarihAralik, Element, ElementKey, Modalite, YoneticiGez, Aciklama, GucluOz, GelistirOz, UyumluBurc)
VALUES
('Koç',     '♈', '21 Mar', '19 Nis', '21 Mar – 19 Nis', 'Ateş',   'ates',   'Öncü',     'Mars',           N'Koç, zodiakın öncüsü, cesaret ve tutkuyla dolu ateşli bir ruhtur. Doğuştan lider olan Koçlar, hayatın her alanında ilk olmayı sever.',                                               N'Cesur,Kararlı,Enerjik,Özgüvenli,Tutkulu',                N'Sabırsız,Dürtüsel,İnatçı,Bencil',                        N'Aslan,Yay,İkizler,Kova'),
('Boğa',    '♉', '20 Nis', '20 May', '20 Nis – 20 May', 'Toprak', 'toprak', 'Sabit',    'Venüs',          N'Boğa, güzelliğin ve konforun efendisidir. Venüs''ün yönetiminde, duyusal zevklere düşkün ve güvenilirliğiyle öne çıkar.',                                                           N'Güvenilir,Sabırlı,Pratik,İstikrarlı,Sadık',              N'İnatçı,Maddeci,Tembel,Değişime dirençli',                N'Başak,Oğlak,Yengeç,Balık'),
('İkizler', '♊', '21 May', '20 Haz', '21 May – 20 Haz', 'Hava',   'hava',   'Değişken', 'Merkür',         N'İkizler, zekanın ve merakın burcu. Her konuya duyduğu derin merak ve iletişim yetenekleriyle öne çıkar.',                                                                             N'Zeki,Uyumlu,Meraklı,Esprili,İletişimci',                 N'Değişken,Yüzeysel,Tutarsız,Endişeli',                    N'Terazi,Kova,Koç,Aslan'),
('Yengeç',  '♋', '21 Haz', '22 Tem', '21 Haz – 22 Tem', 'Su',     'su',     'Öncü',     'Ay',             N'Yengeç, Ay''ın yönetiminde hassas ve koruyucu bir ruhtur. Aile ve evcilliğe bağlılığı, derin sezgileri ve güçlü duyguları ile tanınır.',                                            N'Hassas,Koruyucu,Sadık,Sezgisel,Şefkatli',                N'Aşırı duygusal,Kıskançlık,İçine kapanık,Değişken',       N'Akrep,Balık,Boğa,Başak'),
('Aslan',   '♌', '23 Tem', '22 Ağu', '23 Tem – 22 Ağu', 'Ateş',   'ates',   'Sabit',    'Güneş',          N'Aslan, Güneş''in çocuğu; karizması, yaratıcılığı ve liderlik ruhuyla her ortamda parlar. Sahneyi seven, kalpleri fetheden bir burç.',                                              N'Karizmatik,Yaratıcı,Cömert,Sadık,Cesur',                 N'Kibirli,Dikkat ihtiyacı,Dominant,İnatçı',                N'Koç,Yay,İkizler,Terazi'),
('Başak',   '♍', '23 Ağu', '22 Eyl', '23 Ağu – 22 Eyl', 'Toprak', 'toprak', 'Değişken', 'Merkür',         N'Başak, analitik zekanın ve mükemmeliyetçiliğin temsilcisidir. Detaylara olan ilgisi ve pratik zekasıyla öne çıkar.',                                                                  N'Analitik,Güvenilir,Dikkatli,Pratik,Yardımsever',         N'Aşırı eleştirici,Endişeli,Katı,Mükemmeliyetçi',         N'Boğa,Oğlak,Yengeç,Akrep'),
('Terazi',  '♎', '23 Eyl', '22 Eki', '23 Eyl – 22 Eki', 'Hava',   'hava',   'Öncü',     'Venüs',          N'Terazi, adalet ve dengenin burcu. Güzelliğe, uyuma ve ilişkilere büyük önem verir. Diplomatik ruhu ile barış sağlayıcıdır.',                                                        N'Diplomatik,Adil,Karizmatik,Dengeli,Sosyal',              N'Kararsız,Yüzeysel,Çatışmadan kaçan,Bağımlı',            N'İkizler,Kova,Aslan,Yay'),
('Akrep',   '♏', '23 Eki', '21 Kas', '23 Eki – 21 Kas', 'Su',     'su',     'Sabit',    'Pluton/Mars',    N'Akrep, gizemli ve yoğun bir ruhtur. Pluton''un yönetiminde derin dönüşümlere, tutkulu bağlara ve keskin sezgilerine güvenerek yaşar.',                                             N'Tutkulu,Güçlü,Kararlı,Sadık,Sezgisel',                   N'İntikamcı,Kıskanç,Gizli saklı,Obsesif',                 N'Yengeç,Balık,Başak,Oğlak'),
('Yay',     '♐', '22 Kas', '21 Ara', '22 Kas – 21 Ara', 'Ateş',   'ates',   'Değişken', 'Jüpiter',        N'Yay, özgürlüğün ve keşfin burcu. Jüpiter''in yönetiminde, felsefi zihni ve sınırsız merakıyla ufukları genişletmeyi sever.',                                                        N'İyimser,Özgür ruhlu,Dürüst,Maceracı,Bilge',              N'Sorumsuz,Sabırsız,Kaba,Taahhütsüz',                      N'Koç,Aslan,Terazi,Kova'),
('Oğlak',   '♑', '22 Ara', '19 Oca', '22 Ara – 19 Oca', 'Toprak', 'toprak', 'Öncü',     'Satürn',         N'Oğlak, hırs ve disiplinin simgesi. Satürn''ün çocuğu olan Oğlak, azmi ve pratik zekasıyla hedeflerine ulaşmayı bilir.',                                                            N'Disiplinli,Sorumlu,Azimli,Pratik,Sadık',                 N'Katı,Soğuk,İş dışında mesafeli,Kötümser',               N'Boğa,Başak,Akrep,Balık'),
('Kova',    '♒', '20 Oca', '18 Şub', '20 Oca – 18 Şub', 'Hava',   'hava',   'Sabit',    'Uranüs/Satürn',  N'Kova, yenilikçiliğin ve özgünlüğün burcu. Uranüs''ün yönetiminde, ilerici fikirleri ve insani değerlere bağlılığıyla çağının önüne geçer.',                                       N'Yenilikçi,Bağımsız,İnsancıl,Özgün,Dürüst',              N'Duygusal mesafe,Asi,Öngörülemez,Katı fikirli',           N'İkizler,Terazi,Koç,Yay'),
('Balık',   '♓', '19 Şub', '20 Mar', '19 Şub – 20 Mar', 'Su',     'su',     'Değişken', 'Neptün/Jüpiter', N'Balık, hayal gücünün ve ruhsallığın burcu. Neptün''ün yönetiminde, derin empati ve sanatsal ruhuyla evreni hisseder.',                                                             N'Empatik,Yaratıcı,Sezgisel,Şefkatli,Ruhsal',             N'Kaçışcı,Sınır koymaz,Aşırı hassas,Kararsız',            N'Yengeç,Akrep,Boğa,Oğlak');
GO

-- SEED: Uyum Tablosu 
INSERT INTO dbo.UyumTablosu (Element1, Element2, Puan, Baslik, Aciklama) VALUES
('ates',   'ates',   75, N'Yıldırım Aşkı',           N'İki ateş burcu bir araya geldiğinde kıvılcımlar kaçınılmaz. Tutkulu ve dinamik bir ilişki, ancak egolar çatışabilir.'),
('ates',   'toprak', 55, N'Zıtların Çekimi',          N'Ateşin yoğun enerjisi toprak burcunu zorlayabilir. Sabır ve anlayış köprüyü inşa eder.'),
('ates',   'hava',   88, N'Rüzgar Alevleri Körükler', N'Hava, ateşe ilham verir! Bu kombinasyon enerjik, yaratıcı ve oldukça uyumlu bir çift yaratır.'),
('ates',   'su',     45, N'Buhar & Güç',              N'Ateş ve su güçlü ama zorlu bir kombinasyon. Duygusal farklılıklar empati gerektiriyor.'),
('toprak', 'toprak', 82, N'Sağlam Temel',             N'İki toprak burcu birlikte istikrarlı, güvenilir ve uzun soluklu bir ilişki kurabilir.'),
('toprak', 'hava',   50, N'Farklı Ritimler',          N'Toprak pratikliği ile havanın özgürlük sevgisi zaman zaman çatışabilir ama denge bulunabilir.'),
('toprak', 'su',     85, N'Bereketli Toprak',         N'Su toprağı besler! Bu iki unsur harika bir uyum içinde birbirini tamamlar.'),
('hava',   'hava',   78, N'Fikirler Dans Eder',       N'Entelektüel bağ son derece güçlü. Yalnızca pratik zemine bazen ihtiyaç duyulabilir.'),
('hava',   'su',     62, N'Duygusal Denge',           N'Havanın mantığı suyun duygusallığıyla buluştuğunda derin bir anlayış doğabilir.'),
('su',     'su',     90, N'Okyanus Derinliği',        N'İki su burcu arasındaki duygusal bağ son derece derin ve köklüdür. Sezgisel uyum mükemmel.');
GO

--  SEED: Günlük Yorumlar (bugün için) veri çekme
INSERT INTO dbo.GunlukYorumlar (BurcId, Tarih, Yorum, AskPuan, ParaPuan, SaglikPuan)
SELECT
    b.Id,
    CAST(GETDATE() AS DATE),
    y.Yorum,
    y.AskPuan,
    y.ParaPuan,
    y.SaglikPuan
FROM dbo.Burclar b
JOIN (VALUES
    ('Koç',     N'Bugün Mars enerjisi seni harekete geçiriyor. Uzun süredir ertelediğin projeyi başlatmak için mükemmel bir gün. Finansal konularda aceleci kararlardan kaçın.',     90, 60, 75),
    ('Boğa',    N'Venüsün nazlı ışığı altında bugün huzur ve güzellik ön planda. Sevdiklerinle vakit geçirmek ruhunu besleyecek. İş ortamında sabırlı davran.',                     80, 70, 85),
    ('İkizler', N'Merkürün destekleyici konumu sayesinde iletişim kanalların açık. Önemli görüşmeler ve yazışmalar için ideal bir gün.',                                             75, 65, 70),
    ('Yengeç',  N'Ayın sezgisel enerjisi duygularını derinleştiriyor. Ev ve aile konularında güzel gelişmeler mümkün. İçgüdülerine güven.',                                         85, 55, 80),
    ('Aslan',   N'Güneş enerjin yüksek, karizman dorukta. Yaratıcı projelerde ilerleme için harika bir gün. Cömertliğin seni daha da sevdiriyor.',                                  95, 75, 90),
    ('Başak',   N'Merkürün analitik etkisi altında detaylara olan dikkatın paha biçilmez. Sağlık konularında küçük adımlar atabilirsin.',                                            65, 80, 95),
    ('Terazi',  N'Venüs ilişkilerini besliyor. Partnerinle derinlikli bir sohbet çok şeyi değiştirebilir. Estetik projeler seni besliyor.',                                          90, 70, 75),
    ('Akrep',   N'Plutonun güçlü etkisi dönüşümü destekliyor. Eski alışkanlıklardan vazgeçmek için doğru an. Gizlenen bir gerçek gün yüzüne çıkabilir.',                           70, 85, 65),
    ('Yay',     N'Jüpiterin iyimser enerjisi seni taşıyor. Eğitim, seyahat ve yeni fikirler için mükemmel bir gün. Ufkunu genişlet.',                                               80, 60, 85),
    ('Oğlak',   N'Satürnün disiplinli etkisi altında kariyerine odaklanıyorsun. Uzun vadeli hedefler için adım atmak için ideal zaman.',                                            60, 90, 70),
    ('Kova',    N'Uranüsün özgürleştirici enerjisi yaratıcılığını tetikliyor. Teknoloji ve inovasyon alanlarında sürpriz fırsatlar seni bekliyor.',                                  75, 65, 80),
    ('Balık',   N'Neptün sezgilerini güçlendiriyor. Meditasyon ve sanatsal uğraşlar için ideal bir gün. Duygusal sınırlarına dikkat et.',                                           85, 55, 75)
) AS y(BurcAd, Yorum, AskPuan, ParaPuan, SaglikPuan) ON b.Ad = y.BurcAd;
GO

-- YARDIMCI VIEW: Bugünün Yorumları (karmaşık işlemler için kullandık)
CREATE OR ALTER VIEW dbo.vw_BugununYorumlari AS
SELECT
    b.Id        AS BurcId,
    b.Ad,
    b.Sembol,
    b.Element,
    b.ElementKey,
    g.Yorum,
    g.AskPuan,
    g.ParaPuan,
    g.SaglikPuan,
    g.Tarih
FROM dbo.Burclar b
JOIN dbo.GunlukYorumlar g ON b.Id = g.BurcId
WHERE g.Tarih = CAST(GETDATE() AS DATE);
GO

PRINT 'Zodya_DB kurulumu tamamladım ';