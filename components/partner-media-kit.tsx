"use client";

import {useState} from "react";
import {Dialog} from "@/components/ui/dialog";
import PartnerContactForm from "@/components/partner-contact-form";
import {ArrowUpRight,BookOpen,Film,Users} from "lucide-react";
import {socials} from "@/lib/content";

// Source: Pitch_21.09_v01.pptx, supplied by the project team (September 2026).
// These presentation totals cover all platforms, unlike the live API statistics.
const formats = [
  {icon:Film,title:"Интеграции в контент",action:"Хочу сотрудничать",text:"Нативные упоминания, продакт-плейсмент и брендированные спецвыпуски с медицинской валидацией."},
  {icon:BookOpen,title:"Образовательные проекты",action:"Хочу участвовать",text:"Совместные уроки, мастер-классы и ролики для клиник, школ и городских фестивалей."},
  {icon:Users,title:"Лицензирование и мерч",action:"Хочу сотрудничать",text:"Любимые герои для игрушек, коллабораций и брендированной продукции."},
];

export default function PartnerMediaKit(){
  const [contactDirection,setContactDirection] = useState<string|null>(null);
  return <><section id="partners" aria-labelledby="partners-title">
    <div className="media-kit">
      <div className="media-kit-intro">
        <div>
          <span className="eyebrow">ПАРТНЁРАМ · МЕДИАКИТ</span>
          <h2 id="partners-title">Давайте делать<br/>науку ближе</h2>
          <p>«Наноботы» — анимационная вселенная о теле и здоровье от студии ООО «4МЕДС». Объясняем сложное через юмор, приключения и любимых героев.</p>
        </div>
        <dl className="media-kit-facts">
          <div><dt>Для кого</dt><dd>Дети 6–12 лет и их родители<span>Ядро аудитории · семейный просмотр</span></dd></div>
          <div><dt>Формат</dt><dd>Вертикальные ролики 30–60 секунд<span>Анимационный сериал — в разработке</span></dd></div>
          <div><dt>Подход</dt><dd>Наука, которой можно доверять<span>Медицинская и научная валидация сюжетов</span></dd></div>
        </dl>
      </div>

      <div className="media-kit-reach" aria-label="Охваты по данным презентации проекта">
        <div><strong>50 млн+</strong><span>просмотров контента</span></div>
        <div><strong>70 000</strong><span>подписчиков на площадках</span></div>
        <div><strong>7</strong><span>онлайн-платформ</span></div>
      </div>
      <p className="media-kit-source">Совокупные показатели по данным презентации проекта · сентябрь 2026.</p>
      <div className="media-kit-platforms" aria-label="Площадки проекта">
        {socials.filter(s=>s.name!=="Instagram").map(s=><a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer">{s.name}<ArrowUpRight size={13} aria-hidden="true"/></a>)}
      </div>

      <h3 id="collaborate" className="media-kit-formats-title" tabIndex={-1}>Создадим историю вместе</h3>
      <div className="media-kit-formats">
        {formats.map(({icon:Icon,title,text,action})=><article key={title}><Icon size={26} aria-hidden="true"/><h4>{title}</h4><p>{text}</p><button type="button" className="partner-action" onClick={()=>setContactDirection(title)} aria-label={`${action}: ${title}`}>{action}<ArrowUpRight size={17} aria-hidden="true"/></button></article>)}
      </div>
      <div className="media-kit-press"><strong>Для СМИ</strong><p>Готовые инфоповоды, экспертные комментарии и знакомство с героями и создателями проекта.</p><button type="button" className="text-link" onClick={()=>setContactDirection("Запрос СМИ")}>Написать нам</button></div>

      <div className="media-kit-contact">
        <div><h3>Есть идея? Давайте обсудим</h3><p>Подберём формат сотрудничества под ваши задачи</p></div>
        <button type="button" className="cta" onClick={()=>setContactDirection("Другая идея")}>Обсудить сотрудничество<ArrowUpRight size={18} aria-hidden="true"/></button>
      </div>
    </div>
  </section><Dialog open={contactDirection!==null} onOpenChange={open=>!open&&setContactDirection(null)}>{contactDirection!==null&&<PartnerContactForm key={contactDirection} direction={contactDirection}/>}</Dialog></>;
}
