
<p align="center">
  <img src="https://raw.githubusercontent.com/reworkd/AgentGPT/main/next/public/banner.png" height="300" alt="AgentGPT Logosu"/>
</p>
<p align="center">
  <em>🤖 Tarayıcınızda otomatik AI Ajanlarını yapılandırın, yapılandırın ve dağıtın. 🤖   </em>
</p>
<p align="center">
    <img alt="Node sürümü" src="https://img.shields.io/static/v1?label=node&message=%20%3E=18&logo=node.js&color=2334D058" />
      <a href="https://github.com/reworkd/AgentGPT/blob/master/README.md"><img src="https://img.shields.io/badge/lang-İngilizce-mavi.svg" alt="İngilizce"></a>
  <a href="https://github.com/reworkd/AgentGPT/blob/master/docs/README.zh-HANS.md"><img src="https://img.shields.io/badge/lang-Çince-red.svg" alt="Çince"></a>
  <a href="https://github.com/reworkd/AgentGPT/blob/master/docs/README.hu-Cs4K1Sr4C.md"><img src="https://img.shields.io/badge/lang-Macarca-red.svg" alt="Macarca"></a>
</p>

<p align="center">
<a href="https://agentgpt.reworkd.ai">🔗 Kısa bağlantı</a>
<span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
<a href="https://docs.reworkd.ai/">📚 Belgeler</a>
<span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
<a href="https://docs.reworkd.ai/essentials/contributing">🤝 Katkı Sağlayın</a>
<span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
<a href="https://twitter.com/reworkdai">🐦 Twitter</a>
<span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
<a href="https://discord.gg/gcmNyAAFfV">📢 Discord</a>
</p>

AgentGPT, Otomatik AI ajanlarını yapılandırmanıza ve dağıtmanıza olanak tanır.
Kendi özel AI'nızı adlandırın ve onu hayal edilebilecek herhangi bir hedefe gönderin.
Hedefe ulaşmaya çalışacak, yapılacak görevler düşünerek, bunları gerçekleştirerek ve sonuçlardan öğrenerek 🚀.

---

