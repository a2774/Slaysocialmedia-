import { Html, Head, Main, NextScript } from "next/document";


/* Old Google tag (gtag.js) 
<script
async
src="https://www.googletagmanager.com/gtag/js?id=G-X9JR8WQMCZ"
></script>
<script
type="text/javascript"
dangerouslySetInnerHTML={{
  __html: `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-X9JR8WQMCZ');
  `,
}}/>
*/

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="favicon.jpg" />
        <script type="text/javascript" dangerouslySetInnerHTML={{ /* Google Tag Manager Code */
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-PM4BDNG7');`
        }}/>
      </Head>
      <body>
        <noscript>
          <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-PM4BDNG7" 
          height="0" width="0" style={{display:"none", visibility:"hidden"}}></iframe>
        </noscript>
        <Main />
        <NextScript />
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
              var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
              (function(){
                var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
                s1.async=true;
                s1.src='https://embed.tawk.to/66d6cc7fea492f34bc0d1271/1i6rgtles';
                s1.charset='UTF-8';
                s1.setAttribute('crossorigin','*');
                s0.parentNode.insertBefore(s1,s0);
              })();
            `,
          }}
        />
      </body>
    </Html>
  );
}
