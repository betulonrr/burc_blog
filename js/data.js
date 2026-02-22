// API BAĞLANTISI 
const API_BASE = 'http://localhost:3000/api';

async function fetchBurclar()      { const r = await fetch(`${API_BASE}/burclar`); const j = await r.json(); if (!j.success) throw new Error(j.message); return j.data; }
async function fetchBurc(ad)       { const r = await fetch(`${API_BASE}/burclar/${encodeURIComponent(ad)}`); const j = await r.json(); if (!j.success) throw new Error(j.message); return j.data; }
async function fetchGunlukTumu()   { const r = await fetch(`${API_BASE}/gunluk`); const j = await r.json(); if (!j.success) throw new Error(j.message); return j.data; }
async function fetchGunluk(burcAd) { const r = await fetch(`${API_BASE}/gunluk/${encodeURIComponent(burcAd)}`); const j = await r.json(); if (!j.success) throw new Error(j.message); return j.data; }
async function fetchUyum(b1, b2)   { const p = new URLSearchParams({burc1:b1,burc2:b2}); const r = await fetch(`${API_BASE}/uyum?${p}`); const j = await r.json(); if (!j.success) throw new Error(j.message); return j.data; }

//  YÜKSELEN BURÇ AÇIKLAMALARI (statik) 
const risingDescs = {
  'Koç':    'Dış dünyanın gözünde cesur ve enerjik görünürsün. İlk izlenim bırakma konusunda rakipsizsin.',
  'Boğa':   'Sakin, güvenilir ve zarif bir dış görünüm. İnsanlar sana güvenme eğiliminde.',
  'İkizler':'Neşeli, meraklı ve iletişim konusunda güçlü bir ilk izlenim yaratırsın.',
  'Yengeç': 'Şefkatli ve sıcak görünümün insanları hemen sana çeker. Koruyucu bir aura yayarsın.',
  'Aslan':  'Karizman ve özgüvenin odanın ışığı olmanı sağlar. Dikkat çekmek için çaba harcamazsın.',
  'Başak':  'Analitik ve düzenli görünümün güveni hemen inşa eder. Titizliğin hemen fark edilir.',
  'Terazi': 'Nazik, estetik ve diplomatik bir ilk izlenim. Herkesin seveceği türden bir enerji yayarsın.',
  'Akrep':  'Gizemli ve yoğun bir aura. İnsanlar seni hemen merak eder ve etkileyici bulur.',
  'Yay':    'Özgür ruhlu, iyimser ve maceraperest görünümün insanları sana çeker.',
  'Oğlak': 'Profesyonel, ciddi ve güvenilir görünümün saygı uyandırır. Olgun bir enerji yayarsın.',
  'Kova':   'Farklı, özgün ve ilgi çekici bir aura. İnsanlar seni hemen ilginç bulur.',
  'Balık':  'Rüyamsı, şefkatli ve empatik bir dış görünüm. Seni tanımak istedikleri hissettirirsin.'
};

