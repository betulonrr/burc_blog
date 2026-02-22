const express  = require('express');
const router   = express.Router();
const { sql, getPool } = require('../db/connection');

//  GET /api/burclar
// Tüm burçları döndürür
router.get('/', async (req, res) => {
  try {
    const pool   = await getPool();
    const result = await pool.request().query(`
      SELECT
        Id, Ad, Sembol, TarihAralik,
        Element, ElementKey, Modalite, YoneticiGez,
        Aciklama, GucluOz, GelistirOz, UyumluBurc
      FROM dbo.Burclar
      ORDER BY Id
    `);

    // Virgüllü string alanları diziye çevir
    const burclar = result.recordset.map(b => ({
      ...b,
      GucluOz:    b.GucluOz.split(',').map(s => s.trim()),
      GelistirOz: b.GelistirOz.split(',').map(s => s.trim()),
      UyumluBurc: b.UyumluBurc.split(',').map(s => s.trim()),
    }));

    res.json({ success: true, data: burclar });
  } catch (err) {
    console.error('Burçlar hatası:', err);
    res.status(500).json({ success: false, message: 'Sunucu hatası.' });
  }
});

//  GET /api/burclar/:ad 
// Tek burç detayı (örn: /api/burclar/Koç)
router.get('/:ad', async (req, res) => {
  try {
    const pool   = await getPool();
    const result = await pool.request()
      .input('Ad', sql.NVarChar(50), req.params.ad)
      .query(`
        SELECT
          Id, Ad, Sembol, TarihAralik,
          Element, ElementKey, Modalite, YoneticiGez,
          Aciklama, GucluOz, GelistirOz, UyumluBurc
        FROM dbo.Burclar
        WHERE Ad = @Ad
      `);

    if (!result.recordset.length) {
      return res.status(404).json({ success: false, message: 'Burç bulunamadı.' });
    }

    const b = result.recordset[0];
    res.json({
      success: true,
      data: {
        ...b,
        GucluOz:    b.GucluOz.split(',').map(s => s.trim()),
        GelistirOz: b.GelistirOz.split(',').map(s => s.trim()),
        UyumluBurc: b.UyumluBurc.split(',').map(s => s.trim()),
      }
    });
  } catch (err) {
    console.error('Burç detay hatası:', err);
    res.status(500).json({ success: false, message: 'Sunucu hatası.' });
  }
});

module.exports = router;