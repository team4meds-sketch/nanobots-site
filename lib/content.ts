export type Entry={id:string;kind:"episode"|"news";title:string;summary:string;body:string;cover:string;video_url:string;published:number;date:string;revision:number};
export const socials=[
{name:"VK Видео",url:"https://vk.ru/nanobotsmult",short:"VK",color:"#087bfa"},
{name:"RUTUBE",url:"https://rutube.ru/channel/68047778",short:"RU",color:"#19213a"},
{name:"YouTube",url:"https://youtube.com/@nanobots_mult",short:"▶",color:"#e92835"},
{name:"Telegram",url:"https://t.me/nanobots_mult",short:"TG",color:"#168ebc"},
{name:"TikTok",url:"https://www.tiktok.com/@nanobots_mult1",short:"TK",color:"#182344"},
{name:"Likee",url:"https://l.likee.video/p/8qpTgD",short:"L",color:"#d43b80"},
{name:"Instagram",url:"https://www.instagram.com/nanobots_mult",short:"IG",color:"#b52f7f"},
{name:"MAX",url:"https://max.ru/channel_id5040174570_biz",short:"M",color:"#5751df"}];
export const characters=[
{name:"Вектор",key:"vector",role:"Лидер и аналитик",text:"Собирает команду и помогает разобраться в самых сложных задачах.",color:"#078d85",box:[1333,1536,63,123,262,571]},
{name:"Эндо",key:"endo",role:"Смелый исследователь",text:"Первым отправляется навстречу приключениям и всегда готов помочь друзьям.",color:"#008cc9",box:[1536,1345,37,100,337,505]},
{name:"Микра",key:"mikra",role:"Изобретатель и техник",text:"Замечает важные детали, изучает находки и придумывает решения.",color:"#d82878",box:[1536,1427,75,119,258,520]},
{name:"Люкси",key:"luksi",role:"Любопытная и находчивая",text:"Задаёт вопросы, подмечает необычное и делится открытиями.",color:"#8b50ae",box:[1536,1433,45,119,303,502]},
{name:"Омни",key:"omni",role:"Сильный и добрый защитник",text:"Поддерживает друзей и приходит на помощь, когда нужна сила всей команды.",color:"#bf8200",box:[1536,1069,30,70,335,360]}];
export const organs=[
{key:"heart",title:"Сердце",label:"Сердце и кровь",image:"/art/heart.jpg",text:"Сердце работает как насос: отправляет кровь по сосудам. Вместе с кровью клетки получают кислород и питательные вещества.",x:48,y:35},
{key:"brain",title:"Мозг",label:"Мозг и нервы",image:"/art/brain.png",text:"Нервные клетки передают сигналы. Благодаря их работе мы чувствуем, двигаемся, учимся и запоминаем новое.",x:48,y:11},
{key:"teeth",title:"Зубы",label:"Зубы",image:"/art/teeth.jpg",text:"Зубы помогают откусывать и измельчать пищу. Наноботы отправляются в путешествие, чтобы узнать, что происходит у нас во рту.",x:48,y:19},
{key:"skin",title:"Кожа",label:"Кожа",image:"/art/skin.png",text:"Кожа отделяет внутренний мир тела от внешнего. Она помогает чувствовать прикосновения и участвует в регулировании температуры.",x:75,y:51}];
