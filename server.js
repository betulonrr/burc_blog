require('dotenv').config();
const express    = require('express');
const cors       = require('cors');
const { closePool } = require('./db/connection');

const app  = express();
const PORT = process.env.PORT || 3000;

//  MIDDLEWARE
app.use(cors({
  origin: '*', 
}));
app.use(express.json());

// İstekleri logla (geliştirme için)
if (process.env.NODE_ENV === 'development') {
  app.use((req, _res, next) => {
    console.log(`[${new Date().toLocaleTimeString('tr-TR')}] ${req.method} ${req.url}`);
    next();
  });
}

// sql rotaları
app.use('/api/burclar', require('./routes/burclar'));
app.use('/api/gunluk',  require('./routes/gunluk'));
app.use('/api/uyum',    require('./routes/uyum'));

// Ana sayfa — API sağlık kontrolü
app.get('/', (_req, res) => {
  res.json({
    uygulama: 'Zodya API',
    surum:    '1.0.0',
    durum:    'çalışıyor ✅',
    endpointler: [
      'GET /api/burclar',
      'GET /api/burclar/:ad',
      'GET /api/gunluk',
      'GET /api/gunluk/:burcAd',
      'GET /api/gunluk/tarih/:tarih',
      'GET /api/uyum?burc1=Koç&burc2=Aslan',
    ]
  });
});

// 404 yakalayıcı
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint bulunamadı.' });
});

// sunucuyu başlat
const server = app.listen(PORT, () => {
  console.log(`\n🌙 Zodya API çalışıyor → http://localhost:${PORT}`);
  console.log(`📋 Ortam: ${process.env.NODE_ENV}`);
  console.log(`📡 API dokümantasyonu: http://localhost:${PORT}\n`);
});

// kaydederek kapa
process.on('SIGINT',  () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

async function shutdown(signal) {
  console.log(`\n${signal} alındı, sunucu kapatılıyor...`);
  server.close(async () => {
    await closePool();
    console.log('✅ Sunucu düzgün kapatıldı.');
    process.exit(0);
  });
}