// FALLBACK VERİSİ (API çalışmıyorken kullanılır) 
const signs = [
  { name:'Koç',     Ad:'Koç',     symbol:'♈', Sembol:'♈', dates:'21 Mar – 19 Nis', TarihAralik:'21 Mar – 19 Nis', elem:'Ateş', Element:'Ateş', elemKey:'ates', ElementKey:'ates', ruling:'Mars',           YoneticiGez:'Mars',           modality:'Öncü',     Modalite:'Öncü',
    desc:'Koç, zodiakın öncüsü, cesaret ve tutkuyla dolu ateşli bir ruhtur.', Aciklama:'Koç, zodiakın öncüsü, cesaret ve tutkuyla dolu ateşli bir ruhtur.',
    pos:['Cesur','Kararlı','Enerjik','Özgüvenli','Tutkulu'],      GucluOz:['Cesur','Kararlı','Enerjik','Özgüvenli','Tutkulu'],
    neg:['Sabırsız','Dürtüsel','İnatçı','Bencil'],                GelistirOz:['Sabırsız','Dürtüsel','İnatçı','Bencil'],
    compat:['Aslan','Yay','İkizler','Kova'],                      UyumluBurc:['Aslan','Yay','İkizler','Kova'] },
  { name:'Boğa',    Ad:'Boğa',    symbol:'♉', Sembol:'♉', dates:'20 Nis – 20 May', TarihAralik:'20 Nis – 20 May', elem:'Toprak', Element:'Toprak', elemKey:'toprak', ElementKey:'toprak', ruling:'Venüs', YoneticiGez:'Venüs', modality:'Sabit',    Modalite:'Sabit',
    desc:'Boğa, güzelliğin ve konforun efendisidir.', Aciklama:'Boğa, güzelliğin ve konforun efendisidir.',
    pos:['Güvenilir','Sabırlı','Pratik','İstikrarlı','Sadık'],    GucluOz:['Güvenilir','Sabırlı','Pratik','İstikrarlı','Sadık'],
    neg:['İnatçı','Maddeci','Tembel','Değişime dirençli'],        GelistirOz:['İnatçı','Maddeci','Tembel','Değişime dirençli'],
    compat:['Başak','Oğlak','Yengeç','Balık'],                    UyumluBurc:['Başak','Oğlak','Yengeç','Balık'] },
  { name:'İkizler', Ad:'İkizler', symbol:'♊', Sembol:'♊', dates:'21 May – 20 Haz', TarihAralik:'21 May – 20 Haz', elem:'Hava',   Element:'Hava',   elemKey:'hava',   ElementKey:'hava',   ruling:'Merkür', YoneticiGez:'Merkür', modality:'Değişken', Modalite:'Değişken',
    desc:'İkizler, zekanın ve merakın burcu.', Aciklama:'İkizler, zekanın ve merakın burcu.',
    pos:['Zeki','Uyumlu','Meraklı','Esprili','İletişimci'],       GucluOz:['Zeki','Uyumlu','Meraklı','Esprili','İletişimci'],
    neg:['Değişken','Yüzeysel','Tutarsız','Endişeli'],            GelistirOz:['Değişken','Yüzeysel','Tutarsız','Endişeli'],
    compat:['Terazi','Kova','Koç','Aslan'],                       UyumluBurc:['Terazi','Kova','Koç','Aslan'] },
  { name:'Yengeç',  Ad:'Yengeç',  symbol:'♋', Sembol:'♋', dates:'21 Haz – 22 Tem', TarihAralik:'21 Haz – 22 Tem', elem:'Su',    Element:'Su',    elemKey:'su',     ElementKey:'su',     ruling:'Ay',    YoneticiGez:'Ay',    modality:'Öncü',     Modalite:'Öncü',
    desc:'Yengeç, Ayın yönetiminde hassas ve koruyucu bir ruhtur.', Aciklama:'Yengeç, Ayın yönetiminde hassas ve koruyucu bir ruhtur.',
    pos:['Hassas','Koruyucu','Sadık','Sezgisel','Şefkatli'],      GucluOz:['Hassas','Koruyucu','Sadık','Sezgisel','Şefkatli'],
    neg:['Aşırı duygusal','Kıskançlık','İçine kapanık','Değişken'], GelistirOz:['Aşırı duygusal','Kıskançlık','İçine kapanık','Değişken'],
    compat:['Akrep','Balık','Boğa','Başak'],                     UyumluBurc:['Akrep','Balık','Boğa','Başak'] },
  { name:'Aslan',   Ad:'Aslan',   symbol:'♌', Sembol:'♌', dates:'23 Tem – 22 Ağu', TarihAralik:'23 Tem – 22 Ağu', elem:'Ateş',  Element:'Ateş',  elemKey:'ates',   ElementKey:'ates',   ruling:'Güneş', YoneticiGez:'Güneş', modality:'Sabit',    Modalite:'Sabit',
    desc:'Aslan, Güneşin çocuğu; karizması ve liderlik ruhuyla her ortamda parlar.', Aciklama:'Aslan, Güneşin çocuğu; karizması ve liderlik ruhuyla her ortamda parlar.',
    pos:['Karizmatik','Yaratıcı','Cömert','Sadık','Cesur'],       GucluOz:['Karizmatik','Yaratıcı','Cömert','Sadık','Cesur'],
    neg:['Kibirli','Dikkat ihtiyacı','Dominant','İnatçı'],        GelistirOz:['Kibirli','Dikkat ihtiyacı','Dominant','İnatçı'],
    compat:['Koç','Yay','İkizler','Terazi'],                      UyumluBurc:['Koç','Yay','İkizler','Terazi'] },
  { name:'Başak',   Ad:'Başak',   symbol:'♍', Sembol:'♍', dates:'23 Ağu – 22 Eyl', TarihAralik:'23 Ağu – 22 Eyl', elem:'Toprak', Element:'Toprak', elemKey:'toprak', ElementKey:'toprak', ruling:'Merkür', YoneticiGez:'Merkür', modality:'Değişken', Modalite:'Değişken',
    desc:'Başak, analitik zekanın ve mükemmeliyetçiliğin temsilcisidir.', Aciklama:'Başak, analitik zekanın ve mükemmeliyetçiliğin temsilcisidir.',
    pos:['Analitik','Güvenilir','Dikkatli','Pratik','Yardımsever'], GucluOz:['Analitik','Güvenilir','Dikkatli','Pratik','Yardımsever'],
    neg:['Aşırı eleştirici','Endişeli','Katı','Mükemmeliyetçi'], GelistirOz:['Aşırı eleştirici','Endişeli','Katı','Mükemmeliyetçi'],
    compat:['Boğa','Oğlak','Yengeç','Akrep'],                    UyumluBurc:['Boğa','Oğlak','Yengeç','Akrep'] },
  { name:'Terazi',  Ad:'Terazi',  symbol:'♎', Sembol:'♎', dates:'23 Eyl – 22 Eki', TarihAralik:'23 Eyl – 22 Eki', elem:'Hava',  Element:'Hava',  elemKey:'hava',   ElementKey:'hava',   ruling:'Venüs', YoneticiGez:'Venüs', modality:'Öncü',     Modalite:'Öncü',
    desc:'Terazi, adalet ve dengenin burcu. Diplomatik ruhu ile barış sağlayıcıdır.', Aciklama:'Terazi, adalet ve dengenin burcu.',
    pos:['Diplomatik','Adil','Karizmatik','Dengeli','Sosyal'],    GucluOz:['Diplomatik','Adil','Karizmatik','Dengeli','Sosyal'],
    neg:['Kararsız','Yüzeysel','Çatışmadan kaçan','Bağımlı'],    GelistirOz:['Kararsız','Yüzeysel','Çatışmadan kaçan','Bağımlı'],
    compat:['İkizler','Kova','Aslan','Yay'],                     UyumluBurc:['İkizler','Kova','Aslan','Yay'] },
  { name:'Akrep',   Ad:'Akrep',   symbol:'♏', Sembol:'♏', dates:'23 Eki – 21 Kas', TarihAralik:'23 Eki – 21 Kas', elem:'Su',    Element:'Su',    elemKey:'su',     ElementKey:'su',     ruling:'Pluton/Mars', YoneticiGez:'Pluton/Mars', modality:'Sabit', Modalite:'Sabit',
    desc:'Akrep, gizemli ve yoğun bir ruhtur. Derin dönüşümlere güvenerek yaşar.', Aciklama:'Akrep, gizemli ve yoğun bir ruhtur.',
    pos:['Tutkulu','Güçlü','Kararlı','Sadık','Sezgisel'],        GucluOz:['Tutkulu','Güçlü','Kararlı','Sadık','Sezgisel'],
    neg:['İntikamcı','Kıskanç','Gizli saklı','Obsesif'],         GelistirOz:['İntikamcı','Kıskanç','Gizli saklı','Obsesif'],
    compat:['Yengeç','Balık','Başak','Oğlak'],                   UyumluBurc:['Yengeç','Balık','Başak','Oğlak'] },
  { name:'Yay',     Ad:'Yay',     symbol:'♐', Sembol:'♐', dates:'22 Kas – 21 Ara', TarihAralik:'22 Kas – 21 Ara', elem:'Ateş',  Element:'Ateş',  elemKey:'ates',   ElementKey:'ates',   ruling:'Jüpiter', YoneticiGez:'Jüpiter', modality:'Değişken', Modalite:'Değişken',
    desc:'Yay, özgürlüğün ve keşfin burcu. Sınırsız merakıyla ufukları genişletir.', Aciklama:'Yay, özgürlüğün ve keşfin burcu.',
    pos:['İyimser','Özgür ruhlu','Dürüst','Maceracı','Bilge'],   GucluOz:['İyimser','Özgür ruhlu','Dürüst','Maceracı','Bilge'],
    neg:['Sorumsuz','Sabırsız','Kaba','Taahhütsüz'],             GelistirOz:['Sorumsuz','Sabırsız','Kaba','Taahhütsüz'],
    compat:['Koç','Aslan','Terazi','Kova'],                      UyumluBurc:['Koç','Aslan','Terazi','Kova'] },
  { name:'Oğlak',   Ad:'Oğlak',   symbol:'♑', Sembol:'♑', dates:'22 Ara – 19 Oca', TarihAralik:'22 Ara – 19 Oca', elem:'Toprak', Element:'Toprak', elemKey:'toprak', ElementKey:'toprak', ruling:'Satürn', YoneticiGez:'Satürn', modality:'Öncü', Modalite:'Öncü',
    desc:'Oğlak, hırs ve disiplinin simgesi. Azmiyle hedeflerine ulaşır.', Aciklama:'Oğlak, hırs ve disiplinin simgesi.',
    pos:['Disiplinli','Sorumlu','Azimli','Pratik','Sadık'],       GucluOz:['Disiplinli','Sorumlu','Azimli','Pratik','Sadık'],
    neg:['Katı','Soğuk','İş dışında mesafeli','Kötümser'],       GelistirOz:['Katı','Soğuk','İş dışında mesafeli','Kötümser'],
    compat:['Boğa','Başak','Akrep','Balık'],                     UyumluBurc:['Boğa','Başak','Akrep','Balık'] },
  { name:'Kova',    Ad:'Kova',    symbol:'♒', Sembol:'♒', dates:'20 Oca – 18 Şub', TarihAralik:'20 Oca – 18 Şub', elem:'Hava',  Element:'Hava',  elemKey:'hava',   ElementKey:'hava',   ruling:'Uranüs/Satürn', YoneticiGez:'Uranüs/Satürn', modality:'Sabit', Modalite:'Sabit',
    desc:'Kova, yenilikçiliğin ve özgünlüğün burcu. Çağının önüne geçer.', Aciklama:'Kova, yenilikçiliğin ve özgünlüğün burcu.',
    pos:['Yenilikçi','Bağımsız','İnsancıl','Özgün','Dürüst'],    GucluOz:['Yenilikçi','Bağımsız','İnsancıl','Özgün','Dürüst'],
    neg:['Duygusal mesafe','Asi','Öngörülemez','Katı fikirli'],  GelistirOz:['Duygusal mesafe','Asi','Öngörülemez','Katı fikirli'],
    compat:['İkizler','Terazi','Koç','Yay'],                     UyumluBurc:['İkizler','Terazi','Koç','Yay'] },
  { name:'Balık',   Ad:'Balık',   symbol:'♓', Sembol:'♓', dates:'19 Şub – 20 Mar', TarihAralik:'19 Şub – 20 Mar', elem:'Su',    Element:'Su',    elemKey:'su',     ElementKey:'su',     ruling:'Neptün/Jüpiter', YoneticiGez:'Neptün/Jüpiter', modality:'Değişken', Modalite:'Değişken',
    desc:'Balık, hayal gücünün ve ruhsallığın burcu. Derin empatiyle evreni hisseder.', Aciklama:'Balık, hayal gücünün ve ruhsallığın burcu.',
    pos:['Empatik','Yaratıcı','Sezgisel','Şefkatli','Ruhsal'],   GucluOz:['Empatik','Yaratıcı','Sezgisel','Şefkatli','Ruhsal'],
    neg:['Kaçışcı','Sınır koymaz','Aşırı hassas','Kararsız'],    GelistirOz:['Kaçışcı','Sınır koymaz','Aşırı hassas','Kararsız'],
    compat:['Yengeç','Akrep','Boğa','Oğlak'],                   UyumluBurc:['Yengeç','Akrep','Boğa','Oğlak'] }
];

