---
title: "DefinitelyTyped-ga hissa qo'shdim"
description: "Men asterisk-managerning type definitionlarini yozib chiqdim"
date: "Feb 25 2025"
---

## DefinitelyTyped-ga qanday hissa qo‘shdim?

Salom, hammaga! Men 2023-yildan beri Asterisk bilan muntazam ishlayman va TypeScript-ni juda yaxshi ko‘raman. Asterisk bilan Node.js orqali integratsiya qilish uchun eng yaxshi kutubxonalardan biri bu [asterisk-manager](https://www.npmjs.com/package/asterisk-manager) deb hisoblayman. Garchi kutubxona ancha eski bo‘lsa ham, u menga juda yoqadi va doim ishlataman.

Biroq, bitta muammo bor edi: **unda TypeScript type definitionlar yo‘q edi!** Bu esa TypeScript muhitida ishlashni ancha noqulay qilardi. Nihoyat, 2025-yilda vaqt topib, ushbu kutubxona uchun type definitionlarni yozishga qaror qildim. Salkam bir hafta ichida to‘liq TypeScript type definitionlarni yozib chiqdim va **DefinitelyTyped-ga o‘z hissamni qo‘shdim!** 🚀

### Pull Request va NPM paketi

Agar sizda biror taklif yoki muammo bo‘lsa, ushbu yerdan **[pull request](https://github.com/uchkunrakhimow/NodeJS-AsteriskManager)** ochishingiz mumkin.

Tayyor TypeScript type definitionlarni **[NPM orqali ko‘rishingiz va yuklab olishingiz](https://www.npmjs.com/package/@types/asterisk-manager)** mumkin.

---

## TypeScript type definition kodi

Quyida men yozgan type definition kodining asosiy qismi keltirilgan:

```typescript
import { EventEmitter } from "events";

interface ManagerOptions {
  port: number;
  host?: string;
  username?: string;
  password?: string;
  events?: boolean;
}

interface BaseAction {
  action: string;
  actionid?: string;
}

interface LoginAction extends BaseAction {
  action: "login";
  username: string;
  secret: string;
  events?: "on" | "off";
}

interface PingAction extends BaseAction {
  action: "ping";
}

type ManagerAction =
  | LoginAction
  | PingAction
  | { action: string; [key: string]: any };

type ActionCallback<T = any> = (err?: Error | null, response?: T) => void;

interface ManagerEvents {
  connect(): void;
  close(): void;
  end(): void;
  error(err: Error): void;
  rawevent(event: any): void;
  response(response: any): void;
}

declare class Manager extends EventEmitter {
  constructor(
    port: number,
    host?: string,
    username?: string,
    password?: string,
    events?: boolean
  );

  options: ManagerOptions;

  connect(port: number, host: string, callback?: () => void): void;
  keepConnected(): void;
  login(
    username: string,
    password: string,
    events?: boolean,
    callback?: ActionCallback
  ): void;
  action<T = any>(action: ManagerAction, callback?: ActionCallback<T>): string;
  disconnect(callback?: () => void): void;
  isConnected(): boolean;
  connected(): boolean;

  on<E extends keyof ManagerEvents>(event: E, listener: ManagerEvents[E]): this;
  emit<E extends keyof ManagerEvents>(
    event: E,
    ...args: Parameters<ManagerEvents[E]>
  ): boolean;
}

declare function ManagerFactory(
  port: number,
  host?: string,
  username?: string,
  password?: string,
  events?: boolean
): Manager;

export = ManagerFactory;
```

---

### Xulosa

Ushbu tajriba menga **DefinitelyTyped** ekotizimida qanday ishlashni o‘rganishga va TypeScript hamjamiyatiga o‘z hissamni qo‘shishga yordam berdi. Agar siz ham o‘zingiz yoqtirgan kutubxonalarga TypeScript uchun type definition yozmoqchi bo‘lsangiz, ikkilanmang!
