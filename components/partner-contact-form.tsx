"use client";

import {useState, type FormEvent} from "react";
import {Send, X} from "lucide-react";
import {DialogClose, DialogContent, DialogDescription, DialogTitle} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Label} from "@/components/ui/label";
import {NativeSelect, NativeSelectOption} from "@/components/ui/native-select";

const recipients = ["Dombrovlad@4meds.ru", "Valikova@4meds.ru"];
const directions = ["Интеграции в контент", "Образовательные проекты", "Лицензирование и мерч", "Запрос СМИ", "Другая идея"];

export default function PartnerContactForm({direction}: {direction:string}) {
  const [error,setError] = useState("");

  function validate(event:FormEvent<HTMLFormElement>) {
    const form=event.currentTarget;
    const data=new FormData(form);
    const name=String(data.get("name")||"").trim();
    const email=String(data.get("email")||"").trim();
    const contact=String(data.get("contact")||"").trim();
    if(!name || (!email && !contact)) {
      event.preventDefault();
      setError(!name ? "Укажите, как к вам обращаться" : "Укажите email, Telegram или телефон, чтобы мы могли ответить");
      const field=form.elements.namedItem(!name ? "name" : "email");
      if(field instanceof HTMLInputElement) field.focus();
    }
  }

  return <DialogContent className="partner-dialog" showCloseButton={false}>
    <DialogClose className="partner-dialog-close" aria-label="Закрыть форму"><X size={22}/></DialogClose>
    <div>
      <span className="eyebrow">СОЗДАДИМ ИСТОРИЮ ВМЕСТЕ</span>
      <DialogTitle>Станьте партнёром «Наноботов»</DialogTitle>
      <DialogDescription>Расскажите о вашей идее — вместе подберём формат сотрудничества</DialogDescription>
    </div>
    <form className="partner-form ym-disable-keys" action={`https://formsubmit.co/${recipients[0]}`} method="POST" acceptCharset="UTF-8" onSubmit={validate} onInput={()=>error&&setError("")}>
      <input type="hidden" name="_cc" value={recipients[1]}/>
      <input type="hidden" name="_subject" value="Наноботы — новая заявка на сотрудничество"/>
      <input type="hidden" name="_template" value="table"/>
      <input type="text" name="_honey" className="partner-honeypot" tabIndex={-1} autoComplete="off" aria-hidden="true"/>

      <div className="partner-field"><Label htmlFor="partner-direction">Направление</Label><NativeSelect id="partner-direction" name="direction" defaultValue={direction}>{directions.map(value=><NativeSelectOption key={value} value={value}>{value}</NativeSelectOption>)}</NativeSelect></div>
      <div className="partner-field"><Label htmlFor="partner-name">Ваше имя *</Label><Input id="partner-name" name="name" required maxLength={120} autoComplete="name"/></div>
      <fieldset className="partner-contacts"><legend>Как с вами связаться *</legend><p id="partner-contact-hint">Достаточно одного способа связи</p><div className="partner-field-pair">
        <div className="partner-field"><Label htmlFor="partner-email">Email</Label><Input id="partner-email" name="email" type="email" maxLength={254} autoComplete="email" aria-describedby="partner-contact-hint partner-form-error"/></div>
        <div className="partner-field"><Label htmlFor="partner-contact">Telegram или телефон</Label><Input id="partner-contact" name="contact" maxLength={100} placeholder="@username или +7…" aria-describedby="partner-contact-hint partner-form-error"/></div>
      </div></fieldset>
      <div className="partner-field"><Label htmlFor="partner-company">Компания <span>необязательно</span></Label><Input id="partner-company" name="company" maxLength={200} autoComplete="organization"/></div>
      <div className="partner-field"><Label htmlFor="partner-message">Ваша идея <span>необязательно</span></Label><Textarea id="partner-message" name="message" maxLength={4000} rows={3} placeholder="Что хотите сделать вместе с Наноботами?"/></div>
      <p id="partner-form-error" role="alert" className="partner-form-error">{error}</p>
      <p className="partner-data-note">Отправляя заявку, вы передаёте указанные данные ООО «4МЕДС» для ответа на ваше обращение. Доставку письма обеспечивает FormSubmit.</p>
      <button type="submit" className="cta partner-submit">Отправить заявку<Send size={17} aria-hidden="true"/></button>
      <p className="partner-direct">Можно написать напрямую: <a href={`mailto:${recipients.join(",")}`}>открыть письмо команде</a></p>
    </form>
  </DialogContent>;
}