// UYUM FALLBACK 
const compatData = {
  'ates-ates':    { score:75, Puan:75, title:'Yıldırım Aşkı',           Baslik:'Yıldırım Aşkı',           desc:'İki ateş burcu bir araya geldiğinde kıvılcımlar kaçınılmaz.',         Aciklama:'İki ateş burcu bir araya geldiğinde kıvılcımlar kaçınılmaz.' },
  'ates-toprak':  { score:55, Puan:55, title:'Zıtların Çekimi',          Baslik:'Zıtların Çekimi',          desc:'Ateşin yoğun enerjisi toprak burcunu zorlayabilir.',                   Aciklama:'Ateşin yoğun enerjisi toprak burcunu zorlayabilir.' },
  'ates-hava':    { score:88, Puan:88, title:'Rüzgar Alevleri Körükler', Baslik:'Rüzgar Alevleri Körükler', desc:'Hava, ateşe ilham verir! Enerjik ve yaratıcı bir çift.',               Aciklama:'Hava, ateşe ilham verir! Enerjik ve yaratıcı bir çift.' },
  'ates-su':      { score:45, Puan:45, title:'Buhar & Güç',              Baslik:'Buhar & Güç',              desc:'Güçlü ama zorlu bir kombinasyon. Empati şart.',                        Aciklama:'Güçlü ama zorlu bir kombinasyon. Empati şart.' },
  'toprak-toprak':{ score:82, Puan:82, title:'Sağlam Temel',             Baslik:'Sağlam Temel',             desc:'İstikrarlı, güvenilir ve uzun soluklu bir ilişki.',                    Aciklama:'İstikrarlı, güvenilir ve uzun soluklu bir ilişki.' },
  'toprak-hava':  { score:50, Puan:50, title:'Farklı Ritimler',          Baslik:'Farklı Ritimler',          desc:'Pratiklik ile özgürlük sevgisi çatışabilir ama denge bulunabilir.',    Aciklama:'Pratiklik ile özgürlük sevgisi çatışabilir ama denge bulunabilir.' },
  'toprak-su':    { score:85, Puan:85, title:'Bereketli Toprak',         Baslik:'Bereketli Toprak',         desc:'Su toprağı besler! Harika bir uyum.',                                  Aciklama:'Su toprağı besler! Harika bir uyum.' },
  'hava-hava':    { score:78, Puan:78, title:'Fikirler Dans Eder',       Baslik:'Fikirler Dans Eder',       desc:'Entelektüel bağ son derece güçlü.',                                    Aciklama:'Entelektüel bağ son derece güçlü.' },
  'hava-su':      { score:62, Puan:62, title:'Duygusal Denge',           Baslik:'Duygusal Denge',           desc:'Mantık ve duygusallık buluştuğunda derin anlayış doğar.',              Aciklama:'Mantık ve duygusallık buluştuğunda derin anlayış doğar.' },
  'su-su':        { score:90, Puan:90, title:'Okyanus Derinliği',        Baslik:'Okyanus Derinliği',        desc:'İki su burcu arasındaki duygusal bağ son derece derin.',               Aciklama:'İki su burcu arasındaki duygusal bağ son derece derin.' }
};