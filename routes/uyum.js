const express  = require('express');
const router   = express.Router();
const { sql, getPool } = require('../db/connection');

//  GET /api/uyum?burc1=Koç&burc2=Aslan 
// İki burç arasındaki uyumu döner
router.get('/', async (req, res) => {
  const { burc1, burc2 } = req.query;

  if (!burc1 || !burc2) {
    return res.status(400).json({
      success: false,
      message: 'burc1 ve burc2 parametreleri zorunludur.'
    });
  }

  try {
    const pool = await getPool();

    // Her iki burcun elementini çek
    const burcResult = await pool.request()
      .input('Burc1', sql.NVarChar(50), burc1)
      .input('Burc2', sql.NVarChar(50), burc2)
      .query(`
        SELECT Ad, ElementKey FROM dbo.Burclar
        WHERE Ad IN (@Burc1, @Burc2)
      `);

    if (burcResult.recordset.length < 2) {
      return res.status(404).json({
        success: false,
        message: 'Bir veya iki burç bulunamadı.'
      });
    }

    const el1 = burcResult.recordset.find(b => b.Ad === burc1)?.ElementKey;
    const el2 = burcResult.recordset.find(b => b.Ad === burc2)?.ElementKey;

    // Sıra bağımsız arama (ates-su == su-ates)
    const uyumResult = await pool.request()
      .input('El1', sql.NVarChar(10), el1)
      .input('El2', sql.NVarChar(10), el2)
      .query(`
        SELECT Puan, Baslik, Aciklama
        FROM dbo.UyumTablosu
        WHERE (Element1 = @El1 AND Element2 = @El2)
           OR (Element1 = @El2 AND Element2 = @El1)
      `);

    const uyum = uyumResult.recordset[0] || {
      Puan:     65,
      Baslik:   'Gizem Dolu Bağ',
      Aciklama: 'Yıldızlar aranızdaki bağın derinliğini henüz açıklamıyor.'
    };

    res.json({
      success: true,
      data: {
        burc1,
        burc2,
        element1: el1,
        element2: el2,
        ...uyum
      }
    });
  } catch (err) {
    console.error('Uyum hatası:', err);
    res.status(500).json({ success: false, message: 'Sunucu hatası.' });
  }
});

module.exports = router;