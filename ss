[33mcommit 29b81714902c68cca4943a333592131cb97ac94d[m[33m ([m[1;36mHEAD -> [m[1;32mmain[m[33m)[m
Author: Sugandh Madusudana <smadusud@radisys.com>
Date:   Wed Apr 12 11:58:50 2023 +0530

    Done some changes

[33mcommit c7f1dac4e3d01937e455af4b148715c8cba97ed2[m[33m ([m[1;31morigin/main[m[33m, [m[1;31morigin/HEAD[m[33m)[m
Author: Asim Shrestha <asim.shrestha@hotmail.com>
Date:   Tue Apr 11 21:52:09 2023 -0700

    🤖 Update loop

[33mcommit e1e8020f8e0455f32eb8564f7282e0bcbe92cd1a[m
Author: Asim Shrestha <50181239+asim-shrestha@users.noreply.github.com>
Date:   Tue Apr 11 21:26:25 2023 -0700

    Update README.md

[33mcommit f71635243502ceb657a38ab7f10c36637d17f766[m
Author: awtkns <hello@awtkns.com>
Date:   Wed Apr 12 06:57:29 2023 +0300

    :mag: Improve SEO

[33mcommit 3c452291f32557b2c9f8f1ea6328d5d9a64115c0[m
Merge: 5a4a135 26828b1
Author: Adam Watkins <hello@awtkns.com>
Date:   Wed Apr 12 05:28:48 2023 +0200

    Merge pull request #34 from reworkd/docker
    
    :sparkles: Improve docker configuration

[33mcommit 5a4a135f46ffbef791f09833185005542d3d4dff[m
Merge: 559c2f4 933fccd
Author: Adam Watkins <hello@awtkns.com>
Date:   Wed Apr 12 05:26:23 2023 +0200

    Merge pull request #28 from Frajder/main
    
    Add Docker support for easier setup and deployment

[33mcommit 26828b1ffecaa1c04f4acf06e9d6bc25627bf834[m
Author: awtkns <hello@awtkns.com>
Date:   Wed Apr 12 06:25:47 2023 +0300

    :sparkles: Add docker configuration

[33mcommit 559c2f4304e4d32528cde86d381ee246c385a8c5[m
Author: Asim Shrestha <asim.shrestha@hotmail.com>
Date:   Tue Apr 11 18:51:28 2023 -0700

    💄 Update wording on errors

[33mcommit 46b1e6b8f06e298b5d093bae8882c94faf9ee2d1[m
Author: Asim Shrestha <asim.shrestha@hotmail.com>
Date:   Tue Apr 11 18:35:42 2023 -0700

    💄 Update wording

[33mcommit e206a855f44e0ffe396b1fe1ed50aa046285dc0d[m
Author: Asim Shrestha <asim.shrestha@hotmail.com>
Date:   Tue Apr 11 18:22:56 2023 -0700

    💄 Update styling

[33mcommit 75cd7b167bd9fe4ad4e0da3a2138be084ede1ad7[m
Merge: cf452b5 6fd4c19
Author: Asim Shrestha <50181239+asim-shrestha@users.noreply.github.com>
Date:   Tue Apr 11 18:15:50 2023 -0700

    Merge pull request #30 from 6momo1/issue-17-copy-message-from-text
    
    [issue-17] Display Copy Icon on Message Hover

[33mcommit 6fd4c19d2cb365da8d6679d5bda485a2507402b9[m
Author: Tomi Lui <tomilui1221@gmail.com>
Date:   Tue Apr 11 18:10:43 2023 -0700

    use white background for icon. copy when clicked anywhere

[33mcommit 3d99ebd07567c670c7da7c8765b714ce95e14135[m
Merge: 0b82033 34956ee
Author: Tomi Lui <tomilui1221@gmail.com>
Date:   Tue Apr 11 18:08:16 2023 -0700

    fix merge conflicts

[33mcommit cf452b544c3b15587eec6839e313caae99e63919[m
Author: Asim Shrestha <asim.shrestha@hotmail.com>
Date:   Tue Apr 11 18:04:17 2023 -0700

    ⭐ Describe a paid account is required

[33mcommit 91f765d0100440fdc6fb77526d15f59d71cd1c47[m
Merge: 34956ee 9d5809f
Author: Asim Shrestha <50181239+asim-shrestha@users.noreply.github.com>
Date:   Tue Apr 11 17:57:08 2023 -0700

    Merge pull request #31 from reworkd/24-describe-key
    
    ⭐ Describe how key is stored

[33mcommit 9d5809fb207fb25b08876264731ddba679a910e6[m
Author: Asim Shrestha <asim.shrestha@hotmail.com>
Date:   Tue Apr 11 17:53:40 2023 -0700

    ⭐ Describe how key is stored

[33mcommit 0b8203329c96b686a93b29749b39ff112623b59e[m
Author: Tomi Lui <tomilui1221@gmail.com>
Date:   Tue Apr 11 17:39:47 2023 -0700

    display copy icon on hover on message

[33mcommit 933fccd18ee1fa64d019d71f9ca5f15d6efe7084[m
Author: Frajder <9c74qkzrnhakxgcht2xgdjiq@t8.si>
Date:   Wed Apr 12 02:17:05 2023 +0200

    Add Prisma and generate Prisma client into Dockerfile

[33mcommit bec0e184fb6371e2baf42a0bb231af3e0d5469ab[m
Author: Frajder <9c74qkzrnhakxgcht2xgdjiq@t8.si>
Date:   Wed Apr 12 00:23:51 2023 +0200

    Update project setup to run with Docker
    
    - Update .eslintrc.json to disable certain rules
    - Add NEXTAUTH_SECRET and OPENAI_API_KEY environment variables to .env
    - Modify package.json to disable lint during the build process
    - Update .gitignore to ignore the /db directory
    - Update README.md with instructions on how to run the app with Docker
    
    These changes allow the application to be built and run within a Docker container, while maintaining data persistence using a mounted volume for the SQLite database.

[33mcommit 6e57069d4f064f9d563f5ca3df09e499f5a128d0[m
Author: Frajder <9c74qkzrnhakxgcht2xgdjiq@t8.si>
Date:   Wed Apr 12 00:13:57 2023 +0200

    Adding docker support

[33mcommit 34956eefdfd2ab263498af64561e11fba605f1f1[m
Author: Asim Shrestha <50181239+asim-shrestha@users.noreply.github.com>
Date:   Tue Apr 11 01:15:40 2023 -0700

    Update README.md

[33mcommit dda75f0e552df30c7283f72f2419eddf19700956[m
Merge: 86a3fd9 7610dd4
Author: Asim Shrestha <asim.shrestha@hotmail.com>
Date:   Tue Apr 11 00:44:35 2023 -0700

    Merge branch 'main' of https://github.com/reworkd/AgentGPT

[33mcommit 86a3fd9a18483597a9c408ba7422cecc9ef63a1e[m
Author: Asim Shrestha <asim.shrestha@hotmail.com>
Date:   Tue Apr 11 00:44:31 2023 -0700

    ⭐ Add the ability to save a conversation

[33mcommit 7610dd448eeca778e7c495c3bfbe1b0dd4bd943a[m
Author: Adam Watkins <hello@awtkns.com>
Date:   Tue Apr 11 10:43:46 2023 +0300

    Update FUNDING.yml

[33mcommit d8bac98bcc1e2baa09946651b686cee9bb8990aa[m
Merge: bcb5b93 81680cb
Author: Adam Watkins <hello@awtkns.com>
Date:   Tue Apr 11 09:39:30 2023 +0200

    Merge pull request #15 from reworkd/awtkns-patch-2
    
    Update FUNDING.yml

[33mcommit 81680cb24e531e8a437c2243bdcd7faedc28379c[m
Author: Adam Watkins <hello@awtkns.com>
Date:   Tue Apr 11 10:39:20 2023 +0300

    Update FUNDING.yml

[33mcommit bcb5b939e6baa448e24efd56ee10486cf5d49ecf[m
Merge: bae43f0 a447654
Author: Adam Watkins <hello@awtkns.com>
Date:   Tue Apr 11 09:36:45 2023 +0200

    Merge pull request #14 from reworkd/awtkns-patch-1
    
    Update FUNDING.yml

[33mcommit a44765481367e1381f8ec37e1e41352a7da479f0[m
Author: Adam Watkins <hello@awtkns.com>
Date:   Tue Apr 11 10:36:32 2023 +0300

    Update FUNDING.yml

[33mcommit bae43f043593e222f8e7f5077d711fc8f6d54c7c[m
Author: Adam Watkins <hello@awtkns.com>
Date:   Tue Apr 11 10:35:22 2023 +0300

    Create .github/FUNDING.yml

[33mcommit 5df5d3364b10749040e01b00c79ac3b30e145d57[m
Author: Srijan-Subedi <94234723+Srijan-Subedi@users.noreply.github.com>
Date:   Tue Apr 11 00:25:36 2023 -0700

    Update README.md

[33mcommit d9012cb750185eecef185f43694e8de8d82e0511[m
Author: Srijan-Subedi <94234723+Srijan-Subedi@users.noreply.github.com>
Date:   Tue Apr 11 00:15:45 2023 -0700

    Update README.md

[33mcommit b9a10ab1ebffab19a5356a5c72d3914b4942c2b3[m
Author: Asim Shrestha <asim.shrestha@hotmail.com>
Date:   Mon Apr 10 23:02:39 2023 -0700

    ⭐ Add save button UI

[33mcommit 81e261da4c3686285c59aa4641f9c74411f6e613[m
Author: Asim Shrestha <asim.shrestha@hotmail.com>
Date:   Mon Apr 10 14:30:53 2023 -0700

    ⭐ Make API key optional

[33mcommit ece22be8cbf160f17ef108f61a038e4101aa1a53[m
Author: Asim Shrestha <asim.shrestha@hotmail.com>
Date:   Mon Apr 10 14:26:03 2023 -0700

    ⭐ Make API key optional

[33mcommit 719d90dda1a5679adc3c6ff374b508aa6d88a593[m
Author: Asim Shrestha <asim.shrestha@hotmail.com>
Date:   Mon Apr 10 13:16:37 2023 -0700

    ⭐ Add discord link

[33mcommit 46029524b135f48604c5d29b164f7dcec79aecc7[m
Merge: 0c3d3d6 576db8c
Author: Asim Shrestha <50181239+asim-shrestha@users.noreply.github.com>
Date:   Mon Apr 10 13:03:42 2023 -0700

    Merge pull request #13 from reworkd/settings
    
    Ability to add your own API key

[33mcommit 576db8c7d5a33d0fb3fa771ce30be73732a91494[m
Author: Asim Shrestha <asim.shrestha@hotmail.com>
Date:   Mon Apr 10 13:00:54 2023 -0700

    ⭐ Fix build issue

[33mcommit 08cf9f6b72a802661b96934ad1823bb7b16584a4[m
Author: Asim Shrestha <asim.shrestha@hotmail.com>
Date:   Mon Apr 10 12:53:04 2023 -0700

    ⭐ Allow for a custom API Key

[33mcommit 7b3c302e0908990e40c149bc09250dabd17d258d[m
Author: Asim Shrestha <asim.shrestha@hotmail.com>
Date:   Mon Apr 10 10:03:29 2023 -0700

    🐛 Dialog changes

[33mcommit 37181329460002b8350c4c2e16e4febcd1ad2bcb[m
Author: Asim Shrestha <asim.shrestha@hotmail.com>
Date:   Mon Apr 10 10:03:12 2023 -0700

    🐛 Dialog changes

[33mcommit 0c3d3d671b414e676a3b1d05d93d0a7eb79c625e[m
Author: Asim Shrestha <asim.shrestha@hotmail.com>
Date:   Sun Apr 9 21:23:26 2023 -0700

    🐛 Update loop count

[33mcommit 9ff61686e43b657dd6f19ad0773c8a848712ae5c[m
Author: Adam Watkins <hello@awtkns.com>
Date:   Mon Apr 10 06:45:00 2023 +0300

    :page_facing_up: Create License

[33mcommit 8a5f5dff45231553c7216284de549a19929b0945[m
Author: Asim Shrestha <asim.shrestha@hotmail.com>
Date:   Sun Apr 9 20:32:26 2023 -0700

    🐛 Update array parsing

[33mcommit 5e872e0c91510eff44757623acaf349d86123357[m
Author: Asim Shrestha <asim.shrestha@hotmail.com>
Date:   Sun Apr 9 13:58:54 2023 -0700

    💅 Remove note

[33mcommit ef7a524504b5a6fcbda417cece55f1565ae5e60f[m
Author: Asim Shrestha <asim.shrestha@hotmail.com>
Date:   Sun Apr 9 13:56:03 2023 -0700

    💅 Fix button styling

[33mcommit 47095012a02a9c938edf38f17dfc24e31a7abae1[m
Author: Asim Shrestha <asim.shrestha@hotmail.com>
Date:   Sun Apr 9 13:49:32 2023 -0700

    🚨 Add option to manually shutdown

[33mcommit 0f39372297d92d90be40f7df40c20a6dc2bee60e[m
Merge: 1290e5f 2115659
Author: Asim Shrestha <asim.shrestha@hotmail.com>
Date:   Sun Apr 9 12:26:41 2023 -0700

    Merge branch 'main' of https://github.com/reworkd/AgentGPT

[33mcommit 1290e5ff1c916059b51e605df601406c63c30209[m
Author: Asim Shrestha <asim.shrestha@hotmail.com>
Date:   Sun Apr 9 12:26:33 2023 -0700

    🧠 Tell user to restart if stuck thinking

[33mcommit 2115659e82b85aa78d7d7410c3ee6d2ec6e0e07f[m
Merge: 09c26eb 593bbf5
Author: Adam Watkins <32209255+awtkns@users.noreply.github.com>
Date:   Sun Apr 9 14:24:52 2023 +0300

    :wrench: #1 Update documentation on environment variables
    
    :wrench: Update documentation on environment variables

[33mcommit 593bbf5f0ad9e76c9bd27a6f4238d94ced44b1ef[m
Author: adam.watkins <adam.watkins@article.com>
Date:   Sun Apr 9 14:22:00 2023 +0300

    :wrench: Update documentation on environment variables

[33mcommit 09c26ebb364fec4e4dfe4271b9bb1f8491e2afaf[m
Merge: 74a16cd 7e892ba
Author: adam.watkins <adam.watkins@article.com>
Date:   Sun Apr 9 10:24:05 2023 +0300

    Merge remote-tracking branch 'origin/main'

[33mcommit 74a16cdaf8b27bd83ed247ee58eeff35bf8d7f8d[m
Author: adam.watkins <adam.watkins@article.com>
Date:   Sun Apr 9 10:23:58 2023 +0300

    :wrench: Create chroma db instance

[33mcommit 7e892bafbc595f898318dad3dc98ce999b250e90[m
Author: Asim Shrestha <50181239+asim-shrestha@users.noreply.github.com>
Date:   Sun Apr 9 00:00:54 2023 -0700

    Update README.md

[33mcommit 7149d0414bde3490722245ac87fa36d026b58497[m
Author: Asim Shrestha <50181239+asim-shrestha@users.noreply.github.com>
Date:   Sun Apr 9 00:00:39 2023 -0700

    Update README.md

[33mcommit ee1948fdb4f915af371f4e79d923931f4128beb3[m
Merge: b07e815 b97b62a
Author: adam.watkins <adam.watkins@article.com>
Date:   Sun Apr 9 07:42:54 2023 +0300

    Merge remote-tracking branch 'origin/main'

[33mcommit b07e8152cb1f25aca192b903eb10f8aa38393fc5[m
Author: adam.watkins <adam.watkins@article.com>
Date:   Sun Apr 9 07:42:41 2023 +0300

    :art: Add dots animation

[33mcommit b97b62a6329d201738054b3a6dd077fcc03bd368[m
Merge: 6331fd4 aa6c302
Author: Asim Shrestha <asim.shrestha@hotmail.com>
Date:   Sat Apr 8 21:19:23 2023 -0700

    Merge branch 'main' of https://github.com/reworkd/AgentGPT

[33mcommit 6331fd43cb1340152555a47e21a2a0835acea294[m
Author: Asim Shrestha <asim.shrestha@hotmail.com>
Date:   Sat Apr 8 21:19:15 2023 -0700

    🤖 Triple loops

[33mcommit aa6c30214f25990cfb92463bc2a2f8e163653df7[m
Author: adam.watkins <adam.watkins@article.com>
Date:   Sun Apr 9 06:48:34 2023 +0300

    :art: Add vercel analytics

[33mcommit 7339e327c2f51fd5e7ae9c503fee118d2b343c35[m
Merge: 3f6061f f59cb26
Author: Asim Shrestha <asim.shrestha@hotmail.com>
Date:   Sat Apr 8 19:07:15 2023 -0700

    Merge branch 'main' of https://github.com/reworkd/AgentGPT

[33mcommit 3f6061fea5ca1a5fa55008bd07c62d163596d3ce[m
Author: Asim Shrestha <asim.shrestha@hotmail.com>
Date:   Sat Apr 8 19:05:11 2023 -0700

    🤖 Update twitter links

[33mcommit f59cb2695fa72ba12fc41c6c7374cabb30474f17[m
Author: Asim Shrestha <50181239+asim-shrestha@users.noreply.github.com>
Date:   Sat Apr 8 18:52:46 2023 -0700

    Update README.md

[33mcommit 9a0a8fd4d0055dd796f96297000653dc889cb9d7[m
Author: Asim Shrestha <asim.shrestha@hotmail.com>
Date:   Sat Apr 8 18:47:11 2023 -0700

    🤖 Adjust banner

[33mcommit c7a952912b2fa1771796d1959824840de2696b94[m
Author: Asim Shrestha <asim.shrestha@hotmail.com>
Date:   Sat Apr 8 17:41:01 2023 -0700

    🤖 Adjust drawer and banner

[33mcommit 9a848d4aa07a5ecd24876907982b8dd45ef2d930[m
Author: Asim Shrestha <asim.shrestha@hotmail.com>
Date:   Sat Apr 8 17:13:40 2023 -0700

    🤖 Adjust drawer

[33mcommit 2fa42a4a46c7ceb5ec4dc861d4d973eef2db4e72[m
Author: Asim Shrestha <asim.shrestha@hotmail.com>
Date:   Sat Apr 8 16:51:51 2023 -0700

    🤖 Adjust margins

[33mcommit 8c2d922d92313cd6ab935b1193cba0459fad7ee2[m
Author: Asim Shrestha <asim.shrestha@hotmail.com>
Date:   Sat Apr 8 16:41:03 2023 -0700

    🤖 Fix modal opening

[33mcommit 434136cd658e1fbe5a2cd757c7ad4a5fc238c53a[m
Author: Asim Shrestha <asim.shrestha@hotmail.com>
Date:   Sat Apr 8 16:36:42 2023 -0700

    🤖 Fix scrolling

[33mcommit 6e5948a2f4279194700cc492588802fb099a8666[m
Author: Asim Shrestha <asim.shrestha@hotmail.com>
Date:   Sat Apr 8 16:06:57 2023 -0700

    🤖 Add help modal

[33mcommit d95bdd1762750be8934ae0634bd7541175ef83a7[m
Author: Asim Shrestha <asim.shrestha@hotmail.com>
Date:   Sat Apr 8 15:21:24 2023 -0700

    🤖 Autonomous behaviour

[33mcommit 27df82a42063e42d820817aab7ea28c0b168786d[m
Author: Asim Shrestha <asim.shrestha@hotmail.com>
Date:   Sat Apr 8 15:20:22 2023 -0700

    🤖 Autonomous behaviour

[33mcommit 1b8e06682765829f43efdd1fd26f11ae3e5268f2[m
Author: Asim Shrestha <asim.shrestha@hotmail.com>
Date:   Sat Apr 8 12:31:18 2023 -0700

    🔥 New banner

[33mcommit 7bfd1a0f15ffe5b6e994c9bcdc85682479ee94db[m
Author: Asim Shrestha <asim.shrestha@hotmail.com>
Date:   Sat Apr 8 12:25:46 2023 -0700

    🔥 New banner

[33mcommit 3401eca4725abe3f546e1c63c64b133922d77bdb[m
Author: Asim Shrestha <asim.shrestha@hotmail.com>
Date:   Sat Apr 8 12:20:56 2023 -0700

    🔥 Fix banner

[33mcommit cbb8c57c237bcba4336ec543fdfc2d94dd686479[m
Author: Asim Shrestha <asim.shrestha@hotmail.com>
Date:   Sat Apr 8 12:18:15 2023 -0700

    🔥 Fix z-index

[33mcommit 675b82e2c059594e01d9928cf482f7c5c1e8a3de[m
Author: Asim Shrestha <asim.shrestha@hotmail.com>
Date:   Sat Apr 8 12:14:21 2023 -0700

    🔥 Update image for links

[33mcommit 9be0786f2b66dbbc1164558e210ce42eae63a4de[m
Author: Asim Shrestha <asim.shrestha@hotmail.com>
Date:   Sat Apr 8 12:13:26 2023 -0700

    🔥 Banner

[33mcommit 7a1f746f28dda1a004d42972675963ea1443f2eb[m
Author: Asim Shrestha <asim.shrestha@hotmail.com>
Date:   Sat Apr 8 12:08:10 2023 -0700

    🔥 Drawer update

[33mcommit c663014091a87980d2cda0c08461f8e36e5722a2[m
Author: Asim Shrestha <asim.shrestha@hotmail.com>
Date:   Sat Apr 8 11:10:36 2023 -0700

    🔥 Fix z-index

[33mcommit 375bf8208756c32178ff2a8140b1469512d472d0[m
Author: Asim Shrestha <asim.shrestha@hotmail.com>
Date:   Sat Apr 8 11:08:11 2023 -0700

    🔥 Gradients galore!

[33mcommit e6d56b01f006c91903bcde74faa7841134ca96ea[m
Author: Asim Shrestha <asim.shrestha@hotmail.com>
Date:   Sat Apr 8 10:48:34 2023 -0700

    🔥 Lower window font in smaller screens

[33mcommit b76819bd98b84675afbf4ac8e4c1e53e09f6e243[m
Author: Asim Shrestha <asim.shrestha@hotmail.com>
Date:   Sat Apr 8 10:42:31 2023 -0700

    🔥 Add System message

[33mcommit 5c53635c1d3eb4a906165d35155af10914186972[m
Author: Asim Shrestha <asim.shrestha@hotmail.com>
Date:   Sat Apr 8 10:35:27 2023 -0700

    🔥 Better screen breakpoints

[33mcommit a8ac614f22e458f7b134c9a175200975834eecbb[m
Author: Asim Shrestha <asim.shrestha@hotmail.com>
Date:   Sat Apr 8 10:13:25 2023 -0700

    🔥 Mobile god
