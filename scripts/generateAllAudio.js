const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const audioData = [
  // ── Yüzler ──
  { file: 'the-hundred_step1', text: 'Sırtüstü uzan, dizleri masa üstü pozisyonunda bük; baldırlar yere paralel olsun.' },
  { file: 'the-hundred_step2', text: 'Baş, boyun ve omuzları minderden kaldır; gözler dizlere yönelsin.' },
  { file: 'the-hundred_step3', text: 'Kolları yanlara uzat, minderden birkaç santimetre yukarıda tut.' },
  { file: 'the-hundred_step4', text: 'Beş harekette nefes al, beş harekette nefes ver.' },
  { file: 'the-hundred_step5', text: 'Kolların hareketi küçük ve ritmik olsun; karın merkezini omurgaya doğru çek.' },
  { file: 'the-hundred_step6', text: 'On nefes döngüsü tamamlayarak toplamda yüz tekrara ulaş.' },

  // ── Yuvarlanarak Kalkış ──
  { file: 'roll-up_step1', text: 'Sırtüstü uzan, bacaklar birleşik ve uzatılmış; kollar başın üzerinde uzanmış.' },
  { file: 'roll-up_step2', text: 'Nefes al; kolları tavana doğru kaldırırken çeneyi göğse doğru yuvarla.' },
  { file: 'roll-up_step3', text: 'Omurgayı minderden omur omur soyarak oturmaya devam et.' },
  { file: 'roll-up_step4', text: 'Üstte parmaklarını ayaklarına doğru uzan; derin bir esneme hisset.' },
  { file: 'roll-up_step5', text: 'Nefes al; kontrollü biçimde geri yat.' },

  // ── Tek Bacak Germe ──
  { file: 'single-leg-stretch_step1', text: 'Sırtüstü uzan, her iki dizi de göğse çek; baş ve omuzlar minderden kalkık olsun.' },
  { file: 'single-leg-stretch_step2', text: 'Sağ dizi göğse doğru çek; sağ eli bileğe, sol eli dize koy.' },
  { file: 'single-leg-stretch_step3', text: 'Sol bacağı eş zamanlı olarak kırk beş dereceye uzat.' },
  { file: 'single-leg-stretch_step4', text: 'Kontrollü şekilde bacakları değiştir: sağ bacak uzarken sol içeri çekilir.' },
  { file: 'single-leg-stretch_step5', text: 'Nefes ritmi: iki değişimde nefes al, iki değişimde nefes ver.' },

  // ── Çift Bacak Germe ──
  { file: 'double-leg-stretch_step1', text: 'Sırtüstü uzan, her iki dizi de karnına çek; baş ve omuzlar minderden kalkık olsun.' },
  { file: 'double-leg-stretch_step2', text: 'Nefes al: kolları başın üzerine, bacakları kırk beş dereceye uzat.' },
  { file: 'double-leg-stretch_step3', text: 'Nefes ver: kolları dairesel hareketle geri getir, dizleri karnına çek.' },
  { file: 'double-leg-stretch_step4', text: 'Uzanma boyunca bel omurgasını sıkıca mindere bastır.' },

  // ── Çapraz Mekik ──
  { file: 'criss-cross_step1', text: 'Sırtüstü uzan, elleri başın arkasında; her iki bacak masa üstü pozisyonunda.' },
  { file: 'criss-cross_step2', text: 'Baş ve omuzları minderden kaldır.' },
  { file: 'criss-cross_step3', text: 'Nefes al; sağ bacağı uzatırken sol omuzu sağ dize doğru döndür.' },
  { file: 'criss-cross_step4', text: 'Dönüşü tam bir nefes boyunca tut, ardından taraf değiştir.' },
  { file: 'criss-cross_step5', text: 'Boynu çekme; karın kaslarının çalışmasına izin ver.' },

  // ── Bacak Çemberleri ──
  { file: 'leg-circles_step1', text: 'Sırtüstü uzan, sağ bacak tavana uzatılmış; sol bacak minderde uzun.' },
  { file: 'leg-circles_step2', text: 'Kollar yanlarda, denge için mindere bas.' },
  { file: 'leg-circles_step3', text: 'Sağ bacağı hafifçe vücudun üzerinden geçir; aşağı, yana ve başlangıç noktasına dön.' },
  { file: 'leg-circles_step4', text: 'Pelvisin kesinlikle kımıldamamasına dikkat et; sağa sola sallanma.' },
  { file: 'leg-circles_step5', text: 'Beş daire tamamla, ardından yönü tersine çevir.' },

  // ── Kuğu ──
  { file: 'swan_step1', text: 'Yüz üstü uzan, eller omuzların altında; dirsekler kaburga kafasına yakın.' },
  { file: 'swan_step2', text: 'Nefes al; omurgayı nazik bir yay içinde uzatarak yukarı bas.' },
  { file: 'swan_step3', text: 'Karın kaslarını aktif tut: sırttan kaldır, yalnızca kollarla değil.' },
  { file: 'swan_step4', text: 'Üstte iki sayı tut, ardından yavaşça in.' },
  { file: 'swan_step5', text: 'Boynu korumak için yukarıya değil, öne bak.' },

  // ── Yüzme ──
  { file: 'swimming_step1', text: 'Yüz üstü uzan, kollar ve bacaklar uzatılmış.' },
  { file: 'swimming_step2', text: 'Her iki kol ve bacağı minderden hafifçe kaldır.' },
  { file: 'swimming_step3', text: 'Dönüşümlü hareket et: sağ kol ile sol bacak yükselirken sol kol ile sağ bacak iner.' },
  { file: 'swimming_step4', text: 'Beş sayı nefes al, beş sayı nefes ver; ritmi koru.' },
  { file: 'swimming_step5', text: 'Hareket boyunca karın kaslarını minderden kaldırılmış tut.' },

  // ── Kedi–İnek ──
  { file: 'cat-cow_step1', text: 'El ve dizler üzerinde başla; bilekler omuzların, dizler kalçaların altında.' },
  { file: 'cat-cow_step2', text: 'Nefes al: karnı mindere doğru bırak, göğüs ve kuyruk kemiği yukarı kalksın. Bu İnek pozisyonu.' },
  { file: 'cat-cow_step3', text: 'Nefes ver: omurgayı tavana doğru yuvarlat, çene ve pelvis içeri gelsin. Bu Kedi pozisyonu.' },
  { file: 'cat-cow_step4', text: 'Yavaş hareket et ve her pozisyonda tam nefes al.' },

  // ── Omurga Germe ──
  { file: 'spine-stretch_step1', text: 'Dik otur, bacaklar kalça genişliğinde açık ve uzatılmış; ayaklar gergin.' },
  { file: 'spine-stretch_step2', text: 'Kolları omuz hizasında öne uzat.' },
  { file: 'spine-stretch_step3', text: 'Nefes ver: omurgayı C eğrisi yaparak öne eğil, baş dizlere doğru gitsin.' },
  { file: 'spine-stretch_step4', text: 'Nefes al ve omurgayı omur omur doğrult, dik otur.' },

  // ── Köprü ──
  { file: 'bridge_step1', text: 'Sırtüstü uzan, dizler bükülü; ayak tabanları yerde, kalça genişliğinde açık.' },
  { file: 'bridge_step2', text: 'Kollar yanlarda, avuç içleri yere baksın.' },
  { file: 'bridge_step3', text: 'Nefes al; nefes vererek kalçaları yavaşça minderden kaldır.' },
  { file: 'bridge_step4', text: 'Diz, kalça ve omuzlar düz bir çizgi oluştursun.' },
  { file: 'bridge_step5', text: 'Üstte iki sayı tut; nefes alarak yavaşça geri in.' },

  // ── Yan Bacak Kaldırma ──
  { file: 'side-leg-lift_step1', text: 'Yan uzan, vücut düz bir çizgide; alt kol baş altında uzanmış.' },
  { file: 'side-leg-lift_step2', text: 'Üst el denge için önde mindere koy.' },
  { file: 'side-leg-lift_step3', text: 'Kalçaları üst üste tut; nefes vererek üst bacağı kalça hizasına kaldır.' },
  { file: 'side-leg-lift_step4', text: 'Nefes al ve kontrollü biçimde indir; bırakma.' },
  { file: 'side-leg-lift_step5', text: 'Dış kalçayı kullanmaya odaklan, beli değil.' },

  // ── İç Uyluk Kaldırma ──
  { file: 'inner-thigh-lift_step1', text: 'Yan uzan, üst ayağı alt bacağın önünde mindere koy.' },
  { file: 'inner-thigh-lift_step2', text: 'Alt bacak düz; alt kol baş altında uzanmış.' },
  { file: 'inner-thigh-lift_step3', text: 'Nefes al; nefes vererek alt bacağı üst ayağa doğru kaldır.' },
  { file: 'inner-thigh-lift_step4', text: 'İç uyluğu sık, üstte kısa bir süre tut.' },
  { file: 'inner-thigh-lift_step5', text: 'Mindere tam basmadan yavaşça indir.' },

  // ── Yan Tekme ──
  { file: 'side-kick_step1', text: 'Yan yat, vücut düz bir çizgide; alt eli başın altında, üst eli önünde minderde.' },
  { file: 'side-kick_step2', text: 'Üst bacağı kalça hizasına kaldır.' },
  { file: 'side-kick_step3', text: 'Nefes al: üst bacağı öne doğru götür.' },
  { file: 'side-kick_step4', text: 'Nefes ver: bacağı kontrollü şekilde geri getir.' },
  { file: 'side-kick_step5', text: 'Hareket boyunca pelvisin sabit kalmasına dikkat et.' },

  // ── Pilates Çömelme ──
  { file: 'pilates-squat_step1', text: 'Ayaklar kalça genişliğinde aç; parmak uçları kırk beş derece dışarıya dönük.' },
  { file: 'pilates-squat_step2', text: 'Topukları kaldır ve ayak tabanında dengelen.' },
  { file: 'pilates-squat_step3', text: 'Nefes al ve derin çömelmeye in; diz kapakları ayak parmaklarının üzerine gelsin.' },
  { file: 'pilates-squat_step4', text: 'Hareket boyunca omurgayı uzun ve göğsü dik tut.' },
  { file: 'pilates-squat_step5', text: 'Nefes vererek ayağa kalk. Setler arasında topukları yere indir.' },

  // ── Makas ──
  { file: 'scissors_step1', text: 'Sırtüstü uzan, her iki bacak tavana uzatılmış; baş ve omuzlar minderden kaldırılmış.' },
  { file: 'scissors_step2', text: 'Sağ bacağı her iki elle tut ve sol bacağı kırk beş dereceye indir.' },
  { file: 'scissors_step3', text: 'Sağ bacağı yüze doğru nazikçe iki kez esnet.' },
  { file: 'scissors_step4', text: 'Bacakları değiştir: sol bacak yüze, sağ bacak uzanır.' },
  { file: 'scissors_step5', text: 'Merkezi sıkı tut; boynu çekme.' },

  // ── Top Gibi Yuvarlanma ──
  { file: 'rolling-like-a-ball_step1', text: 'Minderin önüne otur, dizleri göğse çek; elleri bileklere koy.' },
  { file: 'rolling-like-a-ball_step2', text: 'Ayakları minderden kaldır, kuyruk kemiği üzerinde dengelen.' },
  { file: 'rolling-like-a-ball_step3', text: 'Omurgayı C eğrisi şeklinde yuvarlat; çene göğse değsin.' },
  { file: 'rolling-like-a-ball_step4', text: 'Nefes al ve omuz küreklerine kadar geri yuvarlan. Boyuna kadar gitme!' },
  { file: 'rolling-like-a-ball_step5', text: 'Nefes ver ve başlangıç dengesine geri yuvarlan.' },

  // ── Teaser ──
  { file: 'teaser_step1', text: 'Sırtüstü uzan, kollar başın üzerinde uzatılmış; bacaklar birleşik.' },
  { file: 'teaser_step2', text: 'Nefes al; nefes vererek kolları ve bacakları eş zamanlı kaldırarak kuyruk kemiği üzerinde dengelen.' },
  { file: 'teaser_step3', text: 'Vücut V şekli oluştursun: bacaklar kırk beş derecede, kollar bacaklara paralel.' },
  { file: 'teaser_step4', text: 'Kontrollü biçimde iki sayı dengede kal.' },
  { file: 'teaser_step5', text: 'Nefes al; nefes vererek yavaşça geri yat.' },

  // ── Pilates Plank ──
  { file: 'plank_step1', text: 'Şınav pozisyonunda başla: eller omuzların altında, vücut baştan topuğa düz bir çizgide.' },
  { file: 'plank_step2', text: 'Karın kaslarını içe çek, kalça kaslarını hafifçe sıkıştır.' },
  { file: 'plank_step3', text: 'Kalçaları düz tut: ne çök ne de yukarı kalk.' },
  { file: 'plank_step4', text: 'Süre boyunca düzenli nefes al; bakış eller arasına.' },
  { file: 'plank_step5', text: 'Gerekirse dizleri yere koyarak hareketi kolaylaştırabilirsin.' },

  // ── Testere ──
  { file: 'saw_step1', text: 'Dik otur, bacaklar kalçadan geniş açık; kollar omuz hizasında yanlara uzatılmış.' },
  { file: 'saw_step2', text: 'Nefes al, omurgayı uzat ve gövdeyi sağa döndür.' },
  { file: 'saw_step3', text: 'Nefes ver: sol eli sağ ayak parmağına doğru ulaştır.' },
  { file: 'saw_step4', text: 'Arka kol kaldırılır ve döner; üç kez ileri uzanma hareketi yap.' },
  { file: 'saw_step5', text: 'Nefes al ve merkeze dön; sola tekrarla.' },

  // ── Omurga Dönüşü ──
  { file: 'spine-twist_step1', text: 'Oturma kemikleri üzerinde dik otur, bacaklar birleşik ve uzatılmış; ayaklar gergin.' },
  { file: 'spine-twist_step2', text: 'Kollar omuz hizasında yanlara uzatılmış, avuç içleri aşağı.' },
  { file: 'spine-twist_step3', text: 'Nefes al ve omurgayı uzat; nefes vererek iki kısa dönüş hareketiyle sağa dön.' },
  { file: 'spine-twist_step4', text: 'Kalçaların sıkıca yere basmasına ve öne bakmasına dikkat et.' },
  { file: 'spine-twist_step5', text: 'Merkeze dön, ardından sola tekrarla.' },

  // ── Denizkızı Germe ──
  { file: 'mermaid_step1', text: 'Bacakları sola katlanmış şekilde otur.' },
  { file: 'mermaid_step2', text: 'Sol el yanında minderde; sağ kol başın üzerine uzanmış.' },
  { file: 'mermaid_step3', text: 'Nefes al; nefes vererek sağa eğil ve sol tarafın açıldığını hisset.' },
  { file: 'mermaid_step4', text: 'Nefes al ve dik pozisyona dön; karşı tarafı germek için sağ kolu yukarı ve üzerine uzat.' },
  { file: 'mermaid_step5', text: 'Tüm tekrarları tamamladıktan sonra taraf değiştir.' },

  // ── Pilates Şınavı ──
  { file: 'pilates-pushup_step1', text: 'Minderin tepesinde dik dur.' },
  { file: 'pilates-pushup_step2', text: 'Nefes al; nefes vererek aşağı yuvarlan ve elleri plank pozisyonuna doğru ilerlet.' },
  { file: 'pilates-pushup_step3', text: 'Dirsekler kaburga kafasına yakın olacak şekilde üç şınav çek.' },
  { file: 'pilates-pushup_step4', text: 'Elleri ayaklara geri yürüt; dizleri hafif bükük tut.' },
  { file: 'pilates-pushup_step5', text: 'Omur omur ayağa kalk.' },
];