## ✨ Demo
En iyi demo deneyimi için [sitemizi](https://agentgpt.reworkd.ai) doğrudan ziyaret edin :)

[Demo Videosu](https://github.com/reworkd/AgentGPT/assets/50181239/5348e44a-29a5-4280-a06b-fe1429a8d99e)

## 👨‍🚀 Başlarken

AgentGPT'ye başlamak için en kolay yol, projeye dahil edilmiş otomatik kurulum CLI'sıdır.
CLI, AgentGPT için aşağıdaki ayarları yapar:
- 🔐 [Ortam değişkenleri](https://github.com/reworkd/AgentGPT/blob/main/.env.example) (ve API Anahtarları)
- 🗂️ [Veritabanı](https://github.com/reworkd/AgentGPT/tree/main/db) (Mysql)
- 🤖 [Arka uç](https://github.com/reworkd/AgentGPT/tree/main/platform) (FastAPI)
- 🎨 [Ön yüz](https://github.com/reworkd/AgentGPT/tree/main/next) (Nextjs)

## Önkoşullar :point_up:

Başlamadan önce lütfen aşağıdaki kurulumların yapıldığından emin olun:

- Seçtiğiniz bir metin düzenleyici. Örneğin, [Visual Studio Code (VS Code)](https://code.visualstudio.com/download)
- [Node.js](https://nodejs.org/en/download)
- [Git](https://git-scm.com/downloads)
- [Docker](https://www.docker.com/products/docker-desktop). Kurulumdan sonra lütfen bir hesap oluşturun, Docker uygulamasını açın ve oturum açın.
- [OpenAI API anahtarı](https://platform.openai.com/signup)
- [Serper API Anahtarı](https://serper.dev/signup) (isteğe bağlı)
- [Replicate API Token](https://replicate.com/signin) (isteğe bağlı)

## Başlangıç :rocket:
1. **Düzenleyiciyi Açın**

2. **Terminali Açın** - Genellikle bunu 'Terminal' sekmesinden veya bir kısayol kullanarak yapabilirsiniz
   (örn. VS Code'da Windows için `Ctrl + ~` veya Mac için `Control + ~`).

3. **Depoyu Klonlayın ve Dizine Gezinin** - Terminaliniz açıldığında, aşağıdaki komutları çalıştırarak depoyu klonlayabilir ve dizine geçebilirsiniz.

   **Mac/Linux kullanıcıları için** :apple: :penguin:
   ```bash
   git clone https://github.com/reworkd/AgentGPT.git
   cd AgentGPT
   ./setup.sh
   ```
   **Windows kullanıcıları için** :windows:
   ```bash
   git clone https://github.com/reworkd/AgentGPT.git
   cd AgentGPT
   ./setup.bat
   ```
4. **Komut dosyasındaki kurulum talimatlarını takip edin** - uygun API anahtarlarını ekleyin ve tüm hizmetler çalışır durumdayken [http://localhost:3000](http://localhost:3000) adresine web tarayıcınızdan gidin.

Keyifli kodlamalar! :tada:

## 🎉 Yol Haritası

Bu platform şu anda beta aşamasında, tamamlanmış ve planlanmış özelliklerin tam listesi
bizim [genel yol haritamızda](https://docs.reworkd.ai/essentials/roadmap) bulunabilir.

## 🚀 Teknoloji Yığını

- ✅ **Bootstrapping**: [create-t3-app](https://create.t

3.gg) + [FastAPI-template](https://github.com/s3rius/FastAPI-template).
- ✅ **Çerçeve**: [Nextjs 13 + Typescript](https://nextjs.org/) + [FastAPI](https://fastapi.tiangolo.com/)
- ✅ **Kimlik Doğrulama**: [Next-Auth.js](https://next-auth.js.org)
- ✅ **ORM**: [Prisma](https://prisma.io) & [SQLModel](https://sqlmodel.tiangolo.com/).
- ✅ **Veritabanı**: [Planetscale](https://planetscale.com/).
- ✅ **Stil**: [TailwindCSS + HeadlessUI](https://tailwindcss.com).
- ✅ **Şema Doğrulama**: [Zod](https://github.com/colinhacks/zod) + [Pydantic](https://docs.pydantic.dev/).
- ✅ **LLM Aracı**: [Langchain](https://github.com/hwchase17/langchain).

<h2 align="center">
💝 GitHub sponsorlarımız 💝
</h2>

<p align="center">
Sınırları zorlayan açık kaynaklı bir projeyi desteklemek için bize katılın! Sponsorluğunuz, kaynakları genişletmemize, özellikleri ve işlevselliği geliştirmemize ve bu heyecan verici projeyi devam ettirmemize yardımcı olarak ilerlememizi sağlar! 🚀
</p>

<p align="center">
<!-- sponsors --><a href="https://github.com/arthurbnhm"><img src="https://github.com/arthurbnhm.png" width="60px" alt="Arthur" /></a><a href="https://github.com/mrayonnaise"><img src="https://github.com/mrayonnaise.png" width="60px" alt="Matt Ray" /></a><a href="https://github.com/jd3655"><img src="https://github.com/jd3655.png" width="60px" alt="Vector Ventures" /></a><a href="https://github.com/durairajasivam"><img src="https://github.com/durairajasivam.png" width="60px" alt="" /></a><a href="https://github.com/floriank"><img src="https://github.com/floriank.png" width="60px" alt="Florian Kraft" /></a><a href="https://github.com/localecho"><img src="https://github.com/localecho.png" width="60px" alt="" /></a> 
 <a href="https://github.com/SnmzTony"><img src="https://github.com/SnmzTony.png" width="60px" alt="" /></a <a href="https://github.com/fireheat135"><img src="https://github.com/fireheat135.png" width="60px" alt="" /></a><a href="https://github.com/zoelidity"><img src="https://github.com/zoelidity.png" width="60px" alt="Zoe" /></a><a href="https://github.com/busseyl"><img src="https://github.com/busseyl.png" width="60px" alt="Lucas Bussey" /></a><a href="https://github.com/DuanChaori"><img src="https://github.com/DuanChaori.png" width="60px" alt="" /></a><a href="https://github.com/jukwaphil1"><img src="https://github.com/jukwaphil1.png" width="60px" alt="" /></a><a href="https://github.com/lisa-ee"><img src="https://github.com/lisa-ee.png" width="60px" alt="Lisa" /></a><a href="https://github.com/VulcanT"><img src="https://github.com/VulcanT.png" width="60px" alt="" /></a><a href="https://github.com/kman62"><img src="https://github.com/kman62.png" width="60px" alt="kmotte" /></a><a href="https://github.com/Haithamhaj"><img src="https://github.com/Haithamhaj.png" width="60px" alt="" /></a><a href="https://github.com/SwftCoins"><img src="https://github.com/SwftCoins.png" width="60px" alt="SWFT Blockchain" /></a><a href="https://github.com/ChevalierzA"><img src="https://github.com/ChevalierzA.png" width="60px" alt="" /></a><a href="https://github.com/research-developer"><img src="https://github.com/research-developer.png" width="60px" alt="" /></a><a href="https://github.com/Mitchell-Coder-New"><img src="https://github.com/Mitchell-Coder-New.png" width="60px" alt="" /></a><a href="https://github.com/Trecares"><img src="https://github.com/Trecares.png" width="60px" alt="" /></a><a href="https://github.com/nnkostov"><img src="https://github.com/nnkostov.png" width="60px" alt="Nikolay Kostov" /></a><a href="https://github.com/oryanmoshe"><img src="https://github.com/oryanmoshe.png" width="60px" alt="Oryan Moshe" /></a><a href="https://github.com/ClayNelson"><img src="https://github.com/ClayNelson.png" width="60px" alt="Clay Nelson" /></a><a href="https://github.com/0xmatchmaker"><img src="https://github.com/0xmatchmaker.png" width="60px" alt="0xmatchmaker" /></a><a href="https://github.com/carlosbartolomeu"><img src="https://github.com/carlosbartolomeu.png" width="60px" alt="" /></a><a href="https://github.com/Agronobeetles"><img src="https://github.com/Agronobeetles.png" width="60px" alt="" /></a><a href="https://github.com/CloudyGuyThompson"><img src="https://github.com/CloudyGuyThompson.png" width="60px" alt="Guy Thompson" /></a><a href="https://github.com/Jhonvolt17"><img src="https://github.com/Jhonvolt17.png" width="60px" alt="" /></a><a href="https://github.com/sirswali"><img src="https://github.com/sirswali.png" width="60px" alt="Vusi Dube" /></a><a href="https://github.com/Tweezamiza"><img src="https://github.com/Tweezamiza.png" width="60px" alt="" /></a><a href="https://github.com/DixonFyre"><img src="https://github.com/DixonFyre.png" width="60px" alt="" /></a><a href="https://github.com/jenius-eagle"><img src="https://github.com/jenius-eagle.png" width="60px" alt="" /></a><a href="https://github.com/CubanCongaMan"><img src="https://github.com/CubanCongaMan.png" width="60px" alt="Roberto Luis Sanchez, P.E., P.G.; D,GE; F.ASCE" /></a><a href="https://github.com/cskrobec"><img src="https://github.com/cskrobec.png" width="60px" alt="" /></a><a href="https://github.com/Jahmazon"><img src="https://github.com/Jahmazon.png" width="60px" alt="" /></a><a href="https://github.com/ISDAworld"><img src="https://github.com/ISDAworld.png" width="60px" alt="David Gammond" /></a><a href="https://github.com/lazzacapital"><img src="https://github.com/lazzacapital.png" width="60px" alt="Lazza Capital" /></a><a href="https://github.com/OptionalJoystick"><img src="https://github.com/OptionalJoystick.png" width="60px" alt="" /></a><a href="https://github.com/rodolfoguzzi"><img src="https://github.com/rodolfoguzzi.png" width="60px" alt="" /></a><a href="https://github.com/bluecat2210"><img src="https://github.com/bluecat2210.png" width="60px" alt="" /></a><a href="https://github.com/dactylogram9"><img src="https://github.com/dactylogram9.png" width="60px" alt="" /></a><a href="https://github.com/RUFreeJAC63"><img src="https://github.com/RUFreeJAC63.png" width="60px" alt="" /></a><a href="https://github.com/cecilmiles"><img src="https://github.com/cecilmiles.png" width="60px" alt="" /></a><a href="https://github.com/Djarielm007"><img src="https://github.com/Djarielm007.png" width="60px" alt="" /></a><a href="https://github.com/mikenj07"><img src="https://github.com/mikenj07.png" width="60px" alt="" /></a><a href="https://github.com/SvetaMolusk"><img src="https://github.com/SvetaMolusk.png" width="60px" alt="" /></a><a href="https://github.com/wuminkung"><img src="https://github.com/wuminkung.png" width="60px" alt="" /></a><a href="https://github.com/zhoumo1221"><img src="https://github.com/zhoumo1221.png" width="60px" alt="" /></a><a href="https://github.com/Stefan6666XXX"><img src="https://github.com/Stefan6666XXX.png" width="60px" alt="Stephane DeGuire" /></a><a href="https://github.com/lyska"><img src="https://github.com/lyska.png" width="60px" alt="Lyska" /></a><a href="https://github.com/KurganKolde"><img src="https://github.com/KurganKolde.png" width="60px" alt="" /></a><a href="https://github.com/sclappccsu"><img src="https://github.com/sclappccsu.png" width="60px" alt="Sharon Clapp at CCSU" /></a><a href="https://github.com/Rooba-Finance"><img src="https://github.com/Rooba-Finance.png" width="60px" alt="Rooba.Finance" /></a><a href="https://github.com/ferienhausmiete"><img src="https://github.com/ferienhausmiete.png" width="60px" alt="" /></a><a href="https://github.com/benjaminbales"><img src="https://github.com/benjaminbales.png" width="60px" alt="Benjamin Bales" /></a><a href="https://github.com/pimentel233"><img src="https://github.com/pimentel233.png" width="60px" alt="" /></a><a href="https://github.com/PinkyWobbles"><img src="https://github.com/PinkyWobbles.png" width="60px" alt="" /></a><a href="https://github.com/jconroy11"><img src="https://github.com/jconroy11.png" width="60px" alt="" /></a><a href="https://github.com/DavidJamesRotenberg"><img src="https://github.com/DavidJamesRotenberg.png" width="60px" alt="" /></a><a href="https://github.com/antecochat"><img src="https://github.com/antecochat.png" width="60px" alt="" /></a><a href="https://github.com/RealBonOfaSitch"><img src="https://github.com/RealBonOfaSitch.png" width="60px" alt="" /></a><!-- sponsors -->
</p> 

<h2 align="center">
💪 Katkıda Bulunanlar 💪
</h2>

<p align="center">
Bu projeyi mümkün kılan katkıda bulunanlarımıza teşekkür ederiz! 🙏
</p>

<a href="https://github.com/reworkd/agentgpt/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=reworkd/agentgpt" />
</a>

<div align="center">
<sub><a href="https://contrib.rocks">contrib.rocks</a> ile oluşturuldu.</sub>
</div>
