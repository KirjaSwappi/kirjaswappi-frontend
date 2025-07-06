# 🌐 i18n Setup in React using `.properties` Files (No JSON)

This guide demonstrates how to implement internationalization (i18n) in a React + Vite application using `i18next` and `react-i18next` — without using JSON translation files. Instead, it uses `.properties` files (`key=value` format), a widely adopted format in Java/Spring environments. This approach offers a backend-friendly, flat structure that’s easy to maintain and read.

To implement this:

First, install the required packages:

```bash
npm install i18next react-i18next
```

Then, create a `.properties` file for your translations. For example, create `src/locales/en.properties` with the following content:

```properties
email=Email Address
home.name=Homepage Name
home.welcome=Welcome to the homepage
```

Next, write a simple parser to convert the raw `.properties` content into a flat object that `i18next` can use. Create a file called `src/i18n/parseProperties.ts`:

```ts
export function parsePropertiesString(str: string): Record<string, string> {
  const result: Record<string, string> = {};
  const lines = str.split(/\r?\n/);

  for (let line of lines) {
    line = line.trim();
    if (!line || line.startsWith('#')) continue;

    const [key, ...valueParts] = line.split('=');
    if (!key || valueParts.length === 0) continue;

    result[key.trim()] = valueParts.join('=').trim();
  }

  return result;
}
```

Now, initialize `i18next` using this parsed object. Create a file called `src/i18n/index.ts`:

```ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { parsePropertiesString } from './parseProperties';
import enRaw from '../locales/en.properties?raw';

const en = parsePropertiesString(enRaw);

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
```

In your application entry point (e.g. `main.tsx`), import this config:

```ts
import './i18n';
```

Now, you can use the `useTranslation()` hook in any component. Example `App.tsx`:

```tsx
import { useTranslation } from 'react-i18next';

export default function App() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('home.name')}</h1>
      <p>{t('email')}</p>
    </div>
  );
}
```

This will render:

```
Homepage Name
Email Address
```

To support additional languages, you can add more `.properties` files like `src/locales/de.properties`:

```properties
email=E-Mail-Adresse
home.name=Startseite Name
home.welcome=Willkommen auf der Startseite
```

Then, in `index.ts`, import and parse it the same way:

```ts
import deRaw from '../locales/de.properties?raw';
const de = parsePropertiesString(deRaw);
```

And add it to the resources:

```ts
resources: {
  en: { translation: en },
  de: { translation: de },
}
```

You can switch languages in your app at runtime using:

```ts
i18n.changeLanguage('de');
```

This setup gives you full i18n support using clean, flat `.properties` files without JSON. It supports dot-notation keys (e.g. `form.email.label`) and is ideal for projects that share translations with Java/Spring backends or teams that prefer `.properties` format.

Your project structure should look something like this:

```
src/
├── locales/
│   ├── en.properties
│   └── de.properties
├── i18n/
│   ├── index.ts
│   └── parseProperties.ts
├── App.tsx
└── main.tsx
```

This solution is fully static (no async loading), Vite-native, and easy to extend. You can later integrate namespaces, pluralization, or async file loading with `i18next-http-backend` if needed.

You're now ready to use `.properties`-based i18n in your React + Vite app — no JSON required.