// ── Intro (egzersiz açıklaması) ──────────────────────────────────────────────
const introData = [
  { file: 'the-hundred_intro',        text: 'Derin karın ısısı ve nefes kontrolü oluşturan, Pilatesin simgesi olan ısınma hareketi. Pompalanan kollar derin karın kaslarını aktive ederken bacaklar masa üstünde ya da uzatılmış şekilde havada durur.' },
  { file: 'roll-up_intro',            text: 'Karın kaslarını güçlendiren ve omurga esnekliğini artıran yavaş, eklemli bir omurga yuvarlanması. On mekiğe bedeldir!' },
  { file: 'single-leg-stretch_intro', text: 'Karın kaslarını çapraz koordinasyon modeliyle zorlayan, dönüşümlü bacak uzatmaları.' },
  { file: 'double-leg-stretch_intro', text: 'Kolları ve bacakları merkezden uzaklaştırıp geri bir araya getiren güçlü bir merkez egzersizi.' },
  { file: 'criss-cross_intro',        text: 'Yan karın kaslarını hedef alan döndürme egzersizi. Düz ve sıkı bir belin temel hareketi.' },
  { file: 'leg-circles_intro',        text: 'Bir bacak, pelvis tamamen hareketsizken kalça eklemini harekete geçirmek için büyük daireler çizer.' },
  { file: 'swan_intro',               text: 'Göğsü açan, omurga ekstansörlerini güçlendiren ve oturmanın etkilerini dengeleyen bir sırt uzatma egzersizi.' },
  { file: 'swimming_intro',           text: 'Tüm arka zinciri güçlendiren, yüz üstü pozisyonunda dönüşümlü kol ve bacak kaldırmaları.' },
  { file: 'cat-cow_intro',            text: 'Sırtı ısıtan, gerginliği gideren ve bölümsel mobiliteyi artıran nazik bir omurga dalgası.' },
  { file: 'spine-stretch_intro',      text: 'Omurgayı dekomprese eden, arka uyluk kaslarını ve sırt ekstansörlerini derin biçimde geren oturarak öne eğilme.' },
  { file: 'bridge_intro',             text: 'Kalça ve sırtı güçlendiren klasik egzersiz. Omurgayı bölüm bölüm hareket ettirir.' },
  { file: 'side-leg-lift_intro',      text: 'Kalça abduktörünü ve gluteus mediusu izole eden, ince ve sıkı bacaklar için yanda yatar tekme serisi hareketi.' },
  { file: 'inner-thigh-lift_intro',   text: 'Genellikle ihmal edilen adduktörleri hedef alırken yanda yatar merkez stabilitesi geliştirir.' },
  { file: 'side-kick_intro',          text: 'Üst bacağı ileri ve geri sallayan, kalça mobilitesini artıran ve tüm bacağı tonlayan yanda yatar tekme.' },
  { file: 'pilates-squat_intro',      text: 'Topuklar kalkık ve omurga uzatılmış derin çömelme; doğru Pilates hizasıyla ön uyluk gücü oluşturur.' },
  { file: 'scissors_intro',           text: 'Aynı anda aşırı karın gücü ve hamstring esnekliği gerektiren ileri düzey yatar bacak makas hareketi.' },
  { file: 'rolling-like-a-ball_intro',text: 'Denge ve karın kontrolü geliştirirken sırt gerginliğini gideren, omurga için bir masaj.' },
  { file: 'teaser_intro',             text: 'Mat Pilatesin zirvesi: total merkez kontrolü, güç ve koordinasyon gerektiren tam vücut V dengesi.' },
  { file: 'plank_intro',              text: 'Total merkez stabilitesi, omuz gücü ve vücut hizası oluşturan tam vücut izometrik tutuş.' },
  { file: 'saw_intro',                text: 'Oblique gücü geliştirirken omurga, arka uyluk ve kalçaları germeye yarayan oturarak dönüş.' },
  { file: 'spine-twist_intro',        text: 'Omurgadaki gerginliği gideren ve döndürme merkez gücü oluşturan oturarak dönüş çalışması.' },
  { file: 'mermaid_intro',            text: 'Yan vücudu açan, omuz mobilitesini geliştiren ve gerginliği gideren güzel bir lateral esneme.' },
  { file: 'pilates-pushup_intro',     text: 'Ayakta duruştan aşağı yuvarlanan ve şınav çeken, total entegrasyonu test eden tam vücut sekansı.' },
];

