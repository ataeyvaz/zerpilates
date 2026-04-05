"""
Generates Turkish TTS audio files for all Pilates exercises using edge-tts.
Voice: tr-TR-EmelNeural (Microsoft Neural TTS, free, no API key)

Output structure:
  src/assets/audio/<exercise-id>.mp3          ← exercise name + description
  src/assets/audio/<exercise-id>-step-N.mp3   ← each instruction step
  src/assets/audio/<exercise-id>-tips.mp3     ← tips (if any)

Run:
  python scripts/generateAudio.py
"""

import asyncio
import os
import edge_tts

VOICE = "tr-TR-EmelNeural"
OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "src", "assets", "audio")

# ── Exercise data (mirrors exercises.ts) ─────────────────────────────────────

EXERCISES = [
    {
        "id": "the-hundred",
        "name": "Yüzler",
        "description": "Derin karın ısısı ve nefes kontrolü oluşturan, Pilates'in simgesi olan ısınma hareketi.",
        "instructions": [
            "Sırtüstü uzan, dizleri masa üstü pozisyonunda bük, baldırlar yere paralel.",
            "Baş, boyun ve omuzları minderden kaldır, gözler dizlere baksın.",
            "Kolları yanlara uzat, minderden birkaç santim yukarıda tut.",
            "Beş kol pompasında nefes al, beş kol pompasında ver.",
            "Pompaları küçük ve ritmik tut, merkezi omurgaya doğru çek.",
            "On nefes döngüsü tamamlayarak toplamda yüz pompa ulaş.",
        ],
        "tips": [
            "Bel omurgasını hareket boyunca mindere bastır.",
            "İleri düzey: daha fazla zorluk için bacakları kırk beş dereceye uzat.",
        ],
    },
    {
        "id": "roll-up",
        "name": "Yuvarlanarak Kalkış",
        "description": "Karın kaslarını güçlendiren ve omurga esnekliğini artıran yavaş, eklemli bir omurga yuvarlanması.",
        "instructions": [
            "Düz uzan, bacaklar birleşik, kollar başın üzerinde uzanmış.",
            "Nefes al; kolları tavana doğru kaldırırken çeneyi göğse doğru yuvarla.",
            "Omurgayı minderden omur omur soyarak oturmaya devam et.",
            "Yukarıda parmaklarını ayaklarına doğru uzan, derin arka uyluk gerimi hisset.",
            "Üstte nefes al; kontrollü biçimde geri yat.",
        ],
        "tips": ["Yavaş daha zordur, ivme kullanma isteğine direniş göster."],
    },
    {
        "id": "single-leg-stretch",
        "name": "Tek Bacak Germe",
        "description": "Karın kaslarını çapraz koordinasyon modeliyle zorlayan, dönüşümlü bacak uzatmaları.",
        "instructions": [
            "Sırtüstü uzan, her iki dizi de göğse çek, baş ve omuzlar kalkık.",
            "Sağ dizi içeri çek; sağ el bileğe, sol el dize koy.",
            "Sol bacağı eş zamanlı olarak kırk beş dereceye uzat.",
            "Kontrollü şekilde bacakları değiştir; sağ bacak uzarken sol içeri çekilir.",
            "İki değişimde nefes al, iki değişimde ver.",
        ],
        "tips": [],
    },
    {
        "id": "double-leg-stretch",
        "name": "Çift Bacak Germe",
        "description": "Kolları ve bacakları merkezden uzaklaştırıp geri bir araya getiren güçlü bir merkez egzersizi.",
        "instructions": [
            "Sırtüstü uzan, her iki dizi de karnına çek, baş ve omuzlar kalkık.",
            "Nefes al: kolları başın üzerine, bacakları kırk beş dereceye uzat.",
            "Nefes ver: kolları dairesel hareketle geri getir, dizleri karnına çek.",
            "Uzanma boyunca bel omurgasını sıkıca mindere bas.",
        ],
        "tips": [],
    },
    {
        "id": "criss-cross",
        "name": "Çapraz Mekik",
        "description": "Yan karın kaslarını hedef alan döndürme egzersizi. Düz ve sıkı bir belin temel hareketi.",
        "instructions": [
            "Sırtüstü uzan, elleri başın arkasında, her iki bacak masa üstü pozisyonunda.",
            "Baş ve omuzları minderden kaldır.",
            "Nefes al; sağ bacağı uzatırken sol omuzu sağ dize doğru döndür.",
            "Rotasyonu tam bir nefes boyunca tut, ardından taraf değiştir.",
            "Boynu çekme, karın kaslarının çalışmasına izin ver.",
        ],
        "tips": [],
    },
    {
        "id": "leg-circles",
        "name": "Bacak Çemberleri",
        "description": "Bir bacak, pelvis tamamen hareketsizken kalça eklemini harekete geçirmek için büyük daireler çizer.",
        "instructions": [
            "Sırtüstü uzan, sağ bacak tavana uzatılmış, sol bacak minderde uzun.",
            "Kollar yanlarda, stabilite için mindere bas.",
            "Sağ bacağı hafifçe vücudun üzerinden geçir; aşağı, yana ve başa dön.",
            "Pelvisin kesinlikle kımıldamamasına dikkat et, sağa sola sallanma.",
            "Beş daire tamamla, ardından yönü tersine çevir.",
        ],
        "tips": [],
    },
    {
        "id": "swan",
        "name": "Kuğu",
        "description": "Göğsü açan, omurga ekstansörlerini güçlendiren ve oturmanın etkilerini dengeleyen bir sırt uzatma egzersizi.",
        "instructions": [
            "Yüz üstü uzan, eller omuzların altında, dirsekler kaburga kafasına yakın.",
            "Nefes al; omurgayı nazik bir yay içinde uzatarak yukarı bas.",
            "Karın kaslarını aktif tut, sırttan kaldır yalnızca kollarla değil.",
            "Üstte iki sayı tut, ardından yavaşça in.",
            "Boynu korumak için yukarıya değil, öne bak.",
        ],
        "tips": ["Başının tepesini öne ve yukarıya doğru çeken bir ip hayal et."],
    },
    {
        "id": "swimming",
        "name": "Yüzme",
        "description": "Tüm arka zinciri güçlendiren, yüz üstü pozisyonunda dönüşümlü kol ve bacak kaldırmaları.",
        "instructions": [
            "Yüz üstü uzan, kollar ve bacaklar uzatılmış.",
            "Her iki kol ve bacağı minderden hafifçe kaldır.",
            "Dönüşümlü kol ve bacak: sağ kol sol bacak yükselir; sol kol sağ bacak yükselir.",
            "Beş sayı nefes al, beş sayı ver; ritmi koru.",
            "Hareket boyunca karın kaslarını minderden kaldırılmış tut.",
        ],
        "tips": [],
    },
    {
        "id": "cat-cow",
        "name": "Kedi ve İnek",
        "description": "Sırtı ısıtan, gerginliği gideren ve bölümsel mobiliteyi artıran nazik bir omurga dalgası.",
        "instructions": [
            "El ve dizler üzerinde başla; bilekler omuzların, dizler kalçaların altında.",
            "Nefes al: karnı mindere doğru bırak, göğüs ve kuyruk kemiği yukarı. İnek pozu.",
            "Nefes ver: omurgayı tavana doğru yuvarlat, çene ve pelvis içeri. Kedi pozu.",
            "Yavaş hareket et ve her pozisyonda tam nefes al.",
        ],
        "tips": [],
    },
    {
        "id": "spine-stretch",
        "name": "Öne Omurga Germe",
        "description": "Omurgayı dekomprese eden ve arka uyluk kaslarını ile sırt ekstansörlerini derin biçimde geren oturarak öne eğilme.",
        "instructions": [
            "Dik otur, bacaklar kalça genişliğinde uzatılmış, ayaklar flekste.",
            "Kollar omuz hizasında öne uzanmış.",
            "Nefes al ve uzun dur; nefes ver, karın kaslarını içe çek ve öne yuvarlan.",
            "Parmak uçlarını ayak parmaklarının ötesine ulaştır, baş kolların arasına düşsün.",
            "Nefes al ve omurgayı dik pozisyona geri yığ.",
        ],
        "tips": [],
    },
    {
        "id": "bridge",
        "name": "Omuz Köprüsü",
        "description": "Kalça ve sırtı güçlendiren klasik egzersiz. Omurgayı bölüm bölüm hareket ettirir.",
        "instructions": [
            "Sırtüstü uzan, dizler bükük, ayaklar kalça genişliğinde, kollar yanlarda uzun.",
            "Nefes al; nefes vererek ayakların üzerinden baskı yaparak kalçaları kaldır.",
            "Kuyruk kemiğinden başlayarak omurgayı minderden soy; diyagonal bir çizgi oluştur.",
            "Üstte iki sayı tut; nefes al.",
            "Nefes vererek omur omur geri yat.",
        ],
        "tips": [],
    },
    {
        "id": "side-leg-lift",
        "name": "Yan Bacak Kaldırma",
        "description": "Kalça abduktörünü ve gluteus mediusu izole eden, ince ve sıkı bacaklar için yanda yatar tekme serisi hareketi.",
        "instructions": [
            "Yan uzan, vücut düz bir çizgide, alt kol baş altında uzanmış.",
            "Üst el denge için önde mindere koy.",
            "Kalçaları üst üste tut; nefes vererek üst bacağı kalça hizasına kaldır.",
            "Nefes al ve kontrollü biçimde indir, bırakma.",
            "Dış kalçayı kullanmaya odaklan, bel değil.",
        ],
        "tips": [],
    },
    {
        "id": "inner-thigh-lift",
        "name": "İç Uyluk Kaldırma",
        "description": "Genellikle ihmal edilen iç uyluk kaslarını hedef alırken yanda yatar merkez stabilitesi geliştirir.",
        "instructions": [
            "Yan uzan, üst ayağı alt bacağın önünde mindere koy.",
            "Alt bacak düz, alt kol baş altında uzanmış.",
            "Nefes al; nefes vererek alt bacağı üst ayağa doğru kaldır.",
            "İç uyluğu sık, üstte kısa bir süre tut.",
            "Mindere tam basmadan yavaşça indir.",
        ],
        "tips": [],
    },
    {
        "id": "side-kick",
        "name": "Yan Tekme",
        "description": "Üst bacağı ileri ve geri sallayan, kalça mobilitesini artıran ve tüm bacağı tonlayan yanda yatar tekme.",
        "instructions": [
            "Yan uzan, dirsek üzerine dayan, vücut düz bir diyagonalde.",
            "Üst bacağı kalça hizasına kaldır; ayağı flekste tut.",
            "Nefes al: bacağı öne sallarken çift küçük nabız yap.",
            "Nefes ver: bacağı parmak ucu uzatılmış şekilde geri süpür, kalça kasını sık.",
            "Sallanma boyunca pelvisin sabit kalmasını sağla.",
        ],
        "tips": [],
    },
    {
        "id": "pilates-squat",
        "name": "Pilates Çömelme",
        "description": "Topuklar kalkık ve omurga uzatılmış derin çömelme; doğru Pilates hizasıyla ön uyluk gücü oluşturur.",
        "instructions": [
            "Ayaklar kalça genişliğinde, parmak uçları kırk beş derece dışarıya dön.",
            "Topukları kaldır ve ayak tabanında dengelen.",
            "Nefes al ve derin çömelmeye in; diz kapakları ayak parmaklarının üzerine gelsin.",
            "Hareket boyunca omurgayı uzun ve göğsü dik tut.",
            "Nefes vererek ayakta durumuna geri bas. Setler arasında topukları indir.",
        ],
        "tips": [],
    },
    {
        "id": "scissors",
        "name": "Makas",
        "description": "Aynı anda aşırı karın gücü ve arka uyluk esnekliği gerektiren ileri düzey yatar bacak makas hareketi.",
        "instructions": [
            "Sırtüstü uzan, her iki bacak tavana uzatılmış, baş ve omuzlar kaldırılmış.",
            "Sağ bacağı her iki elle tut ve sol bacağı kırk beş dereceye indir.",
            "Sağ bacağı yüze doğru nazikçe iki kez nabız yap.",
            "Değiştir: sol bacak yüze, sağ bacak uzanır.",
            "Merkezi sıkı tut; boynu çekme.",
        ],
        "tips": [],
    },
    {
        "id": "rolling-like-a-ball",
        "name": "Top Gibi Yuvarlanma",
        "description": "Denge ve karın kontrolü geliştirirken sırt gerginliğini gideren, omurga için bir masaj.",
        "instructions": [
            "Minderin önüne otur, dizleri göğse çek, elleri bileklere koy.",
            "Ayakları minderden kaldır, kuyruk kemiği üzerinde dengelen.",
            "Omurgayı C eğrisi şeklinde yuvarla, çene göğse.",
            "Nefes al ve omuz küreğine doğru geri yuvarlan, boyuna değil.",
            "Nefes ver ve dengeye geri yuvarlan.",
        ],
        "tips": ["Hiçbir zaman boyuna yuvarlanma, omuz küreğinde dur."],
    },
    {
        "id": "teaser",
        "name": "Teaser",
        "description": "Mat Pilates'in zirvesi. Total merkez kontrolü, güç ve koordinasyon gerektiren tam vücut V dengesi.",
        "instructions": [
            "Düz uzan, kollar başın üzerinde, bacaklar birleşik.",
            "Nefes al; nefes ver ve kolları ile bacakları eş zamanlı kaldırarak kuyruk kemiği üzerinde dengelen.",
            "Vücut V şekli oluşturur: bacaklar kırk beş derecede, kollar bacaklara paralel.",
            "Kontrollü dengeleyerek iki sayı tut.",
            "Nefes al; nefes vererek kontrollü biçimde geri yat.",
        ],
        "tips": [],
    },
    {
        "id": "plank",
        "name": "Pilates Plank",
        "description": "Total merkez stabilitesi, omuz gücü ve vücut hizası oluşturan tam vücut izometrik tutuş.",
        "instructions": [
            "Şınav pozisyonunda başla: eller omuzların altında, vücut düz bir çizgide.",
            "Karın kaslarını sık, kalça kaslarını hafifçe sıkıştır.",
            "Kalçaları düz tut, ne çök ne de yukarı kalk.",
            "Süre boyunca düzenli nefes al; bakış eller arasına.",
            "Kalça hizasını koruyarak dizlere inerek modifiye edebilirsin.",
        ],
        "tips": [],
    },
    {
        "id": "saw",
        "name": "Testere",
        "description": "Yan karın gücü geliştirirken omurga, arka uyluk ve kalçaları germeye yarayan oturarak dönüş.",
        "instructions": [
            "Dik otur, bacaklar kalçadan biraz geniş açık, kollar omuz hizasında yanlara uzatılmış.",
            "Nefes al, dik dur ve gövdeyi sağa döndür.",
            "Nefes ver: sol eli sağ el ayak parmağına doğru ulaştır.",
            "Arka kol kaldırılır ve döner; nefeste üç kez ileri nabız yap.",
            "Nefes al ve merkeze dön; sola tekrarla.",
        ],
        "tips": [],
    },
    {
        "id": "spine-twist",
        "name": "Omurga Dönüşü",
        "description": "Omurgadaki gerginliği gideren ve döndürme merkez gücü oluşturan oturarak dönüş çalışması.",
        "instructions": [
            "Oturma kemikleri üzerinde dik otur, bacaklar birleşik ve uzatılmış, ayaklar flekste.",
            "Kollar omuz hizasında yanlara uzatılmış, avuç içleri aşağı.",
            "Nefes al ve uzan; nefes vererek iki kısa nabızla sağa döndür.",
            "Kalçaların sıkıca yere basmasını ve öne bakmasını sağla.",
            "Merkeze dön, ardından sola tekrarla.",
        ],
        "tips": [],
    },
    {
        "id": "mermaid",
        "name": "Denizkızı Germe",
        "description": "Yan vücudu açan, omuz mobilitesini geliştiren ve gerginliği gideren güzel bir lateral esneme.",
        "instructions": [
            "Bacakları sola katlanmış şekilde otur.",
            "Sol el yanında minderde, sağ kol başın üzerine uzanmış.",
            "Nefes al; nefes vererek sağa eğil, sağ kolu üzerinden uzan ve sol tarafın açıldığını hisset.",
            "Nefes al ve dik pozisyona dön; karşı germe için sağ kolu yukarı ve üzerine uzat.",
            "Tüm tekrarları tamamladıktan sonra taraf değiştir.",
        ],
        "tips": [],
    },
    {
        "id": "pilates-pushup",
        "name": "Pilates Şınav",
        "description": "Ayakta duruştan aşağı yuvarlanan ve şınav çeken, total entegrasyonu test eden tam vücut sekansı.",
        "instructions": [
            "Minderin tepesinde dik dur.",
            "Nefes al; nefes vererek aşağı yuvarlan, elleri plank pozisyonuna yürüt.",
            "Dirsekler kaburga kafasına yakın üç şınav çek.",
            "Elleri ayaklara geri yürüt, dizleri hafif bükük tut.",
            "Omur omur ayağa kalk.",
        ],
        "tips": [],
    },
]

