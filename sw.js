<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#0B0E14">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Verici">
<meta name="description" content="Ekranını tek bağlantıyla canlı yayınla.">
<title>Verici — Canlı Ekran Yayını</title>
<link rel="manifest" href="manifest.json">
<link rel="icon" href="icon-192.png">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
<style>
  :root{
    --ink:#0B0E14; --ink-2:#0E1320;
    --surface:#141A28; --surface-2:#1B2334;
    --line:#28324A; --line-soft:#1F2840;
    --text:#E8EDF6; --muted:#8A95AC; --muted-2:#5E6981;
    --live:#FF9F1C; --live-2:#FFC163;
    --live-soft:rgba(255,159,28,.14); --live-glow:rgba(255,159,28,.45);
    --danger:#FF5A5A;
    --radius:16px; --radius-sm:11px;
    --mono:'Space Mono',ui-monospace,SFMono-Regular,Menlo,monospace;
    --sans:'Space Grotesk',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;
  }
  *,*::before,*::after{box-sizing:border-box}
  html,body{height:100%}
  body{margin:0;background:var(--ink);color:var(--text);font-family:var(--sans);font-weight:400;
    -webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;min-height:100dvh;overflow-x:hidden}
  .bg{position:fixed;inset:0;z-index:-1;
    background:radial-gradient(1200px 600px at 50% -12%, rgba(255,159,28,.06), transparent 60%),
      radial-gradient(900px 720px at 100% 112%, rgba(40,60,110,.10), transparent 60%),var(--ink)}
  .app{min-height:100dvh;display:flex;flex-direction:column}
  .view{display:none;flex:1;min-height:0}
  .view--active{display:flex;flex-direction:column}
  .glyph{width:34px;height:34px;color:var(--live);filter:drop-shadow(0 0 10px var(--live-glow));display:inline-flex}
  .glyph svg{width:100%;height:100%}
  .glyph--lg{width:46px;height:46px}
  .lockup{display:flex;align-items:center;gap:13px}
  .wordmark{font-weight:700;font-size:26px;letter-spacing:.14em}
  .btn{font-family:var(--sans);font-weight:500;font-size:15px;border:1px solid transparent;border-radius:var(--radius-sm);
    padding:13px 20px;cursor:pointer;color:var(--text);background:var(--surface-2);
    transition:transform .12s ease,background .15s ease,border-color .15s ease,box-shadow .15s ease;-webkit-tap-highlight-color:transparent}
  .btn:active{transform:translateY(1px)}
  .btn:disabled{opacity:.5;cursor:default}
  .btn--lg{width:100%;padding:16px;font-size:16px}
  .btn--block{width:100%}
  .btn--primary{background:linear-gradient(180deg,var(--live-2),var(--live));color:#1a1205;font-weight:700;box-shadow:0 8px 24px -8px var(--live-glow)}
  .btn--ghost{background:transparent;border-color:var(--line)}
  .btn--ghost:hover{border-color:var(--muted-2);background:var(--surface)}
  .btn--soft{background:var(--surface);border-color:var(--line-soft);font-size:14px;padding:11px 15px}
  .btn--soft:hover{border-color:var(--line);background:var(--surface-2)}
  .btn--danger{background:transparent;border-color:rgba(255,90,90,.4);color:#ff8a8a}
  .btn--danger:hover{background:rgba(255,90,90,.1);border-color:rgba(255,90,90,.7)}
  .btn--provider{display:flex;align-items:center;justify-content:center;gap:10px;width:100%;background:var(--surface);border-color:var(--line)}
  .btn--provider:hover{border-color:var(--muted-2);background:var(--surface-2)}
  .btn--provider svg{width:18px;height:18px;flex:none}
  .linklike{background:none;border:none;color:var(--live);font:inherit;font-weight:500;cursor:pointer;padding:0}
  .field{display:flex;flex-direction:column;gap:7px;text-align:left;margin-bottom:14px}
  .field label{font-size:13px;color:var(--muted);font-weight:500}
  .tinput,.tselect{width:100%;font-family:var(--sans);font-size:15px;color:var(--text);background:var(--surface);
    border:1px solid var(--line);border-radius:var(--radius-sm);padding:13px 14px;outline:none;
    transition:border-color .15s ease,box-shadow .15s ease}
  .tinput::placeholder{color:var(--muted-2)}
  .tinput:focus,.tselect:focus{border-color:var(--live);box-shadow:0 0 0 3px var(--live-soft)}
  .tselect{appearance:none;-webkit-appearance:none;padding-right:40px;cursor:pointer;
    background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%238A95AC' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M6 9l6 6 6-6'/></svg>");
    background-repeat:no-repeat;background-position:right 14px center}
  .code-input{font-family:var(--mono);font-weight:700;font-size:18px;letter-spacing:.22em;text-align:center;text-transform:uppercase}
  .code-input::placeholder{letter-spacing:.12em;font-weight:400;text-transform:none}
  .form-error{color:#ff8a8a;font-size:13px;min-height:18px;text-align:left;margin:-2px 0 12px}
  .form-ok{color:var(--live-2);font-size:13px;text-align:left;margin:-2px 0 12px}
  .divider{display:flex;align-items:center;width:100%;gap:14px;margin:20px 0;color:var(--muted-2);font-size:12px;letter-spacing:.08em;text-transform:uppercase}
  .divider::before,.divider::after{content:'';height:1px;flex:1;background:var(--line-soft)}
  .center{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:32px 22px;text-align:center}
  .auth-card{width:100%;max-width:380px;text-align:center}
  .auth-card h1{font-size:23px;font-weight:700;margin:18px 0 4px}
  .auth-card .sub{color:var(--muted);font-size:14px;font-weight:300;margin:0 0 24px}
  .tagline{color:var(--muted);font-size:15px;font-weight:300;margin:14px 0 28px;line-height:1.5;max-width:320px}
  .feat{display:flex;align-items:flex-start;gap:11px;text-align:left;margin:0 0 12px;color:var(--muted);font-size:14px;line-height:1.45}
  .feat .fdot{width:7px;height:7px;border-radius:50%;background:var(--live);margin-top:7px;flex:none;box-shadow:0 0 8px var(--live-glow)}
  .stack{display:flex;flex-direction:column;gap:10px;width:100%}
  .switch-line{color:var(--muted);font-size:14px;margin-top:20px}
  .appbar{position:sticky;top:0;z-index:20;display:flex;align-items:center;justify-content:space-between;gap:12px;
    padding:13px 14px;background:rgba(11,14,20,.85);backdrop-filter:blur(10px);border-bottom:1px solid var(--line-soft);min-height:56px}
  .appbar .title{font-weight:500;font-size:17px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .appbar-left{display:flex;align-items:center;gap:10px;min-width:0}
  .iconbtn{width:38px;height:38px;display:inline-flex;align-items:center;justify-content:center;border-radius:10px;
    border:1px solid transparent;background:transparent;color:var(--text);cursor:pointer;-webkit-tap-highlight-color:transparent;flex:none}
  .iconbtn:hover{background:var(--surface)}
  .iconbtn svg{width:22px;height:22px}
  .avatar{width:36px;height:36px;border-radius:50%;background:var(--surface-2);border:1px solid var(--line);
    display:inline-flex;align-items:center;justify-content:center;font-family:var(--mono);font-weight:700;font-size:13px;color:var(--live);overflow:hidden;cursor:pointer;flex:none}
  .avatar img{width:100%;height:100%;object-fit:cover}
  .avatar--lg{width:84px;height:84px;font-size:30px;cursor:default}
  .page{flex:1;min-height:0;overflow-y:auto;-webkit-overflow-scrolling:touch}
  .page-inner{max-width:560px;margin:0 auto;padding:18px 16px 28px}
  .page-inner.tabbed{padding-bottom:24px}
  .card{background:var(--surface);border:1px solid var(--line-soft);border-radius:var(--radius);padding:18px}
  .join-row{display:flex;gap:9px;width:100%}
  .join-row .tinput{flex:1;min-width:0}
  .sec-title{font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);
    margin:24px 4px 12px;display:flex;align-items:center;justify-content:space-between}
  .sec-title .more{font-size:13px;text-transform:none;letter-spacing:0}
  .row{display:flex;align-items:center;gap:12px;padding:13px 14px;background:var(--surface);
    border:1px solid var(--line-soft);border-radius:12px;margin-bottom:9px;width:100%;text-align:left}
  .row--link{cursor:pointer}
  .row--link:hover{border-color:var(--line)}
  .row-icon{width:38px;height:38px;border-radius:10px;background:var(--surface-2);display:flex;align-items:center;justify-content:center;color:var(--live);flex:none}
  .row-icon svg{width:20px;height:20px}
  .row-main{flex:1;min-width:0}
  .row-title{font-weight:500;font-size:15px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .row-sub{color:var(--muted);font-size:13px;font-family:var(--mono);margin-top:2px}
  .row-end{color:var(--muted);font-size:13px;font-family:var(--mono);text-align:right;flex:none}
  .row-end .big{color:var(--live);font-weight:700;font-size:15px}
  .row-chev{color:var(--muted-2);flex:none}
  .row-chev svg{width:20px;height:20px}
  .room-row{display:flex;align-items:stretch;gap:0;background:var(--surface);border:1px solid var(--line-soft);border-radius:12px;margin-bottom:9px;overflow:hidden}
  .room-row:hover{border-color:var(--line)}
  .room-main{flex:1;min-width:0;display:flex;align-items:center;gap:12px;background:none;border:none;color:var(--text);cursor:pointer;padding:13px 6px 13px 14px;text-align:left}
  .room-body{flex:1;min-width:0}
  .room-name{font-weight:500;font-size:15px;display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .room-start{flex:none;width:48px;display:flex;align-items:center;justify-content:center;background:none;border:none;border-left:1px solid var(--line-soft);color:var(--live);cursor:pointer;-webkit-tap-highlight-color:transparent}
  .room-start:hover{background:var(--live-soft)}
  .room-start svg{width:22px;height:22px}
  .live-dot{color:var(--live);font-weight:700}
  .empty{text-align:center;color:var(--muted);padding:46px 20px}
  .empty .glyph{margin:0 auto 14px;opacity:.5}
  .empty p{margin:0 0 4px;font-size:15px;color:var(--text)}
  .empty span{font-size:13px}
  .profile-head{display:flex;flex-direction:column;align-items:center;text-align:center;padding:14px 0 6px}
  .profile-head h2{font-size:20px;font-weight:700;margin:14px 0 2px}
  .profile-head .email{color:var(--muted);font-size:14px;font-family:var(--mono)}
  .setting{margin-bottom:18px}
  .setting label{display:block;font-size:13px;color:var(--muted);font-weight:500;margin-bottom:7px}
  .hint{color:var(--muted-2);font-size:12px;margin-top:7px;line-height:1.45}
  .grid2{display:flex;gap:9px}
  .grid2>*{flex:1;min-width:0}
  .toggle-row{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:14px 2px;border-bottom:1px solid var(--line-soft)}
  .toggle-main{min-width:0}
  .toggle-title{font-weight:500;font-size:15px;display:block}
  .toggle-sub{color:var(--muted);font-size:13px;display:block;margin-top:2px}
  .switch{position:relative;display:inline-block;width:46px;height:28px;flex:none}
  .switch input{opacity:0;width:0;height:0}
  .slider{position:absolute;inset:0;background:var(--surface-2);border:1px solid var(--line);border-radius:999px;cursor:pointer;transition:background .2s}
  .slider::before{content:'';position:absolute;width:20px;height:20px;left:3px;top:3px;background:var(--muted);border-radius:50%;transition:transform .2s,background .2s}
  .switch input:checked+.slider{background:var(--live-soft);border-color:rgba(255,159,28,.5)}
  .switch input:checked+.slider::before{transform:translateX(18px);background:var(--live)}
  .switch input:disabled+.slider{opacity:.45;cursor:default}
  .badge{display:inline-flex;align-items:center;gap:7px;font-family:var(--mono);font-weight:700;font-size:11px;letter-spacing:.1em;text-transform:uppercase;padding:5px 10px;border-radius:999px;border:1px solid var(--line);color:var(--muted)}
  .badge--live{color:var(--live);border-color:rgba(255,159,28,.35);background:var(--live-soft)}
  .badge--live::before{content:'';width:7px;height:7px;border-radius:50%;background:var(--live);animation:pulse 1.8s ease-out infinite}
  .prose{color:var(--text);font-size:15px;line-height:1.6}
  .prose p{margin:0 0 14px;color:var(--muted)}
  .prose h3{font-size:16px;font-weight:500;margin:22px 0 10px}
  .steps-num{list-style:none;padding:0;margin:0;counter-reset:s}
  .steps-num li{counter-increment:s;position:relative;padding-left:38px;margin-bottom:13px;color:var(--muted);font-size:14px;line-height:1.5}
  .steps-num li::before{content:counter(s);position:absolute;left:0;top:-2px;width:26px;height:26px;border-radius:8px;
    background:var(--live-soft);color:var(--live);font-family:var(--mono);font-weight:700;font-size:13px;display:flex;align-items:center;justify-content:center}
  .tabbar{display:none;position:sticky;bottom:0;z-index:20;background:rgba(11,14,20,.92);backdrop-filter:blur(12px);
    border-top:1px solid var(--line-soft);padding:7px 8px calc(7px + env(safe-area-inset-bottom))}
  .app.show-tabs .tabbar{display:block}
  .tabbar-inner{max-width:560px;margin:0 auto;width:100%;display:flex;justify-content:space-around}
  .tab{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;background:none;border:none;color:var(--muted-2);
    cursor:pointer;padding:6px 0;font-size:11px;font-weight:500;-webkit-tap-highlight-color:transparent}
  .tab svg{width:24px;height:24px}
  .tab.active{color:var(--live)}
  .livechip{display:none;align-items:center;gap:8px;font-family:var(--mono);font-weight:700;font-size:12px;letter-spacing:.06em;
    text-transform:uppercase;color:var(--live);background:var(--live-soft);border:1px solid rgba(255,159,28,.35);
    padding:6px 11px;border-radius:999px;cursor:pointer}
  .livechip.show{display:inline-flex}
  .livechip::before{content:'';width:8px;height:8px;border-radius:50%;background:var(--live);animation:pulse 1.8s ease-out infinite}
  .pill{display:inline-flex;align-items:center;gap:8px;font-family:var(--mono);font-weight:700;font-size:12px;letter-spacing:.12em;
    text-transform:uppercase;padding:7px 12px;border-radius:999px;border:1px solid var(--line)}
  .pill::before{content:'';width:8px;height:8px;border-radius:50%;background:var(--muted-2)}
  .pill--live{color:var(--live);border-color:rgba(255,159,28,.35);background:var(--live-soft)}
  .pill--live::before{background:var(--live);animation:pulse 1.8s ease-out infinite}
  .pill--connecting{color:var(--live-2);border-color:rgba(255,193,99,.3)}
  .pill--connecting::before{background:var(--live-2);animation:blink 1s steps(2,end) infinite}
  .pill.small{font-size:11px;padding:5px 10px}
  @keyframes pulse{0%{box-shadow:0 0 0 0 var(--live-glow)}70%{box-shadow:0 0 0 7px transparent}100%{box-shadow:0 0 0 0 transparent}}
  @keyframes blink{50%{opacity:.25}}
  .bar{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:14px 14px;border-bottom:1px solid var(--line-soft)}
  .bar-left{display:flex;align-items:center;gap:9px;min-width:0}
  .readout{font-family:var(--mono);color:var(--muted);font-size:13px;letter-spacing:.04em}
  .time{color:var(--text)}
  .panel-body{flex:1;min-height:0;display:flex;flex-direction:column;gap:16px;padding:20px 16px;max-width:840px;width:100%;margin:0 auto;overflow-y:auto}
  .codecard{background:var(--surface);border:1px solid var(--line-soft);border-radius:var(--radius);padding:20px 22px;text-align:center}
  .codecard-room{font-weight:500;font-size:16px;margin-bottom:6px;color:var(--text)}
  .codecard-label{color:var(--muted);font-size:12px;letter-spacing:.14em;text-transform:uppercase;margin-bottom:10px}
  .code{font-family:var(--mono);font-weight:700;font-size:clamp(34px,9vw,52px);letter-spacing:.16em;color:var(--text);line-height:1}
  .code-actions{display:flex;gap:9px;justify-content:center;flex-wrap:wrap;margin-top:18px}
  .viewers{margin-top:16px;color:var(--muted);font-size:13px;display:flex;align-items:center;justify-content:center;gap:7px}
  .viewers .readout{color:var(--live);font-weight:700;font-size:15px}
  .dot-mini{width:7px;height:7px;border-radius:50%;background:var(--live);box-shadow:0 0 8px var(--live-glow)}
  .stage{position:relative;background:#05070C;border:1px solid var(--line-soft);border-radius:var(--radius);overflow:hidden}
  .stage--preview{flex:1;min-height:200px}
  .stage--main{flex:1;min-height:0;border-radius:0;border:none}
  .stage video{width:100%;height:100%;object-fit:contain;display:block;background:#05070C}
  .stage--cover video{object-fit:cover}
  .stage-tag{position:absolute;top:12px;left:12px;font-family:var(--mono);font-size:11px;letter-spacing:.1em;text-transform:uppercase;
    color:var(--muted);background:rgba(5,7,12,.6);padding:5px 9px;border-radius:7px;backdrop-filter:blur(6px)}
  .crop{position:absolute;inset:14px;pointer-events:none}
  .crop i{position:absolute;width:16px;height:16px;border:2px solid rgba(255,159,28,.5)}
  .crop i:nth-child(1){top:0;left:0;border-right:none;border-bottom:none}
  .crop i:nth-child(2){top:0;right:0;border-left:none;border-bottom:none}
  .crop i:nth-child(3){bottom:0;left:0;border-right:none;border-top:none}
  .crop i:nth-child(4){bottom:0;right:0;border-left:none;border-top:none}
  .controls{position:absolute;left:0;right:0;bottom:0;display:flex;align-items:center;gap:8px;padding:14px;
    background:linear-gradient(to top, rgba(5,7,12,.85), transparent);transition:opacity .25s ease,transform .25s ease}
  .controls--hidden{opacity:0;transform:translateY(6px);pointer-events:none}
  .spacer{flex:1}
  .ctl{width:40px;height:40px;display:inline-flex;align-items:center;justify-content:center;border-radius:10px;
    border:1px solid rgba(255,255,255,.12);background:rgba(20,26,40,.7);color:var(--text);cursor:pointer;backdrop-filter:blur(8px);
    transition:background .15s ease,border-color .15s ease;-webkit-tap-highlight-color:transparent;flex:none}
  .ctl:hover{background:rgba(40,50,74,.8);border-color:rgba(255,255,255,.22)}
  .ctl svg{width:20px;height:20px}
  .ctl--active{background:var(--live)!important;color:#1a1205!important;border-color:var(--live)!important}
  .overlay{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(5,7,12,.72);backdrop-filter:blur(3px);padding:24px}
  .overlay[hidden]{display:none}
  .overlay-inner{text-align:center;color:var(--muted)}
  .overlay-inner p{margin:14px 0 0;font-size:15px}
  .overlay-inner h3{margin:14px 0 6px;font-size:20px;color:var(--text);font-weight:700}
  .overlay-inner .glyph{margin:0 auto}
  .spinner{width:42px;height:42px;border-radius:50%;border:3px solid rgba(255,159,28,.18);border-top-color:var(--live);margin:0 auto;animation:spin 1s linear infinite}
  @keyframes spin{to{transform:rotate(360deg)}}
  .slide{display:none;text-align:center;max-width:340px}
  .slide.on{display:block}
  .slide .glyph{margin:0 auto 18px}
  .slide h2{font-size:22px;font-weight:700;margin:0 0 8px}
  .slide p{color:var(--muted);font-size:15px;line-height:1.55;margin:0}
  .dots{display:flex;gap:8px;justify-content:center;margin:26px 0 22px}
  .dots i{width:8px;height:8px;border-radius:50%;background:var(--line);transition:background .2s,width .2s}
  .dots i.on{background:var(--live);width:22px;border-radius:999px}
  .setup{position:fixed;inset:0;z-index:50;display:flex;align-items:center;justify-content:center;padding:24px;background:rgba(7,9,14,.86);backdrop-filter:blur(8px)}
  .setup[hidden]{display:none}
  .setup-card{max-width:440px;width:100%;background:var(--surface);border:1px solid var(--line);border-radius:var(--radius);padding:28px 26px;text-align:center}
  .setup-card h2{margin:16px 0 8px;font-size:22px}
  .setup-card>p{color:var(--muted);font-size:14px;line-height:1.55;margin:0 0 6px}
  code{font-family:var(--mono);font-size:.9em;background:var(--surface-2);padding:2px 6px;border-radius:5px;color:var(--live-2)}
  .splash{position:fixed;inset:0;z-index:80;display:flex;align-items:center;justify-content:center;background:var(--ink);transition:opacity .3s ease}
  .splash.hide{opacity:0;pointer-events:none}
  .splash .glyph{width:54px;height:54px;animation:pulse 1.8s ease-out infinite;border-radius:50%}
  .toast{position:fixed;left:50%;bottom:90px;transform:translateX(-50%) translateY(20px);background:var(--surface-2);border:1px solid var(--line);
    color:var(--text);font-size:14px;padding:12px 18px;border-radius:12px;box-shadow:0 12px 32px -12px rgba(0,0,0,.6);
    opacity:0;pointer-events:none;transition:opacity .2s ease,transform .2s ease;z-index:70;max-width:90vw;text-align:center}
  .toast--show{opacity:1;transform:translateX(-50%) translateY(0)}
  .update-banner{display:none;align-items:center;justify-content:space-between;gap:12px;background:var(--live);color:#1a1205;
    font-size:14px;font-weight:500;padding:10px 16px}
  .update-banner.show{display:flex}
  .update-banner button{background:#1a1205;color:var(--live);border:none;border-radius:8px;padding:6px 13px;font-weight:700;cursor:pointer}
  .hidden-audio{position:absolute;width:0;height:0;opacity:0;pointer-events:none}
  .chatbtn-wrap{position:relative;display:inline-flex;flex:none}
  .chat-dot{position:absolute;top:-2px;right:-2px;width:9px;height:9px;border-radius:50%;background:var(--live);border:2px solid var(--ink);display:none}
  .chat-dot.show{display:block}
  .chat-backdrop{position:fixed;inset:0;z-index:44;background:transparent;opacity:0;pointer-events:none;transition:opacity .2s}
  .chat-backdrop.open{opacity:1;pointer-events:auto}
  .chat-drawer{position:fixed;left:0;right:0;bottom:0;z-index:45;background:rgba(13,17,28,.62);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border-top:1px solid var(--line);border-radius:18px 18px 0 0;
    display:flex;flex-direction:column;height:54dvh;max-height:500px;transform:translateY(101%);transition:transform .25s ease;box-shadow:0 -12px 40px -10px rgba(0,0,0,.5)}
  .chat-drawer.open{transform:translateY(0)}
  .chat-head{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:14px 16px;border-bottom:1px solid var(--line-soft);flex:none}
  .chat-head .title{font-weight:500;font-size:16px}
  .chat-head-actions{display:flex;align-items:center;gap:4px}
  .chat-list{flex:1;min-height:0;overflow-y:auto;padding:14px 16px;display:flex;flex-direction:column;gap:10px}
  .chat-msg{max-width:85%;align-self:flex-start;display:flex;flex-direction:column}
  .chat-msg.me{align-self:flex-end;align-items:flex-end}
  .chat-name{font-size:12px;color:var(--muted);margin-bottom:3px;font-weight:500}
  .chat-bubble{display:inline-block;background:rgba(22,29,44,.82);border:1px solid var(--line-soft);border-radius:12px;padding:9px 12px;font-size:14px;line-height:1.4;color:var(--text);word-break:break-word}
  .chat-msg.me .chat-bubble{background:var(--live-soft);border-color:rgba(255,159,28,.3)}
  .chat-empty{margin:auto;color:var(--muted-2);font-size:14px;text-align:center}
  .chat-input-row{display:flex;gap:8px;padding:12px 14px calc(12px + env(safe-area-inset-bottom));border-top:1px solid var(--line-soft);flex:none}
  .chat-input{flex:1;min-width:0;background:var(--surface);border:1px solid var(--line);border-radius:999px;padding:11px 16px;color:var(--text);font-family:var(--sans);font-size:14px;outline:none}
  .chat-input:focus{border-color:var(--live)}
  .chat-send{flex:none;width:44px;height:44px;border-radius:50%;border:none;background:var(--live);color:#1a1205;cursor:pointer;display:flex;align-items:center;justify-content:center}
  .chat-send svg{width:20px;height:20px}
  :focus-visible{outline:2px solid var(--live);outline-offset:2px;border-radius:6px}
  @media (max-width:520px){.panel-body{padding:16px 14px}}
  @media (prefers-reduced-motion:reduce){*{animation:none !important;transition:none !important}}
</style>
</head>
<body>
<div class="bg"></div>

<div class="app">
  <div class="update-banner" id="updateBanner"><span>Yeni sürüm hazır.</span><button id="updateBtn">Yenile</button></div>

  <!-- LANDING -->
  <section id="view-landing" class="view">
    <div class="center">
      <div class="auth-card">
        <div class="lockup" style="justify-content:center"><span class="glyph" data-glyph></span><span class="wordmark">VERİCİ</span></div>
        <p class="tagline">Ekranını tek bağlantıyla canlı yayınla. Oda kodunu paylaş, herkes anında izlesin.</p>
        <div style="max-width:320px;margin:0 auto 26px;width:100%">
          <div class="feat"><span class="fdot"></span><span>Ekranını ya da bir sekmeyi sesli paylaş</span></div>
          <div class="feat"><span class="fdot"></span><span>Yayıncı ve izleyiciler sesli sohbet edebilir</span></div>
          <div class="feat"><span class="fdot"></span><span>Kalıcı odalar — kodun hep aynı kalır</span></div>
        </div>
        <div class="stack">
          <button class="btn btn--primary btn--lg" data-go="#/giris">Giriş yap</button>
          <button class="btn btn--ghost btn--block" data-go="#/kayit">Hesap oluştur</button>
        </div>
      </div>
    </div>
  </section>

  <!-- LOGIN -->
  <section id="view-login" class="view">
    <div class="center">
      <div class="auth-card">
        <div class="lockup" style="justify-content:center"><span class="glyph" data-glyph></span></div>
        <h1>Giriş yap</h1>
        <p class="sub">Yayın yapmak ve izlemek için hesabına gir.</p>
        <div class="field"><label for="loginEmail">E-posta</label><input class="tinput" id="loginEmail" type="email" autocomplete="email" placeholder="ornek@eposta.com"></div>
        <div class="field"><label for="loginPass">Şifre</label><input class="tinput" id="loginPass" type="password" autocomplete="current-password" placeholder="••••••••"></div>
        <div class="form-error" id="loginErr"></div>
        <button class="btn btn--primary btn--lg" id="loginBtn">Giriş yap</button>
        <div style="margin-top:12px"><button class="linklike" data-go="#/sifre">Şifreni mi unuttun?</button></div>
        <div class="divider"><span>veya</span></div>
        <div class="stack">
          <button class="btn btn--provider" data-provider="google"><span data-google></span> Google ile devam et</button>
          <button class="btn btn--provider" data-provider="apple"><span data-apple></span> Apple ile devam et</button>
        </div>
        <p class="switch-line">Hesabın yok mu? <button class="linklike" data-go="#/kayit">Kayıt ol</button></p>
      </div>
    </div>
  </section>

  <!-- SIGNUP -->
  <section id="view-signup" class="view">
    <div class="center">
      <div class="auth-card">
        <div class="lockup" style="justify-content:center"><span class="glyph" data-glyph></span></div>
        <h1>Hesap oluştur</h1>
        <p class="sub">Birkaç saniyede başla.</p>
        <div class="field"><label for="suName">Görünen ad</label><input class="tinput" id="suName" type="text" autocomplete="name" placeholder="Adın"></div>
        <div class="field"><label for="suEmail">E-posta</label><input class="tinput" id="suEmail" type="email" autocomplete="email" placeholder="ornek@eposta.com"></div>
        <div class="field"><label for="suPass">Şifre</label><input class="tinput" id="suPass" type="password" autocomplete="new-password" placeholder="En az 6 karakter"></div>
        <div class="form-error" id="suErr"></div>
        <button class="btn btn--primary btn--lg" id="suBtn">Hesap oluştur</button>
        <div class="divider"><span>veya</span></div>
        <div class="stack">
          <button class="btn btn--provider" data-provider="google"><span data-google></span> Google ile devam et</button>
          <button class="btn btn--provider" data-provider="apple"><span data-apple></span> Apple ile devam et</button>
        </div>
        <p class="switch-line">Zaten hesabın var mı? <button class="linklike" data-go="#/giris">Giriş yap</button></p>
      </div>
    </div>
  </section>

  <!-- FORGOT -->
  <section id="view-forgot" class="view">
    <div class="center">
      <div class="auth-card">
        <div class="lockup" style="justify-content:center"><span class="glyph" data-glyph></span></div>
        <h1>Şifre sıfırlama</h1>
        <p class="sub">E-postanı gir, sıfırlama bağlantısı gönderelim.</p>
        <div class="field"><label for="fpEmail">E-posta</label><input class="tinput" id="fpEmail" type="email" autocomplete="email" placeholder="ornek@eposta.com"></div>
        <div class="form-error" id="fpErr"></div>
        <div class="form-ok" id="fpOk"></div>
        <button class="btn btn--primary btn--lg" id="fpBtn">Bağlantı gönder</button>
        <p class="switch-line"><button class="linklike" data-go="#/giris">Girişe dön</button></p>
      </div>
    </div>
  </section>

  <!-- ONBOARDING -->
  <section id="view-onboarding" class="view">
    <div class="center">
      <div class="slide on" data-step="0"><span class="glyph glyph--lg" data-glyph></span><h2>Verici'ye hoş geldin</h2><p>Ekranını saniyeler içinde canlıya alıp paylaşmanın en kısa yolu.</p></div>
      <div class="slide" data-step="1"><span class="glyph glyph--lg" data-glyph></span><h2>Oda oluştur</h2><p>Kalıcı bir oda aç; kodu hep aynı kalır, istediğin zaman yayına geç.</p></div>
      <div class="slide" data-step="2"><span class="glyph glyph--lg" data-glyph></span><h2>Paylaş ve konuş</h2><p>Kodu gönder, izleyenlerle sesli sohbet et. Herkes ekranını canlı görür.</p></div>
      <div class="dots" id="obDots"><i class="on"></i><i></i><i></i></div>
      <div class="stack" style="max-width:340px"><button class="btn btn--primary btn--lg" id="obNext">İleri</button></div>
    </div>
  </section>

  <!-- PANEL (ODALAR) -->
  <section id="view-panel" class="view">
    <div class="appbar">
      <div class="appbar-left"><span class="glyph" style="width:26px;height:26px" data-glyph></span><span class="wordmark" style="font-size:19px">VERİCİ</span></div>
      <div style="display:flex;align-items:center;gap:10px">
        <span class="livechip" id="panelLiveChip"></span>
        <span class="avatar js-avatar" data-go="#/profil"></span>
      </div>
    </div>
    <div class="page"><div class="page-inner tabbed">
      <button class="btn btn--primary btn--lg" id="newRoomBtn">Yeni oda oluştur</button>
      <div class="sec-title">Bir yayına katıl</div>
      <div class="join-row">
        <input class="tinput code-input" id="joinInput" placeholder="Kanal kodu" maxlength="6" autocomplete="off" spellcheck="false">
        <button class="btn btn--ghost" id="joinBtn">Katıl</button>
      </div>
      <div class="sec-title">Odalarım</div>
      <div id="roomsList"></div>
    </div></div>
  </section>

  <!-- ROOM DETAIL / SETTINGS -->
  <section id="view-room" class="view">
    <div class="appbar">
      <div class="appbar-left"><button class="iconbtn" data-go="#/panel" aria-label="Geri" data-ic-back></button><span class="title" id="roomDetailTitle">Oda</span></div>
      <span class="badge badge--live" id="roomLiveBadge" style="display:none">Yayında</span>
    </div>
    <div class="page"><div class="page-inner">
      <div class="codecard" style="margin-top:6px">
        <div class="codecard-label">Kanal kodu</div>
        <div class="code" id="roomCodeText">––––––</div>
        <div class="code-actions">
          <button class="btn btn--soft" id="roomCopyCode">Kodu kopyala</button>
          <button class="btn btn--soft" id="roomCopyLink">Bağlantıyı kopyala</button>
        </div>
      </div>
      <div style="margin-top:16px"><button class="btn btn--primary btn--block" id="roomStartBtn">Yayını başlat</button></div>
      <div class="sec-title">Oda ayarları</div>
      <div class="setting"><label for="roomNameInput">Oda adı</label><div class="join-row"><input class="tinput" id="roomNameInput" type="text" placeholder="Oda adı"><button class="btn btn--ghost" id="roomNameSave">Kaydet</button></div></div>
      <div class="toggle-row"><div class="toggle-main"><span class="toggle-title">Sesli sohbet</span><span class="toggle-sub">Yayıncı ve izleyiciler konuşabilir</span></div><label class="switch"><input type="checkbox" id="voiceToggle"><span class="slider"></span></label></div>
      <div class="toggle-row"><div class="toggle-main"><span class="toggle-title">İzleyici mikrofonu</span><span class="toggle-sub">Kapalıyken yalnızca yayıncı konuşur</span></div><label class="switch"><input type="checkbox" id="viewerMicToggle"><span class="slider"></span></label></div>
      <div style="margin-top:24px"><button class="btn btn--danger btn--block" id="deleteRoomBtn">Odayı sil</button></div>
    </div></div>
  </section>

  <!-- HISTORY -->
  <section id="view-history" class="view">
    <div class="appbar"><div class="appbar-left"><span class="title">Yayın geçmişi</span></div></div>
    <div class="page"><div class="page-inner tabbed"><div id="historyList"></div></div></div>
  </section>

  <!-- PROFILE -->
  <section id="view-profile" class="view">
    <div class="appbar"><div class="appbar-left"><span class="title">Profil</span></div></div>
    <div class="page"><div class="page-inner tabbed">
      <div class="profile-head">
        <span class="avatar avatar--lg js-avatar"></span>
        <h2 id="profileName">—</h2>
        <span class="email" id="profileEmail">—</span>
      </div>
      <div class="setting" style="margin-top:18px">
        <label for="nameInput">Görünen ad</label>
        <div class="join-row"><input class="tinput" id="nameInput" type="text" placeholder="Adın"><button class="btn btn--ghost" id="saveNameBtn">Kaydet</button></div>
      </div>
      <div class="sec-title">Hesap</div>
      <button class="row row--link" data-go="#/ayarlar"><span class="row-icon" data-ic-settings></span><span class="row-main"><span class="row-title">Ayarlar</span><span class="row-sub" style="font-family:var(--sans)">Yayın kalitesi, TURN sunucusu</span></span><span class="row-chev" data-ic-chev></span></button>
      <button class="row row--link" data-go="#/hakkinda"><span class="row-icon" data-ic-info></span><span class="row-main"><span class="row-title">Hakkında</span><span class="row-sub" style="font-family:var(--sans)">Nasıl çalışır, sürüm</span></span><span class="row-chev" data-ic-chev></span></button>
      <div style="margin-top:22px"><button class="btn btn--danger btn--block" id="signoutBtn">Çıkış yap</button></div>
    </div></div>
  </section>

  <!-- SETTINGS -->
  <section id="view-settings" class="view">
    <div class="appbar"><div class="appbar-left"><button class="iconbtn" data-go="#/profil" aria-label="Geri" data-ic-back></button><span class="title">Ayarlar</span></div></div>
    <div class="page"><div class="page-inner">
      <div class="sec-title" style="margin-top:6px">Yayın</div>
      <div class="setting">
        <label for="qualitySel">Yayın kalitesi</label>
        <select class="tselect" id="qualitySel">
          <option value="auto">Otomatik</option>
          <option value="1080">Yüksek (1080p)</option>
          <option value="720">Dengeli (720p)</option>
          <option value="fps">Akıcı (60 fps)</option>
        </select>
        <p class="hint">Ekran paylaşımı başlatılırken kullanılan çözünürlük/kare hızı tercihi.</p>
      </div>
      <div class="sec-title">TURN sunucusu (opsiyonel)</div>
      <div class="setting">
        <label for="turnUrl">Sunucu adresi</label>
        <input class="tinput" id="turnUrl" type="text" placeholder="turn:ornek.host:443?transport=tcp" autocapitalize="off" autocomplete="off" spellcheck="false">
      </div>
      <div class="setting">
        <div class="grid2">
          <div><label for="turnUser">Kullanıcı</label><input class="tinput" id="turnUser" type="text" autocapitalize="off" autocomplete="off" spellcheck="false"></div>
          <div><label for="turnCred">Şifre</label><input class="tinput" id="turnCred" type="text" autocapitalize="off" autocomplete="off" spellcheck="false"></div>
        </div>
        <p class="hint">Farklı ağlar (mobil veri ↔ wifi) arası bağlantı kurulamazsa bir TURN sunucusu gir. Boşsa yalnızca Google STUN kullanılır.</p>
      </div>
      <button class="btn btn--primary btn--block" id="saveSettingsBtn">Kaydet</button>
      <div class="sec-title">Uygulama</div>
      <div class="row"><span class="row-main"><span class="row-title">Sürüm</span></span><span class="row-end" id="settingsVer">v1.0.0</span></div>
    </div></div>
  </section>

  <!-- ABOUT -->
  <section id="view-about" class="view">
    <div class="appbar"><div class="appbar-left"><button class="iconbtn" data-go="#/profil" aria-label="Geri" data-ic-back></button><span class="title">Hakkında</span></div></div>
    <div class="page"><div class="page-inner">
      <div class="lockup" style="margin:6px 0 16px"><span class="glyph" data-glyph></span><span class="wordmark">VERİCİ</span></div>
      <div class="prose">
        <p>Verici, ekranını ya da bir tarayıcı sekmesini tek bir oda koduyla canlı yayınlamanı sağlar. Yayın doğrudan tarayıcılar arasında (WebRTC) akar; görüntü bir sunucuda saklanmaz.</p>
        <h3>Nasıl çalışır</h3>
        <ol class="steps-num">
          <li>Kalıcı bir oda oluştur; kodu hep aynı kalır.</li>
          <li>"Yayını başlat" ile paylaşacağın ekranı seç.</li>
          <li>Kodu paylaş; izleyenlerle sesli sohbet et.</li>
        </ol>
        <h3>Sesli sohbet</h3>
        <p>Yayıncı tüm izleyicileri, her izleyici de yayıncıyı duyar. Mikrofon varsayılan olarak kapalı başlar; konuşmak için mikrofon düğmesine bas. Yankıyı önlemek için kulaklık önerilir.</p>
        <h3>Gizlilik</h3>
        <p>Yayın yalnızca koda sahip olanlar tarafından izlenebilir. Yayını durdurduğunda bağlantı kapanır; oda ve ayarların kalır.</p>
      </div>
      <div class="row" style="margin-top:18px"><span class="row-main"><span class="row-title">Sürüm</span></span><span class="row-end" id="aboutVer">v1.0.0</span></div>
    </div></div>
  </section>

  <!-- BROADCASTER -->
  <section id="view-broadcaster" class="view">
    <div class="bar">
      <div class="bar-left">
        <button class="iconbtn" data-go="#/panel" aria-label="Panele dön" data-ic-back></button>
        <span class="pill pill--live">Canlı</span>
        <span class="readout time" id="elapsed">00:00:00</span>
        <button class="ctl" id="bcMicBtn" style="display:none" aria-label="Mikrofon"></button>
        <span class="chatbtn-wrap"><button class="ctl" id="bcChatBtn" aria-label="Sohbet"></button><span class="chat-dot" id="bcChatDot"></span></span>
      </div>
      <button class="btn btn--danger" id="stopBtn">Durdur</button>
    </div>
    <div class="panel-body">
      <div class="codecard">
        <div class="codecard-room" id="bcRoomName"></div>
        <div class="codecard-label">Kanal kodu</div>
        <div class="code" id="codeText">––––––</div>
        <div class="code-actions">
          <button class="btn btn--soft" id="copyCodeBtn">Kodu kopyala</button>
          <button class="btn btn--soft" id="copyLinkBtn">Bağlantıyı kopyala</button>
        </div>
        <div class="viewers"><span class="dot-mini"></span><span class="readout" id="viewerCount">0</span> izleyici</div>
      </div>
      <div class="stage stage--preview" id="previewStage">
        <video id="previewVideo" autoplay playsinline muted></video>
        <div class="crop"><i></i><i></i><i></i><i></i></div>
        <span class="stage-tag">Önizleme</span>
        <div class="controls" id="previewControls"><span class="spacer"></span>
          <button class="ctl" id="prevFitBtn" aria-label="En-boy değiştir"></button>
          <button class="ctl" id="prevFullBtn" aria-label="Tam ekran"></button>
        </div>
      </div>
    </div>
  </section>

  <!-- VIEWER -->
  <section id="view-viewer" class="view">
    <div class="bar">
      <div class="bar-left">
        <button class="iconbtn" data-go="#/panel" aria-label="Panele dön" data-ic-back></button>
        <span class="pill pill--connecting" id="vStatus">Bağlanıyor…</span>
        <button class="ctl" id="vwMicBtn" style="display:none" aria-label="Mikrofon"></button>
        <span class="chatbtn-wrap"><button class="ctl" id="vwChatBtn" aria-label="Sohbet"></button><span class="chat-dot" id="vwChatDot"></span></span>
      </div>
      <button class="btn btn--ghost" id="leaveBtn">Ayrıl</button>
    </div>
    <div class="stage stage--main" id="viewerStage">
      <video id="remoteVideo" autoplay playsinline muted></video>
      <div class="crop"><i></i><i></i><i></i><i></i></div>
      <div class="controls" id="viewerControls">
        <span class="pill pill--live small" id="vLivePill">Canlı</span><span class="spacer"></span>
        <button class="ctl" id="muteBtn" aria-label="Sesi aç"></button>
        <button class="ctl" id="fitBtn" aria-label="En-boy değiştir"></button>
        <button class="ctl" id="fullBtn" aria-label="Tam ekran"></button>
      </div>
      <div class="overlay" id="viewerOverlay"><div class="overlay-inner"><div class="spinner"></div><p>Bağlanıyor…</p></div></div>
    </div>
  </section>

  <!-- 404 -->
  <section id="view-404" class="view">
    <div class="center">
      <span class="glyph glyph--lg" data-glyph style="opacity:.5"></span>
      <h1 style="font-size:22px;margin:16px 0 6px">Sayfa bulunamadı</h1>
      <p class="sub" style="margin-bottom:22px">Aradığın ekran burada yok.</p>
      <button class="btn btn--primary" data-go="#/panel">Panele dön</button>
    </div>
  </section>

  <!-- TABBAR -->
  <nav class="tabbar">
    <div class="tabbar-inner">
      <button class="tab" data-tab="panel" data-go="#/panel"><span data-tab-home></span>Odalar</button>
      <button class="tab" data-tab="gecmis" data-go="#/gecmis"><span data-tab-clock></span>Geçmiş</button>
      <button class="tab" data-tab="profil" data-go="#/profil"><span data-tab-user></span>Profil</button>
    </div>
  </nav>
</div>

<div class="setup" id="setup" hidden>
  <div class="setup-card">
    <span class="glyph glyph--lg" data-glyph></span>
    <h2>Kurulum gerekli</h2>
    <p>Firebase yapılandırması eksik. Dosya başındaki <code>firebaseConfig</code> bloğunu doldur.</p>
  </div>
</div>

<div class="splash" id="splash"><span class="glyph" data-glyph></span></div>
<div class="toast" id="toast" role="status" aria-live="polite"></div>
<audio id="voiceSink" class="hidden-audio" autoplay></audio>
<div class="chat-backdrop" id="chatBackdrop"></div>
<div class="chat-drawer" id="chatDrawer">
  <div class="chat-head">
    <span class="title">Sohbet</span>
    <div class="chat-head-actions">
      <button class="iconbtn" id="chatPipBtn" aria-label="Ayrı pencere" style="display:none"></button>
      <button class="iconbtn" id="chatCloseBtn" aria-label="Kapat"></button>
    </div>
  </div>
  <div class="chat-list" id="chatList"></div>
  <div class="chat-input-row">
    <input class="chat-input" id="chatInput" placeholder="Mesaj yaz…" maxlength="500" autocomplete="off">
    <button class="chat-send" id="chatSendBtn" aria-label="Gönder"></button>
  </div>
</div>
<script type="module">
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, set, update, get, push, remove, onValue, onChildAdded, onChildRemoved, onDisconnect, serverTimestamp, query, limitToLast }
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword,
  signInWithPopup, GoogleAuthProvider, OAuthProvider, sendPasswordResetEmail, signOut, updateProfile }
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

/* ════════════════════ AYARLAR ════════════════════ */
const firebaseConfig = {
  apiKey:            "AIzaSyAP8L2s-zkRZMYTyBcerQNXvgEIhkwQbxA",
  authDomain:        "roomcast-4ef14.firebaseapp.com",
  databaseURL:       "https://roomcast-4ef14-default-rtdb.europe-west1.firebasedatabase.app",
  projectId:         "roomcast-4ef14",
  storageBucket:     "roomcast-4ef14.firebasestorage.app",
  messagingSenderId: "715031906249",
  appId:             "1:715031906249:web:17a32e1955799f85f74a18",
  measurementId:     "G-L3EGX86YBH"
};
const BASE_ICE = [{ urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302"] }];
/* ═════════════════════════════════════════════════ */

const APP_VERSION = "1.2.1";
const el = (id) => document.getElementById(id);
function esc(s){ return String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;" }[c])); }

const BRAND_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="2.4" fill="currentColor" stroke="none"/><path d="M7.5 7.5a6 6 0 0 0 0 9"/><path d="M16.5 7.5a6 6 0 0 1 0 9"/><path d="M4.8 4.8a9.6 9.6 0 0 0 0 14.4"/><path d="M19.2 4.8a9.6 9.6 0 0 1 0 14.4"/></svg>`;
const SVGS = {
  google: `<svg viewBox="0 0 18 18" width="18" height="18"><path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62z"/><path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.02-3.7H.96v2.34A9 9 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.98 10.72a5.4 5.4 0 0 1 0-3.44V4.94H.96a9 9 0 0 0 0 8.12l3.02-2.34z"/><path fill="#EA4335" d="M9 3.58c1.32 0 2.5.46 3.44 1.35l2.58-2.58A9 9 0 0 0 .96 4.94l3.02 2.34C4.68 5.16 6.66 3.58 9 3.58z"/></svg>`,
  apple: `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M16.37 1.43c.04 1.06-.36 2.1-1.06 2.87-.72.8-1.9 1.42-2.98 1.33-.13-1.02.4-2.1 1.05-2.78.73-.78 1.99-1.36 2.99-1.42zM20.2 17.2c-.55 1.27-.82 1.84-1.53 2.97-.99 1.57-2.39 3.53-4.12 3.54-1.54.02-1.94-1-4.03-.99-2.09.01-2.53 1.01-4.07.99-1.73-.02-3.05-1.78-4.04-3.35C-.4 16.5-.7 11.2 1 8.43 2.2 6.47 4.1 5.32 5.88 5.32c1.82 0 2.96 1 4.46 1 1.46 0 2.35-1 4.46-1 1.6 0 3.29.87 4.5 2.37-3.95 2.17-3.31 7.82.9 9.51z"/></svg>`,
  back: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>`,
  chev: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>`,
  settings: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1A2 2 0 1 1 7 4.6l.1.1a1.6 1.6 0 0 0 1.8.3H9a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V9a1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z"/></svg>`,
  info: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><path d="M12 8h.01"/></svg>`,
  tabHome: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11.5 12 4l8 7.5"/><path d="M6 10v10h12V10"/></svg>`,
  tabClock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg>`,
  tabUser: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="3.5"/><path d="M5.5 20a6.5 6.5 0 0 1 13 0"/></svg>`,
  cast: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="2.4" fill="currentColor" stroke="none"/><path d="M7.5 7.5a6 6 0 0 0 0 9"/><path d="M16.5 7.5a6 6 0 0 1 0 9"/></svg>`,
  play: `<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M8 5v14l11-7z"/></svg>`,
  volOn: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="M16 9a4 4 0 0 1 0 6"/><path d="M19 6a8 8 0 0 1 0 12"/></svg>`,
  volOff: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="M22 9l-6 6"/><path d="M16 9l6 6"/></svg>`,
  micOn: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0"/><path d="M12 18v3"/></svg>`,
  micOff: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 9v2a3 3 0 0 0 5 2.2"/><path d="M15 11V6a3 3 0 0 0-5.6-1.5"/><path d="M5 11a7 7 0 0 0 10.5 6"/><path d="M12 18v3"/><path d="M3 3l18 18"/></svg>`,
  fit: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2v14a2 2 0 0 0 2 2h14"/><path d="M2 6h14a2 2 0 0 1 2 2v14"/></svg>`,
  full: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H3v5"/><path d="M21 8V3h-5"/><path d="M16 21h5v-5"/><path d="M3 16v5h5"/></svg>`,
  exit: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8h5V3"/><path d="M16 3v5h5"/><path d="M21 16h-5v5"/><path d="M8 21v-5H3"/></svg>`
};
SVGS.chat = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.4 8.4 0 0 1-8.5 8.5 9 9 0 0 1-3.8-.8L3 21l1.9-5.7A8.4 8.4 0 0 1 4 11.5 8.5 8.5 0 0 1 12.5 3 8.4 8.4 0 0 1 21 11.5z"/></svg>`;
SVGS.send = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4z"/></svg>`;
SVGS.pip = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><rect x="12" y="11" width="7" height="5" rx="1" fill="currentColor" stroke="none"/></svg>`;
SVGS.close = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12"/><path d="M18 6 6 18"/></svg>`;
function paintIcons(){
  document.querySelectorAll("[data-glyph]").forEach(n => n.innerHTML = BRAND_SVG);
  document.querySelectorAll("[data-google]").forEach(n => n.innerHTML = SVGS.google);
  document.querySelectorAll("[data-apple]").forEach(n => n.innerHTML = SVGS.apple);
  document.querySelectorAll("[data-ic-back]").forEach(n => n.innerHTML = SVGS.back);
  document.querySelectorAll("[data-ic-chev]").forEach(n => n.innerHTML = SVGS.chev);
  document.querySelectorAll("[data-ic-settings]").forEach(n => n.innerHTML = SVGS.settings);
  document.querySelectorAll("[data-ic-info]").forEach(n => n.innerHTML = SVGS.info);
  document.querySelectorAll("[data-tab-home]").forEach(n => n.innerHTML = SVGS.tabHome);
  document.querySelectorAll("[data-tab-clock]").forEach(n => n.innerHTML = SVGS.tabClock);
  document.querySelectorAll("[data-tab-user]").forEach(n => n.innerHTML = SVGS.tabUser);
}

let app, db, auth, firebaseReady = false, authReady = false, currentUser = null;
let pendingRoom = null, pendingJoinCode = null;
let localStream = null, micStream = null, micTrack = null, voiceStream = null;
let roomCode = null, roomRef = null, liveRoomMeta = null;
const peers = new Map();
let bcUnsubs = [], isBroadcasting = false, peakViewers = 0, bcStartedAt = 0;
let timerInt = null, timerStart = 0;
let viewerPc = null, viewerMicStream = null, viewerMicTrack = null;
let currentRoom = null, myViewerRef = null, myViewerId = null;
let viewerUnsubs = [], viewerActive = false, viewerMuted = true;
let historyUnsub = null, broadcasts = [];
let roomsUnsub = null, myRooms = [], currentRoomDetail = null;
let chatUnsub = null, chatMsgs = [], chatRoom = null, chatOpen = false, chatUnread = false;
let pipWindow = null, pipList = null;

function configMissing(){ const c = firebaseConfig; return !c.apiKey || /YOUR_/.test(c.apiKey) || !c.databaseURL || /YOUR_/.test(c.databaseURL); }
if (configMissing()) { el("setup").hidden = false; el("splash").classList.add("hide"); }
else { try { app = initializeApp(firebaseConfig); db = getDatabase(app); auth = getAuth(app); firebaseReady = true; } catch (e) { console.error(e); el("setup").hidden = false; el("splash").classList.add("hide"); } }
const googleProvider = firebaseReady ? new GoogleAuthProvider() : null;
let appleProvider = null;
if (firebaseReady) { appleProvider = new OAuthProvider("apple.com"); appleProvider.addScope("email"); appleProvider.addScope("name"); }

let toastT;
function toast(msg){ const t = el("toast"); t.textContent = msg; t.classList.add("toast--show"); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("toast--show"), 2800); }
async function copyText(txt, ok){ try { await navigator.clipboard.writeText(txt); toast(ok); } catch { toast("Kopyalanamadı"); } }
function roomLink(code){ return location.origin + location.pathname + "?room=" + (code || ""); }
function genCode(){ const cs = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; let s = ""; for (let i = 0; i < 6; i++) s += cs[Math.floor(Math.random() * cs.length)]; return s; }
function fmtTime(s){ const h = String(Math.floor(s/3600)).padStart(2,"0"); const m = String(Math.floor((s%3600)/60)).padStart(2,"0"); const ss = String(s%60).padStart(2,"0"); return h + ":" + m + ":" + ss; }
function fmtDur(s){ if (s < 60) return s + " sn"; const m = Math.floor(s/60), ss = s%60; if (m < 60) return m + " dk" + (ss ? " " + ss + " sn" : ""); const h = Math.floor(m/60); return h + " sa " + (m%60) + " dk"; }
function fmtDate(ts){ try { return new Date(ts).toLocaleString("tr-TR", { day:"2-digit", month:"short", hour:"2-digit", minute:"2-digit" }); } catch { return ""; } }
function getIceServers(){
  const ice = BASE_ICE.slice();
  try { const url = (localStorage.getItem("verici_turn_url") || "").trim();
    if (url) { const e = { urls: url }; const u = localStorage.getItem("verici_turn_user"); const c = localStorage.getItem("verici_turn_cred"); if (u) e.username = u; if (c) e.credential = c; ice.push(e); } } catch {}
  return ice;
}
function displayConstraints(){
  let q = "auto"; try { q = localStorage.getItem("verici_quality") || "auto"; } catch {}
  if (q === "1080") return { video: { width:{ideal:1920}, height:{ideal:1080}, frameRate:{ideal:30} }, audio: true };
  if (q === "720")  return { video: { width:{ideal:1280}, height:{ideal:720}, frameRate:{ideal:30} }, audio: true };
  if (q === "fps")  return { video: { frameRate:{ideal:60} }, audio: true };
  return { video: { frameRate:{ideal:30} }, audio: true };
}
function getMic(){ return navigator.mediaDevices.getUserMedia({ audio: { echoCancellation:true, noiseSuppression:true, autoGainControl:true } }); }

const VIEW_MAP = { karsilama:"view-landing", giris:"view-login", kayit:"view-signup", sifre:"view-forgot" };
function routeName(){ const h = location.hash.replace(/^#\/?/, ""); return h.split("?")[0] || ""; }
function go(hash){ if (location.hash !== hash) location.hash = hash; else applyRoute(); }
function showOnly(id, opts){
  opts = opts || {};
  document.querySelectorAll(".view").forEach(v => v.classList.toggle("view--active", v.id === id));
  document.querySelector(".app").classList.toggle("show-tabs", !!opts.tabs);
  if (opts.tab) document.querySelectorAll(".tab").forEach(t => t.classList.toggle("active", t.dataset.tab === opts.tab));
  const pg = document.querySelector("#" + id + " .page"); if (pg) pg.scrollTop = 0;
}
function applyRoute(){
  if (!authReady) return;
  const n = routeName(), authed = !!currentUser;
  const publicRoutes = ["karsilama","giris","kayit","sifre"];
  if (!authed) {
    if (n === "") return showOnly("view-landing", { tabs:false });
    if (publicRoutes.includes(n)) return showOnly(VIEW_MAP[n], { tabs:false });
    return go("#/karsilama");
  }
  if (n === "" || publicRoutes.includes(n)) return go("#/panel");
  switch (n) {
    case "panel": showOnly("view-panel", { tabs:true, tab:"panel" }); renderRooms(); refreshPanel(); break;
    case "oda": showOnly("view-room", { tabs:false }); renderRoomDetail(); break;
    case "gecmis": showOnly("view-history", { tabs:true, tab:"gecmis" }); break;
    case "profil": showOnly("view-profile", { tabs:true, tab:"profil" }); break;
    case "ayarlar": showOnly("view-settings", { tabs:false }); loadSettings(); break;
    case "hakkinda": showOnly("view-about", { tabs:false }); break;
    case "tur": showOnly("view-onboarding", { tabs:false }); break;
    case "yayin": if (isBroadcasting) showOnly("view-broadcaster", { tabs:false }); else go("#/panel"); break;
    case "izle":
      if (viewerActive) showOnly("view-viewer", { tabs:false });
      else if (pendingJoinCode) { const c = pendingJoinCode; pendingJoinCode = null; showOnly("view-viewer", { tabs:false }); doJoin(c); }
      else go("#/panel");
      break;
    default: showOnly("view-404", { tabs:false });
  }
}
window.addEventListener("hashchange", () => applyRoute());

function needsOnboard(user){ try { return !localStorage.getItem("verici_onboarded_" + user.uid); } catch { return false; } }
function authError(code){
  const m = { "auth/invalid-email":"Geçersiz e-posta adresi.","auth/missing-password":"Şifre gir.","auth/invalid-credential":"E-posta veya şifre hatalı.","auth/wrong-password":"E-posta veya şifre hatalı.","auth/user-not-found":"Böyle bir hesap yok.","auth/email-already-in-use":"Bu e-posta zaten kayıtlı.","auth/weak-password":"Şifre en az 6 karakter olmalı.","auth/too-many-requests":"Çok fazla deneme. Biraz sonra tekrar dene.","auth/popup-closed-by-user":"Giriş penceresi kapatıldı.","auth/popup-blocked":"Açılır pencere engellendi. İzin ver ve tekrar dene.","auth/cancelled-popup-request":"","auth/operation-not-allowed":"Bu giriş yöntemi henüz etkin değil.","auth/unauthorized-domain":"Bu alan adı Firebase'de yetkili değil (Authentication → Settings → Authorized domains)." };
  return m[code] || "Bir hata oluştu. Tekrar dene.";
}
if (firebaseReady) {
  onAuthStateChanged(auth, (user) => {
    currentUser = user;
    if (!authReady) { authReady = true; el("splash").classList.add("hide"); }
    updateProfileUI(user);
    if (user) {
      attachHistory(user.uid); attachRooms(user.uid);
      if (pendingRoom) { const c = pendingRoom; pendingRoom = null; joinFromCode(c); return; }
      if (needsOnboard(user)) { go("#/tur"); return; }
      const n = routeName();
      if (n === "" || ["karsilama","giris","kayit","sifre"].includes(n)) go("#/panel"); else applyRoute();
    } else {
      resetAppState();
      const n = routeName();
      if (!["karsilama","giris","kayit","sifre"].includes(n)) go("#/karsilama"); else applyRoute();
    }
  });
}
function attachHistory(uid){
  if (historyUnsub) { try { historyUnsub(); } catch {} historyUnsub = null; }
  historyUnsub = onValue(ref(db, "users/" + uid + "/broadcasts"), (snap) => {
    const val = snap.val() || {};
    broadcasts = Object.entries(val).map(([k, v]) => ({ key:k, ...v })).sort((a, b) => (b.startedAt||0) - (a.startedAt||0));
    renderHistory(); renderRecent();
  }, () => {});
}
function attachRooms(uid){
  if (roomsUnsub) { try { roomsUnsub(); } catch {} roomsUnsub = null; }
  roomsUnsub = onValue(ref(db, "users/" + uid + "/rooms"), (snap) => {
    const val = snap.val() || {};
    myRooms = Object.entries(val).map(([code, v]) => ({ code, ...v })).sort((a, b) => (b.createdAt||0) - (a.createdAt||0));
    renderRooms();
  }, () => {});
}
function resetAppState(){
  try { if (isBroadcasting) stopBroadcast(true); } catch {}
  try { if (viewerActive) cleanupViewer(true); } catch {}
  isBroadcasting = false; viewerActive = false; pendingJoinCode = null;
  if (historyUnsub) { try { historyUnsub(); } catch {} historyUnsub = null; }
  if (roomsUnsub) { try { roomsUnsub(); } catch {} roomsUnsub = null; }
  broadcasts = []; myRooms = [];
}

function initials(user){
  if (user && user.displayName) return user.displayName.trim().split(/\s+/).map(s => s[0]).slice(0,2).join("").toUpperCase();
  if (user && user.email) return user.email[0].toUpperCase();
  return "V";
}
function updateProfileUI(user){
  const name = (user && user.displayName) || (user && user.email ? user.email.split("@")[0] : "Kullanıcı");
  document.querySelectorAll(".js-avatar").forEach(a => { if (user && user.photoURL) a.innerHTML = '<img src="' + user.photoURL + '" alt="" referrerpolicy="no-referrer">'; else a.textContent = initials(user); });
  if (el("profileName")) el("profileName").textContent = name;
  if (el("profileEmail")) el("profileEmail").textContent = (user && user.email) || "";
  if (el("nameInput")) el("nameInput").value = (user && user.displayName) || "";
}
function refreshPanel(){
  const chip = el("panelLiveChip");
  if (isBroadcasting) { chip.textContent = "Canlı yayın"; chip.classList.add("show"); chip.onclick = () => go("#/yayin"); }
  else if (viewerActive) { chip.textContent = "İzleniyor"; chip.classList.add("show"); chip.onclick = () => go("#/izle"); }
  else { chip.classList.remove("show"); chip.onclick = null; }
}

/* ──────── ODALAR ──────── */
async function createUniqueRoom(){
  for (let i = 0; i < 6; i++) { const code = genCode(); const snap = await get(ref(db, "rooms/" + code + "/meta")); if (!snap.exists()) return code; }
  return genCode();
}
async function createRoom(){
  if (!currentUser) return;
  const code = await createUniqueRoom();
  const name = "Oda " + code;
  try {
    await set(ref(db, "rooms/" + code + "/meta"), { owner: currentUser.uid, name, voice: true, viewerMic: true, live: false, createdAt: serverTimestamp() });
    await set(ref(db, "users/" + currentUser.uid + "/rooms/" + code), { name, createdAt: serverTimestamp(), live: false });
  } catch (e) { toast("Oda oluşturulamadı"); return; }
  openRoom(code);
}
function openRoom(code){ currentRoomDetail = code; go("#/oda"); }
async function deleteRoom(code){
  try { await remove(ref(db, "rooms/" + code)); await remove(ref(db, "users/" + currentUser.uid + "/rooms/" + code)); toast("Oda silindi"); } catch { toast("Silinemedi"); }
  go("#/panel");
}
async function updateRoomMeta(code, patch){
  try {
    await update(ref(db, "rooms/" + code + "/meta"), patch);
    if (patch.name !== undefined) await update(ref(db, "users/" + currentUser.uid + "/rooms/" + code), { name: patch.name });
  } catch { toast("Güncellenemedi"); }
}
function renderRooms(){
  const wrap = el("roomsList"); if (!wrap) return;
  wrap.innerHTML = "";
  if (!myRooms.length) { wrap.innerHTML = '<div class="empty"><span class="glyph glyph--lg">' + BRAND_SVG + '</span><p>Henüz odan yok</p><span>"Yeni oda oluştur" ile kalıcı bir oda aç.</span></div>'; return; }
  myRooms.forEach(r => {
    const row = document.createElement("div"); row.className = "room-row";
    const sub = esc(r.code) + (r.live ? ' · <span class="live-dot">canlı</span>' : '');
    row.innerHTML = '<button class="room-main"><span class="row-icon">' + SVGS.cast + '</span><span class="room-body"><span class="room-name">' + esc(r.name || r.code) + '</span><span class="row-sub">' + sub + '</span></span></button><button class="room-start" aria-label="Yayını başlat">' + SVGS.play + '</button>';
    row.querySelector(".room-main").onclick = () => openRoom(r.code);
    row.querySelector(".room-start").onclick = () => goLive(r.code);
    wrap.appendChild(row);
  });
}
async function renderRoomDetail(){
  const code = currentRoomDetail; if (!code) return go("#/panel");
  let meta = null;
  try { const s = await get(ref(db, "rooms/" + code + "/meta")); meta = s.val(); } catch {}
  if (!meta) { toast("Oda bulunamadı"); return go("#/panel"); }
  el("roomDetailTitle").textContent = meta.name || "Oda";
  el("roomNameInput").value = meta.name || "";
  el("roomCodeText").textContent = code;
  el("voiceToggle").checked = !!meta.voice;
  el("viewerMicToggle").checked = !!meta.viewerMic;
  el("viewerMicToggle").disabled = !meta.voice;
  el("roomLiveBadge").style.display = meta.live ? "inline-flex" : "none";
  el("roomStartBtn").textContent = (isBroadcasting && roomCode === code) ? "Yayına dön" : "Yayını başlat";
}

/* ──────── GEÇMİŞ ──────── */
function broadcastRow(b){
  const div = document.createElement("div"); div.className = "row";
  div.innerHTML = '<span class="row-icon">' + SVGS.cast + '</span>' +
    '<span class="row-main"><span class="row-title">' + esc(b.name || b.code || "Yayın") + '</span>' +
    '<span class="row-sub">' + esc(b.code || "") + ' · ' + fmtDate(b.startedAt) + ' · ' + fmtDur(b.durationSec || 0) + '</span></span>' +
    '<span class="row-end"><span class="big">' + (b.peakViewers || 0) + '</span><br>izleyici</span>';
  return div;
}
function renderRecent(){
  const wrap = el("recentList"); if (!wrap) return;
  wrap.innerHTML = ""; const recent = broadcasts.slice(0, 3);
  if (el("recentTitle")) el("recentTitle").style.display = recent.length ? "flex" : "none";
  recent.forEach(b => wrap.appendChild(broadcastRow(b)));
}
function renderHistory(){
  const wrap = el("historyList"); if (!wrap) return; wrap.innerHTML = "";
  if (!broadcasts.length) { wrap.innerHTML = '<div class="empty"><span class="glyph glyph--lg">' + BRAND_SVG + '</span><p>Henüz yayın yapmadın</p><span>İlk yayınını başlattığında burada listelenir.</span></div>'; return; }
  broadcasts.forEach(b => wrap.appendChild(broadcastRow(b)));
}

/* ──────── AYARLAR ──────── */
function loadSettings(){
  try {
    el("qualitySel").value = localStorage.getItem("verici_quality") || "auto";
    el("turnUrl").value = localStorage.getItem("verici_turn_url") || "";
    el("turnUser").value = localStorage.getItem("verici_turn_user") || "";
    el("turnCred").value = localStorage.getItem("verici_turn_cred") || "";
  } catch {}
}
function saveSettings(){
  try {
    localStorage.setItem("verici_quality", el("qualitySel").value);
    localStorage.setItem("verici_turn_url", el("turnUrl").value.trim());
    localStorage.setItem("verici_turn_user", el("turnUser").value.trim());
    localStorage.setItem("verici_turn_cred", el("turnCred").value.trim());
    toast("Ayarlar kaydedildi");
  } catch { toast("Kaydedilemedi"); }
}

function bufferInit(pc){ pc._remoteReady = false; pc._pending = []; }
async function addRemoteIce(pc, cand){ if (!cand) return; if (pc._remoteReady) { try { await pc.addIceCandidate(cand); } catch (e) { console.warn(e); } } else pc._pending.push(cand); }
async function flushIce(pc){ pc._remoteReady = true; for (const c of pc._pending) { try { await pc.addIceCandidate(c); } catch (e) { console.warn(e); } } pc._pending = []; }

/* ════════════ SOHBET ════════════ */
const PIP_CSS = `body{margin:0;background:#0B0E14;color:#E8EDF6;font-family:'Space Grotesk',system-ui,-apple-system,Segoe UI,Roboto,sans-serif}
.pip-root{display:flex;flex-direction:column;height:100vh}
.pip-head{padding:11px 14px;border-bottom:1px solid #1F2840;font-weight:600;font-size:13px;color:#FF9F1C;letter-spacing:.04em;flex:none}
.pip-list{flex:1;overflow-y:auto;padding:12px 14px;display:flex;flex-direction:column;gap:9px}
.pip-msg{max-width:88%;align-self:flex-start;display:flex;flex-direction:column}
.pip-msg.me{align-self:flex-end;align-items:flex-end}
.pip-name{font-size:11px;color:#8A95AC;margin-bottom:2px}
.pip-bubble{display:inline-block;background:#141A28;border:1px solid #1F2840;border-radius:11px;padding:7px 11px;font-size:13px;line-height:1.4;word-break:break-word}
.pip-msg.me .pip-bubble{background:rgba(255,159,28,.14);border-color:rgba(255,159,28,.3)}
.pip-empty{margin:auto;color:#5E6981;font-size:13px;text-align:center}`;

function chatMsgEl(m){
  const me = currentUser && m.uid === currentUser.uid;
  const w = document.createElement("div"); w.className = "chat-msg" + (me ? " me" : "");
  w.innerHTML = (me ? "" : '<div class="chat-name">' + esc(m.name || "Biri") + '</div>') + '<div class="chat-bubble">' + esc(m.text || "") + '</div>';
  return w;
}
function pipMsgEl(doc, m){
  const me = currentUser && m.uid === currentUser.uid;
  const w = doc.createElement("div"); w.className = "pip-msg" + (me ? " me" : "");
  w.innerHTML = (me ? "" : '<div class="pip-name">' + esc(m.name || "Biri") + '</div>') + '<div class="pip-bubble">' + esc(m.text || "") + '</div>';
  return w;
}
function renderChat(){
  const list = el("chatList"); if (!list) return;
  list.innerHTML = "";
  if (!chatMsgs.length) list.innerHTML = '<div class="chat-empty">Henüz mesaj yok.</div>';
  else chatMsgs.forEach(m => list.appendChild(chatMsgEl(m)));
  list.scrollTop = list.scrollHeight;
  if (pipWindow && pipList) { pipList.innerHTML = chatMsgs.length ? "" : '<div class="pip-empty">Henüz mesaj yok.</div>'; chatMsgs.forEach(m => pipList.appendChild(pipMsgEl(pipWindow.document, m))); pipList.scrollTop = pipList.scrollHeight; }
}
function appendChatMsg(m){
  const list = el("chatList");
  if (list) { const e = list.querySelector(".chat-empty"); if (e) e.remove(); const atBottom = list.scrollHeight - list.scrollTop - list.clientHeight < 60; list.appendChild(chatMsgEl(m)); if (atBottom || chatOpen) list.scrollTop = list.scrollHeight; }
  if (pipWindow && pipList) { const pe = pipList.querySelector(".pip-empty"); if (pe) pe.remove(); pipList.appendChild(pipMsgEl(pipWindow.document, m)); pipList.scrollTop = pipList.scrollHeight; }
}
function attachChat(code){
  detachChat();
  chatRoom = code; chatMsgs = []; renderChat();
  chatUnsub = onChildAdded(query(ref(db, "rooms/" + code + "/chat"), limitToLast(60)), (snap) => {
    const m = snap.val(); if (!m) return;
    chatMsgs.push(m); if (chatMsgs.length > 300) chatMsgs.shift();
    appendChatMsg(m);
    if (!chatOpen) { chatUnread = true; updateChatDots(); }
  }, () => {});
}
function detachChat(){ if (chatUnsub) { try { chatUnsub(); } catch {} chatUnsub = null; } closeChatPip(); chatRoom = null; chatMsgs = []; chatUnread = false; updateChatDots(); renderChat(); }
async function sendChat(){
  const inp = el("chatInput"); const text = (inp.value || "").trim();
  if (!text || !chatRoom || !currentUser) return;
  inp.value = "";
  const name = currentUser.displayName || (currentUser.email ? currentUser.email.split("@")[0] : "Kullanıcı");
  try { await push(ref(db, "rooms/" + chatRoom + "/chat"), { uid: currentUser.uid, name, text, ts: serverTimestamp() }); } catch { toast("Mesaj gönderilemedi"); }
}
function openChat(){
  if (!chatRoom) return toast("Sohbet yalnızca yayın sırasında açık.");
  chatOpen = true; chatUnread = false; updateChatDots();
  el("chatDrawer").classList.add("open"); el("chatBackdrop").classList.add("open");
  const l = el("chatList"); if (l) l.scrollTop = l.scrollHeight;
  setTimeout(() => { const i = el("chatInput"); if (i) i.focus(); }, 220);
}
function closeChat(){ chatOpen = false; el("chatDrawer").classList.remove("open"); el("chatBackdrop").classList.remove("open"); }
function updateChatDots(){ ["bcChatDot", "vwChatDot"].forEach(id => { const d = el(id); if (d) d.classList.toggle("show", chatUnread); }); }
async function openChatPip(){
  if (!("documentPictureInPicture" in window)) return toast("Bu tarayıcı ayrı pencereyi desteklemiyor.");
  if (pipWindow) { try { pipWindow.focus(); } catch {} return; }
  try { pipWindow = await window.documentPictureInPicture.requestWindow({ width: 264, height: 320 }); }
  catch { toast("Pencere açılamadı."); return; }
  const doc = pipWindow.document;
  const fl = doc.createElement("link"); fl.rel = "stylesheet"; fl.href = "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap"; doc.head.appendChild(fl);
  const st = doc.createElement("style"); st.textContent = PIP_CSS; doc.head.appendChild(st);
  const root = doc.createElement("div"); root.className = "pip-root";
  root.innerHTML = '<div class="pip-head">Verici · Sohbet</div><div class="pip-list" id="pipList"></div>';
  doc.body.appendChild(root);
  pipList = doc.getElementById("pipList");
  if (!chatMsgs.length) pipList.innerHTML = '<div class="pip-empty">Henüz mesaj yok.</div>';
  else chatMsgs.forEach(m => pipList.appendChild(pipMsgEl(doc, m)));
  pipList.scrollTop = pipList.scrollHeight;
  pipWindow.addEventListener("pagehide", () => { pipWindow = null; pipList = null; });
}
function closeChatPip(){ if (pipWindow) { try { pipWindow.close(); } catch {} } pipWindow = null; pipList = null; }

/* ════════════ YAYINCI ════════════ */
async function goLive(code){
  if (!firebaseReady || !currentUser) return;
  if (isBroadcasting && roomCode === code) return go("#/yayin");
  if (isBroadcasting) return toast("Zaten bir yayındasın. Önce onu durdur.");
  if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) return toast("Bu tarayıcı ekran paylaşımını desteklemiyor. Masaüstü Chrome kullan.");
  let meta = null;
  try { const s = await get(ref(db, "rooms/" + code + "/meta")); meta = s.val(); } catch {}
  if (!meta) return toast("Oda bulunamadı");
  if (meta.owner !== currentUser.uid) return toast("Bu oda sana ait değil");
  try { localStream = await navigator.mediaDevices.getDisplayMedia(displayConstraints()); }
  catch (e) { toast(e && e.name === "NotAllowedError" ? "Ekran paylaşımı iptal edildi." : "Ekran paylaşımı başlatılamadı."); return; }
  micStream = null; micTrack = null;
  if (meta.voice) {
    try { micStream = await getMic(); micTrack = micStream.getAudioTracks()[0]; if (micTrack) micTrack.enabled = false; } catch { micTrack = null; }
  }
  roomCode = code; liveRoomMeta = meta; roomRef = ref(db, "rooms/" + code);
  try { await remove(ref(db, "rooms/" + code + "/viewers")); } catch {}
  await update(ref(db, "rooms/" + code + "/meta"), { live: true, host: currentUser.uid, liveSince: serverTimestamp() });
  try { await set(ref(db, "users/" + currentUser.uid + "/rooms/" + code + "/live"), true); } catch {}
  onDisconnect(ref(db, "rooms/" + code + "/meta/live")).set(false);
  onDisconnect(ref(db, "rooms/" + code + "/viewers")).remove();
  onDisconnect(ref(db, "users/" + currentUser.uid + "/rooms/" + code + "/live")).set(false);
  voiceStream = new MediaStream(); el("voiceSink").srcObject = voiceStream;
  el("previewVideo").srcObject = localStream;
  const vTrack = localStream.getVideoTracks()[0]; if (vTrack) vTrack.onended = () => stopBroadcast();
  const viewersRef = ref(db, "rooms/" + code + "/viewers");
  bcUnsubs.push(onChildAdded(viewersRef, (s) => handleNewViewer(s.key)));
  bcUnsubs.push(onChildRemoved(viewersRef, (s) => teardownViewer(s.key)));
  el("codeText").textContent = code;
  el("bcRoomName").textContent = meta.name || "Oda";
  attachChat(code);
  setupMicBtn("bcMicBtn", !!micTrack, !!meta.voice);
  peakViewers = 0; bcStartedAt = Date.now(); updateViewerCount(); startTimer();
  isBroadcasting = true; go("#/yayin");
}
async function handleNewViewer(viewerId){
  if (peers.has(viewerId)) return;
  const base = "rooms/" + roomCode + "/viewers/" + viewerId;
  const pc = new RTCPeerConnection({ iceServers: getIceServers() });
  bufferInit(pc);
  localStream.getTracks().forEach(t => pc.addTrack(t, localStream));
  if (micTrack) pc.addTrack(micTrack, micStream);
  const vtracks = [];
  pc.ontrack = (e) => { if (e.track.kind === "audio" && voiceStream) { voiceStream.addTrack(e.track); vtracks.push(e.track); } };
  pc.onicecandidate = (e) => { if (e.candidate) push(ref(db, base + "/hostCandidates"), e.candidate.toJSON()); };
  const unsubAnswer = onValue(ref(db, base + "/answer"), async (snap) => {
    const ans = snap.val();
    if (ans && !pc.currentRemoteDescription) { try { await pc.setRemoteDescription(ans); await flushIce(pc); } catch (e) { console.warn(e); } }
  });
  const unsubCand = onChildAdded(ref(db, base + "/viewerCandidates"), (snap) => addRemoteIce(pc, snap.val()));
  try { const offer = await pc.createOffer(); await pc.setLocalDescription(offer); await set(ref(db, base + "/offer"), { type: offer.type, sdp: offer.sdp }); } catch (e) { console.warn(e); }
  peers.set(viewerId, { pc, unsubs: [unsubAnswer, unsubCand], vtracks });
  updateViewerCount();
}
function teardownViewer(viewerId){
  const p = peers.get(viewerId); if (!p) return;
  try { p.unsubs.forEach(u => u && u()); } catch {}
  try { if (p.vtracks && voiceStream) p.vtracks.forEach(t => { try { voiceStream.removeTrack(t); } catch {} }); } catch {}
  try { p.pc.close(); } catch {}
  peers.delete(viewerId); updateViewerCount();
}
function updateViewerCount(){ peakViewers = Math.max(peakViewers, peers.size); if (el("viewerCount")) el("viewerCount").textContent = peers.size; }
function stopBroadcast(silent){
  if (currentUser && roomCode && bcStartedAt) {
    const rec = { code: roomCode, name: (liveRoomMeta && liveRoomMeta.name) || roomCode, startedAt: bcStartedAt, endedAt: Date.now(), durationSec: Math.floor((Date.now() - bcStartedAt) / 1000), peakViewers };
    try { push(ref(db, "users/" + currentUser.uid + "/broadcasts"), rec); } catch {}
  }
  if (localStream) localStream.getTracks().forEach(t => { try { t.stop(); } catch {} });
  if (micStream) micStream.getTracks().forEach(t => { try { t.stop(); } catch {} });
  Array.from(peers.keys()).forEach(id => teardownViewer(id)); peers.clear();
  bcUnsubs.forEach(u => { try { u && u(); } catch {} }); bcUnsubs = [];
  if (roomCode) {
    const c = roomCode;
    try { onDisconnect(ref(db, "rooms/" + c + "/meta/live")).cancel(); } catch {}
    try { onDisconnect(ref(db, "rooms/" + c + "/viewers")).cancel(); } catch {}
    if (currentUser) { try { onDisconnect(ref(db, "users/" + currentUser.uid + "/rooms/" + c + "/live")).cancel(); } catch {} }
    update(ref(db, "rooms/" + c + "/meta"), { live: false }).catch(() => {});
    remove(ref(db, "rooms/" + c + "/viewers")).catch(() => {});
    if (currentUser) set(ref(db, "users/" + currentUser.uid + "/rooms/" + c + "/live"), false).catch(() => {});
  }
  stopTimer();
  isBroadcasting = false; peakViewers = 0; bcStartedAt = 0;
  localStream = null; micStream = null; micTrack = null; voiceStream = null; liveRoomMeta = null; roomCode = null;
  if (el("previewVideo")) el("previewVideo").srcObject = null;
  if (el("voiceSink")) el("voiceSink").srcObject = null;
  detachChat(); closeChat();
  if (!silent) go("#/panel");
}
function startTimer(){ timerStart = Date.now(); el("elapsed").textContent = "00:00:00"; timerInt = setInterval(() => { el("elapsed").textContent = fmtTime(Math.floor((Date.now() - timerStart) / 1000)); }, 1000); }
function stopTimer(){ clearInterval(timerInt); timerInt = null; }

/* ════════════ İZLEYİCİ ════════════ */
function joinFromCode(code){
  code = (code || "").trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (!code) return toast("Kanal kodu gir.");
  pendingJoinCode = code; go("#/izle");
}
async function doJoin(code){
  if (!firebaseReady || !currentUser) return;
  viewerActive = true; setViewerStatus("connecting"); showViewerOverlay("connecting");
  let meta = null;
  try { const s = await get(ref(db, "rooms/" + code + "/meta")); meta = s.val(); }
  catch { viewerActive = false; toast("Bağlanılamadı."); return go("#/panel"); }
  if (!meta) { viewerActive = false; toast("Oda bulunamadı."); return go("#/panel"); }
  if (meta.live !== true) { viewerActive = false; toast("Yayın şu an kapalı."); return go("#/panel"); }
  liveRoomMeta = meta; currentRoom = code;
  viewerMicStream = null; viewerMicTrack = null;
  const canTalk = !!(meta.voice && meta.viewerMic);
  if (canTalk) { try { viewerMicStream = await getMic(); viewerMicTrack = viewerMicStream.getAudioTracks()[0]; if (viewerMicTrack) viewerMicTrack.enabled = false; } catch { viewerMicTrack = null; } }
  const myRef = push(ref(db, "rooms/" + code + "/viewers"));
  myViewerRef = myRef; myViewerId = myRef.key;
  await set(myRef, { joinedAt: serverTimestamp(), uid: currentUser.uid });
  onDisconnect(myRef).remove();
  const base = "rooms/" + code + "/viewers/" + myViewerId;
  viewerPc = new RTCPeerConnection({ iceServers: getIceServers() });
  bufferInit(viewerPc);
  if (viewerMicTrack) viewerPc.addTrack(viewerMicTrack, viewerMicStream);
  const remoteStream = new MediaStream();
  viewerPc.ontrack = (e) => { remoteStream.addTrack(e.track); const v = el("remoteVideo"); if (v.srcObject !== remoteStream) v.srcObject = remoteStream; v.play && v.play().catch(() => {}); };
  viewerPc.onicecandidate = (e) => { if (e.candidate) push(ref(db, base + "/viewerCandidates"), e.candidate.toJSON()); };
  viewerPc.onconnectionstatechange = () => {
    const st = viewerPc.connectionState;
    if (st === "connected") { setViewerStatus("live"); hideViewerOverlay(); }
    else if (st === "failed") { setViewerStatus("lost"); showViewerOverlay("lost"); }
    else if (st === "disconnected") { setViewerStatus("connecting"); }
  };
  viewerUnsubs.push(onValue(ref(db, base + "/offer"), async (snap) => {
    const offer = snap.val();
    if (offer && !viewerPc.currentRemoteDescription) {
      try { await viewerPc.setRemoteDescription(offer); await flushIce(viewerPc); const ans = await viewerPc.createAnswer(); await viewerPc.setLocalDescription(ans); await set(ref(db, base + "/answer"), { type: ans.type, sdp: ans.sdp }); } catch (e) { console.warn(e); }
    }
  }));
  viewerUnsubs.push(onChildAdded(ref(db, base + "/hostCandidates"), (snap) => addRemoteIce(viewerPc, snap.val())));
  viewerUnsubs.push(onValue(ref(db, "rooms/" + code + "/meta/live"), (snap) => { if (snap.val() !== true) endedByHost(); }));
  setupMicBtn("vwMicBtn", !!viewerMicTrack, canTalk);
  attachChat(code);
}
function endedByHost(){ cleanupViewer(false); setViewerStatus("ended"); showViewerOverlay("ended"); }
function leaveRoom(){ cleanupViewer(true); go("#/panel"); }
function cleanupViewer(removeNode){
  viewerUnsubs.forEach(u => { try { u && u(); } catch {} }); viewerUnsubs = [];
  if (viewerPc) { try { viewerPc.close(); } catch {} viewerPc = null; }
  if (viewerMicStream) { viewerMicStream.getTracks().forEach(t => { try { t.stop(); } catch {} }); viewerMicStream = null; viewerMicTrack = null; }
  if (removeNode && myViewerRef) { try { onDisconnect(myViewerRef).cancel(); } catch {} remove(myViewerRef).catch(() => {}); }
  myViewerRef = null; myViewerId = null; currentRoom = null; viewerActive = false; liveRoomMeta = null;
  detachChat(); closeChat();
  if (el("remoteVideo")) el("remoteVideo").srcObject = null;
}
function setViewerStatus(state){
  const p = el("vStatus"); p.className = "pill";
  if (state === "connecting") { p.classList.add("pill--connecting"); p.textContent = "Bağlanıyor…"; }
  else if (state === "live") { p.classList.add("pill--live"); p.textContent = "Canlı"; }
  else if (state === "lost") { p.classList.add("pill--connecting"); p.textContent = "Bağlantı koptu"; }
  else p.textContent = "Sona erdi";
  el("vLivePill").style.display = state === "live" ? "" : "none";
}
function showViewerOverlay(state){
  const ov = el("viewerOverlay"); ov.hidden = false;
  if (state === "connecting") ov.innerHTML = '<div class="overlay-inner"><div class="spinner"></div><p>Bağlanıyor…</p></div>';
  else if (state === "lost") {
    ov.innerHTML = '<div class="overlay-inner"><span class="glyph glyph--lg">' + BRAND_SVG + '</span><h3>Bağlantı koptu</h3><p>Yayıncıyla bağlantı kesildi.</p><div style="margin-top:18px"><button class="btn btn--soft" id="retryBtn">Yeniden dene</button></div></div>';
    el("retryBtn").onclick = () => { const c = currentRoom; cleanupViewer(true); if (c) joinFromCode(c); };
  } else if (state === "ended") {
    ov.innerHTML = '<div class="overlay-inner"><span class="glyph glyph--lg">' + BRAND_SVG + '</span><h3>Yayın sona erdi</h3><p>Yayıncı yayını kapattı.</p><div style="margin-top:18px"><button class="btn btn--soft" id="homeBtn2">Panele dön</button></div></div>';
    el("homeBtn2").onclick = () => { cleanupViewer(true); go("#/panel"); };
  }
}
function hideViewerOverlay(){ el("viewerOverlay").hidden = true; }

function setupMicBtn(id, hasMic, voiceOn){
  const b = el(id); if (!b) return;
  b.style.display = voiceOn ? "" : "none";
  if (!voiceOn) return;
  b.classList.remove("ctl--active");
  b.innerHTML = SVGS.micOff;
  b.setAttribute("aria-label", hasMic ? "Konuşmak için aç" : "Mikrofon yok");
}
function updateMicBtn(id, on){
  const b = el(id); if (!b) return;
  b.innerHTML = on ? SVGS.micOn : SVGS.micOff;
  b.classList.toggle("ctl--active", on);
  b.setAttribute("aria-label", on ? "Mikrofonu kapat" : "Konuşmak için aç");
}

/* ──────── video kontrolleri ──────── */
function isOverlayUp(stage){ const ov = stage.querySelector(".overlay"); return ov && !ov.hidden; }
function setupAutoHide(stage, controls){
  let t;
  const show = () => { controls.classList.remove("controls--hidden"); clearTimeout(t); t = setTimeout(() => { if (!isOverlayUp(stage)) controls.classList.add("controls--hidden"); }, 2600); };
  stage.addEventListener("mousemove", show);
  stage.addEventListener("touchstart", show, { passive: true });
  stage.addEventListener("mouseleave", () => { if (!isOverlayUp(stage)) { clearTimeout(t); controls.classList.add("controls--hidden"); } });
  show();
}
function toggleFs(stage){ if (document.fullscreenElement) document.exitFullscreen(); else stage.requestFullscreen && stage.requestFullscreen().catch(() => {}); }

/* ──────── onboarding ──────── */
let obStep = 0;
function renderOb(){
  document.querySelectorAll(".slide").forEach(s => s.classList.toggle("on", +s.dataset.step === obStep));
  document.querySelectorAll("#obDots i").forEach((d, i) => d.classList.toggle("on", i === obStep));
  el("obNext").textContent = obStep >= 2 ? "Başla" : "İleri";
}
function obNext(){ if (obStep >= 2) { try { localStorage.setItem("verici_onboarded_" + currentUser.uid, "1"); } catch {} go("#/panel"); } else { obStep++; renderOb(); } }

/* ════════════ BAĞLANTILAR ════════════ */
paintIcons();
el("muteBtn").innerHTML = SVGS.volOff;
el("fitBtn").innerHTML = SVGS.fit;
el("fullBtn").innerHTML = SVGS.full;
el("prevFitBtn").innerHTML = SVGS.fit;
el("prevFullBtn").innerHTML = SVGS.full;
el("vLivePill").style.display = "none";
el("settingsVer").textContent = "v" + APP_VERSION;
el("aboutVer").textContent = "v" + APP_VERSION;

document.querySelectorAll("[data-go]").forEach(n => n.addEventListener("click", (e) => { e.preventDefault(); go(n.getAttribute("data-go")); }));

el("loginBtn").onclick = async () => {
  el("loginErr").textContent = "";
  const email = el("loginEmail").value.trim(), pass = el("loginPass").value;
  if (!email || !pass) { el("loginErr").textContent = "E-posta ve şifre gir."; return; }
  el("loginBtn").disabled = true;
  try { await signInWithEmailAndPassword(auth, email, pass); } catch (e) { el("loginErr").textContent = authError(e.code); }
  el("loginBtn").disabled = false;
};
el("suBtn").onclick = async () => {
  el("suErr").textContent = "";
  const name = el("suName").value.trim(), email = el("suEmail").value.trim(), pass = el("suPass").value;
  if (!email || !pass) { el("suErr").textContent = "E-posta ve şifre gir."; return; }
  el("suBtn").disabled = true;
  try { const cred = await createUserWithEmailAndPassword(auth, email, pass); if (name) { try { await updateProfile(cred.user, { displayName: name }); updateProfileUI(auth.currentUser); } catch {} } }
  catch (e) { el("suErr").textContent = authError(e.code); }
  el("suBtn").disabled = false;
};
el("fpBtn").onclick = async () => {
  el("fpErr").textContent = ""; el("fpOk").textContent = "";
  const email = el("fpEmail").value.trim();
  if (!email) { el("fpErr").textContent = "E-posta gir."; return; }
  el("fpBtn").disabled = true;
  try { await sendPasswordResetEmail(auth, email); el("fpOk").textContent = "Sıfırlama bağlantısı gönderildi. E-postanı kontrol et."; }
  catch (e) { el("fpErr").textContent = authError(e.code); }
  el("fpBtn").disabled = false;
};
document.querySelectorAll("[data-provider]").forEach(btn => btn.addEventListener("click", async () => {
  const provider = btn.getAttribute("data-provider") === "google" ? googleProvider : appleProvider;
  if (!provider) return;
  try { await signInWithPopup(auth, provider); } catch (e) { const msg = authError(e.code); if (msg) toast(msg); }
}));

el("saveNameBtn").onclick = async () => {
  const name = el("nameInput").value.trim();
  if (!auth.currentUser) return;
  el("saveNameBtn").disabled = true;
  try { await updateProfile(auth.currentUser, { displayName: name }); updateProfileUI(auth.currentUser); toast("Ad güncellendi"); } catch { toast("Güncellenemedi"); }
  el("saveNameBtn").disabled = false;
};
el("signoutBtn").onclick = async () => { try { await signOut(auth); } catch {} };
el("saveSettingsBtn").onclick = saveSettings;

el("newRoomBtn").onclick = createRoom;
el("joinBtn").onclick = () => joinFromCode(el("joinInput").value);
el("joinInput").addEventListener("input", (e) => { e.target.value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""); });
el("joinInput").addEventListener("keydown", (e) => { if (e.key === "Enter") joinFromCode(e.target.value); });

el("roomNameSave").onclick = async () => { const code = currentRoomDetail; if (!code) return; const name = el("roomNameInput").value.trim() || ("Oda " + code); await updateRoomMeta(code, { name }); el("roomDetailTitle").textContent = name; toast("Kaydedildi"); };
el("voiceToggle").onchange = async () => { const code = currentRoomDetail; if (!code) return; const on = el("voiceToggle").checked; el("viewerMicToggle").disabled = !on; await updateRoomMeta(code, { voice: on }); };
el("viewerMicToggle").onchange = async () => { const code = currentRoomDetail; if (!code) return; await updateRoomMeta(code, { viewerMic: el("viewerMicToggle").checked }); };
el("roomStartBtn").onclick = () => { const code = currentRoomDetail; if (!code) return; if (isBroadcasting && roomCode === code) return go("#/yayin"); goLive(code); };
el("deleteRoomBtn").onclick = () => { const code = currentRoomDetail; if (!code) return; if (isBroadcasting && roomCode === code) return toast("Önce yayını durdur."); if (confirm("Bu oda kalıcı olarak silinsin mi?")) deleteRoom(code); };
el("roomCopyCode").onclick = () => copyText(currentRoomDetail || "", "Kod kopyalandı");
el("roomCopyLink").onclick = () => copyText(roomLink(currentRoomDetail), "Bağlantı kopyalandı");

el("stopBtn").onclick = () => stopBroadcast(false);
el("leaveBtn").onclick = leaveRoom;
el("copyCodeBtn").onclick = () => copyText(roomCode || "", "Kod kopyalandı");
el("copyLinkBtn").onclick = () => copyText(roomLink(roomCode), "Bağlantı kopyalandı");

el("bcMicBtn").onclick = () => { if (!micTrack) return toast("Mikrofon erişimi yok"); micTrack.enabled = !micTrack.enabled; updateMicBtn("bcMicBtn", micTrack.enabled); };
el("vwMicBtn").onclick = () => { if (!viewerMicTrack) return toast("Mikrofon erişimi yok"); viewerMicTrack.enabled = !viewerMicTrack.enabled; updateMicBtn("vwMicBtn", viewerMicTrack.enabled); };
el("muteBtn").onclick = () => { viewerMuted = !viewerMuted; el("remoteVideo").muted = viewerMuted; el("muteBtn").innerHTML = viewerMuted ? SVGS.volOff : SVGS.volOn; el("muteBtn").setAttribute("aria-label", viewerMuted ? "Sesi aç" : "Sesi kapat"); };
el("fitBtn").onclick = () => el("viewerStage").classList.toggle("stage--cover");
el("prevFitBtn").onclick = () => el("previewStage").classList.toggle("stage--cover");
el("fullBtn").onclick = () => toggleFs(el("viewerStage"));
el("prevFullBtn").onclick = () => toggleFs(el("previewStage"));
document.addEventListener("fullscreenchange", () => { const icon = document.fullscreenElement ? SVGS.exit : SVGS.full; el("fullBtn").innerHTML = icon; el("prevFullBtn").innerHTML = icon; });
setupAutoHide(el("viewerStage"), el("viewerControls"));
setupAutoHide(el("previewStage"), el("previewControls"));
el("obNext").onclick = obNext;

el("bcChatBtn").innerHTML = SVGS.chat;
el("vwChatBtn").innerHTML = SVGS.chat;
el("chatSendBtn").innerHTML = SVGS.send;
el("chatCloseBtn").innerHTML = SVGS.close;
el("chatPipBtn").innerHTML = SVGS.pip;
if ("documentPictureInPicture" in window) el("chatPipBtn").style.display = "";
el("bcChatBtn").onclick = openChat;
el("vwChatBtn").onclick = openChat;
el("chatCloseBtn").onclick = closeChat;
el("chatBackdrop").onclick = closeChat;
el("chatSendBtn").onclick = sendChat;
el("chatPipBtn").onclick = openChatPip;
el("chatInput").addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); sendChat(); } });

const roomParam = new URLSearchParams(location.search).get("room");
if (roomParam) pendingRoom = roomParam;

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").then((reg) => {
      reg.addEventListener("updatefound", () => {
        const nw = reg.installing; if (!nw) return;
        nw.addEventListener("statechange", () => {
          if (nw.state === "installed" && navigator.serviceWorker.controller) {
            el("updateBanner").classList.add("show");
            el("updateBtn").onclick = () => nw.postMessage("skipWaiting");
          }
        });
      });
    }).catch(() => {});
    let refreshing = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => { if (refreshing) return; refreshing = true; location.reload(); });
  });
}
</script>
</body>
</html>
