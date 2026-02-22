const express  = require('express');
const router   = express.Router();
const { sql, getPool } = require('../db/connection');

// Haftanın gününü al (1=Pzt, 7=Paz)
function gunNo() {
  const gun = new Date().getDay(); // 0=Paz, 1=Pzt...6=Cmt
  return gun === 0 ? 7 : gun;     // Pazar'ı 7 yap
}

//GET /api/gunluk 
// Bugünün tüm burç yorumlarını döner (haftanın gününe göre)
router.get('/', async (req, res) => {
  try {
    const pool   = await getPool();
    const result = await pool.request()
      .input('GunNo', sql.TinyInt, gunNo())
      .query(`
        SELECT
          b.Id AS BurcId,
          b.Ad, b.Sembol, b.Element, b.ElementKey,
          y.Yorum, y.AskPuan, y.ParaPuan, y.SaglikPuan,
          CAST(GETDATE() AS DATE) AS Tarih
        FROM dbo.YorumStogu y
        JOIN dbo.Burclar b ON b.Id = y.BurcId
        WHERE y.GunNo = @GunNo
        ORDER BY b.Id
      `);

    res.json({ success: true, data: result.recordset });
  } catch (err) {
    console.error('Günlük yorum hatası:', err);
    res.status(500).json({ success: false, message: 'Sunucu hatası.' });
  }
});

//  GET /api/gunluk/:burcAd 
// Tek burç için bugünkü yorumu döner
router.get('/:burcAd', async (req, res) => {
  try {
    const pool   = await getPool();
    const result = await pool.request()
      .input('Ad',    sql.NVarChar(50), req.params.burcAd)
      .input('GunNo', sql.TinyInt,      gunNo())
      .query(`
        SELECT
          b.Id AS BurcId,
          b.Ad, b.Sembol, b.Element, b.ElementKey,
          y.Yorum, y.AskPuan, y.ParaPuan, y.SaglikPuan,
          CAST(GETDATE() AS DATE) AS Tarih
        FROM dbo.YorumStogu y
        JOIN dbo.Burclar b ON b.Id = y.BurcId
        WHERE b.Ad = @Ad AND y.GunNo = @GunNo
      `);

    if (!result.recordset.length) {
      return res.status(404).json({
        success: false,
        message: 'Bu burç için yorum bulunamadı.'
      });
    }

    res.json({ success: true, data: result.recordset[0] });
  } catch (err) {
    console.error('Günlük tek yorum hatası:', err);
    res.status(500).json({ success: false, message: 'Sunucu hatası.' });
  }
});

module.exports = router;