# ── TTS generation ────────────────────────────────────────────────────────────

async def speak(text: str, path: str):
    """Generate a single MP3 file."""
    communicate = edge_tts.Communicate(text, VOICE)
    await communicate.save(path)
    size = os.path.getsize(path) // 1024
    print(f"  OK  {os.path.basename(path)}  ({size} KB)")


async def generate_all():
    os.makedirs(OUT_DIR, exist_ok=True)
    total = 0

    for ex in EXERCISES:
        ex_id = ex["id"]
        print(f"\n>> {ex['name']}  ({ex_id})")

        # 1. Intro: name + description
        intro_text = f"{ex['name']}. {ex['description']}"
        await speak(intro_text, os.path.join(OUT_DIR, f"{ex_id}.mp3"))
        total += 1

        # 2. Each instruction step
        for i, step in enumerate(ex["instructions"], start=1):
            step_text = f"Adım {i}. {step}"
            await speak(step_text, os.path.join(OUT_DIR, f"{ex_id}-step-{i}.mp3"))
            total += 1

        # 3. Tips (if any)
        if ex.get("tips"):
            tips_text = "İpuçları. " + " ".join(ex["tips"])
            await speak(tips_text, os.path.join(OUT_DIR, f"{ex_id}-tips.mp3"))
            total += 1

    print(f"\nTamamlandi  {total} dosya oluşturuldu → src/assets/audio/")


if __name__ == "__main__":
    asyncio.run(generate_all())