// ── Full walkthrough (tüm adımlar tek seferde, numarasız) ─────────────────────
const fullData = [
  { file: 'the-hundred_full', text: 'Sırtüstü uzan, dizleri masa üstü pozisyonunda bük; baldırlar yere paralel olsun. Baş, boyun ve omuzları minderden kaldır; gözler dizlere yönelsin. Kolları yanlara uzat, minderden birkaç santimetre yukarıda tut. Beş harekette nefes al, beş harekette nefes ver. Kolların hareketi küçük ve ritmik olsun; karın merkezini omurgaya doğru çek. On nefes döngüsü tamamlayarak toplamda yüz tekrara ulaş.' },
  { file: 'roll-up_full',            text: 'Sırtüstü uzan, bacaklar birleşik ve uzatılmış; kollar başın üzerinde uzanmış. Nefes al; kolları tavana doğru kaldırırken çeneyi göğse doğru yuvarla. Omurgayı minderden omur omur soyarak oturmaya devam et. Üstte parmaklarını ayaklarına doğru uzan; derin bir esneme hisset. Nefes al; kontrollü biçimde geri yat.' },
  { file: 'single-leg-stretch_full', text: 'Sırtüstü uzan, her iki dizi de göğse çek; baş ve omuzlar minderden kalkık olsun. Sağ dizi göğse doğru çek; sağ eli bileğe, sol eli dize koy. Sol bacağı eş zamanlı olarak kırk beş dereceye uzat. Kontrollü şekilde bacakları değiştir: sağ bacak uzarken sol içeri çekilir. Nefes ritmi: iki değişimde nefes al, iki değişimde nefes ver.' },
  { file: 'double-leg-stretch_full', text: 'Sırtüstü uzan, her iki dizi de karnına çek; baş ve omuzlar minderden kalkık olsun. Nefes al: kolları başın üzerine, bacakları kırk beş dereceye uzat. Nefes ver: kolları dairesel hareketle geri getir, dizleri karnına çek. Uzanma boyunca bel omurgasını sıkıca mindere bastır.' },
  { file: 'criss-cross_full',        text: 'Sırtüstü uzan, elleri başın arkasında; her iki bacak masa üstü pozisyonunda. Baş ve omuzları minderden kaldır. Nefes al; sağ bacağı uzatırken sol omuzu sağ dize doğru döndür. Dönüşü tam bir nefes boyunca tut, ardından taraf değiştir. Boynu çekme; karın kaslarının çalışmasına izin ver.' },
  { file: 'leg-circles_full',        text: 'Sırtüstü uzan, sağ bacak tavana uzatılmış; sol bacak minderde uzun. Kollar yanlarda, denge için mindere bas. Sağ bacağı hafifçe vücudun üzerinden geçir; aşağı, yana ve başlangıç noktasına dön. Pelvisin kesinlikle kımıldamamasına dikkat et; sağa sola sallanma. Beş daire tamamla, ardından yönü tersine çevir.' },
  { file: 'swan_full',               text: 'Yüz üstü uzan, eller omuzların altında; dirsekler kaburga kafasına yakın. Nefes al; omurgayı nazik bir yay içinde uzatarak yukarı bas. Karın kaslarını aktif tut: sırttan kaldır, yalnızca kollarla değil. Üstte iki sayı tut, ardından yavaşça in. Boynu korumak için yukarıya değil, öne bak.' },
  { file: 'swimming_full',           text: 'Yüz üstü uzan, kollar ve bacaklar uzatılmış. Her iki kol ve bacağı minderden hafifçe kaldır. Dönüşümlü hareket et: sağ kol ile sol bacak yükselirken sol kol ile sağ bacak iner. Beş sayı nefes al, beş sayı nefes ver; ritmi koru. Hareket boyunca karın kaslarını minderden kaldırılmış tut.' },
  { file: 'cat-cow_full',            text: 'El ve dizler üzerinde başla; bilekler omuzların, dizler kalçaların altında. Nefes al: karnı mindere doğru bırak, göğüs ve kuyruk kemiği yukarı kalksın. Bu İnek pozisyonu. Nefes ver: omurgayı tavana doğru yuvarlat, çene ve pelvis içeri gelsin. Bu Kedi pozisyonu. Yavaş hareket et ve her pozisyonda tam nefes al.' },
  { file: 'spine-stretch_full',      text: 'Dik otur, bacaklar kalça genişliğinde açık ve uzatılmış; ayaklar gergin. Kolları omuz hizasında öne uzat. Nefes ver: omurgayı C eğrisi yaparak öne eğil, baş dizlere doğru gitsin. Nefes al ve omurgayı omur omur doğrult, dik otur.' },
  { file: 'bridge_full',             text: 'Sırtüstü uzan, dizler bükülü; ayak tabanları yerde, kalça genişliğinde açık. Kollar yanlarda, avuç içleri yere baksın. Nefes al; nefes vererek kalçaları yavaşça minderden kaldır. Diz, kalça ve omuzlar düz bir çizgi oluştursun. Üstte iki sayı tut; nefes alarak yavaşça geri in.' },
  { file: 'side-leg-lift_full',      text: 'Yan uzan, vücut düz bir çizgide; alt kol baş altında uzanmış. Üst el denge için önde mindere koy. Kalçaları üst üste tut; nefes vererek üst bacağı kalça hizasına kaldır. Nefes al ve kontrollü biçimde indir; bırakma. Dış kalçayı kullanmaya odaklan, beli değil.' },
  { file: 'inner-thigh-lift_full',   text: 'Yan uzan, üst ayağı alt bacağın önünde mindere koy. Alt bacak düz; alt kol baş altında uzanmış. Nefes al; nefes vererek alt bacağı üst ayağa doğru kaldır. İç uyluğu sık, üstte kısa bir süre tut. Mindere tam basmadan yavaşça indir.' },
  { file: 'side-kick_full',          text: 'Yan yat, vücut düz bir çizgide; alt eli başın altında, üst eli önünde minderde. Üst bacağı kalça hizasına kaldır. Nefes al: üst bacağı öne doğru götür. Nefes ver: bacağı kontrollü şekilde geri getir. Hareket boyunca pelvisin sabit kalmasına dikkat et.' },
  { file: 'pilates-squat_full',      text: 'Ayaklar kalça genişliğinde aç; parmak uçları kırk beş derece dışarıya dönük. Topukları kaldır ve ayak tabanında dengelen. Nefes al ve derin çömelmeye in; diz kapakları ayak parmaklarının üzerine gelsin. Hareket boyunca omurgayı uzun ve göğsü dik tut. Nefes vererek ayağa kalk. Setler arasında topukları yere indir.' },
  { file: 'scissors_full',           text: 'Sırtüstü uzan, her iki bacak tavana uzatılmış; baş ve omuzlar minderden kaldırılmış. Sağ bacağı her iki elle tut ve sol bacağı kırk beş dereceye indir. Sağ bacağı yüze doğru nazikçe iki kez esnet. Bacakları değiştir: sol bacak yüze, sağ bacak uzanır. Merkezi sıkı tut; boynu çekme.' },
  { file: 'rolling-like-a-ball_full',text: 'Minderin önüne otur, dizleri göğse çek; elleri bileklere koy. Ayakları minderden kaldır, kuyruk kemiği üzerinde dengelen. Omurgayı C eğrisi şeklinde yuvarlat; çene göğse değsin. Nefes al ve omuz küreklerine kadar geri yuvarlan. Boyuna kadar gitme! Nefes ver ve başlangıç dengesine geri yuvarlan.' },
  { file: 'teaser_full',             text: 'Sırtüstü uzan, kollar başın üzerinde uzatılmış; bacaklar birleşik. Nefes al; nefes vererek kolları ve bacakları eş zamanlı kaldırarak kuyruk kemiği üzerinde dengelen. Vücut V şekli oluştursun: bacaklar kırk beş derecede, kollar bacaklara paralel. Kontrollü biçimde iki sayı dengede kal. Nefes al; nefes vererek yavaşça geri yat.' },
  { file: 'plank_full',              text: 'Şınav pozisyonunda başla: eller omuzların altında, vücut baştan topuğa düz bir çizgide. Karın kaslarını içe çek, kalça kaslarını hafifçe sıkıştır. Kalçaları düz tut: ne çök ne de yukarı kalk. Süre boyunca düzenli nefes al; bakış eller arasına. Gerekirse dizleri yere koyarak hareketi kolaylaştırabilirsin.' },
  { file: 'saw_full',                text: 'Dik otur, bacaklar kalçadan geniş açık; kollar omuz hizasında yanlara uzatılmış. Nefes al, omurgayı uzat ve gövdeyi sağa döndür. Nefes ver: sol eli sağ ayak parmağına doğru ulaştır. Arka kol kaldırılır ve döner; üç kez ileri uzanma hareketi yap. Nefes al ve merkeze dön; sola tekrarla.' },
  { file: 'spine-twist_full',        text: 'Oturma kemikleri üzerinde dik otur, bacaklar birleşik ve uzatılmış; ayaklar gergin. Kollar omuz hizasında yanlara uzatılmış, avuç içleri aşağı. Nefes al ve omurgayı uzat; nefes vererek iki kısa dönüş hareketiyle sağa dön. Kalçaların sıkıca yere basmasına ve öne bakmasına dikkat et. Merkeze dön, ardından sola tekrarla.' },
  { file: 'mermaid_full',            text: 'Bacakları sola katlanmış şekilde otur. Sol el yanında minderde; sağ kol başın üzerine uzanmış. Nefes al; nefes vererek sağa eğil ve sol tarafın açıldığını hisset. Nefes al ve dik pozisyona dön; karşı tarafı germek için sağ kolu yukarı ve üzerine uzat. Tüm tekrarları tamamladıktan sonra taraf değiştir.' },
  { file: 'pilates-pushup_full',     text: 'Minderin tepesinde dik dur. Nefes al; nefes vererek aşağı yuvarlan ve elleri plank pozisyonuna doğru ilerlet. Dirsekler kaburga kafasına yakın olacak şekilde üç şınav çek. Elleri ayaklara geri yürüt; dizleri hafif bükük tut. Omur omur ayağa kalk.' },
];

const allItems = [...audioData, ...introData, ...fullData];
const outputDir = path.join(__dirname, '../assets/audio');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

let completed = 0;
let failed = 0;
for (const item of allItems) {
  const outFile = path.join(outputDir, `${item.file}.mp3`);
  if (fs.existsSync(outFile)) {
    console.log(`⏭  Skipping (exists): ${item.file}`);
    completed++;
    continue;
  }
  try {
    execSync(
      `edge-tts --voice tr-TR-EmelNeural --text "${item.text.replace(/"/g, '\\"')}" --write-media "${outFile}"`,
      { stdio: 'pipe' }
    );
    completed++;
    console.log(`✅ ${completed}/${allItems.length} — ${item.file}`);
  } catch (err) {
    failed++;
    console.error(`❌ Failed: ${item.file}`, err.message);
  }
}
console.log(`\n🎉 Done! ${completed}/${allItems.length} audio files generated. ${failed > 0 ? `${failed} failed.` : 'No failures.'}`);
